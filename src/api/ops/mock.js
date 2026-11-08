import { DEMO_ACCOUNTS, DEMO_MFA_CODE, createFixtures } from './fixtures.js'

let db = createFixtures()

export function resetOpsMock() {
  db = createFixtures()
}

function clone(value) {
  return structuredClone(value)
}

function fail(status, message) {
  const error = new Error(message)
  error.status = status
  throw error
}

function b64(value) {
  return btoa(JSON.stringify(value))
}

export function signDemoToken(user) {
  const payload = {
    user_id: user.role === 'admin' ? 'demo-admin' : user.client_id,
    email: user.email,
    role: user.role,
    client_id: user.client_id,
  }
  return `${b64({ alg: 'none', typ: 'JWT' })}.${b64(payload)}.demo`
}

function readToken(explicit) {
  if (explicit !== undefined) return explicit
  if (typeof localStorage === 'undefined') return null
  return localStorage.getItem('dn_token')
}

function payloadOf(token) {
  if (!token) return null
  try {
    const part = token.split('.')[1]
    return JSON.parse(atob(part))
  } catch {
    return null
  }
}

function requireRole(token, role) {
  const payload = payloadOf(token)
  if (!payload) fail(401, 'Tu sesión expiró. Entra de nuevo.')
  if (payload.role !== role) fail(403, 'No tienes permiso para ver esto.')
  return payload
}

function publicVault(entry) {
  return {
    id: entry.id,
    client_id: entry.client_id,
    label: entry.label,
    kind: entry.kind,
    username: entry.username || '',
    url: entry.url || '',
    notes: entry.notes || '',
    has_secret: Boolean(entry.has_secret),
    updated_at: entry.updated_at,
  }
}

function findApproval(id) {
  const item = db.approvals.find((entry) => entry.id === id)
  if (!item) fail(404, 'No encontramos esa pieza.')
  return item
}

function routeOf(path) {
  const [pathname, queryString = ''] = String(path).split('?')
  const query = Object.fromEntries(new URLSearchParams(queryString))
  return { pathname, query }
}

/**
 * Imita la API de operación. El secreto de la bóveda se guarda aparte
 * y ninguna respuesta lo incluye.
 */
