import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import VaultView from '@/views/admin/ops/VaultView.vue'

const api = vi.hoisted(() => ({
  listClients: vi.fn(),
  listVault: vi.fn(),
  createVaultEntry: vi.fn(),
  updateVaultEntry: vi.fn(),
}))

vi.mock('@/api/ops/client.js', () => ({
  ...api,
  opsUsesMock: () => true,
}))

describe('formulario de la bóveda', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    api.listClients.mockResolvedValue([{ id: 'cli_aire', company: 'Estudio Aire' }])
    api.listVault.mockResolvedValue([])
    api.createVaultEntry.mockResolvedValue({ id: 'v_new', label: 'Correo', has_secret: true })
  })

  it('envía la clave y la borra del formulario y del almacenamiento local', async () => {
    const wrapper = mount(VaultView)
    await flushPromises()
    await wrapper.get('select').setValue('cli_aire')
    const inputs = wrapper.findAll('input')
    await inputs[0].setValue('Correo del estudio')
    await wrapper.get('[data-testid="vault-secret"]').setValue('CLAVE-SECRETA-XYZ')
    await wrapper.get('form').trigger('submit.prevent')
    await flushPromises()
    expect(api.createVaultEntry).toHaveBeenCalled()
    const sent = api.createVaultEntry.mock.calls.at(-1)[0]
    expect(sent.secret).toBe('CLAVE-SECRETA-XYZ')
    expect(wrapper.get('[data-testid="vault-secret"]').element.value).toBe('')
    expect(JSON.stringify(localStorage)).not.toContain('CLAVE-SECRETA-XYZ')
  })
})
