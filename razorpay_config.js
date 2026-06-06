// Razorpay integration configuration
// Replace the placeholder with your actual Razorpay Key ID (public key) from the dashboard.
window.RAZORPAY_KEY_ID = "rzp_live_SxusrHHzBelwZg";
// Optional: default plan ID for recurring payments. You can leave empty and let the user input a plan ID per subscription.
window.DEFAULT_PLAN_ID = "plan_SxXGPbmJTScjA5";

window.RAZORPAY_PLANS = {
    'gmb': {
        'monthly': 'plan_SyK1Em92Rcl4gO',
        'quarterly': 'plan_SyK3geMdh0o0BY',
        'half-yearly': 'plan_SyK56UPCdqx7jb',
        'annual': 'plan_SyK63pEM9oAAzL'
    },
    'delivery': {
        'monthly': 'plan_SyK7aIi7PoaAA8',
        'quarterly': 'plan_SyK8Sm1Xdf7oFs',
        'half-yearly': 'plan_SyK9SY5ww6OIMz',
        'annual': 'plan_SyKHXO069p29Y6'
    },
    'ecom_basic': {
        'monthly': 'plan_SyKDfEA0ZcyV1n',
        'quarterly': 'plan_SyKEakKcUw4v3G',
        'half-yearly': 'plan_SyKFUOfFRTZVG6',
        'annual': 'plan_SyKGFwB8j6aUtp'
    },
    'ecom_starter': {
        'monthly': 'plan_SyKJZ0rUflZNA9',
        'quarterly': 'plan_SyKKFq2LKoJcbu',
        'half-yearly': 'plan_SyKLHL2H5jOJAT',
        'annual': 'plan_SyKLxgPZbjoqbb'
    },
    'ecom_growth': {
        'monthly': 'plan_SyKNLf7BJ4bIEw',
        'quarterly': 'plan_SyKTW2avswOilB',
        'half-yearly': 'plan_SyKSVDWTkMvnWo',
        'annual': 'plan_SyKU2HfW21uhYP'
    },
    'ecom_enterprise': {
        'monthly': 'plan_SyKUnFRVVcqC0C',
        'quarterly': 'plan_SyKVm4sABv849y',
        'half-yearly': 'plan_SyKXGFdZTb8haH',
        'annual': 'plan_SyKXsheL0od496'
    }
};
