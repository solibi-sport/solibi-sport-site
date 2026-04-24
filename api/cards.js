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
        
        // התיקון האמיתי: הכתובת הרשמית של קלפי הספורט (sportscards - עם S!)
        const apiUrl = `https://www.sportscardspro.com/api/products?t=${cleanApiKey}&q=${encodeURIComponent(query)}`;
        
        const response = await fetch(apiUrl);
        const data = await response.json();

        // אם יש שגיאה, מציגים אותה
        if (data.status === "error" || data.error) {
            return res.status(400).json({ error: "API Error", raw: data });
        }

        // שום מסננים מסובכים! פשוט לוקחים את הקלפים מהמאגר שמוקדש נטו לספורט
        const formattedResults = (data.products || []).map(item => ({
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
