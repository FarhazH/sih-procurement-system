import re

with open('C:/Users/wwwfa/sih-procurement-system/backend/main.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Add import if missing
if "send_otp_email" not in content:
    content = content.replace("from email_service import", "from email_service import send_otp_email,")

# Replace request_otp
old_func = """def request_otp(current_user: User = Depends(get_current_user)):
    if not current_user.email:
        raise HTTPException(status_code=400, detail="No email associated with this account. Please update your email first.")
    
    otp = str(random.randint(100000, 999999))
    OTP_STORE[current_user.id] = otp
    print(f"\\n[OTP GENERATED] OTP for {current_user.email} is: {otp}\\n")
    return {"message": "OTP sent to email (check backend console)"}"""

new_func = """def request_otp(current_user: User = Depends(get_current_user)):
    if not current_user.email:
        raise HTTPException(status_code=400, detail="No email associated with this account. Please update your email first.")
    
    otp = str(random.randint(100000, 999999))
    OTP_STORE[current_user.id] = otp
    print(f"\\n[OTP GENERATED] OTP for {current_user.email} is: {otp}\\n")
    
    # Send email
    try:
        from email_service import send_otp_email
        send_otp_email(email=current_user.email, farmer_name=current_user.name, otp=otp)
    except Exception as e:
        print(f"Failed to send email: {e}")
        
    return {"message": "OTP sent to email (and backend console)"}"""

content = content.replace(old_func, new_func)

with open('C:/Users/wwwfa/sih-procurement-system/backend/main.py', 'w', encoding='utf-8') as f:
    f.write(content)
