import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router'
import App from '@/App.vue'
import '@/assets/styles/main.scss'
import '@/assets/styles/commercial.scss'
import '@/assets/styles/landing.scss'
import { initPixel, track } from '@/lib/pixel'
import { initAnalytics, trackPageview } from '@/lib/analytics'

// After a deploy, an open tab asks for chunks that no longer exist. Reload once to get the new build.
window.addEventListener('vite:preloadError', (event) => {
  let lastReload = 0
  try {
    lastReload = Number(sessionStorage.getItem('dn_chunk_reload')) || 0
    sessionStorage.setItem('dn_chunk_reload', String(Date.now()))
  } catch {
    /* storage blocked: keep the time guard at zero */
  }
  if (Date.now() - lastReload < 30000) return
  event.preventDefault()
  window.location.reload()
})

const app = createApp(App)
app.use(createPinia())
app.use(router)

initPixel()
initAnalytics()

// Measurement is explicitly enabled by environment; advertising remains disabled.
router.afterEach((to) => {
  track('PageView')
  trackPageview(to.path)
})

app.mount('#app')
