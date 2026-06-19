// Supabase Client Initialization Configuration
// Get your real keys from: Supabase Dashboard → Settings → API
// The Anon Key is a JWT starting with "eyJ..." (200+ characters)
window.SUPABASE_URL = "https://emxhibjyofqqvuwtdevo.supabase.co"; 
window.SUPABASE_ANON_KEY = ""; // PASTE YOUR REAL ANON KEY HERE (starts with eyJ...)

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

        const list = JSON.parse(value);

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
            const payload = {
                id: c.id,
                name: c.name,
                category: c.category,
                email: c.email,
                color: c.color,
                destination: c.destination,
                plan: c.plan,
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
            if (dbCampaigns && dbCampaigns.length > 0) {
                const mappedCampaigns = dbCampaigns.map(c => ({
                    id: c.id,
                    name: c.name,
                    category: c.category,
                    email: c.email,
                    color: c.color,
                    destination: c.destination,
                    plan: c.plan,
                    setupFee: parseFloat(c.setup_fee),
                    recurringFee: parseFloat(c.recurring_fee),
                    status: c.status,
                    referredBy: c.referred_by,
                    commissionStatus: c.commission_status
                }));
                originalSetItem.call(localStorage, 'repushield_campaigns', JSON.stringify(mappedCampaigns));
                prevCampaigns = mappedCampaigns;
            } else if (dbCampaigns && dbCampaigns.length === 0) {
                const localCampaigns = JSON.parse(localStorage.getItem('repushield_campaigns')) || [];
                if (localCampaigns.length > 0) syncCampaigns(localCampaigns);
            }

            // Agents Sync
            const { data: dbAgents } = await supabaseClient.from('agents').select('*');
            if (dbAgents && dbAgents.length > 0) {
                originalSetItem.call(localStorage, 'repushield_agents', JSON.stringify(dbAgents));
                prevAgents = dbAgents;
            } else if (dbAgents && dbAgents.length === 0) {
                const localAgents = JSON.parse(localStorage.getItem('repushield_agents')) || [];
                if (localAgents.length > 0) syncAgents(localAgents);
            }

            // Clients Sync
            const { data: dbClients } = await supabaseClient.from('clients').select('*');
            if (dbClients && dbClients.length > 0) {
                originalSetItem.call(localStorage, 'repushield_clients', JSON.stringify(dbClients));
                prevClients = dbClients;
            } else if (dbClients && dbClients.length === 0) {
                const localClients = JSON.parse(localStorage.getItem('repushield_clients')) || [];
                if (localClients.length > 0) syncClients(localClients);
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
