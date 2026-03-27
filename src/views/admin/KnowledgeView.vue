<template>
  <div class="knowledge-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Conocimiento</h1>
        <p class="page-subtitle">Base de conocimiento que La Recepcionista usa para responder</p>
      </div>
      <AppButton :loading="saving" @click="save">
        <Save :size="16" />
        Guardar
      </AppButton>
    </div>

    <div v-if="loading" class="editor-skeleton" />

    <div v-else class="editor-card">
      <div class="editor-card__header">
        <Brain :size="16" />
        <span>FAQ y contexto — La Recepcionista</span>
      </div>
      <textarea
        v-model="content"
        class="editor-card__textarea"
        placeholder="Escribe aquí la información que La Recepcionista debe conocer: precios, servicios, preguntas frecuentes, tono, cómo presentarse, cuándo derivar al CEO, etc."
        spellcheck="true"
      />
      <div class="editor-card__footer">
        <span>{{ content.length }} caracteres</span>
        <span v-if="lastSaved">Guardado {{ lastSaved }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Brain, Save } from 'lucide-vue-next'
import { useApi } from '@/composables/useApi'
import { useToastStore } from '@/stores/toast'
import AppButton from '@/components/ui/AppButton.vue'

const api   = useApi()
const toast = useToastStore()

const content   = ref('')
const loading   = ref(true)
const saving    = ref(false)
const lastSaved = ref(null)

async function fetchKnowledge() {
  try {
    const res = await api.get('/admin/knowledge/recepcionista')
    content.value = res.data?.content ?? ''
  } catch {
    toast.error('Error cargando el conocimiento')
  } finally {
    loading.value = false
  }
}

async function save() {
  saving.value = true
  try {
    await api.put('/admin/knowledge/recepcionista', { content: content.value })
    toast.success('Conocimiento guardado')
    lastSaved.value = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  } catch {
    toast.error('Error guardando')
  } finally {
    saving.value = false
  }
}

onMounted(fetchKnowledge)
</script>

<style lang="scss" scoped>
.knowledge-page {
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

.editor-skeleton {
  height: 520px;
  background: linear-gradient(90deg, $bg-card 25%, $bg-card-2 50%, $bg-card 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: $radius-lg;
  border: 1px solid $border;
}

.editor-card {
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius-lg;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &__header {
    display: flex;
    align-items: center;
    gap: $space-2;
    padding: $space-3 $space-4;
    border-bottom: 1px solid $border;
    font-size: $text-sm;
    font-weight: $fw-semibold;
    color: $primary-light;
    background: $bg-surface;
  }

  &__textarea {
    width: 100%;
    min-height: 460px;
    padding: $space-5;
    background: transparent;
    border: none;
    outline: none;
    color: $text;
    font-size: $text-sm;
    font-family: $font-sans;
    line-height: 1.7;
    resize: vertical;

    &::placeholder { color: $text-subtle; }
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    padding: $space-3 $space-4;
    border-top: 1px solid $border;
    font-size: $text-xs;
    color: $text-subtle;
    font-family: $font-mono;
    background: $bg-surface;
  }
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
