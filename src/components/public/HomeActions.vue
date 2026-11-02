<template>
  <div class="home-actions">
    <button
      type="button"
      :class="quiet ? 'home-actions__ghost' : 'commercial-button home-actions__primary'"
      @click="book"
    >
      <CalendarDays :size="18" aria-hidden="true" /> Agendar llamada
    </button>
    <a
      :href="questionLink"
      target="_blank"
      rel="noopener noreferrer"
      class="home-actions__ghost"
      @click="trackEvent('lead_cta_click')"
      ><WhatsAppIcon /> Tengo una duda</a
    >
    <dialog ref="dialog" class="home-dialog" aria-label="Agendar llamada" @click.self="close">
      <button type="button" class="home-dialog__close" aria-label="Cerrar" @click="close">✕</button>
      <iframe v-if="open" :src="embedUrl" title="Calendario de Diginode" loading="lazy" />
    </dialog>
  </div>
</template>
<script setup>
import { computed, ref } from 'vue'
import { CalendarDays } from 'lucide-vue-next'
import WhatsAppIcon from './WhatsAppIcon.vue'
import { CONTACT } from '@/data/contact'
import { useServices } from '@/data/services'
import { trackEvent } from '@/lib/analytics'
// Quiet: both buttons secondary, when another action is the protagonist.
const props = defineProps({
  quiet: { type: Boolean, default: false },
  question: { type: String, default: 'Hola, vengo de vuestra web y tengo una duda sobre vuestro marketing.' },
})
const { bookingUrl } = useServices()
const dialog = ref(null),
  open = ref(false)
const whatsapp = (text) => `${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`
const questionLink = computed(() => whatsapp(props.question))
const embedUrl = computed(() => {
  const url = new URL(bookingUrl.value)
  url.searchParams.set('embed', 'true')
  url.searchParams.set('theme', 'dark')
  return url.href
})
// Cal.com opens over the page; without a configured link the call is arranged on WhatsApp.
function book() {
  trackEvent('booking_click')
  if (!bookingUrl.value) {
    window.open(whatsapp('Hola, quiero agendar una llamada.'), '_blank', 'noopener')
    return
  }
  open.value = true
  dialog.value.showModal()
}
function close() {
  dialog.value.close()
  open.value = false
}
</script>
<style scoped lang="scss">
.home-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.9rem;
}
.home-actions__primary {
  gap: 0.6rem;
  box-shadow: 0 10px 40px rgba(255, 185, 77, 0.28);
  transition: transform 0.2s, box-shadow 0.2s;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 50px rgba(255, 185, 77, 0.4);
  }
}
.home-actions__ghost {
  font: inherit;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  min-height: 50px;
  padding: 1rem 1.4rem;
  border-radius: 8px;
  border: 1px solid rgba(135, 188, 244, 0.35);
  background: rgba(10, 20, 34, 0.5);
  backdrop-filter: blur(8px);
  color: #e3ecf7;
  font-weight: 600;
  transition: border-color 0.2s, transform 0.2s;
  &:hover {
    border-color: #25d366;
    transform: translateY(-2px);
  }
  svg {
    color: #25d366;
  }
  .lucide {
    color: #ffb94d;
  }
}
.home-dialog {
  margin: auto;
  width: min(960px, calc(100% - 24px));
  height: min(760px, calc(100dvh - 24px));
  padding: 0;
  border: 1px solid #29476a;
  border-radius: 18px;
  background: #0b1421;
  overflow: hidden;
  &::backdrop {
    background: rgba(3, 7, 12, 0.75);
    backdrop-filter: blur(6px);
  }
  iframe {
    width: 100%;
    height: 100%;
    border: 0;
  }
}
.home-dialog__close {
  position: absolute;
  top: 10px;
  right: 12px;
  z-index: 1;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #29476a;
  background: #0b1421;
  color: #f8fafc;
  cursor: pointer;
}
@media (max-width: 420px) {
  .home-actions > * {
    width: 100%;
    justify-content: center;
  }
}
</style>
