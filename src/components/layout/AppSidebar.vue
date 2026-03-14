<template>
  <aside class="sidebar" :class="{ 'sidebar--open': open }">
    <!-- Logo -->
    <RouterLink to="/" class="sidebar__logo">
      <div class="sidebar__logo-mark">
        <Zap :size="18" />
      </div>
      <span class="sidebar__logo-text">Diginode</span>
    </RouterLink>

    <!-- Nav -->
    <nav class="sidebar__nav" aria-label="Navegación principal">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="sidebar__link"
        :class="{ 'sidebar__link--active': isActive(item.to) }"
        @click="$emit('close')"
      >
        <component :is="item.icon" :size="18" class="sidebar__link-icon" />
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>

    <!-- User info + logout -->
    <div class="sidebar__footer">
      <div class="sidebar__user">
        <div class="sidebar__user-avatar">
          {{ avatarChar }}
        </div>
        <div class="sidebar__user-info">
          <span class="sidebar__user-role">{{ roleLabel }}</span>
          <span class="sidebar__user-email">{{ auth.user?.email ?? '' }}</span>
        </div>
      </div>
      <button class="sidebar__logout" @click="handleLogout" aria-label="Cerrar sesión">
        <LogOut :size="16" />
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  LayoutDashboard,
  Users,
  LayoutGrid,
  BarChart3,
  Zap,
  FileText,
  LifeBuoy,
  LogOut,
  BookOpen,
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

defineProps({
  open: { type: Boolean, default: false },
})
defineEmits(['close'])

const auth   = useAuthStore()
const route  = useRoute()
const router = useRouter()

const adminNav = [
  { to: '/admin/dashboard', label: 'Dashboard',  icon: LayoutDashboard },
  { to: '/admin/leads',     label: 'Leads',       icon: Users },
  { to: '/admin/content',   label: 'Contenido',   icon: LayoutGrid },
  { to: '/admin/sales',     label: 'Análisis',    icon: BarChart3 },
  { to: '/admin/blog',      label: 'Blog',         icon: BookOpen },
]

const clientNav = [
  { to: '/portal/dashboard', label: 'Inicio',    icon: LayoutDashboard },
  { to: '/portal/invoices',  label: 'Facturas',  icon: FileText },
  { to: '/portal/support',   label: 'Soporte',   icon: LifeBuoy },
]

const navItems  = computed(() => auth.isAdmin ? adminNav : clientNav)
const roleLabel = computed(() => auth.isAdmin ? 'Administrador' : 'Cliente')
const avatarChar = computed(() => {
  const email = auth.user?.email ?? ''
  return email.charAt(0).toUpperCase()
})

function isActive(path) {
  return route.path.startsWith(path)
}

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>

<style lang="scss" scoped>
.sidebar {
  width: $sidebar-width;
  min-height: 100dvh;
  background: $bg-surface;
  border-right: 1px solid $border;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
  transform: translateX(-100%);
  transition: transform 0.25s ease;

  @media (min-width: 1024px) {
    position: sticky;
    transform: none;
  }

  &--open {
    transform: translateX(0);
    box-shadow: $shadow-lg;
  }

  &__logo {
    display: flex;
    align-items: center;
    gap: $space-3;
    padding: $space-6;
    border-bottom: 1px solid $border;
    height: $header-height;
    text-decoration: none;
  }

  &__logo-mark {
    width: 32px;
    height: 32px;
    background: $primary;
    border-radius: $radius;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    box-shadow: 0 0 16px $primary-glow;
    flex-shrink: 0;
  }

  &__logo-text {
    font-size: $text-lg;
    font-weight: $fw-bold;
    color: $text;
    letter-spacing: -0.02em;
  }

  &__nav {
    flex: 1;
    padding: $space-4 $space-3;
    display: flex;
    flex-direction: column;
    gap: $space-1;
    overflow-y: auto;
  }

  &__link {
    display: flex;
    align-items: center;
    gap: $space-3;
    padding: $space-2 $space-3;
    border-radius: $radius;
    color: $text-muted;
    font-size: $text-sm;
    font-weight: $fw-medium;
    text-decoration: none;
    transition: $transition-fast;

    &:hover {
      background: $primary-subtle;
      color: $text;
    }

    &--active {
      background: $primary-subtle;
      color: $primary-light;
      border: 1px solid rgba(124, 111, 255, 0.2);

      .sidebar__link-icon {
        color: $primary;
      }
    }

    &-icon {
      flex-shrink: 0;
    }
  }

  &__footer {
    padding: $space-4;
    border-top: 1px solid $border;
    display: flex;
    align-items: center;
    gap: $space-3;
  }

  &__user {
    display: flex;
    align-items: center;
    gap: $space-2;
    flex: 1;
    min-width: 0;
  }

  &__user-avatar {
    width: 32px;
    height: 32px;
    border-radius: $radius-full;
    background: $primary-glow;
    border: 1px solid $border-hover;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: $text-sm;
    font-weight: $fw-semibold;
    color: $primary-light;
    flex-shrink: 0;
  }

  &__user-info {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  &__user-role {
    font-size: $text-xs;
    font-weight: $fw-semibold;
    color: $text;
    line-height: 1.3;
  }

  &__user-email {
    font-size: $text-xs;
    color: $text-subtle;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__logout {
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: 1px solid $border;
    color: $text-muted;
    border-radius: $radius;
    width: 32px;
    height: 32px;
    cursor: pointer;
    transition: $transition-fast;
    flex-shrink: 0;

    &:hover {
      color: $danger;
      border-color: rgba(244, 63, 94, 0.3);
      background: $danger-bg;
    }
  }
}
</style>
