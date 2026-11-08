/**
 * Rutas reales de diginode-api (rama de agencia), relativas a VITE_API_URL,
 * que ya incluye `/api`. El panel las llama tal cual. Los datos de ejemplo
 * solo entran si VITE_OPS_USE_MOCK=true.
 *
 * Cuerpo habitual: { success, data?, total?, message?, token? }
 */

/** @typedef {'nuevo'|'analizado'|'pieza_lista'|'pendiente_de_aprobacion'|'contactado'|'respondio'|'reunion_visita'|'ganado'|'perdido'} PipelineStatus */
/** @typedef {'mensaje_enviado'|'pieza_enviada'|'respuesta'|'nota'|'siguiente_accion'} ActivityType */
/** @typedef {'pendiente_domingo'|'pendiente_cliente'|'aprobado'|'devuelto'} ApprovalStatus */
/** @typedef {'meta_business'|'google_business'|'web'|'analytics'|'otro'} CredentialProvider */
/** @typedef {'borrador'|'pendiente'|'pagada'|'anulada'|'revision'} InvoiceStatus */
/** @typedef {'programada'|'hecha'|'cancelada'} MeetingStatus */

export const LEAD_PIPELINE = [
  { id: 'nuevo', label: 'Nuevo', hint: 'Acaba de entrar' },
  { id: 'analizado', label: 'Analizado', hint: 'Ya sabemos qué necesita' },
  { id: 'pieza_lista', label: 'Pieza lista', hint: 'Hay una muestra preparada' },
  { id: 'pendiente_de_aprobacion', label: 'Pendiente de aprobación', hint: 'Esperando el visto bueno' },
  { id: 'contactado', label: 'Contactado', hint: 'Ya le hemos escrito' },
  { id: 'respondio', label: 'Respondió', hint: 'Hay que seguir la conversación' },
  { id: 'reunion_visita', label: 'Reunión o visita', hint: 'Toca hablar o pasarse' },
  { id: 'ganado', label: 'Ganado', hint: 'Pasa a ser cliente' },
  { id: 'perdido', label: 'Perdido', hint: 'No sigue por ahora' },
]

export const ACTIVITY_LABELS = {
  mensaje_enviado: 'Mensaje enviado',
  pieza_enviada: 'Pieza enviada',
  respuesta: 'Respuesta',
  nota: 'Nota',
  siguiente_accion: 'Siguiente acción',
}

export const SERVICE_LABELS = {
  brand_management: 'Gestión de marca',
  web_project: 'Web',
  digital_clinic: 'Clínica digital',
  undecided: 'Sin decidir',
}

export const PIECE_TYPE_LABELS = {
  post: 'Post',
  reel: 'Reel',
  story: 'Historia',
  carrusel: 'Carrusel',
  email: 'Correo',
  web: 'Web',
  anuncio: 'Anuncio',
  informe: 'Informe',
  otro: 'Pieza',
}

export const PIECE_STATUS_LABELS = {
  borrador: 'Borrador',
  en_revision: 'En revisión',
  aprobado: 'Aprobada',
  publicado: 'Publicada',
  archivado: 'Archivada',
}

export const APPROVAL_STATUS_LABELS = {
  pendiente_domingo: 'Pendiente de Domingo',
  pendiente_cliente: 'Pendiente del cliente',
  aprobado: 'Aprobada',
  devuelto: 'Devuelta',
}

export const INVOICE_STATUS_LABELS = {
  borrador: 'Borrador',
  pendiente: 'Pendiente',
  pagada: 'Pagada',
  anulada: 'Anulada',
  revision: 'En revisión',
}

export const MEETING_STATUS_LABELS = {
  programada: 'Confirmada',
  hecha: 'Hecha',
  cancelada: 'Cancelada',
}

export const CREDENTIAL_PROVIDERS = [
  { id: 'meta_business', label: 'Meta (Instagram y Facebook)' },
  { id: 'google_business', label: 'Ficha de Google' },
  { id: 'web', label: 'Web, dominio o correo' },
  { id: 'analytics', label: 'Analítica' },
  { id: 'otro', label: 'Otro acceso' },
]

