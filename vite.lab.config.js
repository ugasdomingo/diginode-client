import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// Isolated entry: no .env, production API, analytics or payment SDK.
export default defineConfig({
  envDir: false,
  plugins: [vue()],
  server: {
    host: '127.0.0.1', port: 5174, strictPort: true,
    proxy: { '/lab-api': { target: 'http://127.0.0.1:3001', changeOrigin: true, rewrite: (path) => path.replace(/^\/lab-api/, '/api/lab') } },
  },
  build: { outDir: 'dist-lab', rollupOptions: { input: fileURLToPath(new URL('./lab.html', import.meta.url)) } },
})
