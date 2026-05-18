<template>
  <div class="onboarding">

    <!-- ── Header ──────────────────────────────────────────────── -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Configuración de empleados AI</h1>
        <p class="page-subtitle">Sigue los pasos para activar tus empleados digitales</p>
      </div>
      <span class="progress-chip">
        {{ completedCount }} / {{ steps.length }} completados
      </span>
    </div>

    <!-- ── Stepper ─────────────────────────────────────────────── -->
    <div class="stepper">
      <button
        v-for="(step, i) in steps"
        :key="step.id"
        class="stepper__item"
        :class="{
          'stepper__item--active':    currentStep === i,
          'stepper__item--done':      step.done,
          'stepper__item--clickable': step.done || i <= maxVisitedStep,
        }"
        @click="step.done || i <= maxVisitedStep ? (currentStep = i) : null"
      >
        <span class="stepper__dot">
          <Check v-if="step.done" :size="12" />
          <span v-else class="stepper__num">{{ i + 1 }}</span>
        </span>
        <span class="stepper__label">{{ step.title }}</span>
        <span v-if="i < steps.length - 1" class="stepper__line" />
      </button>
    </div>

    <!-- ── Step content ────────────────────────────────────────── -->
    <div class="step-body">

      <!-- Step 1 — Google Calendar -->
      <template v-if="currentStep === 0">
        <div class="step-header">
          <div class="step-header__icon step-header__icon--purple"><Calendar :size="20" /></div>
          <div>
            <h2 class="step-header__title">Conectar Google Calendar</h2>
            <p class="step-header__desc">La Recepcionista usará tu calendario para gestionar citas automáticamente.</p>
          </div>
        </div>

        <div v-if="status.google_calendar_connected" class="status-banner status-banner--success">
          <CheckCircle2 :size="18" />
          <span>Google Calendar conectado correctamente.</span>
        </div>
        <div v-else class="status-banner status-banner--warning">
          <AlertCircle :size="18" />
          <span>Google Calendar no está conectado aún.</span>
        </div>

        <div class="info-card">
          <ul class="info-list">
            <li>Se creará una conexión OAuth con tu cuenta de Google.</li>
            <li>Solo se accede a la agenda de citas — nunca a correos ni otros datos.</li>
            <li>Puedes revocar el acceso desde tu cuenta de Google en cualquier momento.</li>
          </ul>
        </div>

        <AppButton
          v-if="!status.google_calendar_connected"
          :loading="loadingGoogle"
          @click="connectGoogle"
        >
          <CalendarPlus :size="16" /> Conectar Google Calendar
        </AppButton>
        <AppButton v-else variant="secondary" @click="connectGoogle">
          <RefreshCw :size="16" /> Reconectar calendario
        </AppButton>
      </template>

      <!-- Step 2 — WhatsApp -->
      <template v-if="currentStep === 1">
        <div class="step-header">
          <div class="step-header__icon step-header__icon--green"><MessageCircle :size="20" /></div>
          <div>
            <h2 class="step-header__title">WhatsApp Business</h2>
            <p class="step-header__desc">Tu número de WhatsApp Business es el canal principal de la Recepcionista con los clientes.</p>
          </div>
        </div>

        <div v-if="status.whatsapp_configured" class="status-banner status-banner--success">
          <CheckCircle2 :size="18" />
          <span>WhatsApp configurado. Número activo.</span>
        </div>
        <div v-else class="status-banner status-banner--info">
          <Info :size="18" />
          <span>Configuración gestionada por el equipo de Diginode. Contacta con soporte si no está activo.</span>
        </div>

        <div class="info-card">
          <p class="info-card__title">¿Cómo funciona?</p>
          <ul class="info-list">
            <li>Usamos la <strong>Meta WhatsApp Cloud API</strong> directamente — sin servicios intermediarios.</li>
            <li>Tu número de WhatsApp Business queda vinculado a tu cuenta de Diginode.</li>
            <li>El equipo de Diginode configura las credenciales en tu nombre al activar el plan.</li>
          </ul>
        </div>

        <div class="info-card">
          <p class="info-card__title">Requisitos previos</p>
          <ul class="info-list">
            <li>Cuenta de <strong>Meta Business Manager</strong> verificada.</li>
            <li>Número de teléfono dedicado (no puede estar ya registrado en WhatsApp personal).</li>
            <li>Política de privacidad publicada en tu web.</li>
          </ul>
          <a
            href="https://developers.facebook.com/docs/whatsapp/cloud-api/get-started"
            target="_blank"
            rel="noopener"
            class="doc-link"
          >
            <ExternalLink :size="14" /> Ver documentación oficial de Meta
          </a>
        </div>
      </template>

      <!-- Step 3 — Telegram Bots -->
      <template v-if="currentStep === 2">
        <div class="step-header">
          <div class="step-header__icon step-header__icon--blue"><Bot :size="20" /></div>
          <div>
            <h2 class="step-header__title">Bots de Telegram</h2>
            <p class="step-header__desc">Cada empleado AI tiene su propio bot de Telegram para comunicarse contigo directamente.</p>
          </div>
        </div>

        <div class="info-card info-card--subtle">
          <p class="info-card__title">¿Cómo crear un bot?</p>
          <ol class="info-list info-list--ordered">
            <li>Abre Telegram y busca <strong>@BotFather</strong>.</li>
            <li>Envía <code>/newbot</code> y sigue las instrucciones.</li>
            <li>Copia el token que te proporciona y pégalo aquí.</li>
          </ol>
        </div>

        <div class="bot-grid">
          <div v-for="bot in botSetups" :key="bot.employee" class="bot-card">
            <div class="bot-card__header">
              <div class="bot-card__icon" :class="`bot-card__icon--${bot.color}`">
                <component :is="bot.icon" :size="18" />
              </div>
              <div>
                <h3 class="bot-card__name">{{ bot.label }}</h3>
                <p class="bot-card__desc">{{ bot.desc }}</p>
              </div>
              <span
                class="bot-card__status"
                :class="status[bot.statusKey] ? 'bot-card__status--ok' : 'bot-card__status--off'"
              >
                {{ status[bot.statusKey] ? 'Activo' : 'Pendiente' }}
              </span>
            </div>
            <div class="bot-card__form">
              <input
                v-model="botTokens[bot.employee]"
                type="text"
                class="field"
                :placeholder="`Token del bot de ${bot.label}...`"
                :disabled="loadingBots[bot.employee]"
              />
              <AppButton
                size="sm"
                :loading="loadingBots[bot.employee]"
                :disabled="!botTokens[bot.employee]"
                @click="setupBot(bot.employee)"
              >
                Configurar
              </AppButton>
            </div>
            <p v-if="botErrors[bot.employee]" class="field-error">{{ botErrors[bot.employee] }}</p>
            <p v-if="botSuccess[bot.employee]" class="field-success">{{ botSuccess[bot.employee] }}</p>
          </div>
        </div>
      </template>

      <!-- Step 4 — Personality -->
      <template v-if="currentStep === 3">
        <div class="step-header">
          <div class="step-header__icon step-header__icon--amber"><Sparkles :size="20" /></div>
          <div>
            <h2 class="step-header__title">Personalidad de los empleados</h2>
            <p class="step-header__desc">Define cómo se presenta y comunica cada empleado AI en tu nombre.</p>
          </div>
        </div>

        <!-- Recepcionista -->
        <div class="config-section">
          <h3 class="config-section__title">
            <UserRound :size="16" /> Recepcionista
          </h3>
          <div class="field-row">
            <div class="field-group">
              <label class="field-label">Nombre del empleado</label>
              <input v-model="cfg.recepcionista.employee_name" class="field" placeholder="Ej: Sofía" />
            </div>
            <div class="field-group">
              <label class="field-label">Tono de comunicación</label>
              <input v-model="cfg.recepcionista.tone" class="field" placeholder="Ej: profesional y cercano" />
            </div>
          </div>
          <div class="field-group">
            <label class="field-label">Servicios y tarifas</label>
            <textarea v-model="cfg.recepcionista.services" class="field field--textarea" rows="3" placeholder="Lista de servicios con descripción y precio..." />
          </div>
          <div class="field-group">
            <label class="field-label">Preguntas frecuentes (FAQs)</label>
            <textarea v-model="cfg.recepcionista.faqs" class="field field--textarea" rows="3" placeholder="Preguntas habituales y sus respuestas..." />
          </div>
          <div class="field-group">
            <label class="field-label">Descripción del horario (texto libre)</label>
            <input v-model="cfg.recepcionista.schedule" class="field" placeholder="Ej: Lunes a viernes de 9:00 a 19:00" />
          </div>
        </div>

        <!-- Asistente Ejecutivo -->
        <div class="config-section">
          <h3 class="config-section__title">
            <BriefcaseBusiness :size="16" /> Asistente Ejecutivo
          </h3>
          <div class="field-row">
            <div class="field-group">
              <label class="field-label">Nombre del empleado</label>
              <input v-model="cfg.asistente.employee_name" class="field" placeholder="Ej: Alex" />
            </div>
            <div class="field-group">
              <label class="field-label">Estilo de escritura</label>
              <input v-model="cfg.asistente.writing_style" class="field" placeholder="Ej: profesional y conciso" />
            </div>
          </div>
          <div class="field-group">
            <label class="field-label">Contexto del negocio y metodología</label>
            <textarea v-model="cfg.asistente.methodology" class="field field--textarea" rows="3" placeholder="Describe cómo trabajas, qué tipo de consultas atiendes, tu metodología..." />
          </div>
        </div>

        <!-- Gestor de Relaciones -->
        <div class="config-section">
          <h3 class="config-section__title">
            <Heart :size="16" /> Gestor de Relaciones
          </h3>
          <div class="field-row">
            <div class="field-group">
              <label class="field-label">Nombre del empleado</label>
              <input v-model="cfg.gestor_relaciones.employee_name" class="field" placeholder="Ej: Luna" />
            </div>
            <div class="field-group">
              <label class="field-label">Tono de seguimiento</label>
              <input v-model="cfg.gestor_relaciones.followup_tone" class="field" placeholder="Ej: cálido y empático" />
            </div>
          </div>
          <div class="field-group">
            <label class="field-label">Metodología terapéutica / de trabajo</label>
            <textarea v-model="cfg.gestor_relaciones.methodology" class="field field--textarea" rows="3" placeholder="Ej: Terapia cognitivo-conductual con enfoque sistémico..." />
          </div>
          <div class="field-group">
            <label class="field-label">Plantilla de objetivos por sesión</label>
            <textarea v-model="cfg.gestor_relaciones.session_goals_template" class="field field--textarea" rows="2" placeholder="Ej: Objetivo, avances desde la última sesión, tareas para casa..." />
          </div>
        </div>

        <!-- Content Manager -->
        <div class="config-section">
          <h3 class="config-section__title">
            <Clapperboard :size="16" /> Content Manager
          </h3>
          <div class="field-row">
            <div class="field-group">
              <label class="field-label">Nombre del empleado</label>
              <input v-model="cfg.content_manager.employee_name" class="field" placeholder="Ej: Marcos" />
            </div>
            <div class="field-group">
              <label class="field-label">Voz de marca</label>
              <input v-model="cfg.content_manager.brand_voice" class="field" placeholder="Ej: cercano, experto, sin jerga clínica" />
            </div>
          </div>
          <div class="field-group">
            <label class="field-label">Pilares de contenido</label>
            <textarea v-model="cfg.content_manager.content_pillars" class="field field--textarea" rows="2" placeholder="Ej: Educación sobre ansiedad, casos de éxito, bienestar mental..." />
          </div>
          <div class="field-group">
            <label class="field-label">Audiencia objetivo</label>
            <input v-model="cfg.content_manager.target_audience" class="field" placeholder="Ej: Adultos 25–45 con estrés laboral en España" />
          </div>
        </div>

        <div class="step-actions">
          <AppButton :loading="savingConfig" @click="saveConfig">
            <Save :size="16" /> Guardar configuración
          </AppButton>
          <p v-if="configSaved" class="field-success">Configuración guardada correctamente.</p>
          <p v-if="configError" class="field-error">{{ configError }}</p>
        </div>
      </template>

      <!-- Step 5 — Schedule -->
      <template v-if="currentStep === 4">
        <div class="step-header">
          <div class="step-header__icon step-header__icon--teal"><Clock :size="20" /></div>
          <div>
            <h2 class="step-header__title">Horario y citas</h2>
            <p class="step-header__desc">Define cuándo trabajas para que la Recepcionista solo ofrezca huecos disponibles.</p>
          </div>
        </div>

        <div class="config-section">
          <div class="field-row">
            <div class="field-group">
              <label class="field-label">Hora de inicio</label>
              <input v-model="cfg.working_hours_start" type="time" class="field" />
            </div>
            <div class="field-group">
              <label class="field-label">Hora de fin</label>
              <input v-model="cfg.working_hours_end" type="time" class="field" />
            </div>
            <div class="field-group">
              <label class="field-label">Duración de cita (min)</label>
              <select v-model.number="cfg.appointment_duration_min" class="field">
                <option :value="30">30 min</option>
                <option :value="45">45 min</option>
                <option :value="60">60 min</option>
                <option :value="90">90 min</option>
                <option :value="120">120 min</option>
              </select>
            </div>
          </div>

          <div class="field-group">
            <label class="field-label">Días libres (sin trabajo)</label>
            <div class="days-grid">
              <label v-for="day in weekDays" :key="day.value" class="day-check">
                <input
                  type="checkbox"
                  :value="day.value"
                  :checked="cfg.days_off.includes(day.value)"
                  @change="toggleDayOff(day.value)"
                />
                <span class="day-check__label">{{ day.label }}</span>
              </label>
            </div>
          </div>
        </div>

        <div class="step-actions">
          <AppButton :loading="savingConfig" @click="saveConfig">
            <Save :size="16" /> Guardar horario
          </AppButton>
          <p v-if="configSaved" class="field-success">Horario guardado correctamente.</p>
          <p v-if="configError" class="field-error">{{ configError }}</p>
        </div>
      </template>

      <!-- Step 6 — Review & Activate -->
      <template v-if="currentStep === 5">
        <div class="step-header">
          <div class="step-header__icon step-header__icon--green"><Rocket :size="20" /></div>
          <div>
            <h2 class="step-header__title">Revisión y activación</h2>
            <p class="step-header__desc">Comprueba el estado de cada componente antes de activar tus empleados AI.</p>
          </div>
        </div>

        <div class="checklist">
          <div v-for="item in reviewChecklist" :key="item.label" class="checklist__item">
            <span class="checklist__icon" :class="item.done ? 'checklist__icon--ok' : 'checklist__icon--pending'">
              <Check v-if="item.done" :size="14" />
              <Minus v-else :size="14" />
            </span>
            <span class="checklist__label">{{ item.label }}</span>
            <span class="checklist__state" :class="item.done ? 'checklist__state--ok' : 'checklist__state--pending'">
              {{ item.done ? 'Listo' : 'Pendiente' }}
            </span>
          </div>
        </div>

        <div v-if="allCriticalDone" class="ready-banner">
          <Rocket :size="20" />
          <div>
            <strong>¡Todo listo para activar!</strong>
            <p>Tus empleados AI están configurados y listos para trabajar.</p>
          </div>
        </div>
        <div v-else class="info-card info-card--warning">
          <AlertCircle :size="18" />
          <p>Algunos pasos críticos están pendientes. Puedes activar igualmente, pero los empleados sin configuración completa no funcionarán hasta que termines su configuración.</p>
        </div>

        <div class="step-actions step-actions--activate">
          <AppButton size="lg" :disabled="false" @click="goToPortal">
            <Rocket :size="18" /> Ir a mi portal
          </AppButton>
          <p class="step-actions__note">Los empleados se activarán automáticamente cuando sus bots estén conectados y las credenciales configuradas.</p>
        </div>
      </template>

    </div><!-- /.step-body -->

    <!-- ── Navigation ──────────────────────────────────────────── -->
    <div class="step-nav">
      <AppButton
        v-if="currentStep > 0"
        variant="secondary"
        @click="currentStep--"
      >
        <ChevronLeft :size="16" /> Anterior
      </AppButton>
      <span />
      <AppButton
        v-if="currentStep < steps.length - 1"
        @click="goNext"
      >
        Siguiente <ChevronRight :size="16" />
      </AppButton>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Calendar, CalendarPlus, MessageCircle, Bot, Sparkles, Clock, Rocket,
  Check, CheckCircle2, AlertCircle, Info, ExternalLink, ChevronLeft,
  ChevronRight, RefreshCw, Save, UserRound, BriefcaseBusiness, Heart,
  Clapperboard, Minus,
} from 'lucide-vue-next'
import { useApi } from '@/composables/useApi'
import { useToastStore } from '@/stores/toast'
import AppButton from '@/components/ui/AppButton.vue'

