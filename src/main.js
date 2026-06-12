import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router'
import App from '@/App.vue'
import '@/assets/styles/main.scss'
import { initPixel, track } from '@/lib/pixel'

const app = createApp(App)
app.use(createPinia())
app.use(router)

initPixel()
// Track SPA navigations as PageViews.
router.afterEach(() => track('PageView'))

app.mount('#app')
