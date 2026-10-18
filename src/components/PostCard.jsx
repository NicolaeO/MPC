// FILE: src/components/PostCard.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icon'
import CategoryBadge from './CategoryBadge'
import { getCategory } from '../lib/categories'
import { formatDate } from '../lib/format'

export function PostMeta({ post, className = '' }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400 ${className}`}>
      <span className="inline-flex items-center gap-1">
        <Icon name="calendar" className="h-3.5 w-3.5" />
        <time dateTime={post.date}>{formatDate(post.date)}</time>
      </span>
      {post.readingTime ? (
        <span className="inline-flex items-center gap-1">
          <Icon name="clock" className="h-3.5 w-3.5" />
          {post.readingTime} min read
        </span>
      ) : null}
    </div>
  )
}

export default function PostCard({ post, featured = false }) {
  const category = getCategory(post.category)
  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-500/40 ${
        featured ? 'md:flex-row' : ''
      }`}
    >
      <div
        className={`relative overflow-hidden bg-gradient-to-br ${category.accent} ${
          featured ? 'h-40 md:h-auto md:w-2/5' : 'h-1.5'
        }`}
        aria-hidden="true"
      >
        {featured && (
          <>
            <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/15 blur-2xl" />
            <div className="absolute -bottom-12 left-6 h-40 w-40 rounded-full bg-black/10 blur-2xl" />
            <div className="absolute bottom-5 left-6 text-xs font-semibold uppercase tracking-[0.18em] text-white/85">
              Latest guide
            </div>
          </>
        )}
      </div>

      <div className={`flex flex-1 flex-col p-5 ${featured ? 'md:p-8' : ''}`}>
        <div className="flex items-center justify-between gap-3">
          <CategoryBadge category={post.category} />
          <PostMeta post={post} />
        </div>
        <h3
          className={`mt-3 font-semibold tracking-tight text-slate-900 transition group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-300 ${
            featured ? 'text-2xl leading-snug md:text-3xl' : 'line-clamp-2 text-lg leading-snug'
          }`}
        >
          <Link to={`/post/${post.slug}`} className="focus:outline-none">
            {/* Stretched link: the whole card is clickable */}
            <span className="absolute inset-0 rounded-2xl" aria-hidden="true" />
            {post.title}
          </Link>
        </h3>
        {post.excerpt && (
          <p
            className={`mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400 ${
              featured ? 'md:text-base' : 'line-clamp-3'
            }`}
          >
            {post.excerpt}
          </p>
        )}
        <div className="mt-auto pt-4">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 dark:text-brand-300">
            Read article
            <Icon name="arrowRight" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </article>
  )
}

export function PostCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="skeleton h-5 w-20 rounded-full" />
      <div className="skeleton mt-4 h-5 w-11/12" />
      <div className="skeleton mt-2 h-5 w-2/3" />
      <div className="skeleton mt-4 h-3.5 w-full" />
      <div className="skeleton mt-2 h-3.5 w-5/6" />
    </div>
  )
}
