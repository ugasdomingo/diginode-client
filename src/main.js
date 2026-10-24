import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router'
import App from '@/App.vue'
import '@/assets/styles/main.scss'
import '@/assets/styles/commercial.scss'
import { initPixel, track } from '@/lib/pixel'
import { initAnalytics, trackPageview } from '@/lib/analytics'

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
