// Cabeceras que la API usa para país y ciudad. Nada más: ni IP ni identificadores.

const COUNTRY = /^[A-Za-z]{2}$/
const CITY = /^[\p{L}\p{M}\s.'-]{1,80}$/u
const IP = /^\d{1,3}(\.\d{1,3}){3}$/
const STRIP = ['ip', 'ip_address', 'user_agent', 'ua', 'visitor_id', 'session_id', 'email', 'cookie', 'fingerprint']

export function cleanCountry(value) {
  if (typeof value !== 'string' || !COUNTRY.test(value.trim())) return null
  return value.trim().toUpperCase()
}

export function cleanCity(value) {
  if (typeof value !== 'string' || !value.trim()) return null
  let city = value.trim()
  try {
    city = decodeURIComponent(city).trim()
  } catch {
    return null
  }
  if (!CITY.test(city) || IP.test(city) || (city.includes(':') && /^[0-9a-f:]+$/i.test(city))) return null
  return city
}

function headerValue(headers, name) {
  if (!headers) return null
  if (typeof headers.get === 'function') return headers.get(name)
  const found = Object.keys(headers).find((key) => key.toLowerCase() === name)
  const value = found ? headers[found] : null
  return Array.isArray(value) ? value[0] : value
}

/** Solo país y ciudad, copiados a los nombres que mira la API. */
export function forwardHeaders(incoming) {
  const headers = new Headers()
  headers.set('content-type', 'text/plain;charset=UTF-8')
  const country = cleanCountry(
    headerValue(incoming, 'x-vercel-ip-country') || headerValue(incoming, 'cf-ipcountry')
  )
  const city = cleanCity(headerValue(incoming, 'x-vercel-ip-city') || headerValue(incoming, 'cf-ipcity'))
  if (country) {
    headers.set('x-vercel-ip-country', country)
    headers.set('cf-ipcountry', country)
  }
  if (city) {
    headers.set('x-vercel-ip-city', city)
    headers.set('cf-ipcity', city)
  }
  return headers
}

/** Cuerpo agregado. Si no es un objeto JSON pequeño, no se reenvía. */
export function prepareBody(raw, max = 4096) {
  if (typeof raw !== 'string' || raw.length === 0 || raw.length > max) return null
  let data
  try {
    data = JSON.parse(raw)
  } catch {
    return null
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) return null
  for (const key of STRIP) delete data[key]
  return JSON.stringify(data)
}
