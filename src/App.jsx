// FILE: src/App.jsx
import React, { useCallback, useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import SearchDialog from './components/SearchDialog'
import { BackToTop, ScrollManager } from './components/ScrollHelpers'
import Home from './pages/Home'
import Articles from './pages/Articles'
import Jobs from './pages/Jobs'
import About from './pages/About'
import Author from './pages/Author'
import PostView from './pages/PostView'
import NotFound from './pages/NotFound'
import { useTheme } from './lib/hooks'

const isTyping = (el) => el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))

export default function App() {
  const theme = useTheme()
  const [searchOpen, setSearchOpen] = useState(false)
  const openSearch = useCallback(() => setSearchOpen(true), [])
  const closeSearch = useCallback(() => setSearchOpen(false), [])

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen((o) => !o)
      } else if (e.key === '/' && !isTyping(document.activeElement)) {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only z-50 rounded-lg bg-brand-600 px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <ScrollManager />
      <Header onOpenSearch={openSearch} theme={theme} />
      <main id="main" className="flex-1">
        <Routes>
          <Route path="/" element={<Home onOpenSearch={openSearch} />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/about" element={<About />} />
          <Route path="/author" element={<Author />} />
          <Route path="/post/:slug" element={<PostView />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <BackToTop />
      <SearchDialog open={searchOpen} onClose={closeSearch} />
    </div>
  )
}
