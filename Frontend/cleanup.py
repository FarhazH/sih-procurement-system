import re

with open('C:/Users/wwwfa/sih-procurement-system/Frontend/src/main.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Only replace back the unused ones, which are not inside Register.
# I'll just remove all of them and specifically put it back in Register.
content = content.replace('const [error,setError]=useState("");\n  const [showPassword,setShowPassword]=useState(false);', 'const [error,setError]=useState("");')

# Now inject specifically into Register
content = content.replace(
    'const [form,setForm]=useState({name:"",email:"",mobile:"",password:"",village:"",district:""});\n  const [error,setError]=useState("");',
    'const [form,setForm]=useState({name:"",email:"",mobile:"",password:"",village:"",district:""});\n  const [error,setError]=useState("");\n  const [showPassword,setShowPassword]=useState(false);'
)

with open('C:/Users/wwwfa/sih-procurement-system/Frontend/src/main.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
