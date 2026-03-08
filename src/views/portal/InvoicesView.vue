<template>
  <div class="invoices-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Facturas</h1>
        <p class="page-subtitle">Historial de pagos y descarga de facturas</p>
      </div>
    </div>

    <AppCard class="table-card">
      <div v-if="loading" class="table-loader">
        <AppSpinner />
      </div>

      <div v-else-if="invoices.length === 0" class="table-empty">
        <FileText :size="40" />
        <p>Sin facturas aún</p>
      </div>

      <div v-else class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>Factura</th>
              <th>Descripción</th>
              <th>Importe</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="inv in invoices" :key="inv.id" class="table__row">
              <td class="cell-mono cell-muted">{{ inv.number ?? inv.id?.slice(-8) }}</td>
              <td>{{ inv.description || 'Suscripción Diginode' }}</td>
              <td class="cell-amount">
                {{ formatAmount(inv.amount_paid, inv.currency) }}
              </td>
              <td>
                <AppBadge :variant="invoiceStatusVariant(inv.status)">
                  {{ invoiceStatusLabel(inv.status) }}
                </AppBadge>
              </td>
              <td class="cell-mono cell-muted">{{ formatDate(inv.created) }}</td>
              <td>
                <a
                  v-if="inv.invoice_pdf"
                  :href="inv.invoice_pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="download-link"
                  :aria-label="`Descargar factura ${inv.number}`"
                >
                  <Download :size="14" />
                  PDF
                </a>
                <span v-else class="cell-muted">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </AppCard>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { FileText, Download } from 'lucide-vue-next'
import { useApi } from '@/composables/useApi'
import { useToastStore } from '@/stores/toast'
import AppCard    from '@/components/ui/AppCard.vue'
import AppBadge   from '@/components/ui/AppBadge.vue'
import AppSpinner from '@/components/ui/AppSpinner.vue'

const api   = useApi()
const toast = useToastStore()

const invoices = ref([])
const loading  = ref(true)

function formatAmount(cents, currency = 'usd') {
  if (cents == null) return '—'
  const amount = cents / 100
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(amount)
}

function formatDate(ts) {
  if (!ts) return '—'
  const d = ts > 1e10 ? new Date(ts) : new Date(ts * 1000)
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
}

function invoiceStatusLabel(s) {
  const map = { paid: 'Pagada', open: 'Pendiente', void: 'Anulada', uncollectible: 'Sin cobrar' }
  return map[s] ?? s
}

function invoiceStatusVariant(s) {
  const map = { paid: 'success', open: 'warning', void: 'default', uncollectible: 'danger' }
  return map[s] ?? 'default'
}

onMounted(async () => {
  try {
    const res = await api.get('/portal/invoices')
    invoices.value = res.invoices ?? []
  } catch {
    toast.error('No se pudieron cargar las facturas')
  } finally {
    loading.value = false
  }
})
</script>

<style lang="scss" scoped>
.invoices-page {
  display: flex;
  flex-direction: column;
  gap: $space-6;
}

.page-header {
  display: flex;
  flex-direction: column;
  gap: $space-1;
}

.page-title {
  font-size: $text-3xl;
  font-weight: $fw-bold;
  letter-spacing: -0.02em;
}

.page-subtitle {
  color: $text-muted;
  font-size: $text-sm;
}

.table-card {
  padding: 0;
  overflow: hidden;
}

.table-loader,
.table-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $space-3;
  padding: $space-16;
  color: $text-subtle;
  font-size: $text-sm;
}

.table-wrapper {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;

  th {
    padding: $space-3 $space-5;
    text-align: left;
    font-size: $text-xs;
    font-weight: $fw-semibold;
    color: $text-muted;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    border-bottom: 1px solid $border;
    background: $bg-surface;
    white-space: nowrap;
  }

  td {
    padding: $space-4 $space-5;
    border-bottom: 1px solid $border;
    font-size: $text-sm;
    color: $text;
    vertical-align: middle;
  }

  &__row {
    transition: $transition-fast;

    &:hover td {
      background: $primary-subtle;
    }

    &:last-child td {
      border-bottom: none;
    }
  }
}

.cell-muted { color: $text-muted !important; }
.cell-mono  { font-family: $font-mono; font-size: $text-xs !important; }

.cell-amount {
  font-weight: $fw-semibold;
  font-variant-numeric: tabular-nums;
  color: $text;
}

.download-link {
  display: inline-flex;
  align-items: center;
  gap: $space-1;
  color: $primary;
  font-size: $text-xs;
  font-weight: $fw-medium;
  text-decoration: none;
  padding: $space-1 $space-2;
  border-radius: $radius-sm;
  border: 1px solid rgba(124, 111, 255, 0.2);
  transition: $transition-fast;

  &:hover {
    background: $primary-subtle;
    color: $primary-light;
    border-color: rgba(124, 111, 255, 0.4);
  }
}
</style>
