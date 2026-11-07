document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. URL Parameters & Sector Normalization
    // ----------------------------------------------------
    const urlParams = new URLSearchParams(window.location.search);
    
    const bizName = urlParams.get('name') || 'Our Business';
    const gmbUrl = urlParams.get('url') || 'https://maps.google.com';
    const menuUrl = urlParams.get('menuUrl') || urlParams.get('menu') || gmbUrl;
    const accentColor = urlParams.get('color') || urlParams.get('flyerAccent') || '#d4af37';
    const bizEmail = urlParams.get('email') || 'owner@business.com';
    const rawCategory = urlParams.get('category') || 'dining';
    const logoUrl = urlParams.get('logo') || '';
    const font = urlParams.get('font') || 'Outfit';
    const webhookUrl = urlParams.get('webhook') || '';
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
                    { label: "Special Note", icon: "fa-solid fa-message", isCustom: true }
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
            tagline: "Welcome! Tap below to join our VIP Dining Club, request table service, or browse our menu.",
            tablePrefix: "Table",
            tableIcon: "fa-solid fa-chair",
            vip: {
                title: "Join VIP Dining Club 🥂",
                sub: "Unlock complimentary perks & birthday gifts",
                icon: "fa-solid fa-crown",
                screenTitle: "Unlock VIP Privileges 🥂",
                screenSub: "Join our guest list to receive exclusive dining privileges, chef welcome treats, and birthday celebration perks.",
                dobLabel: "Date of Birth (For Birthday Treats)",
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
                    { label: "Special Note", icon: "fa-solid fa-message", isCustom: true }
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
    // 3. Styling & Typography Injection
    // ----------------------------------------------------
    document.documentElement.style.setProperty('--primary', accentColor);
    document.documentElement.style.setProperty('--primary-glow', `${accentColor}40`);

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

    // Hub Screen Action Card 1: VIP Club
    const vipActionTitle = document.getElementById('vip-action-title');
    if (vipActionTitle) vipActionTitle.textContent = currentProfile.vip.title;

    const vipActionSub = document.getElementById('vip-action-sub');
    if (vipActionSub) vipActionSub.textContent = currentProfile.vip.sub;

    const vipActionIcon = document.getElementById('vip-action-icon');
    if (vipActionIcon) vipActionIcon.className = currentProfile.vip.icon;

    // Hub Screen Action Card 2: Service / Concierge
    const serviceActionTitle = document.getElementById('service-action-title');
    if (serviceActionTitle) serviceActionTitle.textContent = currentProfile.service.title;

    const serviceActionSub = document.getElementById('service-action-sub');
    if (serviceActionSub) serviceActionSub.textContent = currentProfile.service.sub;

    const serviceActionIcon = document.getElementById('service-action-icon');
    if (serviceActionIcon) serviceActionIcon.className = currentProfile.service.icon;

    // Quick Links (Review & Menu / Catalog)
    const gmbLink = document.getElementById('hub-gmb-link');
    const gmbText = document.getElementById('hub-gmb-text');
    const gmbIcon = document.getElementById('hub-gmb-icon');
    if (gmbLink) {
        gmbLink.href = gmbUrl;
        if (gmbText) gmbText.textContent = currentProfile.links.reviewText;
        if (gmbIcon) gmbIcon.className = currentProfile.links.reviewIcon;
    }

    const menuLink = document.getElementById('hub-menu-link');
    const menuText = document.getElementById('hub-menu-text');
    const menuIcon = document.getElementById('hub-menu-icon');
    if (menuLink) {
        menuLink.href = menuUrl;
        if (menuText) menuText.textContent = currentProfile.links.menuText;
        if (menuIcon) menuIcon.className = currentProfile.links.menuIcon;
    }

    // VIP Screen Content
    const vipScreenTitle = document.getElementById('vip-screen-title');
    if (vipScreenTitle) vipScreenTitle.textContent = currentProfile.vip.screenTitle;

    const vipScreenSub = document.getElementById('vip-screen-sub');
    if (vipScreenSub) vipScreenSub.textContent = currentProfile.vip.screenSub;

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
    const successScreen = document.getElementById('success-screen');
    const customServiceForm = document.getElementById('custom-service-form');

    function showScreen(screen) {
        [hubScreen, vipScreen, serviceScreen, successScreen].forEach(s => {
            if (s) s.style.display = 'none';
        });
        if (screen) screen.style.display = 'flex';
    }

    const btnOpenVip = document.getElementById('btn-open-vip');
    if (btnOpenVip) btnOpenVip.addEventListener('click', () => showScreen(vipScreen));

    const btnOpenService = document.getElementById('btn-open-service');
    if (btnOpenService) btnOpenService.addEventListener('click', () => showScreen(serviceScreen));

    const vipBack = document.getElementById('vip-back-to-hub');
    if (vipBack) vipBack.addEventListener('click', () => showScreen(hubScreen));

    const serviceBack = document.getElementById('service-back-to-hub');
    if (serviceBack) serviceBack.addEventListener('click', () => showScreen(hubScreen));

    const backToHub = document.getElementById('btn-back-to-hub');
    if (backToHub) backToHub.addEventListener('click', () => showScreen(hubScreen));

    // ----------------------------------------------------
    // 6. Formatting Helpers (DOB & Phone)
    // ----------------------------------------------------
    function formatDOB(e) {
        if (e.inputType === 'deleteContentBackward') return;
        let input = e.target.value.replace(/\D/g, '').substring(0, 8);
        if (input.length > 4) {
            e.target.value = input.substring(0, 2) + '/' + input.substring(2, 4) + '/' + input.substring(4, 8);
        } else if (input.length > 2) {
            e.target.value = input.substring(0, 2) + '/' + input.substring(2, 4);
        } else {
            e.target.value = input;
        }
    }

    const vipDob = document.getElementById('vip-dob');
    if (vipDob) vipDob.addEventListener('input', formatDOB);

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

        // Webhook (Google Sheets / WhatsApp notification)
        if (webhookUrl) {
            fetch(webhookUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }).catch(err => console.warn("Webhook sync:", err));
        }
    }

    // ----------------------------------------------------
    // 8. VIP Club Form Submission
    // ----------------------------------------------------
    const vipForm = document.getElementById('vip-form');
    if (vipForm) {
        vipForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('vip-name').value.trim();
            const phone = document.getElementById('vip-phone').value.trim();
            const dob = document.getElementById('vip-dob') ? document.getElementById('vip-dob').value.trim() : '';
            const sourceEl = document.getElementById('vip-source');
            const sourceVal = sourceEl ? sourceEl.value : '';

            const tableTag = tableParam ? ` (${tableParam})` : '';
            const sourceTag = sourceVal ? ` [Source: ${sourceVal}]` : '';

            dispatchData({
                id: Date.now().toString(),
                businessName: bizName,
                businessEmail: bizEmail,
                rating: 5,
                clientName: name,
                clientPhone: phone,
                clientDOB: dob,
                clientSource: sourceVal,
                clientMessage: `${currentProfile.name} VIP Loyalty Club Opt-In${tableTag}${sourceTag}`,
                submittedAt: new Date().toLocaleString()
            });

            // Display Success Screen
            const titleEl = document.getElementById('success-title');
            const msgEl = document.getElementById('success-message');
            if (titleEl) titleEl.textContent = currentProfile.vip.successTitle;
            if (msgEl) msgEl.textContent = currentProfile.vip.successMsg(name);
            
            showScreen(successScreen);
        });
    }

    // ----------------------------------------------------
    // 9. Dynamic Service Tiles & Instant Alert Calling
    // ----------------------------------------------------
    function triggerServiceRequest(requestType) {
        const tablePrefix = tableParam ? `[${tableParam}] ` : '';
        dispatchData({
            id: Date.now().toString(),
            businessName: bizName,
            businessEmail: bizEmail,
            rating: 5,
            clientName: tableParam ? `Resident / Seated Guest (${tableParam})` : "Resident / Seated Guest",
            clientPhone: tableParam ? tableParam : "In-Venue Device",
            clientDOB: "",
            clientMessage: `${tablePrefix}${currentProfile.name} Request: ${requestType}`,
            submittedAt: new Date().toLocaleString()
        });

        const titleEl = document.getElementById('success-title');
        const msgEl = document.getElementById('success-message');
        if (titleEl) titleEl.textContent = currentProfile.service.alertTitle;
        if (msgEl) {
            const destination = tableParam ? ` to ${tableParam}` : " to your location";
            msgEl.textContent = currentProfile.service.alertMsg(requestType, destination);
        }
        
        showScreen(successScreen);
    }

    // Populate Dynamic Service Grid
    const serviceGrid = document.getElementById('service-grid');
    if (serviceGrid && currentProfile.service.tiles) {
        serviceGrid.innerHTML = '';
        currentProfile.service.tiles.forEach((tile) => {
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
            } else {
                btn.addEventListener('click', () => triggerServiceRequest(tile.request));
            }

            serviceGrid.appendChild(btn);
        });
    }

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
});