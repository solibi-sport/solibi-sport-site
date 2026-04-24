export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const query = req.query.q;
    const apiKey = process.env.SPORTSCARDS_API_KEY;

    // בדיקה קשוחה יותר למפתח - מוודא שהוא באמת קיים ולא ריק
    if (!apiKey || apiKey === "undefined" || apiKey.trim() === "") {
        return res.status(500).json({ error: "Vercel Error: The API Key is empty or missing. Please check Vercel environment variables." });
    }

    if (!query) {
        return res.status(400).json({ error: "Missing search query" });
    }

    try {
        // מנקה רווחים מיותרים מהמפתח למקרה שהועתק בטעות עם רווח
        const cleanApiKey = apiKey.trim();
        const apiUrl = `https://www.sportscardpro.com/api/products?q=${encodeURIComponent(query)}&t=${cleanApiKey}`;
        
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status === "error" || data.error) {
            return res.status(400).json({ 
                error: "SportsCardPro API Error", 
                raw: data,
                debug_url_used: apiUrl.replace(cleanApiKey, "HIDDEN_TOKEN") 
            });
        }

        const formattedResults = (data.products || []).map(item => ({
            id: item.id,
            name: item['product-name'] || item.name,
            set: item['console-name'] || 'ספורט', 
            image: item.image || 'https://via.placeholder.com/30x40?text=Card',
            price: item['loose-price'] || item.price || 0
        }));

        res.status(200).json({ results: formattedResults });

    } catch (error) {
        res.status(500).json({ error: "Failed to communicate with API", details: error.message });
    }
}
