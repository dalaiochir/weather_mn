import { useEffect, useState } from 'react';
import { LOCATIONS } from '../lib/locations';
import clsx from 'clsx';


export default function Home() {
const [selected, setSelected] = useState(LOCATIONS[0]);
const [forecast, setForecast] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [expandedDay, setExpandedDay] = useState(null);


useEffect(() => {
if (!selected) return;
fetchForecast(`${selected.lat},${selected.lon}`);
setExpandedDay(null);
}, [selected]);


async function fetchForecast(q) {
setLoading(true); setError(null); setForecast(null);
try {
const res = await fetch(`/api/weather?q=${encodeURIComponent(q)}&days=7`);
if (!res.ok) throw new Error('API error');
const data = await res.json();
setForecast(data);
} catch (e) {
setError(e.message);
} finally {
setLoading(false);
}
}
return (
<div className="min-h-screen bg-gradient-to-b from-sky-50 to-white text-slate-900">
<div className="max-w-7xl mx-auto p-6">
<header className="flex items-center justify-between mb-6">
<h1 className="text-3xl font-extrabold">Монгол цаг агаар — <span className="text-sky-600">7 хоног / цаг</span></h1>
<div className="text-sm text-slate-500">WeatherAPI.com • Vercel-ready</div>
</header>


<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
<aside className="lg:col-span-1 bg-white rounded-2xl p-4 shadow">
<h2 className="font-semibold mb-3">Аймаг, дүүрэг</h2>
<div className="space-y-2 max-h-[60vh] overflow-auto">
{LOCATIONS.map(loc => (
<button key={loc.id} onClick={()=>setSelected(loc)} className={clsx('w-full text-left p-2 rounded-lg', selected.id===loc.id? 'bg-sky-50 border border-sky-200':'hover:bg-slate-50')}>
<div className="font-medium">{loc.name}</div>
<div className="text-xs text-slate-400">{loc.aimag} • {loc.lat.toFixed(2)}, {loc.lon.toFixed(2)}</div>
</button>
))}
</div>
<div className="mt-4 text-xs text-slate-500">Сонгоход тухайн газрын 7 хоногийн цаг агаар харагдана.</div>
</aside>


<main className="lg:col-span-3">
<div className="bg-white rounded-2xl p-4 shadow mb-4">
<div className="flex items-center justify-between">
<div>
<div className="text-lg font-semibold">{selected.name}</div>
<div className="text-sm text-slate-500">{selected.aimag}</div>
</div>
<div className="text-sm text-slate-500">{loading ? 'Ачааллаж...' : (error ? `Алдаа: ${error}` : 'Мэдээлэл шинэчлэгдсэн')}</div>
</div>
</div>

{!forecast && !loading && <div className="p-6 bg-white rounded-2xl shadow">Сонгоно уу</div>}


{forecast && (
<section className="space-y-4">
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
{forecast.forecast.forecastday.map(day => (
<article key={day.date} className="bg-white p-4 rounded-2xl shadow">
<div className="flex items-start justify-between">
<div>
<div className="font-semibold">{day.date}</div>
<div className="text-xs text-slate-500">{day.day.condition.text}</div>
</div>
<div className="text-right">
<div className="text-xl font-bold">{Math.round(day.day.avgtemp_c)}°C</div>
<div className="text-xs text-slate-400">Min {Math.round(day.day.mintemp_c)} • Max {Math.round(day.day.maxtemp_c)}</div>
</div>
</div>


<div className="mt-3 flex items-center justify-between">
<div className="text-sm text-slate-500">precip: {day.day.totalprecip_mm} mm • {day.day.maxwind_kph} kph</div>
<button className="px-3 py-1 rounded bg-sky-50 border" onClick={()=>setExpandedDay(day.date)}>Цагийн дэлгэрэнгүй</button>
</div>
</article>
))}
</div>

{expandedDay && (
<div className="bg-white rounded-2xl p-4 shadow">
<div className="flex items-center justify-between mb-3">
<h3 className="font-semibold">{expandedDay} — цагийн дэлгэрэнгүй</h3>
<button className="text-sm text-slate-500" onClick={()=>setExpandedDay(null)}>Хаах</button>
</div>
<div className="grid grid-cols-2 md:grid-cols-4 gap-2">
{forecast.forecast.forecastday.find(d=>d.date===expandedDay).hour.map(h=> (
<div key={h.time} className="p-2 border rounded">
<div className="text-xs text-slate-500">{new Date(h.time).toLocaleTimeString('mn-MN',{hour:'2-digit',minute:'2-digit'})}</div>
<div className="font-medium">{Math.round(h.temp_c)}°C</div>
<div className="text-xs text-slate-400">{h.condition.text}</div>
<div className="text-xs text-slate-400">{h.wind_kph} kph • {h.precip_mm} mm</div>
</div>
))}
</div>
</div>
)}


</section>
)}


</main>
</div>
</div>
</div>
);
}