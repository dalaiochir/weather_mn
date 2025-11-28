import fetch from 'node-fetch';


export default async function handler(req, res) {
const { q, days = 7 } = req.query;
const key = process.env.WEATHERAPI_KEY;
if (!key) return res.status(500).json({ error: 'Missing WEATHERAPI_KEY' });
if (!q) return res.status(400).json({ error: 'Missing q parameter' });


const url = `https://api.weatherapi.com/v1/forecast.json?key=${encodeURIComponent(key)}&q=${encodeURIComponent(q)}&days=${encodeURIComponent(days)}&aqi=no&alerts=no`;
try {
const r = await fetch(url);
if (!r.ok) return res.status(r.status).json({ error: 'WeatherAPI error' });
const data = await r.json();
return res.status(200).json(data);
} catch (err) {
console.error(err);
return res.status(500).json({ error: 'Fetch failed' });
}
}