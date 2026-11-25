// Supabase Client Initialization Configuration
window.SUPABASE_URL = "https://lvjwccjobbjaxpqcfrtz.supabase.co"; 
window.SUPABASE_ANON_KEY = "sb_publishable_HG5SCpe-lMYJLoF3UxwbBQ_JYLXMK-2";

// Initialize Supabase Client if SDK is loaded
let supabaseClient = null;

if (typeof supabase !== 'undefined' && window.SUPABASE_URL && window.SUPABASE_ANON_KEY) {
    try {
        supabaseClient = supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
        console.log("Supabase Client initialized successfully.");
    } catch (err) {
        console.error("Failed to initialize Supabase client:", err);
    }
}

window.supabaseClient = supabaseClient;

// ----------------------------------------------------
// Shared Cloud Config Helpers (Available via REST or SDK)
// ----------------------------------------------------
function packCampaignMeta(c) {
    const meta = {
        theme: c.theme || 'theme-onyx',
        font: c.font || 'Outfit',
        logo: c.logo || '',
        type: c.type || 'dining',
        qrDot: c.qrSettings?.qrDotStyle || c.qrDot || 'theme-default',
        qrCorner: c.qrSettings?.qrCornerStyle || c.qrCorner || 'extra-rounded',
        flyerHeadline: c.flyerSettings?.flyerHeadline || c.flyerHeadline || 'How was your experience today?',
        flyerSub: c.flyerSettings?.flyerSub || c.flyerSub || 'Scan to join VIP & call service.',
        flyerFooter: c.flyerSettings?.flyerFooter || c.flyerFooter || 'Powered by METRIX',
        flyerTextStyle: c.flyerSettings?.flyerTextStyle || c.flyerTextStyle || 'normal',
        flyerBg: c.flyerBg || '#0a0a0a',
        flyerAccent: c.flyerAccent || c.color || '#d4af37',
        flyerText: c.flyerText || '#ffffff',
        // 3-Tier SaaS & Cloud Venue Config
        tier: c.tier || 'starter',
        ownerPassword: c.ownerPassword || 'metrix123',
        whatsapp: c.whatsapp || '',
        gmbUrl: c.gmbUrl || '',
        menuUrl: c.menuUrl || '',
        ntfyTopic: c.ntfyTopic || '',
        alertWebhook: c.alertWebhook || '',
        wifiSsid: c.wifiSsid || '',
        wifiPass: c.wifiPass || '',
        features: {
            vip: c.features?.vip !== false,
            service: c.features?.service !== false,
            games: c.features?.games !== false,
            menu: c.features?.menu !== false,
            wifi: c.features?.wifi !== false,
            wifiGate: Boolean(c.features?.wifiGate),
            callManager: c.features?.callManager !== false,
            complaint: c.features?.complaint !== false
        },
        // Tier 2 Loyalty Ready
        stampGoal: c.stampGoal || 8,
        stampReward: c.stampReward || 'Complimentary Dessert / Coffee',
        stampPin: c.stampPin || '1234',
        // Tier 3 D2C Ready
        d2cEnabled: Boolean(c.d2cEnabled),
        menuItems: Array.isArray(c.menuItems) ? c.menuItems : [],
        serviceFee: (typeof c.serviceFee === 'number') ? c.serviceFee : 20
    };
    const metaString = encodeURIComponent(JSON.stringify(meta));
    let baseDest = c.gmbUrl || c.destination || c.portalUrl || '';
    if (baseDest.includes('_repushield_meta=')) {
        baseDest = baseDest.split('_repushield_meta=')[0].replace(/[?&]$/, '');
    }
    return baseDest + (baseDest.includes('?') ? '&' : '?') + '_repushield_meta=' + metaString;
}

function unpackCampaignRow(c) {
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
        category: c.category || 'dining',
        email: c.email || '',
        color: c.color || meta.flyerAccent || '#d4af37',
        destination: dest,
        portalUrl: c.portal_url || '',
        plan: c.plan || meta.tier || 'starter',
        setupFee: parseFloat(c.setup_fee || 0),
        recurringFee: parseFloat(c.recurring_fee || 0),
        status: c.status || 'active',
        referredBy: c.referred_by || null,
        commissionStatus: c.commission_status || 'pending',
        theme: meta.theme || 'theme-onyx',
        font: meta.font || 'Outfit',
        logo: meta.logo || '',
        type: meta.type || 'dining',
        flyerBg: meta.flyerBg || '#0a0a0a',
        flyerAccent: meta.flyerAccent || c.color || '#d4af37',
        flyerText: meta.flyerText || '#ffffff',
        tier: meta.tier || (['starter', 'growth', 'pro'].includes((c.plan || '').toLowerCase()) ? c.plan.toLowerCase() : 'starter'),
        ownerPassword: meta.ownerPassword || 'metrix123',
        whatsapp: meta.whatsapp || '',
        gmbUrl: meta.gmbUrl || dest || '',
        menuUrl: meta.menuUrl || '',
        ntfyTopic: meta.ntfyTopic || '',
        alertWebhook: meta.alertWebhook || '',
        wifiSsid: meta.wifiSsid || '',
        wifiPass: meta.wifiPass || '',
        features: {
            vip: meta.features?.vip !== false,
            service: meta.features?.service !== false,
            games: meta.features?.games !== false,
            menu: meta.features?.menu !== false,
            wifi: meta.features?.wifi !== false,
            wifiGate: Boolean(meta.features?.wifiGate),
            callManager: meta.features?.callManager !== false,
            complaint: meta.features?.complaint !== false
        },
        stampGoal: meta.stampGoal || 8,
        stampReward: meta.stampReward || 'Complimentary Dessert / Coffee',
        stampPin: meta.stampPin || '1234',
        d2cEnabled: Boolean(meta.d2cEnabled),
        menuItems: Array.isArray(meta.menuItems) ? meta.menuItems : [],
        serviceFee: (typeof meta.serviceFee === 'number') ? meta.serviceFee : 20,
        qrSettings: {
            qrDotStyle: meta.qrDot || 'theme-default',
            qrCornerStyle: meta.qrCorner || 'extra-rounded'
        },
        flyerSettings: {
            flyerHeadline: meta.flyerHeadline || 'How was your experience today?',
            flyerSub: meta.flyerSub || 'Scan to share your feedback and unlock VIP privileges.',
            flyerFooter: meta.flyerFooter || 'Powered by METRIX',
            flyerTextStyle: meta.flyerTextStyle || 'normal'
        }
    };
}

