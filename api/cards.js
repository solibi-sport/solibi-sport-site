export default async function handler(req, res) {
    // הגדרות אבטחה ו-CORS כדי לאפשר לאתר שלך לפנות לשרת
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // שולף את מילת החיפוש שהגולש הקליד
    const query = req.query.q;
    // שולף את המפתח הסודי מהכספת של Vercel
    const apiKey = process.env.SPORTSCARDPRO_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: "Missing API Key in Vercel" });
    }

    if (!query) {
        return res.status(400).json({ error: "Missing search query" });
    }

    try {
        // פנייה לשרתים של SportsCardPro
        // ה-API שלהם בדרך כלל עובד עם פרמטר t עבור המפתח
        const apiUrl = `https://www.sportscardpro.com/api/products?t=${apiKey}&q=${encodeURIComponent(query)}`;
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`SportsCardPro API Error: ${response.status}`);
        }

        const data = await response.json();

        // אנחנו עוטפים את התשובה במבנה שהחזית שלנו מצפה לו
        // נתאים את זה למבנה המדויק של SportsCardPro (הם מחזירים מערך של products)
        const formattedResults = (data.products || []).map(item => ({
            id: item.id,
            name: item['product-name'] || item.name,
            set: item['console-name'] || 'ספורט', // בספורטקארד זה בדרך כלל הסדרה/שנה
            image: item.image || 'https://via.placeholder.com/30x40?text=Card',
            price: item['loose-price'] || item.price || 0
        }));

        res.status(200).json({ results: formattedResults });

    } catch (error) {
        console.error("Error fetching from SportsCardPro:", error);
        res.status(500).json({ error: "Failed to fetch data from API" });
    }
}
