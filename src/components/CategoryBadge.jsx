// FILE: src/components/CategoryBadge.jsx
import React from 'react'
import { getCategory } from '../lib/categories'

export default function CategoryBadge({ category, className = '' }) {
  const c = getCategory(category)
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${c.badge} ${className}`}
    >
      {c.label}
    </span>
  )
}
