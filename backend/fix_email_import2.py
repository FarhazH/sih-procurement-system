with open('C:/Users/wwwfa/sih-procurement-system/backend/main.py', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("from email_service import send_otp_email,\n(", "from email_service import (\n    send_otp_email,")

with open('C:/Users/wwwfa/sih-procurement-system/backend/main.py', 'w', encoding='utf-8') as f:
    f.write(content)
