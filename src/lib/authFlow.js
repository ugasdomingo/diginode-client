/**
 * Interpreta el login sin guardar la contraseña ni el código.
 * El paso `mfa` solo aparece cuando la API lo pide (clientes).
 *
 * @param {import('@/api/ops/contracts').LoginResult|null|undefined} result
 */
export function interpretLogin(result) {
  if (result?.mfa_required) {
    if (!result.challenge_id) {
      return { ok: false, message: 'No se pudo iniciar la verificación. Inténtalo de nuevo.' }
    }
    return {
      ok: true,
      step: 'mfa',
      challengeId: result.challenge_id,
      hint: result.destination_hint || 'tu correo',
      expiresAt: result.expires_at || null,
    }
  }
  if (result?.token) {
    return {
      ok: true,
      step: 'session',
      token: result.token,
      passwordChangeRequired: Boolean(result.user?.password_change_required),
    }
  }
  return { ok: false, message: 'La respuesta de acceso no es válida.' }
}

export function interpretMfa(result) {
  if (result?.token) {
    return {
      ok: true,
      token: result.token,
      passwordChangeRequired: Boolean(result.user?.password_change_required),
    }
  }
  return { ok: false, message: 'El código no es válido.' }
}

export function normalizeCode(value) {
  return String(value ?? '').replace(/\D/g, '').slice(0, 6)
}
