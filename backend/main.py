from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func as sqlfunc, text
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import requests
import os
import pickle
import pandas as pd

from database import engine, get_db, Base
from models import (
    User, Slot, Booking, Waitlist, Notification, Centre,
    Payment, Procurement, Crop, CropAdvisory, PriceHistory, AuditLog
)
from auth import hash_password, verify_password, create_access_token, decode_access_token
from recommendation_logic import recommend_best_center

# =========================================================
# DATABASE + APP
# =========================================================

Base.metadata.create_all(bind=engine)

app = FastAPI(title="SIH Procurement System API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ML models (loaded once at startup)
try:
    with open("wait_time_model.pkl", "rb") as f:
        wait_time_model = pickle.load(f)
    with open("crop_demand_model.pkl", "rb") as f:
        crop_demand_model = pickle.load(f)
except FileNotFoundError:
    wait_time_model = None
    crop_demand_model = None


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

class CentreCreate(BaseModel):
    name: str
    address: Optional[str] = None

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

class CropCreate(BaseModel):
    name_en: str
    name_hi: str

class AdvisoryCreate(BaseModel):
    crop_id: int
    month: str
    demand_score: Optional[int] = None
    recommendation_score: Optional[int] = None
    selling_window: Optional[str] = None


# =========================================================
# AUTH HELPERS
# =========================================================


def require_admin(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")
    token = authorization.replace("Bearer ", "")
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    if payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return payload


def get_current_user(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")
    token = authorization.replace("Bearer ", "")
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    user = db.query(User).get(payload["user_id"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


def require_operator_or_admin(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")
    token = authorization.replace("Bearer ", "")
    payload = decode_access_token(token)
    if not payload or payload.get("role") not in ("operator", "admin"):
        raise HTTPException(status_code=403, detail="Operator or admin access required")
    return payload


def verify_owner_or_admin(user_id: int, current_user: User = Depends(get_current_user)):
    if current_user.id != user_id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to access this data")
    return current_user


def log_action(db: Session, actor_id: int, action: str, entity_type: str = None, entity_id: int = None, details: str = None):
    db.add(AuditLog(actor_id=actor_id, action=action, entity_type=entity_type, entity_id=entity_id, details=details))
    db.commit()


# =========================================================
# BASIC / HEALTH
# =========================================================

@app.get("/")
def home():
    return {"message": "SIH Procurement System API is running", "status": "success"}

@app.get("/health")
def health_check():
    return {"status": "ok"}


# =========================================================
# AUTH
# =========================================================

@app.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.phone == data.phone).first()
    if existing:
        raise HTTPException(status_code=400, detail="Phone number already registered")

    new_user = User(
        name=data.name,
        phone=data.phone,
        password_hash=hash_password(data.password),
        role=data.role,
        village=data.village,
        district=data.district,
        state=data.state,
        address=data.address,
        preferred_language=data.preferred_language
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # auto-generate a human-friendly registration id, farmers only
    if data.role == "farmer":
        new_user.farmer_registration_id = f"RJ-UDR-{new_user.id:04d}"
        db.commit()

    return {
        "message": "Registered successfully",
        "user_id": new_user.id,
        "farmer_registration_id": new_user.farmer_registration_id if data.role == "farmer" else None
    }

@app.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.phone == data.phone).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid phone or password")
    token = create_access_token({"user_id": user.id, "role": user.role})
    return {"message": "Login successful", "access_token": token, "user_id": user.id, "role": user.role}

@app.get("/auth/me")
def auth_me(current_user: User = Depends(get_current_user)):
    return {
        "user_id": current_user.id,
        "name": current_user.name,
        "phone": current_user.phone,
        "role": current_user.role,
        "village": current_user.village,
        "district": current_user.district,
        "state": current_user.state
    }

@app.get("/profile/{user_id}")
def get_profile(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "id": user.id, "name": user.name, "phone": user.phone, "role": user.role,
        "village": user.village, "district": user.district, "state": user.state,
        "address": user.address, "farmer_registration_id": user.farmer_registration_id,
        "preferred_language": user.preferred_language, "missed_count": user.missed_count,
        "created_at": user.created_at
    }


# =========================================================
# CENTRES (auto-geocoded)
# =========================================================

@app.post("/create-centre")
def create_centre(data: CentreCreate, db: Session = Depends(get_db), admin=Depends(require_admin)):
    lat, lng = None, None
    if data.address:
        geocode_url = "https://nominatim.openstreetmap.org/search"
        params = {"q": data.address, "format": "json", "limit": 1}
        headers = {"User-Agent": "SIH-Procurement-App"}
        response = requests.get(geocode_url, params=params, headers=headers)
        results = response.json()
        if results:
            lat = results[0]["lat"]
            lng = results[0]["lon"]

    new_centre = Centre(name=data.name, address=data.address, latitude=lat, longitude=lng)
    db.add(new_centre)
    db.commit()
    db.refresh(new_centre)
    log_action(db, admin["user_id"], "create_centre", "centre", new_centre.id)
    return {"message": "Centre created", "centre_id": new_centre.id, "latitude": lat, "longitude": lng}

@app.get("/centres")
def get_centres(db: Session = Depends(get_db)):
    return db.query(Centre).all()

@app.put("/centres/{centre_id}/status")
def update_centre_status(centre_id: int, is_active: bool, operating_status: Optional[str] = None,
                          db: Session = Depends(get_db), admin=Depends(require_admin)):
    centre = db.query(Centre).get(centre_id)
    if not centre:
        raise HTTPException(status_code=404, detail="Centre not found")
    centre.is_active = is_active
    if operating_status:
        centre.operating_status = operating_status
    db.commit()
    log_action(db, admin["user_id"], "update_centre_status", "centre", centre_id)
    return {"message": "Centre status updated"}


# =========================================================
# SLOTS
# =========================================================

@app.get("/slots")
def get_slots(db: Session = Depends(get_db)):
    slots = db.query(Slot).all()
    result = []
    for s in slots:
        centre = db.query(Centre).get(s.centre_id)
        result.append({
            "id": s.id, "centre_id": s.centre_id,
            "centre_name": centre.name if centre else None,
            "centre_address": centre.address if centre else None,
            "latitude": centre.latitude if centre else None,
            "longitude": centre.longitude if centre else None,
            "date": s.date, "time_window": s.time_window,
            "general_capacity": s.general_capacity, "general_booked": s.general_booked,
            "priority_capacity": s.priority_capacity, "priority_booked": s.priority_booked,
            "status": s.status
        })
    return result

@app.post("/create-slot")
def create_slot(data: SlotCreate, db: Session = Depends(get_db), admin=Depends(require_admin)):
    centre = db.query(Centre).get(data.centre_id)
    if not centre:
        raise HTTPException(status_code=404, detail="Centre not found")
    new_slot = Slot(
        centre_id=data.centre_id, date=data.date, time_window=data.time_window,
        general_capacity=data.general_capacity, priority_capacity=data.priority_capacity
    )
    db.add(new_slot)
    db.commit()
    db.refresh(new_slot)
    log_action(db, admin["user_id"], "create_slot", "slot", new_slot.id)
    return {"message": "Slot created", "slot_id": new_slot.id}


# =========================================================
# BOOKING
# =========================================================

@app.post("/book")
def book_slot(data: BookRequest, db: Session = Depends(get_db)):
    user = db.query(User).get(data.user_id)
    slot = db.query(Slot).get(data.slot_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not slot:
        raise HTTPException(status_code=404, detail="Slot not found")
    if slot.status == "Cancelled":
        raise HTTPException(status_code=400, detail="This slot is cancelled")

    existing = db.query(Booking).filter_by(user_id=data.user_id, slot_id=data.slot_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already booked this slot")

    if slot.general_booked < slot.general_capacity:
        slot.general_booked += 1
        new_booking = Booking(user_id=data.user_id, slot_id=data.slot_id, pool_type="general",
                               crop_type=data.crop_type, quantity=data.quantity)
        user.missed_count = 0
        db.add(new_booking)
        db.commit()
        db.refresh(new_booking)
        db.add(Notification(user_id=user.id, booking_id=new_booking.id, notification_type="Booking",
                             message=f"Your booking #{new_booking.id} has been confirmed (general pool)."))
        db.commit()
        return {"message": "Booking confirmed", "booking_id": new_booking.id, "pool_type": "general"}

    elif slot.priority_booked < slot.priority_capacity and user.missed_count >= 1:
        slot.priority_booked += 1
        new_booking = Booking(user_id=data.user_id, slot_id=data.slot_id, pool_type="priority",
                               crop_type=data.crop_type, quantity=data.quantity)
        user.missed_count = 0
        db.add(new_booking)
        db.commit()
        db.refresh(new_booking)
        db.add(Notification(user_id=user.id, booking_id=new_booking.id, notification_type="Booking",
                             message=f"Your priority booking #{new_booking.id} has been confirmed."))
        db.commit()
        return {"message": "Booking confirmed", "booking_id": new_booking.id, "pool_type": "priority"}

    else:
        user.missed_count += 1
        position = db.query(Waitlist).filter_by(slot_id=data.slot_id).count() + 1
        new_wait = Waitlist(user_id=data.user_id, slot_id=data.slot_id, position=position)
        db.add(new_wait)
        db.commit()
        db.add(Notification(user_id=user.id, notification_type="Waitlist",
                             message=f"Slot is full. You are on the waitlist at position {position}."))
        db.commit()
        return {"message": "Slot full, added to waitlist", "waitlist_position": position}

@app.get("/bookings/{user_id}")
def get_my_bookings(user_id: int, db: Session = Depends(get_db), owner=Depends(verify_owner_or_admin)):
    bookings = db.query(Booking).filter_by(user_id=user_id).order_by(Booking.created_at.desc()).all()
    result = []
    for b in bookings:
        slot = db.query(Slot).get(b.slot_id)
        centre = db.query(Centre).get(slot.centre_id) if slot else None
        result.append({
            "booking_id": b.id, "slot_id": b.slot_id,
            "centre_name": centre.name if centre else None,
            "date": slot.date if slot else None, "time_window": slot.time_window if slot else None,
            "crop_type": b.crop_type, "quantity": b.quantity, "pool_type": b.pool_type,
            "status": b.status, "payment_status": b.payment_status, "created_at": b.created_at
        })
    return result

@app.get("/queue/{slot_id}")
def get_queue(slot_id: int, db: Session = Depends(get_db)):
    bookings = db.query(Booking).filter(Booking.slot_id == slot_id, Booking.status != "Cancelled").order_by(Booking.created_at).all()
    return [
        {"booking_id": b.id, "user_id": b.user_id, "queue_position": i + 1, "status": b.status,
         "crop_type": b.crop_type, "quantity": b.quantity, "pool_type": b.pool_type}
        for i, b in enumerate(bookings)
    ]

@app.get("/waitlist/{user_id}")
def get_user_waitlist(user_id: int, db: Session = Depends(get_db), owner=Depends(verify_owner_or_admin)):
    waitlist = db.query(Waitlist).filter_by(user_id=user_id).order_by(Waitlist.created_at.desc()).all()
    result = []
    for w in waitlist:
        slot = db.query(Slot).get(w.slot_id)
        result.append({
            "waitlist_id": w.id, "slot_id": w.slot_id, "position": w.position, "notified": w.notified,
            "date": slot.date if slot else None, "time_window": slot.time_window if slot else None
        })
    return result

@app.put("/update-status/{booking_id}")
def update_status(booking_id: int, data: StatusUpdate, db: Session = Depends(get_db), staff=Depends(require_operator_or_admin)):
    booking = db.query(Booking).get(booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    booking.status = data.status
    db.add(Notification(user_id=booking.user_id, booking_id=booking.id, notification_type="Status",
                         message=f"Your booking #{booking.id} status is now {data.status}."))
    log_action(db, staff["user_id"], "update_status", "booking", booking_id, details=data.status)
    db.commit()
    return {"message": "Status updated", "booking_id": booking.id, "new_status": booking.status}

@app.delete("/cancel/{booking_id}")
def cancel_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = db.query(Booking).get(booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.status == "Cancelled":
        raise HTTPException(status_code=400, detail="Booking already cancelled")
    slot = db.query(Slot).get(booking.slot_id)
    if not slot:
        raise HTTPException(status_code=404, detail="Slot not found")

    if booking.pool_type == "general" and slot.general_booked > 0:
        slot.general_booked -= 1
    elif booking.pool_type == "priority" and slot.priority_booked > 0:
        slot.priority_booked -= 1

    booking.status = "Cancelled"
    booking.cancelled_at = datetime.utcnow()
    booking.cancellation_reason = "Cancelled by farmer"
    db.add(Notification(user_id=booking.user_id, booking_id=booking.id, notification_type="Cancellation",
                         message=f"Your booking #{booking.id} has been cancelled."))
    db.commit()

    next_in_line = db.query(Waitlist).filter_by(slot_id=slot.id).order_by(Waitlist.position).first()
    if next_in_line:
        pool = "general" if slot.general_booked < slot.general_capacity else "priority"
        if pool == "priority" and slot.priority_booked >= slot.priority_capacity:
            return {"message": "Booking cancelled. Waitlist remains (no pool space)."}

        new_booking = Booking(user_id=next_in_line.user_id, slot_id=slot.id, pool_type=pool)
        if pool == "general":
            slot.general_booked += 1
        else:
            slot.priority_booked += 1
        db.add(new_booking)
        promoted_user = next_in_line.user_id
        db.delete(next_in_line)
        db.add(Notification(user_id=promoted_user, notification_type="Waitlist",
                             message="Good news! A slot opened up and your waitlist booking is now confirmed."))
        db.commit()
        return {"message": "Booking cancelled. Next waitlisted farmer auto-confirmed.", "promoted_user_id": promoted_user}

    return {"message": "Booking cancelled. No one on waitlist."}


# =========================================================
# PAYMENTS (separate table)
# =========================================================

@app.get("/payments/{user_id}")
def get_payments(user_id: int, db: Session = Depends(get_db), owner=Depends(verify_owner_or_admin)):
    return db.query(Payment).filter_by(user_id=user_id).order_by(Payment.created_at.desc()).all()

@app.put("/update-payment/{booking_id}")
def update_payment(booking_id: int, data: PaymentUpdate, db: Session = Depends(get_db), admin=Depends(require_admin)):
    booking = db.query(Booking).get(booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    booking.payment_status = data.payment_status  # kept in sync for quick filtering

    payment = db.query(Payment).filter_by(booking_id=booking_id).first()
    if payment:
        payment.payment_status = data.payment_status
        payment.payment_method = data.payment_method
        payment.transaction_id = data.transaction_id
        if data.payment_status == "Completed":
            payment.paid_at = datetime.utcnow()
    else:
        amount = (booking.quantity or 0) * 50
        payment = Payment(
            booking_id=booking_id, user_id=booking.user_id, amount=amount,
            payment_method=data.payment_method, transaction_id=data.transaction_id,
            payment_status=data.payment_status,
            paid_at=datetime.utcnow() if data.payment_status == "Completed" else None
        )
        db.add(payment)

    db.add(Notification(user_id=booking.user_id, booking_id=booking.id, notification_type="Payment",
                         message=f"Payment status for booking #{booking.id}: {data.payment_status}"))
    log_action(db, admin["user_id"], "update_payment", "booking", booking_id, details=data.payment_status)
    db.commit()
    return {"message": "Payment updated", "booking_id": booking.id, "payment_status": data.payment_status}


# =========================================================
# PROCUREMENT (final produce verification record)
# =========================================================

@app.get("/procurements/{user_id}")
def get_procurements(user_id: int, db: Session = Depends(get_db), owner=Depends(verify_owner_or_admin)):
    procs = db.query(Procurement).filter_by(user_id=user_id).order_by(Procurement.created_at.desc()).all()
    result = []
    for p in procs:
        centre = db.query(Centre).get(p.centre_id)
        result.append({
            "id": p.id, "booking_id": p.booking_id, "centre_name": centre.name if centre else None,
            "crop_type": p.crop_type, "quantity": p.quantity, "final_status": p.final_status,
            "procured_at": p.procured_at, "created_at": p.created_at
        })
    return result



class ProcurementCreate(BaseModel):
    grade: Optional[str] = "A"

@app.post("/procurement/{booking_id}")
def create_procurement(booking_id: int, data: ProcurementCreate, db: Session = Depends(get_db), admin=Depends(require_admin)):
    booking = db.query(Booking).get(booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    slot = db.query(Slot).get(booking.slot_id)
    if not slot:
        raise HTTPException(status_code=404, detail="Slot not found")
    existing = db.query(Procurement).filter_by(booking_id=booking_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Procurement already exists")

    procurement = Procurement(
        booking_id=booking.id, user_id=booking.user_id, centre_id=slot.centre_id, slot_id=slot.id,
        crop_type=booking.crop_type or "Unknown", quantity=booking.quantity or 0,
        grade=data.grade, final_status="Completed", procured_at=datetime.utcnow()
    )
    db.add(procurement)
    booking.status = "Processed"
    db.add(Notification(user_id=booking.user_id, booking_id=booking.id, notification_type="Procurement",
                         message=f"Procurement completed for booking #{booking.id} (Grade {data.grade})."))
    log_action(db, admin["user_id"], "create_procurement", "booking", booking_id)
    db.commit()
    return {"message": "Procurement completed", "booking_id": booking.id, "grade": data.grade}


# =========================================================
# NOTIFICATIONS
# =========================================================

@app.get("/notifications/{user_id}")
def get_notifications(user_id: int, db: Session = Depends(get_db), owner=Depends(verify_owner_or_admin)):
    return db.query(Notification).filter_by(user_id=user_id).order_by(Notification.created_at.desc()).all()

@app.put("/notifications/read/{notification_id}")
def mark_notification_read(notification_id: int, db: Session = Depends(get_db)):
    note = db.query(Notification).get(notification_id)
    if not note:
        raise HTTPException(status_code=404, detail="Notification not found")
    note.is_read = True
    note.read_at = datetime.utcnow()
    db.commit()
    return {"message": "Notification marked as read"}


# =========================================================
# CROP MASTER / ADVISORY / PRICE HISTORY
# =========================================================

@app.post("/crops")
def create_crop(data: CropCreate, db: Session = Depends(get_db), admin=Depends(require_admin)):
    crop = Crop(**data.dict())
    db.add(crop)
    db.commit()
    db.refresh(crop)
    return {"message": "Crop added", "crop_id": crop.id}

@app.get("/crops")
def get_crops(db: Session = Depends(get_db)):
    return db.query(Crop).filter(Crop.is_active == True).order_by(Crop.name_en).all()

@app.post("/crop-advisory")
def create_advisory(data: AdvisoryCreate, db: Session = Depends(get_db), admin=Depends(require_admin)):
    advisory = CropAdvisory(**data.dict())
    db.add(advisory)
    db.commit()
    db.refresh(advisory)
    return {"message": "Advisory added", "advisory_id": advisory.id}

@app.get("/crop-advisory")
def list_advisory(db: Session = Depends(get_db)):
    results = db.query(CropAdvisory).filter(CropAdvisory.is_active == True).all()
    output = []
    for a in results:
        crop = db.query(Crop).get(a.crop_id)
        output.append({
            "crop": crop.name_en if crop else None, "crop_hi": crop.name_hi if crop else None,
            "state": a.state, "month": a.month, "demand_score": a.demand_score,
            "recommendation_score": a.recommendation_score, "selling_window": a.selling_window
        })
    return output

@app.get("/price-history/{crop_name}")
def get_price_history(crop_name: str, db: Session = Depends(get_db)):
    crop = db.query(Crop).filter(Crop.name_en.ilike(crop_name)).first()
    if not crop:
        return []
    prices = db.query(PriceHistory).filter_by(crop_id=crop.id).order_by(PriceHistory.recorded_at.desc()).all()
    return prices


# =========================================================
# WEATHER + CROP ADVISOR (rule-based, real API)
# =========================================================

@app.get("/weather/{district}")
def get_weather(district: str):
    api_key = os.getenv("WEATHER_API_KEY")
    url = f"https://api.openweathermap.org/data/2.5/weather?q={district},IN&appid={api_key}&units=metric"
    response = requests.get(url)
    if response.status_code != 200:
        raise HTTPException(status_code=404, detail="Weather data not found for this location")
    data = response.json()
    return {"district": district, "temperature": data["main"]["temp"],
            "condition": data["weather"][0]["description"], "humidity": data["main"]["humidity"]}

@app.get("/weather/user/{user_id}")
def get_weather_for_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).get(user_id)
    if not user or not user.district:
        raise HTTPException(status_code=404, detail="User location not found")
    return get_weather(user.district)

@app.get("/crop-advisor/user/{user_id}")
def crop_advisor_for_user(user_id: int, crop_type: str, db: Session = Depends(get_db)):
    user = db.query(User).get(user_id)
    if not user or not user.district:
        raise HTTPException(status_code=404, detail="User location not found")

    api_key = os.getenv("WEATHER_API_KEY")
    url = f"https://api.openweathermap.org/data/2.5/weather?q={user.district},IN&appid={api_key}&units=metric"
    response = requests.get(url)
    weather_data = response.json() if response.status_code == 200 else None

    advice = f"General advice for {crop_type}: monitor market prices before selling."
    if weather_data:
        condition = weather_data["weather"][0]["main"].lower()
        if "rain" in condition:
            advice = f"Rain expected — plan transport of {crop_type} carefully and avoid delays at the centre."
        else:
            advice = f"Weather looks favorable for transporting {crop_type} to the centre today."
    return {"crop_type": crop_type, "district": user.district, "advice": advice}


# =========================================================
# ML: WAIT-TIME PREDICTION + CROP DEMAND
# =========================================================

@app.get("/predict-wait-time/{slot_id}")
def predict_wait_time(slot_id: int, db: Session = Depends(get_db)):
    if wait_time_model is None:
        raise HTTPException(status_code=503, detail="Wait-time model not loaded")
    slot = db.query(Slot).get(slot_id)
    if not slot:
        raise HTTPException(status_code=404, detail="Slot not found")
    queue_length = slot.general_booked + slot.priority_booked
    input_data = pd.DataFrame([{
        "center_id": slot.centre_id, "time_slot": 10,
        "queue_length": queue_length, "active_counters": 2, "produce_weight_qtl": 30.0
    }])
    predicted_minutes = wait_time_model.predict(input_data)[0]
    return {"slot_id": slot_id, "estimated_wait_minutes": round(float(predicted_minutes), 1)}

@app.get("/predict-demand")
def predict_demand(market_id: int = 201, season_id: int = 1, session_id: int = 1):
    if crop_demand_model is None:
        raise HTTPException(status_code=503, detail="Crop demand model not loaded")
    input_data = pd.DataFrame([{"market_id": market_id, "season_id": season_id, "session_id": session_id}])
    predicted_demand = crop_demand_model.predict(input_data)[0]
    return {"predicted_demand": round(float(predicted_demand), 1)}


# =========================================================
# CENTRE RECOMMENDATION
# =========================================================

@app.get("/recommend-centre/{user_id}")
def recommend_centre(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    farmer_lat, farmer_lon = 24.5854, 73.7125  # Udaipur fallback
    centres = db.query(Centre).all()
    centres_list = []
    for c in centres:
        if c.latitude is None or c.longitude is None:
            continue
        total_booked = db.query(sqlfunc.sum(Slot.general_booked + Slot.priority_booked)).filter(Slot.centre_id == c.id).scalar() or 0
        centres_list.append({"id": c.id, "name": c.name, "lat": float(c.latitude), "lon": float(c.longitude), "queue": total_booked})

    if not centres_list:
        return {"message": "No centres with location data available"}
    return {"recommendations": recommend_best_center(farmer_lat, farmer_lon, centres_list)}


# =========================================================
# ADMIN
# =========================================================

@app.get("/admin/farmers")
def admin_list_farmers(db: Session = Depends(get_db), admin=Depends(require_admin)):
    farmers = db.query(User).filter(User.role == "farmer").all()
    return [{"id": f.id, "name": f.name, "phone": f.phone, "village": f.village,
             "district": f.district, "state": f.state, "missed_count": f.missed_count} for f in farmers]

@app.get("/admin/bookings")
def admin_list_bookings(db: Session = Depends(get_db), admin=Depends(require_admin)):
    bookings = db.query(Booking).all()
    result = []
    for b in bookings:
        user = db.query(User).get(b.user_id)
        slot = db.query(Slot).get(b.slot_id)
        centre = db.query(Centre).get(slot.centre_id) if slot else None
        result.append({
            "booking_id": b.id, "farmer_name": user.name if user else None,
            "farmer_phone": user.phone if user else None, "centre_name": centre.name if centre else None,
            "date": slot.date if slot else None, "crop_type": b.crop_type, "quantity": b.quantity,
            "status": b.status, "payment_status": b.payment_status
        })
    return result

@app.get("/admin/stats")
def get_admin_stats(db: Session = Depends(get_db)):
    total_farmers = db.query(User).filter(User.role == "farmer").count()
    total_bookings = db.query(Booking).count()
    total_waitlist = db.query(Waitlist).count()
    total_centres = db.query(Centre).count()

    status_breakdown = db.query(Booking.status, sqlfunc.count(Booking.id)).group_by(Booking.status).all()
    crop_breakdown = (db.query(Booking.crop_type, sqlfunc.sum(Booking.quantity))
                       .filter(Booking.crop_type.isnot(None)).group_by(Booking.crop_type)
                       .order_by(sqlfunc.sum(Booking.quantity).desc()).all())
    bookings_per_center = (db.query(Centre.name, sqlfunc.count(Booking.id))
                            .join(Slot, Slot.centre_id == Centre.id)
                            .join(Booking, Booking.slot_id == Slot.id)
                            .group_by(Centre.name).all())
    payment_summary = db.query(Payment.payment_status, sqlfunc.count(Payment.id), sqlfunc.coalesce(sqlfunc.sum(Payment.amount), 0)).group_by(Payment.payment_status).all()

    return {
        "total_farmers": total_farmers, "total_bookings": total_bookings,
        "total_waitlist": total_waitlist, "total_centres": total_centres,
        "status_breakdown": [{"status": s, "count": c} for s, c in status_breakdown],
        "crop_breakdown": [{"crop": c, "total_quantity": int(q or 0)} for c, q in crop_breakdown],
        "bookings_per_center": [{"center": c, "count": n} for c, n in bookings_per_center],
        "payment_summary": [{"status": s, "count": c, "total_amount": float(a)} for s, c, a in payment_summary]
    }

@app.get("/admin/report")
def admin_report(db: Session = Depends(get_db), admin=Depends(require_admin)):
    total_farmers = db.query(User).filter(User.role == "farmer").count()
    total_centres = db.query(Centre).count()
    total_bookings = db.query(Booking).count()
    total_payment_amount = db.query(sqlfunc.coalesce(sqlfunc.sum(Payment.amount), 0)).scalar()
    return {
        "total_farmers": total_farmers, "total_centres": total_centres,
        "total_bookings": total_bookings, "total_payment_amount": float(total_payment_amount)
    }

@app.get("/admin/audit-logs")
def get_audit_logs(db: Session = Depends(get_db), admin=Depends(require_admin)):
    logs = db.query(AuditLog).order_by(AuditLog.created_at.desc()).limit(200).all()
    result = []
    for log in logs:
        actor = db.query(User).get(log.actor_id) if log.actor_id else None
        result.append({
            "id": log.id, "actor_name": actor.name if actor else "System",
            "action": log.action, "entity_type": log.entity_type, "entity_id": log.entity_id,
            "details": log.details, "created_at": log.created_at
        })
    return result






#===============================================================
# FARMER DASHBOARD
#===============================================================

@app.get("/farmer/dashboard/{user_id}")
def farmer_dashboard(user_id: int, db: Session = Depends(get_db), owner=Depends(verify_owner_or_admin)):
    user = db.query(User).get(user_id)
    bookings = db.query(Booking).filter_by(user_id=user_id).all()
    waitlist = db.query(Waitlist).filter_by(user_id=user_id).all()
    notifications = db.query(Notification).filter_by(user_id=user_id).order_by(Notification.created_at.desc()).limit(10).all()
    payments = db.query(Payment).filter_by(user_id=user_id).all()
    return {
        "profile": {"id": user.id, "name": user.name, "phone": user.phone, "village": user.village, "district": user.district},
        "bookings": bookings, "waitlist": waitlist, "notifications": notifications, "payments": payments
    }

@app.get("/farmer/report/{user_id}")
def farmer_report(user_id: int, db: Session = Depends(get_db), owner=Depends(verify_owner_or_admin)):
    user = db.query(User).get(user_id)
    bookings = db.query(Booking).filter_by(user_id=user_id).all()
    payments = db.query(Payment).filter_by(user_id=user_id).all()
    crop_history = [{"crop": b.crop_type, "quantity": b.quantity, "status": b.status} for b in bookings if b.crop_type]
    return {
        "profile": {"name": user.name, "phone": user.phone, "village": user.village, "district": user.district,
                     "farmer_registration_id": user.farmer_registration_id},
        "bookings": bookings, "payments": payments, "crop_history": crop_history
    }

@app.get("/farmer/crop-history/{user_id}")
def farmer_crop_history(user_id: int, db: Session = Depends(get_db), owner=Depends(verify_owner_or_admin)):
    bookings = db.query(Booking).filter_by(user_id=user_id).all()
    return [{"crop_type": b.crop_type, "quantity": b.quantity, "status": b.status, "date": b.created_at}
            for b in bookings if b.crop_type]