<template>
  <RouterLink to="/demo" class="nora-cta" :class="`nora-cta--${variant}`">
    <MessageCircle :size="18" />
    {{ label }}
  </RouterLink>
</template>

<script setup>
import { MessageCircle } from 'lucide-vue-next'

defineProps({
  label:   { type: String, default: 'Habla con Nora ahora' },
  variant: { type: String, default: 'primary' }, // 'primary' | 'ghost'
})
</script>

<style lang="scss" scoped>
.nora-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: $space-2;
  height: 48px;
  padding: 0 $space-6;
  border-radius: $radius;
  font-size: $text-base;
  font-weight: $fw-semibold;
  text-decoration: none;
  transition: $transition;

  &--primary {
    background: linear-gradient(135deg, $primary 0%, $primary-dark 100%);
    color: $text-inverse;
    box-shadow: 0 4px 20px rgba($primary, 0.3);

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 8px 28px rgba($primary, 0.42);
      color: $text-inverse;
    }
  }

  &--ghost {
    border: 1px solid $border;
    color: $text;

    &:hover {
      border-color: $primary;
      color: $primary-light;
      background: $primary-subtle;
    }
  }
}
</style>
