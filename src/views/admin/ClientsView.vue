<template>
  <div class="clients-page">

    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Clientes</h1>
        <p class="page-subtitle">Historial de compras, suscripciones y pagos</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters">
      <div class="filters__search">
        <Search :size="15" class="filters__search-icon" />
        <input
          v-model="search"
          type="search"
          class="filters__search-input"
          placeholder="Buscar por nombre o email…"
        />
      </div>

      <div class="filters__tabs">
        <button
          v-for="tab in statusTabs"
          :key="tab.value"
          class="filters__tab"
          :class="{ 'filters__tab--active': selectedStatus === tab.value }"
          @click="selectStatus(tab.value)"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="filters__tabs">
        <button
          v-for="tab in planTabs"
          :key="tab.value"
          class="filters__tab"
          :class="{ 'filters__tab--active': selectedPlan === tab.value }"
          @click="selectPlan(tab.value)"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Layout: table + detail panel -->
    <div class="layout" :class="{ 'layout--split': !!selected }">

      <!-- Table -->
      <AppCard class="table-card">
        <div v-if="loading" class="table-loader">
          <AppSpinner />
        </div>

        <div v-else-if="filtered.length === 0" class="table-empty">
          <Users :size="40" />
          <p>Sin clientes con este filtro</p>
        </div>

        <div v-else class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Plan</th>
                <th>Estado</th>
                <th>Desde</th>
                <th>Gasto total</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="client in filtered"
                :key="client._id"
                class="table__row"
                :class="{ 'table__row--active': selected?._id === client._id }"
                @click="openDetail(client)"
              >
                <td>
                  <div class="client-cell">
                    <div class="client-cell__avatar">
                      {{ client.name.charAt(0).toUpperCase() }}
                    </div>
                    <div>
                      <p class="client-cell__name">{{ client.name }}</p>
                      <p class="client-cell__email">{{ client.email }}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <AppBadge variant="default">{{ planLabel(client.plan) }}</AppBadge>
                </td>
                <td>
                  <AppBadge :variant="statusVariant(client.status)">
                    {{ statusLabel(client.status) }}
                  </AppBadge>
                </td>
                <td class="cell-mono cell-muted">{{ formatDate(client.created_at) }}</td>
                <td class="cell-amount">{{ spendLabel(client._id) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="total > limit" class="pagination">
          <button class="pagination__btn" :disabled="page === 1" @click="changePage(page - 1)">
            ← Anterior
          </button>
          <span class="pagination__info">Página {{ page }} de {{ totalPages }}</span>
          <button class="pagination__btn" :disabled="page >= totalPages" @click="changePage(page + 1)">
            Siguiente →
          </button>
        </div>
      </AppCard>

      <!-- Detail panel -->
      <transition name="panel">
        <div v-if="selected" class="detail-panel">

          <!-- Panel header -->
          <div class="detail-panel__header">
            <div class="detail-panel__avatar">
              {{ selected.name.charAt(0).toUpperCase() }}
            </div>
            <div class="detail-panel__info">
              <h2 class="detail-panel__name">{{ selected.name }}</h2>
              <p class="detail-panel__email">{{ selected.email }}</p>
            </div>
            <button class="detail-panel__close" @click="selected = null" aria-label="Cerrar">
              <X :size="18" />
            </button>
          </div>

          <div class="detail-panel__badges">
            <AppBadge variant="default">{{ planLabel(selected.plan) }}</AppBadge>
            <AppBadge :variant="statusVariant(selected.status)">{{ statusLabel(selected.status) }}</AppBadge>
            <span v-if="selected.company" class="detail-panel__company">{{ selected.company }}</span>
          </div>

          <!-- Loading detail -->
          <div v-if="detailLoading" class="detail-panel__loader">
            <AppSpinner />
          </div>

          <template v-else>

            <!-- Subscription -->
            <div v-if="detail?.subscription" class="detail-sub">
              <h3 class="detail-section-title">
                <Repeat :size="14" /> Suscripción
              </h3>
              <div class="detail-sub__body">
                <div class="detail-sub__row">
                  <span>Plan</span>
                  <strong>{{ planLabel(detail.subscription.package_slug) }}</strong>
                </div>
                <div class="detail-sub__row">
                  <span>Estado</span>
                  <AppBadge :variant="subStatusVariant(detail.subscription.status)">
                    {{ subStatusLabel(detail.subscription.status) }}
                  </AppBadge>
                </div>
                <div v-if="detail.subscription.amount_monthly" class="detail-sub__row">
                  <span>Importe mensual</span>
                  <strong>{{ formatAmount(detail.subscription.amount_monthly) }}/mes</strong>
                </div>
                <div v-if="detail.subscription.next_billing_date" class="detail-sub__row detail-sub__row--highlight">
                  <span><CalendarClock :size="13" /> Próximo cobro</span>
                  <strong>{{ formatDate(detail.subscription.next_billing_date) }}</strong>
                </div>
                <div v-if="detail.subscription.minimum_end_date" class="detail-sub__row">
                  <span>Compromiso hasta</span>
                  <span class="cell-muted">{{ formatDate(detail.subscription.minimum_end_date) }}</span>
                </div>
              </div>
            </div>

            <!-- Purchase history -->
            <div class="detail-purchases">
              <h3 class="detail-section-title">
                <ShoppingBag :size="14" /> Compras ({{ detail?.payments?.length ?? 0 }})
              </h3>

              <div v-if="!detail?.payments?.length" class="detail-empty">
                Sin compras registradas
              </div>

              <div v-else class="detail-purchases__list">
                <div
                  v-for="p in detail.payments"
                  :key="p._id"
                  class="purchase-row"
                >
                  <div class="purchase-row__icon" :class="`purchase-row__icon--${p.type}`">
                    <component :is="typeIcon(p.type)" :size="13" />
                  </div>
                  <div class="purchase-row__body">
                    <span class="purchase-row__label">{{ p.reference_label ?? p.description ?? 'Pago' }}</span>
                    <span class="purchase-row__meta">
                      {{ formatDate(p.created_at) }}
                      <template v-if="p.installment_total">
                        · Cuota {{ p.installment_number }}/{{ p.installment_total }}
                      </template>
                    </span>
                  </div>
                  <div class="purchase-row__right">
                    <span class="purchase-row__amount">{{ formatAmount(p.amount) }}</span>
                    <a
                      v-if="p.receipt_url"
                      :href="p.receipt_url"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="purchase-row__receipt"
                      title="Ver recibo"
                    >
                      <ExternalLink :size="12" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <!-- Total spend -->
            <div v-if="detail?.payments?.length" class="detail-total">
              <span>Total facturado</span>
              <strong>{{ totalSpend }}</strong>
            </div>

            <!-- Office access -->
            <div class="detail-office">
              <h3 class="detail-section-title">
                <ExternalLink :size="14" /> Oficina de empleados
              </h3>

              <div class="office-summary">
                <div>
                  <span class="office-summary__label">Estado</span>
                  <AppBadge :variant="officeStatusVariant(detail?.client?.office_status)">
                    {{ officeStatusLabel(detail?.client?.office_status) }}
                  </AppBadge>
                </div>
                <a
                  v-if="detail?.client?.office_url"
                  :href="detail.client.office_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="office-summary__link"
                >
                  Abrir oficina
                  <ExternalLink :size="12" />
                </a>
              </div>

              <form class="office-form" @submit.prevent="saveOffice">
                <div class="field">
                  <label class="field__label">URL de oficina</label>
                  <input
                    v-model="officeForm.office_url"
                    type="url"
                    class="field__input"
                    placeholder="https://cliente-office.up.railway.app"
                  />
                </div>

                <div class="field-row field-row--office">
                  <div class="field">
                    <label class="field__label">Estado</label>
                    <select v-model="officeForm.office_status" class="field__input">
                      <option value="not_requested">No solicitada</option>
                      <option value="requested">Solicitada</option>
                      <option value="provisioning">Preparando</option>
                      <option value="training">Entrenando</option>
                      <option value="review">En revisión</option>
                      <option value="live">Activa</option>
                      <option value="paused">Pausada</option>
                      <option value="error">Incidencia</option>
                    </select>
                  </div>
                  <div class="field">
                    <label class="field__label">Plan office</label>
                    <select v-model="officeForm.office_plan" class="field__input">
                      <option value="">Sin asignar</option>
                      <option value="individual">Individual</option>
                      <option value="operativo">Operativo</option>
                      <option value="full">Full</option>
                    </select>
                  </div>
                </div>

                <div class="field">
                  <label class="field__label">Instance ID</label>
                  <input
                    v-model="officeForm.office_instance_id"
                    type="text"
                    class="field__input"
                    placeholder="diginode-office-cliente"
                  />
                </div>

                <AppButton size="sm" :loading="officeLoading">
                  Guardar oficina
                </AppButton>
              </form>
            </div>

            <!-- Payment link generator -->
            <div class="detail-pay-link">
              <h3 class="detail-section-title">
                <Link2 :size="14" /> Generar enlace de pago
              </h3>

              <form @submit.prevent="generateLink" class="pay-link-form">
                <div class="field">
                  <label class="field__label">Concepto</label>
                  <input
                    v-model="linkForm.label"
                    class="field__input"
                    placeholder="Ej: Bolsa de empleo — cuota 2/3"
                    required
                  />
                </div>

                <div class="field-row">
                  <div class="field">
                    <label class="field__label">Importe (€)</label>
                    <input
                      v-model.number="linkForm.amount"
                      type="number"
                      min="1"
                      step="0.01"
                      class="field__input"
                      placeholder="450"
                      required
                    />
                  </div>
                  <div class="field">
                    <label class="field__label">Cuota N</label>
                    <input
                      v-model.number="linkForm.installment_number"
                      type="number"
                      min="1"
                      class="field__input"
                      placeholder="2"
                    />
                  </div>
                  <div class="field">
                    <label class="field__label">de N total</label>
                    <input
                      v-model.number="linkForm.installment_total"
                      type="number"
                      min="1"
                      class="field__input"
                      placeholder="3"
                    />
                  </div>
                </div>

                <AppButton type="submit" size="sm" :loading="linkLoading">
                  <Link2 :size="14" />
                  Generar enlace
                </AppButton>
              </form>

              <!-- Generated link result -->
              <div v-if="generatedUrl" class="generated-link">
                <span class="generated-link__url">{{ generatedUrl }}</span>
                <button class="generated-link__copy" @click="copyLink" :title="copied ? 'Copiado' : 'Copiar'">
                  <Check v-if="copied" :size="14" />
                  <Copy v-else :size="14" />
                </button>
                <a :href="generatedUrl" target="_blank" rel="noopener noreferrer" class="generated-link__open">
                  <ExternalLink :size="14" />
                </a>
              </div>
            </div>

          </template>
        </div>
      </transition>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import {
  Search, Users, X, Repeat, ShoppingBag, CalendarClock,
  Link2, ExternalLink, Copy, Check, BookOpen, Receipt, FileText,
} from 'lucide-vue-next'
import { useApi } from '@/composables/useApi'
import { useToastStore } from '@/stores/toast'
import AppCard    from '@/components/ui/AppCard.vue'
import AppBadge   from '@/components/ui/AppBadge.vue'
import AppButton  from '@/components/ui/AppButton.vue'
import AppSpinner from '@/components/ui/AppSpinner.vue'

const api   = useApi()
const toast = useToastStore()

// ── List state ─────────────────────────────────────────────────────────────
const clients = ref([])
const loading = ref(true)
const total   = ref(0)
const page    = ref(1)
const limit   = 30

const search         = ref('')
const selectedStatus = ref('')
const selectedPlan   = ref('')

const statusTabs = [
  { value: '',          label: 'Todos' },
  { value: 'active',    label: 'Activos' },
  { value: 'pending',   label: 'Pendientes' },
  { value: 'suspended', label: 'Suspendidos' },
]

const planTabs = [
  { value: '',                label: 'Todos los planes' },
  { value: 'course',          label: 'Curso' },
  { value: 'bolsa',           label: 'Bolsa' },
  { value: 'despacho-digital', label: 'Despacho Digital' },
]

const totalPages = computed(() => Math.ceil(total.value / limit))

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  if (!q) return clients.value
  return clients.value.filter(c =>
    c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
  )
})

