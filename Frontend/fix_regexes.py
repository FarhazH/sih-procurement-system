import re

with open('C:/Users/wwwfa/sih-procurement-system/Frontend/src/main.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the regexes in the entire file
# /\\b(...) becomes /\b(...)/
content = re.sub(
    r'/\\\\b\(hindi\|(.*?)\)\\\\b/i',
    r'/\\b(hindi|\1)\\b/i',
    content
)

content = re.sub(
    r'/\\\\b\(english\|(.*?)\)\\\\b/i',
    r'/\\b(english|\1)\\b/i',
    content
)

content = re.sub(
    r'/\\\\b\(farmer\|(.*?)\)\\\\b/i',
    r'/\\b(farmer|\1)\\b/i',
    content
)

content = re.sub(
    r'/\\\\b\(admin\|(.*?)\)\\\\b/i',
    r'/\\b(admin|\1)\\b/i',
    content
)

content = re.sub(
    r'/\\\\b\(operator\|(.*?)\)\\\\b/i',
    r'/\\b(operator|\1)\\b/i',
    content
)

content = re.sub(
    r'/\\\\b\(login\|(.*?)\)\\\\b/i',
    r'/\\b(login|\1)\\b/i',
    content
)

with open('C:/Users/wwwfa/sih-procurement-system/Frontend/src/main.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
