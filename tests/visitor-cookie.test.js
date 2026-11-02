import { beforeEach, describe, expect, it } from 'vitest'
import { readVisitorId, syncVisitorCookie, writeConsent } from '@/lib/consent'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

describe('cookie dn_vid', () => {
  beforeEach(() => {
    localStorage.clear()
    document.cookie = 'dn_vid=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure'
  })

  it('solo existe con consentimiento de medición y se borra al retirarlo', () => {
    const writes = []
    const jar = new Map()
    const apply = (value) => {
      writes.push(value)
      const [pair, ...attrs] = value.split(';').map((part) => part.trim())
      const name = pair.slice(0, pair.indexOf('='))
      const raw = pair.slice(pair.indexOf('=') + 1)
      const expired = attrs.some((attr) => attr.toLowerCase().startsWith('max-age=0'))
      if (expired || raw === '') jar.delete(name)
      else jar.set(name, decodeURIComponent(raw))
    }
    const descriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie')
      || Object.getOwnPropertyDescriptor(HTMLDocument.prototype, 'cookie')
    Object.defineProperty(document, 'cookie', {
      configurable: true,
      get: () => [...jar.entries()].map(([name, value]) => `${name}=${value}`).join('; '),
      set: apply,
    })

    try {
      expect(readVisitorId()).toBeNull()
      writeConsent({ analytics: false, marketing: false, embeds: false, source: 'reject_all' })
      expect(readVisitorId()).toBeNull()
      expect([...jar.keys()]).not.toContain('dn_vid')

      writeConsent({ analytics: true, marketing: false, embeds: false, source: 'custom' })
      const created = writes.find((line) => line.startsWith('dn_vid=') && !line.includes('Max-Age=0'))
      expect(created).toContain('SameSite=Lax')
      expect(created).toContain('Secure')
      expect(created).toContain('Path=/')
      const maxAge = Number(created.match(/Max-Age=(\d+)/)[1])
      const thirteenMonths = 60 * 60 * 24 * 400
      expect(maxAge).toBeGreaterThan(60 * 60 * 24 * 360)
      expect(maxAge).toBeLessThanOrEqual(thirteenMonths)

      const id = readVisitorId()
      expect(id).toMatch(UUID)
      writeConsent({ analytics: true, marketing: true, embeds: true, source: 'accept_all' })
      expect(readVisitorId()).toBe(id)

      writeConsent({ analytics: false, marketing: false, embeds: false, source: 'reject_all' })
      expect(readVisitorId()).toBeNull()
      expect(jar.has('dn_vid')).toBe(false)
      expect(writes.at(-1)).toContain('Max-Age=0')
      expect(syncVisitorCookie()).toBeNull()
    } finally {
      if (descriptor) Object.defineProperty(document, 'cookie', descriptor)
    }
  })
})
