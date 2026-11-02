<template>
  <div class="commercial-page landing">
    <LandingBackground />
    <p v-if="paymentReturn" class="clinic-payment" role="status">
      Has vuelto del pago. Te enviaremos tu acceso por email en cuanto Stripe confirme el cobro.
      ¿Dudas? Escríbenos por WhatsApp.
    </p>

    <!-- 1 · El dolor y la promesa -->
    <section class="landing__hero">
      <h1 class="rise">¿Pasas más tiempo contestando<br />mensajes que en consulta?</h1>
      <p class="landing__slogan rise rise--2">
        Descansa. <span>Nosotros nos encargamos de todo.</span>
      </p>
      <p class="landing__line rise rise--3">
        Tu web profesional y tres asistentes con IA que atienden, agendan y publican por ti. Tú solo
        pasas consulta.
      </p>
      <div class="clinic-actions rise rise--4">
        <button type="button" class="commercial-button clinic-actions__buy" :disabled="buying" @click="buyClinica">
          {{ buying ? 'Abriendo pago…' : 'Contratar Clínica Digital' }}
        </button>
        <a href="#demo-nora" class="clinic-actions__nora">Hablar con Nora ↓</a>
      </div>
      <p class="landing__pill rise rise--5">
        Los recordatorios de cita reducen un <strong>25 % las ausencias</strong>¹
      </p>
      <a href="#clinica" class="landing__scroll" aria-label="Ver más"><span /></a>
    </section>

    <!-- 2 · Qué hace cada asistente y cuánto cuesta -->
    <section id="clinica" class="landing__section">
      <h2 v-reveal>Tres asistentes.<br /><span>Una consulta que se organiza sola.</span></h2>
      <ul class="landing__shift">
        <li v-for="(row, i) in shift" :key="row[0]" v-reveal :style="{ '--delay': `${i * 120}ms` }">
          <s>{{ row[0] }}</s><span class="landing__arrow" aria-hidden="true">→</span
          ><strong>{{ row[1] }}</strong>
        </li>
      </ul>
      <p v-reveal class="landing__values">
        El criterio clínico siempre es tuyo. Nora no diagnostica ni da consejo clínico.
      </p>
      <div v-reveal class="landing__prices">
        <div>
          <span>Instalación</span><strong>{{ clinic.setup }} €</strong>
        </div>
        <div>
          <span>Después</span><strong>{{ clinic.monthly }} €/mes</strong>
        </div>
        <div>
          <span>Permanencia</span><strong>Ninguna</strong>
        </div>
      </div>
      <p v-reveal class="landing__fine">
        IVA incluido · Tu dominio y los datos de tus pacientes son tuyos desde el primer día
      </p>
    </section>

    <!-- 3 · Probar a Nora y decidir -->
    <section id="demo-nora" class="landing__section landing__close">
      <div v-reveal class="landing__card clinic-demo">
        <div class="clinic-demo__copy">
          <h2>Habla con Nora.<br /><span>Así atendería a tus pacientes.</span></h2>
          <p>
            Pregúntale lo que te preguntan a ti: precios, horarios o cómo pedir cita. Es una demo con
            IA; no escribas datos de pacientes.
          </p>
          <button type="button" class="commercial-button clinic-actions__buy" :disabled="buying" @click="buyClinica">
            {{ buying ? 'Abriendo pago…' : 'Contratar Clínica Digital' }}
          </button>
          <HomeActions quiet :question="question" />
          <p class="clinic-demo__links">
            <RouterLink to="/es-para-mi">¿Es para mi consulta?</RouterLink> ·
            <RouterLink to="/faq">Preguntas frecuentes</RouterLink> ·
            <RouterLink to="/login">Ya soy cliente</RouterLink>
          </p>
        </div>
        <LazyNora context="clinic" />
      </div>
      <p class="landing__note">
        ¹ Metaanálisis de 21 estudios en atención sanitaria: con recordatorios digitales, las
        ausencias bajaron del 21 % al 15 %.
        <a href="https://pubmed.ncbi.nlm.nih.gov/27798006/" target="_blank" rel="noopener noreferrer">BMJ Open, 2016</a>.
        Dato de la investigación, no un resultado garantizado en tu consulta.
      </p>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import LazyNora from '@/components/public/LazyNora.vue'
import HomeActions from '@/components/public/HomeActions.vue'
import LandingBackground from '@/components/public/LandingBackground.vue'
import { useCheckout } from '@/composables/useCheckout'
import { useServices } from '@/data/services'
import { vReveal } from '@/composables/useReveal'
const { buying, buyClinica } = useCheckout()
const { services, load } = useServices()
const clinic = computed(() => services.value.find((service) => service.id === 'digital_clinic'))
const route = useRoute()
const paymentReturn = computed(() => !!route.query.compra)
const question = 'Hola, tengo una duda sobre la Clínica Digital para mi consulta.'
const shift = [
  ['Mensajes sin responder entre sesiones', 'Nora responde y agenda a cualquier hora'],
  ['Una web que nadie mantiene', 'Alex la mantiene funcionando'],
  ['Redes abandonadas', 'Valeria prepara tu contenido'],
]
onMounted(load)
</script>

<style lang="scss" scoped>
.clinic-payment {
  width: min(860px, calc(100% - 32px));
  margin: 24px auto 0;
  padding: 1rem 1.2rem;
  border-radius: 12px;
  border: 1px solid rgba(32, 213, 210, 0.5);
  background: rgba(32, 213, 210, 0.08);
  color: #e3ecf7;
}
.clinic-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 1.4rem;
}
.clinic-actions__buy {
  font-size: 1.08rem;
  padding: 1.1rem 1.8rem;
  box-shadow: 0 14px 50px rgba(255, 185, 77, 0.35);
}
.clinic-actions__nora {
  color: #e3ecf7;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 5px;
}
.clinic-demo {
  grid-template-columns: 1fr 1fr;
  align-items: center;
  text-align: left;
  justify-items: stretch;
  gap: 3rem;
  h2 {
    font-size: clamp(1.8rem, 3.4vw, 2.8rem);
    margin: 0;
  }
}
.clinic-demo__copy {
  display: grid;
  gap: 1.4rem;
  justify-items: start;
  :deep(.home-actions) {
    justify-content: flex-start;
  }
}
.clinic-demo__links {
  font-size: 0.85rem;
  a {
    color: #87bcf4;
  }
}
@media (max-width: 900px) {
  .clinic-demo {
    grid-template-columns: 1fr;
  }
}
</style>
