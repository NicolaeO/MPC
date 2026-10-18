// FILE: src/pages/Articles.jsx
import React, { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import Icon from '../components/Icon'
import PostCard, { PostCardSkeleton } from '../components/PostCard'
import { CATEGORIES, getCategory } from '../lib/categories'
import { searchPosts, usePosts } from '../lib/posts'
import { useDocumentTitle } from '../lib/hooks'

export default function Articles() {
  useDocumentTitle('Articles')
  const { posts, loading, error } = usePosts()
  const [params, setParams] = useSearchParams()
  const query = params.get('q') || ''
  const category = params.get('category') || 'all'
  const sort = params.get('sort') === 'oldest' ? 'oldest' : 'newest'

  const setParam = (key, value, fallback) => {
    const next = new URLSearchParams(params)
    if (!value || value === fallback) next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const counts = useMemo(() => {
    const m = new Map()
    posts.forEach((p) => {
      const slug = getCategory(p.category).slug
      m.set(slug, (m.get(slug) || 0) + 1)
    })
    return m
  }, [posts])

  const results = useMemo(() => {
    let list = category === 'all' ? posts : posts.filter((p) => getCategory(p.category).slug === category)
    list = searchPosts(list, query)
    if (!query.trim() && sort === 'oldest') list = [...list].reverse()
    return list
  }, [posts, category, query, sort])

  const hasFilters = query || category !== 'all'

  return (
    <div className="page animate-fade-in pt-10 sm:pt-14">
      <header className="max-w-2xl">
        <div className="eyebrow">Library</div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">Articles & guides</h1>
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
          Practical, step-by-step guides to the US financial system, housing, healthcare and careers.
        </p>
      </header>

      <div className="sticky top-16 z-20 -mx-4 mt-8 border-b border-slate-200/70 bg-slate-50/85 px-4 py-4 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 dark:border-slate-800/70 dark:bg-slate-950/85">
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">Search articles</span>
            <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setParam('q', e.target.value)}
              placeholder="Search by keyword — e.g. 401(k), lease, resume"
              className="field pl-10"
            />
          </label>
          <label className="sm:w-44">
            <span className="sr-only">Sort</span>
            <select value={sort} onChange={(e) => setParam('sort', e.target.value, 'newest')} className="field" disabled={!!query.trim()}>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </label>
        </div>
        <div className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]" role="group" aria-label="Filter by topic">
          <button
            type="button"
            onClick={() => setParam('category', 'all', 'all')}
            className={category === 'all' ? 'chip-active' : 'chip-idle'}
            aria-pressed={category === 'all'}
          >
            All <span className="opacity-70">{posts.length}</span>
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => setParam('category', c.slug, 'all')}
              className={category === c.slug ? 'chip-active' : 'chip-idle'}
              aria-pressed={category === c.slug}
            >
              <Icon name={c.icon} className="h-4 w-4" />
              {c.label} <span className="opacity-70">{counts.get(c.slug) || 0}</span>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mt-8 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
          {error.message}. Please refresh the page to try again.
        </div>
      )}

      {!loading && !error && (
        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400" aria-live="polite">
          {results.length} {results.length === 1 ? 'article' : 'articles'}
          {query.trim() && <> matching “{query.trim()}”</>}
          {category !== 'all' && <> in {getCategory(category).title}</>}
        </p>
      )}

      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }, (_, i) => <PostCardSkeleton key={i} />)
          : results.map((p) => <PostCard key={p.slug} post={p} />)}
      </div>

      {!loading && !error && results.length === 0 && (
        <div className="surface mt-4 flex flex-col items-center px-6 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
            <Icon name="search" />
          </div>
          <h2 className="mt-4 font-semibold text-slate-900 dark:text-white">No articles found</h2>
          <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
            Try a different keyword or clear the filters. Can’t find a topic? Suggest it — we may write it next.
          </p>
          {hasFilters && (
            <button type="button" onClick={() => setParams({}, { replace: true })} className="btn-secondary mt-6">
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  )
}