// Pre-compute total spend per client from detail cache
const spendCache = ref({})
function spendLabel(id) {
  const s = spendCache.value[id]
  return s != null ? formatAmount(s) : '—'
}

async function fetchClients() {
  loading.value = true
  try {
    const params = new URLSearchParams({ page: page.value, limit })
    if (selectedStatus.value) params.set('status', selectedStatus.value)
    if (selectedPlan.value)   params.set('plan',   selectedPlan.value)

    const res = await api.get(`/admin/clients?${params}`)
    clients.value = res.data ?? []
    total.value   = res.total ?? 0
  } catch {
    toast.error('No se pudieron cargar los clientes')
  } finally {
    loading.value = false
  }
}

function selectStatus(val) {
  selectedStatus.value = val
  page.value = 1
  fetchClients()
}
function selectPlan(val) {
  selectedPlan.value = val
  page.value = 1
  fetchClients()
}
function changePage(p) {
  page.value = p
  fetchClients()
}

onMounted(fetchClients)

// ── Detail panel ───────────────────────────────────────────────────────────
const selected      = ref(null)
const detail        = ref(null)
const detailLoading = ref(false)

async function openDetail(client) {
  selected.value      = client
  detail.value        = null
  detailLoading.value = true
  generatedUrl.value  = ''
  linkForm.value      = { label: '', amount: null, installment_number: null, installment_total: null }
  officeForm.value    = { office_url: '', office_status: 'not_requested', office_plan: '', office_instance_id: '' }

  try {
    const res = await api.get(`/admin/clients/${client._id}`)
    detail.value = res.data
    officeForm.value = {
      office_url: detail.value.client?.office_url ?? '',
      office_status: detail.value.client?.office_status ?? 'not_requested',
      office_plan: detail.value.client?.office_plan ?? '',
      office_instance_id: detail.value.client?.office_instance_id ?? '',
    }

    // Cache total spend
    const total_spend = (res.data.payments ?? []).reduce((s, p) => s + (p.amount ?? 0), 0)
    spendCache.value[client._id] = total_spend
  } catch {
    toast.error('No se pudo cargar el detalle del cliente')
  } finally {
    detailLoading.value = false
  }
}

