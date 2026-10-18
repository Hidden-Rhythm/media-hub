 <div align="center">

<picture>
  <source
    media="(prefers-color-scheme: dark)"
    srcset="https://capsule-render.vercel.app/api?type=venom&height=230&color=0:09090b,45:1e1b4b,100:6d28d9&text=media%20hub&fontColor=ffffff&fontSize=78&fontAlignY=45&desc=YOUR%20MEDIA.%20ONE%20DESTINATION.&descAlignY=68&descSize=14&animation=fadeIn"
  />
  <source
    media="(prefers-color-scheme: light)"
    srcset="https://capsule-render.vercel.app/api?type=venom&height=230&color=0:f8fafc,45:e9e5ff,100:c4b5fd&text=media%20hub&fontColor=18181b&fontSize=78&fontAlignY=45&desc=YOUR%20MEDIA.%20ONE%20DESTINATION.&descAlignY=68&descSize=14&animation=fadeIn"
  />
  <img
    src="https://capsule-render.vercel.app/api?type=venom&height=230&color=0:09090b,45:1e1b4b,100:6d28d9&text=media%20hub&fontColor=ffffff&fontSize=78&fontAlignY=45&desc=YOUR%20MEDIA.%20ONE%20DESTINATION.&descAlignY=68&descSize=14&animation=fadeIn"
    width="100%"
    alt="media hub"
  />
</picture>

<br/>

<p>
  <a href="https://media-hub-ad-free.vercel.app">
    <img src="https://img.shields.io/badge/Explore%20the%20App-7C3AED?style=for-the-badge&logo=vercel&logoColor=white" alt="Explore the app"/>
  </a>
  <a href="https://media-hub-ad-free.vercel.app/api/docs">
    <img src="https://img.shields.io/badge/API%20Documentation-059669?style=for-the-badge&logo=fastapi&logoColor=white" alt="API documentation"/>
  </a>
  <a href="https://github.com/Hidden-Rhythm/media-hub">
    <img src="https://img.shields.io/badge/Source%20Code-18181B?style=for-the-badge&logo=github&logoColor=white" alt="Source code"/>
  </a>
</p>

<p>
  <strong>One interface. Multiple worlds of entertainment.</strong>
  <br/>
  <sub>Discover · Listen · Watch · Explore</sub>
</p>

<p>
  <a href="#-about">About</a> ·
  <a href="#-what-you-can-do">Features</a> ·
  <a href="#-the-api">API</a> ·
  <a href="#keyboard-shortcuts">Shortcuts</a> ·
  <a href="#-run-locally">Setup</a>
</p>

</div>

---

## ✦ About

**media hub** is a unified media discovery and playback platform built to bring different entertainment sources into one place.

From internet radio and live television to YouTube, podcasts, audiobooks, and direct media URLs, the application combines dedicated browsing experiences with shared playback controls and a Python-powered API.

No unnecessary complexity. Just one place to explore the media you enjoy.

<div align="center">

| 🌐 One destination | 🎧 Shared playback | 🔌 Developer-ready |
|:---:|:---:|:---:|
| Multiple media categories | A consistent listening and viewing experience | A public API for integrations |

</div>

## 🌌 Live application

The application and API are deployed and ready to use.

