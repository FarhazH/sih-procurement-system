import React, { useMemo, useState } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { createRoot } from "react-dom/client";
import "./styles.css";

/**
 * AgroVision — Smart Procurement Frontend
 * Frontend-only demo. Replace demo handlers/data with API calls later.
 */

const translations = {
  en: {
    appName: "AgroVision",
    appSubtitle: "Farmer Procurement & Tracking",
    farmerPortal: "Farmer Portal",
    adminPortal: "Admin / Centre",
    farmer: "Farmer",
    admin: "Admin",
    login: "Sign in",
    logout: "Logout",
    register: "Create account",
    dashboard: "Dashboard",
    profile: "My Profile",
    produce: "My Produce",
    bookToken: "Book Token",
    queue: "Queue & Status",
    payment: "Payment",
    notifications: "Notifications",
    registeredFarmers: "Registered Farmers",
    procurementCentres: "Procurement Centres",
    todaysTokens: "Today's Tokens",
    completedProcurement: "Completed Procurement",
    produceVerification: "Produce Verification",
    paymentStatus: "Payment Status",
    analysisReports: "Analysis & Reports",
    brandName: "Agro Vision",
    smartProcurement: "Smart Procurement",
    welcomeBack: "Welcome back",
    manageActivities: "Manage your procurement activities from one place.",
    quickActions: "Quick actions",
    activeToken: "Active token",
    queuePosition: "Queue position",
    pending: "Pending",
    completed: "Completed",
    inProgress: "In progress",
    procurementCentre: "Procurement centre",
    selectProcurementCentre: "Select procurement centre",
    selectDateTime: "Select date & time",
    availableTimeSlot: "Available time slot",
    confirmBooking: "Confirm booking",
    bookNewToken: "Book new token",
    viewQueue: "View queue",
    checkPayment: "Check payment",
    profileInfo: "Your registered farmer information.",
    produceDetails: "Produce details",
    produceSubmitted: "Produce submitted for procurement.",
    tokenNumber: "Token number",
    timeSlot: "Time slot",
    procurementTimeline: "Procurement timeline",
    paymentPending: "Payment pending",
    paymentUpdateAfter: "Payment will be updated after procurement is completed.",
    expectedAmount: "Expected amount",
    paymentMethod: "Payment method",
    bankTransfer: "Bank transfer",
    importantUpdates: "Important updates about your procurement.",
    today: "Today",
    tomorrow: "Tomorrow",
    day3: "Day 3",
    day4: "Day 4",
    day5: "Day 5",
    searchFarmer: "Search by farmer name or ID...",
    manageCapacity: "Manage centre capacity and availability.",
    toggleStatus: "Toggle status",
    manageQueue: "Manage the queue at procurement centres.",
    verifyProduce: "Verify farmer produce before procurement.",
    verify: "Verify",
    quality: "Quality",
    action: "Action",
    monitorPayments: "Monitor procurement payments.",
    procurementAmount: "Procurement amount",
    processed: "Processed",
    centre: "Centre",
    location: "Location",
    capacity: "Capacity",
    status: "Status",
    open: "Open",
    full: "Full",
    crop: "Crop",
    quantity: "Quantity",
    date: "Date",
    thisMonth: "this month",
    purchasedQuantity: "Purchased quantity (Kg)",
    registered: "Registered",
    purchased: "Purchased",
    mobileNumber: "Mobile number",
    password: "Password",
    enterMobile: "Enter your mobile number",
    enterPassword: "Enter your password",
    remember: "Remember me",
    forgot: "Forgot password?",
    noAccount: "Don't have an account?",
    loginDescription: "A digital step towards transparent, efficient and farmer-friendly procurement.",
    easyToken: "Easy token booking",
    easyTokenDesc: "Book your procurement token in just a few clicks.",
    realQueue: "Real-time queue status",
    realQueueDesc: "Track your queue position and procurement status.",
    secureTransparent: "Secure & transparent",
    secureTransparentDesc: "Clear visibility throughout the procurement journey.",
    empowering: "Empowering farmers, strengthening agriculture.",
    happyFarmers: "Happy farmers",
    tokensBooked: "Tokens booked",
    transparency: "Transparency",
    welcome: "Welcome",
    currentStatus: "Current procurement status",
    tokenBooked: "Token booked",
    produceReached: "Produce reached centre",
    qualityVerification: "Quality verification",
    procurementCompleted: "Procurement completed",
    paymentProcessed: "Payment processed",
    registeredFarmerInfo: "Your registered farmer information.",
    farmerId: "Farmer ID",
    name: "Name",
    village: "Village",
    district: "District",
    accountStatus: "Account status",
    verification: "Verification",
    noToken: "No token booked yet. Book a token to get started.",
    notificationTitle: "Notifications",
    note1: "Your token T1001 is confirmed.",
    note2: "Your procurement centre is open today.",
    note3: "Queue position updated to #4.",
    note4: "Payment status is currently pending.",
    centralizedManagement: "Centralized procurement-centre management.",
    pendingPayments: "Pending payments",
    recentTokens: "Recent tokens",
    centreWiseCapacity: "Centre-wise capacity",
    viewManageRecords: "View and manage farmer records.",
    tokensUsedToday: "tokens used today",
    totalRegistered: "Total registered",
    totalPurchased: "Total purchased",
    totalQuantity: "Total quantity",
    totalCrops: "Crop categories",
    farmers: "farmers",
    kg: "kg",
    cropCategories: "categories",
    cropWiseProcurement: "Crop-wise procurement",
    cropProcurementDescription: "Quantity of different crops purchased at procurement centres.",
    cropDistribution: "Crop distribution",
    cropDistributionDescription: "Distribution of total procured quantity across different crops.",
    registeredVsPurchased: "Registered vs purchased farmers",
    registeredVsPurchasedDescription: "Comparison of registered farmers and farmers whose produce was purchased.",
    procurementTrend: "Procurement trend",
    procurementTrendDescription: "Monthly procurement quantity across all centres.",
    english: "English",
    hindi: "हिंदी",
    demoAccess: "Demo access",
    show: "Show",
    hide: "Hide",
    demoFarmer: "Demo farmer: 9876543210 / 1234",
    demoAdmin: "Demo admin: 9999999999 / admin123",

    voiceAssistant: "Voice Assistant",
    gpsTracking: "GPS Tracking",
    cropAdvisor: "Crop & Selling Advisor",
    smartAlerts: "Real-time Alerts",
    weatherProduction: "Weather & Production",
    gpsAnalysis: "GPS & Farm Analysis",
    shareRecords: "Share Customer Record",
    speakNow: "Speak now",
    stopListening: "Stop listening",
    voiceHint: "Use speech recognition for hands-free navigation and farmer queries.",
    voiceNotSupported: "Speech recognition is not supported in this browser.",
    listening: "Listening…",
    commandHint: "Try: open GPS, show alerts, crop advice, or my records.",
    locationPermission: "Allow location access to see your live GPS position.",
    locateMe: "Locate me",
    locating: "Locating…",
    locationReady: "Location captured successfully.",
    locationUnavailable: "Location could not be captured.",
    accuracy: "Accuracy",
    latitude: "Latitude",
    longitude: "Longitude",
    liveLocation: "Live location",
    routeProgress: "Journey progress",
    distanceToCentre: "Distance to centre",
    centreDestination: "Centre destination",
    mapPreview: "Live GPS map preview",
    cropSellingKnowledge: "Crop selling knowledge",
    sellingTips: "Selling tips",
    recommendedAction: "Recommended action",
    bestSellingWindow: "Best selling window",
    mandiPriceHint: "Compare local mandi prices before finalising a sale.",
    weather: "Weather",
    productionForecast: "Production forecast",
    cropHealth: "Crop health",
    rainfall: "Rainfall",
    temperature: "Temperature",
    advisory: "AI advisory",
    advisoryDemo: "Frontend demo advisory — connect your LLM/API later.",
    alertCentre: "Your procurement centre is open and your queue is active.",
    alertWeather: "Weather watch: rainfall may affect transport timing.",
    alertToken: "Token reminder: reach the centre 15 minutes before your slot.",
    markRead: "Mark as read",
    noAlerts: "No new alerts.",
    analysisByGps: "GPS-based analysis",
    fieldCoverage: "Field coverage",
    travelEfficiency: "Travel efficiency",
    centreVisits: "Centre visits",
    movementGraph: "Movement graph",
    share: "Share",
    copyRecord: "Copy record",
    shareSuccess: "Customer record ready to share.",
    copySuccess: "Customer record copied.",
    customerRecord: "Customer record",
    demoLocation: "Jaipur, Rajasthan",
    todayOverview: "Today’s smart overview",
    liveDemo: "Live demo",
    smartFarmerTools: "SMART FARMER TOOLS",
    speechRecognition: "SPEECH RECOGNITION",
    recognizedCommand: "Recognized command",
    llmReadyAdvisor: "LLM-READY ADVISOR",
    weatherAdvice: "Keep transport flexible around the rainfall window and avoid unnecessary waiting at the centre.",
    generateReport: "Generate Report",
    reportLanguage: "Report language",
    reportEnglish: "English PDF",
    reportHindi: "Hindi PDF",
    reportReady: "Your report is ready. Choose Print → Save as PDF.",
    reportTitle: "AgroVision Farmer Report",
    reportGenerated: "Generated on",
    farmerDetails: "Farmer details",
    procurementSummary: "Procurement summary",
    reportRecommendations: "Recommendations",
    reportFooter: "AgroVision · Smart Procurement & Tracking",
    printSavePdf: "Print / Save PDF",
  },
  hi: {
    appName: "एग्रोविज़न",
    appSubtitle: "किसान खरीद एवं ट्रैकिंग",
    farmerPortal: "किसान पोर्टल",
    adminPortal: "एडमिन / केंद्र",
    farmer: "किसान",
    admin: "एडमिन",
    login: "लॉगिन",
    logout: "लॉगआउट",
    register: "खाता बनाएं",
    dashboard: "डैशबोर्ड",
    profile: "मेरी प्रोफ़ाइल",
    produce: "मेरी उपज",
    bookToken: "टोकन बुक करें",
    queue: "कतार और स्थिति",
    payment: "भुगतान स्थिति",
    notifications: "सूचनाएं",
    registeredFarmers: "पंजीकृत किसान",
    procurementCentres: "खरीद केंद्र",
    todaysTokens: "आज के टोकन",
    completedProcurement: "पूर्ण खरीद",
    produceVerification: "उपज सत्यापन",
    paymentStatus: "भुगतान स्थिति",
    analysisReports: "विश्लेषण और रिपोर्ट",
    brandName: "एग्रो विज़न",
    smartProcurement: "स्मार्ट खरीद",
    welcomeBack: "वापसी पर स्वागत है",
    manageActivities: "अपनी खरीद गतिविधियों को एक ही स्थान से प्रबंधित करें।",
    quickActions: "त्वरित कार्य",
    activeToken: "सक्रिय टोकन",
    queuePosition: "कतार में स्थान",
    pending: "लंबित",
    completed: "पूर्ण",
    inProgress: "प्रगति पर",
    procurementCentre: "खरीद केंद्र",
    selectProcurementCentre: "खरीद केंद्र चुनें",
    selectDateTime: "दिनांक और समय चुनें",
    availableTimeSlot: "उपलब्ध समय स्लॉट",
    confirmBooking: "बुकिंग की पुष्टि करें",
    bookNewToken: "नया टोकन बुक करें",
    viewQueue: "कतार देखें",
    checkPayment: "भुगतान देखें",
    profileInfo: "आपकी पंजीकृत किसान जानकारी।",
    produceDetails: "उपज विवरण",
    produceSubmitted: "खरीद के लिए जमा की गई उपज।",
    tokenNumber: "टोकन नंबर",
    timeSlot: "समय स्लॉट",
    procurementTimeline: "खरीद प्रक्रिया",
    paymentPending: "भुगतान लंबित",
    paymentUpdateAfter: "खरीद पूरी होने के बाद भुगतान अपडेट किया जाएगा।",
    expectedAmount: "अपेक्षित राशि",
    paymentMethod: "भुगतान विधि",
    bankTransfer: "बैंक ट्रांसफर",
    importantUpdates: "आपकी खरीद से संबंधित महत्वपूर्ण अपडेट।",
    today: "आज",
    tomorrow: "कल",
    day3: "दिन 3",
    day4: "दिन 4",
    day5: "दिन 5",
    searchFarmer: "नाम या आईडी से खोजें...",
    manageCapacity: "केंद्र की क्षमता और उपलब्धता प्रबंधित करें।",
    toggleStatus: "स्थिति बदलें",
    manageQueue: "खरीद केंद्रों की कतार प्रबंधित करें।",
    verifyProduce: "खरीद से पहले किसान की उपज सत्यापित करें।",
    verify: "सत्यापित करें",
    quality: "गुणवत्ता",
    action: "कार्यवाही",
    monitorPayments: "खरीद भुगतान की निगरानी करें।",
    procurementAmount: "खरीद राशि",
    processed: "प्रसंस्कृत",
    centre: "केंद्र",
    location: "स्थान",
    capacity: "क्षमता",
    status: "स्थिति",
    open: "खुला",
    full: "पूर्ण",
    crop: "फसल",
    quantity: "मात्रा",
    date: "दिनांक",
    thisMonth: "इस महीने",
    purchasedQuantity: "खरीदी गई मात्रा (किग्रा)",
    registered: "पंजीकृत",
    purchased: "खरीदे गए",
    mobileNumber: "मोबाइल नंबर",
    password: "पासवर्ड",
    enterMobile: "अपना मोबाइल नंबर दर्ज करें",
    enterPassword: "अपना पासवर्ड दर्ज करें",
    remember: "मुझे याद रखें",
    forgot: "पासवर्ड भूल गए?",
    noAccount: "खाता नहीं है?",
    loginDescription: "पारदर्शी, कुशल और किसान-अनुकूल खरीद की दिशा में एक डिजिटल कदम।",
    easyToken: "आसान टोकन बुकिंग",
    easyTokenDesc: "कुछ ही क्लिक में अपना खरीद टोकन बुक करें।",
    realQueue: "रियल-टाइम कतार स्थिति",
    realQueueDesc: "अपनी कतार और खरीद की स्थिति ट्रैक करें।",
    secureTransparent: "सुरक्षित और पारदर्शी",
    secureTransparentDesc: "पूरी खरीद प्रक्रिया में स्पष्ट जानकारी।",
    empowering: "किसानों को सशक्त बनाना, कृषि को मजबूत करना।",
    happyFarmers: "खुश किसान",
    tokensBooked: "बुक किए गए टोकन",
    transparency: "पारदर्शिता",
    welcome: "स्वागत है",
    currentStatus: "वर्तमान खरीद स्थिति",
    tokenBooked: "टोकन बुक हुआ",
    produceReached: "उपज केंद्र पर पहुंची",
    qualityVerification: "गुणवत्ता सत्यापन",
    procurementCompleted: "खरीद पूर्ण",
    paymentProcessed: "भुगतान संसाधित",
    registeredFarmerInfo: "आपकी पंजीकृत किसान जानकारी।",
    farmerId: "किसान आईडी",
    name: "नाम",
    village: "गांव",
    district: "जिला",
    accountStatus: "खाता स्थिति",
    verification: "सत्यापन",
    noToken: "अभी कोई टोकन बुक नहीं है। शुरू करने के लिए टोकन बुक करें।",
    notificationTitle: "सूचनाएं",
    note1: "आपका टोकन T1001 पुष्ट है।",
    note2: "आपका खरीद केंद्र आज खुला है।",
    note3: "कतार की स्थिति #4 पर अपडेट हुई।",
    note4: "भुगतान स्थिति अभी लंबित है।",
    centralizedManagement: "केंद्रीकृत खरीद-केंद्र प्रबंधन।",
    pendingPayments: "लंबित भुगतान",
    recentTokens: "हाल के टोकन",
    centreWiseCapacity: "केंद्र-वार क्षमता",
    viewManageRecords: "किसान रिकॉर्ड देखें और प्रबंधित करें।",
    tokensUsedToday: "आज उपयोग किए गए टोकन",
    totalRegistered: "कुल पंजीकृत",
    totalPurchased: "कुल खरीदे गए",
    totalQuantity: "कुल मात्रा",
    totalCrops: "फसल श्रेणियाँ",
    farmers: "किसान",
    kg: "किग्रा",
    cropCategories: "श्रेणियाँ",
    cropWiseProcurement: "फसल-वार खरीद",
    cropProcurementDescription: "खरीद केंद्रों पर खरीदी गई विभिन्न फसलों की मात्रा।",
    cropDistribution: "फसल वितरण",
    cropDistributionDescription: "कुल खरीदी गई मात्रा का विभिन्न फसलों में वितरण।",
    registeredVsPurchased: "पंजीकृत बनाम खरीदे गए किसान",
    registeredVsPurchasedDescription: "पंजीकृत किसानों और जिनकी उपज खरीदी गई, उनकी तुलना।",
    procurementTrend: "खरीद की प्रवृत्ति",
    procurementTrendDescription: "सभी खरीद केंद्रों पर मासिक खरीद की मात्रा।",
    english: "English",
    hindi: "हिंदी",
    demoAccess: "डेमो एक्सेस",
    show: "दिखाएं",
    hide: "छिपाएं",
    demoFarmer: "डेमो किसान: 9876543210 / 1234",
    demoAdmin: "डेमो एडमिन: 9999999999 / admin123",

    voiceAssistant: "वॉइस असिस्टेंट",
    gpsTracking: "GPS ट्रैकिंग",
    cropAdvisor: "फसल और बिक्री सलाह",
    smartAlerts: "रियल-टाइम अलर्ट",
    weatherProduction: "मौसम और उत्पादन",
    gpsAnalysis: "GPS और खेत विश्लेषण",
    shareRecords: "ग्राहक रिकॉर्ड साझा करें",
    speakNow: "अभी बोलें",
    stopListening: "सुनना बंद करें",
    voiceHint: "हैंड्स-फ्री नेविगेशन और किसान प्रश्नों के लिए स्पीच रिकग्निशन का उपयोग करें।",
    voiceNotSupported: "इस ब्राउज़र में स्पीच रिकग्निशन समर्थित नहीं है।",
    listening: "सुन रहा है…",
    commandHint: "कहें: GPS खोलें, अलर्ट दिखाएं, फसल सलाह, या मेरे रिकॉर्ड।",
    locationPermission: "लाइव GPS स्थिति देखने के लिए लोकेशन की अनुमति दें।",
    locateMe: "मेरी लोकेशन",
    locating: "लोकेशन खोज रहे हैं…",
    locationReady: "लोकेशन सफलतापूर्वक प्राप्त हुई।",
    locationUnavailable: "लोकेशन प्राप्त नहीं हो सकी।",
    accuracy: "सटीकता",
    latitude: "अक्षांश",
    longitude: "देशांतर",
    liveLocation: "लाइव लोकेशन",
    routeProgress: "यात्रा प्रगति",
    distanceToCentre: "केंद्र की दूरी",
    centreDestination: "केंद्र गंतव्य",
    mapPreview: "लाइव GPS मानचित्र",
    cropSellingKnowledge: "फसल बिक्री ज्ञान",
    sellingTips: "बिक्री सुझाव",
    recommendedAction: "सुझाई गई कार्रवाई",
    bestSellingWindow: "बेचने का बेहतर समय",
    mandiPriceHint: "बिक्री तय करने से पहले स्थानीय मंडी कीमतों की तुलना करें।",
    weather: "मौसम",
    productionForecast: "उत्पादन पूर्वानुमान",
    cropHealth: "फसल स्वास्थ्य",
    rainfall: "वर्षा",
    temperature: "तापमान",
    advisory: "AI सलाह",
    advisoryDemo: "फ्रंटएंड डेमो सलाह — बाद में अपना LLM/API कनेक्ट करें।",
    alertCentre: "आपका खरीद केंद्र खुला है और आपकी कतार सक्रिय है।",
    alertWeather: "मौसम चेतावनी: वर्षा से परिवहन का समय प्रभावित हो सकता है।",
    alertToken: "टोकन रिमाइंडर: स्लॉट से 15 मिनट पहले केंद्र पहुंचें।",
    markRead: "पढ़ा हुआ करें",
    noAlerts: "कोई नया अलर्ट नहीं।",
    analysisByGps: "GPS आधारित विश्लेषण",
    fieldCoverage: "खेत कवरेज",
    travelEfficiency: "यात्रा दक्षता",
    centreVisits: "केंद्र यात्राएं",
    movementGraph: "आवागमन ग्राफ",
    share: "साझा करें",
    copyRecord: "रिकॉर्ड कॉपी करें",
    shareSuccess: "ग्राहक रिकॉर्ड साझा करने के लिए तैयार है।",
    copySuccess: "ग्राहक रिकॉर्ड कॉपी हो गया।",
    customerRecord: "ग्राहक रिकॉर्ड",
    demoLocation: "जयपुर, राजस्थान",
    todayOverview: "आज का स्मार्ट अवलोकन",
    liveDemo: "लाइव डेमो",
    smartFarmerTools: "स्मार्ट किसान टूल्स",
    speechRecognition: "स्पीच रिकग्निशन",
    recognizedCommand: "पहचाना गया आदेश",
    llmReadyAdvisor: "LLM-रेडी सलाहकार",
    weatherAdvice: "वर्षा के समय के अनुसार परिवहन की योजना बनाएं और केंद्र पर अनावश्यक प्रतीक्षा से बचें।",
    generateReport: "रिपोर्ट बनाएं",
    reportLanguage: "रिपोर्ट की भाषा",
    reportEnglish: "अंग्रेज़ी PDF",
    reportHindi: "हिंदी PDF",
    reportReady: "आपकी रिपोर्ट तैयार है। Print चुनकर Save as PDF करें।",
    reportTitle: "एग्रोविज़न किसान रिपोर्ट",
    reportGenerated: "बनाई गई तारीख",
    farmerDetails: "किसान विवरण",
    procurementSummary: "खरीद सारांश",
    reportRecommendations: "सुझाव",
    reportFooter: "एग्रोविज़न · स्मार्ट खरीद और ट्रैकिंग",
    printSavePdf: "प्रिंट / PDF सेव करें",
  }
};

