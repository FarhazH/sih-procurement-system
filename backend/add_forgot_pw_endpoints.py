import re

with open('C:/Users/wwwfa/sih-procurement-system/backend/main.py', 'r', encoding='utf-8') as f:
    content = f.read()

new_endpoints = """
@app.post("/forgot-password-request")
def forgot_password_request(data: dict, db: Session = Depends(get_db)):
    email = data.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")
        
    user = db.query(User).filter(User.email == email).first()
    if not user:
        # We return a generic message to prevent email enumeration, but for this project 
        # it might be better to say "No user found" so the user knows.
        raise HTTPException(status_code=404, detail="No account associated with this email")
        
    otp = str(random.randint(100000, 999999))
    OTP_STORE[user.id] = otp
    print(f"\\n[OTP GENERATED - FORGOT PASSWORD] OTP for {user.email} is: {otp}\\n")
    
    try:
        from email_service import send_otp_email
        send_otp_email(email=user.email, farmer_name=user.name, otp=otp)
    except Exception as e:
        print(f"Failed to send email: {e}")
        
    return {"message": "OTP sent to your email address"}

@app.post("/forgot-password-reset")
def forgot_password_reset(data: dict, db: Session = Depends(get_db)):
    email = data.get("email")
    otp = data.get("otp")
    new_password = data.get("new_password")
    
    if not email or not otp or not new_password:
        raise HTTPException(status_code=400, detail="Email, OTP, and new password are required")
        
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if OTP_STORE.get(user.id) != str(otp):
        raise HTTPException(status_code=400, detail="Invalid OTP")
        
    user.password_hash = hash_password(new_password)
    del OTP_STORE[user.id]
    db.commit()
    
    return {"message": "Password successfully reset"}
"""

# Inject before @app.get("/auth/me")
content = content.replace('@app.get("/auth/me")', new_endpoints + '\n@app.get("/auth/me")')

with open('C:/Users/wwwfa/sih-procurement-system/backend/main.py', 'w', encoding='utf-8') as f:
    f.write(content)
