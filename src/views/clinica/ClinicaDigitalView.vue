<template>
  <div class="commercial-page">
  <p v-if="paymentReturn" class="clinic-payment" role="status">Has vuelto del proceso de pago. El retorno de la página no confirma el cobro. Recibirás el acceso cuando el proveedor y el webhook hayan confirmado el pago. Si necesitas ayuda, contacta con info@midiginode.com.</p>
  <div class="home">
    <!-- Ambient background -->
    <div class="home__bg" aria-hidden="true">
      <div class="home__glow home__glow--primary" />
      <div class="home__glow home__glow--accent" />
    </div>

    <div class="home__inner">
      <!-- Left: pitch -->
      <div class="home__pitch">
        <div class="home__badge">
          <Sparkles :size="14" />
          Para psicólogos, coaches y terapeutas
        </div>

        <h1 class="home__title">
          Tu clínica digital<br />
          <span class="home__title-gradient">llave en mano</span>
        </h1>

        <p class="home__subtitle">
          Página web profesional + 3 empleados IA que atienden a tus pacientes,
          gestionan tu agenda y crean tu contenido, 24/7. Tú solo pasas consulta.
        </p>

        <ul class="home__features">
          <li><MessageCircle :size="16" /> Recepcionista que responde y agenda por ti</li>
          <li><Wrench :size="16" /> Auxiliar técnico que mantiene todo funcionando</li>
          <li><PenLine :size="16" /> Creador de contenido para tus redes y blog</li>
        </ul>

        <div class="home__price">
          <span class="home__price-amount">{{ price }}€<small>/mes</small></span>
          <span class="home__price-note">Sin permanencia · Tuya al completar 12 cuotas</span>
        </div>

        <div class="home__actions">
          <button type="button" class="home__cta" :disabled="buying" @click="buyClinica">
            <ShoppingBag :size="18" />
            {{ buying ? 'Abriendo pago…' : 'Comprar Clínica Digital' }}
          </button>
          <RouterLink to="/es-para-mi" class="home__cta-secondary">
            ¿Es para mí?
          </RouterLink>
        </div>

        <p class="home__trust">
          Tu dominio y los datos de tus pacientes son tuyos desde el día 1.
        </p>
      </div>

      <!-- Right: live Nora demo -->
      <div id="demo-nora" class="home__demo">
        <LazyNora context="clinic" />
      </div>
    </div>
  </div>
  <section class="section"><span class="eyebrow">Clínica Digital</span><h2>Tu consulta, con apoyo administrativo.</h2><p class="intro">Nora atiende consultas administrativas, Alex apoya el mantenimiento y Valeria prepara contenido. El criterio clínico permanece en manos del profesional. Esta demo no utiliza datos reales de pacientes.</p><div class="commercial-actions"><RouterLink to="/es-para-mi" class="commercial-link">¿Es para mi consulta?</RouterLink><RouterLink to="/faq" class="commercial-link">Ver condiciones y preguntas frecuentes</RouterLink><RouterLink to="/login" class="commercial-link">Ya soy cliente</RouterLink></div></section>
  <section id="contacto" class="section split contact-section"><div><span class="eyebrow">Resuelve tus dudas</span><h2>Hablemos de tu consulta.</h2><p class="intro">Puedes contratar con el botón de Clínica Digital o consultarnos antes. Este formulario no inicia ningún cobro.</p></div><LeadForm service="digital_clinic" /></section>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Sparkles, ShoppingBag, MessageCircle, Wrench, PenLine } from 'lucide-vue-next'
import LazyNora from '@/components/public/LazyNora.vue'
import LeadForm from '@/components/public/LeadForm.vue'
import { useCheckout } from '@/composables/useCheckout'
import { usePlans } from '@/data/plans'
const { buying, buyClinica } = useCheckout()
const { load, flagship } = usePlans()
const price = computed(() => flagship().monthly)
const route = useRoute()
const paymentReturn = computed(() => !!route.query.compra)
onMounted(load)
</script>

