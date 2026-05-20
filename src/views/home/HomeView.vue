<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero__bg">
        <div class="hero__glow hero__glow--blue" aria-hidden="true" />
        <div class="hero__glow hero__glow--orange" aria-hidden="true" />
        <div class="hero__grid" aria-hidden="true" />
      </div>

      <div class="container hero__container">
        <div class="hero__content">
          <div class="hero__badge">
            <Sparkles :size="14" />
            <span>Empleados IA para emprendedores y autonomos</span>
          </div>

          <h1 class="hero__title">
            <span class="hero__title-line">Tu equipo de IA.</span>
            <span class="hero__title-line hero__title-gradient">Listo para trabajar.</span>
          </h1>

          <p class="hero__subtitle">
            Cuatro empleados con inteligencia artificial que atienden clientes, organizan tu agenda, 
            crean contenido y analizan tu negocio. Activos en 7 dias, sin contratar personal.
          </p>

          <div class="hero__actions">
            <a :href="calLink" target="_blank" rel="noopener noreferrer" class="btn btn--primary">
              <CalendarCheck :size="18" />
              Agendar demo gratuita
            </a>
            <RouterLink to="/bolsa-de-empleo" class="btn btn--secondary">
              <Users :size="18" />
              Conocer al equipo
            </RouterLink>
          </div>

          <div class="hero__stats">
            <div class="hero__stat">
              <span class="hero__stat-value">7</span>
              <span class="hero__stat-label">dias para empezar</span>
            </div>
            <div class="hero__stat-divider" />
            <div class="hero__stat">
              <span class="hero__stat-value">24/7</span>
              <span class="hero__stat-label">disponibilidad</span>
            </div>
            <div class="hero__stat-divider" />
            <div class="hero__stat">
              <span class="hero__stat-value">0</span>
              <span class="hero__stat-label">permanencia</span>
            </div>
          </div>
        </div>

        <!-- Showcase Panel Below -->
        <div class="hero__showcase">
          <div class="showcase-panel">
            <div class="showcase-panel__header">
              <div class="showcase-panel__status" />
              <span>DigiNode Employee OS</span>
              <span class="showcase-panel__live">En vivo</span>
            </div>
            
            <div class="showcase-panel__chat">
              <div class="chat-msg chat-msg--user">
                <div class="chat-msg__avatar chat-msg__avatar--user">Tu</div>
                <div class="chat-msg__content">
                  <p>Alex, prepara el resumen de la reunion y convierte las decisiones en tareas.</p>
                </div>
              </div>
              <div class="chat-msg chat-msg--ai">
                <div class="chat-msg__avatar" style="background: rgba(96, 176, 255, 0.15); color: #60B0FF;">AX</div>
                <div class="chat-msg__content">
                  <span class="chat-msg__name">Alex - Asistente ejecutivo</span>
                  <p>Minuta creada, 6 tareas detectadas, 2 decisiones requieren tu aprobacion.</p>
                </div>
              </div>
            </div>

            <div class="showcase-panel__employees">
              <div v-for="emp in employees" :key="emp.id" class="employee-chip" :style="{ '--emp-color': emp.color, '--emp-bg': emp.bg }">
                <span class="employee-chip__avatar">{{ emp.initials }}</span>
                <div class="employee-chip__info">
                  <strong>{{ emp.name }}</strong>
                  <small>{{ emp.role }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Trust Bar -->
    <section class="trust-bar">
      <div class="container trust-bar__inner">
        <div v-for="item in trustItems" :key="item.text" class="trust-bar__item">
          <component :is="item.icon" :size="20" />
          <span>{{ item.text }}</span>
        </div>
      </div>
    </section>

    <!-- Problem Section -->
    <section class="problem section">
      <div class="container">
        <div class="problem__header">
          <span class="kicker">El problema</span>
          <h2>No es que trabajes poco.<br/><span class="gradient-text">Es que haces trabajo que no es tuyo.</span></h2>
        </div>

        <div class="problem__grid">
          <div class="problem__card problem__card--old">
            <div class="problem__card-label">
              <XCircle :size="16" />
              Agente IA clasico
            </div>
            <ul>
              <li>Automatiza una accion puntual</li>
              <li>Depende de prompts y configuracion tecnica</li>
              <li>Vive dentro de una herramienta especifica</li>
              <li>No acumula criterio operativo</li>
            </ul>
          </div>

          <div class="problem__card problem__card--new">
            <div class="problem__card-label">
              <CheckCircle :size="16" />
              Empleado IA DigiNode
            </div>
            <ul>
              <li>Tiene rol, objetivos y responsabilidades</li>
              <li>Trabaja desde WhatsApp, Telegram y docs</li>
              <li>Aprende de interacciones con jefe y clientes</li>
              <li>Opera con memoria, limites y supervision</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Employees Section -->
    <section id="empleados" class="employees section">
      <div class="container">
        <div class="employees__header">
          <span class="kicker">Tu nuevo equipo</span>
          <h2>Cuatro puestos pensados para<br/><span class="gradient-text">quitarte el trabajo que te ahoga.</span></h2>
          <p>Contrata uno, dos o los cuatro. Cada empleado se configura con tus documentos, tu tono y tus protocolos en 7 dias.</p>
        </div>

        <div class="employees__grid">
          <article v-for="emp in employees" :key="emp.id" class="employee-card" :style="{ '--emp-color': emp.color, '--emp-bg': emp.bg }">
            <div class="employee-card__header">
              <div class="employee-card__avatar">{{ emp.initials }}</div>
              <div>
                <h3>{{ emp.name }}</h3>
                <span class="employee-card__role">{{ emp.role }}</span>
              </div>
            </div>
            
            <p class="employee-card__pitch">{{ emp.pitch }}</p>
            
            <div class="employee-card__channels">
              <span v-for="channel in emp.channels" :key="channel">{{ channel }}</span>
            </div>
            
            <ul class="employee-card__tasks">
              <li v-for="task in emp.tasks" :key="task">
                <CheckCircle :size="14" />
                {{ task }}
              </li>
            </ul>
          </article>
        </div>
      </div>
    </section>

    <!-- How it Works -->
    <section class="workflow section">
      <div class="container">
        <div class="workflow__header">
          <span class="kicker">Como funciona</span>
          <h2>Hablas como hablarias con un humano.<br/><span class="gradient-text">Recibes trabajo terminado.</span></h2>
          <p>Sin prompts, sin paneles complicados. Mandas un audio o mensaje y te devuelven documentos, respuestas y tareas listas.</p>
        </div>

        <div class="workflow__steps">
          <div v-for="(step, index) in workflowSteps" :key="step.title" class="workflow__step">
            <div class="workflow__step-number">{{ String(index + 1).padStart(2, '0') }}</div>
            <div class="workflow__step-icon">
              <component :is="step.icon" :size="24" />
            </div>
            <h3>{{ step.title }}</h3>
            <p>{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section id="precios" class="pricing section">
      <div class="container">
        <div class="pricing__header">
          <span class="kicker">Planes</span>
          <h2>Empieza por tu dolor mas urgente.<br/><span class="gradient-text">Crece cuando lo necesites.</span></h2>
          <p>Setup incluido. Sin permanencia. Sin migrar de herramienta.</p>
        </div>

        <div class="pricing__grid">
          <article v-for="plan in plans" :key="plan.id" class="plan-card" :class="{ 'plan-card--featured': plan.featured }">
            <div v-if="plan.featured" class="plan-card__badge">
              <Star :size="12" />
              Mas completo
            </div>
            
            <div class="plan-card__header">
              <component :is="plan.icon" :size="24" class="plan-card__icon" />
              <div>
                <h3>{{ plan.name }}</h3>
                <span>{{ plan.target }}</span>
              </div>
            </div>

            <ul class="plan-card__features">
              <li v-for="feature in plan.features" :key="feature">
                <CheckCircle :size="14" />
                {{ feature }}
              </li>
            </ul>

            <div class="plan-card__price">
              <span class="plan-card__amount">{{ plan.price }}&euro;</span>
              <span class="plan-card__period">/mes</span>
            </div>

            <RouterLink to="/bolsa-de-empleo" class="btn" :class="plan.featured ? 'btn--primary' : 'btn--secondary'">
              <Zap :size="17" />
              Empezar con {{ plan.name }}
            </RouterLink>
          </article>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section id="faq" class="faq section">
      <div class="container">
        <div class="faq__header">
          <span class="kicker">Preguntas frecuentes</span>
          <h2>Antes de incorporar a tu<br/><span class="gradient-text">primer empleado IA.</span></h2>
        </div>

        <div class="faq__list">
          <button
            v-for="(item, index) in faqs"
            :key="item.q"
            class="faq__item"
            :class="{ 'faq__item--open': openFaq === index }"
            @click="openFaq = openFaq === index ? null : index"
          >
            <span class="faq__question">
              {{ item.q }}
              <ChevronDown :size="20" class="faq__chevron" />
            </span>
            <Transition name="faq-answer">
              <span v-if="openFaq === index" class="faq__answer">{{ item.a }}</span>
            </Transition>
          </button>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="final-cta">
      <div class="container">
        <div class="final-cta__box">
          <div class="final-cta__glow" aria-hidden="true" />
          <span class="kicker">Demo gratuita</span>
          <h2>Imagina tu proximo lunes<br/><span class="gradient-text">sin hacerlo todo tu.</span></h2>
          <p>30 minutos. Te ensenamos como configuramos un empleado con tu negocio real, que hace desde el dia 1 y como apruebas lo que ejecuta.</p>
          
          <div class="final-cta__actions">
            <a :href="calLink" target="_blank" rel="noopener noreferrer" class="btn btn--primary btn--lg">
              <CalendarCheck :size="20" />
              Agendar demo gratuita
            </a>
            <a
              href="https://wa.me/34604822385?text=Hola%2C%20quiero%20ver%20c%C3%B3mo%20funciona%20un%20empleado%20IA"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn--secondary btn--lg"
            >
              <MessageSquare :size="20" />
              Escribir por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  Brain,
  Building2,
  CalendarCheck,
  CheckCircle,
  ChevronDown,
  Clock,
  CreditCard,
  Eye,
  FileText,
  Lock,
  MessageSquare,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Workflow,
  XCircle,
  Zap,
} from 'lucide-vue-next'

const calLink = import.meta.env.VITE_CAL_BOOKING_LINK || '#'
const openFaq = ref(null)

const trustItems = [
  { icon: ShieldCheck, text: 'Trabajan con tu criterio' },
  { icon: Eye, text: 'Tu apruebas, ellos ejecutan' },
  { icon: Brain, text: 'Aprenden tu negocio' },
  { icon: Clock, text: 'Disponibles 24/7' },
]

const employees = [
  {
    id: 'alex',
    initials: 'AX',
    name: 'Alex',
    role: 'Asistente ejecutivo',
    color: '#60B0FF',
    bg: 'rgba(96, 176, 255, 0.12)',
    pitch: 'Convierte instrucciones, reuniones y notas dispersas en agenda, documentos y seguimiento operativo.',
    channels: ['WhatsApp', 'Telegram', 'Docs', 'Email'],
    tasks: [
      'Prepara minutas, briefs, propuestas y resumenes',
      'Organiza prioridades y seguimiento semanal',
      'Aprende tus criterios de decision',
    ],
  },
  {
    id: 'nora',
    initials: 'NO',
    name: 'Nora',
    role: 'Recepcionista',
    color: '#F5A623',
    bg: 'rgba(245, 166, 35, 0.12)',
    pitch: 'Atiende clientes, filtra solicitudes, agenda reuniones y mantiene conversaciones con el tono de tu marca.',
    channels: ['WhatsApp', 'Telegram', 'Instagram DM', 'Calendar'],
    tasks: [
      'Responde preguntas frecuentes con protocolos',
      'Cualifica contactos antes de pasarlos a ventas',
      'Gestiona reservas, cambios y recordatorios',
    ],
  },
  {
    id: 'valeria',
    initials: 'VA',
    name: 'Valeria',
    role: 'Content creator',
    color: '#20D5D2',
    bg: 'rgba(32, 213, 210, 0.12)',
    pitch: 'Transforma ideas, audios, conversaciones y documentos en contenido publicable para tus canales.',
    channels: ['Docs', 'LinkedIn', 'Instagram', 'Email'],
    tasks: [
      'Crea posts, guiones, emails y articulos',
      'Reutiliza ideas en multiples formatos',
      'Detecta temas desde conversaciones con clientes',
    ],
  },
  {
    id: 'marcos',
    initials: 'MA',
    name: 'Marcos',
    role: 'Analista de negocio',
    color: '#FF6B6B',
    bg: 'rgba(255, 107, 107, 0.12)',
    pitch: 'Detecta clientes en riesgo, leads que se enfriaron y patrones ocultos en tus datos.',
    channels: ['Telegram', 'Email', 'CRM', 'Informes'],
    tasks: [
      'Reporte semanal con hallazgos y recomendaciones',
      'Analiza leads frios y por que se perdieron',
      'Detecta clientes en riesgo antes de que se vayan',
    ],
  },
]

const workflowSteps = [
  {
    icon: MessageSquare,
    title: 'Pides algo natural',
    description: 'Envias un audio, mensaje o documento por el canal que ya usas.',
  },
  {
    icon: Workflow,
    title: 'Aplica tus protocolos',
    description: 'El empleado cruza la peticion con tono, limites, fuentes y contexto.',
  },
  {
    icon: FileText,
    title: 'Entrega trabajo',
    description: 'Crea documentos, respuestas, tareas o resumenes listos para revisar.',
  },
  {
    icon: Brain,
    title: 'Aprende del resultado',
    description: 'Guarda preferencias y patrones para responder mejor la proxima vez.',
  },
]

const plans = [
  {
    id: 'individual',
    name: 'Un empleado',
    target: 'Empieza por tu dolor mas urgente',
    icon: CreditCard,
    price: 150,
    featured: false,
    features: [
      '1 empleado IA configurado con tu tono y criterio',
      'WhatsApp o Telegram como canal principal',
      'Documentos, protocolos y memoria inicial',
      'Sin permanencia - pausa cuando quieras',
    ],
  },
  {
    id: 'operativo',
    name: 'Operacion Solo',
    target: 'Recupera tus tardes y domingos',
    icon: Building2,
    price: 300,
    featured: false,
    features: [
      'Nora (recepcionista) + Alex (asistente)',
      'Atencion al cliente y operativa diaria resueltas',
      'Web profesional incluida los primeros 6 meses',
      'Activo en 7 dias - sin migrar herramienta',
    ],
  },
  {
    id: 'completo',
    name: 'Equipo Solopreneur',
    target: 'Tu negocio entero, sin contratar',
    icon: Sparkles,
    price: 500,
    featured: true,
    features: [
      'Los 4 empleados IA trabajando en paralelo',
      'Atencion, operativa, contenido y ventas',
      'Aprenden de tus interacciones cada semana',
      'Panel central con trazabilidad completa',
    ],
  },
]

const faqs = [
  {
    q: 'Esto sustituye contratar a una persona?',
    a: 'En las tareas repetitivas, si - y por una fraccion del coste. En decisiones complejas, no: ahi decides tu. La idea no es eliminar al humano, es que tu dejes de ser el humano que contesta WhatsApp un domingo.',
  },
  {
    q: 'Y si contesta algo que yo no firmaria?',
    a: 'Durante el onboarding definimos exactamente que puede decir, que debe preguntar y cuando escalar. Las decisiones sensibles siempre pasan por ti antes de salir. Cada mensaje queda trazado y revisable.',
  },
  {
    q: 'Tengo que aprender una herramienta nueva?',
    a: 'No. Hablas con tus empleados por WhatsApp o Telegram como hablarias con un humano. Sin prompts, sin configuracion compleja. El panel solo lo abres cuando quieres revisar algo.',
  },
  {
    q: 'Cuanto tarda en estar funcionando?',
    a: '7 dias desde que firmas hasta que tu primer empleado esta operando. En ese tiempo definimos su puesto, conectamos canales, cargamos tus documentos y probamos conversaciones reales.',
  },
  {
    q: 'Y si necesito pausarlo o cambiar algo?',
    a: 'Sin permanencia. Lo pausas o cancelas cuando quieras. Cambiar tono, protocolos o tareas se hace en horas, no en semanas.',
  },
]
</script>

<style lang="scss" scoped>
// ── Variables locales ──
$hero-height: min(100vh, 900px);

// ── Kicker utility ──
.kicker {
  display: inline-flex;
  align-items: center;
  gap: $space-2;
  padding: $space-2 $space-4;
  background: $primary-subtle;
  border: 1px solid rgba($primary, 0.2);
  border-radius: $radius-full;
  font-size: $text-sm;
  font-weight: $fw-medium;
  color: $primary-light;
  margin-bottom: $space-4;
}

.gradient-text {
  background: linear-gradient(135deg, $primary 0%, $accent 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

// ── Buttons ──
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: $space-2;
  padding: $space-3 $space-6;
  font-size: $text-sm;
  font-weight: $fw-semibold;
  border-radius: $radius;
  border: none;
  cursor: pointer;
  transition: $transition-slow;
  text-decoration: none;

  &--primary {
    background: linear-gradient(135deg, $primary 0%, $primary-dark 100%);
    color: $text-inverse;
    box-shadow: 0 4px 20px rgba($primary, 0.3), 0 0 40px rgba($primary, 0.15);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba($primary, 0.4), 0 0 60px rgba($primary, 0.2);
      color: $text-inverse;
    }
  }

  &--secondary {
    background: transparent;
    border: 1px solid $border-hover;
    color: $text;

    &:hover {
      border-color: $primary;
      background: $primary-subtle;
      color: $text;
    }
  }

  &--lg {
    padding: $space-4 $space-8;
    font-size: $text-base;
  }
}

// ── Hero Section ──
.hero {
  position: relative;
  min-height: $hero-height;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $space-24 0;
  overflow: hidden;

  @media (max-width: $bp-lg) {
    padding: $space-16 0;
    min-height: auto;
  }

  &__bg {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
  }

  &__grid {
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(rgba($primary, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba($primary, 0.03) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse 80% 50% at 50% 0%, black 40%, transparent 100%);
  }

  &__glow {
    position: absolute;
    border-radius: 50%;
    filter: blur(120px);
    opacity: 0.6;

    &--blue {
      width: 600px;
      height: 600px;
      background: $primary;
      top: -200px;
      left: 50%;
      transform: translateX(-50%);
      opacity: 0.15;
    }

    &--orange {
      width: 500px;
      height: 500px;
      background: $accent;
      bottom: -150px;
      left: 50%;
      transform: translateX(-50%);
      opacity: 0.12;
    }
  }

  &__container {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: $space-12;
    width: 100%;

    @media (max-width: $bp-lg) {
      flex-direction: column;
      text-align: center;
    }
  }

  &__content {
    max-width: 560px;
    text-align: left;

    @media (max-width: $bp-lg) {
      text-align: center;
      max-width: 100%;
    }
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    gap: $space-2;
    padding: $space-2 $space-4;
    background: rgba($accent, 0.1);
    border: 1px solid rgba($accent, 0.25);
    border-radius: $radius-full;
    font-size: $text-sm;
    font-weight: $fw-medium;
    color: $accent-light;
    margin-bottom: $space-6;
  }

  &__title {
    font-size: clamp($text-4xl, 5vw, $text-6xl);
    font-weight: $fw-black;
    line-height: 1.1;
    margin-bottom: $space-6;

    &-line {
      display: block;
    }

    &-gradient {
      background: linear-gradient(135deg, $primary 0%, $accent 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  &__subtitle {
    font-size: $text-lg;
    color: $text-muted;
    line-height: 1.7;
    margin-bottom: $space-8;
    max-width: 500px;

    @media (max-width: $bp-lg) {
      margin-left: auto;
      margin-right: auto;
    }
  }

  &__actions {
    display: flex;
    gap: $space-4;
    margin-bottom: $space-10;

    @media (max-width: $bp-lg) {
      justify-content: center;
    }

    @media (max-width: $bp-sm) {
      flex-direction: column;
      align-items: center;
    }
  }

  &__stats {
    display: flex;
    align-items: center;
    gap: $space-6;

    @media (max-width: $bp-lg) {
      justify-content: center;
    }

    @media (max-width: $bp-sm) {
      flex-wrap: wrap;
      gap: $space-4;
    }
  }

  &__stat {
    display: flex;
    flex-direction: column;

    &-value {
      font-family: $font-display;
      font-size: $text-2xl;
      font-weight: $fw-bold;
      color: $text;
    }

    &-label {
      font-size: $text-sm;
      color: $text-muted;
    }

    &-divider {
      width: 1px;
      height: 40px;
      background: $border;

      @media (max-width: $bp-sm) {
        display: none;
      }
    }
  }

  &__showcase {
    flex-shrink: 0;

    @media (max-width: $bp-lg) {
      margin-top: $space-8;
    }
  }
}

// ── Showcase Panel ──
.showcase-panel {
  width: 420px;
  background: rgba($bg-card, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid $border;
  border-radius: $radius-lg;
  overflow: hidden;
  box-shadow: $shadow-lg, $shadow-glow-blue;

  @media (max-width: $bp-sm) {
    width: 100%;
    max-width: 380px;
  }

  &__header {
    display: flex;
    align-items: center;
    gap: $space-2;
    padding: $space-3 $space-4;
    background: $bg-surface;
    border-bottom: 1px solid $border;
    font-size: $text-sm;
    color: $text-muted;
  }

  &__status {
    width: 8px;
    height: 8px;
    background: $success;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  &__live {
    margin-left: auto;
    padding: $space-1 $space-2;
    background: rgba($success, 0.1);
    border-radius: $radius-sm;
    font-size: $text-xs;
    color: $success;
  }

  &__chat {
    padding: $space-4;
    display: flex;
    flex-direction: column;
    gap: $space-3;
  }

  &__employees {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: $space-2;
    padding: $space-4;
    border-top: 1px solid $border;
    background: $bg-surface;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

// ── Chat Messages ──
.chat-msg {
  display: flex;
  gap: $space-3;

  &__avatar {
    width: 32px;
    height: 32px;
    border-radius: $radius;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: $text-xs;
    font-weight: $fw-bold;
    flex-shrink: 0;

    &--user {
      background: rgba($accent, 0.15);
      color: $accent;
    }
  }

  &__content {
    flex: 1;

    p {
      font-size: $text-sm;
      color: $text;
      line-height: 1.5;
    }
  }

  &__name {
    display: block;
    font-size: $text-xs;
    color: $text-muted;
    margin-bottom: $space-1;
  }
}

// ── Employee Chip ──
.employee-chip {
  display: flex;
  align-items: center;
  gap: $space-2;
  padding: $space-2;
  background: var(--emp-bg);
  border-radius: $radius;
  border: 1px solid rgba(255, 255, 255, 0.05);

  &__avatar {
    width: 28px;
    height: 28px;
    background: var(--emp-bg);
    color: var(--emp-color);
    border-radius: $radius-sm;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: $text-xs;
    font-weight: $fw-bold;
  }

  &__info {
    display: flex;
    flex-direction: column;
    line-height: 1.2;

    strong {
      font-size: $text-xs;
      color: $text;
    }

    small {
      font-size: 10px;
      color: $text-muted;
    }
  }
}

// ── Trust Bar ──
.trust-bar {
  background: $bg-surface;
  border-top: 1px solid $border;
  border-bottom: 1px solid $border;
  padding: $space-6 0;

  &__inner {
    display: flex;
    justify-content: center;
    gap: $space-10;
    flex-wrap: wrap;

    @media (max-width: $bp-md) {
      gap: $space-6;
    }
  }

  &__item {
    display: flex;
    align-items: center;
    gap: $space-2;
    font-size: $text-sm;
    color: $text-muted;

    svg {
      color: $primary;
    }
  }
}

// ── Problem Section ──
.problem {
  &__header {
    text-align: center;
    margin-bottom: $space-12;

    h2 {
      font-size: clamp($text-2xl, 4vw, $text-4xl);
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: $space-6;
    max-width: 900px;
    margin: 0 auto;

    @media (max-width: $bp-md) {
      grid-template-columns: 1fr;
    }
  }

  &__card {
    padding: $space-8;
    border-radius: $radius-lg;
    border: 1px solid $border;

    &--old {
      background: rgba($danger, 0.03);
      border-color: rgba($danger, 0.15);
    }

    &--new {
      background: rgba($primary, 0.03);
      border-color: rgba($primary, 0.2);
    }

    &-label {
      display: inline-flex;
      align-items: center;
      gap: $space-2;
      font-size: $text-sm;
      font-weight: $fw-semibold;
      margin-bottom: $space-4;
    }

    &--old &-label {
      color: $danger;
    }

    &--new &-label {
      color: $primary-light;
    }

    ul {
      display: flex;
      flex-direction: column;
      gap: $space-3;
    }

    li {
      font-size: $text-sm;
      color: $text-muted;
      padding-left: $space-4;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 8px;
        width: 6px;
        height: 6px;
        border-radius: 50%;
      }
    }

    &--old li::before {
      background: $danger;
      opacity: 0.5;
    }

    &--new li::before {
      background: $primary;
    }
  }
}

// ── Employees Section ──
.employees {
  &__header {
    text-align: center;
    margin-bottom: $space-12;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;

    h2 {
      font-size: clamp($text-2xl, 4vw, $text-4xl);
      margin-bottom: $space-4;
    }

    p {
      font-size: $text-lg;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: $space-6;

    @media (max-width: $bp-lg) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: $bp-sm) {
      grid-template-columns: 1fr;
    }
  }
}

// ── Employee Card ──
.employee-card {
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius-lg;
  padding: $space-6;
  transition: $transition-slow;

  &:hover {
    border-color: var(--emp-color);
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }

  &__header {
    display: flex;
    align-items: center;
    gap: $space-3;
    margin-bottom: $space-4;

    h3 {
      font-size: $text-lg;
      color: $text;
    }
  }

  &__avatar {
    width: 48px;
    height: 48px;
    background: var(--emp-bg);
    color: var(--emp-color);
    border-radius: $radius;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: $text-base;
    font-weight: $fw-bold;
  }

  &__role {
    font-size: $text-sm;
    color: var(--emp-color);
  }

  &__pitch {
    font-size: $text-sm;
    color: $text-muted;
    margin-bottom: $space-4;
    line-height: 1.6;
  }

  &__channels {
    display: flex;
    flex-wrap: wrap;
    gap: $space-1;
    margin-bottom: $space-4;

    span {
      padding: $space-1 $space-2;
      background: $bg-surface;
      border-radius: $radius-sm;
      font-size: $text-xs;
      color: $text-muted;
    }
  }

  &__tasks {
    display: flex;
    flex-direction: column;
    gap: $space-2;

    li {
      display: flex;
      align-items: flex-start;
      gap: $space-2;
      font-size: $text-sm;
      color: $text-muted;

      svg {
        color: var(--emp-color);
        flex-shrink: 0;
        margin-top: 2px;
      }
    }
  }
}

// ── Workflow Section ──
.workflow {
  background: $bg-surface;

  &__header {
    text-align: center;
    margin-bottom: $space-12;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;

    h2 {
      font-size: clamp($text-2xl, 4vw, $text-4xl);
      margin-bottom: $space-4;
    }

    p {
      font-size: $text-lg;
    }
  }

  &__steps {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: $space-6;

    @media (max-width: $bp-lg) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: $bp-sm) {
      grid-template-columns: 1fr;
    }
  }

  &__step {
    text-align: center;
    padding: $space-6;

    h3 {
      font-size: $text-lg;
      margin-bottom: $space-2;
    }

    p {
      font-size: $text-sm;
    }
  }

  &__step-number {
    font-family: $font-display;
    font-size: $text-xs;
    font-weight: $fw-bold;
    color: $primary;
    margin-bottom: $space-4;
  }

  &__step-icon {
    width: 56px;
    height: 56px;
    background: $primary-subtle;
    border: 1px solid rgba($primary, 0.2);
    border-radius: $radius-lg;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto $space-4;
    color: $primary;
  }
}

// ── Pricing Section ──
.pricing {
  &__header {
    text-align: center;
    margin-bottom: $space-12;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;

    h2 {
      font-size: clamp($text-2xl, 4vw, $text-4xl);
      margin-bottom: $space-4;
    }

    p {
      font-size: $text-lg;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: $space-6;
    max-width: 1100px;
    margin: 0 auto;

    @media (max-width: $bp-lg) {
      grid-template-columns: 1fr;
      max-width: 400px;
    }
  }
}

// ── Plan Card ──
.plan-card {
  position: relative;
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius-lg;
  padding: $space-8;
  display: flex;
  flex-direction: column;
  transition: $transition-slow;

  &:hover {
    border-color: $border-hover;
  }

  &--featured {
    border-color: $primary;
    background: linear-gradient(180deg, rgba($primary, 0.05) 0%, $bg-card 100%);
    box-shadow: $shadow-glow-blue;

    &:hover {
      border-color: $primary-light;
    }
  }

  &__badge {
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: $space-1;
    padding: $space-1 $space-3;
    background: linear-gradient(135deg, $primary 0%, $accent 100%);
    border-radius: $radius-full;
    font-size: $text-xs;
    font-weight: $fw-semibold;
    color: $text-inverse;
  }

  &__header {
    display: flex;
    align-items: center;
    gap: $space-3;
    margin-bottom: $space-6;

    h3 {
      font-size: $text-xl;
    }

    span {
      font-size: $text-sm;
      color: $text-muted;
    }
  }

  &__icon {
    color: $primary;
  }

  &__features {
    display: flex;
    flex-direction: column;
    gap: $space-3;
    margin-bottom: $space-6;
    flex: 1;

    li {
      display: flex;
      align-items: flex-start;
      gap: $space-2;
      font-size: $text-sm;
      color: $text-muted;

      svg {
        color: $primary;
        flex-shrink: 0;
        margin-top: 2px;
      }
    }
  }

  &__price {
    margin-bottom: $space-4;
  }

  &__amount {
    font-family: $font-display;
    font-size: $text-4xl;
    font-weight: $fw-bold;
    color: $text;
  }

  &__period {
    font-size: $text-base;
    color: $text-muted;
  }
}

// ── FAQ Section ──
.faq {
  &__header {
    text-align: center;
    margin-bottom: $space-12;

    h2 {
      font-size: clamp($text-2xl, 4vw, $text-4xl);
    }
  }

  &__list {
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: $space-3;
  }

  &__item {
    display: flex;
    flex-direction: column;
    width: 100%;
    text-align: left;
    background: $bg-card;
    border: 1px solid $border;
    border-radius: $radius;
    padding: $space-5 $space-6;
    cursor: pointer;
    transition: $transition;

    &:hover {
      border-color: $border-hover;
    }

    &--open {
      border-color: $primary;
      background: linear-gradient(180deg, rgba($primary, 0.03) 0%, $bg-card 100%);
    }
  }

  &__question {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: $space-4;
    font-size: $text-base;
    font-weight: $fw-semibold;
    color: $text;
  }

  &__chevron {
    color: $text-muted;
    transition: $transition;

    .faq__item--open & {
      transform: rotate(180deg);
      color: $primary;
    }
  }

  &__answer {
    margin-top: $space-4;
    padding-top: $space-4;
    border-top: 1px solid $border;
    font-size: $text-sm;
    color: $text-muted;
    line-height: 1.7;
  }
}

.faq-answer-enter-active,
.faq-answer-leave-active {
  transition: all 0.2s ease;
}

.faq-answer-enter-from,
.faq-answer-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

// ── Final CTA ──
.final-cta {
  padding: $space-24 0;

  &__box {
    position: relative;
    background: $bg-card;
    border: 1px solid $border;
    border-radius: $radius-xl;
    padding: $space-16;
    text-align: center;
    overflow: hidden;

    @media (max-width: $bp-md) {
      padding: $space-10 $space-6;
    }
  }

  &__glow {
    position: absolute;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba($primary, 0.15) 0%, transparent 70%);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  h2 {
    position: relative;
    font-size: clamp($text-2xl, 4vw, $text-4xl);
    margin-bottom: $space-4;
  }

  p {
    position: relative;
    font-size: $text-lg;
    max-width: 600px;
    margin: 0 auto $space-8;
  }

  &__actions {
    position: relative;
    display: flex;
    justify-content: center;
    gap: $space-4;
    flex-wrap: wrap;
  }
}
</style>
