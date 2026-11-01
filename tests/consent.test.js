import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { analyticsAllowed, trackPageview } from '@/lib/analytics'
import { initPixel, track } from '@/lib/pixel'
import { hasConsent, readConsent, writeConsent } from '@/lib/consent'
import CookieConsent from '@/components/consent/CookieConsent.vue'
import EmbedGate from '@/components/consent/EmbedGate.vue'

function router() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/legal/cookies', component: { template: '<div />' } },
    ],
  })
}

describe('consentimiento', () => {
  beforeEach(() => {
    localStorage.clear()
    document.body.innerHTML = ''
    setActivePinia(createPinia())
  })

  it('no mide sin consentimiento, aunque la medición esté activada', () => {
    const beacon = vi.fn()
    navigator.sendBeacon = beacon
    expect(analyticsAllowed({ envFlag: 'true', consent: false, doNotTrack: false })).toBe(false)
    trackPageview('/clinica-digital')
    expect(beacon).not.toHaveBeenCalled()
  })

  it('mide solo con el interruptor, el permiso y sin señal de rechazo', () => {
    expect(analyticsAllowed({ envFlag: 'true', consent: true, doNotTrack: false })).toBe(true)
    expect(analyticsAllowed({ envFlag: 'false', consent: true, doNotTrack: false })).toBe(false)
    expect(analyticsAllowed({ envFlag: 'true', consent: true, doNotTrack: true })).toBe(false)
  })

  it('rechazar deja la web usable y no enciende categorías', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const wrapper = mount(CookieConsent, {
      attachTo: document.body,
      global: { plugins: [pinia, router()] },
    })
    await flushPromises()
    const buttons = [...document.body.querySelectorAll('button.consent__choice')]
    expect(buttons.map((button) => button.textContent.trim())).toEqual(['Aceptar', 'Rechazar'])
    buttons[1].click()
    await flushPromises()
    expect(readConsent().analytics).toBe(false)
    expect(readConsent().marketing).toBe(false)
    expect(readConsent().embeds).toBe(false)
    expect(hasConsent('necessary')).toBe(true)
    expect(document.body.querySelector('[role="dialog"]')).toBeNull()
    wrapper.unmount()
  })

  it('aceptar guarda las tres categorías y se puede revocar', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    mount(CookieConsent, { attachTo: document.body, global: { plugins: [pinia, router()] } })
    await flushPromises()
    document.body.querySelector('.consent__choice--accept').click()
    await flushPromises()
    expect(readConsent()).toMatchObject({ analytics: true, marketing: true, embeds: true })
    writeConsent({ analytics: false, marketing: false, embeds: false, source: 'reject_all' })
    expect(hasConsent('analytics')).toBe(false)
  })

  it('un calendario incrustado no carga el iframe hasta el permiso de ese servicio', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    writeConsent({ analytics: false, marketing: false, embeds: false, source: 'reject_all' })
    const wrapper = mount(EmbedGate, {
      props: {
        title: 'Calendario externo',
        why: 'Este calendario deja cookies de un tercero.',
        src: 'https://example.com/calendar',
      },
      global: { plugins: [pinia] },
    })
    expect(wrapper.find('iframe').exists()).toBe(false)
    expect(wrapper.text()).toContain('cookies de un tercero')
    await wrapper.get('[data-testid="allow-embeds"]').trigger('click')
    expect(wrapper.find('iframe').attributes('src')).toBe('https://example.com/calendar')
    expect(hasConsent('marketing')).toBe(false)
    expect(hasConsent('embeds')).toBe(true)
  })

  it('no inyecta píxel ni fuentes de Google', () => {
    initPixel()
    track('PageView')
    expect(document.querySelector('script[src*="fbevents"]')).toBeNull()
    expect(document.querySelector('script[src*="facebook"]')).toBeNull()
    const html = readFileSync(resolve('index.html'), 'utf8')
    const base = readFileSync(resolve('src/assets/styles/base.scss'), 'utf8')
    const pixel = readFileSync(resolve('src/lib/pixel.js'), 'utf8')
    expect(html).not.toContain('fonts.googleapis')
    expect(base).not.toContain('fonts.googleapis')
    expect(pixel).not.toContain('fbevents.js')
  })
})
