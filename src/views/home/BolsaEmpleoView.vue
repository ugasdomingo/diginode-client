<template>
  <div class="bolsa">

    <!-- ── SUCCESS STATE ────────────────────────────────────────────────── -->
    <div v-if="showSuccess" class="bolsa-success">
      <div class="bolsa-success__box">
        <div class="bolsa-success__glow" aria-hidden="true" />
        <CheckCircle :size="52" class="bolsa-success__icon" />
        <h1 class="bolsa-success__title">¡Solicitud recibida!</h1>
        <p class="bolsa-success__subtitle">
          Agenda tu reunión de onboarding. A partir de esa sesión, tienes
          <strong>7 días</strong> para recibir a tu equipo listo para trabajar.
        </p>
        <a
          :href="calLink"
          target="_blank"
          rel="noopener noreferrer"
          class="btn-primary btn-primary--lg"
        >
          <CalendarCheck :size="20" />
          Agendar reunión de onboarding
        </a>
        <div class="bolsa-success__steps">
          <div class="bolsa-success__step">
            <div class="bolsa-success__step-num">1</div>
            <div>
              <strong>Onboarding</strong>
              <p>Definimos personalidad, tono y conocimiento de tu equipo</p>
            </div>
          </div>
          <div class="bolsa-success__step">
            <div class="bolsa-success__step-num">2</div>
            <div>
              <strong>7 días de configuración</strong>
              <p>Conectamos tus canales, entrenamos y testeamos cada empleado</p>
            </div>
          </div>
          <div class="bolsa-success__step">
            <div class="bolsa-success__step-num">3</div>
            <div>
              <strong>Tu equipo entra en acción</strong>
              <p>La mensualidad empieza el 1 del mes siguiente a la entrega</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── MAIN FLOW ─────────────────────────────────────────────────────── -->
    <template v-else>

      <!-- Header -->
      <section class="bolsa__header">
        <div class="container">
          <RouterLink to="/" class="bolsa__back">
            <ArrowLeft :size="16" />
            Volver al inicio
          </RouterLink>
          <div class="bolsa__hero">
            <div class="bolsa__hero-badge">
              <Briefcase :size="13" />
              Empleados IA · Setup incluido
            </div>
            <h1 class="bolsa__hero-title">
              Tu equipo de<br />
              <span class="bolsa__hero-accent">empleados IA</span>
            </h1>
            <p class="bolsa__hero-subtitle">
              Cuatro especialistas que trabajan 24/7 para tu negocio.
              El setup está incluido en los primeros 6 meses
              y el equipo está activo en 7 días.
            </p>
          </div>
        </div>
      </section>

      <!-- Plans -->
      <section class="bolsa__plans">
        <div class="container">
          <h2 class="bolsa__section-title">Elige tu plan</h2>
          <p class="bolsa__section-sub">
            Los primeros 6 meses incluyen el setup completo (600€ diluido).
            Sin permanencia mínima.
          </p>
          <div class="plans-grid">
            <div
              v-for="plan in plans"
              :key="plan.id"
              class="plan-card"
              :class="{ 'plan-card--featured': plan.featured }"
            >
              <div v-if="plan.featured" class="plan-card__ribbon">
                <Star :size="11" />
                Más completo
              </div>

              <div class="plan-card__top">
                <div class="plan-card__icon" :style="{ background: plan.bg }">
                  <component :is="plan.icon" :size="20" :style="{ color: plan.color }" />
                </div>
                <div>
                  <h3 class="plan-card__name">{{ plan.name }}</h3>
                  <p class="plan-card__target">{{ plan.target }}</p>
                </div>
              </div>

              <!-- Despacho: interactive 2-of-4 picker -->
              <div v-if="plan.id === 'despacho'" class="plan-card__employees">
                <span class="plan-card__emp-label">
                  Elige 2 empleados
                  <span class="plan-card__emp-count">{{ despachoSelected.length }}/2</span>
                </span>
                <div class="plan-card__chips">
                  <button
                    v-for="emp in employees"
                    :key="emp.id"
                    class="plan-card__chip plan-card__chip--pick"
                    :class="{ 'plan-card__chip--active': despachoSelected.includes(emp.id) }"
                    :style="despachoSelected.includes(emp.id)
                      ? { background: emp.bg, color: emp.color, borderColor: emp.color + '50' }
                      : {}"
                    @click="toggleDespachoEmp(emp.id)"
                  >
                    <component :is="emp.icon" :size="12" />
                    {{ emp.name }} — {{ emp.role }}
                  </button>
                </div>
              </div>

              <!-- Clínica: all 4 included, no selection needed -->
              <div v-else class="plan-card__employees">
                <span class="plan-card__emp-label">Empleados incluidos</span>
                <div class="plan-card__chips">
                  <span
                    v-for="id in plan.employee_ids"
                    :key="id"
                    class="plan-card__chip"
                    :style="{ background: empById(id).bg, color: empById(id).color }"
                  >
                    {{ empById(id).name }} — {{ empById(id).role }}
                  </span>
                </div>
              </div>

              <ul class="plan-card__features">
                <li v-for="f in plan.features" :key="f">
                  <CheckCircle :size="12" class="plan-card__check" />
                  {{ f }}
                </li>
              </ul>

              <div class="plan-card__pricing">
                <div class="plan-card__price-row">
                  <span class="plan-card__amount">{{ plan.monthly_promo }}€</span>
                  <span class="plan-card__period">/mes</span>
                  <span class="plan-card__tag">primeros 6 meses</span>
                </div>
                <p class="plan-card__after">Después: <strong>{{ plan.monthly_regular }}€/mes</strong></p>
                <p class="plan-card__note">Setup incluido · Sin permanencia</p>
              </div>

              <a
                :href="plan.stripe_link"
                target="_blank"
                rel="noopener noreferrer"
                class="plan-card__cta"
                :class="{ 'plan-card__cta--featured': plan.featured }"
              >
                <CreditCard :size="15" />
                Empezar con {{ plan.name }}
              </a>
            </div>
          </div>

          <!-- Demo nudge -->
          <div class="bolsa__demo-nudge">
            <p class="bolsa__demo-nudge__text">
              ¿Quieres verlo en acción antes de contratar?
            </p>
            <a
              :href="calLink"
              target="_blank"
              rel="noopener noreferrer"
              class="bolsa__demo-nudge__link"
            >
              <CalendarCheck :size="15" />
              Solicitar una demo gratuita
            </a>
          </div>
        </div>
      </section>

      <!-- Individual employees -->
      <section class="bolsa__individuals">
        <div class="container">
          <h2 class="bolsa__section-title">O contrata un empleado individual</h2>
          <p class="bolsa__section-sub">Empieza con uno y amplía tu equipo cuando quieras · <strong>150€/mes + setup 600€</strong></p>
          <div class="emp-grid">
            <button
              v-for="emp in employees"
              :key="emp.id"
              class="emp-card emp-card--pick"
              :class="{ 'emp-card--selected': selectedEmp === emp.id }"
              @click="selectedEmp = selectedEmp === emp.id ? null : emp.id"
            >
              <div class="emp-card__head">
                <div class="emp-card__icon" :style="{ background: emp.bg }">
                  <component :is="emp.icon" :size="20" :style="{ color: emp.color }" />
                </div>
                <div class="emp-card__head-info">
                  <div class="emp-card__name">{{ emp.name }}</div>
                  <div class="emp-card__role" :style="{ color: emp.color }">{{ emp.role }}</div>
                </div>
                <CheckCircle
                  v-if="selectedEmp === emp.id"
                  :size="18"
                  class="emp-card__sel-check"
                />
              </div>
              <p class="emp-card__pitch">{{ emp.pitch }}</p>
              <ul class="emp-card__tasks">
                <li v-for="t in emp.tasks" :key="t">
                  <CheckCircle :size="11" class="emp-card__check" />
                  {{ t }}
                </li>
              </ul>
              <div class="emp-card__inprice">
                <span class="emp-card__inprice-amount">150€</span>
                <span class="emp-card__inprice-period">/mes</span>
                <span class="emp-card__inprice-sep">·</span>
                <span class="emp-card__inprice-setup">setup 600€</span>
              </div>
            </button>
          </div>

          <!-- Setup payment panel -->
          <Transition name="fade-slide">
            <div v-if="selectedEmp" class="setup-panel">
              <h3 class="setup-panel__title">
                ¿Cómo prefieres pagar el setup de
                <span :style="{ color: empById(selectedEmp).color }">{{ empById(selectedEmp).name }}</span>?
              </h3>

              <div class="setup-panel__opts">
                <button
                  class="setup-opt"
                  :class="{ 'setup-opt--active': setupPlan === 'full' }"
                  @click="setupPlan = 'full'"
                >
                  <div class="setup-opt__top">
                    <span class="setup-opt__name">Pago único del setup</span>
                    <span v-if="setupPlan === 'full'" class="setup-opt__check">✓</span>
                  </div>
                  <div class="setup-opt__price">600€ <span>al contratar</span></div>
                  <div class="setup-opt__monthly">+ 150€/mes desde el mes 1</div>
                </button>

                <button
                  class="setup-opt"
                  :class="{ 'setup-opt--active': setupPlan === 'split' }"
                  @click="setupPlan = 'split'"
                >
                  <div class="setup-opt__top">
                    <span class="setup-opt__name">Setup en 3 plazos</span>
                    <span v-if="setupPlan === 'split'" class="setup-opt__check">✓</span>
                  </div>
                  <div class="setup-opt__price">200€/mes <span>× 3 meses</span></div>
                  <div class="setup-opt__monthly">+ 150€/mes desde el mes 1</div>
                  <p class="setup-opt__note">
                    <Info :size="11" />
                    El 2.º plazo del setup (mes 1) coincide con tu primera mensualidad — ese mes pagas 350€ en total.
                  </p>
                </button>
              </div>

              <a
                :href="setupPlan === 'full' ? stripeEmpFull : stripeEmpSplit"
                target="_blank"
                rel="noopener noreferrer"
                class="setup-panel__cta"
              >
                <CreditCard :size="16" />
                Contratar a {{ empById(selectedEmp).name }}
              </a>
            </div>
          </Transition>
        </div>
      </section>

      <!-- Trust + FAQ teaser -->
      <section class="bolsa__trust">
        <div class="container">
          <div class="trust-bar">
            <div class="trust-bar__item">
              <ShieldCheck :size="13" />
              Pago seguro con Stripe
            </div>
            <div class="trust-bar__item">
              <RefreshCcw :size="13" />
              Sin permanencia mínima
            </div>
            <div class="trust-bar__item">
              <Clock :size="13" />
              Activo en 7 días
            </div>
          </div>
          <p class="bolsa__faq-note">
            ¿Tienes dudas? Consulta las
            <RouterLink to="/#faq" class="bolsa__faq-link">preguntas frecuentes</RouterLink>
            o
            <a
              href="https://wa.me/34604822385"
              target="_blank"
              rel="noopener noreferrer"
              class="bolsa__wa-link"
            >
              escríbenos por WhatsApp
            </a>.
          </p>
        </div>
      </section>

    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  CheckCircle, CalendarCheck, ArrowLeft, Briefcase,
  Star, ShieldCheck, RefreshCcw, Clock, Info,
  TrendingUp, MessageSquare, Share2, BarChart2,
  Building2, Sparkles, CreditCard,
} from 'lucide-vue-next'

