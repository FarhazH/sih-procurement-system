from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime,
    ForeignKey,
    Numeric,
    Text,
    func
)

from database import Base


# ==========================================
# USER / FARMER / ADMIN
# ==========================================

class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)

    phone = Column(String(15), unique=True, nullable=False)

    password_hash = Column(String(255), nullable=False)

    role = Column(String(20), default="farmer")

    missed_count = Column(Integer, default=0)

    # Farmer profile
    village = Column(String(100), nullable=True)

    district = Column(String(100), nullable=True)

    state = Column(String(100), default="Rajasthan")

<<<<<<< HEAD
    address = Column(String(255), nullable=True)
=======
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
    payment_amount = Column(Integer, nullable=True)
    payment_date = Column(DateTime, nullable=True)
    transaction_id = Column(String(50), nullable=True)
    created_at = Column(DateTime, server_default=func.now())
>>>>>>> 3c5cff8499ea3bf7276aae415e86dc05f94852a9

    farmer_registration_id = Column(
        String(50),
        unique=True,
        nullable=True
    )

    # Language
    preferred_language = Column(
        String(10),
        default="en"
    )

    created_at = Column(
        DateTime,
        server_default=func.now()
    )


# ==========================================
# PROCUREMENT CENTRE
# ==========================================

class Centre(Base):

    __tablename__ = "centres"

    id = Column(Integer, primary_key=True, index=True)
<<<<<<< HEAD

    name = Column(
        String(100),
        nullable=False,
        unique=True
    )

    address = Column(
        String(200),
        nullable=True
    )

    latitude = Column(
        String(20),
        nullable=True
    )

    longitude = Column(
        String(20),
        nullable=True
    )

    is_active = Column(
        Boolean,
        default=True
    )

    operating_status = Column(
        String(30),
        default="Open"
    )

    opening_time = Column(
        String(20),
        nullable=True
    )

    closing_time = Column(
        String(20),
        nullable=True
    )


# ==========================================
# PROCUREMENT SLOT
# ==========================================

class Slot(Base):

    __tablename__ = "slots"

    id = Column(Integer, primary_key=True, index=True)

    centre_id = Column(
        Integer,
        ForeignKey("centres.id"),
        nullable=False
    )

    date = Column(
        String(20),
        nullable=False
    )

    time_window = Column(
        String(50),
        nullable=False
    )

    general_capacity = Column(
        Integer,
        nullable=False
    )

    general_booked = Column(
        Integer,
        default=0
    )

    priority_capacity = Column(
        Integer,
        nullable=False
    )

    priority_booked = Column(
        Integer,
        default=0
    )

    status = Column(
        String(30),
        default="Available"
    )

    created_at = Column(
        DateTime,
        server_default=func.now()
    )


# ==========================================
# BOOKING / TOKEN
# ==========================================

class Booking(Base):

    __tablename__ = "bookings"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    slot_id = Column(
        Integer,
        ForeignKey("slots.id"),
        nullable=False
    )

    agent_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True
    )

    pool_type = Column(
        String(20),
        nullable=False
    )

    crop_type = Column(
        String(50),
        nullable=True
    )

    quantity = Column(
        Integer,
        nullable=True
    )

    status = Column(
        String(30),
        default="Confirmed"
    )

    payment_status = Column(
        String(30),
        default="Pending"
    )

    cancelled_at = Column(
        DateTime,
        nullable=True
    )

    rescheduled_at = Column(
        DateTime,
        nullable=True
    )

    cancellation_reason = Column(
        String(255),
        nullable=True
    )

    created_at = Column(
        DateTime,
        server_default=func.now()
    )

    updated_at = Column(
        DateTime,
        onupdate=func.now()
    )


# ==========================================
# WAITLIST
# ==========================================

class Waitlist(Base):

    __tablename__ = "waitlist"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    slot_id = Column(
        Integer,
        ForeignKey("slots.id"),
        nullable=False
    )

    position = Column(
        Integer,
        nullable=False
    )

    notified = Column(
        Boolean,
        default=False
    )

    created_at = Column(
        DateTime,
        server_default=func.now()
    )


# ==========================================
# PAYMENT
# ==========================================

