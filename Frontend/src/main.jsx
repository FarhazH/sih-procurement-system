import React, {useState, useEffect} from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from "recharts";

import {createRoot} from "react-dom/client";
import "./styles.css";

// ================= LANGUAGE TRANSLATIONS =================

const translations = {
  en: {
    english: "English",
    hindi: "हिंदी",

    smartProcurement: "Smart Procurement",
    agroVision: "Agro Vision",
    agroVisionSubtitle: "Farmer Procurement & Tracking System",
    smartProcurementTagline: "Smart Procurement for Smart Farmers",

    // Common
    logout: "Logout",
    login: "Login",
    register: "Register",
    save: "Save",
    cancel: "Cancel",
    submit: "Submit",
    search: "Search",
    status: "Status",
    date: "Date",
    time: "Time",

    // Farmer Sidebar
    dashboard: "Dashboard",
    profile: "My Profile",
    produce: "My Produce",
    bookToken: "Book Token",
    queue: "Queue & Status",
    payment: "Payment Status",
    notifications: "Notifications",
    howToUse: "How to Use Agro Vision",
    howToUseDesc: "Watch this simple demonstration to learn how to use the Agro Vision Smart Procurement platform.",

    // Farmer Dashboard
    farmerDashboard: "Farmer Dashboard",
    welcome: "Welcome back, Farmer!",
    quickActions: "Quick Actions",
    bookNewToken: "Book New Token",
    viewQueue: "View Queue",
    checkPayment: "Check Payment",

    // Procurement
    procurementCentre: "Procurement Centre",
    selectCentre: "Select Procurement Centre",
    availableCentres: "Available Procurement Centres",
    bookYourToken: "Book Your Token",
    selectDate: "Select Date",
    selectTime: "Select Time Slot",
    confirmBooking: "Confirm Booking",

    // Queue
    queueStatus: "Queue & Procurement Status",
    tokenNumber: "Token Number",
    queuePosition: "Queue Position",
    estimatedWait: "Estimated Waiting Time",
    procurementStatus: "Procurement Status",
    waiting: "Waiting",
    inProgress: "In Progress",
    completed: "Completed",

    // Payment
    paymentStatus: "Payment Status",
    paymentPending: "Payment Pending",
    paymentCompleted: "Payment Completed",
    amount: "Amount",
    paymentDate: "Payment Date",

    // Notifications
    notificationTitle: "Notifications",
    bookingConfirmation: "Booking Confirmation",
    scheduleUpdate: "Schedule Update",
    procurementUpdate: "Procurement Update",
    paymentNotification: "Payment Notification",

    // Admin
    adminDashboard: "Admin Dashboard",
    operatorPortal: "Operator Portal",
    registeredFarmers: "Registered Farmers",
    procurementCentres: "Procurement Centres",
    todaysTokens: "Today's Tokens",
    completedProcurement: "Completed Procurement",
    produceVerification: "Produce Verification",
    adminPaymentStatus: "Payment Status",
    statistics: "Centre Statistics",
    analysisReports: "Analysis & Reports",
    analysisReports: "Analysis & Reports",
    analyzeCropData: "Analyze crop registration and procurement data",

    totalRegistered: "Total Registered",
    totalPurchased: "Total Purchased",
    totalQuantity: "Total Quantity",
    totalCrops: "Total Crops",

    farmers: "Farmers",
    kg: "Kg",
    cropCategories: "Crop Categories",

    cropWiseProcurement: "Crop-wise Procurement",
    cropProcurementDescription:
      "Quantity of different crops purchased at procurement centres.",

    registeredVsPurchased: "Registered vs Purchased Farmers",
    registeredVsPurchasedDescription:
      "Comparison of registered farmers and farmers whose crops were actually purchased.",

    procurementTrend: "Procurement Trend",
    procurementTrendDescription:
      "Monthly procurement quantity across all centres.",

    // Login
    welcomeTo: "Welcome to",
    farmerProcurement: "Farmer Procurement Portal",
    mobileNumber: "Mobile Number",
    password: "Password",
    enterMobile: "Enter mobile number",
    enterPassword: "Enter password",
    loginAsFarmer: "Login as Farmer",
    loginAsAdmin: "Login as Admin",
    dontHaveAccount: "Don't have an account?",
    createAccount: "Create Account",

    // Alerts
    loginSuccess: "Login successful!",
    bookingSuccess: "Token booked successfully!",
    selectRequired: "Please select all required fields.",
    farmerPortal:"Farmer Portal", smartFarmers:"for Smart Farmers", loginDescription:"A digital step towards transparent, efficient and farmer-friendly procurement.", easyToken:"Easy Token Booking", easyTokenDesc:"Book your procurement token in just a few clicks.", realQueue:"Real-time Queue Status", realQueueDesc:"Track your queue position and procurement status.", secureTransparent:"Secure & Transparent", secureTransparentDesc:"Complete transparency throughout the procurement process.", empowering:"Empowering farmers, strengthening agriculture.", welcomeBack:"Welcome Back!", loginContinue:"Login to continue to your account", farmer:"Farmer", admin:"Admin", enterMobileYour:"Enter your mobile number", enterPasswordYour:"Enter your password", remember:"Remember me", passwordRecovery:"Password recovery will be connected to the backend.", forgot:"Forgot password?", happyFarmers:"Happy Farmers", tokensBooked:"Tokens Booked", transparency:"Transparency", enterCredentials:"Please enter mobile number and password.", voiceAssistant:"Voice Assistant", voiceAssistantHint:"Use your voice to fill the login form or say Login.", listening:"Listening...", startVoice:"Start Voice Assistant", stopVoice:"Stop Voice Assistant", voiceNotSupported:"Voice input is not supported in this browser. Please use Chrome or Edge.", voiceHelp:"Say Hindi, English, Farmer, Admin, or Login. You can also dictate your mobile number and password.", voicePermission:"Microphone permission is blocked. Allow microphone access for localhost in Chrome and try again.", voiceMicError:"Microphone could not be accessed. Check your microphone and browser permissions.", voiceNoSpeech:"No speech was detected. Press the microphone and speak clearly.", voiceNetworkError:"Voice recognition could not reach the speech service. Check your internet connection and try again.", welcomeComma:"Welcome,", manageActivities:"Manage your procurement activities from one place.", activeToken:"Active Token", notSelected:"Not selected", currentStatus:"Current Procurement Status", pending:"Pending", tokenBooked:"Token Booked", produceReached:"Produce Reached Centre", qualityVerification:"Quality Verification", procurementCompleted:"Procurement Completed", paymentProcessed:"Payment Processed", registeredFarmerInfo:"Your registered farmer information.", farmerId:"Farmer ID", name:"Name", village:"Village", district:"District", crop:"Crop", quantity:"Quantity", accountStatus:"Account Status", produceDetails:"Produce Details", produceSubmitted:"Details of produce submitted for procurement.", centre:"Centre", verification:"Verification", bookProcurementToken:"Book Procurement Token", selectCentreDateTime:"Select a centre, date and available time slot.", selectProcurementCentre:"Select Procurement Centre", capacity:"Capacity", tokens:"tokens", open:"Open", full:"Full", selectDateTime:"Select Date & Time", availableTimeSlot:"Available Time Slot", queueStatus:"Queue & Procurement Status", trackProgress:"Track your current procurement progress.", yourToken:"Your Token", timeSlot:"Time Slot", noToken:"No token booked yet. Go to Book Token.", procurementTimeline:"Procurement Timeline", tokenConfirmed:"Token Confirmed", inQueue:"In Queue", verification:"Verification", procured:"Procured", payment:"Payment", trackPayment:"Track your procurement payment.", paymentPending:"Payment Pending", paymentUpdateAfter:"Your payment will be updated after procurement is completed.", expectedAmount:"Expected Amount", paymentMethod:"Payment Method", bankTransfer:"Bank Transfer", importantUpdates:"Important updates about your procurement.", note1:"Your token T1001 is confirmed.", note2:"Your procurement centre is open today.", note3:"Queue position updated to #4.", note4:"Payment status is currently pending.", today:"Today", adminCentre:"Admin / Centre", centralizedManagement:"Centralized procurement-centre management.", completedProcurement:"Completed Procurement", pendingPayments:"Pending Payments", centreWiseCapacity:"Centre-wise Capacity", location:"Location", capacityOnly:"Capacity", recentTokens:"Recent Tokens", viewManageRecords:"View and manage farmer records.", searchFarmer:"🔎 Search farmer by name or ID...", manageCapacity:"Manage centre capacity and availability.", tokensUsedToday:"tokens used today", toggleStatus:"Toggle Status", manageQueue:"Manage the queue at procurement centres.", verifyProduce:"Verify farmer produce before procurement.", quality:"Quality", action:"Action", verify:"Verify", monitorPayments:"Monitor procurement payments.", procurementAmount:"Procurement Amount", processed:"Processed"
  },

  hi: {
    english: "English",
    hindi: "हिंदी",

    smartProcurement: "स्मार्ट प्रोक्योरमेंट",
    agroVision: "एग्रो विज़न",
    agroVisionSubtitle: "किसान खरीद एवं ट्रैकिंग प्रणाली",
    smartProcurementTagline: "स्मार्ट किसानों के लिए स्मार्ट प्रोक्योरमेंट",

    // Common
    logout: "लॉगआउट",
    login: "लॉगिन",
    register: "पंजीकरण",
    save: "सहेजें",
    cancel: "रद्द करें",
    submit: "जमा करें",
    search: "खोजें",
    status: "स्थिति",
    date: "दिनांक",
    time: "समय",

    // Farmer Sidebar
    dashboard: "डैशबोर्ड",
    profile: "मेरी प्रोफ़ाइल",
    produce: "मेरी उपज",
    bookToken: "टोकन बुक करें",
    queue: "कतार और स्थिति",
    payment: "भुगतान स्थिति",
    notifications: "सूचनाएं",

    // Farmer Dashboard
    farmerDashboard: "किसान डैशबोर्ड",
    welcome: "स्वागत है, किसान!",
    quickActions: "त्वरित कार्य",
    bookNewToken: "नया टोकन बुक करें",
    viewQueue: "कतार देखें",
    checkPayment: "भुगतान देखें",

    // Procurement
    procurementCentre: "खरीद केंद्र",
    selectCentre: "खरीद केंद्र चुनें",
    availableCentres: "उपलब्ध खरीद केंद्र",
    bookYourToken: "अपना टोकन बुक करें",
    selectDate: "दिनांक चुनें",
    selectTime: "समय स्लॉट चुनें",
    confirmBooking: "बुकिंग की पुष्टि करें",

    // Queue
    queueStatus: "कतार और खरीद स्थिति",
    tokenNumber: "टोकन नंबर",
    queuePosition: "कतार में स्थान",
    estimatedWait: "अनुमानित प्रतीक्षा समय",
    procurementStatus: "खरीद स्थिति",
    waiting: "प्रतीक्षा में",
    inProgress: "प्रगति पर",
    completed: "पूर्ण",

    // Payment
    paymentStatus: "भुगतान स्थिति",
    paymentPending: "भुगतान लंबित",
    paymentCompleted: "भुगतान पूर्ण",
    amount: "राशि",
    paymentDate: "भुगतान दिनांक",

    // Notifications
    notificationTitle: "सूचनाएं",
    bookingConfirmation: "बुकिंग की पुष्टि",
    scheduleUpdate: "समय-सारणी अपडेट",
    procurementUpdate: "खरीद अपडेट",
    paymentNotification: "भुगतान सूचना",

    // Admin
    adminDashboard: "एडमिन डैशबोर्ड",
    operatorPortal: "ऑपरेटर पोर्टल",
    registeredFarmers: "पंजीकृत किसान",
    procurementCentres: "खरीद केंद्र",
    todaysTokens: "आज के टोकन",
    completedProcurement: "पूर्ण खरीद",
    produceVerification: "उपज सत्यापन",
    adminPaymentStatus: "भुगतान स्थिति",
    statistics: "केंद्र के आंकड़े",
    analysisReports: "विश्लेषण और रिपोर्ट",
    analysisReports: "विश्लेषण और रिपोर्ट",
    analyzeCropData: "फसल पंजीकरण और खरीद डेटा का विश्लेषण करें",

    totalRegistered: "कुल पंजीकृत",
    totalPurchased: "कुल खरीदी गई",
    totalQuantity: "कुल मात्रा",
    totalCrops: "कुल फसलें",

    farmers: "किसान",
    kg: "किलोग्राम",
    cropCategories: "फसल श्रेणियाँ",

    cropWiseProcurement: "फसल-वार खरीद",
    cropProcurementDescription:
      "खरीद केंद्रों पर खरीदी गई विभिन्न फसलों की मात्रा।",

    registeredVsPurchased: "पंजीकृत बनाम खरीदे गए किसान",
    registeredVsPurchasedDescription:
      "पंजीकृत किसानों और जिन किसानों की फसल वास्तव में खरीदी गई, उनकी तुलना।",

    procurementTrend: "खरीद की प्रवृत्ति",
    procurementTrendDescription:
      "सभी खरीद केंद्रों पर मासिक खरीद की मात्रा।",


    // Login
    welcomeTo: "स्वागत है",
    farmerProcurement: "किसान खरीद पोर्टल",
    mobileNumber: "मोबाइल नंबर",
    password: "पासवर्ड",
    enterMobile: "मोबाइल नंबर दर्ज करें",
    enterPassword: "पासवर्ड दर्ज करें",
    loginAsFarmer: "किसान के रूप में लॉगिन",
    loginAsAdmin: "एडमिन के रूप में लॉगिन",
    dontHaveAccount: "खाता नहीं है?",
    createAccount: "खाता बनाएं",

    // Alerts
    loginSuccess: "लॉगिन सफल!",
    bookingSuccess: "टोकन सफलतापूर्वक बुक हो गया!",
    selectRequired: "कृपया सभी आवश्यक जानकारी चुनें।",
    farmerPortal:"किसान पोर्टल", smartFarmers:"स्मार्ट किसानों के लिए", loginDescription:"पारदर्शी, कुशल और किसान-अनुकूल खरीद की दिशा में एक डिजिटल कदम।", easyToken:"आसान टोकन बुकिंग", easyTokenDesc:"कुछ ही क्लिक में अपना खरीद टोकन बुक करें।", realQueue:"रियल-टाइम कतार स्थिति", realQueueDesc:"अपनी कतार और खरीद की स्थिति ट्रैक करें।", secureTransparent:"सुरक्षित और पारदर्शी", secureTransparentDesc:"पूरी खरीद प्रक्रिया में पूर्ण पारदर्शिता।", empowering:"किसानों को सशक्त बनाना, कृषि को मजबूत करना।", welcomeBack:"वापसी पर स्वागत है!", loginContinue:"अपने खाते में जारी रखने के लिए लॉगिन करें", farmer:"किसान", admin:"एडमिन", enterMobileYour:"अपना मोबाइल नंबर दर्ज करें", enterPasswordYour:"अपना पासवर्ड दर्ज करें", remember:"मुझे याद रखें", passwordRecovery:"पासवर्ड रिकवरी बैकएंड से जोड़ी जाएगी।", forgot:"पासवर्ड भूल गए?", happyFarmers:"खुश किसान", tokensBooked:"बुक किए गए टोकन", transparency:"पारदर्शिता", enterCredentials:"कृपया मोबाइल नंबर और पासवर्ड दर्ज करें।", voiceAssistant:"वॉइस असिस्टेंट", voiceAssistantHint:"लॉगिन फॉर्म भरने या लॉगिन कहने के लिए अपनी आवाज़ का उपयोग करें।", listening:"सुन रहा है...", startVoice:"वॉइस असिस्टेंट शुरू करें", stopVoice:"वॉइस असिस्टेंट बंद करें", voiceNotSupported:"इस ब्राउज़र में वॉइस इनपुट समर्थित नहीं है। कृपया Chrome या Edge का उपयोग करें।", voiceHelp:"हिंदी, अंग्रेज़ी, किसान, एडमिन या लॉगिन कहें। आप मोबाइल नंबर और पासवर्ड भी बोलकर दर्ज कर सकते हैं।", voicePermission:"माइक्रोफ़ोन की अनुमति बंद है। Chrome में localhost के लिए माइक्रोफ़ोन की अनुमति दें और फिर प्रयास करें।", voiceMicError:"माइक्रोफ़ोन उपलब्ध नहीं है। माइक्रोफ़ोन और ब्राउज़र की अनुमति जाँचें।", voiceNoSpeech:"आवाज़ नहीं मिली। माइक्रोफ़ोन दबाकर स्पष्ट बोलें।", voiceNetworkError:"वॉइस पहचान सेवा से कनेक्शन नहीं हो पाया। इंटरनेट कनेक्शन जाँचें और फिर प्रयास करें।", welcomeComma:"स्वागत है,", manageActivities:"अपनी खरीद गतिविधियों को एक ही स्थान से प्रबंधित करें।", activeToken:"सक्रिय टोकन", notSelected:"चयन नहीं किया गया", currentStatus:"वर्तमान खरीद स्थिति", pending:"लंबित", tokenBooked:"टोकन बुक हुआ", produceReached:"उपज केंद्र पर पहुंची", qualityVerification:"गुणवत्ता सत्यापन", procurementCompleted:"खरीद पूर्ण", paymentProcessed:"भुगतान संसाधित", registeredFarmerInfo:"आपकी पंजीकृत किसान जानकारी।", farmerId:"किसान आईडी", name:"नाम", village:"गांव", district:"जिला", crop:"फसल", quantity:"मात्रा", accountStatus:"खाता स्थिति", produceDetails:"उपज विवरण", produceSubmitted:"खरीद के लिए जमा की गई उपज का विवरण।", centre:"केंद्र", verification:"सत्यापन", bookProcurementToken:"खरीद टोकन बुक करें", selectCentreDateTime:"केंद्र, दिनांक और उपलब्ध समय स्लॉट चुनें।", selectProcurementCentre:"खरीद केंद्र चुनें", capacity:"क्षमता", tokens:"टोकन", open:"खुला", full:"पूर्ण", selectDateTime:"दिनांक और समय चुनें", availableTimeSlot:"उपलब्ध समय स्लॉट", queueStatus:"कतार और खरीद स्थिति", trackProgress:"अपनी वर्तमान खरीद प्रगति ट्रैक करें।", yourToken:"आपका टोकन", timeSlot:"समय स्लॉट", noToken:"अभी कोई टोकन बुक नहीं है। टोकन बुक करें पर जाएं।", procurementTimeline:"खरीद प्रक्रिया", tokenConfirmed:"टोकन की पुष्टि", inQueue:"कतार में", verification:"सत्यापन", procured:"खरीद पूर्ण", payment:"भुगतान", trackPayment:"अपने खरीद भुगतान को ट्रैक करें।", paymentPending:"भुगतान लंबित", paymentUpdateAfter:"खरीद पूरी होने के बाद आपका भुगतान अपडेट किया जाएगा।", expectedAmount:"अपेक्षित राशि", paymentMethod:"भुगतान विधि", bankTransfer:"बैंक ट्रांसफर", importantUpdates:"आपकी खरीद से संबंधित महत्वपूर्ण अपडेट।", note1:"आपका टोकन T1001 पुष्ट है।", note2:"आपका खरीद केंद्र आज खुला है।", note3:"कतार की स्थिति #4 पर अपडेट हुई।", note4:"भुगतान स्थिति अभी लंबित है।", today:"आज", adminCentre:"एडमिन / केंद्र", centralizedManagement:"केंद्रीकृत खरीद-केंद्र प्रबंधन।", completedProcurement:"पूर्ण खरीद", pendingPayments:"लंबित भुगतान", centreWiseCapacity:"केंद्र-वार क्षमता", location:"स्थान", capacityOnly:"क्षमता", recentTokens:"हाल के टोकन", viewManageRecords:"किसान रिकॉर्ड देखें और प्रबंधित करें।", searchFarmer:"🔎 नाम या आईडी से किसान खोजें...", manageCapacity:"केंद्र की क्षमता और उपलब्धता प्रबंधित करें।", tokensUsedToday:"आज उपयोग किए गए टोकन", toggleStatus:"स्थिति बदलें", manageQueue:"खरीद केंद्रों की कतार प्रबंधित करें।", verifyProduce:"खरीद से पहले किसान की उपज सत्यापित करें।", quality:"गुणवत्ता", action:"कार्यवाही", verify:"सत्यापित करें", monitorPayments:"खरीद भुगतान की निगरानी करें।", procurementAmount:"खरीद राशि", processed:"प्रसंस्कृत"
  }
};


