"""Transactional email helpers for Agro Vision.

Email delivery is intentionally isolated from the API handlers and uses only
Python's standard library. Delivery failures are retried and never make a
successful booking/status/payment operation fail.
"""

import os
import smtplib
import time
from email.message import EmailMessage
from typing import Optional


def _send_email(to_email: Optional[str], subject: str, body: str) -> bool:
    if not to_email:
        return False

    host = os.getenv("SMTP_HOST")
    user = os.getenv("SMTP_USER")
    password = os.getenv("SMTP_PASSWORD")
    if not host or not user or not password:
        print("[Email] SMTP is not configured; email notification skipped.")
        return False

    try:
        port = int(os.getenv("SMTP_PORT", "587"))
    except ValueError:
        port = 587
    sender = os.getenv("SMTP_FROM") or user

    message = EmailMessage()
    message["From"] = sender
    message["To"] = to_email
    message["Subject"] = subject
    message.set_content(body)

    for attempt in range(1, 4):
        try:
            if port == 465:
                with smtplib.SMTP_SSL(host, port, timeout=15) as smtp:
                    smtp.login(user, password)
                    smtp.send_message(message)
            else:
                with smtplib.SMTP(host, port, timeout=15) as smtp:
                    smtp.ehlo()
                    smtp.starttls()
                    smtp.ehlo()
                    smtp.login(user, password)
                    smtp.send_message(message)
            print(f"[Email] Notification sent to {to_email}")
            return True
        except Exception as exc:
            print(f"[Email] Attempt {attempt}/3 failed for {to_email}: {exc}")
            if attempt < 3:
                time.sleep(2 ** (attempt - 1))
    return False



def _details(rows):
    return "\n".join(
        f"{label_en}: {value if value not in (None, '') else 'Not provided'}\n"
        f"{label_hi}: {value if value not in (None, '') else 'उपलब्ध नहीं'}"
        for label_en, label_hi, value in rows
    )


def send_booking_email(*, email, farmer_name, farmer_id, phone, village, district,
                       booking_id, token, slot_date, time_window, centre_name,
                       queue_position, crop_type, quantity, unit, pool_type):
    subject = f"Agro Vision – Booking Confirmed | Token {token}"
    body = (
        f"Dear {farmer_name},\n\n"
        "Your procurement booking has been confirmed successfully.\n"
        "आपकी खरीद बुकिंग सफलतापूर्वक पुष्टि हो गई है।\n\n"
        + _details([
            ("Farmer ID", "किसान आईडी", farmer_id),
            ("Mobile", "मोबाइल नंबर", phone),
            ("Village", "गाँव", village),
            ("District", "जिला", district),
            ("Booking ID", "बुकिंग आईडी", booking_id),
            ("Token No.", "टोकन नंबर", token),
            ("Procurement Centre", "खरीद केंद्र", centre_name),
            ("Date", "दिनांक", slot_date),
            ("Time Slot", "समय स्लॉट", time_window),
            ("Queue Position", "कतार में स्थान", queue_position),
            ("Booking Type", "बुकिंग प्रकार", pool_type.title() if pool_type else None),
            ("Crop", "फसल", crop_type),
            ("Quantity", "मात्रा", quantity),
            ("Unit", "इकाई", unit),
        ])
        + "\n\nPlease reach the procurement centre at your selected time.\n"
        "कृपया अपने निर्धारित समय पर खरीद केंद्र पर पहुँचें।\n\n"
        "Agro Vision – Smart Procurement\n"
        "एग्रो विज़न – स्मार्ट प्रोक्योरमेंट"
    )
    return _send_email(email, subject, body)


def send_waitlist_email(*, email, farmer_name, farmer_id, phone, village, district,
                        slot_id, slot_date, time_window, centre_name, waitlist_position):
    subject = "Agro Vision – You Are on the Procurement Waiting List"
    body = (
        f"Dear {farmer_name},\n\n"
        "The selected slot is currently full, so your request has been placed on the waiting list.\n"
        "चयनित स्लॉट वर्तमान में पूर्ण है, इसलिए आपका अनुरोध प्रतीक्षा सूची में रखा गया है।\n\n"
        + _details([
            ("Farmer ID", "किसान आईडी", farmer_id),
            ("Mobile", "मोबाइल नंबर", phone),
            ("Village", "गाँव", village),
            ("District", "जिला", district),
            ("Slot ID", "स्लॉट आईडी", slot_id),
            ("Procurement Centre", "खरीद केंद्र", centre_name),
            ("Date", "दिनांक", slot_date),
            ("Time Slot", "समय स्लॉट", time_window),
            ("Waiting List Position", "प्रतीक्षा सूची में स्थान", waitlist_position),
        ])
        + "\n\nYou will be notified when a slot becomes available.\n"
        "स्लॉट उपलब्ध होने पर आपको सूचित किया जाएगा।\n\n"
        "Agro Vision – Smart Procurement\n"
        "एग्रो विज़न – स्मार्ट प्रोक्योरमेंट"
    )
    return _send_email(email, subject, body)


