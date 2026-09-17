import re

with open('C:/Users/wwwfa/sih-procurement-system/Frontend/src/main.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Login component's useEffect entirely with a clean one
login_use_effect = """  React.useEffect(()=>{
    const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SpeechRecognition){setVoiceMessage(t("voiceNotSupported"));return;}
    const recognition=new SpeechRecognition();
    recognition.continuous=false;
    recognition.interimResults=false;
    recognition.maxAlternatives=3;
    recognition.lang=language==="hi"?"hi-IN":"en-IN";
    const numberWords={zero:"0",one:"1",two:"2",three:"3",four:"4",five:"5",six:"6",seven:"7",eight:"8",nine:"9","शून्य":"0","एक":"1","दो":"2","तीन":"3","चार":"4","पांच":"5","पाँच":"5","छह":"6","छः":"6","सात":"7","आठ":"8","नौ":"9"};
    const normalizeDigits=(text)=>{let value=text.toLowerCase();Object.entries(numberWords).forEach(([word,digit])=>{value=value.replace(new RegExp(\\\\b\\\\b,'gi'),digit);});return value.replace(/\\D/g,"").slice(0,10);};

    recognition.onstart=()=>{setListening(true);setVoiceMessage(t("listening"));};
    recognition.onspeechend=()=>{try{recognition.stop();}catch{}};
    recognition.onresult=e=>{
      const finalResults=Array.from(e.results).filter(r=>r.isFinal);
      let spoken=(finalResults.length?finalResults[finalResults.length-1][0]:e.results[e.results.length-1][0])?.transcript?.trim()||"";
      spoken = spoken.replace(/[\\.\\?।]|\\|/g, "").trim();
      if(!spoken)return;
      const lower=spoken.toLowerCase();
      const hindi=language==="hi";
      if(/\\b(hindi|हिन्दी|हिंदी)\\b/i.test(lower)){setLanguage("hi");setVoiceMessage("हिन्दी");return;}
      if(/\\b(english|angrezi|इंग्लिश|अंग्रेजी|अंग्रेज़ी)\\b/i.test(lower)){setLanguage("en");setVoiceMessage("English");return;}
      if(/\\b(farmer|किसान)\\b/i.test(lower)){setRole("farmer");setVoiceMessage(hindi?"किसान चुना गया":"Farmer selected");return;}
      if(/\\b(admin|administrator|एडमिन)\\b/i.test(lower)){setRole("admin");setVoiceMessage(hindi?"एडमिन चुना गया":"Admin selected");return;}
      if(/\\b(operator|ऑपरेटर)\\b/i.test(lower)){setRole("operator");setVoiceMessage(hindi?"ऑपरेटर चुना गया":"Operator selected");return;}
      if(/\\b(login|log in|लॉगिन|लॉग इन)\\b/i.test(lower)){
        setVoiceMessage(hindi?"लॉगिन कर रहे हैं...":"Logging in");
        setTimeout(()=>document.getElementById("agro-login-form")?.requestSubmit(),180);
        return;
      }
      if(lastFocusedField==="mobile"){
        const digits=normalizeDigits(spoken);
        if(digits)setMobile(digits);
      }else if(lastFocusedField==="password"){
        setPassword(spoken.replace(/\\s/g,""));
      }
      setVoiceMessage(hindi?"प्रविष्ट किया गया":"Entered");
    };
    recognition.onerror=e=>{
      if(e.error==="not-allowed") setVoiceMessage(t("voicePermission"));
      else if(e.error==="no-speech") setVoiceMessage(t("voiceNoSpeech"));
      else if(e.error==="network") setVoiceMessage(t("voiceNetworkError"));
      else setVoiceMessage(t("voiceMicError"));
      setListening(false);
    };
    recognitionRef.current=recognition;
    return ()=>{try{recognition.abort();}catch{} recognitionRef.current=null;};
  },[language, t, lastFocusedField]);

  const toggleVoice=async()=>{
    const recognition=recognitionRef.current;
    if(!recognition){setVoiceMessage(t("voiceNotSupported"));return;}
    if(listening){try{recognition.stop();}catch{} setListening(false);return;}
    try{if(navigator.mediaDevices?.getUserMedia) await navigator.mediaDevices.getUserMedia({audio:true});recognition.start();}catch(err){setVoiceMessage(t("voicePermission"));}
  };"""

# Use regex to find the old useEffect and toggleVoice in Login
content = re.sub(
    r'  React\.useEffect\(\(\)=>\{.*?const toggleVoice=async\(\)=>\{.*?catch\(err\)\{.*?\}\s*\}[\s;]*\};',
    login_use_effect,
    content,
    flags=re.DOTALL
)

with open('C:/Users/wwwfa/sih-procurement-system/Frontend/src/main.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
