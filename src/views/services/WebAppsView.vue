<template>
  <div class="commercial-page">
    <section class="section split">
      <div>
        <span class="eyebrow">Webs y aplicaciones · Proyectos independientes</span>
        <h1>Una web que ayuda a vender.<br />Una aplicación que facilita trabajar.</h1>
        <p class="intro">
          Del primer contacto al presupuesto. Del trabajo repetido a un proceso claro. Diseñamos y
          construimos la herramienta que necesita tu operación, con alcance, fases y entrega
          acordados.
        </p>
        <div class="commercial-actions">
          <a href="#contacto" class="commercial-button" @click="trackEvent('lead_cta_click')"
            >Hablar de mi proyecto ↗</a
          ><a href="#ejemplo" class="commercial-link">Ver un ejemplo ↓</a>
        </div>
      </div>
      <div class="web-blueprint">
        <span>01 / PRESENTAR</span><strong>Tu oferta, clara.</strong><span>02 / CONECTAR</span
        ><strong>De la consulta al equipo.</strong><span>03 / TRABAJAR</span
        ><strong>Menos tareas repetidas.</strong>
      </div>
    </section>
    <section class="section">
      <div class="section-head">
        <span class="eyebrow">Tres puntos de partida</span>
        <h2>El problema decide la solución.</h2>
      </div>
      <div class="commercial-grid">
        <article class="commercial-card">
          <h3>Web comercial</h3>
          <p>
            Tu oferta, tu marca y un recorrido de contacto que recoge lo necesario para responder.
            Contenido y estructura pensados para tus clientes.
          </p>
        </article>
        <article class="commercial-card">
          <h3>Catálogo y presupuestos</h3>
          <p>
            Productos, variantes y solicitudes ordenadas. Tu equipo recibe el detalle y prepara el
            presupuesto sin reconstruir cada conversación.
          </p>
        </article>
        <article class="commercial-card">
          <h3>Herramientas internas</h3>
          <p>
            Solicitudes, tareas o información conectadas en un lugar. Validamos el proceso con
            quienes lo van a usar antes de ampliar.
          </p>
        </article>
      </div>
    </section>
    <section id="ejemplo" class="section split">
      <div>
        <span class="eyebrow">Demostración anónima · Datos de ejemplo</span>
        <h2>De elegir un producto<br />a preparar un presupuesto.</h2>
        <p class="intro">
          Prueba este pequeño recorrido de catálogo. No envía solicitudes, no guarda datos ni
          realiza compras. Es una muestra de interacción, no un caso de éxito ni una integración con
          existencias reales.
        </p>
      </div>
      <div class="commercial-card web-example">
        <span class="eyebrow">Catálogo de ejemplo</span>
        <h3>Prenda profesional</h3>
        <label>Unidades <input v-model.number="quantity" type="number" min="1" max="500" /></label
        ><label
          >Personalización
          <select v-model="customization">
            <option>Sin personalización</option>
            <option>Logo del equipo</option>
          </select></label
        ><button type="button" class="commercial-button" @click="showExample = true">
          Preparar solicitud de ejemplo
        </button>
        <p v-if="showExample" role="status">
          <strong>Simulación preparada:</strong> {{ validQuantity }} unidades · {{ customization }}.
          El equipo revisaría disponibilidad, plazo y precio antes de presupuestar. No se ha enviado
          nada.
        </p>
      </div>
    </section>
    <section class="section">
      <div class="section-head">
        <span class="eyebrow">De la necesidad a la entrega</span>
        <h2>Construir con un acuerdo claro.</h2>
      </div>
      <div class="commercial-grid">
        <article>
          <span class="commercial-number">01 / DEFINIR</span>
          <h3>Alcance y fases.</h3>
          <p>
            Revisamos el proceso, priorizamos lo necesario y cerramos entregables, hitos, inversión
            y responsabilidades.
          </p>
        </article>
        <article>
          <span class="commercial-number">02 / VALIDAR</span>
          <h3>Probar antes de entregar.</h3>
          <p>
            Revisas el diseño y el funcionamiento en un entorno de pruebas. Los criterios de
            aceptación y las revisiones se acuerdan al inicio.
          </p>
        </article>
        <article>
          <span class="commercial-number">03 / ENTREGAR</span>
          <h3>Usar y mantener.</h3>
          <p>
            Documentación, accesos y formación de uso. Concretamos el mantenimiento y cómo se
            solicitan ampliaciones.
          </p>
        </article>
      </div>
    </section>
    <section class="section split">
      <div>
        <span class="eyebrow">Propiedad y continuidad</span>
        <h2>Una herramienta para tu empresa.<br />Con las condiciones a la vista.</h2>
      </div>
      <div>
        <p>
          El acuerdo identifica código específico, datos y accesos del cliente, componentes
          reutilizados y licencias de terceros. Documentamos la entrega y la posibilidad de cambiar
          de proveedor.
        </p>
        <p>
          Infraestructura, dominio, correo, IA y otras integraciones se detallan aparte cuando
          proceda. Las nuevas funciones llevan presupuesto. Si la gestión de marca ya incluye tareas
          de mantenimiento, evitamos cobrarlas dos veces.
        </p>
        <p>
          <strong>Presupuesto según alcance.</strong> Puedes contratar el proyecto sin contratar
          marketing.
        </p>
      </div>
    </section>
    <section id="demo-nora" class="section split">
      <div>
        <span class="eyebrow">Explora tu necesidad</span>
        <h2>Cuéntale a Nora qué proceso quieres resolver.</h2>
        <p class="intro">
          Esta demo con IA ayuda a empezar una consulta. La agenda es ficticia; el correo requiere
          confirmación; el presupuesto y los compromisos los acuerdas con una persona.
        </p>
        <a href="#contacto" class="commercial-link">Prefiero hablar del proyecto ↗</a>
      </div>
      <LazyNora context="web" />
    </section>
    <section id="contacto" class="section split contact-section">
      <div class="contact-copy">
        <span class="eyebrow">Hablemos del proyecto</span>
        <h2>¿Qué debería ser más fácil en tu negocio?</h2>
        <p class="intro">
          Cuéntanos el proceso y quién lo utiliza. Revisaremos tu caso para acordar una conversación
          y definir el alcance.
        </p>
        <p>También en <a href="mailto:info@midiginode.com">info@midiginode.com</a>.</p>
      </div>
      <LeadForm service="web_project" />
    </section>
  </div>
