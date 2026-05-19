<template>
  <div class="portal-dashboard">

    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">
          {{ clientStore.client ? `Hola, ${firstName}` : 'Mi portal' }}
        </h1>
        <p class="page-subtitle">Panel de control de tus servicios Diginode</p>
      </div>
      <AppBadge v-if="clientStore.client" :variant="statusVariant(clientStore.client.status)">
        {{ statusLabel(clientStore.client.status) }}
      </AppBadge>
    </div>

    <!-- Skeleton -->
    <template v-if="isLoading">
      <div class="stats-row">
        <div v-for="i in 3" :key="i" class="stat-card stat-card--skeleton" />
      </div>
      <div class="skeleton-block" />
      <div class="skeleton-block skeleton-block--sm" />
    </template>

    <template v-else>

      <!-- Stats row -->
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-card__icon stat-card__icon--purple">
            <ShoppingBag :size="18" />
          </div>
          <div class="stat-card__body">
            <span class="stat-card__value">{{ clientStore.purchases.length }}</span>
            <span class="stat-card__label">{{ clientStore.purchases.length === 1 ? 'Compra' : 'Compras' }}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-card__icon stat-card__icon--green">
            <CalendarClock :size="18" />
          </div>
          <div class="stat-card__body">
            <span class="stat-card__value">
              {{ nextBillingText }}
            </span>
            <span class="stat-card__label">Próximo cobro</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-card__icon" :class="clientStore.openTickets > 0 ? 'stat-card__icon--amber' : 'stat-card__icon--muted'">
            <LifeBuoy :size="18" />
          </div>
          <div class="stat-card__body">
            <span class="stat-card__value">{{ clientStore.openTickets }}</span>
            <span class="stat-card__label">{{ clientStore.openTickets === 1 ? 'Ticket abierto' : 'Tickets abiertos' }}</span>
          </div>
        </div>
      </div>

      <!-- Subscription card -->
      <section v-if="clientStore.subscription" class="sub-card">
        <div class="sub-card__header">
          <div class="sub-card__icon">
            <Repeat :size="18" />
          </div>
          <div class="sub-card__info">
            <h3 class="sub-card__name">{{ planLabel(clientStore.subscription.package_slug) }}</h3>
            <p class="sub-card__meta">
              <span v-if="clientStore.subscription.amount_monthly">
                {{ formatAmount(clientStore.subscription.amount_monthly) }}/mes
              </span>
              <span v-if="clientStore.subscription.minimum_end_date" class="sub-card__commitment">
                · Compromiso hasta {{ formatDate(clientStore.subscription.minimum_end_date) }}
              </span>
            </p>
          </div>
          <AppBadge :variant="subStatusVariant(clientStore.subscription.status)">
            {{ subStatusLabel(clientStore.subscription.status) }}
          </AppBadge>
        </div>

        <div v-if="clientStore.subscription.next_billing_date" class="sub-card__next">
          <CalendarClock :size="14" />
          Próximo cobro: <strong>{{ formatDate(clientStore.subscription.next_billing_date) }}</strong>
          <span v-if="clientStore.subscription.amount_monthly">
            — {{ formatAmount(clientStore.subscription.amount_monthly) }}
          </span>
        </div>
      </section>

      <!-- Office access -->
      <section v-if="clientStore.office" class="office-card">
        <div class="office-card__header">
          <div class="office-card__icon">
            <ExternalLink :size="18" />
          </div>
          <div class="office-card__info">
            <h3 class="office-card__name">Mi oficina AI</h3>
            <p class="office-card__meta">{{ officeStatusText }}</p>
          </div>
          <AppBadge :variant="officeStatusVariant">
            {{ officeStatusLabel }}
          </AppBadge>
        </div>
        <a
          v-if="clientStore.office.url"
          :href="clientStore.office.url"
          target="_blank"
          rel="noopener noreferrer"
          class="office-card__button"
        >
          Entrar a mi oficina
          <ExternalLink :size="14" />
        </a>
      </section>

      <!-- Upcoming payments -->
      <section v-if="clientStore.upcoming.length">
        <h2 class="section-title">
          <Bell :size="16" />
          Próximos pagos
        </h2>
        <div class="upcoming-list">
          <div v-for="(item, i) in clientStore.upcoming" :key="i" class="upcoming-item">
            <div class="upcoming-item__icon">
              <component :is="typeIcon(item.type)" :size="16" />
            </div>
            <div class="upcoming-item__body">
              <span class="upcoming-item__label">{{ item.label }}</span>
              <span v-if="item.due_date" class="upcoming-item__date">
                {{ formatDate(item.due_date) }}
              </span>
              <span v-else class="upcoming-item__pending">Enlace de pago pendiente</span>
            </div>
            <span v-if="item.amount" class="upcoming-item__amount">
              {{ formatAmount(item.amount) }}
            </span>
          </div>
        </div>
      </section>

      <!-- Recent purchases -->
      <section>
        <div class="section-header">
          <h2 class="section-title">
            <ShoppingBag :size="16" />
            Compras recientes
          </h2>
          <RouterLink v-if="clientStore.purchases.length > 3" to="/portal/invoices" class="section-link">
            Ver todo →
          </RouterLink>
        </div>

        <div v-if="clientStore.purchases.length === 0" class="section-empty">
          <ShoppingBag :size="32" />
          <p>Sin compras registradas</p>
        </div>

        <div v-else class="purchase-list">
          <div
            v-for="purchase in recentPurchases"
            :key="purchase.id"
            class="purchase-item"
          >
            <div class="purchase-item__icon" :class="`purchase-item__icon--${purchase.type}`">
              <component :is="typeIcon(purchase.type)" :size="16" />
            </div>
            <div class="purchase-item__body">
              <span class="purchase-item__label">{{ purchase.reference_label }}</span>
              <span class="purchase-item__meta">
                {{ formatDate(purchase.created_at) }}
                <template v-if="purchase.installment_total">
                  · Cuota {{ purchase.installment_number }}/{{ purchase.installment_total }}
                </template>
              </span>
            </div>
            <div class="purchase-item__right">
              <span class="purchase-item__amount">{{ formatAmount(purchase.amount) }}</span>
              <a
                v-if="purchase.receipt_url"
                :href="purchase.receipt_url"
                target="_blank"
                rel="noopener noreferrer"
                class="purchase-item__receipt"
                title="Ver recibo"
              >
                <Receipt :size="14" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Quick links -->
      <div class="quick-links">
        <RouterLink to="/portal/invoices" class="quick-link">
          <FileText :size="16" />
          Historial completo
        </RouterLink>
        <RouterLink to="/portal/support" class="quick-link">
          <LifeBuoy :size="16" />
          Abrir ticket
        </RouterLink>
      </div>

    </template>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import {
  ShoppingBag, CalendarClock, LifeBuoy, Repeat, Bell,
  FileText, Receipt, BookOpen, Users, Wrench, ExternalLink,
} from 'lucide-vue-next'
import { useClientStore } from '@/stores/client'
import { useToastStore } from '@/stores/toast'
import AppBadge from '@/components/ui/AppBadge.vue'

