
<div align="center">

# 🌐 media hub

### Your entertainment. One unified experience.

A modern, all-in-one media platform for discovering and streaming music, radio, television, YouTube, podcasts, audiobooks, and more — powered by a React frontend and a Python API.

<br>

[![Live Demo](https://img.shields.io/badge/◉_Live_Demo-Visit_Media_Hub-8b5cf6?style=for-the-badge)](https://media-hub-ad-free.vercel.app)
[![Public API](https://img.shields.io/badge/API-Public_%26_Live-10b981?style=for-the-badge)](https://media-hub-ad-free.vercel.app/api/docs)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Python](https://img.shields.io/badge/Python-Backend-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)

<br>

**[Open the App](https://media-hub-ad-free.vercel.app) · [Explore API Docs](https://media-hub-ad-free.vercel.app/api/docs) · [API Information](https://media-hub-ad-free.vercel.app/api/info)**

</div>

---

## ✦ Overview

**media hub** brings multiple entertainment sources into one interface. Search for something to watch or listen to, explore different media categories, and manage playback without jumping between separate applications.

The project combines a responsive React interface with a Python-powered backend. Its API is also deployed publicly, so developers can send requests directly to the Vercel URL without running the backend locally.

- 🎬 **Video discovery** — search YouTube, explore trending content, and find live streams.
- 📻 **Internet radio** — discover stations by name, country, and genre.
- 📺 **Live television** — browse available IPTV channels and electronic programme guide data.
- 🎙️ **Podcasts** — discover podcasts and explore their episodes.
- 📚 **Audiobooks** — search audiobook collections and access chapter information.
- 🔎 **Universal discovery** — work with supported media sources through a unified interface.
- 🎵 **Lyrics and metadata** — access supported lyrics, subtitle, and media information features.
- 🎧 **Unified playback** — shared player controls, queue management, favourites, and playback preferences.
- 🔌 **Public REST API** — use deployed endpoints from your own scripts and applications.

> Media availability depends on the source, region, stream URL, and third-party service. Not every result is guaranteed to remain accessible.

## 🚀 Live deployment

| Resource | URL |
|---|---|
| 🌐 Web application | https://media-hub-ad-free.vercel.app |
| 🔌 API base URL | https://media-hub-ad-free.vercel.app |
| 📖 API documentation | https://media-hub-ad-free.vercel.app/api/docs |
| ℹ️ API information | https://media-hub-ad-free.vercel.app/api/info |
| 🩺 API root | https://media-hub-ad-free.vercel.app/api |

### The API works on the deployed website

The public API uses the same deployed base URL as the frontend. You can call its endpoints directly over HTTPS.

For example, open these URLs in your browser:

- [Universal media search](https://media-hub-ad-free.vercel.app/api/universal?q=lofi&country=GLOBAL&limit=6)
- [YouTube search](https://media-hub-ad-free.vercel.app/api/youtube/search?q=lofi&limit=10)
- [Radio station search](https://media-hub-ad-free.vercel.app/api/radio/search?name=jazz&country=GLOBAL&limit=10)
- [Podcast search](https://media-hub-ad-free.vercel.app/api/podcasts/search?q=technology&country=GLOBAL&limit=10)

These examples use the **deployed Vercel URL**, not `localhost`.

## 🔌 Using the public API

Set the base URL once in your application:

```python
API_BASE = "https://media-hub-ad-free.vercel.app"
```

### Python

```python
import requests

BASE_URL = "https://media-hub-ad-free.vercel.app"

response = requests.get(
    f"{BASE_URL}/api/universal",
    params={
        "q": "lofi",
        "country": "GLOBAL",
        "limit": 6,
    },
    timeout=30,
)

response.raise_for_status()
data = response.json()

print(data)
```

Install the required package:

```bash
pip install requests
```

### JavaScript

```javascript
const API_BASE = "https://media-hub-ad-free.vercel.app";

async function searchMedia(query) {
  const params = new URLSearchParams({
    q: query,
    country: "GLOBAL",
    limit: "6",
  });

  const response = await fetch(
    `${API_BASE}/api/universal?${params}`
  );

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}

searchMedia("lofi")
  .then(console.log)
  .catch(console.error);
```

### cURL

```bash
curl "https://media-hub-ad-free.vercel.app/api/universal?q=lofi&country=GLOBAL&limit=6"
```

### Available API areas

| Endpoint | Purpose |
|---|---|
| `/api/docs` | API documentation |
| `/api/info` | API information |
| `/api` | API root |
| `/api/universal` | Unified media discovery |
| `/api/all` | Combined discovery endpoint |
| `/api/search` | Media search |
| `/api/youtube/search` | Search YouTube content |
| `/api/youtube/trending` | Trending YouTube content |
| `/api/youtube/live` | Live YouTube content |
| `/api/youtube/extract` | Extract supported YouTube media information |
| `/api/universal/play` | Resolve supported media for playback |
| `/api/podcasts/search` | Search podcasts |
| `/api/podcasts/episodes` | Retrieve podcast episodes |
| `/api/audiobooks/search` | Search audiobooks |
| `/api/audiobooks/chapters` | Retrieve audiobook chapters |
| `/api/epg/load` | Load programme guide data |
| `/api/epg/now` | Retrieve current programme information |
| `/api/stream` | Stream-related endpoint |
| `/api/stream/proxy` | Stream proxy |
| `/api/stream/hls` | HLS stream handling |

Additional endpoints cover radio, television channels, lyrics, metadata, subtitles, and related media operations. Refer to the live API documentation for supported parameters and response formats.

**Note:** These endpoints are part of the project’s API. Actual responses may depend on request parameters, upstream providers, and deployment configuration.

---

## ✨ Features

### 🎬 Discover and play

Explore supported media sources through dedicated sections for YouTube, universal search, television, radio, podcasts, and audiobooks.

### 🎧 One shared player

- Play and pause controls
- Volume and seeking controls
- Queue management
- Favourites
- Lyrics drawer
- Video overlay
- Picture-in-picture support where available
- Sleep timer
- Playback-related preferences

### 🎨 Personalisation

- Theme selection
- Settings interface
- Keyboard shortcuts
- Recent universal-search history stored in the browser
- Persistent browser-side preferences where implemented

### 📡 Radio and television

- Search radio stations
- Filter radio by country and genre
- Browse available TV channels
- Access electronic programme guide functionality

### 🧩 API Hub

Explore the API through the application's API Hub. The project also includes request-oriented examples for working with API endpoints from different programming environments.

## ⌨️ Keyboard shortcuts

| Shortcut | Action |
|---|---|
| `Space` | Play or pause |
| `M` | Mute or unmute |
| `L` | Toggle lyrics |
| `T` | Cycle themes |
| `Shift + /` | Open shortcuts |
| `F` | Video overlay when available; otherwise fullscreen |
| `F11` | Toggle fullscreen |
| `P` | Picture-in-picture |
| `←` / `→` | Seek backward or forward by 5 seconds |
| `↑` / `↓` | Adjust volume by 5% |

Shortcuts are ignored while typing in supported form fields.

---

## 🛠️ Tech stack

| Technology | Role |
|---|---|
| React 19 | Frontend interface |
| Vite 8 | Development server and build tooling |
| Tailwind CSS 4 | Styling |
| Python | Backend and media integrations |
| Flask | API server |
| HLS.js | HLS playback support |
| Lucide React | Interface icons |
| Vercel | Public deployment |
| yt-dlp | Supported media extraction |
| Feedparser | Podcast feed parsing |

The backend also integrates libraries for radio discovery, audiobook retrieval, lyrics, and electronic programme guide data.

## 💻 Run locally

### Requirements

- Python 3.10 or newer recommended
- Node.js and npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Hidden-Rhythm/media-hub.git
cd media-hub
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install Python dependencies

```bash
python -m venv .venv
```

Activate the environment:

**Windows — Command Prompt**

```bat
.venv\Scripts\activate
```

**Windows — PowerShell**

```powershell
.\.venv\Scripts\Activate.ps1
```

**macOS / Linux**

```bash
source .venv/bin/activate
```

Install the packages:

```bash
pip install -r requirements.txt
```

### 4. Configure optional settings

Copy `.env.example` to `.env` if you want to configure the optional TMDB API key:

```env
TMDB_KEY=your_tmdb_api_key
```

The project is designed to work without this key, although features that depend on TMDB may have reduced functionality.

Keep private credentials out of public commits. Browser-side settings and server-side environment variables are not interchangeable.

### 5. Start the backend

Run the Flask application using the backend entry point provided in the repository:

```bash
python app.py
```

The local backend runs on:

```text
http://127.0.0.1:5000
```

### 6. Start the frontend

Open another terminal in the project directory:

```bash
npm run dev
```

Open the local Vite address shown in your terminal. The development configuration proxies `/api` and `/stream` requests to the local backend.

### 7. Create a production frontend build

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

> The Vite development proxy is for local development. It does not configure the production deployment; Vercel routing is handled by the deployed project configuration.

---

## 📁 Project structure

```text
media-hub/
├── api/
│   └── index.py
├── data/
│   └── dishtv_channels.json
├── src/
│   ├── components/
│   │   ├── Modals/
│   │   ├── Views/
│   │   ├── Icons.jsx
│   │   ├── LyricsDrawer.jsx
│   │   ├── PlayerBar.jsx
│   │   ├── QueueDrawer.jsx
│   │   ├── Sidebar.jsx
│   │   ├── ToastContainer.jsx
│   │   └── VideoOverlay.jsx
│   ├── context/
│   │   └── PlayerContext.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env.example
├── epg.py
├── index.html
├── package.json
├── providers.py
├── requirements.txt
└── vite.config.js
```

## 🔐 Configuration and privacy

- The public API is hosted at the Vercel deployment URL.
- `TMDB_KEY` is an optional configuration value for supported metadata features.
- Some preferences and recent-history data are stored in browser `localStorage`.
- Media requests may depend on external providers and their availability.
- Avoid putting private API keys into client-side code or committing secrets to GitHub.

## ⚠️ Notes

- Media sources may change, become unavailable, or impose their own regional restrictions.
- Some streams may not support browser playback or seeking.
- Third-party provider availability and rate limits can affect API responses.
- API consumers should handle failed requests, empty results, and non-success HTTP status codes.
- Public availability of an endpoint does not guarantee unlimited usage or uptime.

## 📄 License

The project declares the **ISC License** in its package metadata. Check the repository for any additional licensing information that may apply to individual dependencies or media sources.

---

<div align="center">

### 🌐 One hub. Multiple worlds of media.

Explore the app, try the public API, and build something with it.

**[Launch media hub ↗](https://media-hub-ad-free.vercel.app)**

</div>
