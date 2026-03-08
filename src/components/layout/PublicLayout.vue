<template>
  <div class="public-layout">
    <!-- Navbar -->
    <header class="navbar">
      <div class="navbar__inner">
        <RouterLink to="/" class="navbar__logo">
          <div class="navbar__logo-mark">
            <Zap :size="16" />
          </div>
          <span class="navbar__logo-text">Diginode</span>
        </RouterLink>

        <nav class="navbar__nav" aria-label="Navegación principal">
          <a href="#empleados" class="navbar__link">Empleados</a>
          <a href="#paquetes" class="navbar__link">Paquetes</a>
          <a href="#faq" class="navbar__link">FAQ</a>
        </nav>

        <div class="navbar__actions">
          <a
            href="https://cal.com/diginode/demo"
            target="_blank"
            rel="noopener noreferrer"
            class="navbar__cta"
          >
            Agendar demo
          </a>
          <RouterLink to="/login" class="navbar__login">
            Acceder
          </RouterLink>
        </div>

        <!-- Mobile menu toggle -->
        <button
          class="navbar__burger"
          @click="mobileOpen = !mobileOpen"
          :aria-expanded="mobileOpen"
          aria-label="Menú"
        >
          <component :is="mobileOpen ? X : Menu" :size="20" />
        </button>
      </div>

      <!-- Mobile nav -->
      <Transition name="mobile-nav">
        <div v-if="mobileOpen" class="navbar__mobile">
          <a href="#empleados" class="navbar__mobile-link" @click="mobileOpen = false">Empleados</a>
          <a href="#paquetes" class="navbar__mobile-link" @click="mobileOpen = false">Paquetes</a>
          <a href="#faq" class="navbar__mobile-link" @click="mobileOpen = false">FAQ</a>
          <div class="navbar__mobile-actions">
            <a
              href="https://cal.com/diginode/demo"
              target="_blank"
              rel="noopener noreferrer"
              class="navbar__cta navbar__cta--full"
              @click="mobileOpen = false"
            >
              Agendar demo gratuita
            </a>
            <RouterLink
              to="/login"
              class="navbar__login navbar__login--full"
              @click="mobileOpen = false"
            >
              Acceder al panel
            </RouterLink>
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
        <div class="footer__brand">
          <div class="footer__logo">
            <div class="footer__logo-mark">
              <Zap :size="14" />
            </div>
            <span>Diginode</span>
          </div>
          <p class="footer__tagline">Tu agencia de empleados IA</p>
        </div>

        <nav class="footer__links" aria-label="Navegación legal">
          <RouterLink to="/legal/terminos" class="footer__link">Términos y condiciones</RouterLink>
          <RouterLink to="/legal/privacidad" class="footer__link">Política de privacidad</RouterLink>
          <RouterLink to="/legal/aviso-legal" class="footer__link">Aviso legal</RouterLink>
        </nav>

        <p class="footer__copy">&copy; {{ year }} Diginode. Todos los derechos reservados.</p>
      </div>
    </footer>

    <!-- WhatsApp floating button -->
    <a
      href="https://wa.me/34604822385?text=Hola%2C%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20vuestros%20empleados%20IA"
      target="_blank"
      rel="noopener noreferrer"
      class="whatsapp-btn"
      aria-label="Contactar por WhatsApp"
    >
      <svg class="whatsapp-btn__icon" viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
      <span class="whatsapp-btn__label">¿Hablamos?</span>
    </a>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Zap, Menu, X } from 'lucide-vue-next'

const mobileOpen = ref(false)
const year = new Date().getFullYear()
</script>

