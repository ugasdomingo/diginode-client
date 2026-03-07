<template>
  <div class="sales-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Análisis de ventas</h1>
        <p class="page-subtitle">Analiza transcripciones de reuniones con IA</p>
      </div>
    </div>

    <div class="sales-layout">
      <!-- Upload panel -->
      <AppCard class="upload-panel">
        <h3 class="panel-title">Analizar transcripción</h3>
        <p class="panel-desc">
          Pega la transcripción de tu reunión de ventas y el sistema generará
          un análisis estructurado con puntos clave y propuesta técnica.
        </p>

        <div class="field">
          <label class="field__label">Transcripción</label>
          <textarea
            v-model="transcript"
            class="field__textarea"
            placeholder="Pega aquí el texto de la transcripción de tu reunión de Google Meet..."
            rows="12"
          />
          <span class="field__hint">{{ transcript.length }} caracteres</span>
        </div>

        <AppButton
          :loading="analyzing"
          :disabled="transcript.trim().length < 50"
          @click="analyze"
          class="analyze-btn"
        >
          <Sparkles :size="16" />
          Analizar reunión
        </AppButton>
      </AppCard>

      <!-- Results -->
      <div class="results-panel">
        <div v-if="!result && !analyzing" class="results-empty">
          <div class="results-empty__icon">
            <BarChart3 :size="32" />
          </div>
          <h3>Sin análisis aún</h3>
          <p>Pega una transcripción a la izquierda y pulsa "Analizar reunión"</p>
        </div>

        <div v-else-if="analyzing" class="results-loading">
          <AppSpinner :size="32" />
          <p>Analizando con IA...</p>
        </div>

        <div v-else class="results">
          <div class="result-section" v-if="result.summary">
            <h4 class="result-section__title">
              <FileText :size="16" />
              Resumen ejecutivo
            </h4>
            <p class="result-section__text">{{ result.summary }}</p>
          </div>

          <div class="result-section" v-if="result.key_points?.length">
            <h4 class="result-section__title">
              <CheckSquare :size="16" />
              Puntos clave
            </h4>
            <ul class="result-list">
              <li v-for="(pt, i) in result.key_points" :key="i">{{ pt }}</li>
            </ul>
          </div>

          <div class="result-section" v-if="result.client_pain_points?.length">
            <h4 class="result-section__title">
              <AlertCircle :size="16" />
              Dolores del cliente
            </h4>
            <ul class="result-list result-list--warning">
              <li v-for="(pt, i) in result.client_pain_points" :key="i">{{ pt }}</li>
            </ul>
          </div>

          <div class="result-section" v-if="result.proposed_solution">
            <h4 class="result-section__title">
              <Lightbulb :size="16" />
              Propuesta técnica
            </h4>
            <div class="result-section__text result-section__text--card">
              {{ result.proposed_solution }}
            </div>
          </div>

          <div class="result-section" v-if="result.next_steps?.length">
            <h4 class="result-section__title">
              <ArrowRight :size="16" />
              Próximos pasos
            </h4>
            <ul class="result-list result-list--success">
              <li v-for="(step, i) in result.next_steps" :key="i">{{ step }}</li>
            </ul>
          </div>

          <AppButton variant="secondary" size="sm" @click="reset" class="reset-btn">
            <RotateCcw :size="14" />
            Nuevo análisis
          </AppButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  Sparkles, BarChart3, FileText, CheckSquare,
  AlertCircle, Lightbulb, ArrowRight, RotateCcw,
} from 'lucide-vue-next'
import { useApi } from '@/composables/useApi'
import { useToastStore } from '@/stores/toast'
import AppCard    from '@/components/ui/AppCard.vue'
import AppButton  from '@/components/ui/AppButton.vue'
import AppSpinner from '@/components/ui/AppSpinner.vue'

const api   = useApi()
const toast = useToastStore()

