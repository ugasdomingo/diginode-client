<template>
  <article class="ops-card ops-rise">
    <p class="ops-card__meta">{{ item.company }} · {{ item.channel }} · versión {{ item.version }}</p>
    <h3>{{ item.title }}</h3>
    <p v-if="item.needs_reapproval" class="ops-chip ops-chip--warn">El cliente la devolvió. Hay que reaprobarla.</p>
    <p>{{ item.preview_text }}</p>
    <p v-if="item.rejection_comment" class="comment">
      <span>Comentario</span>
      {{ item.rejection_comment }}
    </p>
    <a v-if="href" class="ops-link" :href="href" target="_blank" rel="noopener noreferrer">Abrir la pieza</a>
    <form v-if="mode" class="ops-form" @submit.prevent="submit">
      <label class="ops-field">
        <span>{{ mode === 'client' ? 'Qué hay que cambiar' : 'Nota al rechazar (opcional)' }}</span>
        <textarea v-model="comment" :required="mode === 'client'" maxlength="1000" />
      </label>
      <p v-if="localError" class="comment" role="alert">{{ localError }}</p>
      <div class="ops-actions">
        <AppButton type="button" :disabled="busy" @click="$emit('approve')">Aprobar</AppButton>
        <AppButton type="submit" variant="secondary" :disabled="busy">Devolver</AppButton>
      </div>
    </form>
  </article>
</template>

<script setup>
import { computed, ref } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import { safeHttpsUrl } from '@/api/ops/format'

const props = defineProps({
  item: { type: Object, required: true },
  mode: { type: String, default: '' },
  busy: { type: Boolean, default: false },
})
const emit = defineEmits(['approve', 'reject'])

const comment = ref('')
const localError = ref('')
const href = computed(() => safeHttpsUrl(props.item.preview_url))

function submit() {
  localError.value = ''
  const text = comment.value.trim()
  if (props.mode === 'client' && text.length < 8) {
    localError.value = 'Escribe una frase: sin eso el bot no sabe qué corregir.'
    return
  }
  emit('reject', text)
  comment.value = ''
}
</script>

<style lang="scss" scoped>
.comment {
  padding: $space-3;
  border-radius: $radius;
  background: $bg-surface;
  color: $text;
  font-size: $text-sm;

  span {
    display: block;
    color: $text-subtle;
    font-size: $text-xs;
    margin-bottom: $space-1;
  }
}
</style>
