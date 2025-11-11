// PROJECT: MPC (Moldovan Professionals Chicago) - React (Vite + React + Tailwind)
// This textdoc contains a ready-to-use project layout. Save each section as its filename in a new project folder.

// FILE: package.json
{
  "name": "mpc-react",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "generate-posts-index": "node scripts/generate-posts.js"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.14.0"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.24",
    "tailwindcss": "^3.5.3",
    "vite": "^5.3.0"
  }
}

// FILE: vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})

// FILE: tailwind.config.cjs
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}

// FILE: postcss.config.cjs
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

// FILE: index.html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MPC — Moldovan Professionals Chicago</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>

// FILE: src/main.jsx
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)

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

// FILE: src/index.css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* small customizations */
.container{ max-width: 960px; }

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

// FILE: src/components/PostCard.jsx
import React from 'react'
import { Link } from 'react-router-dom'

export default function PostCard({post}){
  return (
    <article className="bg-white rounded-lg shadow p-4">
      <div className="text-xs text-gray-500">{post.date}</div>
      <h3 className="text-lg font-semibold mt-1"><Link to={`/post/${post.slug}`} className="text-indigo-600">{post.title}</Link></h3>
      <p className="text-sm text-gray-600 mt-2">{post.excerpt}</p>
    </article>
  )
}

// FILE: src/pages/Home.jsx
import React, {useEffect, useState} from 'react'
import PostCard from '../components/PostCard'

export default function Home(){
  const [posts, setPosts] = useState([])
  useEffect(()=>{
    fetch('/posts/index.json').then(r=>r.json()).then(data=>{
      // sort desc by date
      data.sort((a,b)=> new Date(b.date) - new Date(a.date))
      setPosts(data.slice(0,4))
    }).catch(()=>{})
  },[])

  return (
    <div>
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 mb-8">
        <h1 className="text-3xl font-bold">Welcome to <span className="text-indigo-600">MPC</span></h1>
        <p className="mt-3 text-gray-700">Community for Moldovan professionals in the USA — articles, news, and jobs to help you build your career and thrive.</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Latest posts</h2>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {posts.length? posts.map(p=> <PostCard key={p.slug} post={p} />) : <div className="text-gray-500">No posts yet — add HTML files into <code>/public/posts/</code> and run the script to update index.json</div>}
        </div>
      </section>
    </div>
  )
}

// FILE: src/pages/Articles.jsx
import React, {useEffect, useState} from 'react'
import PostCard from '../components/PostCard'

export default function Articles(){
  const [posts, setPosts] = useState([])
  useEffect(()=>{
    fetch('/posts/index.json').then(r=>r.json()).then(data=>{
      data.sort((a,b)=> new Date(b.date) - new Date(a.date))
      setPosts(data)
    }).catch(()=>{})
  },[])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Articles & News</h1>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {posts.map(p=> <PostCard key={p.slug} post={p} />)}
      </div>
    </div>
  )
}

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

// FILE: src/pages/PostView.jsx
import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'

export default function PostView(){
  const {slug} = useParams()
  const [html, setHtml] = useState('')
  const [meta, setMeta] = useState(null)

  useEffect(()=>{
    fetch('/posts/index.json').then(r=>r.json()).then(data=>{
      const p = data.find(x=> x.slug === slug)
      if(p){ setMeta(p) }
    })
    fetch(`/posts/${slug}.html`).then(r=> r.text()).then(t=> setHtml(t)).catch(()=> setHtml('<p>Post not found.</p>'))
  },[slug])

  return (
    <div>
      {meta && (
        <div className="mb-4">
          <div className="text-sm text-gray-500">{meta.date}</div>
          <h1 className="text-2xl font-bold">{meta.title}</h1>
        </div>
      )}
      <div className="prose max-w-none" dangerouslySetInnerHTML={{__html: html}} />
    </div>
  )
}

// FILE: public/posts/README.md
// Place your post HTML files here. Use filenames like: 2025-11-11-getting-a-job-in-usa.html
// Each post file must include a front snippet in the top like <meta name="title" content="Post Title"> and <meta name="date" content="2025-11-11"> or the generate script will try to infer from filename.

