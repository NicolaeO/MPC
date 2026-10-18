// FILE: src/components/ScrollHelpers.jsx
import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Icon from './Icon'
import { useScrollY } from '../lib/hooks'

/** Scrolls to the top on page change, or to #hash targets when present. */
export function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const frame = requestAnimationFrame(() => {
        document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ behavior: 'smooth' })
      })
      return () => cancelAnimationFrame(frame)
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])

  return null
}

export function BackToTop() {
  const visible = useScrollY() > 700
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      className={`fixed bottom-6 right-6 z-30 inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-600 shadow-lift backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:text-brand-600 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-300 dark:hover:text-brand-300 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <Icon name="arrowUp" className="h-5 w-5" />
    </button>
  )
}
