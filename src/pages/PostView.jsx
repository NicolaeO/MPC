// FILE: src/pages/PostView.jsx
import React, { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Icon from '../components/Icon'
import CategoryBadge from '../components/CategoryBadge'
import PostCard, { PostMeta } from '../components/PostCard'
import { WIDGETS } from '../components/widgets'
import { getCategory } from '../lib/categories'
import { loadPostHtml, parsePost, usePosts } from '../lib/posts'
import { useDocumentTitle, useScrollY } from '../lib/hooks'
import NotFound from './NotFound'

export default function PostView() {
  const { slug } = useParams()
  const { posts } = usePosts()
  const [state, setState] = useState({ status: 'loading', post: null })

  useEffect(() => {
    const controller = new AbortController()
    setState({ status: 'loading', post: null })
    loadPostHtml(slug, controller.signal)
      .then((html) => setState(html ? { status: 'ready', post: parsePost(html) } : { status: 'missing', post: null }))
      .catch((err) => {
        if (err.name !== 'AbortError') setState({ status: 'error', post: null })
      })
    return () => controller.abort()
  }, [slug])

  const indexEntry = posts.find((p) => p.slug === slug)
  const post = state.post && {
    ...state.post,
    slug,
    title: state.post.title || indexEntry?.title || 'Untitled',
    date: state.post.date || indexEntry?.date,
    category: state.post.category || indexEntry?.category,
  }

  useDocumentTitle(post?.title || (state.status === 'missing' ? 'Article not found' : ''))

  if (state.status === 'missing') return <NotFound kind="article" />
  if (state.status === 'error') {
    return (
      <div className="page py-24 text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Couldn’t load this article</h1>
        <p className="mt-2 text-slate-500">Check your connection and try again.</p>
        <button type="button" onClick={() => window.location.reload()} className="btn-primary mt-6">
          <Icon name="refresh" className="h-4 w-4" /> Retry
        </button>
      </div>
    )
  }
  if (!post) return <PostSkeleton />

  return <Article key={slug} post={post} posts={posts} />
}

function Article({ post, posts }) {
  const articleRef = useRef(null)
  const category = getCategory(post.category)

  // Deep links (/post/x#section) can only scroll once the content exists.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (id) document.getElementById(id)?.scrollIntoView()
  }, [])

  const { prev, next, related } = useMemo(() => {
    const i = posts.findIndex((p) => p.slug === post.slug)
    const sameTopic = posts.filter((p) => p.slug !== post.slug && getCategory(p.category).slug === category.slug)
    return {
      next: i > 0 ? posts[i - 1] : null, // newer
      prev: i >= 0 && i < posts.length - 1 ? posts[i + 1] : null, // older
      related: sameTopic.slice(0, 3),
    }
  }, [posts, post.slug, category.slug])

  return (
    <>
      <ReadingProgress target={articleRef} />

      <div className="relative isolate -mt-16 overflow-hidden border-b border-slate-200/70 pb-12 pt-28 dark:border-slate-800/70">
        <div
          className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br ${category.accent} opacity-[0.08] dark:opacity-[0.12]`}
          aria-hidden="true"
        />
        <div className="page max-w-6xl animate-fade-up">
          <div className="max-w-4xl">
            <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400" aria-label="Breadcrumb">
              <Link to="/articles" className="hover:text-brand-600 dark:hover:text-brand-300">
                Articles
              </Link>
              <Icon name="chevronRight" className="h-3.5 w-3.5" />
              <Link to={`/articles?category=${category.slug}`} className="hover:text-brand-600 dark:hover:text-brand-300">
                {category.title}
              </Link>
            </nav>
            <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl sm:leading-[1.1] dark:text-white">
              {post.title}
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <CategoryBadge category={post.category} />
              <PostMeta post={post} className="text-sm" />
              <ShareButton title={post.title} className="sm:ml-auto" />
            </div>
          </div>
        </div>
      </div>

      <div className="page mt-10 grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1fr)_15rem]">
        <article ref={articleRef} className="min-w-0 animate-fade-in">
          <PostBody html={post.html} />
          <PostNav prev={prev} next={next} />
        </article>
        {post.headings.length > 2 && <TableOfContents headings={post.headings} />}
      </div>

      {related.length > 0 && (
        <section className="page mt-20 max-w-6xl">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">More on {category.title.toLowerCase()}</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {related.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}

/** Renders trusted post HTML and mounts interactive widgets into [data-widget] nodes. */
const PostBody = memo(function PostBody({ html }) {
  const ref = useRef(null)
  const navigate = useNavigate()
  const [mounts, setMounts] = useState([])

  useLayoutEffect(() => {
    const nodes = [...ref.current.querySelectorAll('[data-widget]')]
    setMounts(nodes.map((node) => ({ node, type: node.getAttribute('data-widget') })))
  }, [html])

  // Keep in-site links inside the SPA instead of doing full page reloads.
  const onClick = (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    const a = e.target.closest('a[href]')
    const href = a?.getAttribute('href')
    if (!href || a.target === '_blank' || !href.startsWith('/') || href.startsWith('//')) return
    e.preventDefault()
    navigate(href)
  }

  return (
    <>
      <div ref={ref} className="post-content" onClick={onClick} dangerouslySetInnerHTML={{ __html: html }} />
      {mounts.map(({ node, type }, i) => {
        const Widget = WIDGETS[type]
        return Widget ? createPortal(<Widget data={{ ...node.dataset }} />, node, `${type}-${i}`) : null
      })}
    </>
  )
})

function ReadingProgress({ target }) {
  const scrollY = useScrollY()
  const el = target.current
  let progress = 0
  if (el) {
    const start = el.offsetTop - 80
    const end = el.offsetTop + el.offsetHeight - window.innerHeight
    progress = end > start ? Math.min(1, Math.max(0, (scrollY - start) / (end - start))) : 0
  }
  return (
    <div className="fixed inset-x-0 top-0 z-50 h-[3px]" aria-hidden="true">
      <div
        className="h-full origin-left bg-gradient-to-r from-brand-500 via-sky-400 to-sun-400 transition-transform duration-150 ease-out"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  )
}

function TableOfContents({ headings }) {
  const scrollY = useScrollY()
  const [active, setActive] = useState(headings[0]?.id)

  useEffect(() => {
    let current = headings[0]?.id
    for (const h of headings) {
      const el = document.getElementById(h.id)
      if (el && el.getBoundingClientRect().top < 140) current = h.id
    }
    setActive(current)
  }, [scrollY, headings])

  return (
    <aside className="hidden lg:block">
      <nav className="sticky top-24" aria-label="On this page">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">On this page</div>
        <ul className="mt-4 space-y-1 border-l border-slate-200 text-sm dark:border-slate-800">
          {headings.map((h) => (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' })
                  history.replaceState(null, '', `#${h.id}`)
                }}
                className={`-ml-px block border-l-2 py-1.5 pl-4 leading-snug transition ${
                  active === h.id
                    ? 'border-brand-600 font-medium text-brand-700 dark:border-brand-400 dark:text-brand-300'
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-200'
                }`}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-300"
        >
          <Icon name="arrowUp" className="h-4 w-4" /> Back to top
        </button>
      </nav>
    </aside>
  )
}

