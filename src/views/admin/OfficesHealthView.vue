<template>
  <div class="offices-health">

    <div class="page-header">
      <div>
        <h1 class="page-title">Salud de oficinas</h1>
        <p class="page-subtitle">Estado y consumo de cada instancia desplegada</p>
      </div>
      <div class="header-actions">
        <span v-if="cachedAt" class="cache-chip">
          Datos de {{ formatTime(cachedAt) }}
        </span>
        <button class="btn" :disabled="loading" @click="load(true)">
          <RefreshCw :size="14" /> Forzar
        </button>
      </div>
    </div>

    <div v-if="loading && !offices.length" class="grid">
      <div v-for="i in 3" :key="i" class="card card--skeleton" />
    </div>

    <div v-else-if="!offices.length" class="empty">
      <Building2 :size="40" />
      <p>No hay oficinas con <code>office_url</code> configurado todavía.</p>
    </div>

    <div v-else class="grid">
      <article
        v-for="o in offices"
        :key="o.clientId"
        class="card"
        :class="{ 'card--down': !o.reachable, 'card--warn': capWarningLevel(o) === 'warn', 'card--critical': capWarningLevel(o) === 'critical' }"
      >
        <header class="card__header">
          <div class="card__title-block">
            <h2 class="card__title">{{ o.clientName ?? o.officeInstanceId ?? '—' }}</h2>
            <span class="card__subtitle">{{ o.clientEmail }}</span>
          </div>
          <span class="status-chip" :class="`status-chip--${statusVariant(o.officeStatus)}`">
            {{ statusLabel(o.officeStatus) }}
          </span>
        </header>

        <dl class="meta">
          <div><dt>Plan</dt><dd>{{ o.officePlan ?? '—' }}</dd></div>
          <div><dt>Instance ID</dt><dd><code>{{ o.officeInstanceId ?? '—' }}</code></dd></div>
          <div v-if="o.reachable && o.health"><dt>Empleados</dt><dd>{{ o.health.activeEmployees?.join(', ') ?? '—' }}</dd></div>
        </dl>

        <div v-if="!o.reachable" class="alert">
          <AlertCircle :size="16" />
          <span>No alcanzable — {{ o.error ?? 'sin detalle' }}</span>
        </div>

        <template v-else-if="o.health">
          <div class="usage">
            <div class="usage__row">
              <span class="usage__label">Gasto del mes</span>
              <span class="usage__value">
                ${{ o.health.monthlyUsd?.toFixed(2) ?? '0.00' }}
                <small v-if="o.health.capUsd">/ ${{ o.health.capUsd.toFixed(2) }}</small>
              </span>
            </div>
            <div v-if="o.health.capPercent != null" class="usage__bar">
              <div
                class="usage__bar-fill"
                :class="`usage__bar-fill--${capWarningLevel(o)}`"
                :style="{ width: `${Math.min(100, o.health.capPercent)}%` }"
              />
            </div>
            <span v-if="o.health.capPercent != null" class="usage__pct">{{ o.health.capPercent }}% del cap</span>
          </div>

          <div class="last-event">
            <Activity :size="14" />
            <span v-if="o.health.lastEvent">
              <strong>{{ o.health.lastEvent.type }}</strong> ({{ o.health.lastEvent.from }}) — {{ formatTime(o.health.lastEvent.createdAt) }}
            </span>
            <span v-else class="last-event--idle">Sin eventos recientes</span>
          </div>

          <div v-if="o.health.lastTrainingEventAt" class="hint">
            <BookOpen :size="12" />
            Último entrenamiento: {{ formatTime(o.health.lastTrainingEventAt) }}
          </div>
        </template>

        <footer class="card__footer">
          <a v-if="o.officeUrl" :href="o.officeUrl" target="_blank" rel="noopener" class="btn btn--ghost">
            Abrir oficina <ExternalLink :size="12" />
          </a>
        </footer>
      </article>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  RefreshCw, Building2, AlertCircle, Activity, ExternalLink, BookOpen,
} from 'lucide-vue-next'
import { useApi } from '@/composables/useApi'
import { useToastStore } from '@/stores/toast'

const api = useApi()
const toast = useToastStore()

const offices = ref([])
const cachedAt = ref(null)
const loading = ref(false)

onMounted(() => load(false))

async function load(force) {
  loading.value = true
  try {
    const res = await api.get(`/admin/offices/health${force ? '?force=1' : ''}`)
    offices.value = res.data ?? []
    cachedAt.value = res.cachedAt ?? null
  } catch (err) {
    toast.error(err?.message ?? 'No se pudo cargar la salud de oficinas')
  } finally {
    loading.value = false
  }
}

function capWarningLevel(o) {
  const pct = o?.health?.capPercent
  if (pct == null) return 'ok'
  if (pct >= 90) return 'critical'
  if (pct >= 70) return 'warn'
  return 'ok'
}