// Additional farmer-facing translations kept separate so the existing demo data/translation
// structure remains intact while every new control is available in English and Hindi.
const extraTranslations = {
  en: {
    cancelBooking: "Cancel Booking", cancelBookingTitle: "Cancel your booking",
    cancelBookingDesc: "Choose an active booking and cancel it only if you no longer need the slot.",
    cancelBookingConfirm: "Are you sure you want to cancel this booking?",
    confirmCancel: "Yes, Cancel Booking", keepBooking: "Keep Booking",
    bookingCancelled: "Booking cancelled successfully.", noActiveBooking: "You do not have an active booking to cancel.",
    analysis: "Analysis", reports: "Reports", analysisTitle: "Farmer Analysis",
    analysisDesc: "Simple graphs to understand payments and crop procurement history.",
    reportsTitle: "Farmer Reports", reportsDesc: "A clear summary of your procurement, payment and crop history.",
    paymentHistory: "Payment History", paymentHistoryDesc: "Payments received and pending over time.",
    cropSalesHistory: "Crop Procurement History", cropSalesHistoryDesc: "How much crop you have sold to the Procurement Centre.",
    received: "Received", pendingAmount: "Pending Amount", totalCropSold: "Total Crop Sold",
    totalPayments: "Total Payments", transactions: "Transactions", quantitySold: "Quantity Sold (Kg)",
    crop: "Crop", month: "Month", amount: "Amount (₹)", printReport: "Print / Save Report", generateReport: "Generate Report", reportGenerated: "Report is ready. Use Print → Save as PDF to save it.", adminReportTitle: "Admin Procurement Analysis Report", adminReportDesc: "Summary of procurement, farmer registration and crop performance.", paymentChart: "Payment Status & History", cropChart: "Crop Procurement / Sales History", reportIncludesGraphs: "This report includes the same graphs shown in Analysis.", farmerCompleteReport:"Complete Farmer Report", farmerCompleteReportDesc:"Farmer details, purchasing details and analysis graphs.", farmerDetails:"Farmer Details", purchasingDetails:"Purchasing Details", noPurchasingDetails:"No purchasing details available.", paymentDetails:"Payment Details", allFarmerDetails:"All Farmer Details", allPurchasingDetails:"All Purchasing Details", adminPaymentDetails:"All Payment Details",
    reportReady: "Use your browser's Print → Save as PDF option to save this report.",
    demoDataNote: "Demo data is shown here and can be connected to your real backend/API later.",
    activeBooking: "Active Booking", cancelled: "Cancelled", cancelAction: "Cancel this booking",
    videoUnavailable: "Demonstration video will appear here when the video file is added.",
    howToUseEnglish: "How to Use Agro Vision", howToUseHindi: "एग्रो विज़न का उपयोग कैसे करें",
    videoEnglish: "English demonstration", videoHindi: "Hindi demonstration",
    watchDemo: "Watch this simple demonstration to learn how to use Agro Vision.",
    systemReady: "Simple, clear and farmer-friendly", feedback: "Feedback", feedbackTitle: "Share Your Feedback", feedbackDesc: "Tell us how Agro Vision can serve you better.", rating: "Rating", comments: "Comments", feedbackCategory: "Category (Optional)", selectCategory: "Select a category", categoryBooking: "Booking", categoryPayment: "Payment", categoryCentre: "Procurement Centre", categoryApp: "Website / App", categoryOther: "Other", feedbackPlaceholder: "Write your feedback here...", feedbackSuccess: "Thank you! Your feedback has been submitted.", callAdmin: "Call Admin", callAdminDesc: "Contact the procurement admin when you need help.", adminPhoneNotConfigured: "Admin phone number is not configured yet. Add the real number in ADMIN_PHONE_NUMBER.", callConfirmation: "Call the procurement admin now?", cropPrices: "Rajasthan Crop Prices", cropPricesDesc: "Farmer-friendly Rajasthan crop price and trend information.", demoPriceLabel: "Demo / Sample Data", priceSourceNote: "These are sample frontend values, not live market prices. Replace the data with a verified API before using them as current prices.", priceUnit: "Price Unit", market: "Market", priceDate: "Price Date", trend: "Trend", trendingCrops: "Trending Crops in Rajasthan", highDemand: "High Selling Demand", priceMovement: "Notable Price Movement", up: "Up", down: "Down", stable: "Stable", adminGpsTitle: "Admin Location", adminGpsDesc: "Use your browser location when relevant for centre operations.", adminLocationNote: "Location is requested only when you press the button and is used in this browser for this demo.", locationStatus: "Location Status", feedbackStoredDemo: "Feedback is stored locally in this browser for this demo.", bookingNotificationTitle: "Booking Confirmed", bookingNotificationText: "Your slot has been successfully booked.", reachCentre: "Please reach the procurement centre at your selected time.", saleNotificationTitle: "Crop Sale & Payment Completed", saleNotificationText: "Your crop sale has been completed and payment has been successfully processed.", quantityLabel: "Quantity", paymentAmount: "Payment Amount", paid: "Paid",
    feedback:"Feedback",feedbackTitle:"Share Your Feedback",feedbackDesc:"Tell us how Agro Vision can serve you better.",rating:"Rating",comments:"Comments",feedbackCategory:"Category (Optional)",selectCategory:"Select a category",categoryBooking:"Booking",categoryPayment:"Payment",categoryCentre:"Procurement Centre",categoryApp:"Website / App",categoryOther:"Other",feedbackPlaceholder:"Write your feedback here...",feedbackSuccess:"Thank you! Your feedback has been submitted.",callAdmin:"Call Admin",callAdminDesc:"Contact the procurement admin when you need help.",adminPhoneNotConfigured:"Admin phone number is not configured yet. Add the real number in ADMIN_PHONE_NUMBER.",callConfirmation:"Call the procurement admin now?",cropPrices:"Rajasthan Crop Prices",cropPricesDesc:"Farmer-friendly Rajasthan crop price and trend information.",demoPriceLabel:"Demo / Sample Data",demoValue:"Demo value",sampleMarket:"Rajasthan sample",demoDate:"Demo",medium:"Medium",priceSourceNote:"These are sample frontend values, not live market prices. Replace them with a verified API before using them as current prices.",priceUnit:"Price Unit",market:"Market",priceDate:"Price Date",trend:"Trend",trendingCrops:"Trending Crops in Rajasthan",highDemand:"High Selling Demand",priceMovement:"Notable Price Movement",up:"Up",down:"Down",stable:"Stable",adminGpsTitle:"Admin Location",adminGpsDesc:"Use your browser location when relevant for centre operations.",adminLocationNote:"Location is requested only when you press the button and is used in this browser for this demo.",locationStatus:"Location Status",feedbackStoredDemo:"Feedback is stored locally in this browser for this demo.",bookingNotificationTitle:"Booking Confirmed",bookingNotificationText:"Your slot has been successfully booked.",reachCentre:"Please reach the procurement centre at your selected time.",saleNotificationTitle:"Crop Sale & Payment Completed",saleNotificationText:"Your crop sale has been completed and payment has been successfully processed.",quantityLabel:"Quantity",paymentAmount:"Payment Amount",paid:"Paid",unread:"New",noNewNotifications:"No new generated notifications yet.",markPaid:"Mark as Paid",barley:"Barley",guar:"Guar",gpsTitle: "Nearby Procurement Centres", gpsDesc: "Use your phone's location to see how far you are from each procurement centre.", locateMe: "Locate Me", locating: "Finding your location...", locationReady: "Your location is ready.", locationDenied: "Location permission was denied. Allow location access in your browser and try again.", locationUnavailable: "Your location could not be found. Check GPS/location settings and try again.", locationTimeout: "Location request timed out. Move to an open area and try again.", distanceFromYou: "Distance from you", openMaps: "Navigate", coordinates: "Your coordinates", nearbyCentre: "Nearest procurement centre", kmAway: "km away", locationNote: "Your location is used only in this browser to calculate distances. It is not saved by this demo.", gpsNotSupported: "Geolocation is not supported by this browser.", cropAdvisory: "Crop Selling Advisory", cropAdvisoryDesc: "Indicative Rajasthan seasonal selling-demand guidance. Use it with local market prices and procurement requirements.", recommendedCrop: "Recommended Crop", demandScore: "Seasonal Demand Score", bestSellingWindow: "Best Selling Window", advisoryNote: "This is an indicative seasonal advisory, not live mandi prices or a guaranteed selling price.", wheat: "Wheat", mustard: "Mustard", bajra: "Bajra", maize: "Maize", gram: "Gram", barley: "Barley", guar: "Guar", score: "Score (1–5)", monthJan: "January", monthFeb: "February", monthMar: "March", monthApr: "April", monthMay: "May", monthJun: "June", monthJul: "July", monthAug: "August", monthSep: "September", monthOct: "October", monthNov: "November", monthDec: "December", advisoryGraph: "Rajasthan Crop Selling Demand by Month", advisoryGraphDesc: "Higher score means a stronger seasonal selling/procurement window in this demo advisory." , location: "Location", gps: "GPS / Nearby Centres", useLocation: "Use GPS to find nearby centres", distance: "Distance", noLocationYet: "Press Locate Me to calculate distances.", unread: "New", noNewNotifications: "No new generated notifications yet.", markPaid: "Mark as Paid",
    normalBooking: "Normal Booking",
    priorityBooking: "Priority Booking",
    bookingType: "Booking Type",
    normalBookingDesc: "Use the regular slot allocation.",
    priorityBookingDesc: "For valid cases where a normal slot could not be obtained.",
    priorityReason: "Reason for Priority Booking",
    priorityReasonPlaceholder: "Briefly select or enter a valid reason",
    reasonNoSlot: "No suitable normal slot available",
    reasonRequiredTime: "Required time slot unavailable",
    reasonOther: "Other valid reason",
    cropSelection: "Select Crop",
    selectCrop: "Select the crop you want to procure.",
    quantityToBook: "Quantity to Book",
    quantityPlaceholder: "Enter quantity",
    availableCapacity: "Available Capacity",
    normalAvailable: "Normal Available",
    priorityAvailable: "Priority Available",
    occupied: "Occupied",
    available: "Available",
    waitingList: "Waiting List",
    joinWaitingList: "Join Waiting List",
    waitingListAdded: "You have been added to the waiting list.",
    waitingListPosition: "Waiting List Position",
    waitingListStatus: "Waiting List Status",
    waitReason: "No suitable capacity was available for this booking category.",
    bookingSubmitted: "Booking submitted successfully.",
    bookingFailed: "Booking could not be completed.",
    bookingCategoryNote: "Choose Priority only when the normal booking could not meet a valid requirement.",
    capacityStatus: "Capacity Status",
    totalCapacity: "Total Capacity",
    occupiedSlots: "Occupied Slots",
    availableSlots: "Available Slots",
    normalAllocation: "Normal Allocation",
    priorityAllocation: "Priority Allocation",
    usedNormal: "Used Normal",
    usedPriority: "Used Priority",
    queueCount: "Queue Count",
    fullStatus: "Full",
    availableStatus: "Available",
    increaseSlots: "Increase Slots",
    additionalSlots: "Additional Slots",
    addSlotsPlaceholder: "Enter slots to add",
    addSlotsHint: "Add extra slots when this centre is full or demand is high.",
    slotsAdded: "slots added successfully.",
    invalidSlotIncrease: "Enter a valid number of slots greater than 0.",
    centreCapacityTitle: "Procurement Centre Capacity & Status",
    centreCapacityDesc: "Monitor capacity, occupancy, booking allocation and waiting-list demand.",
    normalPriorityAllocation: "Normal / Priority Allocation",
    adminWaitingList: "Waiting List",
    requestDate: "Requested Date",
    requestedSlot: "Requested Slot",
    queuePosition: "Queue Position",
    requestType: "Request Type",
    reason: "Reason",
    pendingReview: "Pending",
    demoFrontendOnly: "Frontend demo only — booking and waiting-list changes are local to this session.",
    noWaitingRequests: "No farmers are currently on the waiting list.",
    statusAvailable: "Available",
    statusFull: "Full",
    videoHindiVoice: "Hindi voice / instructions are provided by the Hindi demonstration video.",
    videoAssetNote: "Place the actual MP4 files at the configured video paths to play the demonstrations.",
    videoSteps: "Login • Dashboard • Crop • Centre • Slot • Token • Waiting List • Notifications • Payment",
  },
  hi: {
    cancelBooking: "बुकिंग रद्द करें", cancelBookingTitle: "अपनी बुकिंग रद्द करें",
    cancelBookingDesc: "यदि आपको समय स्लॉट की आवश्यकता नहीं है, तो अपनी सक्रिय बुकिंग रद्द करें।",
    cancelBookingConfirm: "क्या आप वाकई यह बुकिंग रद्द करना चाहते हैं?",
    confirmCancel: "हाँ, बुकिंग रद्द करें", keepBooking: "बुकिंग रखें",
    bookingCancelled: "बुकिंग सफलतापूर्वक रद्द कर दी गई है।", noActiveBooking: "रद्द करने के लिए कोई सक्रिय बुकिंग नहीं है।",
    analysis: "विश्लेषण", reports: "रिपोर्ट", analysisTitle: "किसान विश्लेषण",
    analysisDesc: "भुगतान और फसल खरीद इतिहास को आसान ग्राफ़ में देखें।",
    reportsTitle: "किसान रिपोर्ट", reportsDesc: "आपकी खरीद, भुगतान और फसल इतिहास का आसान सारांश।",
    paymentHistory: "भुगतान इतिहास", paymentHistoryDesc: "समय के अनुसार प्राप्त और लंबित भुगतान।",
    cropSalesHistory: "फसल खरीद इतिहास", cropSalesHistoryDesc: "आपने खरीद केंद्र को कितनी फसल बेची है।",
    received: "प्राप्त", pendingAmount: "लंबित राशि", totalCropSold: "कुल बेची गई फसल",
    totalPayments: "कुल भुगतान", transactions: "लेन-देन", quantitySold: "बेची गई मात्रा (किग्रा)",
    crop: "फसल", month: "महीना", amount: "राशि (₹)", printReport: "रिपोर्ट प्रिंट / सेव करें", generateReport: "रिपोर्ट बनाएं", reportGenerated: "रिपोर्ट तैयार है। इसे PDF में सेव करने के लिए Print → Save as PDF चुनें।", adminReportTitle: "एडमिन खरीद विश्लेषण रिपोर्ट", adminReportDesc: "खरीद, किसान पंजीकरण और फसल प्रदर्शन का सारांश।", paymentChart: "भुगतान स्थिति और इतिहास", cropChart: "फसल खरीद / बिक्री इतिहास", reportIncludesGraphs: "इस रिपोर्ट में विश्लेषण में दिखाए गए वही ग्राफ शामिल हैं।", farmerCompleteReport:"पूर्ण किसान रिपोर्ट", farmerCompleteReportDesc:"किसान विवरण, खरीद विवरण और विश्लेषण ग्राफ।", farmerDetails:"किसान विवरण", purchasingDetails:"खरीद विवरण", noPurchasingDetails:"कोई खरीद विवरण उपलब्ध नहीं है।", paymentDetails:"भुगतान विवरण", allFarmerDetails:"सभी किसान विवरण", allPurchasingDetails:"सभी खरीद विवरण", adminPaymentDetails:"सभी भुगतान विवरण",
    reportReady: "रिपोर्ट को PDF में सेव करने के लिए ब्राउज़र में Print → Save as PDF चुनें।",
    demoDataNote: "यह डेमो डेटा है। बाद में इसे वास्तविक बैकएंड/API से जोड़ा जा सकता है।",
    activeBooking: "सक्रिय बुकिंग", cancelled: "रद्द", cancelAction: "यह बुकिंग रद्द करें",
    videoUnavailable: "वीडियो फ़ाइल जोड़ने के बाद यहाँ प्रदर्शन वीडियो दिखाई देगा।",
    howToUseEnglish: "How to Use Agro Vision", howToUseHindi: "एग्रो विज़न का उपयोग कैसे करें",
    videoEnglish: "अंग्रेज़ी प्रदर्शन", videoHindi: "हिंदी प्रदर्शन",
    watchDemo: "एग्रो विज़न का उपयोग सीखने के लिए यह आसान प्रदर्शन देखें।",
    systemReady: "सरल, स्पष्ट और किसान-अनुकूल", feedback: "प्रतिक्रिया", feedbackTitle: "अपनी प्रतिक्रिया दें", feedbackDesc: "बताएं कि एग्रो विज़न आपकी बेहतर सेवा कैसे कर सकता है।", rating: "रेटिंग", comments: "टिप्पणी", feedbackCategory: "श्रेणी (वैकल्पिक)", selectCategory: "श्रेणी चुनें", categoryBooking: "बुकिंग", categoryPayment: "भुगतान", categoryCentre: "खरीद केंद्र", categoryApp: "वेबसाइट / ऐप", categoryOther: "अन्य", feedbackPlaceholder: "अपनी प्रतिक्रिया यहाँ लिखें...", feedbackSuccess: "धन्यवाद! आपकी प्रतिक्रिया जमा हो गई है।", callAdmin: "एडमिन को कॉल करें", callAdminDesc: "मदद की आवश्यकता होने पर खरीद केंद्र के एडमिन से संपर्क करें।", adminPhoneNotConfigured: "एडमिन का फोन नंबर अभी सेट नहीं है। ADMIN_PHONE_NUMBER में वास्तविक नंबर जोड़ें।", callConfirmation: "क्या आप अभी खरीद केंद्र के एडमिन को कॉल करना चाहते हैं?", cropPrices: "राजस्थान फसल भाव", cropPricesDesc: "किसानों के लिए राजस्थान की फसलों के भाव और रुझान की जानकारी।", demoPriceLabel: "डेमो / नमूना डेटा", priceSourceNote: "ये फ्रंटएंड के नमूना मान हैं, लाइव बाजार भाव नहीं। इन्हें वर्तमान भाव के रूप में उपयोग करने से पहले सत्यापित API से जोड़ें।", priceUnit: "भाव की इकाई", market: "बाजार", priceDate: "भाव दिनांक", trend: "रुझान", trendingCrops: "राजस्थान में लोकप्रिय फसलें", highDemand: "उच्च बिक्री मांग", priceMovement: "उल्लेखनीय भाव बदलाव", up: "बढ़त", down: "गिरावट", stable: "स्थिर", adminGpsTitle: "एडमिन लोकेशन", adminGpsDesc: "केंद्र संचालन के लिए आवश्यक होने पर ब्राउज़र लोकेशन का उपयोग करें।", adminLocationNote: "लोकेशन केवल बटन दबाने पर मांगी जाती है और इस डेमो में इसी ब्राउज़र में उपयोग होती है।", locationStatus: "लोकेशन स्थिति", feedbackStoredDemo: "इस डेमो में प्रतिक्रिया इसी ब्राउज़र में स्थानीय रूप से सेव होती है।", bookingNotificationTitle: "बुकिंग की पुष्टि", bookingNotificationText: "आपका स्लॉट सफलतापूर्वक बुक हो गया है।", reachCentre: "कृपया चुने गए समय पर खरीद केंद्र पहुंचें।", saleNotificationTitle: "फसल बिक्री और भुगतान पूर्ण", saleNotificationText: "आपकी फसल बिक्री पूरी हो गई है और भुगतान सफलतापूर्वक संसाधित हो गया है।", quantityLabel: "मात्रा", paymentAmount: "भुगतान राशि", paid: "भुगतान हो गया",
    feedback:"प्रतिक्रिया",feedbackTitle:"अपनी प्रतिक्रिया दें",feedbackDesc:"बताएं कि एग्रो विज़न आपकी बेहतर सेवा कैसे कर सकता है।",rating:"रेटिंग",comments:"टिप्पणी",feedbackCategory:"श्रेणी (वैकल्पिक)",selectCategory:"श्रेणी चुनें",categoryBooking:"बुकिंग",categoryPayment:"भुगतान",categoryCentre:"खरीद केंद्र",categoryApp:"वेबसाइट / ऐप",categoryOther:"अन्य",feedbackPlaceholder:"अपनी प्रतिक्रिया यहाँ लिखें...",feedbackSuccess:"धन्यवाद! आपकी प्रतिक्रिया जमा हो गई है।",callAdmin:"एडमिन को कॉल करें",callAdminDesc:"मदद की आवश्यकता होने पर खरीद केंद्र के एडमिन से संपर्क करें।",adminPhoneNotConfigured:"एडमिन का फोन नंबर अभी सेट नहीं है। ADMIN_PHONE_NUMBER में वास्तविक नंबर जोड़ें।",callConfirmation:"क्या आप अभी खरीद केंद्र के एडमिन को कॉल करना चाहते हैं?",cropPrices:"राजस्थान फसल भाव",cropPricesDesc:"किसानों के लिए राजस्थान की फसलों के भाव और रुझान की जानकारी।",demoPriceLabel:"डेमो / नमूना डेटा",demoValue:"डेमो मान",sampleMarket:"राजस्थान नमूना",demoDate:"डेमो",medium:"मध्यम",priceSourceNote:"ये फ्रंटएंड के नमूना मान हैं, लाइव बाजार भाव नहीं। इन्हें वर्तमान भाव के रूप में उपयोग करने से पहले सत्यापित API से जोड़ें।",priceUnit:"भाव की इकाई",market:"बाजार",priceDate:"भाव दिनांक",trend:"रुझान",trendingCrops:"राजस्थान में लोकप्रिय फसलें",highDemand:"उच्च बिक्री मांग",priceMovement:"उल्लेखनीय भाव बदलाव",up:"बढ़त",down:"गिरावट",stable:"स्थिर",adminGpsTitle:"एडमिन लोकेशन",adminGpsDesc:"केंद्र संचालन के लिए आवश्यक होने पर ब्राउज़र लोकेशन का उपयोग करें।",adminLocationNote:"लोकेशन केवल बटन दबाने पर मांगी जाती है और इस डेमो में इसी ब्राउज़र में उपयोग होती है।",locationStatus:"लोकेशन स्थिति",feedbackStoredDemo:"इस डेमो में प्रतिक्रिया इसी ब्राउज़र में स्थानीय रूप से सेव होती है।",bookingNotificationTitle:"बुकिंग की पुष्टि",bookingNotificationText:"आपका स्लॉट सफलतापूर्वक बुक हो गया है।",reachCentre:"कृपया चुने गए समय पर खरीद केंद्र पहुंचें।",saleNotificationTitle:"फसल बिक्री और भुगतान पूर्ण",saleNotificationText:"आपकी फसल बिक्री पूरी हो गई है और भुगतान सफलतापूर्वक संसाधित हो गया है।",quantityLabel:"मात्रा",paymentAmount:"भुगतान राशि",paid:"भुगतान हो गया",unread:"नई",noNewNotifications:"अभी कोई नई जनरेट की गई सूचना नहीं है।",markPaid:"भुगतान पूर्ण करें",barley:"जौ",guar:"ग्वार",gpsTitle: "नज़दीकी खरीद केंद्र", gpsDesc: "अपने मोबाइल की लोकेशन का उपयोग करके देखें कि आप प्रत्येक खरीद केंद्र से कितनी दूर हैं।", locateMe: "मेरी लोकेशन खोजें", locating: "लोकेशन खोजी जा रही है...", locationReady: "आपकी लोकेशन मिल गई है।", locationDenied: "लोकेशन की अनुमति नहीं मिली। ब्राउज़र में लोकेशन की अनुमति दें और फिर प्रयास करें।", locationUnavailable: "आपकी लोकेशन नहीं मिल सकी। GPS/लोकेशन सेटिंग जाँचें और फिर प्रयास करें।", locationTimeout: "लोकेशन खोजने में समय लग गया। खुले स्थान पर जाकर फिर प्रयास करें।", distanceFromYou: "आपसे दूरी", openMaps: "रास्ता देखें", coordinates: "आपकी लोकेशन", nearbyCentre: "सबसे नज़दीकी खरीद केंद्र", kmAway: "किमी दूर", locationNote: "आपकी लोकेशन का उपयोग केवल इसी ब्राउज़र में दूरी निकालने के लिए होता है। इस डेमो में इसे सेव नहीं किया जाता।", gpsNotSupported: "इस ब्राउज़र में लोकेशन सुविधा उपलब्ध नहीं है।", cropAdvisory: "फसल बिक्री सलाह", cropAdvisoryDesc: "राजस्थान के मौसमी बिक्री/खरीद रुझान पर आधारित संकेतात्मक सलाह। इसे स्थानीय बाजार भाव और खरीद आवश्यकताओं के साथ देखें।", recommendedCrop: "सुझाई गई फसल", demandScore: "मौसमी मांग स्कोर", bestSellingWindow: "बेचने का बेहतर समय", advisoryNote: "यह संकेतात्मक मौसमी सलाह है, लाइव मंडी भाव या निश्चित बिक्री मूल्य नहीं।", wheat: "गेहूं", mustard: "सरसों", bajra: "बाजरा", maize: "मक्का", gram: "चना", barley: "जौ", guar: "ग्वार", score: "स्कोर (1–5)", monthJan: "जनवरी", monthFeb: "फरवरी", monthMar: "मार्च", monthApr: "अप्रैल", monthMay: "मई", monthJun: "जून", monthJul: "जुलाई", monthAug: "अगस्त", monthSep: "सितंबर", monthOct: "अक्टूबर", monthNov: "नवंबर", monthDec: "दिसंबर", advisoryGraph: "राजस्थान में महीने के अनुसार फसल बिक्री मांग", advisoryGraphDesc: "अधिक स्कोर इस डेमो सलाह में बेहतर मौसमी बिक्री/खरीद समय को दर्शाता है।", location: "स्थान", gps: "GPS / नज़दीकी केंद्र", useLocation: "नज़दीकी केंद्र खोजें", distance: "दूरी", noLocationYet: "दूरी निकालने के लिए ‘मेरी लोकेशन खोजें’ दबाएँ।", unread: "नई", noNewNotifications: "अभी कोई नई जनरेट की गई सूचना नहीं है।", markPaid: "भुगतान पूर्ण करें",
    normalBooking: "सामान्य बुकिंग",
    priorityBooking: "प्राथमिकता बुकिंग",
    bookingType: "बुकिंग प्रकार",
    normalBookingDesc: "नियमित स्लॉट आवंटन का उपयोग करें।",
    priorityBookingDesc: "जब वैध कारण से सामान्य स्लॉट प्राप्त न हो सके।",
    priorityReason: "प्राथमिकता बुकिंग का कारण",
    priorityReasonPlaceholder: "वैध कारण चुनें या दर्ज करें",
    reasonNoSlot: "उपयुक्त सामान्य स्लॉट उपलब्ध नहीं था",
    reasonRequiredTime: "आवश्यक समय स्लॉट उपलब्ध नहीं था",
    reasonOther: "अन्य वैध कारण",
    cropSelection: "फसल चुनें",
    selectCrop: "जिस फसल की खरीद करनी है उसे चुनें।",
    quantityToBook: "बुक करने की मात्रा",
    quantityPlaceholder: "मात्रा दर्ज करें",
    availableCapacity: "उपलब्ध क्षमता",
    normalAvailable: "सामान्य उपलब्ध",
    priorityAvailable: "प्राथमिकता उपलब्ध",
    occupied: "भरी हुई",
    available: "उपलब्ध",
    waitingList: "प्रतीक्षा सूची",
    joinWaitingList: "प्रतीक्षा सूची में जोड़ें",
    waitingListAdded: "आपको प्रतीक्षा सूची में जोड़ दिया गया है।",
    waitingListPosition: "प्रतीक्षा सूची में स्थान",
    waitingListStatus: "प्रतीक्षा सूची स्थिति",
    waitReason: "इस बुकिंग प्रकार के लिए उपयुक्त क्षमता उपलब्ध नहीं थी।",
    bookingSubmitted: "बुकिंग सफलतापूर्वक जमा हो गई।",
    bookingFailed: "बुकिंग पूरी नहीं हो सकी।",
    bookingCategoryNote: "प्राथमिकता का चयन केवल तब करें जब वैध आवश्यकता के लिए सामान्य बुकिंग उपलब्ध न हो।",
    capacityStatus: "क्षमता स्थिति",
    totalCapacity: "कुल क्षमता",
    occupiedSlots: "भरे हुए स्लॉट",
    availableSlots: "उपलब्ध स्लॉट",
    normalAllocation: "सामान्य आवंटन",
    priorityAllocation: "प्राथमिकता आवंटन",
    usedNormal: "उपयोग की गई सामान्य",
    usedPriority: "उपयोग की गई प्राथमिकता",
    queueCount: "कतार संख्या",
    fullStatus: "पूर्ण",
    availableStatus: "उपलब्ध",
    increaseSlots: "स्लॉट बढ़ाएँ",
    additionalSlots: "अतिरिक्त स्लॉट",
    addSlotsPlaceholder: "जोड़ने के लिए स्लॉट दर्ज करें",
    addSlotsHint: "जब यह केंद्र पूर्ण हो या मांग अधिक हो, तब अतिरिक्त स्लॉट जोड़ें।",
    slotsAdded: "स्लॉट सफलतापूर्वक जोड़ दिए गए।",
    invalidSlotIncrease: "0 से अधिक वैध स्लॉट संख्या दर्ज करें।",
    centreCapacityTitle: "खरीद केंद्र क्षमता और स्थिति",
    centreCapacityDesc: "क्षमता, उपयोग, बुकिंग आवंटन और प्रतीक्षा सूची की मांग देखें।",
    normalPriorityAllocation: "सामान्य / प्राथमिकता आवंटन",
    adminWaitingList: "प्रतीक्षा सूची",
    requestDate: "अनुरोधित दिनांक",
    requestedSlot: "अनुरोधित स्लॉट",
    queuePosition: "कतार में स्थान",
    requestType: "अनुरोध प्रकार",
    reason: "कारण",
    pendingReview: "लंबित",
    demoFrontendOnly: "केवल फ्रंटएंड डेमो — बुकिंग और प्रतीक्षा सूची के बदलाव इसी सत्र में स्थानीय हैं।",
    noWaitingRequests: "अभी कोई किसान प्रतीक्षा सूची में नहीं है।",
    statusAvailable: "उपलब्ध",
    statusFull: "पूर्ण",
    videoHindiVoice: "हिंदी प्रदर्शन वीडियो में हिंदी आवाज़ / निर्देश शामिल हैं।",
    videoAssetNote: "डेमो चलाने के लिए वास्तविक MP4 फाइलें निर्धारित वीडियो पथ पर रखें।",
    videoSteps: "लॉगिन • डैशबोर्ड • फसल • केंद्र • स्लॉट • टोकन • प्रतीक्षा सूची • सूचनाएं • भुगतान",
  }
};


