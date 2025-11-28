'use client';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

export default function ClientWeather({ defaultLocation, locations }) {
  const [selected, setSelected] = useState(defaultLocation);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedDay, setExpandedDay] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchForecast(`${selected.lat},${selected.lon}`);
    setExpandedDay(null);
  }, [selected]);

  async function fetchForecast(q) {
    setLoading(true); setError(null); setData(null);
    try {
      const res = await fetch(`/api/weather?q=${encodeURIComponent(q)}&days=7`);
      if (!res.ok) throw new Error('API error');
      const json = await res.json();
      setData(json);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="bg-white rounded-2xl p-4 shadow flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">{selected.name}</div>
          <div className="text-xs text-slate-500">{selected.aimag}</div>
        </div>
        <div className="text-sm text-slate-500">{loading ? 'Ачааллаж...' : (error ? `Алдаа: ${error}` : 'Мэдээлэл шинэчлэгдсэн')}</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        {locations.map(loc => (
          <button
            key={loc.id}
            onClick={() => setSelected(loc)}
            className={clsx('p-3 rounded-lg text-left', selected.id === loc.id ? 'bg-sky-50 border border-sky-200' : 'hover:bg-slate-50')}
          >
            <div className="font-medium">{loc.name}</div>
            <div className="text-xs text-slate-400">{loc.aimag}</div>
          </button>
        ))}
      </div>

      {!data && !loading && <div className="p-6 bg-white rounded-2xl shadow mt-4">Сонгоно уу</div>}

      {data && (
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.forecast.forecastday.map(day => (
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
                  <button className="px-3 py-1 rounded bg-sky-50 border" onClick={() => setExpandedDay(day.date)}>Цагийн дэлгэрэнгүй</button>
                </div>
              </article>
            ))}
          </div>

          {expandedDay && (
            <div className="bg-white rounded-2xl p-4 shadow">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">{expandedDay} — цагийн дэлгэрэнгүй</h3>
                <button className="text-sm text-slate-500" onClick={() => setExpandedDay(null)}>Хаах</button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {data.forecast.forecastday.find(d => d.date === expandedDay).hour.map(h => (
                  <div key={h.time} className="p-2 border rounded">
                    <div className="text-xs text-slate-500">{new Date(h.time).toLocaleTimeString('mn-MN', { hour: '2-digit', minute: '2-digit' })}</div>
                    <div className="font-medium">{Math.round(h.temp_c)}°C</div>
                    <div className="text-xs text-slate-400">{h.condition.text}</div>
                    <div className="text-xs text-slate-400">{h.wind_kph} kph • {h.precip_mm} mm</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
