<template>
  <div class="public-layout">
    <!-- Navbar -->
    <header class="navbar" :class="{ 'navbar--scrolled': isScrolled }">
      <div class="navbar__inner">
        <RouterLink to="/" class="navbar__logo">
          <img src="/logo.png" alt="DigiNode" class="navbar__logo-img" />
          <span class="navbar__logo-text">DigiNode</span>
        </RouterLink>

        <nav class="navbar__nav" aria-label="Navegacion principal">
          <RouterLink :to="{ path: '/', hash: '#empleados' }" class="navbar__link">Empleados</RouterLink>
          <RouterLink :to="{ path: '/', hash: '#precios' }" class="navbar__link">Precios</RouterLink>
          <RouterLink :to="{ path: '/', hash: '#faq' }" class="navbar__link">FAQ</RouterLink>
          <RouterLink to="/blog" class="navbar__link">Blog</RouterLink>
        </nav>

        <div class="navbar__actions">
          <RouterLink to="/bolsa-de-empleo" class="navbar__cta-secondary">
            Conocer al equipo
          </RouterLink>
          <a
            :href="calLink"
            target="_blank"
            rel="noopener noreferrer"
            class="navbar__cta"
          >
            <CalendarCheck :size="16" />
            Agendar demo
          </a>
        </div>

        <!-- Mobile menu toggle -->
        <button
          class="navbar__burger"
          @click="mobileOpen = !mobileOpen"
          :aria-expanded="mobileOpen"
          aria-label="Menu"
        >
          <component :is="mobileOpen ? X : Menu" :size="22" />
        </button>
      </div>

      <!-- Mobile nav -->
      <Transition name="mobile-nav">
        <div v-if="mobileOpen" class="navbar__mobile">
          <RouterLink :to="{ path: '/', hash: '#empleados' }" class="navbar__mobile-link" @click="mobileOpen = false">Empleados</RouterLink>
          <RouterLink :to="{ path: '/', hash: '#precios' }" class="navbar__mobile-link" @click="mobileOpen = false">Precios</RouterLink>
          <RouterLink :to="{ path: '/', hash: '#faq' }" class="navbar__mobile-link" @click="mobileOpen = false">FAQ</RouterLink>
          <RouterLink to="/blog" class="navbar__mobile-link" @click="mobileOpen = false">Blog</RouterLink>
          <div class="navbar__mobile-actions">
            <RouterLink to="/bolsa-de-empleo" class="navbar__mobile-cta-secondary" @click="mobileOpen = false">
              Conocer al equipo
            </RouterLink>
            <a
              :href="calLink"
              target="_blank"
              rel="noopener noreferrer"
              class="navbar__mobile-cta"
              @click="mobileOpen = false"
            >
              <CalendarCheck :size="16" />
              Agendar demo gratuita
            </a>
          </div>
        </div>
      </Transition>
    </header>

    <!-- Content -->
    <main>
      <RouterView />
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer__inner">
        <div class="footer__top">
          <div class="footer__brand">
            <RouterLink to="/" class="footer__logo">
              <img src="/logo.png" alt="DigiNode" class="footer__logo-img" />
              <span>DigiNode</span>
            </RouterLink>
            <p class="footer__tagline">Empleados IA para emprendedores que quieren dejar de hacerlo todo solos.</p>
          </div>

          <div class="footer__links-group">
            <h4>Producto</h4>
            <nav class="footer__links">
              <RouterLink to="/bolsa-de-empleo">Empleados IA</RouterLink>
              <RouterLink :to="{ path: '/', hash: '#precios' }">Precios</RouterLink>
              <RouterLink :to="{ path: '/', hash: '#faq' }">FAQ</RouterLink>
            </nav>
          </div>

          <div class="footer__links-group">
            <h4>Legal</h4>
            <nav class="footer__links">
              <RouterLink to="/legal/terminos">Terminos</RouterLink>
              <RouterLink to="/legal/privacidad">Privacidad</RouterLink>
              <RouterLink to="/legal/aviso-legal">Aviso legal</RouterLink>
            </nav>
          </div>

          <div class="footer__links-group">
            <h4>Contacto</h4>
            <nav class="footer__links">
              <a :href="calLink" target="_blank" rel="noopener noreferrer">Agendar demo</a>
              <a href="https://wa.me/34604822385" target="_blank" rel="noopener noreferrer">WhatsApp</a>
            </nav>
          </div>
        </div>

        <div class="footer__bottom">
          <p class="footer__copy">&copy; {{ year }} DigiNode. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>

    <!-- WhatsApp floating button -->
    <a
      href="https://wa.me/34604822385?text=Hola%2C%20soy%20emprendedor%20y%20quiero%20conocer%20m%C3%A1s%20sobre%20vuestros%20empleados%20IA"
      target="_blank"
      rel="noopener noreferrer"
      class="whatsapp-btn"
      aria-label="Contactar por WhatsApp"
    >
      <svg class="whatsapp-btn__icon" viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
      <span class="whatsapp-btn__label">Hablamos?</span>
    </a>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Menu, X, CalendarCheck } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const calLink = import.meta.env.VITE_CAL_BOOKING_LINK || '#'
