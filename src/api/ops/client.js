import { mockOps } from './mock.js'
import { presentApproval } from './present.js'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'

/**
 * Los ejemplos solo se usan si la bandera lo pide de forma explícita.
 * Sin definir, o con cualquier otro valor, se llama a la API real.
 */
export function opsUsesMock() {
  return import.meta.env.VITE_OPS_USE_MOCK === 'true'
}

const KNOWN_MESSAGES = {
  'Invalid credentials': 'Correo o contraseña incorrectos.',
  'Email and password are required': 'Escribe el correo y la contraseña.',
}

function translate(message, fallback) {
  if (!message) return fallback
  return KNOWN_MESSAGES[message] || message
}

function withId(doc) {
  if (!doc || typeof doc !== 'object' || Array.isArray(doc)) return doc
  const next = { ...doc }
  const id = next.id ?? next._id
  if (id != null) next.id = String(id)
  for (const key of ['piece_id', 'client_id', 'lead_id']) {
    if (next[key] != null && typeof next[key] !== 'object') next[key] = String(next[key])
  }
  if (Array.isArray(next.activity)) next.activity = next.activity.map(withId)
  if (Array.isArray(next.versions)) next.versions = next.versions.map(withId)
  if (Array.isArray(next.kpis)) next.kpis = next.kpis.map((item) => ({ ...item }))
  if (Array.isArray(next.audit)) next.audit = next.audit.map((item) => ({ ...item }))
  return next
}

function stripSecret(record) {
  if (!record || typeof record !== 'object') return record
  const next = { ...record }
  delete next.secret
  delete next.password
  delete next.api_key
  delete next.ciphertext
  delete next.iv
  delete next.auth_tag
  return next
}

function withoutSecrets(path, payload) {
  if (!payload || typeof payload !== 'object') return payload
  if (path.includes('/decrypt')) return payload
  if (!path.includes('/credentials')) return payload
  const next = { ...payload }
  if (Array.isArray(next.data)) next.data = next.data.map(stripSecret)
  else if (next.data && typeof next.data === 'object') next.data = stripSecret(next.data)
  return next
}

async function liveOps(method, path, body) {
  const headers = { Accept: 'application/json' }
  if (body != null) headers['Content-Type'] = 'application/json'
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
    throw new Error(translate(payload?.message, `Error ${response.status}`))
  }

  return withoutSecrets(path, payload)
}

export async function opsCall(method, path, body) {
  if (opsUsesMock()) return mockOps(method, path, body)
  return liveOps(method, path, body)
}

async function dataOf(method, path, body) {
  const payload = await opsCall(method, path, body)
  const data = payload?.data
  if (Array.isArray(data)) return data.map(withId)
  return withId(data)
}

async function listAll(path, query = {}) {
  const rows = []
  let page = 1
  for (let guard = 0; guard < 20; guard += 1) {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(query)) {
      if (value != null && value !== '') params.set(key, String(value))
    }
    params.set('limit', '100')
    params.set('page', String(page))
    const payload = await opsCall('GET', `${path}?${params}`)
    const batch = Array.isArray(payload?.data) ? payload.data.map(withId) : []
    const total = Number(payload?.total)
    rows.push(...batch)
    if (!Number.isFinite(total)) return rows
    if (!batch.length || rows.length >= total || batch.length < 100) break
    page += 1
  }
  return rows
}

function indexById(rows) {
  return new Map(rows.map((item) => [item.id, item]))
}

async function approvalCards(query = {}) {
  const [approvals, pieces, clients] = await Promise.all([
    listAll('/agency/approvals', query),
    listAll('/agency/pieces'),
    listAll('/agency/clients'),
  ])
  const piecesById = indexById(pieces)
  const clientsById = indexById(clients)
  return approvals.map((approval) =>
    presentApproval(approval, piecesById.get(approval.piece_id), clientsById.get(approval.client_id))
  )
}

export function login(body) {
  return opsCall('POST', '/auth/login', body)
}

export function verifyMfa(body) {
  return opsCall('POST', '/auth/otp/verify', body)
}

export function resendMfa(body) {
  return opsCall('POST', '/auth/otp/resend', body)
}

export function listLeads() {
  return listAll('/agency/leads')
}

export function getLead(id) {
  return dataOf('GET', `/agency/leads/${encodeURIComponent(id)}`)
}

export function listClients() {
  return listAll('/agency/clients')
}

export function listPieces(query = {}) {
  return listAll('/agency/pieces', query)
}

export function listApprovals(query = {}) {
  return listAll('/agency/approvals', query)
}

export function listDomingoQueue() {
  return approvalCards({ status: 'pendiente_domingo' })
}

export function listPortalApprovals() {
  return approvalCards()
}

function decisionBody(decision, comment) {
  const body = { decision }
  const text = String(comment || '').trim()
  if (text) body.comment = text
  return body
}

export function decideAsDomingo(id, decision, comment) {
  return dataOf('POST', `/agency/approvals/${encodeURIComponent(id)}/domingo`, decisionBody(decision, comment))
}

export function decideAsClient(id, decision, comment) {
  return dataOf('POST', `/agency/approvals/${encodeURIComponent(id)}/client`, decisionBody(decision, comment))
}

export async function listCredentials(clients) {
  const rows = clients || (await listClients())
  const groups = await Promise.all(
    rows.map((client) => listAll(`/agency/clients/${encodeURIComponent(client.id)}/credentials`))
  )
  return groups.flat()
}

export function createCredential(clientId, body) {
  return dataOf('POST', `/agency/clients/${encodeURIComponent(clientId)}/credentials`, {
    provider: body.provider || 'otro',
    label: body.label,
    secret: body.secret,
  })
}

export function deleteCredential(id) {
  return opsCall('DELETE', `/agency/credentials/${encodeURIComponent(id)}`)
}

export async function revealCredential(id) {
  const data = await dataOf('POST', `/agency/credentials/${encodeURIComponent(id)}/decrypt`, {})
  return data?.secret ?? null
}

export function listReports() {
  return listAll('/agency/reports')
}

export function listMeetings() {
  return listAll('/agency/meetings')
}

export function listInvoices() {
  return listAll('/agency/invoices')
}

export function createInvoiceCheckout(id) {
  return dataOf('POST', `/agency/invoices/${encodeURIComponent(id)}/checkout`, {})
}
