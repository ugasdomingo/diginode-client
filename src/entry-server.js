import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import { renderToString } from '@vue/server-renderer'
import { createDiginodeRouter } from './router'
import App from './App.vue'
export { PAGE_SEO, SITE } from './data/pageSeo'
export async function render(path) {
  const app = createSSRApp(App)
  const router = createDiginodeRouter(true)
  app.use(createPinia())
  app.use(router)
  await router.push(path)
  await router.isReady()
  return renderToString(app)
}
