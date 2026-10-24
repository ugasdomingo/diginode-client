import { ref } from 'vue'
import { useApi } from '@/composables/useApi'
import { trackEvent } from '@/lib/analytics'

// Shared for the SPA session. Conversation text is never persisted in the browser.
const messages = ref([]),
  sending = ref(false),
  capped = ref(false),
  error = ref(''),
  pending = ref(null),
  confirming = ref(false)
let memoryId
function contactId() {
  if (memoryId) return memoryId
  try {
    const saved = localStorage.getItem('dn_demo_contact')
    if (/^demo-[a-zA-Z0-9-]{8,100}$/.test(saved || '')) memoryId = saved
  } catch {
    /* browser may deny storage */
  }
  memoryId ||= `demo-${crypto.randomUUID()}`
  try {
    localStorage.setItem('dn_demo_contact', memoryId)
  } catch {
    /* in-memory identity */
  }
  return memoryId
}
const time = () => new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
export function allowedAction(action) {
  const paths = ['/#contacto', '/clinica-digital#contacto', '/webs-y-aplicaciones#contacto']
  if (action?.type === 'contact' && paths.includes(action.href)) return true
  try {
    const url = new URL(action?.href)
    return action?.type === 'booking' && url.protocol === 'https:' && url.hostname === 'cal.com'
  } catch {
    return false
  }
}
export function useNoraDemo() {
  async function send(text, context) {
    if (!text.trim() || sending.value || capped.value) return
    error.value = ''
    if (!messages.value.some((message) => message.from === 'me')) trackEvent('demo_start')
    messages.value.push({ from: 'me', text, time: time() })
    sending.value = true
    try {
      const result = await useApi().post('/demo/message', {
        contact_id: contactId(),
        message: text,
        context,
        supports_confirmation: true,
      })
      messages.value.push({
        from: 'nora',
        text: result.reply,
        time: time(),
        actions: (result.actions || []).filter(allowedAction),
      })
      capped.value = result.capped === true
      if (result.pending_action) pending.value = result.pending_action
    } catch (err) {
      error.value =
        err instanceof TypeError
          ? 'No se pudo conectar con Nora. Puedes usar el formulario.'
          : err.message || 'Nora no está disponible. Puedes usar el formulario.'
    } finally {
      sending.value = false
    }
  }
  async function confirmEmail() {
    if (confirming.value || !pending.value) return
    confirming.value = true
    error.value = ''
    try {
      const result = await useApi().post('/demo/confirm-email', {
        contact_id: contactId(),
        action_id: pending.value.id,
      })
      messages.value.push({ from: 'nora', text: result.message, time: time() })
      if (result.status === 'sent') pending.value = null
    } catch (err) {
      error.value = err.message || 'No se pudo confirmar el correo.'
    } finally {
      confirming.value = false
    }
  }
  return { messages, sending, capped, error, pending, confirming, send, confirmEmail }
}
