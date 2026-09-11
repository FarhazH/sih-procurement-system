from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func as sqlfunc, text
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import requests
import os

from database import engine, get_db, Base
from models import User, Slot, Booking, Waitlist, Notification, Centre
from auth import hash_password, verify_password, create_access_token, decode_access_token


# =========================================================
# DATABASE + APP
# =========================================================

Base.metadata.create_all(bind=engine)

app = FastAPI(title="SIH Procurement System API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# REQUEST MODELS
# =========================================================

class RegisterRequest(BaseModel):
    name: str
    phone: str
    password: str
    role: str = "farmer"
    village: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = "Rajasthan"
    address: Optional[str] = None
    preferred_language: Optional[str] = "en"


class LoginRequest(BaseModel):
    phone: str
    password: str


class SlotCreate(BaseModel):
    centre_id: int
    date: str
    time_window: str
    general_capacity: int
    priority_capacity: int


class BookRequest(BaseModel):
    user_id: int
    slot_id: int
    crop_type: Optional[str] = None
    quantity: Optional[int] = None


class StatusUpdate(BaseModel):
    status: str


class PaymentUpdate(BaseModel):
    payment_status: str
    payment_method: Optional[str] = None
    transaction_id: Optional[str] = None


class CentreCreate(BaseModel):
    name: str
    address: Optional[str] = None


# =========================================================
# ADMIN AUTH
# =========================================================

def require_admin(
    authorization: str = Header(...),
    db: Session = Depends(get_db)
):
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Missing or invalid token"
        )

    token = authorization.replace("Bearer ", "")
    payload = decode_access_token(token)

    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    if payload.get("role") != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    return payload


# =========================================================
# BASIC ROUTE
# =========================================================

@app.get("/")
def home():
    return {
        "message": "SIH Procurement System API is running",
        "status": "success"
    }


# =========================================================
# REGISTER
# =========================================================

@app.post("/register")
def register(
    data: RegisterRequest,
    db: Session = Depends(get_db)
):
    existing = db.query(User).filter(
        User.phone == data.phone
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Phone number already registered"
        )

    new_user = User(
        name=data.name,
        phone=data.phone,
        password_hash=hash_password(data.password),
        role=data.role,
        village=data.village,
        district=data.district
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # New profile fields are updated using SQL
    db.execute(
        text("""
            UPDATE users
            SET state = :state,
                address = :address,
                preferred_language = :language
            WHERE id = :id
        """),
        {
            "id": new_user.id,
            "state": data.state,
            "address": data.address,
            "language": data.preferred_language
        }
    )

    db.commit()

    return {
        "message": "Registered successfully",
        "user_id": new_user.id,
        "farmer_registration_id": f"RJ-UDR-{new_user.id:04d}"
    }


# =========================================================
# LOGIN
# =========================================================

@app.post("/login")
def login(
    data: LoginRequest,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.phone == data.phone
    ).first()

    if not user or not verify_password(
        data.password,
        user.password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid phone or password"
        )

    token = create_access_token({
        "user_id": user.id,
        "role": user.role
    })

    return {
        "message": "Login successful",
        "access_token": token,
        "user_id": user.id,
        "role": user.role
    }


# =========================================================
# FARMER PROFILE
# =========================================================

@app.get("/profile/{user_id}")
def get_profile(
    user_id: int,
    db: Session = Depends(get_db)
):
    user = db.query(User).get(user_id)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    result = db.execute(
        text("""
            SELECT
                id,
                name,
                phone,
                role,
                village,
                district,
                state,
                address,
                farmer_registration_id,
                preferred_language,
                missed_count,
                created_at
            FROM users
            WHERE id = :id
        """),
        {"id": user_id}
    ).mappings().first()

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Profile not found"
        )

    return dict(result)


# =========================================================
# SLOTS
# =========================================================