const api    = useApi()
const toast  = useToastStore()
const router = useRouter()

// ── State ────────────────────────────────────────────────────────
const currentStep    = ref(0)
const maxVisitedStep = ref(0)
const loadingGoogle  = ref(false)
const savingConfig   = ref(false)
const configSaved    = ref(false)
const configError    = ref('')

const botTokens  = reactive({ recepcionista: '', asistente: '', 'gestor-relaciones': '', 'content-manager': '' })
const loadingBots = reactive({ recepcionista: false, asistente: false, 'gestor-relaciones': false, 'content-manager': false })
const botErrors   = reactive({ recepcionista: '', asistente: '', 'gestor-relaciones': '', 'content-manager': '' })
const botSuccess  = reactive({ recepcionista: '', asistente: '', 'gestor-relaciones': '', 'content-manager': '' })

const status = reactive({
  google_calendar_connected:        false,
  whatsapp_configured:              false,
  recepcionista_telegram_connected: false,
  asistente_telegram_connected:     false,
  gestor_telegram_connected:        false,
  content_manager_telegram_connected: false,
  config_complete:                  false,
  schedule_complete:                false,
})

const cfg = reactive({
  recepcionista: {
    employee_name: '', tone: '', services: '', faqs: '', schedule: '',
  },
  asistente: {
    employee_name: '', writing_style: '', methodology: '',
  },
  gestor_relaciones: {
    employee_name: '', followup_tone: '', methodology: '', session_goals_template: '',
  },
  content_manager: {
    employee_name: '', brand_voice: '', content_pillars: '', target_audience: '',
  },
  working_hours_start:      '09:00',
  working_hours_end:        '19:00',
  appointment_duration_min: 60,
  days_off:                 [0, 6],
})

