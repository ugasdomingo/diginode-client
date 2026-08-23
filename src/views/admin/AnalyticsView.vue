<template>
  <div class="analytics-page">

    <div class="page-header">
      <div>
        <h1 class="page-title">Visitas</h1>
        <p class="page-subtitle">Tráfico de la web pública · datos anónimos, sin cookies</p>
      </div>
      <div class="range-picker">
        <button
          v-for="opt in RANGES"
          :key="opt.days"
          type="button"
          class="range-picker__btn"
          :class="{ 'range-picker__btn--active': days === opt.days }"
          @click="setRange(opt.days)"
        >
          {{ opt.label }}
        </button>
      </div>
    </div>

    <!-- Skeleton -->
    <template v-if="loading">
      <div class="stats-grid">
        <div v-for="i in 4" :key="i" class="stat-card stat-card--skeleton" />
      </div>
      <div class="skeleton-block" />
    </template>

    <template v-else-if="data">
      <!-- Totales -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-card__icon stat-card__icon--blue"><Users :size="18" /></div>
          <div class="stat-card__body">
            <span class="stat-card__value">{{ data.totals.visitors }}</span>
            <span class="stat-card__label">Personas</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-card__icon stat-card__icon--orange"><Eye :size="18" /></div>
          <div class="stat-card__body">
            <span class="stat-card__value">{{ data.totals.views }}</span>
            <span class="stat-card__label">Páginas vistas</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-card__icon stat-card__icon--teal"><Clock :size="18" /></div>
          <div class="stat-card__body">
            <span class="stat-card__value">{{ formatDuration(data.totals.avg_seconds) }}</span>
            <span class="stat-card__label">Tiempo medio por página</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-card__icon stat-card__icon--blue"><MousePointerClick :size="18" /></div>
          <div class="stat-card__body">
            <span class="stat-card__value">{{ data.totals.sessions }}</span>
            <span class="stat-card__label">Sesiones</span>
          </div>
        </div>
      </div>

      <!-- Evolución diaria -->
      <section class="panel">
        <h3 class="panel-title">
          <TrendingUp :size="16" />
          Visitas por día
        </h3>
        <div v-if="!data.by_day.length" class="panel-empty">
          Sin visitas registradas en este periodo.
        </div>
        <div v-else class="chart">
          <div
            v-for="d in data.by_day"
            :key="d.date"
            class="chart__col"
            :title="`${formatDay(d.date)} · ${d.views} vistas · ${d.visitors} personas`"
          >
            <div class="chart__bar" :style="{ height: barHeight(d.views) }" />
            <span class="chart__label">{{ shortDay(d.date) }}</span>
          </div>
        </div>
      </section>

      <!-- Embudo de la landing -->
      <section class="panel">
        <h3 class="panel-title">
          <Ticket :size="16" />
          Landing del taller
        </h3>
        <div v-if="!data.landing_funnel.views" class="panel-empty">
          Aún nadie ha visitado la landing del taller en este periodo.
        </div>
        <div v-else class="funnel">
          <div class="funnel__step">
            <span class="funnel__value">{{ data.landing_funnel.visitors }}</span>
            <span class="funnel__label">Personas que la vieron</span>
          </div>
          <ChevronRight :size="18" class="funnel__arrow" />
          <div class="funnel__step">
            <span class="funnel__value">{{ data.landing_funnel.checkout_clicks }}</span>
            <span class="funnel__label">Pulsaron «Reservar»</span>
            <span class="funnel__rate">{{ data.landing_funnel.click_rate }}%</span>
          </div>
          <ChevronRight :size="18" class="funnel__arrow" />
          <div class="funnel__step funnel__step--win">
            <span class="funnel__value">{{ data.landing_funnel.purchases }}</span>
            <span class="funnel__label">Completaron el pago</span>
            <span class="funnel__rate">{{ data.landing_funnel.purchase_rate }}%</span>
          </div>
        </div>
      </section>

      <div class="two-col">
        <!-- Páginas -->
        <section class="panel">
          <h3 class="panel-title">
            <FileText :size="16" />
            Páginas más vistas
          </h3>
          <div v-if="!data.by_path.length" class="panel-empty">Sin datos.</div>
          <table v-else class="table">
            <thead>
              <tr>
                <th>Página</th>
                <th class="num">Vistas</th>
                <th class="num">Tiempo</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in data.by_path" :key="p.path">
                <td class="table__path" :title="p.path">{{ p.path }}</td>
                <td class="num">{{ p.views }}</td>
                <td class="num">{{ formatDuration(p.avg_seconds) }}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <div class="side-stack">
          <!-- Origen -->
          <section class="panel">
            <h3 class="panel-title">
              <Share2 :size="16" />
              De dónde llegan
            </h3>
            <div v-if="!data.by_source.length" class="panel-empty">Sin datos.</div>
            <div v-else class="bars">
              <div v-for="s in data.by_source" :key="s.source" class="bars__row">
                <span class="bars__label">{{ sourceLabel(s.source) }}</span>
                <div class="bars__track">
                  <div class="bars__fill" :style="{ width: share(s.views, data.by_source) }" />
                </div>
                <span class="bars__value">{{ s.views }}</span>
              </div>
            </div>
          </section>

          <!-- Dispositivo -->
          <section class="panel">
            <h3 class="panel-title">
              <Smartphone :size="16" />
              Desde qué dispositivo
            </h3>
            <div v-if="!data.by_device.length" class="panel-empty">Sin datos.</div>
            <div v-else class="bars">
              <div v-for="d in data.by_device" :key="d.device" class="bars__row">
                <span class="bars__label">{{ deviceLabel(d.device) }}</span>
                <div class="bars__track">
                  <div class="bars__fill bars__fill--alt" :style="{ width: share(d.views, data.by_device) }" />
                </div>
                <span class="bars__value">{{ d.views }}</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      <p class="privacy-note">
        <ShieldCheck :size="14" />
        Medición propia y anónima: no se usan cookies, no se guarda ninguna dirección IP
        y los datos se borran solos a los 90 días. Por eso la web no necesita banner de cookies.
      </p>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import {
  Users, Eye, Clock, MousePointerClick, TrendingUp, Ticket,
  FileText, Share2, Smartphone, ChevronRight, ShieldCheck,
} from 'lucide-vue-next'
import { useApi } from '@/composables/useApi'
import { useToastStore } from '@/stores/toast'

