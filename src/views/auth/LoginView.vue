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

        <form class="login__form" @submit.prevent="handleLogin" novalidate>
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
import { useApi } from '@/composables/useApi'
import AppButton from '@/components/ui/AppButton.vue'

const auth   = useAuthStore()
const router = useRouter()
const api    = useApi()

const form = ref({ email: '', password: '' })
const loading     = ref(false)
const error       = ref('')
const showPassword = ref(false)

async function handleLogin() {
  error.value   = ''
  loading.value = true

  try {
    const data = await api.post('/auth/login', {
      email:    form.value.email.trim().toLowerCase(),
      password: form.value.password,
    })

    auth.setToken(data.token)

    if (auth.isAdmin)  router.push('/admin/dashboard')
    else               router.push('/portal/dashboard')
  } catch (err) {
    error.value = err.message ?? 'Credenciales incorrectas'
  } finally {
    loading.value = false
  }
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
      linear-gradient(rgba(124, 111, 255, 0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(124, 111, 255, 0.04) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse 60% 50% at 50% 50%, rgba(124, 111, 255, 0.12) 0%, transparent 70%);
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
    color: #fff;
    box-shadow: 0 0 32px rgba(124, 111, 255, 0.4);
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
    border: 1px solid rgba(244, 63, 94, 0.2);
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