const transcript = ref('')
const analyzing  = ref(false)
const result     = ref(null)

async function analyze() {
  analyzing.value = true
  result.value    = null
  try {
    const data = await api.post('/admin/sales/analyze', { transcript: transcript.value })
    result.value = data
  } catch (err) {
    toast.error(err.message ?? 'Error al analizar')
  } finally {
    analyzing.value = false
  }
}

function reset() {
  result.value    = null
  transcript.value = ''
}
</script>

<style lang="scss" scoped>
.sales-page {
  display: flex;
  flex-direction: column;
  gap: $space-6;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: $space-4;
  flex-wrap: wrap;
}

.page-title {
  font-size: $text-3xl;
  font-weight: $fw-bold;
  letter-spacing: -0.02em;
}

.page-subtitle {
  color: $text-muted;
  font-size: $text-sm;
  margin-top: $space-1;
}

.sales-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $space-6;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
}

.upload-panel {
  display: flex;
  flex-direction: column;
  gap: $space-5;
}

.panel-title {
  font-size: $text-lg;
  font-weight: $fw-semibold;
}

.panel-desc {
  font-size: $text-sm;
  line-height: 1.6;
}

.field {
  display: flex;
  flex-direction: column;
  gap: $space-2;

  &__label {
    font-size: $text-sm;
    font-weight: $fw-medium;
    color: $text-muted;
  }

  &__textarea {
    width: 100%;
    padding: $space-3 $space-4;
    background: $bg-input;
    border: 1px solid $border;
    border-radius: $radius;
    color: $text;
    font-size: $text-sm;
    line-height: 1.6;
    resize: vertical;
    outline: none;
    transition: $transition;
    font-family: $font-sans;

    &::placeholder { color: $text-subtle; }

    &:focus {
      border-color: $primary;
      box-shadow: 0 0 0 3px $primary-glow;
    }
  }

  &__hint {
    font-size: $text-xs;
    color: $text-subtle;
    align-self: flex-end;
    font-family: $font-mono;
  }
}

.analyze-btn {
  width: 100%;
}

// Results
.results-panel {
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius-lg;
  min-height: 300px;
  display: flex;
  flex-direction: column;
}

.results-empty,
.results-loading {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $space-3;
  padding: $space-12;
  color: $text-subtle;
  text-align: center;

  h3 {
    font-size: $text-base;
    font-weight: $fw-semibold;
    color: $text-muted;
  }

  p {
    font-size: $text-sm;
    max-width: 280px;
  }
}

.results-empty__icon {
  width: 64px;
  height: 64px;
  border-radius: $radius-xl;
  background: $primary-subtle;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $primary;
  margin-bottom: $space-2;
}

.results {
  padding: $space-6;
  display: flex;
  flex-direction: column;
  gap: $space-5;
}

.result-section {
  display: flex;
  flex-direction: column;
  gap: $space-3;

  &__title {
    display: flex;
    align-items: center;
    gap: $space-2;
    font-size: $text-sm;
    font-weight: $fw-semibold;
    color: $text;
    letter-spacing: 0.01em;

    svg {
      color: $primary;
    }
  }

  &__text {
    font-size: $text-sm;
    color: $text-muted;
    line-height: 1.7;

    &--card {
      background: $bg-surface;
      border: 1px solid $border;
      border-radius: $radius;
      padding: $space-4;
    }
  }
}

.result-list {
  display: flex;
  flex-direction: column;
  gap: $space-2;

  li {
    font-size: $text-sm;
    color: $text-muted;
    padding-left: $space-4;
    position: relative;
    line-height: 1.6;

    &::before {
      content: '·';
      position: absolute;
      left: $space-1;
      color: $primary;
      font-weight: $fw-bold;
    }
  }

  &--warning li::before { color: $warning; }
  &--success li::before { color: $accent; }
}

.reset-btn {
  align-self: flex-start;
  margin-top: $space-2;
}
</style>