const initialFarmers = [
  {id:"F001", name:"Ravi Kumar", mobile:"9876543210", village:"Kherli", district:"Jaipur", crop:"Wheat", quantity:"50 Quintal", status:"Active"},
  {id:"F002", name:"Mohan Singh", mobile:"9123456780", village:"Chomu", district:"Jaipur", crop:"Mustard", quantity:"35 Quintal", status:"Active"},
  {id:"F003", name:"Sita Devi", mobile:"9988776655", village:"Sanganer", district:"Jaipur", crop:"Wheat", quantity:"20 Quintal", status:"Pending"}
];

const initialTokens = [
  {token:"T1001", farmer:"Ravi Kumar", farmerId:"F001", centre:"Jaipur Central Procurement Centre", date:"2026-09-05", time:"10:00 AM", queue:4, status:"Confirmed"},
  {token:"T1002", farmer:"Mohan Singh", farmerId:"F002", centre:"Chomu Procurement Centre", date:"2026-09-05", time:"11:00 AM", queue:8, status:"Confirmed"}
];

const initialCentres = [
  {id:"C001", name:"Jaipur Central Procurement Centre", location:"Jaipur", lat:26.9124, lng:75.7873, capacity:100, today:68, status:"Open"},
  {id:"C002", name:"Chomu Procurement Centre", location:"Chomu", lat:27.1702, lng:75.7227, capacity:80, today:52, status:"Open"},
  {id:"C003", name:"Sanganer Procurement Centre", location:"Sanganer", lat:26.8190, lng:75.7750, capacity:60, today:60, status:"Full"}
];

