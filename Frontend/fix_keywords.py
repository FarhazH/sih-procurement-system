import re

with open('C:/Users/wwwfa/sih-procurement-system/Frontend/src/main.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the trailing punctuation issue
# Replace spoken = spoken.replace(/\.$/, ""); with spoken = spoken.replace(/[\.\?।]$/, "");
content = content.replace(
    'spoken = spoken.replace(/\\.$/, "");',
    'spoken = spoken.replace(/[\\.\\?।]|\\|/g, "").trim();'
)

# Fix language keywords in Login
content = content.replace(
    'if(/\\b(hindi|हिन्दी)\\b/i.test(lower)){setLanguage("hi");setVoiceMessage("हिन्दी");return;}',
    'if(/\\b(hindi|हिन्दी|हिंदी)\\b/i.test(lower)){setLanguage("hi");setVoiceMessage("हिन्दी");return;}'
)

content = content.replace(
    'if(/\\b(english|इंग्लिश|अंग्रेजी)\\b/i.test(lower)){setLanguage("en");setVoiceMessage("English");return;}',
    'if(/\\b(english|angrezi|इंग्लिश|अंग्रेजी|अंग्रेज़ी)\\b/i.test(lower)){setLanguage("en");setVoiceMessage("English");return;}'
)

with open('C:/Users/wwwfa/sih-procurement-system/Frontend/src/main.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
