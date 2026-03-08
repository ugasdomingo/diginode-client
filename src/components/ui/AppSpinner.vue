<template>
  <svg
    class="spinner"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    aria-label="Cargando"
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-dasharray="60"
      stroke-dashoffset="45"
    />
  </svg>
</template>

<script setup>
defineProps({
  size: { type: Number, default: 20 },
})
</script>

<style lang="scss" scoped>
.spinner {
  animation: spin 0.8s linear infinite;
  color: currentColor;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
