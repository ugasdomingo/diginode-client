/** Almacenamiento estrictamente necesario para recordar la elección de cookies. */
export const CONSENT_KEY = 'dn_consent'
export const CONSENT_VERSION = 1
export const CONSENT_EVENT = 'dn-consent-changed'

export const CONSENT_CATEGORIES = ['analytics', 'marketing', 'embeds']

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
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: record }))
  }
  return record
}

export function hasConsent(category) {
  if (category === 'necessary') return true
  const record = readConsent()
  return Boolean(record && record[category] === true)
}
