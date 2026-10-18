// FILE: src/components/SearchDialog.jsx
// Command-palette style article search (⌘K / Ctrl+K / "/").
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from './Icon'
import CategoryBadge from './CategoryBadge'
import { searchPosts, usePosts } from '../lib/posts'

export default function SearchDialog({ open, onClose }) {
  if (!open) return null
  return <SearchPanel onClose={onClose} />
}

function SearchPanel({ onClose }) {
  const navigate = useNavigate()
  const { posts, loading } = usePosts()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  const results = useMemo(() => (query.trim() ? searchPosts(posts, query) : posts).slice(0, 8), [posts, query])

  useEffect(() => setActive(0), [query])

  useEffect(() => {
    inputRef.current?.focus()
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = overflow
    }
  }, [])

  useEffect(() => {
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const go = (post) => {
    onClose()
    navigate(`/post/${post.slug}`)
  }

  const onKeyDown = (e) => {
    if (e.key === 'Escape') onClose()
    else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && results[active]) {
      e.preventDefault()
      go(results[active])
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[12vh]" role="presentation">
      <div className="absolute inset-0 animate-fade-in bg-slate-950/50 backdrop-blur-sm" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search articles"
        className="relative w-full max-w-xl animate-scale-in overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
      >
        <div className="flex items-center gap-3 border-b border-slate-200 px-4 dark:border-slate-800">
          <Icon name="search" className="h-5 w-5 text-slate-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search taxes, credit, apartments, resumes…"
            className="h-14 flex-1 bg-transparent text-base text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white"
            role="combobox"
            aria-expanded="true"
            aria-controls="search-results"
            aria-activedescendant={results[active] ? `search-${results[active].slug}` : undefined}
          />
          <kbd className="rounded-md border border-slate-200 px-1.5 py-0.5 text-[11px] font-medium text-slate-400 dark:border-slate-700">
            Esc
          </kbd>
        </div>

        <ul id="search-results" ref={listRef} role="listbox" className="max-h-[55vh] overflow-y-auto p-2">
          {loading && <li className="px-3 py-8 text-center text-sm text-slate-500">Loading articles…</li>}
          {!loading && results.length === 0 && (
            <li className="px-3 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
              No articles match “{query}”. Try a broader word like “tax” or “credit”.
            </li>
          )}
          {results.map((post, i) => (
            <li
              key={post.slug}
              id={`search-${post.slug}`}
              role="option"
              aria-selected={i === active}
              data-active={i === active}
              onMouseMove={() => setActive(i)}
              onClick={() => go(post)}
              className={`flex cursor-pointer items-start gap-3 rounded-xl px-3 py-3 transition ${
                i === active ? 'bg-brand-50 dark:bg-brand-500/15' : ''
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium text-slate-900 dark:text-white">{post.title}</div>
                <div className="mt-0.5 line-clamp-1 text-sm text-slate-500 dark:text-slate-400">{post.excerpt}</div>
              </div>
              <CategoryBadge category={post.category} className="mt-0.5 hidden sm:inline-flex" />
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4 border-t border-slate-200 px-4 py-2.5 text-xs text-slate-400 dark:border-slate-800">
          <span>
            <kbd className="font-sans">↑</kbd> <kbd className="font-sans">↓</kbd> to navigate
          </span>
          <span>
            <kbd className="font-sans">↵</kbd> to open
          </span>
        </div>
      </div>
    </div>
  )
}
