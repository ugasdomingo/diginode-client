<template>
  <section class="gate">
    <h3>{{ title }}</h3>
    <iframe
      v-if="allowed && safeSrc"
      :src="safeSrc"
      :title="title"
      loading="lazy"
      referrerpolicy="no-referrer"
      sandbox="allow-scripts allow-forms allow-popups"
    />
    <p v-else-if="allowed">El calendario externo todavía no está conectado. La solicitud de esta página sigue funcionando.</p>
    <div v-else>
      <p>{{ why }}</p>
      <div class="ops-actions">
        <button type="button" data-testid="allow-embeds" @click="allow">Permitir solo este servicio</button>
        <button v-if="!dismissed" type="button" class="ghost" @click="dismissed = true">Ahora no</button>
      </div>
      <p v-if="dismissed" class="later">De acuerdo. Puedes pedirlo más tarde desde el pie de página, en Configurar cookies.</p>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { safeHttpsUrl } from '@/api/ops/format'
import { useConsentStore } from '@/stores/consent'

const props = defineProps({
  title: { type: String, required: true },
  why: { type: String, required: true },
  src: { type: String, default: '' },
})

const consent = useConsentStore()
const dismissed = ref(false)
const allowed = computed(() => consent.allows('embeds'))
const safeSrc = computed(() => (allowed.value ? safeHttpsUrl(props.src) : null))

function allow() {
  consent.grant('embeds')
}
</script>

<style lang="scss" scoped>
.gate {
  display: flex;
  flex-direction: column;
  gap: $space-3;
  padding: $space-4;
  border: 1px solid $border;
  border-radius: $radius-lg;
  background: $bg-surface;

  h3 {
    font-size: $text-base;
  }

  p { color: $text-muted; font-size: $text-sm; }

  iframe {
    width: 100%;
    min-height: 420px;
    border: 0;
    border-radius: $radius;
    background: white;
  }

  button {
    min-height: 44px;
    padding: 0 $space-4;
    border-radius: $radius;
    border: 1px solid $border-hover;
    background: $primary;
    color: $text-inverse;
    cursor: pointer;
  }

  .ghost {
    background: transparent;
    color: $text;
  }
}

.later { color: $text-subtle; }
</style>
