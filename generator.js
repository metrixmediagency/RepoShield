document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // Passcode Security Gate Logic
    // ----------------------------------------------------
    const passcodeGate = document.getElementById('passcode-gate');
    const passcodeForm = document.getElementById('passcode-form');
    const passcodeInput = document.getElementById('passcode-input');
    const passcodeError = document.getElementById('passcode-error');
    
    // Check if already unlocked in this session
    if (sessionStorage.getItem('repushield_unlocked') === 'true') {
        if (passcodeGate) passcodeGate.classList.add('unlocked');
    }

    if (passcodeForm) {
        passcodeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const enteredPasscode = passcodeInput.value.trim();
            
            // The VIP Access Key
            if (enteredPasscode === 'REPUSHIELD-VIP') {
                sessionStorage.setItem('repushield_unlocked', 'true');
                passcodeGate.classList.add('unlocked');
                passcodeError.classList.remove('show');
            } else {
                passcodeError.classList.add('show');
                passcodeInput.value = ''; // clear input
                // Removed misplaced CSS definitions that were incorrectly placed in JS

                passcodeForm.style.transform = 'translateX(-10px)';
                setTimeout(() => passcodeForm.style.transform = 'translateX(10px)', 100);
                setTimeout(() => passcodeForm.style.transform = 'translateX(-10px)', 200);
                setTimeout(() => passcodeForm.style.transform = 'translateX(10px)', 300);
                setTimeout(() => passcodeForm.style.transform = 'translateX(0)', 400);
            }
        });
    }

    // ----------------------------------------------------
    // Mobile Sidebar Drawer Logic
    // ----------------------------------------------------
    const menuToggle = document.getElementById('menu-toggle');
    const sidebarClose = document.getElementById('sidebar-close');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const sidebar = document.getElementById('sidebar');

    function toggleSidebar() {
        sidebar.classList.toggle('open');
        sidebarOverlay.classList.toggle('open');
    }

    if (menuToggle && sidebarClose && sidebarOverlay && sidebar) {
        menuToggle.addEventListener('click', toggleSidebar);
        sidebarClose.addEventListener('click', toggleSidebar);
        sidebarOverlay.addEventListener('click', toggleSidebar);
    }

    // ----------------------------------------------------
    // Tab Navigation Logic
    // ----------------------------------------------------
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');
    const tabTitle = document.getElementById('tab-title');
    const tabSubtitle = document.getElementById('tab-subtitle');

    const tabHeaders = {
        create: {
            title: 'Generate GMB Review Campaign',
            subtitle: 'Enter local business details to instantly generate custom Aegis Protocol portals and print-ready QR standees.'
        },
        campaigns: {
            title: 'Active GMB Campaigns',
            subtitle: 'Manage your active review portals, copy business links, and monitor generated campaigns.'
        },
        social: {
            title: 'July Content Calendar & Instagram Simulator',
            subtitle: 'Browse scheduled posts, swipe through premium carousel slides, play Reels with timed visual storyboards, and export assets as PNGs.'
        },
        academy: {
            title: 'The 100k Agency Academy',
            subtitle: 'Your step-by-step blueprint to signing clients, performing outreach, and hitting your income goals.'
        },
        billing: {
            title: 'Billing & Subscriptions',
            subtitle: 'Generate secure payment links for your clients.'
        },
        clients: {
            title: 'Client Management CRM',
            subtitle: 'Manage your clients, their active campaigns, and billing statuses.'
        },
        agents: {
            title: 'Sales Partner Dashboard',
            subtitle: 'Manage your freelance sales network, register new agents, and approve commission payouts.'
        }
    };

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = item.getAttribute('data-tab');

            // Remove active states
            navItems.forEach(n => n.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Set active state on clicked
            item.classList.add('active');
            document.getElementById(`tab-${tabId}-content`).classList.add('active');

            // Update headers
            if (tabHeaders[tabId]) {
                tabTitle.textContent = tabHeaders[tabId].title;
                tabSubtitle.textContent = tabHeaders[tabId].subtitle;
            }

            // If active campaigns tab, render list
            if (tabId === 'campaigns') {
                renderCampaignsList();
            } else if (tabId === 'clients') {
                renderClientsList();
            } else if (tabId === 'social') {
                initSocialDashboard();
            }

            // Close sidebar drawer on mobile item click
            if (sidebar && sidebar.classList.contains('open')) {
                toggleSidebar();
            }
        });
    });

    // ----------------------------------------------------
    // Academy Sub-tabs Navigation
    // ----------------------------------------------------
    const academyNavs = document.querySelectorAll('.academy-nav');
    const academySubtabs = document.querySelectorAll('.academy-body > div');

    academyNavs.forEach(nav => {
        nav.addEventListener('click', () => {
            const subtabId = nav.getAttribute('data-subtab');

            academyNavs.forEach(n => n.classList.remove('active'));
            academySubtabs.forEach(tab => tab.style.display = 'none');

            nav.classList.add('active');
            document.getElementById(`subtab-${subtabId}`).style.display = 'block';
        });
    });

    // ----------------------------------------------------
    // Simulator Toggle Logic (Mobile vs Flyer)
    // ----------------------------------------------------
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    const previewMobileWrapper = document.getElementById('preview-mobile-wrapper');
    const previewFlyerWrapper = document.getElementById('preview-flyer-wrapper');

    toggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            toggleButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const previewType = btn.getAttribute('data-preview');
            if (previewType === 'mobile') {
                previewMobileWrapper.style.display = 'flex';
                previewFlyerWrapper.style.display = 'none';
            } else {
                previewMobileWrapper.style.display = 'none';
                previewFlyerWrapper.style.display = 'flex';
            }
        });
    });

    // ----------------------------------------------------
    // Mobile Simulator Modal Logic (admin.html)
    // ----------------------------------------------------
    const btnMobPreview = document.getElementById('btn-mob-preview');
    const simOverlayModal = document.getElementById('sim-overlay-modal');
    const simOverlayClose = document.getElementById('btn-sim-overlay-close');
    const simOverlayBody = document.getElementById('sim-overlay-body');
    const originalPreviewColumn = document.querySelector('.preview-column');
    const previewToggles = document.querySelector('.preview-toggles');
    const mobBreakpoint = window.matchMedia('(max-width: 768px)');

    function toggleMobilePreviewBtn(isMobile) {
        if (!btnMobPreview) return;
        if (isMobile) {
            btnMobPreview.style.display = 'block';
            if (originalPreviewColumn) originalPreviewColumn.style.display = 'none';
        } else {
            btnMobPreview.style.display = 'none';
            if (originalPreviewColumn) originalPreviewColumn.style.display = 'flex';
            // If modal is open, close it and return elements
            if (simOverlayModal && simOverlayModal.classList.contains('open')) {
                closeSimModal();
            }
        }
    }

    if (btnMobPreview) {
        toggleMobilePreviewBtn(mobBreakpoint.matches);
        mobBreakpoint.addEventListener('change', (e) => toggleMobilePreviewBtn(e.matches));
    }

    function openSimModal() {
        if (!simOverlayModal || !simOverlayBody || !originalPreviewColumn) return;
        
        // Move toggles and wrappers into modal body
        if (previewToggles) simOverlayBody.appendChild(previewToggles);
        if (previewMobileWrapper) simOverlayBody.appendChild(previewMobileWrapper);
        if (previewFlyerWrapper) simOverlayBody.appendChild(previewFlyerWrapper);
        
        simOverlayModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeSimModal() {
        if (!simOverlayModal || !originalPreviewColumn) return;
        
        simOverlayModal.classList.remove('open');
        document.body.style.overflow = '';
        
        // Move elements back
        if (previewToggles) originalPreviewColumn.appendChild(previewToggles);
        if (previewMobileWrapper) originalPreviewColumn.appendChild(previewMobileWrapper);
        if (previewFlyerWrapper) originalPreviewColumn.appendChild(previewFlyerWrapper);
    }

    if (btnMobPreview) btnMobPreview.addEventListener('click', openSimModal);
    if (simOverlayClose) simOverlayClose.addEventListener('click', closeSimModal);

    // ----------------------------------------------------
    // Real-Time Simulator Input Syncing & Segment Handling
    // ----------------------------------------------------
    const bizNameInput = document.getElementById('biz-name') || document.getElementById('onboard-biz-name') || document.createElement('input');
    const bizGmbInput = document.getElementById('biz-gmb') || document.getElementById('onboard-biz-url') || document.createElement('input');
    const ecommerceTierInput = document.getElementById('ecommerce-tier');
    const productTierGroup = document.getElementById('product-tier-group');
    const bizAccentInput = document.getElementById('biz-accent') || document.getElementById('onboard-biz-color') || document.createElement('input');
    const bizAccentHexInput = document.getElementById('biz-accent-hex') || document.createElement('input');
    const bizCategorySelect = document.getElementById('biz-category') || document.getElementById('onboard-biz-category') || document.createElement('select');
    const bizEmailInput = document.getElementById('biz-email') || document.getElementById('onboard-biz-email') || document.createElement('input');
    const bizLogoInput = document.getElementById('biz-logo') || document.createElement('input');
    const bizBaseUrlInput = document.getElementById('biz-base-url') || document.createElement('input');
    const localWarning = document.getElementById('local-warning');
    const portalIframe = document.getElementById('portal-iframe');

    // UI elements that change based on segment
    const nameLabel = document.getElementById('name-label');
    const nameIcon = document.getElementById('name-icon');
    const destinationLabel = document.getElementById('destination-label');
    const destinationIcon = document.getElementById('destination-icon');
    const destinationTip = document.getElementById('destination-tip');
    const categoryLabel = document.getElementById('category-label');

    // Flyer Mockup DOM elements
    const previewFlyerBizName = document.getElementById('preview-flyer-biz-name');
    const previewFlyerIcon = document.getElementById('preview-flyer-icon');
    const flyerCardPreview = document.getElementById('flyer-card-preview');
    const btnPrintToggle = document.getElementById('btn-print-toggle');

    // Display local file:// protocol warning
    if (window.location.protocol === 'file:') {
        if (localWarning) localWarning.style.display = 'flex';
    }

    let activeCampaignType = 'gmb';
    const segmentButtons = document.querySelectorAll('.segment-btn');

    const campaignOptions = {
        gmb: {
            nameLabel: 'Business Name',
            nameIcon: 'fa-solid fa-store',
            namePlaceholder: 'e.g., The Roasted Bean Cafe',
            destLabel: 'Google Review URL',
            destIcon: 'fa-brands fa-google',
            destPlaceholder: 'e.g., https://g.page/r/XYZ/review',
            destTip: '<i class="fa-solid fa-circle-info"></i> Paste their direct Google Review prompt link.',
            printToggleLabel: '<i class="fa-solid fa-print"></i> Counter Standee',
            headline: 'Love Our Service?',
            subheadline: 'Scan to share your experience with us on Google!',
            footer: 'Help us serve you better!',
            categories: `
                <option value="cafe">☕ Cafe / Restaurant</option>
                <option value="dental">🦷 Dental / Medical Clinic</option>
                <option value="gym">💪 Fitness Gym</option>
                <option value="salon">✂️ Salon / Spa</option>
                <option value="law">⚖️ Law Firm</option>
                <option value="other">💼 Professional Services</option>
            `
        },
        ecommerce: {
            nameLabel: 'Product Name',
            nameIcon: 'fa-solid fa-box-open',
            namePlaceholder: 'e.g., UltraBass Wireless Headphones',
            destLabel: 'Product Review URL (Amazon/Shopify)',
            destIcon: 'fa-solid fa-cart-shopping',
            destPlaceholder: 'e.g., https://www.amazon.in/review/create-review/?asin=B0XXXXXX',
            destTip: '<i class="fa-solid fa-circle-info"></i> Paste the Amazon customer review creation page or Shopify product review URL.',
            printToggleLabel: '<i class="fa-solid fa-box-open"></i> Package Insert',
            headline: 'Love or Fix It?',
            subheadline: 'Scan to let us know. If you love it, leave a review! If it needs fixing, we will make it right instantly.',
            footer: 'Thank you for your purchase!',
            categories: `
                <option value="electronics">💻 Electronics & Gadgets</option>
                <option value="beauty">💄 Beauty & Personal Care</option>
                <option value="apparel">👕 Apparel & Fashion</option>
                <option value="home">🏠 Home & Kitchen</option>
                <option value="health">🌿 Health & Supplements</option>
                <option value="other">📦 Other Products</option>
            `
        },
        delivery: {
            nameLabel: 'Restaurant Name',
            nameIcon: 'fa-solid fa-utensils',
            namePlaceholder: 'e.g., Punjabi Dhaba Express',
            destLabel: 'App Review/Store URL (Zomato/Swiggy)',
            destIcon: 'fa-solid fa-motorcycle',
            destPlaceholder: 'e.g., https://www.zomato.com/ncr/punjabi-dhaba',
            destTip: '<i class="fa-solid fa-circle-info"></i> Paste the restaurant listing URL on Zomato or Swiggy.',
            printToggleLabel: '<i class="fa-solid fa-ticket"></i> Packaging Sticker',
            headline: 'Was Your Food Delicious?',
            subheadline: 'Scan to rate your delivery meal and help us serve you better!',
            footer: 'Made with love & delivered fresh!',
            categories: `
                <option value="cafe">🍔 Fast Food & Quick Service</option>
                <option value="cafe_premium">🍽️ Premium Cuisine</option>
                <option value="bakery">🍰 Bakery & Desserts</option>
                <option value="beverage">🥤 Cafe & Beverages</option>
                <option value="other">🍲 Other Cuisine</option>
            `
        }
    };

    // Category Icon Map
    const categoryIcons = {
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
        other: 'fa-solid fa-briefcase'
    };

    segmentButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            segmentButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            activeCampaignType = btn.getAttribute('data-type');
            applyCampaignTypeConfig(activeCampaignType);
        });
    });

    function applyCampaignTypeConfig(type) {
        const config = campaignOptions[type];
        if (!config) return;
        
        nameLabel.textContent = config.nameLabel;
        nameIcon.className = `${config.nameIcon} input-icon`;
        bizNameInput.placeholder = config.namePlaceholder;
        
        destinationLabel.textContent = config.destLabel;
        destinationIcon.className = `${config.destIcon} input-icon`;
        bizGmbInput.placeholder = config.destPlaceholder;
        destinationTip.innerHTML = config.destTip;
        
        btnPrintToggle.innerHTML = config.printToggleLabel;
        bizCategorySelect.innerHTML = config.categories;
        
        // Remove old classes and add active type class to mockup flyer card
        flyerCardPreview.classList.remove('type-gmb', 'type-ecommerce', 'type-delivery');
        flyerCardPreview.classList.add(`type-${type}`);
        if (type === 'ecommerce' && productTierGroup) {
            productTierGroup.style.display = 'flex';
        } else if (productTierGroup) {
            productTierGroup.style.display = 'none';
        }

        updateSimulators();
    }

    if (document.getElementById('biz-font')) document.getElementById('biz-font').addEventListener('change', updateSimulators);
    if (document.getElementById('onboard-biz-font')) document.getElementById('onboard-biz-font').addEventListener('change', updateSimulators);

    if (document.getElementById('flyer-theme')) document.getElementById('flyer-theme').addEventListener('change', updateSimulators);
    if (document.getElementById('onboard-flyer-theme')) document.getElementById('onboard-flyer-theme').addEventListener('change', updateSimulators);
    
    // Also trigger update on iframe load so it syncs immediately
    const adminIframeInit = document.getElementById('admin-live-flyer');
    const desktopIframeInit = document.getElementById('desktop-live-flyer');
    const mobIframeInit = document.getElementById('mobile-live-flyer');
    
    if (adminIframeInit) adminIframeInit.addEventListener('load', updateSimulators);
    if (desktopIframeInit) desktopIframeInit.addEventListener('load', updateSimulators);
    if (mobIframeInit) mobIframeInit.addEventListener('load', updateSimulators);
    
    function updateSimulators() {
        const name = bizNameInput.value || (activeCampaignType === 'ecommerce' ? 'Your Product Name' : 'Your Business Name');
        const accent = bizAccentInput.value;
        const category = bizCategorySelect.value;
        const logo = bizLogoInput.value || '';
        const email = bizEmailInput.value || '';
        const gmb = bizGmbInput.value || '';

        // 1. PostMessage Payload for Live Flyer Editor
        const selectedFont = (document.getElementById('biz-font') || document.getElementById('onboard-biz-font') || {value: 'Outfit'}).value;
        const selectedTheme = (document.getElementById('flyer-theme') || document.getElementById('onboard-flyer-theme') || {value: 'theme-onyx'}).value;

        const payload = {
            name: name,
            color: accent,
            category: category,
            font: selectedFont,
            theme: selectedTheme,
            qrDot: (document.getElementById('qr-dot-style') || document.getElementById('onboard-qr-dot') || {value: 'theme-default'}).value,
            qrCorner: (document.getElementById('qr-corner-style') || document.getElementById('onboard-qr-corner') || {value: 'extra-rounded'}).value,
            flyerHeadline: (document.getElementById('flyer-headline') || document.getElementById('onboard-flyer-headline') || {value: 'Review Us'}).value,
            flyerSub: (document.getElementById('flyer-sub') || document.getElementById('onboard-flyer-sub') || {value: 'Scan to Rate'}).value,
            flyerFooter: (document.getElementById('flyer-footer') || document.getElementById('onboard-flyer-footer') || {value: 'Help us serve you better!'}).value,
            flyerTextStyle: (document.getElementById('flyer-text-style') || document.getElementById('onboard-flyer-text-style') || {value: 'normal'}).value
        };

        const adminIframe = document.getElementById('admin-live-flyer');
        if (adminIframe && adminIframe.contentWindow) adminIframe.contentWindow.postMessage({ type: 'UPDATE_FLYER', payload }, '*');

        const desktopLiveFlyer = document.getElementById('desktop-live-flyer');
        if (desktopLiveFlyer && desktopLiveFlyer.contentWindow) desktopLiveFlyer.contentWindow.postMessage({ type: 'UPDATE_FLYER', payload }, '*');

        const mobIframe = document.getElementById('mobile-live-flyer');
        if (mobIframe && mobIframe.contentWindow) mobIframe.contentWindow.postMessage({ type: 'UPDATE_FLYER', payload }, '*');

        // 2. Update portal iframe (doesn't support full live updates yet, but shouldn't lag the UI)
        const baseLocation = window.location.href.substring(0, window.location.href.lastIndexOf('/'));
        
        const params = new URLSearchParams({
            name: name,
            url: gmb,
            color: accent,
            email: email,
            logo: logo,
            type: activeCampaignType,
            font: selectedFont,
            theme: selectedTheme,
            qrDot: payload.qrDot,
            qrCorner: payload.qrCorner,
            demo: 'true'
        });

        // Initialize src if it hasn't been set with params yet
        const ts = new Date().getTime();
        if (portalIframe && !portalIframe.src.includes('?')) portalIframe.src = `${baseLocation}/portal.html?v=${ts}&${params.toString()}`;
        if (mobIframe && !mobIframe.src.includes('?')) mobIframe.src = `${baseLocation}/flyer.html?v=${ts}&${params.toString()}`;
        if (desktopLiveFlyer && !desktopLiveFlyer.src.includes('?')) desktopLiveFlyer.src = `${baseLocation}/flyer.html?v=${ts}&${params.toString()}`;
    }

    // Sync input events
    bizNameInput.addEventListener('input', updateSimulators);
    bizGmbInput.addEventListener('input', updateSimulators);
    if(ecommerceTierInput) ecommerceTierInput.addEventListener('input', updateSimulators);
    bizLogoInput.addEventListener('input', updateSimulators);
    bizEmailInput.addEventListener('input', updateSimulators);
    bizCategorySelect.addEventListener('change', updateSimulators);
    
    // Hybrid Customization Events (Admin UI)
    document.getElementById('flyer-theme')?.addEventListener('change', updateSimulators);
    document.getElementById('biz-font')?.addEventListener('change', updateSimulators);
    document.getElementById('qr-dot-style')?.addEventListener('change', updateSimulators);
    document.getElementById('qr-corner-style')?.addEventListener('change', updateSimulators);
    document.getElementById('flyer-headline')?.addEventListener('input', updateSimulators);
    document.getElementById('flyer-sub')?.addEventListener('input', updateSimulators);
    document.getElementById('flyer-footer')?.addEventListener('input', updateSimulators);
    document.getElementById('flyer-text-style')?.addEventListener('change', updateSimulators);

    // Hybrid Customization Events (Sales UI)
    document.getElementById('onboard-flyer-theme')?.addEventListener('change', updateSimulators);
    document.getElementById('onboard-biz-font')?.addEventListener('change', updateSimulators);
    document.getElementById('onboard-qr-dot')?.addEventListener('change', updateSimulators);
    document.getElementById('onboard-qr-corner')?.addEventListener('change', updateSimulators);
    document.getElementById('onboard-flyer-headline')?.addEventListener('input', updateSimulators);
    document.getElementById('onboard-flyer-sub')?.addEventListener('input', updateSimulators);
    document.getElementById('onboard-flyer-footer')?.addEventListener('input', updateSimulators);
    document.getElementById('onboard-flyer-text-style')?.addEventListener('change', updateSimulators);
    document.getElementById('onboard-biz-name')?.addEventListener('input', updateSimulators);
    document.getElementById('onboard-biz-category')?.addEventListener('change', updateSimulators);

    document.getElementById('onboard-biz-color')?.addEventListener('input', updateSimulators);

    bizAccentInput.addEventListener('input', (e) => {
        bizAccentHexInput.value = e.target.value;
        updateSimulators();
    });

    bizAccentHexInput.addEventListener('input', (e) => {
        let val = e.target.value;
        if (val.startsWith('#') && val.length === 7) {
            bizAccentInput.value = val;
            updateSimulators();
        }
    });

    // Initialize simulators with defaults
    updateSimulators();

    // ----------------------------------------------------
    // Campaign Storage & Form Submission
    // ----------------------------------------------------
    const campaignForm = document.getElementById('campaign-form');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');

    function showToast(message) {
        toastMessage.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    campaignForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = bizNameInput.value;
        const gmb = bizGmbInput.value;
        const accent = bizAccentInput.value;
        const category = bizCategorySelect.value;
        const email = bizEmailInput.value;
        const logo = bizLogoInput.value || '';
        const tier = ecommerceTierInput ? ecommerceTierInput.value : '';
        const id = Date.now().toString(); // unique id

        // Theme, Font, and Granular Capture
        const selectedFont = (document.getElementById('biz-font') || document.getElementById('onboard-biz-font') || {value: 'Outfit'}).value;
        const selectedTheme = (document.getElementById('flyer-theme') || document.getElementById('onboard-flyer-theme') || {value: 'theme-onyx'}).value;
        const flyerHeadline = (document.getElementById('flyer-headline') || document.getElementById('onboard-flyer-headline') || {value: 'Review Us'}).value;
        const flyerSub = (document.getElementById('flyer-sub') || document.getElementById('onboard-flyer-sub') || {value: 'Scan to Rate'}).value;
        const flyerFooter = (document.getElementById('flyer-footer') || document.getElementById('onboard-flyer-footer') || {value: 'Help us serve you better!'}).value;
        const flyerTextStyle = (document.getElementById('flyer-text-style') || document.getElementById('onboard-flyer-text-style') || {value: 'normal'}).value;
        const qrDotStyle = (document.getElementById('qr-dot-style') || document.getElementById('onboard-qr-dot') || {value: 'theme-default'}).value;
        const qrCornerStyle = (document.getElementById('qr-corner-style') || document.getElementById('onboard-qr-corner') || {value: 'extra-rounded'}).value;

        let baseLocation = bizBaseUrlInput.value.trim();
        if (!baseLocation) {
            baseLocation = window.location.href.substring(0, window.location.href.lastIndexOf('/'));
        } else {
            if (baseLocation.endsWith('/')) {
                baseLocation = baseLocation.slice(0, -1);
            }
        }

        // Formulate final URLs
        const portalUrlParams = new URLSearchParams({
            id: id,
            name: name,
            url: gmb,
            color: accent,
            email: email,
            category: category,
            logo: logo,
            font: selectedFont,
            tier: tier,
            type: activeCampaignType // Include campaign type
        });
        const finalPortalUrl = `${baseLocation}/portal.html?${portalUrlParams.toString()}`;

        const flyerUrlParams = new URLSearchParams({
            name: name,
            category: category,
            color: accent,
            type: activeCampaignType, // Include campaign type
            tier: tier,
            logo: logo,
            font: selectedFont,
            theme: selectedTheme,
            qrDot: qrDotStyle,
            qrCorner: qrCornerStyle,
            flyerHeadline: flyerHeadline,
            flyerSub: flyerSub,
            flyerFooter: flyerFooter,
            flyerTextStyle: flyerTextStyle,
            portalUrl: finalPortalUrl
        });
        const finalFlyerUrl = `${baseLocation}/flyer.html?${flyerUrlParams.toString()}`;

        // Create campaign object
        const newCampaign = {
            id,
            name,
            gmb,
            accent,
            category,
            email,
            logo,
            tier,
            font: selectedFont,
            theme: selectedTheme,
            qrSettings: { qrDotStyle, qrCornerStyle },
            flyerSettings: { flyerHeadline, flyerSub, flyerFooter, flyerTextStyle },
            type: activeCampaignType, // Store campaign type
            status: 'active', // default billing status
            portalUrl: finalPortalUrl,
            flyerUrl: finalFlyerUrl,
            createdAt: new Date().toLocaleDateString()
        };

        // Save to LocalStorage
        let campaigns = JSON.parse(localStorage.getItem('repushield_campaigns')) || [];
        campaigns.unshift(newCampaign);
        localStorage.setItem('repushield_campaigns', JSON.stringify(campaigns));

        // Generate actual QR code on the Flyer Preview Mockup
        const qrContainer = document.querySelector('.flyer-qr-mock');
        const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(finalPortalUrl)}`;
        qrContainer.innerHTML = `<img src="${qrApiUrl}" alt="Campaign QR Code">`;

        // Success Feedback
        showToast('Campaign assets built successfully! Switch to Active Campaigns tab.');
        campaignForm.reset();
        
        // Reset defaults and simulators
        bizAccentInput.value = '#6366f1';
        bizAccentHexInput.value = '#6366f1';
        activeCampaignType = 'gmb';
        
        // Reset segments UI
        segmentButtons.forEach(b => b.classList.remove('active'));
        if (segmentButtons[0]) segmentButtons[0].classList.add('active');
        applyCampaignTypeConfig('gmb');
    });

    // ----------------------------------------------------
    // Campaigns List Rendering
    // ----------------------------------------------------
    const campaignListBody = document.getElementById('campaign-list-body');

    function renderCampaignsList() {
        const campaigns = JSON.parse(localStorage.getItem('repushield_campaigns')) || [];

        if (campaigns.length === 0) {
            campaignListBody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-state">
                        <i class="fa-solid fa-box-open"></i>
                        <p>No campaigns generated yet. Create your first campaign above!</p>
                    </td>
                </tr>
            `;
            return;
        }

        campaignListBody.innerHTML = '';
        campaigns.forEach(campaign => {
            const tr = document.createElement('tr');
            
            // Handle schema discrepancies between local creation and Supabase sync
            const campaignName = campaign.name || 'Unknown';
            const campaignUrl = campaign.gmb || campaign.destination || '';
            const campaignColor = campaign.accent || campaign.color || '#6366f1';
            const campaignCategory = campaign.category || 'other';
            const campaignEmail = campaign.email || '';
            const campaignType = campaign.type || 'gmb';
            const campaignLogo = campaign.logo || '';
            const campaignTier = campaign.tier || '';
            
            // Dynamically build URLs if missing (e.g. for campaigns pulled from Supabase)
            let pUrl = campaign.portalUrl;
            let fUrl = campaign.flyerUrl;
            
            if (!pUrl || !fUrl || pUrl === 'undefined' || fUrl === 'undefined') {
                let baseLocation = window.location.href.substring(0, window.location.href.lastIndexOf('/'));
                const portalUrlParams = new URLSearchParams({
                    id: campaign.id,
                    name: campaignName,
                    url: campaignUrl,
                    color: campaignColor,
                    email: campaignEmail,
                    category: campaignCategory,
                    logo: campaignLogo || '',
                    tier: campaignTier,
                    type: campaignType,
                    font: campaign.font || 'Outfit'
                });
                pUrl = `${baseLocation}/portal.html?${portalUrlParams.toString()}`;
                
                const flyerUrlParams = new URLSearchParams({
                    name: campaignName,
                    category: campaignCategory,
                    color: campaignColor,
                    type: campaignType,
                    tier: campaignTier,
                    logo: campaignLogo || '',
                    font: campaign.font || 'Outfit',
                    theme: campaign.theme || 'theme-onyx',
                    qrDot: campaign.qrSettings?.qrDotStyle || 'theme-default',
                    qrCorner: campaign.qrSettings?.qrCornerStyle || 'extra-rounded',
                    flyerHeadline: campaign.flyerSettings?.flyerHeadline || 'Review Us',
                    flyerSub: campaign.flyerSettings?.flyerSub || 'Scan to Rate',
                    flyerFooter: campaign.flyerSettings?.flyerFooter || 'Help us serve you better!',
                    flyerTextStyle: campaign.flyerSettings?.flyerTextStyle || 'normal',
                    portalUrl: pUrl
                });
                fUrl = `${baseLocation}/flyer.html?${flyerUrlParams.toString()}`;
            }
            
            // Icon mapping badge
            const categoryLabels = {
                cafe: '☕ Cafe / Quick Service',
                cafe_premium: '🍽️ Premium Dine',
                bakery: '🍰 Bakery & Dessert',
                beverage: '🥤 Cafe & Drinks',
                dental: '🦷 Dental',
                gym: '💪 Gym',
                salon: '✂️ Salon',
                law: '⚖️ Law',
                electronics: '💻 Electronics',
                beauty: '💄 Beauty Care',
                apparel: '👕 Fashion & Style',
                home: '🏠 Home & Kitchen',
                health: '🌿 Health & Supps',
                other: '💼 Professional'
            };
            const badgeClass = `badge badge-${campaignCategory}`;

            // Destination text and icons mapping based on campaign type
            let destinationText = 'Google Maps Review';
            let destinationIconHtml = '<i class="fa-brands fa-google"></i>';
            let printToggleText = 'Copy Standee Flyer Link';
            let printIconClass = 'fa-solid fa-print';
            
            if (campaignType === 'ecommerce') {
                destinationText = 'Amazon/Shopify Review';
                destinationIconHtml = '<i class="fa-solid fa-cart-shopping"></i>';
                printToggleText = 'Copy Box Insert Link';
                printIconClass = 'fa-solid fa-box-open';
            } else if (campaignType === 'delivery') {
                destinationText = 'Zomato/Swiggy Store';
                destinationIconHtml = '<i class="fa-solid fa-motorcycle"></i>';
                printToggleText = 'Copy Bag Sticker Link';
                printIconClass = 'fa-solid fa-ticket';
            }

            tr.innerHTML = `
                <td>
                    <div class="table-biz-info">
                        <h5>${campaignName}</h5>
                        <span>Created: ${campaign.createdAt || 'Synced from Cloud'}</span>
                        ${campaignTier ? `<span style="font-size:0.75rem; color:var(--primary); display:block; margin-top:2px;"><i class="fa-solid fa-layer-group"></i> ${campaignTier}</span>` : ''}
                    </div>
                </td>
                <td>
                    <span class="${badgeClass}">${categoryLabels[campaignCategory] || 'Professional'}</span>
                </td>
                <td>
                    <a href="${campaignUrl}" target="_blank" class="destination-link">
                        ${destinationIconHtml} ${destinationText}
                    </a>
                </td>
                <td>
                    ${campaign.status === 'suspended' ? 
                        `<span class="badge" style="background: rgba(239, 68, 68, 0.2); border: 1px solid rgba(239, 68, 68, 0.5); color: #ef4444;"><i class="fa-solid fa-ban"></i> Suspended</span>` : 
                     campaign.status === 'grace' ? 
                        `<span class="badge" style="background: rgba(245, 158, 11, 0.2); border: 1px solid rgba(245, 158, 11, 0.5); color: #f59e0b;"><i class="fa-solid fa-clock"></i> Grace Period</span>` :
                        `<span class="badge" style="background: rgba(52, 211, 153, 0.2); border: 1px solid rgba(52, 211, 153, 0.5); color: #34d399;"><i class="fa-solid fa-check"></i> Active</span>`
                    }
                </td>
                <td>
                    <div class="actions-cell">
                        <a href="${pUrl}" target="_blank" class="action-icon-btn" title="View Portal">
                            <i class="fa-solid fa-eye"></i>
                        </a>
                        <a href="${fUrl}" target="_blank" class="action-icon-btn" title="View & Print Asset">
                            <i class="fa-solid fa-print"></i>
                        </a>
                        <button class="action-icon-btn btn-status-toggle" data-id="${campaign.id}" title="Toggle Billing Status">
                            <i class="fa-solid fa-power-off"></i>
                        </button>
                        <button class="action-icon-btn btn-delete" data-id="${campaign.id}" title="Delete Campaign">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </td>
            `;

            campaignListBody.appendChild(tr);
        });

        // Add Event Listeners for Copy buttons (only the button elements, not the a tags)
        const copyBtns = campaignListBody.querySelectorAll('button.copy-link-btn');
        copyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const url = btn.getAttribute('data-url');
                
                const handleCopySuccess = () => {
                    const origHtml = btn.innerHTML;
                    btn.innerHTML = `<i class="fa-solid fa-check text-emerald"></i> Copied!`;
                    btn.style.borderColor = '#10b981';
                    btn.style.color = '#34d399';
                    
                    showToast('Link copied to clipboard!');
                    
                    setTimeout(() => {
                        btn.innerHTML = origHtml;
                        btn.style.borderColor = '';
                        btn.style.color = '';
                    }, 2000);
                };

                if (navigator.clipboard && window.isSecureContext) {
                    navigator.clipboard.writeText(url).then(handleCopySuccess).catch(err => {
                        console.error('Clipboard API failed', err);
                        fallbackCopyTextToClipboard(url, handleCopySuccess);
                    });
                } else {
                    fallbackCopyTextToClipboard(url, handleCopySuccess);
                }
            });
        });
        
        function fallbackCopyTextToClipboard(text, successCallback) {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            // Avoid scrolling to bottom
            textArea.style.top = "0";
            textArea.style.left = "0";
            textArea.style.position = "fixed";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    successCallback();
                } else {
                    showToast('Failed to copy. Try using the Open link.');
                }
            } catch (err) {
                console.error('Fallback: Oops, unable to copy', err);
                showToast('Failed to copy. Try using the Open link.');
            }
            document.body.removeChild(textArea);
        }

        // Add Event Listener for Delete buttons
        const deleteBtns = campaignListBody.querySelectorAll('.btn-delete');
        deleteBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                deleteCampaign(id);
            });
        });

        // Add Event Listener for Toggle Status Override
        const statusBtns = campaignListBody.querySelectorAll('.btn-status-toggle');
        statusBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                toggleCampaignStatus(id);
            });
        });
    }

    function toggleCampaignStatus(id) {
        let campaigns = JSON.parse(localStorage.getItem('repushield_campaigns')) || [];
        const index = campaigns.findIndex(c => c.id === id);
        if (index > -1) {
            const currentStatus = campaigns[index].status || 'active';
            if (currentStatus === 'active') {
                campaigns[index].status = 'grace';
            } else if (currentStatus === 'grace') {
                campaigns[index].status = 'suspended';
            } else {
                campaigns[index].status = 'active';
            }
            localStorage.setItem('repushield_campaigns', JSON.stringify(campaigns));
            renderCampaignsList();
        }
    }

    function deleteCampaign(id) {
        if (!confirm('Are you sure you want to delete this campaign?')) return;
        let campaigns = JSON.parse(localStorage.getItem('repushield_campaigns')) || [];
        campaigns = campaigns.filter(c => c.id !== id);
        localStorage.setItem('repushield_campaigns', JSON.stringify(campaigns));
        renderCampaignsList();
        showToast('Campaign deleted successfully.');
    }

    // ----------------------------------------------------
    // Clients CRM and Billing Logic
    // ----------------------------------------------------
    const clientsContainer = document.getElementById('clients-table-container');
    const billingForm = document.getElementById('billing-form');

    function renderClientsList() {
        if (!clientsContainer) return;
        const campaigns = JSON.parse(localStorage.getItem('repushield_campaigns')) || [];
        
        if (campaigns.length === 0) {
            clientsContainer.innerHTML = `
                <div class="empty-state" style="padding: 3rem; text-align: center;">
                    <i class="fa-solid fa-users" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
                    <p style="color: var(--text-muted);">No clients found. Create a campaign first to automatically generate a client profile.</p>
                </div>
            `;
            return;
        }

        // Group campaigns by email to form "Clients"
        const clients = {};
        campaigns.forEach(c => {
            const email = c.email || 'unknown@client.com';
            if (!clients[email]) {
                clients[email] = {
                    email: email,
                    name: c.name.split(' ')[0], // simple guess for client name
                    campaignsCount: 0,
                    status: c.status || 'active'
                };
            }
            clients[email].campaignsCount++;
        });

        let tableHtml = `
            <div class="table-container">
                <table class="campaigns-table">
                    <thead>
                        <tr>
                            <th>Client Email</th>
                            <th>Associated Name</th>
                            <th>Active Portals</th>
                            <th>Overall Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        Object.values(clients).forEach(client => {
            let statusBadge = '<span class="badge" style="background: rgba(52, 211, 153, 0.2); color: #34d399;">Good Standing</span>';
            if (client.status === 'grace') statusBadge = '<span class="badge" style="background: rgba(245, 158, 11, 0.2); color: #f59e0b;">Payment Overdue</span>';
            if (client.status === 'suspended') statusBadge = '<span class="badge" style="background: rgba(239, 68, 68, 0.2); color: #ef4444;">Suspended</span>';

            tableHtml += `
                <tr>
                    <td><strong>${client.email}</strong></td>
                    <td>${client.name}</td>
                    <td>${client.campaignsCount}</td>
                    <td>${statusBadge}</td>
                    <td>
                        <button class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.8rem;" onclick="document.querySelector('[data-tab=\\'billing\\']').click(); document.getElementById('billing-email').value='${client.email}';">
                            <i class="fa-solid fa-file-invoice"></i> Bill Now
                        </button>
                    </td>
                </tr>
            `;
        });

        tableHtml += `</tbody></table></div>`;
        clientsContainer.innerHTML = tableHtml;
    }

    if (billingForm) {
        billingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('billing-email').value;
            const amount = document.getElementById('billing-amount').value;
            showToast(`Payment link for Rs. ${amount} generated and sent to ${email}!`);
            billingForm.reset();
        });
    }

// ----------------------------------------------------
// Clients Management Logic
// ----------------------------------------------------
const clientsKey = 'repushield_clients';
let clients = JSON.parse(localStorage.getItem(clientsKey)) || [];

function saveClients() {
    localStorage.setItem(clientsKey, JSON.stringify(clients));
}

function renderClientsTable() {
    const container = document.getElementById('clients-table-container');
    if (!container) return;
    if (clients.length === 0) {
        container.innerHTML = `<p class="empty-state">No clients added yet. Click "Add Client" to create one.</p>`;
        return;
    }
    const table = document.createElement('table');
    table.className = 'campaigns-table';
    table.id = 'clients-tbody';
    const thead = document.createElement('thead');
    thead.innerHTML = `<tr>
        <th style="width: 25%;">Name</th>
        <th style="width: 25%;">Email</th>
        <th style="width: 15%;">Monthly Amount (INR)</th>
        <th style="width: 20%;">Description</th>
        <th style="width: 15%;">Actions</th>
    </tr>`;
    const tbody = document.createElement('tbody');
    clients.forEach(client => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${client.name}</td>
            <td>${client.email}</td>
            <td>${client.amount}</td>
            <td>${client.description || ''}</td>
            <td class="client-actions">
                <button class="btn btn-primary btn-sm edit-client" data-id="${client.id}">Edit</button>
                <button class="btn btn-primary btn-sm delete-client" data-id="${client.id}">Delete</button>
                <button class="btn btn-primary btn-sm payment-link" data-id="${client.id}">Payment Link</button>
            </td>`;
        tbody.appendChild(tr);
    });
    table.appendChild(thead);
    table.appendChild(tbody);
    
    const wrapper = document.createElement('div');
    wrapper.className = 'table-container';
    wrapper.appendChild(table);
    
    container.innerHTML = '';
    container.appendChild(wrapper);

    // Attach listeners
    container.querySelectorAll('.edit-client').forEach(btn => {
        btn.addEventListener('click', () => openClientModal(btn.getAttribute('data-id')));
    });
    container.querySelectorAll('.delete-client').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            if (confirm('Delete this client?')) {
                clients = clients.filter(c => c.id !== id);
                saveClients();
                renderClientsTable();
                showToast('Client deleted.');
            }
        });
    });
    container.querySelectorAll('.payment-link').forEach(btn => {
        btn.addEventListener('click', () => {
            const client = clients.find(c => c.id === btn.getAttribute('data-id'));
            if (!client) return;
            const options = {
                key: RAZORPAY_KEY_ID,
                amount: client.amount * 100,
                currency: 'INR',
                name: 'Aegis Protocol',
                description: client.description || 'Monthly subscription',
                prefill: { email: client.email },
                handler: function (response) {
                    alert('Payment successful! ID: ' + response.razorpay_payment_id);
                },
                theme: { color: '#6366f1' }
            };
            const rzp = new Razorpay(options);
            rzp.open();
        });
    });
}

