<template>
  <div class="nora-demo">
    <p class="nora-notice">Demo con IA. No introduzcas datos de pacientes ni información sensible. <RouterLink to="/legal/privacidad">Privacidad</RouterLink></p>
    <div class="phone">
      <div class="phone__notch" />
      <header class="wa-header"><div class="wa-header__avatar">N</div><div class="wa-header__meta"><span class="wa-header__name">Nora · Diginode</span><span class="wa-header__status">{{ sending ? 'escribiendo…' : 'Asistente con IA · demo' }}</span></div></header>
      <div ref="scrollEl" class="wa-body" role="log" aria-label="Conversación con Nora" aria-live="polite" :aria-busy="sending">
        <p class="wa-day">AGENDA SIMULADA · CORREO CON CONFIRMACIÓN</p>
        <div v-if="!messages.length" class="wa-row wa-row--nora"><div class="wa-bubble wa-bubble--nora"><span class="wa-bubble__text">{{ greeting }}</span></div></div>
        <div v-for="(message, index) in messages" :key="index" class="wa-row" :class="message.from === 'me' ? 'wa-row--me' : 'wa-row--nora'">
          <div class="wa-bubble" :class="message.from === 'me' ? 'wa-bubble--me' : 'wa-bubble--nora'"><span class="wa-bubble__text">{{ message.text }}</span>
            <template v-for="action in message.actions" :key="action.href"><a v-if="action.type === 'booking'" class="wa-bubble__cta" :href="action.href" target="_blank" rel="noopener noreferrer" @click="trackEvent('booking_click')">{{ action.label }} ↗</a><RouterLink v-else class="wa-bubble__cta" :to="action.href">{{ action.label }}</RouterLink></template>
            <span class="wa-bubble__time">{{ message.time }}</span>
          </div>
        </div>
        <div v-if="sending" class="wa-row wa-row--nora"><div class="wa-bubble wa-bubble--nora wa-bubble--typing"><span class="dot" /><span class="dot" /><span class="dot" /></div></div>
      </div>
      <form class="wa-composer" @submit.prevent="submit"><input v-model="draft" class="wa-composer__input" type="text" aria-label="Mensaje para Nora" placeholder="Cuéntame tu caso…" :disabled="capped || sending" maxlength="2000" /><button class="wa-composer__send" type="submit" aria-label="Enviar mensaje a Nora" :disabled="!draft.trim() || sending || capped">➤</button></form>
    </div>
    <div v-if="pending" class="nora-pending" role="region" aria-label="Revisar correo antes de enviar"><strong>Correo preparado. Aún no se ha enviado.</strong><p>Para: {{ pending.recipient }}</p><p>{{ pending.summary }}</p><p>La confirmación caduca a los 10 minutos. Máximo dos correos por contacto y destinatario al día.</p><button type="button" class="commercial-button" :disabled="confirming" @click="confirmEmail">{{ confirming ? 'Confirmando…' : 'Confirmar envío de correo' }}</button><button type="button" class="nora-text-button" :disabled="confirming" @click="pending = null">Cancelar</button></div>
    <div class="nora-demo__cards"><button v-for="suggestion in suggestions" :key="suggestion.label" class="demo-card" :disabled="sending || capped" @click="send(suggestion.text, context)"><span class="demo-card__label">{{ suggestion.label }}</span></button></div>
    <p v-if="capped" class="nora-demo__capped">Has alcanzado el límite de esta demo.</p>
    <p v-if="error" role="alert" class="nora-demo__error">{{ error }}</p>
    <RouterLink :to="contactPath" class="nora-human">{{ context === 'web' ? 'Hablar con una persona sobre mi proyecto' : 'Solicitar una revisión con una persona' }} ↗</RouterLink>
  </div>
</template>
<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { useNoraDemo } from '@/composables/useNoraDemo'
import { trackEvent } from '@/lib/analytics'
const props = defineProps({ context: { type: String, default: 'clinic', validator: value => ['agency', 'clinic', 'web'].includes(value) } })
const { messages, sending, capped, error, pending, confirming, send, confirmEmail } = useNoraDemo()
const draft = ref(''), scrollEl = ref(null)
const contactPath = computed(() => props.context === 'web' ? '/webs-y-aplicaciones#contacto' : props.context === 'clinic' ? '/clinica-digital#contacto' : '/#contacto')
const greeting = computed(() => props.context === 'agency' ? 'Soy Nora, la asistente de Diginode. ¿A qué se dedica tu empresa y qué te gustaría mejorar?' : props.context === 'web' ? 'Soy Nora, la asistente de Diginode. ¿Qué proceso de tu negocio te gustaría resolver con una web o aplicación?' : 'Soy Nora, la asistente de Diginode. ¿Qué tipo de consulta tienes y qué tarea administrativa te gustaría mejorar?')
const suggestions = [{ label: 'Cómo ayudarías a mi negocio', text: '¿Cómo podrías ayudar a mi negocio?' }, { label: 'Ver una agenda de ejemplo', text: 'Enséñame una agenda ficticia de ejemplo, sin reservar ninguna cita.' }, { label: 'Preparar un resumen por correo', text: 'Quiero preparar un resumen de Diginode por correo para revisarlo y confirmar el envío.' }]
async function submit() { const text = draft.value.trim(); if (!text || sending.value || capped.value) return; draft.value = ''; await send(text, props.context) }
watch(() => [messages.value.length, sending.value], async () => { await nextTick(); if (scrollEl.value) scrollEl.value.scrollTop = scrollEl.value.scrollHeight })
</script>