/** Rutas que esta web llama, bajo el prefijo de VITE_API_URL. */
export const OPS_ROUTES = [
  { method: 'POST', path: '/auth/login', auth: false, note: 'Domingo recibe token. Un cliente recibe requires_otp y challenge_id, sin token.' },
  { method: 'POST', path: '/auth/otp/verify', auth: false, note: 'Canjea challenge_id y el código de 6 dígitos por un JWT.' },
  { method: 'POST', path: '/auth/otp/resend', auth: false, note: 'Anula el código anterior y devuelve un challenge_id nuevo.' },
  { method: 'GET', path: '/agency/leads', auth: 'admin', note: 'Pipeline. El estado de agencia es pipeline_status. La lista no trae activity.' },
  { method: 'GET', path: '/agency/leads/:id', auth: 'admin', note: 'Ficha con activity, next_action y next_action_at.' },
  { method: 'GET', path: '/agency/clients', auth: 'admin', note: 'Fichas. El cliente autenticado solo se ve a sí mismo.' },
  { method: 'GET', path: '/agency/pieces', auth: 'admin', note: 'Piezas. El cliente solo lee las suyas. El enlace es drive_url.' },
  { method: 'GET', path: '/agency/approvals', auth: 'admin', note: 'Cola. status: pendiente_domingo, pendiente_cliente, aprobado, devuelto.' },
  { method: 'POST', path: '/agency/approvals/:id/domingo', auth: 'admin', note: '{ decision: aprobar | rechazar, comment }. El rechazo exige comentario.' },
  { method: 'POST', path: '/agency/approvals/:id/client', auth: 'client', note: 'Igual, solo si status es pendiente_cliente.' },
  { method: 'GET', path: '/agency/clients/:id/credentials', auth: 'admin', note: 'Metadatos: id, client_id, provider, label, fechas. Nunca el secreto.' },
  { method: 'POST', path: '/agency/clients/:id/credentials', auth: 'admin', note: '{ provider, label, secret }. secret es texto o un objeto. No se devuelve.' },
  { method: 'DELETE', path: '/agency/credentials/:id', auth: 'admin', note: 'Borra el acceso. No hay actualización: se borra y se crea otro.' },
  { method: 'POST', path: '/agency/credentials/:id/decrypt', auth: 'admin', note: 'Descifra. Cada lectura queda auditada. Solo Domingo.' },
  { method: 'GET', path: '/agency/reports', auth: 'client', note: 'period YYYY-MM, title, drive_url, status borrador | enviado.' },
  { method: 'GET', path: '/agency/meetings', auth: 'client', note: 'El cliente solo lee. status: programada, hecha, cancelada. El lugar es location.' },
  { method: 'GET', path: '/agency/invoices', auth: 'client', note: 'amount_eur, concept, status, payment_url. El cliente no crea el cobro.' },
  { method: 'POST', path: '/agency/invoices/:id/checkout', auth: 'admin', note: 'Domingo o un bot genera el enlace. La respuesta trae url y se guarda en payment_url.' },
]

export function pipelineLabel(status) {
  return LEAD_PIPELINE.find((item) => item.id === status)?.label ?? status
}

export function activityLabel(type) {
  return ACTIVITY_LABELS[type] ?? type
}

export function providerLabel(provider) {
  return CREDENTIAL_PROVIDERS.find((item) => item.id === provider)?.label ?? provider
}

export function serviceLabel(interest) {
  return SERVICE_LABELS[interest] ?? ''
}

export function pieceTypeLabel(type) {
  return PIECE_TYPE_LABELS[type] ?? type
}

export function pieceStatusLabel(status) {
  return PIECE_STATUS_LABELS[status] ?? status
}

export function approvalStatusLabel(status) {
  return APPROVAL_STATUS_LABELS[status] ?? status
}

export function invoiceStatusLabel(status) {
  return INVOICE_STATUS_LABELS[status] ?? status
}

export function meetingStatusLabel(status) {
  return MEETING_STATUS_LABELS[status] ?? status
}
