<template>
  <div class="home">
    <section class="hero">
      <div class="hero__grid" aria-hidden="true" />
      <div class="hero__glow hero__glow--mint" aria-hidden="true" />
      <div class="hero__glow hero__glow--blue" aria-hidden="true" />

      <div class="container hero__inner">
        <div class="hero__copy">
          <div class="eyebrow">
            <Sparkles :size="14" />
            Empleados IA para solopreneurs y autónomos saturados
          </div>

          <h1>Tu negocio no debería depender de que tú estés despierto.</h1>

          <p class="hero__lead">
            Vendes, atiendes, facturas, creas contenido y contestas mensajes un
            domingo a las 23:00. Diginode te incorpora cuatro empleados IA con
            nombre, criterio y memoria — para que vuelvas a hacer solo el
            trabajo que solo tú puedes hacer.
          </p>

          <div class="hero__actions">
            <a :href="calLink" target="_blank" rel="noopener noreferrer" class="btn btn--primary">
              <CalendarCheck :size="18" />
              Ver una demo guiada
            </a>
            <RouterLink to="/bolsa-de-empleo" class="btn btn--secondary">
              <Users :size="18" />
              Conocer a tu equipo
            </RouterLink>
          </div>

          <div class="hero__assurance" aria-label="Garantías del servicio">
            <span><CheckCircle :size="15" /> Sin contratar personal</span>
            <span><CheckCircle :size="15" /> Activo en 7 días</span>
            <span><CheckCircle :size="15" /> Tú apruebas antes de que opere</span>
          </div>
        </div>

        <div class="ops-panel" aria-label="Vista operativa de empleados IA">
          <div class="ops-panel__topbar">
            <div>
              <span class="ops-panel__status" />
              Diginode Employee OS
            </div>
            <span>En directo</span>
          </div>

          <div class="ops-panel__main">
            <div class="ops-panel__chat">
              <div class="chat-message chat-message--boss">
                <span>Jefe</span>
                <p>Alex, prepara el resumen de la reunión y convierte las decisiones en tareas para esta semana.</p>
              </div>
              <div class="chat-message chat-message--employee">
                <span>Alex · Asistente ejecutivo</span>
                <p>He creado la minuta, detectado 6 tareas y marcado 2 decisiones que necesitan aprobación.</p>
              </div>
              <div class="ops-panel__input">
                <MessageSquare :size="16" />
                WhatsApp conectado
              </div>
            </div>

            <div class="ops-panel__side">
              <div class="work-card work-card--active">
                <FileText :size="18" />
                <div>
                  <strong>Minuta creada</strong>
                  <span>Google Docs · listo</span>
                </div>
              </div>
              <div class="work-card">
                <Brain :size="18" />
                <div>
                  <strong>Memoria actualizada</strong>
                  <span>3 aprendizajes nuevos</span>
                </div>
              </div>
              <div class="work-card">
                <ClipboardCheck :size="18" />
                <div>
                  <strong>Protocolos aplicados</strong>
                  <span>Atención, tono y límites</span>
                </div>
              </div>
            </div>
          </div>

          <div class="employee-dock">
            <div v-for="employee in employees" :key="employee.id" class="employee-pill">
              <span :style="{ background: employee.color }">{{ employee.initials }}</span>
              <div>
                <strong>{{ employee.name }}</strong>
                <small>{{ employee.role }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="confidence">
      <div class="container confidence__grid">
        <div v-for="item in confidence" :key="item.title" class="confidence__item">
          <component :is="item.icon" :size="22" />
          <strong>{{ item.title }}</strong>
          <span>{{ item.text }}</span>
        </div>
      </div>
    </section>

    <section class="difference section">
      <div class="container">
        <div class="section-heading section-heading--split">
          <div>
            <span class="kicker">La idea clave</span>
            <h2>No es que trabajes poco. Es que estás haciendo trabajo que no es tuyo.</h2>
          </div>
          <p>
            Un agente IA ejecuta una tarea. Un empleado IA Diginode entiende el
            puesto, aprende cómo trabajas y opera bajo protocolos que tú apruebas.
            La diferencia entre delegar una acción y delegar un rol.
          </p>
        </div>

        <div class="comparison">
          <div class="comparison__card comparison__card--muted">
            <div class="comparison__label">Agente IA clásico</div>
            <ul>
              <li>Automatiza una acción puntual</li>
              <li>Depende de prompts y ajustes técnicos</li>
              <li>Suele vivir dentro de una herramienta</li>
              <li>No acumula criterio operativo de forma clara</li>
            </ul>
          </div>

          <div class="comparison__card comparison__card--focus">
            <div class="comparison__label">Empleado IA Diginode</div>
            <ul>
              <li>Tiene rol, objetivos y responsabilidades</li>
              <li>Trabaja desde WhatsApp, Telegram y documentos</li>
              <li>Aprende de interacciones con jefe y clientes</li>
              <li>Opera con memoria, límites y supervisión</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section id="empleados" class="employees section">
      <div class="container">
        <div class="section-heading">
          <span class="kicker">Bolsa de empleo IA</span>
          <h2>Cuatro puestos pensados para quitarte de la mesa el trabajo que te ahoga.</h2>
          <p>Contrata uno, dos o los cuatro. Cada empleado se configura con tus documentos, tu tono y tus protocolos en 7 días.</p>
        </div>

        <div class="employee-grid">
          <article v-for="employee in employees" :key="employee.id" class="employee-card">
            <div class="employee-card__top">
              <div class="employee-card__avatar" :style="{ background: employee.color }">{{ employee.initials }}</div>
              <div>
                <h3>{{ employee.name }}</h3>
                <span>{{ employee.role }}</span>
              </div>
            </div>
            <p>{{ employee.pitch }}</p>
            <div class="employee-card__channels">
              <span v-for="channel in employee.channels" :key="channel">{{ channel }}</span>
            </div>
            <ul>
              <li v-for="task in employee.tasks" :key="task">
                <CheckCircle :size="14" />
                {{ task }}
              </li>
            </ul>
          </article>
        </div>
      </div>
    </section>

    <section class="workflow-section section">
      <div class="container">
        <div class="workflow-shell">
          <div class="section-heading">
            <span class="kicker">Cómo se siente delegar en ellos</span>
            <h2>Hablas como hablarías con un humano. Recibes trabajo terminado.</h2>
            <p>
              Sin prompts, sin paneles complicados, sin curva de aprendizaje. Mandas
              un audio o un mensaje y vuelven con documentos, respuestas y tareas
              listos para que solo tengas que decir "sí".
            </p>
          </div>

          <div class="workflow">
            <div v-for="(step, index) in workflow" :key="step.title" class="workflow__step">
              <div class="workflow__index">0{{ index + 1 }}</div>
              <component :is="step.icon" :size="24" />
              <h3>{{ step.title }}</h3>
              <p>{{ step.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="proof section">
      <div class="container proof__inner">
        <div class="proof__visual">
          <div class="document-stack">
            <div class="doc-card doc-card--front">
              <div class="doc-card__head">
                <FileText :size="18" />
                Informe semanal
              </div>
              <div class="doc-card__line doc-card__line--wide" />
              <div class="doc-card__line" />
              <div class="doc-card__line doc-card__line--short" />
              <div class="doc-card__decision">
                <ShieldCheck :size="16" />
                Requiere aprobación del jefe
              </div>
            </div>
            <div class="doc-card doc-card--back">
              <Brain :size="18" />
              Segundo cerebro actualizado
            </div>
            <div class="doc-card doc-card--third">
              <Send :size="18" />
              Respuesta preparada para cliente
            </div>
          </div>
        </div>

        <div class="proof__copy">
          <span class="kicker">El miedo del solopreneur</span>
          <h2>Tú decides. Ellos ejecutan. Nunca al revés.</h2>
          <p>
            La pregunta no es si la IA es capaz. Es si va a contestar algo que tú
            no firmarías. Por eso operan con protocolos que tú apruebas, memoria
            que tú revisas y puntos de confirmación cuando una decisión necesita
            tu criterio.
          </p>
          <div class="proof__checks">
            <span><Lock :size="16" /> Límites de actuación definidos</span>
            <span><Eye :size="16" /> Trazabilidad de tareas y documentos</span>
            <span><ShieldCheck :size="16" /> Aprobación humana en decisiones sensibles</span>
          </div>
        </div>
      </div>
    </section>

    <section class="plans section">
      <div class="container">
        <div class="section-heading">
          <span class="kicker">Formas de empezar</span>
          <h2>Empieza por tu dolor más urgente. Crece cuando lo necesites.</h2>
          <p>El setup convierte tu forma de trabajar en protocolos operativos. Sin permanencia. Sin migrar de herramienta.</p>
        </div>

        <div class="plans__grid">
          <article v-for="plan in plans" :key="plan.id" class="plan-card" :class="{ 'plan-card--featured': plan.featured }">
            <div v-if="plan.featured" class="plan-card__badge">
              <Star :size="13" />
              Más completo
            </div>
            <div class="plan-card__head">
              <component :is="plan.icon" :size="24" />
              <div>
                <h3>{{ plan.name }}</h3>
                <span>{{ plan.target }}</span>
              </div>
            </div>
            <ul>
              <li v-for="feature in plan.features" :key="feature">
                <CheckCircle :size="14" />
                {{ feature }}
              </li>
            </ul>
            <div class="plan-card__price">
              <strong>{{ plan.price }}€</strong>
              <span>/mes</span>
            </div>
            <RouterLink to="/bolsa-de-empleo" class="btn" :class="plan.featured ? 'btn--primary' : 'btn--secondary'">
              <Zap :size="17" />
              Ver {{ plan.name }}
            </RouterLink>
          </article>
        </div>
      </div>
    </section>

    <section id="faq" class="faq section">
      <div class="container faq__inner">
        <div class="section-heading">
          <span class="kicker">Lo que todo solopreneur pregunta</span>
          <h2>Antes de incorporar a tu primer empleado IA.</h2>
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
              <ChevronDown :size="18" />
            </span>
            <span v-if="openFaq === index" class="faq__answer">{{ item.a }}</span>
          </button>
        </div>
      </div>
    </section>

    <section class="final-cta">
      <div class="container">
        <div class="final-cta__box">
          <span class="kicker">Demo gratuita · sin compromiso</span>
          <h2>Imagina tu próximo lunes sin tener que hacerlo todo tú.</h2>
          <p>
            30 minutos. Te enseñamos cómo configuramos un empleado con tu
            negocio real, qué hace desde el día 1 y cómo apruebas lo que ejecuta.
            Si no es para ti, lo sabrás antes de que termine la llamada.
          </p>
          <div class="final-cta__actions">
            <a :href="calLink" target="_blank" rel="noopener noreferrer" class="btn btn--primary">
              <CalendarCheck :size="18" />
              Agendar demo
            </a>
            <a
              href="https://wa.me/34604822385?text=Hola%2C%20quiero%20ver%20c%C3%B3mo%20funciona%20un%20empleado%20IA"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn--secondary"
            >
              <MessageSquare :size="18" />
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
  ClipboardCheck,
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
  Zap,
} from 'lucide-vue-next'

const calLink = import.meta.env.VITE_CAL_BOOKING_LINK || '#'
const openFaq = ref(null)

const confidence = [
  {
    icon: ShieldCheck,
    title: 'Trabajan con tu criterio',
    text: 'Definimos qué pueden decir, qué deben preguntar y cuándo escalar. Nunca improvisan.',
  },
  {
    icon: Eye,
    title: 'Tú apruebas, ellos ejecutan',
    text: 'Cada documento, respuesta y decisión queda trazada y revisable desde tu panel.',
  },
  {
    icon: Brain,
    title: 'Aprenden tu negocio',
    text: 'Aprenden tu tono, tus precios y tus objeciones frecuentes. Más útiles cada semana.',
  },
  {
    icon: Clock,
    title: 'No paran cuando tú paras',
    text: 'Si te enfermas, viajas o desconectas, tu negocio sigue facturando.',
  },
]

const employees = [
  {
    id: 'alex',
    initials: 'AX',
    name: 'Alex',
    role: 'Asistente ejecutivo',
    color: '#9cffcb',
    pitch: 'Convierte instrucciones, reuniones y notas dispersas en agenda, documentos y seguimiento operativo.',
    channels: ['WhatsApp', 'Telegram', 'Docs', 'Email'],
    tasks: [
      'Prepara minutas, briefs, propuestas y resúmenes',
      'Organiza prioridades y seguimiento semanal',
      'Aprende tus criterios de decisión',
    ],
  },
  {
    id: 'nora',
    initials: 'NO',
    name: 'Nora',
    role: 'Recepcionista',
    color: '#8fb3ff',
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
    color: '#ffd38a',
    pitch: 'Transforma ideas, audios, conversaciones y documentos en contenido publicable para tus canales.',
    channels: ['Docs', 'LinkedIn', 'Instagram', 'Email'],
    tasks: [
      'Crea posts, guiones, emails y artículos',
      'Reutiliza ideas en múltiples formatos',
      'Detecta temas desde conversaciones con clientes',
    ],
  },
  {
    id: 'marcos',
    initials: 'MA',
    name: 'Marcos',
    role: 'Analista de negocio',
    color: '#d7b7ff',
    pitch: 'Detecta qué clientes están en riesgo, por qué se enfriaron los leads que ignoraste y qué patrones esconden tus datos.',
    channels: ['Telegram', 'Email', 'CRM', 'Informes'],
    tasks: [
      'Reporte semanal con hallazgos y recomendaciones',
      'Analiza leads fríos y por qué se perdieron',
      'Detecta clientes en riesgo antes de que se vayan',
    ],
  },
]

const workflow = [
  {
    icon: MessageSquare,
    title: 'Pides algo natural',
    text: 'Envías un audio, mensaje o documento por el canal que ya usas.',
  },
  {
    icon: Workflow,
    title: 'Aplica tus protocolos',
    text: 'El empleado cruza la petición con tono, límites, fuentes y contexto.',
  },
  {
    icon: FileText,
    title: 'Entrega trabajo',
    text: 'Crea documentos, respuestas, tareas o resúmenes listos para revisar.',
  },
  {
    icon: Brain,
    title: 'Aprende del resultado',
    text: 'Guarda preferencias y patrones para responder mejor la próxima vez.',
  },
]

const plans = [
  {
    id: 'individual',
    name: 'Un empleado',
    target: 'Empieza por tu dolor más urgente',
    icon: CreditCard,
    price: 150,
    featured: false,
    features: [
      '1 empleado IA configurado con tu tono y criterio',
      'WhatsApp o Telegram como canal principal',
      'Documentos, protocolos y memoria inicial',
      'Sin permanencia — pausa cuando quieras',
    ],
  },
  {
    id: 'operativo',
    name: 'Operación Solo',
    target: 'Recupera tus tardes y tus domingos',
    icon: Building2,
    price: 300,
    featured: false,
    features: [
      'Nora (recepcionista) + Alex (asistente ejecutivo)',
      'Atención al cliente y operativa diaria, resueltas',
      'Web profesional incluida los primeros 6 meses',
      'Activo en 7 días — sin migrar de herramienta',
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
      'Atención, operativa, contenido y ventas',
      'Aprenden de tus interacciones cada semana',
      'Panel central con trazabilidad completa',
    ],
  },
]

const faqs = [
  {
    q: '¿Esto sustituye contratar a una persona?',
    a: 'En las tareas repetitivas, sí — y por una fracción del coste. En decisiones complejas, no: ahí decides tú. La idea no es eliminar al humano, es que tú dejes de ser el humano que contesta WhatsApp un domingo. Muchos solopreneurs lo usan como capa antes de poder contratar a alguien.',
  },
  {
    q: '¿Y si contesta algo que yo no firmaría?',
    a: 'Durante el onboarding definimos exactamente qué puede decir, qué debe preguntar y cuándo escalar. Las decisiones sensibles (presupuestos, casos delicados, devoluciones) siempre pasan por ti antes de salir. Cada mensaje queda trazado y revisable.',
  },
  {
    q: '¿Tengo que aprender una herramienta nueva o ser técnico?',
    a: 'No. Hablas con tus empleados por WhatsApp o Telegram como hablarías con un humano. Sin prompts, sin configuración compleja. El panel solo lo abres cuando quieres revisar o ajustar algo.',
  },
  {
    q: '¿Cuánto tarda en estar funcionando?',
    a: '7 días desde que firmas hasta que tu primer empleado está operando. En ese tiempo definimos su puesto, conectamos canales, cargamos tus documentos y probamos conversaciones reales contigo.',
  },
  {
    q: '¿Y si necesito pausarlo o cambiar algo?',
    a: 'Sin permanencia. Lo pausas o lo cancelas cuando quieras. Cambiar tono, protocolos o tareas se hace en horas, no en semanas — para eso existe el panel.',
  },
]
</script>

<style lang="scss" scoped>
.home {
  --ink: #{$text};
  --muted: #{$text-muted};
  --subtle: #{$text-subtle};
  --panel: rgba(11, 23, 21, 0.86);
  --panel-strong: #{$bg-card};
  --line: #{$border};
  --line-strong: #{$border-hover};
  --mint: #{$primary};
  --blue: #{$accent-blue};
  --amber: #{$accent-amber};
  --violet: #{$accent-violet};
  background:
    radial-gradient(circle at 18% 4%, $primary-glow, transparent 28%),
    radial-gradient(circle at 86% 12%, rgba(143, 179, 255, 0.14), transparent 24%),
    $bg;
  color: var(--ink);
  overflow: hidden;
}

.container {
  width: min(1160px, calc(100% - 40px));
  margin: 0 auto;
}

.section {
  padding: 96px 0;

  @media (max-width: 760px) {
    padding: 72px 0;
  }
}

.kicker,
.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--mint);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
}

