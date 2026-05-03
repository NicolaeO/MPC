import React, { useState } from 'react'

// ─── Contact form ────────────────────────────────────────────────────────────
// 1. Go to https://formspree.io and create a free account
// 2. Create a new form and copy the endpoint (looks like https://formspree.io/f/xxxxxxxx)
// 3. Replace the string below with your endpoint
const FORMSPREE_URL = 'https://formspree.io/f/xrejewle'

function ContactForm() {
  const [fields, setFields] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  const handleChange = (e) => setFields({ ...fields, [e.target.name]: e.target.value })

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
        setFields({ name: '', email: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="text-green-600 font-semibold text-lg mb-1">Message sent!</div>
        <p className="text-green-700 text-sm">Thanks for reaching out — I will get back to you soon.</p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-4 text-sm text-green-700 underline"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={fields.name}
            onChange={handleChange}
            placeholder="Your name"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={fields.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="message">
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
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
        />
      </div>
      {status === 'error' && (
        <p className="text-red-600 text-sm">Something went wrong. Please try again or email directly.</p>
      )}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
      >
        {status === 'sending' ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  )
}

// ─── Feature card ─────────────────────────────────────────────────────────────
function Feature({ icon, title, description }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex gap-4">
      <div className="w-11 h-11 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0 text-indigo-600">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function About() {
  return (
    <div className="max-w-3xl mx-auto">

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl px-8 py-12 text-white text-center mb-10">
        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold mx-auto mb-5">
          M
        </div>
        <h1 className="text-3xl font-bold mb-3">Moldovan Professionals Chicago</h1>
        <p className="text-blue-100 text-base max-w-xl mx-auto leading-relaxed">
          A community platform built to help Moldovan professionals and immigrants in the USA
          navigate their new life — from taxes and banking to careers and housing.
        </p>
      </section>

      {/* Mission */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h2>
        <p className="text-gray-600 leading-relaxed">
          Moving to a new country is hard. Understanding how everything works — the financial system,
          the job market, healthcare, legal requirements — takes years of trial and error. MPC exists
          to shorten that learning curve. We share practical, honest guides written by people who have
          been through it, so you can make informed decisions from day one.
        </p>
      </section>

      {/* What we offer */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">What We Offer</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Feature
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            title="Practical Articles"
            description="In-depth guides on taxes, banking, credit scores, mortgages, retirement accounts, and everything else the US financial system throws at you."
          />
          <Feature
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
            title="Career Guidance"
            description="How the US job market works, how to write an American-style resume, navigate LinkedIn, negotiate salary, and understand work culture."
          />
          <Feature
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            }
            title="Settling In"
            description="Step-by-step guides for newcomers — getting your SSN, opening a bank account, renting your first apartment, and getting a driver's license."
          />
          <Feature
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
            title="Community"
            description="A growing platform for Moldovan and Eastern European professionals to share knowledge, find jobs, and support each other."
          />
        </div>
      </section>

      {/* Divider */}
      <hr className="border-gray-200 mb-10" />

      {/* Contact */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Get in Touch</h2>
        <p className="text-gray-600 text-sm mb-6">
          Have a question, a topic suggestion, or want to contribute an article?
          Send a message and I will get back to you.
        </p>
        <ContactForm />
      </section>

    </div>
  )
}
