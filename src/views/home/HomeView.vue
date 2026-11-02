<template>
  <div class="commercial-page agency-home">
    <section class="section agency-hero">
      <div>
        <span class="eyebrow">Tu departamento de marketing · Microempresas y pymes</span>
        <h1>Descansa.<br /><span>Nosotros nos encargamos de todo.</span></h1>
        <p class="intro">
          Marca, web, publicidad, redes y mensajes de tus clientes. Somos el departamento de
          marketing de tu empresa, con un plan hecho para tu negocio. No un paquete.
        </p>
        <div class="commercial-actions">
          <a href="#contacto" class="commercial-button" @click="trackEvent('lead_cta_click')"
            >Quiero mi plan a medida ↗</a
          ><a href="#servicios" class="commercial-link">Ver servicios y precios ↓</a>
        </div>
      </div>
      <aside class="agency-board" aria-label="Los roles de tu departamento de marketing">
        <div class="agency-board__top">
          <span>TU DEPARTAMENTO DE MARKETING</span><span class="agency-board__dot" />
        </div>
        <ul>
          <li v-for="role in roles" :key="role.name">{{ role.name }}</li>
        </ul>
        <div class="agency-board__bottom">UN RESPONSABLE. TODOS LOS ROLES. TU MARCA AL MANDO.</div>
      </aside>
      <dl class="agency-metrics">
        <div>
          <dt>Hasta un 78 % menos</dt>
          <dd>que contratar a un responsable de marketing. <a href="#cuentas">Ver el cálculo</a></dd>
        </div>
        <div>
          <dt>8 roles, 1 responsable</dt>
          <dd>Un solo interlocutor para todo tu marketing.</dd>
        </div>
        <div>
          <dt>24 horas, 7 días</dt>
          <dd>Comentarios y mensajes atendidos, dentro de las reglas que apruebes.</dd>
        </div>
      </dl>
    </section>

    <section class="section">
      <div class="section-head">
        <span class="eyebrow">El problema</span>
        <h2>Tu negocio funciona.<br />Tu marketing depende de que te sobre tiempo.</h2>
      </div>
      <div class="agency-facts">
        <article v-for="fact in facts" :key="fact.value">
          <strong>{{ fact.value }}</strong>
          <p>{{ fact.text }}</p>
          <a :href="fact.url" target="_blank" rel="noopener noreferrer">{{ fact.source }} ↗</a>
        </article>
      </div>
    </section>

    <section id="servicios" class="section">
      <div class="section-head">
        <span class="eyebrow">Dos formas de trabajar con nosotros</span>
        <h2>Solo tu web.<br />O todo tu marketing.</h2>
      </div>
      <div class="agency-services">
        <article class="commercial-card agency-service--main">
          <span class="eyebrow">Te lo llevamos todo</span>
          <h3>Departamento de marketing</h3>
          <p>
            Nos encargamos de absolutamente todo: estrategia, marca, contenido, publicidad, web y
            respuestas en Instagram. Si hace falta, conectamos WhatsApp y Telegram.
          </p>
          <div class="agency-scales">
            <div v-for="scale in management.scales" :key="scale.id">
              <span>{{ scale.name }}</span>
              <strong>Desde {{ euro(scale.monthly) }} €/mes</strong>
              <small
                >+ IVA · Alta {{ euro(scale.setup) }} € · Latinoamérica desde
                {{ euro(scale.latam_monthly_usd) }} USD/mes</small
              >
              <p>{{ scale.description }}</p>
              <a href="#contacto" class="commercial-button" @click="selectScale(scale.id)"
                >Pedir mi plan ↗</a
              >
            </div>
          </div>
          <p class="agency-note">
            Sin permanencia. El precio final depende de tu negocio y se fija en tu propuesta.
            Inversión en anuncios y producción externa, aparte.
          </p>
        </article>
        <article class="commercial-card">
          <span class="eyebrow">Solo lo que necesitas</span>
          <h3>Página web</h3>
          <p>
            Una web pensada para vender, entregada y tuya. Sin obligación de contratar nada más.
          </p>
          <strong class="agency-price">Desde {{ euro(web.from_price) }} €</strong>
          <small>+ IVA · Latinoamérica desde {{ euro(web.latam_from_usd) }} USD</small>
          <RouterLink
            to="/webs-y-aplicaciones"
            class="commercial-link"
            @click="trackEvent('web_project_click')"
            >Ver páginas web ↗</RouterLink
          >
        </article>
      </div>
    </section>

    <section class="section split agency-clinic">
      <div>
        <span class="eyebrow">Clínica Digital · Para quien trabaja por su cuenta</span>
        <h2>¿Eres profesional independiente?<br />También tenemos algo para ti.</h2>
        <p class="intro">
          Para psicólogos, coaches y terapeutas: tu web profesional y tres asistentes con IA por
          {{ clinic.monthly }} €/mes, sin permanencia. El criterio clínico sigue en tus manos.
        </p>
        <RouterLink
          to="/clinica-digital"
          class="commercial-link"
          @click="trackEvent('digital_clinic_click')"
          >Ver Clínica Digital ↗</RouterLink
        >
      </div>
      <ul class="agency-clinic__team">
        <li><strong>Nora</strong> Atiende las consultas administrativas.</li>
        <li><strong>Alex</strong> Mantiene todo funcionando.</li>
        <li><strong>Valeria</strong> Prepara tu contenido.</li>
      </ul>
    </section>

    <section id="equipo" class="section">
      <div class="section-head">
        <span class="eyebrow">Qué incluye tu departamento</span>
        <h2>Todos los roles.<br />Una sola persona a la que llamar.</h2>
        <p class="intro">
          Un responsable con más de 12 años en marketing dirige tu cuenta. Agentes de IA trabajan a
          todas horas siguiendo los lineamientos de tu marca. Cada criterio importante lo revisa una
          persona.
        </p>
      </div>
      <div class="agency-roles">
        <article v-for="role in roles" :key="role.name">
          <h3>{{ role.name }}</h3>
          <p>{{ role.text }}</p>
        </article>
      </div>
    </section>

    <section class="section">
      <div class="section-head">
        <span class="eyebrow">Por qué somos distintos</span>
        <h2>No aplicamos la misma fórmula a todos.</h2>
      </div>
      <div class="agency-compare" role="table" aria-label="Agencia de paquetes frente a Diginode">
        <div role="row" class="agency-compare__head">
          <span role="columnheader">Agencia de paquetes</span
          ><span role="columnheader">Diginode</span>
        </div>
        <div v-for="row in compare" :key="row[0]" role="row">
          <span role="cell">{{ row[0] }}</span
          ><strong role="cell">{{ row[1] }}</strong>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-head">
        <span class="eyebrow">Hoy, mañana y dentro de tres años</span>
        <h2>Pensamos en las ventas de este mes.<br />Y en la marca que estás construyendo.</h2>
      </div>
      <div class="commercial-grid">
        <article v-for="item in horizons" :key="item.label">
          <span class="commercial-number">{{ item.label }}</span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.text }}</p>
        </article>
      </div>
      <p class="agency-first-month">
        <strong>Tú mandas:</strong> apruebas la marca, el presupuesto y lo nuevo. Te enseñamos el
        contenido con 15 días de antelación y nos reunimos cada mes o cada quince días.
      </p>
    </section>

    <section id="cuentas" class="section split">
      <div>
        <span class="eyebrow">Las cuentas claras</span>
        <h2>Más roles por menos de un sueldo.</h2>
        <p class="intro">
          Un responsable de marketing cuesta unos 4.300 € al mes a tu empresa, y cubre una sola
          persona. Tu departamento con Diginode parte de {{ euro(micro.monthly) }} €.
        </p>
      </div>
      <div class="agency-costs">
        <div>
          <span>Contratar a un responsable</span><strong>≈ 51.700 €/año</strong>
          <small>Salario medio de 39.453 € + ≈ 31 % de cotización</small>
        </div>
        <div>
          <span>Diginode Microempresa</span><strong>Desde 11.170 €/año</strong>
          <small>78 % menos el primer año, con alta incluida</small>
        </div>
        <div>
          <span>Diginode Pyme</span><strong>Desde 23.670 €/año</strong>
          <small>54 % menos el primer año, con alta incluida</small>
        </div>
        <p>
          Estimación sin IVA ni inversión publicitaria. Salario:
          <a
            href="https://es.indeed.com/career/marketing-manager/salaries"
            target="_blank"
            rel="noopener noreferrer"
            >Indeed, octubre de 2026 ↗</a
          >. No es una promesa de ahorro ni de resultados: un empleado propio y un servicio externo
          no son lo mismo.
        </p>
      </div>
    </section>

    <section id="demo-nora" class="section split">
      <div>
        <span class="eyebrow">Compruébalo ahora</span>
        <h2>Así atendemos a tus clientes cuando tú no puedes.</h2>
        <p class="intro">
          Habla con Nora, nuestra asistente con IA, sin registrarte. Cuéntale qué vendes y qué te
          quita tiempo.
        </p>
        <p>
          Nora es IA y lo dice desde el primer mensaje. La agenda de esta demo es simulada y no
          reserva citas.
        </p>
      </div>
      <LazyNora context="agency" />
    </section>

    <section class="section split">
      <div>
        <span class="eyebrow">Sin humo</span>
        <h2>Estamos empezando.<br />Por eso no te enseñamos casos que no existen.</h2>
      </div>
      <div>
        <p class="intro">
          Aún no tenemos clientes que mostrarte, y no te vamos a engañar con clientes que no
          tenemos. Lo que sí tenemos es oficio: sabemos lo que hacemos.
        </p>
        <dl class="agency-experience">
          <div>
            <dt>+12 años</dt>
            <dd>trabajando en marketing: fundadores y responsables de Diginode.</dd>
          </div>
          <div>
            <dt>+6 años</dt>
            <dd>de experiencia de nuestro programador.</dd>
          </div>
        </dl>
        <p>Las cifras de esta página son de fuentes públicas, no resultados nuestros.</p>
      </div>
    </section>

    <section class="section">
      <div class="section-head">
        <span class="eyebrow">Antes de escribirnos</span>
        <h2>Lo que conviene saber.</h2>
      </div>
      <details v-for="item in questions" :key="item.q">
        <summary>{{ item.q }}</summary>
        <p>{{ item.a }}</p>
      </details>
    </section>

    <section id="contacto" class="section split contact-section">
      <div class="contact-copy">
        <span class="eyebrow">Cuando el marketing se atasca</span>
        <h2>¿Qué te está quitando tiempo?</h2>
        <p class="intro">
          Cuéntanos qué te preocupa de tu marketing y te decimos cómo lo resolveríamos.
        </p>
        <p>
          Si prefieres hablarlo de otra forma:
          <a :href="CONTACT.whatsapp" target="_blank" rel="noopener noreferrer" @click="trackContact('whatsapp', 'contact_section')">WhatsApp</a>,
          <a :href="CONTACT.telegram" target="_blank" rel="noopener noreferrer">Telegram</a> o
          <a href="mailto:info@midiginode.com">info@midiginode.com</a>.
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
import { CONTACT } from '@/data/contact'
import { trackEvent } from '@/lib/analytics'
import { trackContact } from '@/lib/contactTracking'
const { services, load } = useServices()
const byId = (id) => services.value.find((service) => service.id === id)
const management = computed(() => byId('brand_management'))
const web = computed(() => byId('web_project'))
const clinic = computed(() => byId('digital_clinic'))
const micro = computed(() => management.value.scales[0])
const euro = (value) => new Intl.NumberFormat('es-ES', { useGrouping: 'always' }).format(value)
const selectedScale = ref('pending')
function selectScale(value) {
  selectedScale.value = value
  trackEvent('lead_cta_click')
}
const facts = [
  {
    value: '85 %',
    text: 'de las micropymes españolas lleva su marketing digital por su cuenta. En el 45 % de los casos lo hace el propio dueño.',
    source: 'Beedigital, 2026',
    url: 'https://www.pymeactual.es/noticias/20260707/-60-pymes-espanolas-preve-aumentar-su-inversion-en-marketing-digital-aqui-2030',
  },
  {
    value: '29 %',
    text: 'cree tener los conocimientos necesarios sobre herramientas digitales.',
    source: 'Beedigital, 2026',
    url: 'https://www.pymeactual.es/noticias/20260707/-60-pymes-espanolas-preve-aumentar-su-inversion-en-marketing-digital-aqui-2030',
  },
  {
    value: '37 %',
    text: 'de los pequeños negocios no tiene tiempo para mantener una presencia constante en redes.',
    source: 'GoDaddy, 2025',
    url: 'https://www.godaddy.com/resources/es/emprender/redes-sociales-y-pymes-en-espana-2025',
  },
  {
    value: '36 %',
    text: 'de las empresas de menos de 10 empleados tiene página web. En las de 10 o más, el 83 %.',
    source: 'INE, octubre de 2026',
    url: 'https://www.ine.es/dyngs/Prensa/ETICCE20251T2026.htm',
  },
]
const roles = [
  { name: 'Dirección y estrategia', text: 'Decide prioridades según tu negocio y tus márgenes.' },
  { name: 'Marca', text: 'Define o ajusta tu identidad, tu mensaje y tu tono.' },
  { name: 'Contenido', text: 'Prepara publicaciones, textos y guiones con tu voz.' },
  { name: 'Diseño', text: 'Da a todas las piezas una imagen reconocible.' },
  { name: 'Publicidad', text: 'Dirige tus anuncios con el presupuesto que autorices.' },
  { name: 'Web y SEO', text: 'Crea o mejora tu web para que te encuentren y te escriban.' },
  { name: 'Comunidad y mensajes', text: 'Responde comentarios y mensajes directos, y avisa de lo delicado.' },
  { name: 'Medición', text: 'Te explica qué funciona, en consultas y ventas, no en «me gusta».' },
]
const compare = [
  ['Paquetes cerrados de publicaciones', 'Un plan hecho para tu negocio'],
  ['La misma fórmula para todos', 'Parte de tu cliente, tu oferta y tus márgenes'],
  ['Persigue lo viral', 'Persigue clientes y una marca que dure'],
  ['Mide alcance y seguidores', 'Mide consultas, presupuestos y ventas'],
  ['Te atiende quien esté libre', 'Tienes siempre al mismo responsable'],
]
const horizons = [
  {
    label: 'CORTO PLAZO · 30 DÍAS',
    title: 'Ordenar y atender.',
    text: 'Revisamos tu negocio, corregimos lo urgente y dejamos de perder consultas.',
  },
  {
    label: 'MEDIO PLAZO · 3 A 6 MESES',
    title: 'Generar demanda.',
    text: 'Publicidad, contenido y web trabajan juntos para traerte clientes adecuados.',
  },
  {
    label: 'LARGO PLAZO · 12 MESES O MÁS',
    title: 'Construir marca.',
    text: 'Que te recuerden, te recomienden y dependas menos de pagar cada visita.',
  },
]
const questions = [
  {
    q: '¿Quién hace el trabajo?',
    a: 'Una persona dirige tu cuenta y responde ante ti. Agentes de IA preparan y ejecutan tareas dentro de los lineamientos que apruebas. Antes de contratar sabes quién es tu responsable y qué hará cada parte.',
  },
  {
    q: '¿También responden en Instagram y WhatsApp?',
    a: 'Sí. Atendemos comentarios y mensajes directos de Instagram y, si tu caso lo pide, conectamos WhatsApp y Telegram. Las respuestas automáticas se identifican como IA y lo delicado pasa a una persona.',
  },
  {
    q: '¿De verdad no son paquetes?',
    a: 'Los precios publicados son el punto de partida según el tamaño de tu operación. Lo que hacemos cada mes se decide con tu negocio delante, no por un número fijo de publicaciones.',
  },
  {
    q: '¿Trabajáis fuera de España?',
    a: 'Sí, también en Latinoamérica, en remoto y con precios en dólares estadounidenses.',
  },
  {
    q: '¿De quién son las cuentas, los materiales y los datos?',
    a: 'Tuyos. Dejamos por escrito la propiedad, los accesos, las licencias de terceros y cómo se hace la entrega si decides irte.',
  },
  {
    q: '¿Garantizáis ventas?',
    a: 'No. Nadie serio puede hacerlo. Acordamos objetivos, quién hace qué y cómo medirlo antes de empezar.',
  },
]
onMounted(load)
</script>
<style scoped lang="scss">
.agency-hero {
  display: grid;
  grid-template-columns: 1.45fr 0.75fr;
  align-items: center;
  gap: 3rem 4rem;
  padding-top: 64px !important;
  padding-bottom: 64px !important;
  h1 span {
    color: #87bcf4;
  }
  h1 {
    font-size: clamp(2.6rem, 5.4vw, 4.8rem);
  }
}
.agency-board {
  background: linear-gradient(145deg, #10233b, #0b1421);
  border: 1px solid #29476a;
  border-radius: 18px;
  padding: 1.5rem 1.8rem;
  box-shadow: 0 30px 80px #0005;
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  li {
    border-top: 1px solid #29415c;
    padding: 0.62rem 0;
    font-size: 1rem;
    font-weight: 500;
  }
  &__top,
  &__bottom {
    font-size: 0.62rem;
    letter-spacing: 0.13em;
    color: #a3b8d0;
    line-height: 1.8;
  }
  &__top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 0.8rem;
  }
  &__dot {
    background: #ffb94d;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex: none;
  }
  &__bottom {
    padding-top: 0.8rem;
    border-top: 1px solid #29415c;
  }
}
.agency-metrics {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem;
  margin: 0;
  div {
    border-left: 2px solid #ffb94d;
    padding-left: 1.1rem;
  }
  dt {
    color: #ffb94d;
    font-size: clamp(1.3rem, 2.2vw, 1.75rem);
    font-weight: 650;
    letter-spacing: -0.03em;
  }
  dd {
    margin: 0.4rem 0 0;
    color: #acbacb;
    font-size: 0.92rem;
    line-height: 1.5;
  }
  a {
    color: #87bcf4;
    text-decoration: underline;
  }
}
.agency-facts {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1.5rem;
  strong {
    display: block;
    color: #87bcf4;
    font-size: clamp(2.2rem, 4vw, 3.2rem);
    font-weight: 600;
    letter-spacing: -0.04em;
  }
  p {
    margin: 0.6rem 0;
  }
  a {
    color: #94a3b8;
    font-size: 0.78rem;
    text-decoration: underline;
  }
}
.agency-services {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  align-items: stretch;
  .commercial-link {
    display: inline-block;
    margin-top: 1.5rem;
  }
  small {
    display: block;
    color: #94a3b8;
    font-size: 0.8rem;
    line-height: 1.5;
  }
}
.agency-service--main {
  border-color: #ffb94d;
}
.agency-scales {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem;
  margin-top: 1.5rem;
  > div {
    display: flex;
    flex-direction: column;
    background: #101b29;
    border-radius: 12px;
    padding: 1.3rem;
  }
  span {
    color: #60b0ff;
    font-size: 0.8rem;
    font-weight: 600;
  }
  strong {
    font-size: 1.45rem;
    font-weight: 600;
    margin: 0.4rem 0;
  }
  p {
    margin: 0.8rem 0 1.2rem;
    flex: 1;
    font-size: 0.92rem;
  }
}
.agency-note {
  font-size: 0.85rem;
}
.agency-price {
  display: block;
  margin-top: 2rem;
  font-size: 1.45rem;
  font-weight: 600;
}
.agency-clinic__team {
  list-style: none;
  padding: 0;
  margin: 0;
  li {
    color: #acbacb;
    padding: 1rem 0;
    border-top: 1px solid rgba(96, 176, 255, 0.2);
  }
  strong {
    display: block;
    color: #ffb94d;
    font-size: 1.1rem;
    font-weight: 600;
  }
}
.agency-experience {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin: 1.8rem 0;
  dt {
    color: #ffb94d;
    font-size: clamp(1.9rem, 3.4vw, 2.6rem);
    font-weight: 650;
    letter-spacing: -0.04em;
  }
  dd {
    margin: 0.3rem 0 0;
    color: #acbacb;
    line-height: 1.5;
  }
}
.agency-roles {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1.8rem 1.5rem;
  h3 {
    font-size: 1.1rem;
    letter-spacing: -0.02em;
  }
  p {
    margin-top: 0.5rem;
    font-size: 0.95rem;
    line-height: 1.55;
  }
}
.agency-compare {
  > div {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    padding: 1rem 0;
    border-top: 1px solid rgba(96, 176, 255, 0.2);
  }
  span {
    color: #94a3b8;
  }
  strong {
    font-weight: 500;
  }
  &__head span {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    &:last-child {
      color: #ffb94d;
    }
  }
}
.agency-first-month {
  padding: 1.5rem;
  border-left: 2px solid #ffb94d;
  margin-top: 2.5rem;
  background: #0c141f;
}
.agency-costs {
  display: grid;
  gap: 1.3rem;
  div {
    display: grid;
    gap: 0.2rem;
    border-bottom: 1px solid rgba(96, 176, 255, 0.2);
    padding-bottom: 1.1rem;
  }
  span {
    color: #60b0ff;
    font-size: 0.85rem;
  }
  strong {
    font-size: 1.5rem;
    font-weight: 600;
  }
  small {
    color: #94a3b8;
  }
  p {
    font-size: 0.82rem;
  }
  a {
    color: #87bcf4;
  }
}
@media (max-width: 950px) {
  .agency-hero {
    grid-template-columns: 1fr;
    gap: 2.2rem;
  }
  .agency-board {
    grid-row: 3;
  }
  .agency-facts,
  .agency-roles {
    grid-template-columns: 1fr 1fr;
  }
  .agency-services {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 650px) {
  .agency-hero {
    padding-top: 40px !important;
  }
  .agency-metrics,
  .agency-scales,
  .agency-facts,
  .agency-roles {
    grid-template-columns: 1fr;
  }
  .agency-compare > div {
    gap: 0.8rem;
    font-size: 0.92rem;
  }
}
</style>