const bookingCrops = ["Wheat","Rice","Bajra","Mustard","Maize","Gram","Barley","Guar"];
const priorityReasons = ["noSlot","requiredTime","other"];

// ================= ANALYTICS DATA =================

const cropAnalytics = [
  {
    crop: "Wheat",
    registered: 520,
    purchased: 410,
    quantity: 18500
  },
  {
    crop: "Rice",
    registered: 380,
    purchased: 295,
    quantity: 13200
  },
  {
    crop: "Bajra",
    registered: 210,
    purchased: 165,
    quantity: 8400
  },
  {
    crop: "Mustard",
    registered: 135,
    purchased: 108,
    quantity: 5600
  },
  {
    crop: "Maize",
    registered: 180,
    purchased: 140,
    quantity: 7200
  }
];

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

async function apiRequest(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  const token = localStorage.getItem("agroVisionAccessToken");
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  const text = await response.text();
  let data = {};
  try { data = text ? JSON.parse(text) : {}; } catch { data = { detail: text }; }
  if (!response.ok) throw new Error(data.detail || data.message || `Request failed (${response.status})`);
  return data;
}

const mapCentreFromApi = (c) => ({
  id: c.id, name: c.name, location: c.address || "", lat: c.latitude, lng: c.longitude,
  capacity: c.capacity ?? 0, today: c.today ?? 0, status: c.operating_status || (c.is_active === false ? "Closed" : "Open"),
  address: c.address, isActive: c.is_active, openingTime: c.opening_time, closingTime: c.closing_time
});

const mapSlotToToken = (slot) => ({
  slotId: slot.id, centreId: slot.centre_id, centre: slot.centre_name, date: slot.date, time: slot.time_window,
  capacity: (slot.general_capacity || 0) + (slot.priority_capacity || 0),
  generalCapacity: slot.general_capacity, generalBooked: slot.general_booked, priorityCapacity: slot.priority_capacity,
  priorityBooked: slot.priority_booked, status: slot.status
});

