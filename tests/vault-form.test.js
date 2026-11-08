import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import VaultView from '@/views/admin/ops/VaultView.vue'

const api = vi.hoisted(() => ({
  listClients: vi.fn(),
  listCredentials: vi.fn(),
  createCredential: vi.fn(),
  deleteCredential: vi.fn(),
  revealCredential: vi.fn(),
}))

vi.mock('@/api/ops/client.js', () => ({
  ...api,
  opsUsesMock: () => true,
}))

describe('formulario de la bóveda', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    api.listClients.mockResolvedValue([{ id: '64b0000000000000000000a1', company: 'Estudio Aire' }])
    api.listCredentials.mockResolvedValue([])
    api.createCredential.mockResolvedValue({ id: '64b0000000000000000000c0', label: 'Correo', provider: 'web' })
  })

  it('envía la clave y la borra del formulario y del almacenamiento local', async () => {
    const wrapper = mount(VaultView)
    await flushPromises()
    await wrapper.get('select').setValue('64b0000000000000000000a1')
    const inputs = wrapper.findAll('input')
    await inputs[0].setValue('Correo del estudio')
    await wrapper.get('[data-testid="vault-secret"]').setValue('CLAVE-SECRETA-XYZ')
    await wrapper.get('form').trigger('submit.prevent')
    await flushPromises()
    expect(api.createCredential).toHaveBeenCalled()
    const [clientId, sent] = api.createCredential.mock.calls.at(-1)
    expect(clientId).toBe('64b0000000000000000000a1')
    expect(sent).toEqual({ provider: 'otro', label: 'Correo del estudio', secret: 'CLAVE-SECRETA-XYZ' })
    expect(sent.username).toBeUndefined()
    expect(wrapper.get('[data-testid="vault-secret"]').element.value).toBe('')
    expect(JSON.stringify(localStorage)).not.toContain('CLAVE-SECRETA-XYZ')
  })
})
