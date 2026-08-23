import { ref } from 'vue'
import { useApi } from '@/composables/useApi'
import { useToastStore } from '@/stores/toast'
import { track } from '@/lib/pixel'
import { trackEvent } from '@/lib/analytics'

// Todo botón de compra del sitio pasa por aquí para que el flujo
// (evento de pixel → sesión de Stripe → redirect) sea idéntico en todas partes.
const buying = ref(false)

export function useCheckout() {
  async function buyClinica() {
    if (buying.value) return
    buying.value = true
    track('InitiateCheckout')
    trackEvent('checkout_click')
    try {
      const res = await useApi().post('/clinica/checkout')
      if (res?.url) {
        window.location.href = res.url
        return
      }
      throw new Error('No se pudo iniciar el pago')
    } catch (e) {
      useToastStore().error(e.message ?? 'No se pudo iniciar el pago. Inténtalo de nuevo.')
      buying.value = false
    }
  }

  // Formaciones puntuales (talleres). El aforo lo valida la API: si está lleno
  // responde 409 y el mensaje llega tal cual al toast.
  async function buyTraining(slug) {
    if (buying.value) return
    buying.value = true
    track('InitiateCheckout')
    trackEvent('checkout_click')
    try {
      const res = await useApi().post(`/trainings/${slug}/checkout`)
      if (res?.url) {
        window.location.href = res.url
        return
      }
      throw new Error('No se pudo iniciar el pago')
    } catch (e) {
      useToastStore().error(e.message ?? 'No se pudo iniciar el pago. Inténtalo de nuevo.')
      buying.value = false
    }
  }

  return { buying, buyClinica, buyTraining }
}