function App(){
  const [language,setLanguage] = useState("en");
  const t = (key) => translations[language]?.[key] || extraTranslations[language]?.[key] || translations.en?.[key] || key;
  const [role,setRole] = useState("farmer");
  const [loggedIn,setLoggedIn] = useState(false);
  const [farmers,setFarmers] = useState(initialFarmers);
  const [tokens,setTokens] = useState(initialTokens);
  const [centres,setCentres] = useState(initialCentres);
  const [currentFarmerId,setCurrentFarmerId] = useState("F001");
  const [notifications,setNotifications] = useState([]);
  const [waitingList,setWaitingList] = useState([]);
  const [slots,setSlots] = useState([]);
  const [payments,setPayments] = useState([]);
  const [procurements,setProcurements] = useState([]);
  const [authToken,setAuthToken] = useState(()=>localStorage.getItem("agroVisionAccessToken") || "");
  const ADMIN_PHONE_NUMBER = ""; // Configure the real admin number here; no number is invented.

  const loadAuthenticatedData = async (user) => {
    const isFarmer = user?.role === "farmer";
    const [centreData, slotData] = await Promise.all([apiRequest("/centres"), apiRequest("/slots")]);
    const apiSlots = slotData || [];
    setSlots(apiSlots);
    setCentres((centreData || []).map(c => {
      const centreSlots = apiSlots.filter(sl => String(sl.centre_id) === String(c.id));
      const capacity = centreSlots.reduce((sum, sl) => sum + Number(sl.general_capacity || 0) + Number(sl.priority_capacity || 0), 0);
      const booked = centreSlots.reduce((sum, sl) => sum + Number(sl.general_booked || 0) + Number(sl.priority_booked || 0), 0);
      return {...mapCentreFromApi(c), capacity, today: booked, status: c.operating_status || (capacity && booked >= capacity ? "Full" : (c.is_active === false ? "Closed" : "Open"))};
    }));
    if (isFarmer) {
      const [bookingData, waitData, notificationData, paymentData, procurementData] = await Promise.all([
        apiRequest(`/bookings/${user.user_id}`), apiRequest(`/waitlist/${user.user_id}`),
        apiRequest(`/notifications/${user.user_id}`), apiRequest(`/payments/${user.user_id}`),
        apiRequest(`/procurements/${user.user_id}`)
      ]);
      setTokens((bookingData || []).map(b => ({...b, token:`B-${b.booking_id}`, farmerId:user.user_id, farmer:user.name, centre:b.centre_name, time:b.time_window, date:b.date, crop:b.crop_type, quantity:b.quantity, bookingType:b.pool_type?.toLowerCase()==="priority"?"priority":"normal"})));
      setWaitingList((waitData || []).map(w => ({...w, id:w.waitlist_id, farmerId:user.user_id, slotId:w.slot_id, queuePosition:w.position, status:"Waiting", date:w.date, time:w.time_window})));
      setNotifications((notificationData || []).map(n => ({...n, read:n.is_read, createdAt:n.created_at, type:n.notification_type, farmerId:user.user_id, data:{bookingId:n.booking_id}})));
      setPayments(paymentData || []);
      setProcurements(procurementData || []);
    } else {
      const [adminBookings, adminFarmers] = await Promise.all([apiRequest("/admin/bookings"), apiRequest("/admin/farmers")]);
      setTokens(Array.isArray(adminBookings) ? adminBookings : []);
      if (Array.isArray(adminFarmers)) setFarmers(adminFarmers.map(f=>({...f,id:f.user_id ?? f.id,mobile:f.phone ?? f.mobile,status:f.status || "Active"})));
    }
  };
  const addNotification=(notification)=>setNotifications(prev=>[{id:`N-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,read:false,createdAt:new Date().toISOString(),...notification},...prev]);
  const markNotificationRead=async (id)=>{
    try { await apiRequest(`/notifications/read/${id}`,{method:"PUT"}); } catch(error) { alert(error.message); return; }
    setNotifications(prev=>prev.map(n=>n.id===id?{...n,read:true,is_read:true}:n));
  };
  const addBookingNotification=(booking)=>addNotification({type:"booking",farmerId:booking.farmerId,data:booking});
  const addSalePaymentNotification=(payment)=>{if(payment?.paymentStatus!=="Paid"||payment?.saleStatus!=="Completed")return;addNotification({type:"salePayment",farmerId:payment.farmerId,data:payment});};
  const cancelToken=async (token)=>{
    const item=tokens.find(x=>x.token===token);
    const bookingId=item?.bookingId || item?.booking_id || (String(token).startsWith("B-")?String(token).slice(2):null);
    if(!bookingId){ alert(language==="hi"?"बुकिंग आईडी उपलब्ध नहीं है।":"Booking ID is not available."); return; }
    try {
      const data=await apiRequest(`/cancel/${bookingId}`,{method:"DELETE"});
      setTokens(prev=>prev.map(x=>x.token===token?{...x,status:"Cancelled"}:x));
      if(data.promoted_user_id) addNotification({type:"booking",farmerId:data.promoted_user_id,data:{message:data.message}});
    } catch(error) { alert(error.message); }
  };

  const addFarmer=(farmer)=>{
    const newFarmer={...farmer,id:`F${String(farmers.length+1).padStart(3,"0")}`,status:"Pending"};
    setFarmers(prev=>[...prev,newFarmer]); setCurrentFarmerId(newFarmer.id); setRole("farmer"); setLoggedIn(true);
  };

  const getCentreBookingStats=(centreId)=>{
    const centre=centres.find(c=>c.id===centreId);
    const centreTokens=tokens.filter(x=>x.centreId===centreId || (!x.centreId && x.centre===centre?.name));
    const normalAllocation=Math.floor((centre?.capacity||0)*0.8);
    const priorityAllocation=Math.max(0,(centre?.capacity||0)-normalAllocation);
    const usedNormal=centreTokens.filter(x=>(x.bookingType||"normal")==="normal" && x.status!=="Cancelled").length;
    const usedPriority=centreTokens.filter(x=>x.bookingType==="priority" && x.status!=="Cancelled").length;
    const baselineOccupied=centre?.today||0;
    const addedOccupancy=centreTokens.filter(x=>x.status!=="Cancelled").length;
    const occupied=Math.min(centre?.capacity||0,baselineOccupied+addedOccupancy);
    return {
      centre, normalAllocation, priorityAllocation, usedNormal, usedPriority,
      normalAvailable:Math.max(0,normalAllocation-usedNormal),
      priorityAvailable:Math.max(0,priorityAllocation-usedPriority),
      occupied, availableSlots:Math.max(0,(centre?.capacity||0)-occupied)
    };
  };

  const addBookingRequest=async (booking)=>{
    try {
      const payload={user_id:booking.farmerId,slot_id:booking.slotId,crop_type:booking.crop,quantity:Number(booking.quantity)};
      const data=await apiRequest("/book",{method:"POST",body:JSON.stringify(payload)});
      if (data.waitlist_position != null || /waitlist|full/i.test(data.message||"")) {
        const record={...booking,id:`W-${Date.now()}`,status:"Waiting",queuePosition:data.waitlist_position};
        setWaitingList(prev=>[...prev,record]); return {type:"waiting",record};
      }
      const record={...booking,bookingId:data.booking_id,token:`B-${data.booking_id}`,status:"Confirmed",bookingType:data.pool_type?.toLowerCase()==="priority"?"priority":"normal"};
      setTokens(prev=>[...prev,record]); return {type:"booked",record};
    } catch(error) { alert(error.message || t("bookingFailed")); return {type:"duplicate"}; }
  };

  const handleLogin=async ({mobile,password,role:loginRole})=>{
    try {
      const data = await apiRequest("/login", {method:"POST", body:JSON.stringify({phone:mobile,password})});
      localStorage.setItem("agroVisionAccessToken", data.access_token);
      setAuthToken(data.access_token);
      const me = await apiRequest("/auth/me");
      if (loginRole && me.role !== loginRole) throw new Error(language==="hi"?"इस खाते की भूमिका चयन से मेल नहीं खाती।":"This account does not match the selected role.");
      setRole(me.role);
      setCurrentFarmerId(me.user_id);
      setFarmers(prev => [{id:me.user_id,name:me.name,mobile:me.phone,village:me.village,district:me.district,state:me.state,status:"Active"}, ...prev.filter(f=>f.id!==me.user_id)]);
      setLoggedIn(true);
      await loadAuthenticatedData(me);
    } catch (error) {
      alert(error.message || (language==="hi"?"लॉगिन विफल।":"Login failed."));
    }
  };

  useEffect(()=>{
    if(!authToken) return;
    (async()=>{
      try { const me=await apiRequest("/auth/me"); setRole(me.role); setCurrentFarmerId(me.user_id); setFarmers(prev=>[{id:me.user_id,name:me.name,mobile:me.phone,village:me.village,district:me.district,state:me.state,status:"Active"},...prev.filter(f=>f.id!==me.user_id)]); await loadAuthenticatedData(me); setLoggedIn(true); }
      catch { localStorage.removeItem("agroVisionAccessToken"); setAuthToken(""); }
    })();
  },[authToken]);

  if(!loggedIn){
    return <Login role={role} setRole={setRole} language={language} setLanguage={setLanguage} onLogin={handleLogin} onRegister={()=>alert(language==="hi"?"पंजीकरण बैकएंड से जोड़ा जा सकता है। डेमो के लिए किसान: 9876543210 / 1234":"Registration can be connected to the backend. For this demo, use Farmer: 9876543210 / 1234.")} t={t}/>;
  }

  return <div className="app">
    <header className="topbar">
      <div className="topbar-brand"><img src="/assets/images/agro-vision-logo-transparent.png" alt="Agro Vision"/><div><div className="brand">{t("agroVision")}</div><div className="brand-subtitle">{t("smartProcurement")}</div></div></div>
      <div className="topbar-right">
        <select value={language} onChange={e=>setLanguage(e.target.value)} className="language-selector"><option value="en">English</option><option value="hi">हिंदी</option></select>
        <div className="role-switch"><span className="role-badge">{role==="farmer"?"👨‍🌾":"👨‍💼"} {role==="farmer"?(language==="hi"?"किसान पोर्टल":"Farmer Portal"):(language==="hi"?"एडमिन पोर्टल":"Admin Portal")}</span><button onClick={()=>{localStorage.removeItem("agroVisionAccessToken");setAuthToken("");setLoggedIn(false);setRole("farmer");}}>↪ {t("logout")}</button></div>
      </div>
    </header>
    {role==="farmer"?<FarmerApp farmers={farmers} centres={centres} slots={slots} tokens={tokens} waitingList={waitingList} currentFarmerId={currentFarmerId} onBookRequest={addBookingRequest} onCancelToken={cancelToken} onLogout={()=>{localStorage.removeItem("agroVisionAccessToken");setAuthToken("");setLoggedIn(false);}} t={t} language={language} notifications={notifications} markNotificationRead={markNotificationRead} onCallAdmin={()=>{}}/>:role==="operator"?<OperatorApp tokens={tokens} farmers={farmers} onLogout={()=>{localStorage.removeItem("agroVisionAccessToken");setAuthToken("");setLoggedIn(false);}} t={t}/>:<AdminApp farmers={farmers} centres={centres} tokens={tokens} waitingList={waitingList} setCentres={setCentres} onLogout={()=>{localStorage.removeItem("agroVisionAccessToken");setAuthToken("");setLoggedIn(false);}} t={t} notifications={notifications} addSalePaymentNotification={addSalePaymentNotification}/>} 
  </div>;
}

function FarmerApp({farmers,centres,slots,tokens,waitingList,currentFarmerId,onBookRequest,onCancelToken,onLogout,t,language,notifications,markNotificationRead}){
  const [page,setPage]=useState("dashboard"); const [selectedToken,setSelectedToken]=useState(null);
  const currentFarmer=farmers.find(f=>f.id===currentFarmerId)||farmers[0];
  return <div className="layout">
    <Sidebar title={t("farmerPortal")} items={[["dashboard",t("dashboard"),"🏠"],["gps",t("gps"),"📍"],["profile",t("profile"),"👨‍🌾"],["produce",t("produce"),"🌾"],["book",t("bookToken"),"🎫"],["queue",t("queue"),"🔎"],["payment",t("payment"),"💰"],["cancel",t("cancelBooking"),"✕"],["analysis",t("analysis"),"📈"],["reports",t("reports"),"📄"],["notifications",t("notifications"),"🔔"],["feedback",t("feedback"),"⭐"],["prices",t("cropPrices"),"📈"],["howto",t("howToUse"),"▶️"]]} page={page} setPage={setPage} onLogout={onLogout} t={t} />
    <main className="content">
      {page==="gps"&&<FarmerGPS centres={centres} t={t} language={language}/>} {page==="dashboard"&&<FarmerDashboard farmer={currentFarmer} tokens={tokens} setPage={setPage} t={t}/>} {page==="profile"&&<Profile farmer={currentFarmer} t={t}/>} {page==="produce"&&<Produce farmer={currentFarmer} t={t}/>} {page==="book"&&<BookToken centres={centres} slots={slots} tokens={tokens} onBook={async data=>{const result=await onBookRequest({...data,farmer:currentFarmer.name,farmerId:currentFarmer.id});if(result?.type==="booked"||result?.type==="waiting"){setSelectedToken(result.record);setPage("queue");}else alert(t("bookingFailed"));}} t={t}/>} {page==="queue"&&<Queue tokens={tokens.filter(x=>x.farmerId===currentFarmer.id)} selected={selectedToken} onCancel={onCancelToken} t={t}/>} {page==="cancel"&&<CancelBooking tokens={tokens.filter(x=>x.farmerId===currentFarmer.id)} onCancel={onCancelToken} setPage={setPage} t={t}/>} {page==="payment"&&<Payment t={t}/>} {page==="analysis"&&<FarmerAnalysis farmer={currentFarmer} tokens={tokens.filter(x=>x.farmerId===currentFarmer.id)} t={t}/>} {page==="reports"&&<FarmerReports farmer={currentFarmer} tokens={tokens.filter(x=>x.farmerId===currentFarmer.id)} t={t}/>} {page==="notifications"&&<Notifications t={t} notifications={notifications} markNotificationRead={markNotificationRead} farmerId={currentFarmer.id}/>} {page==="feedback"&&<FarmerFeedback farmer={currentFarmer} t={t}/>} {page==="prices"&&<CropPrices t={t} farmer={currentFarmer}/>} {page==="howto"&&<HowToUse language={language} t={t}/>} 
    </main>
  </div>;
}

function Login({role,setRole,language,setLanguage,onLogin,onRegister,t}){
  const [mobile,setMobile]=React.useState("");
  const [password,setPassword]=React.useState("");
  const [showPassword,setShowPassword]=React.useState(false);
  const [listening,setListening]=React.useState(false);
  const [voiceMessage,setVoiceMessage]=React.useState("");
  const mobileRef=React.useRef(null);
  const passwordRef=React.useRef(null);
  const recognitionRef=React.useRef(null);

  const handleLogin=e=>{
    e.preventDefault();
    if(!mobile||!password){alert(t("enterCredentials"));return;}
    onLogin&&onLogin({mobile,password,role});
  };

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

    const numberWords={
      zero:"0",one:"1",two:"2",three:"3",four:"4",five:"5",six:"6",seven:"7",eight:"8",nine:"9",
      शून्य:"0",एक:"1",दो:"2",तीन:"3",चार:"4",पांच:"5",पाँच:"5",छह:"6",छः:"6",सात:"7",आठ:"8",नौ:"9"
    };
    const normalizeDigits=(text)=>{
      let value=text.toLowerCase();
      Object.entries(numberWords).forEach(([word,digit])=>{value=value.replace(new RegExp(`\\b${word}\\b`,'gi'),digit);});
      return value.replace(/\D/g,"").slice(0,10);
    };

    recognition.onstart=()=>{setListening(true);setVoiceMessage(t("listening"));};
    recognition.onspeechend=()=>{try{recognition.stop();}catch{}};
    recognition.onresult=e=>{
      const finalResults=Array.from(e.results).filter(r=>r.isFinal);
      const spoken=(finalResults.length?finalResults[finalResults.length-1][0]:e.results[e.results.length-1][0])?.transcript?.trim()||"";
      if(!spoken)return;
      const lower=spoken.toLowerCase();
      const hindi=language==="hi";

      if(/\b(hindi|हिंदी)\b/i.test(lower)){setLanguage("hi");setVoiceMessage("हिंदी");return;}
      if(/\b(english|अंग्रेजी|अंग्रेज़ी)\b/i.test(lower)){setLanguage("en");setVoiceMessage("English");return;}
      if(/\b(farmer|किसान)\b/i.test(lower)){setRole("farmer");setVoiceMessage(hindi?"किसान चुना गया":"Farmer selected");return;}
      if(/\b(admin|administrator|एडमिन)\b/i.test(lower)){setRole("admin");setVoiceMessage(hindi?"एडमिन चुना गया":"Admin selected");return;}
      if(/\b(operator|ऑपरेटर)\b/i.test(lower)){setRole("operator");setVoiceMessage(hindi?"ऑपरेटर चुना गया":"Operator selected");return;}
      if(/\b(login|log in|लॉगिन|लॉग इन)\b/i.test(lower)){
        setVoiceMessage(hindi?"लॉगिन किया जा रहा है":"Logging in");
        setTimeout(()=>document.getElementById("agro-login-form")?.requestSubmit(),180);
        return;
      }

      const active=document.activeElement;
      if(active===mobileRef.current){
        const digits=normalizeDigits(spoken);
        if(digits)setMobile(digits);
        else setVoiceMessage(hindi?"मोबाइल नंबर स्पष्ट बोलें।":"Please speak the mobile number clearly.");
      }else if(active===passwordRef.current){
        setPassword(spoken.replace(/\s/g,""));
      }else{
        const digits=normalizeDigits(spoken);
        if(digits){setMobile(digits);setTimeout(()=>passwordRef.current?.focus(),50);}
        else setVoiceMessage(t("voiceHelp"));
      }
    };
    recognition.onerror=e=>{
      const messages={
        "not-allowed":t("voicePermission"),
        "service-not-allowed":t("voicePermission"),
        "audio-capture":t("voiceMicError"),
        "no-speech":t("voiceNoSpeech"),
        "network":t("voiceNetworkError")
      };
      setVoiceMessage(messages[e.error]||t("voiceHelp"));
      setListening(false);
    };
    recognition.onend=()=>setListening(false);
    recognitionRef.current=recognition;

    return ()=>{try{recognition.abort();}catch{} recognitionRef.current=null;};
  },[language,t]);

  const toggleVoice=async()=>{
    const recognition=recognitionRef.current;
    if(!recognition){
      setVoiceMessage(t("voiceNotSupported"));
      return;
    }
    if(listening){
      try{recognition.stop();}catch{}
      setListening(false);
      return;
    }
    try{
      // Explicitly request microphone permission first. This makes permission problems
      // visible instead of leaving the assistant apparently inactive.
      if(navigator.mediaDevices?.getUserMedia){
        const stream=await navigator.mediaDevices.getUserMedia({audio:true});
        stream.getTracks().forEach(track=>track.stop());
      }
      recognition.lang=language==="hi"?"hi-IN":"en-IN";
      recognition.start();
    }catch(error){
      if(error?.name==="NotAllowedError"||error?.name==="SecurityError") setVoiceMessage(t("voicePermission"));
      else if(error?.name==="NotFoundError") setVoiceMessage(t("voiceMicError"));
      else setVoiceMessage(t("voiceHelp"));
      setListening(false);
    }
  };

  const speakHelp=()=>{
    if(!("speechSynthesis" in window))return;
    window.speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(
      language==="hi"
        ? "वॉइस असिस्टेंट सक्रिय है। हिंदी, अंग्रेज़ी, किसान, एडमिन या लॉगिन बोलें। मोबाइल नंबर और पासवर्ड भी बोलकर दर्ज कर सकते हैं।"
        : "Voice assistant is active. Say Hindi, English, Farmer, Admin, or Login. You can also dictate your mobile number and password."
    );
    u.lang=language==="hi"?"hi-IN":"en-IN";
    u.rate=.92;
    window.speechSynthesis.speak(u);
  };

  return <div className="login-page"><span className="login-leaf leaf-a" aria-hidden="true">🍃</span><span className="login-leaf leaf-b" aria-hidden="true">🌿</span><span className="login-leaf leaf-c" aria-hidden="true">🍃</span><span className="login-sun" aria-hidden="true"></span><span className="login-fireflies" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span><span className="login-wheat" aria-hidden="true"><b></b><b></b><b></b><b></b><b></b><b></b><b></b></span>
    <div className="login-photo" aria-hidden="true"></div>
    <div className="login-photo-overlay" aria-hidden="true"></div><div className="login-glow glow-one" aria-hidden="true"></div><div className="login-glow glow-two" aria-hidden="true"></div><div className="login-particles" aria-hidden="true">{Array.from({length:8},(_,i)=><span key={i}/>)}</div>
    <div className="login-language">
      <select value={language} onChange={e=>setLanguage(e.target.value)} className="language-selector" aria-label="Language">
        <option value="en">English</option><option value="hi">हिंदी</option>
      </select>
    </div>
    <div className="login-layout login-layout-centered">
      <div className="login-card">
        <div className="login-card-logo">
          <img src="/assets/images/agro-vision-logo-transparent.png" alt="Agro Vision" />
        </div>
        <div className="login-card-brand">🌱 {t("agroVision")}</div><div className="login-card-subbrand">{t("smartProcurement")}</div><h2>{t("welcomeBack")}</h2>
        <p className="muted">{t("loginContinue")}</p>

        <div className="login-voice-assistant">
          <div className="voice-assistant-top">
            <div className={"voice-mic "+(listening?"listening":"")} aria-hidden="true">🎙️</div>
            <div className="voice-assistant-copy">
              <strong>{t("voiceAssistant")}</strong>
              <span>{voiceMessage||t("voiceAssistantHint")}</span>
            </div>
            <button type="button" className={"voice-button "+(listening?"active":"")} onClick={toggleVoice} aria-label={listening?t("stopVoice"):t("startVoice")}>
              {listening?"⏹️":"🎤"}
            </button>
          </div>
          <button type="button" className="voice-help-button" onClick={speakHelp}>🔊 {t("voiceHelp")}</button>
        </div>

        <div className="role-selector">
          <button type="button" className={role==="farmer"?"role-btn active":"role-btn"} onClick={()=>setRole("farmer")}>👨‍🌾 {t("farmer")}</button>
          <button type="button" className={role==="admin"?"role-btn active":"role-btn"} onClick={()=>setRole("admin")}>👨‍💼 {t("admin")}</button>
        </div>
        <form id="agro-login-form" onSubmit={handleLogin}>
          <div className="form-group"><label>{t("mobileNumber")}</label><div className="input-wrapper"><span className="input-icon">📱</span><input ref={mobileRef} type="tel" placeholder={t("enterMobileYour")} value={mobile} onChange={e=>setMobile(e.target.value)} maxLength="10" autoComplete="tel" /></div></div>
          <div className="form-group"><label>{t("password")}</label><div className="input-wrapper"><span className="input-icon">🔒</span><input ref={passwordRef} type={showPassword?"text":"password"} placeholder={t("enterPasswordYour")} value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" /><button type="button" className="password-toggle" onClick={()=>setShowPassword(!showPassword)} aria-label={showPassword?"Hide password":"Show password"}>{showPassword?"🙈":"👁️"}</button></div></div>
          <div className="login-options"><label className="remember"><input type="checkbox"/><span>{t("remember")}</span></label><button type="button" className="text-button" onClick={()=>alert(t("passwordRecovery"))}>{t("forgot")}</button></div>
          <button type="submit" className="primary full">{t("login")}</button>
        </form>
        <div className="register-row"><span>{t("dontHaveAccount")}</span><button type="button" onClick={onRegister}>{t("register")}</button></div>
      </div>
    </div>
  </div>;
}

function HowToUse({t,language}){const isHindi=language==="hi";const videoSrc=isHindi?"/assets/videos/Agro_Vision_How_To_Use_Hindi_Demo.mp4":"/assets/videos/Agro_Vision_How_To_Use_English_Demo.mp4";return <section className="howto-page"><div className="page-head"><div><span className="eyebrow">▶ {t("howToUse")}</span><h1>{isHindi?t("howToUseHindi"):t("howToUseEnglish")}</h1><p>{t("watchDemo")}</p></div><div className="user-chip">🌱 {t("agroVision")}</div></div><div className="howto-card"><div className="video-header"><div><span className="eyebrow">{isHindi?t("videoHindi"):t("videoEnglish")}</span><h2>{isHindi?t("howToUseHindi"):t("howToUseEnglish")}</h2><p>{t("watchDemo")}</p></div><span className="video-language">{isHindi?t("hindi"):t("english")}</span></div><div className="video-frame"><video controls playsInline preload="metadata" src={videoSrc} onError={(e)=>{e.currentTarget.style.display="none";e.currentTarget.parentElement.classList.add("video-missing");}}><track kind="captions" /></video><div className="video-missing-message">▶️ {t("videoUnavailable")}</div></div><div className="video-note">🎧 {isHindi?t("videoHindiVoice"):t("watchDemo")} {t("videoSteps")}</div><div className="video-asset-note">ℹ️ {t("videoAssetNote")}</div></div></section>}

function Sidebar({title,items,page,setPage,onLogout,t}){
  return <aside className="sidebar">
    <div className="side-title">{title}</div>
    {items.map(([id,label,icon])=><button key={id} 
    className={page===id?"nav active":"nav"} onClick={()=>setPage(id)}>
      <span>{icon}</span>{label}</button>)}
      <button className="nav logout" onClick={onLogout}>↪ {t("logout")}</button></aside>}

function FarmerDashboard({farmer,tokens,setPage,t}){const token=tokens.find(x=>x.farmerId===farmer.id&&x.status!=="Cancelled");return <section><PageHead title={`${t("welcomeComma")} ${farmer.name} 👋`} text={t("manageActivities")} /><div className="stats"><Stat icon="🎫" label={t("activeToken")} value={token?.token||"—"}/><Stat icon="📍" label={t("procurementCentre")} value={token?.centre?.split(" Procurement")[0]||t("notSelected")}/><Stat icon="🔢" label={t("queuePosition")} value={token?.queue||"—"}/><Stat icon="💰" label={t("payment")} value={t("pending")}/></div><div className="grid2"><Card title={t("currentStatus")}><div className="timeline">{[["tokenBooked","Token Booked"],["produceReached","Produce Reached Centre"],["qualityVerification","Quality Verification"],["procurementCompleted","Procurement Completed"],["paymentProcessed","Payment Processed"]].map(([key,fallback],i)=><div className={"step "+(i<2?"done":"")} key={key}><span>{i<2?"✓":i+1}</span><div><b>{t(key)}</b><small>{i<2?t("completed"):t("pending")}</small></div></div>)}</div></Card><Card title={t("quickActions")}><button className="action" onClick={()=>setPage("book")}>🎫 {t("bookNewToken")} <span>→</span></button><button className="action" onClick={()=>setPage("queue")}>🔎 {t("viewQueue")} <span>→</span></button><button className="action" onClick={()=>setPage("notifications")}>🔔 {t("notifications")} <span>→</span></button><button className="action" onClick={()=>setPage("gps")}>📍 {t("gps")} <span>→</span></button><CallAdminButton t={t} phoneNumber={ADMIN_PHONE_NUMBER}/><button className="action" onClick={()=>setPage("analysis")}>📈 {t("analysis")} <span>→</span></button><button className="action" onClick={()=>setPage("reports")}>📄 {t("reports")} <span>→</span></button><button className="action" onClick={()=>setPage("cancel")}>✕ {t("cancelBooking")} <span>→</span></button></Card></div></section>}

function Profile({farmer,t}){return <section><PageHead title={t("profile")} text={t("registeredFarmerInfo")}/><Card><InfoGrid data={{[t("farmerId")]:farmer.id,[t("name")]:farmer.name,[t("mobileNumber")]:farmer.mobile,[t("village")]:farmer.village,[t("district")]:farmer.district,[t("crop")]:farmer.crop,[t("quantity")]:farmer.quantity,[t("accountStatus")]:farmer.status}}/></Card></section>}

function Produce({farmer,t}){return <section><PageHead title={t("produceDetails")} text={t("produceSubmitted")}/><Card><table><thead><tr><th>{t("crop")}</th><th>{t("quantity")}</th><th>{t("centre")}</th><th>{t("verification")}</th></tr></thead><tbody><tr><td>{farmer.crop}</td><td>{farmer.quantity}</td><td>Jaipur Central Procurement Centre</td><td><span className="badge green">{t("pending")}</span></td></tr></tbody></table></Card></section>}

function BookToken({centres,slots=[],tokens=[],onBook,t}){
  const [centre,setCentre]=useState("");
  const [date,setDate]=useState("2026-09-11");
  const [time,setTime]=useState("10:00 AM");
  const [crop,setCrop]=useState("Wheat");
  const [quantity,setQuantity]=useState("");
  const [bookingType,setBookingType]=useState("normal");
  const [priorityReason,setPriorityReason]=useState("noSlot");
  const selectedCentre=centres.find(c=>c.id===centre);
  const matchingSlots=slots.filter(s=>String(s.centre_id)===String(centre) && String(s.date)===String(date));
  const selectedSlot=matchingSlots.find(s=>s.time_window===time) || matchingSlots[0];
  const normalAllocation=selectedCentre?Math.floor(selectedCentre.capacity*0.8):0;
  const priorityAllocation=selectedCentre?selectedCentre.capacity-normalAllocation:0;
  const centreTokens=selectedCentre?tokens.filter(x=>x.centreId===selectedCentre.id || (!x.centreId&&x.centre===selectedCentre.name)).filter(x=>x.status!=="Cancelled"):[];
  const normalUsed=centreTokens.filter(x=>(x.bookingType||"normal")==="normal").length;
  const priorityUsed=centreTokens.filter(x=>x.bookingType==="priority").length;
  const totalAvailable=selectedCentre?Math.max(0,selectedCentre.capacity-selectedCentre.today):0;
  const normalAvailable=Math.max(0,normalAllocation-normalUsed);
  const priorityAvailable=Math.max(0,priorityAllocation-priorityUsed);
  const categoryAvailable=bookingType==="priority"?priorityAvailable:normalAvailable;
  const canSubmit=Boolean(centre&&date&&time&&crop&&quantity&&Number(quantity)>0&&selectedSlot?.id);

  return <section>
    <PageHead title={t("bookProcurementToken")} text={t("selectCentreDateTime")} t={t}/>
    <div className="booking-grid">
      <div>
        <Card title={`1. ${t("selectCrop")}`}>
          <div className="crop-selection-grid">
            {bookingCrops.map(c=><button type="button" key={c} className={"crop-choice "+(crop===c?"selected":"")} onClick={()=>setCrop(c)}>{t(c.toLowerCase())}</button>)}
          </div>
          <div className="form-group">
            <label>{t("quantityToBook")}</label>
            <input type="number" min="1" value={quantity} placeholder={t("quantityPlaceholder")} onChange={e=>setQuantity(e.target.value)}/>
          </div>
        </Card>
        <Card title={`2. ${t("selectProcurementCentre")}`}>
          {centres.map(c=>{
            const available=Math.max(0,c.capacity-c.today);
            const isFull=available<=0;
            return <button type="button" key={c.id} className={"centre-card "+(centre===c.id?"selected":"")} onClick={()=>setCentre(c.id)}>
              <div><b>{c.name}</b><small>📍 {c.location}</small><small>{t("occupied")}: {c.today}/{c.capacity} · {t("availableSlots")}: {available}</small></div>
              <span className={"badge "+(isFull?"red":"green")}>{isFull?t("fullStatus"):t("availableStatus")}</span>
            </button>
          })}
        </Card>
      </div>
      <Card title={`3. ${t("selectDateTime")}`}>
        <div className="booking-type-tabs">
          <button type="button" className={bookingType==="normal"?"booking-type active":"booking-type"} onClick={()=>setBookingType("normal")}><strong>{t("normalBooking")}</strong><small>{t("normalBookingDesc")}</small></button>
          <button type="button" className={bookingType==="priority"?"booking-type active":"booking-type"} onClick={()=>setBookingType("priority")}><strong>{t("priorityBooking")}</strong><small>{t("priorityBookingDesc")}</small></button>
        </div>
        {bookingType==="priority"&&<div className="priority-reason"><label>{t("priorityReason")}</label><select value={priorityReason} onChange={e=>setPriorityReason(e.target.value)}><option value="noSlot">{t("reasonNoSlot")}</option><option value="requiredTime">{t("reasonRequiredTime")}</option><option value="other">{t("reasonOther")}</option></select></div>}
        <label>{t("date")}</label><input type="date" value={date} onChange={e=>setDate(e.target.value)}/>
        <label>{t("availableTimeSlot")}</label>
        <div className="slots">{["09:00 AM","10:00 AM","11:00 AM","12:00 PM","02:00 PM"].map(x=><button type="button" className={time===x?"slot selected":"slot"} onClick={()=>setTime(x)} key={x}>{x}</button>)}</div>
        {selectedCentre&&<div className="booking-capacity-summary">
          <div><span>{t("availableCapacity")}</span><strong>{totalAvailable}</strong></div>
          <div><span>{t("normalAvailable")}</span><strong>{normalAvailable}</strong></div>
          <div><span>{t("priorityAvailable")}</span><strong>{priorityAvailable}</strong></div>
        </div>}
        <p className="booking-category-note">ℹ️ {t("bookingCategoryNote")}</p>
        <button type="button" className="primary full" disabled={!canSubmit} onClick={()=>onBook({centre:selectedCentre?.name,centreId:selectedCentre?.id,slotId:selectedSlot?.id,date,time,crop,quantity,bookingType,priorityReason,queue:5})}>{(categoryAvailable<=0||totalAvailable<=0)&&centre?t("joinWaitingList"):t("confirmBooking")}</button>
        {centre&&totalAvailable<=0&&<div className="waiting-inline">⏳ {t("waitReason")}</div>}
      </Card>
    </div>
  </section>
}

function Queue({tokens,selected,onCancel,t}){
  const bookedToken=selected||(tokens.length?tokens[tokens.length-1]:null);
  const active=bookedToken&&bookedToken.status!=="Cancelled";
  const isWaiting=bookedToken?.status==="Waiting";
  return <section><PageHead title={t("queueStatus")} text={t("trackProgress")} t={t}/>{bookedToken?<Card title={isWaiting?t("waitingListStatus"):t("yourToken")}><div className="token-box">
    <div><span>{isWaiting?t("waitingListPosition"):t("tokenNumber")}</span><strong>{isWaiting?`#${bookedToken.queuePosition||"—"}`:bookedToken.token}</strong></div>
    <div><span>{t("procurementCentre")}</span><strong>{bookedToken.centre}</strong></div>
    <div><span>{t("crop")}</span><strong>{bookedToken.crop||"—"}</strong></div>
    <div><span>{t("date")}</span><strong>{bookedToken.date}</strong></div>
    <div><span>{t("timeSlot")}</span><strong>{bookedToken.time}</strong></div>
  </div>{isWaiting?<div className="queue-actions"><span className="badge yellow">{t("waiting")}</span><span className="muted">{t("waitReason")}</span></div>:active?<div className="queue-actions"><span className="badge green">{bookedToken.bookingType==="priority"?t("priorityBooking"):t("normalBooking")}</span><button className="danger-button" onClick={()=>{if(window.confirm(t("cancelBookingConfirm")))onCancel(bookedToken.token)}}>✕ {t("cancelBooking")}</button></div>:<div className="queue-actions"><span className="badge red">{t("cancelled")}</span></div>}</Card>:<Card><Empty text={t("noToken")}/></Card>}<Card title={t("procurementTimeline")}><div className="horizontal-timeline">{["tokenConfirmed","inQueue","verification","procured","payment"].map((key,i)=><div className={i<2&&active&&!isWaiting?"hstep done":"hstep"} key={key}><span>{i<2&&active&&!isWaiting?"✓":i+1}</span><b>{t(key)}</b></div>)}</div></Card></section>
}
function Payment({t}){return <section><PageHead title={t("paymentStatus")} text={t("trackPayment")}/><Card><div className="payment-card"><div className="big-icon">💰</div><h2>{t("paymentPending")}</h2><p>{t("paymentUpdateAfter")}</p><div className="info-row"><span>{t("expectedAmount")}</span><b>₹ 1,25,000</b></div><div className="info-row"><span>{t("paymentMethod")}</span><b>{t("bankTransfer")}</b></div></div></Card></section>}

function Notifications({t,notifications=[],markNotificationRead,farmerId}){const mine=notifications.filter(n=>n.farmerId===farmerId);const render=n=>{const d=n.data||{};if(n.type==="booking")return <><b>{t("bookingNotificationTitle")}</b><small>{t("bookingNotificationText")} {t("tokenNumber")}: {d.token} • {t("procurementCentre")}: {d.centre} • {t("date")}: {d.date} • {t("time")}: {d.time} • {t("crop")}: {d.crop||"—"}</small><small>{t("reachCentre")}</small></>;return <><b>{t("saleNotificationTitle")}</b><small>{t("saleNotificationText")} • {t("crop")}: {d.crop} • {t("quantityLabel")}: {d.quantity} • {t("paymentAmount")}: {d.amount} • {t("procurementCentre")}: {d.centre} • {t("status")}: {t("paid")}</small></>};const staticNotes=[t("note1"),t("note2"),t("note3"),t("note4")];return <section><PageHead title={t("notificationTitle")} text={t("importantUpdates")}/><div className="notice-list">{mine.map(n=><button type="button" className={"notice notification-button "+(!n.read?"unread":"")} key={n.id} onClick={()=>markNotificationRead?.(n.id)}><span>🔔</span><div>{render(n)}{!n.read&&<em>{t("unread")}</em>}</div></button>)}{staticNotes.map((n,i)=><div className="notice" key={`static-${i}`}><span>🔔</span><div><b>{n}</b><small>{t("today")} • 10:{20+i*5} AM</small></div></div>)}{!mine.length&&<div className="data-note">ℹ️ {t("noNewNotifications")}</div>}</div></section>}

function CancelBooking({tokens,onCancel,setPage,t}){const active=[...tokens].reverse().find(x=>x.status!=="Cancelled");return <section><PageHead title={t("cancelBookingTitle")} text={t("cancelBookingDesc")} t={t}/><Card>{active?<div className="cancel-card"><div className="cancel-card-icon">✕</div><div className="cancel-card-content"><span className="eyebrow">{t("activeBooking")}</span><h2>{active.token}</h2><p>{active.centre} · {active.date} · {active.time}</p><p className="cancel-question">{t("cancelBookingConfirm")}</p><div className="cancel-actions"><button className="danger-button" onClick={()=>{if(window.confirm(t("cancelBookingConfirm"))){onCancel(active.token);}}}>✕ {t("confirmCancel")}</button><button className="secondary" onClick={()=>setPage("queue")}>{t("keepBooking")}</button></div></div></div>:<Empty text={t("noActiveBooking")}/>}</Card></section>}

const paymentHistoryData=[{month:"Jan",received:0,pending:125000},{month:"Feb",received:65000,pending:60000},{month:"Mar",received:90000,pending:35000},{month:"Apr",received:110000,pending:20000},{month:"May",received:125000,pending:0},{month:"Jun",received:98000,pending:18000}];
const cropSalesHistoryData={F001:[{month:"Jan",quantity:1800},{month:"Feb",quantity:2400},{month:"Mar",quantity:3200},{month:"Apr",quantity:4100},{month:"May",quantity:4600},{month:"Jun",quantity:5000}],F002:[{month:"Jan",quantity:1200},{month:"Feb",quantity:1800},{month:"Mar",quantity:2400},{month:"Apr",quantity:2900},{month:"May",quantity:3300},{month:"Jun",quantity:3500}],F003:[{month:"Jan",quantity:800},{month:"Feb",quantity:1100},{month:"Mar",quantity:1500},{month:"Apr",quantity:1800},{month:"May",quantity:2100},{month:"Jun",quantity:2000}]};

// Indicative seasonal advisory for Rajasthan. This is a demo guidance model, not live mandi data.
const rajasthanSellingAdvisory=[
  {month:"January", wheat:5, mustard:5, bajra:1, maize:1, gram:5},
  {month:"February", wheat:5, mustard:5, bajra:1, maize:1, gram:5},
  {month:"March", wheat:5, mustard:4, bajra:1, maize:1, gram:4},
  {month:"April", wheat:5, mustard:2, bajra:1, maize:1, gram:3},
  {month:"May", wheat:4, mustard:1, bajra:2, maize:2, gram:2},
  {month:"June", wheat:2, mustard:1, bajra:4, maize:3, gram:1},
  {month:"July", wheat:1, mustard:1, bajra:5, maize:5, gram:1},
  {month:"August", wheat:1, mustard:1, bajra:5, maize:5, gram:1},
  {month:"September", wheat:1, mustard:1, bajra:5, maize:5, gram:1},
  {month:"October", wheat:1, mustard:2, bajra:4, maize:4, gram:2},
  {month:"November", wheat:3, mustard:4, bajra:2, maize:2, gram:4},
  {month:"December", wheat:4, mustard:5, bajra:1, maize:1, gram:5}
];
const advisoryCropKeys=["wheat","mustard","bajra","maize","gram"];
const advisoryCropWindows={wheat:"January–April",mustard:"January–March & November–December",bajra:"July–October",maize:"July–October",gram:"January–March & November–December"};


function FarmerAnalysis({farmer,t,tokens=[]}){const cropData=cropSalesHistoryData[farmer.id]||cropSalesHistoryData.F001;const totalSold=cropData.reduce((s,x)=>s+x.quantity,0);const received=paymentHistoryData.reduce((s,x)=>s+x.received,0);const pending=paymentHistoryData.reduce((s,x)=>s+x.pending,0);return <section className="analysis-report-area"><div className="analysis-toolbar"><div><PageHead title={t("analysisTitle")} text={t("analysisDesc")} t={t}/></div><button className="report-button generate-report-button" onClick={()=>window.print()}>📄 {t("generateReport")}</button></div><div className="analysis-cards farmer-analysis-summary"><div className="analysis-card"><span>{t("totalCropSold")}</span><strong>{totalSold.toLocaleString()}</strong><small>{t("kg")}</small></div><div className="analysis-card"><span>{t("totalPayments")}</span><strong>₹{received.toLocaleString("en-IN")}</strong><small>{t("received")}</small></div><div className="analysis-card"><span>{t("pendingAmount")}</span><strong>₹{pending.toLocaleString("en-IN")}</strong><small>{t("pending")}</small></div><div className="analysis-card"><span>{t("transactions")}</span><strong>{paymentHistoryData.length}</strong><small>{t("status")}</small></div></div><div className="analysis-chart-grid"><div className="analysis-chart-card"><h2>{t("paymentHistory")}</h2><p className="chart-description">{t("paymentHistoryDesc")}</p><ResponsiveContainer width="100%" height={320}><BarChart data={paymentHistoryData}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month"/><YAxis/><Tooltip/><Legend/><Bar dataKey="received" name={t("received")} fill="#1f8f5f" radius={[6,6,0,0]}/><Bar dataKey="pending" name={t("pendingAmount")} fill="#b9d9c6" radius={[6,6,0,0]}/></BarChart></ResponsiveContainer></div><div className="analysis-chart-card"><h2>{t("cropSalesHistory")}</h2><p className="chart-description">{t("cropSalesHistoryDesc")}</p><ResponsiveContainer width="100%" height={320}><LineChart data={cropData}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month"/><YAxis/><Tooltip/><Legend/><Line type="monotone" dataKey="quantity" name={t("quantitySold")} stroke="#1f8f5f" strokeWidth={3} dot={{r:4}}/></LineChart></ResponsiveContainer></div></div><div className="advisory-section"><div className="advisory-heading"><div><h2>{t("cropAdvisory")}</h2><p>{t("cropAdvisoryDesc")}</p></div></div><div className="analysis-chart-card"><h2>{t("advisoryGraph")}</h2><p className="chart-description">{t("advisoryGraphDesc")}</p><ResponsiveContainer width="100%" height={360}><LineChart data={rajasthanSellingAdvisory}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month"/><YAxis domain={[0,5]} ticks={[1,2,3,4,5]}/><Tooltip/><Legend/><Line type="monotone" dataKey="wheat" name={t("wheat")} stroke="#1f8f5f" strokeWidth={3}/><Line type="monotone" dataKey="mustard" name={t("mustard")} stroke="#d4a72c" strokeWidth={3}/><Line type="monotone" dataKey="bajra" name={t("bajra")} stroke="#8b6f47" strokeWidth={3}/><Line type="monotone" dataKey="maize" name={t("maize")} stroke="#e28a2b" strokeWidth={3}/><Line type="monotone" dataKey="gram" name={t("gram")} stroke="#6f8f45" strokeWidth={3}/></LineChart></ResponsiveContainer></div><div className="farmer-advisory-highlight"><div><span className="eyebrow">🌾 {t("recommendedCrop")}</span><h3>{t((String(farmer.crop||"").toLowerCase()==="wheat"?"wheat":String(farmer.crop||"").toLowerCase()==="mustard"?"mustard":String(farmer.crop||"").toLowerCase()==="bajra"?"bajra":String(farmer.crop||"").toLowerCase()==="maize"?"maize":"gram"))}</h3><p>{t("bestSellingWindow")}: <strong>{advisoryCropWindows[String(farmer.crop||"").toLowerCase()==="wheat"?"wheat":String(farmer.crop||"").toLowerCase()==="mustard"?"mustard":String(farmer.crop||"").toLowerCase()==="bajra"?"bajra":String(farmer.crop||"").toLowerCase()==="maize"?"maize":"gram"]}</strong></p></div><div className="advisory-highlight-note">{t("advisoryNote")}</div></div><div className="advisory-grid">{advisoryCropKeys.map(key=><div className="advisory-card" key={key}><strong>{t(key)}</strong><span>{t("bestSellingWindow")}</span><b>{advisoryCropWindows[key]}</b></div>)}</div><div className="data-note">ℹ️ {t("advisoryNote")}</div></div><div className="data-note">ℹ️ {t("demoDataNote")}</div><div className="print-only-report-details"><div className="print-report-heading"><div className="report-brand"><img src="/assets/images/agro-vision-logo-transparent.png" alt="Agro Vision"/><div><strong>{t("agroVision")}</strong><span>{t("smartProcurement")}</span></div></div><h2>{t("farmerCompleteReport")}</h2><p>{t("farmerCompleteReportDesc")}</p></div><h3>{t("farmerDetails")}</h3><div className="table-wrap"><table><tbody><tr><th>{t("farmerId")}</th><td>{farmer.id}</td><th>{t("name")}</th><td>{farmer.name}</td></tr><tr><th>{t("mobileNumber")}</th><td>{farmer.mobile}</td><th>{t("village")}</th><td>{farmer.village}</td></tr><tr><th>{t("district")}</th><td>{farmer.district}</td><th>{t("crop")}</th><td>{farmer.crop}</td></tr><tr><th>{t("quantity")}</th><td>{farmer.quantity}</td><th>{t("accountStatus")}</th><td>{farmer.status}</td></tr></tbody></table></div><h3>{t("purchasingDetails")}</h3><div className="table-wrap"><table><thead><tr><th>{t("tokenNumber")}</th><th>{t("centre")}</th><th>{t("date")}</th><th>{t("time")}</th><th>{t("crop")}</th><th>{t("quantity")}</th><th>{t("status")}</th></tr></thead><tbody>{tokens.length?tokens.map(x=><tr key={x.token}><td>{x.token}</td><td>{x.centre}</td><td>{x.date}</td><td>{x.time}</td><td>{farmer.crop}</td><td>{farmer.quantity}</td><td>{x.status}</td></tr>):<tr><td colSpan="7">{t("noPurchasingDetails")}</td></tr>}</tbody></table></div><h3>{t("paymentDetails")}</h3><div className="table-wrap"><table><thead><tr><th>{t("month")}</th><th>{t("received")}</th><th>{t("pendingAmount")}</th></tr></thead><tbody>{paymentHistoryData.map(x=><tr key={x.month}><td>{x.month}</td><td>₹{x.received.toLocaleString("en-IN")}</td><td>₹{x.pending.toLocaleString("en-IN")}</td></tr>)}</tbody></table></div><h3>{t("paymentChart")}</h3><div className="report-chart"><ResponsiveContainer width="100%" height={300}><BarChart data={paymentHistoryData}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month"/><YAxis/><Tooltip/><Legend/><Bar dataKey="received" name={t("received")} fill="#1f8f5f"/><Bar dataKey="pending" name={t("pendingAmount")} fill="#b9d9c6"/></BarChart></ResponsiveContainer></div><h3>{t("cropChart")}</h3><div className="report-chart"><ResponsiveContainer width="100%" height={300}><LineChart data={cropData}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month"/><YAxis/><Tooltip/><Legend/><Line type="monotone" dataKey="quantity" name={t("quantitySold")} stroke="#1f8f5f" strokeWidth={3}/></LineChart></ResponsiveContainer></div></div></section>}

function FarmerGPS({centres,t,language}){
  const [coords,setCoords]=useState(null);
  const [status,setStatus]=useState("idle");
  const [error,setError]=useState("");
  const locate=()=>{
    setError("");
    if(!navigator.geolocation){setStatus("error");setError(t("gpsNotSupported"));return;}
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      p=>{setCoords({lat:p.coords.latitude,lng:p.coords.longitude});setStatus("ready");},
      e=>{setStatus("error");setError(e.code===1?t("locationDenied"):e.code===3?t("locationTimeout"):t("locationUnavailable"));},
      {enableHighAccuracy:true,timeout:15000,maximumAge:60000}
    );
  };
  const distance=(lat1,lon1,lat2,lon2)=>{const R=6371,dLat=(lat2-lat1)*Math.PI/180,dLon=(lon2-lon1)*Math.PI/180;const a=Math.sin(dLat/2)**2+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));};
  const rows=coords?[...centres].map(c=>({...c,distance:distance(coords.lat,coords.lng,c.lat,c.lng)})).sort((a,b)=>a.distance-b.distance):centres;
  return <section className="gps-page"><PageHead title={t("gpsTitle")} text={t("gpsDesc")} t={t}/><div className="gps-hero"><div><span className="eyebrow">📍 GPS</span><h2>{coords?t("locationReady"):t("noLocationYet")}</h2><p>{t("locationNote")}</p></div><button className="primary gps-locate-button" onClick={locate} disabled={status==="locating"}>📍 {status==="locating"?t("locating"):t("locateMe")}</button></div>{error&&<div className="gps-error">⚠️ {error}</div>}{coords&&<div className="gps-coordinates"><span>{t("coordinates")}</span><strong>{coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}</strong></div>}<div className="gps-centre-grid">{rows.map(c=><div className="gps-centre-card" key={c.id}><div className="gps-centre-icon">📍</div><div className="gps-centre-main"><div className="gps-centre-title"><h3>{c.name}</h3><span className={"badge "+(c.status==="Open"?"green":"red")}>{c.status==="Open"?t("open"):t("full")}</span></div><p>{c.location}</p>{coords?<strong className="gps-distance">{c.distance.toFixed(1)} {t("kmAway")}</strong>:<span className="gps-distance muted-distance">{t("noLocationYet")}</span>}<div className="gps-centre-actions"><a className="secondary gps-nav-link" target="_blank" rel="noreferrer" href={`https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lng}`}>🧭 {t("openMaps")}</a></div></div></div>)}</div></section>
}

