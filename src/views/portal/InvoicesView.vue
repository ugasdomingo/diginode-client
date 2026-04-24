<template>
  <div class="purchases-page">

    <div class="page-header">
      <div>
        <h1 class="page-title">Compras y pagos</h1>
        <p class="page-subtitle">Historial completo de tus compras y recibos</p>
      </div>
    </div>

    <!-- Skeleton -->
    <template v-if="isLoading">
      <div v-for="i in 5" :key="i" class="row-skeleton" />
    </template>

    <template v-else>

      <!-- Upcoming / pending payments -->
      <section v-if="clientStore.upcoming.length" class="upcoming-section">
        <h2 class="section-title">
          <Bell :size="15" />
          Pagos pendientes
        </h2>
        <div class="upcoming-list">
          <div
            v-for="(item, i) in clientStore.upcoming"
            :key="i"
            class="upcoming-row"
          >
            <div class="upcoming-row__icon">
              <component :is="typeIcon(item.type)" :size="15" />
            </div>
            <div class="upcoming-row__body">
              <span class="upcoming-row__label">{{ item.label }}</span>
              <span v-if="item.due_date" class="upcoming-row__date">
                Vence {{ formatDate(item.due_date) }}
              </span>
              <span v-else class="upcoming-row__pending">
                El enlace de pago será enviado próximamente
              </span>
            </div>
            <span v-if="item.amount" class="upcoming-row__amount">
              {{ formatAmount(item.amount) }}
            </span>
          </div>
        </div>
      </section>

      <!-- Subscription -->
      <section v-if="clientStore.subscription" class="sub-section">
        <h2 class="section-title">
          <Repeat :size="15" />
          Suscripción activa
        </h2>
        <div class="sub-row">
          <div class="sub-row__body">
            <span class="sub-row__name">{{ planLabel(clientStore.subscription.package_slug) }}</span>
            <span class="sub-row__meta">
              Desde {{ formatDate(clientStore.subscription.started_at) }}
              <template v-if="clientStore.subscription.minimum_end_date">
                · Compromiso hasta {{ formatDate(clientStore.subscription.minimum_end_date) }}
              </template>
            </span>
          </div>
          <div class="sub-row__right">
            <AppBadge :variant="subStatusVariant(clientStore.subscription.status)">
              {{ subStatusLabel(clientStore.subscription.status) }}
            </AppBadge>
            <span v-if="clientStore.subscription.amount_monthly" class="sub-row__amount">
              {{ formatAmount(clientStore.subscription.amount_monthly) }}/mes
            </span>
          </div>
        </div>
        <div v-if="clientStore.subscription.next_billing_date" class="sub-row__billing">
          <CalendarClock :size="13" />
          Próximo cobro el {{ formatDate(clientStore.subscription.next_billing_date) }}
          <template v-if="clientStore.subscription.amount_monthly">
            por {{ formatAmount(clientStore.subscription.amount_monthly) }}
          </template>
        </div>
      </section>

      <!-- Full purchase history -->
      <section>
        <h2 class="section-title">
          <ShoppingBag :size="15" />
          Historial de compras
        </h2>

        <div v-if="clientStore.purchases.length === 0" class="empty-state">
          <ShoppingBag :size="40" />
          <p>Sin compras registradas aún</p>
        </div>

        <div v-else class="purchase-table">
          <!-- Table header -->
          <div class="purchase-table__head">
            <span>Concepto</span>
            <span class="col-date">Fecha</span>
            <span class="col-amount">Importe</span>
            <span class="col-action">Recibo</span>
          </div>

          <!-- Rows -->
          <div
            v-for="purchase in clientStore.purchases"
            :key="purchase.id"
            class="purchase-row"
          >
            <div class="purchase-row__concept">
              <div class="purchase-row__icon" :class="`purchase-row__icon--${purchase.type}`">
                <component :is="typeIcon(purchase.type)" :size="15" />
              </div>
              <div class="purchase-row__info">
                <span class="purchase-row__label">{{ purchase.reference_label }}</span>
                <span v-if="purchase.installment_total" class="purchase-row__badge">
                  Cuota {{ purchase.installment_number }}/{{ purchase.installment_total }}
                </span>
                <span v-else class="purchase-row__type-label">{{ typeLabel(purchase.type) }}</span>
              </div>
            </div>

            <span class="purchase-row__date col-date">
              {{ formatDate(purchase.created_at) }}
            </span>

            <span class="purchase-row__amount col-amount">
              {{ formatAmount(purchase.amount) }}
            </span>

            <div class="col-action">
              <a
                v-if="purchase.receipt_url"
                :href="purchase.receipt_url"
                target="_blank"
                rel="noopener noreferrer"
                class="receipt-link"
                title="Ver recibo de Stripe"
              >
                <ExternalLink :size="13" />
                Ver
              </a>
              <span v-else class="receipt-none">—</span>
            </div>
          </div>
        </div>
      </section>

    </template>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import {
  ShoppingBag, Bell, Repeat, CalendarClock,
  BookOpen, Users, FileText, Receipt, ExternalLink,
} from 'lucide-vue-next'
import { useClientStore } from '@/stores/client'
import { useToastStore } from '@/stores/toast'
import AppBadge from '@/components/ui/AppBadge.vue'

