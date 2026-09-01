<template>
  <div class="taller">
    <!-- Ambient background -->
    <div class="taller__bg" aria-hidden="true">
      <div class="taller__glow taller__glow--primary" />
      <div class="taller__glow taller__glow--accent" />
    </div>

    <div class="taller__inner">
      <!-- Marca, sin navegación: esta página tiene un solo objetivo -->
      <header class="taller__brand">
        <img src="/logo.png" alt="DigiNode" class="taller__brand-img" />
        <span class="taller__brand-text">DIGI<span>NODE</span></span>
      </header>

      <!-- ── Hero ───────────────────────────────────────────────────── -->
      <section class="hero">
        <h1 class="hero__claim">{{ t.tagline }}</h1>
        <p class="hero__title">{{ t.name }}</p>
        <p class="hero__kicker">Taller online en directo · Plazas muy limitadas</p>
        <p class="hero__audience">{{ t.audience }}</p>
      </section>

      <!-- ── Beneficios ─────────────────────────────────────────────── -->
      <section class="benefits">
        <article v-for="(b, i) in t.benefits" :key="b.title" class="benefit">
          <div class="benefit__icon">
            <component :is="benefitIcon(i)" :size="22" />
          </div>
          <div class="benefit__body">
            <h2 class="benefit__title">{{ b.title }}</h2>
            <p class="benefit__text">{{ b.text }}</p>
          </div>
        </article>
      </section>

      <!-- ── Datos + CTA ────────────────────────────────────────────── -->
      <section id="reservar" class="details">
        <dl class="details__grid">
          <div class="details__row">
            <dt>Fecha</dt>
            <dd>{{ dateLabel }}</dd>
          </div>
          <div class="details__row">
            <dt>Lugar</dt>
            <dd>Online ({{ t.platform }})</dd>
          </div>
          <div class="details__row">
            <dt>Inversión</dt>
            <dd class="details__price">
              <span :class="{ 'details__free': esGratis }">{{ priceLabel }}</span>
              <button
                type="button"
                class="details__ia-badge"
                aria-describedby="nota-ia"
                title="Las herramientas de IA se contratan aparte, con tu propia cuenta"
                @click="destacarNota"
              >
                {{ esGratis ? 'salvo 25 € de herramientas' : '+25 € para IA' }}
                <Info :size="13" />
              </button>
            </dd>
          </div>
          <div class="details__row">
            <dt>Capacidad</dt>
            <dd>{{ capacityLabel }}</dd>
          </div>
        </dl>

        <div class="details__cta">
          <p v-if="isSoldOut" class="details__soldout">
            <Ban :size="16" />
            Plazas agotadas por ahora. Escríbeme y te aviso de la siguiente convocatoria.
          </p>
          <p v-else-if="seatsLeft !== null && seatsLeft <= 5" class="details__scarcity">
            <Flame :size="16" />
            {{ seatsLeft === 1 ? 'Queda 1 plaza' : `Quedan ${seatsLeft} plazas` }}
          </p>

          <button
            type="button"
            class="details__button"
            :disabled="(buying && !esGratis) || isSoldOut || loading"
            @click="reservar"
          >
            <Ticket :size="18" />
            {{ ctaLabel }}
          </button>

          <p
            id="nota-ia"
            class="details__note"
            :class="{ 'details__note--destacada': notaDestacada }"
          >
            <Info :size="14" />
            {{ t.tools_cost_note }}
          </p>
        </div>
      </section>

      <!-- ── Qué obtendrás ──────────────────────────────────────────── -->
      <section v-if="t.includes?.length" class="block">
        <h2 class="block__title">Qué obtendrás</h2>
        <ul class="block__list">
          <li v-for="item in t.includes" :key="item">
            <Check :size="16" />
            <span>{{ item }}</span>
          </li>
        </ul>
      </section>

      <!-- ── Prueba en vivo ─────────────────────────────────────────── -->
      <section class="block">
        <h2 class="block__title">Pruébalo tú mismo</h2>
        <p class="nora-intro">
          Esto no es un vídeo: es Nora, una recepcionista con IA atendiendo de verdad.
          Escríbele lo que le preguntaría un paciente tuyo y mira cómo responde.
        </p>
        <div class="nora-wrap">
          <NoraDemo />
        </div>
      </section>

      <!-- ── Requisitos ─────────────────────────────────────────────── -->
      <section v-if="t.requirements?.length" class="block">
        <h2 class="block__title">Qué necesitas para aprovecharlo</h2>
        <ul class="block__list block__list--muted">
          <li v-for="item in t.requirements" :key="item">
            <ChevronRight :size="16" />
            <span>{{ item }}</span>
          </li>
        </ul>
      </section>

      <!-- ── FAQ ────────────────────────────────────────────────────── -->
      <section v-if="t.faq?.length" class="block">
        <h2 class="block__title">Preguntas frecuentes</h2>
        <div class="faq">
          <details v-for="item in t.faq" :key="item.q" class="faq__item">
            <summary class="faq__q">{{ item.q }}</summary>
            <p class="faq__a">{{ item.a }}</p>
          </details>
        </div>
      </section>

      <!-- ── Cierre ─────────────────────────────────────────────────── -->
      <section v-if="!isSoldOut" class="closing">
        <button
          type="button"
          class="details__button"
          :disabled="(buying && !esGratis) || loading"
          @click="reservar"
        >
          <Ticket :size="18" />
          {{ ctaLabel }}
        </button>
        <p class="closing__reassurance">
          {{ esGratis
            ? 'Sin pagos ni tarjeta. Al reservar recibes por correo el acceso a tu panel con todos los detalles.'
            : 'Pago seguro con Stripe. Al confirmar recibirás tu acceso al panel por correo.' }}
        </p>
      </section>

      <InscripcionForm v-model="formAbierto" :slug="SLUG" @inscrito="load" />

      <footer class="taller__footer">
        <span>© {{ year }} DigiNode</span>
        <nav class="taller__footer-links">
          <RouterLink to="/legal/terminos">Términos</RouterLink>
          <RouterLink to="/legal/privacidad">Privacidad</RouterLink>
          <RouterLink to="/legal/cookies">Cookies</RouterLink>
          <RouterLink to="/legal/aviso-legal">Aviso legal</RouterLink>
        </nav>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import {
  Ticket, Check, ChevronRight, Info, Flame, Ban,
  Clock, Rocket, Users,
} from 'lucide-vue-next'
import NoraDemo from '@/components/ui/NoraDemo.vue'
import InscripcionForm from '@/views/formacion/InscripcionForm.vue'
import { useTraining } from '@/data/trainings'
import { useCheckout } from '@/composables/useCheckout'
import { useSeo } from '@/composables/useSeo'

