

// FILE: src/App.jsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Articles from './pages/Articles'
import Jobs from './pages/Jobs'
import About from './pages/About'
import PostView from './pages/PostView'

export default function App(){
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/articles" element={<Articles/>} />
          <Route path="/jobs" element={<Jobs/>} />
          <Route path="/about" element={<About/>} />
          <Route path="/post/:slug" element={<PostView/>} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