<style lang="scss" scoped>
.home {
  position: relative;
  // Fill the viewport minus the fixed navbar → landing sin scroll en desktop.
  min-height: calc(100dvh - 72px);
  display: flex;
  align-items: center;
  overflow: hidden;

  &__bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  &__glow {
    position: absolute;
    border-radius: 50%;
    filter: blur(120px);
    opacity: 0.35;

    &--primary {
      width: 480px;
      height: 480px;
      background: $primary;
      top: -160px;
      left: -120px;
    }

    &--accent {
      width: 420px;
      height: 420px;
      background: $primary-dark;
      bottom: -140px;
      right: -100px;
      opacity: 0.25;
    }
  }

  &__inner {
    position: relative;
    max-width: 1280px;
    width: 100%;
    margin: 0 auto;
    padding: $space-8 $space-6;
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    align-items: center;
    gap: $space-10;

    @media (max-width: $bp-lg) {
      grid-template-columns: 1fr;
      gap: $space-8;
      padding: $space-8 $space-4 $space-12;
    }

    // Pantallas bajas (portátiles pequeños): compactar para mantener el no-scroll.
    @media (min-width: $bp-lg) and (max-height: 840px) {
      padding-top: $space-4;
      padding-bottom: $space-4;
    }
  }

  &__pitch {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: $space-5;

    @media (max-width: $bp-lg) {
      align-items: center;
      text-align: center;
    }

    @media (min-width: $bp-lg) and (max-height: 840px) {
      gap: $space-4;
    }
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    gap: $space-2;
    padding: $space-1 $space-3;
    border: 1px solid $border-hover;
    border-radius: $radius-full;
    background: $primary-subtle;
    color: $primary-light;
    font-size: $text-xs;
    font-weight: $fw-semibold;
    letter-spacing: 0.02em;
  }

  &__title {
    font-family: $font-display;
    font-size: clamp(2.2rem, 4.5vw, 3.4rem);
    font-weight: $fw-bold;
    color: $text;
    line-height: 1.08;
    letter-spacing: -0.02em;
  }

  &__title-gradient {
    background: linear-gradient(135deg, $primary-light 0%, $primary 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  &__subtitle {
    color: $text-muted;
    font-size: $text-lg;
    line-height: 1.6;
    max-width: 520px;
  }

  &__features {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: $space-2;
    padding: 0;
    margin: 0;

    li {
      display: flex;
      align-items: center;
      gap: $space-3;
      color: $text;
      font-size: $text-sm;

      svg { color: $primary-light; flex-shrink: 0; }
    }

    @media (max-width: $bp-lg) {
      align-items: flex-start;
    }
  }

  &__price {
    display: flex;
    align-items: baseline;
    gap: $space-4;
    flex-wrap: wrap;

    @media (max-width: $bp-lg) {
      justify-content: center;
    }
  }

  &__price-amount {
    font-family: $font-display;
    font-size: $text-4xl;
    font-weight: $fw-bold;
    color: $text;

    small {
      font-size: $text-lg;
      font-weight: $fw-medium;
      color: $text-muted;
    }
  }

  &__price-note {
    font-size: $text-sm;
    color: $text-muted;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: $space-4;
    flex-wrap: wrap;

    @media (max-width: $bp-lg) {
      justify-content: center;
    }
  }

  &__cta {
    display: inline-flex;
    align-items: center;
    gap: $space-2;
    height: 52px;
    padding: 0 $space-6;
    background: linear-gradient(135deg, $primary 0%, $primary-dark 100%);
    color: $text-inverse;
    font-family: inherit;
    font-size: $text-base;
    font-weight: $fw-semibold;
    border: 0;
    border-radius: $radius;
    cursor: pointer;
    transition: $transition;
    box-shadow: 0 4px 20px rgba($primary, 0.3);

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba($primary, 0.4);
    }

    &:disabled {
      opacity: 0.6;
      cursor: wait;
    }
  }

  &__cta-secondary {
    display: inline-flex;
    align-items: center;
    height: 52px;
    padding: 0 $space-5;
    border: 1px solid $border;
    border-radius: $radius;
    color: $text-muted;
    font-size: $text-base;
    font-weight: $fw-medium;
    text-decoration: none;
    transition: $transition-fast;

    &:hover {
      border-color: $primary;
      color: $primary-light;
      background: $primary-subtle;
    }
  }

  &__trust {
    font-size: $text-xs;
    color: $text-subtle;
  }

  &__demo {
    display: flex;
    justify-content: center;
  }
}
.clinic-payment { max-width: 1160px; margin: 1.5rem auto; padding: 1.5rem; border: 1px solid #ffb94d; border-radius: 10px; line-height: 1.7; }
#demo-nora { scroll-margin-top: 100px; }
</style>