.section-heading {
  max-width: 720px;
  margin-bottom: 40px;

  h2 {
    margin: 12px 0 14px;
    color: var(--ink);
    font-size: clamp(2rem, 4vw, 3.35rem);
    line-height: 1.04;
    letter-spacing: 0;
  }

  p {
    color: var(--muted);
    font-size: 1.05rem;
    line-height: 1.7;
  }

  &--split {
    display: grid;
    grid-template-columns: 1.05fr 0.95fr;
    gap: 48px;
    align-items: end;
    max-width: none;

    p {
      margin-bottom: 8px;
    }

    @media (max-width: 860px) {
      grid-template-columns: 1fr;
      gap: 14px;
    }
  }
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 48px;
  padding: 0 20px;
  border-radius: 12px;
  font-weight: 800;
  text-decoration: none;
  border: 1px solid transparent;
  transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease;
  white-space: nowrap;

  &:hover {
    transform: translateY(-2px);
  }

  &--primary {
    background: var(--mint);
    color: $text-inverse;
    box-shadow: 0 18px 56px rgba(156, 255, 203, 0.22);
  }

  &--secondary {
    background: rgba(248, 246, 238, 0.04);
    border-color: var(--line-strong);
    color: var(--ink);
  }

  @media (max-width: 520px) {
    width: 100%;
  }
}

