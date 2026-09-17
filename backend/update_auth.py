import re

with open('C:/Users/wwwfa/sih-procurement-system/backend/main.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Add email to auth_me
content = content.replace(
    '"state": current_user.state,\n        "farmer_registration_id"',
    '"state": current_user.state,\n        "email": current_user.email,\n        "farmer_registration_id"'
)

# Add email to login
content = content.replace(
    '"address": user.address, "farmer_registration_id": user.farmer_registration_id,',
    '"address": user.address, "email": user.email, "farmer_registration_id": user.farmer_registration_id,'
)

with open('C:/Users/wwwfa/sih-procurement-system/backend/main.py', 'w', encoding='utf-8') as f:
    f.write(content)
