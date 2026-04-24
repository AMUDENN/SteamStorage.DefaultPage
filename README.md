# SteamStorage — DefaultPage

The official landing page for the [SteamStorage](https://github.com/AMUDENN/SteamStorage) project ecosystem.
A static web application serving as the entry point for users and developers — featuring an overview of the platform,
documentation for all repositories, and contact information.

---

## Projects

| Repository | Description |
|---|---|
| [SteamStorageAPI](https://github.com/AMUDENN/SteamStorageAPI) | REST API — core backend (ASP.NET Core 10) |
| [SteamStorageAPI.SDK](https://github.com/AMUDENN/SteamStorageAPI.SDK) | .NET 10 client library for the API |
| [SteamStorage](https://github.com/AMUDENN/SteamStorage) | Desktop application (Avalonia) |
| **SteamStorage.DefaultPage** | This landing page |

---

## Structure

```
SteamStorage.DefaultPage/
├── index.html              — shell: nav header, footer, iframe container
├── frames/
│   ├── home.html           — hero, feature cards, welcome section
│   ├── guide.html          — documentation hub (tabbed README viewer)
│   └── contacts.html       — GitHub, Telegram, Email cards
├── css/
│   ├── main-style.css      — design tokens, typography, scrollbars
│   ├── layout-style.css    — header, navigation, footer, iframe
│   ├── home-style.css      — hero, feature grid, welcome card
│   ├── guide-style.css     — tabs, sidebar nav, code blocks
│   └── contacts-style.css  — contact cards
└── js/
    └── menu.js             — active nav sync, mobile menu, card glow
```

The page uses an **iframe shell pattern** — `index.html` holds the persistent navigation header and footer, while each
section (`home`, `guide`, `contacts`) is loaded into a named `<iframe name="page">`. Navigation links use
`target="page"` to swap content without reloading the shell.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 (semantic elements) |
| Styles | CSS3 — custom properties, Grid, Flexbox, `backdrop-filter`, animations |
| Scripting | Vanilla JavaScript (ES2020+, IIFE, no build step) |
| Fonts | Space Grotesk · Manrope · JetBrains Mono (Google Fonts) |

No bundler, no framework, no dependencies — just static files.

---

## Getting Started

Open `index.html` directly in a browser, or serve the directory with any static file server:

```bash
# Python
python -m http.server 8000

# Node.js (npx)
npx serve .
```

Then navigate to `http://localhost:8000`.
