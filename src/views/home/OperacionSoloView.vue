<template>
  <div class="despacho">

    <!-- ── SUCCESS STATE (post-Stripe redirect) ──── -->
    <div v-if="showSuccess" class="success">
      <div class="success__box">
        <div class="success__glow" aria-hidden="true" />
        <CheckCircle :size="52" class="success__icon" />
        <h1 class="success__title">¡Ya eres parte de Diginode!</h1>
        <p class="success__sub">
          Ahora agenda tu sesión de onboarding. En <strong>7 días</strong>
          recibes tu web y tus empleados listos para trabajar.
        </p>
        <a :href="calLink" target="_blank" rel="noopener noreferrer" class="btn-primary btn-primary--lg">
          <CalendarCheck :size="18" />
          Agendar onboarding
        </a>
        <div class="success__steps">
          <div class="success__step">
            <span class="success__step-num">1</span>
            <div><strong>Onboarding (1 h)</strong><p>Definimos tu web, tu tono y tus dos empleados</p></div>
          </div>
          <div class="success__step">
            <span class="success__step-num">2</span>
            <div><strong>7 días de configuración</strong><p>Montamos, conectamos y probamos todo</p></div>
          </div>
          <div class="success__step">
            <span class="success__step-num">3</span>
            <div><strong>Tu negocio operativo</strong><p>Tu web y tu equipo entran en acción</p></div>
          </div>
        </div>
        <p class="success__note">Recibirás un email de confirmación con los detalles.</p>
      </div>
    </div>

    <template v-else>

    <!-- ── HERO ──────────────────────────────────── -->
    <section class="hero">
      <div class="container">
        <div class="hero__badge">
          <Sparkles :size="13" />
          Para solopreneurs y autónomos · Llave en mano
        </div>

        <h1 class="hero__title">Tu negocio,<br><em>operativo sin ti.</em></h1>

        <p class="hero__sub">
          Web profesional + panel de gestión + 2 empleados IA.<br>
          Todo configurado en 7 días. Tú solo haces el trabajo que solo tú puedes hacer.
        </p>

        <div class="hero__saving">
          <TrendingDown :size="14" />
          Ahorras <strong>+1.100€</strong> vs. montarlo todo por separado
        </div>

        <div class="hero__actions">
          <button class="btn-primary btn-primary--lg" :disabled="loading" @click="goToCheckout">
            <AppSpinner v-if="loading" :size="17" />
            <CreditCard v-else :size="17" />
            {{ loading ? 'Redirigiendo...' : 'Contratar — 300€/mes' }}
          </button>
          <a :href="calLink" target="_blank" rel="noopener noreferrer" class="btn-demo">
            Ver una demo gratuita →
          </a>
        </div>

        <p class="hero__fine">
          6 meses al precio promo · Luego 200€/mes · Sin permanencia · Pago seguro con Stripe
        </p>
      </div>
    </section>

    <!-- ── QUÉ INCLUYE ────────────────────────────── -->
    <section class="includes">
      <div class="container">
        <h2 class="section-title">Todo lo que necesitas para dejar de hacerlo tú.</h2>

        <div class="includes__grid">
          <div v-for="item in includes" :key="item.id" class="includes__card">
            <div class="includes__icon" :style="{ color: item.color }">
              <component :is="item.icon" :size="34" />
            </div>
            <h3 class="includes__name">{{ item.title }}</h3>
            <p class="includes__desc">{{ item.desc }}</p>
            <ul class="includes__list">
              <li v-for="f in item.features" :key="f">
                <CheckCircle :size="12" />
                {{ f }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- ── EMPLEADOS ──────────────────────────────── -->
    <section class="employees">
      <div class="container">
        <h2 class="section-title">Tu equipo de 2 empleados IA</h2>
        <p class="section-sub">
          Alex siempre viene contigo. En el onboarding decides quién es tu segundo empleado.
        </p>

        <!-- Alex: siempre incluido -->
        <div class="employees__featured">
          <div class="employees__featured-badge">
            <CheckCircle :size="12" />
            Siempre incluido
          </div>
          <div class="employees__avatar employees__avatar--lg" :style="{ background: 'rgba(143, 179, 255, 0.16)', color: '#8fb3ff' }">
            <Briefcase :size="22" />
          </div>
          <div class="employees__info">
            <strong>Alex — Asistente ejecutivo</strong>
            <span>Tu cabeza ya no es tu único sistema operativo: prioridades, documentos y recordatorios listos cada día.</span>
          </div>
        </div>

        <!-- Elige 1 más -->
        <p class="employees__label">
          <span>+ Elige 1 más en el onboarding:</span>
        </p>

        <div class="employees__grid">
          <div v-for="emp in optionalEmployees" :key="emp.id" class="employees__card">
            <div class="employees__avatar" :style="{ background: emp.color + '20', color: emp.color }">
              <component :is="emp.icon" :size="18" />
            </div>
            <div class="employees__info">
              <strong>{{ emp.name }}</strong>
              <span>{{ emp.role }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── CÓMO FUNCIONA ──────────────────────────── -->
    <section class="how">
      <div class="container">
        <h2 class="section-title">De hoy a operativo en 7 días</h2>

        <div class="how__steps">
          <div v-for="(step, i) in steps" :key="i" class="how__step">
            <div class="how__num">{{ i + 1 }}</div>
            <div class="how__body">
              <h3>{{ step.title }}</h3>
              <p>{{ step.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── FAQ ──────────────────────────────────────── -->
    <section class="faq">
      <div class="container">
        <h2 class="section-title">Preguntas frecuentes</h2>

        <div class="faq__list">
          <div
            v-for="(item, i) in faqs"
            :key="i"
            class="faq__item"
            :class="{ 'faq__item--open': openFaq === i }"
            @click="openFaq = openFaq === i ? null : i"
          >
            <div class="faq__question">
              <span>{{ item.q }}</span>
              <ChevronDown :size="18" class="faq__chevron" :class="{ 'faq__chevron--open': openFaq === i }" />
            </div>
            <Transition name="accordion">
              <div v-if="openFaq === i" class="faq__answer">
                <p>{{ item.a }}</p>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </section>

    <!-- ── PRECIO ─────────────────────────────────── -->
    <section class="price" id="precio">
      <div class="container">
        <div class="price__card">

          <div class="price__info">
            <span class="price__tag">Operación Solo</span>
            <div class="price__amount">
              <span class="price__num">300€</span>
              <span class="price__period">/mes · 6 meses</span>
            </div>
            <p class="price__after">Luego 200€/mes sin permanencia</p>
            <div class="price__saving">
              <TrendingDown :size="13" />
              Ahorras +1.100€ vs. montarlo por separado
            </div>

            <ul class="price__features">
              <li v-for="f in priceFeatures" :key="f">
                <CheckCircle :size="14" />
                {{ f }}
              </li>
            </ul>
          </div>

          <div class="price__actions">
            <button
              class="btn-primary btn-primary--lg btn-primary--full"
              :disabled="loading"
              @click="goToCheckout"
            >
              <AppSpinner v-if="loading" :size="17" />
              <CreditCard v-else :size="17" />
              {{ loading ? 'Redirigiendo...' : 'Contratar ahora' }}
            </button>
            <a
              :href="calLink"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-demo btn-demo--full"
            >
              Prefiero ver una demo primero →
            </a>
            <p class="price__secure">
              <Lock :size="12" />
              Stripe gestiona el pago. Cancela tras el 6.º mes sin coste.
            </p>
          </div>

        </div>
      </div>
    </section>

    </template><!-- end v-else -->

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  Globe, LayoutDashboard, BotMessageSquare,
  MessageSquare, Briefcase, BarChart2, Share2,
  CheckCircle, CalendarCheck, CreditCard, Lock, Sparkles, TrendingDown, ChevronDown,
} from 'lucide-vue-next'
import AppSpinner from '@/components/ui/AppSpinner.vue'

// ── Route / success state ─────────────────────────
const route  = useRoute()
const openFaq = ref(null)
const showSuccess = computed(() => route.query.success === 'true')

// ── Env ──────────────────────────────────────────
const calLink = import.meta.env.VITE_CAL_BOOKING_LINK
const API     = import.meta.env.VITE_API_URL

// ── Checkout ─────────────────────────────────────
const loading = ref(false)

const goToCheckout = async () => {
  loading.value = true
  try {
    const res = await fetch(`${API}/despacho/checkout`, { method: 'POST' })
    const data = await res.json()
    if (!data.success || !data.url) throw new Error(data.message ?? 'Error al iniciar el pago')
    window.location.href = data.url
  } catch (err) {
    console.error('[checkout]', err)
    loading.value = false
  }
}

// ── Data ─────────────────────────────────────────
const includes = [
  {
    id: 'web',
    icon: Globe,
    color: '#8fb3ff',
    title: 'Web profesional',
    desc: 'Diseñada para tu negocio. Transmite autoridad, posiciona en Google y convierte visitas en clientes.',
    features: ['Diseño a medida', 'SEO local', 'Formulario de contacto', 'Blog incluido'],
  },
  {
    id: 'dashboard',
    icon: LayoutDashboard,
    color: '#9cffcb',
    title: 'Panel de gestión',
    desc: 'Área privada dentro de tu web. Tus clientes acceden a su información y tú controlas todo desde un sitio.',
    features: ['Acceso por cliente', 'Documentos y entregables', 'Comunicación directa', 'Desde cualquier dispositivo'],
  },
  {
    id: 'employees',
    icon: BotMessageSquare,
    color: '#ffd38a',
    title: '2 empleados IA',
    desc: 'Trabajan mientras tú facturas. Organizan tu día, contestan mensajes y mantienen el negocio en marcha.',
    features: ['Activos 24/7', 'WhatsApp y Telegram', 'Configurados con tu tono', 'Soporte continuo'],
  },
]

// Alex (id interno 'sofia') siempre incluido; el cliente elige 1 de los otros 3 en el onboarding
const optionalEmployees = [
  { id: 'luna',    name: 'Nora',    role: 'Recepcionista',   icon: MessageSquare, color: '#9cffcb' },
  { id: 'valeria', name: 'Valeria', role: 'Content creator', icon: Share2,        color: '#ffd38a' },
  { id: 'marcos',  name: 'Marcos',  role: 'Analista de negocio', icon: BarChart2, color: '#d7b7ff' },
]

const steps = [
  {
    title: 'Contratas online',
    desc: 'Pago seguro por Stripe. En 5 minutos tienes tu plaza reservada.',
  },
  {
    title: 'Sesión de onboarding',
    desc: 'Una hora contigo. Defines tu web, eliges tu segundo empleado y diseñamos cómo hablan con tus clientes.',
  },
  {
    title: 'Tu negocio operativo',
    desc: 'En 7 días, web activa y equipo funcionando. Tú vuelves a hacer solo lo importante.',
  },
]

const priceFeatures = [
  'Web profesional personalizada',
  'Panel privado para tus clientes',
  'Alex + 1 empleado IA activos 24/7',
  'Onboarding y configuración completa',
  'Soporte técnico continuo',
  'Actualizaciones incluidas',
]

const faqs = [
  {
    q: '¿Por qué Alex siempre está incluido?',
    a: 'Alex es el Asistente Ejecutivo: organiza tu día, prepara documentos, gestiona seguimientos y atiende mensajes en WhatsApp o Telegram. Es la pieza que cualquier solopreneur necesita el día 1 — el resto del equipo se monta a su alrededor según tu segundo dolor más grande.',
  },
  {
    q: '¿Cuándo elijo mi segundo empleado?',
    a: 'Durante la sesión de onboarding. Te presentamos a Nora, Valeria y Marcos, vemos qué es lo que más te ahoga ahora mismo y decidimos juntos. Puedes cambiar de opinión hasta que empiece la configuración.',
  },
  {
    q: '¿Puedo cambiar de segundo empleado más adelante?',
    a: 'Sí. Pasado el periodo inicial de 6 meses puedes solicitar un cambio de empleado. Se aplica una pequeña tarifa de reconfiguración según la complejidad del nuevo empleado.',
  },
  {
    q: '¿Hay coste de setup o entrada?',
    a: 'No. Operación Solo no tiene coste de setup separado. Los 300€/mes del primer período cubren también toda la configuración, el onboarding y la puesta en marcha.',
  },
  {
    q: '¿Qué pasa cuando terminan los 6 meses?',
    a: 'La suscripción pasa a 200€/mes sin permanencia. Puedes cancelar cuando quieras con un mes de antelación. No hay penalización ni cláusulas de permanencia adicionales.',
  },
  {
    q: '¿Puedo ampliar a más empleados después?',
    a: 'Sí. Puedes incorporar a Valeria o Marcos a través de la Bolsa de Empleo (150€/mes cada uno) o pasar directamente al Equipo Solopreneur completo con los 4 empleados.',
  },
  {
    q: '¿Necesito conocimientos técnicos?',
    a: 'Ninguno. Nosotros nos encargamos de todo: web, conexiones, entrenamiento y mantenimiento. Tú solo participas en la sesión de onboarding de una hora para darnos el contexto de tu negocio.',
  },
]
</script>

<style lang="scss" scoped>
// ── Shared ───────────────────────────────────────
.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 $space-6;
}

.section-title {
  font-size: $text-3xl;
  font-weight: $fw-bold;
  color: $text;
  text-align: center;
  margin-bottom: $space-4;
  letter-spacing: -0.02em;
}

.section-sub {
  text-align: center;
  color: $text-muted;
  font-size: $text-base;
  margin-bottom: $space-10;
  max-width: 520px;
  margin-left: auto;
  margin-right: auto;
}

// ── Buttons ──────────────────────────────────────
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: $space-2;
  height: 44px;
  padding: 0 $space-6;
  background: $primary;
  color: $text-inverse;
  font-size: $text-sm;
  font-weight: $fw-semibold;
  border-radius: $radius;
  text-decoration: none;
  transition: $transition;
  box-shadow: 0 0 20px $primary-glow;

  &:hover {
    background: $primary-dark;
    transform: translateY(-1px);
    color: $text-inverse;
  }

  &--lg { height: 52px; padding: 0 $space-8; font-size: $text-base; }
  &--full { width: 100%; justify-content: center; }
}

.btn-demo {
  display: inline-flex;
  align-items: center;
  height: 44px;
  padding: 0 $space-4;
  font-size: $text-sm;
  font-weight: $fw-medium;
  color: $text-muted;
  text-decoration: none;
  border-radius: $radius;
  transition: $transition-fast;

  &:hover { color: $text; }

  &--solo {
    height: 52px;
    padding: 0 $space-8;
    font-size: $text-base;
    background: $bg-surface;
    border: 1px solid $border;

    &:hover { border-color: $border-hover; color: $text; }
  }

  &--full { width: 100%; justify-content: center; }
}

// ── Hero ─────────────────────────────────────────
.hero {
  padding: $space-16 $space-6 $space-16;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 70% 50% at 50% 0%, rgba(156, 255, 203,0.08) 0%, transparent 70%);
    pointer-events: none;
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    gap: $space-2;
    padding: $space-1 $space-3;
    background: rgba(156, 255, 203,0.1);
    border: 1px solid rgba(156, 255, 203,0.25);
    border-radius: $radius-full;
    font-size: $text-xs;
    font-weight: $fw-medium;
    color: $accent;
    letter-spacing: 0.03em;
    margin-bottom: $space-6;
  }

  &__title {
    font-size: clamp(2.4rem, 5vw, 3.8rem);
    font-weight: $fw-bold;
    color: $text;
    line-height: 1.1;
    letter-spacing: -0.03em;
    margin-bottom: $space-5;

    em {
      font-style: normal;
      background: linear-gradient(135deg, $primary, $accent-blue);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  &__sub {
    font-size: $text-lg;
    color: $text-muted;
    line-height: 1.6;
    max-width: 540px;
    margin: 0 auto $space-8;
  }

  &__actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $space-4;
    flex-wrap: wrap;
    margin-bottom: $space-5;
  }

  &__saving {
    display: inline-flex;
    align-items: center;
    gap: $space-2;
    padding: $space-2 $space-4;
    background: rgba(156, 255, 203,0.08);
    border: 1px solid rgba(156, 255, 203,0.25);
    border-radius: $radius-full;
    font-size: $text-sm;
    color: $accent;

    strong { font-weight: $fw-bold; }
    svg { flex-shrink: 0; }
  }

  &__fine {
    font-size: $text-xs;
    color: $text-subtle;
    letter-spacing: 0.02em;
  }
}

