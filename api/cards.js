export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const query = req.query.q;
    const apiKey = process.env.SPORTSCARDS_API_KEY;

    if (!apiKey || apiKey === "undefined" || apiKey.trim() === "") {
        return res.status(500).json({ error: "API Key is missing." });
    }

    if (!query) {
        return res.status(400).json({ error: "Missing search query" });
    }

    try {
        const cleanApiKey = apiKey.trim();
        
        // הטריק שלנו: מוסיפים את המילה "card" בסתר כדי להכריח את השרת
        // להביא קלפי ספורט אמיתיים ב-20 התוצאות הראשונות, ולא קומיקס או משחקים.
        let apiQuery = query.trim();
        const lowerQ = apiQuery.toLowerCase();
        if (!lowerQ.includes('card') && !lowerQ.includes('cards')) {
            apiQuery += " card";
        }

        const apiUrl = `https://www.pricecharting.com/api/products?t=${cleanApiKey}&q=${encodeURIComponent(apiQuery)}`;
        
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status === "error" || data.error) {
            return res.status(400).json({ error: "API Error", raw: data });
        }

        // === המסנן החכם (משאיר רק ענפי ספורט אמיתיים) ===
        const filteredProducts = (data.products || []).filter(item => {
            const category = (item['console-name'] || "").toLowerCase();
            const name = (item['product-name'] || item.name || "").toLowerCase();
            
            // מוודא שהקטגוריה שייכת לענף ספורט
            const isSportsCard = category.includes('soccer') || 
                                 category.includes('football') || 
                                 category.includes('basketball') || 
                                 category.includes('baseball') ||
                                 category.includes('hockey') ||
                                 category.includes('ufc') ||
                                 category.includes('wrestling') ||
                                 category.includes('boxing') ||
                                 category.includes('racing');
                                 
            // חוסם מפורשות כל מה שהוא קומיקס או צעצועים (למקרה שמשהו הסתנן)
            const isJunk = category.includes('marvel') || 
                           category.includes('star wars') || 
                           category.includes('comic') || 
                           category.includes('pokemon') ||
                           category.includes('magic') ||
                           name.includes('lego');

            return isSportsCard && !isJunk;
        });

        const formattedResults = filteredProducts.map(item => ({
            id: item.id,
            name: item['product-name'] || item.name,
            set: item['console-name'], 
            image: item.image || 'https://via.placeholder.com/30x40?text=Card',
            price: item['loose-price'] || item.price || 0
        }));

        res.status(200).json({ results: formattedResults });

    } catch (error) {
        res.status(500).json({ error: "Failed to communicate with API", details: error.message });
    }
}
