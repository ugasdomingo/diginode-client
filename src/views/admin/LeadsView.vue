<template>
  <div class="leads-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Leads</h1>
        <p class="page-subtitle">Gestiona tus prospectos y conversaciones</p>
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
          placeholder="Buscar lead..."
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
          <span class="filters__tab-count" v-if="tab.count !== undefined">{{ tab.count }}</span>
        </button>
      </div>
    </div>

    <!-- Table -->
    <AppCard class="table-card">
      <div v-if="loading" class="table-loader">
        <AppSpinner />
      </div>

      <div v-else-if="leads.length === 0" class="table-empty">
        <Users :size="40" />
        <p>Sin leads con este filtro</p>
      </div>

      <div v-else class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>Contacto</th>
              <th>Plataforma</th>
              <th>País</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="lead in leads" :key="lead._id" class="table__row">
              <td>
                <div class="lead-name">
                  <div class="lead-name__avatar">
                    {{ (lead.name || lead.contact_id).charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <p class="lead-name__primary">{{ lead.name || '—' }}</p>
                    <p class="lead-name__secondary">{{ lead.contact_id }}</p>
                  </div>
                </div>
              </td>
              <td>
                <AppBadge variant="default">
                  <component :is="platformIcon(lead.platform)" :size="11" />
                  {{ lead.platform }}
                </AppBadge>
              </td>
              <td class="cell-muted">{{ lead.country || '—' }}</td>
              <td>
                <AppBadge :variant="statusVariant(lead.status)">
                  {{ statusLabel(lead.status) }}
                </AppBadge>
              </td>
              <td class="cell-muted cell-mono">{{ formatDate(lead.created_at) }}</td>
              <td>
                <div class="row-actions">
                  <select
                    class="status-select"
                    :value="lead.status"
                    @change="updateStatus(lead, $event.target.value)"
                    :disabled="updatingId === lead._id"
                  >
                    <option v-for="s in statusOptions" :key="s.value" :value="s.value">
                      {{ s.label }}
                    </option>
                  </select>

                  <AppButton
                    v-if="lead.status === 'won'"
                    size="sm"
                    variant="primary"
                    :loading="convertingId === lead._id"
                    @click="convertLead(lead)"
                    title="Convertir a cliente"
                  >
                    <UserCheck :size="14" />
                  </AppButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination">
        <AppButton variant="secondary" size="sm" :disabled="page === 1" @click="page--">
          <ChevronLeft :size="16" />
        </AppButton>
        <span class="pagination__info">{{ page }} / {{ totalPages }}</span>
        <AppButton variant="secondary" size="sm" :disabled="page === totalPages" @click="page++">
          <ChevronRight :size="16" />
        </AppButton>
      </div>
    </AppCard>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import {
  Search, Users, Instagram, Linkedin, Twitter,
  Monitor, UserCheck, ChevronLeft, ChevronRight,
} from 'lucide-vue-next'
import { useApi } from '@/composables/useApi'
import { useToastStore } from '@/stores/toast'
import AppCard    from '@/components/ui/AppCard.vue'
import AppBadge   from '@/components/ui/AppBadge.vue'
import AppButton  from '@/components/ui/AppButton.vue'
import AppSpinner from '@/components/ui/AppSpinner.vue'

const api   = useApi()
const toast = useToastStore()

const leads        = ref([])
const loading      = ref(true)
const updatingId   = ref(null)
const convertingId = ref(null)
const search       = ref('')
const selectedStatus = ref('')
const page         = ref(1)
const totalPages   = ref(1)

const statusTabs = [
  { value: '', label: 'Todos' },
  { value: 'new', label: 'Nuevos' },
  { value: 'qualified', label: 'Calificados' },
  { value: 'meeting_booked', label: 'Reunión' },
  { value: 'won', label: 'Ganados' },
  { value: 'lost', label: 'Perdidos' },
]

const statusOptions = [
  { value: 'new', label: 'Nuevo' },
  { value: 'in_conversation', label: 'En conversación' },
  { value: 'qualified', label: 'Calificado' },
  { value: 'meeting_booked', label: 'Reunión agendada' },
  { value: 'won', label: 'Ganado' },
  { value: 'lost', label: 'Perdido' },
]

function statusLabel(s) {
  return statusOptions.find(o => o.value === s)?.label ?? s
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

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

function selectStatus(val) {
  selectedStatus.value = val
  page.value = 1
}

async function fetchLeads() {
  loading.value = true
  try {
    const params = new URLSearchParams({ page: page.value, limit: 20 })
    if (selectedStatus.value) params.set('status', selectedStatus.value)

    const res = await api.get(`/admin/leads?${params}`)
    leads.value      = res.leads ?? []
    totalPages.value = res.total_pages ?? 1
  } catch {
    toast.error('Error cargando leads')
  } finally {
    loading.value = false
  }
}

async function updateStatus(lead, newStatus) {
  updatingId.value = lead._id
  try {
    await api.patch(`/admin/leads/${lead._id}`, { status: newStatus })
    lead.status = newStatus
    toast.success('Estado actualizado')
  } catch (err) {
    toast.error(err.message)
  } finally {
    updatingId.value = null
  }
}

async function convertLead(lead) {
  convertingId.value = lead._id
  try {
    await api.post(`/admin/leads/${lead._id}/convert`)
    toast.success('Lead convertido a cliente correctamente')
    fetchLeads()
  } catch (err) {
    toast.error(err.message)
  } finally {
    convertingId.value = null
  }
}

watch([selectedStatus, page], fetchLeads)
onMounted(fetchLeads)
</script>

<style lang="scss" scoped>
.leads-page {
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
  margin-top: $space-1;
}

// Filters
.filters {
  display: flex;
  flex-direction: column;
  gap: $space-3;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }

  &__search {
    position: relative;
    flex-shrink: 0;
    width: 100%;

    @media (min-width: 768px) {
      width: 240px;
    }

    &-icon {
      position: absolute;
      left: $space-3;
      top: 50%;
      transform: translateY(-50%);
      color: $text-subtle;
      pointer-events: none;
    }

    &-input {
      width: 100%;
      height: 36px;
      padding: 0 $space-4 0 $space-8;
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
  }

  &__tabs {
    display: flex;
    gap: $space-1;
    flex-wrap: wrap;
  }

  &__tab {
    display: flex;
    align-items: center;
    gap: $space-2;
    height: 36px;
    padding: 0 $space-3;
    background: $bg-card;
    border: 1px solid $border;
    border-radius: $radius;
    color: $text-muted;
    font-size: $text-sm;
    font-weight: $fw-medium;
    cursor: pointer;
    transition: $transition-fast;
    white-space: nowrap;

    &:hover {
      border-color: $border-hover;
      color: $text;
    }

    &--active {
      background: $primary-subtle;
      border-color: rgba(124, 111, 255, 0.3);
      color: $primary-light;
    }

    &-count {
      font-size: $text-xs;
      background: $bg-card-2;
      padding: 1px 6px;
      border-radius: $radius-full;
    }
  }
}

// Table card
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
    padding: $space-3 $space-4;
    text-align: left;
    font-size: $text-xs;
    font-weight: $fw-semibold;
    color: $text-muted;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    border-bottom: 1px solid $border;
    white-space: nowrap;
    background: $bg-surface;
  }

  td {
    padding: $space-4;
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

.cell-muted {
  color: $text-muted !important;
}

.cell-mono {
  font-family: $font-mono;
  font-size: $text-xs !important;
}

// Lead name cell
.lead-name {
  display: flex;
  align-items: center;
  gap: $space-3;

  &__avatar {
    width: 32px;
    height: 32px;
    border-radius: $radius-full;
    background: $primary-subtle;
    border: 1px solid $border;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: $text-xs;
    font-weight: $fw-semibold;
    color: $primary-light;
    flex-shrink: 0;
  }

  &__primary {
    font-weight: $fw-medium;
    color: $text;
  }

  &__secondary {
    font-size: $text-xs;
    color: $text-muted;
    font-family: $font-mono;
  }
}

// Row actions
.row-actions {
  display: flex;
  align-items: center;
  gap: $space-2;
}

.status-select {
  height: 32px;
  padding: 0 $space-2;
  background: $bg-card-2;
  border: 1px solid $border;
  border-radius: $radius-sm;
  color: $text;
  font-size: $text-xs;
  cursor: pointer;
  outline: none;
  transition: $transition-fast;

  &:hover {
    border-color: $border-hover;
  }

  &:focus {
    border-color: $primary;
  }

  option {
    background: $bg-card-2;
  }
}

// Pagination
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $space-3;
  padding: $space-4;
  border-top: 1px solid $border;

  &__info {
    font-size: $text-sm;
    color: $text-muted;
    font-variant-numeric: tabular-nums;
  }
}
</style>
