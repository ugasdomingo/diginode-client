<template>
  <div class="content-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Campañas de contenido</h1>
        <p class="page-subtitle">Solicita grillas de contenido a tu agente Make y consulta el enlace de la propuesta</p>
      </div>
    </div>

    <!-- New campaign form -->
    <div class="campaign-form">
      <h2 class="campaign-form__title">
        <Sparkles :size="18" />
        Nueva campaña
      </h2>

      <div class="campaign-form__fields">
        <div class="field">
          <label class="field__label">Nombre de la campaña</label>
          <input
            v-model="form.name"
            type="text"
            class="field__input"
            placeholder="Ej: Lanzamiento Q2 — IA para clínicas"
            :disabled="submitting"
          />
        </div>

        <div class="field field--full">
          <label class="field__label">Contexto y objetivos</label>
          <textarea
            v-model="form.context"
            class="field__input field__input--textarea"
            rows="4"
            placeholder="Describe el objetivo de la campaña, el público, el tono, los productos o servicios a destacar, etc."
            :disabled="submitting"
          />
        </div>
      </div>

      <div class="campaign-form__footer">
        <AppButton :loading="submitting" @click="submitCampaign">
          <Send :size="16" />
          Enviar a Make
        </AppButton>
      </div>
    </div>

    <!-- Campaigns list -->
    <div class="campaigns-section">
      <h2 class="section-title">Historial de campañas</h2>

      <div v-if="loading" class="campaigns-list">
        <div v-for="i in 3" :key="i" class="campaign-row campaign-row--skeleton" />
      </div>

      <div v-else-if="campaigns.length === 0" class="campaigns-empty">
        <LayoutGrid :size="40" />
        <p>Aún no hay campañas enviadas</p>
      </div>

      <div v-else class="campaigns-list">
        <div v-for="c in campaigns" :key="c._id" class="campaign-row">
          <div class="campaign-row__info">
            <span class="campaign-row__name">{{ c.name }}</span>
            <span class="campaign-row__date">{{ formatDate(c.created_at) }}</span>
          </div>

          <div class="campaign-row__right">
            <AppBadge :variant="statusVariant(c.status)">
              <component :is="statusIcon(c.status)" :size="11" />
              {{ statusLabel(c.status) }}
            </AppBadge>

            <a
              v-if="c.proposal_url"
              :href="c.proposal_url"
              target="_blank"
              rel="noopener noreferrer"
              class="proposal-link"
              title="Ver propuesta"
            >
              <ExternalLink :size="15" />
              Ver propuesta
            </a>
            <span v-else class="proposal-pending">
              <Clock :size="13" />
              Esperando...
            </span>
          </div>
        </div>
      </div>

      <div v-if="totalPages > 1" class="pagination">
        <AppButton variant="secondary" size="sm" :disabled="page === 1" @click="page--; fetchCampaigns()">
          <ChevronLeft :size="16" />
        </AppButton>
        <span class="pagination__info">{{ page }} / {{ totalPages }}</span>
        <AppButton variant="secondary" size="sm" :disabled="page === totalPages" @click="page++; fetchCampaigns()">
          <ChevronRight :size="16" />
        </AppButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  Sparkles, LayoutGrid, Send, ExternalLink,
  Clock, ChevronLeft, ChevronRight,
  CheckCircle, Loader, ThumbsUp, Zap,
} from 'lucide-vue-next'
import { useApi } from '@/composables/useApi'
import { useToastStore } from '@/stores/toast'
import AppBadge  from '@/components/ui/AppBadge.vue'
import AppButton from '@/components/ui/AppButton.vue'

const api   = useApi()
const toast = useToastStore()

const campaigns  = ref([])
const loading    = ref(true)
const submitting = ref(false)
const page       = ref(1)
const total      = ref(0)
const limit      = 15

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit)))

const form = ref({ name: '', context: '' })

function statusLabel(s) {
  return {
    pending:        'Pendiente',
    proposal_ready: 'Propuesta lista',
    approved:       'Aprobada',
    in_production:  'En producción',
  }[s] ?? s
}

function statusVariant(s) {
  return {
    pending:        'warning',
    proposal_ready: 'primary',
    approved:       'success',
    in_production:  'info',
  }[s] ?? 'default'
}