class Payment(Base):

    __tablename__ = "payments"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    booking_id = Column(
        Integer,
        ForeignKey("bookings.id"),
        nullable=False
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    amount = Column(
        Numeric(12, 2),
        nullable=False
    )

    payment_method = Column(
        String(50),
        nullable=True
    )

    transaction_id = Column(
        String(100),
        unique=True,
        nullable=True
    )

    payment_status = Column(
        String(30),
        default="Pending"
    )

    paid_at = Column(
        DateTime,
        nullable=True
    )

    created_at = Column(
        DateTime,
        server_default=func.now()
    )


# ==========================================
# PROCUREMENT
# ==========================================

class Procurement(Base):

    __tablename__ = "procurements"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    booking_id = Column(
        Integer,
        ForeignKey("bookings.id"),
        nullable=False
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    centre_id = Column(
        Integer,
        ForeignKey("centres.id"),
        nullable=False
    )

    slot_id = Column(
        Integer,
        ForeignKey("slots.id"),
        nullable=False
    )

    crop_type = Column(
        String(50),
        nullable=False
    )

    quantity = Column(
        Integer,
        nullable=False
    )

    final_status = Column(
        String(30),
        default="Pending"
    )

    procured_at = Column(
        DateTime,
        nullable=True
    )

    created_at = Column(
        DateTime,
        server_default=func.now()
    )


# ==========================================
# CROP MASTER
# ==========================================

class Crop(Base):

    __tablename__ = "crops"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name_en = Column(
        String(100),
        unique=True,
        nullable=False
    )

    name_hi = Column(
        String(100),
        nullable=False
    )

    is_active = Column(
        Boolean,
        default=True
    )


# ==========================================
# CROP ADVISORY
# ==========================================

class CropAdvisory(Base):

    __tablename__ = "crop_advisories"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    crop_id = Column(
        Integer,
        ForeignKey("crops.id"),
        nullable=False
    )

    state = Column(
        String(100),
        default="Rajasthan"
    )

    month = Column(
        String(30),
        nullable=False
    )

    demand_score = Column(
        Integer,
        nullable=True
    )

    recommendation_score = Column(
        Integer,
        nullable=True
    )

    selling_window = Column(
        String(100),
        nullable=True
    )

    source = Column(
        String(255),
        nullable=True
    )

    version = Column(
        String(50),
        nullable=True
    )

    is_active = Column(
        Boolean,
        default=True
    )


# ==========================================
# PRICE HISTORY
# ==========================================

class PriceHistory(Base):

    __tablename__ = "price_history"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    crop_id = Column(
        Integer,
        ForeignKey("crops.id"),
        nullable=False
    )

    centre_id = Column(
        Integer,
        ForeignKey("centres.id"),
        nullable=True
    )

    market = Column(
        String(100),
        nullable=True
    )

    price = Column(
        Numeric(12, 2),
        nullable=False
    )

    unit = Column(
        String(30),
        default="Quintal"
    )

    recorded_at = Column(
        DateTime,
        server_default=func.now()
    )


# ==========================================
# NOTIFICATION
# ==========================================

class Notification(Base):

    __tablename__ = "notifications"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    booking_id = Column(
        Integer,
        ForeignKey("bookings.id"),
        nullable=True
    )

    payment_id = Column(
        Integer,
        ForeignKey("payments.id"),
        nullable=True
    )

    notification_type = Column(
        String(50),
        default="General"
    )

    message = Column(
        String(255),
        nullable=False
    )

    is_read = Column(
        Boolean,
        default=False
    )

    read_at = Column(
        DateTime,
        nullable=True
    )

    created_at = Column(
        DateTime,
        server_default=func.now()
    )


# ==========================================
# AUDIT LOG
# ==========================================

class AuditLog(Base):

    __tablename__ = "audit_logs"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    actor_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True
    )

    action = Column(
        String(100),
        nullable=False
    )

    entity_type = Column(
        String(100),
        nullable=False
    )

    entity_id = Column(
        Integer,
        nullable=True
    )

    details = Column(
        Text,
        nullable=True
    )

    created_at = Column(
        DateTime,
        server_default=func.now()
    )
=======
    name = Column(String(100), nullable=False, unique=True)
    address = Column(String(200), nullable=True)
    latitude = Column(String(20), nullable=True)
    longitude = Column(String(20), nullable=True)


class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    admin_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    action = Column(String(100), nullable=False)
    target_type = Column(String(50), nullable=True)
    target_id = Column(Integer, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
>>>>>>> 3c5cff8499ea3bf7276aae415e86dc05f94852a9
