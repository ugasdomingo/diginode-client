<template>
  <div class="ops-page">
    <header class="ops-head">
      <div>
        <p class="ops-kicker">Clientes</p>
        <h1 class="ops-title">Cómo va cada cuenta</h1>
        <p class="ops-lead">Piezas, respuestas y facturas abiertas. Desde aquí no se edita la ficha.</p>
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
                v-for="client in data"
                :key="client.id"
                :aria-selected="selected?.id === client.id"
                @click="selected = client"
              >
                <td>
                  <strong>{{ client.company }}</strong>
                  <div class="ops-card__meta">{{ client.name }} · {{ client.neighborhood }}</div>
                </td>
                <td>{{ client.kpis.pieces_this_month }} este mes</td>
                <td>{{ client.kpis.pending }}</td>
                <td>{{ formatEur(client.kpis.open_invoices_cents) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <aside class="ops-panel" v-if="selected">
          <p class="ops-kicker">{{ selected.plan_label }}</p>
          <h2>{{ selected.company }}</h2>
          <p class="ops-card__meta">Cliente desde {{ formatDate(selected.since) }}</p>
          <div class="ops-grid">
            <div class="ops-stat"><span>Aprobadas</span><strong>{{ selected.kpis.approved }}</strong></div>
            <div class="ops-stat"><span>Días medios</span><strong>{{ selected.kpis.avg_approval_days }}</strong></div>
            <div class="ops-stat"><span>Mensajes</span><strong>{{ selected.kpis.messages_sent }}</strong></div>
            <div class="ops-stat"><span>Respuestas</span><strong>{{ selected.kpis.replies }}</strong></div>
          </div>
          <p v-if="selected.kpis.next_meeting_at">Próxima reunión: {{ formatDateTime(selected.kpis.next_meeting_at) }}</p>
          <h3>Piezas de esta cuenta</h3>
          <p v-if="piecesError" role="alert">{{ piecesError }}</p>
          <ul v-else class="piece-list">
            <li v-for="piece in pieces" :key="piece.id">
              <strong>{{ piece.title }}</strong>
              <span>{{ piece.stage === 'client' ? 'En manos del cliente' : 'Contigo' }} · {{ piece.status }}</span>
            </li>
            <li v-if="!pieces.length">No hay piezas registradas.</li>
          </ul>
        </aside>
      </div>
    </OpsState>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { listApprovals, listClients } from '@/api/ops/client'
import { formatDate, formatDateTime, formatEur } from '@/api/ops/format'
import { useAsyncData } from '@/composables/useAsyncData'
import MockNotice from '@/components/ops/MockNotice.vue'
import OpsState from '@/components/ops/OpsState.vue'

const { data, error, loading, reload } = useAsyncData(listClients)
const selected = ref(null)
const pieces = ref([])
const piecesError = ref('')

watch(data, (rows) => {
  if (!selected.value && rows?.length) selected.value = rows[0]
})

watch(selected, async (client) => {
  pieces.value = []
  piecesError.value = ''
  if (!client) return
  try {
    pieces.value = await listApprovals(client.id)
  } catch (err) {
    piecesError.value = err.message
  }
})
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