function statusIcon(s) {
  return {
    pending:        Clock,
    proposal_ready: CheckCircle,
    approved:       ThumbsUp,
    in_production:  Zap,
  }[s] ?? Clock
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

async function fetchCampaigns() {
  loading.value = true
  try {
    const params = new URLSearchParams({ page: page.value, limit })
    const res = await api.get(`/admin/content/campaigns?${params}`)
    campaigns.value = res.data ?? []
    total.value     = res.total ?? 0
  } catch {
    toast.error('Error cargando campañas')
  } finally {
    loading.value = false
  }
}

async function submitCampaign() {
  const name    = form.value.name.trim()
  const context = form.value.context.trim()
  if (!name)    { toast.warning('Escribe el nombre de la campaña'); return }
  if (!context) { toast.warning('Añade el contexto de la campaña'); return }

  submitting.value = true
  try {
    await api.post('/admin/content/generate', { name, context })
    toast.success('Campaña enviada. Recibirás el enlace de la propuesta por Slack.')
    form.value = { name: '', context: '' }
    page.value = 1
    fetchCampaigns()
  } catch (err) {
    toast.error(err.message ?? 'Error enviando campaña')
  } finally {
    submitting.value = false
  }
}

onMounted(fetchCampaigns)
</script>

<style lang="scss" scoped>
.content-page {
  display: flex;
  flex-direction: column;
  gap: $space-8;
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

// Campaign form
.campaign-form {
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius-lg;
  padding: $space-6;
  display: flex;
  flex-direction: column;
  gap: $space-5;

  &__title {
    font-size: $text-lg;
    font-weight: $fw-semibold;
    display: flex;
    align-items: center;
    gap: $space-2;
    color: $primary-light;
  }

  &__fields {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $space-4;

    @media (max-width: $bp-md) {
      grid-template-columns: 1fr;
    }
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
  }
}

// Field
.field {
  display: flex;
  flex-direction: column;
  gap: $space-2;

  &--full {
    grid-column: 1 / -1;
  }

  &__label {
    font-size: $text-sm;
    font-weight: $fw-medium;
    color: $text-muted;
  }

  &__input {
    width: 100%;
    height: 40px;
    padding: 0 $space-3;
    background: $bg-input;
    border: 1px solid $border;
    border-radius: $radius;
    color: $text;
    font-size: $text-sm;
    font-family: $font-sans;
    outline: none;
    transition: $transition;

    &::placeholder { color: $text-subtle; }

    &:focus {
      border-color: $primary;
      box-shadow: 0 0 0 3px $primary-glow;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    &--textarea {
      height: auto;
      padding: $space-3;
      resize: vertical;
      line-height: 1.6;
    }
  }
}

// Campaigns section
.campaigns-section {
  display: flex;
  flex-direction: column;
  gap: $space-4;
}

.section-title {
  font-size: $text-xl;
  font-weight: $fw-semibold;
}

.campaigns-list {
  display: flex;
  flex-direction: column;
  gap: $space-2;
}

.campaign-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $space-4;
  padding: $space-4 $space-5;
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius-lg;
  transition: $transition;
  flex-wrap: wrap;

  &:hover {
    border-color: $border-hover;
  }

  &--skeleton {
    height: 62px;
    background: linear-gradient(90deg, $bg-card 25%, $bg-card-2 50%, $bg-card 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: $space-1;
    min-width: 0;
  }

  &__name {
    font-size: $text-sm;
    font-weight: $fw-semibold;
    color: $text;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__date {
    font-size: $text-xs;
    color: $text-subtle;
    font-family: $font-mono;
  }

  &__right {
    display: flex;
    align-items: center;
    gap: $space-3;
    flex-shrink: 0;
  }
}

.proposal-link {
  display: inline-flex;
  align-items: center;
  gap: $space-1;
  font-size: $text-sm;
  font-weight: $fw-medium;
  color: $accent;
  text-decoration: none;
  transition: $transition-fast;

  &:hover {
    color: lighten(#34d399, 10%);
    text-decoration: underline;
  }
}

.proposal-pending {
  display: inline-flex;
  align-items: center;
  gap: $space-1;
  font-size: $text-xs;
  color: $text-subtle;
}

.campaigns-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-3;
  padding: $space-12;
  color: $text-subtle;
  font-size: $text-sm;
}

// Pagination
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $space-3;

  &__info {
    font-size: $text-sm;
    color: $text-muted;
  }
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
