<template>
  <div v-if="loading" class="ops-state" role="status">Cargando…</div>
  <div v-else-if="error" class="ops-state ops-state--error" role="alert">
    <p>{{ error }}</p>
    <button type="button" @click="$emit('retry')">Reintentar</button>
  </div>
  <slot v-else />
</template>

<script setup>
defineProps({
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
})
defineEmits(['retry'])
</script>
