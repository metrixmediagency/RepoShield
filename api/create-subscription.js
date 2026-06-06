const axios = require('axios');

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method !== "POST") {
        return res.status(405).send("Method Not Allowed");
    }

    try {
        // In Vercel, req.body is already parsed if it's application/json
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const { planId, setupFee, businessName, customerEmail } = body;

        const keyId = process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;

        if (!keyId || !keySecret) {
            return res.status(500).json({ error: "Razorpay credentials not configured in Vercel environment variables." });
        }

        const authString = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

        // Build subscription options
        const payload = {
            plan_id: planId,
            total_count: 60, // 5 years subscription limit
            quantity: 1,
            customer_notify: 1
        };

        // If there's an upfront setup fee (greater than 0), attach it as an addon
        if (setupFee && parseFloat(setupFee) > 0) {
            payload.addons = [
                {
                    item: {
                        name: `One-time Setup Fee for ${businessName}`,
                        amount: Math.round(parseFloat(setupFee) * 100), // in paisa
                        currency: "INR"
                    }
                }
            ];
        }

        console.log("Calling Razorpay API to create subscription:", payload);

        const response = await axios.post('https://api.razorpay.com/v1/subscriptions', payload, {
            headers: {
                'Authorization': `Basic ${authString}`,
                'Content-Type': 'application/json'
            }
        });

        return res.status(200).json({
            subscriptionId: response.data.id,
            shortUrl: response.data.short_url
        });
    } catch (error) {
        console.error("Error creating Razorpay subscription:", error.response ? error.response.data : error.message);
        return res.status(500).json({
            error: "Failed to generate Razorpay subscription.",
            details: error.response ? error.response.data : error.message
        });
    }
}
