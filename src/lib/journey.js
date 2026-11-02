import { currentContext, publicPath, roundedIso } from '@/lib/measureContext'

// Recorrido de la pestaña abierta. Vive solo en esta variable: no hay cookie,
// ni localStorage, ni sessionStorage, ni un identificador que se envíe a la
// medición anónima. Al cerrar o recargar la pestaña desaparece.

const MAX_EVENTS = 100
const events = []
let entry = null

function blankEntry() {
  return { referrer_domain: null, utm_source: null, utm_medium: null, utm_campaign: null }
}

function captureEntry(query) {
  const context = currentContext(query)
  return {
    referrer_domain: context.referrer_domain,
    utm_source: context.utm_source,
    utm_medium: context.utm_medium,
    utm_campaign: context.utm_campaign,
  }
}

function ensureEntry(query) {
  if (!entry) entry = captureEntry(query)
}

function push(event) {
  events.push(event)
  if (events.length > MAX_EVENTS) events.splice(0, events.length - MAX_EVENTS)
}

export function rememberPageview(path, { query } = {}) {
  const clean = publicPath(path)
  if (!clean) return
  ensureEntry(query)
  push({ type: 'pageview', path: clean, at: roundedIso() })
}

const CONTACT_TYPES = ['call', 'whatsapp', 'form']
const LOCATIONS = ['header', 'fab', 'contact_section', 'footer', 'nora']

export function rememberContact(contactType, location, path) {
  const clean = publicPath(path || (typeof window !== 'undefined' ? window.location.pathname : ''))
  if (!clean || !CONTACT_TYPES.includes(contactType) || !LOCATIONS.includes(location)) return
  ensureEntry()
  const event = {
    type: 'contact_click',
    path: clean,
    at: roundedIso(),
    contact_type: contactType,
    location,
  }
  push(event)
  return event
}

/** Copia del recorrido. No incluye ningún identificador de visita. */
export function currentJourney() {
  return {
    events: events.map((event) => ({ ...event })),
    entry: entry ? { ...entry } : blankEntry(),
  }
}

export function resetJourney() {
  events.length = 0
  entry = null
}
