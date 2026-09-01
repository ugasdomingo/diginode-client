<template>
  <AppModal
    :model-value="modelValue"
    title="Reserva tu plaza"
    size="md"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <form class="inscripcion" novalidate @submit.prevent="enviar">
      <p class="inscripcion__intro">
        El taller es gratuito. Solo necesito estos datos para guardarte la plaza
        y enviarte el enlace de la sesión.
      </p>

      <div class="field">
        <label class="field__label" for="ins-nombre">Tu nombre</label>
        <input
          id="ins-nombre"
          ref="primerCampo"
          v-model="form.name"
          type="text"
          class="field__input"
          placeholder="Nombre y apellido"
          autocomplete="name"
          maxlength="100"
          required
        />
      </div>

      <div class="field">
        <label class="field__label" for="ins-email">Tu correo</label>
        <input
          id="ins-email"
          v-model="form.email"
          type="email"
          class="field__input"
          placeholder="donde te envío el acceso"
          autocomplete="email"
          maxlength="150"
          required
        />
      </div>

      <div class="field">
        <label class="field__label" for="ins-pain">
          ¿Qué te quita más tiempo ahora mismo?
          <span class="field__optional">opcional</span>
        </label>
        <textarea
          id="ins-pain"
          v-model="form.pain_point"
          class="field__input field__input--area"
          placeholder="Contestar mensajes, informes, cuadrar citas, redes…"
          maxlength="1000"
          rows="3"
        />
        <p class="field__hint">
          Trabajaremos sobre casos reales. Lo que escribas aquí me sirve para preparar el taller.
        </p>
      </div>

      <label class="consent">
        <input v-model="form.accepts_privacy" type="checkbox" class="consent__box" />
        <span class="consent__text">
          He leído y acepto la
          <RouterLink to="/legal/privacidad" target="_blank">política de privacidad</RouterLink>.
          Usaré tus datos solo para gestionar tu plaza y avisarte de esta formación.
        </span>
      </label>

      <p v-if="error" class="inscripcion__error">
        <AlertCircle :size="15" />
        {{ error }}
      </p>

      <button type="submit" class="inscripcion__submit" :disabled="enviando">
        <AppSpinner v-if="enviando" :size="18" />
        <Ticket v-else :size="18" />
        {{ enviando ? 'Reservando…' : 'Reservar mi plaza gratis' }}
      </button>
    </form>
  </AppModal>
</template>

<script setup>
import { nextTick, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Ticket, AlertCircle } from 'lucide-vue-next'
import AppModal from '@/components/ui/AppModal.vue'
import AppSpinner from '@/components/ui/AppSpinner.vue'
import { useApi } from '@/composables/useApi'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { track } from '@/lib/pixel'
import { trackEvent } from '@/lib/analytics'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  slug:       { type: String, required: true },
})

const emit = defineEmits(['update:modelValue', 'inscrito'])

const router = useRouter()
const auth   = useAuthStore()
const toast  = useToastStore()

const form = reactive({ name: '', email: '', pain_point: '', accepts_privacy: false })
const enviando   = ref(false)
const error      = ref('')
const primerCampo = ref(null)

watch(() => props.modelValue, async (abierto) => {
  if (!abierto) return
  error.value = ''
  await nextTick()
  primerCampo.value?.focus()
})

async function enviar() {
  error.value = ''

  if (form.name.trim().length < 2)      return (error.value = 'Dinos tu nombre para reservar la plaza.')
  if (!form.email.includes('@'))        return (error.value = 'Revisa tu correo: no parece válido.')
  if (!form.accepts_privacy)            return (error.value = 'Necesitamos que aceptes la política de privacidad.')

  enviando.value = true
  track('Lead')
  trackEvent('checkout_click')

  try {
    const res = await useApi().post(`/trainings/${props.slug}/enroll`, {
      name:            form.name.trim(),
      email:           form.email.trim(),
      pain_point:      form.pain_point.trim(),
      accepts_privacy: true,
    })

    const data = res?.data ?? {}
    trackEvent('purchase')
    track('CompleteRegistration')
    emit('inscrito')

    // Cuenta recién creada: entra directo, sin pasar por el correo.
    if (data.session?.token) {
      auth.setToken(data.session.token, data.session.user?.password_change_required ?? false)
      toast.success('¡Plaza reservada! Crea tu contraseña para ver los detalles.')
      router.push(data.session.user?.password_change_required ? '/cambiar-contrasena' : '/portal/dashboard')
      return
    }

    // Ya tenía cuenta: no se entrega sesión a quien solo teclea un correo.
    emit('update:modelValue', false)
    toast.success('¡Plaza reservada! Ya tienes cuenta con nosotros: entra con tu contraseña de siempre para ver los detalles.')
  } catch (e) {
    error.value = e?.message ?? 'No hemos podido reservar tu plaza. Inténtalo de nuevo.'
  } finally {
    enviando.value = false
  }
}
</script>

<style lang="scss" scoped>
.inscripcion {
  display: flex;
  flex-direction: column;
  gap: $space-5;

  &__intro {
    font-size: $text-sm;
    color: $text-muted;
    line-height: 1.6;
  }

  &__error {
    display: flex;
    align-items: flex-start;
    gap: $space-2;
    padding: $space-3;
    background: $danger-bg;
    border: 1px solid rgba(255, 107, 107, 0.25);
    border-radius: $radius-sm;
    font-size: $text-sm;
    color: $danger;

    svg { flex-shrink: 0; margin-top: 2px; }
  }

  &__submit {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: $space-2;
    width: 100%;
    height: 52px;
    background: linear-gradient(135deg, $primary 0%, $primary-dark 100%);
    color: $text;
    font-family: inherit;
    font-size: $text-base;
    font-weight: $fw-bold;
    border: 0;
    border-radius: $radius;
    cursor: pointer;
    transition: $transition;

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 6px 24px rgba(30, 144, 255, 0.35);
    }

    &:disabled { opacity: 0.6; cursor: wait; }
  }
}

.field {
  display: flex;
  flex-direction: column;
  gap: $space-2;

  &__label {
    font-size: $text-sm;
    font-weight: $fw-medium;
    color: $text;
  }

  &__optional {
    margin-left: $space-2;
    font-size: $text-xs;
    font-weight: $fw-regular;
    color: $text-subtle;
  }

  &__input {
    width: 100%;
    padding: $space-3 $space-4;
    background: $bg-input;
    border: 1px solid $border;
    border-radius: $radius-sm;
    color: $text;
    font-family: inherit;
    font-size: $text-sm;
    transition: $transition-fast;

    &::placeholder { color: $text-subtle; }

    &:focus {
      outline: none;
      border-color: $border-focus;
      background: $bg-surface;
    }

    &--area {
      resize: vertical;
      min-height: 76px;
      line-height: 1.6;
    }
  }

  &__hint {
    font-size: $text-xs;
    color: $text-subtle;
    line-height: 1.5;
  }
}

.consent {
  display: flex;
  align-items: flex-start;
  gap: $space-3;
  cursor: pointer;

  &__box {
    margin-top: 3px;
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    accent-color: $primary;
    cursor: pointer;
  }

  &__text {
    font-size: $text-xs;
    color: $text-muted;
    line-height: 1.6;

    a {
      color: $primary;
      text-decoration: underline;
    }
  }
}
</style>
