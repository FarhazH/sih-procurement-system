from fastapi import FastAPI, Depends, HTTPException , Path , Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from sqlalchemy import func as sqlfunc
import requests , os

from database import engine, get_db, Base
from models import User , Slot , Booking , Waitlist , Notification ,Centre
from auth import hash_password, verify_password, create_access_token , decode_access_token

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class RegisterRequest(BaseModel):
    name: str
    phone: str
    password: str
    role: str = "farmer"
    village: Optional[str] = None
    district: Optional[str] = None

class LoginRequest(BaseModel):
    phone: str
    password: str

class CentreCreate(BaseModel):
    name: str
    address: Optional[str] = None


def require_admin(authorization: str = Header(...), db: Session = Depends(get_db)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")
    token = authorization.replace("Bearer ", "")
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    if payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return payload

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
        district=data.district
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "Registered successfully", "user_id": new_user.id}

@app.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.phone == data.phone).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid phone or password")

    token = create_access_token({"user_id": user.id, "role": user.role})
    return {"message": "Login successful", "access_token": token, "user_id": user.id, "role": user.role}

# ---------- Pydantic request models ----------
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

# ---------- Routes ----------

@app.get("/slots")
def get_slots(db: Session = Depends(get_db)):
    slots = db.query(Slot).all()
    result = []
    for s in slots:
        centre = db.query(Centre).get(s.centre_id)
        result.append({
            "id": s.id,
            "centre_name": centre.name if centre else None,
            "centre_address": centre.address if centre else None,
            "latitude": centre.latitude if centre else None,
            "longitude": centre.longitude if centre else None,
            "date": s.date,
            "time_window": s.time_window,
            "general_capacity": s.general_capacity,
            "general_booked": s.general_booked,
            "priority_capacity": s.priority_capacity,
            "priority_booked": s.priority_booked
        })
    return result

@app.post("/create-slot")
def create_slot(data: SlotCreate, db: Session = Depends(get_db), admin=Depends(require_admin)):
    new_slot = Slot(**data.dict())
    db.add(new_slot)
    db.commit()
    db.refresh(new_slot)
    return {"message": "Slot created", "slot_id": new_slot.id}

