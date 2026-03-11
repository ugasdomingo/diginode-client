<template>
  <div class="home">

    <!-- ── HERO ─────────────────────────────────────── -->
    <section class="hero">
      <div class="hero__bg" aria-hidden="true" />
      <div class="container">
        <div class="hero__badge">
          <Sparkles :size="13" />
          Empleados IA para tu negocio
        </div>
        <h1 class="hero__title">
          Tu equipo trabaja.<br />
          <span class="hero__title-accent">Tú diriges.</span>
        </h1>
        <p class="hero__subtitle">
          Incorpora empleados de inteligencia artificial que atienden clientes, gestionan cobros,
          crean contenido y analizan reuniones — sin horarios, sin bajas, sin nóminas infladas.
        </p>
        <div class="hero__actions">
          <a
            href="https://cal.com/diginode/demo"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-primary"
          >
            <CalendarCheck :size="18" />
            Agendar demo gratuita
          </a>
          <a href="#empleados" class="btn-secondary">
            Ver empleados <ArrowDown :size="16" />
          </a>
        </div>
        <div class="hero__trust">
          <div class="hero__trust-item">
            <CheckCircle :size="15" />
            Sin permanencia
          </div>
          <div class="hero__trust-item">
            <CheckCircle :size="15" />
            Setup en 48h
          </div>
          <div class="hero__trust-item">
            <CheckCircle :size="15" />
            Pago por Stripe
          </div>
        </div>
      </div>
    </section>

    <!-- ── HOW IT WORKS ───────────────────────────── -->
    <section class="how">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Cómo funciona</h2>
          <p class="section-subtitle">De cero a tu equipo IA en tres pasos</p>
        </div>
        <div class="how__steps">
          <div v-for="(step, i) in steps" :key="i" class="how__step">
            <div class="how__step-num">{{ i + 1 }}</div>
            <component :is="step.icon" :size="24" class="how__step-icon" />
            <h3 class="how__step-title">{{ step.title }}</h3>
            <p class="how__step-desc">{{ step.desc }}</p>
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
                  Empleado IA
                </div>
              </div>

              <div class="emp-card__body">
                <h3 class="emp-card__name">{{ emp.name }}</h3>
                <p class="emp-card__pitch">{{ emp.pitch }}</p>

                <div class="emp-card__pain">
                  <AlertTriangle :size="13" class="emp-card__pain-icon" />
                  <p>{{ emp.pain }}</p>
                </div>

                <div class="emp-card__solution">
                  <CheckCircle :size="13" class="emp-card__sol-icon" />
                  <p>{{ emp.solution }}</p>
                </div>
              </div>

              <div class="emp-card__footer">
                <div class="emp-card__price">
                  <div class="emp-card__price-monthly">
                    <span class="emp-card__price-amount">{{ emp.monthly }}€</span>
                    <span class="emp-card__price-period">/mes</span>
                  </div>
                  <div class="emp-card__price-setup">Setup: {{ emp.setup }}€ (único)</div>
                </div>
                <a
                  href="https://cal.com/diginode/demo"
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
          <div v-else key="packages" class="cards-grid cards-grid--packages">
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

              <div class="pkg-card__pain">
                <AlertTriangle :size="13" />
                <p>{{ pkg.pain }}</p>
              </div>

              <div class="pkg-card__solution">
                <CheckCircle :size="13" />
                <p>{{ pkg.solution }}</p>
              </div>

              <div class="pkg-card__footer">
                <div class="pkg-card__price">
                  <div class="pkg-card__price-row">
                    <span class="pkg-card__price-amount">{{ pkg.monthly }}€</span>
                    <span class="pkg-card__price-period">/mes</span>
                    <span v-if="pkg.saving" class="pkg-card__saving">Ahorras {{ pkg.saving }}€/mes</span>
                  </div>
                  <p class="pkg-card__setup">Setup: {{ pkg.setup }}€ pago único</p>
                </div>
                <a
                  href="https://cal.com/diginode/demo"
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
        </Transition>

        <!-- Pricing footnote -->
        <p class="catalog__footnote">
          <Info :size="14" />
          El setup es un pago único para la configuración de la infraestructura. El salario mensual es la suscripción recurrente. Sin permanencia mínima.
        </p>
      </div>
    </section>

    <!-- ── PAYMENT SECTION ────────────────────────── -->
    <section class="payment">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">¿Cómo se paga?</h2>
          <p class="section-subtitle">Sin sorpresas, sin letra pequeña</p>
        </div>
        <div class="payment__grid">
          <div class="payment__card" v-for="item in paymentItems" :key="item.title">
            <div class="payment__card-icon">
              <component :is="item.icon" :size="20" />
            </div>
            <h3 class="payment__card-title">{{ item.title }}</h3>
            <p class="payment__card-desc">{{ item.desc }}</p>
          </div>
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

    <!-- ── FINAL CTA ──────────────────────────────── -->
    <section class="final-cta">
      <div class="container">
        <div class="final-cta__box">
          <div class="final-cta__glow" aria-hidden="true" />
          <Zap :size="36" class="final-cta__icon" />
          <h2 class="final-cta__title">¿Listo para incorporar tu primer empleado IA?</h2>
          <p class="final-cta__subtitle">La demo dura 30 minutos y es completamente gratuita. Sin compromiso.</p>
          <a
            href="https://cal.com/diginode/demo"
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
  Info, Zap, MessageSquare, Settings, Wrench,
  PenLine, Palette, TrendingUp, Building2,
  CreditCard, RefreshCcw, ShieldCheck,
} from 'lucide-vue-next'

