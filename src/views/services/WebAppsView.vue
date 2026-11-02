<template>
  <div class="commercial-page landing">
    <LandingBackground />

    <!-- 1 · El dolor y la promesa -->
    <section class="landing__hero">
      <h1 class="rise">¿Tu web no te trae<br />clientes?</h1>
      <p class="landing__slogan rise rise--2">
        Descansa. <span>Nosotros nos encargamos de todo.</span>
      </p>
      <p class="landing__line rise rise--3">
        Diseñamos y construimos a medida la web que tu negocio necesita para vender. Sin plantillas.
      </p>
      <HomeActions class="rise rise--4" :question="question" />
      <p class="landing__pill rise rise--5">
        <strong>Desde {{ euro(web.from_price) }} €</strong> · Tuya desde el primer día
      </p>
      <a href="#web" class="landing__scroll" aria-label="Ver más"><span /></a>
    </section>

    <!-- 2 · Qué cambia y cuánto cuesta -->
    <section id="web" class="landing__section">
      <h2 v-reveal>Una web hecha para vender.<br /><span>No para adornar.</span></h2>
      <ul class="landing__shift">
        <li v-for="(row, i) in shift" :key="row[0]" v-reveal :style="{ '--delay': `${i * 120}ms` }">
          <s>{{ row[0] }}</s><span class="landing__arrow" aria-hidden="true">→</span
          ><strong>{{ row[1] }}</strong>
        </li>
      </ul>
      <p v-reveal class="landing__values">Primero entendemos cómo vendes. Después diseñamos.</p>
      <div v-reveal class="landing__prices">
        <div v-for="price in prices" :key="price[0]">
          <span>{{ price[0] }}</span>
          <strong>{{ price[1] }}</strong>
        </div>
      </div>
      <p v-reveal class="landing__fine">
        Precios desde, + IVA · Sin obligación de contratar marketing · Latinoamérica desde
        {{ euro(web.latam_from_usd) }} USD
      </p>
      <p v-reveal class="landing__trust">
        <b>+6 años</b> desarrollando <i aria-hidden="true">·</i> <b>+12</b> en marketing
        <i aria-hidden="true">·</i> Código, datos y accesos a tu nombre
      </p>
    </section>

    <!-- 3 · Una sola decisión -->
    <section id="contacto" class="landing__section landing__close">
      <div v-reveal class="landing__card">
        <h2>Aclara tus dudas<br /><span>o recibe una propuesta.</span></h2>
        <HomeActions quiet :question="question" />
        <div class="landing__or"><span>o</span></div>
        <p class="landing__ask">
          <strong>¿Tienes 3 minutos?</strong> Cuéntanos qué necesitas y te enviamos una propuesta
          con precio.
        </p>
        <ProposalForm service="web_project" landing="/webs-y-aplicaciones" />
      </div>
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
const { services, load } = useServices()
const euro = (value) => new Intl.NumberFormat('es-ES', { useGrouping: 'always' }).format(value)
const web = computed(() => services.value.find((service) => service.id === 'web_project'))
const question = 'Hola, vengo de vuestra web y tengo una duda sobre una página web para mi negocio.'
// Matches the internal pricing starting points (pricing_service.js in the API).
const prices = computed(() => [
  ['Web profesional', `${euro(web.value.from_price)} €`],
  ['Tienda online', `${euro(web.value.from_price + 1500)} €`],
  ['Aplicación a medida', `${euro(web.value.from_price + 2000)} €`],
])
const shift = [
  ['Plantilla genérica', 'Diseño a medida de tu negocio'],
  ['Una web que nadie visita', 'Pensada para que te encuentren y te escriban'],
  ['Depender de alguien para cada cambio', 'Tuya, con código, datos y accesos a tu nombre'],
]
onMounted(load)
</script>
