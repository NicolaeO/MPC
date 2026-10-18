// FILE: src/lib/finance.js
// Pure calculation helpers used by the interactive article widgets.

/** Fixed-rate monthly principal + interest payment. */
export function monthlyPayment(principal, annualRatePct, years) {
  const n = Math.round(years * 12)
  if (!(principal > 0) || !(n > 0)) return 0
  const r = annualRatePct / 100 / 12
  if (r === 0) return principal / n
  return (principal * r) / (1 - Math.pow(1 + r, -n))
}

/**
 * Amortizes a loan month by month, optionally with extra principal each month.
 * Returns the scheduled payment, total interest, months to payoff and per-year totals.
 */
export function amortize(principal, annualRatePct, years, extraMonthly = 0) {
  const payment = monthlyPayment(principal, annualRatePct, years)
  const r = annualRatePct / 100 / 12
  const maxMonths = Math.round(years * 12)
  const extra = Math.max(0, extraMonthly || 0)
  const yearly = []
  let balance = principal > 0 ? principal : 0
  let totalInterest = 0
  let months = 0
  let yInterest = 0
  let yPrincipal = 0

  while (balance > 0.005 && months < maxMonths) {
    const interest = balance * r
    const toPrincipal = Math.min(payment - interest + extra, balance)
    balance -= toPrincipal
    totalInterest += interest
    yInterest += interest
    yPrincipal += toPrincipal
    months++
    if (months % 12 === 0 || balance <= 0.005) {
      yearly.push({ year: Math.ceil(months / 12), interest: yInterest, principal: yPrincipal, balance: Math.max(0, balance) })
      yInterest = 0
      yPrincipal = 0
    }
  }

  return { payment, totalInterest, months, yearly }
}

/**
 * Monthly-compounded growth of a starting balance plus a fixed monthly contribution.
 * Returns the end-of-year contributed total and balance for each year.
 */
export function compoundGrowth(initial, monthly, annualReturnPct, years) {
  const r = annualReturnPct / 100 / 12
  const rows = []
  let balance = Math.max(0, initial || 0)
  let contributed = balance
  for (let year = 1; year <= years; year++) {
    for (let m = 0; m < 12; m++) {
      balance = balance * (1 + r) + Math.max(0, monthly || 0)
      contributed += Math.max(0, monthly || 0)
    }
    rows.push({ year, contributed, balance, growth: balance - contributed })
  }
  return rows
}
