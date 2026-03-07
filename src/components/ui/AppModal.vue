<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-overlay" @click.self="$emit('update:modelValue', false)">
        <div class="modal" :class="`modal--${size}`" role="dialog" aria-modal="true">
          <div class="modal__header">
            <h3 class="modal__title">{{ title }}</h3>
            <button
              class="modal__close"
              @click="$emit('update:modelValue', false)"
              aria-label="Cerrar"
            >
              <X :size="18" />
            </button>
          </div>
          <div class="modal__body">
            <slot />
          </div>
          <div v-if="$slots.footer" class="modal__footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { X } from 'lucide-vue-next'

defineProps({
  modelValue: { type: Boolean, required: true },
  title:      { type: String, default: '' },
  size:       { type: String, default: 'md' },
})

defineEmits(['update:modelValue'])
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(8, 8, 26, 0.8);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: $space-4;
}

.modal {
  background: $bg-card;
  border: 1px solid $border-hover;
  border-radius: $radius-xl;
  width: 100%;
  box-shadow: $shadow-lg;

  &--sm { max-width: 400px; }
  &--md { max-width: 560px; }
  &--lg { max-width: 720px; }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $space-6;
    border-bottom: 1px solid $border;
  }

  &__title {
    font-size: $text-lg;
    font-weight: $fw-semibold;
    color: $text;
  }

  &__close {
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    color: $text-muted;
    cursor: pointer;
    padding: $space-1;
    border-radius: $radius-sm;
    transition: $transition-fast;

    &:hover {
      color: $text;
      background: $primary-subtle;
    }
  }

  &__body {
    padding: $space-6;
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
    gap: $space-3;
    padding: $space-4 $space-6;
    border-top: 1px solid $border;
  }
}

// Transition
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;

  .modal {
    transition: transform 0.2s ease, opacity 0.2s ease;
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;

  .modal {
    transform: scale(0.96) translateY(8px);
    opacity: 0;
  }
}
</style>
