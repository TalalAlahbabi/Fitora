# Food Tracker 🍎

A fast, minimal, Apple-style food tracking web app. Log meals in seconds, track macros, see progress, and get contextual coaching — all offline, with no signup required.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

## Features

- **Fast logging** — search, pick, log in seconds
- **Smart macros** — protein, carbs, fat, fiber, sugar, sodium tracking with live scaling by gram amount
- **Meal grouping** — breakfast, lunch, dinner, snacks, auto-detected by time of day
- **Daily coaching** — contextual feedback based on what you've eaten and when
- **Progress view** — 7-day calorie chart, streak counter, weight tracking, achievements
- **Meal plans** — curated plans for fat loss, muscle gain, and plant-based diets
- **Offline-first** — all data stored in `localStorage`, works without internet
- **Dark mode** — clean iOS-inspired palette for both themes
- **No signup** — open the app and start logging

## Tech stack

- [React 18](https://react.dev/) + [Vite](https://vite.dev/)
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Lucide React](https://lucide.dev/) for icons
- `localStorage` for persistence

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- `npm` (comes with Node)

### Install

```bash
git clone https://github.com/YOUR_USERNAME/food-tracker.git
cd food-tracker
npm install
```

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
food-tracker/
├── public/
│   └── favicon.svg
├── src/
│   ├── FoodTracker.jsx   # Main app component (all logic)
│   ├── main.jsx          # React entry point
│   └── index.css         # Global styles
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

All app logic is currently in `src/FoodTracker.jsx` as a single file. When you're ready to scale, you can split it into components under `src/components/`.

## Deployment

### Vercel (easiest)

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Vercel auto-detects Vite — just click **Deploy**.

### Netlify

1. Push to GitHub.
2. Go to [app.netlify.com/start](https://app.netlify.com/start), pick the repo.
3. Build command: `npm run build`, publish directory: `dist`.

### GitHub Pages

```bash
npm install --save-dev gh-pages
```

Add to `package.json`:

```json
"homepage": "https://YOUR_USERNAME.github.io/food-tracker",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

Then `npm run deploy`.

## Roadmap

- [ ] Real barcode scanning (camera + [quaggaJS](https://github.com/serratus/quaggaJS) or [ZXing](https://github.com/zxing-js/library))
- [ ] Voice input (Web Speech API)
- [ ] Photo food recognition (requires a vision model)
- [ ] Expand database beyond the 30 starter items (USDA FoodData Central API)
- [ ] Cloud sync (Supabase or Firebase)
- [ ] Apple Health / Google Fit integration
- [ ] PWA install + push notifications
- [ ] AI nutrition coach chat (Anthropic API)

## Contributing

Pull requests welcome. For bigger changes, open an issue first to discuss.

## License

[MIT](LICENSE)
