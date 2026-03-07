<template>
  <div class="layout">
    <!-- Mobile overlay -->
    <Transition name="fade">
      <div
        v-if="sidebarOpen"
        class="layout__overlay"
        @click="sidebarOpen = false"
      />
    </Transition>

    <AppSidebar :open="sidebarOpen" @close="sidebarOpen = false" />

    <div class="layout__main">
      <!-- Mobile header -->
      <header class="layout__topbar">
        <button
          class="layout__menu-btn"
          @click="sidebarOpen = !sidebarOpen"
          aria-label="Abrir menú"
        >
          <Menu :size="20" />
        </button>
        <div class="layout__topbar-logo">
          <Zap :size="16" />
          <span>Diginode</span>
        </div>
      </header>

      <main class="layout__content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Menu, Zap } from 'lucide-vue-next'
import AppSidebar from './AppSidebar.vue'

const sidebarOpen = ref(false)
</script>

<style lang="scss" scoped>
.layout {
  display: flex;
  min-height: 100dvh;

  &__overlay {
    position: fixed;
    inset: 0;
    background: rgba(8, 8, 26, 0.7);
    z-index: 99;
    display: block;

    @media (min-width: 1024px) {
      display: none;
    }
  }

  &__main {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    margin-left: 0;

    @media (min-width: 1024px) {
      margin-left: $sidebar-width;
    }
  }

  &__topbar {
    display: flex;
    align-items: center;
    gap: $space-3;
    padding: 0 $space-4;
    height: $header-height;
    border-bottom: 1px solid $border;
    background: $bg-surface;
    position: sticky;
    top: 0;
    z-index: 50;

    @media (min-width: 1024px) {
      display: none;
    }
  }

  &__menu-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: 1px solid $border;
    color: $text-muted;
    border-radius: $radius;
    width: 36px;
    height: 36px;
    cursor: pointer;
    transition: $transition-fast;

    &:hover {
      color: $text;
      border-color: $border-hover;
    }
  }

  &__topbar-logo {
    display: flex;
    align-items: center;
    gap: $space-2;
    font-size: $text-base;
    font-weight: $fw-bold;
    color: $text;

    svg {
      color: $primary;
    }
  }

  &__content {
    flex: 1;
    padding: $space-8;
    max-width: 1400px;
    width: 100%;
    margin: 0 auto;

    @media (max-width: 768px) {
      padding: $space-4;
    }
  }
}

// Fade overlay
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
