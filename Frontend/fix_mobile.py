import re

with open('C:/Users/wwwfa/sih-procurement-system/Frontend/src/main.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix mobile input in Login
content = content.replace(
    'onChange={e=>setMobile(e.target.value)} maxLength="10"',
    'onChange={e=>setMobile(e.target.value.replace(/\\D/g, ""))} maxLength="10"'
)

# Fix mobile input in Register
content = content.replace(
    'onChange={update("mobile")} placeholder="9876543210"',
    'onChange={e=>setForm(prev=>({...prev,mobile:e.target.value.replace(/\\D/g, "")}))} placeholder="9876543210"'
)

with open('C:/Users/wwwfa/sih-procurement-system/Frontend/src/main.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