@app.get("/slots")
def get_slots(
    db: Session = Depends(get_db)
):
    slots = db.query(Slot).all()

    result = []

    for s in slots:

        centre = db.query(Centre).get(s.centre_id)

        status = db.execute(
            text("""
                SELECT status
                FROM slots
                WHERE id = :id
            """),
            {"id": s.id}
        ).scalar()

        result.append({
            "id": s.id,
            "centre_id": s.centre_id,
            "centre_name": centre.name if centre else None,
            "centre_address": centre.address if centre else None,
            "latitude": centre.latitude if centre else None,
            "longitude": centre.longitude if centre else None,
            "date": s.date,
            "time_window": s.time_window,
            "general_capacity": s.general_capacity,
            "general_booked": s.general_booked,
            "priority_capacity": s.priority_capacity,
            "priority_booked": s.priority_booked,
            "status": status or "Available"
        })

    return result


# =========================================================
# CREATE SLOT - ADMIN
# =========================================================

@app.post("/create-slot")
def create_slot(
    data: SlotCreate,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    centre = db.query(Centre).get(data.centre_id)

    if not centre:
        raise HTTPException(
            status_code=404,
            detail="Centre not found"
        )

    new_slot = Slot(
        centre_id=data.centre_id,
        date=data.date,
        time_window=data.time_window,
        general_capacity=data.general_capacity,
        general_booked=0,
        priority_capacity=data.priority_capacity,
        priority_booked=0
    )

    db.add(new_slot)
    db.commit()
    db.refresh(new_slot)

    db.execute(
        text("""
            UPDATE slots
            SET status = 'Available',
                created_at = CURRENT_TIMESTAMP
            WHERE id = :id
        """),
        {"id": new_slot.id}
    )

    db.commit()

    return {
        "message": "Slot created",
        "slot_id": new_slot.id
    }

    # =========================================================
# BOOK SLOT
# =========================================================

@app.post("/book")
def book_slot(
    data: BookRequest,
    db: Session = Depends(get_db)
):
    user = db.query(User).get(data.user_id)
    slot = db.query(Slot).get(data.slot_id)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if not slot:
        raise HTTPException(
            status_code=404,
            detail="Slot not found"
        )

    # Check slot status
    slot_status = db.execute(
        text("""
            SELECT status
            FROM slots
            WHERE id = :id
        """),
        {"id": slot.id}
    ).scalar()

    if slot_status == "Cancelled":
        raise HTTPException(
            status_code=400,
            detail="This slot is cancelled"
        )

    # Check existing booking
    existing = db.query(Booking).filter(
        Booking.user_id == data.user_id,
        Booking.slot_id == data.slot_id
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Already booked this slot"
        )

    # -------------------------
    # GENERAL POOL
    # -------------------------

    if slot.general_booked < slot.general_capacity:

        slot.general_booked += 1

        new_booking = Booking(
            user_id=data.user_id,
            slot_id=data.slot_id,
            pool_type="general",
            crop_type=data.crop_type,
            quantity=data.quantity,
            status="Confirmed",
            payment_status="Pending"
        )

        user.missed_count = 0

        db.add(new_booking)
        db.commit()
        db.refresh(new_booking)

        # Notification
        db.add(
            Notification(
                user_id=user.id,
                message=f"Your booking #{new_booking.id} has been confirmed."
            )
        )

        db.commit()

        return {
            "message": "Booking confirmed",
            "booking_id": new_booking.id,
            "pool_type": "general",
            "status": "Confirmed"
        }

    # -------------------------
    # PRIORITY POOL
    # -------------------------

    elif (
        slot.priority_booked < slot.priority_capacity
        and user.missed_count >= 1
    ):

        slot.priority_booked += 1

        new_booking = Booking(
            user_id=data.user_id,
            slot_id=data.slot_id,
            pool_type="priority",
            crop_type=data.crop_type,
            quantity=data.quantity,
            status="Confirmed",
            payment_status="Pending"
        )

        user.missed_count = 0

        db.add(new_booking)
        db.commit()
        db.refresh(new_booking)

        db.add(
            Notification(
                user_id=user.id,
                message=f"Your priority booking #{new_booking.id} has been confirmed."
            )
        )

        db.commit()

        return {
            "message": "Booking confirmed",
            "booking_id": new_booking.id,
            "pool_type": "priority",
            "status": "Confirmed"
        }

    # -------------------------
    # WAITLIST
    # -------------------------

    else:

        position = (
            db.query(Waitlist)
            .filter_by(slot_id=data.slot_id)
            .count()
            + 1
        )

        new_wait = Waitlist(
            user_id=data.user_id,
            slot_id=data.slot_id,
            position=position,
            notified=False
        )

        db.add(new_wait)
        db.commit()

        db.add(
            Notification(
                user_id=user.id,
                message=f"Slot is full. You are added to waitlist at position {position}."
            )
        )

        db.commit()

        return {
            "message": "Slot full, added to waitlist",
            "waitlist_position": position
        }


# =========================================================
# MY BOOKINGS
# =========================================================

@app.get("/bookings/{user_id}")
def get_my_bookings(
    user_id: int,
    db: Session = Depends(get_db)
):
    bookings = (
        db.query(Booking)
        .filter(Booking.user_id == user_id)
        .order_by(Booking.created_at.desc())
        .all()
    )

    result = []

    for booking in bookings:

        slot = db.query(Slot).get(booking.slot_id)

        centre = None

        if slot:
            centre = db.query(Centre).get(slot.centre_id)

        result.append({
            "booking_id": booking.id,
            "slot_id": booking.slot_id,
            "centre_name": centre.name if centre else None,
            "centre_address": centre.address if centre else None,
            "date": slot.date if slot else None,
            "time_window": slot.time_window if slot else None,
            "crop_type": booking.crop_type,
            "quantity": booking.quantity,
            "pool_type": booking.pool_type,
            "status": booking.status,
            "payment_status": booking.payment_status,
            "created_at": booking.created_at
        })

    return result


# =========================================================
# QUEUE
# =========================================================

@app.get("/queue/{slot_id}")
def get_queue(
    slot_id: int,
    db: Session = Depends(get_db)
):

    bookings = (
        db.query(Booking)
        .filter(
            Booking.slot_id == slot_id,
            Booking.status != "Cancelled"
        )
        .order_by(Booking.created_at)
        .all()
    )

    result = []

    for index, booking in enumerate(bookings):

        result.append({
            "booking_id": booking.id,
            "user_id": booking.user_id,
            "queue_position": index + 1,
            "status": booking.status,
            "crop_type": booking.crop_type,
            "quantity": booking.quantity,
            "pool_type": booking.pool_type
        })

    return result


# =========================================================
# WAITLIST
# =========================================================

@app.get("/waitlist/{user_id}")
def get_waitlist(
    user_id: int,
    db: Session = Depends(get_db)
):

    waitlist = (
        db.query(Waitlist)
        .filter(Waitlist.user_id == user_id)
        .order_by(Waitlist.created_at.desc())
        .all()
    )

    result = []

    for item in waitlist:

        slot = db.query(Slot).get(item.slot_id)

        result.append({
            "waitlist_id": item.id,
            "slot_id": item.slot_id,
            "position": item.position,
            "notified": item.notified,
            "date": slot.date if slot else None,
            "time_window": slot.time_window if slot else None
        })

    return result


# =========================================================
# UPDATE BOOKING STATUS - ADMIN
# =========================================================

@app.put("/update-status/{booking_id}")
def update_status(
    booking_id: int,
    data: StatusUpdate,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):

    booking = db.query(Booking).get(booking_id)

    if not booking:
        raise HTTPException(
            status_code=404,
            detail="Booking not found"
        )

    booking.status = data.status

    db.add(
        Notification(
            user_id=booking.user_id,
            message=f"Your booking #{booking.id} status is now {data.status}."
        )
    )

    db.commit()

    return {
        "message": "Status updated",
        "booking_id": booking.id,
        "new_status": booking.status
    }


# =========================================================
# CANCEL BOOKING
# =========================================================

@app.delete("/cancel/{booking_id}")
def cancel_booking(
    booking_id: int,
    db: Session = Depends(get_db)
):

    booking = db.query(Booking).get(booking_id)

    if not booking:
        raise HTTPException(
            status_code=404,
            detail="Booking not found"
        )

    if booking.status == "Cancelled":
        raise HTTPException(
            status_code=400,
            detail="Booking already cancelled"
        )

    slot = db.query(Slot).get(booking.slot_id)

    if not slot:
        raise HTTPException(
            status_code=404,
            detail="Slot not found"
        )

    # Reduce booked count
    if booking.pool_type == "general":
        if slot.general_booked > 0:
            slot.general_booked -= 1
    else:
        if slot.priority_booked > 0:
            slot.priority_booked -= 1

    booking.status = "Cancelled"

    # New lifecycle fields
    db.execute(
        text("""
            UPDATE bookings
            SET cancelled_at = CURRENT_TIMESTAMP,
                updated_at = CURRENT_TIMESTAMP,
                cancellation_reason = 'Cancelled by farmer'
            WHERE id = :id
        """),
        {"id": booking.id}
    )

    # Notify farmer
    db.add(
        Notification(
            user_id=booking.user_id,
            message=f"Your booking #{booking.id} has been cancelled."
        )
    )

    db.commit()

    # Promote first waitlisted farmer
    next_in_line = (
        db.query(Waitlist)
        .filter_by(slot_id=slot.id)
        .order_by(Waitlist.position)
        .first()
    )

    if next_in_line:

        pool = "general"

        if slot.general_booked >= slot.general_capacity:
            if slot.priority_booked < slot.priority_capacity:
                pool = "priority"
            else:
                return {
                    "message": "Booking cancelled. Waitlist remains."
                }

        new_booking = Booking(
            user_id=next_in_line.user_id,
            slot_id=slot.id,
            pool_type=pool,
            status="Confirmed",
            payment_status="Pending"
        )

        if pool == "general":
            slot.general_booked += 1
        else:
            slot.priority_booked += 1

        db.add(new_booking)

        promoted_user = next_in_line.user_id

        db.delete(next_in_line)

        db.add(
            Notification(
                user_id=promoted_user,
                message="Good news! A slot became available and your waitlist booking is now confirmed."
            )
        )

        db.commit()

        return {
            "message": "Booking cancelled. Next waitlisted farmer auto-confirmed.",
            "promoted_user_id": promoted_user
        }

    return {
        "message": "Booking cancelled. No one on waitlist."
    }

    # =========================================================
# PAYMENT DETAILS
# =========================================================

@app.get("/payments/{user_id}")
def get_payments(
    user_id: int,
    db: Session = Depends(get_db)
):
    payments = db.execute(
        text("""
            SELECT
                p.id,
                p.booking_id,
                p.amount,
                p.payment_method,
                p.transaction_id,
                p.payment_status,
                p.paid_at,
                p.created_at
            FROM payments p
            WHERE p.user_id = :user_id
            ORDER BY p.created_at DESC
        """),
        {"user_id": user_id}
    ).mappings().all()

    return [dict(payment) for payment in payments]


# =========================================================
# UPDATE PAYMENT - ADMIN
# =========================================================

@app.put("/update-payment/{booking_id}")
def update_payment(
    booking_id: int,
    data: PaymentUpdate,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):

    booking = db.query(Booking).get(booking_id)

    if not booking:
        raise HTTPException(
            status_code=404,
            detail="Booking not found"
        )

    booking.payment_status = data.payment_status

    # Check existing payment
    payment = db.execute(
        text("""
            SELECT id
            FROM payments
            WHERE booking_id = :booking_id
            LIMIT 1
        """),
        {"booking_id": booking_id}
    ).fetchone()

    if payment:

        db.execute(
            text("""
                UPDATE payments
                SET payment_status = :status,
                    payment_method = :method,
                    transaction_id = :transaction_id,
                    paid_at = CASE
                        WHEN :status = 'Paid'
                        THEN CURRENT_TIMESTAMP
                        ELSE paid_at
                    END
                WHERE booking_id = :booking_id
            """),
            {
                "booking_id": booking_id,
                "status": data.payment_status,
                "method": data.payment_method,
                "transaction_id": data.transaction_id
            }
        )

    else:

        amount = (booking.quantity or 0) * 50

        db.execute(
            text("""
                INSERT INTO payments
                (
                    booking_id,
                    user_id,
                    amount,
                    payment_method,
                    transaction_id,
                    payment_status,
                    paid_at
                )
                VALUES
                (
                    :booking_id,
                    :user_id,
                    :amount,
                    :method,
                    :transaction_id,
                    :status,
                    CASE
                        WHEN :status = 'Paid'
                        THEN CURRENT_TIMESTAMP
                        ELSE NULL
                    END
                )
            """),
            {
                "booking_id": booking_id,
                "user_id": booking.user_id,
                "amount": amount,
                "method": data.payment_method,
                "transaction_id": data.transaction_id,
                "status": data.payment_status
            }
        )

    db.add(
        Notification(
            user_id=booking.user_id,
            message=f"Payment status for booking #{booking.id}: {data.payment_status}"
        )
    )

    db.commit()

    return {
        "message": "Payment updated",
        "booking_id": booking.id,
        "payment_status": data.payment_status
    }


# =========================================================
# PROCUREMENT DETAILS
# =========================================================

@app.get("/procurements/{user_id}")
def get_procurements(
    user_id: int,
    db: Session = Depends(get_db)
):

    procurements = db.execute(
        text("""
            SELECT
                p.id,
                p.booking_id,
                p.centre_id,
                c.name AS centre_name,
                p.slot_id,
                p.crop_type,
                p.quantity,
                p.final_status,
                p.procured_at,
                p.created_at
            FROM procurements p
            LEFT JOIN centres c
                ON c.id = p.centre_id
            WHERE p.user_id = :user_id
            ORDER BY p.created_at DESC
        """),
        {"user_id": user_id}
    ).mappings().all()

    return [dict(item) for item in procurements]


# =========================================================
# CREATE PROCUREMENT - ADMIN
# =========================================================

@app.post("/procurement/{booking_id}")
def create_procurement(
    booking_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):

    booking = db.query(Booking).get(booking_id)

    if not booking:
        raise HTTPException(
            status_code=404,
            detail="Booking not found"
        )

    slot = db.query(Slot).get(booking.slot_id)

    if not slot:
        raise HTTPException(
            status_code=404,
            detail="Slot not found"
        )

    existing = db.execute(
        text("""
            SELECT id
            FROM procurements
            WHERE booking_id = :booking_id
            LIMIT 1
        """),
        {"booking_id": booking_id}
    ).fetchone()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Procurement already exists"
        )

    db.execute(
        text("""
            INSERT INTO procurements
            (
                booking_id,
                user_id,
                centre_id,
                slot_id,
                crop_type,
                quantity,
                final_status,
                procured_at
            )
            VALUES
            (
                :booking_id,
                :user_id,
                :centre_id,
                :slot_id,
                :crop_type,
                :quantity,
                'Completed',
                CURRENT_TIMESTAMP
            )
        """),
        {
            "booking_id": booking.id,
            "user_id": booking.user_id,
            "centre_id": slot.centre_id,
            "slot_id": slot.id,
            "crop_type": booking.crop_type or "Unknown",
            "quantity": booking.quantity or 0
        }
    )

    booking.status = "Completed"

    db.add(
        Notification(
            user_id=booking.user_id,
            message=f"Procurement completed for booking #{booking.id}."
        )
    )

    db.commit()

    return {
        "message": "Procurement completed",
        "booking_id": booking.id
    }