const totalSpend = computed(() => {
  if (!detail.value?.payments?.length) return '—'
  const sum = detail.value.payments.reduce((s, p) => s + (p.amount ?? 0), 0)
  return formatAmount(sum)
})

// ── Payment link ───────────────────────────────────────────────────────────
const linkForm = ref({ label: '', amount: null, installment_number: null, installment_total: null })
const linkLoading   = ref(false)
const generatedUrl  = ref('')
const copied        = ref(false)
const officeLoading = ref(false)
const officeForm = ref({
  office_url: '',
  office_status: 'not_requested',
  office_plan: '',
  office_instance_id: '',
})

async function generateLink() {
  if (!linkForm.value.label || !linkForm.value.amount) return
  linkLoading.value = true
  generatedUrl.value = ''

  try {
    const body = {
      client_id: selected.value._id,
      label:     linkForm.value.label,
      amount:    linkForm.value.amount,
    }
    if (linkForm.value.installment_number) body.installment_number = linkForm.value.installment_number
    if (linkForm.value.installment_total)  body.installment_total  = linkForm.value.installment_total

    const res = await api.post('/admin/payment-links', body)
    generatedUrl.value = res.url
    toast.success('Enlace generado')
  } catch (err) {
    toast.error(err.message ?? 'No se pudo generar el enlace')
  } finally {
    linkLoading.value = false
  }
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(generatedUrl.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    toast.error('No se pudo copiar al portapapeles')
  }
}

