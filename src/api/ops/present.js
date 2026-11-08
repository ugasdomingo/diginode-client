import { pieceTypeLabel } from './contracts.js'

/**
 * La cola de aprobaciones no trae el título ni el enlace: viven en la pieza.
 * Esta función junta las tres lecturas para la tarjeta.
 */
export function presentApproval(approval, piece, client) {
  const audit = Array.isArray(approval?.audit) ? approval.audit : []
  const rejection = [...audit].reverse().find((entry) => entry?.comment && String(entry.action || '').includes('rechaz'))
  const versions = Array.isArray(piece?.versions) ? piece.versions : []
  const note = versions.length ? versions[versions.length - 1]?.note || '' : ''
  const company = client?.company || client?.brand?.name || client?.name || ''

  return {
    id: approval.id,
    piece_id: approval.piece_id ? String(approval.piece_id) : '',
    client_id: approval.client_id ? String(approval.client_id) : '',
    company: company || (approval.lead_id ? 'Prospecto' : 'Cliente'),
    channel: pieceTypeLabel(piece?.type) || 'Pieza',
    version: piece?.version || approval.round || 1,
    title: piece?.title || 'Pieza sin título',
    needs_reapproval: approval.status === 'pendiente_domingo' && Number(approval.round) > 1,
    preview_text: note,
    rejection_comment: rejection?.comment || '',
    preview_url: piece?.drive_url || '',
    status: approval.status,
    mode: approval.mode || '',
    round: approval.round || 1,
  }
}
