// FILE: src/pages/Jobs.jsx
// Job postings come from public/jobs.json — see README for the format.
import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import { formatDate } from '../lib/format'
import { useDocumentTitle } from '../lib/hooks'

const WORKPLACES = ['Remote', 'Hybrid', 'On-site']

const JOB_BOARDS = [
  { name: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs/', text: 'The largest professional network. Recruiters search it daily — keep your profile complete.' },
  { name: 'Indeed', url: 'https://www.indeed.com/', text: 'Aggregates postings from across the web. Set alerts for your target role and city.' },
  { name: 'Built In Chicago', url: 'https://www.builtinchicago.org/jobs', text: 'Tech and startup roles across the Chicago area, with salary ranges and company profiles.' },
  { name: 'Illinois JobLink', url: 'https://illinoisjoblink.illinois.gov/', text: 'The state’s free job board run by IDES, plus links to local workforce centers.' },
  { name: 'USAJOBS', url: 'https://www.usajobs.gov/', text: 'Official federal government jobs. Many require US citizenship — check each posting.' },
  { name: 'MyVisaJobs', url: 'https://www.myvisajobs.com/', text: 'See which employers have sponsored H-1B visas and for what roles and salaries.' },
]

const safeLink = (url) => (/^(https?:|mailto:)/i.test(url || '') ? url : null)

export default function Jobs() {
  useDocumentTitle('Jobs')
  const [jobs, setJobs] = useState(null)
  const [error, setError] = useState(false)
  const [query, setQuery] = useState('')
  const [workplace, setWorkplace] = useState('all')

  useEffect(() => {
    let active = true
    fetch('/jobs.json')
      .then((r) => {
        if (!r.ok) throw new Error()
        return r.json()
      })
      .then((data) => active && setJobs(Array.isArray(data) ? data : []))
      .catch(() => {
        if (!active) return
        setError(true)
        setJobs([])
      })
    return () => {
      active = false
    }
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (jobs || [])
      .filter((j) => workplace === 'all' || (j.workplace || '').toLowerCase() === workplace.toLowerCase())
      .filter((j) => !q || [j.title, j.company, j.location, j.description].join(' ').toLowerCase().includes(q))
      .sort((a, b) => String(b.posted || '').localeCompare(String(a.posted || '')))
  }, [jobs, query, workplace])

  return (
    <div className="page animate-fade-in pt-10 sm:pt-14">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <div className="eyebrow">Opportunities</div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">Job board</h1>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
            Roles shared by and for the community, plus the best places to keep looking.
          </p>
        </div>
        <Link to="/about#contact" className="btn-secondary flex-shrink-0">
          <Icon name="briefcase" className="h-4 w-4" /> Hiring? Share a role
        </Link>
      </header>

      {jobs === null ? (
        <div className="mt-10 space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="skeleton h-28 rounded-2xl" />
          ))}
        </div>
      ) : jobs.length > 0 ? (
        <>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <label className="relative flex-1">
              <span className="sr-only">Search jobs</span>
              <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search title, company or location"
                className="field pl-10"
              />
            </label>
            <div className="flex gap-2 overflow-x-auto" role="group" aria-label="Workplace type">
              {['all', ...WORKPLACES].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setWorkplace(w)}
                  aria-pressed={workplace === w}
                  className={workplace === w ? 'chip-active' : 'chip-idle'}
                >
                  {w === 'all' ? 'All' : w}
                </button>
              ))}
            </div>
          </div>

          <ul className="mt-6 space-y-4">
            {filtered.map((job, i) => (
              <JobCard key={job.id ?? i} job={job} />
            ))}
          </ul>
          {filtered.length === 0 && (
            <p className="surface mt-4 p-8 text-center text-sm text-slate-500 dark:text-slate-400">No roles match those filters.</p>
          )}
        </>
      ) : (
        <div className="surface mt-10 flex flex-col items-center px-6 py-14 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
            <Icon name="briefcase" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
            {error ? 'Job listings are unavailable right now' : 'No community openings posted right now'}
          </h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Know a company hiring — or hiring yourself? Send the role and we’ll share it here. Meanwhile, the boards
            below are the best places to search.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link to="/about#contact" className="btn-primary">
              Share a job opening
            </Link>
            <Link to="/post/2026-01-20-how-to-find-a-job-in-the-usa" className="btn-secondary">
              Job search guide
            </Link>
          </div>
        </div>
      )}

      <section className="mt-20">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Where to search</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Trusted job boards for professionals in Chicago and across the US.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {JOB_BOARDS.map((b) => (
            <a
              key={b.name}
              href={b.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group surface p-5 transition duration-300 hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold text-slate-900 group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-300">{b.name}</h3>
                <Icon name="external" className="h-4 w-4 text-slate-400" />
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{b.text}</p>
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}

function JobCard({ job }) {
  const link = safeLink(job.link)
  return (
    <li className="surface flex flex-col gap-4 p-5 transition hover:shadow-lift sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{job.title}</h3>
        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
          {job.company && (
            <span className="inline-flex items-center gap-1.5">
              <Icon name="briefcase" className="h-4 w-4" /> {job.company}
            </span>
          )}
          {job.location && (
            <span className="inline-flex items-center gap-1.5">
              <Icon name="mapPin" className="h-4 w-4" /> {job.location}
            </span>
          )}
          {job.posted && <span>Posted {formatDate(job.posted)}</span>}
        </div>
        {job.description && <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{job.description}</p>}
        <div className="mt-3 flex flex-wrap gap-2">
          {[job.workplace, job.type, job.salary].filter(Boolean).map((tag) => (
            <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {tag}
            </span>
          ))}
        </div>
      </div>
      {link && (
        <a href={link} target="_blank" rel="noopener noreferrer" className="btn-primary flex-shrink-0">
          Apply <Icon name="external" className="h-4 w-4" />
        </a>
      )}
    </li>
  )
}