const ADMIN_PHONE_NUMBER = ""; // Frontend configuration placeholder. Add the real admin number without the + sign if needed.

function CallAdminButton({t,phoneNumber=ADMIN_PHONE_NUMBER}){const configured=Boolean(phoneNumber);return <div className="call-admin-card"><div><strong>📞 {t("callAdmin")}</strong><p>{t("callAdminDesc")}</p></div><button className="primary" onClick={()=>{if(!configured){alert(t("adminPhoneNotConfigured"));return;}if(window.confirm(t("callConfirmation")))window.location.href=`tel:${phoneNumber}`;}}>{configured?`📞 ${t("callAdmin")}`:`📞 ${t("callAdmin")}`}</button></div>}

function FarmerFeedback({farmer,t}){const [rating,setRating]=useState(5);const [comments,setComments]=useState("");const [category,setCategory]=useState("");const [submitted,setSubmitted]=useState(false);const submit=e=>{e.preventDefault();const item={farmerId:farmer.id,farmerName:farmer.name,rating,comments,category,createdAt:new Date().toISOString()};try{const old=JSON.parse(localStorage.getItem("agroVisionFeedback")||"[]");localStorage.setItem("agroVisionFeedback",JSON.stringify([item,...old]));}catch{}setSubmitted(true);setComments("");setRating(5);setCategory("");};return <section><PageHead title={t("feedbackTitle")} text={t("feedbackDesc")}/><Card><form onSubmit={submit}><div className="feedback-profile"><span>👨‍🌾</span><div><b>{farmer.name}</b><small>{t("farmerId")}: {farmer.id}</small></div></div><div className="form-group"><label>{t("rating")}</label><div className="star-rating" role="radiogroup" aria-label={t("rating")}>{[1,2,3,4,5].map(n=><button type="button" key={n} className={n<=rating?"star selected":"star"} onClick={()=>setRating(n)} aria-label={`${n} / 5`}>★</button>)}</div></div><div className="form-group"><label>{t("feedbackCategory")}</label><select value={category} onChange={e=>setCategory(e.target.value)}><option value="">{t("selectCategory")}</option><option value="booking">{t("categoryBooking")}</option><option value="payment">{t("categoryPayment")}</option><option value="centre">{t("categoryCentre")}</option><option value="app">{t("categoryApp")}</option><option value="other">{t("categoryOther")}</option></select></div><div className="form-group"><label>{t("comments")}</label><textarea value={comments} onChange={e=>setComments(e.target.value)} placeholder={t("feedbackPlaceholder")} rows="5" required /></div><button className="primary" type="submit">⭐ {t("submit")}</button>{submitted&&<div className="feedback-success">✓ {t("feedbackSuccess")} <span>{t("feedbackStoredDemo")}</span></div>}</form></Card></section>}

