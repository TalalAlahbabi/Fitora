# Fitora 🍃

**Nutrition, simplified.** A fast, minimal food tracking web app with access to 900,000+ foods via the USDA FoodData Central API.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

## Features

- **900,000+ foods** — live search against the USDA FoodData Central database
- **Instant local results** — 30 built-in common foods load with zero latency while USDA fetches
- **Smart macros** — protein, carbs, fat, fiber, sugar, sodium tracking with live scaling by gram amount
- **Meal grouping** — breakfast, lunch, dinner, snacks, auto-detected by time of day
- **Daily coaching** — contextual feedback based on what you've eaten and when
- **Progress view** — 7-day calorie chart with goal line, streak counter, weight tracking, achievements
- **Meal plans** — curated plans for fat loss, muscle gain, and plant-based diets
- **Offline-first** — all logged data stays in `localStorage`, survives refreshes and reloads
- **Dark mode** — refined emerald palette in both themes
- **No signup** — open the app and start logging

## Tech stack

- [React 18](https://react.dev/) + [Vite](https://vite.dev/)
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Lucide React](https://lucide.dev/) for icons
- [USDA FoodData Central API](https://fdc.nal.usda.gov/api-guide/) for the food database
- `localStorage` for persistence

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- `npm` (comes with Node)
- A free USDA API key ([sign up here](https://fdc.nal.usda.gov/api-key-signup) — takes 30 seconds)

### Install

```bash
git clone https://github.com/YOUR_USERNAME/fitora.git
cd fitora
npm install
```

### Configure the USDA API key

1. Get a free key at https://fdc.nal.usda.gov/api-key-signup
2. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
3. Open `.env.local` and paste your key:
   ```
   VITE_USDA_API_KEY=your_actual_key_here
   ```

> **Note:** `.env.local` is gitignored by default — your key will never be committed. If you skip this step, the app falls back to `DEMO_KEY` which works but has much stricter rate limits (30 requests/hour).

### Run locally

```bash
npm run dev
```

Opens at `http://localhost:5173`.

### Build for production

```bash
npm run build
npm run preview
```

The optimized build is output to `dist/`.

## Project structure

```
fitora/
├── public/
│   └── favicon.svg
├── src/
│   ├── FoodTracker.jsx   # Main app component (all logic)
│   ├── main.jsx          # React entry point
│   └── index.css         # Global styles
├── .env.example          # Template for environment variables
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Deployment

### Vercel (recommended)

1. Push your repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. **Before clicking Deploy**, expand **Environment Variables** and add:
   - Name: `VITE_USDA_API_KEY`
   - Value: your USDA API key
4. Click **Deploy**. Done — live URL in ~60 seconds.

If you forgot step 3, add the variable later under **Settings → Environment Variables** and trigger a redeploy.

### Netlify

Same as Vercel — add the env var under **Site settings → Environment variables** before deploying.

### GitHub Pages

```bash
npm install --save-dev gh-pages
```

Add to `package.json`:
```json
"homepage": "https://YOUR_USERNAME.github.io/fitora",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

Then `npm run deploy`. Note: GitHub Pages doesn't support env variables at build time the same way — you'll need to use a GitHub Actions workflow with secrets.

## API key security

USDA explicitly deactivates keys found in public repositories to prevent abuse. **Never commit your actual key.** The repo includes `.env.example` (safe to commit, just a template) and `.gitignore` excludes `.env.local` (where your real key lives).

Rate limit: 1,000 requests per hour per IP, which is plenty for personal use.

## Roadmap

- [ ] Real barcode scanning (camera + [quaggaJS](https://github.com/serratus/quaggaJS) or [ZXing](https://github.com/zxing-js/library))
- [ ] Voice input (Web Speech API)
- [ ] Photo food recognition (requires a vision model)
- [ ] Cloud sync (Supabase or Firebase)
- [ ] Apple Health / Google Fit integration
- [ ] PWA install + offline-first service worker
- [ ] AI nutrition coach chat (Anthropic API)

## Contributing

Pull requests welcome. For bigger changes, open an issue first.

## Data source

Food data provided by the [USDA FoodData Central](https://fdc.nal.usda.gov/) — a public-domain database maintained by the U.S. Department of Agriculture. Data is under [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/).

## License

[MIT](LICENSE)