def send_status_email(*, email, farmer_name, booking_id, token, centre_name,
                      slot_date, time_window, queue_position, status, crop_type,
                      quantity, unit):
    subject = f"Agro Vision – Booking Status Updated | Token {token}"
    body = (
        f"Dear {farmer_name},\n\n"
        "Your procurement booking status has been updated by the procurement team.\n"
        "खरीद टीम द्वारा आपकी खरीद बुकिंग की स्थिति अपडेट की गई है।\n\n"
        + _details([
            ("Booking ID", "बुकिंग आईडी", booking_id),
            ("Token No.", "टोकन नंबर", token),
            ("Procurement Centre", "खरीद केंद्र", centre_name),
            ("Date", "दिनांक", slot_date),
            ("Time Slot", "समय स्लॉट", time_window),
            ("Queue Position", "कतार में स्थान", queue_position),
            ("New Status", "नई स्थिति", status),
            ("Crop", "फसल", crop_type),
            ("Quantity", "मात्रा", quantity),
            ("Unit", "इकाई", unit),
        ])
        + "\n\nAgro Vision – Smart Procurement\n"
        "एग्रो विज़न – स्मार्ट प्रोक्योरमेंट"
    )
    return _send_email(email, subject, body)


def send_procurement_email(*, email, farmer_name, booking_id, token, centre_name,
                           slot_date, time_window, queue_position, crop_type,
                           quantity, unit, grade, final_status):
    subject = f"Agro Vision – Farmer Produce Verified | Token {token}"
    body = (
        f"Dear {farmer_name},\n\n"
        "Your farmer produce has been verified and the procurement record has been updated.\n"
        "आपकी किसान उपज का सत्यापन हो गया है और खरीद रिकॉर्ड अपडेट कर दिया गया है।\n\n"
        + _details([
            ("Booking ID", "बुकिंग आईडी", booking_id),
            ("Token No.", "टोकन नंबर", token),
            ("Procurement Centre", "खरीद केंद्र", centre_name),
            ("Date", "दिनांक", slot_date),
            ("Time Slot", "समय स्लॉट", time_window),
            ("Queue Position", "कतार में स्थान", queue_position),
            ("Crop", "फसल", crop_type),
            ("Quantity", "मात्रा", quantity),
            ("Unit", "इकाई", unit),
            ("Quality / Grade", "गुणवत्ता / ग्रेड", grade),
            ("Procurement Status", "खरीद स्थिति", final_status),
        ])
        + "\n\nAgro Vision – Smart Procurement\n"
        "एग्रो विज़न – स्मार्ट प्रोक्योरमेंट"
    )
    return _send_email(email, subject, body)


def send_payment_email(*, email, farmer_name, booking_id, token, centre_name,
                       slot_date, time_window, queue_position, payment_status,
                       amount, payment_method, transaction_id):
    subject = f"Agro Vision – Payment Status Updated | Token {token}"
    body = (
        f"Dear {farmer_name},\n\n"
        "Your procurement payment status has been updated.\n"
        "आपकी खरीद भुगतान स्थिति अपडेट की गई है।\n\n"
        + _details([
            ("Booking ID", "बुकिंग आईडी", booking_id),
            ("Token No.", "टोकन नंबर", token),
            ("Procurement Centre", "खरीद केंद्र", centre_name),
            ("Date", "दिनांक", slot_date),
            ("Time Slot", "समय स्लॉट", time_window),
            ("Queue Position", "कतार में स्थान", queue_position),
            ("Payment Status", "भुगतान स्थिति", payment_status),
            ("Amount", "राशि", amount),
            ("Payment Method", "भुगतान का तरीका", payment_method),
            ("Transaction ID", "लेन-देन आईडी", transaction_id),
        ])
        + "\n\nAgro Vision – Smart Procurement\n"
        "एग्रो विज़न – स्मार्ट प्रोक्योरमेंट"
    )
    return _send_email(email, subject, body)
