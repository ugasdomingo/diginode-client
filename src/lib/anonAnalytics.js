import { currentContext, privacySignal, publicPath } from '@/lib/measureContext'

// Estadística agregada, una petición cada vez. No lleva identificador, no lee
// ni escribe cookies ni almacenamiento, y no adjunta el recorrido en memoria.
// Do Not Track y Global Privacy Control se respetan igual que en la medición
// con consentimiento: si el navegador pide no ser medido, no sale nada.
// El interruptor de entorno es el mismo: un despliegue puede apagar toda la medición.

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'

// En producción el beacon entra por la propia web (función de Vercel) para que
// país y ciudad viajen en cabeceras de plataforma. En local se habla con la API
// directa: ahí no hay esas cabeceras y el país queda vacío.
export function anonEndpoint({
  prod = import.meta.env.PROD,
  base = BASE_URL,
  override = import.meta.env.VITE_ANON_ANALYTICS_URL,
} = {}) {
  if (override) return override
  if (prod) return '/api/analytics/anon'
  return `${base}/analytics/anon`
}
const FIELDS = ['type', 'path', 'referrer_domain', 'utm_source', 'utm_medium', 'utm_campaign', 'device', 'lang']

export function anonAllowed({
  envFlag = import.meta.env.VITE_ENABLE_ANALYTICS,
  doNotTrack = privacySignal(),
} = {}) {
  if (envFlag !== 'true') return false
  if (doNotTrack) return false
  return true
}

function bodyFor(fields) {
  const body = {}
  for (const key of FIELDS) body[key] = fields[key] ?? null
  if (fields.type === 'contact_click') {
    body.contact_type = fields.contact_type
    body.location = fields.location
  }
  return body
}

function deliver(payload) {
  if (!anonAllowed()) return
  const path = publicPath(payload.path)
  if (!path) return
  const json = JSON.stringify(bodyFor({ ...payload, path }))
  const url = anonEndpoint()
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const sent = navigator.sendBeacon(url, new Blob([json], { type: 'text/plain' }))
      if (sent) return
    }
    if (typeof fetch === 'function') {
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
        body: json,
        keepalive: true,
        credentials: 'omit',
        cache: 'no-store',
      }).catch(() => {})
    }
  } catch {
    // medir no debe interrumpir la visita
  }
}

export function trackAnonPageview(path, { query } = {}) {
  const clean = publicPath(path)
  if (!clean) return
  deliver({ type: 'pageview', path: clean, ...currentContext(query) })
}

export function trackAnonContact(contactType, location, path) {
  const clean = publicPath(path || (typeof window !== 'undefined' ? window.location.pathname : ''))
  if (!clean) return
  if (!['call', 'whatsapp', 'form'].includes(contactType)) return
  if (!['header', 'fab', 'contact_section', 'footer', 'nora'].includes(location)) return
  deliver({
    type: 'contact_click',
    path: clean,
    ...currentContext(),
    contact_type: contactType,
    location,
  })
}
