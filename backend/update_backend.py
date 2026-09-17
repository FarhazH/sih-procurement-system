import re

with open('C:/Users/wwwfa/sih-procurement-system/backend/main.py', 'r', encoding='utf-8') as f:
    content = f.read()

endpoints = """
OTP_STORE = {}
import random

@app.put("/update-profile")
def update_profile(data: dict, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if data.get("email") and data.get("email") != current_user.email:
        if not verify_password(data.get("password", ""), current_user.password_hash):
            raise HTTPException(status_code=400, detail="Incorrect password for email change")
        current_user.email = data.get("email")
    if data.get("name"):
        current_user.name = data.get("name")
    db.commit()
    return {"message": "Profile updated", "name": current_user.name, "email": current_user.email}

@app.post("/request-otp")
def request_otp(current_user: User = Depends(get_current_user)):
    if not current_user.email:
        raise HTTPException(status_code=400, detail="No email associated with this account. Please update your email first.")
    
    otp = str(random.randint(100000, 999999))
    OTP_STORE[current_user.id] = otp
    print(f"\\n[OTP GENERATED] OTP for {current_user.email} is: {otp}\\n")
    return {"message": "OTP sent to email (check backend console)"}

@app.put("/change-password")
def change_password(data: dict, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    otp = data.get("otp")
    new_password = data.get("new_password")
    if not otp or not new_password:
        raise HTTPException(status_code=400, detail="Missing OTP or new password")
    
    if OTP_STORE.get(current_user.id) != str(otp):
        raise HTTPException(status_code=400, detail="Invalid OTP")
        
    current_user.password_hash = hash_password(new_password)
    del OTP_STORE[current_user.id]
    db.commit()
    return {"message": "Password changed successfully"}

"""

content = content.replace(
    'def auth_me(current_user: User = Depends(get_current_user)):',
    endpoints + '\ndef auth_me(current_user: User = Depends(get_current_user)):'
)

with open('C:/Users/wwwfa/sih-procurement-system/backend/main.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("Backend endpoints added")
