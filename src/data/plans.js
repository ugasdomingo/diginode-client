import { ref } from 'vue'
import { useApi } from '@/composables/useApi'

// FALLBACK: mantener sincronizado con diginode-api/src/config/plans.js.
// Solo se usa si GET /api/plans falla (red caída / API abajo) para que la web
// nunca muestre precios vacíos. La fuente de verdad es la API.
const FALLBACK_PLANS = [
  { slug: 'clinica', name: 'Clínica Digital', monthly: 150, monthly_promo: null, promo_months: 0, setup: 0, employees_included: 3, role: 'flagship' },
]

// Module-level singleton so the list is fetched once and shared across views.
const plans = ref(FALLBACK_PLANS)
let loaded = false

export function usePlans() {
  async function load() {
    if (loaded) return
    try {
      const res = await useApi().get('/plans')
      if (res?.data?.plans?.length) plans.value = res.data.plans
      loaded = true
    } catch {
      // keep fallback
    }
  }

  const flagship = () => plans.value.find(p => p.role === 'flagship') ?? FALLBACK_PLANS[0]
  const bySlug   = (slug) => plans.value.find(p => p.slug === slug)

  return { plans, load, flagship, bySlug }
}

export { FALLBACK_PLANS }