const calLink          = import.meta.env.VITE_CAL_BOOKING_LINK
const stripeDespacho   = import.meta.env.VITE_STRIPE_DESPACHO_LINK
const stripeClinica    = import.meta.env.VITE_STRIPE_CLINICA_LINK
const stripeEmpFull    = import.meta.env.VITE_STRIPE_EMP_FULL_LINK
const stripeEmpSplit   = import.meta.env.VITE_STRIPE_EMP_SPLIT_LINK
const route            = useRoute()

const showSuccess = computed(() => route.query.success === 'true')

// ── Individual employee selection ────────────────────────────────────────────
const selectedEmp = ref(null)
const setupPlan   = ref('full')

// ── Despacho employee picker (choose exactly 2 from 4) ──────────────────────
const despachoSelected = ref(['luna', 'sofia'])

function toggleDespachoEmp(id) {
  const sel = despachoSelected.value
  const idx = sel.indexOf(id)
  if (idx > -1) {
    // Don't deselect if it would leave fewer than 1
    if (sel.length > 1) despachoSelected.value = sel.filter(e => e !== id)
  } else {
    // Replace oldest when already 2 selected
    if (sel.length >= 2) {
      despachoSelected.value = [sel[1], id]
    } else {
      despachoSelected.value = [...sel, id]
    }
  }
}