// ── Steps definition ──────────────────────────────────────────────
const steps = computed(() => [
  { id: 'google',      title: 'Google Calendar', done: status.google_calendar_connected },
  { id: 'whatsapp',    title: 'WhatsApp',         done: status.whatsapp_configured },
  { id: 'telegram',    title: 'Telegram Bots',    done: status.recepcionista_telegram_connected && status.asistente_telegram_connected },
  { id: 'personality', title: 'Personalidad',     done: status.config_complete },
  { id: 'schedule',    title: 'Horario',           done: status.schedule_complete },
  { id: 'activacion',  title: 'Activación',        done: false },
])

const completedCount = computed(() => steps.value.filter(s => s.done).length)

// ── Bot setup list ────────────────────────────────────────────────
const botSetups = [
  { employee: 'recepcionista',    label: 'Recepcionista',     desc: 'Atiende WhatsApp/Telegram de clientes', color: 'purple', icon: UserRound,        statusKey: 'recepcionista_telegram_connected' },
  { employee: 'asistente',        label: 'Asistente Ejecutivo', desc: 'Tu asistente personal',              color: 'blue',   icon: BriefcaseBusiness, statusKey: 'asistente_telegram_connected' },
  { employee: 'gestor-relaciones', label: 'Gestor de Relaciones', desc: 'Segundo Cerebro clínico',          color: 'teal',   icon: Heart,             statusKey: 'gestor_telegram_connected' },
  { employee: 'content-manager',  label: 'Content Manager',   desc: 'Creación de contenido AI',            color: 'amber',  icon: Clapperboard,      statusKey: 'content_manager_telegram_connected' },
]

