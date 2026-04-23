export default async function handler(req, res) {
    const { q } = req.query; // המילה שהמשתמש חיפש
    const API_KEY = process.env.SPORTSCARDS_API_KEY; // המפתח יישלף מהכספת של ורסל

    if (!q) return res.status(400).json({ error: "Query is required" });

    try {
        const response = await fetch(`https://www.sportscardspro.com/api/products?t=${API_KEY}&q=${encodeURIComponent(q)}`);
        const data = await response.json();
        
        // מחזיר את הנתונים לאתר שלך
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch cards" });
    }
}
