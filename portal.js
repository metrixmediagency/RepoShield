document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. URL Parameters & Sector Normalization
    // ----------------------------------------------------
    const urlParams = new URLSearchParams(window.location.search);
    
    const venueIdParam = urlParams.get('id') || '';
    let bizName = urlParams.get('name') || 'Our Business';
    let gmbUrl = urlParams.get('url') || '';
    let menuUrl = urlParams.get('menuUrl') || urlParams.get('menu') || '';
    const accentColor = urlParams.get('color') || urlParams.get('flyerAccent') || '#d4af37';
    const flyerBg = urlParams.get('flyerBg') || '';
    const flyerAccent = urlParams.get('flyerAccent') || accentColor || '#d4af37';
    const flyerText = urlParams.get('flyerText') || '';
    let bizEmail = urlParams.get('email') || 'owner@business.com';
    const rawCategory = urlParams.get('category') || 'dining';
    const logoUrl = urlParams.get('logo') || '';
    const font = urlParams.get('font') || 'Outfit';
    let webhookUrl = urlParams.get('webhook') || '';
    let ntfyTopic = urlParams.get('ntfy') || '';
    let wifiSsid = urlParams.get('wifiSsid') || '';
    let wifiPass = urlParams.get('wifiPass') || '';
    let vipOffer = urlParams.get('vipOffer') || '';
    let vipSub = urlParams.get('vipSub') || '';
    let venueFeatures = {
        vip: true,
        service: true,
        games: true,
        menu: true,
        wifi: true,
        wifiGate: true,
        callManager: true,
        complaint: true
    };
    let activeTier = 'starter';
    const rawTable = urlParams.get('table') || '';

    // Sector Normalization
    function normalizeSector(cat) {
        if (!cat) return 'dining';
        const c = cat.toLowerCase().trim();
        if (['hotel', 'resort', 'villa', 'stay', 'hospitality', 'suites', 'inn', 'cottage'].includes(c)) return 'hotel';
        if (['cruise', 'river_cruise', 'yacht', 'boat', 'charter', 'catamaran', 'ferry'].includes(c)) return 'cruise';
        if (['retail', 'skincare', 'beauty', 'apparel', 'fashion', 'shop', 'boutique', 'cosmetics', 'store'].includes(c)) return 'retail';
        if (['salon', 'spa', 'hair', 'grooming', 'wellness', 'aesthetic', 'dental', 'clinic', 'parlour'].includes(c)) return 'salon';
        return 'dining';
    }

    const sector = normalizeSector(rawCategory);

    // ----------------------------------------------------
    // 2. Comprehensive Multi-Category Profiles Matrix
    // ----------------------------------------------------
    const categoryProfiles = {
        hotel: {
            name: "Boutique Hotel & Resort",
            tagline: "Welcome to your in-room companion. Book cab transfers, request wellness amenities, or browse in-room dining.",
            tablePrefix: "Room",
            tableIcon: "fa-solid fa-bed",
            vip: {
                title: "Resident VIP Privileges 🥂",
                sub: "Save 20% on future direct stays, late checkouts & welcome perks",
                icon: "fa-solid fa-crown",
                screenTitle: "Resident VIP Privileges 🥂",
                screenSub: "Join our direct guest circle to receive 20% off future bookings, early check-in perks, and birthday stay treats.",
                dobLabel: "Date of Birth (For Birthday Stay Treats)",
                submitText: "Unlock Resident Privileges",
                submitIcon: "fa-solid fa-key",
                successTitle: "Resident Privileges Active 🥂",
                successMsg: (name) => `Welcome to our direct guest circle, ${name}! Your profile has been logged for 20% direct-booking savings and special stay amenities.`
            },
            service: {
                title: "In-Room Guest Concierge 🛎️",
                sub: "Book airport cabs, order room dining, or call fresh linen in < 3s",
                icon: "fa-solid fa-bell-concierge",
                screenTitle: "In-Room Guest Concierge 🛎️",
                screenSub: "Tap an option below to alert our front desk & operations team immediately:",
                tableLabel: "Room / Suite / Villa Number",
                tablePlaceholder: "e.g. Room 204 or Villa 3",
                msgLabel: "How can our concierge assist your stay?",
                msgPlaceholder: "e.g. Flight time for cab booking, extra towels, laundry, late checkout inquiry...",
                submitText: "Dispatch Concierge Request",
                alertTitle: "Concierge Dispatched 🛎️",
                alertMsg: (req, dest) => `Your concierge request for "${req}" has been received by our front desk. Our team will attend${dest} momentarily.`,
                tiles: [
                    { label: "Airport Cab / Taxi", icon: "fa-solid fa-taxi", request: "Airport Transfer & Cab Booking" },
                    { label: "Spa & Massage", icon: "fa-solid fa-spa", request: "Spa & Wellness Appointment" },
                    { label: "In-Room Dining", icon: "fa-solid fa-utensils", request: "In-Room Dining & Refreshments" },
                    { label: "Linen & Towels", icon: "fa-solid fa-hands-bubbles", request: "Fresh Linen & Housekeeping" },
                    { label: "Concierge Note", icon: "fa-solid fa-message", isCustom: true }
                ]
            },
            links: {
                reviewText: "Review on TripAdvisor / Google",
                reviewIcon: "fa-solid fa-star",
                menuText: "Dining & Experiences",
                menuIcon: "fa-solid fa-wine-glass"
            }
        },

        cruise: {
            name: "River Cruise & Yacht Charter",
            tagline: "Welcome aboard! Request songs to the DJ, get free sunset photos on WhatsApp, or order deck drinks.",
            tablePrefix: "Deck / Table",
            tableIcon: "fa-solid fa-ship",
            vip: {
                title: "Yacht Club VIP Pass 🥂",
                sub: "Get free sunset photo delivery & invite-only cruise passes",
                icon: "fa-solid fa-gem",
                screenTitle: "Yacht Club VIP Pass 🥂",
                screenSub: "Join our guest list to receive high-res sunset photos directly to your WhatsApp, plus discounts on private catamaran charters.",
                dobLabel: "Date of Birth (For Birthday Sail Treats)",
                submitText: "Claim VIP Cruise Pass",
                submitIcon: "fa-solid fa-camera",
                successTitle: "VIP Cruise Pass Active 🥂",
                successMsg: (name) => `Welcome aboard the VIP club, ${name}! Your sunset photo delivery and charter perks will be sent directly to your WhatsApp.`
            },
            service: {
                title: "Deck Concierge & DJ Request 🎵",
                sub: "Request DJ song, fresh drinks, or private charter quote",
                icon: "fa-solid fa-music",
                screenTitle: "Deck Concierge & DJ Request 🎵",
                screenSub: "Tap an option below to alert our cruise crew & deck team immediately:",
                tableLabel: "Table / Deck Location",
                tablePlaceholder: "e.g. Upper Deck / Table 4",
                msgLabel: "Song request or deck request?",
                msgPlaceholder: "e.g. Song title & artist for the DJ, ice bucket, celebration toast...",
                submitText: "Send Request to Crew",
                alertTitle: "Crew Alerted 🚢",
                alertMsg: (req, dest) => `Your request for "${req}" has been routed to our deck team & DJ booth.`
                ,
                tiles: [
                    { label: "DJ Song Request", icon: "fa-solid fa-music", request: "DJ Song Request" },
                    { label: "Deck Drinks", icon: "fa-solid fa-cocktail", request: "Deck Drinks & Cocktails Order" },
                    { label: "Sunset Photos", icon: "fa-solid fa-camera", request: "Free Sunset Photo Delivery on WhatsApp" },
                    { label: "Private Charter", icon: "fa-solid fa-anchor", request: "Private Yacht Charter Inquiry" },
                    { label: "Deck Message", icon: "fa-solid fa-message", isCustom: true }
                ]
            },
            links: {
                reviewText: "Review on Google",
                reviewIcon: "fa-brands fa-google",
                menuText: "Bar Menu & Route Map",
                menuIcon: "fa-solid fa-compass"
            }
        },

        retail: {
            name: "Skincare & Boutique Retail",
            tagline: "Welcome! Join our Insider Club for 10% off online refills, or request styling & skincare assistance.",
            tablePrefix: "Counter",
            tableIcon: "fa-solid fa-bag-shopping",
            vip: {
                title: "Join Skincare & VIP Insiders 🌿",
                sub: "Get 10% off all online refills & exclusive sample drops",
                icon: "fa-solid fa-sparkles",
                screenTitle: "Join Skincare & VIP Insiders 🌿",
                screenSub: "Join our community to unlock 10% lifetime discount on nationwide online refills, personalized regimens, and birthday gifts.",
                dobLabel: "Date of Birth (For Birthday Skincare Treats)",
                submitText: "Unlock 10% Refill Discount",
                submitIcon: "fa-solid fa-tag",
                successTitle: "Insider Perks Active 🌿",
                successMsg: (name) => `Welcome to the Insiders Club, ${name}! Your 10% online refill promo code and personalized regimen perks are now active.`
            },
            service: {
                title: "In-Store Concierge & Refill 🛍️",
                sub: "Order online refills, check stock sizes, or request stylist help",
                icon: "fa-solid fa-bag-shopping",
                screenTitle: "In-Store Concierge & Refill 🛍️",
                screenSub: "Tap an option below for immediate boutique assistance:",
                tableLabel: "Counter / Section (Optional)",
                tablePlaceholder: "e.g. Fragrance Counter / Trial Room",
                msgLabel: "How can our boutique team assist you?",
                msgPlaceholder: "e.g. Looking for dry skin serum, size M in linen dress, gift box...",
                submitText: "Request Boutique Help",
                alertTitle: "Staff Alerted 🛍️",
                alertMsg: (req, dest) => `Your boutique request for "${req}" has been received. Our team will assist you shortly.`,
                tiles: [
                    { label: "Online D2C Refill", icon: "fa-solid fa-box-open", request: "WhatsApp Online Refill (D2C)" },
                    { label: "Skin Consultation", icon: "fa-solid fa-leaf", request: "Skin Type Consultation" },
                    { label: "Check Stock / Size", icon: "fa-solid fa-shirt", request: "Check Stock & Size Availability" },
                    { label: "Gift Packaging", icon: "fa-solid fa-gift", request: "Complimentary Gift Packaging" },
                    { label: "Boutique Note", icon: "fa-solid fa-message", isCustom: true }
                ]
            },
            links: {
                reviewText: "Review on Google",
                reviewIcon: "fa-brands fa-google",
                menuText: "Browse Shop & Catalog",
                menuIcon: "fa-solid fa-bag-shopping"
            }
        },

        salon: {
            name: "Luxury Salon & Spa",
            tagline: "Relax & unwind. Enjoy in-chair refreshments, discover products used in your treatment, or join our VIP Club.",
            tablePrefix: "Chair",
            tableIcon: "fa-solid fa-scissors",
            vip: {
                title: "Join Salon Glow Club ✨",
                sub: "Unlock birthday styling treats & priority seasonal booking",
                icon: "fa-solid fa-wand-magic-sparkles",
                screenTitle: "Join Salon Glow Club ✨",
                screenSub: "Join our VIP Glow Club to receive complimentary birthday blowouts, seasonal priority slots, and treatment upgrades.",
                dobLabel: "Date of Birth (For Birthday Glow Treats)",
                submitText: "Join Glow Club",
                submitIcon: "fa-solid fa-sparkles",
                successTitle: "Glow Club Active ✨",
                successMsg: (name) => `Welcome to the Glow Club, ${name}! Your styling profile has been logged for birthday rewards and treatment upgrades.`
            },
            service: {
                title: "In-Chair Concierge 💆",
                sub: "Request herbal tea, browse products used on you, or rebook in 4 weeks",
                icon: "fa-solid fa-hand-sparkles",
                screenTitle: "In-Chair Concierge 💆",
                screenSub: "Tap an option below for instant chair-side assistance:",
                tableLabel: "Styling Chair / Spa Suite",
                tablePlaceholder: "e.g. Chair 03 or Spa Room 2",
                msgLabel: "How can our stylist or team assist?",
                msgPlaceholder: "e.g. Herbal tea with honey, hair serum inquiry, water temperature...",
                submitText: "Alert Salon Team",
                alertTitle: "Stylist Alerted 💆",
                alertMsg: (req, dest) => `Your in-chair request for "${req}" has been sent to our stylist team. We will attend to you momentarily.`,
                tiles: [
                    { label: "Tea & Refreshments", icon: "fa-solid fa-mug-saucer", request: "Herbal Tea & Refreshments" },
                    { label: "Products Used Today", icon: "fa-solid fa-pump-soap", request: "Products Used in Treatment Today" },
                    { label: "4-Week Rebooking", icon: "fa-solid fa-calendar-check", request: "Book Next Session (4-Week Recall)" },
                    { label: "Stylist Consult", icon: "fa-solid fa-headset", request: "Stylist Consultation & Assistance" },
                    { label: "Special Note", icon: "fa-solid fa-message", isCustom: true },
                    { label: "Call Manager", icon: "fa-solid fa-user-tie", request: "Urgent: Call Floor Manager", isUrgent: true },
                    { label: "Complaint", icon: "fa-solid fa-shield-halved", isComplaint: true }
                ]
            },
            links: {
                reviewText: "Review on Google",
                reviewIcon: "fa-brands fa-google",
                menuText: "Treatment & Styling Menu",
                menuIcon: "fa-solid fa-book-open"
            }
        },

        dining: {
            name: "High-AOV Dining & Bar",
            tagline: "Welcome! Tap below to claim free birthday & VIP perks, request table service, or browse our menu.",
            tablePrefix: "Table",
            tableIcon: "fa-solid fa-chair",
            vip: {
                title: "Claim Free Birthday & VIP Perks 🎁",
                sub: "Get complimentary birthday treats & secret chef offers",
                icon: "fa-solid fa-crown",
                screenTitle: "Claim Free Birthday & VIP Perks 🎁",
                screenSub: "Get complimentary birthday treats & secret chef offers sent straight to your WhatsApp.",
                dobLabel: "Birthday (Optional — For Free Birthday Treats 🎂)",
                submitText: "Claim VIP Privileges",
                submitIcon: "fa-solid fa-gift",
                successTitle: "VIP Privileges Active 🥂",
                successMsg: (name) => `Welcome to the VIP Dining Club, ${name}! Your profile has been logged for exclusive perks and birthday treats.`
            },
            service: {
                title: "Call Table Service 🛎️",
                sub: "Request water, waiter, or bill in < 3 seconds",
                icon: "fa-solid fa-bell-concierge",
                screenTitle: "Call Table Service 🛎️",
                screenSub: "Tap a service option below to alert our floor staff immediately:",
                tableLabel: "Table Number (Optional)",
                tablePlaceholder: "e.g. Table 4",
                msgLabel: "How can our team help you?",
                msgPlaceholder: "e.g. Extra napkins, sauce, etc.",
                submitText: "Send Request to Floor Staff",
                alertTitle: "Staff Alerted 🛎️",
                alertMsg: (req, dest) => `Your request for "${req}" has been routed to our floor team. We will attend${dest} momentarily.`,
                tiles: [
                    { label: "Water Refill", icon: "fa-solid fa-bottle-water", request: "Water Refill" },
                    { label: "Call Waiter", icon: "fa-solid fa-hand", request: "Call Waiter" },
                    { label: "Request Bill", icon: "fa-solid fa-receipt", request: "Request Bill & Payment" },
                    { label: "Special Note", icon: "fa-solid fa-message", isCustom: true },
                    { label: "Call Manager", icon: "fa-solid fa-user-tie", request: "Urgent: Call Floor Manager", isUrgent: true },
                    { label: "Complaint", icon: "fa-solid fa-shield-halved", isComplaint: true }
                ]
            },
            links: {
                reviewText: "Review on Google",
                reviewIcon: "fa-brands fa-google",
                menuText: "Browse Menu",
                menuIcon: "fa-solid fa-utensils"
            }
        }
    };

    const currentProfile = categoryProfiles[sector] || categoryProfiles.dining;

    // ----------------------------------------------------
    // 3. Styling & Typography Injection (Two-Tone Metallic Engine)
    // ----------------------------------------------------
    const effectiveAccent = flyerAccent || accentColor || '#d4af37';
    document.documentElement.style.setProperty('--primary', effectiveAccent);
    document.documentElement.style.setProperty('--primary-glow', `${effectiveAccent}40`);

    // Dynamic 3-stage two-tone metallic gradient
    let metallicGradient = `linear-gradient(135deg, ${effectiveAccent} 0%, rgba(255,255,255,0.7) 45%, ${effectiveAccent} 100%)`;
    const accLow = effectiveAccent.toLowerCase();
    if (accLow === '#d4af37') {
        metallicGradient = 'linear-gradient(135deg, #d4af37 0%, #fef08a 45%, #997300 100%)';
    } else if (accLow === '#f59e0b') {
        metallicGradient = 'linear-gradient(135deg, #f59e0b 0%, #fef3c7 45%, #b45309 100%)';
    } else if (accLow === '#38bdf8') {
        metallicGradient = 'linear-gradient(135deg, #38bdf8 0%, #e0f2fe 45%, #0284c7 100%)';
    } else if (accLow === '#10b981') {
        metallicGradient = 'linear-gradient(135deg, #10b981 0%, #d1fae5 45%, #047857 100%)';
    } else if (accLow === '#f43f5e') {
        metallicGradient = 'linear-gradient(135deg, #f43f5e 0%, #ffe4e6 45%, #be123c 100%)';
    }

    const twoToneStyle = document.createElement('style');
    twoToneStyle.id = 'dynamic-two-tone-style';
    twoToneStyle.innerHTML = `
        :root {
            --primary: ${effectiveAccent} !important;
            --primary-glow: ${effectiveAccent}44 !important;
        }
        #business-name {
            background: ${metallicGradient} !important;
            -webkit-background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            text-shadow: 0 0 25px ${effectiveAccent}33;
            font-weight: 800 !important;
            letter-spacing: -0.5px;
        }
        .portal-card::before {
            background: ${metallicGradient} !important;
            height: 6px !important;
        }
        .portal-card {
            border-color: ${effectiveAccent}33 !important;
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px ${effectiveAccent}18 !important;
            ${flyerBg ? `background: ${flyerBg} !important;` : ''}
        }
        .logo-wrapper {
            border-color: ${effectiveAccent}44 !important;
            background: ${effectiveAccent}14 !important;
            box-shadow: 0 8px 25px ${effectiveAccent}25 !important;
        }
        .logo-wrapper i {
            color: ${effectiveAccent} !important;
        }
        #table-badge {
            border-color: ${effectiveAccent}60 !important;
            background: ${effectiveAccent}18 !important;
            color: ${effectiveAccent} !important;
        }
        #table-badge i {
            color: ${effectiveAccent} !important;
        }
        #vip-action-icon-wrapper {
            background: ${effectiveAccent}1a !important;
            color: ${effectiveAccent} !important;
            border-color: ${effectiveAccent}55 !important;
        }
        #hub-menu-icon {
            color: ${effectiveAccent} !important;
        }
        .blob-1, .blob-2 {
            background: radial-gradient(circle, ${effectiveAccent}35 0%, rgba(9, 11, 22, 0) 70%) !important;
        }
        ${flyerText ? `
        .tagline, .feedback-subtitle { color: ${flyerText}cc !important; }
        ` : ''}
        ${flyerBg ? `
        body { background-color: ${flyerBg} !important; }
        ` : ''}
    `;
    document.head.appendChild(twoToneStyle);

    try {
        const fontNameForUrl = font.replace(/ /g, '+');
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${fontNameForUrl}:wght@400;500;600;700;800&display=swap`;
        document.head.appendChild(link);

        const style = document.createElement('style');
        style.innerHTML = `
            body, h2, h3, h4, .tagline, .feedback-subtitle, button, input, textarea, label {
                font-family: "${font}", sans-serif !important;
            }
        `;
        document.head.appendChild(style);
    } catch (e) {
        console.warn('Font loading error:', e);
    }

    // ----------------------------------------------------
    // 4. Inject Dynamic Category Content into DOM
    // ----------------------------------------------------
    // Business Name
    const bizNameEl = document.getElementById('business-name');
    if (bizNameEl) bizNameEl.textContent = bizName;

    // Tagline
    const taglineEl = document.getElementById('portal-tagline');
    if (taglineEl) taglineEl.textContent = currentProfile.tagline;

    // Table / Room / Chair Badge Formatting
    let tableParam = '';
    if (rawTable) {
        const trimmed = rawTable.trim();
        // Check if string already starts with a prefix word
        if (/^(table|room|suite|chair|deck|villa|booth|counter)/i.test(trimmed)) {
            tableParam = trimmed;
        } else {
            tableParam = `${currentProfile.tablePrefix} ${trimmed}`;
        }

        const tableBadge = document.getElementById('table-badge');
        const tableBadgeText = document.getElementById('table-badge-text');
        const tableBadgeIcon = document.getElementById('table-badge-icon');
        if (tableBadge && tableBadgeText) {
            tableBadgeText.textContent = tableParam;
            if (tableBadgeIcon) tableBadgeIcon.className = currentProfile.tableIcon;
            tableBadge.style.display = 'inline-flex';
        }
        const serviceTableInput = document.getElementById('service-table');
        if (serviceTableInput) {
            serviceTableInput.value = tableParam;
        }
    }

    // Logo / Category Icon
    const logoContainer = document.getElementById('logo-container');
    const categoryIcon = document.getElementById('category-icon');
    if (logoUrl && logoContainer) {
        const img = document.createElement('img');
        img.src = logoUrl;
        img.alt = `${bizName} Logo`;
        img.onerror = () => {
            logoContainer.innerHTML = `<i class="${currentProfile.tableIcon}"></i>`;
        };
        logoContainer.innerHTML = '';
        logoContainer.appendChild(img);
    } else if (categoryIcon) {
        categoryIcon.className = currentProfile.tableIcon;
    }

    // Hub Screen Action Card 1: VIP Club & Returning Guest Recognition
    function getVipStorageKey() {
        return `metrix_vip_profile_${venueIdParam || bizName}`;
    }

    function getSavedVipProfile() {
        try {
            const raw = localStorage.getItem(getVipStorageKey());
            return raw ? JSON.parse(raw) : null;
        } catch (e) { return null; }
    }

    function applyVipCopy() {
        const saved = getSavedVipProfile();
        const vat = document.getElementById('vip-action-title');
        const vas = document.getElementById('vip-action-sub');

        if (saved && saved.name) {
            const firstName = saved.name.split(/\s+/)[0];
            const visitText = (saved.visits && saved.visits > 1) ? ` · Visit #${saved.visits}` : '';
            if (vat) vat.textContent = `Welcome Back, ${firstName}! ✓`;
            if (vas) vas.textContent = `VIP Active (${saved.phone || 'Saved'}${visitText}) · Tap to view pass`;
        } else {
            const titleText = (vipOffer && vipOffer.trim()) ? vipOffer.trim() : currentProfile.vip.title;
            const subText = (vipSub && vipSub.trim()) ? vipSub.trim() : currentProfile.vip.sub;
            if (vat) vat.textContent = titleText;
            if (vas) vas.textContent = subText;
        }

        const vst = document.getElementById('vip-screen-title');
        if (vst) vst.textContent = (vipOffer && vipOffer.trim()) ? vipOffer.trim() : currentProfile.vip.screenTitle;
        const vss = document.getElementById('vip-screen-sub');
        if (vss) vss.textContent = (vipSub && vipSub.trim()) ? vipSub.trim() : currentProfile.vip.screenSub;
    }
    applyVipCopy();

    const vipActionIcon = document.getElementById('vip-action-icon');
    if (vipActionIcon) vipActionIcon.className = currentProfile.vip.icon;

    // Hub Screen Action Card 2: Service / Concierge
    const serviceActionTitle = document.getElementById('service-action-title');
    if (serviceActionTitle) serviceActionTitle.textContent = currentProfile.service.title;

    const serviceActionSub = document.getElementById('service-action-sub');
    if (serviceActionSub) serviceActionSub.textContent = currentProfile.service.sub;

    const serviceActionIcon = document.getElementById('service-action-icon');
    if (serviceActionIcon) serviceActionIcon.className = currentProfile.service.icon;

    // Quick Links (Always visible! Opens real menuUrl if configured, or built-in sample menu preview)
    function refreshQuickLinks() {
        const quickWrap = document.getElementById('hub-quick-links');
        const gmbLink = document.getElementById('hub-gmb-link');
        const menuLink = document.getElementById('hub-menu-link');
        const menuText = document.getElementById('hub-menu-text');
        const menuIcon = document.getElementById('hub-menu-icon');

        if (gmbLink) {
            gmbLink.style.display = 'none';
            if (gmbUrl) gmbLink.href = gmbUrl;
        }

        if (menuLink) {
            const hasRealMenu = Boolean(menuUrl && menuUrl.trim() && menuUrl !== 'https://maps.google.com');
            const p = new URLSearchParams();
            if (venueIdParam) p.set('id', venueIdParam);
            if (bizName) p.set('name', bizName);
            if (rawTable) p.set('table', rawTable);
            if (effectiveAccent) p.set('flyerAccent', effectiveAccent);
            const visualMenuHref = `/menu.html?${p.toString()}`;

            const useVisualMenu = window._hasUploadedMenuGallery || !hasRealMenu;
            menuLink.href = useVisualMenu ? visualMenuHref : menuUrl;
            if (useVisualMenu) menuLink.removeAttribute('target'); else menuLink.setAttribute('target', '_blank');
            menuLink.style.display = venueFeatures.menu !== false ? 'flex' : 'none';
            if (menuText) menuText.textContent = currentProfile.links.menuText;
            if (menuIcon) menuIcon.className = currentProfile.links.menuIcon;
        }

        const wifiBtn = document.getElementById('hub-wifi-btn');
        if (wifiBtn) {
            wifiBtn.style.display = venueFeatures.wifi !== false ? 'flex' : 'none';
        }
        if (quickWrap) {
            const showAny = (venueFeatures.menu !== false) || (venueFeatures.wifi !== false);
            quickWrap.style.display = showAny ? 'flex' : 'none';
        }

        const btnVip = document.getElementById('btn-open-vip');
        if (btnVip) btnVip.style.display = venueFeatures.vip !== false ? 'flex' : 'none';

        const btnSvc = document.getElementById('btn-open-service');
        if (btnSvc) btnSvc.style.display = venueFeatures.service !== false ? 'flex' : 'none';

        const btnGames = document.getElementById('btn-open-games');
        if (btnGames) btnGames.style.display = venueFeatures.games !== false ? 'flex' : 'none';

        const ssidEl = document.getElementById('wifi-ssid-display');
        const passEl = document.getElementById('wifi-pass-display');
        if (ssidEl) ssidEl.textContent = wifiSsid || `${bizName.replace(/\s+/g, '_')}_Guest`;
        if (passEl) passEl.textContent = wifiPass || 'Welcome@Guest';
    }
    refreshQuickLinks();

    // Hydrate live Cloud Settings & Visual Menu Gallery check from Supabase
    if (window.MetrixCloud && (venueIdParam || (bizName && bizName !== 'Our Business'))) {
        window.MetrixCloud.getVenueConfig({ id: venueIdParam || undefined, name: venueIdParam ? undefined : bizName }).then(cfg => {
            if (cfg) {
                if (cfg.name) {
                    bizName = cfg.name;
                    const el = document.getElementById('business-name');
                    if (el) el.textContent = bizName;
                }
                if (cfg.email) bizEmail = cfg.email;
                if (cfg.gmbUrl) gmbUrl = cfg.gmbUrl;
                if (cfg.menuUrl) menuUrl = cfg.menuUrl;
                if (cfg.ntfyTopic) ntfyTopic = cfg.ntfyTopic;
                if (cfg.alertWebhook) webhookUrl = cfg.alertWebhook;
                if (cfg.wifiSsid) wifiSsid = cfg.wifiSsid;
                if (cfg.wifiPass) wifiPass = cfg.wifiPass;
                if (typeof cfg.vipOffer === 'string' && cfg.vipOffer.trim()) vipOffer = cfg.vipOffer.trim();
                if (typeof cfg.vipSub === 'string' && cfg.vipSub.trim()) vipSub = cfg.vipSub.trim();
                if (cfg.features) venueFeatures = { ...venueFeatures, ...cfg.features };
                if (cfg.tier) activeTier = cfg.tier;
                applyVipCopy();
                if (typeof renderServiceTiles === 'function') renderServiceTiles();
            }
            if (window.SUPABASE_URL && window.SUPABASE_ANON_KEY && bizName && bizName !== 'Our Business') {
                fetch(`${window.SUPABASE_URL}/rest/v1/feedback?business_name=ilike.*${encodeURIComponent(bizName)}*&client_name=eq.__METRIX_MENU_GALLERY__&order=created_at.desc&limit=1`, {
                    headers: { 'apikey': window.SUPABASE_ANON_KEY, 'Authorization': `Bearer ${window.SUPABASE_ANON_KEY}` }
                }).then(r => r.ok ? r.json() : []).then(rows => {
                    if (rows && rows.length > 0 && rows[0].client_message) {
                        const arr = JSON.parse(rows[0].client_message);
                        if (Array.isArray(arr) && arr.length > 0) window._hasUploadedMenuGallery = true;
                    }
                    refreshQuickLinks();
                }).catch(() => refreshQuickLinks());
            } else {
                refreshQuickLinks();
            }
        }).catch(() => {});
    }

    // VIP Screen Content (synced via applyVipCopy)
    applyVipCopy();

    const vipDobLabel = document.getElementById('vip-dob-label');
    if (vipDobLabel) vipDobLabel.textContent = currentProfile.vip.dobLabel;

    const vipSubmitText = document.getElementById('vip-submit-text');
    if (vipSubmitText) vipSubmitText.textContent = currentProfile.vip.submitText;

    const vipSubmitIcon = document.getElementById('vip-submit-icon');
    if (vipSubmitIcon) vipSubmitIcon.className = currentProfile.vip.submitIcon;

    // Service Screen Content
    const serviceScreenTitle = document.getElementById('service-screen-title');
    if (serviceScreenTitle) serviceScreenTitle.textContent = currentProfile.service.screenTitle;

    const serviceScreenSub = document.getElementById('service-screen-sub');
    if (serviceScreenSub) serviceScreenSub.textContent = currentProfile.service.screenSub;

    const serviceTableLabel = document.getElementById('service-table-label');
    if (serviceTableLabel) serviceTableLabel.textContent = currentProfile.service.tableLabel;

    const serviceTableInputEl = document.getElementById('service-table');
    if (serviceTableInputEl) serviceTableInputEl.placeholder = currentProfile.service.tablePlaceholder;

    const serviceMsgLabel = document.getElementById('service-msg-label');
    if (serviceMsgLabel) serviceMsgLabel.textContent = currentProfile.service.msgLabel;

    const serviceMsgInput = document.getElementById('service-message');
    if (serviceMsgInput) serviceMsgInput.placeholder = currentProfile.service.msgPlaceholder;

    const serviceSubmitText = document.getElementById('service-submit-text');
    if (serviceSubmitText) serviceSubmitText.textContent = currentProfile.service.submitText;

    // ----------------------------------------------------
    // 5. Screen Navigation Controller
    // ----------------------------------------------------
    const hubScreen = document.getElementById('hub-screen');
    const vipScreen = document.getElementById('vip-screen');
    const serviceScreen = document.getElementById('service-screen');
    const shieldScreen = document.getElementById('shield-screen');
    const gamesScreen = document.getElementById('games-screen');
    const wifiScreen = document.getElementById('wifi-screen');
    const successScreen = document.getElementById('success-screen');
    const customServiceForm = document.getElementById('custom-service-form');

    function showScreen(screen) {
        [hubScreen, vipScreen, serviceScreen, shieldScreen, gamesScreen, wifiScreen, successScreen].forEach(s => {
            if (s) s.style.display = 'none';
        });
        if (screen) screen.style.display = 'flex';
    }

    let pendingWifiUnlock = false;

    function isWifiUnlocked() {
        if (!venueFeatures.wifiGate) return true;
        try {
            return localStorage.getItem(`metrix_vip_unlocked_${venueIdParam || bizName}`) === '1';
        } catch (e) { return false; }
    }

    function openWifiScreen() {
        const lockedBox = document.getElementById('wifi-locked-box');
        const unlockedBox = document.getElementById('wifi-unlocked-box');
        const vipCta = document.getElementById('btn-wifi-to-vip');
        const unlocked = isWifiUnlocked();

        if (lockedBox) lockedBox.style.display = unlocked ? 'none' : 'flex';
        if (unlockedBox) unlockedBox.style.display = unlocked ? 'flex' : 'none';
        if (vipCta) vipCta.style.display = unlocked ? 'flex' : 'none';
        showScreen(wifiScreen);
    }

    const hubWifiBtn = document.getElementById('hub-wifi-btn');
    if (hubWifiBtn) hubWifiBtn.addEventListener('click', openWifiScreen);
    const unlockWifiVipBtn = document.getElementById('btn-unlock-wifi-vip');
    if (unlockWifiVipBtn) {
        unlockWifiVipBtn.addEventListener('click', () => {
            pendingWifiUnlock = true;
            showScreen(vipScreen);
        });
    }
    const wifiBackBtn = document.getElementById('wifi-back-to-hub');
    if (wifiBackBtn) wifiBackBtn.addEventListener('click', () => showScreen(hubScreen));
    const wifiToVipBtn = document.getElementById('btn-wifi-to-vip');
    if (wifiToVipBtn) wifiToVipBtn.addEventListener('click', openVipEntry);
    const copyWifiBtn = document.getElementById('btn-copy-wifi');
    if (copyWifiBtn) {
        copyWifiBtn.addEventListener('click', () => {
            const pw = document.getElementById('wifi-pass-display')?.textContent || '';
            const txtEl = document.getElementById('copy-wifi-text');
            if (navigator.clipboard && pw) {
                navigator.clipboard.writeText(pw).then(() => {
                    if (txtEl) txtEl.textContent = 'Password Copied!';
                    setTimeout(() => { if (txtEl) txtEl.textContent = 'Copy Password'; }, 2000);
                });
            }
        });
    }

    let vipClockTimer = null;

    function hideVipLivePass() {
        if (vipClockTimer) {
            clearInterval(vipClockTimer);
            vipClockTimer = null;
        }
        const passBox = document.getElementById('vip-live-pass');
        const editBtn = document.getElementById('btn-edit-vip-profile');
        if (passBox) passBox.style.display = 'none';
        if (editBtn) editBtn.style.display = 'none';
    }

    function showVipLivePass(guestName, guestPhone, showSwitchBtn = false) {
        const passBox = document.getElementById('vip-live-pass');
        const metaEl = document.getElementById('vip-pass-meta');
        const clockEl = document.getElementById('vip-pass-clock');
        const offerEl = document.getElementById('vip-pass-offer');
        const editBtn = document.getElementById('btn-edit-vip-profile');

        const tableTag = tableParam || 'Dine-In';
        if (metaEl) metaEl.textContent = `${bizName} · ${tableTag} · ${guestName}`;
        if (offerEl) {
            const activeOfferText = (vipOffer && vipOffer.trim()) ? vipOffer.trim() : currentProfile.vip.title;
            offerEl.textContent = `${activeOfferText}${guestPhone ? ' · ' + guestPhone : ''}`;
        }

        const updateClock = () => {
            if (!clockEl) return;
            const now = new Date();
            const dStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
            const tStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
            clockEl.textContent = `${dStr} · ${tStr}`;
        };
        updateClock();
        if (vipClockTimer) clearInterval(vipClockTimer);
        vipClockTimer = setInterval(updateClock, 1000);

        if (passBox) passBox.style.display = 'block';
        if (editBtn) editBtn.style.display = showSwitchBtn ? 'inline-block' : 'none';
    }

    function openVipEntry() {
        const saved = getSavedVipProfile();
        if (saved && saved.name) {
            const titleEl = document.getElementById('success-title');
            const msgEl = document.getElementById('success-message');
            if (titleEl) titleEl.textContent = `Welcome Back, ${saved.name.split(/\s+/)[0]}! 🥂`;
            if (msgEl) msgEl.textContent = `Your VIP pass is already active on this phone. Show this live screen to our floor team anytime.`;
            showVipLivePass(saved.name, saved.phone || '', true);
            showScreen(successScreen);
            return;
        }
        showScreen(vipScreen);
    }

    const editVipProfileBtn = document.getElementById('btn-edit-vip-profile');
    if (editVipProfileBtn) {
        editVipProfileBtn.addEventListener('click', () => {
            hideVipLivePass();
            showScreen(vipScreen);
        });
    }

    const btnOpenVip = document.getElementById('btn-open-vip');
    if (btnOpenVip) btnOpenVip.addEventListener('click', openVipEntry);

    const btnOpenService = document.getElementById('btn-open-service');
    if (btnOpenService) btnOpenService.addEventListener('click', () => showScreen(serviceScreen));

    const btnOpenShield = document.getElementById('btn-open-shield');
    if (btnOpenShield) btnOpenShield.addEventListener('click', () => showScreen(shieldScreen));

    const btnOpenGames = document.getElementById('btn-open-games');
    if (btnOpenGames) btnOpenGames.addEventListener('click', () => showScreen(gamesScreen));

    const btnGamesToVip = document.getElementById('btn-games-to-vip');
    if (btnGamesToVip) btnGamesToVip.addEventListener('click', openVipEntry);

    const vipBack = document.getElementById('vip-back-to-hub');
    if (vipBack) vipBack.addEventListener('click', () => { pendingWifiUnlock = false; showScreen(hubScreen); });

    const serviceBack = document.getElementById('service-back-to-hub');
    if (serviceBack) serviceBack.addEventListener('click', () => showScreen(hubScreen));

    const shieldBack = document.getElementById('shield-back-to-hub');
    if (shieldBack) shieldBack.addEventListener('click', () => showScreen(serviceScreen));

    const gamesBack = document.getElementById('games-back-to-hub');
    if (gamesBack) gamesBack.addEventListener('click', () => showScreen(hubScreen));

    const backToHub = document.getElementById('btn-back-to-hub');
    if (backToHub) backToHub.addEventListener('click', () => { hideVipLivePass(); showScreen(hubScreen); });

    // ----------------------------------------------------
    // 6. Formatting Helper (Phone)
    // ----------------------------------------------------
    function formatPhone(e) {
        let input = e.target.value.replace(/\D/g, '');
        e.target.value = input.substring(0, 15);
    }

    const vipPhone = document.getElementById('vip-phone');
    if (vipPhone) vipPhone.addEventListener('input', formatPhone);

    // ----------------------------------------------------
    // 7. Data Sync Engine (Supabase & Webhook)
    // ----------------------------------------------------
    function dispatchData(payload) {
        // Local Cache
        try {
            let records = JSON.parse(localStorage.getItem('metrix_guest_records')) || [];
            records.unshift(payload);
            localStorage.setItem('metrix_guest_records', JSON.stringify(records));
        } catch (err) {}

        // Supabase Database Sync
        const SUPABASE_URL = (typeof window !== 'undefined' && window.SUPABASE_URL) || "";
        const SUPABASE_KEY = (typeof window !== 'undefined' && window.SUPABASE_ANON_KEY) || "";
        if (SUPABASE_KEY && SUPABASE_URL) {
            fetch(`${SUPABASE_URL}/rest/v1/feedback`, {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify({
                    business_name: payload.businessName,
                    business_email: payload.businessEmail,
                    rating: payload.rating || 5,
                    client_name: payload.clientName,
                    client_phone: payload.clientPhone,
                    client_dob: payload.clientDOB || "",
                    client_message: payload.clientMessage || "",
                    submitted_at: new Date().toISOString()
                })
            }).catch(err => console.warn("Supabase sync:", err));
        }

        // Webhook (Make / Zapier / Google Sheets)
        if (webhookUrl) {
            fetch(webhookUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }).catch(err => console.warn("Webhook sync:", err));
        }

        // Instant Phone Lock-Screen Push Notification (Free ntfy.sh)
        if (ntfyTopic && payload.pushTitle) {
            fetch(`https://ntfy.sh/${encodeURIComponent(ntfyTopic)}`, {
                method: 'POST',
                headers: {
                    'Title': payload.pushTitle,
                    'Priority': payload.pushUrgent ? 'urgent' : 'high',
                    'Tags': payload.pushUrgent ? 'rotating_light' : 'bell'
                },
                body: payload.pushBody || payload.clientMessage
            }).catch(err => console.warn("Push alert:", err));
        }
    }

    // ----------------------------------------------------
    // 8. VIP Club Form Submission & Auto Country / Anti-Junk Validation
    // ----------------------------------------------------
    const countrySelect = document.getElementById('vip-country-code');
    const vipPhoneInput = document.getElementById('vip-phone');
    const vipPhoneErr = document.getElementById('vip-phone-error');

    const GLOBAL_COUNTRY_CODES = [
        ['🇦🇫', '+93', 'Afghanistan'], ['🇦🇱', '+355', 'Albania'], ['🇩🇿', '+213', 'Algeria'], ['🇦🇩', '+376', 'Andorra'],
        ['🇦🇴', '+244', 'Angola'], ['🇦🇬', '+1268', 'Antigua & Barbuda'], ['🇦🇷', '+54', 'Argentina'], ['🇦🇲', '+374', 'Armenia'],
        ['🇦🇺', '+61', 'Australia'], ['🇦🇹', '+43', 'Austria'], ['🇦🇿', '+994', 'Azerbaijan'], ['🇧🇸', '+1242', 'Bahamas'],
        ['🇧🇭', '+973', 'Bahrain'], ['🇧🇩', '+880', 'Bangladesh'], ['🇧🇧', '+1246', 'Barbados'], ['🇧🇾', '+375', 'Belarus'],
        ['🇧🇪', '+32', 'Belgium'], ['🇧🇿', '+501', 'Belize'], ['🇧🇯', '+229', 'Benin'], ['🇧🇹', '+975', 'Bhutan'],
        ['🇧🇴', '+591', 'Bolivia'], ['🇧🇦', '+387', 'Bosnia & Herzegovina'], ['🇧🇼', '+267', 'Botswana'], ['🇧🇷', '+55', 'Brazil'],
        ['🇧🇳', '+673', 'Brunei'], ['🇧🇬', '+359', 'Bulgaria'], ['🇧🇫', '+226', 'Burkina Faso'], ['🇧🇮', '+257', 'Burundi'],
        ['🇰🇭', '+855', 'Cambodia'], ['🇨🇲', '+237', 'Cameroon'], ['🇨🇦', '+1', 'Canada'], ['🇨🇻', '+238', 'Cape Verde'],
        ['🇨🇫', '+236', 'Central African Republic'], ['🇹🇩', '+235', 'Chad'], ['🇨🇱', '+56', 'Chile'], ['🇨🇳', '+86', 'China'],
        ['🇨🇴', '+57', 'Colombia'], ['🇰🇲', '+269', 'Comoros'], ['🇨🇬', '+242', 'Congo'], ['🇨🇩', '+243', 'Congo (DRC)'],
        ['🇨🇷', '+506', 'Costa Rica'], ['🇭🇷', '+385', 'Croatia'], ['🇨🇺', '+53', 'Cuba'], ['🇨🇾', '+357', 'Cyprus'],
        ['🇨🇿', '+420', 'Czech Republic'], ['🇩🇰', '+45', 'Denmark'], ['🇩🇯', '+253', 'Djibouti'], ['🇩🇲', '+1767', 'Dominica'],
        ['🇩🇴', '+1809', 'Dominican Republic'], ['🇪🇨', '+593', 'Ecuador'], ['🇪🇬', '+20', 'Egypt'], ['🇸🇻', '+503', 'El Salvador'],
        ['🇬🇶', '+240', 'Equatorial Guinea'], ['🇪🇷', '+291', 'Eritrea'], ['🇪🇪', '+372', 'Estonia'], ['🇸🇿', '+268', 'Eswatini'],
        ['🇪🇹', '+251', 'Ethiopia'], ['🇫🇯', '+679', 'Fiji'], ['🇫🇮', '+358', 'Finland'], ['🇫🇷', '+33', 'France'],
        ['🇬🇦', '+241', 'Gabon'], ['🇬🇲', '+220', 'Gambia'], ['🇬🇪', '+995', 'Georgia'], ['🇩🇪', '+49', 'Germany'],
        ['🇬🇭', '+233', 'Ghana'], ['🇬🇷', '+30', 'Greece'], ['🇬🇩', '+1473', 'Grenada'], ['🇬🇹', '+502', 'Guatemala'],
        ['🇬🇳', '+224', 'Guinea'], ['🇬🇼', '+245', 'Guinea-Bissau'], ['🇬🇾', '+592', 'Guyana'], ['🇭🇹', '+509', 'Haiti'],
        ['🇭🇳', '+504', 'Honduras'], ['🇭🇰', '+852', 'Hong Kong'], ['🇭🇺', '+36', 'Hungary'], ['🇮🇸', '+354', 'Iceland'],
        ['🇮🇩', '+62', 'Indonesia'], ['🇮🇷', '+98', 'Iran'], ['🇮🇶', '+964', 'Iraq'], ['🇮🇪', '+353', 'Ireland'],
        ['🇮🇱', '+972', 'Israel'], ['🇮🇹', '+39', 'Italy'], ['🇨🇮', '+225', 'Ivory Coast'], ['🇯🇲', '+1876', 'Jamaica'],
        ['🇯🇵', '+81', 'Japan'], ['🇯🇴', '+962', 'Jordan'], ['🇰🇿', '+7', 'Kazakhstan'], ['🇰🇪', '+254', 'Kenya'],
        ['🇰🇮', '+686', 'Kiribati'], ['🇽🇰', '+383', 'Kosovo'], ['🇰🇼', '+965', 'Kuwait'], ['🇰🇬', '+996', 'Kyrgyzstan'],
        ['🇱🇦', '+856', 'Laos'], ['🇱🇻', '+371', 'Latvia'], ['🇱🇧', '+961', 'Lebanon'], ['🇱🇸', '+266', 'Lesotho'],
        ['🇱🇷', '+231', 'Liberia'], ['🇱🇾', '+218', 'Libya'], ['🇱🇮', '+423', 'Liechtenstein'], ['🇱🇹', '+370', 'Lithuania'],
        ['🇱🇺', '+352', 'Luxembourg'], ['🇲🇴', '+853', 'Macau'], ['🇲🇬', '+261', 'Madagascar'], ['🇲🇼', '+265', 'Malawi'],
        ['🇲🇾', '+60', 'Malaysia'], ['🇲🇻', '+960', 'Maldives'], ['🇲🇱', '+223', 'Mali'], ['🇲🇹', '+356', 'Malta'],
        ['🇲🇭', '+692', 'Marshall Islands'], ['🇲🇷', '+222', 'Mauritania'], ['🇲🇺', '+230', 'Mauritius'], ['🇲🇽', '+52', 'Mexico'],
        ['🇫🇲', '+691', 'Micronesia'], ['🇲🇩', '+373', 'Moldova'], ['🇲🇨', '+377', 'Monaco'], ['🇲🇳', '+976', 'Mongolia'],
        ['🇲🇪', '+382', 'Montenegro'], ['🇲🇦', '+212', 'Morocco'], ['🇲🇿', '+258', 'Mozambique'], ['🇲🇲', '+95', 'Myanmar'],
        ['🇳🇦', '+264', 'Namibia'], ['🇳🇷', '+674', 'Nauru'], ['🇳🇵', '+977', 'Nepal'], ['🇳🇱', '+31', 'Netherlands'],
        ['🇳🇿', '+64', 'New Zealand'], ['🇳🇮', '+505', 'Nicaragua'], ['🇳🇪', '+227', 'Niger'], ['🇳🇬', '+234', 'Nigeria'],
        ['🇲🇰', '+389', 'North Macedonia'], ['🇳🇴', '+47', 'Norway'], ['🇴🇲', '+968', 'Oman'], ['🇵🇰', '+92', 'Pakistan'],
        ['🇵🇼', '+680', 'Palau'], ['🇵🇸', '+970', 'Palestine'], ['🇵🇦', '+507', 'Panama'], ['🇵🇬', '+675', 'Papua New Guinea'],
        ['🇵🇾', '+595', 'Paraguay'], ['🇵🇪', '+51', 'Peru'], ['🇵🇭', '+63', 'Philippines'], ['🇵🇱', '+48', 'Poland'],
        ['🇵🇹', '+351', 'Portugal'], ['🇵🇷', '+1787', 'Puerto Rico'], ['🇶🇦', '+974', 'Qatar'], ['🇷🇴', '+40', 'Romania'],
        ['🇷🇺', '+7', 'Russia'], ['🇷🇼', '+250', 'Rwanda'], ['🇰🇳', '+1869', 'Saint Kitts & Nevis'], ['🇱🇨', '+1758', 'Saint Lucia'],
        ['🇻🇨', '+1784', 'Saint Vincent'], ['🇼🇸', '+685', 'Samoa'], ['🇸🇲', '+378', 'San Marino'], ['🇸🇹', '+239', 'Sao Tome & Principe'],
        ['🇸🇦', '+966', 'Saudi Arabia'], ['🇸🇳', '+221', 'Senegal'], ['🇷🇸', '+381', 'Serbia'], ['🇸🇨', '+248', 'Seychelles'],
        ['🇸🇱', '+232', 'Sierra Leone'], ['🇸🇬', '+65', 'Singapore'], ['🇸🇰', '+421', 'Slovakia'], ['🇸🇮', '+386', 'Slovenia'],
        ['🇸🇧', '+677', 'Solomon Islands'], ['🇸🇴', '+252', 'Somalia'], ['🇿🇦', '+27', 'South Africa'], ['🇰🇷', '+82', 'South Korea'],
        ['🇸🇸', '+211', 'South Sudan'], ['🇪🇸', '+34', 'Spain'], ['🇱🇰', '+94', 'Sri Lanka'], ['🇸🇩', '+249', 'Sudan'],
        ['🇸🇷', '+597', 'Suriname'], ['🇸🇪', '+46', 'Sweden'], ['🇨🇭', '+41', 'Switzerland'], ['🇸🇾', '+963', 'Syria'],
        ['🇹🇼', '+886', 'Taiwan'], ['🇹🇯', '+992', 'Tajikistan'], ['🇹🇿', '+255', 'Tanzania'], ['🇹🇭', '+66', 'Thailand'],
        ['🇹🇱', '+670', 'Timor-Leste'], ['🇹🇬', '+228', 'Togo'], ['🇹🇴', '+676', 'Tonga'], ['🇹🇹', '+1868', 'Trinidad & Tobago'],
        ['🇹🇳', '+216', 'Tunisia'], ['🇹🇷', '+90', 'Turkey'], ['🇹🇲', '+993', 'Turkmenistan'], ['🇹🇻', '+688', 'Tuvalu'],
        ['🇺🇬', '+256', 'Uganda'], ['🇺🇦', '+380', 'Ukraine'], ['🇬🇧', '+44', 'United Kingdom'], ['🇺🇸', '+1', 'United States'],
        ['🇺🇾', '+598', 'Uruguay'], ['🇺🇿', '+998', 'Uzbekistan'], ['🇻🇺', '+678', 'Vanuatu'], ['🇻🇦', '+379', 'Vatican City'],
        ['🇻🇪', '+58', 'Venezuela'], ['🇻🇳', '+84', 'Vietnam'], ['🇾🇪', '+967', 'Yemen'], ['🇿🇲', '+260', 'Zambia'],
        ['🇿🇼', '+263', 'Zimbabwe']
    ];

    if (countrySelect) {
        countrySelect.innerHTML = '';
        const addOpt = (val, text, disabled = false) => {
            const opt = document.createElement('option');
            opt.value = val;
            opt.textContent = text;
            if (disabled) opt.disabled = true;
            countrySelect.appendChild(opt);
        };
        // Pin India & UAE/Dubai right at the top
        addOpt('+91', '🇮🇳 +91 · India');
        addOpt('+971', '🇦🇪 +971 · UAE (Dubai)');
        addOpt('', '── All Countries ──', true);
        GLOBAL_COUNTRY_CODES.forEach(([flag, code, name]) => {
            addOpt(code, `${flag} ${code} · ${name}`);
        });

        try {
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
            if (tz === 'Asia/Dubai') countrySelect.value = '+971';
            else countrySelect.value = '+91';
        } catch (e) {
            countrySelect.value = '+91';
        }
        const updatePhonePlaceholder = () => {
            if (!vipPhoneInput) return;
            if (countrySelect.value === '+91') vipPhoneInput.placeholder = '10-digit WhatsApp number';
            else if (countrySelect.value === '+971') vipPhoneInput.placeholder = 'e.g. 50 123 4567';
            else vipPhoneInput.placeholder = 'WhatsApp number';
        };
        updatePhonePlaceholder();
        countrySelect.addEventListener('change', () => {
            updatePhonePlaceholder();
            if (vipPhoneErr) vipPhoneErr.style.display = 'none';
        });
    }
    if (vipPhoneInput && vipPhoneErr) {
        vipPhoneInput.addEventListener('input', () => {
            vipPhoneErr.style.display = 'none';
        });
    }

    function validateAndFormatPhone(rawInput, selectedCode) {
        let digits = String(rawInput || '').replace(/\D/g, '');
        if (digits.startsWith('00')) digits = digits.slice(2);

        if (selectedCode === '+91') {
            if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
            if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
            if (!/^[6-9]\d{9}$/.test(digits)) {
                return { ok: false, error: 'Please enter a valid 10-digit Indian mobile number (starts with 6, 7, 8, or 9).' };
            }
        } else if (selectedCode === '+971') {
            if (digits.length === 12 && digits.startsWith('971')) digits = digits.slice(3);
            if (digits.length === 10 && digits.startsWith('0')) digits = digits.slice(1);
            if (!/^5\d{8}$/.test(digits) && (digits.length < 8 || digits.length > 10)) {
                return { ok: false, error: 'Please enter a valid UAE mobile number (e.g. 501234567).' };
            }
        } else {
            if (digits.length >= 8 && digits.startsWith('0')) digits = digits.slice(1);
            if (digits.length < 6 || digits.length > 15) {
                return { ok: false, error: 'Please enter a valid WhatsApp number.' };
            }
        }

        const blocked = ['1234567890', '0123456789', '9876543210', '6789012345', '7890123456', '8901234567', '123456789'];
        if (/^(\d)\1+$/.test(digits) || /(.)\1{6,}/.test(digits) || blocked.includes(digits)) {
            return { ok: false, error: 'Please enter your real WhatsApp number so we can send your perks.' };
        }

        const formatted = selectedCode ? `${selectedCode} ${digits}` : `+${digits}`;
        return { ok: true, formatted };
    }

    const toggleAnnivBtn = document.getElementById('btn-toggle-anniv');
    const annivFieldsWrap = document.getElementById('anniv-fields-wrap');
    if (toggleAnnivBtn && annivFieldsWrap) {
        toggleAnnivBtn.addEventListener('click', () => {
            const isHidden = annivFieldsWrap.style.display === 'none';
            annivFieldsWrap.style.display = isHidden ? 'flex' : 'none';
            toggleAnnivBtn.innerHTML = isHidden
                ? '<span>💍 Hide Anniversary Date</span>'
                : '<span>💍 + Add Anniversary Date <span style="opacity:0.75; font-weight:400;">(Optional — Couple Specials)</span></span>';
        });
    }

    async function lookupCloudVipHistory(formattedPhone) {
        const SUPABASE_URL = window.SUPABASE_URL || "";
        const SUPABASE_KEY = window.SUPABASE_ANON_KEY || "";
        const digits = String(formattedPhone || '').replace(/\D/g, '');
        const matchDigits = digits.length >= 10 ? digits.slice(-10) : digits;
        if (!SUPABASE_URL || !SUPABASE_KEY || !matchDigits || !bizName || bizName === 'Our Business') {
            return { visits: 0, previousDob: '' };
        }
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 1200);
        try {
            const res = await fetch(`${SUPABASE_URL}/rest/v1/feedback?business_name=ilike.*${encodeURIComponent(bizName)}*&client_phone=ilike.*${encodeURIComponent(matchDigits)}*&select=id,client_dob,client_message&order=created_at.desc&limit=50`, {
                headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` },
                signal: ctrl.signal
            });
            clearTimeout(timer);
            if (!res.ok) return { visits: 0, previousDob: '' };
            const rows = await res.json();
            if (!Array.isArray(rows)) return { visits: 0, previousDob: '' };
            const vipRows = rows.filter(r => {
                const m = r.client_message || '';
                return !m.includes('[FLOOR_SHIELD]') && !m.includes('[TABLE_CALL]') && !m.startsWith('[ALERT_RESOLVED:');
            });
            const prevDobRow = vipRows.find(r => r.client_dob && r.client_dob.trim());
            return {
                visits: vipRows.length,
                previousDob: prevDobRow ? prevDobRow.client_dob.trim() : ''
            };
        } catch (e) {
            clearTimeout(timer);
            return { visits: 0, previousDob: '' };
        }
    }

    const vipForm = document.getElementById('vip-form');
    if (vipForm) {
        vipForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('btn-submit-vip');
            if (submitBtn && submitBtn.dataset.busy === '1') return;

            const name = document.getElementById('vip-name').value.trim();
            const rawPhone = document.getElementById('vip-phone').value.trim();
            const codeVal = countrySelect ? countrySelect.value : '+91';

            const phoneCheck = validateAndFormatPhone(rawPhone, codeVal);
            if (!phoneCheck.ok) {
                if (vipPhoneErr) {
                    vipPhoneErr.textContent = phoneCheck.error;
                    vipPhoneErr.style.display = 'block';
                }
                if (vipPhoneInput) vipPhoneInput.focus();
                return;
            }
            const phone = phoneCheck.formatted;

            if (submitBtn) {
                submitBtn.dataset.busy = '1';
                submitBtn.disabled = true;
            }

            const history = await lookupCloudVipHistory(phone);
            const visitCount = history.visits + 1;
            const isRepeat = history.visits > 0;

            if (submitBtn) {
                submitBtn.dataset.busy = '0';
                submitBtn.disabled = false;
            }

            const dobDay = (document.getElementById('vip-dob-day')?.value || '').trim();
            const dobMonth = (document.getElementById('vip-dob-month')?.value || '').trim();
            const bdayStr = (dobDay && dobMonth) ? `${dobDay} ${dobMonth}` : (dobMonth || '');

            const annivDay = (document.getElementById('vip-anniv-day')?.value || '').trim();
            const annivMonth = (document.getElementById('vip-anniv-month')?.value || '').trim();
            const annivStr = (annivDay && annivMonth) ? `${annivDay} ${annivMonth}` : (annivMonth || '');

            let dob = (bdayStr && annivStr)
                ? `${bdayStr} · Anniv: ${annivStr}`
                : (annivStr ? `Anniv: ${annivStr}` : bdayStr);
            if (!dob && history.previousDob) dob = history.previousDob;

            const sourceEl = document.getElementById('vip-source');
            const sourceVal = sourceEl ? sourceEl.value : '';

            const tableTag = tableParam ? ` (${tableParam})` : '';
            const sourceTag = sourceVal ? ` [Source: ${sourceVal}]` : '';
            const repeatTag = isRepeat ? ` [REPEAT_VISIT #${visitCount}]` : ' [VIP_OPTIN]';

            dispatchData({
                id: Date.now().toString(),
                businessName: bizName,
                businessEmail: bizEmail,
                rating: 5,
                clientName: name,
                clientPhone: phone,
                clientDOB: dob,
                clientSource: sourceVal,
                clientMessage: `${currentProfile.name} VIP Loyalty Club Opt-In${tableTag}${sourceTag}${repeatTag}`,
                submittedAt: new Date().toLocaleString()
            });

            try {
                localStorage.setItem(`metrix_vip_unlocked_${venueIdParam || bizName}`, '1');
                localStorage.setItem(getVipStorageKey(), JSON.stringify({ name, phone, dob, visits: visitCount, savedAt: Date.now() }));
            } catch (err) {}
            applyVipCopy();

            if (pendingWifiUnlock) {
                pendingWifiUnlock = false;
                openWifiScreen();
                return;
            }

            // Display Success Screen with Live Timestamped Pass
            const titleEl = document.getElementById('success-title');
            const msgEl = document.getElementById('success-message');
            if (isRepeat) {
                if (titleEl) titleEl.textContent = `Welcome Back, ${name.split(/\s+/)[0]}! (Visit #${visitCount}) 🥂`;
                if (msgEl) msgEl.textContent = `Great to see you again! Your repeat VIP visit (#${visitCount}) is logged on our system.`;
            } else {
                if (titleEl) titleEl.textContent = currentProfile.vip.successTitle;
                if (msgEl) msgEl.textContent = currentProfile.vip.successMsg(name);
            }
            showVipLivePass(name, phone, false);

            showScreen(successScreen);
        });
    }

    // ----------------------------------------------------
    // 9. Dynamic Service Tiles & Instant Alert Calling
    // ----------------------------------------------------
    function triggerServiceRequest(requestType) {
        const tableLabel = tableParam || 'Table Guest';
        const cleanMsg = `[TABLE_CALL] [${tableLabel}] ${requestType}`;
        dispatchData({
            id: Date.now().toString(),
            businessName: bizName,
            businessEmail: bizEmail,
            rating: 5,
            clientName: tableParam ? `Seated Guest (${tableParam})` : "Seated Guest",
            clientPhone: tableLabel,
            clientDOB: "",
            clientMessage: cleanMsg,
            submittedAt: new Date().toLocaleString(),
            pushTitle: `${bizName} · ${tableLabel}`,
            pushBody: `Service Call: ${requestType}`,
            pushUrgent: false
        });

        const titleEl = document.getElementById('success-title');
        const msgEl = document.getElementById('success-message');
        if (titleEl) titleEl.textContent = currentProfile.service.alertTitle;
        if (msgEl) {
            const destination = tableParam ? ` to ${tableParam}` : " to your location";
            msgEl.textContent = currentProfile.service.alertMsg(requestType, destination);
        }
        
        hideVipLivePass();
        showScreen(successScreen);
    }

    // Populate Dynamic Service Grid (respects Feature Toggles)
    const serviceGrid = document.getElementById('service-grid');
    function renderServiceTiles() {
        if (!serviceGrid || !currentProfile.service.tiles) return;
        serviceGrid.innerHTML = '';
        currentProfile.service.tiles.forEach((tile) => {
            if (tile.isUrgent && venueFeatures.callManager === false) return;
            if (tile.isComplaint && venueFeatures.complaint === false) return;

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'service-tile';
            btn.innerHTML = `
                <i class="${tile.icon}"></i>
                <span>${tile.label}</span>
            `;

            if (tile.isCustom) {
                btn.addEventListener('click', () => {
                    if (customServiceForm) {
                        customServiceForm.style.display = customServiceForm.style.display === 'none' ? 'flex' : 'none';
                        if (customServiceForm.style.display === 'flex') {
                            const msgInput = document.getElementById('service-message');
                            if (msgInput) msgInput.focus();
                        }
                    }
                });
            } else if (tile.isComplaint) {
                btn.style.borderColor = 'rgba(245, 158, 11, 0.4)';
                btn.addEventListener('click', () => showScreen(shieldScreen));
            } else if (tile.isUrgent) {
                btn.style.borderColor = 'rgba(239, 68, 68, 0.45)';
                btn.addEventListener('click', () => triggerFloorShieldAlert(tile.request));
            } else {
                btn.addEventListener('click', () => triggerServiceRequest(tile.request));
            }

            serviceGrid.appendChild(btn);
        });
    }
    renderServiceTiles();

    // Custom Note Form Handler
    if (customServiceForm) {
        customServiceForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const locationVal = document.getElementById('service-table') ? document.getElementById('service-table').value.trim() : '';
            const msg = document.getElementById('service-message').value.trim();

            const fullMsg = locationVal ? `[${locationVal}] ${msg}` : msg;
            triggerServiceRequest(fullMsg);
        });
    }

    // ----------------------------------------------------
    // 10. Private Floor Shield Handlers (Non-Gating Escalation)
    // ----------------------------------------------------
    function triggerFloorShieldAlert(issueText, guestPhone = '') {
        const tableLabel = tableParam || 'Table Guest';
        dispatchData({
            id: Date.now().toString(),
            businessName: bizName,
            businessEmail: bizEmail,
            rating: 2,
            clientName: tableParam ? `Floor Shield Alert (${tableParam})` : "Floor Shield Alert",
            clientPhone: guestPhone || tableLabel,
            clientDOB: "",
            clientMessage: `[FLOOR_SHIELD] [${tableLabel}] ${issueText}`,
            submittedAt: new Date().toLocaleString(),
            pushTitle: `🚨 URGENT FLOOR SHIELD · ${tableLabel}`,
            pushBody: issueText,
            pushUrgent: true
        });

        const titleEl = document.getElementById('success-title');
        const msgEl = document.getElementById('success-message');
        if (titleEl) titleEl.textContent = "Manager Alerted Immediately 🛡️";
        if (msgEl) msgEl.textContent = `Our floor manager has been notified privately about "${issueText}". Someone is coming over right now to make it right.`;
        hideVipLivePass();
        showScreen(successScreen);
    }

    document.querySelectorAll('.shield-quick-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const issue = btn.getAttribute('data-issue');
            if (issue) triggerFloorShieldAlert(issue);
        });
    });

    const shieldForm = document.getElementById('shield-form');
    if (shieldForm) {
        shieldForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const msg = document.getElementById('shield-message').value.trim();
            const phone = (document.getElementById('shield-phone')?.value || '').trim();
            if (!msg) return;
            triggerFloorShieldAlert(msg, phone);
            shieldForm.reset();
        });
    }

    // ----------------------------------------------------
    // 11. Tabletop Arcade Engine (Couples, Friends & Tic-Tac-Toe)
    // ----------------------------------------------------
    const couplePrompts = [
        "This or That: Sunset beach walk or cozy late-night drive?",
        "What dish on this menu do you think I'd steal off your plate first?",
        "Rate our last weekend trip from 1 to 10—and what made it memorable?",
        "This or That: Street food adventure or fine-dining candlelight?",
        "If we could fly anywhere tomorrow morning (expenses paid), where are we landing?",
        "What is one tiny habit of mine you secretly find cute?",
        "This or That: Spicy seafood thali or wood-fired pizza?",
        "What is one goal you want us to pull off together in the next 6 months?"
    ];
    const friendPrompts = [
        "Most likely to order extra dessert even when everyone says they're full?",
        "Most likely to say '5 minutes away' while still in the shower?",
        "Unpopular Food Opinion: Share a dish everyone loves that you secretly hate!",
        "Most likely to start a spontaneous 2 AM road trip to the beach?",
        "Who at this table takes the longest to read the menu before ordering?",
        "If everyone at this table started a restaurant together, who would go broke giving free food to friends?",
        "Most likely to accidentally text the wrong group chat?"
    ];

    let activeGameMode = 'couples';
    let promptIdx = 0;

    function renderGamePrompt() {
        const pill = document.getElementById('game-mode-pill');
        const textEl = document.getElementById('game-prompt-text');
        const list = activeGameMode === 'couples' ? couplePrompts : friendPrompts;
        if (pill) {
            if (activeGameMode === 'couples') {
                pill.textContent = '❤️ Couples · This or That';
                pill.style.background = 'rgba(244,63,94,0.15)';
                pill.style.color = '#fb7185';
            } else {
                pill.textContent = '🍻 Friends · Party Prompts';
                pill.style.background = 'rgba(168,85,247,0.15)';
                pill.style.color = '#c084fc';
            }
        }
        if (textEl) {
            textEl.textContent = list[promptIdx % list.length];
        }
    }

    // Tic-Tac-Toe State
    let tttBoard = Array(9).fill('');
    let tttTurn = 'X';
    let tttOver = false;
    const winLines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

    function checkTttWinner() {
        for (const [a,b,c] of winLines) {
            if (tttBoard[a] && tttBoard[a] === tttBoard[b] && tttBoard[a] === tttBoard[c]) return tttBoard[a];
        }
        return tttBoard.every(x => x) ? 'DRAW' : null;
    }

    function renderTttBoard() {
        const boardEl = document.getElementById('ttt-board');
        const statusEl = document.getElementById('ttt-status');
        if (!boardEl || !statusEl) return;

        const winner = checkTttWinner();
        if (winner === 'DRAW') {
            statusEl.textContent = "It's a Draw! 🤝";
            tttOver = true;
        } else if (winner) {
            statusEl.textContent = `Player ${winner} Wins! 🏆`;
            tttOver = true;
        } else {
            statusEl.textContent = `Player ${tttTurn}'s Turn`;
        }

        boardEl.innerHTML = '';
        tttBoard.forEach((cell, idx) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.textContent = cell;
            btn.style.cssText = `height:64px; border-radius:10px; border:1px solid rgba(255,255,255,0.18); background:rgba(255,255,255,0.06); color:${cell === 'X' ? '#fbbf24' : '#38bdf8'}; font-size:1.5rem; font-weight:800; cursor:pointer;`;
            btn.addEventListener('click', () => {
                if (tttOver || tttBoard[idx]) return;
                tttBoard[idx] = tttTurn;
                tttTurn = tttTurn === 'X' ? 'O' : 'X';
                renderTttBoard();
            });
            boardEl.appendChild(btn);
        });
    }

    document.querySelectorAll('.game-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.game-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeGameMode = btn.getAttribute('data-game');

            const promptPanel = document.getElementById('game-prompt-panel');
            const tttPanel = document.getElementById('game-ttt-panel');
            if (activeGameMode === 'ttt') {
                if (promptPanel) promptPanel.style.display = 'none';
                if (tttPanel) tttPanel.style.display = 'block';
                renderTttBoard();
            } else {
                if (promptPanel) promptPanel.style.display = 'block';
                if (tttPanel) tttPanel.style.display = 'none';
                promptIdx = Math.floor(Math.random() * 10);
                renderGamePrompt();
            }
        });
    });

    const nextPromptBtn = document.getElementById('btn-next-prompt');
    if (nextPromptBtn) {
        nextPromptBtn.addEventListener('click', () => {
            promptIdx++;
            renderGamePrompt();
        });
    }

    const tttResetBtn = document.getElementById('btn-ttt-reset');
    if (tttResetBtn) {
        tttResetBtn.addEventListener('click', () => {
            tttBoard = Array(9).fill('');
            tttTurn = 'X';
            tttOver = false;
            renderTttBoard();
        });
    }

    renderGamePrompt();
});