export function mockOps(method, path, body = null, token) {
  const authToken = readToken(token)
  const { pathname, query } = routeOf(path)
  const key = `${method} ${pathname}`

  if (key === 'POST /auth/login') return login(body)
  if (key === 'POST /auth/mfa/verify') return verifyMfa(body)
  if (key === 'POST /auth/mfa/resend') return resendMfa(body)

  if (key === 'GET /admin/ops/leads') {
    requireRole(authToken, 'admin')
    const status = query.status
    const rows = db.leads.filter((item) => !status || item.status === status)
    return { success: true, data: clone(rows) }
  }

  const leadMatch = pathname.match(/^\/admin\/ops\/leads\/([^/]+)$/)
  if (method === 'GET' && leadMatch) {
    requireRole(authToken, 'admin')
    const item = db.leads.find((lead) => lead.id === leadMatch[1])
    if (!item) fail(404, 'No encontramos ese lead.')
    return { success: true, data: clone(item) }
  }

  if (key === 'GET /admin/ops/clients') {
    requireRole(authToken, 'admin')
    return { success: true, data: clone(db.clients) }
  }

  const clientMatch = pathname.match(/^\/admin\/ops\/clients\/([^/]+)$/)
  if (method === 'GET' && clientMatch) {
    requireRole(authToken, 'admin')
    const item = db.clients.find((client) => client.id === clientMatch[1])
    if (!item) fail(404, 'No encontramos ese cliente.')
    return { success: true, data: clone(item) }
  }

  if (key === 'GET /admin/ops/approvals') {
    requireRole(authToken, 'admin')
    let rows = db.approvals.filter((item) => item.stage === 'domingo' && item.status === 'pending')
    if (query.client_id) rows = db.approvals.filter((item) => item.client_id === query.client_id)
    return { success: true, data: clone(rows) }
  }

  const approveMatch = pathname.match(/^\/admin\/ops\/approvals\/([^/]+)\/approve$/)
  if (method === 'POST' && approveMatch) {
    requireRole(authToken, 'admin')
    const item = findApproval(approveMatch[1])
    if (item.stage !== 'domingo' || item.status !== 'pending') {
      fail(409, 'Esta pieza no está esperando a Domingo.')
    }
    item.stage = 'client'
    item.status = 'pending'
    item.needs_reapproval = false
    item.rejection_comment = ''
    return { success: true, data: clone(item) }
  }

  const rejectMatch = pathname.match(/^\/admin\/ops\/approvals\/([^/]+)\/reject$/)
  if (method === 'POST' && rejectMatch) {
    requireRole(authToken, 'admin')
    const item = findApproval(rejectMatch[1])
    if (item.stage !== 'domingo' || item.status !== 'pending') {
      fail(409, 'Esta pieza no está esperando a Domingo.')
    }
    item.status = 'rejected'
    item.rejection_comment = String(body?.comment || '').trim()
    return { success: true, data: clone(item) }
  }

  if (key === 'GET /admin/ops/vault') {
    requireRole(authToken, 'admin')
    const rows = db.vault.filter((item) => !query.client_id || item.client_id === query.client_id)
    return { success: true, data: rows.map(publicVault) }
  }

  if (key === 'POST /admin/ops/vault') {
    requireRole(authToken, 'admin')
    return { success: true, data: createVault(body) }
  }

  const vaultMatch = pathname.match(/^\/admin\/ops\/vault\/([^/]+)$/)
  if (method === 'PATCH' && vaultMatch) {
    requireRole(authToken, 'admin')
    return { success: true, data: updateVault(vaultMatch[1], body) }
  }

  if (key === 'GET /portal/ops/deliverables') {
    const user = requireRole(authToken, 'client')
    const rows = db.approvals.filter((item) => item.client_id === user.client_id)
    return { success: true, data: clone(rows) }
  }

  const clientApprove = pathname.match(/^\/portal\/ops\/deliverables\/([^/]+)\/approve$/)
  if (method === 'POST' && clientApprove) {
    const user = requireRole(authToken, 'client')
    const item = findApproval(clientApprove[1])
    assertClientPiece(item, user)
    item.status = 'approved'
    return { success: true, data: clone(item) }
  }

  const clientReject = pathname.match(/^\/portal\/ops\/deliverables\/([^/]+)\/reject$/)
  if (method === 'POST' && clientReject) {
    const user = requireRole(authToken, 'client')
    const item = findApproval(clientReject[1])
    assertClientPiece(item, user)
    const comment = String(body?.comment || '').trim()
    if (comment.length < 8) fail(400, 'Cuéntanos qué hay que cambiar, con una frase al menos.')
    item.stage = 'domingo'
    item.status = 'pending'
    item.needs_reapproval = true
    item.rejection_comment = comment
    item.version += 1
    return { success: true, data: clone(item) }
  }

  if (key === 'GET /portal/ops/reports') {
    const user = requireRole(authToken, 'client')
    const rows = db.reports.filter((item) => item.client_id === user.client_id)
    return { success: true, data: clone(rows) }
  }

  if (key === 'GET /portal/ops/meetings') {
    const user = requireRole(authToken, 'client')
    const rows = db.meetings
      .filter((item) => item.client_id === user.client_id)
      .sort((a, b) => a.starts_at.localeCompare(b.starts_at))
    return { success: true, data: clone(rows) }
  }

  if (key === 'POST /portal/ops/meetings') {
    const user = requireRole(authToken, 'client')
    return { success: true, data: requestMeeting(user, body) }
  }

  if (key === 'GET /portal/ops/invoices') {
    const user = requireRole(authToken, 'client')
    const rows = db.invoices.filter((item) => item.client_id === user.client_id)
    return { success: true, data: clone(rows) }
  }

  const checkoutMatch = pathname.match(/^\/portal\/ops\/invoices\/([^/]+)\/checkout$/)
  if (method === 'POST' && checkoutMatch) {
    const user = requireRole(authToken, 'client')
    const invoice = db.invoices.find((item) => item.id === checkoutMatch[1] && item.client_id === user.client_id)
    if (!invoice) fail(404, 'No encontramos esa factura.')
    if (invoice.status !== 'open') fail(409, 'Esta factura no está pendiente de pago.')
    return {
      success: true,
      data: {
        checkout_url: `https://checkout.stripe.com/c/pay/cs_test_${invoice.id}`,
        mock: true,
      },
    }
  }

  fail(404, `Endpoint no disponible (${method} ${pathname}).`)
}

function login(body) {
  const email = String(body?.email || '').trim().toLowerCase()
  const password = String(body?.password || '')
  const account = DEMO_ACCOUNTS.find((item) => item.email === email && item.password === password)
  if (!account) fail(401, 'Correo o contraseña incorrectos.')
  if (account.role === 'client') {
    const challengeId = `ch_${Math.random().toString(36).slice(2, 10)}`
    db.challenges[challengeId] = {
      email: account.email,
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    }
    return {
      success: true,
      mfa_required: true,
      challenge_id: challengeId,
      expires_at: db.challenges[challengeId].expires_at,
      destination_hint: maskEmail(account.email),
    }
  }
  return {
    success: true,
    token: signDemoToken(account),
    user: {
      id: 'demo-admin',
      email: account.email,
      role: 'admin',
      client_id: null,
      password_change_required: false,
    },
  }
}