# =========================================================
# NOTIFICATIONS
# =========================================================

@app.get("/notifications/{user_id}")
def get_notifications(
    user_id: int,
    db: Session = Depends(get_db)
):

    notes = (
        db.query(Notification)
        .filter(Notification.user_id == user_id)
        .order_by(Notification.created_at.desc())
        .all()
    )

    result = []

    for note in notes:

        extra = db.execute(
            text("""
                SELECT
                    booking_id,
                    payment_id,
                    notification_type,
                    read_at
                FROM notifications
                WHERE id = :id
            """),
            {"id": note.id}
        ).mappings().first()

        result.append({
            "id": note.id,
            "message": note.message,
            "is_read": note.is_read,
            "created_at": note.created_at,
            "booking_id": extra["booking_id"] if extra else None,
            "payment_id": extra["payment_id"] if extra else None,
            "notification_type": (
                extra["notification_type"]
                if extra else "General"
            ),
            "read_at": extra["read_at"] if extra else None
        })

    return result


# =========================================================
# MARK NOTIFICATION AS READ
# =========================================================

@app.put("/notifications/read/{notification_id}")
def mark_notification_read(
    notification_id: int,
    db: Session = Depends(get_db)
):

    notification = db.query(Notification).get(notification_id)

    if not notification:
        raise HTTPException(
            status_code=404,
            detail="Notification not found"
        )

    notification.is_read = True

    db.execute(
        text("""
            UPDATE notifications
            SET read_at = CURRENT_TIMESTAMP
            WHERE id = :id
        """),
        {"id": notification_id}
    )

    db.commit()

    return {
        "message": "Notification marked as read"
    }