// ── Includes ─────────────────────────────────────
.includes {
  padding: $space-16 $space-6;

  .section-title { margin-bottom: $space-12; }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: $space-6;
  }

  &__card {
    background: $bg-card;
    border: 1px solid $border;
    border-radius: $radius-lg;
    padding: $space-8;
    transition: $transition-fast;

    &:hover { border-color: $border-hover; }
  }

  &__icon {
    margin-bottom: $space-4;
  }

  &__name {
    font-size: $text-xl;
    font-weight: $fw-semibold;
    color: $text;
    margin-bottom: $space-2;
  }

  &__desc {
    font-size: $text-sm;
    color: $text-muted;
    line-height: 1.6;
    margin-bottom: $space-5;
  }

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: $space-2;

    li {
      display: flex;
      align-items: center;
      gap: $space-2;
      font-size: $text-sm;
      color: $text-muted;

      svg { color: $accent; flex-shrink: 0; }
    }
  }
}

// ── Employees ────────────────────────────────────
.employees {
  padding: $space-16 $space-6;
  background: $bg-surface;

  .section-title { margin-bottom: $space-3; }

  &__featured {
    display: flex;
    align-items: center;
    gap: $space-4;
    padding: $space-5 $space-6;
    background: rgba(156, 255, 203,0.06);
    border: 1px solid rgba(156, 255, 203,0.25);
    border-radius: $radius-lg;
    margin-bottom: $space-6;
    position: relative;

    @media (max-width: 480px) {
      flex-wrap: wrap;
      gap: $space-3;
    }
  }

  &__featured-badge {
    position: absolute;
    top: -11px;
    left: $space-5;
    display: inline-flex;
    align-items: center;
    gap: $space-1;
    padding: 2px $space-3;
    background: $primary;
    border-radius: $radius-full;
    font-size: $text-xs;
    font-weight: $fw-bold;
    color: $text-inverse;
    letter-spacing: 0.02em;

    svg { color: $text-inverse; }
  }

  &__label {
    font-size: $text-sm;
    font-weight: $fw-semibold;
    color: $text-muted;
    margin-bottom: $space-3;
    letter-spacing: 0.02em;

    span { border-bottom: 1px dashed $border-hover; padding-bottom: 1px; }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: $space-3;
  }

  &__card {
    display: flex;
    align-items: center;
    gap: $space-3;
    padding: $space-4;
    background: $bg-card;
    border: 1px solid $border;
    border-radius: $radius;
    transition: $transition-fast;

    &:hover { border-color: $border-hover; }
  }

  &__avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: $radius;
    flex-shrink: 0;

    &--lg {
      width: 48px;
      height: 48px;
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;

    strong {
      font-size: $text-sm;
      font-weight: $fw-semibold;
      color: $text;
    }

    span {
      font-size: $text-xs;
      color: $text-muted;
      line-height: 1.4;
    }
  }
}

