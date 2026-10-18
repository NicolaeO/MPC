// FILE: src/components/Footer.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { LogoMark } from './Logo'
import { CATEGORIES } from '../lib/categories'

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <LogoMark />
            <div className="font-semibold text-slate-900 dark:text-white">Moldovan Professionals Chicago</div>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Practical, honest guides for Moldovan professionals and immigrants building a life in the USA — written by
            people who have been through it.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Topics</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link
                  to={`/articles?category=${c.slug}`}
                  className="text-slate-500 transition hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-300"
                >
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Community</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[
              ['/articles', 'All articles'],
              ['/jobs', 'Job board'],
              ['/about', 'About MPC'],
              ['/about#contact', 'Contact & contribute'],
            ].map(([to, label]) => (
              <li key={to}>
                <Link
                  to={to}
                  className="text-slate-500 transition hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-300"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-800">
        <div className="page flex flex-col gap-2 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between dark:text-slate-400">
          <div>© {new Date().getFullYear()} MPC — Moldovan Professionals Chicago</div>
          <div>
            Built with <span aria-label="love">❤️</span> for the community by{' '}
            <Link to="/author" className="font-semibold text-slate-700 hover:text-brand-600 dark:text-slate-200 dark:hover:text-brand-300">
              Nicolae Orlov
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
