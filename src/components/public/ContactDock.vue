<template>
  <div
    v-show="mode === 'header' || !suppressed"
    ref="root"
    :class="[mode === 'header' ? 'cd-head' : 'cd-fab', { 'cd-open': open }]"
  >
    <button
      ref="trigger"
      type="button"
      :class="mode === 'header' ? 'cd-trigger' : 'cd-fab__btn'"
      :aria-expanded="open"
      aria-haspopup="menu"
      :aria-controls="panelId"
      @click="toggle"
    >
      <template v-if="mode === 'header'">
        <span class="cd-dot" aria-hidden="true" />
        <span class="cd-trigger__txt">
          ¿Qué te frena?
          <small>{{ phoneShort }}</small>
        </span>
        <ChevronDown class="cd-chev" :size="14" aria-hidden="true" />
      </template>
      <template v-else>
        <Phone class="cd-ico" :size="18" :stroke-width="2" aria-hidden="true" />
        {{ open ? 'Cerrar' : '¿Hablamos?' }}
      </template>
    </button>
    <div
      v-if="mode === 'fab'"
      class="cd-scrim"
      :class="{ on: open }"
      aria-hidden="true"
      @click="close()"
    />
    <div
      :id="panelId"
      ref="panel"
      class="cd-panel"
      role="menu"
      aria-label="Formas de contacto"
      :inert="!open"
      :aria-hidden="!open"
    >
      <div class="cd-panel__top">
        <span>Para escucharte</span>
        <span>Diginode · Madrid</span>
      </div>
      <ul class="cd-list">
        <li>
          <a class="cd-item" role="menuitem" :href="CONTACT.tel" @click="onCall">
            <span class="cd-item__ico">
              <Phone class="cd-ico" :size="18" aria-hidden="true" />
            </span>
            <span class="cd-item__body">
              <strong>Llámanos</strong>
              <small>y lo vemos juntos</small>
              <small class="mono">{{ CONTACT.phone }}</small>
            </span>
            <span class="cd-item__go" aria-hidden="true">→</span>
          </a>
        </li>
        <li>
          <a
            class="cd-item cd-item--wa"
            role="menuitem"
            :href="CONTACT.whatsapp"
            target="_blank"
            rel="noopener noreferrer"
            @click="onWhatsapp"
          >
            <span class="cd-item__ico">
              <MessageCircle class="cd-ico" :size="18" aria-hidden="true" />
            </span>
            <span class="cd-item__body">
              <strong>WhatsApp</strong>
              <small>Cuéntanos por ahí qué te preocupa</small>
            </span>
            <span class="cd-item__go" aria-hidden="true">↗</span>
          </a>
        </li>
        <li>
          <a
            v-if="samePageForm"
            class="cd-item cd-item--form"
            role="menuitem"
            href="#contacto"
            @click="onForm"
          >
            <span class="cd-item__ico">
              <FileText class="cd-ico" :size="18" aria-hidden="true" />
            </span>
            <span class="cd-item__body">
              <strong>Formulario</strong>
              <small>¿Qué te está quitando tiempo?</small>
            </span>
            <span class="cd-item__go" aria-hidden="true">↓</span>
          </a>
          <RouterLink
            v-else
            class="cd-item cd-item--form"
            role="menuitem"
            to="/#contacto"
            @click="onForm"
          >
            <span class="cd-item__ico">
              <FileText class="cd-ico" :size="18" aria-hidden="true" />
            </span>
            <span class="cd-item__body">
              <strong>Formulario</strong>
              <small>¿Qué te está quitando tiempo?</small>
            </span>
            <span class="cd-item__go" aria-hidden="true">↓</span>
          </RouterLink>
        </li>
      </ul>
      <div class="cd-panel__foot">
        <a :href="`mailto:${CONTACT.publicEmail}`">{{ CONTACT.publicEmail }}</a>
        <a :href="CONTACT.telegram" target="_blank" rel="noopener noreferrer">Telegram ↗</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ChevronDown, FileText, MessageCircle, Phone } from 'lucide-vue-next'
import { CONTACT } from '@/data/contact'
import { trackContact } from '@/lib/contactTracking'
import { useConsentStore } from '@/stores/consent'

const props = defineProps({
  mode: { type: String, required: true, validator: (value) => ['header', 'fab'].includes(value) },
  menuOpen: { type: Boolean, default: false },
})

