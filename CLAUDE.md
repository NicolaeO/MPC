# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev                    # Start Vite dev server
npm run build                  # Runs generate-posts-index, then builds to dist/
npm run preview                # Preview the production build locally
npm run generate-posts-index   # Scan public/posts/*.html and regenerate index.json
```

No test suite is configured.

## Architecture

**Moldovan Professionals Chicago (MPC)** — a community site for Moldovan professionals in the USA to share articles and job opportunities.

**Stack:** React 18 + React Router v6, Vite, Tailwind CSS, with a Cloudflare Workers backend (`server.js`).

### Frontend (`src/`)

- `main.jsx` — React entry point, wraps app in `<BrowserRouter>`
- `App.jsx` — top-level layout with `<Routes>`: Home, Articles, Jobs, About, and `/post/:slug`
- `pages/PostView.jsx` — fetches the raw HTML file for a given slug and renders it inside a container
- `pages/Home.jsx` — fetches `index.json` and displays the 4 most recent posts

### Content (`public/posts/`)

Posts are plain `.html` files. Each must include meta tags that `generate-posts.js` reads to build the index:

```html
<meta name="title" content="Post Title">
<meta name="date" content="YYYY-MM-DD">
<meta name="excerpt" content="Short description">
```

`scripts/generate-posts.js` scans all `.html` files in `public/posts/`, extracts these tags, and writes `public/posts/index.json`. This runs automatically before every `npm run build` via the `prebuild` hook.

After adding or editing a post, run `npm run generate-posts-index` to update the index in development.

### Backend (`server.js`)

Cloudflare Workers script that handles post submissions via the GitHub API: creates a branch, commits the HTML file, and opens a pull request. Deploy with `wrangler`.

### Styling

Global styles and Tailwind directives are in `src/index.css`. Custom post styles (used inside rendered HTML posts) live in `public/posts/post-style.css`.