async function saveOffice() {
  if (!selected.value?._id) return
  officeLoading.value = true
  try {
    const res = await api.patch(`/admin/clients/${selected.value._id}/office`, officeForm.value)
    detail.value = { ...detail.value, client: res.data }
    selected.value = { ...selected.value, ...res.data }
    toast.success('Oficina actualizada')
  } catch (err) {
    toast.error(err.message ?? 'No se pudo actualizar la oficina')
  } finally {
    officeLoading.value = false
  }
}

// ── Formatters & helpers ───────────────────────────────────────────────────
function formatAmount(amount, currency = 'EUR') {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency', currency, minimumFractionDigits: 0,
  }).format(amount)
}

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

function planLabel(p) {
  return {
    latam: 'LATAM', spain: 'España',
    'despacho-digital': 'Despacho Digital',
    course: 'Curso', bolsa: 'Bolsa',
  }[p] ?? p
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

function typeIcon(type) {
  return { course: BookOpen, bolsa: Users, subscription: Repeat, manual: Receipt }[type] ?? FileText
}

function officeStatusLabel(status = 'not_requested') {
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
}

function officeStatusVariant(status = 'not_requested') {
  return {
    live: 'success',
    requested: 'info',
    provisioning: 'warning',
    training: 'warning',
    review: 'warning',
    paused: 'warning',
    error: 'danger',
  }[status] ?? 'default'
}
</script>

<style lang="scss" scoped>
.clients-page {
  display: flex;
  flex-direction: column;
  gap: $space-6;
}

.page-header {
  display: flex;
  flex-direction: column;
  gap: $space-1;
}
.page-title   { font-size: $text-3xl; font-weight: $fw-bold; letter-spacing: -0.02em; }
.page-subtitle { color: $text-muted; font-size: $text-sm; }

// ── Filters ────────────────────────────────────────────────────────────────
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: $space-3;
  align-items: center;

  &__search {
    position: relative;
    flex: 1;
    min-width: 200px;
    max-width: 320px;
  }

  &__search-icon {
    position: absolute;
    left: $space-3;
    top: 50%;
    transform: translateY(-50%);
    color: $text-subtle;
    pointer-events: none;
  }

  &__search-input {
    width: 100%;
    height: 36px;
    padding: 0 $space-3 0 $space-8;
    background: $bg-card;
    border: 1px solid $border;
    border-radius: $radius;
    color: $text;
    font-size: $text-sm;
    outline: none;
    transition: $transition;

    &::placeholder { color: $text-subtle; }
    &:focus { border-color: $primary; box-shadow: 0 0 0 3px $primary-glow; }
  }

  &__tabs {
    display: flex;
    gap: $space-1;
    background: $bg-card;
    border: 1px solid $border;
    border-radius: $radius;
    padding: 3px;
  }

  &__tab {
    padding: $space-1 $space-3;
    border-radius: $radius-sm;
    border: none;
    background: transparent;
    color: $text-muted;
    font-size: $text-xs;
    font-weight: $fw-medium;
    cursor: pointer;
    transition: $transition-fast;
    white-space: nowrap;

    &:hover { color: $text; }

    &--active {
      background: $primary;
      color: #fff;
    }
  }
}

