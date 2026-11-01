/**
 * Contratos de la API de operación (leads, clientes, piezas, bóveda, portal).
 *
 * En main de diginode-api estos endpoints todavía no existen. El cliente
 * aislado de `src/api/ops/client.js` los llama solo si VITE_OPS_USE_MOCK=false.
 * Mientras tanto responde `src/api/ops/mock.js`.
 *
 * Cuerpo habitual: { success: boolean, data?: T, message?: string }
 * El login mantiene la forma actual de POST /auth/login y puede pedir 2FA.
 */

/** @typedef {'nuevo'|'mensaje_enviado'|'con_respuesta'|'llamada_visita'|'pieza_enviada'|'cliente'|'perdido'} LeadStatus */
/** @typedef {'message_sent'|'piece_sent'|'reply'|'next_action'} TimelineType */
/** @typedef {'call'|'visit'} NextActionType */
/** @typedef {'domingo'|'client'} ApprovalStage */
/** @typedef {'pending'|'approved'|'rejected'} ApprovalStatus */
/** @typedef {'instagram'|'facebook'|'google_business'|'dominio'|'hosting'|'email'|'bot_api_key'|'otro'} VaultKind */
/** @typedef {'open'|'paid'|'void'|'draft'} InvoiceStatus */

/**
 * @typedef {Object} TimelineEvent
 * @property {string} id
 * @property {TimelineType} type
 * @property {string} at ISO-8601
 * @property {string} title
 * @property {string} detail
 * @property {NextActionType|null} [action]
 */

/**
 * @typedef {Object} NextAction
 * @property {NextActionType} type
 * @property {string} label
 * @property {string} at
 */

/**
 * @typedef {Object} OpsLead
 * @property {string} id
 * @property {string} name
 * @property {string} company
 * @property {string} email
 * @property {string} phone
 * @property {string} neighborhood
 * @property {LeadStatus} status
 * @property {string} need
 * @property {NextAction|null} next_action
 * @property {TimelineEvent[]} timeline
 * @property {string} updated_at
 */

/**
 * @typedef {Object} ClientKpis
 * @property {number} pieces_this_month
 * @property {number} approved
 * @property {number} pending
 * @property {number} avg_approval_days
 * @property {number} open_invoices_cents
 * @property {string|null} next_meeting_at
 * @property {number} messages_sent
 * @property {number} replies
 */

/**
 * @typedef {Object} OpsClient
 * @property {string} id
 * @property {string} name
 * @property {string} company
 * @property {string} email
 * @property {string} neighborhood
 * @property {string} plan_label
 * @property {string} since
 * @property {ClientKpis} kpis
 */

/**
 * @typedef {Object} OpsApproval
 * @property {string} id
 * @property {string} client_id
 * @property {string} client_name
 * @property {string} company
 * @property {string} title
 * @property {string} channel
 * @property {string} preview_text
 * @property {string} preview_url
 * @property {ApprovalStage} stage
 * @property {ApprovalStatus} status
 * @property {boolean} needs_reapproval
 * @property {string} rejection_comment
 * @property {number} version
 * @property {string} submitted_at
 */

/**
 * @typedef {Object} VaultInput
 * @property {string} client_id
 * @property {string} label
 * @property {VaultKind} kind
 * @property {string} [username]
 * @property {string} [secret] Se envía al servidor y no debe persistirse en el navegador.
 * @property {string} [url]
 * @property {string} [notes]
 */

/**
 * @typedef {Object} VaultMeta
 * @property {string} id
 * @property {string} client_id
 * @property {string} label
 * @property {VaultKind} kind
 * @property {string} username
 * @property {string} url
 * @property {string} notes
 * @property {boolean} has_secret
 * @property {string} updated_at
 */

/**
 * @typedef {Object} OpsReport
 * @property {string} id
 * @property {string} client_id
 * @property {string} period_label
 * @property {string} title
 * @property {string} summary
 * @property {string} google_doc_url
 * @property {string} published_at
 */

/**
 * @typedef {Object} OpsMeeting
 * @property {string} id
 * @property {string} client_id
 * @property {string} title
 * @property {string} starts_at
 * @property {string} place
 * @property {'scheduled'|'requested'} status
 * @property {string} notes
 */

/**
 * @typedef {Object} MeetingRequest
 * @property {string} preferred_at
 * @property {'llamada'|'visita'|'videollamada'} channel
 * @property {string} [note]
 */

/**
 * @typedef {Object} OpsInvoice
 * @property {string} id
 * @property {string} client_id
 * @property {string} number
 * @property {string} concept
 * @property {number} amount_cents
 * @property {'eur'} currency
 * @property {InvoiceStatus} status
 * @property {string} issued_at
 * @property {string|null} due_at
 */