// ── Employees ───────────────────────────────────────────────────────────────
const employees = [
  {
    id:    'luna',
    name:  'Luna',
    role:  'Captadora',
    icon:  TrendingUp,
    color: '#34d399',
    bg:    'rgba(52,211,153,0.12)',
    pitch: 'Luna atiende a cada persona interesada en tu servicio con calidez y criterio. Valida compatibilidad y agenda la primera cita, incluso mientras duermes.',
    tasks: [
      'Responde a cada contacto nuevo al instante, a cualquier hora',
      'Filtra y cualifica antes de llegar a ti',
      'Agenda la primera sesión de forma autónoma',
      'Hace seguimiento a contactos que aún no estaban listos',
    ],
  },
  {
    id:    'sofia',
    name:  'Sofía',
    role:  'Asistente',
    icon:  MessageSquare,
    color: '#7c6fff',
    bg:    'rgba(124,111,255,0.12)',
    pitch: 'Sofía gestiona tu agenda, responde consultas y recuerda citas. Tu operativa diaria en piloto automático para que tú estés donde importas.',
    tasks: [
      'Resumen de agenda cada mañana a las 7:30h',
      'Respuestas inmediatas a pacientes o clientes 24/7',
      'Gestión de cancelaciones y cambios sin interrumpirte',
      'Recordatorios automáticos de confirmación de citas',
    ],
  },
  {
    id:    'valeria',
    name:  'Valeria',
    role:  'Contenido',
    icon:  Share2,
    color: '#f59e0b',
    bg:    'rgba(245,158,11,0.12)',
    pitch: 'Valeria mantiene tu presencia digital activa. Publica en redes, redacta artículos y crea materiales que te posicionan como referente en tu sector.',
    tasks: [
      'Publicaciones semanales en Instagram, LinkedIn y TikTok',
      'Artículos de blog optimizados para posicionamiento web',
      'Respuesta a comentarios para mantener la comunidad activa',
      'Calendario mensual de contenido con tendencias',
    ],
  },
  {
    id:    'marcos',
    name:  'Marcos',
    role:  'Administrador',
    icon:  BarChart2,
    color: '#818cf8',
    bg:    'rgba(129,140,248,0.12)',
    pitch: 'Marcos lleva las finanzas de tu negocio sin errores ni sorpresas. Informes, alertas de cobro y calendario fiscal siempre al día.',
    tasks: [
      'Resumen semanal de ingresos sin hojas de cálculo',
      'Alertas de cobros pendientes antes de que sean un problema',
      'Informe financiero mensual listo en Google Docs',
      'Avisos de declaraciones fiscales con 15 días de antelación',
    ],
  },
]

