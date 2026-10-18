// FILE: src/pages/NotFound.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import { useDocumentTitle } from '../lib/hooks'

export default function NotFound({ kind = 'page' }) {
  useDocumentTitle(kind === 'article' ? 'Article not found' : 'Page not found')
  return (
    <div className="page flex animate-fade-in flex-col items-center py-24 text-center sm:py-32">
      <div className="bg-gradient-to-br from-brand-600 to-sky-500 bg-clip-text text-7xl font-extrabold tracking-tight text-transparent sm:text-8xl">
        404
      </div>
      <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
        {kind === 'article' ? 'We couldn’t find that article' : 'This page doesn’t exist'}
      </h1>
      <p className="mt-3 max-w-md text-slate-600 dark:text-slate-400">
        The link may be outdated or mistyped. Try browsing the library — the guide you need is probably there.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link to="/articles" className="btn-primary">
          Browse articles <Icon name="arrowRight" className="h-4 w-4" />
        </Link>
        <Link to="/" className="btn-secondary">
          Go home
        </Link>
      </div>
    </div>
  )
}