# =========================================================
# CROP MASTER
# =========================================================

@app.get("/crops")
def get_crops(
    db: Session = Depends(get_db)
):

    crops = db.execute(
        text("""
            SELECT
                id,
                name_en,
                name_hi,
                is_active
            FROM crops
            WHERE is_active = TRUE
            ORDER BY name_en
        """)
    ).mappings().all()

    return [dict(crop) for crop in crops]


# =========================================================
# CROP ADVISORY
# =========================================================

@app.get("/crop-advisory")
def get_crop_advisory(
    db: Session = Depends(get_db)
):

    advisory = db.execute(
        text("""
            SELECT
                ca.id,
                c.name_en,
                c.name_hi,
                ca.state,
                ca.month,
                ca.demand_score,
                ca.recommendation_score,
                ca.selling_window,
                ca.source,
                ca.version
            FROM crop_advisories ca
            JOIN crops c
                ON c.id = ca.crop_id
            WHERE ca.is_active = TRUE
            ORDER BY c.name_en
        """)
    ).mappings().all()

    return [dict(item) for item in advisory]


# =========================================================
# SINGLE CROP ADVISORY
# =========================================================

@app.get("/crop-advisory/{crop_name}")
def get_single_crop_advisory(
    crop_name: str,
    db: Session = Depends(get_db)
):

    advisory = db.execute(
        text("""
            SELECT
                c.name_en,
                c.name_hi,
                ca.state,
                ca.month,
                ca.demand_score,
                ca.recommendation_score,
                ca.selling_window,
                ca.source,
                ca.version
            FROM crop_advisories ca
            JOIN crops c
                ON c.id = ca.crop_id
            WHERE LOWER(c.name_en) = LOWER(:crop_name)
              AND ca.is_active = TRUE
            ORDER BY ca.id DESC
            LIMIT 1
        """),
        {"crop_name": crop_name}
    ).mappings().first()

    if not advisory:
        raise HTTPException(
            status_code=404,
            detail="Crop advisory not found"
        )

    return dict(advisory)


