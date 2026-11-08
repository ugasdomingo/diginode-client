<template>
  <div class="ops-page">
    <header class="ops-head">
      <div>
        <p class="ops-kicker">Agenda</p>
        <h1 class="ops-title">Cuándo nos vemos</h1>
        <p class="ops-lead">Las citas las confirma Domingo. Aquí solo se leen. Si hay un calendario externo, se abre debajo y pide permiso antes de cargarse.</p>
      </div>
    </header>
    <OpsState :loading="loading" :error="error" @retry="reload">
      <div class="stack">
        <article v-for="meeting in data" :key="meeting.id" class="ops-panel">
          <p class="ops-chip" :class="{ 'ops-chip--warn': meeting.status === 'cancelada' }">
            {{ meetingStatusLabel(meeting.status) }}
          </p>
          <h2>{{ meeting.title || 'Reunión' }}</h2>
          <p>{{ formatDateTime(meeting.starts_at) }}</p>
          <p v-if="meeting.location" class="ops-card__meta">{{ meeting.location }}</p>
          <p v-if="meeting.notes">{{ meeting.notes }}</p>
        </article>
        <p v-if="data && !data.length" class="ops-state">No hay reuniones en el calendario.</p>
      </div>
      <EmbedGate
        title="Calendario externo"
        :src="embedUrl"
        why="Un calendario incrustado (Cal.com u otro) deja cookies de ese servicio. Si no lo permites, esta página sigue sirviendo con las citas que ya están confirmadas."
      />
    </OpsState>
  </div>
</template>

<script setup>
import { listMeetings } from '@/api/ops/client'
import { meetingStatusLabel } from '@/api/ops/contracts'
import { formatDateTime } from '@/api/ops/format'
import { useAsyncData } from '@/composables/useAsyncData'
import EmbedGate from '@/components/consent/EmbedGate.vue'
import OpsState from '@/components/ops/OpsState.vue'

const { data, error, loading, reload } = useAsyncData(listMeetings)
const embedUrl = import.meta.env.VITE_SCHEDULING_EMBED_URL || ''
</script>

<style lang="scss" scoped>
.stack { display: flex; flex-direction: column; gap: $space-3; }
h2 { font-size: $text-xl; }
</style>
