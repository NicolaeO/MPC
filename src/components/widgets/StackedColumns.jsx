// FILE: src/components/widgets/StackedColumns.jsx
// Responsive SVG stacked-column chart with hover/keyboard tooltip and a table view.
// Marks: ≤24px columns, 4px rounded data-end, 2px surface gap between segments,
// hairline solid grid, legend always shown (≥2 series), text in ink tokens only.
import React, { useLayoutEffect, useRef, useState } from 'react'
import Icon from '../Icon'
import { formatUSD, formatUSDCompact } from '../../lib/format'

const MARGIN = { top: 12, right: 8, bottom: 26, left: 48 }
const GAP = 2
const RADIUS = 4

function niceTicks(max, count = 4) {
  if (!(max > 0)) return [0, 1]
  const raw = max / count
  const mag = Math.pow(10, Math.floor(Math.log10(raw)))
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw)
  const ticks = []
  for (let v = 0; ; v += step) {
    ticks.push(v)
    if (v >= max) break
  }
  return ticks
}

function segmentPath(x, top, w, h, r) {
  if (h <= 0) return ''
  r = Math.min(r, h, w / 2)
  if (r <= 0) return `M${x},${top}h${w}v${h}h${-w}Z`
  return `M${x},${top + h}V${top + r}Q${x},${top} ${x + r},${top}H${x + w - r}Q${x + w},${top} ${x + w},${top + r}V${top + h}Z`
}