const mobileOpen = ref(false)
const isScrolled = ref(false)
const year = new Date().getFullYear()

const auth = useAuthStore()
const dashboardLink = computed(() => auth.isAdmin ? '/admin' : '/portal')

function handleScroll() {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style lang="scss" scoped>
.public-layout {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

// ── Navbar ──────────────────────────────
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba($bg, 0.7);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid transparent;
  transition: $transition;

  &--scrolled {
    background: rgba($bg, 0.95);
    border-bottom-color: $border;
  }

  &__inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 $space-6;
    height: 72px;
    display: flex;
    align-items: center;
    gap: $space-8;

    @media (max-width: $bp-md) {
      padding: 0 $space-4;
    }
  }

  &__logo {
    display: flex;
    align-items: center;
    gap: $space-3;
    text-decoration: none;
    flex-shrink: 0;

    &-img {
      width: 36px;
      height: 36px;
      object-fit: contain;
    }

    &-text {
      font-family: $font-display;
      font-size: $text-xl;
      font-weight: $fw-bold;
      color: $text;
      letter-spacing: -0.02em;
    }
  }

  &__nav {
    display: none;
    align-items: center;
    gap: $space-1;
    flex: 1;

    @media (min-width: $bp-md) {
      display: flex;
    }
  }

  &__link {
    padding: $space-2 $space-4;
    font-size: $text-sm;
    font-weight: $fw-medium;
    color: $text-muted;
    text-decoration: none;
    border-radius: $radius;
    transition: $transition-fast;

    &:hover {
      color: $text;
      background: $primary-subtle;
    }

    &.router-link-active {
      color: $primary-light;
    }
  }

  &__actions {
    display: none;
    align-items: center;
    gap: $space-3;
    margin-left: auto;

    @media (min-width: $bp-md) {
      display: flex;
    }
  }

  &__cta-secondary {
    display: inline-flex;
    align-items: center;
    height: 40px;
    padding: 0 $space-4;
    border: 1px solid $border;
    border-radius: $radius;
    font-size: $text-sm;
    font-weight: $fw-medium;
    color: $text-muted;
    text-decoration: none;
    transition: $transition-fast;

    &:hover {
      border-color: $primary;
      color: $primary-light;
      background: $primary-subtle;
    }
  }

  &__cta {
    display: inline-flex;
    align-items: center;
    gap: $space-2;
    height: 40px;
    padding: 0 $space-5;
    background: linear-gradient(135deg, $primary 0%, $primary-dark 100%);
    color: $text-inverse;
    font-size: $text-sm;
    font-weight: $fw-semibold;
    border-radius: $radius;
    text-decoration: none;
    transition: $transition;
    box-shadow: 0 4px 16px rgba($primary, 0.25);

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 24px rgba($primary, 0.35);
      color: $text-inverse;
    }
  }

  &__burger {
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: 1px solid $border;
    color: $text;
    border-radius: $radius;
    width: 44px;
    height: 44px;
    cursor: pointer;
    margin-left: auto;
    transition: $transition-fast;

    @media (min-width: $bp-md) {
      display: none;
    }

    &:hover {
      border-color: $primary;
      background: $primary-subtle;
    }
  }

  &__mobile {
    border-top: 1px solid $border;
    padding: $space-4 $space-6;
    display: flex;
    flex-direction: column;
    gap: $space-1;
    background: $bg;

    @media (min-width: $bp-md) {
      display: none;
    }
  }

  &__mobile-link {
    padding: $space-3 $space-4;
    font-size: $text-base;
    font-weight: $fw-medium;
    color: $text-muted;
    text-decoration: none;
    border-radius: $radius;
    transition: $transition-fast;

    &:hover {
      color: $text;
      background: $primary-subtle;
    }
  }

  &__mobile-actions {
    display: flex;
    flex-direction: column;
    gap: $space-3;
    padding-top: $space-4;
    border-top: 1px solid $border;
    margin-top: $space-3;
  }

  &__mobile-cta-secondary {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 48px;
    padding: 0 $space-4;
    border: 1px solid $border;
    border-radius: $radius;
    font-size: $text-sm;
    font-weight: $fw-medium;
    color: $text-muted;
    text-decoration: none;
  }

  &__mobile-cta {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $space-2;
    height: 48px;
    padding: 0 $space-5;
    background: linear-gradient(135deg, $primary 0%, $primary-dark 100%);
    color: $text-inverse;
    font-size: $text-sm;
    font-weight: $fw-semibold;
    border-radius: $radius;
    text-decoration: none;
  }
}

