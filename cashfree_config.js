/**
 * Cashfree Payments Configuration
 * 
 * Instructions:
 * 1. Get your API keys from the Cashfree Merchant Dashboard
 * 2. Set them in your secure environment variables (e.g., Netlify Environment Variables)
 * 3. Never expose your Secret Key to the frontend!
 */

/*
// Example Backend Implementation (Node.js/Netlify Function)
const axios = require('axios');

const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
const ENV = 'TEST'; // Change to 'PROD' for live

const BASE_URL = ENV === 'TEST' 
    ? 'https://sandbox.cashfree.com/pg' 
    : 'https://api.cashfree.com/pg';

async function createPaymentOrder(clientDetails, amount) {
    try {
        const response = await axios.post(`${BASE_URL}/orders`, {
            customer_details: {
                customer_id: clientDetails.id,
                customer_email: clientDetails.email,
                customer_phone: clientDetails.phone
            },
            order_meta: {
                return_url: `https://metrixmedia.agency/admin.html?order_id={order_id}`
            },
            order_amount: amount,
            order_currency: 'INR'
        }, {
            headers: {
                'x-api-version': '2022-09-01',
                'x-client-id': CASHFREE_APP_ID,
                'x-client-secret': CASHFREE_SECRET_KEY,
                'Content-Type': 'application/json'
            }
        });
        
        return response.data;
    } catch (error) {
        console.error("Error creating Cashfree order:", error);
        throw error;
    }
}
*/