@app.post("/book")
def book_slot(data: BookRequest, db: Session = Depends(get_db)):
    user = db.query(User).get(data.user_id)
    slot = db.query(Slot).get(data.slot_id)
    if not user or not slot:
        raise HTTPException(status_code=404, detail="User or Slot not found")

    existing = db.query(Booking).filter_by(user_id=data.user_id, slot_id=data.slot_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already booked this slot")

    if slot.general_booked < slot.general_capacity:
        slot.general_booked += 1
        new_booking = Booking(user_id=data.user_id, slot_id=data.slot_id, pool_type="general", crop_type=data.crop_type, quantity=data.quantity)
        user.missed_count = 0
        db.add(new_booking)
        db.commit()
        db.refresh(new_booking)
        return {"message": "Booking confirmed (general pool)", "booking_id": new_booking.id}

    elif slot.priority_booked < slot.priority_capacity and user.missed_count >= 1:
        slot.priority_booked += 1
        new_booking = Booking(user_id=data.user_id, slot_id=data.slot_id, pool_type="priority", crop_type=data.crop_type, quantity=data.quantity)
        user.missed_count = 0
        db.add(new_booking)
        db.commit()
        db.refresh(new_booking)
        return {"message": "Booking confirmed (priority pool)", "booking_id": new_booking.id}

    else:
        user.missed_count += 1
        position = db.query(Waitlist).filter_by(slot_id=data.slot_id).count() + 1
        new_wait = Waitlist(user_id=data.user_id, slot_id=data.slot_id, position=position)
        db.add(new_wait)
        db.commit()
        return {"message": "Slot full, added to waitlist", "waitlist_position": position}

@app.get("/queue/{slot_id}")
def get_queue(slot_id: int, db: Session = Depends(get_db)):
    bookings = db.query(Booking).filter_by(slot_id=slot_id).order_by(Booking.created_at).all()
    return [
        {"booking_id": b.id, "user_id": b.user_id, "queue_position": i + 1, "status": b.status}
        for i, b in enumerate(bookings)
    ]

@app.put("/update-status/{booking_id}")
def update_status(booking_id: int, data: StatusUpdate, db: Session = Depends(get_db), admin=Depends(require_admin)):
    booking = db.query(Booking).get(booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    booking.status = data.status
    db.add(Notification(user_id=booking.user_id, message=f"Your produce status: {data.status}"))
    db.commit()
    return {"message": "Status updated", "booking_id": booking.id, "new_status": booking.status}

@app.put("/update-payment/{booking_id}")
def update_payment(booking_id: int, data: PaymentUpdate, db: Session = Depends(get_db), admin=Depends(require_admin)):
    booking = db.query(Booking).get(booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    booking.payment_status = data.payment_status
    db.add(Notification(user_id=booking.user_id, message=f"Payment status: {data.payment_status}"))
    db.commit()
    return {"message": "Payment status updated", "booking_id": booking.id, "new_payment_status": booking.payment_status}

@app.delete("/cancel/{booking_id}")
def cancel_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = db.query(Booking).get(booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    slot = db.query(Slot).get(booking.slot_id)
    if booking.pool_type == "general":
        slot.general_booked -= 1
    else:
        slot.priority_booked -= 1
    db.delete(booking)
    db.commit()

    next_in_line = db.query(Waitlist).filter_by(slot_id=slot.id).order_by(Waitlist.position).first()
    if next_in_line:
        pool = "general" if slot.general_booked < slot.general_capacity else "priority"
        new_booking = Booking(user_id=next_in_line.user_id, slot_id=slot.id, pool_type=pool)
        if pool == "general":
            slot.general_booked += 1
        else:
            slot.priority_booked += 1
        db.add(new_booking)
        db.delete(next_in_line)
        db.commit()
        return {"message": "Cancelled. Next waitlisted farmer auto-confirmed.", "promoted_user_id": next_in_line.user_id}

    return {"message": "Booking cancelled. No one on waitlist."}

@app.get("/notifications/{user_id}")
def get_notifications(user_id: int, db: Session = Depends(get_db)):
    notes = db.query(Notification).filter_by(user_id=user_id).order_by(Notification.created_at.desc()).all()
    return notes


@app.get("/admin/stats")
def get_admin_stats(db: Session = Depends(get_db)):
    total_farmers = db.query(User).filter(User.role == "farmer").count()
    total_bookings = db.query(Booking).count()

    status_breakdown = (
        db.query(Booking.status, sqlfunc.count(Booking.id))
        .group_by(Booking.status)
        .all()
    )

    crop_breakdown = (
        db.query(Booking.crop_type, sqlfunc.sum(Booking.quantity))
        .filter(Booking.crop_type.isnot(None))
        .group_by(Booking.crop_type)
        .order_by(sqlfunc.sum(Booking.quantity).desc())
        .all()
    )

    bookings_per_center = (
    db.query(Centre.name, sqlfunc.count(Booking.id))
    .join(Slot, Slot.centre_id == Centre.id)
    .join(Booking, Booking.slot_id == Slot.id)
    .group_by(Centre.name)
    .all()
)
    

    return {
        "total_farmers": total_farmers,
        "total_bookings": total_bookings,
        "status_breakdown": [{"status": s, "count": c} for s, c in status_breakdown],
        "crop_breakdown": [{"crop": c, "total_quantity": int(q)} for c, q in crop_breakdown],
        "bookings_per_center": [{"center": c, "count": n} for c, n in bookings_per_center]
    }

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

    new_centre = Centre(
        name=data.name,
        address=data.address,
        latitude=lat,
        longitude=lng
    )
    db.add(new_centre)
    db.commit()
    db.refresh(new_centre)
    return {"message": "Centre created", "centre_id": new_centre.id, "latitude": lat, "longitude": lng}

@app.get("/centres")
def get_centres(db: Session = Depends(get_db)):
    return db.query(Centre).all()

@app.get("/weather/{district}")
def get_weather(district: str):
    api_key = os.getenv("WEATHER_API_KEY")
    url = f"https://api.openweathermap.org/data/2.5/weather?q={district},IN&appid={api_key}&units=metric"
    response = requests.get(url)
    if response.status_code != 200:
        raise HTTPException(status_code=404, detail="Weather data not found for this location")
    data = response.json()
    return {
        "district": district,
        "temperature": data["main"]["temp"],
        "condition": data["weather"][0]["description"],
        "humidity": data["main"]["humidity"]
    }

@app.get("/crop-advisor/{crop_type}")
def crop_advisor(crop_type: str, district: str = "Udaipur"):
    api_key = os.getenv("WEATHER_API_KEY")
    url = f"https://api.openweathermap.org/data/2.5/weather?q={district},IN&appid={api_key}&units=metric"
    response = requests.get(url)
    weather_data = response.json() if response.status_code == 200 else None

    advice = f"General advice for {crop_type}: monitor market prices before selling."
    if weather_data:
        condition = weather_data["weather"][0]["main"].lower()
        if "rain" in condition:
            advice = f"Rain expected — plan transport of {crop_type} carefully and avoid delays at the centre."
        else:
            advice = f"Weather looks favorable for transporting {crop_type} to the centre today."

    return {"crop_type": crop_type, "advice": advice}


@app.get("/weather/user/{user_id}")
def get_weather_for_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).get(user_id)
    if not user or not user.district:
        raise HTTPException(status_code=404, detail="User location not found")

    api_key = os.getenv("WEATHER_API_KEY")
    url = f"https://api.openweathermap.org/data/2.5/weather?q={user.district},IN&appid={api_key}&units=metric"
    response = requests.get(url)
    if response.status_code != 200:
        raise HTTPException(status_code=404, detail="Weather data not found for this district")

    data = response.json()
    return {
        "district": user.district,
        "temperature": data["main"]["temp"],
        "condition": data["weather"][0]["description"],
        "humidity": data["main"]["humidity"]
    }

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