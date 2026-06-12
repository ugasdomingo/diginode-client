<template>
  <div class="funnel">
    <header class="funnel__head">
      <div>
        <h1 class="funnel__title">Funnel</h1>
        <p class="funnel__sub">Demos → leads identificados → ventas</p>
      </div>
      <div class="funnel__period">
        <button :class="{ active: period === 'week' }"  @click="setPeriod('week')">7 días</button>
        <button :class="{ active: period === 'month' }" @click="setPeriod('month')">30 días</button>
      </div>
    </header>

    <p v-if="error" class="funnel__error">{{ error }}</p>

    <div v-if="data" class="funnel__metrics">
      <div class="metric">
        <span class="metric__value">{{ data.demos_started }}</span>
        <span class="metric__label">Demos iniciadas</span>
      </div>
      <div class="metric">
        <span class="metric__value">{{ data.identified }}</span>
        <span class="metric__label">Identificados</span>
        <span class="metric__hint">{{ data.identified_rate }}% de las demos</span>
      </div>
      <div class="metric metric--good">
        <span class="metric__value">{{ data.won }}</span>
        <span class="metric__label">Ganados</span>
      </div>
      <div class="metric metric--bad">
        <span class="metric__value">{{ data.lost }}</span>
        <span class="metric__label">Perdidos</span>
      </div>
    </div>

    <div v-if="data" class="funnel__breakdown">
      <h2>Por origen</h2>
      <ul>
        <li v-for="(count, src) in data.by_source" :key="src">
          <span>{{ sourceLabel(src) }}</span>
          <strong>{{ count }}</strong>
        </li>
        <li v-if="!Object.keys(data.by_source).length" class="empty">Sin datos en este período.</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'

const api    = useApi()
const data   = ref(null)
const error  = ref('')
const period = ref('week')

const SOURCE_LABELS = {
  demo_whatsapp: 'Demo (WhatsApp/web)',
  organic:       'Orgánico',
  ads:           'Publicidad',
  web_form:      'Formulario web',
  other:         'Otro',
}
function sourceLabel(s) { return SOURCE_LABELS[s] ?? s }

async function load() {
  error.value = ''
  try {
    const res = await api.get(`/admin/funnel?period=${period.value}`)
    data.value = res.data
  } catch (e) {
    error.value = e.message ?? 'No se pudo cargar el funnel'
  }
}

function setPeriod(p) {
  period.value = p
  load()
}

onMounted(load)
</script>

<style lang="scss" scoped>
.funnel {
  padding: $space-6;
  max-width: 900px;

  &__head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: $space-4;
    margin-bottom: $space-6;
  }

  &__title { font-size: $text-2xl; font-weight: $fw-bold; color: $text; }
  &__sub   { color: $text-muted; font-size: $text-sm; margin-top: $space-1; }

  &__period {
    display: flex;
    gap: $space-1;
    background: $bg-card;
    border: 1px solid $border;
    border-radius: $radius;
    padding: $space-1;

    button {
      background: none;
      border: none;
      color: $text-muted;
      font-size: $text-sm;
      padding: $space-2 $space-3;
      border-radius: $radius-sm;
      cursor: pointer;

      &.active { background: $primary-subtle; color: $primary-light; }
    }
  }

  &__error { color: $danger; }

  &__metrics {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: $space-4;
    margin-bottom: $space-8;
  }

  &__breakdown {
    background: $bg-card;
    border: 1px solid $border;
    border-radius: $radius;
    padding: $space-5;

    h2 { font-size: $text-base; color: $text; margin-bottom: $space-4; }

    ul { display: flex; flex-direction: column; gap: $space-2; }
    li {
      display: flex;
      justify-content: space-between;
      font-size: $text-sm;
      color: $text-muted;
      padding: $space-2 0;
      border-bottom: 1px solid $border;

      strong { color: $text; }
      &.empty { justify-content: flex-start; }
    }
  }
}

.metric {
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius;
  padding: $space-5;
  display: flex;
  flex-direction: column;
  gap: $space-1;

  &__value { font-size: $text-3xl; font-weight: $fw-bold; color: $text; font-family: $font-display; }
  &__label { font-size: $text-sm; color: $text-muted; }
  &__hint  { font-size: $text-xs; color: $text-subtle; }

  &--good .metric__value { color: $success; }
  &--bad  .metric__value { color: $danger; }
}
</style>
