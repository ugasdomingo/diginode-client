<template>
  <div class="bolsa">

    <!-- ── SUCCESS STATE (post-payment redirect) ── -->
    <div v-if="showSuccess" class="bolsa-success">
      <div class="bolsa-success__box">
        <div class="bolsa-success__glow" aria-hidden="true" />
        <CheckCircle :size="52" class="bolsa-success__icon" />
        <h1 class="bolsa-success__title">¡Pago completado!</h1>
        <p class="bolsa-success__subtitle">
          Ahora agenda tu reunión de onboarding. A partir de esa sesión, tienes
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
        <p class="bolsa-success__email">
          Recibirás un email de confirmación con los detalles del onboarding y la documentación que necesitas preparar.
        </p>
      </div>
    </div>

    <!-- ── MAIN PURCHASE FLOW ── -->
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
              Bolsa de Empleo IA
            </div>
            <h1 class="bolsa__hero-title">
              Incorpora tu<br />
              <span class="bolsa__hero-accent">equipo IA</span>
            </h1>
            <p class="bolsa__hero-subtitle">
              Selecciona los empleados que necesitas. El precio se ajusta automáticamente
              según el equipo que elijas.
            </p>
          </div>
        </div>
      </section>

      <!-- Main content -->
      <section class="bolsa__content">
        <div class="container">
          <div class="bolsa__layout">

            <!-- Left: Employee selector -->
            <div class="bolsa__selector">

              <!-- Smart pricing notice -->
              <Transition name="fade-up">
                <div v-if="pricingNote" class="bolsa__notice" :class="`bolsa__notice--${pricingNote.type}`">
                  <component :is="pricingNote.icon" :size="16" />
                  <div>
                    <strong>{{ pricingNote.title }}</strong>
                    <p>{{ pricingNote.desc }}</p>
                  </div>
                </div>
              </Transition>

              <!-- Employee cards -->
              <div class="selector-grid">
                <button
                  v-for="emp in employees"
                  :key="emp.id"
                  class="sel-card"
                  :class="{
                    'sel-card--selected': isSelected(emp.id),
                    'sel-card--dept': isDeptHighlighted(emp.id),
                  }"
                  @click="toggleEmployee(emp.id)"
                >
                  <div class="sel-card__check">
                    <CheckCircle v-if="isSelected(emp.id)" :size="18" class="sel-card__check-icon--on" />
                    <div v-else class="sel-card__check-ring" />
                  </div>

                  <div class="sel-card__icon" :style="{ background: emp.bg }">
                    <component :is="emp.icon" :size="20" :style="{ color: emp.color }" />
                  </div>

                  <div class="sel-card__info">
                    <div class="sel-card__name">{{ emp.name }}</div>
                    <div class="sel-card__role">{{ emp.role }}</div>
                    <div class="sel-card__dept" :style="{ color: emp.color }">{{ emp.dept }}</div>
                  </div>

                  <div class="sel-card__price">
                    <span class="sel-card__price-amount">{{ INDIVIDUAL.monthly }}€</span>
                    <span class="sel-card__price-period">/mes</span>
                  </div>
                </button>
              </div>

              <!-- Full team upsell -->
              <button
                class="bolsa__upsell"
                :class="{ 'bolsa__upsell--active': selectedIds.length === 6 }"
                @click="toggleFullTeam"
              >
                <div class="bolsa__upsell-left">
                  <Star :size="18" class="bolsa__upsell-star" />
                  <div>
                    <strong>Equipo Completo — Los 6 empleados</strong>
                    <p>Ahorra {{ fullTeamSaving }}€/mes vs. contratación individual</p>
                  </div>
                </div>
                <div class="bolsa__upsell-price">
                  <span>500€</span><span class="bolsa__upsell-period">/mes</span>
                </div>
              </button>

            </div>

            <!-- Right: Order summary (sticky) -->
            <div class="bolsa__order">
              <div class="order-box">
                <h3 class="order-box__title">Tu pedido</h3>

                <!-- Empty state -->
                <div v-if="selectedIds.length === 0" class="order-box__empty">
                  <Users :size="32" class="order-box__empty-icon" />
                  <p>Selecciona al menos un empleado para ver el resumen</p>
                </div>

                <template v-else>
                  <!-- Selected employees list -->
                  <div class="order-box__employees">
                    <div
                      v-for="id in selectedIds"
                      :key="id"
                      class="order-emp"
                    >
                      <div class="order-emp__icon" :style="{ background: empById(id).bg }">
                        <component :is="empById(id).icon" :size="14" :style="{ color: empById(id).color }" />
                      </div>
                      <div class="order-emp__info">
                        <span class="order-emp__name">{{ empById(id).name }}</span>
                        <span class="order-emp__role">{{ empById(id).role }}</span>
                      </div>
                      <button class="order-emp__remove" @click="toggleEmployee(id)" aria-label="Eliminar">
                        <X :size="12" />
                      </button>
                    </div>
                  </div>

                  <!-- Pricing type badge -->
                  <div v-if="pricing.type !== 'individual'" class="order-box__type-badge" :style="pricingBadgeStyle">
                    <component :is="pricingBadgeIcon" :size="12" />
                    {{ pricingLabel }}
                  </div>

                  <!-- Saving notice -->
                  <div v-if="pricing.saving" class="order-box__saving">
                    <TrendingDown :size="14" />
                    Ahorrando {{ pricing.saving.monthly }}€/mes vs. precios individuales
                  </div>

                  <!-- Setup pricing -->
                  <div class="order-box__section">
                    <div class="order-box__section-title">
                      Setup (pago único)
                      <span class="order-box__section-note">configuración completa</span>
                    </div>

                    <!-- Installment toggle -->
                    <div class="installment-toggle">
                      <button
                        class="installment-opt"
                        :class="{ 'installment-opt--active': installments === 1 }"
                        @click="installments = 1"
                      >
                        <div class="installment-opt__radio" />
                        <div>
                          <strong>Pago único</strong>
                          <p>{{ pricing.setup }}€ hoy</p>
                        </div>
                      </button>
                      <button
                        class="installment-opt"
                        :class="{ 'installment-opt--active': installments === 3 }"
                        @click="installments = 3"
                      >
                        <div class="installment-opt__radio" />
                        <div>
                          <strong>3 cuotas mensuales</strong>
                          <p>{{ Math.ceil(pricing.setup / 3) }}€/mes × 3</p>
                        </div>
                        <span class="installment-opt__tag">Sin intereses</span>
                      </button>
                    </div>

                    <div class="order-box__line">
                      <span>{{ installments === 1 ? 'Setup hoy' : `1ª cuota hoy (de 3)` }}</span>
                      <strong>{{ installments === 1 ? pricing.setup : Math.ceil(pricing.setup / 3) }}€</strong>
                    </div>
                  </div>

                  <!-- Monthly -->
                  <div class="order-box__section">
                    <div class="order-box__section-title">
                      Mensualidad
                      <span class="order-box__section-note">desde el 1 del mes siguiente a la entrega</span>
                    </div>
                    <div class="order-box__line">
                      <span>Mantenimiento mensual</span>
                      <strong>{{ pricing.monthly }}€/mes</strong>
                    </div>
                  </div>

                  <!-- Total today -->
                  <div class="order-box__total">
                    <span class="order-box__total-label">Total hoy</span>
                    <span class="order-box__total-amount">{{ totalToday }}€</span>
                  </div>

                  <!-- Fine print -->
                  <p class="order-box__fine">
                    <Info :size="12" />
                    {{ installments === 3 ? `Las cuotas 2 y 3 del setup (${Math.ceil(pricing.setup / 3)}€ cada una) se cargarán automáticamente en los dos meses siguientes.` : 'Sin permanencia mínima. Cancela con un mes de antelación.' }}
                  </p>

                  <!-- CTA -->
                  <a
                    :href="calLink"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="order-box__cta"
                  >
                    <Zap :size="16" />
                    Contratar ahora
                  </a>
                  <p class="order-box__cta-note">
                    Agendaremos el pago y onboarding en una llamada de 20 min
                  </p>

                </template>
              </div>

              <!-- Trust signals -->
              <div class="order-trust">
                <div class="order-trust__item">
                  <ShieldCheck :size="14" />
                  Pago seguro con Stripe
                </div>
                <div class="order-trust__item">
                  <RefreshCcw :size="14" />
                  Sin permanencia mínima
                </div>
                <div class="order-trust__item">
                  <Clock :size="14" />
                  Entrega en 7 días
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- FAQ teaser -->
      <section class="bolsa__faq-teaser">
        <div class="container">
          <p>
            ¿Tienes dudas? Consulta las
            <RouterLink to="/#faq" class="bolsa__faq-link">preguntas frecuentes</RouterLink>
            o
            <a href="https://wa.me/34604822385" target="_blank" rel="noopener noreferrer" class="bolsa__wa-link">
              escríbenos por WhatsApp
            </a>.
          </p>
        </div>
      </section>

    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  CheckCircle, CalendarCheck, ArrowLeft, Briefcase,
  Users, Star, X, Info, Zap, ShieldCheck, RefreshCcw,
  Clock, TrendingDown, MessageSquare, Settings, TrendingUp,
  PenLine, Palette, FileText, Building2, Sparkles,
} from 'lucide-vue-next'

