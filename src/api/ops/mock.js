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
    user_id: user.role === 'admin' ? '64b0000000000000000000ad' : user.client_id,
    role: user.role,
    token_version: 0,
    client_id: user.client_id,
  }
  return `${b64({ alg: 'none', typ: 'JWT' })}.${b64(payload)}.demo`
}

function routeOf(path) {
  const [pathname, queryString = ''] = String(path).split('?')
  const query = Object.fromEntries(new URLSearchParams(queryString))
  return { pathname, query }
}

function readToken(explicit) {
  if (explicit !== undefined) return explicit
  if (typeof localStorage === 'undefined') return null
  return localStorage.getItem('dn_token')
}

function payloadOf(token) {
  if (!token) return null
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}

function actorFrom(token, roles) {
  const payload = payloadOf(token)
  if (!payload?.role) fail(401, 'No autorizado')
  if (roles && !roles.includes(payload.role)) fail(403, 'Acceso denegado')
  return payload
}

function byId(rows, id) {
  return rows.find((item) => item.id === id || item._id === id)
}

function page(rows, query) {
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 20, 1), 100)
  const pageNum = Math.max(parseInt(query.page, 10) || 1, 1)
  const start = (pageNum - 1) * limit
  return { success: true, data: clone(rows.slice(start, start + limit)), total: rows.length }
}

function scoped(rows, actor) {
  if (actor.role !== 'client') return rows
  return rows.filter((item) => item.client_id === actor.client_id)
}

function publicCredential(entry) {
  return {
    id: entry.id,
    _id: entry._id,
    client_id: entry.client_id,
    provider: entry.provider,
    label: entry.label,
    created_at: entry.created_at,
    updated_at: entry.updated_at,
  }
}

function publicLead(lead, { withActivity = false } = {}) {
  const copy = clone(lead)
  copy.business = copy.company || null
  if (!withActivity) delete copy.activity
  return copy
}

function newChallenge(email) {
  const challenge_id = `ch_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`
  db.challenges[challenge_id] = { email, attempts: 0, expires_at: Date.now() + 10 * 60 * 1000 }
  return challenge_id
}

/**
 * Imita los contratos de /api/auth y /api/agency. El secreto de la bóveda
 * no sale en las listas ni en el alta.
 */