const view      = ref('employees')
const openFaq   = ref(null)
const blogPosts = ref([])

function formatBlogDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

onMounted(async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/blog?limit=3`).then(r => r.json())
    blogPosts.value = res.data ?? []
  } catch {
    // fail silently — section won't render if empty
  }
})

// ── Steps ──
const steps = [
  {
    icon: CalendarCheck,
    title: 'Agenda una demo',
    desc: 'Cuéntanos tu negocio en 30 minutos. Sin compromiso, sin letra pequeña.',
  },
  {
    icon: CreditCard,
    title: 'Setup y pago',
    desc: 'Abonas el setup único y configuramos toda la infraestructura de tu empleado IA en 48 horas.',
  },
  {
    icon: Zap,
    title: 'Tu equipo entra en acción',
    desc: 'Tu empleado empieza a trabajar. Tú supervisas, apruebas y te dedicas a lo que importa.',
  },
]

// ── Employees ──
const employees = [
  {
    id: 'recepcionista',
    name: 'La Recepcionista',
    icon: MessageSquare,
    color: '#7c6fff',
    bg: 'rgba(124,111,255,0.12)',
    pitch: 'Tu embajadora de marca 24/7. Recibe a cada persona con empatía instantánea y la guía hacia tu agenda sin que muevas un dedo.',
    pain: 'Pierdes clientes por no responder a tiempo y el estrés de ver mensajes acumularse mientras intentas trabajar o descansar.',
    solution: 'Atención inmediata y cálida. Filtra a los curiosos y solo te entrega en tu calendario a las personas listas para hablar contigo.',
    setup: 450,
    monthly: 249,
  },
  {
    id: 'gestor',
    name: 'El Gestor',
    icon: Settings,
    color: '#818cf8',
    bg: 'rgba(129,140,248,0.12)',
    pitch: 'El guardián de tus procesos. Asegura que la energía de tu negocio —el dinero y los accesos— fluya sin cuellos de botella.',
    pain: 'La incomodidad de cobrar facturas atrasadas y el trabajo manual y repetitivo de dar altas y bajas en tus plataformas.',
    solution: 'Flujo de caja automático y sin fricción. Gestiona cobros, accesos y correos con precisión milimétrica.',
    setup: 450,
    monthly: 199,
  },
  {
    id: 'ingeniero',
    name: 'El Ingeniero',
    icon: Wrench,
    color: '#34d399',
    bg: 'rgba(52,211,153,0.12)',
    pitch: 'Tu analista de cabecera. Escucha tus reuniones, extrae el "oro" de la conversación y atiende a tus clientes con precisión técnica.',
    pain: 'Olvidar detalles clave de reuniones de ventas y saturación por tickets de soporte que consumen tu tiempo creativo.',
    solution: 'Memoria absoluta. Transforma charlas en propuestas estructuradas y resuelve las dudas técnicas de tus clientes al instante.',
    setup: 450,
    monthly: 249,
  },
  {
    id: 'content',
    name: 'El Content Manager',
    icon: PenLine,
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.12)',
    pitch: 'Tu estratega de visibilidad. Se sienta contigo a rebotar ideas y aterriza tu visión en un plan de acción claro y constante.',
    pain: 'El síndrome de la página en blanco: sabes que tienes que publicar pero no tienes tiempo ni estrategia.',
    solution: 'Consistencia sin esfuerzo. Traduce tu visión en un calendario semanal magnético con mensajes que resuenan con tu audiencia.',
    setup: 450,
    monthly: 199,
  },
  {
    id: 'disenador',
    name: 'El Diseñador',
    icon: Palette,
    color: '#ec4899',
    bg: 'rgba(236,72,153,0.12)',
    pitch: 'El artista residente. Da vida visual a las palabras de tu equipo de marketing en segundos.',
    pain: 'Depender de bancos de imágenes aburridos o esperar días y pagar de más por diseños gráficos para redes sociales.',
    solution: 'Identidad visual al instante. Crea imágenes únicas y a medida que capturan la esencia de tu mensaje, listas para publicar.',
    setup: 450,
    monthly: 249,
  },
]

// ── Packages ──
const packages = [
  {
    id: 'motor',
    name: 'El Motor de Ventas',
    icon: TrendingUp,
    color: '#7c6fff',
    bg: 'rgba(124,111,255,0.15)',
    agents: ['La Recepcionista', 'El Gestor'],
    pitch: 'La dupla perfecta para que tu negocio nunca duerma. Uno atrae y agenda, el otro asegura el compromiso y el cobro.',
    pain: '"Entra gente pero no compran, y los que compran me quitan tiempo administrativo".',
    solution: 'Un embudo invisible y automático. Desde el primer "Hola" en Instagram hasta el cobro final en Stripe, todo ocurre sin tu intervención.',
    setup: 500,
    monthly: 380,
    saving: 68,
    featured: false,
  },
  {
    id: 'empresa',
    name: 'La Empresa Autónoma',
    icon: Building2,
    color: '#34d399',
    bg: 'rgba(52,211,153,0.15)',
    agents: ['Los 5 Agentes'],
    pitch: 'Tu junta directiva operativa. Entrégales la maquinaria del negocio y recupera tu rol de CEO: pensar, dirigir y disfrutar del proceso.',
    pain: 'Agotamiento total. Eres el cuello de botella de tu propia empresa porque si tú no empujas, nada se mueve.',
    solution: 'Delegación total de las áreas operativas. Un ecosistema que funciona de manera autónoma por menos de lo que cuesta un solo empleado en nómina.',
    setup: 1200,
    monthly: 760,
    saving: 435,
    featured: true,
  },
  {
    id: 'marketing',
    name: 'El Dpto. de Marketing',
    icon: Sparkles,
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.15)',
    agents: ['Content Manager', 'El Diseñador'],
    pitch: 'Tu agencia creativa interna. Se comunican entre ellos para que tu marca esté viva, presente y brillante todos los días en internet.',
    pain: '"Mi competencia publica todos los días y yo me estoy quedando atrás por falta de tiempo".',
    solution: 'Presencia digital constante y profesional. Ideas, textos e imágenes generadas en armonía para que tú solo tengas que dar el "Ok".',
    setup: 500,
    monthly: 380,
    saving: 68,
    featured: false,
  },
]

// ── Payment items ──
const paymentItems = [
  {
    icon: CreditCard,
    title: 'Setup único',
    desc: 'Un pago de configuración inicial que cubre toda la arquitectura técnica de tu empleado. Se puede fraccionar en hasta 3 meses.',
  },
  {
    icon: RefreshCcw,
    title: 'Suscripción mensual',
    desc: 'El "salario" de tu empleado IA. Se cobra automáticamente cada mes vía Stripe. Puedes cancelar cuando quieras.',
  },
  {
    icon: ShieldCheck,
    title: 'Pago seguro con Stripe',
    desc: 'Toda la facturación pasa por Stripe, el estándar de pagos en internet. Tarjeta, transferencia o domiciliación.',
  },
]

// ── FAQs ──
const faqs = [
  {
    q: '¿En qué plataformas trabajan los empleados IA?',
    a: 'Nuestros agentes están conectados a WhatsApp Business API, Instagram DMs y LinkedIn. La Recepcionista puede atender en las tres simultáneamente. El resto de agentes trabajan dentro de tu panel de control y se integran con tus herramientas actuales.',
  },
  {
    q: '¿Cuánto tarda en estar listo mi empleado IA?',
    a: 'El proceso de configuración e integración suele completarse en 48 horas hábiles desde que se realiza el pago del setup. Ese tiempo lo usamos para personalizar la personalidad, los flujos y conectar tus cuentas.',
  },
  {
    q: '¿Puedo contratar solo un empleado y añadir más después?',
    a: 'Sí, completamente. Puedes empezar con un único empleado y ampliar tu equipo cuando lo necesites. Los paquetes simplemente ofrecen un precio más ventajoso al contratar varios a la vez.',
  },
  {
    q: '¿Necesito conocimientos técnicos para usarlo?',
    a: 'Para nada. El panel de control está diseñado para que cualquier persona sin perfil técnico pueda usarlo con comodidad. Nosotros nos encargamos de toda la infraestructura.',
  },
  {
    q: '¿Puedo cancelar la suscripción en cualquier momento?',
    a: 'Sí. No existe permanencia mínima. Si decides cancelar, solo tienes que avisarnos con un mes de antelación. El pago del setup no es reembolsable, ya que cubre trabajo realizado.',
  },
  {
    q: '¿Qué ocurre con mis datos y los de mis clientes?',
    a: 'Todos los datos se almacenan en servidores seguros de MongoDB Atlas en la Unión Europea. No compartimos información con terceros y cumplimos con el RGPD. Puedes consultar nuestra Política de Privacidad para más detalles.',
  },
  {
    q: '¿Los empleados IA hablan solo español?',
    a: 'La Recepcionista puede configurarse para atender en varios idiomas, incluyendo español e inglés. El resto de agentes trabajan principalmente en español, aunque podemos adaptarlos a tus necesidades.',
  },
  {
    q: '¿Qué pasa si el empleado IA comete un error?',
    a: 'Los agentes están configurados para escalar situaciones complejas o dudosas directamente a ti. Tú tienes siempre el control y la última palabra. Además, revisan constantemente su rendimiento para mejorar.',
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

// ── How it works ────────────────────────
.how {
  padding: $space-16 0;
  background: $bg-surface;
  border-top: 1px solid $border;
  border-bottom: 1px solid $border;

  &__steps {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: $space-6;
  }

  &__step {
    text-align: center;
    padding: $space-6;
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

  &__step-num {
    width: 32px;
    height: 32px;
    border-radius: $radius-full;
    background: $primary-subtle;
    border: 1px solid rgba(124,111,255,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: $text-sm;
    font-weight: $fw-bold;
    color: $primary-light;
  }

  &__step-icon {
    color: $primary;
  }

  &__step-title {
    font-size: $text-base;
    font-weight: $fw-semibold;
    color: $text;
  }

  &__step-desc {
    font-size: $text-sm;
    line-height: 1.6;
    text-align: center;
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
  }

  &__tab {
    display: flex;
    align-items: center;
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

  &__footnote {
    display: flex;
    align-items: flex-start;
    gap: $space-2;
    justify-content: center;
    margin-top: $space-8;
    font-size: $text-sm;
    color: $text-subtle;
    text-align: center;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;

    svg { flex-shrink: 0; margin-top: 2px; }
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
    color: $text-subtle;
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
    color: $text-subtle;
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

// ── Payment ─────────────────────────────
.payment {
  padding: $space-16 0;
  background: $bg-surface;
  border-top: 1px solid $border;
  border-bottom: 1px solid $border;

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: $space-5;
  }

  &__card {
    background: $bg-card;
    border: 1px solid $border;
    border-radius: $radius-lg;
    padding: $space-6;
    display: flex;
    flex-direction: column;
    gap: $space-3;
    transition: $transition;

    &:hover { border-color: $border-hover; }

    &-icon {
      width: 44px;
      height: 44px;
      border-radius: $radius;
      background: $primary-subtle;
      border: 1px solid rgba(124,111,255,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      color: $primary;
    }

    &-title {
      font-size: $text-base;
      font-weight: $fw-semibold;
      color: $text;
    }

    &-desc {
      font-size: $text-sm;
      line-height: 1.6;
    }
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
  padding: $space-20 0;
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

// ── Transitions ─────────────────────────
.fade-slide-enter-active,
.fade-slide-leave-active { transition: all 0.2s ease; }
.fade-slide-enter-from   { opacity: 0; transform: translateY(10px); }
.fade-slide-leave-to     { opacity: 0; transform: translateY(-10px); }
</style>
