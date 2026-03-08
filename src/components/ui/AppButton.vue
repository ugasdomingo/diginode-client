<template>
  <component
    :is="tag"
    class="btn"
    :class="[`btn--${variant}`, `btn--${size}`, { 'btn--loading': loading }]"
    :disabled="disabled || loading"
    v-bind="$attrs"
  >
    <AppSpinner v-if="loading" :size="16" class="btn__spinner" />
    <slot v-else />
  </component>
</template>

<script setup>
import AppSpinner from './AppSpinner.vue'

defineProps({
  variant: { type: String, default: 'primary' },
  size:    { type: String, default: 'md' },
  loading: { type: Boolean, default: false },
  disabled:{ type: Boolean, default: false },
  tag:     { type: String, default: 'button' },
})
</script>

<style lang="scss" scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: $space-2;
  font-family: $font-sans;
  font-weight: $fw-medium;
  border-radius: $radius;
  border: 1px solid transparent;
  cursor: pointer;
  transition: $transition;
  white-space: nowrap;
  text-decoration: none;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    pointer-events: none;
  }

  // Sizes
  &--sm {
    height: 32px;
    padding: 0 $space-3;
    font-size: $text-sm;
    border-radius: $radius-sm;
  }

  &--md {
    height: 40px;
    padding: 0 $space-5;
    font-size: $text-sm;
  }

  &--lg {
    height: 48px;
    padding: 0 $space-6;
    font-size: $text-base;
  }

  // Variants
  &--primary {
    background: $primary;
    color: $text-inverse;
    box-shadow: 0 0 20px $primary-glow;

    &:hover:not(:disabled) {
      background: $primary-dark;
      box-shadow: 0 0 28px rgba(124, 111, 255, 0.35);
      transform: translateY(-1px);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }
  }

  &--secondary {
    background: $bg-card-2;
    border-color: $border;
    color: $text;

    &:hover:not(:disabled) {
      background: $bg-card;
      border-color: $border-hover;
    }
  }

  &--ghost {
    background: transparent;
    color: $text-muted;

    &:hover:not(:disabled) {
      background: $primary-subtle;
      color: $text;
    }
  }

  &--danger {
    background: $danger-bg;
    border-color: rgba(244, 63, 94, 0.3);
    color: $danger;

    &:hover:not(:disabled) {
      background: $danger;
      color: #fff;
    }
  }

  &--loading {
    pointer-events: none;
  }

  &__spinner {
    flex-shrink: 0;
  }
}
</style>