const clientStore = useClientStore()
const toast       = useToastStore()

const isLoading = computed(() => clientStore.loading || !clientStore.loaded)

// Load lazily if user navigated directly (token in localStorage, no login flow)
onMounted(async () => {
  if (!clientStore.loaded) {
    try {
      await clientStore.load()
    } catch {
      toast.error('No se pudo cargar la información del portal')
    }
  }
})

const firstName = computed(() => {
  const name = clientStore.client?.name ?? ''
  return name.split(' ')[0]
})

const recentPurchases = computed(() =>
  clientStore.purchases.slice(0, 4)
)

const nextBillingText = computed(() => {
  const sub = clientStore.subscription
  if (sub?.next_billing_date) return formatDate(sub.next_billing_date)
  const next = clientStore.upcoming.find(u => u.due_date)
  if (next) return formatDate(next.due_date)
  return '—'
})

const officeStatusLabel = computed(() => {
  const status = clientStore.office?.status ?? 'not_requested'
  return {
    not_requested: 'No solicitada',
    requested: 'Solicitada',
    provisioning: 'Preparando',
    training: 'Entrenando',
    review: 'En revisión',
    live: 'Activa',
    paused: 'Pausada',
    error: 'Incidencia',
  }[status] ?? status
})

const officeStatusVariant = computed(() => {
  const status = clientStore.office?.status
  return {
    live: 'success',
    requested: 'info',
    provisioning: 'warning',
    training: 'warning',
    review: 'warning',
    paused: 'warning',
    error: 'danger',
  }[status] ?? 'default'
})

