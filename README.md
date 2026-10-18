
<div align="center">

<img src="https://capsule-render.vercel.app/api?type=venom&height=220&color=0:09090b,40:312e81,100:7c3aed&text=media%20hub&fontColor=ffffff&fontSize=76&fontAlignY=48&desc=ONE%20PLATFORM.%20YOUR%20ENTIRE%20MEDIA%20WORLD.&descAlignY=70&descSize=13&animation=fadeIn" width="100%" alt="media hub"/>

<br>

<p>
  <a href="https://media-hub-ad-free.vercel.app">
    <img src="https://img.shields.io/badge/OPEN%20APP-7C3AED?style=for-the-badge&logo=vercel&logoColor=white" alt="Open app"/>
  </a>
  <a href="https://media-hub-ad-free.vercel.app/api/docs">
    <img src="https://img.shields.io/badge/LIVE%20API-10B981?style=for-the-badge&logo=fastapi&logoColor=white" alt="Live API"/>
  </a>
  <a href="https://github.com/Hidden-Rhythm/media-hub">
    <img src="https://img.shields.io/badge/SOURCE-GITHUB-18181B?style=for-the-badge&logo=github&logoColor=white" alt="GitHub source"/>
  </a>
</p>

<p>
  <strong>A unified entertainment platform built for discovery, playback, and extensibility.</strong>
  <br/>
  Music · Radio · Television · Video · Podcasts · Audiobooks
</p>

<p>
  <a href="#-overview">Overview</a> ·
  <a href="#-features">Features</a> ·
  <a href="#-live-api">Live API</a> ·
  <a href="#-local-development">Development</a> ·
  <a href="#-project-structure">Architecture</a>
</p>

</div>

---

## ◈ Overview

**media hub** brings multiple entertainment sources together in a single interface. Discover content, explore media categories, and control playback through a shared player instead of switching between disconnected experiences.

The project combines a React-based frontend with a Python backend and a publicly deployed API. You can use the web application directly or integrate supported API endpoints into your own projects.

<table>
  <tr>
    <td width="50%">
      <h3>◉ Unified experience</h3>
      Discover different types of media through one interface, with shared playback controls and a consistent navigation system.
    </td>
    <td width="50%">
      <h3>⌘ Public API</h3>
      Send requests directly to the deployed Vercel URL. A local backend is not required to consume the live API.
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>◈ Modular frontend</h3>
      Dedicated views, reusable components, a shared player context, and separate modal components.
    </td>
    <td width="50%">
      <h3>↗ Local development</h3>
      Run the frontend and backend locally, customise the application, and build the frontend with Vite.
    </td>
  </tr>
</table>

## 🌐 Live deployment

<div align="center">

