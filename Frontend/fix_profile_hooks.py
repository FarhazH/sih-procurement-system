import re

with open('C:/Users/wwwfa/sih-procurement-system/Frontend/src/main.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the bad early return
content = content.replace(
    'function Profile({farmer,setFarmers,t}){\n  if (!farmer) return <div>Loading...</div>;',
    'function Profile({farmer,setFarmers,t}){'
)

# Fix the hook initialization
content = content.replace(
    'const [form, setForm] = useState({ name: farmer.name || "", email: farmer.email || "", password: "" });',
    'const [form, setForm] = useState({ name: farmer?.name || "", email: farmer?.email || "", password: "" });'
)

# Add the early return safely AFTER the hooks
content = content.replace(
    'const [passForm, setPassForm] = useState({ otp: "", newPassword: "" });',
    'const [passForm, setPassForm] = useState({ otp: "", newPassword: "" });\n\n  if (!farmer) return <div>Loading...</div>;'
)

with open('C:/Users/wwwfa/sih-procurement-system/Frontend/src/main.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
