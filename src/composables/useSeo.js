import { onMounted } from 'vue'
import { SITE } from '@/data/pageSeo'

function meta(selector, attributes, content) {
  let tag = document.querySelector(selector)
  if (!tag) { tag = document.createElement('meta'); Object.entries(attributes).forEach(([key, value]) => tag.setAttribute(key, value)); document.head.appendChild(tag) }
  tag.setAttribute('content', content)
}
export function applySeo({ title, description, path, jsonLd = null, noindex = false }) {
  if (title) { document.title = title; meta('meta[property="og:title"]', { property: 'og:title' }, title) }
  if (description) { meta('meta[name="description"]', { name: 'description' }, description); meta('meta[property="og:description"]', { property: 'og:description' }, description) }
  if (path) {
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical) }
    canonical.href = SITE + path
    meta('meta[property="og:url"]', { property: 'og:url' }, SITE + path)
  }
  meta('meta[name="robots"]', { name: 'robots' }, noindex ? 'noindex, nofollow' : 'index, follow')
  document.querySelector('#route-jsonld')?.remove()
  if (jsonLd) { const script = document.createElement('script'); script.id = 'route-jsonld'; script.type = 'application/ld+json'; script.textContent = JSON.stringify(jsonLd); document.head.appendChild(script) }
}
export function useSeo(options) { onMounted(() => applySeo(options)) }