| Service | Link |
|:--|:--|
| **Web application** | [media-hub-ad-free.vercel.app](https://media-hub-ad-free.vercel.app) |
| **Public API** | [Open API root](https://media-hub-ad-free.vercel.app/api) |
| **API documentation** | [Explore endpoints](https://media-hub-ad-free.vercel.app/api/docs) |
| **API information** | [View API information](https://media-hub-ad-free.vercel.app/api/info) |

</div>

### The deployed API is ready to use

The API is accessible through the same Vercel deployment URL. The routes have been tested against the deployed application; use the public base URL in your own requests.

```text
https://media-hub-ad-free.vercel.app
```

For local development, the frontend uses the Vite proxy to communicate with the backend on port `5000`. For the live application, use the deployed URL instead.

---

## ✨ Features

### 🎬 Video and universal discovery

- Search supported YouTube content.
- Explore trending videos and live content.
- Use the universal discovery interface for supported media sources.
- Resolve supported media URLs through the playback endpoint.
- Browse content through dedicated media views.

### 📻 Internet radio

- Search for radio stations.
- Filter stations by country.
- Explore available genres.
- Browse stations using the radio interface.

### 📺 Television and programme guides

- Browse supported TV channels.
- Use the channel data bundled with the project.
- Load electronic programme guide data.
- Retrieve current programme information through the EPG endpoints.

### 🎙️ Podcasts

- Search podcast collections.
- Explore podcast results by region.
- Retrieve episodes from supported feeds.
- Access podcast content through the dedicated interface.

### 📚 Audiobooks

- Search available audiobooks.
- Explore supported regional collections and categories.
- Retrieve chapter information.
- Access audiobook content through its dedicated view.

### 🎧 Shared media player

- Play and pause controls.
- Volume and seek controls.
- Queue drawer.
- Favourites.
- Lyrics drawer.
- Video overlay.
- Picture-in-picture where supported.
- Sleep timer.
- Playback preferences.

### 🎨 Personalisation

- Theme selection.
- Dedicated settings view.
- Keyboard shortcuts.
- Recent universal-media history in browser storage.
- Browser-side preferences where implemented.

### 🔌 API Hub

The application includes an API Hub view for exploring the project's API. The backend also exposes endpoints for media discovery, playback, radio, television, podcasts, audiobooks, lyrics, metadata, subtitles, and stream handling.

> Media availability depends on upstream providers, regional restrictions, and stream compatibility. Availability may change independently of this project.

---

## 🔌 Live API

### Base URL

```text
https://media-hub-ad-free.vercel.app
```

### Quick links

Try the deployed endpoints directly:

| Endpoint | Description |
|:--|:--|
| [`/api/docs`](https://media-hub-ad-free.vercel.app/api/docs) | API documentation |
| [`/api/info`](https://media-hub-ad-free.vercel.app/api/info) | API information |
| [`/api/universal?q=lofi&country=GLOBAL&limit=6`](https://media-hub-ad-free.vercel.app/api/universal?q=lofi&country=GLOBAL&limit=6) | Universal discovery |
| [`/api/youtube/search?q=lofi&limit=10`](https://media-hub-ad-free.vercel.app/api/youtube/search?q=lofi&limit=10) | YouTube search |
| [`/api/radio/search?name=jazz&country=GLOBAL&limit=10`](https://media-hub-ad-free.vercel.app/api/radio/search?name=jazz&country=GLOBAL&limit=10) | Radio search |
| [`/api/podcasts/search?q=technology&country=GLOBAL&limit=10`](https://media-hub-ad-free.vercel.app/api/podcasts/search?q=technology&country=GLOBAL&limit=10) | Podcast search |

### Endpoint reference

<details>
<summary><strong>🔎 Discovery and media playback</strong></summary>

| Route | Purpose |
|:--|:--|
| `/api/universal` | Unified media discovery |
| `/api/all` | Combined discovery |
| `/api/search` | Media search |
| `/api/universal/play` | Resolve supported media for playback |

</details>

<details>
<summary><strong>▶️ YouTube</strong></summary>

| Route | Purpose |
|:--|:--|
| `/api/youtube` | YouTube-related API |
| `/api/youtube/search` | Search videos |
| `/api/youtube/trending` | Retrieve trending content |
| `/api/youtube/live` | Find live content |
| `/api/youtube/extract` | Extract supported media information |

</details>

<details>
<summary><strong>🎙️ Podcasts and audiobooks</strong></summary>

| Route | Purpose |
|:--|:--|
| `/api/podcasts` | Podcast API |
| `/api/podcasts/search` | Search podcasts |
| `/api/podcasts/episodes` | Retrieve episodes |
| `/api/audiobooks` | Audiobook API |
| `/api/audiobooks/search` | Search audiobooks |
| `/api/audiobooks/chapters` | Retrieve chapters |

</details>

<details>
<summary><strong>📡 Radio, TV, and EPG</strong></summary>

| Route | Purpose |
|:--|:--|
| `/api/radio/search` | Search radio stations |
| `/api/tv/channels` | Retrieve TV channel data |
| `/api/epg/load` | Load EPG data |
| `/api/epg/now` | Retrieve current programme information |

</details>

<details>
<summary><strong>🎵 Streams and media metadata</strong></summary>

| Route | Purpose |
|:--|:--|
| `/api/stream` | Stream-related functionality |
| `/api/stream/proxy` | Stream proxy |
| `/api/stream/hls` | HLS stream handling |
| `/api/lyrics` | Lyrics functionality |
| `/api/metadata` | Media metadata functionality |
| `/api/subtitles` | Subtitle functionality |

</details>

The endpoint groups above provide a convenient overview. Check the live documentation for the exact accepted parameters, request formats, and response schemas for each route.

### Example 01 — Python

```python
import requests

BASE_URL = "https://media-hub-ad-free.vercel.app"

params = {
    "q": "lofi",
    "country": "GLOBAL",
    "limit": 6,
}

response = requests.get(
    f"{BASE_URL}/api/universal",
    params=params,
    timeout=30,
)

response.raise_for_status()
data = response.json()

print(data)
```

Install the dependency:

```bash
pip install requests
```

### Example 02 — JavaScript

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
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

const results = await searchMedia("lofi");
console.log(results);
```

### Example 03 — cURL

```bash
curl -X GET \
  "https://media-hub-ad-free.vercel.app/api/universal?q=lofi&country=GLOBAL&limit=6" \
  -H "Accept: application/json"
```

### API integration notes

- Use the public Vercel URL for deployed requests.
- Encode query parameters correctly.
- Check HTTP status codes and handle empty results.
- Allow for third-party provider failures and changing media URLs.
- Consult the live API documentation for endpoint-specific parameters.

---

## ⌨️ Keyboard shortcuts

| Shortcut | Action |
|:--|:--|
| `Space` | Play / pause |
| `M` | Mute / unmute |
| `L` | Toggle lyrics |
| `T` | Cycle themes |
| `Shift + /` | Open shortcuts |
| `F` | Video overlay when available; otherwise fullscreen |
| `F11` | Toggle fullscreen |
| `P` | Picture-in-picture |
| `←` / `→` | Seek by 5 seconds |
| `↑` / `↓` | Adjust volume by 5% |

Shortcuts are ignored while focus is inside supported text-entry and selection fields.

---

## 🧰 Tech stack

<div align="center">

<a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React"/></a>
<a href="https://vite.dev/"><img src="https://img.shields.io/badge/Vite-8-20232A?style=flat-square&logo=vite&logoColor=646CFF" alt="Vite"/></a>
<a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-4-20232A?style=flat-square&logo=tailwindcss&logoColor=06B6D4" alt="Tailwind CSS"/></a>
<a href="https://www.python.org/"><img src="https://img.shields.io/badge/Python-Backend-20232A?style=flat-square&logo=python&logoColor=3776AB" alt="Python"/></a>
<a href="https://flask.palletsprojects.com/"><img src="https://img.shields.io/badge/Flask-API-20232A?style=flat-square&logo=flask&logoColor=white" alt="Flask"/></a>
<a href="https://github.com/video-dev/hls.js/"><img src="https://img.shields.io/badge/HLS.js-Streaming-20232A?style=flat-square" alt="HLS.js"/></a>
<a href="https://vercel.com/"><img src="https://img.shields.io/badge/Vercel-Deployment-20232A?style=flat-square&logo=vercel&logoColor=white" alt="Vercel"/></a>

</div>

| Technology | Usage |
|:--|:--|
| React 19 | Frontend application |
| Vite 8 | Development server and frontend build |
| Tailwind CSS 4 | Styling |
| Python and Flask | Backend API |
| HLS.js | HLS playback support |
| Lucide React | Icons |
| yt-dlp | Supported media extraction |
| Feedparser | Podcast feed parsing |
| Vercel | Public deployment |

The backend also uses libraries for radio discovery, audiobook retrieval, lyrics, metadata, subtitles, and electronic programme guide functionality.

---

## 💻 Local development

### Prerequisites

- Git
- Node.js and npm
- Python 3.10 or newer recommended

### 1. Clone the repository

```bash
git clone https://github.com/Hidden-Rhythm/media-hub.git
cd media-hub
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Create a Python environment

```bash
python -m venv .venv
```

Activate it on Windows Command Prompt:

```bat
.venv\Scripts\activate
```

On Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

On macOS or Linux:

```bash
source .venv/bin/activate
```

Install backend dependencies:

```bash
pip install -r requirements.txt
```

### 4. Configure optional settings

The repository includes `.env.example` for optional configuration.

```env
TMDB_KEY=your_tmdb_api_key
```

Configure the optional TMDB key when you need features that depend on it. Keep private credentials out of committed source code.

### 5. Run the backend

```bash
python app.py
```

The local Flask server runs at:

```text
http://127.0.0.1:5000
```

### 6. Run the frontend

Open a second terminal in the project directory:

```bash
npm run dev
```

Open the local URL printed by Vite. The development configuration proxies `/api` and `/stream` requests to the backend on port `5000`.

### 7. Build for production

```bash
npm run build
```

Preview the generated frontend build:

```bash
npm run preview
```

> **Deployment note:** The local Vite proxy is intended for development. The deployed Vercel application uses its production routing and backend entry point.

---

## 🏗️ Project structure

```text
media-hub/
├── api/
│   └── index.py
├── data/
│   └── dishtv_channels.json
├── src/
│   ├── components/
│   │   ├── Modals/
│   │   │   ├── ChaptersModal.jsx
│   │   │   ├── ConfirmModal.jsx
│   │   │   ├── EpgModal.jsx
│   │   │   ├── MetadataModal.jsx
│   │   │   ├── ShortcutsModal.jsx
│   │   │   ├── SleepTimerModal.jsx
│   │   │   └── ThemeModal.jsx
│   │   ├── Views/
│   │   │   ├── ApiHubView.jsx
│   │   │   ├── AudiobooksView.jsx
│   │   │   ├── FavoritesView.jsx
│   │   │   ├── HomeView.jsx
│   │   │   ├── PodcastsView.jsx
│   │   │   ├── RadioView.jsx
│   │   │   ├── SettingsView.jsx
│   │   │   ├── TVView.jsx
│   │   │   ├── UniversalView.jsx
│   │   │   └── YouTubeView.jsx
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

### Architecture at a glance

<table>
  <tr>
    <th align="left">Layer</th>
    <th align="left">Responsibility</th>
  </tr>
  <tr>
    <td><code>src/components/Views/</code></td>
    <td>Dedicated media pages and the API Hub.</td>
  </tr>
  <tr>
    <td><code>src/components/</code></td>
    <td>Reusable player controls, drawers, modals, and interface components.</td>
  </tr>
  <tr>
    <td><code>src/context/PlayerContext.jsx</code></td>
    <td>Shared playback state and player functionality.</td>
  </tr>
  <tr>
    <td><code>providers.py</code></td>
    <td>Integrations with supported media sources and provider libraries.</td>
  </tr>
  <tr>
    <td><code>epg.py</code></td>
    <td>Electronic programme guide functionality.</td>
  </tr>
  <tr>
    <td><code>api/index.py</code></td>
    <td>Vercel API entry point.</td>
  </tr>
  <tr>
    <td><code>vite.config.js</code></td>
    <td>Frontend development and build configuration.</td>
  </tr>
</table>

---

## 🔒 Configuration and reliability

- **Optional credentials:** Configure supported provider credentials only when required.
- **Browser preferences:** Some settings and recent-search history are stored locally in the browser.
- **Third-party dependencies:** Provider changes can affect search results and playback.
- **API consumers:** Handle failed requests, timeouts, empty results, and invalid media URLs.
- **Stream compatibility:** Not every stream supports every browser or playback feature.

## 📌 Project links

<div align="center">

<a href="https://media-hub-ad-free.vercel.app">
  <img src="https://img.shields.io/badge/TRY%20MEDIA%20HUB-Launch%20Application-7C3AED?style=for-the-badge&logo=vercel&logoColor=white" alt="Launch application"/>
</a>

<br/><br/>

<a href="https://media-hub-ad-free.vercel.app/api/docs">
  <img src="https://img.shields.io/badge/DEVELOPERS-Explore%20the%20API-10B981?style=for-the-badge&logo=fastapi&logoColor=white" alt="Explore API"/>
</a>

<br/><br/>

<sub>Built by <a href="https://github.com/Hidden-Rhythm">hidden_rhythm</a></sub>

</div>