// ── FAQ ──────────────────────────────────────────
.faq {
  padding: $space-16 $space-6;

  .section-title { margin-bottom: $space-10; }

  &__list {
    max-width: 720px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: $space-2;
  }

  &__item {
    background: $bg-card;
    border: 1px solid $border;
    border-radius: $radius-lg;
    overflow: hidden;
    cursor: pointer;
    transition: $transition-fast;

    &:hover { border-color: $border-hover; }
    &--open { border-color: $border-hover; }
  }

  &__question {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $space-4;
    padding: $space-5 $space-6;
    font-size: $text-base;
    font-weight: $fw-medium;
    color: $text;
    user-select: none;
  }

  &__chevron {
    color: $text-muted;
    flex-shrink: 0;
    transition: transform 0.2s ease;

    &--open { transform: rotate(180deg); }
  }

  &__answer {
    border-top: 1px solid $border;
    padding: $space-5 $space-6;

    p {
      font-size: $text-sm;
      color: $text-muted;
      line-height: 1.8;
    }
  }
}

.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}
.accordion-enter-from,
.accordion-leave-to  { opacity: 0; max-height: 0; }
.accordion-enter-to,
.accordion-leave-from { opacity: 1; max-height: 400px; }

// ── How ──────────────────────────────────────────
.how {
  padding: $space-16 $space-6;

  .section-title { margin-bottom: $space-12; }

  &__steps {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: $space-8;
    position: relative;

    @media (min-width: 768px) {
      &::before {
        content: '';
        position: absolute;
        top: 24px;
        left: calc(16.6% + 24px);
        right: calc(16.6% + 24px);
        height: 1px;
        background: linear-gradient(90deg, $border, $primary-subtle, $border);
      }
    }
  }

  &__step {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: $space-4;
    position: relative;
  }

  &__num {
    width: 48px;
    height: 48px;
    border-radius: $radius-full;
    background: $primary-subtle;
    border: 1px solid rgba(156, 255, 203,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: $text-lg;
    font-weight: $fw-bold;
    color: $primary-light;
    flex-shrink: 0;
    position: relative;
    z-index: 1;
  }

  &__body {
    h3 {
      font-size: $text-base;
      font-weight: $fw-semibold;
      color: $text;
      margin-bottom: $space-1;
    }

    p {
      font-size: $text-sm;
      color: $text-muted;
      line-height: 1.6;
    }
  }
}

// ── Price ────────────────────────────────────────
.price {
  padding: $space-16 $space-6;
  background: $bg-surface;

  &__card {
    max-width: 820px;
    margin: 0 auto;
    background: $bg-card;
    border: 1px solid $border;
    border-radius: $radius-xl;
    padding: $space-10;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $space-10;
    align-items: center;

    @media (max-width: 640px) {
      grid-template-columns: 1fr;
      gap: $space-8;
    }
  }

  &__tag {
    font-size: $text-sm;
    font-weight: $fw-medium;
    color: $accent;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    display: block;
    margin-bottom: $space-3;
  }

  &__amount {
    display: flex;
    align-items: baseline;
    gap: $space-2;
    margin-bottom: $space-1;
  }

  &__num {
    font-size: 3rem;
    font-weight: $fw-bold;
    color: $text;
    letter-spacing: -0.03em;
  }

  &__period {
    font-size: $text-sm;
    color: $text-muted;
  }

  &__after {
    font-size: $text-sm;
    color: $text-subtle;
    margin-bottom: $space-3;
  }

  &__saving {
    display: inline-flex;
    align-items: center;
    gap: $space-2;
    padding: $space-2 $space-3;
    background: rgba(156, 255, 203,0.08);
    border: 1px solid rgba(156, 255, 203,0.25);
    border-radius: $radius-full;
    font-size: $text-xs;
    font-weight: $fw-semibold;
    color: $accent;
    margin-bottom: $space-4;

    svg { flex-shrink: 0; }
  }

  &__features {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: $space-2;

    li {
      display: flex;
      align-items: center;
      gap: $space-2;
      font-size: $text-sm;
      color: $text-muted;

      svg { color: $accent; flex-shrink: 0; }
    }
  }

  &__actions {
    display: flex;
    flex-direction: column;
    gap: $space-3;
  }

  &__secure {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $space-1;
    font-size: $text-xs;
    color: $text-subtle;
    text-align: center;

    svg { flex-shrink: 0; }
  }
}

// ── Button: disabled state ────────────────────────
.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

// ── Success state ────────────────────────────────
.success {
  min-height: 80dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $space-16 $space-6;

  &__box {
    position: relative;
    max-width: 560px;
    width: 100%;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $space-5;
  }

  &__glow {
    position: absolute;
    inset: -60px;
    background: radial-gradient(ellipse at center, rgba(156, 255, 203,0.12) 0%, transparent 70%);
    pointer-events: none;
  }

  &__icon {
    color: $accent;
    position: relative;
  }

  &__title {
    font-size: $text-3xl;
    font-weight: $fw-bold;
    color: $text;
    letter-spacing: -0.02em;
    position: relative;
  }

  &__sub {
    font-size: $text-base;
    color: $text-muted;
    line-height: 1.7;
    max-width: 420px;
    position: relative;
  }

  &__steps {
    display: flex;
    flex-direction: column;
    gap: $space-4;
    width: 100%;
    text-align: left;
    background: $bg-card;
    border: 1px solid $border;
    border-radius: $radius-lg;
    padding: $space-6;
    position: relative;
  }

  &__step {
    display: flex;
    align-items: flex-start;
    gap: $space-4;

    strong {
      font-size: $text-sm;
      font-weight: $fw-semibold;
      color: $text;
      display: block;
      margin-bottom: 2px;
    }

    p {
      font-size: $text-xs;
      color: $text-muted;
      margin: 0;
    }
  }

  &__step-num {
    width: 28px;
    height: 28px;
    border-radius: $radius-full;
    background: $primary-subtle;
    border: 1px solid rgba(156, 255, 203,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: $text-xs;
    font-weight: $fw-bold;
    color: $primary-light;
    flex-shrink: 0;
  }

  &__note {
    font-size: $text-xs;
    color: $text-subtle;
    position: relative;
  }
}
</style>
