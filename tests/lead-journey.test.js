import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import LeadForm from '@/components/public/LeadForm.vue'
import { readVisitorId, writeConsent } from '@/lib/consent'
import { rememberPageview, resetJourney } from '@/lib/journey'

const post = vi.hoisted(() => vi.fn(async () => ({ message: 'Solicitud recibida.' })))
const get = vi.hoisted(() => vi.fn(async () => {
  throw new Error('sin red')
}))

vi.mock('@/composables/useApi', () => ({
  useApi: () => ({ post, get }),
}))

function router() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: { template: '<div />' } },
      { path: '/legal/privacidad', name: 'legal.privacidad', component: { template: '<div />' } },
    ],
  })
}

async function fill(wrapper, { journey = false } = {}) {
  await wrapper.get('input[name=name]').setValue('Ana Ruiz')
  await wrapper.get('input[name=company]').setValue('Taller Norte')
  await wrapper.get('input[name=email]').setValue('ana@taller.es')
  await wrapper.get('textarea[name=goal]').setValue('Quiero ordenar el marketing de la empresa.')
  await wrapper.get('input[name=privacy]').setValue(true)
  if (journey) await wrapper.get('input[name=journey_consent]').setValue(true)
  await wrapper.get('form').trigger('submit')
  await flushPromises()
}

describe('casilla de recorrido en el formulario', () => {
  beforeEach(() => {
    localStorage.clear()
    resetJourney()
    post.mockClear()
    document.cookie = 'dn_vid=; Path=/; Max-Age=0; SameSite=Lax; Secure'
    vi.stubEnv('VITE_ENABLE_ANALYTICS', 'false')
    navigator.sendBeacon = vi.fn(() => true)
    setActivePinia(createPinia())
  })

  it('la casilla nace sin marcar y sin ella no sale el recorrido', async () => {
    rememberPageview('/', { query: { utm_source: 'google' } })
    const wrapper = mount(LeadForm, { global: { plugins: [createPinia(), router()] } })
    expect(wrapper.get('input[name=journey_consent]').element.checked).toBe(false)
    expect(wrapper.text()).toContain('Acepto que Diginode asocie mi visita a mi solicitud')
    await fill(wrapper)
    const body = post.mock.calls[0][1]
    expect(body).not.toHaveProperty('journey')
    expect(body).not.toHaveProperty('journey_consent')
    expect(body).not.toHaveProperty('visitor_id')
    expect(body.email).toBe('ana@taller.es')
    wrapper.unmount()
  })

  it('con la casilla envía el recorrido y el consentimiento, sin visitor_id si no hay cookie', async () => {
    rememberPageview('/', { query: { utm_source: 'boletin', utm_medium: 'email', utm_campaign: 'marzo' } })
    rememberPageview('/faq')
    const wrapper = mount(LeadForm, { global: { plugins: [createPinia(), router()] } })
    await fill(wrapper, { journey: true })
    const body = post.mock.calls[0][1]
    expect(body.journey_consent).toBe(true)
    expect(body.journey.consent).toMatchObject({ version: '1' })
    expect(body.journey.consent.at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/)
    expect(body.journey.entry).toMatchObject({
      utm_source: 'boletin',
      utm_medium: 'email',
      utm_campaign: 'marzo',
    })
    expect(body.journey.events.map((event) => event.type)).toEqual(['pageview', 'pageview', 'contact_click'])
    expect(body.journey.events.at(-1)).toMatchObject({
      type: 'contact_click',
      contact_type: 'form',
      location: 'contact_section',
      path: '/',
    })
    expect(body.visitor_id).toBeUndefined()
    expect(JSON.stringify(body.journey)).not.toContain('ana@taller.es')
    wrapper.unmount()
  })

  it('con la casilla y la cookie de medición envía también visitor_id', async () => {
    const writes = []
    const jar = new Map()
    Object.defineProperty(document, 'cookie', {
      configurable: true,
      get: () => [...jar.entries()].map(([name, value]) => `${name}=${value}`).join('; '),
      set: (value) => {
        writes.push(value)
        const pair = value.split(';')[0]
        const name = pair.slice(0, pair.indexOf('='))
        const raw = pair.slice(pair.indexOf('=') + 1)
        if (value.includes('Max-Age=0') || raw === '') jar.delete(name)
        else jar.set(name, decodeURIComponent(raw))
      },
    })
    writeConsent({ analytics: true, marketing: false, embeds: false, source: 'custom' })
    const visitorId = readVisitorId()
    expect(visitorId).toBeTruthy()
    expect(writes.some((line) => line.includes('Secure') && line.startsWith('dn_vid='))).toBe(true)
    rememberPageview('/')
    const wrapper = mount(LeadForm, { global: { plugins: [createPinia(), router()] } })
    await fill(wrapper, { journey: true })
    const body = post.mock.calls[0][1]
    expect(body.journey_consent).toBe(true)
    expect(body.visitor_id).toBe(visitorId)
    wrapper.unmount()
  })
})
