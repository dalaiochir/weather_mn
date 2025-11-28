import { LOCATIONS } from '../lib/locations';
import Link from 'next/link';
import ClientWeather from './components/client-weather';

export default function Page() {
  // render initial UI — the heavy fetching is done in the client component so user can switch locations without full page reload
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <aside className="lg:col-span-1 bg-white rounded-2xl p-4 shadow">
        <h2 className="font-semibold mb-3">Аймаг, дүүрэг</h2>
        <div className="space-y-2 max-h-[70vh] overflow-auto">
          {LOCATIONS.map(loc => (
            <a
              key={loc.id}
              href={`#${loc.id}`}
              className="block p-2 rounded-lg hover:bg-slate-50"
            >
              <div className="font-medium">{loc.name}</div>
              <div className="text-xs text-slate-400">{loc.aimag} • {loc.lat.toFixed(2)}, {loc.lon.toFixed(2)}</div>
            </a>
          ))}
        </div>
        <div className="mt-4 text-xs text-slate-500">Дээрээс сонгоод доорх дэлгэрэнгүй талбар руу шүргэж очно.</div>
      </aside>

      <section className="lg:col-span-3 space-y-6">
        {/* Client component handles fetching and interactive UI */}
        <ClientWeather defaultLocation={LOCATIONS[0]} locations={LOCATIONS} />
      </section>
    </div>
  );
}
