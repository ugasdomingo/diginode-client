<template>
  <div class="commercial-page proposal">
    <section class="proposal__card">
      <p v-if="loading">Cargando tu propuesta…</p>
      <template v-else-if="data">
        <span class="eyebrow">Propuesta {{ data.version > 1 ? `· versión ${data.version}` : '' }}</span>
        <h1>{{ data.company || 'Tu propuesta' }}</h1>
        <p v-if="data.contact_name" class="proposal__for">Para {{ data.contact_name }}</p>
        <p v-if="data.message" class="proposal__message">{{ data.message }}</p>

        <ul class="proposal__items">
          <li v-for="item in data.items" :key="item.label">
            <strong>{{ item.label }}</strong><span v-if="item.detail">{{ item.detail }}</span>
          </li>
        </ul>

        <dl class="proposal__totals">
          <template v-if="data.billing === 'subscription'">
            <div><dt>Mensualidad</dt><dd>{{ money(data.monthly) }}</dd></div>
            <div v-if="data.setup"><dt>Alta (una vez)</dt><dd>{{ money(data.setup) }}</dd></div>
          </template>
          <template v-else>
            <div><dt>Total del proyecto</dt><dd>{{ money(data.total) }}</dd></div>
            <div v-if="data.due_now !== data.total"><dt>Primer pago</dt><dd>{{ money(data.due_now) }}</dd></div>
          </template>
          <div v-if="data.vat_rate"><dt>IVA ({{ data.vat_rate }} %)</dt><dd>{{ money(vat, true) }}</dd></div>
          <div class="proposal__due">
            <dt>Pagas hoy</dt><dd>{{ money(data.amounts.first / 100, true) }}</dd>
          </div>
          <p v-if="data.billing === 'subscription'" class="proposal__after">
            Después, {{ money(data.amounts.monthly / 100, true) }} al mes con IVA. Sin permanencia.
          </p>
        </dl>

        <div v-if="paidReturn || data.status === 'paid'" class="proposal__state proposal__state--ok" role="status">
          {{ data.status === 'paid' ? 'Propuesta aceptada y pagada. Gracias: te escribimos para empezar.' : 'Estamos confirmando tu pago con Stripe. Te escribiremos en cuanto se confirme.' }}
        </div>
        <div v-else-if="data.status !== 'sent'" class="proposal__state" role="status">
          {{ data.status === 'expired' ? 'Esta propuesta ha caducado. Escríbenos y te enviamos una actualizada.' : 'Hay una versión más reciente de esta propuesta. Usa el último enlace que te enviamos.' }}
        </div>
        <template v-else>
          <button type="button" class="commercial-button proposal__pay" :disabled="paying" @click="pay">
            {{ paying ? 'Abriendo pago seguro…' : 'Aceptar y pagar' }}
          </button>
          <p class="proposal__small">
            Pagar es aceptar esta propuesta. Pago seguro con Stripe. Válida hasta el
            {{ new Date(data.valid_until).toLocaleDateString('es-ES') }}.
          </p>
        </template>
        <p v-if="error" role="alert" class="proposal__error">{{ error }}</p>

        <a
          :href="`${CONTACT.whatsapp}?text=${encodeURIComponent('Hola, quiero comentar mi propuesta de Diginode.')}`"
          target="_blank"
          rel="noopener noreferrer"
          class="proposal__talk"
          ><WhatsAppIcon /> ¿Quieres ajustar algo? Escríbenos</a
        >
      </template>
      <p v-else role="alert">{{ error || 'No encontramos esta propuesta.' }}</p>
    </section>
  </div>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import WhatsAppIcon from '@/components/public/WhatsAppIcon.vue'
import { useApi } from '@/composables/useApi'
import { CONTACT } from '@/data/contact'
const route = useRoute()
const data = ref(null),
  loading = ref(true),
  paying = ref(false),
  error = ref('')
const paidReturn = computed(() => route.query.pago === 'ok')
const net = computed(() =>
  data.value.billing === 'subscription'
    ? data.value.monthly + (data.value.setup || 0)
    : data.value.due_now
)
const vat = computed(() => data.value.amounts.first / 100 - net.value)
function money(value, gross = false) {
  const formatted = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: data.value.currency,
    useGrouping: 'always',
  }).format(value)
  return gross || !data.value.vat_rate ? formatted : `${formatted} + IVA`
}
async function pay() {
  paying.value = true
  error.value = ''
  try {
    const result = await useApi().post(`/proposals/${route.params.token}/checkout`)
    window.location.href = result.url
  } catch (err) {
    error.value = err.message
    paying.value = false
  }
}
onMounted(async () => {
  try {
    data.value = (await useApi().get(`/proposals/${route.params.token}`)).data
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})
</script>
<style scoped lang="scss">
.proposal {
  min-height: calc(100dvh - 80px);
  display: grid;
  place-items: center;
  padding: 48px 16px;
  background: radial-gradient(80% 60% at 50% 0%, rgba(30, 144, 255, 0.14), transparent 70%);
}
.proposal__card {
  width: min(680px, 100%);
  padding: clamp(1.5rem, 5vw, 3rem);
  border-radius: 24px;
  border: 1px solid rgba(96, 176, 255, 0.22);
  background: rgba(10, 17, 27, 0.85);
  box-shadow: 0 40px 120px rgba(0, 0, 0, 0.45);
  h1 {
    font-size: clamp(2rem, 5vw, 2.8rem);
  }
}
.proposal__for {
  margin-top: 0.4rem;
}
.proposal__message {
  margin-top: 1.4rem;
  color: #e3ecf7 !important;
  white-space: pre-line;
}
.proposal__items {
  list-style: none;
  padding: 0;
  margin: 2rem 0 0;
  li {
    display: grid;
    gap: 0.2rem;
    padding: 0.9rem 0;
    border-top: 1px solid #1f3550;
  }
  span {
    color: #94a3b8;
    font-size: 0.9rem;
  }
}
.proposal__totals {
  margin: 1.4rem 0 0;
  padding: 1.3rem;
  border-radius: 14px;
  background: #0d1828;
  div {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.35rem 0;
    color: #acbacb;
  }
  dd {
    margin: 0;
    color: #f8fafc;
    font-variant-numeric: tabular-nums;
  }
}
.proposal__due {
  margin-top: 0.6rem;
  padding-top: 0.9rem !important;
  border-top: 1px solid #1f3550;
  dt,
  dd {
    font-size: 1.25rem;
    font-weight: 650;
    color: #ffb94d !important;
  }
}
.proposal__after {
  margin-top: 0.5rem;
  font-size: 0.85rem;
}
.proposal__pay {
  width: 100%;
  margin-top: 1.8rem;
  font-size: 1.05rem;
}
.proposal__small {
  margin-top: 0.8rem;
  font-size: 0.8rem;
  text-align: center;
}
.proposal__state {
  margin-top: 1.8rem;
  padding: 1rem 1.2rem;
  border-radius: 12px;
  border: 1px solid #29476a;
  color: #e3ecf7;
  &--ok {
    border-color: rgba(32, 213, 210, 0.5);
    background: rgba(32, 213, 210, 0.08);
  }
}
.proposal__error {
  margin-top: 1rem;
  color: #ff6b6b;
}
.proposal__talk {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.8rem;
  color: #87bcf4;
  font-size: 0.92rem;
  svg {
    color: #25d366;
  }
}
</style>