// ── Week days ─────────────────────────────────────────────────────
const weekDays = [
  { value: 1, label: 'Lun' }, { value: 2, label: 'Mar' }, { value: 3, label: 'Mié' },
  { value: 4, label: 'Jue' }, { value: 5, label: 'Vie' }, { value: 6, label: 'Sáb' },
  { value: 0, label: 'Dom' },
]

// ── Review checklist ──────────────────────────────────────────────
const reviewChecklist = computed(() => [
  { label: 'Google Calendar conectado',              done: status.google_calendar_connected },
  { label: 'WhatsApp Business configurado',          done: status.whatsapp_configured },
  { label: 'Bot de Recepcionista activo',            done: status.recepcionista_telegram_connected },
  { label: 'Bot de Asistente activo',                done: status.asistente_telegram_connected },
  { label: 'Bot del Gestor de Relaciones activo',    done: status.gestor_telegram_connected },
  { label: 'Bot del Content Manager activo',         done: status.content_manager_telegram_connected },
  { label: 'Personalidad de empleados configurada',  done: status.config_complete },
  { label: 'Horario y duración de citas definidos',  done: status.schedule_complete },
])

const allCriticalDone = computed(() =>
  status.google_calendar_connected &&
  status.recepcionista_telegram_connected &&
  status.config_complete &&
  status.schedule_complete
)

