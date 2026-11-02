<template>
  <div class="lead-form">
    <div v-if="receipt" ref="receiptEl" class="lead-form__receipt" role="status" tabindex="-1">
      <span class="eyebrow">Lo hemos leído</span>
      <h3>Gracias por contárnoslo.</h3>
      <p>{{ receipt.message }}</p>
      <p>
        No te has suscrito a publicidad. Si quieres añadir algo, escribe a
        <a href="mailto:info@midiginode.com">info@midiginode.com</a>.
      </p>
      <a
        v-if="safeBooking"
        :href="safeBooking"
        target="_blank"
        rel="noopener noreferrer"
        class="commercial-button"
        @click="trackEvent('booking_click')"
        >Si te encaja, lo hablamos en una llamada ↗</a
      >
    </div>
    <form v-else @submit.prevent="submit">
      <div class="lead-form__intro">
        <h3>Cuéntanos qué te preocupa</h3>
        <p>De lo que te frena ahora. Con eso te decimos cómo lo resolveríamos.</p>
      </div>
      <div class="lead-form__grid">
        <label
          >Tu nombre
          <input
            v-model="form.name"
            name="name"
            autocomplete="name"
            required
            minlength="2"
            maxlength="100"
        /></label>
        <label
          >Empresa o consulta
          <input
            v-model="form.company"
            name="company"
            autocomplete="organization"
            required
            minlength="2"
            maxlength="160"
        /></label>
        <label
          >Email de contacto
          <input
            v-model="form.email"
            name="email"
            type="email"
            autocomplete="email"
            required
            maxlength="254"
        /></label>
        <label
          >¿Por dónde te ayudamos?<select v-model="form.service_interest" name="service">
            <option value="brand_management">El marketing, en general</option>
            <option value="web_project">La web o una herramienta</option>
            <option value="digital_clinic">La parte administrativa de la consulta</option>
            <option value="undecided">Aún no lo tengo claro</option>
          </select></label
        >
        <label v-if="form.service_interest === 'brand_management'"
          >Cómo es tu día a día<select v-model="form.requested_scale" name="scale">
            <option value="pending">Lo vemos juntos</option>
            <option value="micro">Microempresa</option>
            <option value="sme">Pyme</option>
          </select></label
        >
        <label
          >Web actual <span>(opcional)</span
          ><input
            v-model="form.website"
            name="website"
            type="url"
            placeholder="https://tuempresa.es"
            maxlength="500"
        /></label>
        <label v-if="['brand_management', 'web_project'].includes(form.service_interest)"
          >Si ya barajas una cifra
          <span>(opcional, no hace falta)</span>
          ><select v-model="form.budget_range" name="budget">
            <option value="pending">Pendiente de definir</option>
            <option v-for="budget in budgets" :key="budget.value" :value="budget.value">
              {{ budget.label }}
            </option>
          </select></label
        >
      </div>
      <label
        >¿Qué te está costando?<textarea
          v-model="form.goal"
          name="goal"
          rows="4"
          minlength="10"
          maxlength="2000"
          required
          placeholder="Qué te quita tiempo, qué te preocupa del marketing y qué te gustaría que fuera más fácil."
        />
      </label>
      <label class="lead-form__trap" aria-hidden="true"
        >Deja este campo vacío<input v-model="honeypot" tabindex="-1" autocomplete="off" name="fax"
      /></label>
      <label class="lead-form__privacy"
        ><input v-model="acknowledged" type="checkbox" name="privacy" required />
        <span
          >He leído la <RouterLink to="/legal/privacidad">información de privacidad</RouterLink>.
          Usaremos estos datos para responder a mi solicitud; no para suscribirme a
          publicidad.</span
        ></label
      >
      <label class="lead-form__privacy lead-form__journey">
        <input v-model="journeyConsent" type="checkbox" name="journey_consent" />
        <span
          >Acepto que Diginode asocie mi visita a mi solicitud (<RouterLink to="/legal/privacidad"
            >política de privacidad</RouterLink
          >).</span
        >
      </label>
      <p v-if="error" role="alert" class="lead-form__error">{{ error }} Tus datos siguen aquí.</p>
      <button type="submit" class="commercial-button" :disabled="sending">
        {{ sending ? 'Enviando…' : 'Cuéntanoslo' }} <span aria-hidden="true">↗</span>
      </button>
      <p class="lead-form__note">
        Lo leemos nosotros y te decimos cómo lo resolveríamos. Sin cuenta ni cobro.
      </p>
    </form>
  </div>
</template>
<script setup>
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '@/composables/useApi'
import { useServices } from '@/data/services'
import { trackEvent } from '@/lib/analytics'
import { trackContact } from '@/lib/contactTracking'
import { JOURNEY_CONSENT_VERSION, readVisitorId } from '@/lib/consent'
import { currentJourney } from '@/lib/journey'
import { publicPath, roundedIso } from '@/lib/measureContext'
const props = defineProps({
  service: { type: String, default: 'brand_management' },
  scale: { type: String, default: 'pending' },
})
const route = useRoute()
const { load, privacyVersion } = useServices()
const form = reactive({
  name: '',
  company: '',
  email: '',
  website: '',
  goal: '',
  service_interest: props.service,
  requested_scale: props.scale,
  budget_range: 'pending',
})
const honeypot = ref(''),
  acknowledged = ref(false),
  journeyConsent = ref(false),
  sending = ref(false),
  error = ref(''),
  receipt = ref(null),
  receiptEl = ref(null)