// ── Plans ────────────────────────────────────────────────────────────────────
const plans = [
  {
    id:               'despacho',
    name:             'Despacho Digital',
    target:           'Para psicólogos, coaches y despachos',
    icon:             Building2,
    color:            '#34d399',
    bg:               'rgba(52,211,153,0.12)',
    featured:         false,
    employee_ids:     ['luna', 'sofia'],
    stripe_link:      stripeDespacho,
    monthly_promo:    300,
    monthly_regular:  200,
    features: [
      'Captación y gestión de nuevos contactos 24/7',
      'Asistente virtual para agenda y consultas',
      'Web profesional + dashboard de gestión',
      'Configuración completa en 7 días',
      'Soporte técnico continuo incluido',
    ],
  },
  {
    id:               'clinica',
    name:             'Clínica Digital',
    target:           'Para clínicas y centros de salud',
    icon:             Sparkles,
    color:            '#7c6fff',
    bg:               'rgba(124,111,255,0.12)',
    featured:         true,
    employee_ids:     ['luna', 'sofia', 'valeria', 'marcos'],
    stripe_link:      stripeClinica,
    monthly_promo:    500,
    monthly_regular:  350,
    features: [
      'Todo lo de Despacho Digital, más:',
      'Contenido y redes sociales activos cada semana',
      'Administración financiera y fiscal automatizada',
      'Los 4 empleados IA trabajando en paralelo',
      'Panel de control centralizado para todo el equipo',
    ],
  },
]