function statusLabel(s) {
  return {
    not_requested: 'Sin solicitar',
    requested: 'Solicitada',
    provisioning: 'Provisionando',
    training: 'Entrenando',
    review: 'En revisión',
    live: 'Activa',
    paused: 'Pausada',
    error: 'Error',
  }[s] ?? s ?? '—'
}

function statusVariant(s) {
  return {
    live: 'success',
    requested: 'info',
    provisioning: 'warning',
    training: 'warning',
    review: 'warning',
    paused: 'warning',
    error: 'danger',
    not_requested: 'muted',
  }[s] ?? 'muted'
}

function formatTime(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })
}
</script>

<style lang="scss" scoped>
.offices-health {
  display: flex;
  flex-direction: column;
  gap: $space-6;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: $space-4;
}

.header-actions {
  display: flex;
  gap: $space-2;
  align-items: center;
}

.cache-chip {
  font-size: $text-xs;
  color: $text-subtle;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: $space-2;
  padding: 0 $space-3;
  height: 32px;
  border-radius: $radius;
  font-size: $text-xs;
  font-weight: $fw-medium;
  background: $bg-card;
  border: 1px solid $border;
  color: $text;
  cursor: pointer;

  &:disabled { opacity: 0.5; cursor: not-allowed; }
  &--ghost { background: transparent; }
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-3;
  padding: $space-10;
  color: $text-subtle;
  border: 1px dashed $border;
  border-radius: $radius-lg;
  background: $bg-card;
}

.grid {
  display: grid;
  gap: $space-4;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
}

.card {
  display: flex;
  flex-direction: column;
  gap: $space-4;
  padding: $space-4 $space-5;
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius-lg;

  &--skeleton { height: 220px; animation: shimmer 1.5s infinite; }
  &--down     { border-color: rgba(255, 102, 102, 0.4); }
  &--warn     { border-color: rgba(255, 211, 138, 0.45); }
  &--critical { border-color: rgba(255, 102, 102, 0.55); background: rgba(255, 102, 102, 0.04); }

  &__header {
    display: flex;
    justify-content: space-between;
    gap: $space-3;
    align-items: flex-start;
  }
  &__title-block { min-width: 0; }
  &__title {
    font-size: $text-base;
    font-weight: $fw-semibold;
    color: $text;
    word-break: break-word;
  }
  &__subtitle {
    font-size: $text-xs;
    color: $text-muted;
  }
  &__footer {
    margin-top: auto;
    display: flex;
    gap: $space-2;
  }
}

.status-chip {
  font-size: $text-xs;
  font-weight: $fw-semibold;
  padding: 2px $space-2;
  border-radius: $radius-full;
  white-space: nowrap;

  &--success { background: $success-bg; color: $success; }
  &--info    { background: $info-bg;    color: $info; }
  &--warning { background: $warning-bg; color: $warning; }
  &--danger  { background: $danger-bg;  color: $danger; }
  &--muted   { background: $bg-card-2;  color: $text-muted; border: 1px solid $border; }
}

.meta {
  display: grid;
  gap: $space-2;
  margin: 0;

  div { display: flex; justify-content: space-between; font-size: $text-xs; gap: $space-3; }
  dt  { color: $text-muted; }
  dd  { color: $text; margin: 0; text-align: right; }
  code { font-family: $font-mono; font-size: $text-xs; color: $primary-light; }
}

.alert {
  display: flex;
  gap: $space-2;
  align-items: center;
  padding: $space-2 $space-3;
  background: $danger-bg;
  color: $danger;
  border-radius: $radius;
  font-size: $text-xs;
}

.usage {
  display: flex;
  flex-direction: column;
  gap: $space-2;

  &__row {
    display: flex;
    justify-content: space-between;
    font-size: $text-sm;
  }
  &__label { color: $text-muted; }
  &__value { font-weight: $fw-semibold; font-variant-numeric: tabular-nums; small { color: $text-subtle; font-weight: $fw-regular; } }
  &__bar {
    width: 100%;
    height: 6px;
    background: $bg-card-2;
    border-radius: $radius-full;
    overflow: hidden;
  }
  &__bar-fill {
    height: 100%;
    transition: width 0.3s;
    &--ok       { background: $success; }
    &--warn     { background: $warning; }
    &--critical { background: $danger; }
  }
  &__pct { font-size: $text-xs; color: $text-subtle; align-self: flex-end; }
}

.last-event {
  display: flex;
  align-items: center;
  gap: $space-2;
  font-size: $text-xs;
  color: $text-muted;

  strong { color: $text; }
  &--idle { color: $text-subtle; font-style: italic; }
}

.hint {
  display: flex;
  gap: $space-2;
  align-items: center;
  font-size: $text-xs;
  color: $text-subtle;
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
