<template>
  <section class="lab-panel">
    <div class="section-heading"><div><p class="eyebrow">Marketing</p><h2>Una idea, tres piezas</h2></div><span class="pill">{{ usage.content }} / {{ plan.content }} este mes</span></div>
    <p class="muted">El generador de prueba usa plantillas y tus notas. La IA y la publicación externa aún no están conectadas.</p>
    <form class="stack" @submit.prevent="generate">
      <label>Tu experiencia o idea<textarea v-model="source" rows="3" minlength="20" maxlength="5000" required placeholder="Comparte una idea real sobre tu servicio o una demostración…" /></label>
      <div class="inline"><label>Canal<select v-model="channel"><option value="instagram">Instagram</option><option value="linkedin">LinkedIn</option><option value="facebook">Facebook</option></select></label><button :disabled="busy || usage.content + 3 > plan.content">Crear tres borradores</button></div>
    </form>
  </section>
  <div class="content-grid">
    <article v-for="item in items" :key="item.id" class="lab-panel content-card">
      <div class="inline spread"><h3>{{ item.format }}</h3><span class="pill" :class="{ 'pill--green': item.status === 'sandbox_delivered' }">{{ statusLabel(item.status) }}</span></div>
      <p class="muted">{{ item.channel }} · Versión {{ item.revision }}</p>
      <label :for="`copy-${item.id}`">Texto de la pieza</label><textarea :id="`copy-${item.id}`" v-model="edits[item.id]" rows="8" maxlength="3000" :disabled="item.status === 'sandbox_delivered'" />
      <p v-if="changed(item)" class="muted">Guarda los cambios antes de aprobar.</p>
      <div class="actions">
        <button v-if="item.status !== 'sandbox_delivered'" class="secondary" :disabled="busy || !changed(item)" @click="$emit('action', `/content/${item.id}`, { copy: edits[item.id], revision: item.revision }, 'PUT')">Guardar</button>
        <button v-if="item.status === 'draft'" :disabled="busy || changed(item)" @click="$emit('action', `/content/${item.id}/approve`, { revision: item.revision })">Aprobar</button>
        <button v-if="item.status === 'approved'" :disabled="busy || changed(item)" @click="$emit('action', `/content/${item.id}/schedule`, { revision: item.revision, scheduled_at: new Date(Date.now() + 10000).toISOString() })">Programar prueba · 10 s</button>
        <button class="secondary" :disabled="changed(item)" @click="downloadDesign(item)">Descargar diseño</button>
      </div>
      <p v-if="item.scheduled_at" class="muted">Programada: {{ new Date(item.scheduled_at).toLocaleString('es') }}. La entrega aparece en la bandeja de simulación.</p>
    </article>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
const props = defineProps({ items: { type: Array, required: true }, usage: { type: Object, required: true }, plan: { type: Object, required: true }, businessName: { type: String, required: true }, busy: Boolean })
const emit = defineEmits(['action'])
const source = ref(''), channel = ref('instagram'), edits = reactive({})
watch(() => props.items, (items) => { for (const item of items) edits[item.id] = item.copy }, { immediate: true })
const changed = (item) => edits[item.id] !== item.copy
const statusLabel = (status) => ({ draft: 'Borrador', approved: 'Aprobada', scheduled: 'Programada', sandbox_delivered: 'Entregada en simulación' })[status] ?? status
function generate() { emit('action', '/content', { source: source.value, channel: channel.value }) }
function downloadDesign(item) {
  const escape = (value) => value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[char])
  const words = item.copy.replace(/\s+/g, ' ').slice(0, 230).split(' '), lines = []
  let line = ''
  for (const word of words) { if ((line + word).length > 30) { lines.push(line.trim()); line = '' } line += `${word} ` }
  if (line) lines.push(line.trim())
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080"><rect width="1080" height="1080" fill="#101b2b"/><circle cx="1030" cy="60" r="320" fill="#19474b"/><text x="90" y="145" fill="#84e0bf" font-size="32" font-family="Arial">${escape(props.businessName)}</text>${lines.slice(0, 8).map((text, i) => `<text x="90" y="${300 + i * 70}" fill="#f6f7f8" font-size="47" font-family="Arial">${escape(text)}</text>`).join('')}<text x="90" y="1000" fill="#aab8ca" font-size="25" font-family="Arial">${escape(item.format)} · Revisa antes de publicar</text></svg>`
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }))
  const link = document.createElement('a'); link.href = url; link.download = `diginode-${item.id}.svg`; link.click(); URL.revokeObjectURL(url)
}
</script>
