import { ref } from 'vue'
import { useApi } from '@/composables/useApi'
import snapshot from './services.snapshot.json'
const services = ref(snapshot.services)
const bookingUrl = ref(null)
let loaded = false
export function useServices() {
  async function load() {
    if (loaded) return
    try {
      const result = await useApi().get('/services')
      if (result?.data?.services?.length) services.value = result.data.services
      bookingUrl.value = result?.data?.booking_url ?? null
      loaded = true
    } catch {
      /* published snapshot, without unapproved prices */
    }
  }
  return { services, bookingUrl, load, privacyVersion: snapshot.privacy_version }
}