const RANGES = [
  { days: 7,  label: '7 días' },
  { days: 30, label: '30 días' },
  { days: 90, label: '90 días' },
]

const api   = useApi()
const toast = useToastStore()

const data    = ref(null)
const loading = ref(true)
const days    = ref(30)

onMounted(load)

async function load() {
  loading.value = true
  try {
    const res = await api.get(`/admin/analytics?days=${days.value}`)
    data.value = res.data
  } catch {
    toast.error('No se pudieron cargar las visitas')
  } finally {
    loading.value = false
  }
}

function setRange(d) {
  if (days.value === d) return
  days.value = d
  load()
}

// ── Helpers ────────────────────────────────────────────────────────────────

const maxViews = computed(() =>
  Math.max(...(data.value?.by_day ?? []).map(d => d.views), 1)
)

function barHeight(views) {
  // Mínimo visible para que un día con 1 visita no parezca cero.
  return `${Math.max((views / maxViews.value) * 100, 4)}%`
}

function share(value, list) {
  const total = list.reduce((sum, i) => sum + i.views, 0)
  return total ? `${Math.max((value / total) * 100, 2)}%` : '0%'
}

function formatDuration(seconds) {
  if (!seconds) return '—'
  if (seconds < 60) return `${seconds}s`
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return s ? `${m}m ${s}s` : `${m}m`
}

function formatDay(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long',
  })
}

function shortDay(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })
}

function sourceLabel(s) {
  return {
    directo: 'Directo (flyer, escrito a mano)',
    instagram: 'Instagram',
    facebook: 'Facebook',
    google: 'Google',
    whatsapp: 'WhatsApp',
    otro: 'Otras webs',
  }[s] ?? s
}

function deviceLabel(d) {
  return { movil: 'Móvil', escritorio: 'Escritorio', tablet: 'Tablet' }[d] ?? d
}
</script>