const clientStore = useClientStore()
const toast       = useToastStore()

const isLoading = computed(() => clientStore.loading || !clientStore.loaded)

onMounted(async () => {
  if (!clientStore.loaded) {
    try { await clientStore.load() }
    catch { toast.error('No se pudo cargar el historial de compras') }
  }
})

// ── Helpers ────────────────────────────────────────────────────────────────

function typeIcon(type) {
  return { course: BookOpen, bolsa: Users, subscription: Repeat, manual: Receipt }[type] ?? FileText
}

function typeLabel(type) {
  return { course: 'Curso', bolsa: 'Bolsa de empleo', subscription: 'Suscripción', manual: 'Pago manual' }[type] ?? 'Pago'
}

function planLabel(slug) {
  return { 'despacho-digital': 'Despacho Digital' }[slug] ?? slug
}

function formatAmount(amount, currency = 'EUR') {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency', currency, minimumFractionDigits: 0,
  }).format(amount)
}

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

function subStatusLabel(s) {
  return { active: 'Activa', past_due: 'Pago pendiente', canceled: 'Cancelada' }[s] ?? s
}
function subStatusVariant(s) {
  return { active: 'success', past_due: 'warning', canceled: 'danger' }[s] ?? 'default'
}
</script>

<style lang="scss" scoped>
.purchases-page {
  display: flex;
  flex-direction: column;
  gap: $space-8;
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

// ── Skeleton ───────────────────────────────────────────────────────────────
.row-skeleton {
  height: 60px;
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius-lg;
  animation: shimmer 1.5s infinite;

  & + & { margin-top: $space-2; }
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

// ── Section title ──────────────────────────────────────────────────────────
.section-title {
  display: flex;
  align-items: center;
  gap: $space-2;
  font-size: $text-base;
  font-weight: $fw-semibold;
  color: $text;
  margin-bottom: $space-3;
}

// ── Upcoming ───────────────────────────────────────────────────────────────
.upcoming-list {
  display: flex;
  flex-direction: column;
  gap: $space-2;
}

.upcoming-row {
  display: flex;
  align-items: center;
  gap: $space-3;
  padding: $space-3 $space-4;
  background: rgba(245, 158, 11, 0.05);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: $radius-lg;

  &__icon {
    width: 32px;
    height: 32px;
    border-radius: $radius-sm;
    background: rgba(245, 158, 11, 0.12);
    color: #f59e0b;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__label  { font-size: $text-sm; font-weight: $fw-medium; color: $text; }
  &__date   { font-size: $text-xs; color: $text-muted; font-family: $font-mono; }
  &__pending { font-size: $text-xs; color: #f59e0b; font-style: italic; }

  &__amount {
    font-size: $text-sm;
    font-weight: $fw-semibold;
    color: $text;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
}

// ── Subscription ───────────────────────────────────────────────────────────
.sub-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $space-4;
  padding: $space-4;
  background: $bg-card;
  border: 1px solid rgba(124, 111, 255, 0.2);
  border-radius: $radius-lg $radius-lg 0 0;
  flex-wrap: wrap;

  &__body { display: flex; flex-direction: column; gap: 2px; }
  &__name { font-size: $text-base; font-weight: $fw-semibold; color: $text; }
  &__meta { font-size: $text-xs; color: $text-muted; }

  &__right {
    display: flex;
    align-items: center;
    gap: $space-3;
  }

  &__amount {
    font-size: $text-sm;
    font-weight: $fw-semibold;
    color: $text;
    font-variant-numeric: tabular-nums;
  }

  &__billing {
    display: flex;
    align-items: center;
    gap: $space-2;
    padding: $space-2 $space-4;
    background: rgba(52, 211, 153, 0.06);
    border: 1px solid rgba(52, 211, 153, 0.15);
    border-top: none;
    border-radius: 0 0 $radius-lg $radius-lg;
    font-size: $text-xs;
    color: $accent;
  }
}

// ── Purchase table ─────────────────────────────────────────────────────────
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-3;
  padding: $space-12;
  color: $text-subtle;
  font-size: $text-sm;
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius-lg;
  text-align: center;
}

.purchase-table {
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius-lg;
  overflow: hidden;

  &__head {
    display: grid;
    grid-template-columns: 1fr auto auto auto;
    gap: $space-4;
    padding: $space-3 $space-5;
    background: $bg-surface;
    border-bottom: 1px solid $border;
    font-size: $text-xs;
    font-weight: $fw-semibold;
    color: $text-muted;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
}

.purchase-row {
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  gap: $space-4;
  padding: $space-4 $space-5;
  border-bottom: 1px solid $border;
  align-items: center;
  transition: $transition-fast;

  &:last-child { border-bottom: none; }

  &:hover { background: $primary-subtle; }

  &__concept {
    display: flex;
    align-items: center;
    gap: $space-3;
    min-width: 0;
  }

  &__icon {
    width: 36px;
    height: 36px;
    border-radius: $radius-sm;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    &--course       { background: rgba(124, 111, 255, 0.12); color: $primary; }
    &--bolsa        { background: rgba(52, 211, 153, 0.12);  color: $accent; }
    &--subscription { background: rgba(99, 102, 241, 0.12);  color: #818cf8; }
    &--manual       { background: rgba(139, 138, 168, 0.1);  color: $text-muted; }
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  &__label {
    font-size: $text-sm;
    font-weight: $fw-medium;
    color: $text;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__badge {
    display: inline-block;
    font-size: $text-xs;
    color: #f59e0b;
    font-weight: $fw-medium;
  }

  &__type-label {
    font-size: $text-xs;
    color: $text-subtle;
  }

  &__date {
    font-size: $text-xs;
    color: $text-muted;
    font-family: $font-mono;
    white-space: nowrap;
  }

  &__amount {
    font-size: $text-sm;
    font-weight: $fw-semibold;
    color: $text;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
    text-align: right;
  }
}

.col-date   { justify-self: end; }
.col-amount { justify-self: end; }
.col-action { justify-self: end; }

.receipt-link {
  display: inline-flex;
  align-items: center;
  gap: $space-1;
  font-size: $text-xs;
  font-weight: $fw-medium;
  color: $primary;
  text-decoration: none;
  padding: $space-1 $space-2;
  border: 1px solid rgba(124, 111, 255, 0.25);
  border-radius: $radius-sm;
  transition: $transition-fast;
  white-space: nowrap;

  &:hover {
    background: $primary-subtle;
    border-color: rgba(124, 111, 255, 0.5);
    color: $primary-light;
  }
}

.receipt-none {
  color: $text-subtle;
  font-size: $text-sm;
}

@media (max-width: 600px) {
  .purchase-table__head .col-date,
  .purchase-row .col-date { display: none; }
}
</style>
