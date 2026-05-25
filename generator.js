document.addEventListener('DOMContentLoaded', () => {
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
            subtitle: 'Enter local business details to instantly generate custom review gaters and print-ready QR standees.'
        },
        campaigns: {
            title: 'Active GMB Campaigns',
            subtitle: 'Manage your active review portals, copy business links, and monitor generated campaigns.'
        },
        academy: {
            title: 'The 100k Agency Academy',
            subtitle: 'Your step-by-step blueprint to signing clients, performing outreach, and hitting your income goals.'
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
    // Real-Time Simulator Input Syncing
    // ----------------------------------------------------
    const bizNameInput = document.getElementById('biz-name');
    const bizGmbInput = document.getElementById('biz-gmb');
    const bizAccentInput = document.getElementById('biz-accent');
    const bizAccentHexInput = document.getElementById('biz-accent-hex');
    const bizCategorySelect = document.getElementById('biz-category');
    const bizEmailInput = document.getElementById('biz-email');
    const bizLogoInput = document.getElementById('biz-logo');
    const bizBaseUrlInput = document.getElementById('biz-base-url');
    const localWarning = document.getElementById('local-warning');
    const portalIframe = document.getElementById('portal-iframe');

    // Display local file:// protocol warning
    if (window.location.protocol === 'file:') {
        localWarning.style.display = 'flex';
    }


    // Flyer Mockup DOM elements
    const previewFlyerBizName = document.getElementById('preview-flyer-biz-name');
    const previewFlyerIcon = document.getElementById('preview-flyer-icon');

    // Category Icon Map
    const categoryIcons = {
        cafe: 'fa-solid fa-mug-hot',
        dental: 'fa-solid fa-tooth',
        gym: 'fa-solid fa-dumbbell',
        salon: 'fa-solid fa-scissors',
        law: 'fa-solid fa-scale-balanced',
        other: 'fa-solid fa-briefcase'
    };

    function updateSimulators() {
        const name = bizNameInput.value || 'Your Business Name';
        const accent = bizAccentInput.value;
        const category = bizCategorySelect.value;
        const logo = bizLogoInput.value || '';
        const email = bizEmailInput.value || '';
        const gmb = bizGmbInput.value || '';

        // 1. Update Flyer preview
        previewFlyerBizName.textContent = name;
        previewFlyerIcon.className = `${categoryIcons[category]} text-accent`;
        previewFlyerIcon.style.color = accent;

        // Apply accent color variable to flyer folding card border
        document.documentElement.style.setProperty('--primary', accent);

        // 2. Update Mobile frame iframe (only trigger if we have basic parameters)
        // Since we pass parameters via URL query params, we update the iframe src!
        const baseLocation = window.location.href.substring(0, window.location.href.lastIndexOf('/'));
        
        // Assemble query params
        const params = new URLSearchParams({
            name: name,
            url: gmb,
            color: accent,
            email: email,
            category: category,
            logo: logo,
            demo: 'true' // tells portal.html to operate in demo/sandbox mode
        });

        // Set source of iframe
        portalIframe.src = `${baseLocation}/portal.html?${params.toString()}`;
    }

    // Sync input events
    bizNameInput.addEventListener('input', updateSimulators);
    bizGmbInput.addEventListener('input', updateSimulators);
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
            logo: logo
        });
        const finalPortalUrl = `${baseLocation}/portal.html?${portalUrlParams.toString()}`;


        const flyerUrlParams = new URLSearchParams({
            name: name,
            category: category,
            color: accent,
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
        updateSimulators();
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
                cafe: '☕ Cafe',
                dental: '🦷 Dental',
                gym: '💪 Gym',
                salon: '✂️ Salon',
                law: '⚖️ Law',
                other: '💼 Professional'
            };
            const badgeClass = `badge badge-${campaign.category}`;

            tr.innerHTML = `
                <td>
                    <div class="table-biz-info">
                        <h5>${campaign.name}</h5>
                        <span>Created: ${campaign.createdAt}</span>
                    </div>
                </td>
                <td>
                    <span class="${badgeClass}">${categoryLabels[campaign.category] || 'Professional'}</span>
                </td>
                <td>
                    <a href="${campaign.gmb}" target="_blank" class="destination-link">
                        <i class="fa-brands fa-google"></i> Google Maps Review
                    </a>
                </td>
                <td>
                    <div class="links-column">
                        <button class="copy-link-btn" data-url="${campaign.portalUrl}">
                            <i class="fa-solid fa-mobile-screen"></i> Copy Mobile Portal Link
                        </button>
                        <button class="copy-link-btn" data-url="${campaign.flyerUrl}">
                            <i class="fa-solid fa-print"></i> Copy Standee Flyer Link
                        </button>
                    </div>
                </td>
                <td>
                    <div class="actions-cell">
                        <a href="${campaign.portalUrl}" target="_blank" class="action-icon-btn" title="View Portal">
                            <i class="fa-solid fa-eye"></i>
                        </a>
                        <a href="${campaign.flyerUrl}" target="_blank" class="action-icon-btn" title="View Flyer & Print">
                            <i class="fa-solid fa-print"></i>
                        </a>
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
    }

    function deleteCampaign(id) {
        if (confirm('Are you sure you want to delete this campaign? This will remove its configuration.')) {
            let campaigns = JSON.parse(localStorage.getItem('repushield_campaigns')) || [];
            campaigns = campaigns.filter(c => c.id !== id);
            localStorage.setItem('repushield_campaigns', JSON.stringify(campaigns));
            renderCampaignsList();
            showToast('Campaign deleted successfully.');
        }
    }
});
