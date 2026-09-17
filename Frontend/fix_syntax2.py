import re

with open('C:/Users/wwwfa/sih-procurement-system/Frontend/src/main.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the broken function entirely
# We'll use a regex that safely matches the whole function
content = re.sub(
    r"const normalizeDigits=\(text\)=>\{.*?\};",
    "const normalizeDigits=(text)=>{let value=text.toLowerCase();Object.entries(numberWords).forEach(([word,digit])=>{value=value.replace(new RegExp(`\\\\b${word}\\\\b`,'gi'),digit);});return value.replace(/\\\\D/g,'').slice(0,10);};",
    content
)

with open('C:/Users/wwwfa/sih-procurement-system/Frontend/src/main.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
