// FILE: src/pages/Home.jsx
import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import PostCard, { PostCardSkeleton } from '../components/PostCard'
import { CATEGORIES, getCategory } from '../lib/categories'
import { usePosts } from '../lib/posts'
import { useDocumentTitle } from '../lib/hooks'

// Ordered reading path for newcomers. Missing slugs are skipped automatically.
const START_HERE = [
  ['2025-12-22-first-steps-when-you-arrive-in-usa', 'Your first 30 days'],
  ['2025-12-10-how-to-open-a-bank-account', 'Open a bank account'],
  ['2025-12-15-building-your-credit-score', 'Build credit from zero'],
  ['2025-12-28-renting-your-first-apartment', 'Rent an apartment'],
  ['2026-01-05-health-insurance-in-the-usa', 'Get health insurance'],
  ['2026-01-20-how-to-find-a-job-in-the-usa', 'Land a job'],
]

const TOOLS = [
  {
    slug: '2026-05-03-understanding-mortgage-interest',
    title: 'Mortgage calculator',
    text: 'See your monthly payment, total interest, and how extra payments shorten your loan.',
    icon: 'home',
  },
  {
    slug: '2026-07-15-investing-for-beginners',
    title: 'Investment growth',
    text: 'Watch compound growth turn small monthly contributions into real wealth.',
    icon: 'sparkles',
  },
  {
    slug: '2026-06-16-budgeting-and-emergency-fund',
    title: 'Budget planner',
    text: 'Split your take-home pay with the 50/30/20 rule and size your emergency fund.',
    icon: 'calculator',
  },
  {
    slug: '2025-12-22-first-steps-when-you-arrive-in-usa',
    title: 'First-30-days checklist',
    text: 'Tick off every setup task as you go — your progress is saved on this device.',
    icon: 'check',
  },
]

