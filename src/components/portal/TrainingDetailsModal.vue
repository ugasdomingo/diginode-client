<template>
  <AppModal
    :model-value="modelValue"
    :title="training?.name ?? 'Detalles de la formación'"
    size="lg"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div v-if="training" class="training-details">
      <!-- Logística -->
      <section class="training-details__section">
        <h4 class="training-details__heading">
          <CalendarClock :size="15" />
          Cuándo y dónde
        </h4>
        <dl class="training-details__facts">
          <div class="fact">
            <dt>Fecha</dt>
            <dd>{{ dateLabel }}</dd>
          </div>
          <div class="fact">
            <dt>Formato</dt>
            <dd>{{ training.format === 'online' ? 'Online en directo' : 'Presencial' }}</dd>
          </div>
          <div class="fact">
            <dt>Plataforma</dt>
            <dd>{{ training.platform ?? '—' }}</dd>
          </div>
          <div class="fact">
            <dt>Acceso</dt>
            <dd>
              <a
                v-if="training.meet_url"
                :href="training.meet_url"
                target="_blank"
                rel="noopener noreferrer"
                class="fact__link"
              >
                Entrar a la sesión
                <ExternalLink :size="13" />
              </a>
              <span v-else class="fact__pending">
                El enlace se enviará por correo antes de la sesión
              </span>
            </dd>
          </div>
        </dl>
      </section>

      <!-- Requisitos -->
      <section v-if="training.requirements?.length" class="training-details__section">
        <h4 class="training-details__heading">
          <ClipboardCheck :size="15" />
          Qué necesitas
        </h4>
        <ul class="training-details__list">
          <li v-for="item in training.requirements" :key="item">
            <Check :size="14" />
            <span>{{ item }}</span>
          </li>
        </ul>
      </section>

      <!-- Qué incluye -->
      <section v-if="training.includes?.length" class="training-details__section">
        <h4 class="training-details__heading">
          <Package :size="15" />
          Qué incluye
        </h4>
        <ul class="training-details__list">
          <li v-for="item in training.includes" :key="item">
            <Check :size="14" />
            <span>{{ item }}</span>
          </li>
        </ul>
      </section>

      <!-- Datos de la compra -->
      <section v-if="purchase" class="training-details__section">
        <h4 class="training-details__heading">
          <Receipt :size="15" />
          Tu compra
        </h4>
        <dl class="training-details__facts">
          <div class="fact">
            <dt>Importe</dt>
            <dd>{{ amountLabel }}</dd>
          </div>
          <div class="fact">
            <dt>Comprado el</dt>
            <dd>{{ purchasedAtLabel }}</dd>
          </div>
          <div v-if="purchase.receipt_url" class="fact">
            <dt>Recibo</dt>
            <dd>
              <a
                :href="purchase.receipt_url"
                target="_blank"
                rel="noopener noreferrer"
                class="fact__link"
              >
                Ver recibo
                <ExternalLink :size="13" />
              </a>
            </dd>
          </div>
        </dl>
      </section>

      <p class="training-details__help">
        ¿Alguna duda o no puedes asistir? Abre un ticket desde
        <RouterLink to="/portal/support">Soporte</RouterLink> y lo resolvemos.
      </p>
    </div>
  </AppModal>
</template>

<script setup>
import { computed } from 'vue'
import {
  CalendarClock, ClipboardCheck, Package, Receipt, Check, ExternalLink,
} from 'lucide-vue-next'
import AppModal from '@/components/ui/AppModal.vue'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  // Compra tal y como llega de /api/portal/me (incluye .training)
  purchase:   { type: Object, default: null },
})

defineEmits(['update:modelValue'])

const training = computed(() => props.purchase?.training ?? null)

const dateLabel = computed(() => {
  const t = training.value
  if (!t?.date) return 'Por confirmar'
  const formatted = new Date(`${t.date}T00:00:00`).toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
  const parts = [formatted.charAt(0).toUpperCase() + formatted.slice(1)]
  if (t.time) parts.push(`· ${t.time}h`)
  if (t.duration) parts.push(`· ${t.duration}`)
  return parts.join(' ')
})

const amountLabel = computed(() =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: props.purchase?.currency ?? 'EUR',
    minimumFractionDigits: 0,
  }).format(props.purchase?.amount ?? 0),
)

const purchasedAtLabel = computed(() => {
  const d = props.purchase?.created_at
  if (!d) return '—'
  return new Date(d).toLocaleDateString('es-ES', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
})
</script>

<style lang="scss" scoped>
.training-details {
  display: flex;
  flex-direction: column;
  gap: $space-6;

  &__section {
    display: flex;
    flex-direction: column;
    gap: $space-3;
  }

  &__heading {
    display: flex;
    align-items: center;
    gap: $space-2;
    font-size: $text-sm;
    font-weight: $fw-semibold;
    color: $primary-light;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  &__facts {
    display: flex;
    flex-direction: column;
    gap: $space-2;
    margin: 0;
  }

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: $space-2;

    li {
      display: flex;
      align-items: flex-start;
      gap: $space-2;
      font-size: $text-sm;
      color: $text-muted;
      line-height: 1.6;

      svg { flex-shrink: 0; margin-top: 4px; color: $primary; }
    }
  }

  &__help {
    padding-top: $space-4;
    border-top: 1px solid $border;
    font-size: $text-xs;
    color: $text-subtle;

    a {
      color: $primary;
      text-decoration: none;

      &:hover { text-decoration: underline; }
    }
  }
}

.fact {
  display: flex;
  align-items: baseline;
  gap: $space-3;
  flex-wrap: wrap;

  dt {
    min-width: 96px;
    font-size: $text-xs;
    color: $text-subtle;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  dd {
    margin: 0;
    flex: 1;
    min-width: 0;
    font-size: $text-sm;
    color: $text;
  }

  &__link {
    display: inline-flex;
    align-items: center;
    gap: $space-1;
    color: $primary;
    font-weight: $fw-medium;
    text-decoration: none;

    &:hover { color: $primary-light; text-decoration: underline; }
  }

  &__pending {
    color: $text-muted;
    font-style: italic;
  }
}
</style>
