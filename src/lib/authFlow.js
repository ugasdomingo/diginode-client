/**
 * Interpreta el login sin guardar la contraseña ni el código.
 * El paso OTP solo aparece cuando la API responde requires_otp (clientes).
 * Domingo recibe el token en el mismo paso.
 *
 * @param {{ success?: boolean, requires_otp?: boolean, challenge_id?: string, token?: string, user?: { password_change_required?: boolean } }|null|undefined} result
 * @param {string} [email] Correo que acaba de escribir la persona. La API no manda una pista.
 */
export function interpretLogin(result, email) {
  if (result?.requires_otp) {
    if (!result.challenge_id) {
      return { ok: false, message: 'No se pudo iniciar la verificación. Inténtalo de nuevo.' }
    }
    return {
      ok: true,
      step: 'otp',
      challengeId: result.challenge_id,
      hint: email || 'tu correo',
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

/**
 * El reenvío anula el código anterior y entrega otro challenge_id.
 * Hay que guardar el nuevo: el anterior ya no verifica.
 */
export function interpretOtpResend(result) {
  if (result?.success && result.challenge_id) {
    return { ok: true, challengeId: result.challenge_id }
  }
  return { ok: false, message: 'No se pudo enviar otro código.' }
}

export function normalizeCode(value) {
  return String(value ?? '').replace(/\D/g, '').slice(0, 6)
}
