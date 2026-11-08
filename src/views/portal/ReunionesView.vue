<template>
  <div class="ops-page">
    <header class="ops-head">
      <div>
        <p class="ops-kicker">Agenda</p>
        <h1 class="ops-title">Cuándo nos vemos</h1>
        <p class="ops-lead">Las citas confirmadas están abajo. Si necesitas otra, pide día y hora: no hace falta un calendario de terceros.</p>
      </div>
    </header>
    <OpsState :loading="loading" :error="error" @retry="reload">
      <div class="ops-split">
        <div class="stack">
          <article v-for="meeting in data" :key="meeting.id" class="ops-panel">
            <p class="ops-chip" :class="{ 'ops-chip--warn': meeting.status === 'requested' }">
              {{ meeting.status === 'requested' ? 'Solicitada' : 'Confirmada' }}
            </p>
            <h2>{{ meeting.title }}</h2>
            <p>{{ formatDateTime(meeting.starts_at) }}</p>
            <p class="ops-card__meta">{{ meeting.place }}</p>
            <p v-if="meeting.notes">{{ meeting.notes }}</p>
          </article>
          <p v-if="data && !data.length" class="ops-state">No hay reuniones en el calendario.</p>
        </div>
        <form class="ops-panel ops-form" @submit.prevent="submit">
          <h2>Pedir otra</h2>
          <label class="ops-field">
            <span>Día y hora</span>
            <input v-model="when" type="datetime-local" required />
          </label>
          <label class="ops-field">
            <span>Cómo</span>
            <select v-model="channel">
              <option value="videollamada">Videollamada</option>
              <option value="llamada">Llamada</option>
              <option value="visita">Visita al negocio</option>
            </select>
          </label>
          <label class="ops-field">
            <span>Nota</span>
            <textarea v-model="note" maxlength="500" placeholder="Por ejemplo: mejor antes de abrir" />
          </label>
          <AppButton type="submit" :loading="saving">Enviar solicitud</AppButton>
        </form>
      </div>
      <EmbedGate
        title="Calendario externo"
        :src="embedUrl"
        why="Un calendario incrustado (Cal.com u otro) deja cookies de ese servicio. Si no lo permites, esta página sigue sirviendo: usa el formulario de arriba."
      />
    </OpsState>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { listMeetings, requestMeeting } from '@/api/ops/client'
import { formatDateTime } from '@/api/ops/format'
import { useAsyncData } from '@/composables/useAsyncData'
import { useToastStore } from '@/stores/toast'
import AppButton from '@/components/ui/AppButton.vue'
import EmbedGate from '@/components/consent/EmbedGate.vue'
import OpsState from '@/components/ops/OpsState.vue'

const toast = useToastStore()
const { data, error, loading, reload } = useAsyncData(listMeetings)
const when = ref('')
const channel = ref('videollamada')
const note = ref('')
const saving = ref(false)
const embedUrl = import.meta.env.VITE_SCHEDULING_EMBED_URL || ''

async function submit() {
  saving.value = true
  try {
    await requestMeeting({
      preferred_at: new Date(when.value).toISOString(),
      channel: channel.value,
      note: note.value,
    })
    when.value = ''
    note.value = ''
    toast.success('Solicitud enviada. Domingo te confirma la hora.')
    await reload()
  } catch (err) {
    toast.error(err.message)
  } finally {
    saving.value = false
  }
}
</script>

<style lang="scss" scoped>
.stack { display: flex; flex-direction: column; gap: $space-3; }
h2 { font-size: $text-xl; }
</style>
