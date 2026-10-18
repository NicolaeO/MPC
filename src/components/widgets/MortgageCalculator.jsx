// FILE: src/components/widgets/MortgageCalculator.jsx
import React, { useMemo, useState } from 'react'
import StackedColumns from './StackedColumns'
import { NumberField, Note, Segmented, Stat, WidgetCard, clamp, num } from './ui'
import { amortize } from '../../lib/finance'
import { formatDuration, formatUSD } from '../../lib/format'

const SERIES = [
  { label: 'Principal', color: 'var(--viz-1)' },
  { label: 'Interest', color: 'var(--viz-2)' },
]

export default function MortgageCalculator({ data = {} }) {
  const [price, setPrice] = useState(data.price || '400000')
  const [down, setDown] = useState(data.down || '20')
  const [rate, setRate] = useState(data.rate || '6.5')
  const [years, setYears] = useState(Number(data.years) || 30)
  const [extra, setExtra] = useState(data.extra || '0')

  const homePrice = Math.max(0, num(price))
  const downPct = clamp(num(down), 0, 100)
  const ratePct = clamp(num(rate), 0, 25)
  const extraMonthly = Math.max(0, num(extra))
  const loan = homePrice * (1 - downPct / 100)

  const base = useMemo(() => amortize(loan, ratePct, years), [loan, ratePct, years])
  const plan = useMemo(() => (extraMonthly > 0 ? amortize(loan, ratePct, years, extraMonthly) : base), [loan, ratePct, years, extraMonthly, base])
  const pmi = downPct < 20 && loan > 0 ? (loan * 0.01) / 12 : 0
  const saved = base.totalInterest - plan.totalInterest
  const monthsSooner = base.months - plan.months

  const chartData = plan.yearly.map((y) => ({ label: String(y.year), values: [y.principal, y.interest] }))

  return (
    <WidgetCard icon="home" title="Mortgage calculator" subtitle="Fixed-rate loan · principal & interest">
      <div className="grid gap-5 sm:grid-cols-2">
        <NumberField label="Home price" prefix="$" value={price} onChange={setPrice} min={50000} max={1500000} step={5000} />
        <NumberField label="Down payment" suffix="%" value={down} onChange={setDown} min={0} max={50} step={1} hint={formatUSD(homePrice * (downPct / 100))} />
        <NumberField label="Interest rate" suffix="%" value={rate} onChange={setRate} min={2} max={12} step={0.125} />
        <Segmented
          label="Loan term"
          value={years}
          onChange={setYears}
          options={[15, 20, 30].map((y) => ({ value: y, label: `${y} years` }))}
        />
        <div className="sm:col-span-2">
          <NumberField label="Extra principal each month" prefix="$" value={extra} onChange={setExtra} min={0} max={2000} step={50} hint="optional" />
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Stat
          hero
          className="sm:col-span-3"
          label="Monthly payment (principal + interest)"
          value={formatUSD(plan.payment + extraMonthly)}
          sub={
            <>
              {extraMonthly > 0 && <>Includes {formatUSD(extraMonthly)} extra. </>}
              {pmi > 0 && <>Plus about {formatUSD(pmi)}/mo PMI until you reach 20% equity. </>}
              Taxes, insurance and HOA are extra.
            </>
          }
        />
        <Stat label="Loan amount" value={formatUSD(loan)} />
        <Stat
          label="Total interest"
          value={formatUSD(plan.totalInterest)}
          sub={saved > 1 ? `${formatUSD(saved)} less than without extra payments` : loan > 0 ? `${Math.round((plan.totalInterest / loan) * 100)}% of the amount borrowed` : null}
        />
        <Stat label="Paid off in" value={formatDuration(plan.months)} sub={monthsSooner > 0 ? `${formatDuration(monthsSooner)} sooner` : null} />
      </div>

      {chartData.length > 0 && (
        <div className="mt-6">
          <div className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">Where each year’s payments go</div>
          <StackedColumns data={chartData} series={SERIES} xTitle="Year" />
        </div>
      )}

      <Note>
        Estimates only. PMI is approximated at 1% of the loan per year when the down payment is under 20%. Your real rate
        depends on your credit score, loan type and lender — compare at least three offers.
      </Note>
    </WidgetCard>
  )
}
