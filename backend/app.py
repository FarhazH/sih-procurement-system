from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, User, Slot, Booking, Waitlist

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///procurement.db'
db.init_app(app)

with app.app_context():
    db.create_all()

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    new_user = User(
        name=data['name'],
        phone=data['phone'],
        role=data.get('role', 'farmer')
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "Registered successfully", "user_id": new_user.id})

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(phone=data['phone']).first()
    if user:
        return jsonify({"message": "Login successful", "user_id": user.id, "role": user.role})
    else:
        return jsonify({"message": "User not found"}), 404


@app.route('/slots', methods=['GET'])
def get_slots():
    slots = Slot.query.all()
    result = []
    for slot in slots:
        result.append({
            "id": slot.id,
            "center_name": slot.center_name,
            "date": slot.date,
            "time_window": slot.time_window,
            "general_capacity": slot.general_capacity,
            "general_booked": slot.general_booked,
            "priority_capacity": slot.priority_capacity,
            "priority_booked": slot.priority_booked
        })
    return jsonify(result)

@app.route('/create-slot', methods=['POST'])
def create_slot():
    data = request.json
    new_slot = Slot(
        center_name=data['center_name'],
        date=data['date'],
        time_window=data['time_window'],
        general_capacity=data['general_capacity'],
        priority_capacity=data['priority_capacity']
    )
    db.session.add(new_slot)
    db.session.commit()
    return jsonify({"message": "Slot created", "slot_id": new_slot.id})

@app.route('/book', methods=['POST'])
def book_slot():
    data = request.json
    user_id = data['user_id']
    slot_id = data['slot_id']

    user = User.query.get(user_id)
    slot = Slot.query.get(slot_id)

    if not user or not slot:
        return jsonify({"message": "User or Slot not found"}), 404

    # Case 1: General pool has space — anyone can book here
    if slot.general_booked < slot.general_capacity:
        slot.general_booked += 1
        new_booking = Booking(user_id=user_id, slot_id=slot_id, pool_type='general')
        db.session.add(new_booking)
        user.missed_count = 0
        db.session.commit()
        return jsonify({"message": "Booking confirmed (general pool)", "booking_id": new_booking.id})

    # Case 2: General full, but priority pool has space AND user has missed before
    elif slot.priority_booked < slot.priority_capacity and user.missed_count >= 1:
        slot.priority_booked += 1
        new_booking = Booking(user_id=user_id, slot_id=slot_id, pool_type='priority')
        db.session.add(new_booking)
        user.missed_count = 0
        db.session.commit()
        return jsonify({"message": "Booking confirmed (priority pool)", "booking_id": new_booking.id})

    # Case 3: Both full, or not eligible for priority — join waitlist
    else:
        user.missed_count += 1
        position = Waitlist.query.filter_by(slot_id=slot_id).count() + 1
        new_wait = Waitlist(user_id=user_id, slot_id=slot_id, position=position)
        db.session.add(new_wait)
        db.session.commit()
        return jsonify({"message": "Slot full, added to waitlist", "waitlist_position": position})


@app.route('/queue/<int:slot_id>', methods=['GET'])
def get_queue(slot_id):
    bookings = Booking.query.filter_by(slot_id=slot_id).order_by(Booking.created_at).all()
    result = []
    for index, booking in enumerate(bookings):
        result.append({
            "booking_id": booking.id,
            "user_id": booking.user_id,
            "queue_position": index + 1,
            "status": booking.status
        })
    return jsonify(result)

@app.route('/update-status/<int:booking_id>', methods=['PUT'])
def update_status(booking_id):
    data = request.json
    booking = Booking.query.get(booking_id)
    if not booking:
        return jsonify({"message": "Booking not found"}), 404
    booking.status = data['status']
    db.session.commit()
    return jsonify({"message": "Status updated", "booking_id": booking.id, "new_status": booking.status})

@app.route('/update-payment/<int:booking_id>', methods=['PUT'])
def update_payment(booking_id):
    data = request.json
    booking = Booking.query.get(booking_id)
    if not booking:
        return jsonify({"message": "Booking not found"}), 404
    booking.payment_status = data['payment_status']
    db.session.commit()
    return jsonify({"message": "Payment status updated", "booking_id": booking.id, "new_payment_status": booking.payment_status})

if __name__ == '__main__':
    app.run(debug=True)