function ShareButton({ title, className = '' }) {
  const [copied, setCopied] = useState(false)

  const share = async () => {
    const url = window.location.href.split('#')[0]
    try {
      if (navigator.share && window.matchMedia('(pointer: coarse)').matches) {
        await navigator.share({ title, url })
        return
      }
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* user cancelled the share sheet or clipboard is blocked */
    }
  }

  return (
    <button type="button" onClick={share} className={`btn-secondary py-2 ${className}`}>
      <Icon name={copied ? 'check' : 'link'} className="h-4 w-4" />
      {copied ? 'Link copied' : 'Share'}
    </button>
  )
}

function PostNav({ prev, next }) {
  if (!prev && !next) return null
  return (
    <nav className="mt-14 grid gap-4 border-t border-slate-200 pt-8 sm:grid-cols-2 dark:border-slate-800" aria-label="More articles">
      {prev ? (
        <Link to={`/post/${prev.slug}`} className="group surface p-5 transition hover:-translate-y-0.5 hover:shadow-lift">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Icon name="arrowLeft" className="h-3.5 w-3.5 transition group-hover:-translate-x-0.5" /> Previous
          </div>
          <div className="mt-2 font-semibold leading-snug text-slate-900 group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-300">
            {prev.title}
          </div>
        </Link>
      ) : (
        <span className="hidden sm:block" />
      )}
      {next && (
        <Link to={`/post/${next.slug}`} className="group surface p-5 text-right transition hover:-translate-y-0.5 hover:shadow-lift">
          <div className="flex items-center justify-end gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Next <Icon name="arrowRight" className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
          </div>
          <div className="mt-2 font-semibold leading-snug text-slate-900 group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-300">
            {next.title}
          </div>
        </Link>
      )}
    </nav>
  )
}

function PostSkeleton() {
  return (
    <div className="page max-w-4xl pt-12" aria-busy="true" aria-label="Loading article">
      <div className="skeleton h-4 w-40" />
      <div className="skeleton mt-6 h-10 w-full" />
      <div className="skeleton mt-3 h-10 w-2/3" />
      <div className="skeleton mt-8 h-4 w-56" />
      <div className="mt-12 space-y-3">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="skeleton h-4" style={{ width: `${92 - (i % 3) * 9}%` }} />
        ))}
      </div>
    </div>
  )
}