const initialFarmers = [
  { id: "F001", name: "Ravi Kumar", mobile: "9876543210", village: "Kherli", district: "Jaipur", crop: "Wheat", quantity: "50 Quintal", status: "Active" },
  { id: "F002", name: "Mohan Singh", mobile: "9123456780", village: "Chomu", district: "Jaipur", crop: "Mustard", quantity: "35 Quintal", status: "Active" },
  { id: "F003", name: "Sita Devi", mobile: "9988776655", village: "Sanganer", district: "Jaipur", crop: "Wheat", quantity: "20 Quintal", status: "Pending" }
];

const initialTokens = [
  { token: "T1001", farmer: "Ravi Kumar", farmerId: "F001", centre: "Jaipur Central Procurement Centre", date: "2026-09-05", time: "10:00 AM", queue: 4, status: "Confirmed" },
  { token: "T1002", farmer: "Mohan Singh", farmerId: "F002", centre: "Chomu Procurement Centre", date: "2026-09-05", time: "11:00 AM", queue: 8, status: "Confirmed" }
];

const initialCentres = [
  { id: "C001", name: "Jaipur Central Procurement Centre", location: "Jaipur", capacity: 100, today: 68, status: "Open" },
  { id: "C002", name: "Chomu Procurement Centre", location: "Chomu", capacity: 80, today: 52, status: "Open" },
  { id: "C003", name: "Sanganer Procurement Centre", location: "Sanganer", capacity: 60, today: 60, status: "Full" }
];

