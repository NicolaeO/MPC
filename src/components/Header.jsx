// FILE: src/components/Header.jsx
import React, { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import Logo from './Logo'
import Icon from './Icon'
import { useScrollY } from '../lib/hooks'

export const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/articles', label: 'Articles' },
  { to: '/jobs', label: 'Jobs' },
  { to: '/about', label: 'About' },
  { to: '/author', label: 'About Me' },
]

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)

export default function Header({ onOpenSearch, theme }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const scrolled = useScrollY() > 8

  useEffect(() => setMenuOpen(false), [pathname])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-xl transition-colors duration-300 ${
        scrolled || menuOpen
          ? 'border-slate-200/80 bg-white/80 dark:border-slate-800/80 dark:bg-slate-950/80'
          : 'border-transparent bg-white/0 dark:bg-slate-950/0'
      }`}
    >
      <div className="page flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-white'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onOpenSearch}
            className="hidden h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white/70 pl-3 pr-2 text-sm text-slate-500 transition hover:border-slate-300 hover:text-slate-700 lg:inline-flex dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-200"
          >
            <Icon name="search" className="h-4 w-4" />
            <span className="pr-6">Search articles…</span>
            <kbd className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-sans text-[11px] font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
              {isMac ? '⌘' : 'Ctrl'} K
            </kbd>
          </button>
          <button type="button" onClick={onOpenSearch} className="icon-btn lg:hidden" aria-label="Search articles">
            <Icon name="search" />
          </button>
          <button
            type="button"
            onClick={theme.toggle}
            className="icon-btn"
            aria-label={theme.isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            title={theme.isDark ? 'Light theme' : 'Dark theme'}
          >
            <Icon name={theme.isDark ? 'sun' : 'moon'} />
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="icon-btn md:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <Icon name={menuOpen ? 'close' : 'menu'} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="mobile-menu" className="page animate-fade-in pb-4 md:hidden" aria-label="Mobile">
          <div className="grid gap-1 rounded-2xl border border-slate-200 bg-white p-2 shadow-lift dark:border-slate-800 dark:bg-slate-900">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300'
                      : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800'
                  }`
                }
              >
                {link.label}
                <Icon name="chevronRight" className="h-4 w-4 opacity-40" />
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