// ── Layout ─────────────────────────────────────────────────────────────────
.layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: $space-4;
  transition: grid-template-columns 0.25s ease;

  &--split {
    grid-template-columns: 1fr 420px;

    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
    }
  }
}

// ── Table ──────────────────────────────────────────────────────────────────
.table-card { padding: 0; overflow: hidden; }

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

.table-wrapper { overflow-x: auto; }

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
    padding: $space-3 $space-5;
    border-bottom: 1px solid $border;
    font-size: $text-sm;
    color: $text;
    vertical-align: middle;
  }

  &__row {
    cursor: pointer;
    transition: $transition-fast;

    &:hover td   { background: $primary-subtle; }
    &:last-child td { border-bottom: none; }

    &--active td { background: rgba(156, 255, 203, 0.1); }
  }
}

.client-cell {
  display: flex;
  align-items: center;
  gap: $space-3;

  &__avatar {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: rgba(156, 255, 203, 0.15);
    color: $primary;
    font-size: $text-sm;
    font-weight: $fw-bold;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__name  { font-size: $text-sm; font-weight: $fw-medium; color: $text; }
  &__email { font-size: $text-xs; color: $text-muted; }
}

.cell-muted  { color: $text-muted !important; }
.cell-mono   { font-family: $font-mono; font-size: $text-xs !important; }
.cell-amount { font-weight: $fw-semibold; font-variant-numeric: tabular-nums; }

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $space-4;
  padding: $space-4;
  border-top: 1px solid $border;

  &__btn {
    padding: $space-1 $space-3;
    background: $bg-card;
    border: 1px solid $border;
    border-radius: $radius-sm;
    color: $text-muted;
    font-size: $text-sm;
    cursor: pointer;
    transition: $transition-fast;

    &:hover:not(:disabled) { border-color: $primary; color: $primary; }
    &:disabled { opacity: 0.4; cursor: not-allowed; }
  }

  &__info { font-size: $text-sm; color: $text-muted; }
}

