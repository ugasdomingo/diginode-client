<template>
  <div class="ops-page">
    <header class="ops-head">
      <div>
        <p class="ops-kicker">Leads</p>
        <h1 class="ops-title">A quién toca escribir, llamar o visitar</h1>
        <p class="ops-lead">Solo lectura. El estado lo mueve la operación; aquí se ve el siguiente paso.</p>
      </div>
    </header>
    <MockNotice />
    <OpsState :loading="loading" :error="error" @retry="reload">
      <div class="ops-board" v-if="data">
        <section v-for="column in columns" :key="column.id" class="ops-col">
          <header class="ops-col__head">
            <strong>{{ column.label }}</strong>
            <span>{{ column.items.length }}</span>
          </header>
          <p v-if="!column.items.length" class="ops-card__meta">Nadie en este paso.</p>
          <RouterLink
            v-for="lead in column.items"
            :key="lead.id"
            class="ops-card ops-rise"
            :to="`/admin/pipeline/${lead.id}`"
          >
            <strong class="ops-card__title">{{ lead.company || lead.business }}</strong>
            <span class="ops-card__meta">{{ lead.name || 'Sin nombre' }} · {{ lead.origin_detail || lead.country || 'Sin zona' }}</span>
            <span v-if="lead.next_action" class="ops-chip">{{ lead.next_action }}</span>
          </RouterLink>
        </section>
      </div>
    </OpsState>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { LEAD_PIPELINE } from '@/api/ops/contracts'
import { listLeads } from '@/api/ops/client'
import { useAsyncData } from '@/composables/useAsyncData'
import MockNotice from '@/components/ops/MockNotice.vue'
import OpsState from '@/components/ops/OpsState.vue'

const { data, error, loading, reload } = useAsyncData(listLeads)
const columns = computed(() =>
  LEAD_PIPELINE.map((column) => ({
    ...column,
    items: (data.value || []).filter((lead) => lead.pipeline_status === column.id),
  }))
)
</script>
