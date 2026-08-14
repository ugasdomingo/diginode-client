import { onMounted, onUnmounted } from 'vue'

// Lightweight per-view SEO for an SPA without SSR: sets document.title + meta
// description on mount, and optionally injects a JSON-LD structured-data block
// that is cleaned up when the view unmounts. Router-level defaults live in
// router/index.js (meta.title / meta.description); views with richer needs
// (JSON-LD) call this directly.
export function useSeo({ title, description, jsonLd = null }) {
  let ldScript = null

  onMounted(() => {
    if (title) document.title = title

    if (description) {
      let tag = document.querySelector('meta[name="description"]')
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute('name', 'description')
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', description)
    }

    if (jsonLd) {
      ldScript = document.createElement('script')
      ldScript.type = 'application/ld+json'
      ldScript.textContent = JSON.stringify(jsonLd)
      document.head.appendChild(ldScript)
    }
  })

  onUnmounted(() => {
    if (ldScript) {
      ldScript.remove()
      ldScript = null
    }
  })
}
