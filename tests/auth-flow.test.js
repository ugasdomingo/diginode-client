import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { DEMO_ACCOUNTS, DEMO_MFA_CODE } from '@/api/ops/fixtures'
import { mockOps, resetOpsMock, signDemoToken } from '@/api/ops/mock'
import { interpretLogin, interpretMfa, interpretOtpResend, normalizeCode } from '@/lib/authFlow'
import { OPS_ROUTES } from '@/api/ops/contracts'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import LoginView from '@/views/auth/LoginView.vue'

const api = vi.hoisted(() => ({
  login: vi.fn(),
  verifyMfa: vi.fn(),
  resendMfa: vi.fn(),
  opsUsesMock: vi.fn(() => true),
}))

vi.mock('@/api/ops/client.js', () => api)

function token(role) {
  const body = btoa(JSON.stringify({
    user_id: role === 'client' ? '64b0000000000000000000a1' : '64b0000000000000000000ad',
    role,
    token_version: 0,
  }))
  return `header.${body}.sig`
}

async function mountLogin() {
  const pinia = createPinia()
  setActivePinia(pinia)
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/login', component: LoginView },
      { path: '/admin/dashboard', component: { template: '<div>admin</div>' } },
      { path: '/portal/dashboard', component: { template: '<div>portal</div>' } },
      { path: '/cambiar-contrasena', component: { template: '<div />' } },
    ],
  })
  await router.push('/login')
  await router.isReady()
  const wrapper = mount(LoginView, { global: { plugins: [pinia, router] } })
  return { wrapper, router }
}

