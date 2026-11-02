<template>
  <details class="lead-proposals" @toggle="onToggle">
    <summary>Cuestionario y propuestas</summary>
    <dl v-if="lead.questionnaire" class="lead-proposals__answers">
      <div v-for="row in answerRows" :key="row[0]"><dt>{{ row[0] }}</dt><dd>{{ row[1] }}</dd></div>
    </dl>
    <p v-if="lead.suggested_price" class="lead-proposals__suggested">
      Precio sugerido: <strong>{{ suggestedText }}</strong>
      <small>{{ lead.suggested_price.notes?.join(' · ') }}</small>
    </p>
    <ul v-if="proposals.length" class="lead-proposals__list">
      <li v-for="item in proposals" :key="item.id">
        v{{ item.version }} · {{ statusLabel[item.status] }} · {{ firstPayment(item) }}
        <button type="button" @click="copy(item.url)">Copiar enlace</button>
      </li>
    </ul>
    <form v-if="!paid" class="lead-proposals__form" @submit.prevent="create">
      <label>Servicio
        <select v-model="form.service">
          <option value="brand_management">Departamento de marketing</option>
          <option value="web_project">Página web</option>
        </select></label>
      <label>Moneda
        <select v-model="form.currency"><option>EUR</option><option>USD</option></select></label>
      <label>IVA %<input v-model.number="form.vat_rate" type="number" min="0" max="30" /></label>
      <template v-if="form.service === 'brand_management'">
        <label>Mensualidad (sin IVA)<input v-model.number="form.monthly" type="number" min="1" required /></label>
        <label>Alta (sin IVA)<input v-model.number="form.setup" type="number" min="0" /></label>
      </template>
      <template v-else>
        <label>Total (sin IVA)<input v-model.number="form.total" type="number" min="1" required /></label>
        <label>Cobrar ahora (sin IVA)<input v-model.number="form.due_now" type="number" min="1" :placeholder="form.total || ''" /></label>
      </template>
      <label class="wide">Qué incluye, una línea por concepto (opcional «concepto | detalle»)
        <textarea v-model="form.itemsText" rows="4" required /></label>
      <label class="wide">Mensaje para el cliente (opcional)<textarea v-model="form.message" rows="2" maxlength="2000" /></label>
      <label>Válida (días)<input v-model.number="form.valid_days" type="number" min="1" max="90" /></label>
      <label class="check"><input v-model="form.send_email" type="checkbox" /> Enviar por email</label>
      <button type="submit" :disabled="saving">{{ saving ? 'Creando…' : proposals.length ? 'Crear nueva versión' : 'Crear propuesta' }}</button>
    </form>
  </details>
</template>
<script setup>
import { computed, reactive, ref } from 'vue'
import { useApi } from '@/composables/useApi'
import { useToastStore } from '@/stores/toast'
const props = defineProps({ lead: { type: Object, required: true } })
const api = useApi()
const toast = useToastStore()
const proposals = ref([]),
  saving = ref(false)
let loaded = false
const suggested = props.lead.suggested_price || {}
const form = reactive({
  service: props.lead.service_interest === 'web_project' ? 'web_project' : 'brand_management',
  currency: suggested.currency || 'EUR',
  vat_rate: 21,
  monthly: suggested.monthly || null,
  setup: suggested.setup ?? 0,
  total: suggested.one_time || null,
  due_now: null,
  itemsText:
    props.lead.service_interest === 'web_project'
      ? 'Página web a medida | Diseño, desarrollo y puesta en marcha'
      : 'Departamento de marketing | Estrategia, marca, contenido, anuncios, web y atención de mensajes',
  message: '',
  valid_days: 15,
  send_email: true,
})
const statusLabel = { sent: 'enviada', superseded: 'sustituida', paid: 'pagada', expired: 'caducada' }
const paid = computed(() => proposals.value.some((item) => item.status === 'paid'))
const answerRows = computed(() =>
  Object.entries(props.lead.questionnaire).map(([key, value]) => [key, Array.isArray(value) ? value.join(', ') : value])
)
const suggestedText = computed(() =>
  suggested.kind === 'one_time'
    ? `${suggested.one_time} ${suggested.currency}`
    : `${suggested.monthly} ${suggested.currency}/mes + ${suggested.setup} de alta`
)
const firstPayment = (item) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: item.currency }).format(item.amounts.first / 100) + ' hoy'
async function load() {
  proposals.value = (await api.get(`/admin/leads/${props.lead._id}/proposals`)).data
}
function onToggle(event) {
  if (event.target.open && !loaded) {
    loaded = true
    load().catch((err) => toast.error(err.message))
  }
}
async function copy(url) {
  try {
    await navigator.clipboard.writeText(url)
    toast.success('Enlace copiado')
  } catch {
    window.prompt('Copia el enlace', url)
  }
}
async function create() {
  saving.value = true
  try {
    const items = form.itemsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [label, ...detail] = line.split('|')
        return { label: label.trim(), detail: detail.join('|').trim() }
      })
    const subscription = form.service === 'brand_management'
    const result = await api.post(`/admin/leads/${props.lead._id}/proposals`, {
      service: form.service,
      currency: form.currency,
      vat_rate: Number(form.vat_rate),
      items,
      ...(subscription
        ? { monthly: Number(form.monthly), setup: Number(form.setup) || 0 }
        : { total: Number(form.total), ...(form.due_now ? { due_now: Number(form.due_now) } : {}) }),
      message: form.message,
      valid_days: Number(form.valid_days),
      send_email: form.send_email,
    })
    await load()
    await copy(result.data.proposal.url)
    toast.success(result.data.emailed ? 'Propuesta creada y enviada por email' : 'Propuesta creada')
  } catch (err) {
    toast.error(err.message)
  } finally {
    saving.value = false
  }
}
</script>
<style scoped lang="scss">
.lead-proposals {
  margin-top: 0.6rem;
  summary {
    cursor: pointer;
    color: #ffb94d;
  }
}
.lead-proposals__answers {
  display: grid;
  gap: 0.2rem;
  margin: 0.6rem 0;
  font-size: 0.8rem;
  div {
    display: flex;
    gap: 0.5rem;
  }
  dt {
    color: #94a3b8;
    min-width: 110px;
  }
  dd {
    margin: 0;
  }
}
.lead-proposals__suggested small {
  display: block;
  color: #94a3b8;
}
.lead-proposals__list {
  padding-left: 1rem;
  font-size: 0.85rem;
  button {
    margin-left: 0.4rem;
  }
}
.lead-proposals__form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.6rem;
  margin-top: 0.6rem;
  label {
    display: grid;
    gap: 0.25rem;
    font-size: 0.8rem;
  }
  .wide {
    grid-column: 1 / -1;
  }
  .check {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }
  input,
  select,
  textarea {
    background: #0f1620;
    color: #f8fafc;
    padding: 0.5rem;
    border: 1px solid #29476a;
    border-radius: 6px;
    font: inherit;
  }
  button {
    grid-column: 1 / -1;
    padding: 0.6rem;
    border: 0;
    border-radius: 6px;
    background: #ffb94d;
    color: #08111e;
    font-weight: 600;
    cursor: pointer;
  }
}
</style>
