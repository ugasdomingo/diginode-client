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
          @approve="decide(item, 'aprobar')"
          @reject="decide(item, 'rechazar', $event)"
        />
      </div>
      <section v-if="waiting.length">
        <h2>Todavía con Domingo</h2>
        <ul class="done">
          <li v-for="item in waiting" :key="item.id">
            <strong>{{ item.title }}</strong>
            <span>Aún no está en tu bandeja.</span>
          </li>
        </ul>
      </section>
      <section v-if="done.length">
        <h2>Ya revisadas</h2>
        <ul class="done">
          <li v-for="item in done" :key="item.id">
            <strong>{{ item.title }}</strong>
            <span>{{ item.status === 'aprobado' ? 'Aprobada' : 'Devuelta' }}</span>
          </li>
        </ul>
      </section>
    </OpsState>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { decideAsClient, listPortalApprovals } from '@/api/ops/client'
import { useAsyncData } from '@/composables/useAsyncData'
import { useToastStore } from '@/stores/toast'
import ApprovalCard from '@/components/ops/ApprovalCard.vue'
import OpsState from '@/components/ops/OpsState.vue'

const toast = useToastStore()
const { data, error, loading, reload } = useAsyncData(listPortalApprovals)
const busyId = ref('')
const pending = computed(() => (data.value || []).filter((item) => item.status === 'pendiente_cliente'))
const waiting = computed(() => (data.value || []).filter((item) => item.status === 'pendiente_domingo'))
const done = computed(() =>
  (data.value || []).filter((item) => item.status === 'aprobado' || item.status === 'devuelto')
)

async function decide(item, decision, comment = '') {
  busyId.value = item.id
  try {
    await decideAsClient(item.id, decision, comment)
    toast.success(
      decision === 'aprobar'
        ? 'Aprobada. Gracias.'
        : 'Devuelta. Hay que corregirla y Domingo la verá otra vez antes de publicarla.'
    )
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