const SLUG = 'ia-para-terapeutas'

const { training: t, loading, load } = useTraining(SLUG)
const { buying, buyTraining } = useCheckout()

useSeo({
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'IA para Terapeutas — Taller online',
    description:
      'Taller online en directo para psicólogos, coaches y terapeutas: automatiza tu gestión y tu marketing con empleados IA.',
    startDate: '2026-10-03',
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'VirtualLocation',
      url: 'https://midiginode.com/formacion/ia-para-terapeutas',
    },
    organizer: { '@type': 'Organization', name: 'DigiNode', url: 'https://midiginode.com' },
    offers: {
      '@type': 'Offer',
      price: '100',
      priceCurrency: 'EUR',
      url: 'https://midiginode.com/formacion/ia-para-terapeutas',
      availability: 'https://schema.org/InStock',
    },
  },
})

onMounted(load)

const year = new Date().getFullYear()

const seatsLeft = computed(() => t.value.seats_left ?? null)

// Agotado tanto por aforo como por cierre manual de inscripciones.
const isSoldOut = computed(() => t.value.sold_out === true || t.value.status === 'closed')

const dateLabel = computed(() => {
  if (!t.value.date) return 'Fecha por confirmar'
  const formatted = new Date(`${t.value.date}T00:00:00`).toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long',
  })
  const parts = [formatted.charAt(0).toUpperCase() + formatted.slice(1)]
  if (t.value.time) parts.push(`· ${t.value.time}h`)
  if (t.value.duration) parts.push(`· ${t.value.duration}`)
  return parts.join(' ')
})

// Precio 0 en el catálogo = inscripción por formulario, sin pasar por pago.
const esGratis = computed(() => Number(t.value.price) === 0)

const priceLabel = computed(() => {
  if (esGratis.value) return 'Gratis'
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: t.value.currency ?? 'EUR',
    minimumFractionDigits: 0,
  }).format(t.value.price)
})

const capacityLabel = computed(() => {
  if (isSoldOut.value) return 'Plazas agotadas'
  // seats_left es null cuando la API no respondió: no prometemos un número sin verificarlo.
  if (seatsLeft.value === null) return `Sólo ${t.value.capacity} plazas`
  return `${seatsLeft.value} de ${t.value.capacity} plazas disponibles`
})

const formAbierto = ref(false)

const ctaLabel = computed(() => {
  if (isSoldOut.value) return 'Plazas agotadas'
  if (esGratis.value)  return 'Reservar mi plaza gratis'
  if (buying.value)    return 'Abriendo pago…'
  return 'Reservar mi plaza'
})

