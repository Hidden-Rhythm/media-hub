
<div align="center">

# media-hub

### Your media. One interface.

A universal media portal for discovering and accessing radio, live television, video, podcasts, audiobooks, and streaming destinations — brought together in a unified, dark-first experience.

<br>

<a href="https://media-hub-ad-free.vercel.app">
  <img src="https://img.shields.io/badge/OPEN%20LIVE%20DEMO-ffffff?style=for-the-badge&logo=vercel&logoColor=000000" alt="Open Live Demo">
</a>
&nbsp;
<a href="https://github.com/Hidden-Rhythm/media-hub">
  <img src="https://img.shields.io/badge/VIEW%20SOURCE-171717?style=for-the-badge&logo=github&logoColor=ffffff" alt="View Source">
</a>

<br><br>

<img src="https://img.shields.io/badge/React-19-111111?style=flat-square&logo=react&logoColor=61DAFB" alt="React">
<img src="https://img.shields.io/badge/Vite-Frontend%20Build-111111?style=flat-square&logo=vite&logoColor=646CFF" alt="Vite">
<img src="https://img.shields.io/badge/HLS.js-Streaming-111111?style=flat-square&logo=javascript&logoColor=F7DF1E" alt="HLS.js">
<img src="https://img.shields.io/badge/License-ISC-111111?style=flat-square" alt="ISC License">

<br><br>