const cropAnalytics = [
  { crop: "Wheat", registered: 520, purchased: 410, quantity: 18500 },
  { crop: "Rice", registered: 380, purchased: 295, quantity: 13200 },
  { crop: "Bajra", registered: 210, purchased: 165, quantity: 8400 },
  { crop: "Mustard", registered: 135, purchased: 108, quantity: 5600 },
  { crop: "Maize", registered: 180, purchased: 140, quantity: 7200 }
];

const procurementTrend = [
  { month: "Jan", quantity: 4200 }, { month: "Feb", quantity: 5800 },
  { month: "Mar", quantity: 7200 }, { month: "Apr", quantity: 9100 },
  { month: "May", quantity: 11200 }, { month: "Jun", quantity: 12800 }
];

const chartColors = ["#1f8f5f", "#2d6cdf", "#f59e0b", "#8b5cf6", "#ef4444"];

function App() {
  const [language, setLanguage] = useState("en");
  const t = key => translations[language]?.[key] ?? translations.en[key] ?? key;
  const [role, setRole] = useState("farmer");
  const [loggedIn, setLoggedIn] = useState(false);
  const [farmers, setFarmers] = useState(initialFarmers);
  const [tokens, setTokens] = useState(initialTokens);
  const [centres, setCentres] = useState(initialCentres);
  const [currentFarmerId, setCurrentFarmerId] = useState("F001");

  const addFarmer = farmer => {
    const id = `F${String(farmers.length + 1).padStart(3, "0")}`;
    setFarmers(prev => [...prev, { ...farmer, id, status: "Pending" }]);
    setCurrentFarmerId(id);
    setRole("farmer");
    setLoggedIn(true);
  };

  const addToken = data => {
    const newToken = {
      ...data,
      token: `T${1001 + tokens.length}`,
      status: "Confirmed"
    };
    setTokens(prev => [...prev, newToken]);
    return newToken;
  };

  const handleLogin = ({ mobile, password, loginRole }) => {
    if (loginRole === "admin") {
      if (mobile !== "9999999999" || password !== "admin123") {
        window.alert(`${t("demoAdmin")}`);
        return;
      }
      setRole("admin");
      setLoggedIn(true);
      return;
    }

    const farmer = farmers.find(f => f.mobile === mobile);
    if (!farmer || password !== "1234") {
      window.alert(t("demoFarmer"));
      return;
    }
    setCurrentFarmerId(farmer.id);
    setRole("farmer");
    setLoggedIn(true);
  };

  if (!loggedIn) {
    return (
      <Login
        role={role}
        setRole={setRole}
        language={language}
        setLanguage={setLanguage}
        onLogin={handleLogin}
        onRegister={() => addFarmer({
          name: "New Farmer",
          mobile: "",
          village: "",
          district: "",
          crop: "Wheat",
          quantity: "0 Quintal"
        })}
        t={t}
      />
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-wrap">
          <div className="brand-mark">A</div>
          <div>
            <div className="brand">{t("appName")}</div>
            <div className="brand-subtitle">{t("appSubtitle")}</div>
          </div>
        </div>
        <div className="topbar-actions">
          <select className="language-selector" value={language} onChange={e => setLanguage(e.target.value)} aria-label="Language">
            <option value="en">{t("english")}</option>
            <option value="hi">{t("hindi")}</option>
          </select>
          <span className="role-pill">{role === "farmer" ? `👨‍🌾 ${t("farmer")}` : `⚙️ ${t("admin")}`}</span>
          <button className="icon-button" onClick={() => setLoggedIn(false)} title={t("logout")}>↪</button>
        </div>
      </header>

      {role === "farmer"
        ? <FarmerApp farmers={farmers} centres={centres} tokens={tokens} currentFarmerId={currentFarmerId} onAddToken={addToken} onLogout={() => setLoggedIn(false)} t={t} />
        : <AdminApp farmers={farmers} centres={centres} tokens={tokens} setCentres={setCentres} onLogout={() => setLoggedIn(false)} t={t} />}
    </div>
  );
}

function Login({ role, setRole, language, setLanguage, onLogin, onRegister, t }) {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const submit = e => {
    e.preventDefault();
    if (!/^\d{10}$/.test(mobile) || !password) {
      window.alert(t("enterMobile"));
      return;
    }
    onLogin({ mobile, password, loginRole: role });
  };

  const handlePointerMove = e => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    e.currentTarget.style.setProperty("--mx", `${x * 14}px`);
    e.currentTarget.style.setProperty("--my", `${y * 10}px`);
    e.currentTarget.style.setProperty("--glow-x", `${50 + x * 18}%`);
    e.currentTarget.style.setProperty("--glow-y", `${45 + y * 15}%`);
  };

  const resetPointer = e => {
    e.currentTarget.style.setProperty("--mx", "0px");
    e.currentTarget.style.setProperty("--my", "0px");
    e.currentTarget.style.setProperty("--glow-x", "50%");
    e.currentTarget.style.setProperty("--glow-y", "45%");
  };

  return (
    <div className="login-page" onMouseMove={handlePointerMove} onMouseLeave={resetPointer}>
      <div className="login-photo" aria-hidden="true" />
      <div className="login-photo-overlay" aria-hidden="true" />
      <div className="login-glow glow-one" />
      <div className="login-glow glow-two" />
      <div className="login-particles" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="login-language">
        <select className="language-selector" value={language} onChange={e => setLanguage(e.target.value)}>
          <option value="en">{t("english")}</option>
          <option value="hi">{t("hindi")}</option>
        </select>
      </div>

      <div className="login-layout">
        <section className="login-intro">
          <div className="login-brand">🌱 <span>{t("brandName")}</span></div>
          <h1 className="login-title">{t("smartProcurement")}</h1>
          <p>{t("loginDescription")}</p>
          <div className="feature-list">
            {[
              ["🎫", t("easyToken"), t("easyTokenDesc")],
              ["📍", t("realQueue"), t("realQueueDesc")],
              ["🛡", t("secureTransparent"), t("secureTransparentDesc")]
            ].map(([icon, title, desc]) => (
              <div className="feature" key={title}>
                <span className="feature-icon">{icon}</span>
                <div><b>{title}</b><span>{desc}</span></div>
              </div>
            ))}
          </div>
          <div className="quote">{t("empowering")}</div>
        </section>

        <section className="login-card">
          <div className="login-card-brand">🌱 <span>{t("brandName")}</span></div>
          <h2>{t("welcomeBack")}</h2>
          <p className="muted">{t("loginDescription")}</p>

          <div className="role-selector">
            <button className={role === "farmer" ? "role-btn active" : "role-btn"} onClick={() => setRole("farmer")}>👨‍🌾 {t("farmer")}</button>
            <button className={role === "admin" ? "role-btn active" : "role-btn"} onClick={() => setRole("admin")}>⚙️ {t("admin")}</button>
          </div>

          <form onSubmit={submit}>
            <Field label={t("mobileNumber")}>
              <input inputMode="numeric" type="tel" maxLength="10" placeholder={t("enterMobile")} value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, ""))} />
            </Field>
            <Field label={t("password")}>
              <div className="password-wrap">
                <input type={showPassword ? "text" : "password"} placeholder={t("enterPassword")} value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" className="password-toggle" onClick={() => setShowPassword(v => !v)}>{showPassword ? t("hide") : t("show")}</button>
              </div>
            </Field>

            <div className="login-options">
              <label><input type="checkbox" /> {t("remember")}</label>
              <button type="button" className="text-button" onClick={() => window.alert("Password recovery will be connected to the backend.")}>{t("forgot")}</button>
            </div>

            <button className="primary full" type="submit">{t("login")} <span>→</span></button>
          </form>

          <div className="demo-note">
            <b>{t("demoAccess")}</b>
            <span>{role === "admin" ? t("demoAdmin") : t("demoFarmer")}</span>
          </div>

          <div className="register-row">{t("noAccount")} <button onClick={onRegister}>{t("register")}</button></div>
        </section>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return <label className="form-group"><span>{label}</span>{children}</label>;
}

