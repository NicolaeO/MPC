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