export default function Home({ onOpenSearch }) {
  useDocumentTitle('')
  const { posts, loading, error } = usePosts()
  const bySlug = useMemo(() => new Map(posts.map((p) => [p.slug, p])), [posts])
  const counts = useMemo(() => {
    const m = new Map()
    posts.forEach((p) => {
      const slug = getCategory(p.category).slug
      m.set(slug, (m.get(slug) || 0) + 1)
    })
    return m
  }, [posts])

  const [featured, ...recent] = posts
  const path = START_HERE.filter(([slug]) => bySlug.has(slug))
  const tools = TOOLS.filter((t) => bySlug.has(t.slug))

  return (
    <div className="animate-fade-in">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative isolate -mt-16 overflow-hidden pb-16 pt-32 sm:pb-24 sm:pt-40">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,theme(colors.brand.100),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_top,theme(colors.brand.950),transparent_60%)]" />
          <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-brand-400/25 blur-3xl dark:bg-brand-600/20" />
          <div className="absolute right-0 top-10 h-64 w-64 rounded-full bg-sun-400/30 blur-3xl dark:bg-sun-400/10" />
          <div className="absolute bottom-0 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-rose-400/20 blur-3xl dark:bg-rose-500/10" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(148_163_184/0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgb(148_163_184/0.12)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        </div>

        <div className="page text-center">
          <div className="mx-auto inline-flex animate-fade-up items-center gap-2 rounded-full border border-brand-200 bg-white/70 px-3 py-1 text-sm font-medium text-brand-700 backdrop-blur dark:border-brand-500/30 dark:bg-slate-900/60 dark:text-brand-300">
            <span className="flex h-2 w-2 rounded-full bg-sun-400" />
            For Moldovan professionals in the USA
          </div>
          <h1 className="mx-auto mt-6 max-w-4xl animate-fade-up text-4xl font-extrabold tracking-tight text-slate-900 [animation-delay:60ms] sm:text-6xl dark:text-white">
            Build your American life{' '}
            <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-sky-500 bg-clip-text text-transparent dark:from-brand-300 dark:via-sky-300 dark:to-sun-300">
              with people who’ve done it
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl animate-fade-up text-lg leading-relaxed text-slate-600 [animation-delay:120ms] dark:text-slate-400">
            Clear, practical guides on taxes, banking, credit, housing, healthcare and careers — so you can make smart
            decisions from day one, not after years of trial and error.
          </p>
          <div className="mt-9 flex animate-fade-up flex-col items-center justify-center gap-3 [animation-delay:180ms] sm:flex-row">
            <Link to="/articles" className="btn-primary px-6 py-3 text-base">
              Browse all guides
              <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
            <button type="button" onClick={onOpenSearch} className="btn-secondary px-6 py-3 text-base">
              <Icon name="search" className="h-4 w-4" />
              Search a topic
            </button>
          </div>

          <dl className="mx-auto mt-14 grid max-w-2xl animate-fade-up grid-cols-3 gap-4 [animation-delay:240ms]">
            {[
              [loading ? '—' : posts.length, 'in-depth guides'],
              [CATEGORIES.length, 'topic areas'],
              ['100%', 'free, no sign-up'],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-white/60 bg-white/60 px-3 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/50">
                <dt className="sr-only">{label}</dt>
                <dd className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">{value}</dd>
                <dd className="mt-1 text-xs text-slate-500 sm:text-sm dark:text-slate-400">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Topics ───────────────────────────────────────────── */}
      <section className="page">
        <SectionHeading eyebrow="Explore" title="Find what you need" link={{ to: '/articles', label: 'All articles' }} />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              to={`/articles?category=${c.slug}`}
              className="group surface relative overflow-hidden p-5 transition duration-300 hover:-translate-y-1 hover:shadow-lift"
            >
              <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${c.tile}`}>
                <Icon name={c.icon} className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">{c.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{c.description}</p>
              <div className="mt-4 text-xs font-semibold text-slate-400 transition group-hover:text-brand-600 dark:group-hover:text-brand-300">
                {counts.get(c.slug) || 0} {counts.get(c.slug) === 1 ? 'guide' : 'guides'} →
              </div>
              <div className={`absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r ${c.accent} transition-transform duration-300 group-hover:scale-x-100`} />
            </Link>
          ))}
        </div>
      </section>

      {/* ── Latest ───────────────────────────────────────────── */}
      <section className="page mt-24">
        <SectionHeading eyebrow="Fresh" title="Latest guides" link={{ to: '/articles', label: 'View all' }} />
        {error && <p className="mt-6 text-sm text-rose-600">{error.message}</p>}
        <div className="mt-8 grid gap-5">
          {loading ? (
            <>
              <PostCardSkeleton />
              <div className="grid gap-5 md:grid-cols-3">
                <PostCardSkeleton />
                <PostCardSkeleton />
                <PostCardSkeleton />
              </div>
            </>
          ) : (
            featured && (
              <>
                <PostCard post={featured} featured />
                <div className="grid gap-5 md:grid-cols-3">
                  {recent.slice(0, 3).map((p) => (
                    <PostCard key={p.slug} post={p} />
                  ))}
                </div>
              </>
            )
          )}
        </div>
      </section>

      {/* ── Start here ───────────────────────────────────────── */}
      {path.length > 0 && (
        <section className="page mt-24">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-800 to-brand-950 px-6 py-12 text-white shadow-lift sm:px-12">
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-sun-400/20 blur-3xl" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-sky-400/20 blur-3xl" aria-hidden="true" />
            <div className="relative grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-center">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-sun-300">New to the US?</div>
                <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Start here</h2>
                <p className="mt-4 max-w-md leading-relaxed text-brand-100">
                  Follow these guides in order and you will have the essentials — bank, credit, housing, insurance and a
                  job search plan — in place within your first few months.
                </p>
              </div>
              <ol className="grid gap-3 sm:grid-cols-2">
                {path.map(([slug, label], i) => (
                  <li key={slug}>
                    <Link
                      to={`/post/${slug}`}
                      className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur transition hover:border-white/25 hover:bg-white/10"
                    >
                      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-sun-400 text-sm font-bold text-brand-950">
                        {i + 1}
                      </span>
                      <span className="flex-1 font-medium">{label}</span>
                      <Icon name="arrowRight" className="h-4 w-4 opacity-50 transition group-hover:translate-x-1 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      )}

      {/* ── Tools ────────────────────────────────────────────── */}
      {tools.length > 0 && (
        <section className="page mt-24">
          <SectionHeading eyebrow="Interactive" title="Tools to run your own numbers" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tools.map((t) => (
              <Link key={t.title} to={`/post/${t.slug}`} className="group surface p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lift">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white dark:bg-brand-500/15 dark:text-brand-300">
                  <Icon name={t.icon} className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">{t.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{t.text}</p>
                <div className="mt-4 text-sm font-semibold text-brand-600 dark:text-brand-300">Try it →</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="page mt-24">
        <div className="surface flex flex-col items-start gap-6 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Have a question or a story to share?</h2>
            <p className="mt-2 max-w-xl text-slate-600 dark:text-slate-400">
              Suggest a topic, ask about something that confused you, or contribute an article from your own experience.
            </p>
          </div>
          <Link to="/about#contact" className="btn-primary flex-shrink-0 px-6 py-3">
            <Icon name="mail" className="h-4 w-4" />
            Get in touch
          </Link>
        </div>
      </section>
    </div>
  )
}

function SectionHeading({ eyebrow, title, link }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">{title}</h2>
      </div>
      {link && (
        <Link
          to={link.to}
          className="group hidden items-center gap-1 text-sm font-semibold text-brand-600 sm:inline-flex dark:text-brand-300"
        >
          {link.label}
          <Icon name="arrowRight" className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  )
}
