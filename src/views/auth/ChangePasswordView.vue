<template>
  <div class="change-pwd">
    <div class="change-pwd__bg" aria-hidden="true" />

    <div class="change-pwd__container">
      <!-- Brand -->
      <RouterLink to="/" class="change-pwd__brand">
        <div class="change-pwd__brand-icon">
          <Zap :size="24" />
        </div>
        <h1 class="change-pwd__brand-name">Diginode</h1>
      </RouterLink>

      <div class="change-pwd__card">
        <div class="change-pwd__header">
          <div class="change-pwd__icon-wrap">
            <KeyRound :size="22" />
          </div>
          <h2 class="change-pwd__title">Crea tu contraseña</h2>
          <p class="change-pwd__subtitle">
            Esta es tu primera vez accediendo. Elige una contraseña segura para proteger tu cuenta.
          </p>
        </div>

        <form class="change-pwd__form" @submit.prevent="handleSubmit" novalidate>
          <div class="field">
            <label class="field__label" for="new-password">Nueva contraseña</label>
            <div class="field__wrapper">
              <Lock :size="16" class="field__icon" />
              <input
                id="new-password"
                v-model="form.newPassword"
                :type="showNew ? 'text' : 'password'"
                class="field__input"
                placeholder="Mínimo 8 caracteres"
                autocomplete="new-password"
                required
              />
              <button type="button" class="field__toggle" @click="showNew = !showNew">
                <component :is="showNew ? EyeOff : Eye" :size="16" />
              </button>
            </div>
          </div>

          <div class="field">
            <label class="field__label" for="confirm-password">Confirmar contraseña</label>
            <div class="field__wrapper">
              <Lock :size="16" class="field__icon" />
              <input
                id="confirm-password"
                v-model="form.confirmPassword"
                :type="showConfirm ? 'text' : 'password'"
                class="field__input"
                placeholder="Repite la contraseña"
                autocomplete="new-password"
                required
              />
              <button type="button" class="field__toggle" @click="showConfirm = !showConfirm">
                <component :is="showConfirm ? EyeOff : Eye" :size="16" />
              </button>
            </div>
          </div>

          <p v-if="error" class="change-pwd__error" role="alert">
            <AlertCircle :size="14" />
            {{ error }}
          </p>

          <AppButton type="submit" size="lg" :loading="loading" class="change-pwd__submit">
            Guardar y acceder al portal
          </AppButton>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Zap, Lock, Eye, EyeOff, AlertCircle, KeyRound } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useClientStore } from '@/stores/client'
import { useApi } from '@/composables/useApi'
import AppButton from '@/components/ui/AppButton.vue'

const auth        = useAuthStore()
const clientStore = useClientStore()
const router      = useRouter()
const api         = useApi()

const form = ref({ newPassword: '', confirmPassword: '' })
const loading     = ref(false)
const error       = ref('')
const showNew     = ref(false)
const showConfirm = ref(false)

async function handleSubmit() {
  error.value = ''

  if (form.value.newPassword.length < 8) {
    error.value = 'La contraseña debe tener al menos 8 caracteres'
    return
  }

  if (form.value.newPassword !== form.value.confirmPassword) {
    error.value = 'Las contraseñas no coinciden'
    return
  }

  loading.value = true

  try {
    await api.post('/auth/change-password', { new_password: form.value.newPassword })
    auth.clearPasswordChangeFlag()
    await clientStore.load()
    router.push('/portal/dashboard')
  } catch (err) {
    error.value = err.message ?? 'No se pudo cambiar la contraseña'
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.change-pwd {
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

  &__icon-wrap {
    width: 48px;
    height: 48px;
    background: rgba(124, 111, 255, 0.12);
    border: 1px solid rgba(124, 111, 255, 0.25);
    border-radius: $radius-lg;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $primary;
    margin-bottom: $space-4;
  }

  &__title {
    font-size: $text-2xl;
    font-weight: $fw-bold;
    color: $text;
    margin-bottom: $space-2;
  }

  &__subtitle {
    color: $text-muted;
    font-size: $text-sm;
    line-height: 1.6;
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
