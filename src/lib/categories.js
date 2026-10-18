// FILE: src/lib/categories.js
// Topic categories. A post opts in with <meta name="category" content="Finance">.
// Class strings are written out in full so Tailwind can find them.

export const CATEGORIES = [
  {
    slug: 'finance',
    label: 'Finance',
    title: 'Money & Finance',
    description: 'Taxes, banking, credit, investing and retirement accounts.',
    icon: 'banknote',
    badge: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/20',
    tile: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300',
    accent: 'from-emerald-500 to-teal-500',
  },
  {
    slug: 'career',
    label: 'Career',
    title: 'Career & Work',
    description: 'Resumes, job search, salary negotiation and US work culture.',
    icon: 'briefcase',
    badge: 'bg-violet-50 text-violet-700 ring-violet-600/20 dark:bg-violet-400/10 dark:text-violet-300 dark:ring-violet-400/20',
    tile: 'bg-violet-100 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300',
    accent: 'from-violet-500 to-fuchsia-500',
  },
  {
    slug: 'housing',
    label: 'Housing',
    title: 'Housing',
    description: 'Renting your first apartment, mortgages and home buying.',
    icon: 'home',
    badge: 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/20',
    tile: 'bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300',
    accent: 'from-amber-500 to-orange-500',
  },
  {
    slug: 'settling-in',
    label: 'Settling In',
    title: 'Settling In',
    description: 'First steps, IDs, cars, staying safe and life in Chicago.',
    icon: 'compass',
    badge: 'bg-sky-50 text-sky-700 ring-sky-600/20 dark:bg-sky-400/10 dark:text-sky-300 dark:ring-sky-400/20',
    tile: 'bg-sky-100 text-sky-700 dark:bg-sky-400/10 dark:text-sky-300',
    accent: 'from-sky-500 to-cyan-500',
  },
  {
    slug: 'health',
    label: 'Health',
    title: 'Health',
    description: 'Health insurance, finding a doctor, HSAs and FSAs.',
    icon: 'heart',
    badge: 'bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-400/10 dark:text-rose-300 dark:ring-rose-400/20',
    tile: 'bg-rose-100 text-rose-700 dark:bg-rose-400/10 dark:text-rose-300',
    accent: 'from-rose-500 to-pink-500',
  },
]

const FALLBACK = {
  slug: 'general',
  label: 'General',
  title: 'General',
  description: '',
  icon: 'document',
  badge: 'bg-slate-100 text-slate-700 ring-slate-500/20 dark:bg-slate-400/10 dark:text-slate-300 dark:ring-slate-400/20',
  tile: 'bg-slate-100 text-slate-700 dark:bg-slate-400/10 dark:text-slate-300',
  accent: 'from-slate-500 to-slate-600',
}

const toSlug = (s) => String(s || '').trim().toLowerCase().replace(/\s+/g, '-')

export function getCategory(labelOrSlug) {
  const slug = toSlug(labelOrSlug)
  return CATEGORIES.find((c) => c.slug === slug) || FALLBACK
}