.hero {
  position: relative;
  min-height: calc(100dvh - 64px);
  display: flex;
  align-items: center;
  padding: 84px 0 64px;

  &__grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(248, 246, 238, 0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(248, 246, 238, 0.04) 1px, transparent 1px);
    background-size: 64px 64px;
    mask-image: linear-gradient(to bottom, black 0%, transparent 88%);
  }

  &__glow {
    position: absolute;
    width: 360px;
    height: 360px;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.35;
    pointer-events: none;

    &--mint {
      left: -120px;
      top: 140px;
      background: var(--mint);
    }

    &--blue {
      right: -120px;
      top: 80px;
      background: var(--blue);
    }
  }

  &__inner {
    position: relative;
    display: grid;
    grid-template-columns: minmax(0, 0.95fr) minmax(430px, 1.05fr);
    gap: 48px;
    align-items: center;

    @media (max-width: 980px) {
      grid-template-columns: 1fr;
    }
  }

  &__copy h1 {
    max-width: 760px;
    margin: 18px 0 22px;
    font-size: clamp(3rem, 5.4vw, 5.6rem);
    line-height: 0.98;
    letter-spacing: 0;
    color: var(--ink);
  }

  &__lead {
    max-width: 660px;
    color: var(--muted);
    font-size: clamp(1.06rem, 1.8vw, 1.25rem);
    line-height: 1.72;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    margin-top: 32px;
  }

  &__assurance {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    margin-top: 24px;
    color: var(--muted);
    font-size: 0.92rem;

    span {
      display: inline-flex;
      align-items: center;
      gap: 7px;
    }

    svg {
      color: var(--mint);
    }
  }
}

