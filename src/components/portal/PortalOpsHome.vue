<template>
  <section class="ops-page">
    <MockNotice />
    <OpsState :loading="loading" :error="error" @retry="reload">
      <div v-if="data" class="ops-grid">
        <RouterLink class="ops-card" to="/portal/piezas">
          <span class="ops-card__meta">Por aprobar</span>
          <strong class="ops-card__title">{{ pending.length }}</strong>
          <span>{{ pending.length === 1 ? 'pieza te está esperando' : 'piezas te están esperando' }}</span>
        </RouterLink>
        <RouterLink class="ops-card" to="/portal/informes">
          <span class="ops-card__meta">Último informe</span>
          <strong class="ops-card__title">{{ latestReport }}</strong>
          <span>Se abre en un documento de Google</span>
        </RouterLink>
        <RouterLink class="ops-card" to="/portal/reuniones">
          <span class="ops-card__meta">Próxima reunión</span>
          <strong class="ops-card__title">{{ nextMeeting }}</strong>
          <span>La confirma Domingo</span>
        </RouterLink>
        <RouterLink class="ops-card" to="/portal/facturas">
          <span class="ops-card__meta">Por pagar</span>
          <strong class="ops-card__title">{{ openAmount }}</strong>
          <span>Pago con Stripe</span>
        </RouterLink>
      </div>
      <article v-for="piece in pending.slice(0, 2)" :key="piece.id" class="ops-panel">
        <p class="ops-kicker">{{ piece.channel }}</p>
        <h2>{{ piece.title }}</h2>
        <p>{{ piece.preview_text }}</p>
        <RouterLink class="ops-link" to="/portal/piezas">Revisar esta pieza</RouterLink>
      </article>
    </OpsState>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { listInvoices, listMeetings, listPortalApprovals, listReports } from '@/api/ops/client'
import { formatDateTime, formatEur, periodLabel } from '@/api/ops/format'
import { useAsyncData } from '@/composables/useAsyncData'
import MockNotice from '@/components/ops/MockNotice.vue'
import OpsState from '@/components/ops/OpsState.vue'

const { data, error, loading, reload } = useAsyncData(async () => {
  const [deliverables, reports, meetings, invoices] = await Promise.all([
    listPortalApprovals(),
    listReports(),
    listMeetings(),
    listInvoices(),
  ])
  return { deliverables, reports, meetings, invoices }
})

const pending = computed(() =>
  (data.value?.deliverables || []).filter((item) => item.status === 'pendiente_cliente')
)
const latestReport = computed(() => {
  const report = (data.value?.reports || []).find((item) => item.status === 'enviado') || data.value?.reports?.[0]
  return report ? periodLabel(report.period) : 'Aún no hay'
})
const nextMeeting = computed(() => {
  const upcoming = (data.value?.meetings || [])
    .filter((item) => item.status === 'programada' && item.starts_at)
    .slice()
    .sort((a, b) => String(a.starts_at).localeCompare(String(b.starts_at)))[0]
  return upcoming ? formatDateTime(upcoming.starts_at) : 'Sin fecha'
})
const openAmount = computed(() => {
  const amount = (data.value?.invoices || [])
    .filter((item) => item.status === 'pendiente')
    .reduce((sum, item) => sum + Number(item.amount_eur || 0), 0)
  return formatEur(amount)
})
</script>

<style lang="scss" scoped>
h2 { font-size: $text-xl; margin-bottom: $space-2; }
.ops-card span:last-child { color: $text-muted; font-size: $text-sm; }
</style>