const calLink = import.meta.env.VITE_CAL_BOOKING_LINK
const route   = useRoute()

// Show success state if redirected from Stripe
const showSuccess = computed(() => route.query.success === 'true')

// ── Pricing constants ──
const INDIVIDUAL = { setup: 450, monthly: 150 }

const DEPARTMENTS = [
  {
    id: 'motor',
    name: 'Motor de Adquisición',
    members: ['sofia', 'luna'],
    setup: 750,
    monthly: 200,
    color: '#34d399',
    icon: TrendingUp,
  },
  {
    id: 'estudio',
    name: 'Estudio de Contenido',
    members: ['valeria', 'elena'],
    setup: 750,
    monthly: 200,
    color: '#f59e0b',
    icon: Sparkles,
  },
  {
    id: 'nucleo',
    name: 'Núcleo Operativo',
    members: ['sofia', 'marcos', 'maya'],
    setup: 750,
    monthly: 200,
    color: '#7c6fff',
    icon: Building2,
  },
]

const FULL_TEAM_PRICE = { setup: 1950, monthly: 500 }
const ALL_IDS = ['sofia', 'marcos', 'luna', 'valeria', 'elena', 'maya']

const fullTeamSaving = computed(() =>
  ALL_IDS.length * INDIVIDUAL.monthly - FULL_TEAM_PRICE.monthly
)

