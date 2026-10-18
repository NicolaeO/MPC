// FILE: src/components/widgets/ui.jsx
// Shared building blocks for the interactive article widgets.
import React, { useId } from 'react'
import Icon from '../Icon'

export const num = (v, fallback = 0) => {
  const x = parseFloat(v)
  return Number.isFinite(x) ? x : fallback
}
export const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

export function WidgetCard({ icon, title, subtitle, children }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-soft dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
      <header className="flex items-center gap-3 border-b border-slate-200 bg-slate-50/80 px-5 py-4 dark:border-slate-800 dark:bg-slate-950/40">
        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white shadow-sm shadow-brand-600/30">
          <Icon name={icon} className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h3 className="m-0 text-base font-semibold leading-tight text-slate-900 dark:text-white">{title}</h3>
          {subtitle && <p className="m-0 mt-0.5 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>
        <span className="ml-auto hidden rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand-700 sm:inline dark:bg-brand-500/15 dark:text-brand-300">
          Interactive
        </span>
      </header>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  )
}

export function NumberField({ label, value, onChange, prefix, suffix, min, max, step = 1, slider = true, hint }) {
  const id = useId()
  const n = num(value, min ?? 0)
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
        {hint && <span className="text-xs text-slate-400">{hint}</span>}
      </div>
      <div className="relative mt-1.5">
        {prefix && <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">{prefix}</span>}
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`field tabular-nums ${prefix ? 'pl-7' : ''} ${suffix ? 'pr-9' : ''}`}
        />
        {suffix && <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">{suffix}</span>}
      </div>
      {slider && min != null && max != null && (
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={clamp(n, min, max)}
          onChange={(e) => onChange(e.target.value)}
          className="mt-2.5 h-1.5 w-full cursor-pointer accent-brand-600"
          aria-label={label}
        />
      )}
    </div>
  )
}

export function Segmented({ label, options, value, onChange }) {
  return (
    <div>
      <div className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</div>
      <div className="mt-1.5 grid auto-cols-fr grid-flow-col gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800" role="radiogroup" aria-label={label}>
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={value === o.value}
            onClick={() => onChange(o.value)}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
              value === o.value
                ? 'bg-white text-brand-700 shadow-sm dark:bg-slate-950 dark:text-brand-300'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

/** Stat tile: label · value · optional sub-line. `hero` makes it the view's one headline number. */
export function Stat({ label, value, sub, hero = false, className = '' }) {
  return (
    <div className={`rounded-xl border border-slate-200 p-4 dark:border-slate-800 ${hero ? 'bg-brand-50/60 dark:bg-brand-500/10' : ''} ${className}`}>
      <div className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</div>
      <div className={`mt-1 font-semibold tracking-tight text-slate-900 dark:text-white ${hero ? 'text-4xl sm:text-5xl' : 'text-xl'}`}>{value}</div>
      {sub && <div className="mt-1 text-xs leading-snug text-slate-500 dark:text-slate-400">{sub}</div>}
    </div>
  )
}

export function Note({ children }) {
  return <p className="m-0 mt-4 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{children}</p>
}
