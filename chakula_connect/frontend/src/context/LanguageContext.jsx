import React, { createContext, useContext, useState } from 'react';

const translations = {
    en: {
        appTitle: "Chakula-Connect",
        appSubtitle: "National Food Security Grid",
        connectWallet: "Connect Wallet",
        addFarmer: "+ Add Farmer",
        logisticsPanel: "Logistics Panel",
        dashboardStats: {
            activeDeliveries: "Active Deliveries",
            totalVolume: "Total Volume (Kg)",
            partnerBuyers: "Partner Buyers",
            criticalAlerts: "Critical Alerts",
        },
        heatMap: {
            title: "Live Food Flow & Drought Analysis",
            loading: "Loading Map Intelligence...",
            surplus: "Food Surplus (Vuna)",
            drought: "Drought Zone (Okoa)",
        },
        logistics: {
            title: "Logistics Control Tower",
            subtitle: "Real-time delivery tracking & dispatch.",
            back: "Back to Dashboard",
            loading: "Loading Logistics Data...",
            noOrders: "No active delivery requests.",
            order: "Order",
            destination: "Destination",
            cargo: "Cargo",
            status: "Status",
            track: "TRACK",
            delivered: "Delivered",
            pending: "Pending",
            in_transit: "In Transit",
            assigning: "Assigning",
        },
        farmerEntry: {
            title: "Farmer Registration",
            subtitle: "Manual Data Entry (Agent Mode)",
            personalInfo: "Personal Info",
            fullName: "Full Name",
            phone: "Phone Number",
            location: "Location",
            getGps: "Get Current GPS",
            region: "Region Name",
            latitude: "Latitude",
            longitude: "Longitude",
            harvestDetails: "Harvest Details",
            cropType: "Crop Type",
            quantity: "Quantity (Kg)",
            price: "Price/Kg (KES)",
            submit: "Submit to Grid",
            registering: "Registering...",
            success: "Farmer & Harvest Registered Successfully!",
        },
        wallet: {
            title: "Connect Wallet",
            subtitle: "Link your M-PESA account to receive payments securely.",
            phoneLabel: "M-PESA Phone Number",
            note: "Note: We do not store your PIN. Payments are processed via Daraja API secure escrow.",
            connectBtn: "Connect via M-PESA",
            connecting: "Initiating STK Push...",
            connected: "Connected!",
            connectedMsg: "Your wallet is now active.",
        }
    },
    sw: {
        appTitle: "Chakula-Connect",
        appSubtitle: "Mtandao wa Usalama wa Chakula wa Kitaifa",
        connectWallet: "Unganisha Pochi",
        addFarmer: "+ Ongeza Mkulima",
        logisticsPanel: "Jopo la Usafirishaji",
        dashboardStats: {
            activeDeliveries: "Usafirishaji unaoendelea",
            totalVolume: "Jumla ya Mzigo (Kg)",
            partnerBuyers: "Wanunuzi Washirika",
            criticalAlerts: "Tahadhari Muhimu",
        },
        heatMap: {
            title: "Mtiririko wa Chakula & Uchambuzi wa Ukame",
            loading: "Inapakia Ramani ya Kiintelejensia...",
            surplus: "Ziada ya Chakula (Vuna)",
            drought: "Eneo la Ukame (Okoa)",
        },
        logistics: {
            title: "Mnara wa Kudhibiti Usafirishaji",
            subtitle: "Ufuatiliaji wa usafirishaji wa wakati halisi.",
            back: "Rudi kwenye Dashibodi",
            loading: "Inapakia Data ya Usafirishaji...",
            noOrders: "Hakuna maombi ya usafirishaji yanayoendelea.",
            order: "Oda",
            destination: "Mahali pa Kupeleka",
            cargo: "Mzigo",
            status: "Hali",
            track: "FUATILIA",
            delivered: "Imefika",
            pending: "Inasubiri",
            in_transit: "Safarini",
            assigning: "Inapangiwa",
        },
        farmerEntry: {
            title: "Usajili wa Mkulima",
            subtitle: "Kuingiza Data kwa Mkono (Modi ya Wakala)",
            personalInfo: "Taarifa Binafsi",
            fullName: "Jina Kamili",
            phone: "Nambari ya Simu",
            location: "Mahali",
            getGps: "Pata GPS ya Sasa",
            region: "Jina la Eneo",
            latitude: "Latitudo",
            longitude: "Longitudo",
            harvestDetails: "Maelezo ya Mavuno",
            cropType: "Aina ya Zao",
            quantity: "Kiasi (Kg)",
            price: "Bei/Kg (KES)",
            submit: "Wasilisha kwa Gridi",
            registering: "Inasajili...",
            success: "Mkulima na Mavuno Wamesajiliwa Kikamilifu!",
        },
        wallet: {
            title: "Unganisha Pochi",
            subtitle: "Unganisha akaunti yako ya M-PESA kupokea malipo kwa usalama.",
            phoneLabel: "Nambari ya Simu ya M-PESA",
            note: "Kumbuka: Hatuhifadhi PIN yako. Malipo yanashughulikiwa kupitia escrow salama ya Daraja API.",
            connectBtn: "Unganisha kwa M-PESA",
            connecting: "Inanzisha STK Push...",
            connected: "Imeunganishwa!",
            connectedMsg: "Pochi yako sasa imeweshwa.",
        }
    }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === 'en' ? 'sw' : 'en'));
    };

    const t = translations[language];

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
