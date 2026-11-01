import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { DEMO_ACCOUNTS, DEMO_MFA_CODE } from '@/api/ops/fixtures'
import { mockOps, resetOpsMock, signDemoToken } from '@/api/ops/mock'
import { interpretLogin, interpretMfa, normalizeCode } from '@/lib/authFlow'
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

function token(role, email) {
  const body = btoa(JSON.stringify({ role, email, client_id: role === 'client' ? 'cli_aire' : null }))
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
    expect(interpretLogin({ success: true, mfa_required: true, challenge_id: 'ch_1', destination_hint: 'l***@a.test' })).toMatchObject({
      step: 'mfa',
      challengeId: 'ch_1',
    })
    expect(interpretLogin({ success: true, token: 'abc' }).step).toBe('session')
    expect(interpretLogin({ success: true }).ok).toBe(false)
    expect(interpretMfa({}).ok).toBe(false)
    expect(normalizeCode('48 29-13abc')).toBe('482913')
  })

  it('el cliente de demostración pasa por el código y el rechazo vuelve a Domingo', () => {
    const admin = signDemoToken(DEMO_ACCOUNTS[0])
    const started = mockOps('POST', '/auth/login', {
      email: 'lucia@aireyoga.test',
      password: 'Aire-2026',
    }, null)
    expect(started.token).toBeUndefined()
    expect(started.mfa_required).toBe(true)
    expect(() => mockOps('POST', '/auth/mfa/verify', { challenge_id: started.challenge_id, code: '000000' }, null)).toThrow(/no coincide/)
    const session = mockOps('POST', '/auth/mfa/verify', {
      challenge_id: started.challenge_id,
      code: DEMO_MFA_CODE,
    }, null)
    expect(session.user.role).toBe('client')
    const rejected = mockOps('POST', '/portal/ops/deliverables/ap_aire_reel/reject', {
      comment: 'La música no pega con la clase.',
    }, session.token)
    expect(rejected.data.stage).toBe('domingo')
    expect(rejected.data.needs_reapproval).toBe(true)
    const queue = mockOps('GET', '/admin/ops/approvals', null, admin)
    expect(queue.data.some((item) => item.id === 'ap_aire_reel')).toBe(true)
  })

  it('la bóveda no devuelve la clave', () => {
    const admin = signDemoToken(DEMO_ACCOUNTS[0])
    const created = mockOps('POST', '/admin/ops/vault', {
      client_id: 'cli_aire',
      label: 'Correo del estudio',
      kind: 'email',
      secret: 'CLAVE-SECRETA-XYZ',
    }, admin)
    const listed = mockOps('GET', '/admin/ops/vault', null, admin)
    expect(JSON.stringify(created)).not.toContain('CLAVE-SECRETA-XYZ')
    expect(JSON.stringify(listed)).not.toContain('CLAVE-SECRETA-XYZ')
    expect(created.data.has_secret).toBe(true)
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
      mfa_required: true,
      challenge_id: 'ch_ui',
      destination_hint: 'l***@aireyoga.test',
    })
    api.verifyMfa.mockResolvedValue({
      success: true,
      token: token('client', 'lucia@aireyoga.test'),
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
    expect(payload).toMatchObject({ role: 'client', email: 'lucia@aireyoga.test' })
  })

  it('Domingo entra directo al panel', async () => {
    api.login.mockResolvedValue({
      success: true,
      token: token('admin', 'domingo@midiginode.com'),
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
