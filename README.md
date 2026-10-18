
<div align="center">

<img src="https://capsule-render.vercel.app/api?type=venom&height=220&color=0:09090b,40:312e81,100:7c3aed&text=media%20hub&fontColor=ffffff&fontSize=76&fontAlignY=48&desc=ONE%20PLATFORM.%20YOUR%20ENTIRE%20MEDIA%20WORLD.&descAlignY=70&descSize=13&animation=fadeIn" width="100%" alt="media hub"/>

<br>

<p>
  <a href="https://media-hub-ad-free.vercel.app">
    <img src="https://img.shields.io/badge/OPEN%20APP-7C3AED?style=for-the-badge&logo=vercel&logoColor=white" alt="Open application"/>
  </a>
  <a href="https://media-hub-ad-free.vercel.app/api/docs">
    <img src="https://img.shields.io/badge/LIVE%20API-10B981?style=for-the-badge&logo=fastapi&logoColor=white" alt="Live API"/>
  </a>
  <a href="https://github.com/Hidden-Rhythm/media-hub">
    <img src="https://img.shields.io/badge/SOURCE-GITHUB-18181B?style=for-the-badge&logo=github&logoColor=white" alt="GitHub repository"/>
  </a>
</p>

<p>
  <strong>A unified destination for discovering and playing media.</strong>
  <br>
  Music · Radio · Television · Video · Podcasts · Audiobooks
</p>

<p>
  <a href="#overview">Overview</a> ·
  <a href="#features">Features</a> ·
  <a href="#live-api">API</a> ·
  <a href="#keyboard-shortcuts">Shortcuts</a> ·
  <a href="#local-setup">Local setup</a> ·
  <a href="#architecture">Architecture</a>
</p>

</div>

---

## Overview

**media hub** brings multiple entertainment sources into one interface, combining media discovery, playback, and a public API in a single project.

Built with React and Python, it provides dedicated experiences for music, internet radio, live television, YouTube, podcasts, audiobooks, and direct media URLs. Shared playback controls, favourites, lyrics, and personalisation features make the experience consistent across supported sources.

The application is already deployed. You can use the website or integrate the public API into your own projects without setting up a local development environment.

<table>
<tr>
<td width="50%" valign="top">

### ◈ Unified discovery

Explore supported media sources through one interface instead of switching between separate applications.

</td>
<td width="50%" valign="top">

### ⌘ Public API

Access media discovery and related endpoints through the deployed API.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### ▶ Shared playback

A common player with queue management, favourites, lyrics, and playback controls.

</td>
<td width="50%" valign="top">

### ◉ Modular architecture

A React frontend paired with a Flask backend and provider-based integrations.

</td>
</tr>
</table>

## Live application

<div align="center">