<style lang="scss" scoped>
.public-layout {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

// ── Navbar ──────────────────────────────
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(8, 8, 26, 0.85);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid $border;

  &__inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 $space-6;
    height: 64px;
    display: flex;
    align-items: center;
    gap: $space-8;
  }

  &__logo {
    display: flex;
    align-items: center;
    gap: $space-2;
    text-decoration: none;
    flex-shrink: 0;

    &-mark {
      width: 30px;
      height: 30px;
      background: $primary;
      border-radius: $radius;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      box-shadow: 0 0 16px $primary-glow;
    }

    &-text {
      font-size: $text-lg;
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

    @media (min-width: 768px) {
      display: flex;
    }
  }

  &__link {
    padding: $space-2 $space-3;
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
  }

  &__actions {
    display: none;
    align-items: center;
    gap: $space-3;
    margin-left: auto;

    @media (min-width: 768px) {
      display: flex;
    }
  }

  &__cta {
    display: inline-flex;
    align-items: center;
    height: 36px;
    padding: 0 $space-4;
    background: $primary;
    color: #fff;
    font-size: $text-sm;
    font-weight: $fw-medium;
    border-radius: $radius;
    text-decoration: none;
    transition: $transition;
    box-shadow: 0 0 16px $primary-glow;

    &:hover {
      background: $primary-dark;
      transform: translateY(-1px);
      color: #fff;
    }

    &--full { width: 100%; justify-content: center; }
  }

  &__login {
    display: inline-flex;
    align-items: center;
    height: 36px;
    padding: 0 $space-4;
    border: 1px solid $border;
    border-radius: $radius;
    font-size: $text-sm;
    font-weight: $fw-medium;
    color: $text-muted;
    text-decoration: none;
    transition: $transition-fast;

    &:hover {
      border-color: $border-hover;
      color: $text;
    }

    &--full { width: 100%; justify-content: center; }
  }

  &__burger {
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
    margin-left: auto;
    transition: $transition-fast;

    @media (min-width: 768px) {
      display: none;
    }

    &:hover {
      color: $text;
      border-color: $border-hover;
    }
  }

  &__mobile {
    border-top: 1px solid $border;
    padding: $space-4 $space-6;
    display: flex;
    flex-direction: column;
    gap: $space-2;

    @media (min-width: 768px) {
      display: none;
    }
  }

  &__mobile-link {
    padding: $space-3 $space-2;
    font-size: $text-sm;
    font-weight: $fw-medium;
    color: $text-muted;
    text-decoration: none;
    border-radius: $radius;
    transition: $transition-fast;

    &:hover { color: $text; background: $primary-subtle; }
  }

  &__mobile-actions {
    display: flex;
    flex-direction: column;
    gap: $space-2;
    padding-top: $space-2;
    border-top: 1px solid $border;
    margin-top: $space-2;
  }
}

// Mobile nav transition
.mobile-nav-enter-active,
.mobile-nav-leave-active { transition: all 0.2s ease; }
.mobile-nav-enter-from,
.mobile-nav-leave-to { opacity: 0; transform: translateY(-8px); }

// ── Footer ──────────────────────────────
.footer {
  margin-top: auto;
  border-top: 1px solid $border;
  background: $bg-surface;

  &__inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: $space-10 $space-6;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $space-6;
    text-align: center;
  }

  &__brand {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $space-2;
  }

  &__logo {
    display: flex;
    align-items: center;
    gap: $space-2;
    font-weight: $fw-bold;
    font-size: $text-lg;
    color: $text;
  }

  &__logo-mark {
    width: 26px;
    height: 26px;
    background: $primary;
    border-radius: $radius-sm;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
  }

  &__tagline {
    font-size: $text-sm;
    color: $text-muted;
  }

  &__links {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: $space-1;
  }

  &__link {
    padding: $space-1 $space-3;
    font-size: $text-sm;
    color: $text-muted;
    text-decoration: none;
    border-radius: $radius;
    transition: $transition-fast;

    &:hover { color: $primary-light; }
  }

  &__copy {
    font-size: $text-xs;
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
  padding: 0 $space-4;
  background: #25d366;
  color: #fff;
  border-radius: $radius-full;
  text-decoration: none;
  font-size: $text-sm;
  font-weight: $fw-semibold;
  box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
  transition: $transition;

  &:hover {
    background: #22c55e;
    transform: translateY(-2px);
    box-shadow: 0 6px 28px rgba(37, 211, 102, 0.5);
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
