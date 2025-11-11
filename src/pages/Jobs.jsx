// FILE: src/pages/Jobs.jsx
import React from 'react'

export default function Jobs(){
  // For a static site: maintain `public/jobs.json` or manage via admin later.
  const sampleJobs = [
    {id:1, title:'Software Engineer — Remote', company:'Acme Corp', location:'Chicago, IL', link:'#'},
    {id:2, title:'Data Analyst', company:'HealthX', location:'Remote', link:'#'}
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Jobs</h1>
      <p className="text-gray-600 mb-4">Job postings are displayed from a static JSON file. To add jobs, update <code>/public/jobs.json</code>.</p>
      <div className="space-y-4">
        {sampleJobs.map(j=> (
          <div key={j.id} className="bg-white rounded shadow p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold">{j.title}</div>
                <div className="text-sm text-gray-500">{j.company} — {j.location}</div>
              </div>
              <a href={j.link} className="text-indigo-600">Apply</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
