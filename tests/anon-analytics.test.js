import { beforeEach, describe, expect, it, vi } from 'vitest'
import { anonAllowed, anonEndpoint, trackAnonContact, trackAnonPageview } from '@/lib/anonAnalytics'
import { trackEvent } from '@/lib/analytics'
import { readVisitorId, syncVisitorCookie, writeConsent } from '@/lib/consent'
import { trackContact } from '@/lib/contactTracking'
import { currentJourney, rememberContact, rememberPageview, resetJourney } from '@/lib/journey'

const FORBIDDEN = ['session_id', 'visitor_id', 'client_id', 'user_id', 'ip', 'user_agent', 'ua', 'email', 'cookie', 'fingerprint', 'device_id', 'journey']

async function bodiesOf(beacon) {
  const parsed = []
  for (const call of beacon.mock.calls) {
    const data = call[1]
    const text = typeof data?.text === 'function' ? await data.text() : String(data)
    parsed.push({ url: String(call[0]), json: JSON.parse(text), raw: text })
  }
  return parsed
}

function setPrivacySignal({ doNotTrack = '0', globalPrivacyControl = false } = {}) {
  Object.defineProperty(navigator, 'doNotTrack', { configurable: true, get: () => doNotTrack })
  Object.defineProperty(navigator, 'globalPrivacyControl', { configurable: true, get: () => globalPrivacyControl })
}

