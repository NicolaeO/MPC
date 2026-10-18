// FILE: src/components/widgets/BudgetPlanner.jsx
import React, { useState } from 'react'
import Icon from '../Icon'
import { NumberField, Note, Stat, WidgetCard, num } from './ui'
import { formatDuration, formatUSD } from '../../lib/format'

// Status always pairs colour with an icon and a text label.
function needsStatus(pct) {
  if (pct <= 50) return { label: 'On target', icon: 'check', cls: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300' }
  if (pct <= 60) return { label: 'A little high', icon: 'clock', cls: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300' }
  return { label: 'High — look for savings', icon: 'arrowUp', cls: 'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300' }
}

export default function BudgetPlanner({ data = {} }) {
  const [income, setIncome] = useState(data.income || '4500')
  const [essentials, setEssentials] = useState(data.essentials || '2400')
  const [saved, setSaved] = useState(data.saved || '1000')

  const pay = Math.max(0, num(income))
  const needs = Math.max(0, num(essentials))
  const current = Math.max(0, num(saved))
  const needsPct = pay > 0 ? Math.round((needs / pay) * 100) : 0
  const status = needsStatus(needsPct)

  const target3 = needs * 3
  const target6 = needs * 6
  const monthlySaving = pay * 0.2
  const remaining = Math.max(0, target3 - current)
  const monthsTo3 = monthlySaving > 0 ? Math.ceil(remaining / monthlySaving) : null
  const progress = target6 > 0 ? Math.min(1, current / target6) : 0

  return (
    <WidgetCard icon="calculator" title="Budget & emergency fund planner" subtitle="The 50/30/20 rule applied to your pay">
      <div className="grid gap-5 sm:grid-cols-3">
        <NumberField label="Monthly take-home pay" prefix="$" value={income} onChange={setIncome} min={0} max={20000} step={100} hint="after tax" />
        <NumberField label="Essential costs" prefix="$" value={essentials} onChange={setEssentials} min={0} max={15000} step={50} hint="rent, food…" />
        <NumberField label="Saved so far" prefix="$" value={saved} onChange={setSaved} min={0} max={60000} step={250} />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Stat label="Needs · 50%" value={formatUSD(pay * 0.5)} sub="Rent, utilities, groceries, transport, insurance, minimum debt payments" />
        <Stat label="Wants · 30%" value={formatUSD(pay * 0.3)} sub="Dining out, shopping, travel, subscriptions, hobbies" />
        <Stat label="Savings & debt payoff · 20%" value={formatUSD(monthlySaving)} sub="Emergency fund first, then retirement and extra debt payments" />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 p-4 text-sm dark:border-slate-800">
        <span>
          Your essentials are <strong className="font-semibold text-slate-900 dark:text-white">{needsPct}%</strong> of take-home pay.
        </span>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${status.cls}`}>
          <Icon name={status.icon} className="h-3.5 w-3.5" strokeWidth={2.25} />
          {status.label}
        </span>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 p-4 sm:p-5 dark:border-slate-800">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div className="text-sm font-semibold text-slate-900 dark:text-white">Emergency fund goal</div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            {formatUSD(target3)} (3 months) – {formatUSD(target6)} (6 months)
          </div>
        </div>
        <div
          className="relative mt-3 h-3 overflow-hidden rounded-full bg-brand-100 dark:bg-brand-950"
          role="meter"
          aria-valuemin={0}
          aria-valuemax={Math.round(target6)}
          aria-valuenow={Math.round(Math.min(current, target6))}
          aria-label="Emergency fund progress toward 6 months of essentials"
        >
          <div className="h-full rounded-full bg-brand-600 transition-[width] duration-500 dark:bg-brand-400" style={{ width: `${progress * 100}%` }} />
          <div className="absolute inset-y-0 left-1/2 w-0.5 bg-white dark:bg-slate-900" aria-hidden="true" title="3-month mark" />
        </div>
        <div className="mt-1.5 flex justify-between text-xs text-slate-400">
          <span>$0</span>
          <span>3 months</span>
          <span>6 months</span>
        </div>
        <p className="m-0 mt-3 text-sm">
          {needs === 0
            ? 'Enter your essential monthly costs to size your emergency fund.'
            : remaining === 0
              ? 'You already have at least 3 months of essentials saved — great work. Keep building toward 6 months.'
              : monthsTo3 != null
                ? `Saving ${formatUSD(monthlySaving)} a month, you’ll reach a 3-month cushion in about ${formatDuration(monthsTo3)}.`
                : 'Add your take-home pay to see how long it will take.'}
        </p>
      </div>

      <Note>The 50/30/20 split is a starting point, not a rule. In expensive cities, needs often run higher — that’s fine while you build up savings.</Note>
    </WidgetCard>
  )
}
