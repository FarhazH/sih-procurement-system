import re

with open('C:/Users/wwwfa/sih-procurement-system/Frontend/src/main.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'function Profile({farmer,setFarmers,t}){',
    'function Profile({farmer,setFarmers,t}){\n  if (!farmer) return <div>Loading...</div>;'
)

with open('C:/Users/wwwfa/sih-procurement-system/Frontend/src/main.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