| Resource | Access |
|:--|:--|
| **Web application** | [Launch media hub ↗](https://media-hub-ad-free.vercel.app) |
| **API documentation** | [Explore the endpoints ↗](https://media-hub-ad-free.vercel.app/api/docs) |
| **API information** | [View API details ↗](https://media-hub-ad-free.vercel.app/api/info) |
| **API base URL** | `https://media-hub-ad-free.vercel.app` |

> 🚀 **Ready when you are.** The live application requires no local installation, development server, or setup.

---

## ✨ What you can do

<table>
<tr>
<td width="50%" valign="top">

### 🎬 Video & discovery

- Search supported YouTube content.
- Explore trending and live videos.
- Discover media across supported categories.
- Extract media information from supported URLs.
- Play compatible direct and HLS streams.

</td>
<td width="50%" valign="top">

### 📻 Internet radio

- Search stations by name.
- Filter by country and genre.
- Explore regional and international stations.
- Listen to compatible live broadcasts.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 📺 Live television

- Browse supported TV channels.
- Filter by country and category.
- Explore bundled channel data.
- Retrieve programme information through EPG endpoints.

</td>
<td width="50%" valign="top">

### 🎙️ Podcasts

- Search podcast collections.
- Explore region-based results.
- Retrieve episodes from RSS feeds.
- Browse and play available episodes.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 📚 Audiobooks

- Search available collections.
- Explore supported categories and regions.
- Retrieve chapter information.
- Browse audiobooks through a dedicated interface.

</td>
<td width="50%" valign="top">

### 🎵 Lyrics & metadata

- Retrieve song lyrics.
- Enrich media with metadata.
- Retrieve supported subtitles.
- Access electronic programme guide information.

</td>
</tr>
</table>

### 🎧 A player that brings it together

The shared playback experience includes:

- Play, pause, seeking, and volume controls.
- Playback queue and queue drawer.
- Favourites management.
- Lyrics drawer.
- Video overlay and fullscreen support.
- Picture-in-picture where supported.
- Sleep timer.
- Playback preferences.

### 🎨 Make it yours

- Theme selection.
- Dedicated settings page.
- Keyboard shortcuts.
- Recent universal-media history.
- Browser-stored preferences where implemented.

### 🔌 Built-in API Hub

Explore the project's API through the dedicated API Hub view, or connect directly to the deployed endpoints from your own application.

<sub>Media availability and playback compatibility depend on upstream providers, regional restrictions, and browser support.</sub>

---

## 🔌 The API

The public API exposes endpoints for media discovery, supported content extraction, streaming, and related metadata.

**Base URL**

```text
https://media-hub-ad-free.vercel.app
```

### ⚡ Try an endpoint

| Endpoint | What it does |
|:--|:--|
| [`/api/docs`](https://media-hub-ad-free.vercel.app/api/docs) | API documentation |
| [`/api/universal?q=lofi&country=GLOBAL&limit=6`](https://media-hub-ad-free.vercel.app/api/universal?q=lofi&country=GLOBAL&limit=6) | Unified discovery |
| [`/api/youtube/search?q=lofi&limit=10`](https://media-hub-ad-free.vercel.app/api/youtube/search?q=lofi&limit=10) | YouTube search |
| [`/api/youtube/trending?limit=10`](https://media-hub-ad-free.vercel.app/api/youtube/trending?limit=10) | Trending videos |
| [`/api/youtube/live?limit=10`](https://media-hub-ad-free.vercel.app/api/youtube/live?limit=10) | Live video results |
| [`/api/radio/search?name=jazz&country=GLOBAL&limit=10`](https://media-hub-ad-free.vercel.app/api/radio/search?name=jazz&country=GLOBAL&limit=10) | Radio search |
| [`/api/tv/channels?country=IN`](https://media-hub-ad-free.vercel.app/api/tv/channels?country=IN) | TV channel data |
| [`/api/podcasts/search?q=technology&country=GLOBAL&limit=10`](https://media-hub-ad-free.vercel.app/api/podcasts/search?q=technology&country=GLOBAL&limit=10) | Podcast search |
| [`/api/audiobooks/search?q=sherlock&region=global&limit=10`](https://media-hub-ad-free.vercel.app/api/audiobooks/search?q=sherlock&region=global&limit=10) | Audiobook search |

### 🗂️ Endpoint reference

<details>
<summary><strong>🔎 Universal discovery & extraction</strong></summary>

| Route | Purpose |
|:--|:--|
| `/api/universal` | Unified discovery |
| `/api/all` | Discovery alias |
| `/api/search` | Search alias |
| `/api/universal/play` | Resolve supported media URLs |

</details>

<details>
<summary><strong>▶️ YouTube</strong></summary>

| Route | Purpose |
|:--|:--|
| `/api/youtube` | Unified YouTube endpoint |
| `/api/youtube/search` | Search content |
| `/api/youtube/trending` | Trending content |
| `/api/youtube/live` | Live content |
| `/api/youtube/extract` | Extract media information |

</details>

<details>
<summary><strong>📻 Radio & television</strong></summary>

| Route | Purpose |
|:--|:--|
| `/api/radio` | Radio endpoint |
| `/api/radio/search` | Search stations |
| `/api/tv` | Television endpoint |
| `/api/tv/channels` | Retrieve and filter channels |

</details>

<details>
<summary><strong>🎙️ Podcasts & audiobooks</strong></summary>

| Route | Purpose |
|:--|:--|
| `/api/podcasts` | Podcast endpoint |
| `/api/podcasts/search` | Search podcasts |
| `/api/podcasts/episodes` | Retrieve feed episodes |
| `/api/audiobooks` | Audiobook endpoint |
| `/api/audiobooks/search` | Search audiobooks |
| `/api/audiobooks/chapters` | Retrieve chapters |

</details>

<details>
<summary><strong>🎵 Lyrics, metadata & subtitles</strong></summary>

| Route | Purpose |
|:--|:--|
| `/api/lyrics` | Lyrics retrieval |
| `/api/metadata` | Metadata enrichment |
| `/api/subtitles` | Subtitle retrieval |

</details>

<details>
<summary><strong>📡 Streaming & EPG</strong></summary>

| Route | Purpose |
|:--|:--|
| `/api/stream` | Smart stream handling |
| `/api/stream/proxy` | Media proxy |
| `/stream/proxy` | Proxy alias |
| `/api/stream/hls` | HLS playlist handling |
| `/stream/hls` | HLS alias |
| `/api/epg/load` | Load XMLTV data |
| `/api/epg/now` | Current and upcoming programme information |

</details>

For endpoint-specific parameters, accepted values, and response structures, refer to the [live API documentation](https://media-hub-ad-free.vercel.app/api/docs).

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

Install the dependency if needed:

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

console.log(await searchMedia("lofi"));
```

### Example · cURL

```bash
curl -X GET \
  "https://media-hub-ad-free.vercel.app/api/universal?q=lofi&country=GLOBAL&limit=6" \
  -H "Accept: application/json"
```

### Integration notes

- Use the deployed URL for live requests.
- Encode query parameters correctly.
- Handle HTTP errors, timeouts, and empty results.
- Account for changes in third-party providers and media URLs.
- Consult the live documentation for exact endpoint behaviour.

---

<a id="keyboard-shortcuts"></a>

## ⌨️ Keyboard shortcuts

| Shortcut | Action |
|:--|:--|
| `Space` | Play / pause |
| `M` | Mute / unmute |
| `L` | Toggle lyrics |
| `T` | Cycle themes |
| `Shift + /` | Open shortcut reference |
| `F` | Video overlay when available; otherwise fullscreen |
| `F11` | Toggle fullscreen |
| `P` | Picture-in-picture |
| `←` / `→` | Seek by 5 seconds |
| `↑` / `↓` | Adjust volume by 5% |

Shortcuts are ignored while focus is inside supported text-entry and selection fields.

---

## 🧰 Built with

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
| React 19 | User interface |
| Vite 8 | Frontend tooling and build |
| Tailwind CSS 4 | Styling |
| Python & Flask | Backend and API |
| HLS.js | HLS playback support |
| Lucide React | Icons |
| yt-dlp | Supported media extraction |
| Feedparser | Podcast feed processing |
| Vercel | Deployment |

Additional Python libraries support radio discovery, audiobook retrieval, lyrics, metadata, subtitles, and EPG functionality.

---

<a id="run-locally"></a>

## 💻 Run locally

The live website and API are already deployed. **You do not need to run development commands to use the online application.**

These steps are only for running the source code on your own computer.

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

### 2. Install frontend dependencies and build

```bash
npm install
npm run build
```

The build generates `dist/`, which the Flask application uses to serve the frontend.

### 3. Install Python dependencies

```bash
pip install -r requirements.txt
```

### 4. Start media hub

```bash
python app.py
```

Open the local address:

```text
http://127.0.0.1:5000
```

Once dependencies are installed and the frontend has been built, **`python app.py` is the startup command** for this workflow. A separate Vite development server is not required.

### Optional configuration

The `.env.example` file documents the optional TMDB key:

```env
TMDB_KEY=your_tmdb_api_key
```

Only configure it if you need metadata functionality that depends on TMDB. Keep private credentials out of committed source code.

---

## 🏗️ Project architecture

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

| File or directory | Responsibility |
|:--|:--|
| `src/components/Views/` | Media pages and API Hub |
| `src/components/` | Player controls, drawers, modals, and shared UI |
| `src/context/PlayerContext.jsx` | Shared playback state |
| `providers.py` | Media provider integrations |
| `epg.py` | Electronic programme guide functionality |
| `app.py` | Flask application, frontend routes, API, and streaming handlers |
| `api/index.py` | Vercel backend entry point |
| `vite.config.js` | Frontend build and local proxy configuration |

---

## ⚙️ Reliability & configuration

- **Provider availability:** External sources can change their endpoints, results, or access policies.
- **Playback compatibility:** Not every stream works in every browser.
- **Browser preferences:** Supported settings and recent media history may be stored locally.
- **Optional credentials:** Certain metadata features may require additional configuration.
- **API integrations:** Use timeouts and handle failed requests gracefully.

---

<div align="center">

## Ready to explore?

Experience media hub or start building with its API.

<br/>

<a href="https://media-hub-ad-free.vercel.app">
  <img src="https://img.shields.io/badge/OPEN%20MEDIA%20HUB-7C3AED?style=for-the-badge&logo=vercel&logoColor=white" alt="Open media hub"/>
</a>
<a href="https://media-hub-ad-free.vercel.app/api/docs">
  <img src="https://img.shields.io/badge/EXPLORE%20THE%20API-059669?style=for-the-badge&logo=fastapi&logoColor=white" alt="Explore the API"/>
</a>

<br/><br/>

<sub>Crafted by <a href="https://github.com/Hidden-Rhythm">hidden_rhythm</a></sub>

</div>