// ── Employee data ──
const employees = [
  {
    id: 'sofia',
    name: 'Sofía',
    role: 'Asistente Ejecutiva',
    dept: 'Núcleo Operativo',
    icon: MessageSquare,
    color: '#7c6fff',
    bg: 'rgba(124,111,255,0.12)',
  },
  {
    id: 'marcos',
    name: 'Marcos',
    role: 'Gestor de Cobros',
    dept: 'Núcleo Operativo',
    icon: Settings,
    color: '#818cf8',
    bg: 'rgba(129,140,248,0.12)',
  },
  {
    id: 'luna',
    name: 'Luna',
    role: 'Especialista en Captación',
    dept: 'Motor de Adquisición',
    icon: TrendingUp,
    color: '#34d399',
    bg: 'rgba(52,211,153,0.12)',
  },
  {
    id: 'valeria',
    name: 'Valeria',
    role: 'Estratega de Contenido',
    dept: 'Estudio de Contenido',
    icon: PenLine,
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.12)',
  },
  {
    id: 'elena',
    name: 'Elena',
    role: 'Diseñadora Visual',
    dept: 'Estudio de Contenido',
    icon: Palette,
    color: '#ec4899',
    bg: 'rgba(236,72,153,0.12)',
  },
  {
    id: 'maya',
    name: 'Maya',
    role: 'Analista de Reuniones',
    dept: 'Núcleo Operativo',
    icon: FileText,
    color: '#06b6d4',
    bg: 'rgba(6,182,212,0.12)',
  },
]

// ── Selection state ──
const selectedIds = ref([])
const installments = ref(1)

function empById(id) {
  return employees.find(e => e.id === id)
}

function isSelected(id) {
  return selectedIds.value.includes(id)
}

