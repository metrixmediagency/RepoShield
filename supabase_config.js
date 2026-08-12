// Supabase Client Initialization Configuration
// Get your real keys from: Supabase Dashboard → Settings → API
// The Anon Key is a JWT starting with "eyJ..." (200+ characters)
window.SUPABASE_URL = "https://lvjwccjobbjaxpqcfrtz.supabase.co"; 
window.SUPABASE_ANON_KEY = "sb_publishable_HG5SCpe-lMYJLoF3UxwbBQ_JYLXMK-2";

// Initialize Supabase Client if configured
let supabaseClient = null;

if (window.SUPABASE_URL && window.SUPABASE_URL !== "https://your-project.supabase.co" && window.SUPABASE_ANON_KEY && window.SUPABASE_ANON_KEY !== "your-anon-key") {
    try {
        supabaseClient = supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
        console.log("Supabase Client initialized successfully.");
    } catch (err) {
        console.error("Failed to initialize Supabase client:", err);
    }
} else {
    console.warn("Supabase credentials not configured yet. Falling back to local device storage.");
}

window.supabaseClient = supabaseClient;

// ----------------------------------------------------
// Supabase Sync Engine (Local Storage Interceptor)
// ----------------------------------------------------
if (supabaseClient) {
    // Keep local tracks to detect deletions
    let prevCampaigns = JSON.parse(localStorage.getItem('repushield_campaigns')) || [];
    let prevAgents = JSON.parse(localStorage.getItem('repushield_agents')) || [];
    let prevClients = JSON.parse(localStorage.getItem('repushield_clients')) || [];

    // Intercept localStorage.setItem to push changes to Supabase in background
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
        // Perform standard local storage write
        originalSetItem.apply(this, arguments);

        let list = [];
        try {
            list = JSON.parse(value);
        } catch (err) {
            // If another script stores a non-JSON string, ignore it to prevent crashing the interceptor
            return;
        }

        if (key === 'repushield_campaigns') {
            // Detect deletions
            const currentIds = list.map(item => item.id);
            prevCampaigns.forEach(async (oldItem) => {
                if (!currentIds.includes(oldItem.id)) {
                    await supabaseClient.from('campaigns').delete().eq('id', oldItem.id);
                }
            });
            prevCampaigns = list;
            // Push active list in background
            syncCampaigns(list);
        } else if (key === 'repushield_agents') {
            const currentIds = list.map(item => item.id);
            prevAgents.forEach(async (oldItem) => {
                if (!currentIds.includes(oldItem.id)) {
                    await supabaseClient.from('agents').delete().eq('id', oldItem.id);
                }
            });
            prevAgents = list;
            syncAgents(list);
        } else if (key === 'repushield_clients') {
            const currentIds = list.map(item => item.id);
            prevClients.forEach(async (oldItem) => {
                if (!currentIds.includes(oldItem.id)) {
                    await supabaseClient.from('clients').delete().eq('id', oldItem.id);
                }
            });
            prevClients = list;
            syncClients(list);
        }
    };

    // Helper: Push campaigns array to Supabase
    async function syncCampaigns(list) {
        for (const c of list) {
            // Pack metadata inside destination URL to bypass database schema limits
            const meta = {
                theme: c.theme || 'theme-onyx',
                font: c.font || 'Outfit',
                logo: c.logo || '',
                type: c.type || 'gmb',
                qrDot: c.qrSettings?.qrDotStyle || c.qrDot || 'theme-default',
                qrCorner: c.qrSettings?.qrCornerStyle || c.qrCorner || 'extra-rounded',
                flyerHeadline: c.flyerSettings?.flyerHeadline || c.flyerHeadline || 'Review Us',
                flyerSub: c.flyerSettings?.flyerSub || c.flyerSub || 'Scan to Rate',
                flyerFooter: c.flyerSettings?.flyerFooter || c.flyerFooter || 'Help us serve you better!',
                flyerTextStyle: c.flyerSettings?.flyerTextStyle || c.flyerTextStyle || 'normal'
            };
            const metaString = encodeURIComponent(JSON.stringify(meta));
            const baseDest = c.destination || c.gmb || c.portalUrl || '';
            const finalDestination = baseDest + (baseDest.includes('?') ? '&' : '?') + '_repushield_meta=' + metaString;

            const payload = {
                id: c.id,
                name: c.name,
                category: c.category,
                email: c.email,
                color: c.color || c.accent || '#6366f1',
                destination: finalDestination,
                plan: c.plan || 'standard',
                setup_fee: c.setupFee || 0,
                recurring_fee: c.recurringFee || 0,
                status: c.status || 'active',
                referred_by: c.referredBy || null,
                commission_status: c.commissionStatus || 'pending'
            };
            await supabaseClient.from('campaigns').upsert([payload]);
        }
    }

    // Helper: Push agents array to Supabase
    async function syncAgents(list) {
        for (const a of list) {
            const payload = {
                id: a.id,
                name: a.name,
                username: a.username,
                password: a.password,
                upi: a.upi
            };
            await supabaseClient.from('agents').upsert([payload]);
        }
    }

    // Helper: Push clients array to Supabase
    async function syncClients(list) {
        for (const c of list) {
            const payload = {
                id: c.id,
                name: c.name,
                email: c.email,
                amount: c.amount,
                description: c.description || ''
            };
            await supabaseClient.from('clients').upsert([payload]);
        }
    }

    // Helper: Pull data from Supabase at load time
    async function pullCloudData() {
        try {
            // Campaigns Sync
            const { data: dbCampaigns } = await supabaseClient.from('campaigns').select('*');
            if (dbCampaigns) {
                const mappedCampaigns = dbCampaigns.map(c => {
                    let dest = c.destination || '';
                    let meta = {};
                    if (dest.includes('_repushield_meta=')) {
                        try {
                            const parts = dest.split('_repushield_meta=');
                            dest = parts[0].replace(/[?&]$/, '');
                            meta = JSON.parse(decodeURIComponent(parts[1]));
                        } catch (e) {
                            console.error("Failed to parse sync metadata:", e);
                        }
                    }
                    return {
                        id: c.id,
                        name: c.name,
                        category: c.category,
                        email: c.email,
                        color: c.color,
                        destination: dest,
                        plan: c.plan,
                        setupFee: parseFloat(c.setup_fee),
                        recurringFee: parseFloat(c.recurring_fee),
                        status: c.status,
                        referredBy: c.referred_by,
                        commissionStatus: c.commission_status,
                        
                        // Mapped meta variables
                        theme: meta.theme || 'theme-onyx',
                        font: meta.font || 'Outfit',
                        logo: meta.logo || '',
                        type: meta.type || 'gmb',
                        qrSettings: {
                            qrDotStyle: meta.qrDot || 'theme-default',
                            qrCornerStyle: meta.qrCorner || 'extra-rounded'
                        },
                        flyerSettings: {
                            flyerHeadline: meta.flyerHeadline || 'Review Us',
                            flyerSub: meta.flyerSub || 'Scan to Rate',
                            flyerFooter: meta.flyerFooter || 'Help us serve you better!',
                            flyerTextStyle: meta.flyerTextStyle || 'normal'
                        }
                    };
                });
                
                let localCampaigns = [];
                try { localCampaigns = JSON.parse(localStorage.getItem('repushield_campaigns')) || []; } catch(e){}
                if (!Array.isArray(localCampaigns)) localCampaigns = [];
                
                const dbIds = mappedCampaigns.map(c => c.id);
                const missingLocal = localCampaigns.filter(c => !dbIds.includes(c.id));
                const finalCampaigns = [...mappedCampaigns, ...missingLocal];
                
                originalSetItem.call(localStorage, 'repushield_campaigns', JSON.stringify(finalCampaigns));
                prevCampaigns = finalCampaigns;
                if (missingLocal.length > 0) syncCampaigns(missingLocal);
            }

            // Agents Sync
            const { data: dbAgents } = await supabaseClient.from('agents').select('*');
            if (dbAgents) {
                let localAgents = [];
                try { localAgents = JSON.parse(localStorage.getItem('repushield_agents')) || []; } catch(e){}
                if (!Array.isArray(localAgents)) localAgents = [];
                
                const dbUsernames = dbAgents.map(a => a.username);
                const missingLocal = localAgents.filter(a => !dbUsernames.includes(a.username));
                const finalAgents = [...dbAgents, ...missingLocal];
                
                originalSetItem.call(localStorage, 'repushield_agents', JSON.stringify(finalAgents));
                prevAgents = finalAgents;
                if (missingLocal.length > 0) syncAgents(missingLocal);
            }

            // Clients Sync
            const { data: dbClients } = await supabaseClient.from('clients').select('*');
            if (dbClients) {
                let localClients = [];
                try { localClients = JSON.parse(localStorage.getItem('repushield_clients')) || []; } catch(e){}
                if (!Array.isArray(localClients)) localClients = [];
                
                const dbIds = dbClients.map(c => c.id);
                const missingLocal = localClients.filter(c => !dbIds.includes(c.id));
                const finalClients = [...dbClients, ...missingLocal];
                
                originalSetItem.call(localStorage, 'repushield_clients', JSON.stringify(finalClients));
                prevClients = finalClients;
                if (missingLocal.length > 0) syncClients(missingLocal);
            }

            console.log("Supabase data pulled and synced to local storage cache.");
            // Trigger UI update
            window.dispatchEvent(new Event('dbSyncComplete'));
        } catch (err) {
            console.error("Failed to sync data from Supabase:", err);
        }
    }

    // Run pull on script load
    pullCloudData();
}
