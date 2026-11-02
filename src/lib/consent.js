/** Almacenamiento estrictamente necesario para recordar la elección de cookies. */
export const CONSENT_KEY = 'dn_consent'
export const CONSENT_VERSION = 1
export const CONSENT_EVENT = 'dn-consent-changed'

export const CONSENT_CATEGORIES = ['analytics', 'marketing', 'embeds']

/** Texto de la casilla que asocia el recorrido de esta visita a una solicitud. */
export const JOURNEY_CONSENT_VERSION = '1'
export const JOURNEY_CONSENT_TEXT = 'Acepto que Diginode asocie mi visita a mi solicitud'

/** Cookie de medición. Solo un UUID aleatorio, y solo tras aceptar la medición. */
export const VISITOR_COOKIE = 'dn_vid'
const VISITOR_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function emptyRecord(source) {
  return {
    version: CONSENT_VERSION,
    decidedAt: new Date().toISOString(),
    analytics: false,
    marketing: false,
    embeds: false,
    source,
  }
}

export function readConsent() {
  if (typeof localStorage === 'undefined') return null
  try {
    const parsed = JSON.parse(localStorage.getItem(CONSENT_KEY) || 'null')
    if (!parsed || parsed.version !== CONSENT_VERSION) return null
    if (typeof parsed.analytics !== 'boolean') return null
    if (typeof parsed.marketing !== 'boolean') return null
    if (typeof parsed.embeds !== 'boolean') return null
    return parsed
  } catch {
    return null
  }
}

export function writeConsent(partial) {
  const record = {
    ...emptyRecord(partial?.source || 'custom'),
    analytics: Boolean(partial?.analytics),
    marketing: Boolean(partial?.marketing),
    embeds: Boolean(partial?.embeds),
    source: partial?.source || 'custom',
  }
  localStorage.setItem(CONSENT_KEY, JSON.stringify(record))
  // La cookie nace o desaparece en el mismo momento que la elección.
  syncVisitorCookie()
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: record }))
  }
  return record
}

export function readVisitorId() {
  if (typeof document === 'undefined' || !document.cookie) return null
  const parts = document.cookie.split(';')
  for (const part of parts) {
    const [name, ...rest] = part.trim().split('=')
    if (name !== VISITOR_COOKIE) continue
    let value = rest.join('=')
    try {
      value = decodeURIComponent(value)
    } catch {
      return null
    }
    return VISITOR_UUID.test(value) ? value : null
  }
  return null
}

export function clearVisitorId() {
  if (typeof document === 'undefined') return
  document.cookie = `${VISITOR_COOKIE}=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure`
}

function writeVisitorCookie(id) {
  const expires = new Date()
  expires.setMonth(expires.getMonth() + 13)
  const maxAge = Math.max(0, Math.floor((expires.getTime() - Date.now()) / 1000))
  document.cookie = `${VISITOR_COOKIE}=${encodeURIComponent(id)}; Path=/; Max-Age=${maxAge}; Expires=${expires.toUTCString()}; SameSite=Lax; Secure`
}

/**
 * Crea o reutiliza dn_vid solo con la medición aceptada.
 * Sin esa elección, o al retirarla, borra la cookie y no genera un id nuevo.
 */
export function syncVisitorCookie() {
  if (typeof document === 'undefined') return null
  if (!hasConsent('analytics')) {
    clearVisitorId()
    return null
  }
  const existing = readVisitorId()
  if (existing) return existing
  const id = crypto.randomUUID()
  writeVisitorCookie(id)
  return readVisitorId()
}

export function hasConsent(category) {
  if (category === 'necessary') return true
  const record = readConsent()
  return Boolean(record && record[category] === true)
}
