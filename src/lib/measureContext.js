// Datos de una sola petición. Sin almacenamiento, sin identificador y sin el
// agente de usuario completo: solo lo que se puede agregar.

const PRIVATE_PREFIXES = ['/portal', '/admin', '/login', '/cambiar-contrasena']

export function publicPath(path) {
  if (typeof path !== 'string') return null
  const clean = path.split('?')[0].split('#')[0]
  if (!clean.startsWith('/') || clean.length > 300 || clean.includes('@')) return null
  if (PRIVATE_PREFIXES.some((prefix) => clean === prefix || clean.startsWith(`${prefix}/`))) return null
  return clean
}

export function privacySignal({
  doNotTrack = typeof navigator !== 'undefined' &&
    (navigator.doNotTrack === '1' || navigator.globalPrivacyControl === true),
} = {}) {
  return Boolean(doNotTrack)
}

/** Precisión de un segundo: se descartan los milisegundos. */
export function roundedIso(date = new Date()) {
  const copy = new Date(date.getTime())
  copy.setMilliseconds(0)
  return copy.toISOString().replace('.000Z', 'Z')
}

function withoutControls(value) {
  let clean = ''
  for (const char of value) {
    const code = char.charCodeAt(0)
    if (code > 31 && code !== 127) clean += char
  }
  return clean
}

export function cleanUtm(value) {
  const raw = Array.isArray(value) ? value[0] : value
  if (typeof raw !== 'string') return null
  const trimmed = withoutControls(raw).trim()
  if (!trimmed || trimmed.length > 80 || trimmed.includes('@')) return null
  return trimmed
}

export function utmFrom(query) {
  const source = query || {}
  return {
    utm_source: cleanUtm(source.utm_source),
    utm_medium: cleanUtm(source.utm_medium),
    utm_campaign: cleanUtm(source.utm_campaign),
  }
}

export function utmFromSearch(search = '') {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)
  return utmFrom({
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
  })
}

export function referrerDomain(referrer, origin) {
  if (!referrer || typeof referrer !== 'string') return null
  try {
    const url = new URL(referrer)
    if (origin && url.origin === origin) return null
    let host = url.hostname.toLowerCase()
    if (host.startsWith('www.')) host = host.slice(4)
    if (!host || /^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.includes(':')) return null
    if (!/^[a-z0-9.-]+$/.test(host)) return null
    return host
  } catch {
    return null
  }
}

export function deviceClass(width, userAgent = '') {
  const pixels = Number(width)
  if (pixels >= 1100) return 'desktop'
  if (pixels >= 768) return 'tablet'
  if (pixels > 0) return 'mobile'
  const ua = String(userAgent)
  if (/iPad|Tablet|PlayBook|Silk/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua))) return 'tablet'
  if (/Mobi|iPhone|iPod|Android/i.test(ua)) return 'mobile'
  return 'desktop'
}

export function primaryLanguage(language) {
  const code = String(language || '')
    .toLowerCase()
    .split(/[-_]/)[0]
  return /^[a-z]{2,3}$/.test(code) ? code : null
}

export function currentContext(query) {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const referrer = typeof document !== 'undefined' ? document.referrer : ''
  const width = typeof window !== 'undefined' ? window.innerWidth : 0
  const language = typeof navigator !== 'undefined' ? navigator.language : ''
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : ''
  const utm = query
    ? utmFrom(query)
    : utmFromSearch(typeof window !== 'undefined' ? window.location.search : '')
  return {
    referrer_domain: referrerDomain(referrer, origin),
    ...utm,
    device: deviceClass(width, userAgent),
    lang: primaryLanguage(language),
  }
}
