<template>
  <div class="lab-shell">
    <header class="lab-header">
      <a class="brand" href="/lab.html"><img src="/logo.png" alt="" /><span>Diginode<small>Laboratorio de operaciones</small></span></a>
      <label class="profile-switch">Negocio de prueba<select v-model="selectedBusiness" :disabled="busy" @change="connect"><option value="diginode">Diginode</option><option value="consulta-demo">Consulta de prueba</option></select></label>
    </header>
    <div class="sandbox-banner"><strong>Prueba local · datos ficticios</strong><span>Agenda interna y respuestas por plantillas. Pagos, correo y redes están simulados; no se envía ni cobra nada.</span></div>
    <main>
      <div v-if="error" class="notice notice--error" role="alert">{{ error }}<button class="text-button" @click="error = ''">Cerrar</button></div>
      <div v-if="notice" class="notice" role="status">{{ notice }}</div>
      <div v-if="!snapshot" class="lab-panel empty"><h1>Prepara tu prueba de Diginode</h1><p>Abre la API local con <code>npm run lab</code> en diginode-api y vuelve a conectar.</p><button :disabled="busy" @click="connect">{{ busy ? 'Conectando…' : 'Conectar laboratorio' }}</button></div>
      <template v-else>
        <div class="page-heading"><div><p class="eyebrow">Un asistente · cinco departamentos</p><h1>{{ snapshot.business.config.name }}</h1><p class="muted">{{ snapshot.business.config.assistant_name }} · {{ plan.name }} · {{ snapshot.business.config.timezone }}</p></div><div class="actions"><span class="pill" :class="{ 'pill--green': snapshot.business.status === 'sandbox_live' }">{{ businessStatus }}</span><button class="secondary" :disabled="busy" @click="refresh">Actualizar</button></div></div>
        <nav class="tabs" aria-label="Departamentos"><button v-for="item in tabs" :key="item.id" :class="{ active: tab === item.id }" @click="tab = item.id">{{ item.label }}</button></nav>
        <section v-if="tab === 'overview'" class="stack">
          <div class="metrics"><article v-for="metric in metrics" :key="metric.label" class="lab-panel"><span class="muted">{{ metric.label }}</span><strong>{{ metric.value }}</strong></article></div>
          <div class="two-columns">
            <section class="lab-panel"><p class="eyebrow">Tu próxima prueba</p><h2>De la conversación a la operación</h2><ol class="steps"><li>Registra un interesado y prueba la recepción.</li><li>Reserva una cita en un hueco disponible.</li><li>Completa el pago simulado y la incorporación.</li><li>Crea, revisa y programa una pieza de contenido.</li><li>Revisa entregas y cambia de negocio.</li></ol><button @click="tab = 'reception'">Empezar por recepción</button></section>
            <section class="lab-panel"><p class="eyebrow">Calidad y dirección</p><h2>Control y continuidad</h2><p>{{ snapshot.business.paused ? 'El asistente está pausado para atención humana.' : 'El asistente de prueba está atendiendo.' }}</p><div class="actions"><button class="secondary" :disabled="busy" @click="action('/pause', { paused: !snapshot.business.paused })">{{ snapshot.business.paused ? 'Reanudar asistente' : 'Pausar asistente' }}</button><button class="secondary" :disabled="busy" @click="exportData">Exportar este negocio</button></div><p class="muted">{{ snapshot.usage.responses }} / {{ plan.responses }} respuestas de prueba este mes. Coste externo: 0 €; las integraciones están desactivadas.</p><p class="muted">Los cambios se guardan en este equipo. La sesión local caduca después de una hora.</p></section>
          </div>
          <section class="lab-panel"><div class="section-heading"><h2>Entregas simuladas</h2><button class="secondary" :disabled="busy" @click="action('/jobs/run', {})">Procesar trabajos pendientes</button></div><p class="muted">{{ pendingJobs }} trabajos pendientes. Se comprueban los vencimientos cada cinco segundos.</p><div v-if="!snapshot.deliveries.length" class="empty">Aún no hay entregas. Reserva una cita o programa una pieza.</div><div v-for="delivery in [...snapshot.deliveries].reverse().slice(0, 10)" :key="delivery.id" class="list-row"><div><strong>{{ deliveryTitle(delivery) }}</strong><p class="muted">{{ delivery.payload.email ?? delivery.payload.channel }} · {{ date(delivery.created_at) }}</p><p v-if="delivery.payload.copy" class="delivery-copy">{{ delivery.payload.copy }}</p></div><span class="pill">Simulación</span></div></section>
          <section class="lab-panel"><h2>Actividad del negocio</h2><div v-for="event in snapshot.audit.slice(0, 8)" :key="event.id" class="list-row"><span>{{ event.action }}</span><time class="muted">{{ date(event.created_at) }}</time></div><p v-if="!snapshot.audit.length" class="muted">Tus primeras acciones aparecerán aquí.</p></section>
        </section>
        <section v-if="tab === 'reception'" class="two-columns">
          <div class="lab-panel"><p class="eyebrow">Recepción y comercial</p><h2>Registra un interesado</h2><form class="stack" @submit.prevent="saveContact"><label>Nombre<input v-model="contactForm.name" required minlength="2" maxlength="100" /></label><label>Correo ficticio<input v-model="contactForm.email" type="email" required placeholder="persona@ejemplo.test" /></label><label class="check"><input v-model="contactForm.followup_consent" type="checkbox" /> Permite seguimiento en la simulación</label><button :disabled="busy">Guardar interesado</button></form><div v-for="lead in snapshot.contacts" :key="lead.id" class="list-row"><div><strong>{{ lead.name }}</strong><p class="muted">{{ lead.email }}</p></div><button class="secondary" @click="activeContact = lead.id">Seleccionar</button></div></div>
          <div class="lab-panel"><h2>Prueba al asistente</h2><label>Interesado<select v-model="activeContact"><option value="">Selecciona o registra una persona</option><option v-for="lead in snapshot.contacts" :key="lead.id" :value="lead.id">{{ lead.name }}</option></select></label><div class="chat-log" aria-live="polite"><div v-for="message in contactMessages" :key="message.id"><p class="chat-message chat-message--user">{{ message.text }}</p><p class="chat-message">{{ message.reply }}</p><span v-if="message.pending_human" class="pill">Revisión humana pendiente</span></div><p v-if="!contactMessages.length" class="muted">Pregunta por precios o agenda. Prueba «necesito un diagnóstico» para comprobar la derivación.</p></div><form class="stack" @submit.prevent="sendMessage"><label>Mensaje<textarea v-model="messageText" maxlength="1500" required rows="2" /></label><button :disabled="busy || !activeContact">Enviar en simulación</button></form></div>
        </section>
        <section v-if="tab === 'agenda'" class="stack">
          <div class="lab-panel"><p class="eyebrow">Agenda y operaciones</p><h2>Reserva en la agenda interna</h2><p class="muted">Huecos de prueba para catorce días. No se conecta con calendarios externos.</p><form class="form-grid" @submit.prevent="book"><label>Interesado<select v-model="activeContact" required><option value="">Selecciona una persona</option><option v-for="lead in snapshot.contacts" :key="lead.id" :value="lead.id">{{ lead.name }}</option></select></label><label>Servicio<select v-model="serviceId" @change="safeLoadSlots"><option v-for="service in snapshot.business.services" :key="service.id" :value="service.id">{{ service.name }} · {{ money(service.price_cents) }}</option></select></label><label>Horario<select v-model="selectedSlot" required><option v-for="slot in slots" :key="slot.starts_at" :value="slot.starts_at">{{ date(slot.starts_at) }}</option></select></label><button :disabled="busy || !activeContact || !selectedSlot">Confirmar reserva de prueba</button></form></div>
          <div class="lab-panel"><h2>Reservas</h2><p v-if="!snapshot.appointments.length" class="muted">Registra primero un interesado y elige su horario.</p><div v-for="appointment in [...snapshot.appointments].reverse()" :key="appointment.id" class="list-row"><div><strong>{{ contactName(appointment.contact_id) }}</strong><p>{{ date(appointment.starts_at) }}</p><span class="pill">{{ appointment.status === 'confirmed' ? 'Confirmada en agenda local' : 'Cancelada' }}</span></div><div v-if="appointment.status === 'confirmed'" class="actions"><button class="secondary" :disabled="busy || !selectedSlot" @click="reschedule(appointment)">Cambiar al hueco seleccionado</button><button class="secondary" :disabled="busy" @click="action(`/bookings/${appointment.id}/cancel`, {})">Cancelar</button></div></div></div>
        </section>
        <LabContent v-if="tab === 'marketing'" :key="selectedBusiness" :items="snapshot.contents" :usage="snapshot.usage" :plan="plan" :business-name="snapshot.business.config.name" :busy="busy" @action="action" />
        <section v-if="tab === 'administration'" class="stack">
          <div class="plan-grid"><article v-for="offer in snapshot.plans" :key="offer.slug" class="lab-panel"><span class="eyebrow">{{ offer.name }}</span><h2>{{ money(offer.monthly_cents) }}<small>/mes</small></h2><p>{{ money(offer.setup_cents) }} de instalación</p><p class="muted">{{ offer.responses }} respuestas · {{ offer.content }} piezas/mes</p><button :disabled="busy || snapshot.business.subscription === 'sandbox_paid'" @click="action('/checkout', { plan: offer.slug })">Simular contratación</button></article></div>
          <div class="two-columns"><section class="lab-panel"><p class="eyebrow">Incorporación</p><h2>Prepara la activación</h2><form class="stack" @submit.prevent="onboard"><label>Nombre del negocio<input v-model="onboarding.business_name" required minlength="2" /></label><label>Correo del responsable<input v-model="onboarding.owner_email" type="email" required /></label><label class="check"><input v-model="onboarding.materials_received" type="checkbox" required /> Materiales recibidos</label><label class="check"><input v-model="onboarding.schedule_reviewed" type="checkbox" required /> Agenda revisada</label><label class="check"><input v-model="onboarding.responses_reviewed" type="checkbox" required /> Respuestas revisadas</label><button :disabled="busy || snapshot.business.subscription !== 'sandbox_paid'">Guardar incorporación</button><button type="button" class="secondary" :disabled="busy || !snapshot.business.onboarding || snapshot.business.status === 'sandbox_live'" @click="action('/activate', {})">Activar cuenta de prueba</button></form></section><section class="lab-panel"><h2>Pagos simulados</h2><p class="muted">El primero incluye mensualidad e instalación. No se usa Stripe ni se emiten facturas reales.</p><div v-for="payment in snapshot.payments" :key="payment.id" class="list-row"><div><strong>{{ money(payment.amount_cents) }}</strong><p class="muted">Mensualidad {{ money(payment.monthly_cents) }} + instalación {{ money(payment.setup_cents) }}</p></div><span class="pill">Sin cargo real</span></div><p v-if="!snapshot.payments.length" class="muted">Elige un plan para recorrer la incorporación.</p></section></div>
        </section>
        <section v-if="tab === 'configuration'" class="lab-panel"><p class="eyebrow">Configuración por negocio</p><h2>Tu marca y conocimiento aprobado</h2><form class="stack" @submit.prevent="action('/config', configForm, 'PUT')"><div class="form-grid"><label>Negocio<input v-model="configForm.name" required /></label><label>Asistente<input v-model="configForm.assistant_name" required /></label><label>País · dos letras<input v-model="configForm.country" pattern="[A-Z]{2}" required /></label><label>Zona horaria<input v-model="configForm.timezone" required /></label><label>Correo del responsable<input v-model="configForm.owner_email" type="email" required /></label></div><label>Tono<textarea v-model="configForm.tone" rows="2" required /></label><div v-for="(faq, index) in configForm.faq" :key="index" class="stack"><label>Pregunta frecuente<input v-model="faq.question" required /></label><label>Respuesta aprobada<textarea v-model="faq.answer" rows="3" required /></label></div><button :disabled="busy">Guardar configuración</button></form></section>
      </template>
    </main>
    <footer>Versión de prueba · solo en este equipo · {{ snapshot?.catalogue_version ?? '2026-10-09' }}</footer>
  </div>
