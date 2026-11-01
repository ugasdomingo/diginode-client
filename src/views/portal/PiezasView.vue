<template>
  <div class="ops-page">
    <header class="ops-head">
      <div>
        <p class="ops-kicker">Piezas</p>
        <h1 class="ops-title">Lo que falta que mires</h1>
        <p class="ops-lead">Si algo no te encaja, dínoslo. Vuelve a Domingo antes de publicarse.</p>
      </div>
    </header>
    <OpsState :loading="loading" :error="error" @retry="reload">
      <p v-if="!pending.length" class="ops-state">No tienes piezas pendientes. Cuando haya una nueva, aparecerá aquí.</p>
      <div v-else class="stack">
        <ApprovalCard
          v-for="item in pending"
          :key="item.id"
          :item="item"
          mode="client"
          :busy="busyId === item.id"
          @approve="decide(item, 'approve')"
          @reject="decide(item, 'reject', $event)"
        />
      </div>
      <section v-if="done.length">
        <h2>Ya revisadas</h2>
        <ul class="done">
          <li v-for="item in done" :key="item.id">
            <strong>{{ item.title }}</strong>
            <span>{{ item.status === 'approved' ? 'Aprobada' : 'Devuelta' }}</span>
          </li>
        </ul>
      </section>
    </OpsState>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { approveDeliverable, listDeliverables, rejectDeliverable } from '@/api/ops/client'
import { useAsyncData } from '@/composables/useAsyncData'
import { useToastStore } from '@/stores/toast'
import ApprovalCard from '@/components/ops/ApprovalCard.vue'
import OpsState from '@/components/ops/OpsState.vue'

const toast = useToastStore()
const { data, error, loading, reload } = useAsyncData(listDeliverables)
const busyId = ref('')
const pending = computed(() =>
  (data.value || []).filter((item) => item.stage === 'client' && item.status === 'pending')
)
const done = computed(() =>
  (data.value || []).filter((item) => !(item.stage === 'client' && item.status === 'pending'))
)

async function decide(item, action, comment = '') {
  busyId.value = item.id
  try {
    if (action === 'approve') {
      await approveDeliverable(item.id)
      toast.success('Aprobada. Gracias.')
    } else {
      await rejectDeliverable(item.id, comment)
      toast.success('Devuelta. Domingo la verá antes de publicarla.')
    }
    await reload()
  } catch (err) {
    toast.error(err.message)
  } finally {
    busyId.value = ''
  }
}
</script>

<style lang="scss" scoped>
.stack { display: flex; flex-direction: column; gap: $space-4; }
h2 { font-size: $text-lg; }
.done {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: $space-3;
  margin-top: $space-3;
  span { display: block; color: $text-subtle; font-size: $text-xs; }
}
</style>