// ── Helpers ──────────────────────────────────────────────────────────────────
function empById(id) {
  return employees.find(e => e.id === id)
}
</script>

<style lang="scss" scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 $space-6;

  @media (max-width: 640px) {
    padding: 0 $space-4;
  }
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: $space-2;
  height: 48px;
  padding: 0 $space-6;
  background: $primary;
  color: #fff;
  font-size: $text-base;
  font-weight: $fw-semibold;
  border-radius: $radius;
  text-decoration: none;
  transition: $transition;
  box-shadow: 0 0 24px $primary-glow;

  &:hover {
    background: $primary-dark;
    transform: translateY(-2px);
    color: #fff;
  }

  &--lg {
    height: 56px;
    padding: 0 $space-8;
    font-size: $text-lg;
  }
}

// ── Success state ────────────────────────────────────────────────────────────
.bolsa-success {
  min-height: calc(100dvh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $space-16 $space-6;

  &__box {
    position: relative;
    background: $bg-card;
    border: 1px solid rgba(52,211,153,0.3);
    border-radius: $radius-xl;
    padding: $space-16 $space-10;
    text-align: center;
    max-width: 640px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $space-6;
    box-shadow: 0 0 60px rgba(52,211,153,0.12);

    @media (max-width: 640px) {
      padding: $space-10 $space-6;
    }
  }

  &__glow {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 60% 40% at 50% 0%, rgba(52,211,153,0.12) 0%, transparent 70%);
    pointer-events: none;
    border-radius: $radius-xl;
  }

  &__icon {
    color: $accent;
    filter: drop-shadow(0 0 16px rgba(52,211,153,0.5));
    position: relative;
  }

  &__title {
    font-size: $text-3xl;
    font-weight: $fw-bold;
    color: $text;
    letter-spacing: -0.02em;
    position: relative;
  }

  &__subtitle {
    font-size: $text-base;
    color: $text-muted;
    line-height: 1.7;
    max-width: 480px;
    position: relative;

    strong { color: $text; }
  }

  &__steps {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: $space-3;
    text-align: left;
    position: relative;
  }

  &__step {
    display: flex;
    align-items: flex-start;
    gap: $space-4;
    padding: $space-4;
    background: $bg-surface;
    border: 1px solid $border;
    border-radius: $radius;

    strong {
      display: block;
      font-size: $text-sm;
      font-weight: $fw-semibold;
      color: $text;
      margin-bottom: $space-1;
    }

    p {
      font-size: $text-xs;
      color: $text-muted;
      line-height: 1.5;
    }
  }

  &__step-num {
    width: 28px;
    height: 28px;
    border-radius: $radius-full;
    background: $primary-subtle;
    border: 1px solid rgba(124,111,255,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: $text-xs;
    font-weight: $fw-bold;
    color: $primary-light;
    flex-shrink: 0;
    margin-top: 2px;
  }
}

// ── Header ───────────────────────────────────────────────────────────────────
.bolsa {
  min-height: calc(100dvh - 64px);
  background: $bg;

  &__header {
    padding: $space-8 0 $space-10;
  }

  &__back {
    display: inline-flex;
    align-items: center;
    gap: $space-2;
    font-size: $text-sm;
    color: $text-muted;
    text-decoration: none;
    transition: $transition-fast;
    margin-bottom: $space-6;

    &:hover { color: $text; }
  }

  &__hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: $space-4;
  }

  &__hero-badge {
    display: inline-flex;
    align-items: center;
    gap: $space-2;
    padding: $space-2 $space-4;
    background: $primary-subtle;
    border: 1px solid rgba(124,111,255,0.25);
    border-radius: $radius-full;
    font-size: $text-sm;
    font-weight: $fw-medium;
    color: $primary-light;
  }

  &__hero-title {
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: $fw-bold;
    line-height: 1.15;
    letter-spacing: -0.03em;
    color: $text;
  }

  &__hero-accent {
    background: linear-gradient(135deg, $primary-light 0%, $accent 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  &__hero-subtitle {
    font-size: $text-lg;
    color: $text-muted;
    line-height: 1.6;
    max-width: 520px;
  }

  // ── Shared section header ──
  &__section-title {
    font-size: $text-2xl;
    font-weight: $fw-bold;
    color: $text;
    letter-spacing: -0.02em;
    text-align: center;
    margin-bottom: $space-2;
  }

  &__section-sub {
    font-size: $text-base;
    color: $text-muted;
    text-align: center;
    margin-bottom: $space-10;
  }

  // ── Individual employees section ──
  &__individuals {
    padding: $space-10 0 $space-16;
    border-top: 1px solid $border;
    background: $bg;

    strong { color: $text; }
  }

  // ── Plans section ──
  &__plans {
    padding: $space-10 0 $space-16;
    background: $bg-surface;
    border-top: 1px solid $border;
  }

  // ── Demo nudge ──
  &__demo-nudge {
    margin-top: $space-8;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $space-3;

    &__text {
      font-size: $text-sm;
      color: $text-muted;
    }

    &__link {
      display: inline-flex;
      align-items: center;
      gap: $space-2;
      height: 40px;
      padding: 0 $space-5;
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
    }
  }

  // ── Trust section ──
  &__trust {
    padding: $space-8 0 $space-10;
    border-top: 1px solid $border;
    text-align: center;
  }

  &__faq-note {
    margin-top: $space-4;
    font-size: $text-sm;
    color: $text-muted;
  }

  &__faq-link {
    color: $primary-light;
    font-weight: $fw-medium;
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }

  &__wa-link {
    color: #25d366;
    font-weight: $fw-medium;
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }
}

// ── Employee grid ─────────────────────────────────────────────────────────────
.emp-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: $space-4;
}

.emp-card {
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius-lg;
  padding: $space-5;
  display: flex;
  flex-direction: column;
  gap: $space-3;
  transition: $transition;

  &:hover {
    border-color: $border-hover;
    transform: translateY(-2px);
  }

  &__head {
    display: flex;
    align-items: center;
    gap: $space-3;
  }

  &__icon {
    width: 44px;
    height: 44px;
    border-radius: $radius;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__name {
    font-size: $text-base;
    font-weight: $fw-bold;
    color: $text;
    line-height: 1.2;
  }

  &__role {
    font-size: $text-xs;
    font-weight: $fw-semibold;
    margin-top: 2px;
  }

  &__pitch {
    font-size: $text-sm;
    color: $text-muted;
    line-height: 1.6;
  }

  &__tasks {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: $space-2;

    li {
      display: flex;
      align-items: flex-start;
      gap: $space-2;
      font-size: $text-xs;
      color: $text-muted;
      line-height: 1.5;
    }
  }

  &__check {
    color: $accent;
    flex-shrink: 0;
    margin-top: 1px;
  }

  // Selectable variant (individual section)
  &--pick {
    cursor: pointer;
    text-align: left;
    width: 100%;
    background: $bg-card;
    border: 1px solid $border;
    border-radius: $radius-lg;
    padding: $space-5;
    display: flex;
    flex-direction: column;
    gap: $space-3;
    transition: $transition;

    &:hover {
      border-color: $border-hover;
      transform: translateY(-2px);
    }
  }

  &--selected {
    border-color: rgba(124,111,255,0.6) !important;
    background: rgba(124,111,255,0.04) !important;
    box-shadow: 0 0 20px rgba(124,111,255,0.12);
  }

  &__head-info { flex: 1; }

  &__sel-check {
    color: $primary-light;
    flex-shrink: 0;
    margin-left: auto;
  }

  &__inprice {
    display: flex;
    align-items: baseline;
    gap: $space-1;
    padding-top: $space-3;
    border-top: 1px solid $border;
    margin-top: auto;

    &-amount {
      font-size: $text-xl;
      font-weight: $fw-bold;
      color: $text;
      font-variant-numeric: tabular-nums;
    }

    &-period { font-size: $text-sm; color: $text-muted; }

    &-sep {
      color: $text-subtle;
      font-size: $text-sm;
      padding: 0 $space-1;
    }

    &-setup { font-size: $text-sm; color: $text-muted; }
  }
}

// ── Plans grid ────────────────────────────────────────────────────────────────
.plans-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $space-6;
  align-items: start;
  max-width: 920px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    max-width: 480px;
  }
}