.ops-panel {
  position: relative;
  border: 1px solid var(--line-strong);
  border-radius: 28px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.07), transparent 38%),
    var(--panel);
  box-shadow:
    0 28px 90px rgba(0, 0, 0, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(156, 255, 203, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(156, 255, 203, 0.05) 1px, transparent 1px);
    background-size: 42px 42px;
    pointer-events: none;
  }

  &__topbar,
  &__main,
  .employee-dock {
    position: relative;
  }

  &__topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 18px;
    padding: 18px 20px;
    border-bottom: 1px solid var(--line);
    color: var(--muted);
    font-size: 0.85rem;

    div {
      display: inline-flex;
      align-items: center;
      gap: 9px;
      color: var(--ink);
      font-weight: 800;
    }
  }

  &__status {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--mint);
    box-shadow: 0 0 0 6px rgba(156, 255, 203, 0.12);
  }

  &__main {
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: 18px;
    padding: 20px;

    @media (max-width: 620px) {
      grid-template-columns: 1fr;
    }
  }

  &__chat {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  &__input {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    width: fit-content;
    padding: 10px 12px;
    border-radius: 999px;
    background: rgba(37, 211, 102, 0.12);
    color: var(--mint);
    font-size: 0.82rem;
    font-weight: 800;
  }

  &__side {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}

.chat-message {
  padding: 16px;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.045);

  span {
    display: block;
    margin-bottom: 8px;
    color: var(--subtle);
    font-size: 0.78rem;
    font-weight: 800;
    text-transform: uppercase;
  }

  p {
    color: var(--ink);
    line-height: 1.55;
  }

  &--employee {
    border-color: rgba(156, 255, 203, 0.28);
    background: rgba(156, 255, 203, 0.08);
  }
}

