import re

with open('C:/Users/wwwfa/sih-procurement-system/Frontend/src/main.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace any variant of the hindi check
content = re.sub(
    r'if\(/\\b\(hindi\|.*?\)\\b/i\.test\(lower\)\)\{setLanguage\("hi"\);setVoiceMessage\(".*?"\);return;\}',
    'if(/\\\\b(hindi|हिन्दी|हिंदी)\\\\b/i.test(lower)){setLanguage("hi");setVoiceMessage("हिन्दी");return;}',
    content
)

# Replace any variant of the english check
content = re.sub(
    r'if\(/\\b\(english\|.*?\)\\b/i\.test\(lower\)\)\{setLanguage\("en"\);setVoiceMessage\("English"\);return;\}',
    'if(/\\\\b(english|angrezi|इंग्लिश|अंग्रेजी|अंग्रेज़ी)\\\\b/i.test(lower)){setLanguage("en");setVoiceMessage("English");return;}',
    content
)

with open('C:/Users/wwwfa/sih-procurement-system/Frontend/src/main.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