// ── Detail panel ───────────────────────────────────────────────────────────
.detail-panel {
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius-xl;
  display: flex;
  flex-direction: column;
  gap: $space-5;
  padding: $space-5;
  overflow-y: auto;
  max-height: calc(100vh - 180px);
  align-self: start;
  position: sticky;
  top: $space-6;

  @media (max-width: 1024px) {
    position: fixed;
    inset: 0;
    max-height: 100dvh;
    border-radius: 0;
    z-index: 50;
    overflow-y: auto;
  }

  &__header {
    display: flex;
    align-items: center;
    gap: $space-3;
  }

  &__avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(156, 255, 203, 0.15);
    color: $primary;
    font-size: $text-lg;
    font-weight: $fw-bold;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__info { flex: 1; min-width: 0; }

  &__name  { font-size: $text-base; font-weight: $fw-semibold; color: $text; }
  &__email { font-size: $text-xs; color: $text-muted; margin-top: 2px; }

  &__company { font-size: $text-xs; color: $text-subtle; }

  &__close {
    width: 32px;
    height: 32px;
    border-radius: $radius-sm;
    border: 1px solid $border;
    background: none;
    color: $text-muted;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: $transition-fast;

    &:hover { border-color: $danger; color: $danger; }
  }

  &__badges {
    display: flex;
    align-items: center;
    gap: $space-2;
    flex-wrap: wrap;
  }

  &__loader {
    display: flex;
    justify-content: center;
    padding: $space-8;
  }
}

.panel-enter-active,
.panel-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.panel-enter-from,
.panel-leave-to    { opacity: 0; transform: translateX(12px); }

// ── Detail sections ────────────────────────────────────────────────────────
.detail-section-title {
  display: flex;
  align-items: center;
  gap: $space-2;
  font-size: $text-sm;
  font-weight: $fw-semibold;
  color: $text-muted;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: $space-3;
}

.detail-sub {
  &__body {
    background: $bg-surface;
    border: 1px solid $border;
    border-radius: $radius-lg;
    overflow: hidden;
  }

  &__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $space-3;
    padding: $space-2 $space-4;
    border-bottom: 1px solid $border;
    font-size: $text-sm;

    &:last-child { border-bottom: none; }

    span:first-child { color: $text-muted; display: flex; align-items: center; gap: $space-1; }

    &--highlight {
      background: rgba(156, 255, 203, 0.05);
      strong { color: $accent; }
    }
  }
}

.detail-empty {
  font-size: $text-sm;
  color: $text-subtle;
  text-align: center;
  padding: $space-6;
  background: $bg-surface;
  border: 1px solid $border;
  border-radius: $radius-lg;
}

.detail-purchases__list {
  display: flex;
  flex-direction: column;
  gap: $space-2;
}