// Modal handling
const clientModal = document.getElementById('client-modal');
const clientModalClose = document.getElementById('client-modal-close');
const clientForm = document.getElementById('client-form');
let editingClientId = null;

function openClientModal(id) {
    editingClientId = id || null;
    if (editingClientId) {
        const client = clients.find(c => c.id === editingClientId);
        document.getElementById('client-modal-title').textContent = 'Edit Client';
        clientForm['client-name'].value = client.name;
        clientForm['client-email'].value = client.email;
        clientForm['client-amount'].value = client.amount;
        clientForm['client-description'].value = client.description || '';
    } else {
        document.getElementById('client-modal-title').textContent = 'Add Client';
        clientForm.reset();
    }
    clientModal.style.display = 'flex';
}

if (clientModalClose) {
    clientModalClose.addEventListener('click', () => {
        clientModal.style.display = 'none';
    });
}

const addClientBtn = document.getElementById('add-client-btn');
if (addClientBtn) {
    addClientBtn.addEventListener('click', () => openClientModal());
}

if (clientForm) {
    clientForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = clientForm['client-name'].value.trim();
        const email = clientForm['client-email'].value.trim();
        const amount = parseFloat(clientForm['client-amount'].value);
        const description = clientForm['client-description'].value.trim();
        if (editingClientId) {
            const client = clients.find(c => c.id === editingClientId);
            client.name = name;
            client.email = email;
            client.amount = amount;
            client.description = description;
        } else {
            const newClient = {
                id: Date.now().toString(),
                name,
                email,
                amount,
                description,
                createdAt: new Date().toLocaleDateString()
            };
            clients.unshift(newClient);
        }
        saveClients();
        renderClientsTable();
        clientModal.style.display = 'none';
        showToast(editingClientId ? 'Client updated.' : 'Client added.');
    });
}

