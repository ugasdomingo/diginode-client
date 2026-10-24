<template>
  <div ref="container" class="lazy-nora">
    <NoraDemo v-if="ready" :context="context" />
    <div v-else class="lazy-nora__placeholder">
      <p>Conoce a Nora, la asistente con IA de Diginode.</p>
      <button type="button" class="commercial-button" @click="ready = true">
        Abrir demo de Nora
      </button>
    </div>
  </div>
</template>
<script setup>
import { defineAsyncComponent, onMounted, onUnmounted, ref } from 'vue'
defineProps({ context: { type: String, default: 'clinic' } })
const NoraDemo = defineAsyncComponent(() => import('@/components/ui/NoraDemo.vue'))
const ready = ref(false),
  container = ref(null)
let observer
onMounted(() => {
  if (!('IntersectionObserver' in window)) return
  observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        ready.value = true
        observer.disconnect()
      }
    },
    { rootMargin: '240px' }
  )
  observer.observe(container.value)
})
onUnmounted(() => observer?.disconnect())
</script>
<style scoped>
.lazy-nora {
  min-width: 0;
  min-height: 570px;
}
.lazy-nora__placeholder {
  display: grid;
  gap: 2rem;
  place-content: center;
  min-height: 500px;
  border: 1px solid #29476a;
  border-radius: 20px;
  padding: 2rem;
}
</style>