# =========================================================
# PRICE HISTORY
# =========================================================

@app.get("/price-history")
def get_price_history(
    db: Session = Depends(get_db)
):

    prices = db.execute(
        text("""
            SELECT
                ph.id,
                c.name_en AS crop,
                c.name_hi AS crop_hindi,
                ph.market,
                ph.price,
                ph.unit,
                ph.recorded_at,
                ce.name AS centre_name
            FROM price_history ph
            JOIN crops c
                ON c.id = ph.crop_id
            LEFT JOIN centres ce
                ON ce.id = ph.centre_id
            ORDER BY ph.recorded_at DESC
        """)
    ).mappings().all()

    return [dict(price) for price in prices]


# =========================================================
# CENTRES
# =========================================================

@app.get("/centres")
def get_centres(
    db: Session = Depends(get_db)
):

    centres = db.execute(
        text("""
            SELECT
                id,
                name,
                address,
                latitude,
                longitude,
                is_active,
                operating_status,
                opening_time,
                closing_time
            FROM centres
            ORDER BY name
        """)
    ).mappings().all()

    return [dict(centre) for centre in centres]


# =========================================================
# ADMIN DASHBOARD STATS
# =========================================================

@app.get("/admin/stats")
def get_admin_stats(
    db: Session = Depends(get_db)
):

    total_farmers = db.query(User).filter(
        User.role == "farmer"
    ).count()

    total_bookings = db.query(Booking).count()

    total_completed = db.query(Booking).filter(
        Booking.status == "Completed"
    ).count()

    total_pending = db.query(Booking).filter(
        Booking.status == "Confirmed"
    ).count()

    total_waitlist = db.query(Waitlist).count()

    total_centres = db.query(Centre).count()

    # Booking status
    status_breakdown = (
        db.query(
            Booking.status,
            sqlfunc.count(Booking.id)
        )
        .group_by(Booking.status)
        .all()
    )

    # Crop quantity
    crop_breakdown = (
        db.query(
            Booking.crop_type,
            sqlfunc.sum(Booking.quantity)
        )
        .filter(Booking.crop_type.isnot(None))
        .group_by(Booking.crop_type)
        .order_by(
            sqlfunc.sum(Booking.quantity).desc()
        )
        .all()
    )

    # Centre bookings
    bookings_per_center = (
        db.query(
            Centre.name,
            sqlfunc.count(Booking.id)
        )
        .join(
            Slot,
            Slot.centre_id == Centre.id
        )
        .join(
            Booking,
            Booking.slot_id == Slot.id
        )
        .group_by(Centre.name)
        .all()
    )

    # Payment summary
    payment_summary = db.execute(
        text("""
            SELECT
                payment_status,
                COUNT(*) AS count,
                COALESCE(SUM(amount), 0) AS total_amount
            FROM payments
            GROUP BY payment_status
        """)
    ).mappings().all()

    # Procurement quantity
    procurement_summary = db.execute(
        text("""
            SELECT
                COUNT(*) AS total_procurements,
                COALESCE(SUM(quantity), 0) AS total_quantity
            FROM procurements
        """)
    ).mappings().first()

    return {
        "total_farmers": total_farmers,
        "total_bookings": total_bookings,
        "total_completed": total_completed,
        "total_pending": total_pending,
        "total_waitlist": total_waitlist,
        "total_centres": total_centres,

        "status_breakdown": [
            {
                "status": status,
                "count": count
            }
            for status, count in status_breakdown
        ],

        "crop_breakdown": [
            {
                "crop": crop,
                "total_quantity": int(quantity or 0)
            }
            for crop, quantity in crop_breakdown
        ],

        "bookings_per_center": [
            {
                "center": center,
                "count": count
            }
            for center, count in bookings_per_center
        ],

        "payment_summary": [
            {
                "status": item["payment_status"],
                "count": item["count"],
                "total_amount": float(
                    item["total_amount"] or 0
                )
            }
            for item in payment_summary
        ],

        "procurement_summary": {
            "total_procurements": int(
                procurement_summary["total_procurements"] or 0
            ),
            "total_quantity": int(
                procurement_summary["total_quantity"] or 0
            )
        }
    }
}