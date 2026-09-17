import re

with open('C:/Users/wwwfa/sih-procurement-system/Frontend/src/main.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'name:me.name,mobile:me.phone,village:me.village,',
    'name:me.name,email:me.email,mobile:me.phone,village:me.village,'
)

with open('C:/Users/wwwfa/sih-procurement-system/Frontend/src/main.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
