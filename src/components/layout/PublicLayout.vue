<template>
  <div class="public-layout">
    <a class="skip-link" href="#main-content">Saltar al contenido</a>
    <header class="public-nav">
      <div class="public-nav__inner">
        <RouterLink to="/" class="public-brand" aria-label="Diginode, inicio"
          ><img src="/logo.png" alt="" /><span>DigiNode</span></RouterLink
        >
        <button
          type="button"
          class="public-nav__toggle"
          aria-controls="public-menu"
          :aria-expanded="mobileOpen"
          aria-label="Abrir menú"
          @click="mobileOpen = !mobileOpen"
        >
          {{ mobileOpen ? 'Cerrar ✕' : 'Menú ☰' }}
        </button>
        <nav id="public-menu" :class="{ open: mobileOpen }" aria-label="Navegación principal">
          <RouterLink to="/" @click="mobileOpen = false">Gestión de marca</RouterLink
          ><RouterLink to="/webs-y-aplicaciones" @click="mobileOpen = false"
            >Webs y aplicaciones</RouterLink
          ><RouterLink to="/clinica-digital" @click="mobileOpen = false">Clínica Digital</RouterLink
          ><RouterLink :to="clientLink" @click="mobileOpen = false">Soy cliente</RouterLink>
          <button
            v-if="isClinic"
            type="button"
            class="commercial-button"
            :disabled="buying"
            @click="buyClinica"
          >
            {{ buying ? 'Abriendo pago…' : 'Comprar Clínica Digital' }}
          </button>
          <RouterLink
            v-else
            to="/#contacto"
            class="commercial-button"
            @click="requestReview"
            >Revisar mi negocio ↗</RouterLink
          >
        </nav>
      </div>
    </header>
    <main id="main-content"><RouterView /></main>
    <footer class="public-footer">
      <div class="public-footer__inner">
        <div>
          <RouterLink to="/" class="public-brand"
            ><img src="/logo.png" alt="" /><span>DigiNode</span></RouterLink
          >
          <p>Descansa, nosotros nos encargamos de todo.</p>
          <p>Marca, marketing y herramientas para tu negocio.</p>
        </div>
        <nav aria-label="Servicios">
          <strong>Tu siguiente paso</strong
          ><RouterLink to="/#contacto">Revisar mi negocio</RouterLink
          ><RouterLink to="/webs-y-aplicaciones">Webs y aplicaciones</RouterLink
          ><RouterLink to="/clinica-digital">Clínica Digital</RouterLink
          ><RouterLink to="/clinica-digital#demo-nora">Demo para tu consulta</RouterLink
          ><RouterLink to="/es-para-mi">Clínica: ¿es para mí?</RouterLink
          ><RouterLink to="/faq">Dudas de Clínica Digital</RouterLink
          ><RouterLink to="/blog">Blog</RouterLink>
        </nav>
        <nav aria-label="Información legal">
          <strong>Información</strong><RouterLink to="/legal/terminos">Términos</RouterLink
          ><RouterLink to="/legal/privacidad">Privacidad</RouterLink
          ><RouterLink to="/legal/cookies">Cookies y medición</RouterLink
          ><RouterLink to="/legal/aviso-legal">Aviso legal</RouterLink
          ><a href="mailto:info@midiginode.com">info@midiginode.com</a
          ><a
            v-if="bookingUrl"
            :href="bookingUrl"
            target="_blank"
            rel="noopener noreferrer"
            @click="trackEvent('booking_click')"
            >Concertar una reunión real ↗</a
          >
        </nav>
      </div>
      <p class="public-footer__bottom">© {{ year }} Diginode</p>
    </footer>
  </div>
</template>
<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCheckout } from '@/composables/useCheckout'
import { useServices } from '@/data/services'
import { trackEvent } from '@/lib/analytics'
const mobileOpen = ref(false),
  route = useRoute(),
  auth = useAuthStore()
const { buying, buyClinica } = useCheckout()
const { bookingUrl, load } = useServices()
function requestReview() {
  mobileOpen.value = false
  trackEvent('lead_cta_click')
}
const isClinic = computed(() => ['clinica', 'faq', 'es-para-mi'].includes(route.name))
const clientLink = computed(() =>
  !auth.isAuthenticated ? '/login' : auth.isAdmin ? '/admin' : '/portal'
)
const year = new Date().getFullYear()
watch(
  () => route.fullPath,
  () => {
    mobileOpen.value = false
  }
)
onMounted(load)
</script>
<style scoped lang="scss">
.skip-link {
  position: fixed;
  top: -100px;
  left: 10px;
  padding: 1rem;
  background: #ffb94d;
  color: #050a0f;
  z-index: 200;
  &:focus {
    top: 10px;
  }
}
.public-layout {
  padding-top: 80px;
}
.public-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: #050a0ff5;
  border-bottom: 1px solid #1b2b3d;
  backdrop-filter: blur(12px);
  &__inner {
    min-height: 80px;
    max-width: 1320px;
    margin: auto;
    padding: 12px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
  }
  nav {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }
  nav a:not(.commercial-button) {
    color: #b5c3d4;
    font-size: 0.82rem;
    white-space: nowrap;
    &:hover,
    &.router-link-exact-active {
      color: #fff;
    }
  }
  .commercial-button {
    font-size: 0.8rem;
    min-height: 44px;
    padding: 0.7rem 1rem;
  }
  &__toggle {
    display: none;
  }
}
.public-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  color: #f8fafc;
  font-size: 1.3rem;
  font-weight: 600;
  letter-spacing: -0.04em;
  img {
    width: 38px;
    height: 38px;
    object-fit: contain;
  }
}
.public-footer {
  border-top: 1px solid #1b2b3d;
  background: #080e16;
  padding: 60px 24px 20px;
  &__inner {
    max-width: 1160px;
    margin: auto;
    display: grid;
    grid-template-columns: 1.3fr 1fr 1fr;
    gap: 3rem;
  }
  p {
    color: #94a3b8;
    font-size: 0.85rem;
    margin-top: 1rem;
    line-height: 1.7;
  }
  nav {
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
    a {
      color: #a9b9cc;
      font-size: 0.85rem;
    }
    strong {
      margin-bottom: 0.5rem;
      font-size: 0.85rem;
    }
  }
  &__bottom {
    max-width: 1160px;
    margin: 3rem auto 0 !important;
    border-top: 1px solid #1b2b3d;
    padding-top: 1.5rem;
  }
}
:focus-visible {
  outline: 2px solid #ffb94d;
  outline-offset: 5px;
}
@media (max-width: 1100px) {
  .public-nav {
    &__toggle {
      display: block;
      border: 1px solid #29476a;
      color: #f8fafc;
      background: transparent;
      padding: 0.6rem 0.8rem;
      border-radius: 6px;
      font: inherit;
      cursor: pointer;
    }
    nav {
      display: none;
      position: absolute;
      top: 80px;
      left: 0;
      right: 0;
      padding: 1.5rem;
      background: #0a1018;
      border-bottom: 1px solid #29476a;
      max-height: calc(100dvh - 80px);
      overflow-y: auto;
      &.open {
        display: flex;
        flex-direction: column;
        align-items: stretch;
      }
      a {
        padding: 0.5rem;
      }
    }
  }
}
@media (max-width: 650px) {
  .public-footer__inner {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
</style>
