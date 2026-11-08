<template>
  <div class="ops-page">
    <RouterLink class="ops-link" to="/admin/pipeline">← Volver al pipeline</RouterLink>
    <OpsState :loading="loading" :error="error" @retry="reload">
      <template v-if="lead">
        <header class="ops-head">
          <div>
            <p class="ops-kicker">{{ pipelineLabel(lead.status) }}</p>
            <h1 class="ops-title">{{ lead.company }}</h1>
            <p class="ops-lead">{{ lead.name }} · {{ lead.neighborhood }}. {{ lead.need }}</p>
          </div>
        </header>
        <section v-if="lead.next_action" class="ops-panel">
          <p class="ops-kicker">Siguiente paso</p>
          <h2>{{ lead.next_action.type === 'visit' ? 'Visita' : 'Llamada' }}</h2>
          <p>{{ lead.next_action.label }}</p>
          <p class="ops-card__meta">{{ formatDateTime(lead.next_action.at) }}</p>
          <a v-if="tel" class="ops-link" :href="tel">Llamar a {{ lead.phone }}</a>
        </section>
        <section v-else class="ops-panel">
          <p>No hay un siguiente paso. Este lead está cerrado por ahora.</p>
        </section>
        <ol class="ops-timeline">
          <li v-for="event in sorted" :key="event.id">
            <time :datetime="event.at">{{ formatDateTime(event.at) }} · {{ eventLabel(event) }}</time>
            <strong>{{ event.title }}</strong>
            <p>{{ event.detail }}</p>
          </li>
        </ol>
      </template>
    </OpsState>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { pipelineLabel } from '@/api/ops/contracts'
import { getLead } from '@/api/ops/client'
import { formatDateTime, safeTel } from '@/api/ops/format'
import { useAsyncData } from '@/composables/useAsyncData'
import OpsState from '@/components/ops/OpsState.vue'

const route = useRoute()
const { data, error, loading, reload } = useAsyncData(() => getLead(route.params.id))
const lead = computed(() => data.value)
const tel = computed(() => safeTel(lead.value?.phone))
const sorted = computed(() =>
  [...(lead.value?.timeline || [])].sort((a, b) => a.at.localeCompare(b.at))
)

function eventLabel(event) {
  if (event.type === 'message_sent') return 'Mensaje enviado'
  if (event.type === 'piece_sent') return 'Pieza enviada'
  if (event.type === 'reply') return 'Respuesta'
  if (event.action === 'visit') return 'Visita'
  return 'Llamada'
}
</script>
