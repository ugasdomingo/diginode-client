<template>
  <div class="ops-page">
    <header class="ops-head">
      <div>
        <p class="ops-kicker">Informes</p>
        <h1 class="ops-title">El mes, en un documento</h1>
        <p class="ops-lead">Cada informe abre el documento de Drive o Docs. No hace falta otra contraseña de Diginode.</p>
      </div>
    </header>
    <OpsState :loading="loading" :error="error" @retry="reload">
      <p v-if="data && !data.length" class="ops-state">Todavía no hay un informe.</p>
      <article v-for="report in data" :key="report.id" class="ops-panel ops-rise">
        <p class="ops-kicker">{{ periodLabel(report.period) }} · {{ report.status === 'enviado' ? 'Enviado' : 'Borrador' }}</p>
        <h2>{{ report.title || periodLabel(report.period) }}</h2>
        <a v-if="href(report)" class="ops-link" :href="href(report)" target="_blank" rel="noopener noreferrer">
          Abrir el documento
        </a>
        <p v-else class="ops-card__meta">Todavía no hay un enlace al documento.</p>
        <p class="ops-card__meta">{{ formatDate(report.created_at) }}</p>
      </article>
    </OpsState>
  </div>
</template>

<script setup>
import { listReports } from '@/api/ops/client'
import { formatDate, periodLabel, safeHttpsUrl } from '@/api/ops/format'
import { useAsyncData } from '@/composables/useAsyncData'
import OpsState from '@/components/ops/OpsState.vue'

const { data, error, loading, reload } = useAsyncData(listReports)
function href(report) {
  return safeHttpsUrl(report.drive_url)
}
</script>

<style lang="scss" scoped>
.ops-panel { display: flex; flex-direction: column; gap: $space-2; }
h2 { font-size: $text-2xl; }
</style>
