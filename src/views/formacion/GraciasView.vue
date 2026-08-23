<template>
  <div class="gracias">
    <div class="gracias__bg" aria-hidden="true">
      <div class="gracias__glow" />
    </div>

    <div class="gracias__card">
      <!-- El pago ya está hecho: eso se confirma siempre, pase lo que pase
           después con el acceso automático. -->
      <div class="gracias__icon">
        <CheckCircle2 :size="34" />
      </div>

      <h1 class="gracias__title">¡Pago confirmado!</h1>
      <p class="gracias__subtitle">
        Tu plaza en <strong>{{ trainingName }}</strong> está reservada.
        Te hemos enviado un correo con los detalles.
      </p>

      <!-- Entrando -->
      <template v-if="state === 'loading'">
        <div class="gracias__status">
          <AppSpinner :size="18" />
          <span>Preparando tu acceso al panel…</span>
        </div>
      </template>

      <!-- Acceso automático fallido: el correo sigue siendo la vía de entrada -->
      <template v-else-if="state === 'error'">
        <div class="gracias__notice">
          <Info :size="18" />
          <p>{{ errorMessage }}</p>
        </div>
        <RouterLink to="/login" class="gracias__button">
          Ir a iniciar sesión
          <ArrowRight :size="16" />
        </RouterLink>
        <p class="gracias__hint">
          Busca el correo con tu contraseña temporal. Si no lo ves, revisa la carpeta de spam.
        </p>
      </template>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CheckCircle2, Info, ArrowRight } from 'lucide-vue-next'
import { useApi } from '@/composables/useApi'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import AppSpinner from '@/components/ui/AppSpinner.vue'
import { track } from '@/lib/pixel'
import { trackEvent } from '@/lib/analytics'

const route  = useRoute()
const router = useRouter()
const auth   = useAuthStore()
const toast  = useToastStore()

const state        = ref('loading')
const errorMessage = ref('')
const trainingName = ref('el taller')

const FALLBACK_ERROR =
  'No hemos podido abrirte el panel automáticamente, pero tu plaza está guardada. ' +
  'Entra con el email y la contraseña que te hemos enviado por correo.'

onMounted(async () => {
  const sessionId = route.query.session_id

  // El evento de compra se registra en cuanto Stripe nos devuelve aquí, sin
  // depender de que el acceso automático funcione.
  track('Purchase')
  trackEvent('purchase')

  if (!sessionId) {
    state.value = 'error'
    errorMessage.value = FALLBACK_ERROR
    return
  }

  // El identificador de sesión es de un solo uso: fuera de la URL en cuanto
  // lo tenemos, para que no quede en el historial ni viaje en un referer.
  router.replace({ query: {} })

  try {
    const res = await useApi().post('/trainings/claim', { session_id: sessionId })
    const data = res?.data

    if (!data?.token) throw new Error(FALLBACK_ERROR)

    if (data.training?.name) trainingName.value = data.training.name

    auth.setToken(data.token, data.user?.password_change_required ?? false)

    if (data.user?.password_change_required) {
      toast.success('¡Bienvenido/a! Crea tu contraseña para entrar a tu panel.')
      router.replace('/cambiar-contrasena')
    } else {
      toast.success('¡Bienvenido/a de nuevo! Aquí tienes los detalles de tu compra.')
      router.replace('/portal/dashboard')
    }
  } catch (e) {
    state.value = 'error'
    errorMessage.value = e?.message ?? FALLBACK_ERROR
  }
})
</script>

<style lang="scss" scoped>
.gracias {
  position: relative;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $space-6;
  background: $bg;
  overflow: hidden;

  &__bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  &__glow {
    position: absolute;
    top: -180px;
    left: 50%;
    transform: translateX(-50%);
    width: 560px;
    height: 560px;
    border-radius: 50%;
    background: $primary;
    filter: blur(140px);
    opacity: 0.22;
  }

  &__card {
    position: relative;
    width: 100%;
    max-width: 520px;
    padding: $space-10 $space-8;
    background: $bg-card;
    border: 1px solid $border;
    border-radius: $radius-xl;
    box-shadow: $shadow-lg;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $space-4;
    text-align: center;

    @media (max-width: $bp-sm) {
      padding: $space-8 $space-5;
    }
  }

  &__icon {
    width: 68px;
    height: 68px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $success-bg;
    color: $success;
  }

  &__title {
    font-family: $font-display;
    font-size: $text-3xl;
    font-weight: $fw-bold;
    color: $text;
    letter-spacing: -0.02em;
  }

  &__subtitle {
    font-size: $text-base;
    color: $text-muted;
    line-height: 1.6;

    strong { color: $text; }
  }

  &__status {
    display: flex;
    align-items: center;
    gap: $space-3;
    margin-top: $space-2;
    font-size: $text-sm;
    color: $text-muted;
  }

  &__notice {
    display: flex;
    align-items: flex-start;
    gap: $space-3;
    width: 100%;
    margin-top: $space-2;
    padding: $space-4;
    text-align: left;
    background: $info-bg;
    border: 1px solid rgba(96, 176, 255, 0.25);
    border-radius: $radius;
    font-size: $text-sm;
    color: $text-muted;
    line-height: 1.6;

    svg { flex-shrink: 0; margin-top: 2px; color: $info; }
  }

  &__button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: $space-2;
    height: 48px;
    padding: 0 $space-6;
    background: linear-gradient(135deg, $primary 0%, $primary-dark 100%);
    color: $text;
    font-size: $text-base;
    font-weight: $fw-semibold;
    text-decoration: none;
    border-radius: $radius;
    transition: $transition;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 28px rgba(30, 144, 255, 0.35);
    }
  }

  &__hint {
    font-size: $text-xs;
    color: $text-subtle;
  }
}
</style>