// Update tab navigation to handle clients rendering
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        const tabId = item.getAttribute('data-tab');
        if (tabId === 'clients') {
            renderClientsTable();
        } else if (tabId === 'agents') {
            renderAgentsTable();
            renderPayoutsTable();
        }
    });
});

// Sync UI when cloud data updates
window.addEventListener('dbSyncComplete', () => {
    const activeItem = document.querySelector('.nav-item.active');
    if (activeItem) {
        const tabId = activeItem.getAttribute('data-tab');
        if (tabId === 'campaigns') renderCampaignsList();
        if (tabId === 'clients') renderClientsTable();
        if (tabId === 'agents') {
            renderAgentsTable();
            renderPayoutsTable();
        }
    }
});

// ----------------------------------------------------
// Sales Partner & Payouts Management Logic (Admin Panel)
// ----------------------------------------------------
const agentsKey = 'repushield_agents';
let agents = JSON.parse(localStorage.getItem(agentsKey)) || [];

function saveAgents() {
    localStorage.setItem(agentsKey, JSON.stringify(agents));
}

function renderAgentsTable() {
    const container = document.getElementById('agents-table-container');
    if (!container) return;
    if (agents.length === 0) {
        container.innerHTML = `<p class="empty-state">No sales partners added yet. Click "Add Sales Partner" to register one.</p>`;
        return;
    }
    const table = document.createElement('table');
    table.className = 'campaigns-table';
    table.id = 'agents-tbody';
    const thead = document.createElement('thead');
    thead.innerHTML = `<tr>
        <th style="width: 25%;">Name</th>
        <th style="width: 20%;">User ID</th>
        <th style="width: 20%;">Password</th>
        <th style="width: 20%;">UPI ID</th>
        <th style="width: 15%;">Actions</th>
    </tr>`;
    const tbody = document.createElement('tbody');
    agents.forEach(agent => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${agent.name}</td>
            <td><code>${agent.username}</code></td>
            <td><code>${agent.password}</code></td>
            <td><code>${agent.upi}</code></td>
            <td class="client-actions">
                <button class="btn btn-primary btn-sm edit-agent" data-id="${agent.id}">Edit</button>
                <button class="btn btn-primary btn-sm delete-agent" data-id="${agent.id}">Delete</button>
            </td>`;
        tbody.appendChild(tr);
    });
    table.appendChild(thead);
    table.appendChild(tbody);
    
    const wrapper = document.createElement('div');
    wrapper.className = 'table-container';
    wrapper.appendChild(table);
    
    container.innerHTML = '';
    container.appendChild(wrapper);

    // Attach listeners
    container.querySelectorAll('.edit-agent').forEach(btn => {
        btn.addEventListener('click', () => openAgentModal(btn.getAttribute('data-id')));
    });
    container.querySelectorAll('.delete-agent').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            if (confirm('Delete this sales partner?')) {
                agents = agents.filter(a => a.id !== id);
                saveAgents();
                renderAgentsTable();
                showToast('Sales partner deleted.');
            }
        });
    });
}

function renderPayoutsTable() {
    const tbody = document.getElementById('admin-payouts-body');
    if (!tbody) return;
    
    // We scan campaigns for referredBy tag
    const campaignsList = JSON.parse(localStorage.getItem('repushield_campaigns')) || [];
    const referralCampaigns = campaignsList.filter(c => c.referredBy);
    
    if (referralCampaigns.length === 0) {
        tbody.innerHTML = `<tr>
            <td colspan="6" class="empty-state">
                <i class="fa-solid fa-receipt"></i>
                <p>No commissions logged yet.</p>
            </td>
        </tr>`;
        return;
    }
    
    tbody.innerHTML = '';
    referralCampaigns.forEach(campaign => {
        const agent = agents.find(a => a.username === campaign.referredBy) || { name: campaign.referredBy, upi: 'Not Found' };
        
        // Setup commission status
        const isPaid = campaign.commissionStatus === 'paid';
        const statusBadge = isPaid 
            ? `<span class="badge" style="background: rgba(52, 211, 153, 0.2); border: 1px solid rgba(52, 211, 153, 0.5); color: #34d399;"><i class="fa-solid fa-check-double"></i> Paid</span>`
            : `<span class="badge" style="background: rgba(251, 191, 36, 0.2); border: 1px solid rgba(251, 191, 36, 0.5); color: #fbbf24;"><i class="fa-solid fa-hourglass-half"></i> Pending</span>`;
            
        const actionBtn = isPaid 
            ? `<button class="btn btn-primary btn-sm" disabled style="opacity: 0.5;">Cleared</button>`
            : `<button class="btn btn-primary btn-sm clear-payout-btn" data-id="${campaign.id}">Clear Payout</button>`;
            
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${campaign.name}</strong></td>
            <td>${agent.name} (<code>${campaign.referredBy}</code>)</td>
            <td>₹1,000</td>
            <td><code>${agent.upi}</code></td>
            <td>${statusBadge}</td>
            <td>${actionBtn}</td>
        `;
        tbody.appendChild(tr);
    });
    
    // Attach listener for clear payout
    tbody.querySelectorAll('.clear-payout-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const campaignId = btn.getAttribute('data-id');
            const campaignsList = JSON.parse(localStorage.getItem('repushield_campaigns')) || [];
            const idx = campaignsList.findIndex(c => c.id === campaignId);
            if (idx !== -1) {
                campaignsList[idx].commissionStatus = 'paid';
                localStorage.setItem('repushield_campaigns', JSON.stringify(campaignsList));
                renderPayoutsTable();
                showToast('Commission payout cleared.');
            }
        });
    });
}

// Modal handling for Agent
const agentModal = document.getElementById('agent-modal');
const agentModalClose = document.getElementById('agent-modal-close');
const agentForm = document.getElementById('agent-form');
let editingAgentId = null;

function openAgentModal(id) {
    editingAgentId = id || null;
    if (editingAgentId) {
        const agent = agents.find(a => a.id === editingAgentId);
        document.getElementById('agent-modal-title').textContent = 'Edit Sales Partner';
        agentForm['agent-name'].value = agent.name;
        agentForm['agent-username'].value = agent.username;
        agentForm['agent-username'].disabled = true; // username shouldn't be changed
        agentForm['agent-password'].value = agent.password;
        agentForm['agent-upi'].value = agent.upi;
    } else {
        document.getElementById('agent-modal-title').textContent = 'Add Sales Partner';
        agentForm.reset();
        agentForm['agent-username'].disabled = false;
    }
    agentModal.style.display = 'flex';
}

if (agentModalClose) {
    agentModalClose.addEventListener('click', () => {
        agentModal.style.display = 'none';
    });
}

const addAgentBtn = document.getElementById('add-agent-btn');
if (addAgentBtn) {
    addAgentBtn.addEventListener('click', () => openAgentModal());
}