function isDeptHighlighted(id) {
  // Highlight employees of a dept when that dept is partially selected
  if (selectedIds.value.length === 0) return false
  const dept = DEPARTMENTS.find(d => d.members.includes(id))
  if (!dept) return false
  return dept.members.some(m => selectedIds.value.includes(m)) && !dept.members.every(m => selectedIds.value.includes(m))
}

function toggleEmployee(id) {
  if (isSelected(id)) {
    selectedIds.value = selectedIds.value.filter(s => s !== id)
  } else {
    selectedIds.value = [...selectedIds.value, id]
  }
}

function toggleFullTeam() {
  if (selectedIds.value.length === 6) {
    selectedIds.value = []
  } else {
    selectedIds.value = [...ALL_IDS]
  }
}

// ── Smart pricing calculation ──
const pricing = computed(() => {
  const ids = selectedIds.value
  if (ids.length === 0) return { setup: 0, monthly: 0, type: 'empty' }

  // Full team
  if (ids.length === 6 && ALL_IDS.every(id => ids.includes(id))) {
    return {
      setup: FULL_TEAM_PRICE.setup,
      monthly: FULL_TEAM_PRICE.monthly,
      type: 'team',
      name: 'Equipo Completo',
      saving: {
        setup: ids.length * INDIVIDUAL.setup - FULL_TEAM_PRICE.setup,
        monthly: ids.length * INDIVIDUAL.monthly - FULL_TEAM_PRICE.monthly,
      },
    }
  }

  // Exact department match
  const matchDept = DEPARTMENTS.find(d =>
    d.members.length === ids.length &&
    d.members.every(m => ids.includes(m))
  )
  if (matchDept) {
    return {
      setup: matchDept.setup,
      monthly: matchDept.monthly,
      type: 'department',
      name: matchDept.name,
      color: matchDept.color,
      icon: matchDept.icon,
      saving: {
        setup: ids.length * INDIVIDUAL.setup - matchDept.setup,
        monthly: ids.length * INDIVIDUAL.monthly - matchDept.monthly,
      },
    }
  }

  // Mixed: find departments within selection, rest individual
  let remaining = [...ids]
  let totalSetup = 0
  let totalMonthly = 0
  const groups = []

  for (const dept of DEPARTMENTS) {
    if (dept.members.every(m => remaining.includes(m))) {
      totalSetup += dept.setup
      totalMonthly += dept.monthly
      groups.push({ ...dept, type: 'department' })
      remaining = remaining.filter(m => !dept.members.includes(m))
    }
  }

  for (const id of remaining) {
    totalSetup += INDIVIDUAL.setup
    totalMonthly += INDIVIDUAL.monthly
    groups.push({ id, type: 'individual' })
  }

  const baseCost = ids.length * INDIVIDUAL.monthly
  const saving = baseCost - totalMonthly

  return {
    setup: totalSetup,
    monthly: totalMonthly,
    type: groups.length > 1 || groups[0]?.type === 'individual' ? 'individual' : 'mixed',
    saving: saving > 0 ? { setup: ids.length * INDIVIDUAL.setup - totalSetup, monthly: saving } : null,
  }
})

// Smart notice shown above selector
const pricingNote = computed(() => {
  const ids = selectedIds.value
  if (ids.length === 0) return null

  // Check if completing a dept would save money
  for (const dept of DEPARTMENTS) {
    const selectedInDept = dept.members.filter(m => ids.includes(m))
    const missingInDept = dept.members.filter(m => !ids.includes(m))
    if (selectedInDept.length > 0 && missingInDept.length > 0 && missingInDept.length <= 1) {
      const missingNames = missingInDept.map(m => empById(m)?.name).join(' y ')
      const saving = dept.members.length * INDIVIDUAL.monthly - dept.monthly
      return {
        type: 'tip',
        icon: Zap,
        title: `Añade a ${missingNames} y activa el precio de departamento`,
        desc: `${dept.name} cuesta ${dept.monthly}€/mes — ahorras ${saving}€/mes vs. precios individuales`,
      }
    }
  }

  if (pricing.value.type === 'department') {
    return {
      type: 'success',
      icon: CheckCircle,
      title: `Precio de departamento aplicado: ${pricing.value.name}`,
      desc: `Ahorras ${pricing.value.saving?.monthly}€/mes vs. contratar individualmente`,
    }
  }

  if (pricing.value.type === 'team') {
    return {
      type: 'success',
      icon: Star,
      title: 'Precio de Equipo Completo aplicado',
      desc: `Ahorras ${pricing.value.saving?.monthly}€/mes — el mejor precio posible`,
    }
  }

  return null
})