.detail-total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $space-3 $space-4;
  background: rgba(156, 255, 203, 0.06);
  border: 1px solid rgba(156, 255, 203, 0.15);
  border-radius: $radius-lg;
  font-size: $text-sm;
  color: $text-muted;

  strong { color: $primary; font-size: $text-base; font-variant-numeric: tabular-nums; }
}

// ── Purchase row (inside panel) ────────────────────────────────────────────
.detail-office {
  border-top: 1px solid $border;
  padding-top: $space-5;
}

.office-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $space-3;
  padding: $space-3 $space-4;
  background: rgba(143, 179, 255, 0.06);
  border: 1px solid rgba(143, 179, 255, 0.18);
  border-radius: $radius-lg;
  margin-bottom: $space-3;

  &__label {
    display: block;
    font-size: $text-xs;
    color: $text-muted;
    margin-bottom: $space-1;
  }

  &__link {
    display: inline-flex;
    align-items: center;
    gap: $space-1;
    min-height: 32px;
    padding: 0 $space-3;
    border-radius: $radius-sm;
    background: $primary;
    color: #0b1020;
    font-size: $text-xs;
    font-weight: $fw-semibold;
    text-decoration: none;
    white-space: nowrap;
  }
}

.office-form {
  display: flex;
  flex-direction: column;
  gap: $space-3;
}

.purchase-row {
  display: flex;
  align-items: center;
  gap: $space-3;
  padding: $space-2 $space-3;
  background: $bg-surface;
  border: 1px solid $border;
  border-radius: $radius;

  &__icon {
    width: 30px;
    height: 30px;
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
    gap: 1px;
  }

  &__label {
    font-size: $text-xs;
    font-weight: $fw-medium;
    color: $text;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__meta { font-size: 11px; color: $text-subtle; font-family: $font-mono; }

  &__right {
    display: flex;
    align-items: center;
    gap: $space-2;
    flex-shrink: 0;
  }

  &__amount {
    font-size: $text-xs;
    font-weight: $fw-semibold;
    color: $text;
    font-variant-numeric: tabular-nums;
  }

  &__receipt {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: $radius-sm;
    border: 1px solid $border;
    color: $text-subtle;
    text-decoration: none;
    transition: $transition-fast;

    &:hover { border-color: $primary; color: $primary; }
  }
}

// ── Payment link form ──────────────────────────────────────────────────────
.detail-pay-link {
  border-top: 1px solid $border;
  padding-top: $space-5;
}

.pay-link-form {
  display: flex;
  flex-direction: column;
  gap: $space-3;
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 80px 80px;
  gap: $space-2;

  &--office {
    grid-template-columns: 1fr 1fr;
  }
}

.field {
  display: flex;
  flex-direction: column;
  gap: $space-1;

  &__label {
    font-size: $text-xs;
    font-weight: $fw-medium;
    color: $text-muted;
  }

  &__input {
    height: 36px;
    padding: 0 $space-3;
    background: $bg-input;
    border: 1px solid $border;
    border-radius: $radius;
    color: $text;
    font-size: $text-sm;
    outline: none;
    transition: $transition;
    width: 100%;

    &::placeholder { color: $text-subtle; }
    &:focus { border-color: $primary; box-shadow: 0 0 0 3px $primary-glow; }
  }
}

.generated-link {
  display: flex;
  align-items: center;
  gap: $space-2;
  padding: $space-3;
  background: rgba(156, 255, 203, 0.06);
  border: 1px solid rgba(156, 255, 203, 0.2);
  border-radius: $radius-lg;
  margin-top: $space-2;

  &__url {
    flex: 1;
    font-size: 11px;
    font-family: $font-mono;
    color: $accent;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__copy,
  &__open {
    width: 28px;
    height: 28px;
    border-radius: $radius-sm;
    border: 1px solid rgba(156, 255, 203, 0.3);
    background: none;
    color: $accent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    flex-shrink: 0;
    transition: $transition-fast;

    &:hover { background: rgba(156, 255, 203, 0.12); }
  }
}
</style>
