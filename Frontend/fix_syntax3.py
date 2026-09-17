import re

with open('C:/Users/wwwfa/sih-procurement-system/Frontend/src/main.jsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if line.strip().startswith("const normalizeDigits=(text)=>{"):
        new_lines.append('    const normalizeDigits=(text)=>{let value=text.toLowerCase();Object.entries(numberWords).forEach(([word,digit])=>{value=value.replace(new RegExp(`\\\\b${word}\\\\b`,"gi"),digit);});return value.replace(/\\\\D/g,"").slice(0,10);};\n')
    else:
        new_lines.append(line)

with open('C:/Users/wwwfa/sih-procurement-system/Frontend/src/main.jsx', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
