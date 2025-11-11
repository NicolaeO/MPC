
// FILE: src/components/Header.jsx
import React from 'react'
import { Link, NavLink } from 'react-router-dom'

export default function Header(){
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">M</div>
          <div>
            <div className="font-semibold">MPC</div>
            <div className="text-sm text-gray-500">Moldovan Professionals Chicago</div>
          </div>
        </Link>
        <nav className="space-x-4">
          <NavLink to="/" className={({isActive})=> isActive? 'text-indigo-600 font-medium':'text-gray-600'}>Home</NavLink>
          <NavLink to="/articles" className={({isActive})=> isActive? 'text-indigo-600 font-medium':'text-gray-600'}>Articles</NavLink>
          <NavLink to="/jobs" className={({isActive})=> isActive? 'text-indigo-600 font-medium':'text-gray-600'}>Jobs</NavLink>
          <NavLink to="/about" className={({isActive})=> isActive? 'text-indigo-600 font-medium':'text-gray-600'}>About</NavLink>
        </nav>
      </div>
    </header>
  )
}
