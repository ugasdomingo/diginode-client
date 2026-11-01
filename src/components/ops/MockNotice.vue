<template>
  <p v-if="mock" class="ops-notice" role="status">
    <span>
      <strong>Datos de demostración.</strong>
      La API de operación todavía no está en main. Nada de lo que ves aquí es un cliente real.
    </span>
  </p>
</template>

<script setup>
import { opsUsesMock } from '@/api/ops/client'

const mock = opsUsesMock()
</script>
