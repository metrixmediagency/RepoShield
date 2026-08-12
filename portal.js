document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // URL Parameters Parser
    // ----------------------------------------------------
    const urlParams = new URLSearchParams(window.location.search);
    
    const bizName = urlParams.get('name') || 'Our Business';
    const gmbUrl = urlParams.get('url') || 'https://google.com';
    const accentColor = urlParams.get('color') || '#6366f1';
    const bizEmail = urlParams.get('email') || 'owner@business.com';
    const category = urlParams.get('category') || 'other';
    const logoUrl = urlParams.get('logo') || '';
    const campaignType = urlParams.get('type') || 'gmb'; // Parse campaign type
    const font = urlParams.get('font') || 'Outfit'; // Parse font type
    const webhookUrl = urlParams.get('webhook') || ''; // Parse webhook URL
    const isDemo = urlParams.get('demo') === 'true'; // Sandbox editor preview flag

    // Apply Brand Accent Color dynamically
    document.documentElement.style.setProperty('--primary', accentColor);
    document.documentElement.style.setProperty('--primary-glow', `${accentColor}40`); // 25% opacity glow

    // Set Brand Typography dynamically
    const fontNameForUrl = font.replace(/ /g, '+');
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${fontNameForUrl}:wght@400;500;600;700;800&display=swap`;
    document.head.appendChild(link);

    const style = document.createElement('style');
    style.innerHTML = `
        body, h2, h3, .tagline, .rating-helper-text, .feedback-subtitle, button, input, textarea, label {
            font-family: "${font}", sans-serif !important;
        }
    `;
    document.head.appendChild(style);

    // Set Business Details in DOM
    document.getElementById('business-name').textContent = bizName;

    // Type Configs for dynamic content
    const typeConfigs = {
        gmb: {
            tagline: "Thank you for visiting us today! We value your feedback.",
            ratingTitle: "How was your experience?",
            feedbackTitle: "We'd love to make it right",
            feedbackSubtitle: "We are sorry your experience wasn't perfect. Please tell us what we can do better, and our manager will contact you directly to resolve this.",
            redirectTitle: "Fantastic!",
            redirectText: `We are thrilled you loved your experience! We are redirecting you to Google to share your 5-star rating with the world.`,
            redirectBtn: "Click here if not redirected automatically"
        },
        ecommerce: {
            tagline: "Thank you for your purchase! Register your warranty here.",
            ratingTitle: "How do you rate your product?",
            feedbackTitle: "Let us make it right!",
            feedbackSubtitle: "We are sorry your product wasn't perfect! Please share what went wrong and we will ship you a free replacement or process a full refund instantly.",
            redirectTitle: "Excellent!",
            redirectText: `We are thrilled you love your product! We are redirecting you to our product page to submit your warranty review.`,
            redirectBtn: "Click here to submit review & activate warranty"
        },
        delivery: {
            tagline: "Hope you loved your meal! Unlock a free reward below.",
            ratingTitle: "Was your food delicious?",
            feedbackTitle: "We apologize for the meal!",
            feedbackSubtitle: "We are sorry the meal wasn't perfect. Was it cold? Taste off? Tell us here privately and we will send a fresh meal or refund you immediately.",
            redirectTitle: "Delicious!",
            redirectText: `We are so happy you enjoyed your food! Redirecting you to Zomato/Swiggy to submit your rating and unlock your free dessert!`,
            redirectBtn: "Click here to claim your reward"
        }
    };

    const currentConfig = typeConfigs[campaignType] || typeConfigs.gmb;

    // Inject dynamic texts safely
    const taglineEl = document.querySelector('.tagline');
    const ratingTitleEl = document.querySelector('#rating-screen h3');
    const feedbackTitleEl = document.querySelector('#feedback-screen h3');
    const feedbackSubtitleEl = document.querySelector('.feedback-subtitle');
    const redirectTitleEl = document.querySelector('#redirect-overlay h2');
    const redirectTextEl = document.querySelector('#redirect-overlay p');
    const directLinkEl = document.getElementById('direct-gmb-link');

    if (taglineEl) taglineEl.textContent = currentConfig.tagline;
    if (ratingTitleEl) ratingTitleEl.textContent = currentConfig.ratingTitle;
    if (feedbackTitleEl) feedbackTitleEl.textContent = currentConfig.feedbackTitle;
    if (feedbackSubtitleEl) feedbackSubtitleEl.textContent = currentConfig.feedbackSubtitle;
    if (redirectTitleEl) redirectTitleEl.textContent = currentConfig.redirectTitle;
    if (redirectTextEl) redirectTextEl.textContent = currentConfig.redirectText;
    if (directLinkEl) directLinkEl.textContent = currentConfig.redirectBtn;

    // Logo / Icon rendering logic
    const logoContainer = document.getElementById('logo-container');
    const categoryIcon = document.getElementById('category-icon');

    // Category icon mapping across all types
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

    if (logoUrl) {
        const img = document.createElement('img');
        img.src = logoUrl;
        img.alt = `${bizName} Logo`;
        img.onerror = () => {
            logoContainer.innerHTML = `<i class="${iconClasses[category] || iconClasses.other}"></i>`;
        };
        logoContainer.innerHTML = '';
        logoContainer.appendChild(img);
    } else {
        categoryIcon.className = iconClasses[category] || iconClasses.other;
    }

    // ----------------------------------------------------
    // Star Rating Interactions
    // ----------------------------------------------------
    const stars = document.querySelectorAll('.star-btn');
    const ratingHelper = document.getElementById('rating-helper');
    let selectedRating = 0;

    stars.forEach(star => {
        // Hover visual highlights
        star.addEventListener('mouseenter', () => {
            const hoverVal = parseInt(star.getAttribute('data-rating'));
            highlightStars(hoverVal);
            ratingHelper.textContent = getRatingLabel(hoverVal);
            ratingHelper.classList.add('ready');
        });

        // Mouse exit highlights reset
        star.addEventListener('mouseleave', () => {
            highlightStars(selectedRating);
            if (selectedRating === 0) {
                ratingHelper.textContent = 'Tap a star to rate';
                ratingHelper.classList.remove('ready');
            } else {
                ratingHelper.textContent = getRatingLabel(selectedRating);
            }
        });

        // Click Selection Route routing
        star.addEventListener('click', () => {
            selectedRating = parseInt(star.getAttribute('data-rating'));
            highlightStars(selectedRating);
            
            // Wait 500ms for user to see full selected state before action
            setTimeout(() => {
                routeRating(selectedRating);
            }, 500);
        });
    });

    function highlightStars(val) {
        stars.forEach(star => {
            const rating = parseInt(star.getAttribute('data-rating'));
            const icon = star.querySelector('i');
            
            if (rating <= val) {
                star.classList.add('active');
                icon.className = 'fa-solid fa-star';
            } else {
                star.classList.remove('active');
                icon.className = 'fa-regular fa-star';
            }
        });
    }

    function getRatingLabel(val) {
        switch (val) {
            case 1: return 'Terrible 😞';
            case 2: return 'Poor 😕';
            case 3: return 'Average 😐';
            case 4: return 'Very Good 🙂';
            case 5: return 'Excellent! 😍';
            default: return 'Tap a star to rate';
        }
    }

    // ----------------------------------------------------
    // Routing Logic: 4-5 Stars vs 1-3 Stars
    // ----------------------------------------------------
    const ratingScreen = document.getElementById('rating-screen');
    const feedbackScreen = document.getElementById('feedback-screen');
    const vipScreen = document.getElementById('vip-screen');
    const redirectOverlay = document.getElementById('redirect-overlay');
    const timerCount = document.getElementById('timer-count');
    const directGmbLink = document.getElementById('direct-gmb-link');

    function startRedirectTimer() {
        directGmbLink.href = gmbUrl;
        redirectOverlay.classList.add('show');

        let count = 3;
        timerCount.textContent = count;

        const interval = setInterval(() => {
            count--;
            timerCount.textContent = count;
            
            if (count <= 0) {
                clearInterval(interval);
                window.location.href = gmbUrl;
            }
        }, 1000);
    }

    function routeRating(rating) {
        if (rating >= 4) {
            // Positive Routing: Show lead capture form instead of immediate redirect
            ratingScreen.style.display = 'none';
            vipScreen.style.display = 'flex';
        } else {
            // Negative Routing: Show private feedback form
            ratingScreen.style.display = 'none';
            feedbackScreen.style.display = 'flex';
        }
    }

    // Back to rating screen from Negative Feedback
    document.getElementById('back-to-stars').addEventListener('click', () => {
        feedbackScreen.style.display = 'none';
        ratingScreen.style.display = 'flex';
        resetRatingState();
    });

    // Back to rating screen from Positive Lead Capture
    document.getElementById('vip-back-to-stars').addEventListener('click', () => {
        vipScreen.style.display = 'none';
        ratingScreen.style.display = 'flex';
        resetRatingState();
    });

    function resetRatingState() {
        selectedRating = 0;
        highlightStars(0);
        ratingHelper.textContent = 'Tap a star to rate';
        ratingHelper.classList.remove('ready');
    }

    // ----------------------------------------------------
    // Shared Data Submission Logic
    // ----------------------------------------------------
    function saveAndSendWebhook(lead) {
        // Save locally
        let leads = JSON.parse(localStorage.getItem('repushield_leads')) || [];
        leads.unshift(lead);
        localStorage.setItem('repushield_leads', JSON.stringify(leads));

        // POST to Supabase
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
                    business_name: lead.businessName,
                    business_email: lead.businessEmail,
                    rating: lead.rating,
                    client_name: lead.clientName,
                    client_phone: lead.clientPhone,
                    client_message: lead.clientMessage || "",
                    submitted_at: new Date().toISOString()
                })
            }).catch(err => console.warn("Feedback cloud sync failed:", err));
        }

        // Webhook Integration (Google Sheet)
        if (webhookUrl) {
            fetch(webhookUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(lead)
            }).catch(err => console.warn("Webhook failed:", err));
        }
    }

    // ----------------------------------------------------
    // Lead Capture Submission (4-5 Stars)
    // ----------------------------------------------------
    const vipForm = document.getElementById('vip-form');
    
    document.getElementById('skip-vip-link').addEventListener('click', (e) => {
        e.preventDefault();
        vipScreen.style.display = 'none';
        startRedirectTimer();
    });

    vipForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('vip-name').value;
        const phone = document.getElementById('vip-phone').value;
        const dob = document.getElementById('vip-dob') ? document.getElementById('vip-dob').value : '';

        const lead = {
            id: Date.now().toString(),
            businessName: bizName,
            businessEmail: bizEmail,
            rating: selectedRating,
            clientName: name,
            clientPhone: phone,
            clientDOB: dob,
            clientMessage: "Captured Lead (Positive)",
            submittedAt: new Date().toLocaleString()
        };

        saveAndSendWebhook(lead);

        vipScreen.style.display = 'none';
        startRedirectTimer();
    });

    // ----------------------------------------------------
    // Private Feedback Submission (1-3 Stars)
    // ----------------------------------------------------
    const feedbackForm = document.getElementById('feedback-form');
    const successScreen = document.getElementById('success-screen');

    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('client-name').value;
        const phone = document.getElementById('client-phone').value;
        const dob = document.getElementById('client-dob') ? document.getElementById('client-dob').value : '';
        const message = document.getElementById('client-message').value;

        // Construct lead data
        const lead = {
            id: Date.now().toString(),
            businessName: bizName,
            businessEmail: bizEmail,
            rating: selectedRating,
            clientName: name,
            clientPhone: phone,
            clientDOB: dob,
            clientMessage: message,
            submittedAt: new Date().toLocaleString()
        };

        saveAndSendWebhook(lead);

        // Submit complete visual switch
        feedbackScreen.style.display = 'none';
        
        // Hide brand header so the success page occupies full space
        document.querySelector('.brand-section').style.display = 'none';
        
        successScreen.style.display = 'flex';
    });
});
