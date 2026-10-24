import { spawn } from 'node:child_process'
import process from 'node:process'
const env = {
  ...process.env,
  VITE_API_URL: 'http://127.0.0.1:3107/api',
  VITE_ENABLE_ANALYTICS: 'true',
}
for (const [script, args] of [
  ['node_modules/vite/bin/vite.js', ['build']],
  ['scripts/prerender.mjs', []],
]) {
  const code = await new Promise((resolve) =>
    spawn(process.execPath, [script, ...args], { stdio: 'inherit', env }).once('exit', resolve)
  )
  if (code !== 0) process.exit(code || 1)
}