const route = useRoute()
const consent = useConsentStore()
const open = ref(false)
const overlap = ref(false)
const root = ref(null)
const trigger = ref(null)
const panel = ref(null)
const panelId = `contact-panel-${props.mode}`
const phoneShort = CONTACT.phone.replace(/^\+34\s*/, '')
const pagesWithForm = new Set(['home', 'web-apps', 'clinica'])
const samePageForm = computed(() => pagesWithForm.has(route.name))
const place = computed(() => (props.mode === 'header' ? 'header' : 'fab'))
const suppressed = computed(
  () => props.mode === 'fab' && (!consent.hydrated || props.menuOpen || consent.visible || overlap.value)
)

watch(suppressed, (value) => {
  if (value) open.value = false
})

watch(
  () => route.fullPath,
  async () => {
    open.value = false
    await nextTick()
    bindOverlap()
  }
)

function toggle() {
  open.value = !open.value
  if (open.value && props.mode === 'fab') nextTick(() => focusFirst())
}

function close({ restore = true } = {}) {
  if (!open.value) return
  open.value = false
  if (restore) nextTick(() => trigger.value?.focus())
}

function focusFirst() {
  panel.value?.querySelector('a, button')?.focus()
}

function onCall() {
  trackContact('call', place.value)
  close({ restore: false })
}

function onWhatsapp() {
  trackContact('whatsapp', place.value)
  close({ restore: false })
}

function onForm() {
  close({ restore: false })
}

function onKeydown(event) {
  if (!open.value) return
  if (event.key === 'Escape') {
    event.preventDefault()
    close()
    return
  }
  if (props.mode !== 'fab' || event.key !== 'Tab' || !panel.value) return
  const nodes = [...panel.value.querySelectorAll('a, button')]
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

function onPointerDown(event) {
  if (!open.value || props.mode !== 'header') return
  if (!root.value?.contains(event.target)) close({ restore: false })
}

let observer
let mutations
let frame = 0

function bindOverlap() {
  observer?.disconnect()
  if (props.mode !== 'fab' || typeof IntersectionObserver === 'undefined') {
    overlap.value = false
    return
  }
  const nodes = [...document.querySelectorAll('#contacto, #demo-nora')]
  if (!nodes.length) {
    overlap.value = false
    return
  }
  const seen = new Map()
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) seen.set(entry.target, entry.isIntersecting)
      overlap.value = [...seen.values()].some(Boolean)
    },
    { threshold: 0.08 }
  )
  for (const node of nodes) observer.observe(node)
}

function scheduleOverlap() {
  if (props.mode !== 'fab') return
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(() => bindOverlap())
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  document.addEventListener('pointerdown', onPointerDown)
  bindOverlap()
  const main = document.getElementById('main-content')
  if (props.mode === 'fab' && main && typeof MutationObserver !== 'undefined') {
    mutations = new MutationObserver(scheduleOverlap)
    mutations.observe(main, { childList: true, subtree: true })
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('pointerdown', onPointerDown)
  observer?.disconnect()
  mutations?.disconnect()
  cancelAnimationFrame(frame)
})
</script>

<style scoped lang="scss">
.cd-ico {
  width: 18px;
  height: 18px;
  flex: none;
}

.cd-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: $accent-light;
  position: relative;
  flex: none;

  &::after {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    border: 1px solid $accent-light;
    opacity: 0;
    animation: cd-ping 2.6s cubic-bezier(0.16, 1, 0.3, 1) infinite;
  }
}

@keyframes cd-ping {
  0% {
    transform: scale(0.6);
    opacity: 0.8;
  }
  70%,
  100% {
    transform: scale(1.6);
    opacity: 0;
  }
}

.cd-head {
  position: relative;
}

.cd-trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  min-height: 44px;
  padding: 0.45rem 0.95rem 0.45rem 0.8rem;
  border: 1px solid #29476a;
  border-radius: $radius-sm;
  background: linear-gradient(145deg, #10233b, #0b1421);
  color: $text;
  font: inherit;
  font-size: 0.8rem;
  font-weight: $fw-semibold;
  cursor: pointer;
  transition: border-color 0.2s ease, transform 0.2s ease;

  &:hover {
    border-color: #3d6896;
    transform: translateY(-1px);
  }
}

.cd-trigger__txt {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
  text-align: left;
  white-space: nowrap;

  small {
    font-family: $font-mono;
    font-size: 0.66rem;
    font-weight: $fw-regular;
    color: $text-muted;
    letter-spacing: 0.02em;
  }
}