async function sbFetch(path, options = {}) {
    const url = `${window.SUPABASE_URL}/rest/v1/${path}`;
    const headers = {
        'apikey': window.SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${window.SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        ...(options.headers || {})
    };
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) throw new Error(`Supabase REST ${res.status}`);
    if (res.status === 204 || (options.method === 'POST' && headers.Prefer && headers.Prefer.includes('return=minimal'))) return null;
    const text = await res.text();
    return text ? JSON.parse(text) : null;
}

window.MetrixCloud = {
    unpackRow: unpackCampaignRow,
    sbFetch: sbFetch,
    async listVenues() {
        try {
            if (supabaseClient) {
                const { data, error } = await supabaseClient.from('campaigns').select('*').order('id', { ascending: false });
                if (!error && data) return data.map(unpackCampaignRow);
            }
            const data = await sbFetch('campaigns?order=id.desc');
            return Array.isArray(data) ? data.map(unpackCampaignRow) : [];
        } catch (err) {
            console.warn('listVenues failed:', err);
            return [];
        }
    },
    async getVenueConfig({ id, name, email } = {}) {
        try {
            let queryPath = '';
            if (id) queryPath = `campaigns?id=eq.${encodeURIComponent(id)}&limit=1`;
            else if (email) queryPath = `campaigns?email=ilike.${encodeURIComponent(email.trim())}&limit=1`;
            else if (name) queryPath = `campaigns?name=ilike.${encodeURIComponent(name.trim())}&limit=1`;
            else return null;

            const data = await sbFetch(queryPath);
            if (!data || data.length === 0) return null;
            return unpackCampaignRow(data[0]);
        } catch (err) {
            console.warn('getVenueConfig failed:', err);
            return null;
        }
    },
    async upsertVenueConfig(c) {
        const id = c.id || Date.now().toString();
        const merged = { ...c, id };
        const finalDestination = packCampaignMeta(merged);
        const origin = (window.location.origin && window.location.origin !== 'null' && !window.location.origin.startsWith('file:')) ? window.location.origin : 'https://metrixmedia.agency';
        const portalUrl = merged.portalUrl || `${origin}/portal.html?id=${encodeURIComponent(id)}&name=${encodeURIComponent(merged.name)}`;

        const payload = {
            id: id,
            name: merged.name,
            category: merged.category || 'dining',
            email: merged.email || '',
            color: merged.flyerAccent || merged.color || '#d4af37',
            destination: finalDestination,
            portal_url: portalUrl,
            plan: merged.tier || merged.plan || 'starter',
            setup_fee: merged.setupFee || 0,
            recurring_fee: merged.recurringFee || 0,
            status: merged.status || 'active',
            referred_by: merged.referredBy || null,
            commission_status: merged.commissionStatus || 'pending'
        };

        try {
            if (supabaseClient) {
                const { error } = await supabaseClient.from('campaigns').upsert([payload]);
                if (error) return { error };
            } else {
                await sbFetch('campaigns', {
                    method: 'POST',
                    headers: { 'Prefer': 'resolution=merge-duplicates,return=minimal' },
                    body: JSON.stringify(payload)
                });
            }
            return { data: unpackCampaignRow(payload) };
        } catch (err) {
            console.error('upsertVenueConfig error:', err);
            return { error: err };
        }
    }
};

// ----------------------------------------------------
// Supabase Sync Engine (Local Storage Interceptor)
// ----------------------------------------------------
if (supabaseClient) {
    let prevCampaigns = JSON.parse(localStorage.getItem('repushield_campaigns')) || [];
    let prevAgents = JSON.parse(localStorage.getItem('repushield_agents')) || [];
    let prevClients = JSON.parse(localStorage.getItem('repushield_clients')) || [];

    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
        originalSetItem.apply(this, arguments);

        let list = [];
        try {
            list = JSON.parse(value);
        } catch (err) {
            return;
        }

        if (key === 'repushield_campaigns') {
            const currentIds = list.map(item => item.id);
            prevCampaigns.forEach(async (oldItem) => {
                if (!currentIds.includes(oldItem.id)) {
                    await supabaseClient.from('campaigns').delete().eq('id', oldItem.id);
                }
            });
            prevCampaigns = list;
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

    async function syncCampaigns(list) {
        for (const c of list) {
            await window.MetrixCloud.upsertVenueConfig(c);
        }
    }

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

    async function pullCloudData() {
        try {
            const { data: dbCampaigns } = await supabaseClient.from('campaigns').select('*');
            if (dbCampaigns) {
                const mappedCampaigns = dbCampaigns.map(unpackCampaignRow);
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
            window.dispatchEvent(new Event('dbSyncComplete'));
        } catch (err) {
            console.error("Failed to sync data from Supabase:", err);
        }
    }

    pullCloudData();
}
