import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { cleanCity, cleanCountry, forwardHeaders, prepareBody } from '../api/analytics/forward.js'

describe('reenvío anónimo por Vercel', () => {
  it('solo deja país y ciudad, nunca la IP', () => {
    const headers = forwardHeaders(
      new Headers({
        'x-vercel-ip-country': 'es',
        'x-vercel-ip-city': 'M%C3%A1laga',
        'x-forwarded-for': '203.0.113.8',
        'x-real-ip': '203.0.113.8',
        'cf-connecting-ip': '203.0.113.8',
        'x-vercel-ip-latitude': '36.7',
      })
    )
    expect(headers.get('x-vercel-ip-country')).toBe('ES')
    expect(headers.get('cf-ipcountry')).toBe('ES')
    expect(headers.get('x-vercel-ip-city')).toBe('Málaga')
    expect(headers.get('cf-ipcity')).toBe('Málaga')
    expect(headers.get('x-forwarded-for')).toBeNull()
    expect(headers.get('x-real-ip')).toBeNull()
    expect(headers.get('cf-connecting-ip')).toBeNull()
    expect(headers.get('x-vercel-ip-latitude')).toBeNull()
    expect([...headers.keys()].sort()).toEqual(
      ['cf-ipcity', 'cf-ipcountry', 'content-type', 'x-vercel-ip-city', 'x-vercel-ip-country'].sort()
    )
  })

  it('descarta una ciudad que parece una IP y un país inválido', () => {
    expect(cleanCountry('ESP')).toBeNull()
    expect(cleanCountry('es')).toBe('ES')
    expect(cleanCity('203.0.113.8')).toBeNull()
    expect(cleanCity('2001:db8::1')).toBeNull()
    const headers = forwardHeaders(
      new Headers({ 'cf-ipcountry': 'FR', 'cf-ipcity': '203.0.113.9', 'x-forwarded-for': '198.51.100.4' })
    )
    expect(headers.get('x-vercel-ip-country')).toBe('FR')
    expect(headers.get('x-vercel-ip-city')).toBeNull()
    expect(headers.get('x-forwarded-for')).toBeNull()
  })

  it('quita identificadores del cuerpo y no reenvía otra cosa', () => {
    const body = prepareBody(
      JSON.stringify({
        type: 'pageview',
        path: '/',
        ip: '203.0.113.8',
        visitor_id: 'abc',
        session_id: 'sess',
        email: 'ana@taller.es',
      })
    )
    const json = JSON.parse(body)
    expect(json).toEqual({ type: 'pageview', path: '/' })
    expect(prepareBody('no-json')).toBeNull()
    expect(prepareBody('{"ip":"1.1.1.1"}'.repeat(800))).toBeNull()
  })

  it('la función no copia las cabeceras de entrada y la web no se come /api', () => {
    const source = readFileSync(resolve('api/analytics/anon.js'), 'utf8')
    expect(source).not.toContain('x-forwarded-for')
    expect(source).not.toContain('x-real-ip')
    expect(source).not.toContain('cf-connecting-ip')
    expect(source).toContain('forwardHeaders')
    const routes = JSON.parse(readFileSync(resolve('vercel.json'), 'utf8')).routes
    const filesystem = routes.findIndex((route) => route.handle === 'filesystem')
    const spa = routes.findIndex((route) => route.dest === '/index.html')
    expect(filesystem).toBeGreaterThanOrEqual(0)
    expect(spa).toBeGreaterThan(filesystem)
  })
})