function FarmerApp({ farmers, centres, tokens, currentFarmerId, onAddToken, onLogout, t }) {
  const [page, setPage] = useState("dashboard");
  const [selectedToken, setSelectedToken] = useState(null);
  const farmer = farmers.find(f => f.id === currentFarmerId) || farmers[0];

  const nav = [
    ["dashboard", t("dashboard"), "⌂"],
    ["profile", t("profile"), "◉"],
    ["produce", t("produce"), "◈"],
    ["book", t("bookToken"), "+"],
    ["queue", t("queue"), "≡"],
    ["payment", t("payment"), "₹"],
    ["notifications", t("notifications"), "●"],
    ["voice", t("voiceAssistant"), "◉"],
    ["gps", t("gpsTracking"), "⌖"],
    ["advisor", t("cropAdvisor"), "✦"],
    ["weather", t("weatherProduction"), "☁"],
    ["gpsAnalysis", t("gpsAnalysis"), "⌁"],
    ["share", t("shareRecords"), "↗"]
  ];

  return (
    <div className="layout">
      <Sidebar title={t("farmerPortal")} items={nav} page={page} setPage={setPage} onLogout={onLogout} t={t} />
      <main className="content">
        {page === "dashboard" && <FarmerDashboard farmer={farmer} tokens={tokens} setPage={setPage} t={t} />}
        {page === "profile" && <Profile farmer={farmer} t={t} />}
        {page === "produce" && <Produce farmer={farmer} t={t} />}
        {page === "book" && <BookToken centres={centres} onBook={data => {
          const created = onAddToken({ ...data, farmer: farmer.name, farmerId: farmer.id });
          setSelectedToken(created);
          setPage("queue");
        }} t={t} />}
        {page === "queue" && <Queue tokens={tokens.filter(x => x.farmerId === farmer.id)} selected={selectedToken} t={t} />}
        {page === "payment" && <Payment t={t} />}
        {page === "notifications" && <Notifications t={t} />}
        {page === "voice" && <VoiceAssistant t={t} setPage={setPage} />}
        {page === "gps" && <GPSTracking farmer={farmer} centres={centres} t={t} />}
        {page === "advisor" && <CropAdvisor farmer={farmer} t={t} />}
        {page === "weather" && <WeatherProduction farmer={farmer} t={t} />}
        {page === "gpsAnalysis" && <GPSAnalysis farmer={farmer} t={t} />}
        {page === "share" && <ShareRecord farmer={farmer} t={t} />}
      </main>
    </div>
  );
}

function Sidebar({ title, items, page, setPage, onLogout, t }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand"><div className="brand-mark small">A</div><div><b>{title}</b><span>{t("brandName")}</span></div></div>
      <nav>
        {items.map(([id, label, icon]) => (
          <button key={id} className={page === id ? "nav active" : "nav"} onClick={() => setPage(id)}>
            <span className="nav-icon">{icon}</span><span>{label}</span>
          </button>
        ))}
      </nav>
      <button className="nav logout" onClick={onLogout}><span className="nav-icon">↪</span>{t("logout")}</button>
    </aside>
  );
}

