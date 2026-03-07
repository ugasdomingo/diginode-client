<template>
  <div class="dashboard">
    <div class="page-header">
      <h1 class="page-title">Dashboard</h1>
      <p class="page-subtitle">Resumen general de tu agencia</p>
    </div>

    <!-- Stats -->
    <div v-if="loading" class="stats-grid">
      <div v-for="i in 4" :key="i" class="stat-card stat-card--skeleton" />
    </div>

    <div v-else class="stats-grid">
      <div class="stat-card" v-for="stat in stats" :key="stat.label">
        <div class="stat-card__icon" :style="{ background: stat.bg }">
          <component :is="stat.icon" :size="18" :style="{ color: stat.color }" />
        </div>
        <div class="stat-card__body">
          <span class="stat-card__value">{{ stat.value }}</span>
          <span class="stat-card__label">{{ stat.label }}</span>
        </div>
        <div class="stat-card__trend" v-if="stat.trend">
          <TrendingUp :size="12" />
          {{ stat.trend }}
        </div>
      </div>
    </div>

    <!-- Bottom grid -->
    <div class="dashboard__grid">
      <!-- Leads recientes -->
      <AppCard class="dashboard__panel">
        <div class="panel-header">
          <h3 class="panel-title">Leads recientes</h3>
          <RouterLink to="/admin/leads" class="panel-link">
            Ver todos <ArrowRight :size="14" />
          </RouterLink>
        </div>

        <div v-if="loadingLeads" class="panel-loader">
          <AppSpinner />
        </div>

        <div v-else-if="leads.length === 0" class="panel-empty">
          <Users :size="32" class="panel-empty__icon" />
          <p>Sin leads aún</p>
        </div>

        <div v-else class="leads-list">
          <div v-for="lead in leads" :key="lead._id" class="lead-row">
            <div class="lead-row__avatar">
              {{ (lead.name || lead.contact_id).charAt(0).toUpperCase() }}
            </div>
            <div class="lead-row__info">
              <span class="lead-row__name">{{ lead.name || lead.contact_id }}</span>
              <span class="lead-row__platform">{{ lead.platform }}</span>
            </div>
            <AppBadge :variant="statusVariant(lead.status)">
              {{ statusLabel(lead.status) }}
            </AppBadge>
          </div>
        </div>
      </AppCard>

      <!-- Contenido pendiente -->
      <AppCard class="dashboard__panel">
        <div class="panel-header">
          <h3 class="panel-title">Contenido pendiente</h3>
          <RouterLink to="/admin/content" class="panel-link">
            Ver todo <ArrowRight :size="14" />
          </RouterLink>
        </div>

        <div v-if="loadingContent" class="panel-loader">
          <AppSpinner />
        </div>

        <div v-else-if="draftContent.length === 0" class="panel-empty">
          <LayoutGrid :size="32" class="panel-empty__icon" />
          <p>Sin borradores</p>
        </div>

        <div v-else class="content-list">
          <div v-for="post in draftContent" :key="post._id" class="content-row">
            <div class="content-row__platform">
              <component :is="platformIcon(post.platform)" :size="14" />
            </div>
            <div class="content-row__info">
              <span class="content-row__copy">{{ post.copy?.slice(0, 55) }}{{ post.copy?.length > 55 ? '…' : '' }}</span>
              <span class="content-row__theme">{{ post.theme }}</span>
            </div>
            <AppBadge variant="warning">Borrador</AppBadge>
          </div>
        </div>
      </AppCard>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  Users, LayoutGrid, TicketCheck, TrendingUp,
  ArrowRight, Instagram, Linkedin, Twitter, Monitor,
} from 'lucide-vue-next'
import { useApi } from '@/composables/useApi'
import { useToastStore } from '@/stores/toast'
import AppCard    from '@/components/ui/AppCard.vue'
import AppBadge   from '@/components/ui/AppBadge.vue'
import AppSpinner from '@/components/ui/AppSpinner.vue'

const api   = useApi()
const toast = useToastStore()

const loading        = ref(true)
const loadingLeads   = ref(true)
const loadingContent = ref(true)

const dashData    = ref(null)
const leads       = ref([])
const draftContent = ref([])

const stats = computed(() => {
  if (!dashData.value) return []
  const d = dashData.value
  return [
    {
      label: 'Total leads',
      value: d.total_leads ?? 0,
      icon: Users,
      color: '#818cf8',
      bg: 'rgba(129,140,248,0.1)',
      trend: null,
    },
    {
      label: 'Clientes activos',
      value: d.active_clients ?? 0,
      icon: TrendingUp,
      color: '#34d399',
      bg: 'rgba(52,211,153,0.1)',
      trend: null,
    },
    {
      label: 'Tickets abiertos',
      value: d.open_tickets ?? 0,
      icon: TicketCheck,
      color: '#f59e0b',
      bg: 'rgba(245,158,11,0.1)',
      trend: null,
    },
    {
      label: 'Borradores',
      value: d.draft_content ?? 0,
      icon: LayoutGrid,
      color: '#7c6fff',
      bg: 'rgba(124,111,255,0.1)',
      trend: null,
    },
  ]
})

