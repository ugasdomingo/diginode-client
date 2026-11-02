<template>
  <div class="proposal-form">
    <button type="button" class="commercial-button proposal-form__open" @click="openForm">
      {{ label }} <span aria-hidden="true">→</span>
    </button>
    <dialog ref="dialog" class="pf" aria-labelledby="pf-title" @close="onClose">
      <button type="button" class="pf__close" aria-label="Cerrar" @click="dialog.close()">✕</button>
      <div v-if="receipt" class="pf__done" role="status">
        <span class="pf__check" aria-hidden="true">✓</span>
        <h2 id="pf-title">Recibido.</h2>
        <p>Preparamos tu propuesta con precio y te la enviamos a {{ form.email }}.</p>
        <button type="button" class="commercial-button" @click="dialog.close()">Cerrar</button>
      </div>
      <form v-else @submit.prevent="next">
        <div class="pf__progress" aria-hidden="true"><span :style="{ width: progress }" /></div>
        <p class="pf__notice">Esto es una solicitud de propuesta. No pagas nada ni te comprometes a nada.</p>

        <fieldset v-if="step === 'service'">
          <legend id="pf-title">¿Qué buscas?</legend>
          <div class="pf__options pf__options--column">
            <button
              v-for="option in services"
              :key="option.value"
              type="button"
              :aria-pressed="form.service === option.value"
              @click="pick('service', option.value)"
            >
              <strong>{{ option.label }}</strong><small>{{ option.hint }}</small>
            </button>
          </div>
        </fieldset>

        <fieldset v-else-if="step === 'company'">
          <legend id="pf-title">Tu empresa</legend>
          <div v-for="question in companyQuestions" :key="question.key" class="pf__group">
            <span>{{ question.label }}</span>
            <div class="pf__options">
              <button
                v-for="option in question.options"
                :key="option[0]"
                type="button"
                :aria-pressed="answers[question.key] === option[0]"
                @click="answers[question.key] = option[0]"
              >
                {{ option[1] }}
              </button>
            </div>
          </div>
        </fieldset>

        <fieldset v-else-if="step === 'marketing'">
          <legend id="pf-title">Tu marketing hoy</legend>
          <div class="pf__group">
            <span>¿Por qué buscas ayuda ahora? <small>Puedes marcar varias</small></span>
            <div class="pf__options">
              <button
                v-for="option in reasons"
                :key="option[0]"
                type="button"
                :aria-pressed="answers.reasons.includes(option[0])"
                @click="toggle('reasons', option[0])"
              >
                {{ option[1] }}
              </button>
            </div>
          </div>
          <div class="pf__group">
            <span>Canales que usáis hoy</span>
            <div class="pf__options">
              <button
                v-for="option in channels"
                :key="option[0]"
                type="button"
                :aria-pressed="answers.channels.includes(option[0])"
                @click="toggle('channels', option[0])"
              >
                {{ option[1] }}
              </button>
            </div>
          </div>
          <div v-for="question in marketingQuestions" :key="question.key" class="pf__group">
            <span>{{ question.label }} <small v-if="question.hint">{{ question.hint }}</small></span>
            <div class="pf__options">
              <button
                v-for="option in question.options"
                :key="option[0]"
                type="button"
                :aria-pressed="answers[question.key] === option[0]"
                @click="answers[question.key] = option[0]"
              >
                {{ option[1] }}
              </button>
            </div>
          </div>
        </fieldset>

        <fieldset v-else-if="step === 'web'">
          <legend id="pf-title">Tu web</legend>
          <div class="pf__group">
            <span>¿Qué quieres lograr con tu web? <small>Puedes marcar varias</small></span>
            <div class="pf__options">
              <button
                v-for="option in webGoals"
                :key="option[0]"
                type="button"
                :aria-pressed="answers.web_goals.includes(option[0])"
                @click="toggle('web_goals', option[0])"
              >
                {{ option[1] }}
              </button>
            </div>
          </div>
          <div v-for="question in webQuestions" :key="question.key" class="pf__group">
            <span>{{ question.label }}</span>
            <div class="pf__options">
              <button
                v-for="option in question.options"
                :key="option[0]"
                type="button"
                :aria-pressed="answers[question.key] === option[0]"
                @click="answers[question.key] = option[0]"
              >
                {{ option[1] }}
              </button>
            </div>
          </div>
        </fieldset>

        <fieldset v-else class="pf__contact">
          <legend id="pf-title">¿A quién enviamos la propuesta?</legend>
          <label>Tu nombre<input v-model="form.name" name="name" autocomplete="name" required minlength="2" maxlength="100" /></label>
          <label>Empresa<input v-model="form.company" name="company" autocomplete="organization" required minlength="2" maxlength="160" /></label>
          <label>Email<input v-model="form.email" name="email" type="email" autocomplete="email" required maxlength="254" /></label>
          <label>WhatsApp <small>(opcional)</small><input v-model="form.phone" name="phone" type="tel" autocomplete="tel" maxlength="30" /></label>
          <label>Web actual <small>(opcional)</small><input v-model="form.website" name="website" type="url" placeholder="https://" maxlength="500" /></label>
          <label>¿Algo más? <small>(opcional)</small><textarea v-model="form.goal" name="goal" rows="2" maxlength="2000" /></label>
          <label class="pf__trap" aria-hidden="true">No rellenar<input v-model="honeypot" tabindex="-1" autocomplete="off" name="fax" /></label>
          <label class="pf__privacy"
            ><input v-model="acknowledged" type="checkbox" required /><span
              >He leído la <RouterLink to="/legal/privacidad" target="_blank">información de privacidad</RouterLink>. Usaremos estos datos solo para enviarte la propuesta.</span
            ></label
          >
        </fieldset>

        <p v-if="error" role="alert" class="pf__error">{{ error }}</p>
        <div class="pf__nav">
          <button v-if="index > 0" type="button" class="pf__back" @click="index--">← Atrás</button>
          <button v-if="step !== 'service'" type="submit" class="commercial-button" :disabled="sending || !ready">
            {{ step === 'contact' ? (sending ? 'Enviando…' : 'Recibir mi propuesta') : 'Siguiente' }}
          </button>
        </div>
      </form>
    </dialog>
  </div>
