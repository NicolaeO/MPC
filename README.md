# MPC — Moldovan Professionals Chicago

## Overview
A React + Vite + Tailwind site with practical guides and a job board for Moldovan professionals in the USA. Posts are simple HTML files in `public/posts/`, and `public/posts/index.json` is generated from them by `npm run generate-posts-index`.

## Features
- Home, Articles, Jobs, About and Author pages, with light/dark theme and a ⌘K / Ctrl+K article search
- Articles library with keyword search, topic filters and sorting (state is kept in the URL, so filtered views are shareable)
- Article pages with reading progress, an "On this page" sidebar, share link, related and previous/next articles
- Interactive widgets embeddable in posts: mortgage calculator, investment growth calculator, budget planner, checklists
- Posts are static HTML files read without a backend
- Ready for static hosting; the included Docker image serves the site with nginx

## Quick start
1. Install dependencies: `npm install`
2. Start the dev server: `npm run dev`
3. Add a post: create `public/posts/2026-10-17-my-post.html` using the template in [`public/posts/README.md`](public/posts/README.md).
4. Run `npm run generate-posts-index` to refresh `public/posts/index.json` (it also runs before every build).

## Jobs
Job postings live in `public/jobs.json` as an array:

```json
[
  {
    "id": "acme-backend-2026-10",
    "title": "Backend Engineer",
    "company": "Acme",
    "location": "Chicago, IL",
    "workplace": "Hybrid",
    "type": "Full-time",
    "salary": "$120k–$150k",
    "posted": "2026-10-17",
    "link": "https://acme.example/jobs/123",
    "description": "One or two sentences about the role."
  }
]
```

`workplace` is one of `Remote`, `Hybrid`, `On-site`. Only `http(s):` and `mailto:` links are rendered. With an empty array the page shows an empty state and a list of job boards.

## Deploy
Build with `npm run build` and deploy `dist/` to any static host. The host must fall back to `index.html` for unknown paths (so `/articles` and `/post/...` work on refresh) **but** return a real 404 for missing files under `/posts/`.

With Docker: `docker compose up --build`, then open http://localhost:8080. The image uses `nginx.conf`, which already handles both rules.

## Automation
- `server.js` — Cloudflare Worker that turns a submitted article into a GitHub pull request (deploy with `wrangler`). Configure `GITHUB_TOKEN`, `REPO`, and optionally `BRANCH_BASE` (default `master`) and `ALLOWED_ORIGIN`.
- `app/` — Python script that drafts a new article with the Claude API on a schedule and opens a PR. See `app/.env.example`.
