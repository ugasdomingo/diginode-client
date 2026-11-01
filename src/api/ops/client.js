import { mockOps } from './mock.js'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'

/**
 * Mientras la API de operación no está en main, el panel usa datos de
 * demostración. Producción debe poner VITE_OPS_USE_MOCK=false.
 */
export function opsUsesMock() {
  return import.meta.env.VITE_OPS_USE_MOCK !== 'false'
}

const KNOWN_MESSAGES = {
  'Invalid credentials': 'Correo o contraseña incorrectos.',
  'Email and password are required': 'Escribe el correo y la contraseña.',
}

function translate(message, fallback) {
  if (!message) return fallback
  return KNOWN_MESSAGES[message] || message
}

function stripSecret(record) {
  if (!record || typeof record !== 'object') return record
  const next = { ...record }
  const hadSecret = Boolean(next.has_secret || next.secret || next.password || next.api_key || next.value)
  delete next.secret
  delete next.password
  delete next.api_key
  delete next.value
  next.has_secret = hadSecret
  return next
}

function withoutSecrets(path, payload) {
  if (!path.startsWith('/admin/ops/vault') || !payload || typeof payload !== 'object') return payload
  const next = { ...payload }
  if (Array.isArray(next.data)) next.data = next.data.map(stripSecret)
  else if (next.data && typeof next.data === 'object') next.data = stripSecret(next.data)
  return next
}

async function liveOps(method, path, body) {
  const headers = { Accept: 'application/json', 'Content-Type': 'application/json' }
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('dn_token') : null
  if (token) headers.Authorization = `Bearer ${token}`

  let response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body == null ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new Error('No se pudo contactar con la API.')
  }

  const payload = await response.json().catch(() => ({}))
  const isAuth = path.startsWith('/auth/')

  if (response.status === 401 && !isAuth && typeof window !== 'undefined') {
    localStorage.removeItem('dn_token')
    sessionStorage.setItem('dn_session_expired', '1')
    window.location.href = '/login'
    return { success: false }
  }

  if (!response.ok) {
    const missing = response.status === 404
    throw new Error(
      missing
        ? `Endpoint no disponible (${method} ${path.split('?')[0]}). La API de operación aún no está en main.`
        : translate(payload?.message, `Error ${response.status}`)
    )
  }

  return withoutSecrets(path, payload)
}

export async function opsCall(method, path, body) {
  if (opsUsesMock()) return mockOps(method, path, body)
  return liveOps(method, path, body)
}

async function dataOf(method, path, body) {
  const payload = await opsCall(method, path, body)
  return payload?.data
}

export function login(body) {
  return opsCall('POST', '/auth/login', body)
}

export function verifyMfa(body) {
  return opsCall('POST', '/auth/mfa/verify', body)
}

export function resendMfa(body) {
  return opsCall('POST', '/auth/mfa/resend', body)
}

export function listLeads() {
  return dataOf('GET', '/admin/ops/leads')
}

export function getLead(id) {
  return dataOf('GET', `/admin/ops/leads/${encodeURIComponent(id)}`)
}

export function listClients() {
  return dataOf('GET', '/admin/ops/clients')
}

export function getClient(id) {
  return dataOf('GET', `/admin/ops/clients/${encodeURIComponent(id)}`)
}

export function listApprovals(clientId) {
  const query = clientId ? `?client_id=${encodeURIComponent(clientId)}` : ''
  return dataOf('GET', `/admin/ops/approvals${query}`)
}

export function approveAsDomingo(id) {
  return dataOf('POST', `/admin/ops/approvals/${encodeURIComponent(id)}/approve`, {})
}

export function rejectAsDomingo(id, comment) {
  return dataOf('POST', `/admin/ops/approvals/${encodeURIComponent(id)}/reject`, { comment: comment || '' })
}

export function listVault(clientId) {
  const query = clientId ? `?client_id=${encodeURIComponent(clientId)}` : ''
  return dataOf('GET', `/admin/ops/vault${query}`)
}

export function createVaultEntry(body) {
  return dataOf('POST', '/admin/ops/vault', body)
}

export function updateVaultEntry(id, body) {
  return dataOf('PATCH', `/admin/ops/vault/${encodeURIComponent(id)}`, body)
}

export function listDeliverables() {
  return dataOf('GET', '/portal/ops/deliverables')
}

export function approveDeliverable(id) {
  return dataOf('POST', `/portal/ops/deliverables/${encodeURIComponent(id)}/approve`, {})
}

export function rejectDeliverable(id, comment) {
  return dataOf('POST', `/portal/ops/deliverables/${encodeURIComponent(id)}/reject`, { comment })
}

export function listReports() {
  return dataOf('GET', '/portal/ops/reports')
}

export function listMeetings() {
  return dataOf('GET', '/portal/ops/meetings')
}

export function requestMeeting(body) {
  return dataOf('POST', '/portal/ops/meetings', body)
}

export function listInvoices() {
  return dataOf('GET', '/portal/ops/invoices')
}

export function createInvoiceCheckout(id) {
  return dataOf('POST', `/portal/ops/invoices/${encodeURIComponent(id)}/checkout`, {})
}
