import { onMounted, ref } from 'vue'

export function useAsyncData(loader) {
  const data = ref(null)
  const error = ref('')
  const loading = ref(true)

  async function reload() {
    loading.value = true
    error.value = ''
    try {
      data.value = await loader()
    } catch (err) {
      error.value = err?.message || 'No se pudo cargar.'
      data.value = null
    } finally {
      loading.value = false
    }
  }

  onMounted(reload)
  return { data, error, loading, reload }
}
