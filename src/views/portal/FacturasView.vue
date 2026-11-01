<template>
  <div class="ops-page">
    <header class="ops-head">
      <div>
        <p class="ops-kicker">Facturas</p>
        <h1 class="ops-title">Lo pendiente y lo pagado</h1>
        <p class="ops-lead">El pago abre Stripe Checkout. Diginode no ve el número de tu tarjeta.</p>
      </div>
    </header>
    <OpsState :loading="loading" :error="error" @retry="reload">
      <article v-for="invoice in data" :key="invoice.id" class="ops-panel invoice">
        <div>
          <p class="ops-card__meta">{{ invoice.number }} · {{ statusLabel(invoice.status) }}</p>
          <h2>{{ invoice.concept }}</h2>
          <p class="ops-card__meta">
            Emitida el {{ formatDate(invoice.issued_at) }}
            <template v-if="invoice.due_at"> · vence el {{ formatDate(invoice.due_at) }}</template>
          </p>
        </div>
        <div class="invoice__pay">
          <strong>{{ formatEur(invoice.amount_cents) }}</strong>
          <AppButton
            v-if="invoice.status === 'open'"
            type="button"
            :loading="busyId === invoice.id"
            @click="pay(invoice)"
          >Pagar con Stripe</AppButton>
        </div>
      </article>
      <p v-if="checkoutNote" class="ops-notice" role="status">{{ checkoutNote }}</p>
      <p v-if="data && !data.length" class="ops-state">No hay facturas.</p>
    </OpsState>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { createInvoiceCheckout, listInvoices } from '@/api/ops/client'
import { formatDate, formatEur, stripeCheckoutUrl } from '@/api/ops/format'
import { useAsyncData } from '@/composables/useAsyncData'
import { useToastStore } from '@/stores/toast'
import AppButton from '@/components/ui/AppButton.vue'
import OpsState from '@/components/ops/OpsState.vue'

const toast = useToastStore()
const { data, error, loading, reload } = useAsyncData(listInvoices)
const busyId = ref('')
const checkoutNote = ref('')

function statusLabel(status) {
  if (status === 'open') return 'Pendiente'
  if (status === 'paid') return 'Pagada'
  if (status === 'void') return 'Anulada'
  return 'Borrador'
}

async function pay(invoice) {
  busyId.value = invoice.id
  checkoutNote.value = ''
  try {
    const session = await createInvoiceCheckout(invoice.id)
    const url = stripeCheckoutUrl(session?.checkout_url)
    if (!url) throw new Error('La API no devolvió un enlace de Stripe Checkout.')
    if (session.mock) {
      checkoutNote.value = 'Esto es una sesión de demostración. Con la API real, este botón abre Stripe y no guarda la tarjeta en Diginode.'
      return
    }
    window.location.assign(url)
  } catch (err) {
    toast.error(err.message)
  } finally {
    busyId.value = ''
  }
}
</script>

<style lang="scss" scoped>
.invoice {
  display: flex;
  justify-content: space-between;
  gap: $space-4;
  align-items: center;
  flex-wrap: wrap;
}
h2 { font-size: $text-lg; }
.invoice__pay {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: $space-2;
  strong { font-family: $font-display; font-size: $text-2xl; }
}
</style>