[Live Demo](https://media-hub-ad-free.vercel.app) · [Repository](https://github.com/Hidden-Rhythm/media-hub) · [Issues](https://github.com/Hidden-Rhythm/media-hub/issues)

<br>

<img src="https://capsule-render.vercel.app/api?type=rect&color=0b0b0b&height=2&section=header" width="100%" alt="divider">

</div>

## Overview

**media-hub** is a React-based media portal designed to bring different types of entertainment into one consistent interface.

Instead of treating radio, television, music, video, podcasts, and audiobooks as entirely separate experiences, the project organizes them into dedicated sections while sharing a common application shell and playback interface.

The result is a single place to explore media, access supported streaming destinations, manage favorites, work with a playback queue, and adjust the listening or viewing experience.

The application combines a dark, OLED-inspired visual direction with a modular frontend architecture built around React, Vite, and reusable interface components.

<div align="center">

| 01 — DISCOVER | 02 — PLAY | 03 — PERSONALIZE |
|:---:|:---:|:---:|
| Explore dedicated media sections | Use the shared playback interface | Configure themes and preferences |

</div>

<br>

<div align="center">

**[→ Open media-hub](https://media-hub-ad-free.vercel.app)**

<sub>Live deployment · Hosted on Vercel</sub>

</div>

---

## Contents

- [Features](#features)
- [Media modules](#media-modules)
- [Playback experience](#playback-experience)
- [Keyboard shortcuts](#keyboard-shortcuts)
- [Application architecture](#application-architecture)
- [Technology stack](#technology-stack)
- [Getting started](#getting-started)
- [Development and build](#development-and-build)
- [API and streaming proxy](#api-and-streaming-proxy)
- [Project structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Project information](#project-information)

---

## Features

media-hub is organized around a simple idea: different media formats should be accessible through a coherent interface without sacrificing the controls each experience needs.

<table>
  <thead>
    <tr>
      <th width="30%">Area</th>
      <th>Capabilities</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Media discovery</strong></td>
      <td>Dedicated destinations for radio, TV, YouTube, podcasts, audiobooks, and universal media.</td>
    </tr>
    <tr>
      <td><strong>Shared player</strong></td>
      <td>A common playback interface with play/pause, volume, seeking, and related media controls where supported.</td>
    </tr>
    <tr>
      <td><strong>Queue management</strong></td>
      <td>A dedicated queue drawer for working with the current playback queue.</td>
    </tr>
    <tr>
      <td><strong>Lyrics</strong></td>
      <td>A lyrics drawer integrated into the player experience.</td>
    </tr>
    <tr>
      <td><strong>Video viewing</strong></td>
      <td>A video overlay and fullscreen-related controls.</td>
    </tr>
    <tr>
      <td><strong>Playback utilities</strong></td>
      <td>Sleep timer, media metadata, chapter controls, and electronic programme guide (EPG) interface components.</td>
    </tr>
    <tr>
      <td><strong>Personalization</strong></td>
      <td>Theme selection, settings, and a dedicated favorites section.</td>
    </tr>
    <tr>
      <td><strong>Keyboard interaction</strong></td>
      <td>Global shortcuts for playback, volume, seeking, themes, lyrics, and display modes.</td>
    </tr>
    <tr>
      <td><strong>Responsive foundation</strong></td>
      <td>A component-based React application with a shared layout and dedicated views.</td>
    </tr>
  </tbody>
</table>

> **Compatibility note:** Actual playback depends on the selected source, supported media format, browser capabilities, network access, and any required API or streaming services. Availability can vary between sources.

---

## Media modules

Each destination focuses on a different type of media while remaining part of the same application.

### Radio

A dedicated space for internet radio and audio streams.

- Browse the radio section.
- Start supported live audio streams.
- Use the shared player interface for playback controls.
- Access the queue and lyrics interface where applicable.

The project metadata describes an ambition to cover a broad directory of global radio stations. The availability of an individual station depends on its source and stream endpoint.

### Live TV

A television-oriented interface for supported live channels.

- Access the TV section.
- Use the video playback experience for compatible streams.
- Access the EPG interface for programme-guide functionality where supported.
- Use fullscreen and video display controls when available.

**Streaming formats matter:** browser playback support varies. HLS playback can be handled through HLS.js in compatible environments, but not every stream is guaranteed to work.

### YouTube

A dedicated destination for YouTube-related media.

- Access the YouTube section.
- Explore supported video content through the available interface.
- Use the video experience where the selected media source supports it.

Playback and embedding behavior remain subject to YouTube availability, browser restrictions, and source-specific limitations.

### Podcasts

A dedicated section for podcast-oriented listening.

- Access podcast content through its dedicated view.
- Use the shared audio experience where supported.
- Keep podcast listening within the broader media interface.

### Audiobooks

A dedicated destination for audiobook content.

- Access the audiobook section.
- Use playback controls supported by the selected source.
- Access chapter-related controls where the media and interface support them.

### Universal media

The universal media view provides a broader destination for media that does not fit exclusively into one of the specialized sections.

It complements the dedicated radio, television, video, podcast, and audiobook views.

### API Hub

The API Hub provides a dedicated application destination for API-related functionality.

Its availability and behavior depend on the implementation and any associated backend services configured for the deployment.

### Favorites

A dedicated destination for accessing favorited media.

### Settings

A central place for application preferences, including the settings and theme-related functionality exposed by the interface.

---

## Playback experience

The playback interface is shared across the application, helping maintain consistent interaction patterns between different media destinations.

### Player controls

The application includes a shared player bar and player context, with playback actions adapted to the selected media.

| Control or component | Purpose |
|---|---|
| Player bar | Provides the common playback interface. |
| Queue drawer | Opens the playback queue interface. |
| Lyrics drawer | Opens the lyrics interface. |
| Video overlay | Provides a dedicated video display surface. |
| Sleep timer | Opens the sleep-timer controls. |
| Metadata modal | Opens the media metadata interface. |
| EPG modal | Opens the electronic programme guide interface. |
| Chapters modal | Opens the chapter controls. |
| Theme modal | Opens theme selection. |
| Shortcuts modal | Displays the keyboard-shortcut reference. |
| Confirmation modal | Provides a reusable confirmation interface. |
| Toast container | Displays application notifications. |

These are the interface components identified in the application source. The data available inside each component depends on the selected media source and the relevant implementation.

### Themes and visual behavior

The application follows a dark, OLED-inspired design direction.

Its shared shell also uses the active destination to influence the ambient background color, allowing the interface to respond visually as the user moves between sections.

The theme interface provides a dedicated place to access theme selection rather than requiring users to navigate through unrelated controls.

---

## Keyboard shortcuts

The application registers global keyboard shortcuts for common actions. The following table documents the shortcuts identified in the current application source.

| Key | Action |
|:---:|---|
| `Space` | Play or pause |
| `M` | Toggle mute |
| `L` | Toggle lyrics |
| `T` | Cycle theme |
| `Shift + /` | Open the keyboard-shortcuts modal |
| `F` | Open the video overlay when applicable; otherwise toggle fullscreen |
| `F11` | Toggle fullscreen |
| `P` | Toggle picture-in-picture |
| `←` | Seek backward by 5 seconds |
| `→` | Seek forward by 5 seconds |
| `↑` | Increase volume by 5% |
| `↓` | Decrease volume by 5% |

**Input safety:** The keyboard handler ignores events originating from standard `INPUT`, `SELECT`, and `TEXTAREA` elements so ordinary typing and form interaction do not accidentally trigger these shortcuts.

Some actions depend on browser support or the active media type. For example, picture-in-picture is not available for every media source.

---

## Application architecture

media-hub uses a modular React architecture. The application shell coordinates navigation and shared interface components, while dedicated views handle individual destinations.

```text
media-hub
│
├── Application shell
│   ├── Navigation and routing
│   ├── Active view
│   └── Shared display behavior
│
├── Shared player context
│   └── usePlayer
│
├── Reusable components
│   ├── Sidebar
│   ├── PlayerBar
│   ├── VideoOverlay
│   ├── LyricsDrawer
│   ├── QueueDrawer
│   └── ToastContainer
│
├── Modal interfaces
│   ├── Sleep timer
│   ├── Metadata
│   ├── EPG
│   ├── Chapters
│   ├── Themes
│   ├── Shortcuts
│   └── Confirmation
│
└── Dedicated views
    ├── Home
    ├── Radio
    ├── TV
    ├── YouTube
    ├── Podcasts
    ├── Audiobooks
    ├── Universal media
    ├── API Hub
    ├── Favorites
    └── Settings
```

### Navigation

The application handles its supported paths through browser history and a `popstate` listener.

The source includes the following destinations and aliases:

| Path | Destination |
|---|---|
| `/` | Home |
| `/home` | Home |
| `/radio` | Radio |
| `/tv` | TV |
| `/youtube` | YouTube |
| `/podcasts` | Podcasts |
| `/audiobooks` | Audiobooks |
| `/universal` | Universal media |
| `/api-hub` | API Hub |
| `/api` | API Hub |
| `/favorites` | Favorites |
| `/settings` | Settings |

The application also listens for fullscreen changes and uses a browser preference named `mh_auto_fullscreen`, enabled by default when no saved value exists.

### Shared state

The shared player context exposes playback state and actions to the application components through `PlayerProvider` and `usePlayer`.

This avoids requiring each view to implement a completely independent player interface.

### Development proxy

Vite is configured to forward two request prefixes to a local service:

- `/api` → `http://127.0.0.1:5000`
- `/stream` → `http://127.0.0.1:5000`

This proxy is part of the development configuration. It does not, by itself, provide a backend or guarantee that the same routes exist in production.

---

## Technology stack

The project uses a modern JavaScript frontend stack.

| Technology | Role |
|---|---|
| [React](https://react.dev/) | Component-based application interface |
| [React DOM](https://react.dev/) | Rendering React into the browser |
| [Vite](https://vite.dev/) | Development server and production build |
| [HLS.js](https://github.com/video-dev/hls.js/) | HLS playback support in compatible browsers |
| [Lucide React](https://lucide.dev/) | Interface icons |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling foundation |
| [clsx](https://github.com/lukeed/clsx) | Conditional class-name composition |
| [tailwind-merge](https://github.com/dcastil/tailwind-merge) | Resolving conflicting Tailwind utility classes |
| [PostCSS](https://postcss.org/) | CSS processing |
| [Autoprefixer](https://github.com/postcss/autoprefixer) | CSS vendor-prefix handling |

### Runtime and package tooling

The project uses ES modules and npm scripts.

The available scripts are:

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Generate the production build |
| `npm run preview` | Preview the generated production build |

Use a current Node.js release compatible with the installed Vite version. Check the package requirements if you encounter a Node.js engine-version error.

---

## Getting started

Run the project locally to explore the application and work on its source code.

### 1. Clone the repository

```bash
git clone https://github.com/Hidden-Rhythm/media-hub.git
cd media-hub
```

### 2. Install dependencies

```bash
npm install
```

This installs the dependencies defined in `package.json`.

### 3. Start the development server

```bash
npm run dev
```

The Vite configuration specifies port `3000`.

Open the local address shown in the terminal, normally:

```text
http://localhost:3000
```

If the port is already occupied, stop the conflicting process or configure an available port.

### 4. Create a production build

```bash
npm run build
```

Vite generates the production output in the `dist/` directory.

### 5. Preview the production build

```bash
npm run preview
```

Vite starts a local preview server for the generated build. Use the URL printed in the terminal.

---

## API and streaming proxy

The development configuration forwards `/api` and `/stream` requests to a service running at:

```text
http://127.0.0.1:5000
```

If your local setup relies on these routes, the corresponding backend service must be available separately.

### Expected development setup

```text
Browser
   │
   ▼
Vite development server
   │
   ├── /api/* ────────┐
   │                  │
   └── /stream/* ─────┤
                      ▼
              Local service
              127.0.0.1:5000
```

### Important deployment distinction

Vite's development proxy is not automatically carried into a production deployment.

If the deployed frontend needs `/api` or `/stream`, those requests must be routed to the appropriate production service through deployment configuration or another supported architecture.

The live frontend may load successfully even when an individual API-backed feature or stream is unavailable. Diagnose those separately rather than assuming a successful frontend build guarantees every media source will play.

---

## Project structure

The following is a high-level guide to the main files and source areas referenced by the application.

```text
media-hub/
│
├── public/
│   └── Public static assets
│
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   │
│   ├── components/
│   │   ├── Sidebar
│   │   ├── PlayerBar
│   │   ├── VideoOverlay
│   │   ├── LyricsDrawer
│   │   ├── QueueDrawer
│   │   └── ToastContainer
│   │
│   ├── modals/
│   │   ├── SleepTimerModal
│   │   ├── MetadataModal
│   │   ├── EpgModal
│   │   ├── ChaptersModal
│   │   ├── ThemeModal
│   │   ├── ShortcutsModal
│   │   └── ConfirmModal
│   │
│   └── views/
│       ├── HomeView
│       ├── RadioView
│       ├── TVView
│       ├── YouTubeView
│       ├── PodcastsView
│       ├── AudiobooksView
│       ├── UniversalView
│       ├── ApiHubView
│       ├── FavoritesView
│       └── SettingsView
│
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

*This is a conceptual overview, not a guaranteed exhaustive file listing. Refer to the repository for the exact current filenames and directories.*

### Key files

| File | Responsibility |
|---|---|
| `index.html` | HTML document, page metadata, and React mounting element |
| `src/main.jsx` | Application entry point and React root |
| `src/App.jsx` | Application shell, view selection, navigation, and shared UI integration |
| `src/index.css` | Main application stylesheet |
| `vite.config.js` | Vite configuration, development proxy, and build output |
| `package.json` | Project metadata, dependencies, and npm scripts |

---

## Troubleshooting

### The development server does not start

Verify that Node.js and npm are installed:

```bash
node --version
npm --version
```

Then reinstall dependencies if necessary:

```bash
npm install
npm run dev
```

If the installed Node.js version is incompatible with the toolchain, install a compatible version and retry.

### The page loads, but a stream does not play

A working interface does not guarantee a working media source.

Check:

- Whether the source URL is still accessible.
- Whether the stream requires authentication or special headers.
- Whether the browser supports the media format.
- Whether HLS playback is supported by the selected browser and source.
- Whether cross-origin restrictions prevent playback.
- Whether the source itself is offline.

Test a different supported source to distinguish an application problem from a source-specific issue.

### API requests fail locally

Check whether the required service is listening on port `5000`.

```text
127.0.0.1:5000
```

Review the browser's developer console and network panel to identify failed `/api` or `/stream` requests.

Remember that Vite's proxy only forwards requests; it does not implement the API.

### The deployed application behaves differently

The Vercel deployment and local development environment may differ in their routing, environment, and available backend services.

Check the deployment logs, browser console, failed network requests, and production routing configuration. If a feature relies on a backend, ensure the production service is reachable from the deployed frontend.

### Keyboard shortcuts interfere with another action

Some shortcuts depend on focus, browser behavior, and the active media source. Test the action with focus outside form fields and check whether the browser or operating system reserves the same key combination.

---

## Contributing

Contributions that improve reliability, usability, accessibility, playback compatibility, and maintainability are welcome.

### Suggested workflow

1. Fork the repository.
2. Create a branch for your change.
3. Install dependencies with `npm install`.
4. Run the development server and test the affected interface.
5. Verify that the production build succeeds.
6. Submit a pull request with a clear explanation of the change.

### Before submitting

```bash
npm run build
```

When changing a media module, check its navigation, shared player integration, empty and error states, and behavior on smaller screens.

When modifying global playback or keyboard handling, verify that existing player controls and shortcuts continue to work.

Please avoid committing generated output, dependency folders, private credentials, or unrelated configuration changes.

---

## Project information

<table>
  <tbody>
    <tr>
      <td><strong>Project</strong></td>
      <td>media-hub</td>
    </tr>
    <tr>
      <td><strong>Author</strong></td>
      <td><a href="https://github.com/Hidden-Rhythm">Hidden-Rhythm</a></td>
    </tr>
    <tr>
      <td><strong>Live demo</strong></td>
      <td><a href="https://media-hub-ad-free.vercel.app">media-hub-ad-free.vercel.app</a></td>
    </tr>
    <tr>
      <td><strong>Source code</strong></td>
      <td><a href="https://github.com/Hidden-Rhythm/media-hub">GitHub repository</a></td>
    </tr>
    <tr>
      <td><strong>Version in package metadata</strong></td>
      <td>1.0.0</td>
    </tr>
    <tr>
      <td><strong>License declared in package metadata</strong></td>
      <td>ISC</td>
    </tr>
  </tbody>
</table>

The package metadata declares the ISC license. Refer to the repository's license file, if present, for the authoritative terms governing use and redistribution.

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=rect&color=0b0b0b&height=2&section=footer" width="100%" alt="divider">

<br>

### media-hub

**One interface. More ways to experience media.**

<br>

Built by **[Hidden-Rhythm](https://github.com/Hidden-Rhythm)**

<sub>Designed with intention. Built to bring media together.</sub>

<br><br>

<a href="https://media-hub-ad-free.vercel.app">LIVE DEMO</a>
&nbsp; · &nbsp;
<a href="https://github.com/Hidden-Rhythm/media-hub">SOURCE CODE</a>
&nbsp; · &nbsp;
<a href="https://github.com/Hidden-Rhythm/media-hub/issues">ISSUES</a>

</div>
