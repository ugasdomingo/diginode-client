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
            <strong class="ops-card__title">{{ lead.company }}</strong>
            <span class="ops-card__meta">{{ lead.name }} · {{ lead.neighborhood }}</span>
            <span
              v-if="lead.next_action"
              class="ops-chip"
              :class="{ 'ops-chip--visit': lead.next_action.type === 'visit' }"
            >{{ lead.next_action.type === 'visit' ? 'Visita' : 'Llamada' }} · {{ lead.next_action.label }}</span>
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
    items: (data.value || []).filter((lead) => lead.status === column.id),
  }))
)
</script>
