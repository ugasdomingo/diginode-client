/** Importes de la API de agencia, en euros (amount_eur), no en céntimos. */
export function formatEur(amount) {
  const value = Number(amount)
  if (!Number.isFinite(value)) return '—'
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value)
}

export function periodLabel(period) {
  const match = /^(\d{4})-(\d{2})$/.exec(String(period || ''))
  if (!match) return period || '—'
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, 1))
  const label = new Intl.DateTimeFormat('es-ES', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
  return label.charAt(0).toUpperCase() + label.slice(1)
}

export function formatDate(iso) {
  if (!iso) return '—'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'medium',
    timeZone: 'Europe/Madrid',
  }).format(date)
}

export function formatDateTime(iso) {
  if (!iso) return '—'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Europe/Madrid',
  }).format(date)
}

export function safeHttpsUrl(value) {
  try {
    const url = new URL(String(value))
    return url.protocol === 'https:' ? url.href : null
  } catch {
    return null
  }
}

export function safeTel(value) {
  const raw = String(value || '').trim()
  if (!/^\+?[0-9][0-9\s()-]{5,}$/.test(raw)) return null
  return `tel:${raw.replace(/\s/g, '')}`
}

/** Solo navegamos a Checkout si el enlace es de Stripe. */
export function stripeCheckoutUrl(value) {
  const safe = safeHttpsUrl(value)
  if (!safe || !safe.startsWith('https://checkout.stripe.com/')) return null
  return safe
}
