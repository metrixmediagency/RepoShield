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

        // Supabase configuration
        // IMPORTANT: Set these as Vercel Environment Variables for security:
        //   SUPABASE_URL = your Supabase project URL
        //   SUPABASE_ANON_KEY = your Supabase anon/public key (starts with eyJ...)
        const supabaseUrl = process.env.SUPABASE_URL || "https://emxhibjyofqqvuwtdevo.supabase.co";
        const supabaseKey = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVteGhpYmp5b2ZxcXZ1d3RkZXZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1NzUwMDYsImV4cCI6MjA5NjE1MTAwNn0.605yhNQUptFhSXl6sor8aM8MEXyoC0O41Wu8sLKqEAg";

        // Generate a unique ID for the campaign
        const campaignId = `mc_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

        // Build campaign payload matching the Supabase table schema
        const supabasePayload = {
            id: campaignId,
            name: name,
            category: niche || 'other',
            email: email,
            color: color || '#00F2FE',
            destination: gmb_link,
            plan: 'free_trial',
            setup_fee: setupFee,
            recurring_fee: 299,
            status: 'trial',
            referred_by: source || 'instagram',
            commission_status: 'pending'
        };

        console.log("Syncing ManyChat lead to Supabase campaigns table:", supabasePayload);

        // POST to Supabase REST API using native fetch (no axios dependency)
        let dbResult = null;
        if (supabaseKey) {
            const response = await fetch(
                `${supabaseUrl}/rest/v1/campaigns`,
                {
                    method: 'POST',
                    headers: {
                        'apikey': supabaseKey,
                        'Authorization': `Bearer ${supabaseKey}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation'
                    },
                    body: JSON.stringify(supabasePayload)
                }
            );
            if (response.ok) {
                dbResult = await response.json();
            } else {
                console.error("Supabase write failed:", response.status, await response.text());
            }
        } else {
            console.warn("SUPABASE_ANON_KEY not set — skipping database write.");
        }

        // Build URLs — NO demo=true so portals actually redirect to Google
        const portalUrl = `https://metrixmedia.vercel.app/portal.html?name=${encodeURIComponent(name)}&url=${encodeURIComponent(gmb_link)}&email=${encodeURIComponent(email)}&category=${encodeURIComponent(niche || 'other')}&color=${encodeURIComponent(color || '#00F2FE')}`;
        const flyerUrl = `https://metrixmedia.vercel.app/flyer.html?name=${encodeURIComponent(name)}&category=${encodeURIComponent(niche || 'other')}&color=${encodeURIComponent(color || '#00F2FE')}&type=gmb&theme=theme-onyx&qrDot=dots&qrCorner=extra-rounded&flyerHeadline=Review%20Us&flyerSub=Scan%20to%20Rate&flyerFooter=Help%20us%20serve%20you%20better!&flyerTextStyle=normal&portalUrl=${encodeURIComponent(portalUrl)}`;

        // Return the success payload
        return res.status(200).json({
            success: true,
            message: "Lead processed successfully.",
            campaignId: campaignId,
            portalUrl: portalUrl,
            flyerUrl: flyerUrl,
            data: dbResult
        });

    } catch (error) {
        console.error("Error processing lead:", error.message);
        return res.status(500).json({
            error: "Failed to process lead.",
            details: error.message
        });
    }
}