| Service | Link |
|:--|:--|
| Web application | [media-hub-ad-free.vercel.app](https://media-hub-ad-free.vercel.app) |
| API base URL | [Open API](https://media-hub-ad-free.vercel.app/api) |
| API documentation | [Explore endpoints](https://media-hub-ad-free.vercel.app/api/docs) |
| API information | [View API information](https://media-hub-ad-free.vercel.app/api/info) |

</div>

**No installation is required to use the deployed application.** Open the website and start exploring.

---

## Features

### 🎬 Video and universal media

- Search supported YouTube content.
- Explore trending and live video results.
- Discover content across multiple supported media categories.
- Extract media information from supported URLs.
- Handle supported direct audio, video, and HLS streams.
- Access media through dedicated views and a unified discovery experience.

### 📻 Internet radio

- Search radio stations by name.
- Filter stations by country and genre.
- Browse supported international and regional stations.
- Play compatible live radio streams.

### 📺 Live television

- Browse supported television channels.
- Filter channels by country, category, and search query.
- Use bundled channel data.
- Retrieve electronic programme guide information through the API.

### 🎙️ Podcasts

- Search podcast collections.
- Explore region-based results.
- Retrieve episodes from supported RSS feeds.
- Browse and play available podcast episodes.

### 📚 Audiobooks

- Search available audiobook collections.
- Explore supported regions and categories.
- Retrieve chapter information.
- Browse audiobooks through a dedicated interface.

### 🎧 Playback experience

- Shared play and pause controls.
- Volume adjustment and seeking.
- Playback queue and queue drawer.
- Favourites management.
- Lyrics drawer.
- Video overlay and fullscreen support.
- Picture-in-picture where supported.
- Sleep timer.
- Playback-related preferences.

### 🎨 Personalisation

- Theme selection.
- Dedicated settings page.
- Keyboard shortcuts.
- Recent universal-media history.
- Browser-side storage for supported preferences.

### 🔎 Media information

- Lyrics retrieval.
- Media metadata enrichment.
- Subtitle retrieval.
- Electronic programme guide integration.
- Dedicated API Hub for exploring available endpoints.

> **Availability note:** Media sources and stream compatibility depend on upstream providers, regional restrictions, and browser support. Third-party services can change independently of this project.

---

## Live API

The public API is deployed alongside the application.

**Base URL**

```text
https://media-hub-ad-free.vercel.app
```

### Quick endpoint reference

| Endpoint | Purpose |
|:--|:--|
| [`/api/docs`](https://media-hub-ad-free.vercel.app/api/docs) | API documentation |
| [`/api/info`](https://media-hub-ad-free.vercel.app/api/info) | API information |
| [`/api/universal?q=lofi&country=GLOBAL&limit=6`](https://media-hub-ad-free.vercel.app/api/universal?q=lofi&country=GLOBAL&limit=6) | Unified media discovery |
| [`/api/youtube/search?q=lofi&limit=10`](https://media-hub-ad-free.vercel.app/api/youtube/search?q=lofi&limit=10) | YouTube search |
| [`/api/youtube/trending?limit=10`](https://media-hub-ad-free.vercel.app/api/youtube/trending?limit=10) | Trending content |
| [`/api/youtube/live?limit=10`](https://media-hub-ad-free.vercel.app/api/youtube/live?limit=10) | Live video results |
| [`/api/radio/search?name=jazz&country=GLOBAL&limit=10`](https://media-hub-ad-free.vercel.app/api/radio/search?name=jazz&country=GLOBAL&limit=10) | Radio station search |
| [`/api/tv/channels?country=IN`](https://media-hub-ad-free.vercel.app/api/tv/channels?country=IN) | TV channel data |
| [`/api/podcasts/search?q=technology&country=GLOBAL&limit=10`](https://media-hub-ad-free.vercel.app/api/podcasts/search?q=technology&country=GLOBAL&limit=10) | Podcast search |
| [`/api/audiobooks/search?q=sherlock&region=global&limit=10`](https://media-hub-ad-free.vercel.app/api/audiobooks/search?q=sherlock&region=global&limit=10) | Audiobook search |

### Endpoint catalogue

<details>
<summary><strong>🔎 Universal discovery and media extraction</strong></summary>

| Endpoint | Description |
|:--|:--|
| `/api/universal` | Search supported media sources together |
| `/api/all` | Alias for universal discovery |
| `/api/search` | Alias for universal discovery |
| `/api/universal/play` | Extract supported media information from a URL |

Universal discovery accepts parameters such as `q`, `sources`, `country`, `limit`, and `url`. Direct URL extraction can also accept a `quality` parameter.

</details>

<details>
<summary><strong>▶ YouTube</strong></summary>

| Endpoint | Description |
|:--|:--|
| `/api/youtube` | Unified YouTube endpoint |
| `/api/youtube/search` | Search videos |
| `/api/youtube/trending` | Retrieve trending results |
| `/api/youtube/live` | Retrieve live results |
| `/api/youtube/extract` | Extract supported media information |

Common parameters include `q`, `cat`, `sort`, `limit`, `url`, and `quality`, depending on the endpoint.

</details>

<details>
<summary><strong>📻 Radio and television</strong></summary>

| Endpoint | Description |
|:--|:--|
| `/api/radio` | Radio search alias |
| `/api/radio/search` | Search radio stations |
| `/api/tv` | TV channel endpoint |
| `/api/tv/channels` | Retrieve and filter channels |

Radio search supports parameters including `name`, `q`, `country`, `tag`, and `limit`. TV endpoints support country and channel filtering parameters.

</details>

<details>
<summary><strong>🎙️ Podcasts and audiobooks</strong></summary>

| Endpoint | Description |
|:--|:--|
| `/api/podcasts` | Podcast search or feed episodes |
| `/api/podcasts/search` | Search podcasts |
| `/api/podcasts/episodes` | Retrieve episodes from a feed |
| `/api/audiobooks` | Audiobook search or chapter lookup |
| `/api/audiobooks/search` | Search audiobooks |
| `/api/audiobooks/chapters` | Retrieve audiobook chapters |

</details>

<details>
<summary><strong>🎵 Lyrics, metadata and subtitles</strong></summary>

| Endpoint | Description |
|:--|:--|
| `/api/lyrics` | Retrieve lyrics |
| `/api/metadata` | Enrich media metadata |
| `/api/subtitles` | Retrieve available subtitles |

The metadata endpoint accepts a media URL and can accept a `tmdb_key`. Subtitle retrieval supports a configurable language list.

</details>

<details>
<summary><strong>📡 Streaming and programme guides</strong></summary>

| Endpoint | Description |
|:--|:--|
| `/api/stream` | Smart stream handling |
| `/api/stream/proxy` | Proxy supported media streams |
| `/stream/proxy` | Stream proxy alias |
| `/api/stream/hls` | HLS playlist handling |
| `/stream/hls` | HLS endpoint alias |
| `/api/epg/load` | Load XMLTV programme data |
| `/api/epg/now` | Retrieve current and upcoming programme information |

</details>

For the exact parameters and live response formats, use the [deployed API documentation](https://media-hub-ad-free.vercel.app/api/docs).

### Example · Python

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

Install the HTTP client if necessary:

```bash
pip install requests
```

### Example · JavaScript

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
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}

const results = await searchMedia("lofi");
console.log(results);
```

### Example · cURL

```bash
curl -X GET \
  "https://media-hub-ad-free.vercel.app/api/universal?q=lofi&country=GLOBAL&limit=6" \
  -H "Accept: application/json"
```

### API integration guidelines

- Use the deployed base URL for live requests.
- Encode query parameters properly.
- Handle failed requests and empty results.
- Allow for upstream provider errors and changing stream URLs.
- Check the relevant endpoint documentation before building integrations.

---

## Keyboard shortcuts

| Shortcut | Action |
|:--|:--|
| `Space` | Play or pause |
| `M` | Mute or unmute |
| `L` | Toggle lyrics |
| `T` | Cycle themes |
| `Shift + /` | Open keyboard shortcuts |
| `F` | Open video overlay when applicable; otherwise fullscreen |
| `F11` | Toggle fullscreen |
| `P` | Picture-in-picture |
| `←` / `→` | Seek backward or forward by 5 seconds |
| `↑` / `↓` | Adjust volume by 5% |

Shortcuts are ignored while typing in supported input, selection, and text-entry fields.

---

## Technology stack

<div align="center">

<a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React"/></a>
<a href="https://vite.dev/"><img src="https://img.shields.io/badge/Vite-8-20232A?style=flat-square&logo=vite&logoColor=646CFF" alt="Vite"/></a>
<a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-4-20232A?style=flat-square&logo=tailwindcss&logoColor=06B6D4" alt="Tailwind CSS"/></a>
<a href="https://www.python.org/"><img src="https://img.shields.io/badge/Python-Backend-20232A?style=flat-square&logo=python&logoColor=3776AB" alt="Python"/></a>
<a href="https://flask.palletsprojects.com/"><img src="https://img.shields.io/badge/Flask-API-20232A?style=flat-square&logo=flask&logoColor=white" alt="Flask"/></a>
<a href="https://github.com/video-dev/hls.js/"><img src="https://img.shields.io/badge/HLS.js-Playback-20232A?style=flat-square" alt="HLS.js"/></a>
<a href="https://vercel.com/"><img src="https://img.shields.io/badge/Vercel-Deployment-20232A?style=flat-square&logo=vercel&logoColor=white" alt="Vercel"/></a>

</div>

| Technology | Role |
|:--|:--|
| React 19 | Frontend interface |
| Vite 8 | Frontend build tooling |
| Tailwind CSS 4 | Styling |
| Python | Backend logic and provider integrations |
| Flask | HTTP API and application server |
| HLS.js | HLS playback support |
| Lucide React | Interface icons |
| yt-dlp | Supported media extraction |
| Feedparser | Podcast feed processing |
| Vercel | Deployment platform |

Additional Python dependencies provide radio discovery, audiobook retrieval, lyrics, metadata, subtitles, and electronic programme guide functionality.

---

## Local setup

The deployed website and API are already available online. **You do not need to install anything or run development commands to use the live application.**

The following steps are only for setting up the source code on your own machine.

### Requirements

- Git
- Node.js and npm
- Python
- Dependencies listed in `requirements.txt`

### 1. Clone the repository

```bash
git clone https://github.com/Hidden-Rhythm/media-hub.git
cd media-hub
```

### 2. Install frontend dependencies and build the frontend

```bash
npm install
npm run build
```

This generates the `dist/` directory required by the Flask application to serve the built frontend.

### 3. Install Python dependencies

```bash
pip install -r requirements.txt
```

### 4. Start the application

```bash
python app.py
```

Open:

```text
http://127.0.0.1:5000
```

**That's the startup command:** once the frontend has been built and dependencies are installed, start the complete local application with `python app.py`. You do not need to start a separate Vite development server for this workflow.

### Optional configuration

The repository includes `.env.example` with an optional TMDB configuration value:

```env
TMDB_KEY=your_tmdb_api_key
```

A TMDB key is not required for every feature. Configure it only if you need metadata functionality that depends on it. Keep private credentials out of committed source code.

---

## Architecture

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
├── app.py
├── epg.py
├── providers.py
├── requirements.txt
├── package.json
├── vite.config.js
├── index.html
└── .env.example
```

### How the application is organised

| Component | Responsibility |
|:--|:--|
| `src/components/Views/` | Dedicated media pages and API Hub |
| `src/components/` | Player controls, drawers, modals, and shared UI |
| `src/context/PlayerContext.jsx` | Shared playback state |
| `providers.py` | Media provider integrations |
| `epg.py` | Electronic programme guide functionality |
| `app.py` | Flask application, frontend routes, API endpoints, and streaming handlers |
| `api/index.py` | Vercel backend entry point |
| `vite.config.js` | Frontend build configuration and local development proxy |

---

## Reliability and configuration

- **Provider availability:** External services can change their responses, URLs, and access policies.
- **Playback compatibility:** Some media formats or streams may not work in every browser.
- **Browser storage:** Supported preferences and recent media history can be stored locally.
- **Optional credentials:** Certain metadata features may require additional configuration.
- **API consumers:** Use timeouts and handle unsuccessful responses appropriately.

---

<div align="center">

## Explore media hub

Discover the application or build something with the API.

<br>

<a href="https://media-hub-ad-free.vercel.app">
  <img src="https://img.shields.io/badge/LAUNCH-Open%20media%20hub-7C3AED?style=for-the-badge&logo=vercel&logoColor=white" alt="Launch media hub"/>
</a>
<a href="https://media-hub-ad-free.vercel.app/api/docs">
  <img src="https://img.shields.io/badge/API-Read%20Documentation-10B981?style=for-the-badge&logo=fastapi&logoColor=white" alt="API documentation"/>
</a>

<br><br>

<sub>Built by <a href="https://github.com/Hidden-Rhythm">hidden_rhythm</a></sub>

</div>
