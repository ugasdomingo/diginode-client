<template>
  <div class="commercial-page agency-home">
    <section class="section agency-hero">
      <div>
        <span class="eyebrow">Gestión de marca y marketing · Microempresas y pymes</span>
        <h1>Tu empresa necesita marketing.<br /><span>Tú no necesitas otro trabajo.</span></h1>
        <p class="intro">
          Dirigimos y ejecutamos tu comunicación, tu web y tus campañas para atraer oportunidades y
          ayudarte a convertirlas en clientes. Tú decides el rumbo y el presupuesto; nosotros nos
          encargamos del trabajo.
        </p>
        <div class="commercial-actions">
          <a href="#contacto" class="commercial-button" @click="trackEvent('lead_cta_click')"
            >Revisar mi negocio ↗</a
          ><a href="#demo-nora" class="commercial-link">Probar a Nora ↓</a>
        </div>
        <p class="agency-signature">Descansa, nosotros nos encargamos de todo.</p>
      </div>
      <aside class="agency-board" aria-label="Cómo conectamos el marketing con tu negocio">
        <div class="agency-board__top">
          <span>EL TRABAJO, CONECTADO</span><span class="agency-board__dot" />
        </div>
        <div class="agency-board__step">
          <span>01 / DIRECCIÓN</span><strong>Una marca que se entiende.</strong>
          <p>Prioridades claras, mensaje coherente.</p>
        </div>
        <div class="agency-board__step">
          <span>02 / CAPTACIÓN</span><strong>Un camino hasta la consulta.</strong>
          <p>Contenido, web y campañas conectados.</p>
        </div>
        <div class="agency-board__step">
          <span>03 / ATENCIÓN</span><strong>Cada oportunidad, atendida.</strong>
          <p>Respuestas, contexto y seguimiento.</p>
        </div>
        <div class="agency-board__bottom">TU NEGOCIO AL MANDO. DIGINODE EN LA EJECUCIÓN.</div>
      </aside>
    </section>
    <section class="section">
      <div class="section-head">
        <span class="eyebrow">Menos piezas sueltas. Más dirección.</span>
        <h2>El marketing tiene que ayudar al negocio.<br />Y caber en tu día.</h2>
      </div>
      <div class="commercial-grid">
        <article v-for="(item, index) in values" :key="item.title" class="commercial-card">
          <span class="commercial-number">0{{ index + 1 }} — {{ item.label }}</span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.text }}</p>
        </article>
      </div>
    </section>
    <section id="metodo" class="section">
      <div class="section-head">
        <span class="eyebrow">Cómo delegas</span>
        <h2>Un rumbo compartido.<br />El trabajo, en nuestras manos.</h2>
      </div>
      <div class="commercial-grid">
        <article v-for="(item, index) in method" :key="item.title">
          <span class="commercial-number">0{{ index + 1 }} / {{ item.label }}</span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.text }}</p>
        </article>
      </div>
      <p class="agency-first-month">
        <strong>El primer mes:</strong> accesos, punto de partida, correcciones prioritarias y
        primer calendario de trabajo.
      </p>
    </section>
    <section class="section split">
      <div>
        <span class="eyebrow">Delegar sin perder el control</span>
        <h2>Tu marca sigue siendo tuya.<br />También las decisiones.</h2>
        <p class="intro">
          Contenido preparado con 15 días de anticipación, aprobación por lotes y presupuesto
          autorizado. Lo nuevo espera tu aprobación; las mejoras rutinarias siguen los límites que
          acordemos.
        </p>
        <a href="#contacto" class="commercial-link" @click="trackEvent('lead_cta_click')"
          >Revisar mi negocio ↗</a
        >
      </div>
      <div class="agency-control">
        <div><span>VISIBILIDAD</span><strong>Sabes qué estamos preparando.</strong></div>
        <div><span>RESPONSABILIDAD</span><strong>Un responsable identificable.</strong></div>
        <div><span>RITMO</span><strong>Reunión mensual o quincenal.</strong></div>
        <p>
          Calendario y revisiones compartidos por los canales acordados. Sin tener que aprender un
          nuevo portal.
        </p>
      </div>
    </section>
    <section id="demo-nora" class="section split">
      <div>
        <span class="eyebrow">Pruébalo con tu negocio</span>
        <h2>Así puede empezar una consulta bien atendida.</h2>
        <p class="intro">
          Habla con Nora, nuestra asistente con IA, sin registrarte. Explícale tu caso, pídele un
          resumen o mira una agenda de ejemplo.
        </p>
        <p>
          Las respuestas del chat usan IA. La agenda es simulada; no reserva citas. El correo solo
          se envía después de revisar y confirmar destinatario y resumen. Una reunión real se
          concierta por el enlace de agenda, cuando esté disponible.
        </p>
        <p>
          ¿Prefieres una persona?
          <a href="#contacto" class="commercial-link">Cuéntanos tu necesidad ↗</a>
        </p>
      </div>
      <LazyNora context="agency" />
    </section>
    <section id="acompanamiento" class="section">
      <div class="section-head">
        <span class="eyebrow">A la medida de tu operación</span>
        <h2>La misma responsabilidad.<br />Dos escalas de acompañamiento.</h2>
        <p class="intro">
          El alcance depende de la complejidad y la coordinación, no de una cuota de publicaciones.
        </p>
      </div>
      <div class="agency-scales">
        <article v-for="scale in management.scales" :key="scale.id" class="commercial-card">
          <span class="eyebrow">GESTIÓN CONTINUADA</span>
          <h3>{{ scale.name }}</h3>
          <p>{{ scale.description }}</p>
          <p>
            Dirección de marca, comunicación, canales, campañas, web existente, reputación y
            seguimiento dentro del alcance acordado.
          </p>
          <strong class="agency-price">{{ management.pricing }}</strong
          ><a href="#contacto" class="commercial-button" @click="selectScale(scale.id)"
            >Solicitar propuesta ↗</a
          >
        </article>
      </div>
      <p class="intro">
        Publicidad, producción externa y nuevas webs o aplicaciones se presupuestan aparte.
        Acordamos entregas, condiciones y costes antes de contratar. Las mejoras ordinarias de la
        web existente entran según el alcance.
      </p>
    </section>
    <section class="section split">
      <div>
        <span class="eyebrow">Webs y aplicaciones</span>
        <h2>Una web que ayuda a vender.<br />Una aplicación que facilita trabajar.</h2>
        <p class="intro">
          Una web comercial, un catálogo para pedir presupuestos o una herramienta que conecta a tu
          equipo. Proyectos con alcance y entrega propios, también sin suscripción de marketing.
        </p>
        <RouterLink
          to="/webs-y-aplicaciones"
          class="commercial-link"
          @click="trackEvent('web_project_click')"
          >Ver webs y aplicaciones ↗</RouterLink
        >
      </div>
      <div class="agency-example">
        <span class="eyebrow">Ejemplo de recorrido</span
        ><strong>Catálogo → Solicitud → Presupuesto</strong>
        <p>Del producto que interesa a una consulta que tu equipo puede trabajar.</p>
        <span>Demostración de proceso. Sin datos ni resultados de clientes.</span>
      </div>
    </section>
    <section class="section split">
      <div>
        <span class="eyebrow">Clínica Digital</span>
        <h2>¿Tienes una consulta?<br />Tenemos un recorrido para ti.</h2>
        <p class="intro">
          Web profesional y tres empleados con IA para psicólogos, coaches y terapeutas. Conoce el
          producto, prueba a Nora en ese contexto y consulta sus condiciones.
        </p>
        <RouterLink
          to="/clinica-digital"
          class="commercial-link"
          @click="trackEvent('digital_clinic_click')"
          >Ver Clínica Digital ↗</RouterLink
        >
      </div>
      <div class="agency-clinic">
        <span>N / A / V</span>
        <h3>Nora, Alex y Valeria.</h3>
        <p>
          Atención administrativa, apoyo técnico y contenido para tu consulta. El criterio clínico
          sigue en tus manos.
        </p>
      </div>
    </section>
    <section class="section">
      <div class="section-head">
        <span class="eyebrow">Una relación clara desde el principio</span>
        <h2>Lo que conviene saber.</h2>
      </div>
      <details v-for="item in questions" :key="item.q">
        <summary>{{ item.q }}</summary>
        <p>{{ item.a }}</p>
      </details>
    </section>
    <section id="contacto" class="section split contact-section">
      <div class="contact-copy">
        <span class="eyebrow">El siguiente paso</span>
        <h2>Cuéntanos dónde está tu negocio.<br />Y qué te está frenando.</h2>
        <p class="intro">
          Revisamos tu caso y acordamos una conversación para valorar el encaje. Después, una
          propuesta con alcance y prioridades.
        </p>
        <p>
          También puedes escribir a <a href="mailto:info@midiginode.com">info@midiginode.com</a>.
        </p>
      </div>
      <LeadForm :scale="selectedScale" />
    </section>
  </div>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue'
