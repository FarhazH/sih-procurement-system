import re

with open('C:/Users/wwwfa/sih-procurement-system/Frontend/src/main.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

states_to_add = """  const [forgotMode, setForgotMode] = React.useState(false);
  const [forgotEmail, setForgotEmail] = React.useState("");
  const [forgotOtp, setForgotOtp] = React.useState("");
  const [forgotNewPassword, setForgotNewPassword] = React.useState("");
  const [forgotOtpSent, setForgotOtpSent] = React.useState(false);

  const handleForgotRequest = async (e) => {
    e.preventDefault();
    if(!forgotEmail) return alert("Please enter your registered email");
    try {
      const res = await apiRequest("/forgot-password-request", { method: "POST", body: JSON.stringify({email: forgotEmail}) });
      alert(res.message);
      setForgotOtpSent(true);
    } catch(err) { alert(err.message); }
  };

  const handleForgotReset = async (e) => {
    e.preventDefault();
    if(!forgotOtp || !forgotNewPassword) return alert("Please fill all fields");
    try {
      const res = await apiRequest("/forgot-password-reset", { method: "POST", body: JSON.stringify({email: forgotEmail, otp: forgotOtp, new_password: forgotNewPassword}) });
      alert(res.message);
      setForgotMode(false);
      setForgotOtpSent(false);
      setForgotEmail("");
      setForgotOtp("");
      setForgotNewPassword("");
    } catch(err) { alert(err.message); }
  };
"""

content = content.replace(
    '  const [lastFocusedField,setLastFocusedField]=React.useState("mobile");',
    states_to_add + '  const [lastFocusedField,setLastFocusedField]=React.useState("mobile");'
)

# Now for the JSX rendering. We have to replace the <form id="agro-login-form"> and surrounding with conditional rendering.
login_form_pattern = r'(<form id="agro-login-form" onSubmit=\{handleLogin\}>.*?</form>)'
login_form_match = re.search(login_form_pattern, content, re.DOTALL)
if not login_form_match:
    print("Could not find login form")
    exit(1)

login_form = login_form_match.group(1)
# Modify the "Forgot password?" button
login_form_modified = login_form.replace(
    'onClick={()=>alert(t("passwordRecovery"))}',
    'onClick={()=>{setForgotMode(true);setForgotOtpSent(false);}}'
)

forgot_form = """
        <form onSubmit={forgotOtpSent ? handleForgotReset : handleForgotRequest}>
          <h3 style={{marginBottom: "15px"}}>Reset Password</h3>
          <div className="form-group">
            <label>Registered Email</label>
            <div className="input-wrapper">
              <span className="input-icon">✉️</span>
              <input type="email" value={forgotEmail} onChange={e=>setForgotEmail(e.target.value)} required disabled={forgotOtpSent} placeholder="Enter your email" />
            </div>
          </div>
          {forgotOtpSent && <>
            <div className="form-group">
              <label>Enter OTP (sent to email)</label>
              <div className="input-wrapper">
                <span className="input-icon">🔑</span>
                <input type="text" value={forgotOtp} onChange={e=>setForgotOtp(e.target.value)} required placeholder="Enter 6-digit OTP" />
              </div>
            </div>
            <div className="form-group">
              <label>New Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input type="password" value={forgotNewPassword} onChange={e=>setForgotNewPassword(e.target.value)} required placeholder="Enter new password" />
              </div>
            </div>
          </>}
          <div style={{display: "flex", gap: "10px", marginTop: "20px"}}>
            <button type="submit" className="primary full">{forgotOtpSent ? "Reset Password" : "Send OTP"}</button>
            <button type="button" className="secondary full" onClick={()=>setForgotMode(false)}>Cancel</button>
          </div>
        </form>
"""

conditional_render = f"{{!forgotMode ? ({login_form_modified}) : ({forgot_form})}}"

content = content.replace(login_form, conditional_render)

# We also need to hide the register button if forgotMode is active, or we can just leave it since the user might want to register. But the user said "We also forgot to add the function of forgot password from login page". Let's hide the register-row just to be clean.
register_row_pattern = r'(<div className="register-row">.*?</div>)'
register_row_match = re.search(register_row_pattern, content, re.DOTALL)
if register_row_match:
    register_row = register_row_match.group(1)
    content = content.replace(register_row, f"{{!forgotMode && {register_row}}}")

with open('C:/Users/wwwfa/sih-procurement-system/Frontend/src/main.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Login component to include Forgot Password.")
