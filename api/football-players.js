export default async function handler(req, res) {
    const { endpoint, league, season } = req.query;
    const API_KEY = process.env.FOOTBALL_API_KEY;

    try {
        const response = await fetch(`https://v3.football.api-sports.io/players/${endpoint}?league=${league}&season=${season}`, {
            headers: { "x-apisports-key": API_KEY }
        });
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch players" });
    }
}
