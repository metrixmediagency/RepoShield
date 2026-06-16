const axios = require('axios');

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method !== "POST") {
        return res.status(405).send("Method Not Allowed");
    }

    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const { name, email, phone, gmb_link, source, niche, color } = body;

        // Validation
        if (!name || !email || !gmb_link) {
            return res.status(400).json({ error: "Missing required fields: name, email, gmb_link" });
        }

        // Determine setup fee based on niche
        let setupFee = 1999;
        if (niche === 'dental' || niche === 'clinic' || niche === 'salon') {
            setupFee = 2499;
        }

        // Supabase configuration (using project credentials as fallback)
        const supabaseUrl = process.env.SUPABASE_URL || "https://emxhibjyofqqvuwtdevo.supabase.co";
        const supabaseKey = process.env.SUPABASE_ANON_KEY || "sb_publishable_b9x83p-5jrIoFJnYYGMWFg_zBKv8JHC";

        // Generate a unique ID for the campaign (e.g., mc_timestamp_random)
        const campaignId = `mc_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

        // Build campaign payload matching the Supabase table schema
        const supabasePayload = {
            id: campaignId,
            name: name,
            category: niche || 'other',
            email: email,
            color: color || '#00F2FE', // Default Neon Cyan
            destination: gmb_link,
            plan: 'free_trial',
            setup_fee: setupFee,
            recurring_fee: 299,
            status: 'trial',
            referred_by: source || 'instagram',
            commission_status: 'pending'
        };

        console.log("Syncing ManyChat lead to Supabase campaigns table:", supabasePayload);

        // POST request directly to Supabase REST API
        const response = await axios.post(
            `${supabaseUrl}/rest/v1/campaigns`,
            supabasePayload,
            {
                headers: {
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                }
            }
        );

        // Build URLs
        const portalUrl = `https://metrixmedia.vercel.app/portal.html?name=${encodeURIComponent(name)}&url=${encodeURIComponent(gmb_link)}&email=${encodeURIComponent(email)}&category=${encodeURIComponent(niche || 'other')}&color=${encodeURIComponent(color || '#00F2FE')}&demo=true`;
        const flyerUrl = `https://metrixmedia.vercel.app/flyer.html?name=${encodeURIComponent(name)}&category=${encodeURIComponent(niche || 'other')}&color=${encodeURIComponent(color || '#00F2FE')}&type=gmb&portalUrl=${encodeURIComponent(portalUrl)}`;

        // Return the success payload
        return res.status(200).json({
            success: true,
            message: "Lead successfully synced with Supabase.",
            campaignId: campaignId,
            portalUrl: portalUrl,
            flyerUrl: flyerUrl,
            data: response.data
        });

    } catch (error) {
        console.error("Error syncing lead to Supabase:", error.response ? error.response.data : error.message);
        return res.status(500).json({
            error: "Failed to sync lead with database.",
            details: error.response ? error.response.data : error.message
        });
    }
}
