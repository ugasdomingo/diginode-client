<template>
  <div class="card" :class="{ 'card--hoverable': hoverable }">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  hoverable: { type: Boolean, default: false },
})
</script>

<style lang="scss" scoped>
.card {
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius-lg;
  padding: $space-6;

  &--hoverable {
    transition: $transition;
    cursor: pointer;

    &:hover {
      border-color: $border-hover;
      box-shadow: $shadow-glow;
      transform: translateY(-2px);
    }
  }
}
</style>