</template>
<script setup>
import { computed, onMounted, onUnmounted, reactive, ref, toRaw } from 'vue'
import LabContent from './LabContent.vue'
const selectedBusiness = ref('diginode'), snapshot = ref(null), busy = ref(false), error = ref(''), notice = ref(''), tab = ref('overview')
const activeContact = ref(''), serviceId = ref(''), selectedSlot = ref(''), slots = ref([]), messageText = ref('¿Qué incluye el servicio y cuánto cuesta?')
const contactForm = reactive({ name: '', email: '', followup_consent: false }), configForm = reactive({}), onboarding = reactive({ business_name: '', owner_email: '', materials_received: false, schedule_reviewed: false, responses_reviewed: false })
let token = '', timer
const tabs = [{ id: 'overview', label: 'Dirección y calidad' }, { id: 'reception', label: 'Recepción' }, { id: 'agenda', label: 'Agenda' }, { id: 'marketing', label: 'Marketing' }, { id: 'administration', label: 'Administración' }, { id: 'configuration', label: 'Configuración' }]
const plan = computed(() => snapshot.value?.plans.find((item) => item.slug === snapshot.value.business.plan))
const businessStatus = computed(() => ({ configuring: 'En configuración', testing: 'En revisión', sandbox_live: 'Activa en simulación' })[snapshot.value?.business.status] ?? 'Pendiente')
const pendingJobs = computed(() => snapshot.value?.jobs.filter((job) => job.status === 'pending').length ?? 0)
const contactMessages = computed(() => snapshot.value?.messages.filter((item) => item.contact_id === activeContact.value) ?? [])
const metrics = computed(() => [{ label: 'Interesados', value: snapshot.value.metrics.leads }, { label: 'Reservas activas', value: snapshot.value.metrics.bookings }, { label: 'Piezas por revisar', value: snapshot.value.metrics.content_pending }, { label: 'Derivaciones humanas', value: snapshot.value.metrics.escalations }])
const money = (cents) => new Intl.NumberFormat('es', { style: 'currency', currency: 'EUR' }).format(cents / 100)
const date = (value) => new Intl.DateTimeFormat('es', { dateStyle: 'medium', timeStyle: 'short', timeZone: snapshot.value?.business.config.timezone ?? 'Europe/Madrid' }).format(new Date(value))
const contactName = (id) => snapshot.value.contacts.find((lead) => lead.id === id)?.name ?? 'Contacto'
const deliveryTitle = (item) => item.payload.channel ? 'Contenido listo para publicar' : ({ cancellation: 'Cancelación de cita', reminder: 'Recordatorio de cita', confirmation: 'Confirmación de cita' })[item.payload.kind] ?? 'Seguimiento'
async function request(path, body, method = body === undefined ? 'GET' : 'POST') {
  const response = await fetch(`/lab-api${path}`, { method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) })
  let payload
  try { payload = await response.json() } catch { throw new Error('No se puede conectar con la API local. Comprueba que npm run lab está activo en diginode-api.') }
  if (!response.ok) throw new Error(payload.message ?? 'No se pudo completar la operación.')
  return payload.data
}
async function loadSlots() {
  if (!serviceId.value || !token) return
  slots.value = await request(`/slots?service_id=${encodeURIComponent(serviceId.value)}`)
  if (!slots.value.some((item) => item.starts_at === selectedSlot.value)) selectedSlot.value = slots.value[0]?.starts_at ?? ''
}
async function safeLoadSlots() { try { await loadSlots() } catch (err) { error.value = err.message } }
async function load() {
  snapshot.value = await request('/snapshot')
  serviceId.value = snapshot.value.business.services.some((item) => item.id === serviceId.value) ? serviceId.value : snapshot.value.business.services[0]?.id ?? ''
  await loadSlots()
}
async function connect() {
  if (busy.value) return
  busy.value = true; error.value = ''; notice.value = ''; snapshot.value = null; token = ''; activeContact.value = ''; serviceId.value = ''; slots.value = []
  try {
    token = (await request('/session', { business_id: selectedBusiness.value })).token
    await load()
    Object.assign(configForm, structuredClone(toRaw(snapshot.value.business.config)))
    Object.assign(onboarding, { business_name: configForm.name, owner_email: configForm.owner_email, materials_received: false, schedule_reviewed: false, responses_reviewed: false }, snapshot.value.business.onboarding ?? {})
  } catch (err) { error.value = err.message } finally { busy.value = false }
}
async function refresh() {
  if (busy.value || !token) return
  busy.value = true
  try { await load() } catch (err) { error.value = err.message } finally { busy.value = false }
}
async function action(path, body, method = 'POST') {
  if (busy.value) return
  busy.value = true; error.value = ''; notice.value = ''
  try { const result = await request(path, body, method); await load(); notice.value = 'Cambios guardados en el laboratorio local.'; return result }
  catch (err) { error.value = err.message; return null } finally { busy.value = false }
}
async function saveContact() { const lead = await action('/contacts', contactForm); if (lead) { activeContact.value = lead.id; contactForm.name = ''; contactForm.email = ''; contactForm.followup_consent = false } }
async function sendMessage() { const result = await action('/messages', { contact_id: activeContact.value, text: messageText.value, request_key: crypto.randomUUID() }); if (result) messageText.value = '' }
function book() { return action('/bookings', { contact_id: activeContact.value, service_id: serviceId.value, starts_at: selectedSlot.value, request_key: crypto.randomUUID() }) }
function reschedule(item) { return action(`/bookings/${item.id}/reschedule`, { contact_id: item.contact_id, service_id: item.service_id, starts_at: selectedSlot.value, request_key: crypto.randomUUID() }) }
function onboard() { return action('/onboarding', onboarding) }
async function exportData() {
  try { const data = await request('/export'); const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })); const link = document.createElement('a'); link.href = url; link.download = `diginode-${selectedBusiness.value}-prueba.json`; link.click(); URL.revokeObjectURL(url) }
  catch (err) { error.value = err.message }
}
onMounted(() => { connect(); timer = setInterval(() => { if (tab.value === 'overview' && snapshot.value && !busy.value && !error.value) refresh() }, 5000) })
onUnmounted(() => clearInterval(timer))
</script>