/**
 * @typedef {Object} LoginResult
 * @property {boolean} success
 * @property {boolean} [mfa_required]
 * @property {string} [challenge_id]
 * @property {string} [expires_at]
 * @property {string} [destination_hint]
 * @property {string} [token]
 * @property {{ id?: string, email?: string, role?: string, client_id?: string|null, password_change_required?: boolean }} [user]
 */

export const LEAD_PIPELINE = [
  { id: 'nuevo', label: 'Nuevo', hint: 'Todavía no hemos escrito' },
  { id: 'mensaje_enviado', label: 'Mensaje enviado', hint: 'Esperando respuesta' },
  { id: 'con_respuesta', label: 'Con respuesta', hint: 'Hay que seguir la conversación' },
  { id: 'llamada_visita', label: 'Llamada o visita', hint: 'El siguiente paso es hablar o pasarse' },
  { id: 'pieza_enviada', label: 'Pieza enviada', hint: 'Propuesta o muestra fuera' },
  { id: 'cliente', label: 'Cliente', hint: 'Ya trabaja con Diginode' },
  { id: 'perdido', label: 'Perdido', hint: 'No sigue por ahora' },
]

export const VAULT_KINDS = [
  { id: 'instagram', label: 'Instagram' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'google_business', label: 'Ficha de Google' },
  { id: 'dominio', label: 'Dominio' },
  { id: 'hosting', label: 'Alojamiento' },
  { id: 'email', label: 'Correo' },
  { id: 'bot_api_key', label: 'Clave de bot' },
  { id: 'otro', label: 'Otro acceso' },
]

/** Rutas que el otro servicio debe exponer bajo el prefijo /api. */
export const OPS_ROUTES = [
  { method: 'POST', path: '/auth/login', auth: false, note: 'Existente. Si el usuario es cliente, responde mfa_required y no entrega token.' },
  { method: 'POST', path: '/auth/mfa/verify', auth: false, note: 'Canjea challenge_id y el código de 6 dígitos por un JWT.' },
  { method: 'POST', path: '/auth/mfa/resend', auth: false, note: 'Reenvía el código del mismo challenge.' },
  { method: 'GET', path: '/admin/ops/leads', auth: 'admin', note: 'Pipeline de leads. Solo lectura.' },
  { method: 'GET', path: '/admin/ops/leads/:id', auth: 'admin', note: 'Ficha con cronología: mensajes, piezas, respuestas y siguiente acción.' },
  { method: 'GET', path: '/admin/ops/clients', auth: 'admin', note: 'Clientes con KPIs. Solo lectura.' },
  { method: 'GET', path: '/admin/ops/clients/:id', auth: 'admin', note: 'Ficha de cliente.' },
  { method: 'GET', path: '/admin/ops/approvals', auth: 'admin', note: 'Piezas pendientes de Domingo, incluidas las que el cliente devolvió.' },
  { method: 'POST', path: '/admin/ops/approvals/:id/approve', auth: 'admin', note: 'Pasan a la bandeja del cliente.' },
  { method: 'POST', path: '/admin/ops/approvals/:id/reject', auth: 'admin', note: 'No llegan al cliente. comment es opcional.' },
  { method: 'GET', path: '/admin/ops/vault', auth: 'admin', note: 'Metadatos de la bóveda. Nunca incluye el secreto.' },
  { method: 'POST', path: '/admin/ops/vault', auth: 'admin', note: 'Alta. El secreto viaja en el cuerpo y la respuesta lo omite.' },
  { method: 'PATCH', path: '/admin/ops/vault/:id', auth: 'admin', note: 'Actualización. secret es opcional y no se devuelve.' },
  { method: 'GET', path: '/portal/ops/deliverables', auth: 'client', note: 'Piezas que esperan la aprobación de ese cliente.' },
  { method: 'POST', path: '/portal/ops/deliverables/:id/approve', auth: 'client', note: 'El cliente aprueba la pieza.' },
  { method: 'POST', path: '/portal/ops/deliverables/:id/reject', auth: 'client', note: 'Rechazo con comment. Vuelve al bot y Domingo tiene que reaprobar.' },
  { method: 'GET', path: '/portal/ops/reports', auth: 'client', note: 'Informes mensuales. google_doc_url abre el documento.' },
  { method: 'GET', path: '/portal/ops/meetings', auth: 'client', note: 'Reuniones próximas y solicitudes.' },
  { method: 'POST', path: '/portal/ops/meetings', auth: 'client', note: 'Pide una llamada, visita o videollamada.' },
  { method: 'GET', path: '/portal/ops/invoices', auth: 'client', note: 'Facturas del cliente.' },
  { method: 'POST', path: '/portal/ops/invoices/:id/checkout', auth: 'client', note: 'Devuelve checkout_url de Stripe Checkout (https://checkout.stripe.com/...).' },
]

export function pipelineLabel(status) {
  return LEAD_PIPELINE.find((item) => item.id === status)?.label ?? status
}

export function vaultKindLabel(kind) {
  return VAULT_KINDS.find((item) => item.id === kind)?.label ?? kind
}
