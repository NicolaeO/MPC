// FILE: src/components/Footer.jsx
import React from 'react'

export default function Footer(){
  return (
    <footer className="bg-white border-t mt-8">
      <div className="container mx-auto px-4 py-6 text-sm text-gray-600 flex justify-between">
        <div>© {new Date().getFullYear()} MPC — Moldovan Professionals Chicago</div>
        <div>Built with ❤️ for the community</div>
      </div>
    </footer>
  )
}
