import React from 'react'

export default function Author() {
  return (
    <div className="max-w-xl mx-auto py-16 text-center">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6">N</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Nicolae</h1>
      <p className="text-indigo-600 font-semibold text-lg mb-8">Senior Software Engineer</p>
      <div className="text-gray-600 space-y-4 text-base leading-relaxed">
        <p>Originally from Moldova, now building things in the USA.</p>
        <p>I created this platform to help the community and give back — sharing what I've learned along the way so others don't have to figure it all out alone.</p>
      </div>
    </div>
  )
}
