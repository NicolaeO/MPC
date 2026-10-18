// FILE: src/lib/posts.js
// Loading, parsing and searching of the static posts in public/posts/.
import { useEffect, useState } from 'react'

const SLUG_RE = /^[a-z0-9][a-z0-9-]*$/i
const WORDS_PER_MINUTE = 220

let indexPromise = null

/** Fetches public/posts/index.json once per page load, sorted newest first. */
export function loadPosts() {
  if (!indexPromise) {
    indexPromise = fetch('/posts/index.json')
      .then((res) => {
        if (!res.ok) throw new Error(`Could not load articles (HTTP ${res.status})`)
        return res.json()
      })
      .then((posts) => [...posts].sort((a, b) => String(b.date || '').localeCompare(String(a.date || ''))))
      .catch((err) => {
        indexPromise = null // allow a retry on the next call
        throw err
      })
  }
  return indexPromise
}

export function usePosts() {
  const [state, setState] = useState({ posts: [], loading: true, error: null })
  useEffect(() => {
    let active = true
    loadPosts()
      .then((posts) => active && setState({ posts, loading: false, error: null }))
      .catch((error) => active && setState({ posts: [], loading: false, error }))
    return () => {
      active = false
    }
  }, [])
  return state
}

/**
 * Fetches the raw HTML for a post. Returns null when the post doesn't exist —
 * including when the host answers with the SPA's index.html fallback (status 200).
 */
export async function loadPostHtml(slug, signal) {
  if (!SLUG_RE.test(slug)) return null
  const res = await fetch(`/posts/${slug}.html`, { signal })
  if (!res.ok) return null
  const text = await res.text()
  if (/<div id="root">\s*<\/div>/.test(text)) return null
  return text
}

export function slugify(text) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Turns a full post HTML document into something safe to drop into the page:
 * strips <head>-only elements, removes the duplicate in-body title, adds ids to
 * section headings for the table of contents, prepares interactive widgets and
 * opens external links in a new tab.
 */
export function parsePost(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const meta = (name) => doc.querySelector(`meta[name="${name}"]`)?.getAttribute('content')?.trim() || ''
  const body = doc.body

  body.querySelectorAll('script, style, link, meta, base').forEach((el) => el.remove())

  const inlineTitle = body.querySelector('.heading h1')
  const fallbackTitle = inlineTitle?.textContent.trim() || ''
  inlineTitle?.remove()

  // Legacy posts use <h1> for card titles; the page should have exactly one h1.
  body.querySelectorAll('.card-header h1').forEach((h1) => {
    const h3 = doc.createElement('h3')
    h3.innerHTML = h1.innerHTML
    h1.replaceWith(h3)
  })

  const headings = []
  const used = new Set()
  body.querySelectorAll('h2').forEach((h) => {
    if (h.closest('.card')) return
    const text = h.textContent.replace(/\s+/g, ' ').trim()
    const base = slugify(text) || 'section'
    let id = base
    for (let n = 2; used.has(id); n++) id = `${base}-${n}`
    used.add(id)
    h.id = id
    headings.push({ id, text })
  })

  body.querySelectorAll('a[href]').forEach((a) => {
    if (/^https?:\/\//i.test(a.getAttribute('href'))) {
      a.setAttribute('target', '_blank')
      a.setAttribute('rel', 'noopener noreferrer')
    }
  })

  // <ul data-checklist="id"> becomes an interactive, persisted checklist.
  body.querySelectorAll('ul[data-checklist]').forEach((ul) => {
    const mount = doc.createElement('div')
    mount.setAttribute('data-widget', 'checklist')
    mount.setAttribute('data-id', ul.getAttribute('data-checklist'))
    if (ul.dataset.title) mount.setAttribute('data-title', ul.dataset.title)
    const items = [...ul.querySelectorAll(':scope > li')].map((li) => li.innerHTML.trim())
    mount.setAttribute('data-items', JSON.stringify(items))
    ul.replaceWith(mount)
  })
  body.querySelectorAll('[data-widget]').forEach((el) => el.classList.add('widget'))

  const words = (body.textContent || '').trim().split(/\s+/).filter(Boolean).length

  return {
    html: body.innerHTML,
    headings,
    title: meta('title') || fallbackTitle,
    date: meta('date'),
    category: meta('category'),
    excerpt: meta('excerpt'),
    readingTime: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
  }
}

const normalize = (s) =>
  String(s || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()

/** Every query word must match title, excerpt or category; title hits rank higher. */
export function searchPosts(posts, query) {
  const terms = normalize(query).split(/\s+/).filter(Boolean)
  if (!terms.length) return posts
  return posts
    .map((post) => {
      const title = normalize(post.title)
      const rest = normalize(`${post.excerpt} ${post.category}`)
      let score = 0
      for (const term of terms) {
        if (title.includes(term)) score += 3
        else if (rest.includes(term)) score += 1
        else return null
      }
      return { post, score }
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.post)
}
