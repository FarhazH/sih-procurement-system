import re

with open('C:/Users/wwwfa/sih-procurement-system/Frontend/src/main.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r'\n  const \[listening,setListening\]=useState\(false\);.*?const speakHelp=\(\)=>{.*?window\.speechSynthesis\.speak\(u\);\n  };'

matches = list(re.finditer(pattern, content, flags=re.DOTALL))
print(f"Found {len(matches)} matches of the voice logic block")

if len(matches) > 1:
    new_content = content[:matches[1].start()]
    for i in range(1, len(matches) - 1):
        new_content += content[matches[i].end():matches[i+1].start()]
    new_content += content[matches[-1].end():]
    
    with open('C:/Users/wwwfa/sih-procurement-system/Frontend/src/main.jsx', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Cleaned up duplicated voice logic blocks!")