if (agentForm) {
    agentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = agentForm['agent-name'].value.trim();
        const username = agentForm['agent-username'].value.trim().toLowerCase();
        const password = agentForm['agent-password'].value.trim();
        const upi = agentForm['agent-upi'].value.trim();
        
        if (editingAgentId) {
            const agent = agents.find(a => a.id === editingAgentId);
            agent.name = name;
            agent.password = password;
            agent.upi = upi;
        } else {
            // Check for duplicate username
            if (agents.some(a => a.username === username)) {
                alert('Username already exists. Please choose a different User ID.');
                return;
            }
            const newAgent = {
                id: Date.now().toString(),
                name,
                username,
                password,
                upi,
                createdAt: new Date().toLocaleDateString()
            };
            agents.unshift(newAgent);
        }
        saveAgents();
        renderAgentsTable();
        agentModal.style.display = 'none';
        showToast(editingAgentId ? 'Sales partner updated.' : 'Sales partner added.');
    });
}

// ----------------------------------------------------
// July Content Calendar & Instagram Simulator Logic
// ----------------------------------------------------

const julyPosts = [
    {
        id: 1,
        title: "The ₹10,000 Cappuccino Review",
        format: "reel",
        niche: "cafe",
        day: "Week 1, Mon",
        trigger: "CAFE",
        coverImg: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop",
        storyboard: [
            { time: 0, text: "Spent <span class='highlight'>₹15 Lakhs</span> on cafe interiors..." },
            { time: 3, text: "Empty tables at 10 AM on a weekend morning." },
            { time: 6, text: "The culprit? <span class='highlight'>One single 1-star review</span> about a cold cappuccino." },
            { time: 9, text: "Aegis Protocol stops the leak. DM <span class='highlight'>'CAFE'</span> to get your counter shield." }
        ],
        captions: {
            original: `If your cafe is sitting at a 4.1 rating on Google Maps, stop acting like you are "doing fine." 

Your food might be a 10/10, but your Maps rating tells tourists you are a second-rate spot. You are actively bleeding up to 50% of your walk-ins to the cafe down the street who has a 4.7. 

Think about it: You spent lakhs on interiors, premium beans, and hiring an amazing barista. 

But a customer who had a minor wait for their latte last weekend just went straight to Google Maps and left an angry 1-star review. That single review drags down your average and costs you thousands in lost weekend walk-ins.

It’s not fair, but it’s how the local economy works. 

Happy diners leave silently; annoyed diners leave reviews. Aegis Protocol stops the leak.

We set up a custom review gating portal and send you a print-ready digital QR standee PDF for your billing counter:
✅ Happy diners scan and are auto-routed to post a public 5-star Google review.
⚠️ Annoyed diners (wait times, cold food) go to a private feedback page straight to the owner.

Handle complaints privately, fix the issue, and protect your rating.

🛡️ 7-DAY REFUND GUARANTEE:
Try the system at your counter risk-free for 7 days. Pay a one-time ₹1,999 setup fee. If not satisfied, request a 100% refund.

👉 Comment "CAFE" below, and we will DM you a custom demo portal using your logo instantly!

#GoaCafes #CafeMarketing #RestaurantOwner #GoaFood #LocalSEO #GMBSEO #ReputationManagement #AegisProtocol #MetrixMedia`,
            controversial: `Unpopular opinion: If you have empty tables on a Saturday morning, it's not because of your food. It's because you let one angry reviewer control your reputation. 

A 4.1 rating on Google Maps is a death sentence in Goa. Tourists don't see "an okay rating" — they see a warning label. 

While you are defensive about your "premium beans", the cafe down the street with a 4.7 is hijacking all your walk-ins. 

Stop playing victim to Google's algorithm.

Aegis Protocol redirects unhappy customers to your private inbox before they hit Google.

🛡️ 7-DAY REFUND GUARANTEE:
Upfront ₹1,999 setup fee. If walk-ins don't rise in 7 days, get 100% back.

👉 Comment "CAFE" to run your rating rescue.`,
            humorous: `Spent ₹15 Lakhs on Italian espresso machines, organic beans, and plant-aesthetic lighting...

Only to get review-bombed by "Suresh69" because his cappuccino was served at 68 degrees instead of 70. 

Now you're at a 4.1. Walk-ins are down. But hey, at least your plants look great.

Stop letting Suresh ruin your margins.

Aegis Protocol filters out the public drama. Happy diners go to Google; Suresh goes to a private complaints form.

🛡️ RISK-FREE TRIAL:
₹1,999 setup, backed by a 7-day money-back guarantee.

👉 Comment "CAFE" and stop coffee-table crying.`
        }
    },
    {
        id: 2,
        title: "The GMB Maps 3-Pack Algorithm",
        format: "carousel",
        theme: "brutal-light",
        niche: "aegis",
        day: "Week 1, Wed",
        trigger: "AEGIS",
        slides: [
            {
                tag: "UX STRATEGY",
                heading: "DESIGNING A <span class='highlight-yellow'>FRICTIONLESS</span> FEEDBACK LOOP",
                body: "How user experience decisions at the billing counter control your Google Maps search visibility and ranking prominence.",
                visual: "mockup",
                visualData: { label: "AEGIS PORTAL" }
            },
            {
                tag: "THE FRICTION PROBLEM",
                heading: "95% OF HAPPY CUSTOMERS <span class='highlight-red'>LEAVE IN SILENCE</span>",
                body: "Annoyed clients vent on Google because of adrenaline. Satisfied clients leave silently because the review process has too much friction.",
                visual: "comparison",
                visualData: {
                    left: { title: "Positive Review", val: "5% Rate", desc: "Requires 6 manual navigation steps", color: "red" },
                    right: { title: "Negative Review", val: "95% Rate", desc: "Driven by immediate post-purchase friction", color: "green" }
                }
            },
            {
                tag: "AEGIS UX BLUEPRINT",
                heading: "FRICTIONLESS <span class='highlight-green'>DUAL-ROUTING</span> INTERFACE",
                body: "A single scan. A single tap. Happy clients are routed to Google; unsatisfied clients open a private chat straight to the owner.",
                visual: "split-path",
                visualData: { start: "Scan QR", node1: "Happy -> Google Maps", node2: "Annoyed -> Private Chat" }
            },
            {
                tag: "CLIENT PSYCHOLOGY",
                heading: "UNHAPPY CLIENTS JUST <span class='highlight-cyan'>WANT TO BE HEARD</span>",
                body: "Provide a private channel to resolve grievances instantly. Keep complaints off Google and turn annoyed buyers into loyal promoters.",
                visual: "grid",
                visualData: [
                    { icon: "fa-solid fa-comment-dots", text: "💬 Direct private messaging to owner" },
                    { icon: "fa-solid fa-bolt", text: "⚡ Resolve issues in 2 minutes in-store" },
                    { icon: "fa-solid fa-shield-halved", text: "🛡️ Keep 1-star ratings off Google Maps" }
                ]
            },
            {
                tag: "THE METRIC OUTCOME",
                heading: "RECLAIM YOUR <span class='highlight-green'>RATING PROMINENCE</span>",
                body: "Upfront ₹1,999 setup, backed by a 7-day money-back guarantee. Rank inside the Google Maps 3-Pack and capture local traffic.",
                visual: "chart",
                visualData: { greenLabel: "4.7★ Aegis Prominence", redLabel: "4.1★ Visibility Danger" }
            }
        ],
        captions: {
            original: `Why do most happy customers leave your business in silence, while unhappy ones go straight to Google Maps?

It comes down to friction.

Leaving a positive review requires a customer to navigate search, find your profile, and click through multiple screens. Leaving a negative review is driven by adrenaline—a customer wants to be heard, and Google is the easiest megaphone.

To solve this, we designed the Aegis Protocol.

It is a frictionless dual-routing system:
1. The customer scans a print-ready QR standee at checkout.
2. A single tap splits the path:
   - Happy customers go directly to Google Maps in 1 click.
   - Unsatisfied customers open a private ticket straight to the owner.

By capturing grievances privately, you resolve issues immediately, protect your GMB rating, and build local search prominence.

We configure your portal and deliver your print-ready QR PDF standee.
🛡️ Backed by a 7-day money-back guarantee.

Comment "AEGIS" below to audit your GMB profile and set up a custom portal.

#LocalSEO #CustomerExperience #UXDesign #GoogleMyBusiness #AegisProtocol #MetrixMedia`,
            controversial: `Stop begging for reviews. It's awkward, it's desperate, and it doesn't work.

95% of your customers throw your review requests in the trash. But that one person who had to wait 10 minutes? They will write a 3-paragraph essay on Google Maps detailing your downfall.

Google's 3-pack is a winner-take-all game. If you aren't in the top 3 local spots, you are funding your competitor's marketing campaign.

Aegis Protocol stops public complaints by routing them straight to the owner's WhatsApp.

🛡️ 7-DAY REFUND SHIELD:
₹1,999 onboarding fee. 100% money back if your rankings don't scale in 7 days.

👉 DM us "AEGIS" to start winning the local SEO war.`,
            humorous: `Asking diners for Google reviews is like asking for a tip on a first date. 

Instead, Suresh leaves silently, but Karen writes a 1-star review because "the lighting was too aggressive for my aura". 

Suddenly you drop out of the Google 3-Pack and your phone stops ringing.

Let's automate the process.

Scan QR -> Happy? Google Review. -> Annoyed? Private inbox. 

🛡️ COST:
₹1,999 one-time setup. 7-day money-back guarantee.

👉 DM "AEGIS" and end the aura-shaming.`
        }
    },
    {
        id: 3,
        title: "Waiting Times vs Clinical Trust",
        format: "reel",
        niche: "clinic",
        day: "Week 1, Fri",
        trigger: "CLINIC",
        coverImg: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop",
        storyboard: [
            { time: 0, text: "Excellent clinical care..." },
            { time: 3, text: "But a 15-minute billing bottleneck..." },
            { time: 6, text: "Leaves a permanent 1-star review on your GMB profile." },
            { time: 9, text: "Protect your practice. DM <span class='highlight'>'CLINIC'</span> to set up your clinical shield." }
        ],
        captions: {
            original: `Patients don't care about your medical degrees if your GMB page is a cemetery of administrative complaints.

A rating below 4.4 stars costs local clinics an average of 3-5 bookings weekly because patients filter by stars, not credentials. If a prospective patient searches for a doctor and sees a 4.1 rating, they skip. They don't see "an okay rating"—they see clinical risk.

The irony? Most negative clinic reviews aren't about the medical care. They are about administrative bottlenecks—like parking, scheduling errors, or waiting times.

These small office issues shouldn't ruin your medical reputation or cost you new patients.

Aegis Protocol protects your practice.

We set up a clean, HIPAA-compliant patient feedback portal and send a print-ready digital QR card PDF for your reception desk:
👩‍⚕️ Patients scan at checkout to leave feedback.
🌟 Happy patients are routed to write a public Google review.
📩 Patients with billing or scheduling grievances go directly to a private director portal, allowing you to resolve issues internally.

Protect your clinical reputation.

🎁 7-DAY RISK-FREE SETUP:
We will configure your custom clinical portal and deliver your print-ready digital QR standee PDF. Pay a one-time onboarding fee of ₹2,499. Backed by our 7-day money-back guarantee.

👉 Comment "CLINIC" below to secure your practice reputation shield today!

#DentalClinic #GoaDentist #GoaSalon #DoctorReputation #MedicalMarketing #ClinicGrowth #HealthcareSEO #PatientExperience #AegisProtocol #MetrixMedia`,
            controversial: `Your medical degree doesn't matter if your receptionist is rude. 

Patients filter doctors by Google star ratings, not medical credentials. A 4.1 rating on Maps means patients assume 'negligent treatment' when it was actually just a parking issue.

If you don't control the narrative, administrative bottlenecks will kill your practice.

Aegis Protocol redirects patients with scheduling complaints to a private manager portal.

🛡️ CLINICAL SHIELD:
₹2,499 one-time setup. 7-day money-back guarantee.

👉 Comment "CLINIC" to lock down your practice prominence.`,
            humorous: `Spent 10 years in medical school, published 20 research papers, and set up a state-of-the-art clinic...

Only to get a 1-star Google review because "the waiting room temperature was freezing."

Now you're at 4.1 stars and new patient inquiries are dropping.

Welcome to medical marketing in 2026.

Aegis Protocol stops waiting-room feedback from ruining your clinical trust.

🛡️ THE CURE:
₹2,499 setup, backed by a 7-day money-back guarantee.

👉 Comment "CLINIC" for a medical GMB fix.`
        }
    },
    {
        id: 4,
        title: "Zomato Spilled Gravy App Penalty",
        format: "reel",
        niche: "zomato",
        day: "Week 2, Mon",
        trigger: "ZOMATO",
        coverImg: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop",
        storyboard: [
            { time: 0, text: "Diner orders a perfect curry..." },
            { time: 3, text: "But the delivery rider spills the gravy in transit." },
            { time: 6, text: "Your kitchen gets a 1-star review. Orders drop 60%." },
            { time: 9, text: "Aegis separates food quality from delivery errors. DM <span class='highlight'>'ZOMATO'</span>." }
        ],
        captions: {
            original: `Your cloud kitchen has 10/10 taste, but Swiggy's algorithm treats you like a scam because of a spilled gravy review.

You cook the perfect meal, pack it carefully, and hand it to the delivery rider. But the rider gets stuck in traffic, takes 45 minutes, and delivers a cold package. Or a container leaks in transit.

Who gets blamed? You do. 

The customer opens Zomato or Swiggy and leaves an angry 1-star rating on your profile. When your rating falls below 4.0, the app algorithms penalize your kitchen, pushing you to the bottom of the feed. Daily orders drop by 60% instantly.

Aegis Protocol shields your cloud kitchen.

By placing a simple feedback card inside every delivery bag:
✅ Happy diners scan and are auto-routed to leave a positive rating on Zomato/Swiggy.
⚠️ Annoyed diners (spilled gravy, cold food, delays) are routed to a private mobile form.

You get notified instantly, issue a refund or discount, and keep the complaint completely off the apps.

🔥 PROTECT YOUR MEAL ORDERS:
We host your custom portal and design your digital QR bag insert cards. Pay a one-time setup fee of ₹1,999. Fully backed by our 7-day money-back guarantee.

👉 Comment "ZOMATO" to secure your delivery shield before the weekend rush!

#CloudKitchen #ZomatoIndia #SwiggyIndia #FoodDelivery #RestaurantOwner #CloudKitchenOwner #DeliveryMarketing #AegisProtocol #MetrixMedia`,
            controversial: `Swiggy and Zomato algorithms don't care that the delivery rider dropped the bag. 

They only see a 1-star review on your profile and demote your cloud kitchen to the bottom of the food feed. One leaked container can cost you 60% of your daily order volume.

Stop letting third-party riders destroy your kitchen rating.

Aegis Protocol intercept bag inserts make sure delivery grievances stay private.

🛡️ ORDER SHIELD:
₹1,999 one-time setup. 7-day money-back guarantee.

👉 Comment "ZOMATO" to protect your restaurant rating.`,
            humorous: `You cook Michelin-level chicken tikka masala, pack it in premium double-sealed containers...

But the rider pulls a wheelie, the gravy spills, and the customer leaves a 1-star Zomato review: "FOOD WAS A MESS, KITCHEN IS PATHETIC."

Now the algorithm shadowbans your kitchen. 

Time to intercept the delivery drama.

Place our custom feedback QR card in every bag. Unhappy customers get instant refunds privately; happy diners review you publicly.

🛡️ PRICING:
₹1,999 onboarding, backed by a 7-day money-back guarantee.

👉 Comment "ZOMATO" and stop paying for rider wheelies.`
        }
    },
    {
        id: 5,
        title: "Compliant Warranty Inserts vs TOS Ban",
        format: "carousel",
        theme: "brutal-dark",
        niche: "amazon",
        day: "Week 2, Wed",
        trigger: "AMAZON",
        slides: [
            {
                tag: "SELLER CRITICAL",
                heading: "THE PACKAGE INSERT <span class='highlight-red'>TRAP</span>",
                body: "Offering cash-back or gift cards for positive Amazon/Flipkart reviews is a direct violation of platform Terms of Service. Platform bots scan customer reports and suspend accounts.",
                visual: "comparison",
                visualData: {
                    left: { title: "Illegal Method", val: "SUSPENDED", desc: "Gift cards for 5-stars = ban", color: "red" },
                    right: { title: "Aegis Method", val: "100% SAFE", desc: "Warranty-linked review redirection", color: "green" }
                }
            },
            {
                tag: "THE COMPLIANT WAY",
                heading: "WARRANTY <span class='highlight-green'>REGISTRATION</span>",
                body: "Platform guidelines explicitly allow you to ask for warranty activation. We embed the review portal directly inside this compliant digital warranty portal.",
                visual: "grid",
                visualData: [
                    { icon: "fa-solid fa-file-contract", text: "📄 Compliant warranty activation flow" },
                    { icon: "fa-solid fa-robot", text: "🤖 100% compliant with platform bots" },
                    { icon: "fa-solid fa-circle-check", text: "✅ Zero risk of listing deletion", highlight: "green" }
                ]
            },
            {
                tag: "THE DUAL ROUTE",
                heading: "THE DUAL ROUTING <span class='highlight-cyan'>FLOW</span>",
                body: "We separate buyers based on their activation experience. Unhappy buyers are routed to an instant replacement ticket.",
                visual: "split-path",
                visualData: { start: "Scan QR", node1: "Happy? -> Google/Amazon", node2: "Defective? -> Private Ticket" }
            },
            {
                tag: "MOCKUP CARD",
                heading: "PREMIUM <span class='highlight-yellow'>WARRANTY INSERT</span>",
                body: "We design a high-end matte-black warranty insert card with gold foil QR codes. Elevates brand value and increases scans by 300%.",
                visual: "mockup",
                visualData: { label: "WARRANTY CARD" }
            },
            {
                tag: "ACTIVATE SECURE",
                heading: "PROTECT YOUR <span class='highlight-green'>LISTINGS</span>",
                body: "Upfront ₹1,999 setup fee. Custom warranty page + insert card layout design. Backed by a 7-day money-back guarantee.",
                visual: "grid",
                visualData: [
                    { icon: "fa-solid fa-shield-halved", text: "🛡️ Amazon/Flipkart TOS Compliant" },
                    { icon: "fa-solid fa-thumbs-up", text: "👍 Boosts organic reviews by 4x" },
                    { icon: "fa-solid fa-refresh", text: "🔄 7-day money-back guarantee" }
                ]
            }
        ],
        captions: {
            original: `Amazon sellers: your warranty inserts are begging for an account suspension. Here is the compliant truth you are ignoring.

Offering cash-back or gift cards on package inserts is a fast-track ticket to a permanent seller account ban. Amazon, Flipkart, and Meesho algorithms are scanning for review manipulation daily. But without inserts, how do you get reviews?

You integrate reviews into a compliant digital product warranty registration.

By providing a professional warranty activation card in the box:
✅ Satisfied buyers activate their warranty and are prompted to share their experience.
⚠️ Unsatisfied buyers (damaged shipping, missing user guide, defects) are routed straight to a private support desk.

You resolve their issues instantly by shipping replacements, blocking negative ratings entirely while playing 100% within platform Terms of Service.

🛡️ 100% PLATFORM COMPLIANT:
We build your warranty registration page and design your digital insert cards. Backed by our 7-day money-back guarantee. Pay a one-time ₹1,999 setup fee.

👉 DM us "AMAZON" to secure your listings and protect your organic sales!

#AmazonSeller #FlipkartSeller #MeeshoSeller #EcommerceBusiness #AmazonFBA #OnlineSeller #ProductReviews #AegisProtocol #MetrixMedia`,
            controversial: `Your gift-card inserts are going to get your Amazon seller account banned. 

Amazon's compliance bots are actively scanning for review bribes. If you are still putting '$5 cash back for a 5-star review' cards in your boxes, you are counting down the days to a permanent suspension.

You can ask for product reviews, but you must do it compliantly.

Aegis Protocol embeds reviews into a digital warranty portal that is 100% compliant with platform TOS.

🛡️ SELLER SHIELD:
₹1,999 setup fee. 7-day money-back guarantee.

👉 DM us "AMAZON" to save your product listing prominence.`,
            humorous: `Putting a 'review us for a ₹100 cashback' slip in your product packaging is like buying reviews from a undercover compliance cop.

One customer uploads a screenshot of your slip, and boom — your ₹5 Lakh/month Amazon listing is permanently deactivated.

Let's do this legally.

Aegis designs a premium warranty activation card. Satisfied buyers review you; customers with broken parts get replacement tickets instantly.

🛡️ TERMS:
₹1,999 setup. 7-day money-back guarantee.

👉 DM "AMAZON" and keep the listing alive.`
        }
    },
    {
        id: 6,
        title: "Damp Towels & Gym Member Churn",
        format: "reel",
        niche: "salon",
        day: "Week 2, Fri",
        trigger: "SALON",
        coverImg: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop",
        storyboard: [
            { time: 0, text: "Premium gym with elite trainers..." },
            { time: 3, text: "But a single damp locker room towel..." },
            { time: 6, text: "Triggers a 1-star GMB review. Bookings fall 50%." },
            { time: 9, text: "Protect your wellness brand. DM <span class='highlight'>'SALON'</span> or <span class='highlight'>'GYM'</span>." }
        ],
        captions: {
            original: `A damp locker room towel just ruined a ₹50,000 launch. Wellness owners, stop letting details kill bookings.

You spent lakhs on premium gym equipment, upscale salon interiors, and hiring the best trainers and stylists. But a client who had a minor billing confusion or found a locker room towel slightly damp just went straight to Google Maps and left an angry 1-star review.

And just like that, your cafe rating drops to a 4.1. 

In the beauty and fitness industry, reputation is everything. Prospective members search for "best gym in Goa" or "luxury spa near me." If they see a 4.1 rating, they assume poor hygiene, bad management, or rude staff. They book with the 4.7-star competitor down the street. 

The worst part? Your services are top-tier. These minor facility or front-desk bottlenecks shouldn't ruin your hard-earned reputation.

Aegis Protocol shields your wellness space.

We set up a professional, clean Client Feedback QR standee at your checkout counter:
✅ Delighted clients scan and are auto-routed to leave a public 5-star Google review.
⚠️ Clients with complaints (cleanliness, billing, wait times) are sent to a private, confidential suggestion form.

You receive an alert instantly, handle the issue privately, and keep their frustration completely off Google Maps.

🛡️ 7-DAY MONEY-BACK GUARANTEE:
We configure your custom wellness portal and send you a high-resolution, print-ready digital QR standee PDF. Try it at your reception desk risk-free for 7 days. Pay a one-time ₹1,999 setup fee; if not satisfied, request a 100% refund.

👉 Comment "SALON" or "GYM" to secure your booking shield today!

#GoaSalon #GoaSpa #GoaGym #SalonOwner #GymOwner #FitnessMarketing #SpaMarketing #ReputationManagement #AegisProtocol #MetrixMedia`,
            controversial: `Your ₹20 Lakh gym fit-out is getting ruined by a bad locker room smell.

One customer gets annoyed by a wet bench, goes to Google Maps, and leaves a 1-star review. Google's algorithm drops your rating average, and suddenly local prospects book elsewhere. 

You lose ₹50,000 in monthly memberships over a facility bottleneck you didn't even know about.

Stop letting minor errors run your business prominence.

Aegis Protocol routes gym complaints privately to the owner.

🛡️ MEMBERSHIP SHIELD:
₹1,999 one-time setup. 7-day money-back guarantee.

👉 Comment "GYM" to lock your ratings.`,
            humorous: `Imported state-of-the-art machines from Germany, hired celebrity trainers, and built a luxury sauna...

Only to get a 1-star review because "the locker room soap dispenser was empty."

Suddenly your GMB rating drops, and new members assume your gym is a dump.

Let's intercept the locker-room complaints.

Our counter QR portal sends happy members to Google and complaints directly to your WhatsApp.

🛡️ COST:
₹1,999 setup, backed by a 7-day money-back guarantee.

👉 Comment "GYM" and stop soap-box crying.`
        }
    },
    {
        id: 7,
        title: "How Review Gating Works (TOS Audit)",
        format: "reel",
        niche: "aegis",
        day: "Week 3, Mon",
        trigger: "AEGIS",
        coverImg: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop",
        storyboard: [
            { time: 0, text: "Is review gating allowed by Google?" },
            { time: 3, text: "Selectively gating Google reviews is a TOS violation." },
            { time: 6, text: "But private customer feedback is 100% legal." },
            { time: 9, text: "Aegis runs compliant dual-routing portals. DM <span class='highlight'>'AEGIS'</span>." }
        ],
        captions: {
            original: `Stop thinking your GMB page is "just a profile." It is your business's credit score. 

A low rating is a direct penalty that Google’s algorithm uses to push you to the bottom of local search results. GMB guidelines state that you cannot "gatekeep" reviews by selectively soliciting positive ones. But every excellent business has a private feedback channel for unsatisfied customers.

Aegis Protocol operates 100% compliantly by providing choice:
👩‍💻 We ask clients to rate their experience.
🌟 Happy clients are routed to Google to share their story.
📩 Unsatisfied clients are provided an immediate, private direct-message link to the manager, allowing you to resolve their complaints internally.

This isn't manipulation—it's active customer service. You solve their problem before they leave the store, so they have no reason to post a 1-star review.

🛡️ 7-DAY MONEY-BACK GUARANTEE:
Protect your rating average. We configure your custom review portal and send you a print-ready digital QR standee PDF. Pay a one-time ₹1,999 setup fee. Fully backed by our 7-day refund guarantee.

👉 Comment "AEGIS" below to get your GMB compliance check and start today!

#LocalSEO #GoogleMaps #GMBSEO #BusinessCompliance #CustomerService #LocalBusiness #AegisProtocol #MetrixMedia`,
            controversial: `GMB guidelines say you cannot block bad reviews. But they can't stop you from doing customer service.

If you ignore complaints, you get 1-stars. If you solve complaints in-store, they never go online. 

Aegis Protocol is 100% compliant local GMB optimization because it acts as an immediate resolver.

Control your reputation before Google's bots control you.

🛡️ COMPLIANCE SHIELD:
₹1,999 onboarding. 7-day money-back guarantee.

👉 Comment "AEGIS" to run your rating compliance check.`,
            humorous: `Google Maps says "thou shalt not block reviews." 

We don't block them. We just ask unhappy customers: "Hey, instead of writing an essay on Google, want to talk to the manager and get a free dessert?"

99% of people choose the dessert. 

Aegis Protocol handles the customer relations while building your GMB credit score.

🛡️ PRICE:
₹1,999 setup, backed by a 7-day money-back guarantee.

👉 Comment "AEGIS" and get the dessert routing.`
        }
    },
    {
        id: 8,
        title: "Menu Pricing Power vs Map Rating",
        format: "carousel",
        theme: "brutal-light",
        niche: "cafe",
        day: "Week 3, Wed",
        trigger: "CAFE",
        slides: [
            {
                tag: "PRICING POWER",
                heading: "HOW RATINGS CONTROL YOUR <span class='highlight-green'>PRICING</span>",
                body: "Customers psychologically justify premium pricing based on star ratings. High stars signal elite quality, letting you charge more for the same product.",
                visual: "comparison",
                visualData: {
                    left: { title: "4.8★ Cafe", val: "₹250 Latte", desc: "Premium walks, high profit margins", color: "green" },
                    right: { title: "4.1★ Cafe", val: "₹150 Latte", desc: "Forced to discount to attract diners", color: "red" }
                }
            },
            {
                tag: "THE DISCOUNT TRAP",
                heading: "THE DESTRUCTION OF <span class='highlight-red'>MARGINS</span>",
                body: "When your cafe sits at a 4.1 rating, organic footfall drops. Cafe owners are forced to run constant discount coupons or app promos, destroying profit margins.",
                visual: "grid",
                visualData: [
                    { icon: "fa-solid fa-tags", text: "🏷️ Continuous discount promos" },
                    { icon: "fa-solid fa-arrow-down-long", text: "📉 Shrinking restaurant margins" },
                    { icon: "fa-solid fa-skull", text: "💀 High operating costs, low profit", highlight: "red" }
                ]
            },
            {
                tag: "RATING VS MARGINS",
                heading: "THE STAR-PRICE <span class='highlight-cyan'>CORRELATION</span>",
                body: "Data shows Cafe menu pricing power increases exponentially as star ratings rise. High ratings give you authority.",
                visual: "chart",
                visualData: { curve: "margins", greenLabel: "High Margin Zone", redLabel: "Discount Trap Zone" }
            },
            {
                tag: "MOCKUP COUNTER",
                heading: "AEGIS <span class='highlight-yellow'>COUNTER STAND</span>",
                body: "A custom QR standee placed at checkout. Automatically redirects happy diners to Google Reviews while catching complaints privately.",
                visual: "mockup",
                visualData: { label: "CAFE STANDEE" }
            },
            {
                tag: "MARGIN PROTECTOR",
                heading: "🛡️ PROTECT YOUR <span class='highlight-green'>MENU POWER</span>",
                body: "₹1,999 one-time setup. Custom review portal + print-ready counter standee PDF. 7-day money-back guarantee.",
                visual: "grid",
                visualData: [
                    { icon: "fa-solid fa-coins", text: "💰 Stop slashing menu prices" },
                    { icon: "fa-solid fa-star-half-stroke", text: "⭐ Reach a stable 4.7+ GMB average" },
                    { icon: "fa-solid fa-shield-halved", text: "🛡️ Backed by a 7-day refund guarantee" }
                ]
            }
        ],
        captions: {
            original: `Why is Cafe A charging ₹250 for a latte while you are stuck at ₹150? It's not the beans. It's the GMB score.

When customers see a 4.1 rating, they expect average food and average service. If your menu prices are high, they feel cheated and leave bad reviews. But cafes with a 4.8-star average rating command pricing power. 

Diners assume clinical food preparation and top-tier service. They happily pay premium prices because the social proof justifies the cost.

Protect your margins with the Aegis Protocol.

By placing our custom QR standee at your counter, you make sure happy diners are routed to Google to build your reputation, while keeping disgruntled reviews off the internet.

🛡️ 7-DAY REFUND GUARANTEE:
Get your print-ready digital QR standee PDF and custom review portal configured today for a one-time ₹1,999 setup fee. If you aren't completely satisfied, get a 100% instant refund.

👉 DM us "CAFE" to claim your portal setup and secure your margins!

#GoaEats #RestaurantMarketing #RestaurantBusiness #GoaCafes #LocalSEO #MenuPricing #GMBSEO #AegisProtocol #MetrixMedia`,
            controversial: `Your beans aren't cheap, so why are your lattes priced like convenience store coffee? 

Because at a 4.1 star rating, you don't have the pricing power to charge more. Customers assume your kitchen is second-rate. You slash prices to get tables filled while the 4.8-star cafe next door charges double and is fully booked.

Ratings dictate your menu profit margins. 

Aegis Protocol builds GMB prominence so you can charge what your culinary art is actually worth.

🛡️ MARGIN SHIELD:
₹1,999 setup fee. 7-day money-back guarantee.

👉 DM us "CAFE" to reclaim your premium menu pricing.`,
            humorous: `Cafe A charges ₹250 for an espresso because they have a 4.8-star rating. Diners call it "artisanal extraction."

You charge ₹150 for the exact same beans because you're at 4.1 stars. Diners complain it's "pretentious."

Social proof controls your margins. 

Stop discounting. Get our custom QR counter standee to funnel happy diners to Google.

🛡️ TERMS:
₹1,999 setup. 7-day money-back guarantee.

👉 DM "CAFE" and charge what you're worth.`
        }
    },
    {
        id: 9,
        title: "Confidentiality: Intercepting Complaints",
        format: "reel",
        niche: "clinic",
        day: "Week 3, Fri",
        trigger: "CLINIC",
        coverImg: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&auto=format&fit=crop",
        storyboard: [
            { time: 0, text: "Patient billing issues or front desk bottlenecks..." },
            { time: 3, text: "Do not belong on your public Google page." },
            { time: 6, text: "Aegis redirects patient complaints privately to the director." },
            { time: 9, text: "Maintain medical authority. DM <span class='highlight'>'CLINIC'</span> for our secure setup." }
        ],
        captions: {
            original: `Billing disputes and receptionist bottlenecks don't belong on Google. Keep patient grievances private to maintain clinical trust.

When a client has a dispute about a billing invoice, booking delay, or therapist communication, they want an immediate resolution. If they can't find an easy way to complain, they vent on Google. This exposes administrative bottlenecks to thousands of potential clients.

Aegis Protocol provides a secure, private, and feedback loop.

Our system redirects client grievances to a private clinical manager portal:
👩‍⚕️ Patients scan the QR desk card to submit feedback.
🌟 Satisfied patients go to public Google Reviews.
📩 Grievances go confidential to the manager, allowing you to resolve issues internally and maintain patient privacy.

Maintain professional authority.

🎁 7-DAY RISK-FREE RUN:
We configure your custom clinical portal and deliver your print-ready digital QR standee PDF. Pay a one-time integration fee of ₹2,499. If not satisfied within 7 days, get a full refund.

👉 Comment "CLINIC" below to set up your practice portal today!

#DoctorTrust #GoaClinics #DentalMarketing #PatientExperience #ClinicSEO #LocalSEO #ReputationManagement #AegisProtocol #MetrixMedia`,
            controversial: `A patient with a billing dispute doesn't care about your clinic's rating. They want a refund. 

But if you don't give them a private way to vent, they will write a 1-star review exposing your clinic's billing details to the entire world. Keep clinic drama off GMB maps.

Maintain strict administrative confidentiality.

Aegis Protocol routes scheduling complaints directly to your smartphone.

🛡️ PRACTICE PROTECTOR:
₹2,499 one-time onboarding. 7-day money-back guarantee.

👉 Comment "CLINIC" to secure patient feedback loops.`,
            humorous: `Receptionist got the patient's name wrong, billing machine took 2 minutes to load...

And now there's a 1-star GMB review accusing your clinic of "poor patient data management." 

Keep reception issues off your medical record.

Aegis QR portals let patients submit office complaints privately. You fix the invoice; Google rating remains healthy.

🛡️ CURATIVE:
₹2,499 setup, backed by a 7-day money-back guarantee.

👉 Comment "CLINIC" and heal your GMB.`
        }
    },
    {
        id: 10,
        title: "Delivery Rider Delays vs Kitchen Rating",
        format: "reel",
        niche: "zomato",
        day: "Week 4, Mon",
        trigger: "SWIGGY",
        coverImg: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=600&auto=format&fit=crop",
        storyboard: [
            { time: 0, text: "Third-party delivery riders are late..." },
            { time: 3, text: "Food gets cold, customer rates you 1-star." },
            { time: 6, text: "Swiggy's algorithm demotes your cloud kitchen feed." },
            { time: 9, text: "Stop delivery errors from killing orders. DM <span class='highlight'>'SWIGGY'</span>." }
        ],
        captions: {
            original: `Third-party delivery riders are killing your cloud kitchen rating.

A rider gets lost, the food gets cold, and the customer leaves a 1-star review on Zomato. When your rating falls, the platform pushes your kitchen to the bottom of the feed. Your daily orders bleed.

Aegis Protocol separates delivery issues from kitchen quality:
✅ Happy diners scan and are auto-routed to leave a positive rating on Zomato/Swiggy.
⚠️ Annoyed diners (spilled packaging, delays, cold food) are routed to a private mobile form.

You resolve delivery mistakes privately by issuing refunds or discounts, protecting your feed ranking.

🔥 PROTECT YOUR MEAL REVENUE:
We host your custom portal and design your digital QR bag insert cards. Pay a one-time setup fee of ₹1,999. Fully backed by our 7-day money-back guarantee.

👉 Comment "ZOMATO" to secure your kitchen rating today!

#CloudKitchen #ZomatoSwiggy #FoodDeliveryIndia #GoaFoodDelivery #KitchenOwner #DeliveryMarketing #AegisProtocol #MetrixMedia`,
            controversial: `Your chef didn't burn the biryani. The delivery rider just left it in his rain-soaked bag for an hour.

But the customer rated your cloud kitchen 1-star, and now your restaurant feed is buried on Swiggy and Zomato. You are paying for rider mistakes with your livelihood.

Stop letting delivery logistics kill your restaurant prominence.

Aegis bag inserts keep rider complaints off the delivery apps.

🛡️ DELIVERY SHIELD:
₹1,999 setup. 7-day money-back guarantee.

👉 Comment "SWIGGY" to secure your kitchen order volume.`,
            humorous: `You cook a perfect meal, pack it in heat-insulated foil...

But the Swiggy rider takes a 3-mile detour, serves it cold, and you get review-bombed by Karen. 

Orders drop 60%. Karen is happy. The rider is happy. You are crying in the kitchen.

Intercept the app reviews. 

Place our custom QR feedback card in every box. Cold food complaints go privately to you; happy diners rate you on Swiggy.

🛡️ THE SHIELD:
₹1,999 setup, backed by a 7-day money-back guarantee.

👉 Comment "SWIGGY" and save the cloud kitchen.`
        }
    },
    {
        id: 11,
        title: "Wet Towels & The ₹50,000 Spa Launch",
        format: "carousel",
        theme: "brutal-dark",
        niche: "salon",
        day: "Week 4, Wed",
        trigger: "SALON",
        slides: [
            {
                tag: "LAUNCH DISASTER",
                heading: "HOW A WET TOWEL DESTROYED A <span class='highlight-red'>₹50,000 LAUNCH</span>",
                body: "You spend lakhs on marketing and salon styling stations. Launch week is successful, booking 50+ clients. Then, one minor facility error crashes your prominence.",
                visual: "comparison",
                visualData: {
                    left: { title: "Launch Week", val: "50+ Booked", desc: "High momentum, fully booked", color: "green" },
                    right: { title: "Week 2 Collapse", val: "-50% Inquiries", desc: "After rating drops to 4.1", color: "red" }
                }
            },
            {
                tag: "THE BOTTLENECK",
                heading: "ONE DAMP TOWEL <span class='highlight-red'>1-STAR REVIEW</span>",
                body: "Instead of telling the reception desk, a client gets a slightly damp locker room towel and leaves a scathing Google Maps review.",
                visual: "grid",
                visualData: [
                    { icon: "fa-solid fa-scroll", text: "🧼 Single damp locker room towel" },
                    { icon: "fa-solid fa-comment-slash", text: "🤐 Customer says nothing at reception desk" },
                    { icon: "fa-solid fa-trash-can", text: "🗑️ Leaves a 1-star GMB rating review", highlight: "red" }
                ]
            },
            {
                tag: "REVENUE COLLAPSE",
                heading: "THE WEEK 2 <span class='highlight-cyan'>MOMENTUM CRASH</span>",
                body: "Google's search algorithm demotes your maps listing. New spa clients see the 4.1 rating next to competitors and bookings drop by 50%.",
                visual: "chart",
                visualData: { curve: "bookings", greenLabel: "4.8★ Launch Path", redLabel: "4.1★ Crash Path" }
            },
            {
                tag: "MOCKUP COUNTER",
                heading: "AEGIS reception <span class='highlight-yellow'>STANDEE</span>",
                body: "Custom QR standee sitting at spa checkout counter. Filters unhappy guests to a private direct message; happy guests go to Google Reviews.",
                visual: "mockup",
                visualData: { label: "SPA STANDEE" }
            },
            {
                tag: "LAUNCH PROTECT",
                heading: "🛡️ SECURE YOUR <span class='highlight-green'>MARKETING INVESTMENT</span>",
                body: "₹1,999 one-time setup fee. Digital print-ready standee QR PDF. Backed by a 7-day money-back guarantee.",
                visual: "grid",
                visualData: [
                    { icon: "fa-solid fa-spa", text: "🌸 Protect wellness reputation" },
                    { icon: "fa-solid fa-circle-dollar-to-slot", text: "💰 Stop walk-in revenue leakage" },
                    { icon: "fa-solid fa-arrows-spin", text: "🔄 7-day refund guarantee" }
                ]
            }
        ],
        captions: {
            original: `How a 1-star review about a damp towel ruined a ₹50,000 spa launch.

You spend lakhs on upscale station interiors, hiring top stylists, and advertising. Your launch week is booked out. But one client experiences a minor front-desk wait or gets a damp locker room towel. Instead of telling the desk, they post a 1-star review on Google Maps.

Your rating drops to a 4.1. Google’s search ranking algorithm demotes you, and booking inquiries drop by 50% in Week 2. Your launch momentum is dead.

Don't let minor facility bottlenecks ruin your launch investment.

Aegis Protocol places a clean patient/client feedback QR standee at your checkout counter, routing happy guests to Google Reviews and private complaints to your phone.

🛡️ 7-DAY REFUND GUARANTEE:
Get your print-ready digital QR standee PDF and custom review portal configured today for a one-time ₹1,999 setup fee. Backed by our 7-day money-back guarantee.

👉 DM us "SALON" to set up your portal and protect your bookings today!

#SpaLaunch #GoaSpa #GoaSalon #GymMarketing #FitnessBusiness #LocalSEO #ReputationManagement #AegisProtocol #MetrixMedia`,
            controversial: `One damp towel shouldn't cost you ₹25,000 in lost wellness memberships. 

But Google Maps doesn't know it was just a towel. They only see your GMB rating drop to 4.1 and demote your local ranking visibility. Your launch momentum is dead.

Stop letting minor facility details kill your advertising ROI.

Aegis Protocol checkout QR gates make sure minor facility complaints stay off Google.

🛡️ BRAND SHIELD:
₹1,999 one-time setup. 7-day money-back guarantee.

👉 DM us "SALON" to secure your wellness ratings.`,
            humorous: `Spent ₹50,000 advertising your spa launch, hired expert masseuses, and set up calming zen music...

Only to get a 1-star GMB review because "the locker room towel was slightly damp."

Suddenly GMB bookings drop 50%. The zen music isn't helping.

Let's redirect the towel critiques.

Aegis QR counter standees route happy clients to Google Maps, and damp towel gripes to the manager.

🛡️ DETAILS:
₹1,999 setup. 7-day money-back guarantee.

👉 DM "SALON" and keep the spa ratings dry.`
        }
    },
    {
        id: 12,
        title: "Rescuing a 3.9-Star Product Listing",
        format: "reel",
        niche: "amazon",
        day: "Week 4, Fri",
        trigger: "SELLER",
        coverImg: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop",
        storyboard: [
            { time: 0, text: "Trapped at a 3.9 product rating?" },
            { time: 3, text: "Your Amazon organic ranking is in a death spiral." },
            { time: 6, text: "Aegis redirects shipping defects to private support tickets." },
            { time: 9, text: "Rescue listings compliantly. DM <span class='highlight'>'SELLER'</span> for the portal setup." }
        ],
        captions: {
            original: `Trapped at a 3.9 product rating? Your Amazon listing is in a death spiral.

Your PPC ad costs double, your listing drops off page 1, and your buy-box ownership is hijacked by competitors. Rescue your rank compliantly with the Aegis Seller Shield.

By placing a professional, compliant warranty activation card inside your product packaging:
✅ Delighted buyers scan to activate warranty and are prompted to post reviews.
⚠️ Annoyed buyers (shipping defects, broken parts) go straight to a private support page.

You ship replacements instantly, resolving their issues and keeping negative reviews completely off your listing.

🛡️ 100% PLATFORM COMPLIANT:
We build your warranty registration page and design your digital insert cards. Backed by our 7-day money-back guarantee. Pay a one-time ₹1,999 setup fee.

👉 Comment "SELLER" below to secure your listings and start growing your organic sales today!

#AmazonSeller FBA #FlipkartSeller #MeeshoSeller #EcommerceSEO #OnlineSeller #AegisProtocol #MetrixMedia`,
            controversial: `A 3.9 product rating on Amazon is a slow death. 

Your advertising costs double, you lose buy-box ownership, and competitors hijack your listing. You can't bribe buyers, but you can rescue your ranking legally.

Stop letting carrier damage destroy your listing.

Aegis compliant warranty redirects defective orders to customer support before reviews are posted.

🛡️ LISTING SHIELD:
₹1,999 setup. 7-day money-back guarantee.

👉 Comment "SELLER" to start your compliant recovery.`,
            humorous: `At a 3.9 Amazon rating, you are practically paying people to click your ads and buy from your competitor.

Carrier drops the package, box gets crushed, buyer leaves a 1-star review: "BOX WAS DAMAGED, TERRIBLE SELLER."

You get penalised for the postman's bad day.

Let's fix it legally.

Our warranty inserts redirect shipping and packaging complaints straight to a private replacement desk.

🛡️ TERMS:
₹1,999 onboarding. 7-day money-back guarantee.

👉 Comment "SELLER" and rescue the listing.`
        }
    }
];

