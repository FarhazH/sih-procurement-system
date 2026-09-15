import re

with open('C:/Users/wwwfa/sih-procurement-system/Frontend/src/main.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

voice_logic = '''
  const [listening,setListening]=useState(false);
  const [voiceMessage,setVoiceMessage]=useState("");
  const [lastFocusedField,setLastFocusedField]=useState("name");
  const recognitionRef=React.useRef(null);

  React.useEffect(()=>{
    const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SpeechRecognition){
      setVoiceMessage(t("voiceNotSupported"));
      return;
    }
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
      const spoken=(finalResults.length?finalResults[finalResults.length-1][0]:e.results[e.results.length-1][0])?.transcript?.trim()||"";
      if(!spoken)return;
      
      if(lastFocusedField==="name") setForm(prev=>({...prev,name:spoken}));
      else if(lastFocusedField==="email") setForm(prev=>({...prev,email:spoken.replace(/\\s/g,"").toLowerCase()}));
      else if(lastFocusedField==="village") setForm(prev=>({...prev,village:spoken}));
      else if(lastFocusedField==="district") setForm(prev=>({...prev,district:spoken}));
      else if(lastFocusedField==="mobile"){
        const digits=normalizeDigits(spoken);
        if(digits) setForm(prev=>({...prev,mobile:digits}));
      }
      else if(lastFocusedField==="password") setForm(prev=>({...prev,password:spoken.replace(/\\s/g,"")}));
      
      setVoiceMessage(language==="hi"?"दर्ज किया गया":"Entered");
    };
    recognition.onerror=e=>{
      if(e.error==="not-allowed") setVoiceMessage(t("voicePermission"));
      else if(e.error==="no-speech") setVoiceMessage(t("voiceNoSpeech"));
      else if(e.error==="network") setVoiceMessage(t("voiceNetworkError"));
      else setVoiceMessage(t("voiceMicError"));
      setListening(false);
    };
    recognition.onend=()=>setListening(false);
    recognitionRef.current=recognition;
    return ()=>{try{recognition.abort();}catch{} recognitionRef.current=null;};
  },[language, t, lastFocusedField]);

  const toggleVoice=async()=>{
    const recognition=recognitionRef.current;
    if(!recognition){setVoiceMessage(t("voiceNotSupported"));return;}
    if(listening){try{recognition.stop();}catch{} setListening(false);return;}
    try{if(navigator.mediaDevices?.getUserMedia) await navigator.mediaDevices.getUserMedia({audio:true});recognition.start();}catch(err){setVoiceMessage(t("voicePermission"));}
  };
  const speakHelp=()=>{
    const u=new SpeechSynthesisUtterance(t("voiceHelp"));
    u.lang=language==="hi"?"hi-IN":"en-US";
    window.speechSynthesis.speak(u);
  };
'''

voice_ui = '''
        <div className="voice-assistant-section">
          <div className="voice-assistant-main">
            <div className={"voice-mic "+(listening?"listening":"")} aria-hidden="true">🎤</div>
            <div className="voice-assistant-copy">
              <strong>{t("voiceAssistant")}</strong>
              <span>{voiceMessage||t("voiceAssistantHint")}</span>
            </div>
            <button type="button" className={"voice-button "+(listening?"active":"")} onClick={toggleVoice} aria-label={listening?t("stopVoice"):t("startVoice")}>
              {listening?"🛑":"🎙️"}
            </button>
          </div>
          <button type="button" className="voice-help-button" onClick={speakHelp}>📢 {t("voiceHelp")}</button>
        </div>
'''

# Insert logic
content = content.replace(
    '  const [submitting,setSubmitting]=useState(false);',
    '  const [submitting,setSubmitting]=useState(false);\n' + voice_logic
)

# Insert UI
content = content.replace(
    '<p className="muted">{t("registrationSubtitle")}</p>',
    '<p className="muted">{t("registrationSubtitle")}</p>\n' + voice_ui
)

# Update inputs with onFocus
content = content.replace('update("name")}', 'update("name")} onFocus={()=>setLastFocusedField("name")}')
content = content.replace('update("email")}', 'update("email")} onFocus={()=>setLastFocusedField("email")}')
content = content.replace('update("mobile")}', 'update("mobile")} onFocus={()=>setLastFocusedField("mobile")}')
content = content.replace('update("password")}', 'update("password")} onFocus={()=>setLastFocusedField("password")}')
content = content.replace('update("village")}', 'update("village")} onFocus={()=>setLastFocusedField("village")}')
content = content.replace('update("district")}', 'update("district")} onFocus={()=>setLastFocusedField("district")}')

with open('C:/Users/wwwfa/sih-procurement-system/Frontend/src/main.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Voice assistant added to Register screen")