</template>
<script setup>
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { useApi } from '@/composables/useApi'
import { useServices } from '@/data/services'
import { trackEvent } from '@/lib/analytics'
const props = defineProps({
  // Preselected service skips the first question (web page, for example).
  service: { type: String, default: '' },
  landing: { type: String, default: '/' },
  label: { type: String, default: 'Solicitar mi propuesta' },
})
const { privacyVersion } = useServices()
const dialog = ref(null),
  index = ref(0),
  sending = ref(false),
  error = ref(''),
  receipt = ref(null),
  acknowledged = ref(false),
  honeypot = ref('')
const form = reactive({ service: props.service, name: '', company: '', email: '', phone: '', website: '', goal: '' })
const answers = reactive({ reasons: [], channels: [], web_goals: [] })
const services = [
  { value: 'brand_management', label: 'Que os encarguéis de todo mi marketing', hint: 'Web incluida' },
  { value: 'web_project', label: 'Solo una página web', hint: 'Pago único' },
  { value: 'undecided', label: 'Necesito orientación', hint: 'Te ayudamos a decidir' },
]
const companyQuestions = [
  { key: 'sector', label: 'Sector', options: [['distribution', 'Distribución o mayorista'], ['hospitality', 'Restaurante u hostelería'], ['retail', 'Comercio'], ['services', 'Servicios'], ['health', 'Salud y bienestar'], ['other', 'Otro']] },
  { key: 'employees', label: 'Empleados', options: [['1-2', '1-2'], ['3-5', '3-5'], ['6-10', '6-10'], ['11-20', '11-20'], ['21-50', '21-50'], ['50+', 'Más de 50']] },
  { key: 'locations', label: 'Locales o sedes', options: [['1', '1'], ['2-3', '2-3'], ['4+', 'Más de 3']] },
  { key: 'revenue', label: 'Facturación anual aproximada', options: [['lt150k', '< 150.000 €'], ['150k-500k', '150.000-500.000 €'], ['500k-2m', '500.000 €-2 M€'], ['gt2m', '> 2 M€'], ['unknown', 'Prefiero no decirlo']] },
  { key: 'country', label: 'País', options: [['ES', 'España'], ['MX', 'México'], ['CO', 'Colombia'], ['AR', 'Argentina'], ['CL', 'Chile'], ['PE', 'Perú'], ['other_latam', 'Otro de Latinoamérica'], ['other', 'Otro']] },
]
const reasons = [['few_clients', 'No me llegan suficientes clientes'], ['no_results', 'Invierto en marketing y no veo resultados'], ['no_time', 'No tengo tiempo para llevarlo'], ['weak_brand', 'Mi marca no transmite lo que somos'], ['grow', 'Quiero crecer o abrir un mercado']]
const channels = [['instagram', 'Instagram'], ['facebook', 'Facebook'], ['tiktok', 'TikTok'], ['linkedin', 'LinkedIn'], ['google', 'Google'], ['whatsapp', 'WhatsApp'], ['telegram', 'Telegram'], ['web', 'Web']]
const marketingQuestions = [
  { key: 'marketing_spend', label: '¿Cuánto invertís al mes en conseguir clientes?', hint: 'Personas, agencias y anuncios', options: [['none', 'Nada'], ['lt500', '< 500 €'], ['500-1500', '500-1.500 €'], ['1500-3000', '1.500-3.000 €'], ['gt3000', '> 3.000 €'], ['unknown', 'No lo sé']] },
  { key: 'new_clients', label: 'Clientes nuevos al mes (aproximado)', options: [['0-5', '0-5'], ['6-20', '6-20'], ['21-50', '21-50'], ['50+', 'Más de 50'], ['unknown', 'No lo sé']] },
]
const webGoals = [['sell_online', 'Vender online'], ['quotes', 'Recibir pedidos o presupuestos'], ['bookings', 'Reservas o citas'], ['contact', 'Que me encuentren y me contacten'], ['operations', 'Organizar mi negocio'], ['other', 'Otro']]
const webQuestions = [
  { key: 'brand_identity', label: '¿Tienes ya identidad de marca (logo, colores)?', options: [['yes', 'Sí'], ['partial', 'En parte'], ['no', 'No']] },
  { key: 'deadline', label: '¿Para cuándo la necesitas?', options: [['lt1m', 'Menos de 1 mes'], ['1-3m', '1-3 meses'], ['flexible', 'Sin prisa']] },
]
const steps = computed(() => [
  ...(props.service ? [] : ['service']),
  'company',
  form.service === 'web_project' ? 'web' : 'marketing',
  'contact',
])
const step = computed(() => steps.value[index.value])
const progress = computed(() => `${((index.value + 1) / steps.value.length) * 100}%`)
const ready = computed(() => {
  if (step.value === 'company') return companyQuestions.every((question) => answers[question.key])
  if (step.value === 'marketing') return answers.reasons.length > 0
  if (step.value === 'web') return answers.web_goals.length > 0
  return true
})
// Each step starts at the top of the dialog, not where the previous one was scrolled.
watch(index, async () => {
  await nextTick()
  dialog.value?.scrollTo({ top: 0, behavior: 'smooth' })
})
function openForm() {
  trackEvent('lead_cta_click')
  dialog.value.showModal()
}
function onClose() {
  if (receipt.value) {
    receipt.value = null
    index.value = 0
  }
}
function pick(key, value) {
  form[key] = value
  index.value++
}
function toggle(key, value) {
  answers[key] = answers[key].includes(value)
    ? answers[key].filter((item) => item !== value)
    : [...answers[key], value]
}
let submission = null
async function next() {
  if (!ready.value) return
  if (step.value !== 'contact') return index.value++
  if (sending.value || !acknowledged.value) return
  error.value = ''
  const questionnaire = Object.fromEntries(
    Object.entries(answers).filter(([key, value]) => {
      if (Array.isArray(value) && !value.length) return false
      if (form.service === 'web_project') return !['reasons', 'channels', 'marketing_spend', 'new_clients'].includes(key)
      return !['web_goals', 'brand_identity', 'deadline'].includes(key)
    })
  )
  const content = {
    service_interest: form.service,
    name: form.name.trim(),
    company: form.company.trim(),
    email: form.email.trim().toLowerCase(),
    phone: form.phone.trim(),
    website: form.website.trim(),
    goal: form.goal.trim().length >= 10 ? form.goal.trim() : '',
    questionnaire,
    landing_path: props.landing,
    privacy_version: privacyVersion,
    privacy_acknowledged: true,
    honeypot: honeypot.value,
  }
  const fingerprint = JSON.stringify(content)
  if (!submission || submission.fingerprint !== fingerprint)
    submission = { fingerprint, id: crypto.randomUUID() }
  sending.value = true
  try {
    receipt.value = await useApi().post('/leads', { request_id: submission.id, ...content })
    trackEvent('lead_submit_success')
  } catch (err) {
    error.value =
      err instanceof TypeError ? 'No se pudo conectar. Inténtalo de nuevo; tus respuestas siguen aquí.' : err.message
  } finally {
    sending.value = false
  }
}
</script>
<style scoped lang="scss">
.proposal-form__open {
  font-size: 1.12rem;
  padding: 1.15rem 2rem;
  box-shadow: 0 14px 50px rgba(255, 185, 77, 0.35);
  transition: transform 0.2s, box-shadow 0.2s;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 18px 60px rgba(255, 185, 77, 0.45);
  }
  span {
    display: inline-block;
    transition: transform 0.2s;
  }
  &:hover span {
    transform: translateX(4px);
  }
}
.pf {
  margin: auto;
  text-align: left;
  width: min(640px, calc(100% - 24px));
  max-height: calc(100dvh - 24px);
  padding: clamp(1.4rem, 4vw, 2.4rem);
  border: 1px solid #29476a;
  border-radius: 20px;
  background: #0b1421;
  color: #f8fafc;
  &::backdrop {
    background: rgba(3, 7, 12, 0.78);
    backdrop-filter: blur(6px);
  }
  &[open] {
    animation: pf-in 0.25s ease-out;
  }
}
@keyframes pf-in {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.98);
  }
}
.pf__close {
  position: absolute;
  top: 12px;
  right: 14px;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1px solid #29476a;
  background: transparent;
  color: #f8fafc;
  cursor: pointer;
}
.pf__progress {
  height: 4px;
  background: #13243a;
  border-radius: 4px;
  margin: 0.4rem 3rem 1.2rem 0;
  span {
    display: block;
    height: 100%;
    border-radius: 4px;
    background: linear-gradient(90deg, #1e90ff, #ffb94d);
    transition: width 0.3s ease;
  }
}
.pf p {
  max-width: none;
}
.pf__notice {
  font-size: 0.8rem;
  color: #94a3b8;
  margin-bottom: 2rem;
}
fieldset {
  border: 0;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 2.4rem;
}
legend {
  font-size: 1.7rem;
  font-weight: 600;
  letter-spacing: -0.03em;
  margin-bottom: 1.8rem;
}
.pf__group > span {
  display: block;
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  small {
    display: block;
    margin-top: 0.15rem;
  }
}
small {
  color: #94a3b8;
  font-weight: 400;
}
.pf__options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  button {
    font: inherit;
    font-size: 0.92rem;
    color: #e3ecf7;
    background: #0f1b2b;
    border: 1px solid #29476a;
    border-radius: 999px;
    padding: 0.65rem 1.1rem;
    min-height: 44px;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
    &:hover {
      border-color: #60b0ff;
    }
    &[aria-pressed='true'] {
      background: #ffb94d;
      border-color: #ffb94d;
      color: #08111e;
      font-weight: 600;
    }
  }
  &--column {
    flex-direction: column;
    button {
      display: grid;
      gap: 0.2rem;
      text-align: left;
      border-radius: 14px;
      padding: 1.1rem 1.2rem;
      font-size: 1.02rem;
    }
  }
}
.pf__contact label {
  display: grid;
  gap: 0.4rem;
  font-size: 0.9rem;
  font-weight: 500;
}
input:not([type='checkbox']),
textarea {
  width: 100%;
  font: inherit;
  font-size: 1rem;
  color: #f8fafc;
  background: #050a0f;
  border: 1px solid #29476a;
  border-radius: 8px;
  padding: 0.75rem;
}
.pf__privacy {
  display: flex !important;
  align-items: flex-start;
  gap: 0.6rem !important;
  font-size: 0.82rem !important;
  color: #acbacb;
  a {
    color: #87bcf4;
    text-decoration: underline;
  }
  input {
    width: 20px;
    height: 20px;
    flex: none;
  }
}
.pf__trap {
  position: absolute;
  left: -10000px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}
.pf__error {
  color: #ff6b6b;
  margin-top: 1rem;
}
.pf__nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-top: 2.4rem;
  padding-top: 1.4rem;
  border-top: 1px solid #1a2d45;
  .commercial-button {
    margin-left: auto;
  }
}
.pf__back {
  font: inherit;
  color: #acbacb;
  background: none;
  border: 0;
  cursor: pointer;
}
.pf__done {
  display: grid;
  justify-items: center;
  gap: 1rem;
  text-align: center;
  padding: 1.5rem 0;
  h2 {
    font-size: 2rem;
  }
  p {
    color: #acbacb;
  }
}
.pf__check {
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #ffb94d;
  color: #08111e;
  font-size: 1.8rem;
  font-weight: 700;
}
</style>
