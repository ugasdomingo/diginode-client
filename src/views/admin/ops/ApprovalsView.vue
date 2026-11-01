<template>
  <div class="ops-page">
    <header class="ops-head">
      <div>
        <p class="ops-kicker">Aprobaciones</p>
        <h1 class="ops-title">Lo que tiene que salir de tu mesa</h1>
        <p class="ops-lead">
          Primero lo ves tú. Si el cliente lo devuelve con un comentario, vuelve aquí antes de publicarse.
        </p>
      </div>
    </header>
    <MockNotice />
    <OpsState :loading="loading" :error="error" @retry="reload">
      <p v-if="data && !data.length" class="ops-state">No hay piezas esperándote.</p>
      <div v-else class="stack">
        <ApprovalCard
          v-for="item in data"
          :key="item.id"
          :item="item"
          mode="domingo"
          :busy="busyId === item.id"
          @approve="decide(item, 'approve')"
          @reject="decide(item, 'reject', $event)"
        />
      </div>
    </OpsState>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { approveAsDomingo, listApprovals, rejectAsDomingo } from '@/api/ops/client'
import { useAsyncData } from '@/composables/useAsyncData'
import { useToastStore } from '@/stores/toast'
import ApprovalCard from '@/components/ops/ApprovalCard.vue'
import MockNotice from '@/components/ops/MockNotice.vue'
import OpsState from '@/components/ops/OpsState.vue'

const toast = useToastStore()
const { data, error, loading, reload } = useAsyncData(() => listApprovals())
const busyId = ref('')

async function decide(item, action, comment = '') {
  busyId.value = item.id
  try {
    if (action === 'approve') await approveAsDomingo(item.id)
    else await rejectAsDomingo(item.id, comment)
    toast.success(action === 'approve' ? 'Pasa al cliente.' : 'La pieza no llega al cliente.')
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
</style>