.plan-card {
  position: relative;
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius-xl;
  padding: $space-8;
  display: flex;
  flex-direction: column;
  gap: $space-5;
  transition: $transition;

  &:hover {
    border-color: $border-hover;
    transform: translateY(-3px);
  }

  &--featured {
    border-color: rgba(124,111,255,0.4);
    background: linear-gradient(145deg, $bg-card, rgba(124,111,255,0.04));
    box-shadow: 0 0 40px rgba(124,111,255,0.1);

    &:hover {
      border-color: rgba(124,111,255,0.6);
      box-shadow: 0 0 56px rgba(124,111,255,0.18);
    }
  }

  &__ribbon {
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    display: inline-flex;
    align-items: center;
    gap: $space-1;
    padding: $space-1 $space-3;
    background: $primary;
    color: #fff;
    border-radius: $radius-full;
    font-size: $text-xs;
    font-weight: $fw-bold;
    white-space: nowrap;
    letter-spacing: 0.03em;
    box-shadow: 0 0 16px $primary-glow;
  }

  &__top {
    display: flex;
    align-items: center;
    gap: $space-3;
  }

  &__icon {
    width: 48px;
    height: 48px;
    border-radius: $radius;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__name {
    font-size: $text-xl;
    font-weight: $fw-bold;
    color: $text;
    letter-spacing: -0.01em;
  }

  &__target {
    font-size: $text-xs;
    color: $text-muted;
    margin-top: 2px;
  }

  &__employees {
    display: flex;
    flex-direction: column;
    gap: $space-2;
  }

  &__emp-label {
    font-size: $text-xs;
    font-weight: $fw-semibold;
    color: $text-muted;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    display: flex;
    align-items: center;
    gap: $space-2;
  }

  &__emp-count {
    font-size: $text-xs;
    font-weight: $fw-bold;
    color: $primary-light;
    background: $primary-subtle;
    border: 1px solid rgba(124,111,255,0.25);
    padding: 1px $space-2;
    border-radius: $radius-full;
    letter-spacing: 0;
    text-transform: none;
  }

  &__chips {
    display: flex;
    flex-direction: column;
    gap: $space-2;
  }

  &__chip {
    display: inline-flex;
    align-items: center;
    padding: $space-2 $space-3;
    border-radius: $radius;
    font-size: $text-xs;
    font-weight: $fw-semibold;

    // Interactive picker variant
    &--pick {
      gap: $space-2;
      background: $bg-surface;
      border: 1px solid $border;
      color: $text-muted;
      cursor: pointer;
      transition: $transition-fast;
      text-align: left;
      width: 100%;

      &:hover {
        border-color: $border-hover;
        color: $text;
      }
    }

    &--active {
      border: 1px solid currentColor;
    }
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
      align-items: flex-start;
      gap: $space-2;
      font-size: $text-sm;
      color: $text-muted;
      line-height: 1.5;
    }
  }

  &__check {
    color: $accent;
    flex-shrink: 0;
    margin-top: 2px;
  }

  &__pricing {
    border-top: 1px solid $border;
    padding-top: $space-4;
    display: flex;
    flex-direction: column;
    gap: $space-1;
  }

  &__price-row {
    display: flex;
    align-items: baseline;
    gap: $space-2;
    flex-wrap: wrap;
  }

  &__amount {
    font-size: $text-3xl;
    font-weight: $fw-bold;
    color: $text;
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.02em;
  }

  &__period {
    font-size: $text-base;
    color: $text-muted;
  }

  &__tag {
    font-size: $text-xs;
    font-weight: $fw-semibold;
    color: $accent;
    background: rgba(52,211,153,0.1);
    border: 1px solid rgba(52,211,153,0.25);
    padding: 2px $space-2;
    border-radius: $radius-full;
  }

  &__after {
    font-size: $text-sm;
    color: $text-muted;

    strong { color: $text; font-weight: $fw-semibold; }
  }

  &__note {
    font-size: $text-xs;
    color: $text-subtle;
  }

  &__cta {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $space-2;
    height: 48px;
    background: $primary-subtle;
    border: 1px solid rgba(124,111,255,0.25);
    border-radius: $radius;
    color: $primary-light;
    font-size: $text-base;
    font-weight: $fw-semibold;
    text-decoration: none;
    transition: $transition;

    &:hover {
      background: $primary;
      border-color: $primary;
      color: #fff;
      box-shadow: 0 0 20px $primary-glow;
    }

    &--featured {
      background: $primary;
      border-color: $primary;
      color: #fff;
      box-shadow: 0 0 20px $primary-glow;

      &:hover {
        background: $primary-dark;
        box-shadow: 0 0 28px rgba(124,111,255,0.5);
      }
    }
  }
}

