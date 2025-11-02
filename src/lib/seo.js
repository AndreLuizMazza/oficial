// src/lib/seo.js
function upsertMeta(selector, attrs) {
  let el = document.querySelector(selector)
  if (!el) {
    el = document.createElement('meta')
    if (selector.startsWith('meta[name=')) {
      el.setAttribute('name', selector.match(/meta\[name="(.+)"\]/)[1])
    } else if (selector.startsWith('meta[property=')) {
      el.setAttribute('property', selector.match(/meta\[property="(.+)"\]/)[1])
    }
    document.head.appendChild(el)
  }
  Object.entries(attrs).forEach(([k, v]) => v != null && el.setAttribute(k, v))
  return el
}

function upsertLink(rel, href) {
  let el = document.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  if (href) el.setAttribute('href', href)
  return el
}

/**
 * setPageSEO
 * @param {object} opts
 * @param {string} opts.title
 * @param {string} opts.description
 * @param {boolean} opts.noindex
 * @param {string} [opts.canonical] URL absoluta
 * @param {string} [opts.ogImage] URL absoluta de imagem
 * @param {("website"|"article")} [opts.ogType]
 */
export function setPageSEO({ title, description, noindex = false, canonical, ogImage, ogType = "website" }) {
  if (title) document.title = title

  if (description) {
    upsertMeta('meta[name="description"]', { content: description })
  }

  upsertMeta('meta[name="robots"]', { content: noindex ? 'noindex, nofollow' : 'index, follow' })

  if (canonical) {
    upsertLink('canonical', canonical)
  }

  const url = canonical || window.location.href
  upsertMeta('meta[property="og:title"]', { content: title || document.title })
  upsertMeta('meta[property="og:description"]', { content: description || "" })
  upsertMeta('meta[property="og:type"]', { content: ogType })
  upsertMeta('meta[property="og:url"]', { content: url })
  if (ogImage) upsertMeta('meta[property="og:image"]', { content: ogImage })

  upsertMeta('meta[name="twitter:card"]', { content: ogImage ? 'summary_large_image' : 'summary' })
  upsertMeta('meta[name="twitter:title"]', { content: title || document.title })
  upsertMeta('meta[name="twitter:description"]', { content: description || "" })
  if (ogImage) upsertMeta('meta[name="twitter:image"]', { content: ogImage })
}
