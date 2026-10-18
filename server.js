// FILE: server.js
// Cloudflare Worker: accepts an article submission and opens a GitHub pull request with it.
//
// Environment:
//   GITHUB_TOKEN    (secret) token with contents + pull-request write access
//   REPO            "owner/name"
//   BRANCH_BASE     branch to open PRs against (default "master")
//   ALLOWED_ORIGIN  site origin allowed to call this worker (default "*")

const API = 'https://api.github.com'
const CATEGORIES = ['Finance', 'Career', 'Housing', 'Settling In', 'Health']

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

// btoa() only accepts Latin-1, so encode to UTF-8 first (ă, î, ș, ț, em dashes…).
function toBase64(str) {
  const bytes = new TextEncoder().encode(str)
  let binary = ''
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  return btoa(binary)
}

function slugify(title) {
  const slug = title
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/-+$/, '')
  return slug || 'post'
}

export default {
  async fetch(request, env) {
    const cors = {
      'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
    const json = (body, status = 200) =>
      new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } })

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors })
    if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

    let payload
    try {
      payload = await request.json()
    } catch {
      return json({ error: 'Invalid JSON body' }, 400)
    }

    const { name, email, title, content, category, excerpt } = payload || {}
    if (![name, email, title, content].every((v) => typeof v === 'string' && v.trim())) {
      return json({ error: 'Missing fields: name, email, title and content are required' }, 400)
    }
    if (title.length > 200 || content.length > 100_000) return json({ error: 'Submission too large' }, 413)

    const gh = async (path, init = {}) => {
      const res = await fetch(`${API}/repos/${env.REPO}${path}`, {
        ...init,
        headers: {
          Authorization: `Bearer ${env.GITHUB_TOKEN}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          'User-Agent': 'mpc-post-submission-worker', // GitHub rejects requests without one
          ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        },
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(`GitHub ${res.status} on ${init.method || 'GET'} ${path}: ${data.message || 'request failed'}`)
      return data
    }

    const baseBranch = env.BRANCH_BASE || 'master'
    const date = new Date().toISOString().slice(0, 10)
    const slug = `${date}-${slugify(title)}`
    const branch = `submit/${slug}-${Date.now().toString(36)}` // unique even for same-day resubmissions
    const filePath = `public/posts/${slug}.html`
    const safeTitle = escapeHtml(title.trim())
    const safeCategory = CATEGORIES.includes(category) ? category : 'General'

    // The submitter's email goes in the PR only — never into the public page.
    // `content` is the author's HTML and is published as-is, so it MUST be reviewed in the PR.
    const html = `<!doctype html>
<html>
<head>
    <meta name="title" content="${safeTitle}">
    <meta name="date" content="${date}">
    <meta name="category" content="${safeCategory}">
    <meta name="excerpt" content="${escapeHtml(typeof excerpt === 'string' ? excerpt.trim() : '')}">
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body>
<div class="container">
    <div class="heading">
        <h1>${safeTitle}</h1>
        <p>Submitted by ${escapeHtml(name.trim())}</p>
    </div>
    ${content}
</div>
</body>
</html>
`

    try {
      const ref = await gh(`/git/ref/heads/${baseBranch}`)
      await gh('/git/refs', { method: 'POST', body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: ref.object.sha }) })
      await gh(`/contents/${filePath}`, {
        method: 'PUT',
        body: JSON.stringify({ message: `Add post submission: ${title.trim()}`, content: toBase64(html), branch }),
      })
      const pr = await gh('/pulls', {
        method: 'POST',
        body: JSON.stringify({
          title: `New post submission: ${title.trim()}`,
          head: branch,
          base: baseBranch,
          body:
            `Submitted by ${name.trim()} (${email.trim()}).\n\n` +
            'The article HTML is rendered on the site as-is. Before merging, check it for scripts, iframes, ' +
            'inline event handlers and broken markup, and fill in the category and excerpt meta tags.',
        }),
      })
      return json({ success: true, prUrl: pr.html_url }, 201)
    } catch (err) {
      return json({ success: false, error: err.message }, 502)
    }
  },
}
