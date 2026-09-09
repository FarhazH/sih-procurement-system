from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    phone = Column(String(15), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), default="farmer")
    missed_count = Column(Integer, default=0)

class Slot(Base):
    __tablename__ = "slots"
    id = Column(Integer, primary_key=True, index=True)
    centre_id = Column(Integer, ForeignKey("centres.id"), nullable=False)
    date = Column(String(20), nullable=False)
    time_window = Column(String(50), nullable=False)
    general_capacity = Column(Integer, nullable=False)
    general_booked = Column(Integer, default=0)
    priority_capacity = Column(Integer, nullable=False)
    priority_booked = Column(Integer, default=0)

class Booking(Base):
    __tablename__ = "bookings"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    slot_id = Column(Integer, ForeignKey("slots.id"), nullable=False)
    agent_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    pool_type = Column(String(20), nullable=False)
    crop_type = Column(String(50), nullable=True)
    quantity = Column(Integer, nullable=True)
    status = Column(String(20), default="Confirmed")
    payment_status = Column(String(20), default="Pending")
    created_at = Column(DateTime, server_default=func.now())

class Waitlist(Base):
    __tablename__ = "waitlist"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    slot_id = Column(Integer, ForeignKey("slots.id"), nullable=False)
    position = Column(Integer, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    notified = Column(Boolean, default=False)

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    message = Column(String(255), nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())

class Centre(Base):
    __tablename__ = "centres"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    address = Column(String(200), nullable=True)
    latitude = Column(String(20), nullable=True)
    longitude = Column(String(20), nullable=True)