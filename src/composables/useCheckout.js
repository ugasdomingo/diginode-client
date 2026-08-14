import { ref } from 'vue'
import { useApi } from '@/composables/useApi'
import { useToastStore } from '@/stores/toast'
import { track } from '@/lib/pixel'

// Single-product checkout: every "Comprar Clínica Digital" button on the site
// goes through here so the flow (pixel event → Stripe session → redirect) stays
// identical everywhere.
const buying = ref(false)

export function useCheckout() {
  async function buyClinica() {
    if (buying.value) return
    buying.value = true
    track('InitiateCheckout')
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

  return { buying, buyClinica }
}
