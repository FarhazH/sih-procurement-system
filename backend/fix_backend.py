import re

with open('C:/Users/wwwfa/sih-procurement-system/backend/main.py', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '@app.get("/auth/me")\n\nOTP_STORE',
    'OTP_STORE'
)

content = content.replace(
    '\ndef auth_me(current_user: User = Depends(get_current_user)):',
    '\n@app.get("/auth/me")\ndef auth_me(current_user: User = Depends(get_current_user)):'
)

with open('C:/Users/wwwfa/sih-procurement-system/backend/main.py', 'w', encoding='utf-8') as f:
    f.write(content)
