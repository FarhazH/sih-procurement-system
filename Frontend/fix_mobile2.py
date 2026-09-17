import re

with open('C:/Users/wwwfa/sih-procurement-system/Frontend/src/main.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'onChange={update("mobile")}',
    'onChange={e=>setForm(prev=>({...prev,mobile:e.target.value.replace(/\\D/g, "")}))}'
)

with open('C:/Users/wwwfa/sih-procurement-system/Frontend/src/main.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
