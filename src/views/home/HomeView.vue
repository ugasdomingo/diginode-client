<template>
  <div class="home">

    <!-- ── HERO ─────────────────────────────────────── -->
    <section class="hero">
      <div class="hero__bg" aria-hidden="true" />
      <div class="container">
        <div class="hero__badge">
          <Sparkles :size="13" />
          Empleados IA para psicólogos y coaches
        </div>
        <h1 class="hero__title">
          Tu equipo trabaja.<br />
          <span class="hero__title-accent">Tú diriges.</span>
        </h1>
        <p class="hero__subtitle">
          Empleados de inteligencia artificial especializados en psicología y coaching.
          Atienden a tus pacientes, organizan tu agenda y construyen tu presencia —
          para que tú estés donde importas: en sesión.
        </p>
        <div class="hero__actions">
          <a
            :href="calLink"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-primary"
          >
            <CalendarCheck :size="18" />
            Agendar demo gratuita
          </a>
          <RouterLink to="/bolsa-de-empleo" class="btn-secondary">
            Contratar empleados <ArrowDown :size="16" />
          </RouterLink>
        </div>
        <div class="hero__trust">
          <div class="hero__trust-item">
            <CheckCircle :size="15" />
            Sin permanencia
          </div>
          <div class="hero__trust-item">
            <CheckCircle :size="15" />
            Incorporación en 7 días
          </div>
          <div class="hero__trust-item">
            <CheckCircle :size="15" />
            Pago seguro con Stripe
          </div>
        </div>
      </div>
    </section>

    <!-- ── EMPLOYEE LIFECYCLE ──────────────────────────── -->
    <section class="ep">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Así trabaja tu empleado IA</h2>
          <p class="section-subtitle">Tres pasos. Tu consulta organizada, siempre.</p>
        </div>

        <div class="ep__phases">
          <div v-for="(phase, i) in employeeProcess" :key="i" class="ep__phase">
            <div class="ep__icon-wrap" :style="{ background: phase.bg, borderColor: phase.borderColor }">
              <component :is="phase.icon" :size="26" :style="{ color: phase.color }" />
            </div>
            <div class="ep__phase-num">0{{ i + 1 }}</div>
            <h3 class="ep__phase-title">{{ phase.title }}</h3>
            <p class="ep__phase-desc">{{ phase.desc }}</p>
            <div class="ep__stat" :style="{ color: phase.color, borderColor: phase.borderColor }">
              {{ phase.stat }}
            </div>
          </div>
        </div>

        <div class="ep__footer">
          <div class="ep__footer-item">
            <span class="ep__footer-num">0</span>
            <span>días de baja</span>
          </div>
          <div class="ep__footer-sep" aria-hidden="true" />
          <div class="ep__footer-item">
            <span class="ep__footer-num">0€</span>
            <span>seguros sociales</span>
          </div>
          <div class="ep__footer-sep" aria-hidden="true" />
          <div class="ep__footer-item">
            <span class="ep__footer-num">24/7</span>
            <span>siempre disponible</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ── EMPLOYEES / PACKAGES TOGGLE ───────────────── -->
    <section id="empleados" class="catalog">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Elige cómo incorporarlos</h2>
          <p class="section-subtitle">Individualmente o en equipo, siempre a tu ritmo</p>
          <RouterLink to="/bolsa-de-empleo" class="btn-secondary catalog__hire-btn">
            <Users :size="15" />
            Ir a la Bolsa de Empleo
          </RouterLink>
        </div>

        <!-- Toggle -->
        <div class="catalog__toggle" role="tablist">
          <button
            role="tab"
            :aria-selected="view === 'employees'"
            class="catalog__tab"
            :class="{ 'catalog__tab--active': view === 'employees' }"
            @click="view = 'employees'"
          >
            <Users :size="16" />
            Empleados individuales
          </button>
          <button
            id="paquetes"
            role="tab"
            :aria-selected="view === 'packages'"
            class="catalog__tab"
            :class="{ 'catalog__tab--active': view === 'packages' }"
            @click="view = 'packages'"
          >
            <LayoutGrid :size="16" />
            Departamentos / Paquetes
          </button>
          <button
            role="tab"
            :aria-selected="view === 'despacho'"
            class="catalog__tab catalog__tab--promo"
            :class="{ 'catalog__tab--active': view === 'despacho' }"
            @click="view = 'despacho'"
          >
            <Sparkles :size="16" />
            Oferta Despacho Digital
          </button>
        </div>

        <!-- Employee cards -->
        <Transition name="fade-slide" mode="out-in">
          <div v-if="view === 'employees'" key="employees" class="cards-grid">
            <div
              v-for="emp in employees"
              :key="emp.id"
              class="emp-card"
            >
              <div class="emp-card__top">
                <div class="emp-card__icon" :style="{ background: emp.bg }">
                  <component :is="emp.icon" :size="22" :style="{ color: emp.color }" />
                </div>
                <div class="emp-card__role-badge" :style="{ color: emp.color, borderColor: emp.color + '40' }">
                  {{ emp.dept }}
                </div>
              </div>

              <div class="emp-card__body">
                <div>
                  <h3 class="emp-card__name">{{ emp.name }}</h3>
                  <p class="emp-card__role">{{ emp.role }}</p>
                </div>
                <p class="emp-card__pitch">{{ emp.pitch }}</p>

                <ul class="emp-card__benefits">
                  <li v-for="(b, bi) in emp.benefits" :key="bi" class="emp-card__benefit">
                    <CheckCircle :size="11" class="emp-card__benefit-icon" />
                    {{ b }}
                  </li>
                </ul>
              </div>

              <div class="emp-card__footer">
                <div class="emp-card__price">
                  <div class="emp-card__price-monthly">
                    <span class="emp-card__price-amount">{{ emp.monthly }}€</span>
                    <span class="emp-card__price-period">/mes</span>
                  </div>
                  <div class="emp-card__price-setup">Incorporación: {{ emp.setup }}€ · pago único</div>
                </div>
                <a
                  :href="calLink"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="emp-card__cta"
                >
                  <CalendarCheck :size="15" />
                  Agendar demo
                </a>
              </div>
            </div>
          </div>

          <!-- Package cards -->
          <div v-else-if="view === 'packages'" key="packages" class="cards-grid cards-grid--packages">
            <div
              v-for="pkg in packages"
              :key="pkg.id"
              class="pkg-card"
              :class="{ 'pkg-card--featured': pkg.featured }"
            >
              <div v-if="pkg.featured" class="pkg-card__ribbon">
                <Star :size="12" />
                Más popular
              </div>

              <div class="pkg-card__header">
                <div class="pkg-card__icon" :style="{ background: pkg.bg }">
                  <component :is="pkg.icon" :size="24" :style="{ color: pkg.color }" />
                </div>
                <div>
                  <h3 class="pkg-card__name">{{ pkg.name }}</h3>
                  <p class="pkg-card__includes">Incluye: {{ pkg.agents.join(' · ') }}</p>
                </div>
              </div>

              <p class="pkg-card__pitch">{{ pkg.pitch }}</p>

              <ul class="pkg-card__benefits">
                <li v-for="(b, bi) in pkg.benefits" :key="bi" class="pkg-card__benefit">
                  <CheckCircle :size="11" class="pkg-card__benefit-icon" />
                  {{ b }}
                </li>
              </ul>

              <div class="pkg-card__footer">
                <div class="pkg-card__price">
                  <div class="pkg-card__price-row">
                    <span class="pkg-card__price-amount">{{ pkg.monthly }}€</span>
                    <span class="pkg-card__price-period">/mes</span>
                    <span v-if="pkg.saving" class="pkg-card__saving">Ahorras {{ pkg.saving }}€/mes</span>
                  </div>
                  <p class="pkg-card__setup">Incorporación: {{ pkg.setup }}€ · pago único</p>
                </div>
                <a
                  :href="calLink"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="pkg-card__cta"
                  :class="{ 'pkg-card__cta--featured': pkg.featured }"
                >
                  <CalendarCheck :size="15" />
                  Agendar demo
                </a>
              </div>
            </div>
          </div>

          <!-- Despacho Digital promo panel -->
          <div v-else key="despacho" class="despacho-panel">
            <div class="despacho-panel__glow" aria-hidden="true" />

            <div class="despacho-panel__left">
              <span class="despacho-panel__badge">
                <Sparkles :size="12" />
                Oferta especial · Potencia tu práctica
              </span>
              <h3 class="despacho-panel__title">Despacho Digital</h3>
              <p class="despacho-panel__sub">
                Web profesional + panel privado para pacientes + 2 empleados IA activos 24/7.
                Todo configurado en 7 días. Sin instalar nada.
              </p>

              <div class="despacho-panel__saving">
                <TrendingDown :size="14" />
                Ahorras <strong>+1.100€</strong> vs. contratar los servicios por separado
              </div>

              <ul class="despacho-panel__features">
                <li v-for="f in despachoFeatures" :key="f">
                  <CheckCircle :size="13" />
                  {{ f }}
                </li>
              </ul>
            </div>

            <div class="despacho-panel__right">
              <div class="despacho-panel__price-box">
                <div class="despacho-panel__price">
                  <span class="despacho-panel__price-num">300€</span>
                  <span class="despacho-panel__price-period">/mes</span>
                </div>
                <p class="despacho-panel__price-note">6 meses · luego 200€/mes</p>

                <RouterLink to="/despacho-digital" class="despacho-panel__cta">
                  <Zap :size="16" />
                  Ver la oferta completa
                </RouterLink>
                <a
                  :href="calLink"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="despacho-panel__demo"
                >
                  Agendar demo gratuita →
                </a>
              </div>
            </div>
          </div>
        </Transition>

        <!-- Pricing footnote -->
        <p class="catalog__footnote">
          <Info :size="14" />
          La incorporación es un pago único para la configuración inicial de tu empleado. La mensualidad es la suscripción recurrente. Sin permanencia mínima.
        </p>
      </div>
    </section>

    <!-- ── DESPACHO DIGITAL PROMO ────────────────── -->
    <section class="home-despacho">
      <div class="container">
        <div class="home-despacho__inner">
          <div class="home-despacho__glow" aria-hidden="true" />

          <div class="home-despacho__text">
            <span class="home-despacho__badge">
              <Sparkles :size="12" />
              Oferta especial · Potencia tu práctica
            </span>
            <h2 class="home-despacho__title">Despacho Digital</h2>
            <p class="home-despacho__sub">
              Web + panel de gestión + 2 empleados IA. Llave en mano para psicólogos y coaches.
              Todo funcionando en 7 días.
            </p>
            <div class="home-despacho__saving">
              <TrendingDown :size="14" />
              Ahorras <strong>+1.100€</strong> vs. contratar por separado
            </div>
          </div>

          <div class="home-despacho__action">
            <div class="home-despacho__price">
              <span class="home-despacho__price-num">300€</span>
              <span class="home-despacho__price-period">/mes · 6 meses</span>
            </div>
            <RouterLink to="/despacho-digital" class="home-despacho__cta">
              <Zap :size="16" />
              Ver la oferta
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- ── COURSES ───────────────────────────────── -->
    <section v-if="courses.length" id="cursos" class="courses-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Aprende a trabajar con IA</h2>
          <p class="section-subtitle">Menos tareas, más pacientes.</p>
        </div>
        <div class="course-grid">
          <div
            v-for="course in courses"
            :key="course._id"
            class="course-card"
            :class="{ 'course-card--inactive': course.status !== 'active' }"
          >
            <div class="course-card__thumb">
              <img v-if="course.thumbnail_url" :src="course.thumbnail_url" :alt="course.title" />
              <div v-else class="course-card__thumb-empty">
                <GraduationCap :size="40" />
              </div>
              <div v-if="course.status === 'active'" class="course-card__badge course-card__badge--active">Disponible</div>
              <div v-else class="course-card__badge">Próximamente</div>
            </div>
            <div class="course-card__body">
              <h3 class="course-card__title">{{ course.title }}</h3>
              <p v-if="course.description" class="course-card__desc">{{ course.description }}</p>
              <div class="course-card__meta">
                <span class="course-card__date">{{ formatCourseDate(course.start_date) }}</span>
                <span class="course-card__price">{{ course.price }}€</span>
              </div>
            </div>
            <div class="course-card__footer">
              <RouterLink
                v-if="course.status === 'active'"
                :to="`/cursos/${course.slug}`"
                class="course-card__cta course-card__cta--primary"
              >
                <BookOpen :size="15" />
                Ver curso
              </RouterLink>
              <button
                v-else
                class="course-card__cta course-card__cta--waitlist"
                @click="openWaitlist(course)"
              >
                Apuntarme a la lista de espera
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── WAITLIST MODAL ─────────────────────── -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="waitlistModal" class="modal-overlay" @click.self="closeWaitlist">
          <div class="modal">
            <button class="modal__close" @click="closeWaitlist" aria-label="Cerrar">
              <X :size="20" />
            </button>

            <template v-if="waitlistStatus !== 'success'">
              <GraduationCap :size="28" class="modal__icon" />
              <h2 class="modal__title">Lista de espera</h2>
              <p class="modal__subtitle">
                Te avisamos cuando <strong>{{ waitlistModal.title }}</strong> esté disponible.
              </p>
              <form class="modal__form" @submit.prevent="submitWaitlist">
                <label class="modal__label">
                  Nombre
                  <input v-model="waitlistForm.name" class="modal__input" type="text" placeholder="Tu nombre" required />
                </label>
                <label class="modal__label">
                  Email
                  <input v-model="waitlistForm.email" class="modal__input" type="email" placeholder="tu@email.com" required />
                </label>
                <label class="modal__label">
                  Teléfono
                  <input v-model="waitlistForm.phone" class="modal__input" type="tel" placeholder="+34 600 000 000" required />
                </label>
                <p v-if="waitlistError" class="modal__error">{{ waitlistError }}</p>
                <button class="modal__submit btn-primary" type="submit" :disabled="waitlistStatus === 'loading'">
                  {{ waitlistStatus === 'loading' ? 'Enviando…' : 'Apuntarme' }}
                </button>
              </form>
            </template>

            <template v-else>
              <CheckCircle :size="40" class="modal__success-icon" />
              <h2 class="modal__title">¡Apuntado!</h2>
              <p class="modal__subtitle">Te avisaremos en cuanto el curso esté disponible.</p>
              <button class="modal__submit btn-primary" @click="closeWaitlist">Cerrar</button>
            </template>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ── BLOG ──────────────────────────────────── -->
    <section v-if="blogPosts.length" id="blog" class="blog-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Últimas del Blog</h2>
          <p class="section-subtitle">Ideas y recursos sobre automatización con IA</p>
        </div>
        <div class="blog-grid">
          <RouterLink
            v-for="post in blogPosts"
            :key="post._id"
            :to="`/blog/${post.slug}`"
            class="blog-card"
          >
            <div class="blog-card__thumb">
              <img v-if="post.thumbnail_url" :src="post.thumbnail_url" :alt="post.title" />
              <div v-else class="blog-card__thumb-empty" />
            </div>
            <div class="blog-card__body">
              <span class="blog-card__date">{{ formatBlogDate(post.published_at) }}</span>
              <h3 class="blog-card__title">{{ post.title }}</h3>
              <p v-if="post.excerpt" class="blog-card__excerpt">{{ post.excerpt }}</p>
              <span class="blog-card__cta">Leer →</span>
            </div>
          </RouterLink>
        </div>
        <div class="blog-more">
          <RouterLink to="/blog" class="btn-secondary">Ver todos los artículos →</RouterLink>
        </div>
      </div>
    </section>

    <!-- ── FAQ ───────────────────────────────────── -->
    <section id="faq" class="faq">
      <div class="container faq__inner">
        <div class="section-header">
          <h2 class="section-title">Preguntas frecuentes</h2>
          <p class="section-subtitle">Todo lo que necesitas saber antes de empezar</p>
        </div>

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

    <!-- ── FINAL CTA ──────────────────────────────── -->
    <section class="final-cta">
      <div class="container">
        <div class="final-cta__box">
          <div class="final-cta__glow" aria-hidden="true" />
          <Zap :size="36" class="final-cta__icon" />
          <h2 class="final-cta__title">¿Listo para incorporar tu primer empleado IA?</h2>
          <p class="final-cta__subtitle">La demo dura 30 minutos y es completamente gratuita. Sin compromiso.</p>
          <a
            :href="calLink"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-primary btn-primary--lg"
          >
            <CalendarCheck :size="20" />
            Agendar demo gratuita
          </a>
          <p class="final-cta__whatsapp">
            ¿Prefieres escribirnos?
            <a
              href="https://wa.me/34604822385?text=Hola%2C%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20vuestros%20empleados%20IA"
              target="_blank"
              rel="noopener noreferrer"
            >
              Escríbenos por WhatsApp
            </a>
          </p>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  Sparkles, CalendarCheck, ArrowDown, CheckCircle,
  AlertTriangle, Users, LayoutGrid, Star, ChevronDown,
  Info, Zap, MessageSquare, Wrench, BookOpen,
  TrendingUp, TrendingDown, Building2, Share2, BarChart2, Video,
  CreditCard, RefreshCcw, ShieldCheck, GraduationCap, X,
} from 'lucide-vue-next'