function statusLabel(s) {
  const map = {
    new: 'Nuevo', in_conversation: 'En conversación',
    qualified: 'Calificado', meeting_booked: 'Reunión',
    won: 'Ganado', lost: 'Perdido',
  }
  return map[s] ?? s
}

function statusVariant(s) {
  const map = {
    new: 'info', in_conversation: 'info',
    qualified: 'success', meeting_booked: 'primary',
    won: 'success', lost: 'danger',
  }
  return map[s] ?? 'default'
}

function platformIcon(p) {
  return { instagram: Instagram, linkedin: Linkedin, twitter: Twitter }[p] ?? Monitor
}

onMounted(async () => {
  try {
    dashData.value = await api.get('/admin/dashboard')
  } catch {
    toast.error('No se pudo cargar el dashboard')
  } finally {
    loading.value = false
  }

  try {
    const res = await api.get('/admin/leads?limit=5')
    leads.value = res.leads ?? []
  } catch {
    // silently fail
  } finally {
    loadingLeads.value = false
  }

  try {
    const res = await api.get('/admin/content?status=draft&limit=5')
    draftContent.value = res.posts ?? []
  } catch {
    // silently fail
  } finally {
    loadingContent.value = false
  }
})
</script>

<style lang="scss" scoped>
.dashboard {
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

// Stats grid
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: $space-4;
}

.stat-card {
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius-lg;
  padding: $space-5;
  display: flex;
  align-items: flex-start;
  gap: $space-4;
  transition: $transition;
  position: relative;

  &:hover {
    border-color: $border-hover;
  }

  &--skeleton {
    height: 88px;
    background: linear-gradient(90deg, $bg-card 25%, $bg-card-2 50%, $bg-card 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-color: $border;
  }

  &__icon {
    width: 40px;
    height: 40px;
    border-radius: $radius;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: $space-1;
  }

  &__value {
    font-size: $text-2xl;
    font-weight: $fw-bold;
    color: $text;
    line-height: 1;
    font-variant-numeric: tabular-nums;
  }

  &__label {
    font-size: $text-sm;
    color: $text-muted;
  }

  &__trend {
    position: absolute;
    top: $space-4;
    right: $space-4;
    display: flex;
    align-items: center;
    gap: $space-1;
    font-size: $text-xs;
    color: $accent;
  }
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

// Bottom grid
.dashboard__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: $space-6;
}

.dashboard__panel {
  padding: $space-5;
}

// Panel header
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $space-5;
}

.panel-title {
  font-size: $text-base;
  font-weight: $fw-semibold;
  color: $text;
}

.panel-link {
  display: flex;
  align-items: center;
  gap: $space-1;
  font-size: $text-xs;
  color: $primary;
  text-decoration: none;
  font-weight: $fw-medium;
  transition: $transition-fast;

  &:hover {
    color: $primary-light;
    gap: $space-2;
  }
}

.panel-loader {
  display: flex;
  justify-content: center;
  padding: $space-8;
}

.panel-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-2;
  padding: $space-8 0;
  color: $text-subtle;
  font-size: $text-sm;

  &__icon {
    color: $text-subtle;
    opacity: 0.5;
  }
}

// Leads list
.leads-list {
  display: flex;
  flex-direction: column;
  gap: $space-1;
}

.lead-row {
  display: flex;
  align-items: center;
  gap: $space-3;
  padding: $space-3;
  border-radius: $radius;
  transition: $transition-fast;

  &:hover {
    background: $primary-subtle;
  }

  &__avatar {
    width: 32px;
    height: 32px;
    border-radius: $radius-full;
    background: $bg-card-2;
    border: 1px solid $border;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: $text-xs;
    font-weight: $fw-semibold;
    color: $primary-light;
    flex-shrink: 0;
  }

  &__info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  &__name {
    font-size: $text-sm;
    font-weight: $fw-medium;
    color: $text;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__platform {
    font-size: $text-xs;
    color: $text-muted;
    text-transform: capitalize;
  }
}

// Content list
.content-list {
  display: flex;
  flex-direction: column;
  gap: $space-1;
}

.content-row {
  display: flex;
  align-items: center;
  gap: $space-3;
  padding: $space-3;
  border-radius: $radius;
  transition: $transition-fast;

  &:hover {
    background: $primary-subtle;
  }

  &__platform {
    width: 28px;
    height: 28px;
    border-radius: $radius-sm;
    background: $bg-card-2;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $text-muted;
    flex-shrink: 0;
  }

  &__info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  &__copy {
    font-size: $text-sm;
    color: $text;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__theme {
    font-size: $text-xs;
    color: $text-muted;
  }
}
</style>