// ── Lifecycle ─────────────────────────────────────────────────────
onMounted(async () => {
  await Promise.all([loadStatus(), loadConfig()])
})

// ── Methods ───────────────────────────────────────────────────────

async function loadStatus() {
  try {
    const data = await api.get('/onboarding/status')
    Object.assign(status, data)
  } catch {
    // non-critical — wizard still usable without status
  }
}

async function loadConfig() {
  try {
    const data = await api.get('/onboarding/config')
    if (data.recepcionista)    Object.assign(cfg.recepcionista,    data.recepcionista)
    if (data.asistente)        Object.assign(cfg.asistente,        data.asistente)
    if (data.gestor_relaciones) Object.assign(cfg.gestor_relaciones, data.gestor_relaciones)
    if (data.content_manager)  Object.assign(cfg.content_manager,  data.content_manager)
    if (data.working_hours_start)      cfg.working_hours_start      = data.working_hours_start
    if (data.working_hours_end)        cfg.working_hours_end        = data.working_hours_end
    if (data.appointment_duration_min) cfg.appointment_duration_min = data.appointment_duration_min
    if (data.days_off)                 cfg.days_off                 = data.days_off
  } catch {
    // non-critical
  }
}

async function connectGoogle() {
  loadingGoogle.value = true
  try {
    const data = await api.get('/onboarding/google/auth-url')
    if (data.url) window.location.href = data.url
  } catch (err) {
    toast.error(err.message ?? 'No se pudo obtener el enlace de Google.')
  } finally {
    loadingGoogle.value = false
  }
}

