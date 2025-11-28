import { NextResponse } from 'next/server';

export const runtime = 'edge'; // use edge runtime for low-latency proxy (Vercel Edge)
export const revalidate = 60; // optional: ISR-like hint (seconds)

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const q = url.searchParams.get('q');
    const days = url.searchParams.get('days') || '7';
    if (!q) return NextResponse.json({ error: 'Missing q parameter' }, { status: 400 });

    const key = process.env.WEATHERAPI_KEY;
    if (!key) return NextResponse.json({ error: 'Missing WEATHERAPI_KEY' }, { status: 500 });

    // Build WeatherAPI request
    const weatherUrl = `https://api.weatherapi.com/v1/forecast.json?key=${encodeURIComponent(key)}&q=${encodeURIComponent(q)}&days=${encodeURIComponent(days)}&aqi=no&alerts=no`;

    // Fetch from server side (Edge fetch)
    const res = await fetch(weatherUrl, { next: { revalidate: 60 } });
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: 'WeatherAPI error', detail: text }, { status: res.status });
    }
    const data = await res.json();

    // Response caching headers for Vercel Edge
    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
      }
    });
  } catch (err) {
    return NextResponse.json({ error: 'Server error', detail: String(err) }, { status: 500 });
  }
}