.work-card {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 15px;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.045);

  svg {
    color: var(--blue);
    flex-shrink: 0;
  }

  strong,
  span {
    display: block;
  }

  strong {
    color: var(--ink);
    font-size: 0.94rem;
  }

  span {
    margin-top: 4px;
    color: var(--muted);
    font-size: 0.8rem;
  }

  &--active svg {
    color: var(--mint);
  }
}

.employee-dock {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  padding: 0 20px 20px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 620px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.employee-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  padding: 12px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: rgba(0, 0, 0, 0.16);

  > span {
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    border-radius: 12px;
    color: $text-inverse;
    font-size: 0.76rem;
    font-weight: 900;
    flex-shrink: 0;
  }

  strong,
  small {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  strong {
    color: var(--ink);
    font-size: 0.86rem;
  }

  small {
    color: var(--muted);
    font-size: 0.74rem;
  }
}

.confidence {
  position: relative;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.025);

  &__grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);

    @media (max-width: 920px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 560px) {
      grid-template-columns: 1fr;
    }
  }

  &__item {
    min-height: 160px;
    padding: 28px 24px;
    border-left: 1px solid var(--line);

    &:last-child {
      border-right: 1px solid var(--line);
    }

    svg {
      color: var(--mint);
      margin-bottom: 18px;
    }

    strong,
    span {
      display: block;
    }

    strong {
      margin-bottom: 8px;
      color: var(--ink);
      font-size: 1rem;
    }

    span {
      color: var(--muted);
      font-size: 0.92rem;
      line-height: 1.55;
    }
  }
}

