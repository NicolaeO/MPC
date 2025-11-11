// FILE: src/pages/About.jsx
import React from 'react'

export default function About(){
  return (
    <div className="prose max-w-none">
      <h1>About MPC</h1>
      <p>MPC (Moldovan Professionals Chicago) is a community platform aiming to support Moldovan immigrants and other professionals in the USA as they build careers, find jobs, and stay informed.</p>
      <h2>What we offer</h2>
      <ul>
        <li>Articles & guides (resumes, US job market tips, career change)</li>
        <li>Job postings relevant to our community</li>
        <li>News and events</li>
      </ul>
      <h2>Contribute</h2>
      <p>To add a new post: drop an HTML file in <code>/public/posts/</code> with the filename format <code>YYYY-MM-DD-slug-title.html</code> and run <code>npm run generate-posts-index</code>. The script will generate/update <code>public/posts/index.json</code>.</p>
    </div>
  )
}
