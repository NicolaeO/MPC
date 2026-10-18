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

- `main.jsx` — React entry point, wraps app in `<BrowserRouter>`, imports `index.css` and `styles/post.css`
- `App.jsx` — layout (header, footer, ⌘K search dialog, theme) and `<Routes>`: Home, Articles, Jobs, About, Author, `/post/:slug`, and a 404 catch-all
- `lib/posts.js` — `usePosts()` (fetches and caches `index.json`), `loadPostHtml()` (treats the SPA's index.html fallback as "not found"), `parsePost()` (strips `<head>` content, removes the duplicate in-body `<h1>`, adds heading ids, prepares widgets), `searchPosts()`
- `lib/categories.js` — the five topic categories and their Tailwind classes
- `pages/PostView.jsx` — renders post HTML, mounts widgets into `[data-widget]` nodes via portals, reading progress, table of contents, related/prev/next
- `components/widgets/` — interactive widgets posts can embed (mortgage, compound growth, budget, checklist) and the shared `StackedColumns` chart

### Content (`public/posts/`)

Posts are plain `.html` files. Each must include meta tags that `generate-posts.js` reads to build the index:

```html
<meta name="title" content="Post Title">
<meta name="date" content="YYYY-MM-DD">
<meta name="category" content="Finance">   <!-- Finance | Career | Housing | Settling In | Health -->
<meta name="excerpt" content="Short description">
```

`<meta name="draft" content="true">` keeps a post out of the index. See `public/posts/README.md` for the full template, the semantic classes posts use (no inline styles), and widget markup.

`scripts/generate-posts.js` scans all `.html` files in `public/posts/`, extracts these tags, and writes `public/posts/index.json`. This runs automatically before every `npm run build` via the `prebuild` hook.

After adding or editing a post, run `npm run generate-posts-index` to update the index in development.

### Backend (`server.js`)

Cloudflare Workers script that handles post submissions via the GitHub API: creates a branch, commits the HTML file, and opens a pull request. Deploy with `wrangler`.

`app/` is a separate Python job that drafts articles with the Claude API and opens PRs; `app/lib/topics.py` holds its topic list (remove topics once a post covers them).

### Deployment

`Dockerfile` builds the site and serves it with nginx using `nginx.conf` (SPA fallback for routes, real 404s under `/posts/`).

### Styling

Global styles, Tailwind directives, shared component classes (`.page`, `.surface`, `.btn-primary`, `.field`, `.chip-*`) and chart color tokens (`--viz-*`) are in `src/index.css`. Dark mode is class-based (`dark` on `<html>`). Article styles are in `src/styles/post.css`, scoped to `.post-content` and excluding `.widget` subtrees. Tailwind's `container` plugin is disabled because posts use a `.container` wrapper.
