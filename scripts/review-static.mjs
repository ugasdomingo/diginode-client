// Local-only static server that exercises the committed hosting routes.
import http from 'node:http'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const root = fileURLToPath(new URL('../dist/', import.meta.url))
const config = JSON.parse(await fs.readFile(new URL('../vercel.json', import.meta.url), 'utf8'))
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
}
http
  .createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
      const rule = config.routes.find(
        (route) => route.src && route.src !== '/.*' && new RegExp(`^${route.src}$`).test(pathname)
      )
      if (rule?.status) {
        res.writeHead(rule.status, rule.headers)
        res.end()
        return
      }
      let file = path.resolve(root, '.' + (rule?.dest || pathname))
      if (file !== path.resolve(root) && !file.startsWith(root)) {
        res.writeHead(403)
        res.end()
        return
      }
      try {
        if ((await fs.stat(file)).isDirectory()) file = path.join(file, 'index.html')
      } catch {
        file = path.join(root, 'index.html')
      }
      const body = await fs.readFile(file)
      res.writeHead(200, {
        'Content-Type': types[path.extname(file)] || 'application/octet-stream',
        'Cache-Control': 'no-store',
      })
      res.end(body)
    } catch {
      res.writeHead(404)
      res.end()
    }
  })
  .listen(4173, '127.0.0.1', () => console.log('Local public review: http://localhost:4173'))