function verifyMfa(body) {
  const challenge = db.challenges[body?.challenge_id]
  if (!challenge) fail(400, 'Ese código ya no sirve. Vuelve a entrar con tu contraseña.')
  if (new Date(challenge.expires_at).getTime() < Date.now()) {
    fail(400, 'El código caducó. Pide otro.')
  }
  const code = String(body?.code || '').replace(/\D/g, '')
  if (code !== DEMO_MFA_CODE) fail(401, 'El código no coincide. Revisa el correo e inténtalo de nuevo.')
  const account = DEMO_ACCOUNTS.find((item) => item.email === challenge.email)
  delete db.challenges[body.challenge_id]
  return {
    success: true,
    token: signDemoToken(account),
    user: {
      id: account.client_id,
      email: account.email,
      role: 'client',
      client_id: account.client_id,
      password_change_required: false,
    },
  }
}

function resendMfa(body) {
  const challenge = db.challenges[body?.challenge_id]
  if (!challenge) fail(400, 'Vuelve a entrar con tu contraseña para recibir otro código.')
  challenge.expires_at = new Date(Date.now() + 10 * 60 * 1000).toISOString()
  return { success: true, expires_at: challenge.expires_at }
}

function maskEmail(email) {
  const [name, domain] = email.split('@')
  const visible = name.slice(0, 1)
  return `${visible}***@${domain}`
}

function assertClientPiece(item, user) {
  if (item.client_id !== user.client_id) fail(403, 'Esa pieza es de otra cuenta.')
  if (item.stage !== 'client' || item.status !== 'pending') {
    fail(409, 'Esta pieza ya no está pendiente de tu aprobación.')
  }
}

function createVault(body) {
  const label = String(body?.label || '').trim()
  const clientId = String(body?.client_id || '').trim()
  const secret = String(body?.secret || '')
  if (!clientId || !db.clients.some((item) => item.id === clientId)) {
    fail(400, 'Elige el cliente al que pertenece el acceso.')
  }
  if (!label) fail(400, 'Pon un nombre que reconozcas dentro de un año.')
  if (!secret.trim()) fail(400, 'Falta la clave. No la guardamos en el navegador.')
  const entry = {
    id: `v_${Math.random().toString(36).slice(2, 10)}`,
    client_id: clientId,
    label,
    kind: body?.kind || 'otro',
    username: String(body?.username || '').trim(),
    url: String(body?.url || '').trim(),
    notes: String(body?.notes || '').trim(),
    has_secret: true,
    updated_at: new Date().toISOString(),
  }
  db.secrets[entry.id] = secret
  db.vault.unshift(entry)
  return publicVault(entry)
}

function updateVault(id, body) {
  const entry = db.vault.find((item) => item.id === id)
  if (!entry) fail(404, 'No encontramos ese acceso.')
  if (body?.label) entry.label = String(body.label).trim()
  if (body?.kind) entry.kind = body.kind
  if (body?.username !== undefined) entry.username = String(body.username || '').trim()
  if (body?.url !== undefined) entry.url = String(body.url || '').trim()
  if (body?.notes !== undefined) entry.notes = String(body.notes || '').trim()
  if (body?.client_id) entry.client_id = body.client_id
  const secret = String(body?.secret || '')
  if (secret.trim()) {
    db.secrets[entry.id] = secret
    entry.has_secret = true
  }
  entry.updated_at = new Date().toISOString()
  return publicVault(entry)
}

function requestMeeting(user, body) {
  const when = String(body?.preferred_at || '')
  if (!when || Number.isNaN(new Date(when).getTime())) {
    fail(400, 'Indica día y hora.')
  }
  const channel = body?.channel || 'videollamada'
  const labels = { llamada: 'Llamada', visita: 'Visita', videollamada: 'Videollamada' }
  const meeting = {
    id: `meet_${Math.random().toString(36).slice(2, 8)}`,
    client_id: user.client_id,
    title: `${labels[channel] || 'Reunión'} solicitada`,
    starts_at: new Date(when).toISOString(),
    place: labels[channel] || 'Por confirmar',
    status: 'requested',
    notes: String(body?.note || '').trim(),
  }
  db.meetings.push(meeting)
  return clone(meeting)
}