describe('medición anónima y recorrido en memoria', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    resetJourney()
    document.cookie = 'dn_vid=; Path=/; Max-Age=0; SameSite=Lax; Secure'
    vi.stubEnv('VITE_ENABLE_ANALYTICS', 'true')
    setPrivacySignal()
    navigator.sendBeacon = vi.fn(() => true)
    window.history.replaceState({}, '', '/')
  })

  it('sin consentimiento no envía trackEvent', () => {
    trackEvent('contact_call_click', { location: 'header' })
    trackEvent('contact_whatsapp_click', { location: 'fab' })
    trackEvent('contact_form_submit', { location: 'contact_section' })
    expect(navigator.sendBeacon).not.toHaveBeenCalled()
  })

  it('no toca cookies ni almacenamiento y no manda identificadores', async () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem')
    const getItem = vi.spyOn(Storage.prototype, 'getItem')
    const removeItem = vi.spyOn(Storage.prototype, 'removeItem')
    localStorage.setItem('keep', '1')
    sessionStorage.setItem('keep', '1')
    setItem.mockClear()
    getItem.mockClear()
    removeItem.mockClear()
    document.cookie = 'dn_test=1'
    const cookieBefore = document.cookie

    Object.defineProperty(navigator, 'userAgent', {
      configurable: true,
      value: 'SecretUA/9.9 should-not-leak',
    })
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 390 })
    Object.defineProperty(document, 'referrer', {
      configurable: true,
      get: () => 'https://www.google.es/search?q=secreto',
    })

    rememberPageview('/clinica-digital', {
      query: { utm_source: 'boletin', utm_medium: 'email', utm_campaign: 'marzo', email: 'ana@taller.es' },
    })
    rememberContact('whatsapp', 'header', '/clinica-digital')
    trackAnonPageview('/clinica-digital', {
      query: { utm_source: 'boletin', utm_medium: 'email', utm_campaign: 'marzo', email: 'ana@taller.es' },
    })
    trackAnonContact('whatsapp', 'header', '/clinica-digital')

    expect(setItem).not.toHaveBeenCalled()
    expect(getItem).not.toHaveBeenCalled()
    expect(removeItem).not.toHaveBeenCalled()
    expect(localStorage.getItem('keep')).toBe('1')
    expect(sessionStorage.getItem('keep')).toBe('1')
    expect(document.cookie).toBe(cookieBefore)
    expect(readVisitorId()).toBeNull()

    const sent = await bodiesOf(navigator.sendBeacon)
    expect(sent).toHaveLength(2)
    for (const item of sent) {
      expect(item.url).toContain('/analytics/anon')
      for (const key of FORBIDDEN) expect(item.json).not.toHaveProperty(key)
      expect(item.raw).not.toContain('SecretUA')
      expect(item.raw).not.toContain('should-not-leak')
      expect(item.raw).not.toContain('ana@taller.es')
      expect(item.raw).not.toContain('secreto')
      expect(item.raw).not.toContain('session')
      expect(item.json.path).toBe('/clinica-digital')
      expect(item.json.referrer_domain).toBe('google.es')
      expect(item.json.device).toBe('mobile')
    }
    expect(sent[0].json.type).toBe('pageview')
    expect(sent[0].json.utm_source).toBe('boletin')
    expect(sent[0].json.utm_medium).toBe('email')
    expect(sent[0].json.utm_campaign).toBe('marzo')
    expect(sent[0].json).not.toHaveProperty('contact_type')
    expect(sent[1].json).toMatchObject({
      type: 'contact_click',
      contact_type: 'whatsapp',
      location: 'header',
    })
    expect(currentJourney().events.map((event) => event.type)).toEqual(['pageview', 'contact_click'])
    expect(currentJourney().events[0].at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/)
    expect(currentJourney().entry.utm_campaign).toBe('marzo')
    const anonKeys = Object.keys(sent[1].json)
    expect(anonKeys).not.toContain('entry')
  })

  it('respeta Do Not Track y Global Privacy Control', () => {
    expect(anonAllowed({ envFlag: 'true', doNotTrack: true })).toBe(false)
    setPrivacySignal({ doNotTrack: '1' })
    trackAnonPageview('/')
    setPrivacySignal({ globalPrivacyControl: true })
    trackAnonPageview('/')
    expect(navigator.sendBeacon).not.toHaveBeenCalled()
    expect(anonAllowed({ envFlag: 'false', doNotTrack: false })).toBe(false)
  })

  it('no mide rutas privadas ni enlaza el recorrido con un id', async () => {
    rememberPageview('/admin/leads')
    rememberPageview('/portal')
    trackAnonPageview('/admin')
    trackAnonPageview('/login')
    expect(currentJourney().events).toEqual([])
    expect(navigator.sendBeacon).not.toHaveBeenCalled()
    rememberPageview('/')
    rememberContact('call', 'fab', '/')
    expect(currentJourney().events).toHaveLength(2)
    resetJourney()
    expect(currentJourney().events).toEqual([])
    expect(currentJourney().entry).toEqual({
      referrer_domain: null,
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
    })
  })

  it('con consentimiento envía el evento de contacto y la estadística anónima por separado', async () => {
    writeConsent({ analytics: true, marketing: false, embeds: false, source: 'custom' })
    const visitorId = readVisitorId()
    expect(visitorId).toBeTruthy()
    trackContact('whatsapp', 'footer', '/')
    const sent = await bodiesOf(navigator.sendBeacon)
    const consented = sent.find((item) => item.url.includes('/analytics/event'))
    const anon = sent.find((item) => item.url.includes('/analytics/anon'))
    expect(consented.json).toMatchObject({
      event: 'contact_whatsapp_click',
      location: 'footer',
      visitor_id: visitorId,
    })
    expect(consented.json.email).toBeUndefined()
    expect(anon.json).toMatchObject({ type: 'contact_click', contact_type: 'whatsapp', location: 'footer' })
    expect(anon.json.visitor_id).toBeUndefined()
    expect(anon.json.session_id).toBeUndefined()
  })

  it('en producción el beacon anónimo entra por la web, no directo a la API', () => {
    expect(anonEndpoint({ prod: true, base: 'https://api.ejemplo.test/api', override: '' })).toBe(
      '/api/analytics/anon'
    )
    expect(anonEndpoint({ prod: false, base: 'http://localhost:3000/api', override: '' })).toBe(
      'http://localhost:3000/api/analytics/anon'
    )
  })

  it('syncVisitorCookie no crea dn_vid sin consentimiento', () => {
    expect(syncVisitorCookie()).toBeNull()
    expect(readVisitorId()).toBeNull()
    expect(document.cookie).not.toContain('dn_vid=')
  })
})
