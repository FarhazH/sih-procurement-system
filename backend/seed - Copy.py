from database import SessionLocal, engine
from models import User, Centre, Slot, Booking, Waitlist, Notification
from auth import hash_password

from sqlalchemy import text
from datetime import datetime, timedelta
import random


db = SessionLocal()


try:

    # =========================================================
    # 1. ADD MISSING COLUMNS TO EXISTING USERS TABLE
    # =========================================================

    db.execute(text("""
        ALTER TABLE users
        ADD COLUMN IF NOT EXISTS state VARCHAR(100) DEFAULT 'Rajasthan';

        ALTER TABLE users
        ADD COLUMN IF NOT EXISTS address VARCHAR(255);

        ALTER TABLE users
        ADD COLUMN IF NOT EXISTS farmer_registration_id VARCHAR(50);

        ALTER TABLE users
        ADD COLUMN IF NOT EXISTS preferred_language VARCHAR(10) DEFAULT 'en';

        ALTER TABLE users
        ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    """))

    db.commit()

    print("✅ User profile fields ready")


    # =========================================================
    # 2. ADD MISSING FIELDS TO CENTRES
    # =========================================================

    db.execute(text("""
        ALTER TABLE centres
        ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

        ALTER TABLE centres
        ADD COLUMN IF NOT EXISTS operating_status VARCHAR(30) DEFAULT 'Open';

        ALTER TABLE centres
        ADD COLUMN IF NOT EXISTS opening_time VARCHAR(20);

        ALTER TABLE centres
        ADD COLUMN IF NOT EXISTS closing_time VARCHAR(20);
    """))

    db.commit()

    print("✅ Centre status fields ready")


    # =========================================================
    # 3. ADD MISSING FIELDS TO SLOTS
    # =========================================================

    db.execute(text("""
        ALTER TABLE slots
        ADD COLUMN IF NOT EXISTS status VARCHAR(30) DEFAULT 'Available';

        ALTER TABLE slots
        ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    """))

    db.commit()

    print("✅ Slot lifecycle fields ready")


    # =========================================================
    # 4. ADD MISSING BOOKING LIFECYCLE FIELDS
    # =========================================================

    db.execute(text("""
        ALTER TABLE bookings
        ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP;

        ALTER TABLE bookings
        ADD COLUMN IF NOT EXISTS rescheduled_at TIMESTAMP;

        ALTER TABLE bookings
        ADD COLUMN IF NOT EXISTS cancellation_reason VARCHAR(255);

        ALTER TABLE bookings
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;
    """))

    db.commit()

    print("✅ Booking lifecycle fields ready")


    # =========================================================
    # 5. ADD NOTIFICATION METADATA
    # =========================================================

    db.execute(text("""
        ALTER TABLE notifications
        ADD COLUMN IF NOT EXISTS booking_id INTEGER;

        ALTER TABLE notifications
        ADD COLUMN IF NOT EXISTS payment_id INTEGER;

        ALTER TABLE notifications
        ADD COLUMN IF NOT EXISTS notification_type VARCHAR(50)
        DEFAULT 'General';

        ALTER TABLE notifications
        ADD COLUMN IF NOT EXISTS read_at TIMESTAMP;
    """))

    db.commit()

    print("✅ Notification fields ready")


    # =========================================================
    # 6. CREATE PAYMENT TABLE
    # =========================================================

    db.execute(text("""
        CREATE TABLE IF NOT EXISTS payments (

            id SERIAL PRIMARY KEY,

            booking_id INTEGER NOT NULL
                REFERENCES bookings(id),

            user_id INTEGER NOT NULL
                REFERENCES users(id),

            amount NUMERIC(12,2) NOT NULL,

            payment_method VARCHAR(50),

            transaction_id VARCHAR(100) UNIQUE,

            payment_status VARCHAR(30)
                DEFAULT 'Pending',

            paid_at TIMESTAMP,

            created_at TIMESTAMP
                DEFAULT CURRENT_TIMESTAMP
        );
    """))

    db.commit()

    print("✅ Payment table ready")


    # =========================================================
    # 7. CREATE PROCUREMENT TABLE
    # =========================================================

    db.execute(text("""
        CREATE TABLE IF NOT EXISTS procurements (

            id SERIAL PRIMARY KEY,

            booking_id INTEGER NOT NULL
                REFERENCES bookings(id),

            user_id INTEGER NOT NULL
                REFERENCES users(id),

            centre_id INTEGER NOT NULL
                REFERENCES centres(id),

            slot_id INTEGER NOT NULL
                REFERENCES slots(id),

            crop_type VARCHAR(50) NOT NULL,

            quantity INTEGER NOT NULL,

            final_status VARCHAR(30)
                DEFAULT 'Pending',

            procured_at TIMESTAMP,

            created_at TIMESTAMP
                DEFAULT CURRENT_TIMESTAMP
        );
    """))

    db.commit()

    print("✅ Procurement table ready")


    # =========================================================
    # 8. CREATE CROP MASTER
    # =========================================================

    db.execute(text("""
        CREATE TABLE IF NOT EXISTS crops (

            id SERIAL PRIMARY KEY,

            name_en VARCHAR(100) UNIQUE NOT NULL,

            name_hi VARCHAR(100) NOT NULL,

            is_active BOOLEAN DEFAULT TRUE
        );
    """))

    db.commit()

    print("✅ Crop master ready")


    # =========================================================
    # 9. CREATE CROP ADVISORY TABLE
    # =========================================================

    db.execute(text("""
        CREATE TABLE IF NOT EXISTS crop_advisories (

            id SERIAL PRIMARY KEY,

            crop_id INTEGER NOT NULL
                REFERENCES crops(id),

            state VARCHAR(100)
                DEFAULT 'Rajasthan',

            month VARCHAR(30) NOT NULL,

            demand_score INTEGER,

            recommendation_score INTEGER,

            selling_window VARCHAR(100),

            source VARCHAR(255),

            version VARCHAR(50),

            is_active BOOLEAN DEFAULT TRUE
        );
    """))

    db.commit()

    print("✅ Crop advisory table ready")


    # =========================================================
    # 10. CREATE PRICE HISTORY TABLE
    # =========================================================

    db.execute(text("""
        CREATE TABLE IF NOT EXISTS price_history (

            id SERIAL PRIMARY KEY,

            crop_id INTEGER NOT NULL
                REFERENCES crops(id),

            centre_id INTEGER
                REFERENCES centres(id),

            market VARCHAR(100),

            price NUMERIC(12,2) NOT NULL,

            unit VARCHAR(30)
                DEFAULT 'Quintal',

            recorded_at TIMESTAMP
                DEFAULT CURRENT_TIMESTAMP
        );
    """))

    db.commit()

    print("✅ Price history table ready")


    # =========================================================
    # 11. CREATE AUDIT LOG TABLE
    # =========================================================

    db.execute(text("""
        CREATE TABLE IF NOT EXISTS audit_logs (

            id SERIAL PRIMARY KEY,

            actor_id INTEGER
                REFERENCES users(id),

            action VARCHAR(100) NOT NULL,

            entity_type VARCHAR(100) NOT NULL,

            entity_id INTEGER,

            details TEXT,

            created_at TIMESTAMP
                DEFAULT CURRENT_TIMESTAMP
        );
    """))

    db.commit()

    print("✅ Audit log table ready")


    # =========================================================
    # 12. INSERT PROCUREMENT CENTRES
    # =========================================================

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


    # Update centre status

    for centre in centres:

        db.execute(
            text("""
                UPDATE centres
                SET
                    is_active = TRUE,
                    operating_status = 'Open',
                    opening_time = '09:00 AM',
                    closing_time = '05:00 PM'
                WHERE id = :id
            """),
            {"id": centre.id}
        )

    db.commit()

    print("✅ Centres Ready")


    # =========================================================
    # 13. INSERT ADMIN
    # =========================================================

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
        db.refresh(admin)

    print("✅ Admin Ready")


    # =========================================================
    # 14. INSERT FARMERS
    # =========================================================

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


    villages = [

        "Kanpur",
        "Badgaon",
        "Titardi",
        "Bhuwana",
        "Sisarma",
        "Goverdhan Vilas",
        "Sapetiya",
        "Bedla"
    ]


    farmers = []

    phone = 9000000001


    for index, name in enumerate(farmer_names):

        farmer_phone = str(phone)

        user = db.query(User).filter(
            User.phone == farmer_phone
        ).first()


        if not user:

            user = User(
                name=name,
                phone=farmer_phone,
                password_hash=hash_password("farmer123"),
                role="farmer",
                missed_count=random.randint(0, 2),

                village=villages[
                    index % len(villages)
                ],

                district="Udaipur"
            )

            db.add(user)
            db.commit()
            db.refresh(user)


        farmers.append(user)

        phone += 1


    # Update new profile fields using SQL

    for index, farmer in enumerate(farmers):

        registration_id = f"RJ-UDR-{farmer.id:04d}"

        db.execute(
            text("""
                UPDATE users
                SET
                    state = 'Rajasthan',
                    address = :address,
                    farmer_registration_id = :registration_id,
                    preferred_language = :language
                WHERE id = :id
            """),

            {
                "id": farmer.id,

                "address":
                    f"{farmer.village}, Udaipur, Rajasthan",

                "registration_id":
                    registration_id,

                "language":
                    "hi" if index % 3 == 0 else "en"
            }
        )


    db.commit()

    print("✅ Farmers Ready")


    # =========================================================
    # 15. INSERT SLOTS
    # =========================================================

    slot_data = [

        ("2026-09-10", "09:00 AM - 11:00 AM", 8, 2),
        ("2026-09-10", "11:30 AM - 01:30 PM", 8, 2),

        ("2026-09-11", "09:00 AM - 11:00 AM", 10, 3),
        ("2026-09-11", "11:30 AM - 01:30 PM", 10, 3),

        ("2026-09-12", "09:00 AM - 11:00 AM", 8, 2),
        ("2026-09-12", "11:30 AM - 01:30 PM", 8, 2),

        ("2026-09-13", "09:00 AM - 11:00 AM", 6, 2),
        ("2026-09-13", "11:30 AM - 01:30 PM", 6, 2)
    ]


    slots = []

    centre_index = 0


    for data in slot_data:

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

                general_booked=random.randint(
                    0,
                    min(4, data[2])
                ),

                priority_capacity=data[3],

                priority_booked=random.randint(
                    0,
                    min(1, data[3])
                )
            )

            db.add(slot)
            db.commit()
            db.refresh(slot)

        else:

            slot = existing


        # Update slot status

        db.execute(
            text("""
                UPDATE slots
                SET status = 'Available'
                WHERE id = :id
            """),
            {"id": slot.id}
        )


        slots.append(slot)


        centre_index += 1

        if centre_index == len(centres):

            centre_index = 0


    db.commit()

    print("✅ Slots Ready")


    # =========================================================
    # 16. INSERT BOOKINGS
    # =========================================================

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


    for index in range(12):

        user = farmers[
            index % len(farmers)
        ]

        slot = slots[
            index % len(slots)
        ]


        existing = db.query(Booking).filter(
            Booking.user_id == user.id,
            Booking.slot_id == slot.id
        ).first()


        if not existing:

            booking = Booking(

                user_id=user.id,

                slot_id=slot.id,

                agent_id=None,

                pool_type=random.choice(
                    ["general", "priority"]
                ),

                crop_type=random.choice(
                    crops
                ),

                quantity=random.randint(
                    20,
                    100
                ),

                status=random.choice(
                    booking_status
                ),

                payment_status=random.choice(
                    payment_status
                )
            )

            db.add(booking)
            db.commit()
            db.refresh(booking)


        else:

            booking = existing


        bookings.append(booking)


    print("✅ Bookings Ready")


    # =========================================================
    # 17. WAITLIST
    # =========================================================

    for index in range(3):

        user = farmers[15 + index]

        slot = slots[index]


        existing = db.query(Waitlist).filter(
            Waitlist.user_id == user.id,
            Waitlist.slot_id == slot.id
        ).first()


        if not existing:

            wait = Waitlist(

                user_id=user.id,

                slot_id=slot.id,

                position=index + 1,

                notified=False
            )

            db.add(wait)


    db.commit()

    print("✅ Waitlist Ready")


    # =========================================================
    # 18. INSERT CROP MASTER
    # =========================================================

    crop_data = [

        ("Wheat", "गेहूं"),

        ("Maize", "मक्का"),

        ("Soybean", "सोयाबीन"),

        ("Mustard", "सरसों"),

        ("Gram", "चना")
    ]


    crop_ids = {}


    for english, hindi in crop_data:

        result = db.execute(
            text("""
                SELECT id
                FROM crops
                WHERE name_en = :name
            """),
            {"name": english}
        ).fetchone()


        if result:

            crop_id = result[0]

        else:

            result = db.execute(
                text("""
                    INSERT INTO crops
                    (name_en, name_hi, is_active)
                    VALUES
                    (:name_en, :name_hi, TRUE)
                    RETURNING id
                """),

                {
                    "name_en": english,
                    "name_hi": hindi
                }
            )

            crop_id = result.fetchone()[0]

            db.commit()


        crop_ids[english] = crop_id


    print("✅ Crop Master Ready")


    # =========================================================
    # 19. CROP ADVISORY DATA
    # =========================================================

    advisory_data = [

        ("Wheat", "October", 80, 85, "November - March"),

        ("Mustard", "October", 75, 80, "November - February"),

        ("Gram", "November", 70, 78, "December - March"),

        ("Maize", "June", 72, 75, "July - October"),

        ("Soybean", "June", 82, 88, "September - November")
    ]


    for crop_name, month, demand, recommendation, window in advisory_data:

        crop_id = crop_ids[crop_name]


        existing = db.execute(
            text("""
                SELECT id
                FROM crop_advisories
                WHERE crop_id = :crop_id
                AND month = :month
            """),

            {
                "crop_id": crop_id,
                "month": month
            }
        ).fetchone()


        if not existing:

            db.execute(
                text("""
                    INSERT INTO crop_advisories
                    (
                        crop_id,
                        state,
                        month,
                        demand_score,
                        recommendation_score,
                        selling_window,
                        source,
                        version,
                        is_active
                    )

                    VALUES
                    (
                        :crop_id,
                        'Rajasthan',
                        :month,
                        :demand,
                        :recommendation,
                        :window,
                        'Demo advisory dataset',
                        'v1',
                        TRUE
                    )
                """),

                {
                    "crop_id": crop_id,
                    "month": month,
                    "demand": demand,
                    "recommendation": recommendation,
                    "window": window
                }
            )


    db.commit()

    print("✅ Rajasthan Crop Advisory Ready")


    # =========================================================
    # 20. PRICE HISTORY
    # =========================================================

    prices = {

        "Wheat": 2450,

        "Maize": 2200,

        "Soybean": 4800,

        "Mustard": 5600,

        "Gram": 6200
    }


    for crop_name, price in prices.items():

        crop_id = crop_ids[crop_name]


        existing = db.execute(
            text("""
                SELECT id
                FROM price_history
                WHERE crop_id = :crop_id
                LIMIT 1
            """),

            {"crop_id": crop_id}
        ).fetchone()


        if not existing:

            db.execute(
                text("""
                    INSERT INTO price_history
                    (
                        crop_id,
                        centre_id,
                        market,
                        price,
                        unit
                    )

                    VALUES
                    (
                        :crop_id,
                        :centre_id,
                        :market,
                        :price,
                        'Quintal'
                    )
                """),

                {
                    "crop_id": crop_id,

                    "centre_id":
                        centres[0].id,

                    "market":
                        "Udaipur Agricultural Market",

                    "price":
                        price
                }
            )


    db.commit()

    print("✅ Price History Ready")


    # =========================================================
    # 21. PAYMENT DATA
    # =========================================================

    for index, booking in enumerate(bookings):

        existing = db.execute(
            text("""
                SELECT id
                FROM payments
                WHERE booking_id = :booking_id
            """),

            {"booking_id": booking.id}
        ).fetchone()


        if not existing:

            amount = (
                (booking.quantity or 0)
                * 50
            )


            if booking.payment_status == "Paid":

                paid_at = datetime.now()

                transaction_id = (
                    f"TXN-{booking.id:05d}"
                )

            else:

                paid_at = None

                transaction_id = None


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
                        :paid_at
                    )
                """),

                {
                    "booking_id":
                        booking.id,

                    "user_id":
                        booking.user_id,

                    "amount":
                        amount,

                    "method":
                        "UPI" if booking.payment_status == "Paid"
                        else None,

                    "transaction_id":
                        transaction_id,

                    "status":
                        booking.payment_status,

                    "paid_at":
                        paid_at
                }
            )


    db.commit()

    print("✅ Payment Data Ready")


    # =========================================================
    # 22. PROCUREMENT DATA
    # =========================================================

    for booking in bookings:

        if booking.status != "Completed":

            continue


        existing = db.execute(
            text("""
                SELECT id
                FROM procurements
                WHERE booking_id = :booking_id
            """),

            {"booking_id": booking.id}
        ).fetchone()


        if existing:

            continue


        slot = db.query(Slot).filter(
            Slot.id == booking.slot_id
        ).first()


        if not slot:

            continue


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
                    :procured_at
                )
            """),

            {
                "booking_id":
                    booking.id,

                "user_id":
                    booking.user_id,

                "centre_id":
                    slot.centre_id,

                "slot_id":
                    booking.slot_id,

                "crop_type":
                    booking.crop_type or "Unknown",

                "quantity":
                    booking.quantity or 0,

                "procured_at":
                    datetime.now()
            }
        )


    db.commit()

    print("✅ Procurement Data Ready")


    # =========================================================
    # 23. NOTIFICATIONS
    # =========================================================

    messages = [

        "Your booking has been confirmed.",

        "Payment received successfully.",

        "Your slot has been scheduled.",

        "Reminder: Visit the procurement centre on time.",

        "Your waitlist position has been updated.",

        "Booking completed successfully."
    ]


    for index, farmer in enumerate(
        farmers[:12]
    ):

        existing = db.query(
            Notification
        ).filter(
            Notification.user_id == farmer.id
        ).first()


        if not existing:

            notification = Notification(

                user_id=farmer.id,

                message=random.choice(
                    messages
                ),

                is_read=False
            )

            db.add(notification)


    db.commit()

    print("✅ Notifications Ready")


    # =========================================================
    # 24. AUDIT LOG SAMPLE DATA
    # =========================================================

    existing_logs = db.execute(
        text("""
            SELECT COUNT(*)
            FROM audit_logs
        """)
    ).scalar()


    if existing_logs == 0:

        db.execute(
            text("""
                INSERT INTO audit_logs
                (
                    actor_id,
                    action,
                    entity_type,
                    entity_id,
                    details
                )

                VALUES
                (
                    :actor_id,
                    'SEED_DATABASE',
                    'SYSTEM',
                    NULL,
                    'Initial demo database setup'
                )
            """),

            {
                "actor_id":
                    admin.id
            }
        )


        db.commit()


    print("✅ Audit Log Ready")


    # =========================================================
    # FINAL MESSAGE
    # =========================================================

    print()
    print("==========================================")
    print("🎉 DATABASE SEEDED SUCCESSFULLY!")
    print("==========================================")
    print("✅ Farmers")
    print("✅ Admin")
    print("✅ Centres")
    print("✅ Slots")
    print("✅ Bookings")
    print("✅ Waitlist")
    print("✅ Notifications")
    print("✅ Payment details")
    print("✅ Procurement details")
    print("✅ Crop master")
    print("✅ Rajasthan crop advisory")
    print("✅ Price history")
    print("✅ Centre status")
    print("✅ Slot lifecycle")
    print("✅ Farmer profile fields")
    print("✅ Language preference")
    print("✅ Audit logs")
    print("==========================================")


except Exception as e:

    db.rollback()

    print()
    print("❌ ERROR OCCURRED")
    print("------------------------------------------")
    print(e)
    print("------------------------------------------")


finally:

    db.close()