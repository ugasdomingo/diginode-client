// Analítica propia, anónima y sin cookies.
//
// Por qué esto NO necesita banner de consentimiento:
//   - No escribe cookies, ni localStorage, ni sessionStorage. El identificador
//     de pestaña vive en una variable de este módulo y muere al cerrarla.
//   - No se envía nada que identifique a nadie: ni nombre, ni correo, ni la
//     dirección completa de procedencia (solo el dominio, y el servidor lo
//     reduce a un canal: instagram, google, directo…).
//   - Los datos no salen de nuestro servidor ni se comparten con terceros: no
//     hay seguimiento entre sitios, que es lo que exige pedir permiso.
// Si algún día se activa el Pixel de Meta, ESO sí exige banner previo.

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'

// Identificador de pestaña: aleatorio, en memoria y efímero. Solo sirve para
// casar la entrada a una página con el tiempo que se estuvo en ella.
const sessionId = Math.random().toString(36).slice(2) + Date.now().toString(36)

// Respetamos que alguien pida no ser medido, aunque la ley no nos obligue aquí.
function optedOut() {
  if (typeof navigator === 'undefined') return true
  return navigator.doNotTrack === '1' || navigator.globalPrivacyControl === true
}

// Envío en segundo plano. keepalive permite que salga aunque la pestaña se esté
// cerrando; los fallos se ignoran a propósito: medir nunca debe estorbar.
//
// El beacon va como text/plain a propósito, aunque el contenido sea JSON: es un
// tipo "simple" que no dispara comprobación previa de CORS. Con
// application/json el navegador exigiría un preflight que sendBeacon no sabe
// hacer, así que la petición se descartaría en silencio —devolviendo true— en
// cuanto la API vive en otro dominio, que es justo el caso en producción.
// El servidor acepta ambos tipos en /api/analytics.
function send(endpoint, payload) {
  if (optedOut()) return
  const url = `${BASE_URL}/analytics/${endpoint}`
  const body = JSON.stringify({ ...payload, session_id: sessionId })

  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, new Blob([body], { type: 'text/plain' }))
      return
    }
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {})
  } catch {
    // silencio deliberado
  }
}

// ── Medición de tiempo visible ──────────────────────────────────────────────
// Contamos solo el tiempo con la pestaña a la vista: si alguien la deja
// abierta de fondo toda la tarde, eso no es tiempo de lectura.
let currentPath = null
let visibleSince = null
let accumulated = 0

function stopClock() {
  if (visibleSince !== null) {
    accumulated += (Date.now() - visibleSince) / 1000
    visibleSince = null
  }
}

function startClock() {
  if (visibleSince === null) visibleSince = Date.now()
}

// Cierra la medición de la página actual y la manda.
function flush() {
  if (!currentPath) return
  stopClock()
  const seconds = Math.round(accumulated)
  if (seconds > 0) send('leave', { path: currentPath, seconds })
  accumulated = 0
}

// document.referrer descartando lo que venga de este mismo sitio.
function externalReferrer() {
  const ref = document.referrer
  if (!ref) return null
  try {
    if (new URL(ref).origin === window.location.origin) return null
  } catch {
    return null
  }
  return ref
}

// Solo se mide la web pública. El servidor descarta igualmente cualquier ruta
// privada, pero filtrar aquí evita que la navegación por el panel salga
// siquiera del navegador.
const PRIVADAS = ['/portal', '/admin', '/login', '/cambiar-contrasena']

const esPublica = (path) =>
  typeof path === 'string' && path.startsWith('/') && !PRIVADAS.some((p) => path.startsWith(p))

/** Registra la entrada a una página. Cierra la anterior si la había. */
export function trackPageview(path, { referrer } = {}) {
  if (optedOut()) return
  flush()

  if (!esPublica(path)) {
    // Salir del panel no debe arrastrar la medición de la página anterior.
    currentPath = null
    return
  }

  currentPath = path
  accumulated = 0
  visibleSince = Date.now()

  send('view', {
    path,
    // Solo procedencia externa. Una recarga deja en document.referrer nuestra
    // propia dirección, y no tiene sentido —ni conviene— enviarla: podría
    // llevar parámetros de la propia navegación.
    referrer: referrer ?? externalReferrer(),
  })
}

/** Marca un hito de conversión sobre la visita en curso. */
export function trackEvent(event) {
  if (optedOut()) return
  send('event', { path: currentPath, event })
}

/** Arranca los enganches del navegador. Se llama una vez, al iniciar la app. */
export function initAnalytics() {
  if (typeof document === 'undefined' || optedOut()) return

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      // Al ocultar la pestaña mandamos lo acumulado: en móvil, "oculta" suele
      // ser el último aviso antes de que el sistema mate la página.
      stopClock()
      const seconds = Math.round(accumulated)
      if (currentPath && seconds > 0) send('leave', { path: currentPath, seconds })
    } else {
      startClock()
    }
  })

  window.addEventListener('pagehide', flush)
}