<style lang="scss" scoped>
.analytics-page {
  display: flex;
  flex-direction: column;
  gap: $space-6;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: $space-4;
  flex-wrap: wrap;
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

// ── Selector de rango ──────────────────────────────────────────────────────
.range-picker {
  display: flex;
  gap: $space-1;
  padding: $space-1;
  background: $bg-surface;
  border: 1px solid $border;
  border-radius: $radius;

  &__btn {
    padding: $space-2 $space-3;
    background: none;
    border: 0;
    border-radius: $radius-sm;
    font-family: inherit;
    font-size: $text-xs;
    font-weight: $fw-medium;
    color: $text-muted;
    cursor: pointer;
    transition: $transition-fast;

    &:hover { color: $text; }

    &--active {
      background: $primary-subtle;
      color: $primary-light;
    }
  }
}

// ── Tarjetas ───────────────────────────────────────────────────────────────
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: $space-4;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: $space-4;
  padding: $space-5;
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius-lg;

  &--skeleton {
    height: 88px;
    opacity: 0.5;
  }

  &__icon {
    width: 40px;
    height: 40px;
    border-radius: $radius;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    &--blue   { background: $primary-subtle; color: $primary-light; }
    &--orange { background: $accent-subtle;  color: $accent; }
    &--teal   { background: $success-bg;     color: $success; }
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  &__value {
    font-family: $font-display;
    font-size: $text-2xl;
    font-weight: $fw-bold;
    color: $text;
    font-variant-numeric: tabular-nums;
  }

  &__label {
    font-size: $text-xs;
    color: $text-muted;
  }
}

.skeleton-block {
  height: 220px;
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius-lg;
  opacity: 0.5;
}

// ── Paneles ────────────────────────────────────────────────────────────────
.panel {
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius-lg;
  padding: $space-5;
  display: flex;
  flex-direction: column;
  gap: $space-4;
  min-width: 0;
}

.panel-title {
  display: flex;
  align-items: center;
  gap: $space-2;
  font-size: $text-base;
  font-weight: $fw-semibold;
  color: $text;

  svg { color: $primary-light; }
}

.panel-empty {
  padding: $space-6 0;
  text-align: center;
  font-size: $text-sm;
  color: $text-subtle;
}

.two-col {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: $space-4;
  align-items: start;

  @media (max-width: $bp-lg) {
    grid-template-columns: 1fr;
  }
}

.side-stack {
  display: flex;
  flex-direction: column;
  gap: $space-4;
  min-width: 0;
}

// ── Gráfico de barras ──────────────────────────────────────────────────────
.chart {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 180px;
  overflow-x: auto;
  padding-bottom: $space-5;

  &__col {
    flex: 1;
    min-width: 14px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    position: relative;
  }

  &__bar {
    width: 100%;
    background: linear-gradient(180deg, $primary 0%, $primary-dark 100%);
    border-radius: $radius-sm $radius-sm 0 0;
    transition: $transition;
    min-height: 3px;

    &:hover { background: $primary-light; }
  }

  &__label {
    position: absolute;
    bottom: -$space-5;
    font-size: 9px;
    color: $text-subtle;
    white-space: nowrap;
    font-family: $font-mono;
  }
}

// ── Embudo ─────────────────────────────────────────────────────────────────
.funnel {
  display: flex;
  align-items: center;
  gap: $space-3;
  flex-wrap: wrap;

  &__step {
    flex: 1;
    min-width: 130px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: $space-4;
    background: $bg-surface;
    border: 1px solid $border;
    border-radius: $radius;

    &--win {
      border-color: rgba(32, 213, 210, 0.35);
      background: $success-bg;
    }
  }

  &__value {
    font-family: $font-display;
    font-size: $text-2xl;
    font-weight: $fw-bold;
    color: $text;
    font-variant-numeric: tabular-nums;
  }

  &__label {
    font-size: $text-xs;
    color: $text-muted;
  }

  &__rate {
    font-size: $text-xs;
    font-weight: $fw-semibold;
    color: $accent;
    font-variant-numeric: tabular-nums;
  }

  &__arrow {
    color: $text-subtle;
    flex-shrink: 0;
  }
}

// ── Tabla ──────────────────────────────────────────────────────────────────
.table {
  width: 100%;
  border-collapse: collapse;
  font-size: $text-sm;

  th {
    text-align: left;
    padding: $space-2 $space-3;
    font-size: $text-xs;
    font-weight: $fw-semibold;
    color: $text-muted;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 1px solid $border;
  }

  td {
    padding: $space-3;
    border-bottom: 1px solid $border;
    color: $text;
  }

  tr:last-child td { border-bottom: none; }

  .num {
    text-align: right;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  &__path {
    font-family: $font-mono;
    font-size: $text-xs;
    color: $text-muted;
    max-width: 260px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

// ── Barras horizontales ────────────────────────────────────────────────────
.bars {
  display: flex;
  flex-direction: column;
  gap: $space-3;

  &__row {
    display: grid;
    grid-template-columns: 1fr 80px auto;
    align-items: center;
    gap: $space-3;
  }

  &__label {
    font-size: $text-xs;
    color: $text-muted;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__track {
    height: 6px;
    background: $bg-surface;
    border-radius: $radius-full;
    overflow: hidden;
  }

  &__fill {
    height: 100%;
    background: $primary;
    border-radius: $radius-full;

    &--alt { background: $accent; }
  }

  &__value {
    font-size: $text-xs;
    font-weight: $fw-semibold;
    color: $text;
    font-variant-numeric: tabular-nums;
  }
}

// ── Nota de privacidad ─────────────────────────────────────────────────────
.privacy-note {
  display: flex;
  align-items: flex-start;
  gap: $space-2;
  padding: $space-3 $space-4;
  background: $success-bg;
  border: 1px solid rgba(32, 213, 210, 0.2);
  border-radius: $radius;
  font-size: $text-xs;
  color: $text-muted;
  line-height: 1.6;

  svg { flex-shrink: 0; margin-top: 2px; color: $success; }
}
</style>
