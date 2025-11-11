
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