.cd-chev {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.cd-open .cd-chev {
  transform: rotate(180deg);
}

.cd-panel {
  width: 340px;
  background: linear-gradient(145deg, #10233b, #0b1421);
  border: 1px solid #29476a;
  border-radius: 18px;
  padding: 1.1rem 1.2rem 1rem;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.45);
  transform-origin: top right;
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
  pointer-events: none;
  transition: opacity 0.25s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.cd-head .cd-panel {
  position: absolute;
  right: 0;
  top: calc(100% + 12px);
  z-index: 30;
}

.cd-open .cd-panel {
  opacity: 1;
  transform: none;
  pointer-events: auto;
}

.cd-panel__top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  font-size: 0.62rem;
  letter-spacing: 0.13em;
  color: $text-muted;
  text-transform: uppercase;
  padding-bottom: 0.7rem;
  white-space: nowrap;

  span:last-child {
    color: #7d93ad;
    letter-spacing: 0.08em;
  }
}

.cd-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.cd-item {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.8rem 0.2rem;
  border-top: 1px solid #29415c;
  color: $text;
  text-decoration: none;
  transition: background 0.2s ease, padding 0.25s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    padding-left: 0.5rem;
  }
}

.cd-open .cd-item {
  animation: cd-row 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.cd-open .cd-list li:nth-child(2) .cd-item {
  animation-delay: 0.05s;
}

.cd-open .cd-list li:nth-child(3) .cd-item {
  animation-delay: 0.1s;
}

@keyframes cd-row {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.cd-item__ico {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  border: 1px solid #29476a;
  color: $primary-light;
  flex: none;
}

.cd-item--wa .cd-item__ico {
  color: $accent-teal;
}

.cd-item--form .cd-item__ico {
  color: $accent-light;
}

.cd-item__body {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
  min-width: 0;

  strong {
    font-size: 0.95rem;
    font-weight: $fw-medium;
  }

  small {
    font-size: 0.74rem;
    color: $text-muted;
  }

  .mono {
    font-family: $font-mono;
    white-space: nowrap;
  }
}

.cd-item__go {
  margin-left: auto;
  color: #5f7a98;
  font-size: 0.9rem;
}

.cd-panel__foot {
  border-top: 1px solid #29415c;
  padding-top: 0.7rem;
  font-size: 0.66rem;
  letter-spacing: 0.04em;
  color: #7d93ad;
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;

  a {
    color: $text-muted;
    text-decoration: none;

    &:hover {
      color: $text;
    }
  }
}

.cd-fab {
  display: none;
}

.cd-scrim {
  position: fixed;
  inset: 0;
  background: rgba(5, 10, 15, 0.7);
  backdrop-filter: blur(3px);
  z-index: 0;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease;

  &.on {
    opacity: 1;
    pointer-events: auto;
  }
}

@media (max-width: 1100px) {
  .cd-head {
    display: none;
  }

  .cd-fab {
    display: block;
    position: fixed;
    right: 16px;
    bottom: calc(16px + env(safe-area-inset-bottom));
    z-index: 90;
    animation: cd-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both;
  }

  .cd-fab__btn {
    position: relative;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    min-height: 52px;
    padding: 0 1.15rem 0 1rem;
    border: 0;
    border-radius: $radius-full;
    background: $accent-light;
    color: #08111e;
    font: inherit;
    font-size: 0.92rem;
    font-weight: $fw-semibold;
    box-shadow: 0 14px 34px rgba(0, 0, 0, 0.55), inset 0 0 0 1px rgba(255, 202, 120, 0.33);
    cursor: pointer;
  }

  .cd-fab .cd-panel {
    position: absolute;
    right: 0;
    bottom: calc(100% + 12px);
    z-index: 1;
    width: min(330px, calc(100vw - 32px));
    transform-origin: bottom right;
    transform: translateY(8px) scale(0.98);
  }

  .cd-fab.cd-open .cd-panel {
    transform: none;
  }

  .cd-item {
    padding: 0.9rem 0.2rem;
    min-height: 56px;
  }
}

@keyframes cd-in {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cd-dot::after,
  .cd-fab,
  .cd-open .cd-item {
    animation: none;
  }

  .cd-panel,
  .cd-chev,
  .cd-scrim,
  .cd-trigger,
  .cd-item {
    transition: none;
  }
}
</style>
