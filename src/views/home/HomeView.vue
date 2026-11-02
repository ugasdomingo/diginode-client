<template>
  <div class="commercial-page landing">
    <LandingBackground />

    <!-- 1 · El dolor y la promesa -->
    <section class="landing__hero">
      <h1 class="rise">¿Tu marketing no se nota<br />en tus ingresos?</h1>
      <p class="landing__slogan rise rise--2">
        Descansa. <span>Nosotros nos encargamos de todo.</span>
      </p>
      <p class="landing__line rise rise--3">
        Unimos redes, anuncios, web, tu local y el boca a boca en un solo plan con un objetivo:
        traerte clientes.
      </p>
      <HomeActions class="rise rise--4" />
      <p class="landing__pill rise rise--5">
        <strong>Ahorra hasta un 78 %</strong> frente a contratar a un responsable de marketing¹
      </p>
      <a href="#equipo" class="landing__scroll" aria-label="Ver más"><span /></a>
    </section>

    <!-- 2 · Qué cambia, por cuánto y por qué fiarse -->
    <section id="equipo" class="landing__section">
      <h2 v-reveal>
        Un equipo de marketing entero<br /><span>pensando en cómo traerte clientes.</span>
      </h2>
      <ul class="landing__shift">
        <li v-for="(row, i) in shift" :key="row[0]" v-reveal :style="{ '--delay': `${i * 120}ms` }">
          <s>{{ row[0] }}</s><span class="landing__arrow" aria-hidden="true">→</span
          ><strong>{{ row[1] }}</strong>
        </li>
      </ul>
      <p v-reveal class="landing__values">
        Todo el marketing se hace de acuerdo a tu filosofía y tus valores.
      </p>
      <div v-reveal class="landing__prices">
        <div v-for="price in prices" :key="price.label">
          <span>{{ price.label }}</span>
          <strong>{{ price.amount }}</strong>
        </div>
      </div>
      <p v-reveal class="landing__fine">
        Precios desde, + IVA · Sin permanencia · Latinoamérica en USD
      </p>
      <p v-reveal class="landing__trust">
        <b>+12 años</b> en marketing <i aria-hidden="true">·</i> <b>+6</b> en desarrollo
        <i aria-hidden="true">·</i> Sin casos inventados
      </p>
    </section>

    <!-- 3 · Una sola decisión -->
    <section id="contacto" class="landing__section landing__close">
      <div v-reveal class="landing__card">
        <h2>Aclara tus dudas<br /><span>o recibe una propuesta.</span></h2>
        <HomeActions quiet />
        <div class="landing__or"><span>o</span></div>
        <p class="landing__ask">
          <strong>¿Tienes 3 minutos?</strong> Rellena este formulario y te enviamos una propuesta con
          precio.
        </p>
        <ProposalForm />
      </div>
    </section>

    <!-- 4 · Profesionales independientes -->
    <section class="landing__section landing__close">
      <div v-reveal class="landing__aside">
        <div>
          <h2>¿Eres psicólogo, coach o terapeuta?</h2>
          <p>
            Clínica Digital: tu web y tres asistentes con IA para tu consulta.
            {{ clinic.setup }} € de instalación y {{ clinic.monthly }} €/mes.
          </p>
        </div>
        <RouterLink
          to="/clinica-digital"
          class="landing__link"
          @click="trackEvent('digital_clinic_click')"
          >Conocer Clínica Digital <span aria-hidden="true">→</span></RouterLink
        >
      </div>
      <p class="landing__note">
        ¹ Salario medio de 39.453 € según
        <a href="https://es.indeed.com/career/marketing-manager/salaries" target="_blank" rel="noopener noreferrer">Indeed (2026)</a>
        más ≈ 31 % de cotización, frente a {{ euro(micro.monthly) }} €/mes y {{ euro(micro.setup) }} € de
        alta el primer año. Sin IVA ni inversión en anuncios. No es una promesa de resultados.
      </p>
    </section>
  </div>
</template>
<script setup>
import { computed, onMounted } from 'vue'
import HomeActions from '@/components/public/HomeActions.vue'
import ProposalForm from '@/components/public/ProposalForm.vue'
import LandingBackground from '@/components/public/LandingBackground.vue'
import { useServices } from '@/data/services'
import { vReveal } from '@/composables/useReveal'
import { trackEvent } from '@/lib/analytics'
const { services, load } = useServices()
const byId = (id) => services.value.find((service) => service.id === id)
const euro = (value) => new Intl.NumberFormat('es-ES', { useGrouping: 'always' }).format(value)
const scales = computed(() => byId('brand_management').scales)
const micro = computed(() => scales.value[0])
const clinic = computed(() => byId('digital_clinic'))
const prices = computed(() => [
  { label: 'Microempresa', amount: `${euro(scales.value[0].monthly)} €/mes` },
  { label: 'Pyme', amount: `${euro(scales.value[1].monthly)} €/mes` },
  { label: 'Solo web', amount: `${euro(byId('web_project').from_price)} €` },
])
const shift = [
  ['Redes sociales sin resultados', 'Redes que atraen clientes'],
  ['Anuncios sin resultados', 'Anuncios medidos en clientes y ventas'],
  ['Respuestas genéricas que no convierten', 'Respuestas que convierten, a cualquier hora'],
]
onMounted(load)
</script>
