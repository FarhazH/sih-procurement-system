from database import SessionLocal
from models import User, Centre, Slot, Booking, Waitlist, Notification
from auth import hash_password
from datetime import datetime, timedelta
import random

db = SessionLocal()

try:

    # ==========================
    # INSERT CENTRES
    # ==========================

    centres_data = [
        {
            "name": "Udaipur Krishi Upaj Mandi",
            "address": "Balicha, Udaipur, Rajasthan",
            "latitude": "24.5854",
            "longitude": "73.7125"
        },
        {
            "name": "Hiran Magri Procurement Centre",
            "address": "Sector 14, Hiran Magri, Udaipur",
            "latitude": "24.5962",
            "longitude": "73.7051"
        },
        {
            "name": "Dabok Procurement Centre",
            "address": "Dabok, Udaipur, Rajasthan",
            "latitude": "24.6173",
            "longitude": "73.8966"
        }
    ]

    centres = []

    for data in centres_data:

        centre = db.query(Centre).filter(
            Centre.name == data["name"]
        ).first()

        if not centre:
            centre = Centre(**data)
            db.add(centre)
            db.commit()
            db.refresh(centre)

        centres.append(centre)

    print("✅ Centres Ready")


    # ==========================
    # INSERT ADMIN
    # ==========================

    admin = db.query(User).filter(
        User.phone == "9999999999"
    ).first()

    if not admin:

        admin = User(
            name="System Admin",
            phone="9999999999",
            password_hash=hash_password("admin123"),
            role="admin",
            missed_count=0
        )

        db.add(admin)
        db.commit()

    print("✅ Admin Ready")


    # ==========================
    # INSERT FARMERS
    # ==========================

    farmer_names = [

        "Ramesh Kumar",
        "Suresh Patel",
        "Mahesh Singh",
        "Lokesh Sharma",
        "Rajesh Meena",
        "Deepak Verma",
        "Naresh Jat",
        "Mukesh Joshi",
        "Raju Mali",
        "Vinod Choudhary",
        "Dinesh Prajapat",
        "Pankaj Solanki",
        "Ashok Kumar",
        "Rahul Yadav",
        "Mohan Lal",
        "Bhupendra Singh",
        "Kailash Patel",
        "Ganesh Sharma",
        "Shankar Lal",
        "Om Prakash"

    ]

    farmers = []

    phone = 9000000001

    for name in farmer_names:

        user = db.query(User).filter(
            User.phone == str(phone)
        ).first()

        if not user:

            user = User(

                name=name,
                phone=str(phone),
                password_hash=hash_password("farmer123"),
                role="farmer",
                missed_count=random.randint(0,2)

            )

            db.add(user)
            db.commit()
            db.refresh(user)

        farmers.append(user)

        phone += 1

    print("✅ Farmers Ready")


    # ==========================
    # INSERT SLOTS
    # ==========================

    slot_data = [
        ("2026-09-10", "09:00 AM - 11:00 AM", 8, 2),
        ("2026-09-10", "11:30 AM - 01:30 PM", 8, 2),
        ("2026-09-11", "09:00 AM - 11:00 AM", 10, 3),
        ("2026-09-11", "11:30 AM - 01:30 PM", 10, 3),
        ("2026-09-12", "09:00 AM - 11:00 AM", 8, 2),
        ("2026-09-12", "11:30 AM - 01:30 PM", 8, 2),
        ("2026-09-13", "09:00 AM - 11:00 AM", 6, 2),
        ("2026-09-13", "11:30 AM - 01:30 PM", 6, 2),
    ]

    slots = []

    centre_index = 0

    for i, data in enumerate(slot_data):

        centre = centres[centre_index]

        existing = db.query(Slot).filter(
            Slot.centre_id == centre.id,
            Slot.date == data[0],
            Slot.time_window == data[1]
        ).first()

        if not existing:

            slot = Slot(
                centre_id=centre.id,
                date=data[0],
                time_window=data[1],
                general_capacity=data[2],
                general_booked=random.randint(0, 4),
                priority_capacity=data[3],
                priority_booked=random.randint(0, 1)
            )

            db.add(slot)
            db.commit()
            db.refresh(slot)

        else:
            slot = existing

        slots.append(slot)

        centre_index += 1

        if centre_index == len(centres):
            centre_index = 0

    print("✅ Slots Ready")



    # ==========================
    # INSERT BOOKINGS
    # ==========================

    crops = [
        "Wheat",
        "Maize",
        "Soybean",
        "Mustard",
        "Gram"
    ]

    booking_status = [
        "Confirmed",
        "Completed"
    ]

    payment_status = [
        "Pending",
        "Paid"
    ]

    bookings = []

    for i in range(12):

        user = farmers[i % len(farmers)]
        slot = slots[i % len(slots)]

        existing = db.query(Booking).filter(
            Booking.user_id == user.id,
            Booking.slot_id == slot.id
        ).first()

        if not existing:

            booking = Booking(

                user_id=user.id,
                slot_id=slot.id,
                agent_id=None,
                pool_type=random.choice(["General", "Priority"]),
                crop_type=random.choice(crops),
                quantity=random.randint(20,100),
                status=random.choice(booking_status),
                payment_status=random.choice(payment_status)

            )

            db.add(booking)
            db.commit()
            db.refresh(booking)

        else:
            booking = existing

        bookings.append(booking)

    print("✅ Bookings Ready")


    # ==========================
    # INSERT WAITLIST
    # ==========================

    for i in range(3):

        user = farmers[15+i]
        slot = slots[i]

        existing = db.query(Waitlist).filter(

            Waitlist.user_id == user.id,
            Waitlist.slot_id == slot.id

        ).first()

        if not existing:

            wait = Waitlist(

                user_id=user.id,
                slot_id=slot.id,
                position=i+1,
                notified=False

            )

            db.add(wait)

    db.commit()

    print("✅ Waitlist Ready")

    # ==========================
    # INSERT NOTIFICATIONS
    # ==========================

    messages = [
        "Your booking has been confirmed.",
        "Payment received successfully.",
        "Your slot has been scheduled.",
        "Reminder: Visit the procurement centre on time.",
        "Your waitlist position has been updated.",
        "Booking completed successfully."
    ]

    for i, farmer in enumerate(farmers[:12]):

        existing = db.query(Notification).filter(
            Notification.user_id == farmer.id
        ).first()

        if not existing:

            notification = Notification(
                user_id=farmer.id,
                message=random.choice(messages),
                is_read=False
            )

            db.add(notification)

    db.commit()

    print("✅ Notifications Ready")
    print("===================================")
    print("🎉 DATABASE SEEDED SUCCESSFULLY!")
    print("===================================")

except Exception as e:

    db.rollback()
    print("❌ ERROR OCCURRED")
    print(e)

finally:

    db.close()