<template>
  <Teleport to="body">
    <div class="toast-container" aria-live="polite">
      <TransitionGroup name="toast" tag="div">
        <div
          v-for="toast in toastStore.toasts"
          :key="toast.id"
          class="toast"
          :class="`toast--${toast.type}`"
          role="alert"
        >
          <component :is="icons[toast.type]" :size="16" class="toast__icon" />
          <span class="toast__msg">{{ toast.message }}</span>
          <button class="toast__close" @click="toastStore.remove(toast.id)" aria-label="Cerrar">
            <X :size="14" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-vue-next'
import { useToastStore } from '@/stores/toast'

const toastStore = useToastStore()

const icons = {
  success: CheckCircle,
  error:   AlertCircle,
  info:    Info,
  warning: AlertTriangle,
}
</script>

<style lang="scss" scoped>
.toast-container {
  position: fixed;
  bottom: $space-6;
  right: $space-6;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: $space-2;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: $space-3;
  padding: $space-3 $space-4;
  border-radius: $radius;
  border: 1px solid;
  background: $bg-card-2;
  pointer-events: all;
  max-width: 360px;
  box-shadow: $shadow-lg;

  &--success {
    border-color: rgba(52, 211, 153, 0.25);
    .toast__icon { color: $accent; }
  }

  &--error {
    border-color: rgba(244, 63, 94, 0.25);
    .toast__icon { color: $danger; }
  }

  &--info {
    border-color: rgba(129, 140, 248, 0.25);
    .toast__icon { color: $info; }
  }

  &--warning {
    border-color: rgba(245, 158, 11, 0.25);
    .toast__icon { color: $warning; }
  }

  &__icon {
    flex-shrink: 0;
  }

  &__msg {
    flex: 1;
    font-size: $text-sm;
    color: $text;
  }

  &__close {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    color: $text-muted;
    cursor: pointer;
    padding: 2px;
    border-radius: $radius-sm;
    transition: $transition-fast;

    &:hover {
      color: $text;
      background: $primary-subtle;
    }
  }
}

// Transition
.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
