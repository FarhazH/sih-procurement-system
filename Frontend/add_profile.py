import re

with open('C:/Users/wwwfa/sih-procurement-system/Frontend/src/main.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Profile route
content = content.replace(
    '{page==="profile"&&<Profile farmer={currentFarmer} t={t}/>}',
    '{page==="profile"&&<Profile farmer={currentFarmer} setFarmers={setFarmers} t={t}/>}'
)

new_profile = """function Profile({farmer,setFarmers,t}){
  const [editMode, setEditMode] = useState(false);
  const [passMode, setPassMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [form, setForm] = useState({ name: farmer.name || "", email: farmer.email || "", password: "" });
  const [passForm, setPassForm] = useState({ otp: "", newPassword: "" });

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await apiRequest("/update-profile", { method: "PUT", body: JSON.stringify(form) });
      alert(res.message);
      setFarmers(prev => prev.map(f => f.id === farmer.id ? { ...f, name: res.name, email: res.email } : f));
      setEditMode(false);
    } catch(err) { alert(err.message); }
  };

  const requestOtp = async () => {
    try {
      const res = await apiRequest("/request-otp", { method: "POST" });
      alert(res.message);
      setOtpSent(true);
    } catch(err) { alert(err.message); }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    try {
      const res = await apiRequest("/change-password", { method: "PUT", body: JSON.stringify({ otp: passForm.otp, new_password: passForm.newPassword }) });
      alert(res.message);
      setPassMode(false);
      setOtpSent(false);
      setPassForm({otp: "", newPassword: ""});
    } catch(err) { alert(err.message); }
  };

  return <section><PageHead title={t("profile")} text={t("registeredFarmerInfo")}/><Card>
    {!editMode && !passMode && <>
      <InfoGrid data={{[t("farmerId")]:farmer.displayId||farmer.id,[t("name")]:farmer.name,"Email":farmer.email||"Not set",[t("mobileNumber")]:farmer.mobile,[t("village")]:farmer.village,[t("district")]:farmer.district,[t("accountStatus")]:farmer.status}}/>
      <div style={{marginTop: "20px", display: "flex", gap: "10px"}}>
        <button className="primary" onClick={() => {setForm({name: farmer.name, email: farmer.email || "", password: ""}); setEditMode(true);}}>Edit Profile</button>
        <button className="secondary" onClick={() => setPassMode(true)}>Change Password</button>
      </div>
    </>}
    
    {editMode && <form onSubmit={updateProfile}>
      <h3>Edit Profile</h3>
      <div className="form-group"><label>{t("name")}</label><input value={form.name} onChange={e=>setForm({...form, name: e.target.value})} required/></div>
      <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={e=>setForm({...form, email: e.target.value})} required/></div>
      {form.email !== farmer.email && <div className="form-group"><label>Current Password (required for email change)</label><input type="password" value={form.password} onChange={e=>setForm({...form, password: e.target.value})} required/></div>}
      <div style={{marginTop: "20px", display: "flex", gap: "10px"}}>
        <button type="submit" className="primary">Save Changes</button>
        <button type="button" className="secondary" onClick={() => setEditMode(false)}>Cancel</button>
      </div>
    </form>}

    {passMode && <div>
      <h3>Change Password</h3>
      {!otpSent ? <div>
        <p>We will send an OTP to your registered email address ({farmer.email || "Not set"}).</p>
        <div style={{marginTop: "20px", display: "flex", gap: "10px"}}>
          <button className="primary" onClick={requestOtp}>Send OTP</button>
          <button className="secondary" onClick={() => setPassMode(false)}>Cancel</button>
        </div>
      </div> : <form onSubmit={changePassword}>
        <div className="form-group"><label>Enter OTP (check backend console)</label><input value={passForm.otp} onChange={e=>setPassForm({...passForm, otp: e.target.value})} required /></div>
        <div className="form-group"><label>New Password</label><input type="password" value={passForm.newPassword} onChange={e=>setPassForm({...passForm, newPassword: e.target.value})} required /></div>
        <div style={{marginTop: "20px", display: "flex", gap: "10px"}}>
          <button type="submit" className="primary">Update Password</button>
          <button type="button" className="secondary" onClick={() => {setPassMode(false); setOtpSent(false);}}>Cancel</button>
        </div>
      </form>}
    </div>}
  </Card></section>
}"""

old_profile = 'function Profile({farmer,t}){return <section><PageHead title={t("profile")} text={t("registeredFarmerInfo")}/><Card><InfoGrid data={{[t("farmerId")]:farmer.displayId||farmer.id,[t("name")]:farmer.name,[t("mobileNumber")]:farmer.mobile,[t("village")]:farmer.village,[t("district")]:farmer.district,[t("accountStatus")]:farmer.status}}/></Card></section>}'

content = content.replace(old_profile, new_profile)

with open('C:/Users/wwwfa/sih-procurement-system/Frontend/src/main.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
