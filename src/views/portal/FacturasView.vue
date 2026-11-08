<template>
  <div class="ops-page">
    <header class="ops-head">
      <div>
        <p class="ops-kicker">Facturas</p>
        <h1 class="ops-title">Lo pendiente y lo pagado</h1>
        <p class="ops-lead">Si hay un enlace de Stripe, el pago se abre allí. Diginode no ve el número de tu tarjeta.</p>
      </div>
    </header>
    <OpsState :loading="loading" :error="error" @retry="reload">
      <article v-for="invoice in data" :key="invoice.id" class="ops-panel invoice">
        <div>
          <p class="ops-card__meta">{{ invoiceStatusLabel(invoice.status) }}</p>
          <h2>{{ invoice.concept }}</h2>
          <p class="ops-card__meta">
            {{ formatDate(invoice.created_at) }}
            <template v-if="invoice.paid_at"> · pagada el {{ formatDate(invoice.paid_at) }}</template>
          </p>
        </div>
        <div class="invoice__pay">
          <strong>{{ formatEur(invoice.amount_eur) }}</strong>
          <AppButton
            v-if="invoice.status === 'pendiente' && stripeCheckoutUrl(invoice.payment_url)"
            type="button"
            @click="pay(invoice)"
          >Pagar con Stripe</AppButton>
          <p v-else-if="invoice.status === 'pendiente'" class="ops-card__meta">El enlace de pago todavía no está.</p>
        </div>
      </article>
      <p v-if="checkoutNote" class="ops-notice" role="status">{{ checkoutNote }}</p>
      <p v-if="data && !data.length" class="ops-state">No hay facturas.</p>
    </OpsState>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { listInvoices, opsUsesMock } from '@/api/ops/client'
import { invoiceStatusLabel } from '@/api/ops/contracts'
import { formatDate, formatEur, stripeCheckoutUrl } from '@/api/ops/format'
import { useAsyncData } from '@/composables/useAsyncData'
import AppButton from '@/components/ui/AppButton.vue'
import OpsState from '@/components/ops/OpsState.vue'

const { data, error, loading, reload } = useAsyncData(listInvoices)
const checkoutNote = ref('')

function pay(invoice) {
  checkoutNote.value = ''
  const url = stripeCheckoutUrl(invoice.payment_url)
  if (!url) return
  if (opsUsesMock()) {
    checkoutNote.value = 'Esto es una sesión de demostración. Con la API real, este botón abre Stripe y no guarda la tarjeta en Diginode.'
    return
  }
  window.location.assign(url)
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