</template>
<script setup>
import { computed, ref } from 'vue'
import LeadForm from '@/components/public/LeadForm.vue'
import LazyNora from '@/components/public/LazyNora.vue'
import { trackEvent } from '@/lib/analytics'
const quantity = ref(12),
  customization = ref('Sin personalización'),
  showExample = ref(false)
const validQuantity = computed(() =>
  Math.max(1, Math.min(500, Math.floor(Number(quantity.value) || 1)))
)
</script>
<style scoped lang="scss">
.web-blueprint {
  display: grid;
  gap: 1rem;
  padding: 3rem;
  border: 1px solid #29476a;
  border-radius: 20px;
  background: #10223a;
  span {
    font-size: 0.7rem;
    letter-spacing: 0.15em;
    color: #60b0ff;
    margin-top: 1rem;
  }
  strong {
    font-weight: 500;
    font-size: 1.6rem;
  }
}
.web-example {
  display: grid;
  gap: 1.4rem;
  label {
    display: grid;
    gap: 0.6rem;
    font-size: 0.9rem;
  }
  input,
  select {
    min-width: 0;
    width: 100%;
    border: 1px solid #29476a;
    background: #050a0f;
    color: #f8fafc;
    padding: 0.8rem;
    border-radius: 8px;
    font: inherit;
  }
}
</style>
