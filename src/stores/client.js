import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useApi } from '@/composables/useApi'

/**
 * Stores all portal data for the logged-in client.
 * Loaded once after login (or lazily on first portal visit).
 * All portal views read from here — zero extra API calls.
 */
export const useClientStore = defineStore('client', () => {
  const _data   = ref(null)
  const loading = ref(false)
  const loaded  = ref(false)
  const error   = ref(null)

  // ── Derived state ─────────────────────────────────────────────────────────
  const client       = computed(() => _data.value?.client       ?? null)
  const purchases    = computed(() => _data.value?.purchases    ?? [])
  const subscription = computed(() => _data.value?.subscription ?? null)
  const upcoming     = computed(() => _data.value?.upcoming     ?? [])
  const openTickets  = computed(() => _data.value?.open_tickets ?? 0)
  const office       = computed(() => _data.value?.client?.office ?? null)

  // ── Actions ───────────────────────────────────────────────────────────────

  /** Fetches /api/portal/me. Idempotent: skips if already loaded. */
  async function load(force = false) {
    if (loaded.value && !force) return
    loading.value = true
    error.value   = null
    try {
      const api = useApi()
      const res = await api.get('/portal/me')
      _data.value  = res.data
      loaded.value = true
    } catch (err) {
      error.value = err.message ?? 'Error al cargar el portal'
      throw err
    } finally {
      loading.value = false
    }
  }

  /** Resets all state — call on logout. */
  function clear() {
    _data.value   = null
    loaded.value  = false
    loading.value = false
    error.value   = null
  }

  return {
    loading,
    loaded,
    error,
    client,
    purchases,
    subscription,
    upcoming,
    openTickets,
    office,
    load,
    clear,
  }
})