const officeStatusText = computed(() => {
  if (clientStore.office?.url) return 'Tu oficina aislada está lista para trabajar.'
  if (clientStore.office?.status === 'training') return 'Estamos entrenando tus empleados con tus materiales.'
  if (clientStore.office?.status === 'review') return 'Pendiente de revisión humana antes de activar.'
  return 'Aquí aparecerá el acceso cuando la instancia esté desplegada.'
})

// ── Helpers ────────────────────────────────────────────────────────────────

function typeIcon(type) {
  return { course: BookOpen, bolsa: Users, subscription: Repeat, manual: Receipt }[type] ?? FileText
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

function statusLabel(s) {
  return { pending: 'Pendiente', active: 'Activo', suspended: 'Suspendido', cancelled: 'Cancelado' }[s] ?? s
}
function statusVariant(s) {
  return { active: 'success', pending: 'warning', suspended: 'danger', cancelled: 'danger' }[s] ?? 'default'
}

function subStatusLabel(s) {
  return { active: 'Activa', past_due: 'Pago pendiente', canceled: 'Cancelada' }[s] ?? s
}
function subStatusVariant(s) {
  return { active: 'success', past_due: 'warning', canceled: 'danger' }[s] ?? 'default'
}

function planLabel(slug) {
  return { 'despacho-digital': 'Despacho Digital' }[slug] ?? slug
}
</script>

<style lang="scss" scoped>
.portal-dashboard {
  display: flex;
  flex-direction: column;
  gap: $space-8;
}

// ── Header ─────────────────────────────────────────────────────────────────
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: $space-4;
}

.page-title {
  font-size: $text-3xl;
  font-weight: $fw-bold;
  letter-spacing: -0.02em;
}

.page-subtitle {
  color: $text-muted;
  font-size: $text-sm;
  margin-top: $space-1;
}

// ── Skeletons ──────────────────────────────────────────────────────────────
.skeleton-block {
  height: 120px;
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius-lg;
  animation: shimmer 1.5s infinite;

  &--sm { height: 72px; }
}

