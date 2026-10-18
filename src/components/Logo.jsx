// FILE: src/components/Logo.jsx
import React from 'react'
import { Link } from 'react-router-dom'

export function LogoMark({ className = 'h-10 w-10 text-base' }) {
  return (
    <span
      className={`relative inline-flex flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-950 font-extrabold text-white shadow-md shadow-brand-700/30 ${className}`}
    >
      M
      <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-sun-400 ring-2 ring-white dark:ring-slate-950" />
    </span>
  )
}

export default function Logo() {
  return (
    <Link to="/" className="group flex items-center gap-3 rounded-xl" aria-label="MPC home">
      <LogoMark />
      <span className="leading-tight">
        <span className="block font-bold tracking-tight text-slate-900 dark:text-white">MPC</span>
        <span className="hidden text-xs text-slate-500 sm:block dark:text-slate-400">Moldovan Professionals Chicago</span>
      </span>
    </Link>
  )
}
