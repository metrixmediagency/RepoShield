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
    // Real-Time Simulator Input Syncing & Segment Handling
    // ----------------------------------------------------
    const bizNameInput = document.getElementById('biz-name');
    const bizGmbInput = document.getElementById('biz-gmb');
    const ecommerceTierInput = document.getElementById('ecommerce-tier');
    const productTierGroup = document.getElementById('product-tier-group');
    const bizAccentInput = document.getElementById('biz-accent');
    const bizAccentHexInput = document.getElementById('biz-accent-hex');
    const bizCategorySelect = document.getElementById('biz-category');
    const bizEmailInput = document.getElementById('biz-email');
    const bizLogoInput = document.getElementById('biz-logo');
    const bizBaseUrlInput = document.getElementById('biz-base-url');
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

    function updateSimulators() {
        const name = bizNameInput.value || (activeCampaignType === 'ecommerce' ? 'Your Product Name' : 'Your Business Name');
        const accent = bizAccentInput.value;
        const category = bizCategorySelect.value;
        const logo = bizLogoInput.value || '';
        const email = bizEmailInput.value || '';
        const gmb = bizGmbInput.value || '';

        // 1. Update Flyer preview
        previewFlyerBizName.textContent = name;
        
        const config = campaignOptions[activeCampaignType];
        document.getElementById('preview-flyer-headline').textContent = config.headline;
        document.getElementById('preview-flyer-subheadline').textContent = config.subheadline;
        document.getElementById('preview-flyer-footer-text').textContent = config.footer;
        
        previewFlyerIcon.className = `${categoryIcons[category] || 'fa-solid fa-briefcase'} text-accent`;
        previewFlyerIcon.style.color = accent;

        // Apply accent color variable to flyer card border
        document.documentElement.style.setProperty('--primary', accent);

        // 2. Update Mobile frame iframe
        const baseLocation = window.location.href.substring(0, window.location.href.lastIndexOf('/'));
        
        const params = new URLSearchParams({
            name: name,
            url: gmb,
            color: accent,
            email: email,
            category: category,
            logo: logo,
            tier: ecommerceTierInput ? ecommerceTierInput.value : '',
            type: activeCampaignType,
            demo: 'true'
        });

        portalIframe.src = `${baseLocation}/portal.html?${params.toString()}`;
    }

    // Sync input events
    bizNameInput.addEventListener('input', updateSimulators);
    bizGmbInput.addEventListener('input', updateSimulators);
    if(ecommerceTierInput) ecommerceTierInput.addEventListener('input', updateSimulators);
    bizLogoInput.addEventListener('input', updateSimulators);
    bizEmailInput.addEventListener('input', updateSimulators);
    bizCategorySelect.addEventListener('change', updateSimulators);

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
            const badgeClass = `badge badge-${campaign.category}`;

            // Destination text and icons mapping based on campaign type
            let destinationText = 'Google Maps Review';
            let destinationIconHtml = '<i class="fa-brands fa-google"></i>';
            let printToggleText = 'Copy Standee Flyer Link';
            let printIconClass = 'fa-solid fa-print';
            
            if (campaign.type === 'ecommerce') {
                destinationText = 'Amazon/Shopify Review';
                destinationIconHtml = '<i class="fa-solid fa-cart-shopping"></i>';
                printToggleText = 'Copy Box Insert Link';
                printIconClass = 'fa-solid fa-box-open';
            } else if (campaign.type === 'delivery') {
                destinationText = 'Zomato/Swiggy Store';
                destinationIconHtml = '<i class="fa-solid fa-motorcycle"></i>';
                printToggleText = 'Copy Bag Sticker Link';
                printIconClass = 'fa-solid fa-ticket';
            }

            tr.innerHTML = `
                <td>
                    <div class="table-biz-info">
                        <h5>${campaign.name}</h5>
                        <span>Created: ${campaign.createdAt}</span>
                        ${campaign.tier ? `<span style="font-size:0.75rem; color:var(--primary); display:block; margin-top:2px;"><i class="fa-solid fa-layer-group"></i> ${campaign.tier}</span>` : ''}
                    </div>
                </td>
                <td>
                    <span class="${badgeClass}">${categoryLabels[campaign.category] || 'Professional'}</span>
                </td>
                <td>
                    <a href="${campaign.gmb}" target="_blank" class="destination-link">
                        ${destinationIconHtml} ${destinationText}
                    </a>
                </td>
                <td>
                    <div class="links-column">
                        <button class="copy-link-btn" data-url="${campaign.portalUrl}">
                            <i class="fa-solid fa-mobile-screen"></i> Copy Mobile Portal Link
                        </button>
                        <button class="copy-link-btn" data-url="${campaign.flyerUrl}">
                            <i class="${printIconClass}"></i> ${printToggleText}
                        </button>
                    </div>
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
                        <a href="${campaign.portalUrl}" target="_blank" class="action-icon-btn" title="View Portal">
                            <i class="fa-solid fa-eye"></i>
                        </a>
                        <a href="${campaign.flyerUrl}" target="_blank" class="action-icon-btn" title="View & Print Asset">
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

        // Add Event Listeners for Copy buttons
        const copyBtns = campaignListBody.querySelectorAll('.copy-link-btn');
        copyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const url = btn.getAttribute('data-url');
                navigator.clipboard.writeText(url).then(() => {
                    // Visual active feedback
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
                });
            });
        });

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

        tableHtml += `</tbody></table>`;
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
    table.className = 'clients-table';
    const thead = document.createElement('thead');
    thead.innerHTML = `<tr>
        <th>Name</th><th>Email</th><th>Monthly Amount (INR)</th><th>Description</th><th>Actions</th>
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
    container.innerHTML = '';
    container.appendChild(table);

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
    table.className = 'clients-table';
    const thead = document.createElement('thead');
    thead.innerHTML = `<tr>
        <th>Name</th><th>User ID</th><th>Password</th><th>UPI ID</th><th>Actions</th>
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
    container.innerHTML = '';
    container.appendChild(table);

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

// Listen for Supabase initial pull completion to reload state
window.addEventListener('dbSyncComplete', () => {
    campaigns = JSON.parse(localStorage.getItem('repushield_campaigns')) || [];
    agents = JSON.parse(localStorage.getItem('repushield_agents')) || [];
    clients = JSON.parse(localStorage.getItem('repushield_clients')) || [];
    renderCampaignsTable();
    renderClientsTable();
    renderAgentsTable();
    renderPayoutsTable();
    updateBillingMetrics();
});

});
