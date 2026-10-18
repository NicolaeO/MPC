// FILE: src/lib/format.js

/** Formats "YYYY-MM-DD" as a local calendar date (no UTC off-by-one). */
export function formatDate(iso, opts = { month: 'short', day: 'numeric', year: 'numeric' }) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || '')
  if (!m) return iso || ''
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])).toLocaleDateString('en-US', opts)
}

const usd0 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

export function formatUSD(value) {
  return Number.isFinite(value) ? usd0.format(Math.round(value)) : '—'
}

/** $950 · $12K · $1.2M — for axis ticks. */
export function formatUSDCompact(value) {
  const abs = Math.abs(value)
  if (abs >= 1e6) return `$${trim(value / 1e6)}M`
  if (abs >= 1e3) return `$${trim(value / 1e3)}K`
  return `$${Math.round(value)}`
}

const trim = (n) => (Math.abs(n) >= 10 ? Math.round(n).toString() : n.toFixed(1).replace(/\.0$/, ''))

export function formatDuration(months) {
  const y = Math.floor(months / 12)
  const m = months % 12
  const parts = []
  if (y) parts.push(`${y} yr${y === 1 ? '' : 's'}`)
  if (m) parts.push(`${m} mo`)
  return parts.join(' ') || '0 mo'
}