function benefitIcon(i) {
  return [Clock, Rocket, Users][i] ?? Check
}

// El importe grande dice 100€; el badge lleva la vista a la letra pequeña para
// que nadie llegue al taller sin saber que las herramientas van aparte.
const notaDestacada = ref(false)
let notaTimer = null

function destacarNota() {
  notaDestacada.value = true
  clearTimeout(notaTimer)
  notaTimer = setTimeout(() => { notaDestacada.value = false }, 2200)
}

function reservar() {
  // Gratuito: formulario. Con precio: checkout de Stripe, que sigue intacto
  // por si una convocatoria futura vuelve a cobrarse.
  if (esGratis.value) {
    formAbierto.value = true
    return
  }
  buyTraining(SLUG)
}
</script>

<style lang="scss" scoped>
.taller {
  position: relative;
  min-height: 100dvh;
  background: $bg;
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

    &--primary {
      width: 520px;
      height: 520px;
      background: $primary;
      opacity: 0.28;
      top: -180px;
      left: -140px;
    }

    &--accent {
      width: 460px;
      height: 460px;
      background: $accent;
      opacity: 0.18;
      bottom: -160px;
      right: -120px;
    }
  }

  &__inner {
    position: relative;
    max-width: 820px;
    margin: 0 auto;
    padding: $space-8 $space-6 $space-16;
    display: flex;
    flex-direction: column;
    gap: $space-12;

    @media (max-width: $bp-md) {
      padding: $space-6 $space-4 $space-12;
      gap: $space-10;
    }
  }

  &__brand {
    display: flex;
    align-items: center;
    gap: $space-3;
  }

  &__brand-img {
    height: 36px;
    width: auto;
  }

  &__brand-text {
    font-family: $font-display;
    font-size: $text-xl;
    font-weight: $fw-bold;
    letter-spacing: 0.04em;
    color: $text;

    span { color: $accent; }
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $space-4;
    padding-top: $space-8;
    border-top: 1px solid $border;
    font-size: $text-xs;
    color: $text-subtle;
    flex-wrap: wrap;
  }

  &__footer-links {
    display: flex;
    gap: $space-4;

    a {
      color: $text-subtle;
      text-decoration: none;
      transition: $transition-fast;

      &:hover { color: $primary-light; }
    }
  }
}

