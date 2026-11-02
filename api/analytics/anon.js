import { forwardHeaders, prepareBody } from './forward.js'

// El navegador habla con esta misma web. Vercel ya conoce el país y la ciudad
// de la conexión; aquí se reenvían solo esas cabeceras. La petición de salida
// se construye desde cero, así que no arrastra la IP del visitante.

export const config = { runtime: 'edge' }

export default async function handler(request) {
  if (request.method !== 'POST') {
    return new Response(null, { status: 405, headers: { Allow: 'POST' } })
  }
  const upstream = process.env.ANALYTICS_UPSTREAM_URL || process.env.VITE_API_URL
  if (!upstream) return new Response(null, { status: 204 })

  const body = prepareBody(await request.text())
  if (!body) return new Response(null, { status: 204 })

  const url = `${upstream.replace(/\/$/, '')}/analytics/anon`
  try {
    await fetch(url, { method: 'POST', headers: forwardHeaders(request.headers), body })
  } catch {
    // medir no debe devolver un error visible
  }
  return new Response(null, { status: 204 })
}
