document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. URL Parameters Parser
    // ----------------------------------------------------
    const urlParams = new URLSearchParams(window.location.search);
    
    const bizName = urlParams.get('name') || 'Our Business';
    const gmbUrl = urlParams.get('url') || 'https://maps.google.com';
    const accentColor = urlParams.get('color') || urlParams.get('flyerAccent') || '#d4af37';
    const bizEmail = urlParams.get('email') || 'owner@business.com';
    const category = urlParams.get('category') || 'other';
    const logoUrl = urlParams.get('logo') || '';
    const font = urlParams.get('font') || 'Outfit';
    const webhookUrl = urlParams.get('webhook') || '';

    // Apply Brand Accent Color dynamically
    document.documentElement.style.setProperty('--primary', accentColor);
    document.documentElement.style.setProperty('--primary-glow', `${accentColor}40`);

    // Set Brand Typography dynamically
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

    // Set Business Details in DOM
    const bizNameEl = document.getElementById('business-name');
    if (bizNameEl) bizNameEl.textContent = bizName;

    // Quick links setup
    const gmbLink = document.getElementById('hub-gmb-link');
    if (gmbLink) gmbLink.href = gmbUrl;

    const menuLink = document.getElementById('hub-menu-link');
    if (menuLink) menuLink.href = gmbUrl;

    // Logo / Icon rendering
    const logoContainer = document.getElementById('logo-container');
    const categoryIcon = document.getElementById('category-icon');

    const iconClasses = {
        cafe: 'fa-solid fa-mug-hot',
        cafe_premium: 'fa-solid fa-utensils',
        bakery: 'fa-solid fa-cake-slice',
        beverage: 'fa-solid fa-glass-water',
        dental: 'fa-solid fa-tooth',
        gym: 'fa-solid fa-dumbbell',
        salon: 'fa-solid fa-scissors',
        law: 'fa-solid fa-scale-balanced',
        electronics: 'fa-solid fa-laptop-code',
        beauty: 'fa-solid fa-sparkles',
        apparel: 'fa-solid fa-shirt',
        home: 'fa-solid fa-house-laptop',
        health: 'fa-solid fa-leaf',
        other: 'fa-solid fa-store'
    };

    if (logoUrl && logoContainer) {
        const img = document.createElement('img');
        img.src = logoUrl;
        img.alt = `${bizName} Logo`;
        img.onerror = () => {
            logoContainer.innerHTML = `<i class="${iconClasses[category] || iconClasses.other}"></i>`;
        };
        logoContainer.innerHTML = '';
        logoContainer.appendChild(img);
    } else if (categoryIcon) {
        categoryIcon.className = iconClasses[category] || iconClasses.other;
    }

    // ----------------------------------------------------
    // 2. Screen Navigation Controller
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

    // Open VIP Screen
    const btnOpenVip = document.getElementById('btn-open-vip');
    if (btnOpenVip) {
        btnOpenVip.addEventListener('click', () => showScreen(vipScreen));
    }

    // Open Service Screen
    const btnOpenService = document.getElementById('btn-open-service');
    if (btnOpenService) {
        btnOpenService.addEventListener('click', () => showScreen(serviceScreen));
    }

    // Back to Hub Buttons
    const vipBack = document.getElementById('vip-back-to-hub');
    if (vipBack) vipBack.addEventListener('click', () => showScreen(hubScreen));

    const serviceBack = document.getElementById('service-back-to-hub');
    if (serviceBack) serviceBack.addEventListener('click', () => showScreen(hubScreen));

    const backToHub = document.getElementById('btn-back-to-hub');
    if (backToHub) backToHub.addEventListener('click', () => showScreen(hubScreen));

    // ----------------------------------------------------
    // 3. Formatting Helpers (DOB & Phone)
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
    // 4. Data Sync Engine (Supabase & Webhook)
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
    // 5. VIP Club Form Submission
    // ----------------------------------------------------
    const vipForm = document.getElementById('vip-form');
    if (vipForm) {
        vipForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('vip-name').value.trim();
            const phone = document.getElementById('vip-phone').value.trim();
            const dob = document.getElementById('vip-dob') ? document.getElementById('vip-dob').value.trim() : '';

            dispatchData({
                id: Date.now().toString(),
                businessName: bizName,
                businessEmail: bizEmail,
                rating: 5,
                clientName: name,
                clientPhone: phone,
                clientDOB: dob,
                clientMessage: "VIP Guest Loyalty Club Opt-In",
                submittedAt: new Date().toLocaleString()
            });

            // Display Success Screen
            const titleEl = document.getElementById('success-title');
            const msgEl = document.getElementById('success-message');
            if (titleEl) titleEl.textContent = "VIP Privileges Active 🥂";
            if (msgEl) msgEl.textContent = `Welcome to the VIP Dining Club, ${name}! Your profile has been logged for exclusive perks and birthday treats.`;
            
            showScreen(successScreen);
        });
    }

    // ----------------------------------------------------
    // 6. Instant Table Service Alerts
    // ----------------------------------------------------
    function triggerServiceRequest(requestType) {
        dispatchData({
            id: Date.now().toString(),
            businessName: bizName,
            businessEmail: bizEmail,
            rating: 5,
            clientName: "Seated Guest",
            clientPhone: "Table Device",
            clientDOB: "",
            clientMessage: `Table Service Request: ${requestType}`,
            submittedAt: new Date().toLocaleString()
        });

        const titleEl = document.getElementById('success-title');
        const msgEl = document.getElementById('success-message');
        if (titleEl) titleEl.textContent = "Staff Alerted 🛎️";
        if (msgEl) msgEl.textContent = `Your request for "${requestType}" has been routed to our floor team. We will attend to your table momentarily.`;
        
        showScreen(successScreen);
    }

    const btnWater = document.getElementById('service-btn-water');
    if (btnWater) btnWater.addEventListener('click', () => triggerServiceRequest('Water Refill'));

    const btnWaiter = document.getElementById('service-btn-waiter');
    if (btnWaiter) btnWaiter.addEventListener('click', () => triggerServiceRequest('Call Waiter'));

    const btnBill = document.getElementById('service-btn-bill');
    if (btnBill) btnBill.addEventListener('click', () => triggerServiceRequest('Request Bill & Payment'));

    const btnCustom = document.getElementById('service-btn-custom');
    if (btnCustom && customServiceForm) {
        btnCustom.addEventListener('click', () => {
            customServiceForm.style.display = customServiceForm.style.display === 'none' ? 'flex' : 'none';
        });
    }

    if (customServiceForm) {
        customServiceForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const tableNo = document.getElementById('service-table') ? document.getElementById('service-table').value.trim() : '';
            const msg = document.getElementById('service-message').value.trim();

            const fullMsg = tableNo ? `[${tableNo}] ${msg}` : msg;
            triggerServiceRequest(fullMsg);
        });
    }
});
