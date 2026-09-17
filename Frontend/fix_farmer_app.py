import re

with open('C:/Users/wwwfa/sih-procurement-system/Frontend/src/main.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Update FarmerApp signature
content = content.replace(
    'function FarmerApp({farmers,centres,slots,tokens,waitingList,currentFarmerId,onBookRequest,onCancelToken,onLogout,t,language,notifications,markNotificationRead,payments=[]}){',
    'function FarmerApp({farmers,setFarmers,centres,slots,tokens,waitingList,currentFarmerId,onBookRequest,onCancelToken,onLogout,t,language,notifications,markNotificationRead,payments=[]}){'
)

# Pass setFarmers to FarmerApp in App
content = content.replace(
    '<FarmerApp farmers={farmers} centres={centres} slots={slots} tokens={tokens}',
    '<FarmerApp farmers={farmers} setFarmers={setFarmers} centres={centres} slots={slots} tokens={tokens}'
)

with open('C:/Users/wwwfa/sih-procurement-system/Frontend/src/main.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
