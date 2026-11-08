<template>
  <div class="ops-page">
    <RouterLink class="ops-link" to="/admin/pipeline">← Volver al pipeline</RouterLink>
    <OpsState :loading="loading" :error="error" @retry="reload">
      <template v-if="lead">
        <header class="ops-head">
          <div>
            <p class="ops-kicker">{{ pipelineLabel(lead.pipeline_status) }}</p>
            <h1 class="ops-title">{{ lead.company || lead.business }}</h1>
            <p class="ops-lead">
              {{ lead.name || 'Sin nombre' }}
              <template v-if="place"> · {{ place }}</template>.
              {{ lead.goal || serviceLabel(lead.service_interest) }}
            </p>
          </div>
        </header>
        <section v-if="lead.next_action" class="ops-panel">
          <p class="ops-kicker">Siguiente paso</p>
          <h2>{{ lead.next_action }}</h2>
          <p v-if="lead.next_action_at" class="ops-card__meta">{{ formatDateTime(lead.next_action_at) }}</p>
          <a v-if="tel" class="ops-link" :href="tel">Llamar a {{ lead.phone }}</a>
        </section>
        <section v-else class="ops-panel">
          <p>No hay un siguiente paso anotado.</p>
        </section>
        <ol class="ops-timeline">
          <li v-for="event in sorted" :key="event.id">
            <time :datetime="event.at">{{ formatDateTime(event.at) }} · {{ activityLabel(event.type) }}</time>
            <p>{{ event.summary }}</p>
          </li>
        </ol>
        <p v-if="!sorted.length" class="ops-card__meta">Todavía no hay anotaciones en el historial.</p>
      </template>
    </OpsState>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { activityLabel, pipelineLabel, serviceLabel } from '@/api/ops/contracts'
import { getLead } from '@/api/ops/client'
import { formatDateTime, safeTel } from '@/api/ops/format'
import { useAsyncData } from '@/composables/useAsyncData'
import OpsState from '@/components/ops/OpsState.vue'

const route = useRoute()
const { data, error, loading, reload } = useAsyncData(() => getLead(route.params.id))
const lead = computed(() => data.value)
const tel = computed(() => safeTel(lead.value?.phone))
const place = computed(() => lead.value?.origin_detail || lead.value?.country || '')
const sorted = computed(() =>
  [...(lead.value?.activity || [])].sort((a, b) => String(a.at).localeCompare(String(b.at)))
)
</script>
