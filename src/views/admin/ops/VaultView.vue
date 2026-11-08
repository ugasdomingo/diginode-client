<template>
  <div class="ops-page">
    <header class="ops-head">
      <div>
        <p class="ops-kicker">Bóveda</p>
        <h1 class="ops-title">Accesos de los clientes</h1>
        <p class="ops-lead">
          La clave se envía cifrada y se borra de este formulario. La lista solo muestra el proveedor y el nombre.
          Para cambiar una clave hay que borrarla y crear otra. Verla deja constancia.
        </p>
      </div>
    </header>
    <MockNotice />
    <OpsState :loading="loading" :error="error" @retry="loadAll">
      <div class="ops-split">
        <div class="ops-panel" style="padding: 0">
          <table class="ops-table">
            <thead>
              <tr>
                <th>Acceso</th>
                <th>Cliente</th>
                <th>Proveedor</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="entry in entries" :key="entry.id">
                <td>
                  <strong>{{ entry.label }}</strong>
                  <div v-if="revealedId === entry.id" class="ops-card__meta">{{ revealed }}</div>
                </td>
                <td>{{ clientName(entry.client_id) }}</td>
                <td>{{ providerLabel(entry.provider) }}</td>
                <td class="ops-actions">
                  <button type="button" class="ops-link" @click="toggleSecret(entry)">
                    {{ revealedId === entry.id ? 'Ocultar' : 'Ver clave' }}
                  </button>
                  <button type="button" class="ops-link" @click="remove(entry)">Borrar</button>
                </td>
              </tr>
              <tr v-if="!entries.length"><td colspan="4">Todavía no hay accesos guardados.</td></tr>
            </tbody>
          </table>
        </div>
        <form class="ops-panel ops-form" @submit.prevent="submit" autocomplete="off">
          <h2>Nuevo acceso</h2>
          <label class="ops-field">
            <span>Cliente</span>
            <select v-model="form.client_id" required>
              <option disabled value="">Elige un cliente</option>
              <option v-for="client in clients" :key="client.id" :value="client.id">
                {{ client.company || client.name }}
              </option>
            </select>
          </label>
          <label class="ops-field">
            <span>Nombre</span>
            <input v-model="form.label" required maxlength="120" autocomplete="off" />
          </label>
          <label class="ops-field">
            <span>Proveedor</span>
            <select v-model="form.provider" required>
              <option v-for="provider in CREDENTIAL_PROVIDERS" :key="provider.id" :value="provider.id">
                {{ provider.label }}
              </option>
            </select>
          </label>
          <label class="ops-field">
            <span>Clave</span>
            <input
              v-model="form.secret"
              required
              type="password"
              autocomplete="new-password"
              spellcheck="false"
              data-testid="vault-secret"
            />
          </label>
          <div class="ops-actions">
            <AppButton type="submit" :loading="saving">Enviar a la bóveda</AppButton>
            <AppButton type="button" variant="secondary" @click="resetForm">Limpiar</AppButton>
          </div>
        </form>
      </div>
    </OpsState>
  </div>
</template>

<script setup>
import { onBeforeUnmount, reactive, ref } from 'vue'
import { CREDENTIAL_PROVIDERS, providerLabel } from '@/api/ops/contracts'
import { createCredential, deleteCredential, listClients, listCredentials, revealCredential } from '@/api/ops/client'
import { useToastStore } from '@/stores/toast'
import AppButton from '@/components/ui/AppButton.vue'
import MockNotice from '@/components/ops/MockNotice.vue'
import OpsState from '@/components/ops/OpsState.vue'

const toast = useToastStore()
const loading = ref(true)
const error = ref('')
const saving = ref(false)
const clients = ref([])
const entries = ref([])
const revealed = ref('')
const revealedId = ref('')
const form = reactive(blank())

function blank() {
  return { client_id: '', label: '', provider: 'otro', secret: '' }
}

function wipeSecret() {
  form.secret = ''
  revealed.value = ''
  revealedId.value = ''
}

function resetForm() {
  Object.assign(form, blank())
}

function clientName(id) {
  const client = clients.value.find((item) => item.id === id)
  return client?.company || client?.name || id
}

async function loadAll() {
  loading.value = true
  error.value = ''
  try {
    const clientRows = await listClients()
    clients.value = clientRows
    entries.value = await listCredentials(clientRows)
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

async function submit() {
  saving.value = true
  const secret = form.secret
  const payload = {
    provider: form.provider,
    label: form.label.trim(),
    secret,
  }
  const clientId = form.client_id
  try {
    await createCredential(clientId, payload)
    toast.success('Enviado a la bóveda. La clave ya no está en este formulario.')
    resetForm()
    await loadAll()
  } catch (err) {
    toast.error(err.message)
  } finally {
    saving.value = false
    wipeSecret()
  }
}

async function toggleSecret(entry) {
  if (revealedId.value === entry.id) {
    revealed.value = ''
    revealedId.value = ''
    return
  }
  revealed.value = ''
  revealedId.value = ''
  try {
    const secret = await revealCredential(entry.id)
    revealedId.value = entry.id
    revealed.value = typeof secret === 'string' ? secret : JSON.stringify(secret)
  } catch (err) {
    toast.error(err.message)
  }
}

async function remove(entry) {
  if (!window.confirm(`¿Borrar «${entry.label}»? La clave no se puede recuperar.`)) return
  if (revealedId.value === entry.id) wipeSecret()
  try {
    await deleteCredential(entry.id)
    toast.success('Acceso borrado.')
    await loadAll()
  } catch (err) {
    toast.error(err.message)
  }
}

loadAll()
onBeforeUnmount(wipeSecret)
</script>

<style lang="scss" scoped>
h2 { font-size: $text-xl; }
button.ops-link {
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;
  font: inherit;
}
</style>
