<template>
  <div class="support-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Soporte</h1>
        <p class="page-subtitle">Crea tickets y recibe ayuda de El Ingeniero IA</p>
      </div>
      <AppButton @click="showNewTicket = true">
        <Plus :size="16" />
        Nuevo ticket
      </AppButton>
    </div>

    <!-- Tickets list -->
    <div v-if="loading" class="tickets-list">
      <div v-for="i in 3" :key="i" class="ticket-card ticket-card--skeleton" />
    </div>

    <div v-else-if="tickets.length === 0" class="tickets-empty">
      <LifeBuoy :size="48" />
      <h3>Sin tickets</h3>
      <p>¿Tienes algún problema? Crea un ticket y El Ingeniero lo revisará.</p>
      <AppButton @click="showNewTicket = true">
        <Plus :size="16" />
        Crear primer ticket
      </AppButton>
    </div>

    <div v-else class="tickets-list">
      <div
        v-for="ticket in tickets"
        :key="ticket._id"
        class="ticket-card"
        :class="{ 'ticket-card--open': selectedId === ticket._id }"
        @click="selectedId = selectedId === ticket._id ? null : ticket._id"
      >
        <div class="ticket-card__header">
          <div class="ticket-card__left">
            <AppBadge :variant="ticketStatusVariant(ticket.status)">
              {{ ticketStatusLabel(ticket.status) }}
            </AppBadge>
            <h3 class="ticket-card__title">{{ ticket.title }}</h3>
          </div>
          <div class="ticket-card__right">
            <span class="ticket-card__date">{{ formatDate(ticket.created_at) }}</span>
            <ChevronDown
              :size="16"
              class="ticket-card__chevron"
              :class="{ 'ticket-card__chevron--open': selectedId === ticket._id }"
            />
          </div>
        </div>

        <Transition name="accordion">
          <div v-if="selectedId === ticket._id" class="ticket-card__body">
            <div class="ticket-detail">
              <p class="ticket-detail__label">Tu descripción</p>
              <p class="ticket-detail__text">{{ ticket.description }}</p>
            </div>

            <div v-if="ticket.ai_response" class="ticket-ai">
              <div class="ticket-ai__header">
                <div class="ticket-ai__icon">
                  <Zap :size="14" />
                </div>
                <span class="ticket-ai__label">Respuesta de El Ingeniero</span>
              </div>
              <p class="ticket-ai__text">{{ ticket.ai_response }}</p>

              <div v-if="ticket.requires_ceo" class="ticket-escalated">
                <AlertTriangle :size="14" />
                Escalado a revisión manual
              </div>
            </div>

            <div v-else class="ticket-pending">
              <AppSpinner :size="16" />
              <span>El Ingeniero está analizando tu ticket...</span>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <!-- New ticket modal -->
    <AppModal v-model="showNewTicket" title="Nuevo ticket de soporte" size="md">
      <div class="ticket-form">
        <div class="field">
          <label class="field__label">Título del problema</label>
          <input
            v-model="newTicket.title"
            type="text"
            class="field__input"
            placeholder="Ej: El bot de WhatsApp no responde"
          />
        </div>

        <div class="field">
          <label class="field__label">Descripción detallada</label>
          <textarea
            v-model="newTicket.description"
            class="field__textarea"
            rows="5"
            placeholder="Describe el problema con el mayor detalle posible: qué ocurre, cuándo empezó, qué has probado..."
          />
        </div>
      </div>

      <template #footer>
        <AppButton variant="secondary" @click="showNewTicket = false">Cancelar</AppButton>
        <AppButton :loading="submitting" @click="submitTicket">
          <Send :size="16" />
          Enviar ticket
        </AppButton>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  Plus, LifeBuoy, ChevronDown, Zap,
  AlertTriangle, Send,
} from 'lucide-vue-next'
import { useApi } from '@/composables/useApi'
import { useToastStore } from '@/stores/toast'
import AppBadge   from '@/components/ui/AppBadge.vue'
import AppButton  from '@/components/ui/AppButton.vue'
import AppModal   from '@/components/ui/AppModal.vue'
import AppSpinner from '@/components/ui/AppSpinner.vue'

const api   = useApi()
const toast = useToastStore()

const tickets      = ref([])
const loading      = ref(true)
const submitting   = ref(false)
const showNewTicket = ref(false)
const selectedId   = ref(null)

const newTicket = ref({ title: '', description: '' })

function ticketStatusLabel(s) {
  const map = { open: 'Abierto', in_progress: 'En progreso', pending_review: 'Revisión manual', resolved: 'Resuelto' }
  return map[s] ?? s
}

function ticketStatusVariant(s) {
  const map = { open: 'info', in_progress: 'warning', pending_review: 'warning', resolved: 'success' }
  return map[s] ?? 'default'
}

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

async function fetchTickets() {
  loading.value = true
  try {
    const res = await api.get('/portal/tickets')
    tickets.value = res.tickets ?? []
  } catch {
    toast.error('Error cargando tickets')
  } finally {
    loading.value = false
  }
}

