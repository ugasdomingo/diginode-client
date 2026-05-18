<template>
  <span class="badge" :class="`badge--${variant}`">
    <slot />
  </span>
</template>

<script setup>
defineProps({
  variant: { type: String, default: 'default' },
})
</script>

<style lang="scss" scoped>
.badge {
  display: inline-flex;
  align-items: center;
  gap: $space-1;
  padding: 2px $space-2;
  font-size: $text-xs;
  font-weight: $fw-medium;
  border-radius: $radius-full;
  border: 1px solid transparent;
  letter-spacing: 0.02em;

  &--default {
    background: $bg-card-2;
    color: $text-muted;
    border-color: $border;
  }

  &--primary {
    background: $primary-subtle;
    color: $primary-light;
    border-color: rgba(156, 255, 203, 0.25);
  }

  &--success {
    background: $success-bg;
    color: $accent;
    border-color: rgba(156, 255, 203, 0.25);
  }

  &--warning {
    background: $warning-bg;
    color: $warning;
    border-color: rgba(255, 211, 138, 0.25);
  }

  &--danger {
    background: $danger-bg;
    color: $danger;
    border-color: rgba(255, 138, 138, 0.25);
  }

  &--info {
    background: $info-bg;
    color: $info;
    border-color: rgba(143, 179, 255, 0.25);
  }
}
</style>
