# Mongolia Weather — Next.js 14 (App Router)

## Setup
1. Copy `.env.example` to `.env.local` and add WEATHERAPI_KEY.
2. npm install
3. npm run dev

## Deploy to Vercel
1. Push to GitHub.
2. Create new project in Vercel and connect the repo.
3. Add environment variable WEATHERAPI_KEY in Vercel Project Settings.
4. Deploy.

Notes:
- The API key is used only in `app/api/weather/route.js` (server/edge).
- The app uses Edge runtime for the API route and Cache-Control for CDN caching.
