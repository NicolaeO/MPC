// FILE: src/pages/About.jsx
import React, { useState } from 'react'
import Icon from '../components/Icon'
import { LogoMark } from '../components/Logo'
import { useDocumentTitle } from '../lib/hooks'

// ─── Contact form ────────────────────────────────────────────────────────────
// 1. Go to https://formspree.io and create a free account
// 2. Create a new form and copy the endpoint (looks like https://formspree.io/f/xxxxxxxx)
// 3. Replace the string below with your endpoint
const FORMSPREE_URL = 'https://formspree.io/f/xrejewle'

const EMPTY = { name: '', email: '', message: '', _gotcha: '' }

function ContactForm() {
  const [fields, setFields] = useState(EMPTY)
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  const handleChange = (e) => setFields((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(fields),
      })
      if (res.ok) {
        setStatus('sent')
        setFields(EMPTY)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="animate-scale-in rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center dark:border-emerald-500/30 dark:bg-emerald-500/10">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white">
          <Icon name="check" strokeWidth={2.5} />
        </div>
        <div className="mt-4 text-lg font-semibold text-emerald-800 dark:text-emerald-200">Message sent!</div>
        <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-300">Thanks for reaching out — I will get back to you soon.</p>
        <button onClick={() => setStatus('idle')} className="mt-5 text-sm font-medium text-emerald-700 underline underline-offset-4 dark:text-emerald-300">
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="name">
            Name
          </label>
          <input id="name" name="name" type="text" autoComplete="name" required value={fields.name} onChange={handleChange} placeholder="Your name" className="field" />
        </div>
        <div>
          <label className="label" htmlFor="email">
            Email
          </label>
          <input id="email" name="email" type="email" autoComplete="email" required value={fields.email} onChange={handleChange} placeholder="you@example.com" className="field" />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="message">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          value={fields.message}
          onChange={handleChange}
          placeholder="What would you like to ask or share?"
          className="field resize-y"
        />
      </div>
      {/* Honeypot: hidden from people, filled in by bots — Formspree drops those submissions. */}
      <input type="text" name="_gotcha" value={fields._gotcha} onChange={handleChange} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {status === 'error' && (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-300" role="alert">
          Something went wrong. Please try again in a moment.
        </p>
      )}
      <button type="submit" disabled={status === 'sending'} className="btn-primary w-full py-3">
        {status === 'sending' ? (
          'Sending…'
        ) : (
          <>
            <Icon name="mail" className="h-4 w-4" /> Send message
          </>
        )}
      </button>
    </form>
  )
}

const FEATURES = [
  {
    icon: 'document',
    title: 'Practical Articles',
    description: 'In-depth guides on taxes, banking, credit scores, mortgages, retirement accounts, and everything else the US financial system throws at you.',
  },
  {
    icon: 'briefcase',
    title: 'Career Guidance',
    description: 'How the US job market works, how to write an American-style resume, navigate LinkedIn, negotiate salary, and understand work culture.',
  },
  {
    icon: 'home',
    title: 'Settling In',
    description: 'Step-by-step guides for newcomers — getting your SSN, opening a bank account, renting your first apartment, and getting a driver’s license.',
  },
  {
    icon: 'users',
    title: 'Community',
    description: 'A growing platform for Moldovan and Eastern European professionals to share knowledge, find jobs, and support each other.',
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function About() {
  useDocumentTitle('About')
  return (
    <div className="page max-w-4xl animate-fade-in pt-10 sm:pt-14">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-950 px-6 py-14 text-center text-white shadow-lift sm:px-12">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-sun-400/20 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-sky-400/20 blur-3xl" aria-hidden="true" />
        <div className="relative">
          <LogoMark className="mx-auto h-16 w-16 text-2xl" />
          <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">Moldovan Professionals Chicago</h1>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-brand-100">
            A community platform built to help Moldovan professionals and immigrants in the USA navigate their new life —
            from taxes and banking to careers and housing.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="mt-16">
        <div className="eyebrow">Why we exist</div>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Our Mission</h2>
        <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
          Moving to a new country is hard. Understanding how everything works — the financial system, the job market,
          healthcare, legal requirements — takes years of trial and error. MPC exists to shorten that learning curve. We
          share practical, honest guides written by people who have been through it, so you can make informed decisions
          from day one.
        </p>
      </section>

      {/* What we offer */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">What We Offer</h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div key={f.title} className="surface flex gap-4 p-6 transition duration-300 hover:-translate-y-0.5 hover:shadow-lift">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
                <Icon name={f.icon} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">{f.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="mt-16 scroll-mt-24">
        <div className="surface p-6 sm:p-10">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Get in Touch</h2>
          <p className="mb-8 mt-2 text-slate-600 dark:text-slate-400">
            Have a question, a topic suggestion, a job to share, or want to contribute an article? Send a message and I
            will get back to you.
          </p>
          <ContactForm />
        </div>
      </section>
    </div>
  )
}
