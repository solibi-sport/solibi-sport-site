export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const query = req.query.q;
    const apiKey = process.env.SPORTSCARDS_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: "Vercel: Missing API Key" });
    }

    if (!query) {
        return res.status(400).json({ error: "Missing search query" });
    }

    try {
        const apiUrl = `https://www.sportscardpro.com/api/products?t=${apiKey}&q=${encodeURIComponent(query)}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        // גלאי שגיאות מיוחד: אם ספורטקארדס מחזירים שגיאה (כמו מפתח לא תקין)
        if (data.status === "error" || data.error) {
            console.error("API Error Response:", data);
            return res.status(400).json({ error: data.message || "SportsCardPro API Error", raw: data });
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
        console.error("Fetch Error:", error);
        res.status(500).json({ error: "Failed to communicate with API" });
    }
}
