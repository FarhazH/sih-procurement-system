import re

with open('C:/Users/wwwfa/sih-procurement-system/Frontend/src/main.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

bad_string = "new RegExp(\\\\b\\\\\\b,'gi')"
# The exact broken string could be anything depending on what PowerShell did.
# Let's use a regex to find the broken RegExp in normalizeDigits
content = re.sub(
    r"new RegExp\([^\)]*,'gi'\)",
    "new RegExp(`\\\\b${word}\\\\b`,'gi')",
    content
)

# Wait, there's another replace: .replace(/\\D/g,"") might be broken as well.
# In the error message: return value.replace(/\\D/g,"").slice(0,10);
# That one is valid JS syntax, but it might be evaluating to the wrong regex.
# Let's just rewrite the entire normalizeDigits function safely.

content = re.sub(
    r"const normalizeDigits=\(text\)=>[^;]*;[^;]*;[^;]*;",
    "const normalizeDigits=(text)=>{let value=text.toLowerCase();Object.entries(numberWords).forEach(([word,digit])=>{value=value.replace(new RegExp(`\\\\b${word}\\\\b`,'gi'),digit);});return value.replace(/\\\\D/g,\"\").slice(0,10);};",
    content
)

with open('C:/Users/wwwfa/sih-procurement-system/Frontend/src/main.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
