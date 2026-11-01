<template>
  <Teleport to="body">
    <div
      v-if="consent.visible"
      class="consent"
      @keydown="trap"
    >
      <div class="consent__shade" />
      <section
        ref="dialog"
        class="consent__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="consent-title"
        tabindex="-1"
      >
        <p class="consent__kicker">Diginode · Madrid</p>
        <h2 id="consent-title">{{ consent.managing && consent.record ? 'Tus cookies' : 'Antes de seguir' }}</h2>
        <p class="consent__text">
          Este sitio es de Domingo Ugas. Lo necesario para entrar y recordar esta elección se guarda siempre.
          La medición, la publicidad y los calendarios incrustados no se cargan hasta que lo dices.
        </p>

        <div v-if="showDetails" class="consent__options">
          <label class="consent__row">
            <span>
              <strong>Necesarias</strong>
              <small>Sesión del panel, la demo y esta elección. No se pueden apagar.</small>
            </span>
            <input type="checkbox" checked disabled />
          </label>
          <label class="consent__row">
            <span>
              <strong>Medición</strong>
              <small>Páginas públicas visitadas, sin correos ni mensajes. El panel no se mide.</small>
            </span>
            <input v-model="draft.analytics" type="checkbox" />
          </label>
          <label class="consent__row">
            <span>
              <strong>Publicidad</strong>
              <small>Un píxel de Meta, si algún día se activara. Hoy el código no lo carga.</small>
            </span>
            <input v-model="draft.marketing" type="checkbox" />
          </label>
          <label class="consent__row">
            <span>
              <strong>Incrustados</strong>
              <small>Calendarios u otros contenidos de terceros, y solo en la pantalla que lo pida.</small>
            </span>
            <input v-model="draft.embeds" type="checkbox" />
          </label>
        </div>

        <div class="consent__choices">
          <button type="button" class="consent__choice consent__choice--accept" @click="consent.acceptAll()">Aceptar</button>
          <button type="button" class="consent__choice consent__choice--reject" @click="consent.rejectAll()">Rechazar</button>
        </div>
        <button type="button" class="consent__config" @click="toggleDetails">
          {{ showDetails ? 'Guardar selección' : 'Configurar' }}
        </button>
        <button v-if="consent.record" type="button" class="consent__close" @click="consent.closePanel()">Cerrar sin cambios</button>
        <RouterLink class="consent__legal" to="/legal/cookies">Leer la política de cookies</RouterLink>
      </section>
    </div>
  </Teleport>
</template>

<script setup>
import { nextTick, onMounted, reactive, ref, watch } from 'vue'
import { useConsentStore } from '@/stores/consent'

const consent = useConsentStore()
const dialog = ref(null)
const showDetails = ref(false)
const draft = reactive({ analytics: false, marketing: false, embeds: false })

function syncDraft() {
  draft.analytics = Boolean(consent.record?.analytics)
  draft.marketing = Boolean(consent.record?.marketing)
  draft.embeds = Boolean(consent.record?.embeds)
}

function toggleDetails() {
  if (!showDetails.value) {
    syncDraft()
    showDetails.value = true
    return
  }
  consent.saveCustom(draft)
}

function focusables() {
  if (!dialog.value) return []
  return [...dialog.value.querySelectorAll('button, a, input:not(:disabled)')]
}

function trap(event) {
  if (event.key === 'Escape') {
    if (consent.record) consent.closePanel()
    return
  }
  if (event.key !== 'Tab') return
  const nodes = focusables()
  if (!nodes.length) return
  const first = nodes[0]
  const last = nodes[nodes.length - 1]
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

watch(() => consent.visible, async (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
  if (!open) {
    showDetails.value = false
    return
  }
  syncDraft()
  await nextTick()
  dialog.value?.focus()
})

onMounted(() => {
  consent.hydrate()
})
</script>

<style lang="scss" scoped>
.consent {
  position: fixed;
  inset: 0;
  z-index: 400;
  display: grid;
  place-items: center;
  padding: $space-4;
}

.consent__shade {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.78);
  backdrop-filter: blur(8px);
}

.consent__panel {
  position: relative;
  width: min(520px, 100%);
  max-height: min(90dvh, 760px);
  overflow: auto;
  padding: $space-6;
  border-radius: $radius-xl;
  border: 1px solid $border-hover;
  background: $bg-card;
  box-shadow: $shadow-lg;
  display: flex;
  flex-direction: column;
  gap: $space-4;
  animation: consent-in 0.35s cubic-bezier(0.16, 1, 0.3, 1);

  &:focus { outline: none; }
}

.consent__kicker {
  color: $accent-light;
  font-size: $text-xs;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

h2 {
  font-size: $text-3xl;
  letter-spacing: -0.03em;
}

.consent__text {
  color: $text-muted;
  font-size: $text-sm;
}

.consent__choices {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $space-3;
}

.consent__choice {
  min-height: 48px;
  border-radius: $radius;
  font: inherit;
  font-weight: $fw-semibold;
  cursor: pointer;
  border: 1px solid transparent;

  &--accept {
    background: $primary;
    color: $text-inverse;
  }

  &--reject {
    background: $bg-surface;
    color: $text;
    border-color: $border-hover;
  }
}

.consent__config,
.consent__close,
.consent__legal {
  background: none;
  border: 0;
  color: $text-muted;
  font: inherit;
  cursor: pointer;
  text-align: center;
  padding: $space-2;
}

.consent__legal { color: $primary-light; }

.consent__options {
  display: flex;
  flex-direction: column;
  gap: $space-3;
}

.consent__row {
  display: flex;
  justify-content: space-between;
  gap: $space-4;
  align-items: center;
  padding-bottom: $space-3;
  border-bottom: 1px solid $border;

  strong { display: block; color: $text; font-size: $text-sm; }
  small { display: block; color: $text-subtle; font-size: $text-xs; line-height: 1.4; }
  input { width: 1.1rem; height: 1.1rem; accent-color: $primary; }
}

@keyframes consent-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: none; }
}

@media (prefers-reduced-motion: reduce) {
  .consent__panel { animation: none; }
}

@media (max-width: 560px) {
  .consent__choices { grid-template-columns: 1fr; }
}
</style>
