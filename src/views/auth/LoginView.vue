<template>
  <div class="login">
    <!-- Background grid decoration -->
    <div class="login__bg" aria-hidden="true" />

    <div class="login__container">
      <!-- Brand -->
      <RouterLink to="/" class="login__brand">
        <div class="login__brand-icon">
          <Zap :size="24" />
        </div>
        <h1 class="login__brand-name">Diginode</h1>
      </RouterLink>

      <div class="login__card">
        <div class="login__header">
          <h2 class="login__title">Bienvenido</h2>
          <p class="login__subtitle">Accede a tu panel de control</p>
        </div>

        <form v-if="step === 'password'" class="login__form" @submit.prevent="handleLogin" novalidate>
          <div class="field">
            <label class="field__label" for="email">Correo electrónico</label>
            <div class="field__wrapper">
              <Mail :size="16" class="field__icon" />
              <input
                id="email"
                v-model="form.email"
                type="email"
                class="field__input"
                placeholder="hola@tuagencia.com"
                autocomplete="email"
                required
              />
            </div>
          </div>

          <div class="field">
            <label class="field__label" for="password">Contraseña</label>
            <div class="field__wrapper">
              <Lock :size="16" class="field__icon" />
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="field__input"
                placeholder="••••••••"
                autocomplete="current-password"
                required
              />
              <button
                type="button"
                class="field__toggle"
                @click="showPassword = !showPassword"
                :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
              >
                <component :is="showPassword ? EyeOff : Eye" :size="16" />
              </button>
            </div>
          </div>

          <p v-if="error" class="login__error" role="alert">
            <AlertCircle :size="14" />
            {{ error }}
          </p>

          <AppButton type="submit" size="lg" :loading="loading" class="login__submit">
            Iniciar sesión
          </AppButton>
        </form>

        <form v-else class="login__form" @submit.prevent="handleMfa" novalidate>
          <p class="login__hint">
            Te enviamos un código de 6 dígitos a {{ mfaHint }}. Caduca en unos minutos.
          </p>
          <div class="field">
            <label class="field__label" for="code">Código del correo</label>
            <div class="field__wrapper">
              <input
                id="code"
                v-model="code"
                class="field__input field__input--code"
                inputmode="numeric"
                autocomplete="one-time-code"
                maxlength="6"
                pattern="[0-9]{6}"
                placeholder="000000"
                required
              />
            </div>
          </div>
          <p v-if="error" class="login__error" role="alert">
            <AlertCircle :size="14" />
            {{ error }}
          </p>
          <p v-else-if="notice" class="login__hint">{{ notice }}</p>
          <AppButton type="submit" size="lg" :loading="loading" class="login__submit">
            Confirmar código
          </AppButton>
          <button type="button" class="login__textbtn" @click="resend">Enviar otro código</button>
          <button type="button" class="login__textbtn" @click="backToPassword">Volver</button>
        </form>

        <details v-if="mockMode" class="login__demo">
          <summary>Acceso de demostración</summary>
          <p>Domingo: domingo@midiginode.com · Madrid-2026</p>
          <p>Cliente: lucia@aireyoga.test · Aire-2026 · código 482913</p>
        </details>
      </div>

      <p class="login__footer">
        Diginode &mdash; Agencia de empleados IA
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Zap, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useClientStore } from '@/stores/client'
import { login, opsUsesMock, resendMfa, verifyMfa } from '@/api/ops/client'
import { interpretLogin, interpretMfa, normalizeCode } from '@/lib/authFlow'
import AppButton from '@/components/ui/AppButton.vue'

const auth         = useAuthStore()
const clientStore  = useClientStore()
const router       = useRouter()

const form = ref({ email: '', password: '' })
const loading     = ref(false)
const error       = ref('')
const showPassword = ref(false)
const step = ref('password')
const challengeId = ref('')
const mfaHint = ref('')
const code = ref('')
const notice = ref('')
const mockMode = opsUsesMock()

function enterSession(token, passwordChangeRequired) {
  auth.setToken(token, passwordChangeRequired)
  form.value.password = ''
  code.value = ''
  if (auth.mustChangePassword) {
    router.push('/cambiar-contrasena')
  } else if (auth.isAdmin) {
    router.push('/admin/dashboard')
  } else if (mockMode) {
    router.push('/portal/dashboard')
  } else {
    clientStore.load().catch(() => {}).finally(() => router.push('/portal/dashboard'))
  }
}

async function handleLogin() {
  error.value   = ''
  loading.value = true
  const password = form.value.password

  try {
    const data = await login({
      email:    form.value.email.trim().toLowerCase(),
      password,
    })
    const next = interpretLogin(data)
    if (!next.ok) {
      error.value = next.message
      return
    }
    if (next.step === 'mfa') {
      step.value = 'mfa'
      challengeId.value = next.challengeId
      mfaHint.value = next.hint
      return
    }
    enterSession(next.token, next.passwordChangeRequired)
  } catch (err) {
    error.value = err.message ?? 'Correo o contraseña incorrectos'
  } finally {
    form.value.password = ''
    loading.value = false
  }
}

