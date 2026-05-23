<template>
  <div class="onboarding">

    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Configuración de tu oficina AI</h1>
        <p class="page-subtitle">
          Completá estos datos y prepararemos una instancia aislada para tus empleados digitales. Suele estar lista en 24-48 hs.
        </p>
      </div>
      <span v-if="officeStatusLabel" class="status-chip" :class="`status-chip--${officeStatusVariant}`">
        {{ officeStatusLabel }}
      </span>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="skeleton-block" />

    <template v-else>

      <!-- Already live -->
      <section v-if="officeStatus === 'live' && officeUrl" class="card card--success">
        <div class="card__icon">
          <Rocket :size="20" />
        </div>
        <div class="card__body">
          <h2 class="card__title">Tu oficina ya está activa</h2>
          <p class="card__desc">
            Podés entrar desde el botón de abajo o desde tu dashboard. Si querés cambiar materiales o configuración,
            actualizá los campos y guardá; el equipo de Diginode los aplicará en tu instancia.
          </p>
          <a :href="officeUrl" target="_blank" rel="noopener" class="btn btn--primary">
            Entrar a mi oficina <ExternalLink :size="14" />
          </a>
        </div>
      </section>

      <!-- Provisioning -->
      <section v-else-if="['requested', 'provisioning', 'training', 'review'].includes(officeStatus)" class="card card--info">
        <div class="card__icon">
          <Clock :size="20" />
        </div>
        <div class="card__body">
          <h2 class="card__title">{{ provisioningHeadline }}</h2>
          <p class="card__desc">
            Si necesitás ajustar los datos del formulario, hacelo abajo y guardá. Nos llega una alerta para revisarlo.
          </p>
        </div>
      </section>

      <!-- The form -->
      <form class="form" @submit.prevent="submit">

        <!-- 1. Negocio -->
        <section class="config-section">
          <h2 class="config-section__title">
            <Building2 :size="16" /> 1. Tu negocio
          </h2>
          <div class="field-grid">
            <div class="field-group">
              <label class="field-label">Nombre comercial *</label>
              <input v-model="form.business_name" type="text" class="field" placeholder="Ej: Estudio Lucia Diaz" required />
            </div>
            <div class="field-group">
              <label class="field-label">Sector / actividad</label>
              <input v-model="form.sector" type="text" class="field" placeholder="Ej: Clínica psicología, despacho legal..." />
            </div>
            <div class="field-group">
              <label class="field-label">Zona horaria</label>
              <select v-model="form.timezone" class="field">
                <option value="Europe/Madrid">Europe/Madrid (España)</option>
                <option value="Europe/London">Europe/London</option>
                <option value="America/Argentina/Buenos_Aires">America/Argentina/Buenos_Aires</option>
                <option value="America/Mexico_City">America/Mexico_City</option>
                <option value="America/New_York">America/New_York</option>
                <option value="America/Bogota">America/Bogota</option>
                <option value="America/Santiago">America/Santiago</option>
              </select>
            </div>
            <div class="field-group">
              <label class="field-label">Idioma de los empleados</label>
              <select v-model="form.locale" class="field">
                <option value="es-ES">Español (España)</option>
                <option value="es-AR">Español (Latam)</option>
                <option value="en-US">English (US)</option>
              </select>
            </div>
          </div>
        </section>

        <!-- 2. Slack -->
        <section class="config-section">
          <h2 class="config-section__title">
            <MessageSquare :size="16" /> 2. Slack (canal principal)
          </h2>
          <p class="config-section__hint">
            Tus empleados AI trabajan principalmente desde Slack. Si todavía no tenés workspace, podés saltar este paso —
            el equipo de Diginode te ayuda a crearlo durante el provisioning.
          </p>
          <div class="field-grid">
            <div class="field-group">
              <label class="field-label">Nombre del workspace</label>
              <input v-model="form.slack_workspace" type="text" class="field" placeholder="Ej: estudio-lucia.slack.com" />
            </div>
            <div class="field-group">
              <label class="field-label">Canal principal (#)</label>
              <input v-model="form.slack_default_channel" type="text" class="field" placeholder="Ej: #oficina-lucia" />
            </div>
            <div class="field-group field-group--wide">
              <label class="field-label">Bot Token (xoxb-...)</label>
              <input v-model="form.slack_bot_token" type="text" class="field" placeholder="xoxb-… (opcional, lo podés mandar después por canal seguro)" autocomplete="off" />
            </div>
            <div class="field-group field-group--wide">
              <label class="field-label">Signing Secret</label>
              <input v-model="form.slack_signing_secret" type="text" class="field" placeholder="32 caracteres hex (opcional)" autocomplete="off" />
            </div>
          </div>
        </section>

        <!-- 3. Materiales -->
        <section class="config-section">
          <h2 class="config-section__title">
            <FolderUp :size="16" /> 3. Materiales de aprendizaje
          </h2>
          <p class="config-section__hint">
            Compartí una carpeta con los documentos que querés que tus empleados aprendan: descripción del negocio,
            servicios, precios, FAQs, ejemplos de comunicación, manual de marca, audios, etc. Usá Google Drive, Dropbox o WeTransfer.
            <strong>Nunca subas información de pacientes/clientes finales</strong> sin consentimiento explícito.
          </p>
          <div class="field-group">
            <label class="field-label">Link de la carpeta compartida</label>
            <input v-model="form.materials_link" type="url" class="field" placeholder="https://drive.google.com/..." />
          </div>
        </section>

        <!-- 4. Notas -->
        <section class="config-section">
          <h2 class="config-section__title">
            <StickyNote :size="16" /> 4. Algo más que debamos saber
          </h2>
          <div class="field-group">
            <label class="field-label">Notas adicionales</label>
            <textarea v-model="form.additional_notes" class="field field--textarea" rows="4"
              placeholder="Restricciones, tono prohibido, herramientas que ya usás (Cal.com, Notion, etc.), prioridades..." />
          </div>
        </section>

        <!-- Submit -->
        <div class="actions">
          <button type="submit" class="btn btn--primary" :disabled="submitting || !form.business_name">
            <Save :size="16" />
            {{ form.submitted_at ? 'Actualizar formulario' : 'Enviar y avisar al equipo' }}
          </button>
          <p v-if="lastSavedText" class="actions__note">{{ lastSavedText }}</p>
          <p v-if="error" class="field-error">{{ error }}</p>
          <p v-if="success" class="field-success">{{ success }}</p>
        </div>
      </form>
    </template>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import {
  Rocket, Clock, ExternalLink, Building2, MessageSquare, FolderUp, StickyNote, Save,
} from 'lucide-vue-next'
import { useApi } from '@/composables/useApi'
import { useToastStore } from '@/stores/toast'

const api = useApi()
const toast = useToastStore()

const loading = ref(true)
const submitting = ref(false)
const error = ref('')
const success = ref('')

const officeStatus = ref('not_requested')
const officeUrl = ref(null)
const officePlan = ref(null)

const form = reactive({
  business_name: '',
  sector: '',
  timezone: 'Europe/Madrid',
  locale: 'es-ES',
  slack_workspace: '',
  slack_default_channel: '',
  slack_bot_token: '',
  slack_signing_secret: '',
  materials_link: '',
  additional_notes: '',
  submitted_at: null,
})

onMounted(async () => {
  try {
    const { data } = await api.get('/portal/onboarding')
    if (data?.form) {
      for (const key of Object.keys(form)) {
        if (data.form[key] !== undefined && data.form[key] !== null) form[key] = data.form[key]
      }
    }
    officeStatus.value = data?.office_status ?? 'not_requested'
    officeUrl.value = data?.office_url ?? null
    officePlan.value = data?.office_plan ?? null
  } catch (err) {
    toast.error(err?.message ?? 'No se pudo cargar el onboarding.')
  } finally {
    loading.value = false
  }
})

async function submit() {
  submitting.value = true
  error.value = ''
  success.value = ''
  try {
    const { data } = await api.post('/portal/onboarding', { ...form })
    if (data?.form?.submitted_at) form.submitted_at = data.form.submitted_at
    success.value = 'Formulario guardado. Te avisamos cuando tu oficina esté lista.'
    toast.success('Formulario enviado')
  } catch (err) {
    error.value = err?.message ?? 'No se pudo guardar el formulario.'
  } finally {
    submitting.value = false
  }
}

const officeStatusLabel = computed(() => ({
  not_requested: null,
  requested: 'Solicitada',
  provisioning: 'Provisionando',
  training: 'Entrenando',
  review: 'En revisión',
  live: 'Activa',
  paused: 'Pausada',
  error: 'Con incidencia',
}[officeStatus.value]))

const officeStatusVariant = computed(() => ({
  live: 'success',
  requested: 'info',
  provisioning: 'warning',
  training: 'warning',
  review: 'warning',
  error: 'danger',
  paused: 'warning',
}[officeStatus.value] ?? 'info'))

const provisioningHeadline = computed(() => ({
  requested: 'Recibimos tu pago, estamos por empezar.',
  provisioning: 'Estamos creando tu instancia aislada.',
  training: 'Entrenando a tus empleados con los materiales que enviaste.',
  review: 'Revisión humana en curso antes de activar.',
}[officeStatus.value] ?? 'Tu oficina está en preparación.'))

const lastSavedText = computed(() => {
  if (!form.submitted_at) return ''
  const d = new Date(form.submitted_at)
  return `Última actualización: ${d.toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })}`
})
</script>

<style lang="scss" scoped>
.onboarding {
  display: flex;
  flex-direction: column;
  gap: $space-6;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: $space-4;
}

.status-chip {
  font-size: $text-xs;
  font-weight: $fw-semibold;
  padding: $space-1 $space-3;
  border-radius: $radius-full;
  white-space: nowrap;
  align-self: flex-start;

  &--success { background: $success-bg; color: $success; }
  &--info    { background: $info-bg;    color: $info; }
  &--warning { background: $warning-bg; color: $warning; }
  &--danger  { background: $danger-bg;  color: $danger; }
}

.skeleton-block {
  height: 200px;
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius-lg;
  animation: shimmer 1.5s infinite;
}

.card {
  display: flex;
  gap: $space-4;
  padding: $space-5;
  border-radius: $radius-lg;
  background: $bg-card;
  border: 1px solid $border;

  &--success { border-color: rgba(156, 255, 203, 0.25); }
  &--info    { border-color: rgba(143, 179, 255, 0.22); }

  &__icon {
    width: 44px;
    height: 44px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: $radius;
    background: $primary-subtle;
    color: $primary;
  }

  &__title { font-size: $text-lg; font-weight: $fw-semibold; margin-bottom: $space-1; }
  &__desc  { font-size: $text-sm; color: $text-muted; line-height: 1.5; margin-bottom: $space-3; }
}

.form {
  display: flex;
  flex-direction: column;
  gap: $space-5;
}

.config-section {
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius-lg;
  padding: $space-5;
  display: flex;
  flex-direction: column;
  gap: $space-4;

  &__title {
    display: flex;
    align-items: center;
    gap: $space-2;
    font-size: $text-base;
    font-weight: $fw-semibold;
    color: $text;
  }

  &__hint {
    font-size: $text-sm;
    color: $text-muted;
    line-height: 1.5;
  }
}

.field-grid {
  display: grid;
  gap: $space-4;

  @media (min-width: $bp-md) {
    grid-template-columns: 1fr 1fr;
  }
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: $space-2;

  &--wide { grid-column: 1 / -1; }
}

.field-label {
  font-size: $text-xs;
  font-weight: $fw-medium;
  color: $text-muted;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.field {
  width: 100%;
  background: $bg-input;
  border: 1px solid $border;
  border-radius: $radius;
  color: $text;
  font-family: $font-sans;
  font-size: $text-sm;
  padding: 0 $space-3;
  height: 40px;
  outline: none;
  box-sizing: border-box;

  &::placeholder { color: $text-subtle; }
  &:focus {
    border-color: $border-focus;
    box-shadow: 0 0 0 3px $primary-glow;
  }

  &--textarea {
    height: auto;
    padding: $space-3;
    resize: vertical;
    line-height: 1.5;
  }
}

.actions {
  display: flex;
  flex-direction: column;
  gap: $space-2;
  align-items: flex-start;

  &__note {
    font-size: $text-xs;
    color: $text-subtle;
  }
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: $space-2;
  padding: 0 $space-4;
  height: 40px;
  border-radius: $radius;
  font-size: $text-sm;
  font-weight: $fw-semibold;
  text-decoration: none;
  cursor: pointer;
  border: 1px solid transparent;
  background: $bg-card;
  color: $text;

  &--primary {
    background: $primary;
    color: #0b1020;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.field-error   { font-size: $text-xs; color: $danger; }
.field-success { font-size: $text-xs; color: $success; }

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