// FILE: public/posts/example-post.html
<!doctype html>
<html>
  <head>
    <meta name="title" content="How to prepare a US-style resume" />
    <meta name="date" content="2025-11-01" />
  </head>
  <body>
    <h2>How to prepare a US-style resume</h2>
    <p>Short excerpt: A quick guide for Moldovan professionals to format resumes for the US market...</p>
    <p>Full article content goes here.</p>
  </body>
</html>

// FILE: public/posts/index.json
[
  {
    "slug": "example-post",
    "title": "How to prepare a US-style resume",
    "date": "2025-11-01",
    "excerpt": "A quick guide for Moldovan professionals to format resumes for the US market..."
  }
]

// FILE: public/jobs.json
[
  {"id":1, "title":"Software Engineer — Remote", "company":"Acme Corp", "location":"Chicago, IL", "link":"#"}
]

// FILE: scripts/generate-posts.js
// Node script: scans public/posts/*.html and generates public/posts/index.json
const fs = require('fs')
const path = require('path')

const postsDir = path.join(__dirname, '..', 'public', 'posts')
const outFile = path.join(postsDir, 'index.json')

function slugFromFilename(name){
  return name.replace(/\.html?$/i, '')
}

function extractMeta(content, filename){
  const titleMatch = content.match(/<meta\s+name=["']title["']\s+content=["']([^"']+)["']\s*\/?>/i)
  const dateMatch = content.match(/<meta\s+name=["']date["']\s+content=["']([^"']+)["']\s*\/?>/i)
  const title = titleMatch? titleMatch[1] : filename
  const date = dateMatch? dateMatch[1] : filename.slice(0,10)
  // excerpt: first paragraph text (strip tags)
  const pMatch = content.match(/<p>(.*?)<\/p>/i)
  const excerpt = pMatch? pMatch[1].replace(/<[^>]+>/g,'').slice(0,160) : ''
  return {title, date, excerpt}
}

fs.readdir(postsDir, (err, files)=>{
  if(err){ console.error(err); process.exit(1) }
  const htmlFiles = files.filter(f=> f.toLowerCase().endsWith('.html'))
  const posts = htmlFiles.map(f=>{
    const full = fs.readFileSync(path.join(postsDir,f), 'utf8')
    const slug = slugFromFilename(f)
    const meta = extractMeta(full, f)
    return { slug, title: meta.title, date: meta.date, excerpt: meta.excerpt }
  })
  posts.sort((a,b)=> new Date(b.date) - new Date(a.date))
  fs.writeFileSync(outFile, JSON.stringify(posts, null, 2))
  console.log('Generated', outFile)
})

// FILE: README.md
# MPC — Moldovan Professionals Chicago

## Overview
A minimal React + Vite + Tailwind static site to host articles, news and jobs for Moldovan professionals in the USA. Posts are simple HTML files placed in `public/posts/` and an `index.json` is generated by running `npm run generate-posts-index`.

## Features
- Home, Articles, Jobs, About pages
- Posts are static HTML files in `public/posts/` and are read without a backend
- Simple Node script to auto-generate `public/posts/index.json` from HTML files
- Ready for static hosting (Netlify, Vercel, GitHub Pages — with small config)

## Quick start
1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Add a post: create `public/posts/2025-11-11-my-post.html` and include `<meta name="title" content="My Post">` and `<meta name="date" content="2025-11-11">` at the top.
4. Run `npm run generate-posts-index` to refresh `public/posts/index.json` (or run this as part of your deploy pipeline).

## Deploy
Build with `npm run build` and deploy the `dist/` folder to any static host. Make sure `public/posts/` files are included in the deployed build (Vite copies them to `dist/`).

## Next steps (suggested)
- Add a simple admin form + GitHub Actions workflow to commit new posts via PR.
- Add comments or discussion (Disqus or static discussion service).
- Add job submission form that appends to `public/jobs.json` through a serverless function.


// END OF PROJECT