const rajasthanCropPrices=[
  {crop:"Wheat",price:"Demo value",unit:"₹/quintal",market:"Rajasthan sample",date:"Demo",trend:"Stable",demand:"Medium"},
  {crop:"Mustard",price:"Demo value",unit:"₹/quintal",market:"Rajasthan sample",date:"Demo",trend:"Up",demand:"High"},
  {crop:"Bajra",price:"Demo value",unit:"₹/quintal",market:"Rajasthan sample",date:"Demo",trend:"Stable",demand:"High"},
  {crop:"Gram",price:"Demo value",unit:"₹/quintal",market:"Rajasthan sample",date:"Demo",trend:"Up",demand:"High"},
  {crop:"Barley",price:"Demo value",unit:"₹/quintal",market:"Rajasthan sample",date:"Demo",trend:"Stable",demand:"Medium"},
  {crop:"Maize",price:"Demo value",unit:"₹/quintal",market:"Rajasthan sample",date:"Demo",trend:"Down",demand:"Medium"},
  {crop:"Guar",price:"Demo value",unit:"₹/quintal",market:"Rajasthan sample",date:"Demo",trend:"Up",demand:"High"}
];

function CropPrices({t,farmer}){const crop=rajasthanCropPrices.find(x=>x.crop.toLowerCase()===farmer.crop.toLowerCase());return <section><PageHead title={t("cropPrices")} text={t("cropPricesDesc")}/><div className="price-demo-banner">ℹ️ <strong>{t("demoPriceLabel")}</strong> — {t("priceSourceNote")}</div><div className="price-highlight"><div><span className="eyebrow">🌾 {t("trendingCrops")}</span><h2>{crop? t(crop.crop.toLowerCase()):farmer.crop}</h2><p>{t("highDemand")}: <b>{crop?.demand==="High"?t("highDemand"):t("medium")}</b> · {t("trend")}: <b>{crop?.trend==="Up"?t("up"):crop?.trend==="Down"?t("down"):t("stable")}</b></p></div><span className="price-badge">{crop?.price||"—"}</span></div><Card title={t("cropPrices")}><div className="table-wrap"><table><thead><tr><th>{t("crop")}</th><th>{t("amount")}</th><th>{t("priceUnit")}</th><th>{t("market")}</th><th>{t("priceDate")}</th><th>{t("trend")}</th><th>{t("highDemand")}</th></tr></thead><tbody>{rajasthanCropPrices.map(x=><tr key={x.crop}><td><b>{t(x.crop.toLowerCase())}</b></td><td>{x.price==="Demo value"?t("demoValue"):x.price}</td><td>{x.unit}</td><td>{x.market==="Rajasthan sample"?t("sampleMarket"):x.market}</td><td>{x.date==="Demo"?t("demoDate"):x.date}</td><td><span className={"badge "+(x.trend==="Up"?"green":x.trend==="Down"?"red":"yellow")}>{x.trend==="Up"?t("up"):x.trend==="Down"?t("down"):t("stable")}</span></td><td>{x.demand==="High"?t("highDemand"):t("medium")}</td></tr>)}</tbody></table></div></Card></section>}

function getCentreStats(centre,tokens=[]){
  const centreTokens=tokens.filter(x=>x.centreId===centre.id || (!x.centreId&&x.centre===centre.name)).filter(x=>x.status!=="Cancelled");
  const normalAllocation=Math.floor(centre.capacity*0.8);
  const priorityAllocation=centre.capacity-normalAllocation;
  const usedNormal=centreTokens.filter(x=>(x.bookingType||"normal")==="normal").length;
  const usedPriority=centreTokens.filter(x=>x.bookingType==="priority").length;
  const occupied=Math.min(centre.capacity,centre.today);
  return {normalAllocation,priorityAllocation,usedNormal,usedPriority,occupied,availableSlots:Math.max(0,centre.capacity-occupied),normalAvailable:Math.max(0,normalAllocation-usedNormal),priorityAvailable:Math.max(0,priorityAllocation-usedPriority)};
}

function CentreCapacity({centres,tokens,waitingList,setCentres,t}){
  const [slotInputs,setSlotInputs]=useState({});
  const [slotMessage,setSlotMessage]=useState("");
  const increaseSlots=(centreId)=>{
    const amount=Number(slotInputs[centreId]||0);
    if(!Number.isInteger(amount)||amount<=0){
      setSlotMessage(t("invalidSlotIncrease"));
      return;
    }
    setCentres(prev=>prev.map(c=>c.id===centreId?{...c,capacity:c.capacity+amount,status:c.today>=c.capacity+amount?"Full":"Open"}:c));
    setSlotInputs(prev=>({...prev,[centreId]:""}));
    setSlotMessage(`${amount} ${t("slotsAdded")}`);
    setTimeout(()=>setSlotMessage(""),3000);
  };
  return <section><PageHead title={t("centreCapacityTitle")} text={t("centreCapacityDesc")} t={t}/>{slotMessage&&<div className="success-banner">✓ {slotMessage}</div>}<div className="capacity-dashboard-grid">{centres.map(c=>{const s=getCentreStats(c,tokens);const isFull=s.availableSlots<=0;const waiting=waitingList.filter(x=>x.centreId===c.id&&x.status==="Waiting").length;return <Card key={c.id}><div className="centre-title"><div><span className="eyebrow">📍 {c.location}</span><h3>{c.name}</h3></div><span className={"badge "+(isFull?"red":"green")}>{isFull?t("fullStatus"):t("availableStatus")}</span></div><div className="capacity-meter"><div style={{width:`${Math.min(100,(s.occupied/c.capacity)*100)}%`}}/></div><div className="capacity-big"><strong>{s.occupied}</strong><span>/ {c.capacity} {t("occupiedSlots")}</span></div><div className="capacity-metrics"><div><small>{t("availableSlots")}</small><b>{s.availableSlots}</b></div><div><small>{t("normalAllocation")}</small><b>{s.normalAllocation}</b></div><div><small>{t("priorityAllocation")}</small><b>{s.priorityAllocation}</b></div><div><small>{t("waitingList")}</small><b>{waiting}</b></div></div><div className="allocation-row"><span>{t("normalBooking")}</span><b>{s.usedNormal} / {s.normalAllocation}</b></div><div className="allocation-row"><span>{t("priorityBooking")}</span><b>{s.usedPriority} / {s.priorityAllocation}</b></div><div className="capacity-increase-box"><div><b>{t("increaseSlots")}</b><small>{t("addSlotsHint")}</small></div><div className="capacity-increase-controls"><input type="number" min="1" step="1" inputMode="numeric" placeholder={t("addSlotsPlaceholder")} value={slotInputs[c.id]??""} onChange={e=>setSlotInputs(prev=>({...prev,[c.id]:e.target.value}))}/><button type="button" className="small-btn" onClick={()=>increaseSlots(c.id)}>{t("increaseSlots")}</button></div></div></Card>})}</div></section>
}