const pricingLabel = computed(() => {
  if (pricing.value.type === 'team') return 'Equipo Completo'
  if (pricing.value.type === 'department') return pricing.value.name
  return 'Empleados individuales'
})

const pricingBadgeStyle = computed(() => {
  if (pricing.value.type === 'team') return { background: 'rgba(52,211,153,0.1)', borderColor: 'rgba(52,211,153,0.3)', color: '#34d399' }
  if (pricing.value.type === 'department') return { background: `rgba(124,111,255,0.1)`, borderColor: 'rgba(124,111,255,0.3)', color: '#7c6fff' }
  return { background: 'rgba(139,138,168,0.1)', borderColor: 'rgba(139,138,168,0.2)', color: '#8b8aa8' }
})

const pricingBadgeIcon = computed(() => {
  if (pricing.value.type === 'team') return Star
  if (pricing.value.type === 'department') return pricing.value.icon ?? Building2
  return Users
})

const totalToday = computed(() =>
  installments.value === 1
    ? pricing.value.setup
    : Math.ceil(pricing.value.setup / 3)
)
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

// ── Success state ────────────────────────
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

  &__email {
    font-size: $text-sm;
    color: $text-subtle;
    position: relative;
  }
}

// ── Header ─────────────────────────────
.bolsa {
  min-height: calc(100dvh - 64px);

  &__header {
    padding: $space-8 0 0;
    background: $bg;
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
    padding-bottom: $space-10;
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

  // ── Content ──────────────────────────
  &__content {
    padding: $space-8 0 $space-16;
    background: $bg;
  }

  &__layout {
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: $space-8;
    align-items: start;

    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
    }
  }

  &__selector {
    display: flex;
    flex-direction: column;
    gap: $space-4;
  }

  // ── Smart pricing notice ──
  &__notice {
    display: flex;
    align-items: flex-start;
    gap: $space-3;
    padding: $space-4;
    border-radius: $radius;
    border: 1px solid;
    font-size: $text-sm;
    line-height: 1.5;

    strong { font-weight: $fw-semibold; display: block; margin-bottom: 2px; }
    p { color: $text-muted; font-size: $text-xs; margin: 0; }

    svg { flex-shrink: 0; margin-top: 2px; }

    &--tip {
      background: rgba(124,111,255,0.06);
      border-color: rgba(124,111,255,0.2);
      color: $primary-light;
      svg { color: $primary-light; }
    }

    &--success {
      background: rgba(52,211,153,0.06);
      border-color: rgba(52,211,153,0.2);
      color: $accent;
      svg { color: $accent; }
    }
  }

  // ── Full team upsell ──
  &__upsell {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $space-4;
    padding: $space-4 $space-5;
    background: $bg-card;
    border: 1px dashed rgba(52,211,153,0.3);
    border-radius: $radius-lg;
    cursor: pointer;
    transition: $transition-fast;
    text-align: left;
    width: 100%;

    &:hover {
      border-color: rgba(52,211,153,0.5);
      background: rgba(52,211,153,0.04);
    }

    &--active {
      border-style: solid;
      border-color: rgba(52,211,153,0.5);
      background: rgba(52,211,153,0.06);
    }

    &-left {
      display: flex;
      align-items: center;
      gap: $space-3;

      strong { display: block; font-size: $text-sm; font-weight: $fw-semibold; color: $text; }
      p { font-size: $text-xs; color: $text-muted; margin: 0; margin-top: 2px; }
    }

    &-star { color: $accent; flex-shrink: 0; }

    &-price {
      flex-shrink: 0;
      font-size: $text-xl;
      font-weight: $fw-bold;
      color: $text;
      font-variant-numeric: tabular-nums;
    }

    &-period {
      font-size: $text-sm;
      color: $text-muted;
      font-weight: $fw-regular;
    }
  }

  // ── FAQ teaser ──
  &__faq-teaser {
    padding: $space-6 0 $space-8;
    text-align: center;
    font-size: $text-sm;
    color: $text-muted;
  }

  &__faq-link {
    color: $primary-light;
    text-decoration: none;
    font-weight: $fw-medium;
    &:hover { text-decoration: underline; }
  }

  &__wa-link {
    color: #25d366;
    text-decoration: none;
    font-weight: $fw-medium;
    &:hover { text-decoration: underline; }
  }
}

