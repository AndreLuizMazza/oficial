export function setPageSEO({ title, description }){
  if (title) document.title = title
  setMeta('description', description)
}
function setMeta(name, content){
  let m = document.querySelector(`meta[name="${name}"]`)
  if (!m){ m = document.createElement('meta'); m.setAttribute('name', name); document.head.appendChild(m) }
  if (content) m.setAttribute('content', content)
}
