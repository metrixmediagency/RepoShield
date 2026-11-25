function parseMetaFromDestination(dest) {
    if (!dest || typeof dest !== 'string' || !dest.includes('_repushield_meta=')) return {};
    try {
        const parts = dest.split('_repushield_meta=');
        return JSON.parse(decodeURIComponent(parts[1]));
    } catch (e) {
        return {};
    }
}

function normalizeWaPhone(raw) {
    let digits = String(raw || '').replace(/\D/g, '');
    if (!digits) return '';
    if (digits.startsWith('00')) digits = digits.slice(2);
    if (digits.length === 10 && /^[6-9]/.test(digits)) digits = '91' + digits;
    else if (digits.length === 11 && /^0[6-9]/.test(digits)) digits = '91' + digits.slice(1);
    else if (digits.length === 9 && digits.startsWith('5')) digits = '971' + digits;
    else if (digits.length === 10 && digits.startsWith('05')) digits = '971' + digits.slice(1);
    return (digits.length >= 10 && digits.length <= 15) ? digits : '';
}

function sanitizeParamText(str, maxLen = 200) {
    const clean = String(str || '').replace(/[\r\n\t]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
    return clean.slice(0, maxLen) || '-';
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method Not Allowed' });

    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
        const venueId = String(body.venueId || '').trim();
        const venueName = String(body.venueName || '').trim();
        const tableLabel = sanitizeParamText(body.table || 'Table Guest', 60);
        const alertType = body.alertType === 'shield' ? 'shield' : 'service';
        const messageText = sanitizeParamText(body.message || 'Table Assistance Requested', 240);
        const guestPhone = sanitizeParamText(body.guestPhone || '', 30);

        if (!venueId && !venueName) {
            return res.status(400).json({ ok: false, error: 'Missing venueId or venueName' });
        }

        const supabaseUrl = process.env.SUPABASE_URL || 'https://lvjwccjobbjaxpqcfrtz.supabase.co';
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_HG5SCpe-lMYJLoF3UxwbBQ_JYLXMK-2';

        // Strict server-side venue lookup by exact unique ID first
        const queryFilter = venueId
            ? `id=eq.${encodeURIComponent(venueId)}`
            : `name=ilike.${encodeURIComponent(venueName)}`;

        const dbRes = await fetch(`${supabaseUrl}/rest/v1/campaigns?${queryFilter}&select=id,name,status,destination&limit=1`, {
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`
            }
        });

        if (!dbRes.ok) {
            return res.status(502).json({ ok: false, error: 'Database lookup failed' });
        }

        const rows = await dbRes.json();
        if (!Array.isArray(rows) || rows.length === 0) {
            return res.status(404).json({ ok: false, error: 'Venue not found' });
        }

        const venue = rows[0];
        if ((venue.status || '').toLowerCase() === 'suspended') {
            return res.status(403).json({ ok: false, error: 'Venue is suspended' });
        }

        const meta = parseMetaFromDestination(venue.destination);
        const rawRecipients = String(meta.whatsapp || '')
            .split(',')
            .map(s => normalizeWaPhone(s))
            .filter(Boolean)
            .slice(0, 3);

        if (rawRecipients.length === 0) {
            return res.status(200).json({
                ok: false,
                configured: false,
                error: 'No valid WhatsApp alert number configured for this venue'
            });
        }

        const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
        const accessToken = process.env.WHATSAPP_ACCESS_TOKEN || '';

        if (!phoneNumberId || !accessToken) {
            return res.status(200).json({
                ok: false,
                configured: false,
                venueId: venue.id,
                recipientsCount: rawRecipients.length,
                message: 'Meta WhatsApp Cloud API credentials (WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_ACCESS_TOKEN) not yet set in Vercel env.'
            });
        }

        const resolvedVenueName = sanitizeParamText(venue.name || venueName || 'Venue', 60);
        const urgentPrefix = alertType === 'shield' ? 'URGENT · ' : '';
        const paramVenue = `${urgentPrefix}${resolvedVenueName}`;
        const paramTable = tableLabel;
        const paramDetail = (guestPhone && guestPhone !== '-')
            ? `${messageText} (Guest: ${guestPhone})`
            : messageText;

        const useTextMode = process.env.WHATSAPP_USE_TEXT === 'true';
        const templateName = alertType === 'shield'
            ? (process.env.WHATSAPP_TEMPLATE_SHIELD || process.env.WHATSAPP_TEMPLATE_SERVICE || 'metrix_table_alert')
            : (process.env.WHATSAPP_TEMPLATE_SERVICE || 'metrix_table_alert');
        const templateLang = process.env.WHATSAPP_TEMPLATE_LANG || 'en';
        const graphUrl = `https://graph.facebook.com/v21.0/${encodeURIComponent(phoneNumberId)}/messages`;

        const results = await Promise.all(rawRecipients.map(async (toNumber) => {
            const payload = useTextMode
                ? {
                    messaging_product: 'whatsapp',
                    to: toNumber,
                    type: 'text',
                    text: {
                        preview_url: false,
                        body: `${alertType === 'shield' ? '🚨 URGENT FLOOR SHIELD' : '🛎️ TABLE SERVICE'}\nVenue: ${resolvedVenueName}\nLocation: ${paramTable}\nRequest: ${paramDetail}`
                    }
                }
                : {
                    messaging_product: 'whatsapp',
                    to: toNumber,
                    type: 'template',
                    template: {
                        name: templateName,
                        language: { code: templateLang },
                        components: [
                            {
                                type: 'body',
                                parameters: [
                                    { type: 'text', text: paramVenue },
                                    { type: 'text', text: paramTable },
                                    { type: 'text', text: paramDetail }
                                ]
                            }
                        ]
                    }
                };

            const waRes = await fetch(graphUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const waData = await waRes.json().catch(() => ({}));
            return {
                to: `***${toNumber.slice(-4)}`,
                status: waRes.status,
                ok: waRes.ok,
                messageId: waData?.messages?.[0]?.id || null,
                error: waRes.ok ? null : (waData?.error?.message || 'Meta API error')
            };
        }));

        const anySent = results.some(r => r.ok);
        return res.status(anySent ? 200 : 502).json({
            ok: anySent,
            configured: true,
            venueId: venue.id,
            venueName: resolvedVenueName,
            alertType,
            results
        });
    } catch (err) {
        console.error('WhatsApp Alert API Error:', err);
        return res.status(500).json({ ok: false, error: 'Internal Server Error' });
    }
}
