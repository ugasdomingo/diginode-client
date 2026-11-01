<template>
  <div class="ops-page">
    <header class="ops-head">
      <div>
        <p class="ops-kicker">Informes</p>
        <h1 class="ops-title">El mes, en un documento</h1>
        <p class="ops-lead">Cada informe abre un Google Doc. No hace falta otra contraseña de Diginode.</p>
      </div>
    </header>
    <OpsState :loading="loading" :error="error" @retry="reload">
      <p v-if="data && !data.length" class="ops-state">Todavía no hay un informe publicado.</p>
      <article v-for="report in data" :key="report.id" class="ops-panel ops-rise">
        <p class="ops-kicker">{{ report.period_label }}</p>
        <h2>{{ report.title }}</h2>
        <p>{{ report.summary }}</p>
        <a v-if="href(report)" class="ops-link" :href="href(report)" target="_blank" rel="noopener noreferrer">
          Abrir el documento
        </a>
        <p v-else class="ops-card__meta">El enlace del documento no es válido.</p>
        <p class="ops-card__meta">Publicado el {{ formatDate(report.published_at) }}</p>
      </article>
    </OpsState>
  </div>
</template>

<script setup>
import { listReports } from '@/api/ops/client'
import { formatDate, safeHttpsUrl } from '@/api/ops/format'
import { useAsyncData } from '@/composables/useAsyncData'
import OpsState from '@/components/ops/OpsState.vue'

const { data, error, loading, reload } = useAsyncData(listReports)
function href(report) {
  return safeHttpsUrl(report.google_doc_url)
}
</script>

<style lang="scss" scoped>
.ops-panel { display: flex; flex-direction: column; gap: $space-2; }
h2 { font-size: $text-2xl; }
</style>
