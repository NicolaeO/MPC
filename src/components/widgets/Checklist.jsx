// FILE: src/components/widgets/Checklist.jsx
// Interactive version of <ul data-checklist="id"> in a post. Progress is saved per device.
import React, { useMemo } from 'react'
import Icon from '../Icon'
import { WidgetCard } from './ui'
import { useStoredSet } from '../../lib/hooks'

const plain = (html) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()

export default function Checklist({ data = {} }) {
  const items = useMemo(() => {
    try {
      return JSON.parse(data.items || '[]')
    } catch {
      return []
    }
  }, [data.items])
  const keys = useMemo(() => items.map(plain), [items])
  const [done, setDone] = useStoredSet(`mpc-checklist:${data.id || 'default'}`)

  const completed = keys.filter((k) => done.has(k)).length
  const pct = items.length ? Math.round((completed / items.length) * 100) : 0

  const toggle = (key) => {
    const next = new Set(done)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    setDone(next)
  }

  return (
    <WidgetCard icon="check" title={data.title || 'Checklist'} subtitle="Tick items off as you go — saved on this device">
      <div className="flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-brand-100 dark:bg-brand-950">
          <div className="h-full rounded-full bg-brand-600 transition-[width] duration-500 dark:bg-brand-400" style={{ width: `${pct}%` }} />
        </div>
        <div className="text-sm font-semibold tabular-nums text-slate-700 dark:text-slate-200" aria-live="polite">
          {completed} of {items.length}
        </div>
      </div>

      {completed === items.length && items.length > 0 && (
        <div className="mt-4 flex animate-scale-in items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-200">
          <Icon name="sparkles" className="h-4 w-4" /> All done — nice work!
        </div>
      )}

      <ul className="m-0 mt-4 list-none space-y-1 p-0">
        {items.map((html, i) => {
          const checked = done.has(keys[i])
          return (
            <li key={keys[i] || i} className="m-0 p-0">
              <label className="group flex cursor-pointer items-start gap-3 rounded-xl px-3 py-2.5 transition hover:bg-slate-50 dark:hover:bg-slate-800/60">
                <input type="checkbox" className="peer sr-only" checked={checked} onChange={() => toggle(keys[i])} />
                <span
                  className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border-2 transition peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500 peer-focus-visible:ring-offset-2 dark:peer-focus-visible:ring-offset-slate-900 ${
                    checked ? 'border-brand-600 bg-brand-600 text-white dark:border-brand-400 dark:bg-brand-400 dark:text-slate-950' : 'border-slate-300 group-hover:border-brand-400 dark:border-slate-600'
                  }`}
                  aria-hidden="true"
                >
                  {checked && <Icon name="check" className="h-3.5 w-3.5" strokeWidth={3} />}
                </span>
                <span
                  className={`text-[0.975rem] leading-relaxed transition [&_strong]:font-semibold [&_strong]:text-slate-900 dark:[&_strong]:text-white ${
                    checked ? 'text-slate-400 line-through decoration-slate-300 dark:text-slate-500 dark:decoration-slate-600' : ''
                  }`}
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              </label>
            </li>
          )
        })}
      </ul>

      {completed > 0 && (
        <button
          type="button"
          onClick={() => setDone(new Set())}
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
        >
          <Icon name="refresh" className="h-3.5 w-3.5" /> Reset checklist
        </button>
      )}
    </WidgetCard>
  )
}