async function handleMfa() {
  error.value = ''
  const normalized = normalizeCode(code.value)
  code.value = normalized
  if (normalized.length !== 6) {
    error.value = 'El código tiene 6 dígitos.'
    return
  }
  loading.value = true
  try {
    const data = await verifyMfa({ challenge_id: challengeId.value, code: normalized })
    const next = interpretMfa(data)
    if (!next.ok) {
      error.value = next.message
      return
    }
    enterSession(next.token, next.passwordChangeRequired)
  } catch (err) {
    error.value = err.message ?? 'El código no es válido'
  } finally {
    code.value = ''
    loading.value = false
  }
}

async function resend() {
  error.value = ''
  notice.value = ''
  try {
    await resendMfa({ challenge_id: challengeId.value })
    notice.value = 'Te enviamos otro código.'
  } catch (err) {
    error.value = err.message
  }
}

function backToPassword() {
  step.value = 'password'
  challengeId.value = ''
  code.value = ''
  error.value = ''
}
</script>

<style lang="scss" scoped>
.login {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $space-4;
  position: relative;
  overflow: hidden;

  &__bg {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(156, 255, 203, 0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(156, 255, 203, 0.04) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse 60% 50% at 50% 50%, rgba(156, 255, 203, 0.12) 0%, transparent 70%);
    }
  }

  &__container {
    position: relative;
    width: 100%;
    max-width: 420px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $space-8;
  }

  &__brand {
    display: flex;
    align-items: center;
    gap: $space-3;
    text-decoration: none;
  }

  &__brand-icon {
    width: 44px;
    height: 44px;
    background: $primary;
    border-radius: $radius-lg;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $text-inverse;
    box-shadow: 0 0 32px rgba(156, 255, 203, 0.4);
  }

  &__brand-name {
    font-size: $text-2xl;
    font-weight: $fw-bold;
    color: $text;
    letter-spacing: -0.03em;
  }

  &__card {
    width: 100%;
    background: $bg-card;
    border: 1px solid $border;
    border-radius: $radius-xl;
    padding: $space-8;
    box-shadow: $shadow-lg;
  }

  &__header {
    margin-bottom: $space-8;
  }

  &__title {
    font-size: $text-2xl;
    font-weight: $fw-bold;
    color: $text;
    margin-bottom: $space-1;
  }

  &__subtitle {
    color: $text-muted;
    font-size: $text-sm;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: $space-5;
  }

  &__error {
    display: flex;
    align-items: center;
    gap: $space-2;
    color: $danger;
    font-size: $text-sm;
    background: $danger-bg;
    border: 1px solid rgba(255, 138, 138, 0.25);
    padding: $space-3 $space-4;
    border-radius: $radius;
  }

  &__submit {
    width: 100%;
    margin-top: $space-2;
  }

  &__footer {
    font-size: $text-xs;
    color: $text-subtle;
  }

  &__hint {
    color: $text-muted;
    font-size: $text-sm;
  }

  &__textbtn {
    background: none;
    border: 0;
    color: $text-muted;
    cursor: pointer;
    font: inherit;
    padding: 0;
  }

  &__demo {
    width: 100%;
    color: $text-subtle;
    font-size: $text-xs;

    summary { cursor: pointer; }
    p { margin-top: $space-2; }
  }
}

// Form fields
.field {
  display: flex;
  flex-direction: column;
  gap: $space-2;

  &__label {
    font-size: $text-sm;
    font-weight: $fw-medium;
    color: $text-muted;
  }

  &__wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  &__icon {
    position: absolute;
    left: $space-3;
    color: $text-subtle;
    pointer-events: none;
    flex-shrink: 0;
  }

  &__input {
    width: 100%;
    height: 44px;
    padding: 0 $space-10 0 $space-10;
    background: $bg-input;
    border: 1px solid $border;
    border-radius: $radius;
    color: $text;
    font-size: $text-sm;
    transition: $transition;
    outline: none;

    &::placeholder {
      color: $text-subtle;
    }

    &:hover {
      border-color: $border-hover;
    }

    &:focus {
      border-color: $primary;
      box-shadow: 0 0 0 3px $primary-glow;
    }

    &--code {
      padding-left: $space-4;
      letter-spacing: 0.4em;
      font-family: $font-mono;
      font-size: $text-lg;
    }
  }

  &__toggle {
    position: absolute;
    right: $space-3;
    background: none;
    border: none;
    color: $text-subtle;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: $space-1;
    border-radius: $radius-sm;
    transition: $transition-fast;

    &:hover {
      color: $text-muted;
    }
  }
}
</style>
