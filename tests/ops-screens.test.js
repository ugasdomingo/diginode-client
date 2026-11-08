import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { signDemoToken } from '@/api/ops/mock'
import { DEMO_ACCOUNTS } from '@/api/ops/fixtures'
import PipelineView from '@/views/admin/ops/PipelineView.vue'
import ApprovalsView from '@/views/admin/ops/ApprovalsView.vue'
import PiezasView from '@/views/portal/PiezasView.vue'

vi.stubEnv('VITE_OPS_USE_MOCK', 'true')

async function router() {
  const memory = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/admin/pipeline', component: PipelineView },
      { path: '/admin/pipeline/:id', component: { template: '<div />' } },
      { path: '/admin/aprobaciones', component: ApprovalsView },
      { path: '/portal/piezas', component: PiezasView },
    ],
  })
  await memory.push('/admin/pipeline')
  await memory.isReady()
  return memory
}

describe('pantallas contra el contrato real, en demostración', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  function plugins(memory) {
    return [memory, createPinia()]
  }

  it('el pipeline usa pipeline_status y el siguiente paso en texto', async () => {
    localStorage.setItem('dn_token', signDemoToken(DEMO_ACCOUNTS[0]))
    const wrapper = mount(PipelineView, { global: { plugins: plugins(await router()) } })
    await flushPromises()
    expect(wrapper.text()).toContain('Peluquería Nuria')
    expect(wrapper.text()).toContain('Llamar el lunes 2 de noviembre, 10:30')
    expect(wrapper.text()).toContain('Reformas Lama')
    expect(wrapper.text()).not.toContain('mensaje_enviado')
  })

  it('la cola de Domingo muestra la pieza reenviada y su comentario', async () => {
    localStorage.setItem('dn_token', signDemoToken(DEMO_ACCOUNTS[0]))
    const wrapper = mount(ApprovalsView, { global: { plugins: plugins(await router()) } })
    await flushPromises()
    expect(wrapper.text()).toContain('Antes y después, calle del Pico')
    expect(wrapper.text()).toContain('El cliente la devolvió')
    expect(wrapper.text()).toContain('Demasiado texto')
    expect(wrapper.text()).not.toContain('Reel de la clase del jueves')
  })

  it('el portal del cliente solo enseña lo que está pendiente de él', async () => {
    localStorage.setItem('dn_token', signDemoToken(DEMO_ACCOUNTS[1]))
    const wrapper = mount(PiezasView, { global: { plugins: plugins(await router()) } })
    await flushPromises()
    expect(wrapper.text()).toContain('Reel de la clase del jueves')
    expect(wrapper.text()).toContain('Historia de los horarios')
    expect(wrapper.text()).not.toContain('Antes y después')
  })
})