// ── Setup payment panel ───────────────────────────────────────────────────────
.setup-panel {
  margin-top: $space-8;
  background: $bg-card;
  border: 1px solid rgba(124,111,255,0.25);
  border-radius: $radius-xl;
  padding: $space-8;
  display: flex;
  flex-direction: column;
  gap: $space-5;
  max-width: 720px;
  margin-left: auto;
  margin-right: auto;

  &__title {
    font-size: $text-lg;
    font-weight: $fw-semibold;
    color: $text;
    text-align: center;
    line-height: 1.4;
  }

  &__opts {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $space-4;

    @media (max-width: 640px) {
      grid-template-columns: 1fr;
    }
  }

  &__cta {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $space-2;
    height: 52px;
    background: $primary;
    border-radius: $radius;
    color: #fff;
    font-size: $text-base;
    font-weight: $fw-semibold;
    text-decoration: none;
    transition: $transition;
    box-shadow: 0 0 24px $primary-glow;

    &:hover {
      background: $primary-dark;
      transform: translateY(-1px);
      box-shadow: 0 0 36px rgba(124,111,255,0.4);
      color: #fff;
    }
  }
}

.setup-opt {
  background: $bg-surface;
  border: 1px solid $border;
  border-radius: $radius-lg;
  padding: $space-5;
  display: flex;
  flex-direction: column;
  gap: $space-2;
  text-align: left;
  cursor: pointer;
  transition: $transition-fast;

  &:hover { border-color: $border-hover; }

  &--active {
    border-color: rgba(124,111,255,0.5);
    background: rgba(124,111,255,0.04);
  }

  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__name {
    font-size: $text-sm;
    font-weight: $fw-semibold;
    color: $text;
  }

  &__check {
    font-size: $text-sm;
    font-weight: $fw-bold;
    color: $primary-light;
  }

  &__price {
    font-size: $text-xl;
    font-weight: $fw-bold;
    color: $text;
    font-variant-numeric: tabular-nums;
    line-height: 1.2;

    span {
      font-size: $text-sm;
      font-weight: $fw-regular;
      color: $text-muted;
    }
  }

  &__monthly {
    font-size: $text-xs;
    color: $text-muted;
  }

  &__note {
    display: flex;
    align-items: flex-start;
    gap: $space-2;
    font-size: $text-xs;
    color: $text-subtle;
    line-height: 1.5;
    margin-top: $space-2;
    padding: $space-2 $space-3;
    background: rgba(124,111,255,0.06);
    border: 1px solid rgba(124,111,255,0.15);
    border-radius: $radius;

    svg { flex-shrink: 0; color: $primary-light; margin-top: 1px; }
  }
}

// ── Trust bar ─────────────────────────────────────────────────────────────────
.trust-bar {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: $space-6;

  &__item {
    display: flex;
    align-items: center;
    gap: $space-2;
    font-size: $text-sm;
    color: $text-muted;

    svg { flex-shrink: 0; color: $text-subtle; }
  }
}
</style>
