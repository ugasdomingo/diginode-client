<template>
  <div class="ops-page">
    <header class="ops-head">
      <div>
        <p class="ops-kicker">Bóveda</p>
        <h1 class="ops-title">Accesos de los clientes</h1>
        <p class="ops-lead">
          La clave se envía al servidor y se borra de este formulario. El navegador no la guarda.
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
                <th>Tipo</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="entry in entries" :key="entry.id" @click="edit(entry)">
                <td>
                  <strong>{{ entry.label }}</strong>
                  <div class="ops-card__meta">{{ entry.username || 'Sin usuario' }}</div>
                </td>
                <td>{{ clientName(entry.client_id) }}</td>
                <td>{{ vaultKindLabel(entry.kind) }}</td>
              </tr>
              <tr v-if="!entries.length"><td colspan="3">Todavía no hay accesos guardados.</td></tr>
            </tbody>
          </table>
        </div>
        <form class="ops-panel ops-form" @submit.prevent="submit" autocomplete="off">
          <h2>{{ editingId ? 'Actualizar acceso' : 'Nuevo acceso' }}</h2>
          <label class="ops-field">
            <span>Cliente</span>
            <select v-model="form.client_id" required>
              <option disabled value="">Elige un cliente</option>
              <option v-for="client in clients" :key="client.id" :value="client.id">{{ client.company }}</option>
            </select>
          </label>
          <label class="ops-field">
            <span>Nombre</span>
            <input v-model="form.label" required maxlength="120" autocomplete="off" />
          </label>
          <label class="ops-field">
            <span>Tipo</span>
            <select v-model="form.kind" required>
              <option v-for="kind in VAULT_KINDS" :key="kind.id" :value="kind.id">{{ kind.label }}</option>
            </select>
          </label>
          <label class="ops-field">
            <span>Usuario</span>
            <input v-model="form.username" maxlength="160" autocomplete="off" />
          </label>
          <label class="ops-field">
            <span>{{ editingId ? 'Nueva clave (vacío si no cambia)' : 'Clave' }}</span>
            <input
              v-model="form.secret"
              :required="!editingId"
              type="password"
              autocomplete="new-password"
              spellcheck="false"
              data-testid="vault-secret"
            />
          </label>
          <label class="ops-field">
            <span>Dirección</span>
            <input v-model="form.url" type="url" inputmode="url" autocomplete="off" />
          </label>
          <label class="ops-field">
            <span>Nota</span>
            <textarea v-model="form.notes" maxlength="500" />
          </label>
          <div class="ops-actions">
            <AppButton type="submit" :loading="saving">{{ editingId ? 'Guardar cambios' : 'Enviar a la bóveda' }}</AppButton>
            <AppButton type="button" variant="secondary" @click="resetForm">Limpiar</AppButton>
          </div>
        </form>
      </div>
    </OpsState>
  </div>
</template>

<script setup>
import { onBeforeUnmount, reactive, ref } from 'vue'
import { VAULT_KINDS, vaultKindLabel } from '@/api/ops/contracts'
import { createVaultEntry, listClients, listVault, updateVaultEntry } from '@/api/ops/client'
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
const editingId = ref('')
const form = reactive(blank())

function blank() {
  return { client_id: '', label: '', kind: 'instagram', username: '', secret: '', url: '', notes: '' }
}

function wipeSecret() {
  form.secret = ''
}

function resetForm() {
  const next = blank()
  Object.assign(form, next)
  editingId.value = ''
}

function edit(entry) {
  editingId.value = entry.id
  form.client_id = entry.client_id
  form.label = entry.label
  form.kind = entry.kind
  form.username = entry.username
  form.url = entry.url
  form.notes = entry.notes
  form.secret = ''
}

function clientName(id) {
  return clients.value.find((item) => item.id === id)?.company || id
}

async function loadAll() {
  loading.value = true
  error.value = ''
  try {
    const [clientRows, vaultRows] = await Promise.all([listClients(), listVault()])
    clients.value = clientRows
    entries.value = vaultRows
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

async function submit() {
  saving.value = true
  const payload = {
    client_id: form.client_id,
    label: form.label.trim(),
    kind: form.kind,
    username: form.username.trim(),
    url: form.url.trim(),
    notes: form.notes.trim(),
  }
  if (form.secret) payload.secret = form.secret
  try {
    if (editingId.value) await updateVaultEntry(editingId.value, payload)
    else await createVaultEntry(payload)
    wipeSecret()
    toast.success('Enviado a la bóveda. La clave ya no está en este formulario.')
    resetForm()
    await loadAll()
  } catch (err) {
    toast.error(err.message)
    wipeSecret()
  } finally {
    saving.value = false
    wipeSecret()
  }
}

loadAll()
onBeforeUnmount(wipeSecret)
</script>

<style lang="scss" scoped>
h2 { font-size: $text-xl; }
</style>
