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
