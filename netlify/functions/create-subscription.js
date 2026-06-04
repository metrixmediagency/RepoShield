const axios = require('axios');

exports.handler = async function(event, context) {
    // Enable CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers, body: "" };
    }

    if (event.httpMethod !== "POST") {
        return { statusCode: 405, headers, body: "Method Not Allowed" };
    }

    try {
        const { planId, setupFee, businessName, customerEmail } = JSON.parse(event.body);

        const keyId = process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;

        if (!keyId || !keySecret) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: "Razorpay credentials not configured in Netlify environment variables." })
            };
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

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                subscriptionId: response.data.id,
                shortUrl: response.data.short_url
            })
        };
    } catch (error) {
        console.error("Error creating Razorpay subscription:", error.response ? error.response.data : error.message);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: "Failed to generate Razorpay subscription.",
                details: error.response ? error.response.data : error.message
            })
        };
    }
};
