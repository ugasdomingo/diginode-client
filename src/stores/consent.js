import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { hasConsent, readConsent, syncVisitorCookie, writeConsent } from '@/lib/consent'

export const useConsentStore = defineStore('consent', () => {
  const record = ref(null)
  const hydrated = ref(false)
  const panelOpen = ref(false)
  const managing = ref(false)

  const blocking = computed(() => hydrated.value && panelOpen.value && !record.value)
  const visible = computed(() => hydrated.value && panelOpen.value)

  function hydrate() {
    if (hydrated.value) return
    record.value = readConsent()
    hydrated.value = true
    syncVisitorCookie()
    if (!record.value) {
      panelOpen.value = true
      managing.value = false
    }
  }

  function openPanel() {
    panelOpen.value = true
    managing.value = true
  }

  function closePanel() {
    if (!record.value) return
    panelOpen.value = false
  }

  function apply(next) {
    record.value = writeConsent(next)
    panelOpen.value = false
    managing.value = false
  }

  function acceptAll() {
    apply({ analytics: true, marketing: true, embeds: true, source: 'accept_all' })
  }

  function rejectAll() {
    apply({ analytics: false, marketing: false, embeds: false, source: 'reject_all' })
  }

  function saveCustom(flags) {
    apply({
      analytics: Boolean(flags.analytics),
      marketing: Boolean(flags.marketing),
      embeds: Boolean(flags.embeds),
      source: 'custom',
    })
  }

  /** Permite un solo servicio sin reabrir el resto de categorías. */
  function grant(category) {
    const current = record.value || { analytics: false, marketing: false, embeds: false }
    apply({
      analytics: current.analytics,
      marketing: current.marketing,
      embeds: current.embeds,
      [category]: true,
      source: 'custom',
    })
  }

  function allows(category) {
    if (category === 'necessary') return true
    return Boolean(record.value && record.value[category] === true) && hasConsent(category)
  }

  return {
    record,
    hydrated,
    panelOpen,
    managing,
    blocking,
    visible,
    hydrate,
    openPanel,
    closePanel,
    acceptAll,
    rejectAll,
    saveCustom,
    grant,
    allows,
  }
})