describe('acceso en dos pasos', () => {
  beforeEach(() => {
    resetOpsMock()
    localStorage.clear()
    api.login.mockReset()
    api.verifyMfa.mockReset()
    api.opsUsesMock.mockReturnValue(true)
  })

  it('separa la contraseña del código y no inventa una sesión', () => {
    expect(interpretLogin({ success: true, requires_otp: true, challenge_id: 'ch_1' }, 'lucia@aireyoga.test')).toMatchObject({
      step: 'otp',
      challengeId: 'ch_1',
      hint: 'lucia@aireyoga.test',
    })
    expect(interpretLogin({ success: true, token: 'abc' }).step).toBe('session')
    expect(interpretLogin({ success: true }).ok).toBe(false)
    expect(interpretMfa({}).ok).toBe(false)
    expect(interpretOtpResend({ success: true, requires_otp: true, challenge_id: 'ch_2' }).challengeId).toBe('ch_2')
    expect(interpretOtpResend({ success: true }).ok).toBe(false)
    expect(normalizeCode('48 29-13abc')).toBe('482913')
  })

  it('el cliente de demostración pasa por el código y el rechazo vuelve a Domingo', () => {
    const admin = signDemoToken(DEMO_ACCOUNTS[0])
    const started = mockOps('POST', '/auth/login', {
      email: 'lucia@aireyoga.test',
      password: 'Aire-2026',
    }, null)
    expect(started.token).toBeUndefined()
    expect(started.requires_otp).toBe(true)
    expect(() => mockOps('POST', '/auth/otp/verify', { challenge_id: started.challenge_id, code: '000000' }, null)).toThrow(/no válido/)
    const resent = mockOps('POST', '/auth/otp/resend', { challenge_id: started.challenge_id }, null)
    expect(resent.challenge_id).toBeTruthy()
    expect(resent.challenge_id).not.toBe(started.challenge_id)
    expect(resent.requires_otp).toBe(true)
    expect(() => mockOps('POST', '/auth/otp/verify', { challenge_id: started.challenge_id, code: DEMO_MFA_CODE }, null)).toThrow(/no válido/)
    const session = mockOps('POST', '/auth/otp/verify', {
      challenge_id: resent.challenge_id,
      code: DEMO_MFA_CODE,
    }, null)
    expect(session.user.role).toBe('client')
    const mine = mockOps('GET', '/agency/approvals?limit=100', null, session.token)
    const pending = mine.data.find((item) => item.status === 'pendiente_cliente')
    const rejected = mockOps('POST', `/agency/approvals/${pending.id}/client`, {
      decision: 'rechazar',
      comment: 'La música no pega con la clase.',
    }, session.token)
    expect(rejected.data.status).toBe('devuelto')
    const queue = mockOps('GET', '/agency/approvals?status=pendiente_domingo&limit=100', null, admin)
    expect(queue.data.some((item) => item.id === pending.id)).toBe(false)
    const again = mockOps('POST', `/agency/pieces/${pending.piece_id}/submit`, {}, admin)
    expect(again.data.status).toBe('pendiente_domingo')
    expect(again.data.round).toBeGreaterThan(1)
    const after = mockOps('GET', '/agency/approvals?status=pendiente_domingo&limit=100', null, admin)
    expect(after.data.some((item) => item.piece_id === pending.piece_id)).toBe(true)
    expect(() => mockOps('POST', '/agency/meetings', { title: 'Otra hora' }, session.token)).toThrow(/denegado/)
    expect(() => mockOps('POST', `/agency/invoices/${pending.id}/checkout`, {}, session.token)).toThrow(/denegado/)
  })

  it('la bóveda no devuelve la clave', () => {
    const admin = signDemoToken(DEMO_ACCOUNTS[0])
    const clients = mockOps('GET', '/agency/clients?limit=100', null, admin)
    const clientId = clients.data[0].id
    const created = mockOps('POST', `/agency/clients/${clientId}/credentials`, {
      provider: 'web',
      label: 'Correo del estudio',
      secret: 'CLAVE-SECRETA-XYZ',
    }, admin)
    const listed = mockOps('GET', `/agency/clients/${clientId}/credentials`, null, admin)
    expect(JSON.stringify(created)).not.toContain('CLAVE-SECRETA-XYZ')
    expect(JSON.stringify(listed)).not.toContain('CLAVE-SECRETA-XYZ')
    expect(created.data.provider).toBe('web')
    expect(created.data.secret).toBeUndefined()
  })

  it('la documentación nombra cada endpoint previsto', () => {
    const doc = readFileSync(resolve('docs/api-operacion.md'), 'utf8')
    for (const route of OPS_ROUTES) {
      expect(doc).toContain(`${route.method} ${route.path}`)
    }
  })

  it('muestra el código y entra al portal', async () => {
    api.login.mockResolvedValue({
      success: true,
      requires_otp: true,
      challenge_id: 'ch_ui',
    })
    api.verifyMfa.mockResolvedValue({
      success: true,
      token: token('client'),
      user: { role: 'client', email: 'lucia@aireyoga.test', password_change_required: false },
    })
    const { wrapper, router } = await mountLogin()
    await wrapper.get('#email').setValue('lucia@aireyoga.test')
    await wrapper.get('#password').setValue('Aire-2026')
    await wrapper.get('form').trigger('submit.prevent')
    await flushPromises()
    expect(wrapper.get('#code').exists()).toBe(true)
    expect(wrapper.find('#password').exists()).toBe(false)
    await wrapper.get('#code').setValue('48 2913')
    await wrapper.get('form').trigger('submit.prevent')
    await flushPromises()
    expect(api.verifyMfa).toHaveBeenCalledWith({ challenge_id: 'ch_ui', code: '482913' })
    expect(router.currentRoute.value.path).toBe('/portal/dashboard')
    const payload = JSON.parse(atob(localStorage.getItem('dn_token').split('.')[1]))
    expect(payload).toMatchObject({ role: 'client', user_id: '64b0000000000000000000a1' })
  })

  it('Domingo entra directo al panel', async () => {
    api.login.mockResolvedValue({
      success: true,
      token: token('admin'),
      user: { role: 'admin', email: 'domingo@midiginode.com', password_change_required: false },
    })
    const { wrapper, router } = await mountLogin()
    await wrapper.get('#email').setValue('domingo@midiginode.com')
    await wrapper.get('#password').setValue('Madrid-2026')
    await wrapper.get('form').trigger('submit.prevent')
    await flushPromises()
    expect(router.currentRoute.value.path).toBe('/admin/dashboard')
    expect(wrapper.get('#password').element.value).toBe('')
  })
})