async function setupBot(employee) {
  const token = botTokens[employee]?.trim()
  if (!token) return

  loadingBots[employee] = true
  botErrors[employee]   = ''
  botSuccess[employee]  = ''

  try {
    await api.post('/onboarding/telegram/setup', { bot_token: token, employee })
    botSuccess[employee] = '✓ Bot configurado y webhook registrado.'
    await loadStatus()
  } catch (err) {
    botErrors[employee] = err.message ?? 'Error al configurar el bot.'
  } finally {
    loadingBots[employee] = false
  }
}

async function saveConfig() {
  savingConfig.value = true
  configSaved.value  = false
  configError.value  = ''

  try {
    await api.patch('/onboarding/config', {
      recepcionista:    cfg.recepcionista,
      asistente:        cfg.asistente,
      gestor_relaciones: cfg.gestor_relaciones,
      content_manager:  cfg.content_manager,
      working_hours_start:      cfg.working_hours_start,
      working_hours_end:        cfg.working_hours_end,
      appointment_duration_min: cfg.appointment_duration_min,
      days_off:                 cfg.days_off,
    })
    configSaved.value = true
    await loadStatus()
    setTimeout(() => { configSaved.value = false }, 3000)
  } catch (err) {
    configError.value = err.message ?? 'Error al guardar la configuración.'
  } finally {
    savingConfig.value = false
  }
}

function toggleDayOff(dayValue) {
  const idx = cfg.days_off.indexOf(dayValue)
  if (idx >= 0) cfg.days_off.splice(idx, 1)
  else           cfg.days_off.push(dayValue)
}

function goNext() {
  if (currentStep.value < steps.value.length - 1) {
    currentStep.value++
    if (currentStep.value > maxVisitedStep.value) {
      maxVisitedStep.value = currentStep.value
    }
  }
}

function goToPortal() {
  router.push('/portal/dashboard')
}
</script>

<style lang="scss" scoped>
.onboarding {
  display: flex;
  flex-direction: column;
  gap: $space-6;
}

// ── Header ─────────────────────────────────────────────────────────
.progress-chip {
  font-size: $text-sm;
  font-weight: $fw-semibold;
  color: $primary-light;
  background: $primary-subtle;
  border: 1px solid rgba(124, 111, 255, 0.2);
  border-radius: $radius-full;
  padding: $space-1 $space-4;
  white-space: nowrap;
  align-self: flex-start;
}