export function mockOps(method, path, body = null, token) {
  const authToken = readToken(token)
  const { pathname, query } = routeOf(path)
  const key = `${method} ${pathname}`

  if (key === 'POST /auth/login') return login(body)
  if (key === 'POST /auth/otp/verify') return verifyOtp(body)
  if (key === 'POST /auth/otp/resend') return resendOtp(body)

  const credentialList = pathname.match(/^\/agency\/clients\/([^/]+)\/credentials$/)
  if (credentialList && method === 'GET') {
    const actor = actorFrom(authToken, ['admin', 'client'])
    if (actor.role === 'client' && actor.client_id !== credentialList[1]) fail(403, 'Acceso denegado')
    const rows = db.credentials.filter((item) => item.client_id === credentialList[1])
    return { success: true, data: rows.map(publicCredential) }
  }
  if (credentialList && method === 'POST') {
    actorFrom(authToken, ['admin', 'client'])
    return { success: true, data: createCredential(credentialList[1], body) }
  }

  const clientOne = pathname.match(/^\/agency\/clients\/([^/]+)$/)
  if (clientOne && method === 'GET') {
    const actor = actorFrom(authToken, ['admin', 'client'])
    const item = byId(db.clients, clientOne[1])
    if (!item) fail(404, 'Cliente no encontrado')
    if (actor.role === 'client' && actor.client_id !== item.id) fail(403, 'Acceso denegado')
    return { success: true, data: clone(item) }
  }

  const leadOne = pathname.match(/^\/agency\/leads\/([^/]+)$/)
  if (leadOne && method === 'GET') {
    actorFrom(authToken, ['admin'])
    const item = byId(db.leads, leadOne[1])
    if (!item) fail(404, 'Lead no encontrado')
    return { success: true, data: publicLead(item, { withActivity: true }) }
  }

  const submit = pathname.match(/^\/agency\/pieces\/([^/]+)\/submit$/)
  if (submit && method === 'POST') {
    actorFrom(authToken, ['admin'])
    return { success: true, data: submitPiece(submit[1]) }
  }

  const domingo = pathname.match(/^\/agency\/approvals\/([^/]+)\/domingo$/)
  if (domingo && method === 'POST') {
    actorFrom(authToken, ['admin'])
    return { success: true, data: decide(domingo[1], 'domingo', body) }
  }

  const clientDecision = pathname.match(/^\/agency\/approvals\/([^/]+)\/client$/)
  if (clientDecision && method === 'POST') {
    const actor = actorFrom(authToken, ['client'])
    return { success: true, data: decide(clientDecision[1], 'client', body, actor) }
  }

  const decrypt = pathname.match(/^\/agency\/credentials\/([^/]+)\/decrypt$/)
  if (decrypt && method === 'POST') {
    actorFrom(authToken, ['admin'])
    const entry = byId(db.credentials, decrypt[1])
    if (!entry) fail(404, 'Credencial no encontrada')
    const secret = db.secrets[entry.id]
    if (secret == null) fail(404, 'Credencial no encontrada')
    return { success: true, data: { id: entry.id, provider: entry.provider, label: entry.label, secret } }
  }

  const drop = pathname.match(/^\/agency\/credentials\/([^/]+)$/)
  if (drop && method === 'DELETE') {
    actorFrom(authToken, ['admin'])
    const index = db.credentials.findIndex((item) => item.id === drop[1])
    if (index < 0) fail(404, 'Credencial no encontrada')
    db.credentials.splice(index, 1)
    delete db.secrets[drop[1]]
    return { success: true }
  }

  const checkout = pathname.match(/^\/agency\/invoices\/([^/]+)\/checkout$/)
  if (checkout && method === 'POST') {
    actorFrom(authToken, ['admin'])
    return checkoutInvoice(checkout[1])
  }

  if (key === 'GET /agency/leads') {
    actorFrom(authToken, ['admin'])
    let rows = db.leads
    if (query.pipeline_status) rows = rows.filter((item) => item.pipeline_status === query.pipeline_status)
    return page(rows.map((item) => publicLead(item)), query)
  }

  if (key === 'GET /agency/clients') {
    const actor = actorFrom(authToken, ['admin', 'client'])
    const rows = actor.role === 'client' ? db.clients.filter((item) => item.id === actor.client_id) : db.clients
    return page(rows, query)
  }

  if (key === 'GET /agency/pieces') {
    const actor = actorFrom(authToken, ['admin', 'client'])
    let rows = scoped(db.pieces, actor)
    if (query.client_id) {
      if (actor.role === 'client' && query.client_id !== actor.client_id) fail(403, 'Acceso denegado')
      rows = rows.filter((item) => item.client_id === query.client_id)
    }
    if (query.status) rows = rows.filter((item) => item.status === query.status)
    return page(rows, query)
  }

  if (key === 'GET /agency/approvals') {
    const actor = actorFrom(authToken, ['admin', 'client'])
    let rows = scoped(db.approvals, actor)
    if (query.client_id) {
      if (actor.role === 'client' && query.client_id !== actor.client_id) fail(403, 'Acceso denegado')
      rows = rows.filter((item) => item.client_id === query.client_id)
    }
    if (query.status) rows = rows.filter((item) => item.status === query.status)
    return page(rows, query)
  }

  if (key === 'GET /agency/reports') {
    const actor = actorFrom(authToken, ['admin', 'client'])
    return page(scoped(db.reports, actor), query)
  }

  if (key === 'GET /agency/meetings') {
    const actor = actorFrom(authToken, ['admin', 'client'])
    const rows = scoped(db.meetings, actor).slice().sort((a, b) => String(b.starts_at || '').localeCompare(String(a.starts_at || '')))
    return page(rows, query)
  }

  if (key === 'POST /agency/meetings') {
    const actor = actorFrom(authToken, ['admin', 'client'])
    if (actor.role === 'client') fail(403, 'Acceso denegado')
    fail(400, 'El alta de reuniones no está en esta pantalla.')
  }

  if (key === 'GET /agency/invoices') {
    const actor = actorFrom(authToken, ['admin', 'client'])
    let rows = scoped(db.invoices, actor)
    if (query.status) rows = rows.filter((item) => item.status === query.status)
    return page(rows, query)
  }

  fail(404, `No encontramos ${method} ${pathname}.`)
}

function login(body) {
  const email = String(body?.email || '').trim().toLowerCase()
  const password = String(body?.password || '')
  const account = DEMO_ACCOUNTS.find((item) => item.email === email && item.password === password)
  if (!account) fail(401, 'Correo o contraseña incorrectos.')
  if (account.role === 'client') {
    const challenge_id = newChallenge(account.email)
    return { success: true, requires_otp: true, challenge_id }
  }
  return {
    success: true,
    token: signDemoToken(account),
    user: {
      id: '64b0000000000000000000ad',
      email: account.email,
      role: 'admin',
      client_id: null,
      password_change_required: false,
    },
  }
}

