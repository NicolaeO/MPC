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