function FarmerDashboard({ farmer, tokens, setPage, t }) {
  const token = tokens.find(x => x.farmerId === farmer.id);
  return (
    <section>
      <PageHead title={`${t("welcome")}, ${farmer.name}`} text={t("manageActivities")} t={t}/>
      <div className="stats">
        <Stat icon="🎫" label={t("activeToken")} value={token?.token || "—"} />
        <Stat icon="📍" label={t("procurementCentre")} value={token?.centre?.split(" Procurement")[0] || "—"} />
        <Stat icon="≡" label={t("queuePosition")} value={token ? `#${token.queue}` : "—"} />
        <Stat icon="₹" label={t("paymentStatus")} value={t("pending")} />
      </div>
      <div className="smart-overview">
        <div>
          <span className="eyebrow">{t("smartFarmerTools")}</span>
          <h2>{t("todayOverview")}</h2>
          <p>{t("voiceHint")}</p>
        </div>
        <div className="smart-overview-actions">
          <button className="secondary" onClick={() => setPage("gps")}>⌖ {t("gpsTracking")}</button>
          <button className="secondary" onClick={() => setPage("weather")}>☁ {t("weatherProduction")}</button>
          <ReportButton farmer={farmer} t={t} />
        </div>
      </div>
      <div className="grid2">
        <Card title={t("currentStatus")}>
          <div className="timeline">
            {["tokenBooked", "produceReached", "qualityVerification", "procurementCompleted", "paymentProcessed"].map((key, i) => (
              <div className={`step ${i === 0 ? "done" : ""}`} key={key}>
                <span>{i === 0 ? "✓" : i + 1}</span><div><b>{t(key)}</b><small>{i === 0 ? t("completed") : t("pending")}</small></div>
              </div>
            ))}
          </div>
        </Card>
        <Card title={t("quickActions")}>
          <button className="action" onClick={() => setPage("book")}>🎫 {t("bookNewToken")} <span>→</span></button>
          <button className="action" onClick={() => setPage("queue")}>≡ {t("viewQueue")} <span>→</span></button>
          <button className="action" onClick={() => setPage("payment")}>₹ {t("checkPayment")} <span>→</span></button>
          <button className="action" onClick={() => setPage("gps")}>⌖ {t("gpsTracking")} <span>→</span></button>
          <button className="action" onClick={() => setPage("advisor")}>✦ {t("cropAdvisor")} <span>→</span></button>
          <button className="action" onClick={() => setPage("voice")}>◉ {t("voiceAssistant")} <span>→</span></button>
        </Card>
      </div>
    </section>
  );
}

function Profile({ farmer, t }) {
  return <section><PageHead title={t("profile")} text={t("profileInfo")} t={t}/><Card><InfoGrid data={{
    [t("farmerId")]: farmer.id, [t("name")]: farmer.name, [t("mobileNumber")]: farmer.mobile || "—",
    [t("village")]: farmer.village || "—", [t("district")]: farmer.district || "—",
    [t("crop")]: farmer.crop, [t("quantity")]: farmer.quantity, [t("accountStatus")]: farmer.status
  }} /></Card></section>;
}

function Produce({ farmer, t }) {
  return <section><PageHead title={t("produceDetails")} text={t("produceSubmitted")} t={t} /><Card>
    <DataTable headers={[t("crop"), t("quantity"), t("centre"), t("verification")]} rows={[[farmer.crop, farmer.quantity, "Jaipur Central Procurement Centre", <Badge tone="yellow">{t("pending")}</Badge>]]} />
  </Card></section>;
}

function BookToken({ centres, onBook, t }) {
  const [centre, setCentre] = useState("");
  const [date, setDate] = useState("2026-09-06");
  const [time, setTime] = useState("10:00 AM");
  const selectedCentre = centres.find(c => c.id === centre);

  return <section><PageHead title={t("profile")} text={t("profileInfo")} t={t}/>
    <div className="booking-grid">
      <Card title={`01 · ${t("selectProcurementCentre")}`}>
        <div className="centre-list">{centres.map(c => (
          <button disabled={c.status === "Full"} key={c.id} className={`centre-card ${centre === c.id ? "selected" : ""}`} onClick={() => setCentre(c.id)}>
            <div><b>{c.name}</b><span>📍 {c.location}</span><span>{c.today}/{c.capacity} tokens</span></div>
            <Badge tone={c.status === "Open" ? "green" : "red"}>{c.status === "Open" ? t("open") : t("full")}</Badge>
          </button>
        ))}</div>
      </Card>
      <Card title={`02 · ${t("selectDateTime")}`}>
        <Field label={t("date")}><input type="date" value={date} onChange={e => setDate(e.target.value)} min="2026-09-06" /></Field>
        <span className="field-label">{t("availableTimeSlot")}</span>
        <div className="slots">{["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM"].map(x =>
          <button key={x} className={time === x ? "slot selected" : "slot"} onClick={() => setTime(x)}>{x}</button>
        )}</div>
        <button className="primary full" disabled={!selectedCentre} onClick={() => onBook({ centre: selectedCentre.name, date, time, queue: 5 })}>
          {t("confirmBooking")} <span>→</span>
        </button>
      </Card>
    </div>
  </section>;
}

function Queue({ tokens, selected, t }) {
  const token = selected || tokens.at(-1);
  return <section><PageHead title={t("queue")} text={t("manageQueue")}  t={t}/>
    {token ? <Card title={t("activeToken")}><div className="token-box">
      <div><span>{t("tokenNumber")}</span><strong>{token.token}</strong></div>
      <div><span>{t("procurementCentre")}</span><strong>{token.centre}</strong></div>
      <div><span>{t("date")}</span><strong>{token.date}</strong></div>
      <div><span>{t("timeSlot")}</span><strong>{token.time}</strong></div>
      <div><span>{t("queuePosition")}</span><strong>#{token.queue}</strong></div>
    </div></Card> : <Card><Empty text={t("noToken")} /></Card>}
    <Card title={t("procurementTimeline")}><div className="horizontal-timeline">
      {["tokenBooked", "inProgress", "verification", "procurementCompleted", "paymentProcessed"].map((key, i) =>
        <div className={`hstep ${i === 0 ? "done" : ""}`} key={key}><span>{i === 0 ? "✓" : i + 1}</span><b>{t(key)}</b></div>
      )}
    </div></Card>
  </section>;
}

function Payment({ t }) {
  return <section><PageHead title={t("paymentStatus")} text={t("paymentUpdateAfter")}  t={t}/><Card>
    <div className="payment-card"><div className="payment-icon">₹</div><Badge tone="yellow">{t("paymentPending")}</Badge>
      <h2>₹ 1,25,000</h2><p>{t("paymentUpdateAfter")}</p>
      <div className="info-row"><span>{t("expectedAmount")}</span><b>₹ 1,25,000</b></div>
      <div className="info-row"><span>{t("paymentMethod")}</span><b>{t("bankTransfer")}</b></div>
    </div>
  </Card></section>;
}

function Notifications({ t }) {
  return <section><PageHead title={t("notifications")} text={t("importantUpdates")}  t={t}/><div className="notice-list">
    {[t("note1"), t("note2"), t("note3"), t("note4")].map((n, i) =>
      <div className="notice" key={n}><span>●</span><div><b>{n}</b><small>{t("today")} · 10:{20 + i * 5} AM</small></div></div>
    )}
  </div></section>;
}