// ── Hero ────────────────────────────────────────────────────────────────────
.hero {
  display: flex;
  flex-direction: column;
  gap: $space-3;

  &__claim {
    font-family: $font-display;
    font-size: clamp(1.9rem, 5vw, 2.9rem);
    font-weight: $fw-bold;
    line-height: 1.1;
    letter-spacing: -0.02em;
    color: $text;
    text-transform: uppercase;
  }

  &__title {
    font-family: $font-display;
    font-size: clamp(2.2rem, 6vw, 3.4rem);
    font-weight: $fw-black;
    line-height: 1;
    letter-spacing: -0.02em;
    text-transform: uppercase;
    background: linear-gradient(135deg, $accent-light 0%, $accent-dark 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  &__kicker {
    font-size: $text-base;
    color: $text-muted;
  }

  &__audience {
    display: inline-flex;
    align-self: flex-start;
    padding: $space-2 $space-4;
    margin-top: $space-2;
    border: 1px solid $border-hover;
    border-radius: $radius-full;
    background: $primary-subtle;
    color: $primary-light;
    font-size: $text-sm;
    font-weight: $fw-semibold;
  }
}

// ── Beneficios ──────────────────────────────────────────────────────────────
.benefits {
  display: flex;
  flex-direction: column;
  gap: $space-5;
}

.benefit {
  display: flex;
  align-items: flex-start;
  gap: $space-4;

  &__icon {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    border-radius: $radius;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $accent-subtle;
    border: 1px solid rgba(245, 166, 35, 0.3);
    color: $accent;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: $space-1;
  }

  &__title {
    font-size: $text-lg;
    font-weight: $fw-bold;
    color: $text;
    line-height: 1.3;
  }

  &__text {
    font-size: $text-sm;
    color: $text-muted;
    line-height: 1.6;
  }
}

// ── Datos + CTA ─────────────────────────────────────────────────────────────
.details {
  border: 1px solid rgba(245, 166, 35, 0.35);
  border-radius: $radius-lg;
  background: rgba(245, 166, 35, 0.04);
  padding: $space-6;
  display: flex;
  flex-direction: column;
  gap: $space-6;

  @media (max-width: $bp-md) {
    padding: $space-5 $space-4;
  }

  &__grid {
    display: flex;
    flex-direction: column;
    gap: $space-3;
    margin: 0;
  }

  &__row {
    display: flex;
    align-items: baseline;
    gap: $space-3;
    flex-wrap: wrap;

    dt {
      min-width: 110px;
      font-size: $text-sm;
      font-weight: $fw-bold;
      color: $accent;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    dd {
      margin: 0;
      font-size: $text-base;
      color: $text;
    }
  }

  &__cta {
    display: flex;
    flex-direction: column;
    gap: $space-3;
    align-items: flex-start;
  }

  &__scarcity,
  &__soldout {
    display: inline-flex;
    align-items: center;
    gap: $space-2;
    font-size: $text-sm;
    font-weight: $fw-semibold;
  }

  &__scarcity { color: $accent-light; }
  &__soldout  { color: $text-muted; }

  &__button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: $space-2;
    width: 100%;
    max-width: 380px;
    height: 56px;
    padding: 0 $space-6;
    background: linear-gradient(135deg, $primary 0%, $primary-dark 100%);
    color: $text;
    font-family: inherit;
    font-size: $text-lg;
    font-weight: $fw-bold;
    border: 0;
    border-radius: $radius;
    cursor: pointer;
    transition: $transition;
    box-shadow: 0 4px 24px rgba(30, 144, 255, 0.35);

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 34px rgba(30, 144, 255, 0.45);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      box-shadow: none;
      transform: none;
    }
  }

  &__price {
    display: inline-flex;
    align-items: center;
    gap: $space-3;
    flex-wrap: wrap;
  }

  &__free {
    color: $success;
    font-weight: $fw-bold;
  }

  &__ia-badge {
    display: inline-flex;
    align-items: center;
    gap: $space-1;
    padding: 2px $space-2;
    background: $accent-subtle;
    border: 1px solid rgba(245, 166, 35, 0.35);
    border-radius: $radius-full;
    font-family: inherit;
    font-size: $text-xs;
    font-weight: $fw-semibold;
    color: $accent-light;
    cursor: pointer;
    transition: $transition-fast;

    &:hover { background: rgba(245, 166, 35, 0.16); }
  }

  &__note {
    display: flex;
    align-items: flex-start;
    gap: $space-2;
    padding: $space-2;
    margin: -$space-2;
    border-radius: $radius-sm;
    font-size: $text-xs;
    color: $text-muted;
    line-height: 1.6;
    transition: background 0.25s ease, color 0.25s ease;

    svg { flex-shrink: 0; margin-top: 2px; }

    &--destacada {
      background: rgba(245, 166, 35, 0.14);
      color: $text;
    }
  }
}

// ── Prueba en vivo de Nora ──────────────────────────────────────────────────
.nora-intro {
  font-size: $text-sm;
  color: $text-muted;
  line-height: 1.6;
  margin-top: -$space-2;
}

.nora-wrap {
  display: flex;
  justify-content: center;
}

// ── Bloques de contenido ────────────────────────────────────────────────────
.block {
  display: flex;
  flex-direction: column;
  gap: $space-4;

  &__title {
    font-family: $font-display;
    font-size: $text-2xl;
    font-weight: $fw-bold;
    color: $text;
  }

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: $space-3;

    li {
      display: flex;
      align-items: flex-start;
      gap: $space-3;
      font-size: $text-sm;
      line-height: 1.6;
      color: $text;

      svg { flex-shrink: 0; margin-top: 3px; color: $primary-light; }
    }

    &--muted li {
      color: $text-muted;

      svg { color: $text-subtle; }
    }
  }
}

// ── FAQ ─────────────────────────────────────────────────────────────────────
.faq {
  display: flex;
  flex-direction: column;
  gap: $space-2;

  &__item {
    border: 1px solid $border;
    border-radius: $radius;
    background: $bg-card;
    padding: $space-4;
    transition: $transition-fast;

    &[open] { border-color: $border-hover; }
  }

  &__q {
    cursor: pointer;
    font-size: $text-sm;
    font-weight: $fw-semibold;
    color: $text;
    list-style: none;

    &::-webkit-details-marker { display: none; }

    &::before {
      content: '+';
      display: inline-block;
      width: 18px;
      color: $accent;
      font-weight: $fw-bold;
    }
  }

  &__item[open] &__q::before { content: '−'; }

  &__a {
    margin-top: $space-3;
    padding-left: 18px;
    font-size: $text-sm;
    color: $text-muted;
    line-height: 1.6;
  }
}

// ── Cierre ──────────────────────────────────────────────────────────────────
.closing {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-3;
  text-align: center;

  &__reassurance {
    font-size: $text-xs;
    color: $text-subtle;
  }
}
</style>