// ── Stepper ────────────────────────────────────────────────────────
.stepper {
  display: flex;
  align-items: flex-start;
  gap: 0;
  overflow-x: auto;
  padding-bottom: $space-1;

  &::-webkit-scrollbar { height: 0; }

  &__item {
    display: flex;
    align-items: center;
    flex: 1;
    background: none;
    border: none;
    cursor: default;
    padding: 0;
    gap: 0;
    position: relative;
    min-width: 0;

    &--clickable { cursor: pointer; }

    &:hover.stepper__item--clickable .stepper__dot {
      border-color: $primary;
    }
  }

  &__dot {
    width: 28px;
    height: 28px;
    border-radius: $radius-full;
    border: 2px solid $border;
    background: $bg-card;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: $transition-fast;
    z-index: 1;

    .stepper__item--active &  {
      border-color: $primary;
      background: $primary-subtle;
      color: $primary;
    }
    .stepper__item--done &    {
      border-color: $accent;
      background: $accent-glow;
      color: $accent;
    }
  }

  &__num {
    font-size: $text-xs;
    font-weight: $fw-semibold;
    color: $text-muted;

    .stepper__item--active & { color: $primary; }
  }

  &__label {
    display: none;
    font-size: $text-xs;
    font-weight: $fw-medium;
    color: $text-muted;
    margin-left: $space-2;
    white-space: nowrap;

    .stepper__item--active & { color: $text; }
    .stepper__item--done &   { color: $accent; }

    @media (min-width: $bp-md) { display: block; }
  }

  &__line {
    flex: 1;
    height: 2px;
    background: $border;
    margin: 0 $space-2;
    min-width: $space-4;

    .stepper__item--done + .stepper__item .stepper__dot { border-color: $accent; }
  }
}

// ── Step body ──────────────────────────────────────────────────────
.step-body {
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius-lg;
  padding: $space-6;
  display: flex;
  flex-direction: column;
  gap: $space-6;

  @media (min-width: $bp-md) { padding: $space-8; }
}

// ── Step header ────────────────────────────────────────────────────
.step-header {
  display: flex;
  align-items: flex-start;
  gap: $space-4;

  &__icon {
    width: 44px;
    height: 44px;
    border-radius: $radius;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    &--purple { background: $primary-subtle; color: $primary; }
    &--green  { background: $success-bg;     color: $success; }
    &--blue   { background: $info-bg;         color: $info; }
    &--amber  { background: $warning-bg;      color: $warning; }
    &--teal   { background: $accent-glow;     color: $accent; }
  }

  &__title {
    font-size: $text-xl;
    font-weight: $fw-semibold;
    color: $text;
    margin-bottom: $space-1;
  }

  &__desc {
    font-size: $text-sm;
    color: $text-muted;
    line-height: 1.5;
  }
}

// ── Status banners ─────────────────────────────────────────────────
.status-banner {
  display: flex;
  align-items: center;
  gap: $space-3;
  padding: $space-3 $space-4;
  border-radius: $radius;
  font-size: $text-sm;
  font-weight: $fw-medium;

  &--success { background: $success-bg;  color: $success; border: 1px solid rgba(52, 211, 153, 0.2); }
  &--warning { background: $warning-bg;  color: $warning; border: 1px solid rgba(245, 158, 11, 0.2); }
  &--info    { background: $info-bg;     color: $info;    border: 1px solid rgba(129, 140, 248, 0.2); }
}

// ── Info cards ─────────────────────────────────────────────────────
.info-card {
  background: $bg-card-2;
  border: 1px solid $border;
  border-radius: $radius;
  padding: $space-4;
  display: flex;
  flex-direction: column;
  gap: $space-3;

  &--subtle  { background: rgba(124, 111, 255, 0.04); }
  &--warning { flex-direction: row; gap: $space-3; align-items: flex-start; color: $warning; }

  &__title {
    font-size: $text-sm;
    font-weight: $fw-semibold;
    color: $text;
  }
}

.info-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: $space-2;

  li {
    font-size: $text-sm;
    color: $text-muted;
    padding-left: $space-4;
    position: relative;

    &::before {
      content: '·';
      position: absolute;
      left: $space-1;
      color: $primary-light;
      font-weight: $fw-bold;
    }
  }

  &--ordered {
    counter-reset: item;
    li {
      counter-increment: item;
      &::before { content: counter(item) '.'; font-weight: $fw-medium; color: $primary; }
    }
  }
}

code {
  font-family: $font-mono;
  font-size: $text-xs;
  background: $primary-subtle;
  color: $primary-light;
  padding: 2px $space-2;
  border-radius: $radius-sm;
}

.doc-link {
  display: inline-flex;
  align-items: center;
  gap: $space-2;
  font-size: $text-sm;
  color: $primary-light;
  text-decoration: none;

  &:hover { color: $primary; text-decoration: underline; }
}

// ── Bot grid ───────────────────────────────────────────────────────
.bot-grid {
  display: grid;
  gap: $space-4;

  @media (min-width: $bp-md) { grid-template-columns: 1fr 1fr; }
}

