import re

with open('C:/Users/wwwfa/sih-procurement-system/Frontend/src/main.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix Login dependency array
content = content.replace(
    'return ()=>{try{recognition.abort();}catch{} recognitionRef.current=null;};\n  },[language,t]);',
    'return ()=>{try{recognition.abort();}catch{} recognitionRef.current=null;};\n  },[language,t,lastFocusedField]);'
)

# Fix language switching in Register
lang_switch_logic = """      const lower=spoken.toLowerCase();
      const hindi=language==="hi";
      if(/\\b(hindi|हिन्दी)\\b/i.test(lower)){setLanguage("hi");setVoiceMessage("हिन्दी");return;}
      if(/\\b(english|इंग्लिश|अंग्रेजी)\\b/i.test(lower)){setLanguage("en");setVoiceMessage("English");return;}
      if(lastFocusedField==="name")"""

content = content.replace(
    '      if(lastFocusedField==="name")',
    lang_switch_logic
)

with open('C:/Users/wwwfa/sih-procurement-system/Frontend/src/main.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
