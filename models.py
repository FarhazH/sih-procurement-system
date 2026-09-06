from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(15), unique=True, nullable=False)
    role = db.Column(db.String(20), default='farmer')  # 'farmer' or 'admin'
    missed_count = db.Column(db.Integer, default=0)

class Slot(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    center_name = db.Column(db.String(100), nullable=False)
    date = db.Column(db.String(20), nullable=False)
    time_window = db.Column(db.String(50), nullable=False)
    general_capacity = db.Column(db.Integer, nullable=False)
    general_booked = db.Column(db.Integer, default=0)
    priority_capacity = db.Column(db.Integer, nullable=False)
    priority_booked = db.Column(db.Integer, default=0)

class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    slot_id = db.Column(db.Integer, db.ForeignKey('slot.id'), nullable=False)
    pool_type = db.Column(db.String(20), nullable=False)  # 'general' or 'priority'
    status = db.Column(db.String(20), default='Confirmed')  # Confirmed/Received/Verified/Accepted/Processed
    payment_status = db.Column(db.String(20), default='Pending')  # Pending/Processing/Completed
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    
class Waitlist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    slot_id = db.Column(db.Integer, db.ForeignKey('slot.id'), nullable=False)
    position = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    notified = db.Column(db.Boolean, default=False)

class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    message = db.Column(db.String(255), nullable=False)
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())