async function submitTicket() {
  if (!newTicket.value.title.trim() || !newTicket.value.description.trim()) {
    toast.warning('Completa todos los campos')
    return
  }
  submitting.value = true
  try {
    const res = await api.post('/portal/support', newTicket.value)
    tickets.value.unshift(res.ticket ?? res)
    showNewTicket.value = false
    newTicket.value = { title: '', description: '' }
    toast.success('Ticket creado. El Ingeniero lo revisará pronto.')
  } catch (err) {
    toast.error(err.message)
  } finally {
    submitting.value = false
  }
}

onMounted(fetchTickets)
</script>

<style lang="scss" scoped>
.support-page {
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

// Tickets list
.tickets-list {
  display: flex;
  flex-direction: column;
  gap: $space-3;
}

.tickets-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-4;
  padding: $space-16;
  text-align: center;
  color: $text-subtle;
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius-lg;

  h3 {
    font-size: $text-lg;
    font-weight: $fw-semibold;
    color: $text-muted;
  }

  p {
    font-size: $text-sm;
    max-width: 320px;
    line-height: 1.6;
  }
}

// Ticket card
.ticket-card {
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius-lg;
  overflow: hidden;
  transition: $transition;
  cursor: pointer;

  &:hover {
    border-color: $border-hover;
  }

  &--skeleton {
    height: 72px;
    background: linear-gradient(90deg, $bg-card 25%, $bg-card-2 50%, $bg-card 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    cursor: default;
  }

  &--open {
    border-color: $border-hover;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $space-4;
    padding: $space-4 $space-5;
  }

  &__left {
    display: flex;
    align-items: center;
    gap: $space-3;
    flex: 1;
    min-width: 0;
  }

  &__right {
    display: flex;
    align-items: center;
    gap: $space-3;
    flex-shrink: 0;
  }

  &__title {
    font-size: $text-sm;
    font-weight: $fw-medium;
    color: $text;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__date {
    font-size: $text-xs;
    color: $text-subtle;
    font-family: $font-mono;
  }

  &__chevron {
    color: $text-muted;
    transition: transform 0.2s ease;
    flex-shrink: 0;

    &--open {
      transform: rotate(180deg);
    }
  }

  &__body {
    border-top: 1px solid $border;
    padding: $space-5;
    display: flex;
    flex-direction: column;
    gap: $space-4;
  }
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

// Ticket detail
.ticket-detail {
  &__label {
    font-size: $text-xs;
    font-weight: $fw-semibold;
    color: $text-muted;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: $space-2;
  }

  &__text {
    font-size: $text-sm;
    line-height: 1.7;
    color: $text-muted;
  }
}

// AI response
.ticket-ai {
  background: $bg-surface;
  border: 1px solid $border;
  border-radius: $radius;
  padding: $space-4;
  display: flex;
  flex-direction: column;
  gap: $space-3;

  &__header {
    display: flex;
    align-items: center;
    gap: $space-2;
  }

  &__icon {
    width: 22px;
    height: 22px;
    border-radius: $radius-full;
    background: $primary;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    flex-shrink: 0;
  }

  &__label {
    font-size: $text-xs;
    font-weight: $fw-semibold;
    color: $primary-light;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  &__text {
    font-size: $text-sm;
    line-height: 1.7;
    color: $text-muted;
  }
}

.ticket-escalated {
  display: flex;
  align-items: center;
  gap: $space-2;
  font-size: $text-xs;
  color: $warning;
  background: $warning-bg;
  border-radius: $radius-sm;
  padding: $space-2 $space-3;
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.ticket-pending {
  display: flex;
  align-items: center;
  gap: $space-2;
  font-size: $text-sm;
  color: $text-subtle;
  padding: $space-2 0;
}

// Accordion transition
.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}

.accordion-enter-from,
.accordion-leave-to {
  opacity: 0;
  max-height: 0;
}

.accordion-enter-to,
.accordion-leave-from {
  opacity: 1;
  max-height: 500px;
}

// Form
.ticket-form {
  display: flex;
  flex-direction: column;
  gap: $space-4;
}

.field {
  display: flex;
  flex-direction: column;
  gap: $space-2;

  &__label {
    font-size: $text-sm;
    font-weight: $fw-medium;
    color: $text-muted;
  }

  &__input,
  &__textarea {
    width: 100%;
    padding: $space-3 $space-4;
    background: $bg-input;
    border: 1px solid $border;
    border-radius: $radius;
    color: $text;
    font-size: $text-sm;
    outline: none;
    transition: $transition;
    font-family: $font-sans;

    &::placeholder { color: $text-subtle; }

    &:focus {
      border-color: $primary;
      box-shadow: 0 0 0 3px $primary-glow;
    }
  }

  &__input { height: 40px; }
  &__textarea { resize: vertical; line-height: 1.6; }
}
</style>