<style lang="scss" scoped>
.nora-demo {
  min-width: 0;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-4;
  width: 100%;

  &__cards {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: $space-2;
    max-width: 420px;
  }

  &__capped,
  &__error {
    max-width: 380px;
    text-align: center;
    font-size: $text-sm;
  }

  &__capped { color: $text-muted; }

  &__capped-link {
    background: none;
    border: 0;
    padding: 0;
    font-family: inherit;
    font-size: inherit;
    color: $primary-light;
    font-weight: $fw-semibold;
    cursor: pointer;

    &:disabled { opacity: 0.6; cursor: wait; }
  }

  &__error { color: $danger; }
}

.demo-card {
  display: flex;
  align-items: center;
  gap: $space-2;
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius-full;
  padding: $space-2 $space-4;
  color: $text;
  font-size: $text-sm;
  cursor: pointer;
  transition: $transition-fast;

  &:hover:not(:disabled) {
    border-color: $primary;
    background: $primary-subtle;
    color: $primary-light;
  }

  &:disabled { opacity: 0.5; cursor: not-allowed; }

  &__icon { font-size: $text-base; }
}

// ── Phone mockup ────────────────────────────
.phone {
  position: relative;
  width: 100%;
  max-width: 380px;
  // Fits inside the no-scroll Home hero on shorter screens, caps at phone size.
  height: min(560px, calc(100dvh - 260px));
  min-height: 400px;
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius-xl;
  box-shadow: $shadow-lg;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &__notch {
    position: absolute;
    top: $space-2;
    left: 50%;
    transform: translateX(-50%);
    width: 110px;
    height: 6px;
    border-radius: $radius-full;
    background: rgba(255, 255, 255, 0.12);
    z-index: 2;
  }
}

.wa-header {
  display: flex;
  align-items: center;
  gap: $space-3;
  padding: $space-4 $space-4 $space-3;
  background: $bg-card-2;
  border-bottom: 1px solid $border;

  &__avatar {
    width: 40px;
    height: 40px;
    border-radius: $radius-full;
    background: $employee-nora;
    color: $text-inverse;
    font-weight: $fw-bold;
    display: grid;
    place-items: center;
  }

  &__meta { display: flex; flex-direction: column; }
  &__name { color: $text; font-weight: $fw-semibold; font-size: $text-sm; }
  &__status { color: $success; font-size: $text-xs; }
}

.wa-body {
  flex: 1;
  overflow-y: auto;
  padding: $space-4;
  display: flex;
  flex-direction: column;
  gap: $space-2;
  background:
    linear-gradient(rgba(5, 10, 15, 0.92), rgba(5, 10, 15, 0.92));
}

.wa-day {
  align-self: center;
  font-size: $text-xs;
  color: $text-subtle;
  background: $bg-card-2;
  padding: 2px $space-3;
  border-radius: $radius-full;
  letter-spacing: 0.1em;
}

.wa-row {
  display: flex;
  &--me   { justify-content: flex-end; }
  &--nora { justify-content: flex-start; }
}

.wa-bubble {
  max-width: 78%;
  padding: $space-2 $space-3;
  border-radius: $radius;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: $space-1;

  &__text { color: $text; font-size: $text-sm; line-height: 1.45; white-space: pre-wrap; }
  &__time { align-self: flex-end; font-size: 10px; color: $text-subtle; }

  &__cta {
    margin-top: $space-1;
    display: inline-block;
    text-align: center;
    background: $primary;
    color: $text-inverse;
    font-weight: $fw-semibold;
    font-size: $text-sm;
    padding: $space-2 $space-3;
    border-radius: $radius-sm;
    text-decoration: none;
  }

  &--me   { background: $primary-subtle; border: 1px solid $border; border-bottom-right-radius: $radius-sm; }
  &--nora { background: $bg-card-2; border: 1px solid $border; border-bottom-left-radius: $radius-sm; }

  &--typing { flex-direction: row; gap: $space-1; padding: $space-3; }
}

.dot {
  width: 7px;
  height: 7px;
  border-radius: $radius-full;
  background: $text-subtle;
  animation: blink 1.2s infinite ease-in-out both;

  &:nth-child(2) { animation-delay: 0.2s; }
  &:nth-child(3) { animation-delay: 0.4s; }
}

@keyframes blink {
  0%, 80%, 100% { opacity: 0.3; }
  40%           { opacity: 1; }
}

.wa-composer {
  display: flex;
  gap: $space-2;
  padding: $space-3;
  background: $bg-card-2;
  border-top: 1px solid $border;

  &__input {
    flex: 1;
    background: $bg-input;
    border: 1px solid $border;
    border-radius: $radius-full;
    padding: $space-2 $space-4;
    color: $text;
    font-size: $text-sm;

    &:focus { outline: none; border-color: $border-focus; }
  }

  &__send {
    width: 40px;
    height: 40px;
    border: none;
    border-radius: $radius-full;
    background: $primary;
    color: $text-inverse;
    font-size: $text-base;
    cursor: pointer;

    &:disabled { opacity: 0.4; cursor: not-allowed; }
  }
}
.nora-notice, .nora-human { font-size: .78rem; line-height: 1.6; color: #bccbdc; }
.nora-notice a, .nora-human { color: #87bcf4; text-decoration: underline; }
.nora-pending { display: grid; gap: .8rem; border: 1px solid #ffb94d; border-radius: 10px; padding: 1rem; font-size: .85rem; line-height: 1.6; overflow-wrap: anywhere; }
.nora-text-button { border: 0; background: transparent; color: #bccbdc; text-decoration: underline; cursor: pointer; }
.wa-composer__input { min-width: 0; }
.wa-bubble__text { overflow-wrap: anywhere; }
</style>