function ReportButton({ farmer, t, adminData = null }) {
  const generate = (language) => {
    const isHindi = language === "hi";
    const tr = isHindi ? {
      title: "एग्रोविज़न किसान रिपोर्ट",
      generated: "बनाई गई तारीख",
      details: "किसान विवरण",
      summary: "खरीद सारांश",
      recommendations: "सुझाव",
      name: "नाम",
      id: "किसान ID",
      mobile: "मोबाइल",
      village: "गांव",
      district: "जिला",
      crop: "फसल",
      quantity: "मात्रा",
      token: "टोकन",
      status: "स्थिति",
      centre: "खरीद केंद्र",
      gps: "GPS विश्लेषण",
      field: "खेत कवरेज",
      efficiency: "यात्रा दक्षता",
      weather: "मौसम",
      production: "उत्पादन पूर्वानुमान",
      tip1: "बिक्री से पहले स्थानीय मंडी कीमतों की तुलना करें।",
      tip2: "मौसम और परिवहन समय को ध्यान में रखकर बिक्री की योजना बनाएं।",
      tip3: "खरीद केंद्र पर पहुंचने से पहले टोकन और किसान रिकॉर्ड तैयार रखें।",
      footer: "एग्रोविज़न · स्मार्ट खरीद और ट्रैकिंग",
      print: "प्रिंट / PDF सेव करें",
      close: "बंद करें"
    } : {
      title: "AgroVision Farmer Report",
      generated: "Generated on",
      details: "Farmer details",
      summary: "Procurement summary",
      recommendations: "Recommendations",
      name: "Name",
      id: "Farmer ID",
      mobile: "Mobile",
      village: "Village",
      district: "District",
      crop: "Crop",
      quantity: "Quantity",
      token: "Token",
      status: "Status",
      centre: "Procurement centre",
      gps: "GPS analysis",
      field: "Field coverage",
      efficiency: "Travel efficiency",
      weather: "Weather",
      production: "Production forecast",
      tip1: "Compare local mandi prices before finalising a sale.",
      tip2: "Plan selling and transport around the weather window.",
      tip3: "Keep your token and farmer record ready before reaching the centre.",
      footer: "AgroVision · Smart Procurement & Tracking",
      print: "Print / Save PDF",
      close: "Close"
    };

    const now = new Date().toLocaleString(isHindi ? "hi-IN" : "en-IN");
    const token = adminData?.tokens?.[0];
    const centres = adminData?.centres || [];
    const farmers = adminData?.farmers || [];
    const safe = value => String(value ?? "—").replace(/[<>&]/g, c => ({ "<":"&lt;", ">":"&gt;", "&":"&amp;" }[c]));

    const reportHTML = `
      <!doctype html>
      <html lang="${isHindi ? "hi" : "en"}">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>${safe(tr.title)}</title>
        <style>
          @page { size:A4; margin:16mm; }
          *{box-sizing:border-box}
          body{margin:0;font-family:Arial,"Noto Sans Devanagari","Nirmala UI",sans-serif;color:#17231c;background:#f4f8f5}
          .sheet{max-width:820px;margin:24px auto;background:#fff;padding:34px;border-radius:18px;box-shadow:0 10px 35px rgba(20,60,40,.10)}
          .brand{display:flex;justify-content:space-between;gap:20px;align-items:flex-start;border-bottom:2px solid #dfeae3;padding-bottom:18px}
          .brand h1{margin:0;color:#16683f;font-size:27px}.brand p{margin:6px 0 0;color:#647269;font-size:12px}
          .pill{padding:8px 11px;border-radius:999px;background:#e9f6ee;color:#16683f;font-size:11px;font-weight:700}
          h2{font-size:15px;margin:25px 0 10px;color:#16683f}
          .grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
          .item{border:1px solid #e0e9e3;background:#f9fbfa;padding:12px;border-radius:10px}
          .item small{display:block;color:#78847d;font-size:9px;margin-bottom:4px}.item b{font-size:12px}
          .metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.metric{text-align:center;border:1px solid #e0e9e3;padding:15px;border-radius:10px}.metric b{display:block;font-size:22px;color:#16683f}.metric span{font-size:9px;color:#78847d}
          ul{line-height:1.8;font-size:11px;color:#46534b;padding-left:20px}
          .footer{margin-top:30px;padding-top:14px;border-top:1px solid #e0e9e3;font-size:9px;color:#7a857f;display:flex;justify-content:space-between}
          .print{position:fixed;right:20px;bottom:20px;border:0;background:#16683f;color:white;padding:12px 18px;border-radius:10px;font-weight:700;cursor:pointer}
          @media print{body{background:white}.sheet{margin:0;max-width:none;box-shadow:none;padding:0}.print{display:none}}
        </style>
      </head>
      <body>
        <main class="sheet">
          <div class="brand"><div><h1>${safe(tr.title)}</h1><p>${safe(tr.generated)}: ${safe(now)}</p></div><div class="pill">${safe(isHindi ? "एग्रो विज़न" : "Agro Vision")}</div></div>
          <h2>${safe(tr.details)}</h2>
          <div class="grid">
            <div class="item"><small>${safe(tr.name)}</small><b>${safe(farmer?.name)}</b></div>
            <div class="item"><small>${safe(tr.id)}</small><b>${safe(farmer?.id)}</b></div>
            <div class="item"><small>${safe(tr.mobile)}</small><b>${safe(farmer?.mobile)}</b></div>
            <div class="item"><small>${safe(tr.village)}</small><b>${safe(farmer?.village)}</b></div>
            <div class="item"><small>${safe(tr.district)}</small><b>${safe(farmer?.district)}</b></div>
            <div class="item"><small>${safe(tr.crop)}</small><b>${safe(farmer?.crop)}</b></div>
            <div class="item"><small>${safe(tr.quantity)}</small><b>${safe(farmer?.quantity)}</b></div>
            <div class="item"><small>${safe(tr.centre)}</small><b>${safe(centres[0]?.location || "Jaipur Procurement Centre")}</b></div>
          </div>
          <h2>${safe(tr.summary)}</h2>
          <div class="grid">
            <div class="item"><small>${safe(tr.token)}</small><b>${safe(token?.id || "TK-1024")}</b></div>
            <div class="item"><small>${safe(tr.status)}</small><b>${safe(token?.status || "Pending")}</b></div>
          </div>
          <h2>${safe(tr.gps)}</h2>
          <div class="metrics">
            <div class="metric"><b>84%</b><span>${safe(tr.field)}</span></div>
            <div class="metric"><b>91%</b><span>${safe(tr.efficiency)}</span></div>
            <div class="metric"><b>2.8 km</b><span>${safe(tr.centre)}</span></div>
          </div>
          <h2>${safe(tr.weather)}</h2>
          <div class="metrics">
            <div class="metric"><b>31°C</b><span>${safe(tr.weather)}</span></div>
            <div class="metric"><b>20%</b><span>${safe(tr.rainfall)}</span></div>
            <div class="metric"><b>+8%</b><span>${safe(tr.production)}</span></div>
          </div>
          <h2>${safe(tr.recommendations)}</h2>
          <ul><li>${safe(tr.tip1)}</li><li>${safe(tr.tip2)}</li><li>${safe(tr.tip3)}</li></ul>
          ${adminData ? `<h2>${safe(isHindi ? "प्रशासन सारांश" : "Admin summary")}</h2><div class="metrics"><div class="metric"><b>${farmers.length}</b><span>${safe(isHindi ? "किसान" : "Farmers")}</span></div><div class="metric"><b>${centres.length}</b><span>${safe(isHindi ? "केंद्र" : "Centres")}</span></div><div class="metric"><b>${adminData.tokens?.length || 0}</b><span>${safe(isHindi ? "टोकन" : "Tokens")}</span></div></div>` : ""}
          <div class="footer"><span>${safe(tr.footer)}</span><span>${safe(farmer?.id || "AGV-001")}</span></div>
        </main>
        <button class="print" onclick="window.print()">${safe(tr.print)}</button>
      </body>
      </html>`;

    const win = window.open("", "_blank", "width=900,height=1000");
    if (!win) {
      window.alert("Please allow pop-ups to generate the report.");
      return;
    }
    win.document.open();
    win.document.write(reportHTML);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 500);
  };

  return (
    <div className="report-control">
      <select aria-label={t("reportLanguage")} defaultValue="en" onChange={e => generate(e.target.value)}>
        <option value="en">{t("reportEnglish")}</option>
        <option value="hi">{t("reportHindi")}</option>
      </select>
      <button className="report-button" onClick={() => generate("en")}>▣ {t("generateReport")}</button>
    </div>
  );
}

function VoiceAssistant({ t, setPage }) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const supported = typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const listen = () => {
    if (!supported) {
      window.alert(t("voiceNotSupported"));
      return;
    }
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new Recognition();
    recognition.lang = "en-IN";
    recognition.interimResults = true;
    recognition.continuous = false;
    setListening(true);
    recognition.onresult = event => {
      const text = Array.from(event.results).map(r => r[0].transcript).join(" ");
      setTranscript(text);
      const command = text.toLowerCase();
      if (command.includes("gps") || command.includes("location")) setPage("gps");
      else if (command.includes("alert")) setPage("notifications");
      else if (command.includes("crop") || command.includes("sell")) setPage("advisor");
      else if (command.includes("weather")) setPage("weather");
      else if (command.includes("record")) setPage("share");
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognition.start();
  };

  return <section>
    <PageHead title={t("voiceAssistant")} text={t("voiceHint")}  t={t}/>
    <div className="feature-hero">
      <div className={`voice-orb ${listening ? "listening" : ""}`}><span>◉</span></div>
      <div>
        <span className="eyebrow">{t("speechRecognition")}</span>
        <h2>{listening ? t("listening") : t("speakNow")}</h2>
        <p>{t("commandHint")}</p>
        <button className="primary" onClick={listen}>{listening ? t("stopListening") : t("speakNow")} <span>●</span></button>
      </div>
    </div>
    <Card title={t("recognizedCommand")}>
      <div className="voice-transcript">{transcript || "—"}</div>
      {!supported && <p className="muted">{t("voiceNotSupported")}</p>}
    </Card>
  </section>;
}

