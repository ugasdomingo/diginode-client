<template>
  <div class="ops-page">
    <header class="ops-head">
      <div>
        <p class="ops-kicker">Clientes</p>
        <h1 class="ops-title">Cómo va cada cuenta</h1>
        <p class="ops-lead">Piezas, aprobaciones y facturas. Desde aquí no se edita la ficha. El enlace de Stripe sí se puede generar.</p>
      </div>
    </header>
    <MockNotice />
    <OpsState :loading="loading" :error="error" @retry="reload">
      <div class="ops-split" v-if="data">
        <div class="ops-panel" style="padding: 0">
          <table class="ops-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Piezas</th>
                <th>Pendientes</th>
                <th>Por cobrar</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in rows"
                :key="row.client.id"
                :aria-selected="selected?.client.id === row.client.id"
                @click="selectedId = row.client.id"
              >
                <td>
                  <strong>{{ row.client.company || row.client.name }}</strong>
                  <div class="ops-card__meta">{{ row.client.name }} · {{ place(row.client) }}</div>
                </td>
                <td>{{ row.piecesThisMonth }} este mes</td>
                <td>{{ row.pending }}</td>
                <td>{{ formatEur(row.openEur) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <aside class="ops-panel" v-if="selected">
          <p class="ops-kicker">{{ selected.client.service_package || selected.client.plan }}</p>
          <h2>{{ selected.client.company || selected.client.name }}</h2>
          <p class="ops-card__meta">Cliente desde {{ formatDate(selected.client.created_at) }}</p>
          <div class="ops-grid" v-if="selected.client.kpis?.length">
            <div v-for="kpi in selected.client.kpis" :key="kpi.name" class="ops-stat">
              <span>{{ kpi.name }}</span>
              <strong>{{ kpi.value }}<template v-if="kpi.unit"> {{ kpi.unit }}</template></strong>
            </div>
          </div>
          <p v-else class="ops-card__meta">Sin KPIs cargados en la ficha.</p>
          <p v-if="selected.nextMeeting">Próxima reunión: {{ formatDateTime(selected.nextMeeting) }}</p>
          <ul v-if="selected.client.strategy_links?.length" class="piece-list">
            <li v-for="link in selected.client.strategy_links" :key="link.url">
              <a v-if="href(link.url)" class="ops-link" :href="href(link.url)" target="_blank" rel="noopener noreferrer">{{ link.label }}</a>
            </li>
          </ul>
          <h3>Piezas de esta cuenta</h3>
          <ul class="piece-list">
            <li v-for="piece in selected.pieces" :key="piece.id">
              <strong>{{ piece.title || piece.type }}</strong>
              <span>{{ pieceStatusLabel(piece.status) }}</span>
            </li>
            <li v-if="!selected.pieces.length">No hay piezas registradas.</li>
          </ul>
          <h3>Facturas abiertas</h3>
          <ul class="piece-list">
            <li v-for="invoice in selected.openInvoices" :key="invoice.id">
              <strong>{{ invoice.concept }}</strong>
              <span>{{ formatEur(invoice.amount_eur) }} · {{ invoiceStatusLabel(invoice.status) }}</span>
              <AppButton
                v-if="!invoice.payment_url"
                type="button"
                variant="secondary"
                :loading="busyId === invoice.id"
                @click="checkout(invoice)"
              >Generar enlace de Stripe</AppButton>
              <span v-else>El cliente ya puede pagar desde su portal.</span>
            </li>
            <li v-if="!selected.openInvoices.length">Nada pendiente de cobro.</li>
          </ul>
        </aside>
      </div>
    </OpsState>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { invoiceStatusLabel, pieceStatusLabel } from '@/api/ops/contracts'
import { createInvoiceCheckout, listApprovals, listClients, listInvoices, listMeetings, listPieces } from '@/api/ops/client'
import { formatDate, formatDateTime, formatEur, safeHttpsUrl } from '@/api/ops/format'
import { useAsyncData } from '@/composables/useAsyncData'
import { useToastStore } from '@/stores/toast'
import AppButton from '@/components/ui/AppButton.vue'
import MockNotice from '@/components/ops/MockNotice.vue'
import OpsState from '@/components/ops/OpsState.vue'

const toast = useToastStore()
const { data, error, loading, reload } = useAsyncData(async () => {
  const [clients, pieces, approvals, invoices, meetings] = await Promise.all([
    listClients(),
    listPieces(),
    listApprovals(),
    listInvoices(),
    listMeetings(),
  ])
  return { clients, pieces, approvals, invoices, meetings }
})

const selectedId = ref('')
const busyId = ref('')

function monthKey(iso) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

const currentMonth = monthKey(new Date().toISOString())

const rows = computed(() => {
  const bundle = data.value
  if (!bundle) return []
  return bundle.clients.map((client) => {
    const pieces = bundle.pieces.filter((item) => item.client_id === client.id)
    const pending = bundle.approvals.filter(
      (item) => item.client_id === client.id && (item.status === 'pendiente_domingo' || item.status === 'pendiente_cliente')
    ).length
    const openInvoices = bundle.invoices.filter(
      (item) => item.client_id === client.id && (item.status === 'pendiente' || item.status === 'borrador')
    )
    const openEur = openInvoices.reduce((sum, item) => sum + Number(item.amount_eur || 0), 0)
    const nextMeeting = bundle.meetings
      .filter((item) => item.client_id === client.id && item.status === 'programada' && item.starts_at)
      .map((item) => item.starts_at)
      .sort()[0] || null
    return {
      client,
      pieces,
      piecesThisMonth: pieces.filter((item) => monthKey(item.updated_at || item.created_at) === currentMonth).length,
      pending,
      openInvoices,
      openEur,
      nextMeeting,
    }
  })
})

const selected = computed(() => rows.value.find((row) => row.client.id === selectedId.value) || rows.value[0] || null)

watch(rows, (list) => {
  if (!selectedId.value && list[0]) selectedId.value = list[0].client.id
})

function place(client) {
  return client.brand?.city || client.country || 'Sin zona'
}

function href(url) {
  return safeHttpsUrl(url)
}

async function checkout(invoice) {
  busyId.value = invoice.id
  try {
    await createInvoiceCheckout(invoice.id)
    toast.success('Enlace generado. El cliente lo verá en Facturas.')
    await reload()
  } catch (err) {
    toast.error(err.message)
  } finally {
    busyId.value = ''
  }
}
</script>

<style lang="scss" scoped>
h2 { font-size: $text-2xl; margin-bottom: $space-2; }
h3 { margin-top: $space-4; font-size: $text-base; }
.piece-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: $space-3;
  margin-top: $space-3;

  span { display: block; color: $text-subtle; font-size: $text-xs; }
}
</style>