let activePostIndex = 0;
let activeSlideIndex = 0;
let activeTone = 'original';
let audioCtx = null;
let audioSources = [];
let audioEnabled = false;
let reelPlaybackInterval = null;
let reelPlaying = false;

function initSocialDashboard() {
    renderJulyCalendarList();
    loadSelectedPost(0);
    setupSocialEventListeners();
}

function renderJulyCalendarList() {
    const listContainer = document.getElementById('calendar-posts-list');
    if (!listContainer) return;
    
    listContainer.innerHTML = '';
    
    julyPosts.forEach((post, idx) => {
        const item = document.createElement('div');
        item.className = `calendar-post-item ${idx === activePostIndex ? 'active' : ''}`;
        item.setAttribute('data-index', idx);
        
        let formatBadge = post.format === 'reel' ? 
            `<span class="post-meta-badge badge-format-reel"><i class="fa-solid fa-video"></i> Reel</span>` :
            `<span class="post-meta-badge badge-format-carousel"><i class="fa-solid fa-images"></i> Carousel</span>`;
            
        let nicheBadge = `<span class="post-meta-badge badge-niche-${post.niche}">${post.niche}</span>`;
        
        item.innerHTML = `
            <div class="post-item-icon">
                <i class="${post.format === 'reel' ? 'fa-solid fa-video' : 'fa-solid fa-images'}"></i>
            </div>
            <div class="post-item-details">
                <div class="post-item-title">${post.title}</div>
                <div class="post-item-meta">
                    ${formatBadge}
                    ${nicheBadge}
                </div>
            </div>
            <div class="post-item-day">${post.day}</div>
        `;
        
        item.addEventListener('click', () => {
            document.querySelectorAll('.calendar-post-item').forEach(el => el.classList.remove('active'));
            item.classList.add('active');
            loadSelectedPost(idx);
        });
        
        listContainer.appendChild(item);
    });
}