// ── Stats row ──────────────────────────────────────────────────────────────
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $space-4;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.stat-card {
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius-lg;
  padding: $space-4 $space-5;
  display: flex;
  align-items: center;
  gap: $space-4;
  transition: $transition;

  &:hover { border-color: $border-hover; }

  &--skeleton {
    height: 76px;
    animation: shimmer 1.5s infinite;
  }

  &__icon {
    width: 40px;
    height: 40px;
    border-radius: $radius;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    &--purple { background: rgba(156, 255, 203, 0.12); color: $primary; }
    &--green  { background: rgba(156, 255, 203, 0.12);  color: $accent; }
    &--amber  { background: rgba(255, 211, 138, 0.12);  color: $warning; }
    &--muted  { background: rgba(139, 138, 168, 0.1);  color: $text-subtle; }
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  &__value {
    font-size: $text-xl;
    font-weight: $fw-bold;
    color: $text;
    line-height: 1.2;
  }

  &__label {
    font-size: $text-xs;
    color: $text-muted;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

// ── Subscription card ──────────────────────────────────────────────────────
.sub-card {
  background: $bg-card;
  border: 1px solid rgba(156, 255, 203, 0.2);
  border-radius: $radius-lg;
  padding: $space-5;
  display: flex;
  flex-direction: column;
  gap: $space-3;

  &__header {
    display: flex;
    align-items: center;
    gap: $space-4;
  }

  &__icon {
    width: 40px;
    height: 40px;
    border-radius: $radius;
    background: rgba(156, 255, 203, 0.12);
    color: $primary;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__info { flex: 1; min-width: 0; }

  &__name {
    font-size: $text-base;
    font-weight: $fw-semibold;
    color: $text;
    margin-bottom: 2px;
  }

  &__meta {
    font-size: $text-sm;
    color: $text-muted;
  }

  &__commitment {
    font-size: $text-xs;
    color: $text-subtle;
  }

  &__next {
    display: flex;
    align-items: center;
    gap: $space-2;
    font-size: $text-sm;
    color: $text-muted;
    padding: $space-3 $space-4;
    background: rgba(156, 255, 203, 0.06);
    border: 1px solid rgba(156, 255, 203, 0.15);
    border-radius: $radius;
    color: $accent;

    strong { color: $text; }
  }
}

// ── Office card ─────────────────────────────────────────────────────────────
.office-card {
  background: $bg-card;
  border: 1px solid rgba(143, 179, 255, 0.22);
  border-radius: $radius-lg;
  padding: $space-5;
  display: flex;
  flex-direction: column;
  gap: $space-4;

  &__header {
    display: flex;
    align-items: center;
    gap: $space-4;
  }

  &__icon {
    width: 40px;
    height: 40px;
    border-radius: $radius;
    background: rgba(143, 179, 255, 0.12);
    color: $accent-blue;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__info { flex: 1; min-width: 0; }

  &__name {
    font-size: $text-base;
    font-weight: $fw-semibold;
    color: $text;
    margin-bottom: 2px;
  }

  &__meta {
    font-size: $text-sm;
    color: $text-muted;
  }

  &__button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: $space-2;
    min-height: 40px;
    padding: 0 $space-4;
    border-radius: $radius;
    background: $primary;
    color: #0b1020;
    font-size: $text-sm;
    font-weight: $fw-semibold;
    text-decoration: none;
    transition: $transition-fast;

    &:hover {
      filter: brightness(1.05);
    }
  }
}

// ── Upcoming payments ──────────────────────────────────────────────────────
.section-title {
  display: flex;
  align-items: center;
  gap: $space-2;
  font-size: $text-base;
  font-weight: $fw-semibold;
  color: $text;
  margin-bottom: $space-3;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $space-3;

  .section-title { margin-bottom: 0; }
}

.section-link {
  font-size: $text-sm;
  font-weight: $fw-medium;
  color: $primary-light;
  text-decoration: none;
  &:hover { text-decoration: underline; }
}

.section-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-3;
  padding: $space-10;
  color: $text-subtle;
  font-size: $text-sm;
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius-lg;
  text-align: center;
}

.upcoming-list {
  display: flex;
  flex-direction: column;
  gap: $space-2;
}

.upcoming-item {
  display: flex;
  align-items: center;
  gap: $space-3;
  padding: $space-3 $space-4;
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius-lg;

  &__icon {
    width: 32px;
    height: 32px;
    border-radius: $radius-sm;
    background: rgba(255, 211, 138, 0.1);
    color: $warning;
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

  &__label {
    font-size: $text-sm;
    font-weight: $fw-medium;
    color: $text;
  }

  &__date {
    font-size: $text-xs;
    color: $text-muted;
    font-family: $font-mono;
  }

  &__pending {
    font-size: $text-xs;
    color: $warning;
    font-style: italic;
  }

  &__amount {
    font-size: $text-sm;
    font-weight: $fw-semibold;
    color: $text;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
}

// ── Purchase list ──────────────────────────────────────────────────────────
.purchase-list {
  display: flex;
  flex-direction: column;
  gap: $space-2;
}

.purchase-item {
  display: flex;
  align-items: center;
  gap: $space-3;
  padding: $space-3 $space-4;
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius-lg;
  transition: $transition-fast;

  &:hover { border-color: $border-hover; }

  &__icon {
    width: 36px;
    height: 36px;
    border-radius: $radius-sm;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    &--course       { background: rgba(156, 255, 203, 0.12); color: $primary; }
    &--bolsa        { background: rgba(156, 255, 203, 0.12);  color: $accent; }
    &--subscription { background: rgba(99, 102, 241, 0.12);  color: $accent-blue; }
    &--manual       { background: rgba(139, 138, 168, 0.1);  color: $text-muted; }
  }

  &__body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__label {
    font-size: $text-sm;
    font-weight: $fw-medium;
    color: $text;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__meta {
    font-size: $text-xs;
    color: $text-muted;
    font-family: $font-mono;
  }

  &__right {
    display: flex;
    align-items: center;
    gap: $space-3;
    flex-shrink: 0;
  }

  &__amount {
    font-size: $text-sm;
    font-weight: $fw-semibold;
    color: $text;
    font-variant-numeric: tabular-nums;
  }

  &__receipt {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: $radius-sm;
    border: 1px solid $border;
    color: $text-muted;
    text-decoration: none;
    transition: $transition-fast;

    &:hover {
      border-color: $primary;
      color: $primary;
      background: $primary-subtle;
    }
  }
}

// ── Quick links ────────────────────────────────────────────────────────────
.quick-links {
  display: flex;
  gap: $space-3;
  flex-wrap: wrap;
}

.quick-link {
  display: inline-flex;
  align-items: center;
  gap: $space-2;
  padding: $space-2 $space-4;
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius-lg;
  font-size: $text-sm;
  font-weight: $fw-medium;
  color: $text-muted;
  text-decoration: none;
  transition: $transition-fast;

  &:hover {
    border-color: $primary;
    color: $primary;
    background: $primary-subtle;
  }
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
