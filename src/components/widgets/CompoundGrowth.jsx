// FILE: src/components/widgets/CompoundGrowth.jsx
import React, { useMemo, useState } from 'react'
import StackedColumns from './StackedColumns'
import { NumberField, Note, Stat, WidgetCard, clamp, num } from './ui'
import { compoundGrowth } from '../../lib/finance'
import { formatUSD } from '../../lib/format'

const SERIES = [
  { label: 'Your contributions', color: 'var(--viz-1)' },
  { label: 'Investment growth', color: 'var(--viz-2)' },
]
const WAIT_YEARS = 10

export default function CompoundGrowth({ data = {} }) {
  const [initial, setInitial] = useState(data.initial || '5000')
  const [monthly, setMonthly] = useState(data.monthly || '500')
  const [rate, setRate] = useState(data.rate || '7')
  const [years, setYears] = useState(data.years || '30')

  const y = Math.round(clamp(num(years, 1), 1, 50))
  const r = clamp(num(rate), 0, 15)
  const start = Math.max(0, num(initial))
  const perMonth = Math.max(0, num(monthly))

  const rows = useMemo(() => compoundGrowth(start, perMonth, r, y), [start, perMonth, r, y])
  const final = rows[rows.length - 1]
  const late = useMemo(() => (y > WAIT_YEARS ? compoundGrowth(start, perMonth, r, y - WAIT_YEARS).at(-1) : null), [start, perMonth, r, y])
  const growthShare = final.balance > 0 ? Math.round((final.growth / final.balance) * 100) : 0

  const chartData = rows.map((row) => ({ label: String(row.year), values: [row.contributed, Math.max(0, row.growth)] }))

  return (
    <WidgetCard icon="sparkles" title="Investment growth calculator" subtitle="Monthly contributions · monthly compounding">
      <div className="grid gap-5 sm:grid-cols-2">
        <NumberField label="Starting amount" prefix="$" value={initial} onChange={setInitial} min={0} max={100000} step={500} />
        <NumberField label="Monthly contribution" prefix="$" value={monthly} onChange={setMonthly} min={0} max={5000} step={50} />
        <NumberField label="Average annual return" suffix="%" value={rate} onChange={setRate} min={0} max={12} step={0.5} />
        <NumberField label="Years invested" suffix="yrs" value={years} onChange={setYears} min={1} max={50} step={1} />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Stat hero className="sm:col-span-3" label={`Balance after ${y} ${y === 1 ? 'year' : 'years'}`} value={formatUSD(final.balance)} sub={growthShare > 0 ? `${growthShare}% of it is growth — money you never had to put in.` : null} />
        <Stat label="You contribute" value={formatUSD(final.contributed)} />
        <Stat label="Growth earned" value={formatUSD(final.growth)} />
        {late ? (
          <Stat label={`If you wait ${WAIT_YEARS} years to start`} value={formatUSD(late.balance)} sub={`${formatUSD(final.balance - late.balance)} less at the end`} />
        ) : (
          <Stat label="Monthly × years" value={`${formatUSD(perMonth)} × ${y * 12}`} sub="number of contributions" />
        )}
      </div>

      <div className="mt-6">
        <div className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">Balance at the end of each year</div>
        <StackedColumns data={chartData} series={SERIES} xTitle="Year" />
      </div>

      <Note>
        Illustration only, not a forecast. Real markets rise and fall — some years lose money — and returns are not
        guaranteed. Taxes, fees and inflation are not included.
      </Note>
    </WidgetCard>
  )
}
