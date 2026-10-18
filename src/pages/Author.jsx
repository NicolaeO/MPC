// FILE: src/pages/Author.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import { useDocumentTitle } from '../lib/hooks'

export default function Author() {
  useDocumentTitle('About Me')
  return (
    <div className="page max-w-2xl animate-fade-in py-16 text-center sm:py-24">
      <div className="relative mx-auto h-24 w-24">
        <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-br from-brand-500 to-sun-400 opacity-40 blur-xl" aria-hidden="true" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-brand-950 text-4xl font-bold text-white shadow-lift ring-4 ring-white dark:ring-slate-950">
          N
        </div>
      </div>
      <h1 className="mt-8 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">Nicolae</h1>
      <p className="mt-2 text-lg font-semibold text-brand-600 dark:text-brand-300">Senior Software Engineer</p>
      <div className="mt-8 space-y-4 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
        <p>Originally from Moldova, now building things in the USA.</p>
        <p>
          I created this platform to help the community and give back — sharing what I’ve learned along the way so
          others don’t have to figure it all out alone.
        </p>
      </div>
      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <Link to="/articles" className="btn-primary">
          Read the guides <Icon name="arrowRight" className="h-4 w-4" />
        </Link>
        <Link to="/about#contact" className="btn-secondary">
          <Icon name="mail" className="h-4 w-4" /> Say hello
        </Link>
      </div>
    </div>
  )
}