function verifyOtp(body) {
  const challenge = db.challenges[body?.challenge_id]
  if (!challenge) fail(401, 'Código no válido o caducado')
  if (challenge.expires_at < Date.now()) fail(401, 'Código no válido o caducado')
  challenge.attempts += 1
  const code = String(body?.code || '')
  if (!/^\d{6}$/.test(code) || code !== DEMO_MFA_CODE || challenge.attempts > 5) {
    if (challenge.attempts >= 5) delete db.challenges[body.challenge_id]
    fail(401, 'Código no válido o caducado')
  }
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

function resendOtp(body) {
  const challenge = db.challenges[body?.challenge_id]
  if (!challenge) fail(401, 'Código no válido o caducado')
  delete db.challenges[body.challenge_id]
  const challenge_id = newChallenge(challenge.email)
  return { success: true, requires_otp: true, challenge_id }
}

const PROVIDERS = ['meta_business', 'google_business', 'web', 'analytics', 'otro']

function createCredential(clientId, body) {
  if (!byId(db.clients, clientId)) fail(404, 'Cliente no encontrado')
  const keys = Object.keys(body || {})
  if (keys.some((key) => !['provider', 'label', 'secret'].includes(key))) {
    fail(400, 'Valor no permitido')
  }
  const label = String(body?.label || '').trim()
  if (!label) fail(400, 'Pon un nombre que reconozcas dentro de un año.')
  if (body?.secret == null || body.secret === '') fail(400, 'Falta la clave. No la guardamos en el navegador.')
  const provider = body.provider || 'otro'
  if (!PROVIDERS.includes(provider)) fail(400, 'Valor no permitido')
  const id = `64b0${Math.random().toString(16).slice(2, 14).padEnd(20, '0')}`.slice(0, 24)
  const entry = {
    id,
    _id: id,
    client_id: clientId,
    provider,
    label,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  db.secrets[id] = body.secret
  db.credentials.unshift(entry)
  return publicCredential(entry)
}

function decide(id, side, body, actor) {
  const item = byId(db.approvals, id)
  if (!item) fail(404, 'Aprobación no encontrada')
  const decision = body?.decision
  if (decision !== 'aprobar' && decision !== 'rechazar') fail(400, 'Valor no permitido')
  const comment = String(body?.comment || '').trim()
  if (decision === 'rechazar' && !comment) fail(400, 'El rechazo necesita un comentario')

  if (side === 'domingo') {
    if (item.status !== 'pendiente_domingo') fail(409, 'No está pendiente de Domingo')
    item.status = decision === 'aprobar' ? (item.mode === 'solo_domingo' ? 'aprobado' : 'pendiente_cliente') : 'devuelto'
    item.audit.push({
      at: new Date().toISOString(),
      actor_type: 'admin',
      action: decision === 'aprobar' ? 'aprobada_domingo' : 'rechazada_domingo',
      ...(comment ? { comment } : {}),
    })
  } else {
    if (item.client_id !== actor.client_id) fail(403, 'Acceso denegado')
    if (item.status !== 'pendiente_cliente') fail(409, 'Aún no está pendiente del cliente')
    item.status = decision === 'aprobar' ? 'aprobado' : 'devuelto'
    item.audit.push({
      at: new Date().toISOString(),
      actor_type: 'client',
      action: decision === 'aprobar' ? 'aprobada_cliente' : 'rechazada_cliente',
      ...(comment ? { comment } : {}),
    })
  }

  const piece = byId(db.pieces, item.piece_id)
  if (piece) {
    if (item.status === 'aprobado') piece.status = 'aprobado'
    else if (item.status === 'devuelto') piece.status = 'borrador'
    else piece.status = 'en_revision'
  }
  return clone(item)
}

function submitPiece(pieceId) {
  const piece = byId(db.pieces, pieceId)
  if (!piece) fail(404, 'Pieza no encontrada')
  const existing = db.approvals.find((item) => item.piece_id === pieceId)
  if (!existing) fail(409, 'La pieza ya está en un ciclo de aprobación')
  if (existing.status !== 'devuelto') fail(409, 'La pieza ya está en un ciclo de aprobación')
  existing.status = 'pendiente_domingo'
  existing.round = (existing.round || 1) + 1
  existing.audit.push({ at: new Date().toISOString(), actor_type: 'bot', action: 'reenviada', actor_label: piece.author_bot || 'bot' })
  piece.status = 'en_revision'
  return clone(existing)
}

function checkoutInvoice(id) {
  const invoice = byId(db.invoices, id)
  if (!invoice) fail(404, 'Factura no encontrada')
  if (invoice.status === 'pagada') fail(409, 'La factura ya está pagada')
  if (invoice.status === 'anulada') fail(409, 'La factura está anulada')
  if (invoice.payment_url && invoice.stripe_session_id && invoice.status === 'pendiente') {
    return { success: true, data: { url: invoice.payment_url, session_id: invoice.stripe_session_id } }
  }
  invoice.payment_url = `https://checkout.stripe.com/c/pay/cs_test_${invoice.id}`
  invoice.stripe_session_id = `cs_test_${invoice.id}`
  invoice.status = 'pendiente'
  return {
    success: true,
    data: { url: invoice.payment_url, session_id: invoice.stripe_session_id, invoice_id: invoice.id },
  }
}
