export default async function handler(req, res) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { city, niche } = req.query;

    if (!city || !niche) {
        return res.status(400).json({ error: 'Missing city or niche' });
    }

    const API_KEY = process.env.SERPAPI_KEY;

    if (!API_KEY) {
        // Fallback to Simulation Mode if no API key is present
        // This is safe and ensures the UI doesn't crash during investor demos if the key is missing
        console.log("No SERPAPI_KEY found, returning simulated data.");
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2500));

        const dummyLeads = [
            { name: `The ${niche} Place`, rating: 2.8, reviews: 14, address: `123 Main St, ${city}` },
            { name: `${city} ${niche} Hub`, rating: 3.2, reviews: 42, address: `45 North Ave, ${city}` },
            { name: `Classic ${niche}`, rating: 1.5, reviews: 8, address: `Sector 4, ${city}` },
            { name: `Premier ${niche} Services`, rating: 3.4, reviews: 112, address: `Downtown ${city}` }
        ];
        return res.status(200).json({ success: true, leads: dummyLeads, simulated: true });
    }

    try {
        const query = `${niche} in ${city}`;
        const url = `https://serpapi.com/search.json?engine=google_maps&q=${encodeURIComponent(query)}&type=search&api_key=${API_KEY}`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            return res.status(500).json({ error: data.error });
        }

        const localResults = data.local_results || [];

        // Filter for leads with poor ratings (<= 3.9)
        const poorLeads = localResults.filter(r => r.rating !== undefined && r.rating <= 3.9).map(r => ({
            name: r.title,
            rating: r.rating,
            reviews: r.reviews,
            address: r.address || "No address provided",
            phone: r.phone || "No phone provided",
            website: r.website || ""
        }));

        return res.status(200).json({ success: true, leads: poorLeads, simulated: false });

    } catch (error) {
        console.error("Scraping Error:", error);
        return res.status(500).json({ error: 'Failed to scrape leads' });
    }
}
