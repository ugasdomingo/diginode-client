import { ref } from 'vue'
import { useApi } from '@/composables/useApi'

// FALLBACK: mantener sincronizado con diginode-api/src/config/trainings.js.
// Solo se usa si GET /api/trainings/:slug falla (red caída / API abajo) para que
// la landing nunca aparezca vacía. La fuente de verdad es la API — y las plazas
// restantes SIEMPRE vienen de ella, nunca de aquí.
const FALLBACK_TRAINING = {
  slug:     'ia-para-terapeutas',
  name:     'IA para Terapeutas',
  tagline:  'Libera tu tiempo. Transforma tu consulta.',
  audience: 'Para terapeutas saturados o en crecimiento',
  price:    100,
  currency: 'EUR',
  tools_cost_note:
    'Durante el taller usaremos herramientas de IA que contratas con tu propia cuenta (unos 25€). Te explico cómo hacerlo el mismo día.',
  format:   'online',
  platform: 'Google Meet',
  date:     '2026-10-03',
  time:     null,
  duration: null,
  timezone: 'Europe/Madrid',
  capacity: 10,
  seats_taken: 0,
  seats_left:  null,   // null = desconocido: la landing no promete un número que no ha verificado
  sold_out:    false,
  status:      'open',
  benefits: [
    { title: 'Recupera tu vida personal y salud', text: 'Eliminamos las tareas repetitivas y administrativas que te roban las tardes.' },
    { title: 'Lánzate o vive al 100% de tu negocio', text: 'Automatizamos tu marketing y tu gestión para que la consulta no dependa de tu tiempo libre.' },
    { title: 'Crea y gestiona tu sistema con «Empleados IA»', text: 'No necesitas criterio profesional para todo: aprendes a delegar lo que no requiere tu juicio clínico.' },
  ],
  includes: [],
  requirements: [],
  faq: [],
}

export function useTraining(slug = 'ia-para-terapeutas') {
  const training = ref(FALLBACK_TRAINING)
  const loading  = ref(true)
  const failed   = ref(false)

  async function load() {
    loading.value = true
    try {
      const res = await useApi().get(`/trainings/${slug}`)
      if (res?.data?.training) training.value = res.data.training
    } catch {
      failed.value = true   // se mantiene el fallback
    } finally {
      loading.value = false
    }
  }

  return { training, loading, failed, load }
}

export { FALLBACK_TRAINING }