function loadSelectedPost(index) {
    activePostIndex = index;
    activeSlideIndex = 0;
    const post = julyPosts[index];
    
    // Stop any running reel playback and sound if post changed
    stopReelPlayback();
    
    // Toggle dashboard action button displays
    const btnExport = document.getElementById('btn-export-slide');
    const btnPlayReel = document.getElementById('btn-play-storyboard');
    
    if (post.format === 'carousel') {
        if (btnExport) btnExport.style.display = 'inline-block';
        if (btnPlayReel) btnPlayReel.style.display = 'none';
        renderCarouselMedia(post);
    } else {
        if (btnExport) btnExport.style.display = 'none';
        if (btnPlayReel) btnPlayReel.style.display = 'inline-block';
        renderReelMedia(post);
    }
    
    updateCaptionControls(post);
    
    if (audioEnabled) {
        startAmbientAudio(post.niche);
    }
}

function updateCaptionControls(post) {
    const textarea = document.getElementById('copy-caption-textarea');
    const igText = document.getElementById('ig-caption-text');
    const toneText = post.captions[activeTone];
    
    if (textarea) textarea.value = toneText;
    if (igText) igText.textContent = toneText;
}

function renderCarouselMedia(post) {
    const contentArea = document.getElementById('instagram-content-area');
    if (!contentArea) return;
    
    contentArea.innerHTML = '';
    
    const deck = document.createElement('div');
    deck.className = 'carousel-deck';
    deck.id = 'active-carousel-deck';
    
    post.slides.forEach((slide, idx) => {
        const slideItem = document.createElement('div');
        slideItem.className = `carousel-slide-item ${idx === 0 ? 'active' : ''}`;
        slideItem.setAttribute('data-slide-index', idx);
        
        // Dynamic HTML visual elements based on theme and visual type
        let visualHTML = '';
        
        let searchBarQuery = "BEST LOCAL BUSINESS";
        let clientNameVal = "MY BUSINESS";
        let badReviewTextVal = "FRICTION IN SERVICE. UNRESOLVED COMPLAINTS.";
        let goodReviewTextVal = "SUPER FRICTIONLESS. HIGHLY RECOMMENDED!";
        let badUser = "ANONYMOUS";
        let goodUser = "CUSTOMER";
        let chatInText = "NOT HAPPY WITH THE SPEED OF MY SERVICE TODAY. ⚠️";
        let chatOutText = "WE APOLOGIZE FOR THE DELAY. RESOLVING THIS IMMEDIATELY.";

        const niche = post.niche || 'aegis';
        if (niche === 'cafe') {
            searchBarQuery = "BEST CAFE NEAR ME";
            clientNameVal = "THE GOURMET CAFE";
            badReviewTextVal = "COLD COFFEE. SLOW SERVICE.";
            goodReviewTextVal = "GREAT ESPRESSO. FRIENDLY STAFF.";
            badUser = "SURESH M.";
            goodUser = "PRIYA R.";
            chatInText = "MY CAPPUCCINO WAS COLD AND WAIT WAS 20 MINS! 😡";
            chatOutText = "SO SORRY! WE JUST PROCESSED A REFUND AND A FREE VOUCHER. 🙏";
        } else if (niche === 'clinic') {
            searchBarQuery = "DENTIST IN GOA";
            clientNameVal = "METRIX DENTAL CLINIC";
            badReviewTextVal = "LONG WAITING. RUDE FRONT DESK.";
            goodReviewTextVal = "TOP CLINICAL CARE. HELPFUL TEAM.";
            badUser = "RAHUL V.";
            goodUser = "AMIT S.";
            chatInText = "WAITING ROOM WAS FREEZING AND BILLING WAS DELAYED. 🥶";
            chatOutText = "APOLOGIES! WE ADJUSTED THE THERMOSTAT AND SPED UP YOUR PAPERWORK.";
        } else if (niche === 'salon' || niche === 'gym') {
            searchBarQuery = "LUXURY SALON GOA";
            clientNameVal = "ELITE SALON & SPA";
            badReviewTextVal = "DAMP LOCKER ROOM TOWEL. DIRTY.";
            goodReviewTextVal = "ELITE EQUIPMENT. CLEAN SPACE.";
            badUser = "VIKRAM S.";
            goodUser = "NEHA P.";
            chatInText = "LOCKER ROOM SOAP WAS EMPTY AND TOWELS DAMP. 😤";
            chatOutText = "THANKS FOR REPORTING. REFILLED SOAP AND REPLACED TOWELS IMMEDIATELY!";
        } else if (niche === 'amazon' || niche === 'seller' || niche === 'zomato' || niche === 'swiggy') {
            searchBarQuery = "BEST FOOD DELIVERY";
            clientNameVal = "THE GOURMET KITCHEN";
            badReviewTextVal = "CRUSHED PACKAGING. DEFECTIVE UNIT.";
            goodReviewTextVal = "FAST DELIVERY. EASY WARRANTY REG.";
            badUser = "BUYER 404";
            goodUser = "VERIFIED BUYER";
            chatInText = "PRODUCT BOX ARRIVED DAMAGED, ITEM IS DEFECTIVE. 📦";
            chatOutText = "VERY SORRY. A REPLACEMENT HAS BEEN SHIPPED VIA EXPRESS DELIVERY.";
            if (niche === 'zomato' || niche === 'swiggy') {
                badReviewTextVal = "SPILLED CURRY. COLD PACKAGING.";
                goodReviewTextVal = "HOT DELICIOUS FOOD. NEAT PACKING.";
                chatInText = "DELIVERY WAS LATE AND GRAVY WAS SPILLED ALL OVER! 😡";
                chatOutText = "APOLOGIES FOR THE MESS! A REFUND HAS BEEN ISSUED TO YOUR WALLET. 🛡️";
            }
        }

        if (post.theme === 'brutal-light' || post.theme === 'brutal-dark') {
            if (slide.visual === 'mockup') {
                visualHTML = `
                    <div class="mock-graphics-container">
                        <div class="phone-scan-mockup">
                            <div class="qr-stand-graphic">
                                <div class="qr-stand-header">REVIEWS</div>
                                <div class="qr-stand-code-img"><i class="fa-solid fa-qrcode"></i></div>
                                <div class="qr-stand-stars-row">
                                    <i class="fa-solid fa-star"></i>
                                    <i class="fa-solid fa-star"></i>
                                    <i class="fa-solid fa-star"></i>
                                    <i class="fa-solid fa-star"></i>
                                    <i class="fa-solid fa-star"></i>
                                </div>
                            </div>
                            <div class="phone-screen-graphic">
                                <div class="phone-notch-graphic"></div>
                                <div class="phone-portal-logo">${slide.visualData?.label || 'AEGIS'}</div>
                                <div class="phone-portal-stars">
                                    <i class="fa-solid fa-star"></i>
                                    <i class="fa-solid fa-star"></i>
                                    <i class="fa-solid fa-star"></i>
                                    <i class="fa-solid fa-star"></i>
                                    <i class="fa-solid fa-star"></i>
                                </div>
                                <div class="phone-portal-btn">SUBMIT</div>
                            </div>
                        </div>
                    </div>
                `;
            } else if (slide.visual === 'comparison') {
                visualHTML = `
                    <div class="mock-graphics-container">
                        <div class="review-cards-mockup">
                            <div class="mock-review-card red-border">
                                <div class="mock-review-user">
                                    <div class="mock-review-avatar red"></div>
                                    <div class="mock-review-name">${badUser}</div>
                                </div>
                                <div class="mock-review-stars">★☆☆☆☆</div>
                                <div class="mock-review-text">${badReviewTextVal}</div>
                            </div>
                            <div class="mock-review-card green-border">
                                <div class="mock-review-user">
                                    <div class="mock-review-avatar green"></div>
                                    <div class="mock-review-name">${goodUser}</div>
                                </div>
                                <div class="mock-review-stars">★★★★★</div>
                                <div class="mock-review-text">${goodReviewTextVal}</div>
                            </div>
                        </div>
                    </div>
                `;
            } else if (slide.visual === 'split-path') {
                visualHTML = `
                    <div class="mock-graphics-container">
                        <div class="routing-flow-mockup">
                            <div class="flow-target-box green-border">
                                <div class="flow-target-icon green"><i class="fa-solid fa-star"></i></div>
                                <div class="flow-target-label">PUBLIC 5★ REVIEW</div>
                            </div>
                            <div class="flow-path-arrow green-path" style="transform: rotate(180deg);"></div>
                            <div class="flow-center-qr">
                                <i class="fa-solid fa-qrcode"></i>
                            </div>
                            <div class="flow-path-arrow blue-path"></div>
                            <div class="flow-target-box blue-border">
                                <div class="flow-target-icon blue"><i class="fa-solid fa-comment-dots"></i></div>
                                <div class="flow-target-label">PRIVATE FEEDBACK</div>
                            </div>
                        </div>
                    </div>
                `;
            } else if (slide.visual === 'grid') {
                const isChat = (idx === 3 || (slide.body && (slide.body.toLowerCase().includes('private') || slide.body.toLowerCase().includes(' grievances') || slide.body.toLowerCase().includes('grievance') || slide.body.toLowerCase().includes('messaging'))));
                if (isChat) {
                    visualHTML = `
                        <div class="mock-graphics-container">
                            <div class="chat-mockup-container">
                                <div class="chat-mockup-header">
                                    <div class="chat-header-avatar"></div>
                                    <div class="chat-header-name">PRIVATE FEEDBACK CHANNEL</div>
                                </div>
                                <div class="chat-message-bubble incoming">
                                    ${chatInText}
                                </div>
                                <div class="chat-message-bubble outgoing">
                                    ${chatOutText}
                                </div>
                            </div>
                        </div>
                    `;
                } else {
                    let itemsHTML = '';
                    slide.visualData.forEach((item, i) => {
                        if (post.theme === 'brutal-light') {
                            itemsHTML += `
                                <div class="brutal-grid-item">
                                    <i class="${item.icon} ${item.highlight ? 'green' : 'cyan'}"></i>
                                    <span>${item.text}</span>
                                </div>
                            `;
                        } else {
                            itemsHTML += `
                                <div class="brutal-dark-list-item ${i === 0 ? 'gold' : ''}">
                                    <div class="brutal-dark-list-content">
                                        <span class="brutal-dark-list-icon"><i class="${item.icon}"></i></span>
                                        <span>${item.text.replace(/^[^\w]*/, '')}</span>
                                    </div>
                                    <span class="brutal-dark-list-num">0${i + 1}</span>
                                </div>
                            `;
                        }
                    });
                    visualHTML = post.theme === 'brutal-light' ? 
                        `<div class="brutal-grid-box">${itemsHTML}</div>` : 
                        `<div class="brutal-dark-list-box">${itemsHTML}</div>`;
                }
            } else if (slide.visual === 'chart') {
                const is3Pack = (idx === 4 || (slide.body && slide.body.toLowerCase().includes('3-pack')) || (slide.heading && slide.heading.toLowerCase().includes('prominence')) || (slide.heading && slide.heading.toLowerCase().includes('3-pack')));
                if (is3Pack) {
                    visualHTML = `
                        <div class="mock-graphics-container">
                            <div class="maps-3pack-mockup">
                                <div class="mock-search-bar">
                                    <i class="fa-solid fa-magnifying-glass"></i>
                                    <span>${searchBarQuery}</span>
                                </div>
                                <div class="mock-pack-item featured">
                                    <div class="mock-pack-info">
                                        <div class="mock-pack-title">1. ${clientNameVal}</div>
                                        <div class="mock-pack-rating">
                                            4.8 <span class="stars">★★★★★</span> (240+)
                                        </div>
                                    </div>
                                    <div class="mock-pack-badge">Shield Active</div>
                                </div>
                                <div class="mock-pack-item">
                                    <div class="mock-pack-info">
                                        <div class="mock-pack-title">2. Competitor A</div>
                                        <div class="mock-pack-rating">
                                            4.1 <span class="stars">★★★★☆</span> (85)
                                        </div>
                                    </div>
                                </div>
                                <div class="mock-pack-item">
                                    <div class="mock-pack-info">
                                        <div class="mock-pack-title">3. Competitor B</div>
                                        <div class="mock-pack-rating">
                                            3.9 <span class="stars">★★★☆☆</span> (110)
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                } else {
                    if (post.theme === 'brutal-light') {
                        let labelRed = slide.visualData?.redLabel || "4.1★ Danger";
                        let labelGreen = slide.visualData?.greenLabel || "4.7★ Aegis";
                        visualHTML = `
                            <div class="brutal-chart-box">
                                <div class="brutal-chart-bar-container">
                                    <div class="brutal-chart-bar red" style="height: 35%;">${labelRed}</div>
                                    <div class="brutal-chart-bar green" style="height: 85%;">${labelGreen}</div>
                                </div>
                            </div>
                        `;
                    } else {
                        let labelRed = slide.visualData?.redLabel || "Danger Zone";
                        let labelGreen = slide.visualData?.greenLabel || "Aegis Zone";
                        visualHTML = `
                            <div class="brutal-dark-chart">
                                <svg class="brutal-dark-chart-svg" viewBox="0 0 100 50" preserveAspectRatio="none">
                                    <path d="M 0 42 L 30 38 L 60 22 L 100 5" fill="none" stroke="#0ea5e9" stroke-width="3" />
                                </svg>
                                <span class="brutal-dark-chart-label" style="top: 2px; right: 5px; color: #10b981;">${labelGreen}</span>
                                <span class="brutal-dark-chart-label" style="bottom: 2px; left: 5px; color: #ef4444;">${labelRed}</span>
                            </div>
                        `;
                    }
                }
            }
        } else {
            if (slide.visual === 'comparison' && slide.visualData) {
                const data = slide.visualData;
                visualHTML = `
                    <div class="comparison-layout">
                        <div class="comparison-card ${data.left.color}">
                            <div class="comparison-title">${data.left.title}</div>
                            <div class="comparison-value ${data.left.color}">${data.left.val}</div>
                            <div class="comparison-desc">${data.left.desc}</div>
                        </div>
                        <div class="comparison-card ${data.right.color}">
                            <div class="comparison-title">${data.right.title}</div>
                            <div class="comparison-value ${data.right.color}">${data.right.val}</div>
                            <div class="comparison-desc">${data.right.desc}</div>
                        </div>
                    </div>
                `;
            } else if (slide.visual === 'grid' && slide.visualData) {
                let itemsHTML = '';
                slide.visualData.forEach(item => {
                    itemsHTML += `
                        <div class="slide-grid-item">
                            <i class="${item.icon} ${item.highlight ? 'green' : 'cyan'}"></i>
                            <span>${item.text}</span>
                        </div>
                    `;
                });
                visualHTML = `<div class="slide-grid-box">${itemsHTML}</div>`;
            } else if (slide.visual === 'chart') {
                visualHTML = `
                    <div class="chart-visual-box">
                        <div class="chart-curve-green"></div>
                        <div class="chart-curve-red"></div>
                        <span class="chart-label" style="top: 5px; left: 10px; color: #00FF87;">${slide.visualData.greenLabel}</span>
                        <span class="chart-label" style="bottom: 12px; right: 10px; color: #FF3366;">${slide.visualData.redLabel}</span>
                    </div>
                `;
            } else if (slide.visual === 'mockup' && slide.visualData) {
                visualHTML = `
                    <div class="mockup-standee-container">
                        <div class="mockup-standee-graphic">
                            <div class="mock-brand-lbl">METRIX</div>
                            <div class="mock-qr-code"><div class="mock-qr-img"></div></div>
                            <div class="mock-brand-lbl" style="font-size: 0.32rem;">AEGIS PROTOCOL</div>
                        </div>
                    </div>
                `;
            } else if (slide.visual === 'split-path' && slide.visualData) {
                const data = slide.visualData;
                visualHTML = `
                    <div class="split-path-box">
                        <div class="split-node">${data.start}</div>
                        <div class="split-arrow green"></div>
                        <div class="split-node" style="border-color: #00FF87;">${data.node1}</div>
                    </div>
                    <div class="split-path-box" style="margin-top: 0.25rem;">
                        <div class="split-node" style="opacity: 0;">${data.start}</div>
                        <div class="split-arrow red"></div>
                        <div class="split-node" style="border-color: #FF3366;">${data.node2}</div>
                    </div>
                `;
            }
        }
        
        if (post.theme === 'brutal-light') {
            let badgeHTML = '';
            if (idx === 0) {
                badgeHTML = `<div class="brutal-paper-badge">THIS ONE'S WORTH <span class="purple-block">10 MINUTES</span> OF YOUR DAY.</div>`;
            } else if (idx === post.slides.length - 1) {
                badgeHTML = `<div class="brutal-paper-badge">DM <span class="purple-block">'${post.trigger || "AEGIS"}'</span> TO GET SECURED.</div>`;
            } else {
                badgeHTML = `<div class="brutal-paper-badge">SWIPE TO SEE STEP 0${idx + 1} &gt;&gt;&gt;</div>`;
            }
            
            slideItem.innerHTML = `
                <div class="slide-canvas slide-bg-brutal-light" id="slide-canvas-item-${idx}">
                    <div class="brutal-card-light">
                        <div class="brutal-card-tab">
                            <i class="fa-solid fa-chevron-right"></i><i class="fa-solid fa-chevron-right"></i><i class="fa-solid fa-chevron-right"></i>
                        </div>
                        <div class="brutal-tag-light">${slide.tag}</div>
                        <div class="brutal-heading-light">${slide.heading}</div>
                        ${visualHTML}
                        <div class="brutal-body-light">${slide.body}</div>
                    </div>
                    ${badgeHTML}
                </div>
            `;
        } else if (post.theme === 'brutal-dark') {
            let hazardHTML = '';
            if (idx === 0) {
                hazardHTML = `<div class="brutal-hazard-right"></div>`;
            } else if (idx === 1) {
                hazardHTML = `<div class="brutal-hazard-top"></div>`;
            } else if (idx === 2) {
                hazardHTML = `<div class="brutal-hazard-top"></div><div class="brutal-hazard-bottom"></div>`;
            } else if (idx === 3) {
                hazardHTML = `<div class="brutal-hazard-bottom"></div>`;
            } else {
                hazardHTML = `<div class="brutal-hazard-right"></div>`;
            }

            slideItem.innerHTML = `
                <div class="slide-canvas slide-bg-brutal-dark" id="slide-canvas-item-${idx}">
                    <div class="brutal-dark-splatter"></div>
                    ${hazardHTML}
                    <div class="brutal-dark-outline-bg-text">${post.trigger || 'AEGIS'}</div>
                    <div class="brutal-dark-slide-number">0${idx + 1}</div>
                    <div class="brutal-dark-content-wrapper">
                        <div class="brutal-heading-dark">${slide.heading}</div>
                        ${visualHTML}
                        <div class="brutal-body-dark">${slide.body}</div>
                    </div>
                </div>
            `;
        } else {
            slideItem.innerHTML = `
                <div class="slide-canvas slide-bg-default" id="slide-canvas-item-${idx}">
                    <div class="slide-glow-blob-1"></div>
                    <div class="slide-glow-blob-2"></div>
                    <div class="slide-content-wrapper">
                        <div class="slide-tag">${slide.tag}</div>
                        <div class="slide-heading">${slide.heading}</div>
                        ${visualHTML}
                        <div class="slide-body-box">${slide.body}</div>
                        <div class="slide-footer-row">
                            <span class="slide-footer-brand">METRIX MEDIA</span>
                            <span class="slide-footer-btn">AEGIS PROTOCOL</span>
                        </div>
                    </div>
                </div>
            `;
        }
        
        deck.appendChild(slideItem);
    });
    
    deck.innerHTML += `
        <div class="ig-arrow-btn left-arrow" id="carousel-prev-btn"><i class="fa-solid fa-chevron-left"></i></div>
        <div class="ig-arrow-btn right-arrow" id="carousel-next-btn"><i class="fa-solid fa-chevron-right"></i></div>
    `;
    
    contentArea.appendChild(deck);
    renderSlideDots(post.slides.length);
    
    document.getElementById('carousel-prev-btn').addEventListener('click', () => navigateSlides(-1));
    document.getElementById('carousel-next-btn').addEventListener('click', () => navigateSlides(1));
}

function renderSlideDots(count) {
    const dotsContainer = document.getElementById('ig-dots-indicator');
    if (!dotsContainer) return;
    
    dotsContainer.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const dot = document.createElement('div');
        dot.className = `ig-dot ${i === 0 ? 'active' : ''}`;
        dot.setAttribute('data-dot-index', i);
        dotsContainer.appendChild(dot);
    }
}