.bot-card {
  background: $bg-card-2;
  border: 1px solid $border;
  border-radius: $radius;
  padding: $space-4;
  display: flex;
  flex-direction: column;
  gap: $space-3;

  &__header {
    display: flex;
    align-items: flex-start;
    gap: $space-3;
  }

  &__icon {
    width: 36px;
    height: 36px;
    border-radius: $radius-sm;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    &--purple { background: $primary-subtle; color: $primary; }
    &--blue   { background: $info-bg;         color: $info; }
    &--teal   { background: $accent-glow;     color: $accent; }
    &--amber  { background: $warning-bg;      color: $warning; }
  }

  &__name {
    font-size: $text-sm;
    font-weight: $fw-semibold;
    color: $text;
  }

  &__desc {
    font-size: $text-xs;
    color: $text-muted;
    margin-top: 2px;
  }

  &__status {
    margin-left: auto;
    font-size: $text-xs;
    font-weight: $fw-semibold;
    padding: 2px $space-2;
    border-radius: $radius-full;
    flex-shrink: 0;

    &--ok  { background: $success-bg; color: $success; }
    &--off { background: $bg-card;    color: $text-muted; border: 1px solid $border; }
  }

  &__form {
    display: flex;
    gap: $space-2;
  }
}

// ── Config sections ────────────────────────────────────────────────
.config-section {
  display: flex;
  flex-direction: column;
  gap: $space-4;
  padding: $space-5;
  background: $bg-card-2;
  border: 1px solid $border;
  border-radius: $radius;

  &__title {
    display: flex;
    align-items: center;
    gap: $space-2;
    font-size: $text-base;
    font-weight: $fw-semibold;
    color: $text;
    margin-bottom: $space-1;
  }
}

.field-row {
  display: grid;
  gap: $space-4;

  @media (min-width: $bp-md) { grid-template-columns: 1fr 1fr; }
  @media (min-width: $bp-lg) { grid-template-columns: repeat(3, 1fr); }
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: $space-2;
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
  transition: $transition-fast;
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

  option {
    background: $bg-card;
    color: $text;
  }
}

// ── Days off grid ──────────────────────────────────────────────────
.days-grid {
  display: flex;
  flex-wrap: wrap;
  gap: $space-2;
}

.day-check {
  display: flex;
  align-items: center;
  gap: $space-2;
  cursor: pointer;

  input[type='checkbox'] { accent-color: $primary; cursor: pointer; }

  &__label {
    font-size: $text-sm;
    color: $text-muted;
    user-select: none;
  }
}

// ── Step actions ───────────────────────────────────────────────────
.step-actions {
  display: flex;
  align-items: center;
  gap: $space-4;
  flex-wrap: wrap;

  &--activate {
    flex-direction: column;
    align-items: flex-start;
  }

  &__note {
    font-size: $text-sm;
    color: $text-subtle;
    max-width: 480px;
  }
}

// ── Review checklist ───────────────────────────────────────────────
.checklist {
  display: flex;
  flex-direction: column;
  gap: $space-2;

  &__item {
    display: flex;
    align-items: center;
    gap: $space-3;
    padding: $space-3 $space-4;
    background: $bg-card-2;
    border: 1px solid $border;
    border-radius: $radius;
  }

  &__icon {
    width: 24px;
    height: 24px;
    border-radius: $radius-full;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    &--ok      { background: $success-bg; color: $success; }
    &--pending { background: $bg-card;    color: $text-subtle; }
  }

  &__label {
    flex: 1;
    font-size: $text-sm;
    color: $text-muted;
  }

  &__state {
    font-size: $text-xs;
    font-weight: $fw-semibold;

    &--ok      { color: $success; }
    &--pending { color: $text-subtle; }
  }
}

// ── Ready banner ───────────────────────────────────────────────────
.ready-banner {
  display: flex;
  align-items: flex-start;
  gap: $space-4;
  padding: $space-5;
  background: $success-bg;
  border: 1px solid rgba(52, 211, 153, 0.25);
  border-radius: $radius;
  color: $success;

  strong { display: block; font-size: $text-base; margin-bottom: $space-1; }
  p      { font-size: $text-sm; color: rgba(52, 211, 153, 0.8); }
}

// ── Feedback ───────────────────────────────────────────────────────
.field-error   { font-size: $text-xs; color: $danger;  }
.field-success { font-size: $text-xs; color: $success; }

// ── Navigation ─────────────────────────────────────────────────────
.step-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: $space-2;
}
</style>