function AdminWaitingList({waitingList,t}){
  return <section><PageHead title={t("adminWaitingList")} text={t("centreCapacityDesc")} t={t}/><Card><div className="table-wrap"><table><thead><tr><th>{t("queuePosition")}</th><th>{t("farmer")}</th><th>{t("crop")}</th><th>{t("quantity")}</th><th>{t("centre")}</th><th>{t("requestDate")}</th><th>{t("requestedSlot")}</th><th>{t("requestType")}</th><th>{t("reason")}</th><th>{t("status")}</th></tr></thead><tbody>{waitingList.length?waitingList.map((x,i)=><tr key={x.id}><td><b>#{x.queuePosition||i+1}</b></td><td>{x.farmer}</td><td>{x.crop}</td><td>{x.quantity}</td><td>{x.centre}</td><td>{x.date}</td><td>{x.time}</td><td><span className="badge yellow">{x.bookingType==="priority"?t("priorityBooking"):t("normalBooking")}</span></td><td>{x.priorityReason==="requiredTime"?t("reasonRequiredTime"):x.priorityReason==="other"?t("reasonOther"):t("reasonNoSlot")}</td><td><span className="badge yellow">{t("pendingReview")}</span></td></tr>):<tr><td colSpan="10">{t("noWaitingRequests")}</td></tr>}</tbody></table></div></Card></section>
}

function FarmerReports({farmer,tokens,t}){const cropData=cropSalesHistoryData[farmer.id]||cropSalesHistoryData.F001;const totalSold=cropData.reduce((s,x)=>s+x.quantity,0);return <section className="report-page"><PageHead title={t("reportsTitle")} text={t("reportsDesc")} t={t}/><div className="report-toolbar"><div><b>{t("reportsTitle")}</b><span>{t("reportReady")}</span></div><button className="report-button" onClick={()=>window.print()}>📄 {t("generateReport")}</button></div><div className="report-sheet"><div className="report-brand"><img src="/assets/images/agro-vision-logo-transparent.png" alt="Agro Vision"/><div><strong>{t("agroVision")}</strong><span>{t("smartProcurement")}</span></div></div><h2>{t("reportsTitle")}</h2><div className="report-summary-grid"><div><small>{t("farmerId")}</small><b>{farmer.id}</b></div><div><small>{t("name")}</small><b>{farmer.name}</b></div><div><small>{t("mobileNumber")}</small><b>{farmer.mobile}</b></div><div><small>{t("village")}</small><b>{farmer.village}</b></div><div><small>{t("district")}</small><b>{farmer.district}</b></div><div><small>{t("crop")}</small><b>{farmer.crop}</b></div><div><small>{t("quantity")}</small><b>{farmer.quantity}</b></div><div><small>{t("totalCropSold")}</small><b>{totalSold.toLocaleString()} {t("kg")}</b></div><div><small>{t("accountStatus")}</small><b>{farmer.status}</b></div></div><h3>{t("cropSalesHistory")}</h3><div className="table-wrap"><table><thead><tr><th>{t("month")}</th><th>{t("crop")}</th><th>{t("quantitySold")}</th></tr></thead><tbody>{cropData.map(x=><tr key={x.month}><td>{x.month}</td><td>{farmer.crop}</td><td>{x.quantity.toLocaleString()}</td></tr>)}</tbody></table></div><h3>{t("queueStatus")}</h3><div className="table-wrap"><table><thead><tr><th>{t("tokenNumber")}</th><th>{t("centre")}</th><th>{t("date")}</th><th>{t("status")}</th></tr></thead><tbody>{tokens.length?tokens.map(x=><tr key={x.token}><td>{x.token}</td><td>{x.centre}</td><td>{x.date}</td><td>{x.status}</td></tr>):<tr><td colSpan="4">{t("noToken")}</td></tr>}</tbody></table></div><h3>{t("paymentChart")}</h3><div className="report-chart"><ResponsiveContainer width="100%" height={300}><BarChart data={paymentHistoryData}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month"/><YAxis/><Tooltip/><Legend/><Bar dataKey="received" name={t("received")} fill="#1f8f5f"/><Bar dataKey="pending" name={t("pendingAmount")} fill="#b9d9c6"/></BarChart></ResponsiveContainer></div><h3>{t("cropChart")}</h3><div className="report-chart"><ResponsiveContainer width="100%" height={300}><LineChart data={cropData}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month"/><YAxis/><Tooltip/><Legend/><Line type="monotone" dataKey="quantity" name={t("quantitySold")} stroke="#1f8f5f" strokeWidth={3}/></LineChart></ResponsiveContainer></div><h3>{t("advisoryGraph")}</h3><div className="report-chart"><ResponsiveContainer width="100%" height={330}><LineChart data={rajasthanSellingAdvisory}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month"/><YAxis domain={[0,5]}/><Tooltip/><Legend/><Line type="monotone" dataKey="wheat" name={t("wheat")} stroke="#1f8f5f"/><Line type="monotone" dataKey="mustard" name={t("mustard")} stroke="#d4a72c"/><Line type="monotone" dataKey="bajra" name={t("bajra")} stroke="#8b6f47"/><Line type="monotone" dataKey="maize" name={t("maize")} stroke="#e28a2b"/><Line type="monotone" dataKey="gram" name={t("gram")} stroke="#6f8f45"/></LineChart></ResponsiveContainer></div><div className="data-note">ℹ️ {t("advisoryNote")}</div><div className="report-footer">🌱 {t("agroVision")} · {t("smartProcurement")}</div></div></section>}

function OperatorApp({tokens=[],farmers=[],onLogout,t}){
  const [page,setPage]=useState("tokens");
  return <div className="layout"><Sidebar title={t("operatorPortal")||"Operator Portal"} items={[["tokens",t("todaysTokens"),"🎫"],["verification",t("produceVerification"),"⚖️"]]} page={page} setPage={setPage} onLogout={onLogout} t={t}/><main className="content">{page==="tokens"&&<TokenManagement tokens={tokens} t={t}/>} {page==="verification"&&<Verification farmers={farmers} t={t}/>}</main></div>;
}

function AdminApp({
  farmers,
  centres,
  tokens,
  waitingList,
  setCentres,
  onLogout,
  t,
  addSalePaymentNotification
}) {

  const [page, setPage] = useState("dashboard");
  const [search, setSearch] = useState("");

  return (
    <div className="layout">

      <Sidebar
        title={t("adminCentre")}

        items={[
          ["dashboard", t("dashboard"), "📊"],
          ["farmers", t("registeredFarmers"), "👨‍🌾"],
          ["centres", t("procurementCentres"), "📍"],
          ["tokens", t("todaysTokens"), "🎫"],
          ["verification", t("produceVerification"), "⚖️"],
          ["payments", t("adminPaymentStatus"), "💰"],
          ["capacity", t("centreCapacityTitle"), "📊"],
          ["waiting", t("adminWaitingList"), "⏳"],
          ["analysis",t("analysisReports"),"📈"]
        ]}

        page={page}
        setPage={setPage}
        onLogout={onLogout}
        t={t}
      />

      <main className="content">

        {page === "dashboard" &&
          <AdminDashboard
            farmers={farmers}
            centres={centres}
            tokens={tokens}
            t={t}
          />
        }

        {page === "farmers" &&
          <FarmerManagement
            farmers={farmers}
            search={search}
            setSearch={setSearch}
            t={t}
          />
        }

        {page === "centres" &&
          <CentreManagement
            centres={centres}
            setCentres={setCentres}
            t={t}
          />
        }

        {page === "tokens" &&
          <TokenManagement
            tokens={tokens}
            t={t}
          />
        }

        {page === "verification" &&
          <Verification
            farmers={farmers}
            t={t}
          />
        }

        {page === "payments" && <AdminPayments t={t} onPaymentCompleted={addSalePaymentNotification}/>}

        {page === "capacity" && <CentreCapacity centres={centres} tokens={tokens} waitingList={waitingList} setCentres={setCentres} t={t}/>}
        {page === "waiting" && <AdminWaitingList waitingList={waitingList} t={t}/>}

        {/* NEW ANALYSIS PAGE */}
        {page === "analysis" &&
          <Analysis farmers={farmers} tokens={tokens} t={t}/>
        }

      </main>

    </div>
  );
}

function AdminDashboard({farmers,centres,tokens,t}){return <section><PageHead title={t("adminDashboard")} text={t("centralizedManagement")}/><div className="stats"><Stat icon="👨‍🌾" label={t("registeredFarmers")} value={farmers.length}/><Stat icon="🎫" label={t("todaysTokens")} value={tokens.length}/><Stat icon="📦" label={t("completedProcurement")} value="18"/><Stat icon="💰" label={t("pendingPayments")} value="7"/></div><div className="grid2"><Card title={t("centreWiseCapacity")}><table><thead><tr><th>{t("centre")}</th><th>{t("location")}</th><th>{t("today")}</th><th>{t("capacityOnly")}</th><th>{t("status")}</th></tr></thead><tbody>{centres.map(c=><tr key={c.id}><td>{c.name}</td><td>{c.location}</td><td>{c.today}</td><td>{c.capacity}</td><td><span className={"badge "+(c.status==="Open"?"green":"red")}>{c.status==="Open"?t("open"):t("full")}</span></td></tr>)}</tbody></table></Card><Card title={t("recentTokens")}>{tokens.map(x=><div className="mini-row" key={x.token}><b>{x.token}</b><span>{x.farmer}</span><span>{x.time}</span><span className="badge green">{x.status}</span></div>)}</Card></div></section>}

function FarmerManagement({farmers,search,setSearch,t}){const data=farmers.filter(f=>f.name.toLowerCase().includes(search.toLowerCase())||f.id.toLowerCase().includes(search.toLowerCase()));return <section><PageHead title={t("registeredFarmers")} text={t("viewManageRecords")}/><Card><input className="search" placeholder={t("searchFarmer")} value={search} onChange={e=>setSearch(e.target.value)}/><table><thead><tr><th>ID</th><th>{t("farmer")}</th><th>{t("mobileNumber")}</th><th>{t("location")}</th><th>{t("crop")}</th><th>{t("status")}</th></tr></thead><tbody>{data.map(f=><tr key={f.id}><td>{f.id}</td><td><b>{f.name}</b></td><td>{f.mobile}</td><td>{f.village}, {f.district}</td><td>{f.crop}</td><td><span className={"badge "+(f.status==="Active"?"green":"yellow")}>{f.status}</span></td></tr>)}</tbody></table></Card></section>}

function CentreManagement({centres,setCentres,t}){
  const [slotInputs,setSlotInputs]=useState({});
  const [slotMessage,setSlotMessage]=useState("");
  const increaseSlots=(centreId)=>{
    const amount=Number(slotInputs[centreId]||0);
    if(!Number.isInteger(amount)||amount<=0){setSlotMessage(t("invalidSlotIncrease"));return;}
    setCentres(prev=>prev.map(c=>c.id===centreId?{...c,capacity:c.capacity+amount,status:c.today>=c.capacity+amount?"Full":"Open"}:c));
    setSlotInputs(prev=>({...prev,[centreId]:""}));
    setSlotMessage(`${amount} ${t("slotsAdded")}`);
    setTimeout(()=>setSlotMessage(""),3000);
  };
  return <section><PageHead title={t("procurementCentres")} text={t("manageCapacity")}/>{slotMessage&&<div className="success-banner">✓ {slotMessage}</div>}<div className="centre-admin-grid">{centres.map(c=>{const isFull=c.today>=c.capacity;return <Card key={c.id}><div className="centre-title"><div className="big-icon">📍</div><span className={"badge "+(isFull?"red":"green")}>{isFull?t("full"):t("open")}</span></div><h3>{c.name}</h3><p>{c.location}</p><div className="progress"><div style={{width:`${Math.min(100,c.today/c.capacity*100)}%`}}/></div><small>{c.today} / {c.capacity} {t("tokensUsedToday")}</small><div className="capacity-increase-box compact"><b>{t("increaseSlots")}</b><small>{t("addSlotsHint")}</small><div className="capacity-increase-controls"><input type="number" min="1" step="1" inputMode="numeric" placeholder={t("addSlotsPlaceholder")} value={slotInputs[c.id]??""} onChange={e=>setSlotInputs(prev=>({...prev,[c.id]:e.target.value}))}/><button type="button" className="small-btn" onClick={()=>increaseSlots(c.id)}>{t("increaseSlots")}</button></div></div><button className="secondary full" onClick={()=>setCentres(prev=>prev.map(x=>x.id===c.id?{...x,status:x.status==="Open"?"Full":"Open"}:x))}>{t("toggleStatus")}</button></Card>})}</div></section>
}

function TokenManagement({tokens,t}){return <section><PageHead title={t("todaysTokens")} text={t("manageQueue")}/><Card><table><thead><tr><th>{t("tokenNumber")}</th><th>{t("farmer")}</th><th>{t("centre")}</th><th>{t("time")}</th><th>{t("queue")}</th><th>{t("status")}</th></tr></thead><tbody>{tokens.map(x=><tr key={x.token}><td><b>{x.token}</b></td><td>{x.farmer}</td><td>{x.centre}</td><td>{x.time}</td><td>#{x.queue}</td><td><span className="badge green">{x.status}</span></td></tr>)}</tbody></table></Card></section>}

function Verification({farmers,t}){return <section><PageHead title={t("produceVerification")} text={t("verifyProduce")}/><Card><table><thead><tr><th>{t("farmer")}</th><th>{t("crop")}</th><th>{t("quantity")}</th><th>{t("quality")}</th><th>{t("action")}</th></tr></thead><tbody>{farmers.map(f=><tr key={f.id}><td>{f.name}</td><td>{f.crop}</td><td>{f.quantity}</td><td><span className="badge yellow">{t("pending")}</span></td><td><button className="small-btn">{t("verify")}</button></td></tr>)}</tbody></table></Card></section>}

function AdminPayments({t,onPaymentCompleted}){const rows=[['F001','Ravi Kumar','₹1,25,000','Bank Transfer','Pending','Wheat','500 kg','Jaipur Central Procurement Centre'],['F002','Mohan Singh','₹87,500','Bank Transfer','Processed','Mustard','350 kg','Chomu Procurement Centre'],['F003','Sita Devi','₹50,000','Bank Transfer','Pending','Wheat','200 kg','Jaipur Central Procurement Centre']];const [paidIds,setPaidIds]=useState([]);return <section><PageHead title={t("paymentStatus")} text={t("monitorPayments")}/><Card><table><thead><tr><th>{t("farmer")}</th><th>{t("procurementAmount")}</th><th>{t("paymentMethod")}</th><th>{t("status")}</th><th>{t("action")}</th></tr></thead><tbody>{rows.map(r=>{const processed=r[4]==="Processed"||paidIds.includes(r[0]);return <tr key={r[0]}><td>{r[1]}</td><td>{r[2]}</td><td>{t("bankTransfer")}</td><td><span className={"badge "+(processed?"green":"yellow")}>{processed?t("processed"):t("pending")}</span></td><td>{processed?<span className="muted">✓ {t("processed")}</span>:<button type="button" className="small-btn" onClick={()=>{setPaidIds(prev=>[...prev,r[0]]);onPaymentCompleted?.({farmerId:r[0],farmer:r[1],crop:r[5],quantity:r[6],amount:r[2],centre:r[7],paymentStatus:"Paid",saleStatus:"Completed"});}}>{t("markPaid")}</button>}</td></tr>})}</tbody></table></Card></section>}

function PageHead({title,text,t}){return <div className="page-head"><div><h1>{title}</h1><p>{text}</p></div><div className="user-chip">🌾 {t ? t("agroVision") : "Agro Vision"}</div></div>}
function Card({title,children}){return <div className="card">{title&&<h2>{title}</h2>}{children}</div>}
function Stat({icon,label,value}){return <div className="stat"><div className="stat-icon">{icon}</div><div><small>{label}</small><strong>{value}</strong></div></div>}
function InfoGrid({data}){return <div className="info-grid">{Object.entries(data).map(([k,v])=><div key={k}><small>{k}</small><b>{v}</b></div>)}</div>}
function Empty({text}){return <div className="empty">📭<p>{text}</p></div>}

const procurementTrend = [
  {
    month: "January",
    quantity: 4200
  },
   {
    month: "February",
    quantity: 5800
  },
  {
    month: "March",
    quantity: 7200
  },
  {
    month: "April",
    quantity: 9100
  },
  {
    month: "May",
    quantity: 11200
  },
  {
    month: "June",
    quantity: 12800
  }
]

function Analysis({farmers=[],tokens=[],t}) {

  const totalRegistered = cropAnalytics.reduce(
    (sum , item)=> sum + item.registered,
    0
  )

  const totalPurchased = cropAnalytics.reduce(
    (sum, item)=> sum+ item.purchased,
    0
  )

  const totalQuantity = cropAnalytics.reduce(
    (sum, item)=> sum + item.quantity,
    0
  )

   return (
    <div className="analysis-page">

      <div className="analysis-header analysis-header-with-action">
        <div>
          <h1>{t("analysisReports")}</h1>
          <p>{t("analyzeCropData")}</p>
        </div>
        <button className="report-button generate-report-button" onClick={()=>window.print()}>📄 {t("generateReport")}</button>
      </div>

      <div className="print-report-heading">
        <div className="report-brand"><img src="/assets/images/agro-vision-logo-transparent.png" alt="Agro Vision"/><div><strong>{t("agroVision")}</strong><span>{t("smartProcurement")}</span></div></div>
        <h2>{t("adminReportTitle")}</h2>
        <p>{t("adminReportDesc")}</p>
      </div>

      {/* SUMMARY CARDS */}

      <div className="analysis-cards">

        <div className="analysis-card">
          <h3>{t("totalRegistered")}</h3>
          <div className="analysis-number">
            {totalRegistered}
            <p>{t("farmers")}</p>
          </div>
        </div>

        <div className="analysis-card">
          <h3>{t("totalPurchased")}</h3>
          <div className="analysis-number">
            {totalPurchased}
            <p>{t("farmers")}</p>
          </div>
        </div>

        <div className="analysis-card">
          <h3>{t("totalQuantity")}</h3>
          <div className="analysis-number">
            {totalQuantity.toLocaleString()}
            <p>{t("kg")}</p>
          </div>
        </div>

        <div className="analysis-card">
          <h3>{t("totalCrops")}</h3>
          <div className="analysis-number"> 
            {cropAnalytics.length}
            <p>{t("cropCategories")}</p>
          </div>
        </div>

      </div>


      {/* CROP-WISE PROCUREMENT */}


      <div className="analysis-chart-card">
        <h2>{t("cropWiseProcurement")}</h2>

        <p className="chart-description">
          {t("cropProcurementDescription")}
        </p>

        <ResponsiveContainer width="100%" height={350}>

          <BarChart data={cropAnalytics}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="crop" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar
              dataKey="quantity"
              name="Purchased Quantity (Kg)"
            >
              {cropAnalytics.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={[
                    "#4CAF50",
                    "#2196F3",
                    "#FF9800",
                    "#9C27B0",
                    "#F44336"
                  ][index % 5]}
                />
              ))}
            </Bar>

          </BarChart>

        </ResponsiveContainer>

      </div>

      <div className="analysis-chart-card">

      <h2>{t("cropDistribution")}</h2>

      <p className="chart-description">
        {t("Distribution of total procured quantity across different crops")}
      </p>

      <ResponsiveContainer width="100%" height={350}>

        <PieChart>

          <Pie
            data={cropAnalytics}
            dataKey="quantity"
            nameKey="crop"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label
          >

            {cropAnalytics.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={[
                  "#4CAF50",
                  "#2196F3",
                  "#FF9800",
                  "#9C27B0",
                  "#F44336"
                ][index % 5]}
              />
            ))}

          </Pie>

          <Tooltip />

          <Legend />

        </PieChart>

      </ResponsiveContainer>

    </div>

      {/* REGISTERED VS PURCHASED */}

      <div className="analysis-chart-card">

        <h2>{t("registeredVsPurchased")}</h2>

        <p className="chart-description">
          {t("registeredVsPurchasedDescription")}
        </p>

        <ResponsiveContainer width="100%" height={350}>

          <BarChart data={cropAnalytics}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="crop" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar
              dataKey="registered"
              name="Registered Farmers"
              fill="#2196F3"
            />

            <Bar
              dataKey="purchased"
              name="Purchased Farmers"
              fill="#4CAF50"
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

      {/* PROCUREMENT TREND */}

      <div className="analysis-chart-card">

        <h2>{t("procurementTrend")}</h2>

        <p className="chart-description">
          {t("procurementTrendDescription")}
        </p>

        <ResponsiveContainer width="100%" height={350}>

          <LineChart data={procurementTrend}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Line
              type="monotone"
              dataKey="quantity"
              name="Procurement Quantity (Kg)"
              stroke="#FF9800"
              strokeWidth={3}
              dot={{ r: 5 }}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>
      <div className="data-note report-print-note">ℹ️ {t("reportIncludesGraphs")}</div>
      <div className="print-only-report-details">
        <h3>{t("allFarmerDetails")}</h3>
        <div className="table-wrap"><table><thead><tr><th>{t("farmerId")}</th><th>{t("name")}</th><th>{t("mobileNumber")}</th><th>{t("village")}</th><th>{t("district")}</th><th>{t("crop")}</th><th>{t("quantity")}</th><th>{t("status")}</th></tr></thead><tbody>{farmers.map(f=><tr key={f.id}><td>{f.id}</td><td>{f.name}</td><td>{f.mobile}</td><td>{f.village}</td><td>{f.district}</td><td>{f.crop}</td><td>{f.quantity}</td><td>{f.status}</td></tr>)}</tbody></table></div>
        <h3>{t("allPurchasingDetails")}</h3>
        <div className="table-wrap"><table><thead><tr><th>{t("tokenNumber")}</th><th>{t("farmer")}</th><th>{t("farmerId")}</th><th>{t("centre")}</th><th>{t("date")}</th><th>{t("time")}</th><th>{t("crop")}</th><th>{t("quantity")}</th><th>{t("status")}</th></tr></thead><tbody>{tokens.length?tokens.map(x=>{const f=farmers.find(y=>y.id===x.farmerId);return <tr key={x.token}><td>{x.token}</td><td>{x.farmer}</td><td>{x.farmerId}</td><td>{x.centre}</td><td>{x.date}</td><td>{x.time}</td><td>{f?.crop||"—"}</td><td>{f?.quantity||"—"}</td><td>{x.status}</td></tr>}):<tr><td colSpan="9">{t("noPurchasingDetails")}</td></tr>}</tbody></table></div>
        <h3>{t("adminPaymentDetails")}</h3>
        <div className="table-wrap"><table><thead><tr><th>{t("farmer")}</th><th>{t("procurementAmount")}</th><th>{t("paymentMethod")}</th><th>{t("status")}</th></tr></thead><tbody>{[["Ravi Kumar","₹1,25,000","Bank Transfer","Pending"],["Mohan Singh","₹87,500","Bank Transfer","Processed"],["Sita Devi","₹50,000","Bank Transfer","Pending"]].map(r=><tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td>{t("bankTransfer")}</td><td>{r[3]==="Processed"?t("processed"):t("pending")}</td></tr>)}</tbody></table></div>
      </div>
    </div>
  );

}

createRoot(document.getElementById("root")).render(<App />);