import LeadForm from '@/components/public/LeadForm.vue'
import LazyNora from '@/components/public/LazyNora.vue'
import { useServices } from '@/data/services'
import { trackEvent } from '@/lib/analytics'
const { services, load } = useServices()
const management = computed(() =>
  services.value.find((service) => service.id === 'brand_management')
)
const selectedScale = ref('pending')
function selectScale(value) {
  selectedScale.value = value
  trackEvent('lead_cta_click')
}
const values = [
  {
    label: 'MARCA',
    title: 'Que se entienda por qué elegirte.',
    text: 'Ordenamos tu oferta y unificamos el mensaje en tu web, redes y materiales. La comunicación empieza en lo que tu empresa hace bien.',
  },
  {
    label: 'OPORTUNIDADES',
    title: 'Que preguntar sea fácil.',
    text: 'Conectamos campañas, contenido y formularios para que cada consulta llegue con el contexto necesario y pueda recibir seguimiento.',
  },
  {
    label: 'TU TIEMPO',
    title: 'Que no tengas que coordinarlo todo.',
    text: 'Un responsable lleva las prioridades y la ejecución. Revisamos consultas, origen de oportunidades y decisiones contigo, sin prometer ventas.',
  },
]
const method = [
  {
    label: 'ACORDAMOS',
    title: 'Prioridades antes que canales.',
    text: 'Entendemos tu operación y fijamos alcance, entregas y presupuesto. Empezamos por lo que necesita el negocio.',
  },
  {
    label: 'EJECUTAMOS',
    title: 'De la idea a la entrega.',
    text: 'Preparamos contenidos y mejoras, conectamos herramientas y ejecutamos dentro de lo aprobado. La IA apoya el trabajo; hay una persona responsable.',
  },
  {
    label: 'REVISAMOS',
    title: 'Decisiones con contexto.',
    text: 'Revisamos oportunidades, acciones y próximos pasos. Ajustamos prioridades al ritmo y a la capacidad de tu equipo.',
  },
]
const questions = [
  {
    q: '¿Quién se encarga y cómo empezamos?',
    a: 'La persona responsable de Diginode revisa tu solicitud y acuerda contigo una conversación. Antes de contratar tendrás un interlocutor identificado, alcance, prioridades, entregas y presupuesto por escrito.',
  },
  {
    q: '¿Tengo que cambiar de web o de herramientas?',
    a: 'Primero revisamos lo que ya funciona. Mejoramos la web existente cuando el alcance lo permite. Una nueva web o aplicación se acuerda como proyecto independiente.',
  },
  {
    q: '¿De quién son las cuentas, los materiales y los datos?',
    a: 'Dejamos por escrito la propiedad y los accesos del cliente, las licencias de terceros y los componentes reutilizados. La salida y la entrega se documentan antes de empezar.',
  },
  {
    q: '¿Cómo sabremos si avanzamos?',
    a: 'Revisamos consultas válidas, origen de oportunidades, presupuestos y ventas registradas, con los datos que aporte tu operación. Un clic o una conversación no equivalen a una venta.',
  },
  {
    q: '¿Hay una garantía de ventas?',
    a: 'No publicamos ingresos prometidos ni garantías sin condiciones acordadas. Definimos objetivos, responsabilidades y cómo medirlos antes de comprometer el trabajo.',
  },
]
onMounted(load)
</script>
<style scoped lang="scss">
.agency-hero {
  display: grid;
  grid-template-columns: 1.4fr 0.8fr;
  align-items: center;
  gap: 4rem;
  padding-top: 80px !important;
  padding-bottom: 80px !important;
  min-height: 690px;
  h1 span {
    color: #87bcf4;
  }
  .eyebrow {
    max-width: 470px;
    line-height: 1.8;
  }
}
.agency-signature {
  font-size: 0.85rem;
  margin-top: 1.8rem;
  color: #a7b8cc;
}
.agency-board {
  background: linear-gradient(145deg, #10233b, #0b1421);
  border: 1px solid #29476a;
  border-radius: 18px;
  padding: 1.8rem;
  transform: rotate(1deg);
  box-shadow: 0 30px 80px #0005;
  &__top,
  &__bottom {
    font-size: 0.59rem;
    letter-spacing: 0.13em;
    color: #a3b8d0;
  }
  &__top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 1rem;
  }
  &__dot {
    background: #ffb94d;
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }
  &__step {
    border-top: 1px solid #29415c;
    padding: 1.6rem 0;
    span {
      display: block;
      color: #60b0ff;
      font-size: 0.65rem;
      letter-spacing: 0.1em;
      margin-bottom: 0.7rem;
    }
    strong {
      display: block;
      font-size: 1.3rem;
      font-weight: 500;
      line-height: 1.4;
    }
    p {
      font-size: 0.8rem;
      margin-top: 0.5rem;
    }
  }
  &__bottom {
    padding-top: 1rem;
    border-top: 1px solid #29415c;
    line-height: 1.8;
  }
}
.agency-first-month {
  padding: 1.5rem;
  border-left: 2px solid #ffb94d;
  margin-top: 2.5rem;
  background: #0c141f;
}
.agency-control {
  display: grid;
  gap: 1.4rem;
  padding: 2rem;
  border-left: 1px solid #29476a;
  div {
    display: grid;
    gap: 0.5rem;
  }
  span {
    font-size: 0.65rem;
    letter-spacing: 0.15em;
    color: #60b0ff;
  }
  strong {
    font-size: 1.2rem;
    font-weight: 500;
  }
  p {
    font-size: 0.85rem;
  }
}
.agency-scales {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  .commercial-button {
    margin-top: 1.8rem;
  }
}
.agency-price {
  display: block;
  margin-top: 2rem;
  color: #87bcf4;
  font-size: 1.1rem;
  font-weight: 500;
}
.agency-example,
.agency-clinic {
  border-radius: 20px;
  padding: 3rem;
  background: #10223a;
  strong {
    font-size: clamp(1.2rem, 2vw, 1.8rem);
    font-weight: 500;
  }
  p {
    margin: 1.2rem 0;
  }
  > span:last-child {
    font-size: 0.75rem;
    color: #acbacb;
  }
}
.agency-clinic {
  background: #191c21;
  border: 1px solid #4c3d2b;
  > span {
    display: block;
    color: #ffb94d;
    letter-spacing: 0.3em;
    margin-bottom: 2rem;
  }
}
@media (max-width: 950px) {
  .agency-hero {
    grid-template-columns: 1fr;
    gap: 3rem;
    min-height: auto;
  }
  .agency-board {
    max-width: 600px;
    transform: none;
  }
}
@media (max-width: 650px) {
  .agency-scales {
    grid-template-columns: 1fr;
  }
  .agency-hero {
    padding-top: 48px !important;
  }
}
</style>
