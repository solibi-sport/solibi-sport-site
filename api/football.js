export default async function handler(req, res) {
    const API_KEY = process.env.FOOTBALL_API_KEY;

    try {
        const response = await fetch("https://v3.football.api-sports.io/fixtures?live=all", {
            headers: {
                "x-rapidapi-key": API_KEY,
                "x-rapidapi-host": "v3.football.api-sports.io"
            }
        });
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch live scores" });
    }
}