export default function StackedColumns({ data, series, xTitle = 'Year', height = 240, format = formatUSD }) {
  const wrapRef = useRef(null)
  const [width, setWidth] = useState(640)
  const [active, setActive] = useState(null)
  const [showTable, setShowTable] = useState(false)

  useLayoutEffect(() => {
    const el = wrapRef.current
    if (!el) return
    setWidth(el.clientWidth)
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const plotW = Math.max(0, width - MARGIN.left - MARGIN.right)
  const plotH = height - MARGIN.top - MARGIN.bottom
  const totals = data.map((d) => d.values.reduce((a, b) => a + b, 0))
  const ticks = niceTicks(Math.max(0, ...totals))
  const yMax = ticks[ticks.length - 1]
  const band = data.length ? plotW / data.length : 0
  const barW = Math.max(1, Math.min(24, band - GAP))
  const scale = (v) => (v / yMax) * plotH
  const labelEvery = Math.max(1, Math.ceil(data.length / Math.max(1, Math.floor(plotW / 34))))

  const onKeyDown = (e) => {
    if (!data.length) return
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault()
      const dir = e.key === 'ArrowRight' ? 1 : -1
      setActive((i) => Math.min(data.length - 1, Math.max(0, (i ?? (dir > 0 ? -1 : data.length)) + dir)))
    }
  }

  const tip = active != null && data[active]
  const tipX = active != null ? MARGIN.left + active * band + band / 2 : 0
  const flip = tipX > width * 0.6

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ul className="m-0 flex list-none flex-wrap gap-x-5 gap-y-1 p-0 text-sm text-slate-600 dark:text-slate-300" aria-label="Legend">
          {series.map((s) => (
            <li key={s.label} className="m-0 flex items-center gap-2 p-0">
              <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} aria-hidden="true" />
              {s.label}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => setShowTable((t) => !t)}
          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          aria-expanded={showTable}
        >
          <Icon name="table" className="h-4 w-4" />
          {showTable ? 'Hide table' : 'Show table'}
        </button>
      </div>

      <div ref={wrapRef} className="relative mt-3" onPointerLeave={() => setActive(null)}>
        <svg
          width={width}
          height={height}
          className="block touch-pan-y overflow-visible rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          role="img"
          aria-label={`Stacked column chart of ${series.map((s) => s.label).join(' and ')} by ${xTitle.toLowerCase()}. Use arrow keys to inspect values.`}
          tabIndex={0}
          onKeyDown={onKeyDown}
          onFocus={() => setActive((i) => i ?? data.length - 1)}
          onBlur={() => setActive(null)}
        >
          <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
            {ticks.map((t) => (
              <g key={t} transform={`translate(0,${plotH - scale(t)})`}>
                <line x1={0} x2={plotW} stroke={t === 0 ? 'var(--viz-axis)' : 'var(--viz-grid)'} strokeWidth={1} shapeRendering="crispEdges" />
                <text x={-8} dy="0.32em" textAnchor="end" fontSize={11} fill="var(--viz-muted)" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {formatUSDCompact(t)}
                </text>
              </g>
            ))}

            {data.map((d, i) => {
              const x = i * band + (band - barW) / 2
              const lastVisible = d.values.reduce((last, v, k) => (scale(v) > 0.5 ? k : last), -1)
              let base = plotH
              return (
                <g key={d.label} opacity={active == null || active === i ? 1 : 0.4} style={{ transition: 'opacity 120ms' }}>
                  {d.values.map((v, k) => {
                    let h = scale(v)
                    const top = base - h
                    if (k > 0) h -= GAP // surface gap below every stacked segment
                    const path = segmentPath(x, top, barW, h, k === lastVisible ? RADIUS : 0)
                    base = top
                    return path ? <path key={k} d={path} fill={series[k].color} /> : null
                  })}
                  {i % labelEvery === 0 && (
                    <text x={x + barW / 2} y={plotH + 17} textAnchor="middle" fontSize={11} fill="var(--viz-muted)">
                      {d.label}
                    </text>
                  )}
                </g>
              )
            })}

            {/* Full-height hit targets, wider than the marks */}
            {data.map((d, i) => (
              <rect key={d.label} x={i * band} y={0} width={band} height={plotH} fill="transparent" onPointerEnter={() => setActive(i)} onPointerDown={() => setActive(i)} />
            ))}
          </g>
        </svg>

        {tip && (
          <div
            className="pointer-events-none absolute top-2 z-10 min-w-[11rem] rounded-xl border border-slate-200 bg-white/95 px-3 py-2.5 text-xs shadow-lift backdrop-blur dark:border-slate-700 dark:bg-slate-900/95"
            style={flip ? { right: width - tipX + 12 } : { left: tipX + 12 }}
            role="status"
          >
            <div className="font-semibold text-slate-500 dark:text-slate-400">
              {xTitle} {tip.label}
            </div>
            {series.map((s, k) => (
              <div key={s.label} className="mt-1.5 flex items-center gap-2">
                <span className="inline-block h-0.5 w-3 rounded-full" style={{ background: s.color }} aria-hidden="true" />
                <span className="text-sm font-semibold tabular-nums text-slate-900 dark:text-white">{format(tip.values[k])}</span>
                <span className="text-slate-500 dark:text-slate-400">{s.label}</span>
              </div>
            ))}
            <div className="mt-1.5 border-t border-slate-200 pt-1.5 text-slate-500 dark:border-slate-700 dark:text-slate-400">
              Total <span className="font-semibold tabular-nums text-slate-900 dark:text-white">{format(totals[active])}</span>
            </div>
          </div>
        )}
      </div>

      {showTable && (
        <div className="mt-4 max-h-72 overflow-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full border-collapse text-sm">
            <thead className="sticky top-0 bg-slate-50 dark:bg-slate-950">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-200">{xTitle}</th>
                {series.map((s) => (
                  <th key={s.label} className="px-3 py-2 text-right font-semibold text-slate-700 dark:text-slate-200">
                    {s.label}
                  </th>
                ))}
                <th className="px-3 py-2 text-right font-semibold text-slate-700 dark:text-slate-200">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d, i) => (
                <tr key={d.label} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-3 py-1.5 text-slate-600 dark:text-slate-300">{d.label}</td>
                  {d.values.map((v, k) => (
                    <td key={k} className="px-3 py-1.5 text-right tabular-nums text-slate-600 dark:text-slate-300">
                      {format(v)}
                    </td>
                  ))}
                  <td className="px-3 py-1.5 text-right font-medium tabular-nums text-slate-900 dark:text-white">{format(totals[i])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
