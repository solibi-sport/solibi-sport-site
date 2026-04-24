export default async function handler(req, res) {
    // הגדרות אבטחה ו-CORS כדי לאפשר לאתר שלך לפנות לשרת
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // שולף את מילת החיפוש שהגולש הקליד
    const query = req.query.q;
    
    // שינוי חשוב: שולף את המפתח בדיוק לפי השם שמופיע לך ב-Vercel!
    const apiKey = process.env.SPORTSCARDS_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: "Missing API Key in Vercel" });
    }

    if (!query) {
        return res.status(400).json({ error: "Missing search query" });
    }

    try {
        // פנייה לשרתים של SportsCardPro
        const apiUrl = `https://www.sportscardpro.com/api/products?t=${apiKey}&q=${encodeURIComponent(query)}`;
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`SportsCardPro API Error: ${response.status}`);
        }

        const data = await response.json();

        // מתאימים את התשובה למבנה שגיבשנו
        const formattedResults = (data.products || []).map(item => ({
            id: item.id,
            name: item['product-name'] || item.name,
            set: item['console-name'] || 'ספורט', 
            image: item.image || 'https://via.placeholder.com/30x40?text=Card',
            price: item['loose-price'] || item.price || 0
        }));

        res.status(200).json({ results: formattedResults });

    } catch (error) {
        console.error("Error fetching from SportsCardPro:", error);
        res.status(500).json({ error: "Failed to fetch data from API" });
    }
}