const calLink   = import.meta.env.VITE_CAL_BOOKING_LINK
const view      = ref('employees')
const openFaq   = ref(null)
const blogPosts = ref([])
const courses   = ref([])

// Waitlist modal state
const waitlistModal  = ref(null)   // course object or null
const waitlistForm   = ref({ name: '', email: '', phone: '' })
const waitlistStatus = ref('')     // '' | 'loading' | 'success' | 'error'
const waitlistError  = ref('')

function openWaitlist(course) {
  waitlistModal.value  = course
  waitlistForm.value   = { name: '', email: '', phone: '' }
  waitlistStatus.value = ''
  waitlistError.value  = ''
}

function closeWaitlist() {
  waitlistModal.value = null
}

async function submitWaitlist() {
  waitlistStatus.value = 'loading'
  waitlistError.value  = ''
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/courses/${waitlistModal.value.slug}/waitlist`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(waitlistForm.value),
      }
    ).then(r => r.json())

    if (!res.success) throw new Error(res.message)
    waitlistStatus.value = 'success'
  } catch (err) {
    waitlistStatus.value = 'error'
    waitlistError.value  = err.message || 'Error al apuntarse. Inténtalo de nuevo.'
  }
}

function formatCourseDate(d) {
  if (!d) return 'Fecha por confirmar'
  return new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
}

function formatBlogDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

onMounted(async () => {
  try {
    const API = import.meta.env.VITE_API_URL
    const [coursesRes, blogRes] = await Promise.all([
      fetch(`${API}/courses`).then(r => r.json()),
      fetch(`${API}/blog?limit=3`).then(r => r.json()),
    ])
    courses.value   = coursesRes.data ?? []
    blogPosts.value = blogRes.data ?? []
  } catch {
    // fail silently — sections won't render if empty
  }
})

// ── Employee lifecycle ──
const employeeProcess = [
  {
    icon: CreditCard,
    color: '#7c6fff',
    bg: 'rgba(124,111,255,0.12)',
    borderColor: 'rgba(124,111,255,0.3)',
    title: 'Lo incorporas',
    desc: 'Elige tu empleado en la Bolsa de Empleo y completa la incorporación. En minutos tienes todo preparado para empezar.',
    stat: 'Sin permanencia mínima',
  },
  {
    icon: Wrench,
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.12)',
    borderColor: 'rgba(245,158,11,0.3)',
    title: 'Lo entrenamos juntos',
    desc: 'Celebramos una sesión de bienvenida donde defines la personalidad, el tono y el conocimiento de tu empleado. En siete días está activo.',
    stat: 'Listo en 7 días',
  },
  {
    icon: Zap,
    color: '#34d399',
    bg: 'rgba(52,211,153,0.12)',
    borderColor: 'rgba(52,211,153,0.3)',
    title: 'Trabaja por ti, siempre',
    desc: 'Tu empleado trabaja de forma constante los 365 días del año. Tú recuperas el tiempo que dedicabas a tareas administrativas.',
    stat: '24/7 · 365 días',
  },
]

// ── Employees ──
const employees = [
  {
    id: 'sofia',
    name: 'Sofía',
    role: 'Asistente Ejecutiva',
    dept: 'Núcleo Operativo',
    icon: MessageSquare,
    color: '#7c6fff',
    bg: 'rgba(124,111,255,0.12)',
    pitch: 'Sofía es quien cuida de que tu día empiece organizado. Tu agenda llega cada mañana, tus pacientes siempre tienen respuesta y ninguna cita se pierde.',
    benefits: [
      'Tu agenda llega a las 7:30h para que empieces el día con claridad',
      'Tus pacientes reciben respuesta inmediata, de día o de noche',
      'Cancelaciones y cambios gestionados en el acto, sin interrumpirte',
      'Borradores de informes y documentación clínica listos para revisar',
      'Recordatorios automáticos para que ninguna sesión quede sin confirmar',
    ],
    setup: 450,
    monthly: 150,
  },
  {
    id: 'marcos',
    name: 'Marcos',
    role: 'Administrador',
    dept: 'Núcleo Operativo',
    icon: BarChart2,
    color: '#818cf8',
    bg: 'rgba(129,140,248,0.12)',
    pitch: 'Marcos lleva las cuentas de tu consulta en silencio y sin errores. Sabes en todo momento cuánto has ingresado, qué está pendiente y cuándo vencen tus obligaciones.',
    benefits: [
      'Resumen semanal de ingresos sin que tengas que calcularlo',
      'Alertas de cobros pendientes antes de que sean un problema',
      'Informe financiero mensual listo en Google Docs',
      'Aviso 15 días antes de cada declaración fiscal (IRPF, IVA)',
    ],
    setup: 450,
    monthly: 150,
  },
  {
    id: 'luna',
    name: 'Luna',
    role: 'Captadora',
    dept: 'Motor de Adquisición',
    icon: TrendingUp,
    color: '#34d399',
    bg: 'rgba(52,211,153,0.12)',
    pitch: 'Luna atiende cada consulta nueva con la misma calidez y criterio que tú. Valora si hay compatibilidad y agenda la primera sesión, incluso mientras duermes.',
    benefits: [
      'Ningún contacto nuevo queda sin respuesta, a cualquier hora',
      'Solo llegan a ti los casos que encajan con tu perfil',
      'La primera cita se agenda sola, sin que intervengas',
      'Los contactos que aún no estaban listos reciben seguimiento automático',
    ],
    setup: 450,
    monthly: 150,
  },
  {
    id: 'valeria',
    name: 'Valeria',
    role: 'Gestora de Redes Sociales',
    dept: 'Motor de Adquisición',
    icon: Share2,
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.12)',
    pitch: 'Valeria mantiene tu presencia en redes activa y coherente cada semana. Tu comunidad crece y te ve como referente, aunque no abras Instagram en todo el día.',
    benefits: [
      'Publicaciones semanales en Instagram, LinkedIn y TikTok sin esfuerzo',
      'Cada publicación adaptada a tu tono y especialidad',
      'Comentarios respondidos para mantener tu comunidad activa',
      'Propuesta de calendario mensual con contenido de tendencia',
    ],
    setup: 450,
    monthly: 150,
  },
  {
    id: 'elena',
    name: 'Elena',
    role: 'Investigadora de Contenidos',
    dept: 'Estudio de Contenido',
    icon: BookOpen,
    color: '#ec4899',
    bg: 'rgba(236,72,153,0.12)',
    pitch: 'Elena construye tu autoridad artículo a artículo. Investiga, escribe y publica en tu blog para que te encuentren quienes más te necesitan.',
    benefits: [
      '4 artículos al mes con posicionamiento web, sin escribir una línea',
      '2 boletines mensuales para mantener el vínculo con tus pacientes',
      'Guías y recursos descargables que aportan valor a tu comunidad',
      'Publicación directa en tu blog, sin intermediarios',
    ],
    setup: 450,
    monthly: 150,
  },
  {
    id: 'maya',
    name: 'Maya',
    role: 'Editora de Vídeo',
    dept: 'Estudio de Contenido',
    icon: Video,
    color: '#06b6d4',
    bg: 'rgba(6,182,212,0.12)',
    pitch: 'Maya convierte cada vídeo que grabas en contenido profesional y listo para publicar. Subes el archivo a Drive y ella se encarga del resto.',
    benefits: [
      'Edición automática: silencios eliminados y ritmo cuidado',
      'Subtítulos generados y archivo de transcripción incluido',
      'Título, descripción y etiquetas optimizados para que te encuentren',
      'Publicación automática en YouTube y TikTok',
    ],
    setup: 450,
    monthly: 150,
  },
]

// ── Packages ──
const packages = [
  {
    id: 'nucleo',
    name: 'Núcleo Operativo',
    icon: Building2,
    color: '#7c6fff',
    bg: 'rgba(124,111,255,0.15)',
    agents: ['Sofía', 'Marcos'],
    pitch: 'Sofía y Marcos mantienen tu consulta en orden cada día. La agenda, los pacientes y las finanzas en piloto automático — sin que tú muevas un dedo.',
    benefits: [
      'Agenda y pacientes gestionados las 24 horas',
      'Las finanzas bajo control, sin hojas de cálculo ni sorpresas',
      'Borradores de informes clínicos listos para revisar',
      'Alertas fiscales antes de que venzan los plazos',
    ],
    setup: 750,
    monthly: 200,
    saving: 100,
    featured: false,
  },
  {
    id: 'motor',
    name: 'Motor de Adquisición',
    icon: TrendingUp,
    color: '#34d399',
    bg: 'rgba(52,211,153,0.15)',
    agents: ['Luna', 'Valeria'],
    pitch: 'Luna llena tu agenda de pacientes nuevos mientras Valeria mantiene tu presencia activa en redes. El circuito completo de captación funcionando solo.',
    benefits: [
      'Cada consulta nueva recibe respuesta inmediata, a cualquier hora',
      'Solo llegan a ti los casos que encajan con tu perfil',
      'Publicaciones semanales en Instagram, LinkedIn y TikTok',
      'Tu comunidad crece y te percibe como referente',
    ],
    setup: 750,
    monthly: 200,
    saving: 100,
    featured: false,
  },
  {
    id: 'estudio',
    name: 'Estudio de Contenido',
    icon: Sparkles,
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.15)',
    agents: ['Elena', 'Maya'],
    pitch: 'Elena construye tu autoridad con artículos y boletines mientras Maya produce y publica tus vídeos. Contenido escrito y audiovisual, sin dedicarle ni una hora.',
    benefits: [
      '4 artículos al mes con posicionamiento web publicados en tu blog',
      'Boletines mensuales para mantener el vínculo con tus pacientes',
      'Vídeos editados, subtitulados y publicados en YouTube y TikTok',
      'Guías descargables que aportan valor a tu comunidad',
    ],
    setup: 750,
    monthly: 200,
    saving: 100,
    featured: false,
  },
  {
    id: 'equipo',
    name: 'Equipo Completo',
    icon: Star,
    color: '#34d399',
    bg: 'rgba(52,211,153,0.15)',
    agents: ['Los 6 empleados'],
    pitch: 'Tu consulta operando sola. Agenda, finanzas, captación, redes, artículos y vídeo — todo coordinado por seis especialistas que nunca paran.',
    benefits: [
      'Operativa diaria cubierta: agenda, pacientes y cobros',
      'Captación y redes activas sin tu intervención',
      'Contenido escrito y audiovisual publicado cada semana',
      'Un equipo coordinado, por menos de lo que cuesta un día de gestoría',
    ],
    setup: 1950,
    monthly: 500,
    saving: 400,
    featured: true,
  },
]

// ── Despacho Digital features (for promo tab & home banner) ──
const despachoFeatures = [
  'Web profesional para tu consulta (posicionamiento local incluido)',
  'Panel privado de gestión para tus pacientes',
  '2 empleados IA activos 24/7 (WhatsApp, agenda, contenido…)',
  'Incorporación y configuración completa en 7 días',
  'Soporte técnico continuo y actualizaciones incluidas',
]

// ── FAQs ──
const faqs = [
  {
    q: '¿En qué plataformas trabajan los empleados IA?',
    a: 'Sofía está conectada a WhatsApp Business API e Instagram DMs. El resto de empleados trabajan dentro de tu panel de control e integran con tus herramientas actuales (Google Calendar, email, Stripe, etc.).',
  },
  {
    q: '¿Cuánto tarda en estar listo mi empleado IA?',
    a: 'El proceso completo — sesión de bienvenida, configuración, entrenamiento e integración — se completa en 7 días desde el inicio. Ese tiempo lo usamos para personalizar la personalidad, los flujos y conectar tus cuentas.',
  },
  {
    q: '¿Puedo contratar solo un empleado y añadir más después?',
    a: 'Sí, completamente. Puedes empezar con un único empleado y ampliar tu equipo cuando lo necesites. Los departamentos y el equipo completo ofrecen un precio más ventajoso al contratar varios a la vez.',
  },
  {
    q: '¿Puedo fraccionar el pago de la incorporación?',
    a: 'Sí. El coste de incorporación se puede dividir en hasta 3 cuotas mensuales cargadas automáticamente. Eliges la opción al finalizar la contratación en la Bolsa de Empleo.',
  },
  {
    q: '¿Cuándo empieza a cobrarse la mensualidad?',
    a: 'La primera cuota mensual se cobra el primer día del mes siguiente a la entrega de tus empleados. Por ejemplo, si entregamos el 15 de mayo, la primera mensualidad es el 1 de junio.',
  },
  {
    q: '¿Necesito conocimientos técnicos para usarlo?',
    a: 'Para nada. El panel de control está diseñado para que cualquier persona sin perfil técnico pueda usarlo con comodidad. Nosotros nos encargamos de toda la infraestructura.',
  },
  {
    q: '¿Puedo cancelar la suscripción en cualquier momento?',
    a: 'Sí. No existe permanencia mínima. Si decides cancelar, solo tienes que avisarnos con un mes de antelación. El pago de incorporación no es reembolsable, ya que cubre trabajo ya realizado.',
  },
  {
    q: '¿Qué ocurre con mis datos y los de mis clientes?',
    a: 'Todos los datos se almacenan en servidores seguros de MongoDB Atlas en la Unión Europea. No compartimos información con terceros y cumplimos con el RGPD. Puedes consultar nuestra Política de Privacidad para más detalles.',
  },
  {
    q: '¿Los empleados IA hablan solo español?',
    a: 'Pueden configurarse para atender en varios idiomas, incluyendo español e inglés. Por defecto trabajan en español. Podemos adaptarlos a tus necesidades.',
  },
]
</script>

<style lang="scss" scoped>
// ── Global ──────────────────────────────
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 $space-6;

  @media (max-width: 640px) {
    padding: 0 $space-4;
  }
}

.section-header {
  text-align: center;
  margin-bottom: $space-12;
}

.section-title {
  font-size: $text-3xl;
  font-weight: $fw-bold;
  letter-spacing: -0.02em;
  color: $text;
  margin-bottom: $space-3;

  @media (max-width: 640px) {
    font-size: $text-2xl;
  }
}

.section-subtitle {
  font-size: $text-base;
  color: $text-muted;
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
    box-shadow: 0 0 36px rgba(124,111,255,0.4);
    color: #fff;
  }

  &--lg {
    height: 56px;
    padding: 0 $space-8;
    font-size: $text-lg;
  }
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: $space-2;
  height: 48px;
  padding: 0 $space-5;
  border: 1px solid $border;
  border-radius: $radius;
  color: $text-muted;
  font-size: $text-base;
  font-weight: $fw-medium;
  text-decoration: none;
  transition: $transition-fast;

  &:hover {
    border-color: $border-hover;
    color: $text;
  }
}

// ── Hero ────────────────────────────────
.hero {
  position: relative;
  padding: $space-16 0;
  padding-top: calc($space-16 + $space-8);
  overflow: hidden;
  text-align: center;

  @media (max-width: 640px) {
    padding: $space-10 0;
  }

  &__bg {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(124, 111, 255, 0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(124, 111, 255, 0.04) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse 70% 60% at 50% 0%, rgba(124,111,255,0.18) 0%, transparent 70%);
    }
  }

  .container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $space-6;
    max-width: 760px;
  }

  &__badge {
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

  &__title {
    font-size: clamp(2.25rem, 5vw, 3.5rem);
    font-weight: $fw-bold;
    line-height: 1.15;
    letter-spacing: -0.03em;
    color: $text;
  }

  &__title-accent {
    background: linear-gradient(135deg, $primary-light 0%, $accent 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  &__subtitle {
    font-size: $text-lg;
    color: $text-muted;
    line-height: 1.7;
    max-width: 600px;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: $space-3;
  }

  &__trust {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: $space-4;
    margin-top: $space-2;
  }

  &__trust-item {
    display: flex;
    align-items: center;
    gap: $space-2;
    font-size: $text-sm;
    color: $text-muted;

    svg { color: $accent; flex-shrink: 0; }
  }
}

// ── Employee lifecycle ───────────────────
.ep {
  padding: $space-16 0;
  border-bottom: 1px solid $border;

  &__phases {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: $space-6;
  }

  &__phase {
    text-align: center;
    padding: $space-6 $space-4;
    background: $bg-card;
    border: 1px solid $border;
    border-radius: $radius-lg;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $space-3;
    transition: $transition;

    &:hover {
      border-color: $border-hover;
    }
  }

  &__icon-wrap {
    width: 64px;
    height: 64px;
    border-radius: $radius-lg;
    border: 1px solid;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 1;
  }

  &__phase-num {
    font-size: $text-xs;
    font-weight: $fw-bold;
    letter-spacing: 0.1em;
    color: $text-muted;
    font-family: monospace;
  }

  &__phase-title {
    font-size: $text-base;
    font-weight: $fw-semibold;
    color: $text;
  }

  &__phase-desc {
    font-size: $text-sm;
    line-height: 1.6;
    color: $text-muted;
    flex: 1;
  }

  &__stat {
    font-size: $text-xs;
    font-weight: $fw-semibold;
    letter-spacing: 0.05em;
    padding: $space-1 $space-3;
    border: 1px solid;
    border-radius: $radius-full;
    margin-top: $space-1;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $space-8;
    margin-top: $space-8;
    padding: $space-5 $space-8;
    background: $bg-card;
    border: 1px solid $border;
    border-radius: $radius-lg;

    @media (max-width: 480px) {
      gap: $space-4;
      padding: $space-4;
      flex-wrap: wrap;
    }
  }

  &__footer-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $space-1;
    font-size: $text-sm;
    color: $text-muted;
  }

  &__footer-num {
    font-size: $text-2xl;
    font-weight: $fw-bold;
    color: $accent;
    line-height: 1;
  }

  &__footer-sep {
    width: 1px;
    height: 40px;
    background: $border;

    @media (max-width: 480px) {
      display: none;
    }
  }

  @media (max-width: 768px) {
    &__phases {
      grid-template-columns: 1fr;
    }
  }
}

// ── Catalog ─────────────────────────────
.catalog {
  padding: $space-16 0;

  &__toggle {
    display: flex;
    justify-content: center;
    gap: $space-2;
    margin-bottom: $space-10;
    background: $bg-card;
    border: 1px solid $border;
    border-radius: $radius-lg;
    padding: $space-2;
    width: fit-content;
    margin-left: auto;
    margin-right: auto;

    @media (max-width: 600px) {
      flex-direction: column;
      width: 100%;
    }
  }

  &__tab {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $space-2;
    height: 40px;
    padding: 0 $space-5;
    background: transparent;
    border: none;
    border-radius: $radius;
    color: $text-muted;
    font-size: $text-sm;
    font-weight: $fw-medium;
    cursor: pointer;
    transition: $transition-fast;
    white-space: nowrap;

    &:hover { color: $text; }

    &--active {
      background: $primary;
      color: #fff;
      box-shadow: 0 0 16px $primary-glow;
    }
  }

  &__hire-btn {
    margin-top: $space-4;
  }

  &__footnote {
    display: flex;
    align-items: flex-start;
    gap: $space-2;
    justify-content: center;
    margin-top: $space-8;
    padding: $space-3 $space-5;
    background: $bg-card;
    border: 1px solid $border;
    border-radius: $radius;
    font-size: $text-sm;
    color: $text-muted;
    text-align: center;
    max-width: 620px;
    margin-left: auto;
    margin-right: auto;

    svg { flex-shrink: 0; margin-top: 2px; color: $primary-light; }
  }
}

// ── Cards grid ─────────────────────────
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: $space-5;

  &--packages {
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
}

// ── Employee card ───────────────────────
.emp-card {
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius-lg;
  padding: $space-5;
  display: flex;
  flex-direction: column;
  gap: $space-4;
  transition: $transition;

  &:hover {
    border-color: $border-hover;
    box-shadow: $shadow-glow;
    transform: translateY(-3px);
  }

  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
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

  &__role-badge {
    font-size: $text-xs;
    font-weight: $fw-semibold;
    padding: 3px $space-2;
    border-radius: $radius-full;
    border: 1px solid;
    letter-spacing: 0.03em;
    white-space: nowrap;
  }

  &__body {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: $space-3;
  }

  &__name {
    font-size: $text-xl;
    font-weight: $fw-bold;
    color: $text;
    letter-spacing: -0.01em;
    line-height: 1.2;
  }

  &__role {
    font-size: $text-xs;
    color: $text-subtle;
    font-weight: $fw-medium;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin-top: $space-1;
  }

  &__pitch {
    font-size: $text-sm;
    color: $text-muted;
    line-height: 1.6;
  }

  &__pain {
    display: flex;
    align-items: flex-start;
    gap: $space-2;
    background: $warning-bg;
    border: 1px solid rgba(245,158,11,0.15);
    border-radius: $radius;
    padding: $space-3;
    font-size: $text-xs;
    color: $text-muted;
    line-height: 1.5;

    &-icon { color: $warning; flex-shrink: 0; margin-top: 1px; }
  }

  &__solution {
    display: flex;
    align-items: flex-start;
    gap: $space-2;
    background: $success-bg;
    border: 1px solid rgba(52,211,153,0.15);
    border-radius: $radius;
    padding: $space-3;
    font-size: $text-xs;
    color: $text-muted;
    line-height: 1.5;

    &-icon { color: $accent; flex-shrink: 0; margin-top: 1px; }
  }

  // ── Job profile toggle ──
  &__profile-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: $space-2 $space-3;
    background: transparent;
    border: 1px solid $border;
    border-radius: $radius;
    color: $text-muted;
    font-size: $text-xs;
    font-weight: $fw-medium;
    cursor: pointer;
    transition: $transition-fast;
    letter-spacing: 0.02em;

    &:hover {
      border-color: $border-hover;
      color: $text;
    }
  }

  &__profile-chevron {
    flex-shrink: 0;
    transition: transform 0.2s ease;

    &--open { transform: rotate(180deg); }
  }

  &__profile {
    background: rgba(124,111,255,0.04);
    border: 1px solid rgba(124,111,255,0.15);
    border-radius: $radius;
    padding: $space-3;
    margin-top: -$space-2;
  }

  &__tasks {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: $space-2;
  }

  &__task {
    display: flex;
    align-items: flex-start;
    gap: $space-2;
    font-size: $text-xs;
    color: $text-muted;
    line-height: 1.5;
  }

  &__task-icon {
    color: $primary-light;
    flex-shrink: 0;
    margin-top: 1px;
  }

  &__footer {
    border-top: 1px solid $border;
    padding-top: $space-4;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: $space-3;
    flex-wrap: wrap;
  }

  &__price {
    display: flex;
    flex-direction: column;
    gap: $space-1;
  }

  &__price-monthly {
    display: flex;
    align-items: baseline;
    gap: $space-1;
  }

  &__price-amount {
    font-size: $text-2xl;
    font-weight: $fw-bold;
    color: $text;
    font-variant-numeric: tabular-nums;
  }

  &__price-period {
    font-size: $text-sm;
    color: $text-muted;
  }

  &__price-setup {
    font-size: $text-xs;
    font-weight: $fw-medium;
    color: $text-muted;
  }

  &__benefits {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: $space-2;
  }

  &__benefit {
    display: flex;
    align-items: flex-start;
    gap: $space-2;
    font-size: $text-sm;
    color: $text-muted;
    line-height: 1.5;
  }

  &__benefit-icon {
    color: $accent;
    flex-shrink: 0;
    margin-top: 2px;
  }

  &__cta {
    display: inline-flex;
    align-items: center;
    gap: $space-2;
    height: 38px;
    padding: 0 $space-4;
    background: $primary-subtle;
    border: 1px solid rgba(124,111,255,0.25);
    border-radius: $radius;
    color: $primary-light;
    font-size: $text-sm;
    font-weight: $fw-medium;
    text-decoration: none;
    transition: $transition;
    white-space: nowrap;

    &:hover {
      background: $primary;
      color: #fff;
      border-color: $primary;
    }
  }
}

// ── Package card ────────────────────────
.pkg-card {
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius-lg;
  padding: $space-6;
  display: flex;
  flex-direction: column;
  gap: $space-4;
  transition: $transition;
  position: relative;

  &:hover {
    border-color: $border-hover;
    transform: translateY(-3px);
  }

  &--featured {
    border-color: rgba(52,211,153,0.4);
    background: linear-gradient(145deg, $bg-card, rgba(52,211,153,0.04));
    box-shadow: 0 0 40px rgba(52,211,153,0.1);

    &:hover {
      border-color: rgba(52,211,153,0.6);
      box-shadow: 0 0 56px rgba(52,211,153,0.2);
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
    background: $accent;
    color: $bg;
    border-radius: $radius-full;
    font-size: $text-xs;
    font-weight: $fw-bold;
    white-space: nowrap;
    letter-spacing: 0.03em;
  }

  &__header {
    display: flex;
    align-items: center;
    gap: $space-4;
  }

  &__icon {
    width: 52px;
    height: 52px;
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
  }

  &__includes {
    font-size: $text-xs;
    color: $text-muted;
    margin-top: $space-1;
  }

  &__pitch {
    font-size: $text-sm;
    color: $text-muted;
    line-height: 1.6;
  }

  &__pain {
    display: flex;
    align-items: flex-start;
    gap: $space-2;
    background: $warning-bg;
    border: 1px solid rgba(245,158,11,0.15);
    border-radius: $radius;
    padding: $space-3;
    font-size: $text-xs;
    color: $text-muted;
    line-height: 1.5;

    svg { color: $warning; flex-shrink: 0; margin-top: 1px; }
  }

  &__solution {
    display: flex;
    align-items: flex-start;
    gap: $space-2;
    background: $success-bg;
    border: 1px solid rgba(52,211,153,0.15);
    border-radius: $radius;
    padding: $space-3;
    font-size: $text-xs;
    color: $text-muted;
    line-height: 1.5;

    svg { color: $accent; flex-shrink: 0; margin-top: 1px; }
  }

  &__footer {
    border-top: 1px solid $border;
    padding-top: $space-4;
    margin-top: auto;
    display: flex;
    flex-direction: column;
    gap: $space-3;
  }

  &__price {
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

  &__price-amount {
    font-size: $text-3xl;
    font-weight: $fw-bold;
    color: $text;
    font-variant-numeric: tabular-nums;
  }

  &__price-period {
    font-size: $text-base;
    color: $text-muted;
  }

  &__saving {
    font-size: $text-xs;
    font-weight: $fw-semibold;
    color: $accent;
    background: $success-bg;
    padding: 2px $space-2;
    border-radius: $radius-full;
    border: 1px solid rgba(52,211,153,0.2);
  }

  &__setup {
    font-size: $text-xs;
    font-weight: $fw-medium;
    color: $text-muted;
  }

  &__benefits {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: $space-2;
    flex: 1;
  }

  &__benefit {
    display: flex;
    align-items: flex-start;
    gap: $space-2;
    font-size: $text-sm;
    color: $text-muted;
    line-height: 1.5;
  }

  &__benefit-icon {
    color: $accent;
    flex-shrink: 0;
    margin-top: 2px;
  }

  &__cta {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $space-2;
    height: 44px;
    background: $primary-subtle;
    border: 1px solid rgba(124,111,255,0.25);
    border-radius: $radius;
    color: $primary-light;
    font-size: $text-sm;
    font-weight: $fw-semibold;
    text-decoration: none;
    transition: $transition;

    &:hover {
      background: $primary;
      color: #fff;
      border-color: $primary;
    }

    &--featured {
      background: $accent;
      border-color: $accent;
      color: $bg;
      box-shadow: 0 0 20px rgba(52,211,153,0.3);

      &:hover {
        background: #2ebf86;
        color: $bg;
        box-shadow: 0 0 28px rgba(52,211,153,0.5);
      }
    }
  }
}

// ── Despacho panel (catalog tab) ─────────
.despacho-panel {
  position: relative;
  background: $bg-card;
  border: 1px solid rgba(52,211,153,0.3);
  border-radius: $radius-xl;
  padding: $space-10;
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: $space-10;
  align-items: center;
  overflow: hidden;
  box-shadow: 0 0 60px rgba(52,211,153,0.07);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: $space-6;
    gap: $space-6;
  }

  &__glow {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 60% 80% at 100% 50%, rgba(52,211,153,0.07) 0%, transparent 60%);
    pointer-events: none;
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    gap: $space-2;
    padding: $space-1 $space-3;
    background: rgba(52,211,153,0.1);
    border: 1px solid rgba(52,211,153,0.25);
    border-radius: $radius-full;
    font-size: $text-xs;
    font-weight: $fw-semibold;
    color: $accent;
    letter-spacing: 0.03em;
    margin-bottom: $space-4;
  }

  &__title {
    font-size: $text-3xl;
    font-weight: $fw-bold;
    color: $text;
    letter-spacing: -0.02em;
    margin-bottom: $space-3;

    @media (max-width: 640px) {
      font-size: $text-2xl;
    }
  }

  &__sub {
    font-size: $text-base;
    color: $text-muted;
    line-height: 1.6;
    margin-bottom: $space-4;
    max-width: 480px;
  }

  &__saving {
    display: inline-flex;
    align-items: center;
    gap: $space-2;
    padding: $space-2 $space-4;
    background: rgba(52,211,153,0.08);
    border: 1px solid rgba(52,211,153,0.2);
    border-radius: $radius-full;
    font-size: $text-sm;
    color: $accent;
    margin-bottom: $space-5;

    strong { font-weight: $fw-bold; }
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

  &__right {
    position: relative;
  }

  &__price-box {
    background: $bg-surface;
    border: 1px solid $border-hover;
    border-radius: $radius-lg;
    padding: $space-6;
    display: flex;
    flex-direction: column;
    gap: $space-3;
  }

  &__price {
    display: flex;
    align-items: baseline;
    gap: $space-2;
  }

  &__price-num {
    font-size: 2.5rem;
    font-weight: $fw-bold;
    color: $text;
    letter-spacing: -0.03em;
    font-variant-numeric: tabular-nums;
  }

  &__price-period {
    font-size: $text-sm;
    color: $text-muted;
  }

  &__price-note {
    font-size: $text-xs;
    color: $text-subtle;
    margin-top: -$space-2;
  }

  &__cta {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $space-2;
    height: 48px;
    background: $accent;
    border: none;
    border-radius: $radius;
    color: $bg;
    font-size: $text-base;
    font-weight: $fw-bold;
    text-decoration: none;
    transition: $transition;
    box-shadow: 0 0 20px rgba(52,211,153,0.3);

    &:hover {
      background: #2ebf86;
      transform: translateY(-1px);
      box-shadow: 0 0 28px rgba(52,211,153,0.45);
      color: $bg;
    }
  }

  &__demo {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: $text-sm;
    color: $text-muted;
    text-decoration: none;
    transition: $transition-fast;

    &:hover { color: $text; }
  }
}

// ── Despacho home banner ─────────────────
.home-despacho {
  padding: $space-16 0;
  background: $bg-surface;
  border-top: 1px solid $border;
  border-bottom: 1px solid $border;

  &__inner {
    position: relative;
    background: $bg-card;
    border: 1px solid rgba(52,211,153,0.3);
    border-radius: $radius-xl;
    padding: $space-10;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $space-8;
    overflow: hidden;
    box-shadow: 0 0 60px rgba(52,211,153,0.07);

    @media (max-width: 768px) {
      flex-direction: column;
      padding: $space-6;
      text-align: center;
    }
  }

  &__glow {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 50% 100% at 100% 50%, rgba(52,211,153,0.08) 0%, transparent 60%);
    pointer-events: none;
  }

  &__text {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: $space-3;

    @media (max-width: 768px) {
      align-items: center;
    }
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    gap: $space-2;
    padding: $space-1 $space-3;
    background: rgba(52,211,153,0.1);
    border: 1px solid rgba(52,211,153,0.25);
    border-radius: $radius-full;
    font-size: $text-xs;
    font-weight: $fw-semibold;
    color: $accent;
    letter-spacing: 0.03em;
  }

  &__title {
    font-size: $text-3xl;
    font-weight: $fw-bold;
    color: $text;
    letter-spacing: -0.02em;

    @media (max-width: 640px) {
      font-size: $text-2xl;
    }
  }

  &__sub {
    font-size: $text-base;
    color: $text-muted;
    line-height: 1.6;
    max-width: 500px;
  }

  &__saving {
    display: inline-flex;
    align-items: center;
    gap: $space-2;
    padding: $space-2 $space-4;
    background: rgba(52,211,153,0.08);
    border: 1px solid rgba(52,211,153,0.2);
    border-radius: $radius-full;
    font-size: $text-sm;
    color: $accent;

    strong { font-weight: $fw-bold; }
    svg { flex-shrink: 0; }
  }

  &__action {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $space-3;
    flex-shrink: 0;
  }

  &__price {
    display: flex;
    align-items: baseline;
    gap: $space-2;
  }

  &__price-num {
    font-size: 2.25rem;
    font-weight: $fw-bold;
    color: $text;
    letter-spacing: -0.03em;
    font-variant-numeric: tabular-nums;
  }

  &__price-period {
    font-size: $text-sm;
    color: $text-muted;
    white-space: nowrap;
  }

  &__cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: $space-2;
    height: 52px;
    padding: 0 $space-8;
    background: $accent;
    border: none;
    border-radius: $radius;
    color: $bg;
    font-size: $text-base;
    font-weight: $fw-bold;
    text-decoration: none;
    transition: $transition;
    box-shadow: 0 0 24px rgba(52,211,153,0.3);
    white-space: nowrap;

    &:hover {
      background: #2ebf86;
      transform: translateY(-2px);
      box-shadow: 0 0 36px rgba(52,211,153,0.45);
      color: $bg;
    }
  }
}

// ── Promo tab style ──────────────────────
.catalog__tab--promo {
  &.catalog__tab--active {
    background: $accent !important;
    color: $bg !important;
    box-shadow: 0 0 16px rgba(52,211,153,0.35) !important;
  }

  &:not(.catalog__tab--active):hover {
    color: $accent;
  }
}

// ── FAQ ─────────────────────────────────
.faq {
  padding: $space-16 0;

  &__inner {
    max-width: 760px;
  }

  &__list {
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

// FAQ accordion
.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}
.accordion-enter-from,
.accordion-leave-to { opacity: 0; max-height: 0; }
.accordion-enter-to,
.accordion-leave-from { opacity: 1; max-height: 400px; }

// ── Final CTA ───────────────────────────
.final-cta {
  padding: $space-16 0;

  &__box {
    position: relative;
    background: $bg-card;
    border: 1px solid $border-hover;
    border-radius: $radius-xl;
    padding: $space-16 $space-8;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $space-5;
    overflow: hidden;
    max-width: 720px;
    margin: 0 auto;
  }

  &__glow {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 60% 50% at 50% 0%, rgba(124,111,255,0.15) 0%, transparent 70%);
    pointer-events: none;
  }

  &__icon {
    color: $primary;
    filter: drop-shadow(0 0 12px $primary-glow);
  }

  &__title {
    font-size: $text-3xl;
    font-weight: $fw-bold;
    letter-spacing: -0.02em;
    position: relative;

    @media (max-width: 640px) {
      font-size: $text-2xl;
    }
  }

  &__subtitle {
    font-size: $text-base;
    max-width: 440px;
    line-height: 1.6;
    position: relative;
  }

  &__whatsapp {
    font-size: $text-sm;
    color: $text-muted;
    position: relative;

    a {
      color: #25d366;
      font-weight: $fw-medium;
      text-decoration: none;

      &:hover { text-decoration: underline; }
    }
  }
}

// ── Blog section ────────────────────────
.blog-section {
  padding: $space-16 0;
  background: $bg;

  .section-header {
    margin-bottom: $space-10;
  }
}

.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: $space-6;
}

.blog-card {
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius-xl;
  overflow: hidden;
  text-decoration: none;
  color: $text;
  display: flex;
  flex-direction: column;
  transition: $transition;

  &:hover {
    border-color: $primary;
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(124, 111, 255, 0.15);
  }

  &__thumb {
    height: 168px;
    overflow: hidden;
    background: $bg-surface;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }

    &-empty {
      height: 100%;
      background: linear-gradient(135deg, $bg-surface 0%, $bg-card-2 100%);
    }
  }

  &:hover &__thumb img {
    transform: scale(1.04);
  }

  &__body {
    padding: $space-5;
    display: flex;
    flex-direction: column;
    gap: $space-2;
    flex: 1;
  }

  &__date {
    font-size: $text-xs;
    color: $text-subtle;
    font-family: $font-mono;
  }

  &__title {
    font-size: $text-base;
    font-weight: $fw-semibold;
    line-height: 1.4;
  }

  &__excerpt {
    font-size: $text-sm;
    color: $text-muted;
    line-height: 1.55;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    flex: 1;
  }

  &__cta {
    font-size: $text-sm;
    font-weight: $fw-semibold;
    color: $primary-light;
    margin-top: $space-1;
  }
}

.blog-more {
  display: flex;
  justify-content: center;
  margin-top: $space-10;
}

// ── Courses ─────────────────────────────
.courses-section {
  padding: $space-16 0;
  border-top: 1px solid $border;
  border-bottom: 1px solid $border;
}

.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: $space-6;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.course-card {
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius-lg;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: $transition;

  &:hover {
    border-color: $border-hover;
    box-shadow: $shadow-glow;
    transform: translateY(-3px);
  }

  &--inactive {
    opacity: 0.85;
  }

  &__thumb {
    position: relative;
    height: 180px;
    overflow: hidden;
    background: $bg-surface;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }

    &-empty {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, rgba(124,111,255,0.08), rgba(52,211,153,0.06));
      color: $text-subtle;
    }
  }

  &:hover &__thumb img {
    transform: scale(1.04);
  }

  &__badge {
    position: absolute;
    top: $space-3;
    left: $space-3;
    font-size: $text-xs;
    font-weight: $fw-semibold;
    padding: 3px $space-3;
    border-radius: $radius-full;
    background: rgba(139,138,168,0.2);
    border: 1px solid rgba(139,138,168,0.3);
    color: $text-muted;
    letter-spacing: 0.04em;

    &--active {
      background: rgba(52,211,153,0.15);
      border-color: rgba(52,211,153,0.3);
      color: $accent;
    }
  }

  &__body {
    padding: $space-5;
    display: flex;
    flex-direction: column;
    gap: $space-2;
    flex: 1;
  }

  &__title {
    font-size: $text-lg;
    font-weight: $fw-bold;
    color: $text;
    line-height: 1.3;
    letter-spacing: -0.01em;
  }

  &__desc {
    font-size: $text-sm;
    color: $text-muted;
    line-height: 1.6;
    flex: 1;
  }

  &__meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: $space-2;
  }

  &__date {
    font-size: $text-xs;
    color: $text-subtle;
    font-family: $font-mono;
  }

  &__price {
    font-size: $text-xl;
    font-weight: $fw-bold;
    color: $text;
    font-variant-numeric: tabular-nums;
  }

  &__footer {
    padding: $space-4 $space-5;
    border-top: 1px solid $border;
  }

  &__cta {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $space-2;
    width: 100%;
    height: 42px;
    border-radius: $radius;
    font-size: $text-sm;
    font-weight: $fw-semibold;
    text-decoration: none;
    cursor: pointer;
    border: none;
    transition: $transition;

    &--primary {
      background: $primary-subtle;
      border: 1px solid rgba(124,111,255,0.25);
      color: $primary-light;

      &:hover {
        background: $primary;
        border-color: $primary;
        color: #fff;
      }
    }

    &--waitlist {
      background: transparent;
      border: 1px solid $border;
      color: $text-muted;

      &:hover {
        border-color: $primary;
        color: $primary-light;
      }
    }
  }
}

// ── Waitlist modal ───────────────────────
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(8,8,26,0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: $space-4;
}

.modal {
  position: relative;
  background: $bg-surface;
  border: 1px solid $border;
  border-radius: $radius-lg;
  padding: $space-8;
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-4;

  &__close {
    position: absolute;
    top: $space-4;
    right: $space-4;
    background: transparent;
    border: none;
    color: $text-muted;
    cursor: pointer;
    padding: $space-1;
    border-radius: $radius;
    transition: $transition-fast;

    &:hover { color: $text; }
  }

  &__icon {
    color: $primary;
  }

  &__success-icon {
    color: $accent;
  }

  &__title {
    font-size: $text-xl;
    font-weight: $fw-bold;
    color: $text;
    letter-spacing: -0.01em;
  }

  &__subtitle {
    font-size: $text-sm;
    color: $text-muted;
    text-align: center;
    line-height: 1.6;

    strong { color: $text; }
  }

  &__form {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: $space-4;
  }

  &__label {
    display: flex;
    flex-direction: column;
    gap: $space-2;
    font-size: $text-sm;
    font-weight: $fw-medium;
    color: $text-muted;
  }

  &__input {
    height: 42px;
    padding: 0 $space-4;
    background: $bg-card;
    border: 1px solid $border;
    border-radius: $radius;
    color: $text;
    font-size: $text-sm;
    transition: $transition-fast;

    &::placeholder { color: $text-subtle; }

    &:focus {
      outline: none;
      border-color: $primary;
      box-shadow: 0 0 0 3px rgba(124,111,255,0.15);
    }
  }

  &__error {
    font-size: $text-sm;
    color: $danger;
    text-align: center;
  }

  &__submit {
    width: 100%;
    justify-content: center;

    &:disabled { opacity: 0.6; cursor: not-allowed; }
  }
}

.modal-enter-active,
.modal-leave-active { transition: all 0.2s ease; }
.modal-enter-from,
.modal-leave-to { opacity: 0; }
.modal-enter-from .modal,
.modal-leave-to .modal { transform: scale(0.95) translateY(8px); }

// ── Transitions ─────────────────────────
.fade-slide-enter-active,
.fade-slide-leave-active { transition: all 0.2s ease; }
.fade-slide-enter-from   { opacity: 0; transform: translateY(10px); }
.fade-slide-leave-to     { opacity: 0; transform: translateY(-10px); }
</style>