// Mobile nav transition
.mobile-nav-enter-active,
.mobile-nav-leave-active {
  transition: all 0.25s ease;
}
.mobile-nav-enter-from,
.mobile-nav-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

// ── Main content spacer for fixed navbar ──
main {
  padding-top: 72px;
}

// ── Footer ──────────────────────────────
.footer {
  margin-top: auto;
  border-top: 1px solid $border;
  background: $bg-surface;

  &__inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: $space-16 $space-6;

    @media (max-width: $bp-md) {
      padding: $space-10 $space-4;
    }
  }

  &__top {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: $space-10;
    margin-bottom: $space-10;

    @media (max-width: $bp-lg) {
      grid-template-columns: 1fr 1fr;
      gap: $space-8;
    }

    @media (max-width: $bp-sm) {
      grid-template-columns: 1fr;
    }
  }

  &__brand {
    @media (max-width: $bp-lg) {
      grid-column: span 2;
    }

    @media (max-width: $bp-sm) {
      grid-column: span 1;
    }
  }

  &__logo {
    display: flex;
    align-items: center;
    gap: $space-2;
    font-family: $font-display;
    font-weight: $fw-bold;
    font-size: $text-xl;
    color: $text;
    text-decoration: none;
    margin-bottom: $space-3;

    &-img {
      width: 32px;
      height: 32px;
      object-fit: contain;
    }
  }

  &__tagline {
    font-size: $text-sm;
    color: $text-muted;
    max-width: 280px;
    line-height: 1.6;
  }

  &__links-group {
    h4 {
      font-size: $text-sm;
      font-weight: $fw-semibold;
      color: $text;
      margin-bottom: $space-4;
    }
  }

  &__links {
    display: flex;
    flex-direction: column;
    gap: $space-2;

    a {
      font-size: $text-sm;
      color: $text-muted;
      text-decoration: none;
      transition: $transition-fast;

      &:hover {
        color: $primary-light;
      }
    }
  }

  &__bottom {
    padding-top: $space-8;
    border-top: 1px solid $border;
  }

  &__copy {
    font-size: $text-sm;
    color: $text-subtle;
  }
}

// ── WhatsApp floating button ──────────────────────
.whatsapp-btn {
  position: fixed;
  bottom: $space-6;
  right: $space-6;
  z-index: 500;
  display: flex;
  align-items: center;
  gap: $space-2;
  height: 52px;
  padding: 0 $space-5;
  background: #25d366;
  color: #fff;
  border-radius: $radius-full;
  text-decoration: none;
  font-size: $text-sm;
  font-weight: $fw-semibold;
  box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
  transition: $transition;

  @media (max-width: $bp-sm) {
    bottom: $space-4;
    right: $space-4;
    padding: 0 $space-4;
    height: 48px;
  }

  &:hover {
    background: #20c05c;
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(37, 211, 102, 0.5);
    color: #fff;
  }

  &__icon {
    flex-shrink: 0;
  }

  &__label {
    @media (max-width: 480px) {
      display: none;
    }
  }
}
</style>
