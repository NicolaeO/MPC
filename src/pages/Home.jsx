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
