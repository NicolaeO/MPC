// FILE: scripts/generate-posts.js
// Node script: scans public/posts/*.html and generates public/posts/index.json
//
// Each post declares its metadata in <head>:
//   <meta name="title"    content="Post Title">
//   <meta name="date"     content="YYYY-MM-DD">
//   <meta name="category" content="Finance">          (Finance | Career | Housing | Settling In | Health)
//   <meta name="excerpt"  content="One-sentence summary">
//   <meta name="draft"    content="true">             (optional — keeps the file out of the index)
const fs = require('fs')
const path = require('path')

const postsDir = path.join(__dirname, '..', 'public', 'posts')
const outFile = path.join(postsDir, 'index.json')

const WORDS_PER_MINUTE = 220
const EXCERPT_MAX = 180

const NAMED_ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  mdash: '—', ndash: '–', hellip: '…', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“',
}

function decodeEntities(str) {
  return str.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code) => {
    if (code[0] === '#') {
      const n = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10)
      return Number.isFinite(n) ? String.fromCodePoint(n) : match
    }
    return NAMED_ENTITIES[code.toLowerCase()] ?? match
  })
}

function parseAttrs(tag) {
  const attrs = {}
  const re = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/g
  let m
  while ((m = re.exec(tag))) attrs[m[1].toLowerCase()] = m[2] ?? m[3] ?? m[4] ?? ''
  return attrs
}

// Attribute order and quote style don't matter, and apostrophes inside "…" are fine.
function readMeta(html, name) {
  for (const tag of html.match(/<meta\b[^>]*>/gi) || []) {
    const attrs = parseAttrs(tag)
    if ((attrs.name || '').toLowerCase() === name) return decodeEntities(attrs.content || '').replace(/\s+/g, ' ').trim()
  }
  return ''
}

const toText = (html) =>
  decodeEntities(html.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim()

function bodyOf(html) {
  const m = html.match(/<body\b[^>]*>([\s\S]*)<\/body>/i)
  return m ? m[1] : html
}

function truncate(text, max) {
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s,;:.—–-]+$/, '') + '…'
}

function buildEntry(file) {
  const html = fs.readFileSync(path.join(postsDir, file), 'utf8')
  const slug = file.replace(/\.html?$/i, '')
  if (readMeta(html, 'draft').toLowerCase() === 'true') return null

  const body = bodyOf(html)
  const firstParagraph = body.match(/<p\b[^>]*>([\s\S]*?)<\/p>/i)
  const words = toText(body).split(' ').filter(Boolean).length

  let date = readMeta(html, 'date')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const fromName = slug.slice(0, 10)
    if (date) console.warn(`  ! ${file}: date "${date}" is not YYYY-MM-DD`)
    date = /^\d{4}-\d{2}-\d{2}$/.test(fromName) ? fromName : ''
  }

  const entry = {
    slug,
    title: readMeta(html, 'title') || toText(body.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || '') || slug,
    date,
    category: readMeta(html, 'category') || 'General',
    excerpt: truncate(readMeta(html, 'excerpt') || (firstParagraph ? toText(firstParagraph[1]) : ''), EXCERPT_MAX),
    readingTime: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
  }

  for (const key of ['date', 'excerpt']) {
    if (!entry[key]) console.warn(`  ! ${file}: missing ${key}`)
  }
  if (entry.category === 'General') console.warn(`  ! ${file}: missing <meta name="category">`)
  return entry
}

const files = fs.readdirSync(postsDir).filter((f) => /\.html?$/i.test(f))
const posts = files.map(buildEntry).filter(Boolean)
posts.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug))
fs.writeFileSync(outFile, JSON.stringify(posts, null, 2) + '\n')
console.log(`Generated ${path.relative(process.cwd(), outFile)} — ${posts.length} posts (${files.length - posts.length} drafts skipped)`)
