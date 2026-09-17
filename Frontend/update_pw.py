import re

with open('C:/Users/wwwfa/sih-procurement-system/Frontend/src/main.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'const [error,setError]=useState("");',
    'const [error,setError]=useState("");\n  const [showPassword,setShowPassword]=useState(false);'
)

old_pw = '<div className="form-group"><label>{t("password")}</label><input type="password" value={form.password} onChange={update("password")} onFocus={()=>setLastFocusedField("password")} placeholder={t("enterPasswordYour")}/></div>'
new_pw = '<div className="form-group"><label>{t("password")}</label><div className="input-wrapper"><span className="input-icon">🔒</span><input type={showPassword?"text":"password"} value={form.password} onChange={update("password")} onFocus={()=>setLastFocusedField("password")} placeholder={t("enterPasswordYour")}/><button type="button" className="password-toggle" onClick={()=>setShowPassword(!showPassword)} aria-label={showPassword?"Hide password":"Show password"}>{showPassword?"👁":"🙈"}</button></div></div>'

content = content.replace(old_pw, new_pw)

with open('C:/Users/wwwfa/sih-procurement-system/Frontend/src/main.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
