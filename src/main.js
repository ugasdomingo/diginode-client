import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router'
import App from '@/App.vue'
import '@/assets/styles/main.scss'
import { initPixel, track } from '@/lib/pixel'
import { initAnalytics, trackPageview } from '@/lib/analytics'

const app = createApp(App)
app.use(createPinia())
app.use(router)

initPixel()
initAnalytics()

// Cada navegación de la SPA cuenta como una vista. El pixel solo se dispara si
// hay ID configurado; la analítica propia va siempre, porque es anónima.
router.afterEach((to) => {
  track('PageView')
  trackPageview(to.path)
})

app.mount('#app')