function navigateSlides(direction) {
    const post = julyPosts[activePostIndex];
    if (post.format !== 'carousel') return;
    
    let newIndex = activeSlideIndex + direction;
    if (newIndex < 0) newIndex = post.slides.length - 1;
    if (newIndex >= post.slides.length) newIndex = 0;
    
    activeSlideIndex = newIndex;
    
    // Update active slides
    document.querySelectorAll('.carousel-slide-item').forEach((slide, idx) => {
        if (idx === activeSlideIndex) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });
    
    // Update active dots
    document.querySelectorAll('.ig-dot').forEach((dot, idx) => {
        if (idx === activeSlideIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function renderReelMedia(post) {
    const contentArea = document.getElementById('instagram-content-area');
    if (!contentArea) return;
    
    contentArea.innerHTML = '';
    
    const container = document.createElement('div');
    container.className = 'reel-storyboard-deck';
    container.id = 'active-reel-deck';
    
    container.innerHTML = `
        <div class="reel-cover-img" id="reel-cover-img" style="background-image: url('${post.coverImg}');"></div>
        <div class="reel-play-hud" id="reel-play-hud">
            <i class="fa-solid fa-play"></i>
        </div>
        <div class="reel-overlay-text" id="reel-overlay-text"></div>
    `;
    
    contentArea.appendChild(container);
    
    // Bind click to start/stop playback
    document.getElementById('reel-play-hud').addEventListener('click', toggleReelPlayback);
    document.getElementById('reel-cover-img').addEventListener('click', toggleReelPlayback);
    
    // Empty dots indicator for Reels
    const dotsContainer = document.getElementById('ig-dots-indicator');
    if (dotsContainer) dotsContainer.innerHTML = '';
}

function toggleReelPlayback() {
    if (reelPlaying) {
        stopReelPlayback();
    } else {
        startReelPlayback();
    }
}

function startReelPlayback() {
    const post = julyPosts[activePostIndex];
    if (post.format !== 'reel') return;
    
    reelPlaying = true;
    
    const cover = document.getElementById('reel-cover-img');
    const hud = document.getElementById('reel-play-hud');
    const overlay = document.getElementById('reel-overlay-text');
    const playBtnHeader = document.getElementById('btn-play-storyboard');
    
    if (cover) cover.classList.add('playing');
    if (hud) hud.innerHTML = '<i class="fa-solid fa-pause"></i>';
    if (playBtnHeader) playBtnHeader.innerHTML = '<i class="fa-solid fa-pause"></i> Pause Reel';
    
    let currentCueIdx = 0;
    
    function playCue() {
        if (!reelPlaying) return;
        const cue = post.storyboard[currentCueIdx];
        if (!cue) {
            // End of storyboard, loop back
            currentCueIdx = 0;
            playCue();
            return;
        }
        
        if (overlay) {
            overlay.innerHTML = cue.text;
            overlay.classList.add('active');
        }
        
        setTimeout(() => {
            if (!reelPlaying) return;
            if (overlay) overlay.classList.remove('active');
            
            setTimeout(() => {
                if (!reelPlaying) return;
                currentCueIdx++;
                playCue();
            }, 600); // fade out duration
        }, 2200); // show duration
    }
    
    playCue();
    
    if (audioEnabled) {
        startAmbientAudio(post.niche);
    }
}

function stopReelPlayback() {
    reelPlaying = false;
    
    const cover = document.getElementById('reel-cover-img');
    const hud = document.getElementById('reel-play-hud');
    const overlay = document.getElementById('reel-overlay-text');
    const playBtnHeader = document.getElementById('btn-play-storyboard');
    
    if (cover) cover.classList.remove('playing');
    if (hud) hud.innerHTML = '<i class="fa-solid fa-play"></i>';
    if (playBtnHeader) playBtnHeader.innerHTML = '<i class="fa-solid fa-play"></i> Play Reel';
    if (overlay) {
        overlay.classList.remove('active');
        overlay.innerHTML = '';
    }
    
    stopAmbientAudio();
}

function setupSocialEventListeners() {
    // 1. Calendar Niche Filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            filterCalendarPosts(filter);
        });
    });
    
    // 2. Copywriting Tone Selector
    document.querySelectorAll('.tone-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tone-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            activeTone = btn.getAttribute('data-tone');
            updateCaptionControls(julyPosts[activePostIndex]);
        });
    });
    
    // 3. Audio Toggle Button
    const btnAudio = document.getElementById('btn-toggle-audio');
    if (btnAudio) {
        btnAudio.addEventListener('click', () => {
            audioEnabled = !audioEnabled;
            btnAudio.classList.toggle('active', audioEnabled);
            
            if (audioEnabled) {
                btnAudio.innerHTML = '<i class="fa-solid fa-volume-high"></i> Ambient Audio: On';
                startAmbientAudio(julyPosts[activePostIndex].niche);
            } else {
                btnAudio.innerHTML = '<i class="fa-solid fa-volume-xmark"></i> Ambient Audio: Off';
                stopAmbientAudio();
            }
        });
    }
    
    // 4. Header Play Reel Button
    const btnPlayReel = document.getElementById('btn-play-storyboard');
    if (btnPlayReel) {
        btnPlayReel.addEventListener('click', () => {
            toggleReelPlayback();
        });
    }
    
    // 5. Header Export Slide Button
    const btnExport = document.getElementById('btn-export-slide');
    if (btnExport) {
        btnExport.addEventListener('click', () => {
            exportCurrentSlide();
        });
    }
    
    // 6. Copy Caption Button
    const btnCopy = document.getElementById('btn-copy-caption');
    if (btnCopy) {
        btnCopy.addEventListener('click', () => {
            const textarea = document.getElementById('copy-caption-textarea');
            if (textarea) {
                textarea.select();
                textarea.setSelectionRange(0, 99999);
                navigator.clipboard.writeText(textarea.value)
                    .then(() => {
                        showToast('Caption copied to clipboard!');
                    })
                    .catch(() => {
                        showToast('Failed to copy caption.');
                    });
            }
        });
    }
}