// ── Selector grid ───────────────────────
.selector-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: $space-3;
}

.sel-card {
  display: flex;
  align-items: center;
  gap: $space-3;
  padding: $space-4;
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius-lg;
  cursor: pointer;
  transition: $transition-fast;
  text-align: left;
  width: 100%;

  &:hover {
    border-color: $border-hover;
  }

  &--selected {
    border-color: $primary;
    background: rgba(124,111,255,0.06);
    box-shadow: 0 0 0 1px rgba(124,111,255,0.2);
  }

  &--dept {
    border-color: rgba(52,211,153,0.3);
  }

  &__check {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__check-icon--on {
    color: $primary-light;
  }

  &__check-ring {
    width: 18px;
    height: 18px;
    border-radius: $radius-full;
    border: 2px solid $border-hover;
    transition: $transition-fast;

    .sel-card:hover & {
      border-color: $primary;
    }
  }

  &__icon {
    width: 40px;
    height: 40px;
    border-radius: $radius;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__info {
    flex: 1;
    min-width: 0;
  }

  &__name {
    font-size: $text-base;
    font-weight: $fw-semibold;
    color: $text;
  }

  &__role {
    font-size: $text-xs;
    color: $text-muted;
    margin-top: 1px;
  }

  &__dept {
    font-size: $text-xs;
    font-weight: $fw-medium;
    margin-top: 2px;
    opacity: 0.8;
  }

  &__price {
    flex-shrink: 0;
    text-align: right;
  }

  &__price-amount {
    font-size: $text-base;
    font-weight: $fw-bold;
    color: $text;
    font-variant-numeric: tabular-nums;
  }

  &__price-period {
    font-size: $text-xs;
    color: $text-muted;
  }
}

// ── Order box ───────────────────────────
.bolsa__order {
  display: flex;
  flex-direction: column;
  gap: $space-4;

  @media (min-width: 1025px) {
    position: sticky;
    top: calc(64px + $space-6);
  }
}

.order-box {
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius-lg;
  padding: $space-5;
  display: flex;
  flex-direction: column;
  gap: $space-4;

  &__title {
    font-size: $text-lg;
    font-weight: $fw-bold;
    color: $text;
    letter-spacing: -0.01em;
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $space-3;
    padding: $space-8 $space-4;
    text-align: center;
    font-size: $text-sm;
    color: $text-subtle;

    &-icon { color: $border-hover; }
  }

  &__employees {
    display: flex;
    flex-direction: column;
    gap: $space-2;
  }

  &__type-badge {
    display: inline-flex;
    align-items: center;
    gap: $space-1;
    padding: $space-1 $space-3;
    border: 1px solid;
    border-radius: $radius-full;
    font-size: $text-xs;
    font-weight: $fw-semibold;
    width: fit-content;
    letter-spacing: 0.02em;
  }

  &__saving {
    display: flex;
    align-items: center;
    gap: $space-2;
    font-size: $text-xs;
    font-weight: $fw-semibold;
    color: $accent;
    background: rgba(52,211,153,0.06);
    border: 1px solid rgba(52,211,153,0.2);
    border-radius: $radius;
    padding: $space-2 $space-3;
  }

  &__section {
    border-top: 1px solid $border;
    padding-top: $space-4;
    display: flex;
    flex-direction: column;
    gap: $space-3;

    &-title {
      font-size: $text-xs;
      font-weight: $fw-semibold;
      color: $text-muted;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: $space-2;
    }

    &-note {
      font-size: $text-xs;
      font-weight: $fw-regular;
      color: $text-subtle;
      text-transform: none;
      letter-spacing: 0;
    }
  }

  &__line {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: $text-sm;
    color: $text-muted;

    strong {
      color: $text;
      font-weight: $fw-semibold;
    }
  }

  &__total {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $space-4;
    background: $bg-surface;
    border: 1px solid $border-hover;
    border-radius: $radius;

    &-label {
      font-size: $text-sm;
      font-weight: $fw-semibold;
      color: $text;
    }

    &-amount {
      font-size: $text-2xl;
      font-weight: $fw-bold;
      color: $text;
      font-variant-numeric: tabular-nums;
    }
  }

  &__fine {
    display: flex;
    align-items: flex-start;
    gap: $space-2;
    font-size: $text-xs;
    color: $text-subtle;
    line-height: 1.6;

    svg { flex-shrink: 0; margin-top: 2px; color: $text-subtle; }
  }

  &__cta {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $space-2;
    height: 48px;
    background: $primary;
    border: none;
    border-radius: $radius;
    color: #fff;
    font-size: $text-base;
    font-weight: $fw-semibold;
    text-decoration: none;
    cursor: pointer;
    transition: $transition;
    box-shadow: 0 0 20px $primary-glow;

    &:hover {
      background: $primary-dark;
      transform: translateY(-1px);
      color: #fff;
    }
  }

  &__cta-note {
    font-size: $text-xs;
    color: $text-subtle;
    text-align: center;
    line-height: 1.5;
  }
}

// ── Order employee row ──
.order-emp {
  display: flex;
  align-items: center;
  gap: $space-3;

  &__icon {
    width: 32px;
    height: 32px;
    border-radius: $radius;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__info {
    flex: 1;
    min-width: 0;
  }

  &__name {
    display: block;
    font-size: $text-sm;
    font-weight: $fw-semibold;
    color: $text;
  }

  &__role {
    display: block;
    font-size: $text-xs;
    color: $text-muted;
  }

  &__remove {
    background: transparent;
    border: 1px solid $border;
    border-radius: $radius;
    color: $text-subtle;
    cursor: pointer;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: $transition-fast;
    flex-shrink: 0;

    &:hover {
      border-color: $danger;
      color: $danger;
    }
  }
}

// ── Installment toggle ──
.installment-toggle {
  display: flex;
  flex-direction: column;
  gap: $space-2;
}

.installment-opt {
  display: flex;
  align-items: center;
  gap: $space-3;
  padding: $space-3;
  background: $bg-surface;
  border: 1px solid $border;
  border-radius: $radius;
  cursor: pointer;
  text-align: left;
  width: 100%;
  transition: $transition-fast;
  position: relative;

  &:hover { border-color: $border-hover; }

  &--active {
    border-color: $primary;
    background: rgba(124,111,255,0.06);
  }

  &__radio {
    width: 16px;
    height: 16px;
    border-radius: $radius-full;
    border: 2px solid $border-hover;
    flex-shrink: 0;
    transition: $transition-fast;
    position: relative;

    .installment-opt--active & {
      border-color: $primary;
      background: $primary;

      &::after {
        content: '';
        position: absolute;
        inset: 2px;
        border-radius: $radius-full;
        background: #fff;
      }
    }
  }

  strong {
    display: block;
    font-size: $text-sm;
    font-weight: $fw-semibold;
    color: $text;
  }

  p {
    font-size: $text-xs;
    color: $text-muted;
    margin: 0;
  }

  &__tag {
    position: absolute;
    top: $space-2;
    right: $space-2;
    font-size: 10px;
    font-weight: $fw-bold;
    padding: 1px $space-2;
    background: rgba(52,211,153,0.12);
    border: 1px solid rgba(52,211,153,0.25);
    border-radius: $radius-full;
    color: $accent;
    letter-spacing: 0.03em;
  }
}

// ── Order trust signals ──
.order-trust {
  display: flex;
  flex-direction: column;
  gap: $space-2;

  &__item {
    display: flex;
    align-items: center;
    gap: $space-2;
    font-size: $text-xs;
    color: $text-subtle;

    svg { color: $text-subtle; flex-shrink: 0; }
  }
}

// ── Transitions ──
.fade-up-enter-active,
.fade-up-leave-active { transition: all 0.25s ease; }
.fade-up-enter-from,
.fade-up-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
