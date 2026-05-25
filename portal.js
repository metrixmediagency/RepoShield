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
    const isDemo = urlParams.get('demo') === 'true'; // Sandbox editor preview flag

    // Apply Brand Accent Color dynamically
    document.documentElement.style.setProperty('--primary', accentColor);
    document.documentElement.style.setProperty('--primary-glow', `${accentColor}40`); // 25% opacity glow

    // Set Business Details in DOM
    document.getElementById('business-name').textContent = bizName;

    // Logo / Icon rendering logic
    const logoContainer = document.getElementById('logo-container');
    const categoryIcon = document.getElementById('category-icon');

    // Category icon mapping
    const iconClasses = {
        cafe: 'fa-solid fa-mug-hot',
        dental: 'fa-solid fa-tooth',
        gym: 'fa-solid fa-dumbbell',
        salon: 'fa-solid fa-scissors',
        law: 'fa-solid fa-scale-balanced',
        other: 'fa-solid fa-store'
    };

    if (logoUrl) {
        logoContainer.innerHTML = `<img src="${logoUrl}" alt="${bizName} Logo" onerror="this.style.display='none'; logoContainer.innerHTML='<i class=\\\x22${iconClasses[category]}\\\x22></i>'">`;
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
    const redirectOverlay = document.getElementById('redirect-overlay');
    const timerCount = document.getElementById('timer-count');
    const directGmbLink = document.getElementById('direct-gmb-link');

    function routeRating(rating) {
        if (rating >= 4) {
            // Positive Routing: Redirect to Google Review
            directGmbLink.href = gmbUrl;
            redirectOverlay.classList.add('show');

            let count = 3;
            timerCount.textContent = count;

            const interval = setInterval(() => {
                count--;
                timerCount.textContent = count;
                
                if (count <= 0) {
                    clearInterval(interval);
                    if (isDemo) {
                        alert(`[DEMO MODE ACTIVE]\nIn a live setting, this would now redirect the customer directly to the business Google Maps Review page:\n\n${gmbUrl}`);
                        redirectOverlay.classList.remove('show');
                        // Reset selection
                        selectedRating = 0;
                        highlightStars(0);
                        ratingHelper.textContent = 'Tap a star to rate';
                        ratingHelper.classList.remove('ready');
                    } else {
                        window.location.href = gmbUrl;
                    }
                }
            }, 1000);
        } else {
            // Negative Routing: Show private feedback form
            ratingScreen.style.display = 'none';
            feedbackScreen.style.display = 'flex';
        }
    }

    // Back to rating screen
    document.getElementById('back-to-stars').addEventListener('click', () => {
        feedbackScreen.style.display = 'none';
        ratingScreen.style.display = 'flex';
        selectedRating = 0;
        highlightStars(0);
        ratingHelper.textContent = 'Tap a star to rate';
        ratingHelper.classList.remove('ready');
    });

    // ----------------------------------------------------
    // Private Feedback Submission
    // ----------------------------------------------------
    const feedbackForm = document.getElementById('feedback-form');
    const successScreen = document.getElementById('success-screen');

    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('client-name').value;
        const phone = document.getElementById('client-phone').value;
        const message = document.getElementById('client-message').value;

        // Construct lead data
        const lead = {
            id: Date.now().toString(),
            businessName: bizName,
            businessEmail: bizEmail,
            rating: selectedRating,
            clientName: name,
            clientPhone: phone,
            clientMessage: message,
            submittedAt: new Date().toLocaleString()
        };

        // Save Private Lead locally in LocalStorage (so the Agency owner can show leads to clients)
        let leads = JSON.parse(localStorage.getItem('repushield_leads')) || [];
        leads.unshift(lead);
        localStorage.setItem('repushield_leads', JSON.stringify(leads));

        // Submit complete visual switch
        feedbackScreen.style.display = 'none';
        
        // Hide brand header so the success page occupies full space
        document.querySelector('.brand-section').style.display = 'none';
        
        successScreen.style.display = 'flex';
    });
});