function filterCalendarPosts(filter) {
    document.querySelectorAll('.calendar-post-item').forEach(item => {
        const idx = parseInt(item.getAttribute('data-index'));
        const post = julyPosts[idx];
        
        if (filter === 'all' || post.format === filter) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

function exportCurrentSlide() {
    const post = julyPosts[activePostIndex];
    if (post.format !== 'carousel') return;
    
    const slideNode = document.getElementById(`slide-canvas-item-${activeSlideIndex}`);
    if (!slideNode) return;
    
    showToast('Generating high-res PNG...');
    
    // Set explicit size for export block to guarantee perfect 1080x1080 resolution
    const exportWrapper = document.createElement('div');
    exportWrapper.style.position = 'absolute';
    exportWrapper.style.top = '-9999px';
    exportWrapper.style.width = '1080px';
    exportWrapper.style.height = '1080px';
    exportWrapper.style.overflow = 'hidden';
    
    const clonedNode = slideNode.cloneNode(true);
    clonedNode.classList.add('export-active');
    clonedNode.style.width = '1080px';
    clonedNode.style.height = '1080px';
    clonedNode.style.padding = '5.5rem';
    
    // Scale up typography size inside cloned node for high-res layout
    const tag = clonedNode.querySelector('.slide-tag');
    if (tag) {
        tag.style.fontSize = '2rem';
        tag.style.letterSpacing = '6px';
    }
    const heading = clonedNode.querySelector('.slide-heading');
    if (heading) heading.style.fontSize = '3.8rem';
    
    const bodyBox = clonedNode.querySelector('.slide-body-box');
    if (bodyBox) {
        bodyBox.style.fontSize = '2.4rem';
        bodyBox.style.padding = '2.5rem';
        bodyBox.style.borderRadius = '24px';
    }
    
    const footer = clonedNode.querySelector('.slide-footer-row');
    if (footer) {
        footer.style.fontSize = '2rem';
        footer.style.paddingTop = '1.5rem';
    }
    
    const footerBtn = clonedNode.querySelector('.slide-footer-btn');
    if (footerBtn) {
        footerBtn.style.fontSize = '1.8rem';
        footerBtn.style.padding = '0.6rem 1.5rem';
        footerBtn.style.borderRadius = '10px';
    }
    
    const comparisonCards = clonedNode.querySelectorAll('.comparison-card');
    comparisonCards.forEach(card => {
        card.style.padding = '1.5rem';
        card.style.borderRadius = '18px';
    });
    
    const compTitles = clonedNode.querySelectorAll('.comparison-title');
    compTitles.forEach(t => t.style.fontSize = '1.8rem');
    
    const compVals = clonedNode.querySelectorAll('.comparison-value');
    compVals.forEach(v => v.style.fontSize = '2.8rem');
    
    const compDescs = clonedNode.querySelectorAll('.comparison-desc');
    compDescs.forEach(d => d.style.fontSize = '1.8rem');
    
    const gridItems = clonedNode.querySelectorAll('.slide-grid-item');
    gridItems.forEach(item => {
        item.style.padding = '1.2rem 1.8rem';
        item.style.borderRadius = '16px';
        item.style.fontSize = '2.2rem';
        item.style.gap = '1.5rem';
        const icon = item.querySelector('i');
        if (icon) icon.style.fontSize = '2.8rem';
    });
    
    const gridBox = clonedNode.querySelector('.slide-grid-box');
    if (gridBox) gridBox.style.gap = '1.2rem';
    
    const chart = clonedNode.querySelector('.chart-visual-box');
    if (chart) {
        chart.style.height = '240px';
        chart.style.borderWidth = '4px';
        const curves = chart.querySelectorAll('div');
        curves.forEach(c => c.style.borderWidth = '8px');
        const labels = chart.querySelectorAll('.chart-label');
        labels.forEach(l => l.style.fontSize = '1.8rem');
    }
    
    const splitBoxes = clonedNode.querySelectorAll('.split-path-box');
    splitBoxes.forEach(box => {
        box.style.margin = '1.5rem 0';
    });
    
    const splitNodes = clonedNode.querySelectorAll('.split-node');
    splitNodes.forEach(node => {
        node.style.padding = '1.2rem 1.8rem';
        node.style.borderRadius = '16px';
        node.style.fontSize = '1.8rem';
    });
    
    const splitArrows = clonedNode.querySelectorAll('.split-arrow');
    splitArrows.forEach(arrow => {
        arrow.style.height = '4px';
        // Mock dynamic border scaling via custom properties if needed
    });
    
    const mockupContainer = clonedNode.querySelector('.mockup-standee-container');
    if (mockupContainer) mockupContainer.style.height = '360px';
    
    const mockupGraphic = clonedNode.querySelector('.mockup-standee-graphic');
    if (mockupGraphic) {
        mockupGraphic.style.width = '210px';
        mockupGraphic.style.height = '270px';
        mockupGraphic.style.borderWidth = '8px';
        mockupGraphic.style.borderRadius = '18px';
        mockupGraphic.style.padding = '1rem';
        const qr = mockupGraphic.querySelector('.mock-qr-code');
        if (qr) {
            qr.style.width = '120px';
            qr.style.height = '120px';
        }
        const lbls = mockupGraphic.querySelectorAll('.mock-brand-lbl');
        lbls.forEach(lbl => lbl.style.fontSize = '1.2rem');
    }
    
    const blobs = clonedNode.querySelectorAll('.slide-glow-blob-1, .slide-glow-blob-2');
    blobs.forEach(b => {
        b.style.width = '450px';
        b.style.height = '450px';
        b.style.filter = 'blur(150px)';
    });
    
    exportWrapper.appendChild(clonedNode);
    document.body.appendChild(exportWrapper);
    
    html2canvas(clonedNode, {
        width: 1080,
        height: 1080,
        backgroundColor: null,
        scale: 1,
        useCORS: true
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `post${post.id}_slide${activeSlideIndex + 1}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        document.body.removeChild(exportWrapper);
        showToast('Slide exported successfully!');
    }).catch(err => {
        console.error(err);
        document.body.removeChild(exportWrapper);
        showToast('Export failed. Try again.');
    });
}

// ----------------------------------------------------
// Web Audio Synth Loops
// ----------------------------------------------------

function stopAmbientAudio() {
    audioSources.forEach(src => {
        try { src.stop(); } catch(e) {}
    });
    audioSources = [];
}

function startAmbientAudio(niche) {
    stopAmbientAudio();
    
    // Create audio context on user interaction safely
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    
    if (niche === 'cafe' || niche === 'zomato') {
        // Cafe chatter hum: Low rumble + clinks + steam
        let rumble = createRumbleNode(120, 20);
        rumble.connect(audioCtx.destination);
        audioSources.push(rumble);
        
        let clinkInterval = setInterval(() => {
            if (audioSources.length === 0) { clearInterval(clinkInterval); return; }
            playClink();
        }, 2200);
        audioSources.push({ stop: () => { clearInterval(clinkInterval); } });
    } else if (niche === 'clinic') {
        // Clinic hum: low frequency sine + beeps
        let hum = createOscillatorNode('sine', 90, 0.04);
        hum.connect(audioCtx.destination);
        audioSources.push(hum);
        
        let beepInterval = setInterval(() => {
            if (audioSources.length === 0) { clearInterval(beepInterval); return; }
            playBeep();
        }, 4000);
        audioSources.push({ stop: () => { clearInterval(beepInterval); } });
    } else if (niche === 'salon' || niche === 'aegis') {
        // Spa/salon: soothing wind / resonant sweeps
        let pad = createWindNode();
        pad.connect(audioCtx.destination);
        audioSources.push(pad);
    } else if (niche === 'amazon') {
        // Ecommerce: random keyboard clicks
        let keyboardInterval = setInterval(() => {
            if (audioSources.length === 0) { clearInterval(keyboardInterval); return; }
            if (Math.random() > 0.3) playKeyClick();
        }, 250);
        audioSources.push({ stop: () => { clearInterval(keyboardInterval); } });
    }
}

function createRumbleNode(freq, q) {
    let bufferSize = 2 * audioCtx.sampleRate;
    let noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    let output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }
    
    let whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;
    
    let filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq, audioCtx.currentTime);
    filter.Q.setValueAtTime(q, audioCtx.currentTime);
    
    let gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
    
    whiteNoise.connect(filter);
    filter.connect(gain);
    
    whiteNoise.start();
    return {
        stop: () => {
            whiteNoise.stop();
        },
        connect: (dest) => {
            gain.connect(dest);
        }
    };
}

function playClink() {
    if (!audioCtx || audioCtx.state === 'suspended') return;
    let osc = audioCtx.createOscillator();
    let gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400 + Math.random() * 800, audioCtx.currentTime);
    
    gain.gain.setValueAtTime(0.012, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.12);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.12);
}

function playBeep() {
    if (!audioCtx || audioCtx.state === 'suspended') return;
    let osc = audioCtx.createOscillator();
    let gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, audioCtx.currentTime);
    
    gain.gain.setValueAtTime(0.012, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.08);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.08);
}

function createOscillatorNode(type, freq, vol) {
    let osc = audioCtx.createOscillator();
    let gain = audioCtx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    
    osc.connect(gain);
    osc.start();
    
    return {
        stop: () => { osc.stop(); },
        connect: (dest) => { gain.connect(dest); }
    };
}

function createWindNode() {
    let bufferSize = 2 * audioCtx.sampleRate;
    let noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    let output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }
    
    let whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;
    
    let filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(350, audioCtx.currentTime);
    filter.Q.setValueAtTime(1.5, audioCtx.currentTime);
    
    let osc = audioCtx.createOscillator();
    osc.frequency.setValueAtTime(0.12, audioCtx.currentTime); // LFO sweep rate
    let oscGain = audioCtx.createGain();
    oscGain.gain.setValueAtTime(180, audioCtx.currentTime); // Sweep depth
    
    osc.connect(oscGain);
    oscGain.connect(filter.frequency);
    
    let gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
    
    whiteNoise.connect(filter);
    filter.connect(gain);
    
    whiteNoise.start();
    osc.start();
    
    return {
        stop: () => {
            whiteNoise.stop();
            osc.stop();
        },
        connect: (dest) => {
            gain.connect(dest);
        }
    };
}

function playKeyClick() {
    if (!audioCtx || audioCtx.state === 'suspended') return;
    let osc = audioCtx.createOscillator();
    let gain = audioCtx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(90 + Math.random() * 60, audioCtx.currentTime);
    
    gain.gain.setValueAtTime(0.012, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.025);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.025);
}


});