function GPSTracking({ farmer, centres, t }) {
  const [position, setPosition] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const locate = () => {
    if (!navigator.geolocation) {
      setStatus("error");
      setError(t("locationUnavailable"));
      return;
    }
    setStatus("loading");
    setError("");
    navigator.geolocation.getCurrentPosition(
      p => {
        setPosition({ lat: p.coords.latitude, lng: p.coords.longitude, accuracy: Math.round(p.coords.accuracy) });
        setStatus("ready");
      },
      () => {
        setStatus("error");
        setError(t("locationUnavailable"));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  };

  return <section>
    <PageHead title={t("gpsTracking")} text={t("locationPermission")}  t={t} />
    <div className="gps-grid">
      <Card title={t("mapPreview")}>
        <div className="gps-map">
          <div className="map-grid-lines" />
          <div className="map-road road-a" />
          <div className="map-road road-b" />
          <div className="map-road road-c" />
          <div className="map-pin farmer-pin">●<small>{farmer.village || t("demoLocation")}</small></div>
          <div className="map-pin centre-pin">◆<small>{centres[0]?.location || "Centre"}</small></div>
          <div className="map-route" />
        </div>
        <button className="primary full" onClick={locate} disabled={status === "loading"}>
          ⌖ {status === "loading" ? t("locating") : t("locateMe")}
        </button>
      </Card>
      <Card title={t("liveLocation")}>
        <div className="gps-metrics">
          <div><span>{t("latitude")}</span><b>{position?.lat?.toFixed(6) || "—"}</b></div>
          <div><span>{t("longitude")}</span><b>{position?.lng?.toFixed(6) || "—"}</b></div>
          <div><span>{t("accuracy")}</span><b>{position ? `${position.accuracy} m` : "—"}</b></div>
          <div><span>{t("distanceToCentre")}</span><b>2.8 km</b></div>
        </div>
        <div className="progress-label"><span>{t("routeProgress")}</span><b>72%</b></div>
        <div className="progress"><span style={{ width: "72%" }} /></div>
        <p className="muted">{error || (status === "ready" ? t("locationReady") : t("locationPermission"))}</p>
      </Card>
    </div>
  </section>;
}

function CropAdvisor({ farmer, t }) {
  const advice = useMemo(() => {
    const crop = (farmer.crop || "Wheat").toLowerCase();
    if (crop.includes("mustard")) {
      return { crop: farmer.crop, action: "Check moisture and compare mustard mandi prices before dispatch.", window: "Morning market review", health: "Good" };
    }
    if (crop.includes("rice")) {
      return { crop: farmer.crop, action: "Review rainfall and storage conditions before final sale.", window: "After local price check", health: "Good" };
    }
    return { crop: farmer.crop || "Wheat", action: "Compare nearby procurement rates, quality requirements and queue timing before selling.", window: "Early market review", health: "Good" };
  }, [farmer.crop]);

  return <section>
    <PageHead title={t("cropAdvisor")} text={t("cropSellingKnowledge")}  t={t}/>
    <div className="advisor-hero">
      <div className="advisor-icon">✦</div>
      <div><span className="eyebrow">{t("llmReadyAdvisor")}</span><h2>{t("advisory")}</h2><p>{t("advisoryDemo")}</p></div>
    </div>
    <div className="advisor-grid">
      <Card title={t("cropSellingKnowledge")}><div className="advice-main"><b>{advice.crop}</b><p>{advice.action}</p></div></Card>
      <Card title={t("recommendedAction")}><div className="advice-list"><div><span>{t("bestSellingWindow")}</span><b>{advice.window}</b></div><div><span>{t("cropHealth")}</span><b>{advice.health}</b></div></div></Card>
      <Card title={t("sellingTips")}><ul className="clean-list"><li>{t("mandiPriceHint")}</li><li>Verify moisture and quality before procurement.</li><li>Keep token and farmer records ready.</li></ul></Card>
    </div>
  </section>;
}

function WeatherProduction({ farmer, t }) {
  const data = [
    { day: t("today"), temp: 31, rain: 20, production: 92 },
    { day: t("tomorrow"), temp: 29, rain: 45, production: 88 },
    { day: t("day3"), temp: 30, rain: 35, production: 90 },
    { day: t("day4"), temp: 32, rain: 15, production: 94 },
    { day: t("day5"), temp: 33, rain: 10, production: 96 }
  ];
  return <section>
    <PageHead title={t("weatherProduction")} text={t("productionForecast")}  t={t}/>
    <div className="weather-summary">
      <div className="weather-now"><span>☀</span><div><small>{t("weather")}</small><strong>31°C</strong><b>{farmer.district || t("demoLocation")}</b></div></div>
      <div><small>{t("rainfall")}</small><strong>20%</strong></div>
      <div><small>{t("cropHealth")}</small><strong>92%</strong></div>
      <div><small>{t("productionForecast")}</small><strong>+8%</strong></div>
    </div>
    <Card title={t("productionForecast")}>
      <div className="forecast-grid">{data.map(x => <div className="forecast-card" key={x.day}><b>{x.day}</b><span>🌤</span><strong>{x.temp}°C</strong><small>{t("rainfall")} {x.rain}%</small><div className="mini-progress"><i style={{ width: `${x.production}%` }} /></div><em>{x.production}%</em></div>)}</div>
    </Card>
    <div className="ai-alert"><span>✦</span><div><b>{t("advisory")}</b><p>{t("weatherAdvice")}</p></div></div>
  </section>;
}

function GPSAnalysis({ farmer, t }) {
  const movement = [
    { time: "08 AM", distance: 0.2, queue: 1 },
    { time: "09 AM", distance: 1.1, queue: 3 },
    { time: "10 AM", distance: 2.4, queue: 4 },
    { time: "11 AM", distance: 3.1, queue: 4 },
    { time: "12 PM", distance: 3.8, queue: 2 },
    { time: "01 PM", distance: 4.2, queue: 1 }
  ];
  return <section>
    <PageHead title={t("gpsAnalysis")} text={t("analysisByGps")}  t={t}/>
    <div className="analysis-cards">
      <AnalysisCard title={t("fieldCoverage")} value="84" suffix="%" />
      <AnalysisCard title={t("travelEfficiency")} value="91" suffix="%" />
      <AnalysisCard title={t("centreVisits")} value="12" suffix={t("thisMonth")} />
      <AnalysisCard title={t("distanceToCentre")} value="2.8" suffix="km" />
    </div>
    <ChartCard title={t("movementGraph")} description={`${farmer.name} · ${t("analysisByGps")}`}>
      <ResponsiveContainer width="100%" height={330}><LineChart data={movement}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="time" /><YAxis /><Tooltip /><Legend />
        <Line type="monotone" dataKey="distance" name="Distance (km)" stroke="#1f8f5f" strokeWidth={3} dot={{ r: 4 }} />
        <Line type="monotone" dataKey="queue" name="Queue position" stroke="#2d6cdf" strokeWidth={3} dot={{ r: 4 }} />
      </LineChart></ResponsiveContainer>
    </ChartCard>
  </section>;
}

function ShareRecord({ farmer, t }) {
  const [message, setMessage] = useState("");
  const record = `${t("customerRecord")}\nID: ${farmer.id}\nName: ${farmer.name}\nMobile: ${farmer.mobile || "—"}\nVillage: ${farmer.village || "—"}\nDistrict: ${farmer.district || "—"}\nCrop: ${farmer.crop}\nQuantity: ${farmer.quantity}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(record);
      setMessage(t("copySuccess"));
    } catch {
      setMessage(t("shareSuccess"));
    }
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: t("customerRecord"), text: record });
        setMessage(t("shareSuccess"));
        return;
      } catch {}
    }
    await copy();
  };

  return <section>
    <PageHead title={t("shareRecords")} text={t("customerRecord")}  t={t}/>
    <Card title={t("customerRecord")}>
      <div className="record-preview"><pre>{record}</pre></div>
      <div className="record-actions">
        <button className="primary" onClick={share}>↗ {t("share")}</button>
        <button className="secondary" onClick={copy}>▣ {t("copyRecord")}</button>
        <ReportButton farmer={farmer} t={t} />
      </div>
      {message && <div className="success-message">✓ {message}</div>}
    </Card>
  </section>;
}

function AdminApp({ farmers, centres, tokens, setCentres, onLogout, t }) {
  const [page, setPage] = useState("dashboard");
  const [search, setSearch] = useState("");
  const nav = [
    ["dashboard", t("dashboard"), "▦"], ["farmers", t("registeredFarmers"), "♙"],
    ["centres", t("procurementCentres"), "⌖"], ["tokens", t("todaysTokens"), "🎫"],
    ["verification", t("produceVerification"), "✓"], ["payments", t("paymentStatus"), "₹"],
    ["analysis", t("analysisReports"), "⌁"]
  ];

  return <div className="layout">
    <Sidebar title={t("adminPortal")} items={nav} page={page} setPage={setPage} onLogout={onLogout} t={t} />
    <main className="content">
      {page === "dashboard" && <AdminDashboard farmers={farmers} centres={centres} tokens={tokens} t={t} />}
      {page === "farmers" && <FarmerManagement farmers={farmers} search={search} setSearch={setSearch} t={t} />}
      {page === "centres" && <CentreManagement centres={centres} setCentres={setCentres} t={t} />}
      {page === "tokens" && <TokenManagement tokens={tokens} t={t} />}
      {page === "verification" && <Verification farmers={farmers} t={t} />}
      {page === "payments" && <AdminPayments t={t} />}
      {page === "analysis" && <Analysis t={t} farmers={farmers} centres={centres} tokens={tokens} />}
    </main>
  </div>;
}

function AdminDashboard({ farmers, centres, tokens, t }) {
  return <section><PageHead title={t("dashboard")} text={t("centralizedManagement")} t={t} />
    <div className="stats">
      <Stat icon="♙" label={t("registeredFarmers")} value={farmers.length} />
      <Stat icon="🎫" label={t("todaysTokens")} value={tokens.length} />
      <Stat icon="✓" label={t("completedProcurement")} value="18" />
      <Stat icon="₹" label={t("pendingPayments")} value="7" />
    </div>
    <div className="grid2">
      <Card title={t("centreWiseCapacity")}><DataTable headers={[t("centre"), t("location"), t("today"), t("capacity"), t("status")]} rows={centres.map(c => [c.name, c.location, c.today, c.capacity, <Badge tone={c.status === "Open" ? "green" : "red"}>{c.status}</Badge>])} /></Card>
      <Card title={t("recentTokens")}><div className="recent-list">{tokens.map(x => <div className="mini-row" key={x.token}><b>{x.token}</b><span>{x.farmer}</span><span>{x.time}</span><Badge tone="green">{x.status}</Badge></div>)}</div></Card>
    </div>
  </section>;
}

function FarmerManagement({ farmers, search, setSearch, t }) {
  const data = farmers.filter(f => `${f.name} ${f.id}`.toLowerCase().includes(search.toLowerCase()));
  return <section><PageHead title={t("registeredFarmers")} text={t("viewManageRecords")}  t={t}/><Card>
    <input className="search" placeholder={t("searchFarmer")} value={search} onChange={e => setSearch(e.target.value)} />
    <DataTable headers={["ID", t("farmer"), t("mobileNumber"), t("location"), t("crop"), t("status")]} rows={data.map(f => [f.id, <b>{f.name}</b>, f.mobile || "—", `${f.village}, ${f.district}`, f.crop, <Badge tone={f.status === "Active" ? "green" : "yellow"}>{f.status}</Badge>])} />
  </Card></section>;
}

function CentreManagement({ centres, setCentres, t }) {
  return <section><PageHead title={t("procurementCentres")} text={t("manageCapacity")}  t={t}/><div className="centre-admin-grid">
    {centres.map(c => {
      const percentage = Math.min(100, (c.today / c.capacity) * 100);
      return <Card key={c.id}><div className="centre-title"><div className="centre-icon">⌖</div><Badge tone={c.status === "Open" ? "green" : "red"}>{c.status}</Badge></div>
        <h3>{c.name}</h3><p className="muted">{c.location}</p>
        <div className="progress"><span style={{ width: `${percentage}%` }} /></div>
        <small>{c.today} / {c.capacity} {t("tokensUsedToday")}</small>
        <button className="secondary full" onClick={() => setCentres(prev => prev.map(x => x.id === c.id ? { ...x, status: x.status === "Open" ? "Full" : "Open" } : x))}>{t("toggleStatus")}</button>
      </Card>;
    })}
  </div></section>;
}

function TokenManagement({ tokens, t }) {
  return <section><PageHead title={t("todaysTokens")} text={t("manageQueue")}  t={t}/><Card>
    <DataTable headers={[t("tokenNumber"), t("farmer"), t("centre"), "Time", t("queuePosition"), t("status")]} rows={tokens.map(x => [<b>{x.token}</b>, x.farmer, x.centre, x.time, `#${x.queue}`, <Badge tone="green">{x.status}</Badge>])} />
  </Card></section>;
}

function Verification({ farmers, t }) {
  return <section><PageHead title={t("produceVerification")} text={t("verifyProduce")}  t={t}/><Card>
    <DataTable headers={[t("farmer"), t("crop"), t("quantity"), t("quality"), t("action")]} rows={farmers.map(f => [f.name, f.crop, f.quantity, <Badge tone="yellow">{t("pending")}</Badge>, <button className="small-btn">{t("verify")}</button>])} />
  </Card></section>;
}

function AdminPayments({ t }) {
  const rows = [
    ["Ravi Kumar", "₹1,25,000", t("bankTransfer"), "Pending"],
    ["Mohan Singh", "₹87,500", t("bankTransfer"), "Processed"],
    ["Sita Devi", "₹50,000", t("bankTransfer"), "Pending"]
  ];
  return <section><PageHead title={t("paymentStatus")} text={t("monitorPayments")}  t={t}/><Card>
    <DataTable headers={[t("farmer"), t("procurementAmount"), t("paymentMethod"), t("status")]} rows={rows.map(r => [r[0], r[1], r[2], <Badge tone={r[3] === "Processed" ? "green" : "yellow"}>{r[3] === "Processed" ? t("processed") : t("pending")}</Badge>])} />
  </Card></section>;
}

function Analysis({ t, farmers = [], centres = [], tokens = [] }) {
  const totalRegistered = cropAnalytics.reduce((sum, x) => sum + x.registered, 0);
  const totalPurchased = cropAnalytics.reduce((sum, x) => sum + x.purchased, 0);
  const totalQuantity = cropAnalytics.reduce((sum, x) => sum + x.quantity, 0);
  return <section>
    <PageHead title={t("analysisReports")} text={t("procurementTrendDescription")}  t={t}/>
    <div className="report-toolbar">
      <div><b>{t("generateReport")}</b><span>{t("reportReady")}</span></div>
      <ReportButton farmer={farmers[0] || { id: "AGV-001", name: "Demo Farmer", crop: "Wheat", quantity: "1200 kg" }} t={t} adminData={{ farmers, centres, tokens }} />
    </div>
    <div className="analysis-cards">
      <AnalysisCard title={t("totalRegistered")} value={totalRegistered} suffix={t("farmers")} />
      <AnalysisCard title={t("totalPurchased")} value={totalPurchased} suffix={t("farmers")} />
      <AnalysisCard title={t("totalQuantity")} value={totalQuantity.toLocaleString()} suffix={t("kg")} />
      <AnalysisCard title={t("totalCrops")} value={cropAnalytics.length} suffix={t("cropCategories")} />
    </div>

    <ChartCard title={t("cropWiseProcurement")} description={t("cropProcurementDescription")}>
      <ResponsiveContainer width="100%" height={330}><BarChart data={cropAnalytics}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" /><XAxis dataKey="crop" /><YAxis /><Tooltip /><Legend />
        <Bar dataKey="quantity" name={t("purchasedQuantity")} radius={[6, 6, 0, 0]}>
          {cropAnalytics.map((_, i) => <Cell key={i} fill={chartColors[i % chartColors.length]} />)}
        </Bar>
      </BarChart></ResponsiveContainer>
    </ChartCard>

    <div className="grid2">
      <ChartCard title={t("cropDistribution")} description={t("cropDistributionDescription")}>
        <ResponsiveContainer width="100%" height={330}><PieChart>
          <Pie data={cropAnalytics} dataKey="quantity" nameKey="crop" cx="50%" cy="45%" outerRadius={105} label>
            {cropAnalytics.map((_, i) => <Cell key={i} fill={chartColors[i % chartColors.length]} />)}
          </Pie><Tooltip /><Legend />
        </PieChart></ResponsiveContainer>
      </ChartCard>

      <ChartCard title={t("registeredVsPurchased")} description={t("registeredVsPurchasedDescription")}>
        <ResponsiveContainer width="100%" height={330}><BarChart data={cropAnalytics}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" /><XAxis dataKey="crop" /><YAxis /><Tooltip /><Legend />
          <Bar dataKey="registered" name={t("registered")} fill="#2d6cdf" radius={[6, 6, 0, 0]} />
          <Bar dataKey="purchased" name={t("purchased")} fill="#1f8f5f" radius={[6, 6, 0, 0]} />
        </BarChart></ResponsiveContainer>
      </ChartCard>
    </div>

    <ChartCard title={t("procurementTrend")} description={t("procurementTrendDescription")}>
      <ResponsiveContainer width="100%" height={330}><LineChart data={procurementTrend}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Legend />
        <Line type="monotone" dataKey="quantity" name="Procurement quantity (Kg)" stroke="#1f8f5f" strokeWidth={3} dot={{ r: 4 }} />
      </LineChart></ResponsiveContainer>
    </ChartCard>
  </section>;
}

function AnalysisCard({ title, value, suffix }) {
  return <div className="analysis-card"><span>{title}</span><strong>{value}</strong><small>{suffix}</small></div>;
}
function ChartCard({ title, description, children }) {
  return <div className="chart-card"><h2>{title}</h2><p className="chart-description">{description}</p>{children}</div>;
}
function PageHead({ title, text,t }) {
  return <div className="page-head"><div><div className="eyebrow">{t("brandName")}</div><h1>{title}</h1><p>{text}</p></div><div className="date-chip">● {t("liveDemo")}</div></div>;
}
function Card({ title, children }) { return <div className="card">{title && <h2>{title}</h2>}{children}</div>; }
function Stat({ icon, label, value }) { return <div className="stat"><div className="stat-icon">{icon}</div><div><small>{label}</small><strong>{value}</strong></div></div>; }
function InfoGrid({ data }) { return <div className="info-grid">{Object.entries(data).map(([k, v]) => <div key={k}><small>{k}</small><b>{v}</b></div>)}</div>; }
function Empty({ text }) { return <div className="empty"><span>◌</span><p>{text}</p></div>; }
function Badge({ tone = "green", children }) { return <span className={`badge ${tone}`}>{children}</span>; }
function DataTable({ headers, rows }) {
  return <div className="table-wrap"><table><thead><tr>{headers.map((h, i) => <th key={i}>{h}</th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>;
}

createRoot(document.getElementById("root")).render(<App />);
