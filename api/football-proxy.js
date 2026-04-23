export default async function handler(req, res) {
    // הראוטר לוקח את הכתובת שביקשת ואת כל הפרמטרים
    const { endpoint, ...queryParams } = req.query;
    const API_KEY = process.env.FOOTBALL_API_KEY;

    // בונה את הכתובת האמיתית לאמריקאים מאחורי הקלעים
    const url = new URL(`https://v3.football.api-sports.io/${endpoint}`);
    Object.keys(queryParams).forEach(key => url.searchParams.append(key, queryParams[key]));

    try {
        const response = await fetch(url.toString(), {
            headers: { "x-apisports-key": API_KEY } // מצרף את המפתח הסודי מהכספת!
        });
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch data" });
    }
}
