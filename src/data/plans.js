import { ref } from 'vue'
import { useApi } from '@/composables/useApi'

// FALLBACK: mantener sincronizado con diginode-api/src/config/plans.js.
// Solo se usa si GET /api/plans falla (red caída / API abajo) para que la web
// nunca muestre precios vacíos. La fuente de verdad es la API.
const FALLBACK_PLANS = [
  { slug: 'entrepreneur', name: 'Plan Entrepreneur', monthly: 300, monthly_promo: null, promo_months: 0, setup: 0, employees_included: 2, role: 'flagship' },
  { slug: 'clinica',      name: 'Clínica',           monthly: 500, monthly_promo: null, promo_months: 0, setup: 550, employees_included: null, role: 'upsell' },
  { slug: 'individual',   name: 'Empleado Individual', monthly: 180, monthly_promo: null, promo_months: 0, setup: 200, employees_included: null, role: 'downsell' },
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