let submission = null
watch(
  () => props.scale,
  (value) => {
    form.requested_scale = value
  }
)
watch(
  () => form.service_interest,
  () => {
    form.requested_scale = 'pending'
    form.budget_range = 'pending'
  }
)
const budgets = computed(() =>
  form.service_interest === 'web_project'
    ? [
        { value: 'project_under_5000', label: 'Hasta 5.000 €' },
        { value: 'project_5000_10000', label: '5.000–10.000 €' },
        { value: 'project_over_10000', label: 'Más de 10.000 €' },
      ]
    : [
        { value: 'monthly_under_1500', label: 'Hasta 1.500 €/mes (sin publicidad)' },
        { value: 'monthly_1500_3000', label: '1.500–3.000 €/mes' },
        { value: 'monthly_over_3000', label: 'Más de 3.000 €/mes' },
      ]
)
const safeBooking = computed(() => {
  try {
    const url = new URL(receipt.value?.booking_url)
    return url.protocol === 'https:' && url.hostname === 'cal.com' ? url.href : null
  } catch {
    return null
  }
})
async function submit() {
  if (sending.value || !acknowledged.value) return
  error.value = ''
  const content = {
    ...form,
    email: form.email.trim().toLowerCase(),
    landing_path: route.path.replace(/\/+$/, '') || '/',
    privacy_version: privacyVersion,
    privacy_acknowledged: true,
    honeypot: honeypot.value,
  }
  if (journeyConsent.value) {
    const journey = currentJourney()
    const formAt = roundedIso()
    journey.events.push({
      type: 'contact_click',
      path: content.landing_path,
      at: formAt,
      contact_type: 'form',
      location: 'contact_section',
    })
    journey.consent = { version: JOURNEY_CONSENT_VERSION, at: formAt }
    content.journey = journey
    content.journey_consent = true
    const visitorId = readVisitorId()
    if (visitorId) content.visitor_id = visitorId
  }
  const fingerprint = JSON.stringify(content)
  if (!submission || submission.fingerprint !== fingerprint)
    submission = { fingerprint, id: crypto.randomUUID() }
  sending.value = true
  try {
    receipt.value = await useApi().post('/leads', { request_id: submission.id, ...content })
    trackEvent('lead_submit_success')
    trackContact('form', 'contact_section', publicPath(content.landing_path) || content.landing_path)
    await nextTick()
    receiptEl.value?.focus()
  } catch (err) {
    error.value =
      err instanceof TypeError
        ? 'No se pudo conectar. Comprueba tu conexión e inténtalo de nuevo.'
        : err.message || 'No se pudo enviar. Inténtalo de nuevo.'
  } finally {
    sending.value = false
  }
}
onMounted(load)
</script>
<style scoped lang="scss">
.lead-form {
  padding: clamp(1.25rem, 4vw, 2.5rem);
  background: $bg-card;
  border: 1px solid $border-hover;
  border-radius: 20px;
  form,
  label {
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
  }
  form {
    gap: 1.35rem;
  }
  label {
    color: $text;
    font-size: 0.88rem;
    font-weight: 500;
  }
  label span,
  &__note {
    color: $text-muted;
    font-size: 0.8rem;
    font-weight: 400;
  }
  input,
  select,
  textarea {
    min-width: 0;
    width: 100%;
    background: $bg;
    color: $text;
    border: 1px solid $border-hover;
    border-radius: 8px;
    padding: 0.85rem;
    font: inherit;
    font-size: 1rem;
  }
  input:focus,
  select:focus,
  textarea:focus {
    outline: 2px solid $primary;
    outline-offset: 2px;
  }
  textarea {
    resize: vertical;
  }
  &__intro {
    display: grid;
    gap: 0.35rem;
    h3 {
      font-size: 1.35rem;
      letter-spacing: -0.02em;
    }
    p {
      margin: 0;
      color: $text-muted;
      line-height: 1.6;
    }
  }
  &__grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
  }
  &__privacy {
    flex-direction: row !important;
    align-items: flex-start;
    input {
      width: 20px;
      height: 20px;
      flex: 0 0 auto;
    }
  }
  &__trap {
    position: absolute;
    left: -10000px;
    width: 1px;
    height: 1px;
    overflow: hidden;
  }
  &__error {
    color: $danger;
  }
  &__receipt {
    display: grid;
    gap: 1.4rem;
    h3 {
      font-size: 1.8rem;
    }
    p {
      line-height: 1.7;
    }
  }
  a {
    color: $primary-light;
    text-decoration: underline;
  }
  @media (max-width: 600px) {
    &__grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