.comparison {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 20px;

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }

  &__card {
    padding: 28px;
    border-radius: 26px;
    border: 1px solid var(--line);

    ul {
      display: grid;
      gap: 14px;
      margin: 22px 0 0;
      padding: 0;
      list-style: none;
      color: var(--muted);
      line-height: 1.55;
    }

    li {
      padding-left: 18px;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0.68em;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: currentColor;
      }
    }

    &--muted {
      background: rgba(255, 255, 255, 0.035);
    }

    &--focus {
      background:
        linear-gradient(135deg, rgba(156, 255, 203, 0.14), rgba(143, 179, 255, 0.08)),
        var(--panel-strong);
      border-color: var(--line-strong);
      box-shadow: 0 28px 80px rgba(0, 0, 0, 0.28);

      ul {
        color: var(--ink);
      }
    }
  }

  &__label {
    color: var(--ink);
    font-size: 1.25rem;
    font-weight: 900;
  }
}

.employees {
  background: rgba(255, 255, 255, 0.025);
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}

.employee-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;

  @media (max-width: 1120px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.employee-card {
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-height: 430px;
  padding: 22px;
  border: 1px solid var(--line);
  border-radius: 26px;
  background: var(--panel);
  transition: transform 0.18s ease, border-color 0.18s ease;

  &:hover {
    transform: translateY(-5px);
    border-color: var(--line-strong);
  }

  &__top {
    display: flex;
    align-items: center;
    gap: 14px;

    h3 {
      color: var(--ink);
      font-size: 1.22rem;
      margin-bottom: 4px;
    }

    span {
      color: var(--muted);
      font-size: 0.86rem;
    }
  }

  &__avatar {
    display: grid;
    place-items: center;
    width: 52px;
    height: 52px;
    border-radius: 17px;
    color: $text-inverse;
    font-weight: 900;
  }

  p {
    color: var(--muted);
    line-height: 1.65;
  }

  &__channels {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    span {
      padding: 6px 9px;
      border: 1px solid var(--line);
      border-radius: 999px;
      color: var(--ink);
      font-size: 0.75rem;
      font-weight: 800;
      background: rgba(255, 255, 255, 0.04);
    }
  }

  ul {
    display: grid;
    gap: 12px;
    margin: auto 0 0;
    padding: 0;
    list-style: none;
  }

  li {
    display: flex;
    gap: 9px;
    color: var(--muted);
    font-size: 0.9rem;
    line-height: 1.45;

    svg {
      color: var(--mint);
      margin-top: 3px;
      flex-shrink: 0;
    }
  }
}

.workflow-section {
  .workflow-shell {
    padding: 34px;
    border: 1px solid var(--line);
    border-radius: 34px;
    background:
      linear-gradient(135deg, rgba(255, 211, 138, 0.07), transparent 42%),
      var(--panel);
  }
}

.workflow {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;

  @media (max-width: 980px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }

  &__step {
    min-height: 220px;
    padding: 22px;
    border: 1px solid var(--line);
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.04);

    svg {
      color: var(--amber);
      margin: 18px 0 16px;
    }

    h3 {
      color: var(--ink);
      font-size: 1.1rem;
      margin-bottom: 9px;
    }

    p {
      color: var(--muted);
      line-height: 1.55;
      font-size: 0.92rem;
    }
  }

  &__index {
    color: var(--subtle);
    font-family: $font-mono;
    font-size: 0.82rem;
  }
}

