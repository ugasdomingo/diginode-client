<template>
  <div class="demo">
    <div class="demo__intro">
      <h1 class="demo__title">Habla con Nora ahora</h1>
      <p class="demo__subtitle">
        Esto es exactamente lo que vivirían tus clientes al escribirte. Nora es una
        recepcionista con IA: pruébala y deja que te agende una demo.
      </p>
    </div>

    <!-- Phone mockup -->
    <div class="phone">
      <div class="phone__notch" />

      <!-- WhatsApp-style header -->
      <header class="wa-header">
        <div class="wa-header__avatar">N</div>
        <div class="wa-header__meta">
          <span class="wa-header__name">Nora · DigiNode</span>
          <span class="wa-header__status">
            {{ typing ? 'escribiendo…' : 'en línea' }}
          </span>
        </div>
      </header>

      <!-- Messages -->
      <div ref="scrollEl" class="wa-body">
        <p class="wa-day">DEMO</p>

        <div
          v-for="(m, i) in messages"
          :key="i"
          class="wa-row"
          :class="m.from === 'me' ? 'wa-row--me' : 'wa-row--nora'"
        >
          <div class="wa-bubble" :class="m.from === 'me' ? 'wa-bubble--me' : 'wa-bubble--nora'">
            <span class="wa-bubble__text">{{ m.text }}</span>
            <a
              v-if="m.bookingUrl"
              class="wa-bubble__cta"
              :href="m.bookingUrl"
              target="_blank"
              rel="noopener"
            >
              📅 Agendar mi reunión
            </a>
            <span class="wa-bubble__time">{{ m.time }}</span>
          </div>
        </div>

        <div v-if="typing" class="wa-row wa-row--nora">
          <div class="wa-bubble wa-bubble--nora wa-bubble--typing">
            <span class="dot" /><span class="dot" /><span class="dot" />
          </div>
        </div>
      </div>

      <!-- Composer -->
      <form class="wa-composer" @submit.prevent="send">
        <input
          v-model="draft"
          class="wa-composer__input"
          type="text"
          placeholder="Escribe un mensaje…"
          :disabled="capped"
          maxlength="2000"
        />
        <button class="wa-composer__send" type="submit" :disabled="!draft.trim() || sending || capped">
          ➤
        </button>
      </form>
    </div>

    <!-- Suggestion cards -->
    <div class="demo__cards">
      <button
        v-for="s in suggestions"
        :key="s.label"
        class="demo-card"
        :disabled="sending || capped"
        @click="sendSuggestion(s.text)"
      >
        <span class="demo-card__icon">{{ s.icon }}</span>
        <span class="demo-card__label">{{ s.label }}</span>
      </button>
    </div>

    <p v-if="capped" class="demo__capped">
      Has alcanzado el límite de esta demo. ¿List@ para tenerla en tu negocio?
      <RouterLink to="/operacion-solo" class="demo__capped-link">Ver el Plan Entrepreneur →</RouterLink>
    </p>
    <p v-if="error" class="demo__error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'
import { track } from '@/lib/pixel'

const api = useApi()

const messages = ref([])
const draft    = ref('')
const sending  = ref(false)
const typing   = ref(false)
const capped   = ref(false)
const error    = ref('')
const scrollEl = ref(null)

// Stable per-browser contact id so the backend keeps one demo lead per visitor.
function contactId() {
  let id = localStorage.getItem('dn_demo_contact')
  if (!id) {
    id = 'demo-' + (crypto.randomUUID?.() ?? Math.random().toString(36).slice(2))
    localStorage.setItem('dn_demo_contact', id)
  }
  return id
}

function now() {
  return new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

// Strips markdown the model sometimes emits (**bold**, *italic*, `code`, # headings)
// so the WhatsApp bubble shows clean plain text.
function stripMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
}

// Pulls the first http(s) URL out of a reply so we can render it as a CTA button.
// Trims trailing markdown/punctuation the model may glue to the link (e.g. "url**").
function extractUrl(text) {
  const match = text.match(/https?:\/\/[^\s]+/)
  if (!match) return null
  return match[0].replace(/[*_`)\].,;:!?]+$/, '')
}

async function scrollToBottom() {
  await nextTick()
  if (scrollEl.value) scrollEl.value.scrollTop = scrollEl.value.scrollHeight
}

function pushNora(text) {
  messages.value.push({ from: 'nora', text: stripMarkdown(text), time: now(), bookingUrl: extractUrl(text) })
  scrollToBottom()
}

const suggestions = [
  { icon: '✉️', label: 'Pídele que te mande un correo', text: 'Nora, ¿me puedes enviar un correo con un resumen de lo que hace DigiNode?' },
  { icon: '📅', label: 'Pídele su agenda de la semana', text: 'Nora, enséñame tu agenda de citas de esta semana.' },
  { icon: '💡', label: '¿Qué es DigiNode?', text: '¿Qué es DigiNode y qué harías tú por mi negocio?' },
]

function sendSuggestion(text) {
  if (sending.value || capped.value) return
  draft.value = text
  send()
}

async function send() {
  const text = draft.value.trim()
  if (!text || sending.value || capped.value) return

  // First message from the visitor = a started conversation (Meta "Contact").
  if (!messages.value.some(m => m.from === 'me')) track('Contact')

  messages.value.push({ from: 'me', text, time: now() })
  draft.value = ''
  scrollToBottom()

  sending.value = true
  typing.value = true
  try {
    const res = await api.post('/demo/message', { contact_id: contactId(), message: text })
    typing.value = false
    pushNora(res.reply)
    if (res.capped) capped.value = true
  } catch (e) {
    typing.value = false
    error.value = e.message ?? 'No se pudo enviar el mensaje. Inténtalo de nuevo.'
  } finally {
    sending.value = false
  }
}

onMounted(() => {
  // Nora opens the conversation.
  setTimeout(() => {
    typing.value = true
    setTimeout(() => {
      typing.value = false
      pushNora('¡Hola! 👋 Soy Nora, la recepcionista con IA de DigiNode. Cuéntame, ¿en qué tipo de negocio trabajas y qué tarea te quita más tiempo?')
    }, 900)
  }, 400)
})
</script>

<style lang="scss" scoped>
.demo {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $space-12 $space-4 $space-16;
  gap: $space-8;

  &__intro {
    max-width: 560px;
    text-align: center;
  }

  &__title {
    font-family: $font-display;
    font-size: $text-4xl;
    font-weight: $fw-bold;
    color: $text;
    margin-bottom: $space-3;
  }

  &__subtitle {
    color: $text-muted;
    font-size: $text-lg;
    line-height: 1.6;
  }

  &__capped,
  &__error {
    max-width: 380px;
    text-align: center;
    font-size: $text-sm;
  }

  &__cards {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: $space-3;
    max-width: 420px;
  }

  &__capped { color: $text-muted; }
  &__capped-link { color: $primary-light; font-weight: $fw-semibold; }
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
  height: 640px;
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
</style>
