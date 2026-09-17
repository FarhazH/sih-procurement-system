import re

with open('C:/Users/wwwfa/sih-procurement-system/backend/email_service.py', 'r', encoding='utf-8') as f:
    content = f.read()

otp_func = """
def send_otp_email(*, email, farmer_name, otp):
    subject = "Agro Vision - Your OTP for Password Reset"
    body = (
        f"Dear {farmer_name},\\n\\n"
        f"Your One Time Password (OTP) to reset your password is: {otp}\\n\\n"
        "Please do not share this OTP with anyone.\\n\\n"
        "Agro Vision - Smart Procurement\\n"
    )
    return _send_email(email, subject, body)
"""

if "def send_otp_email" not in content:
    content += otp_func
    with open('C:/Users/wwwfa/sih-procurement-system/backend/email_service.py', 'w', encoding='utf-8') as f:
        f.write(content)