.proof {
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.025);

  &__inner {
    display: grid;
    grid-template-columns: 0.9fr 1.1fr;
    gap: 56px;
    align-items: center;

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
    }
  }

  &__visual {
    min-height: 420px;
    display: grid;
    place-items: center;
  }

  &__copy h2 {
    margin: 12px 0 18px;
    font-size: clamp(2.1rem, 4vw, 4.2rem);
    line-height: 1.02;
    letter-spacing: 0;
  }

  &__copy p {
    color: var(--muted);
    font-size: 1.05rem;
    line-height: 1.75;
  }

  &__checks {
    display: grid;
    gap: 12px;
    margin-top: 24px;

    span {
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--ink);
      font-weight: 800;
    }

    svg {
      color: var(--mint);
      flex-shrink: 0;
    }
  }
}

.document-stack {
  position: relative;
  width: min(420px, 100%);
  min-height: 340px;
}

.doc-card {
  position: absolute;
  border: 1px solid var(--line-strong);
  border-radius: 24px;
  background: $text;
  color: $text-inverse;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.28);

  &--front {
    inset: 28px 26px 0 0;
    z-index: 3;
    padding: 24px;
  }

  &--back,
  &--third {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 18px;
    font-weight: 900;
  }

  &--back {
    top: 0;
    right: 0;
    width: 74%;
    height: 86px;
    background: var(--blue);
    transform: rotate(5deg);
    z-index: 2;
  }

  &--third {
    left: 0;
    bottom: 18px;
    width: 70%;
    height: 82px;
    background: var(--amber);
    transform: rotate(-5deg);
    z-index: 1;
  }

  &__head {
    display: flex;
    align-items: center;
    gap: 9px;
    font-weight: 900;
    margin-bottom: 30px;
  }

  &__line {
    height: 12px;
    width: 74%;
    margin-bottom: 14px;
    border-radius: 999px;
    background: rgba(7, 17, 15, 0.16);

    &--wide {
      width: 92%;
    }

    &--short {
      width: 54%;
    }
  }

  &__decision {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 28px;
    padding: 10px 12px;
    border-radius: 999px;
    background: rgba(6, 17, 15, 0.08);
    color: $primary-dark;
    font-weight: 900;
    font-size: 0.82rem;
  }
}

.plans {
  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;

    @media (max-width: 920px) {
      grid-template-columns: 1fr;
    }
  }
}

.plan-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 22px;
  min-height: 470px;
  padding: 28px;
  border: 1px solid var(--line);
  border-radius: 28px;
  background: var(--panel);

  &--featured {
    border-color: rgba(156, 255, 203, 0.46);
    background:
      linear-gradient(135deg, rgba(156, 255, 203, 0.14), rgba(215, 183, 255, 0.08)),
      var(--panel-strong);
  }

  &__badge {
    position: absolute;
    top: -14px;
    right: 24px;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 8px 12px;
    border-radius: 999px;
    background: var(--mint);
    color: $text-inverse;
    font-size: 0.78rem;
    font-weight: 900;
  }

  &__head {
    display: flex;
    align-items: center;
    gap: 14px;

    svg {
      color: var(--mint);
    }

    h3 {
      color: var(--ink);
      font-size: 1.35rem;
      margin-bottom: 4px;
    }

    span {
      color: var(--muted);
      font-size: 0.9rem;
    }
  }

  ul {
    display: grid;
    gap: 13px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    display: flex;
    gap: 9px;
    color: var(--muted);
    line-height: 1.5;

    svg {
      color: var(--mint);
      margin-top: 3px;
      flex-shrink: 0;
    }
  }

  &__price {
    margin-top: auto;

    strong {
      color: var(--ink);
      font-size: 3rem;
      line-height: 1;
      font-variant-numeric: tabular-nums;
    }

    span {
      color: var(--muted);
      margin-left: 4px;
    }
  }
}

.faq {
  border-top: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.025);

  &__inner {
    max-width: 900px;
  }

  &__list {
    display: grid;
    gap: 12px;
  }

  &__item {
    width: 100%;
    padding: 0;
    border: 1px solid var(--line);
    border-radius: 20px;
    background: var(--panel);
    text-align: left;
    cursor: pointer;
    overflow: hidden;

    &--open {
      border-color: var(--line-strong);
    }
  }

  &__question {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 18px;
    padding: 20px 22px;
    color: var(--ink);
    font-weight: 900;

    svg {
      color: var(--muted);
      flex-shrink: 0;
    }
  }

  &__answer {
    display: block;
    padding: 0 22px 22px;
    color: var(--muted);
    line-height: 1.7;
  }
}

.final-cta {
  padding: 96px 0;

  &__box {
    padding: clamp(32px, 7vw, 72px);
    border: 1px solid var(--line-strong);
    border-radius: 36px;
    background:
      radial-gradient(circle at 15% 0%, rgba(156, 255, 203, 0.18), transparent 30%),
      radial-gradient(circle at 92% 12%, rgba(143, 179, 255, 0.14), transparent 28%),
      var(--panel);
    text-align: center;

    h2 {
      max-width: 760px;
      margin: 12px auto 18px;
      color: var(--ink);
      font-size: clamp(2.2rem, 5vw, 4.8rem);
      line-height: 1;
      letter-spacing: 0;
    }

    p {
      max-width: 650px;
      margin: 0 auto;
      color: var(--muted);
      font-size: 1.08rem;
      line-height: 1.75;
    }
  }

  &__actions {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 14px;
    margin-top: 30px;
  }
}

@media (max-width: 760px) {
  .container {
    width: min(100% - 28px, 1160px);
  }

  .hero {
    padding-top: 54px;

    &__copy h1 {
      font-size: clamp(2.65rem, 17vw, 4.5rem);
    }
  }

  .ops-panel {
    border-radius: 22px;
  }

  .workflow-section .workflow-shell {
    padding: 20px;
    border-radius: 26px;
  }
}
</style>
