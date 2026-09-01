<template>
  <div class="trainings-page">

    <div class="page-header">
      <div>
        <h1 class="page-title">Formaciones</h1>
        <p class="page-subtitle">Inscritos, aforo y recaudación de tus talleres</p>
      </div>
    </div>

    <template v-if="loading">
      <div v-for="i in 2" :key="i" class="skeleton-block" />
    </template>

    <div v-else-if="!trainings.length" class="empty-state">
      <GraduationCap :size="40" />
      <p>No hay formaciones en el catálogo.</p>
    </div>

    <section v-for="t in trainings" v-else :key="t.slug" class="training">
      <!-- Cabecera -->
      <div class="training__head">
        <div class="training__title-block">
          <h2 class="training__name">{{ t.name }}</h2>
          <p class="training__meta">
            {{ formatDate(t.date) }}
            <template v-if="t.time"> · {{ t.time }}h</template>
            · {{ t.platform }}
          </p>
        </div>
        <AppBadge :variant="t.status === 'open' ? 'success' : 'default'">
          {{ t.status === 'open' ? 'Abierto' : 'Cerrado' }}
        </AppBadge>
      </div>

      <!-- Cifras -->
      <div class="training__stats">
        <div class="mini-stat">
          <span class="mini-stat__value">{{ t.seats_taken }} / {{ t.capacity }}</span>
          <span class="mini-stat__label">Plazas ocupadas</span>
          <div class="mini-stat__bar">
            <div
              class="mini-stat__fill"
              :class="{ 'mini-stat__fill--full': t.seats_left === 0 }"
              :style="{ width: `${Math.min((t.seats_taken / t.capacity) * 100, 100)}%` }"
            />
          </div>
        </div>
        <div class="mini-stat">
          <span class="mini-stat__value">{{ t.seats_left }}</span>
          <span class="mini-stat__label">Plazas libres</span>
        </div>
        <div class="mini-stat">
          <span class="mini-stat__value">{{ formatAmount(t.revenue, t.currency) }}</span>
          <span class="mini-stat__label">Recaudado</span>
        </div>
        <div class="mini-stat">
          <span class="mini-stat__value">{{ formatAmount(t.price, t.currency) }}</span>
          <span class="mini-stat__label">Precio por plaza</span>
        </div>
      </div>

      <!-- Aviso si falta el enlace -->
      <p v-if="!t.meet_url" class="training__warning">
        <AlertTriangle :size="15" />
        Sin enlace de sesión configurado. Los inscritos ven «se enviará antes de la sesión».
      </p>

      <!-- Inscritos -->
      <div v-if="!t.enrollments.length" class="training__empty">
        Todavía no hay inscritos.
      </div>

      <template v-else>
        <div class="training__list-head">
          <h3 class="training__list-title">
            <Users :size="15" />
            Inscritos ({{ t.enrollments.length }})
          </h3>
          <button type="button" class="copy-btn" @click="copyEmails(t)">
            <Copy :size="13" />
            {{ copiedSlug === t.slug ? '¡Copiados!' : 'Copiar correos' }}
          </button>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Alumno</th>
              <th>Correo</th>
              <th class="num">Importe</th>
              <th>Inscrito</th>
              <th>Acceso</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="e in t.enrollments" :key="e.id">
              <td>
                {{ e.name || '—' }}
                <span v-if="e.overbooked" class="tag tag--danger" title="Se vendió por encima del aforo">
                  sobre aforo
                </span>
                <span v-if="e.status !== 'paid'" class="tag tag--muted">{{ e.status }}</span>
              </td>
              <td class="table__email">{{ e.email }}</td>
              <td class="num">{{ formatAmount(e.amount, e.currency) }}</td>
              <td class="table__date">{{ formatDate(e.created_at, true) }}</td>
              <td>
                <span v-if="e.claimed" class="tag tag--ok" title="Entró al panel tras pagar">entró</span>
                <span v-else class="tag tag--warn" title="Nunca usó el acceso automático: comprueba que le llegó el correo">
                  sin entrar
                </span>
              </td>
              <td class="col-accion">
                <button
                  type="button"
                  class="delete-btn"
                  title="Eliminar inscripción y liberar la plaza"
                  :disabled="borrandoId === e.id"
                  @click="pedirBorrado(t, e)"
                >
                  <Trash2 :size="14" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </template>
    </section>

    <AppModal v-model="confirmarAbierto" title="Eliminar inscripción" size="sm">
      <p class="confirm-text">
        Se eliminará la inscripción de <strong>{{ pendiente?.enrollment?.email }}</strong>
        y se liberará su plaza en «{{ pendiente?.training?.name }}».
      </p>
      <p class="confirm-note">
        Su cuenta de cliente no se borra: si también quieres eliminarla, hazlo desde Clientes.
      </p>
      <template #footer>
        <AppButton variant="secondary" @click="cerrarConfirmacion">Cancelar</AppButton>
        <AppButton variant="danger" :loading="!!borrandoId" @click="borrar">Eliminar</AppButton>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { GraduationCap, Users, Copy, AlertTriangle, Trash2 } from 'lucide-vue-next'
import AppModal from '@/components/ui/AppModal.vue'
import AppButton from '@/components/ui/AppButton.vue'
import { useApi } from '@/composables/useApi'
import { useToastStore } from '@/stores/toast'
import AppBadge from '@/components/ui/AppBadge.vue'

const api   = useApi()
const toast = useToastStore()

const trainings  = ref([])
const loading    = ref(true)
const copiedSlug = ref(null)

const confirmarAbierto = ref(false)
const pendiente        = ref(null)
const borrandoId       = ref(null)

function pedirBorrado(training, enrollment) {
  pendiente.value        = { training, enrollment }
  confirmarAbierto.value = true
}

function cerrarConfirmacion() {
  confirmarAbierto.value = false
  pendiente.value        = null
}

async function borrar() {
  const item = pendiente.value
  if (!item) return
  borrandoId.value = item.enrollment.id
  try {
    await api.del(`/admin/trainings/enrollments/${item.enrollment.id}`)
    toast.success('Inscripción eliminada y plaza liberada')
    confirmarAbierto.value = false
    pendiente.value        = null
    await cargar()
  } catch (e) {
    toast.error(e.message ?? 'No se pudo eliminar la inscripción')
  } finally {
    borrandoId.value = null
  }
}

onMounted(cargar)

async function cargar() {
  try {
    const res = await api.get('/admin/trainings')
    trainings.value = res.data ?? []
  } catch {
    toast.error('No se pudieron cargar las formaciones')
  } finally {
    loading.value = false
  }
}

// Para pegar en el «Para» del correo con el enlace de la sesión.
async function copyEmails(t) {
  const emails = t.enrollments.filter(e => e.status === 'paid').map(e => e.email).join(', ')
  if (!emails) return

  const ok = await copyToClipboard(emails)
  if (ok) {
    copiedSlug.value = t.slug
    setTimeout(() => { copiedSlug.value = null }, 2000)
  } else {
    toast.error('No se pudo copiar. Selecciona los correos de la tabla y cópialos a mano.')
  }
}

// La API moderna de portapapeles falla si la pestaña no tiene el foco o si el
// navegador restringe el permiso; en ese caso se recurre al método antiguo,
// que no depende de permisos. Este botón se usa el día del taller para mandar
// el enlace de la sesión: más vale que funcione siempre.
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const area = document.createElement('textarea')
      area.value = text
      area.setAttribute('readonly', '')
      area.style.position = 'fixed'
      area.style.opacity = '0'
      document.body.appendChild(area)
      area.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(area)
      return ok
    } catch {
      return false
    }
  }
}

function formatAmount(amount, currency = 'EUR') {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency', currency, minimumFractionDigits: 0,
  }).format(amount ?? 0)
}

function formatDate(d, short = false) {
  if (!d) return '—'
  const date = d.length === 10 ? new Date(`${d}T00:00:00`) : new Date(d)
  return date.toLocaleDateString('es-ES', short
    ? { day: '2-digit', month: 'short' }
    : { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<style lang="scss" scoped>
.trainings-page {
  display: flex;
  flex-direction: column;
  gap: $space-6;
}

.page-title {
  font-size: $text-3xl;
  font-weight: $fw-bold;
  letter-spacing: -0.02em;
}

.page-subtitle {
  color: $text-muted;
  font-size: $text-sm;
}

.skeleton-block {
  height: 200px;
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius-lg;
  opacity: 0.5;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-3;
  padding: $space-12;
  color: $text-subtle;
  font-size: $text-sm;
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius-lg;
}

// ── Ficha de formación ─────────────────────────────────────────────────────
.training {
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius-lg;
  padding: $space-5;
  display: flex;
  flex-direction: column;
  gap: $space-5;

  &__head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: $space-4;
  }

  &__name {
    font-family: $font-display;
    font-size: $text-xl;
    font-weight: $fw-bold;
    color: $text;
  }

  &__meta {
    font-size: $text-sm;
    color: $text-muted;
    margin-top: 2px;

    &::first-letter { text-transform: uppercase; }
  }

  &__stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: $space-4;
  }

  &__warning {
    display: flex;
    align-items: center;
    gap: $space-2;
    padding: $space-3 $space-4;
    background: $warning-bg;
    border: 1px solid rgba(245, 166, 35, 0.25);
    border-radius: $radius;
    font-size: $text-xs;
    color: $warning;

    svg { flex-shrink: 0; }
  }

  &__empty {
    padding: $space-6;
    text-align: center;
    font-size: $text-sm;
    color: $text-subtle;
    background: $bg-surface;
    border-radius: $radius;
  }

  &__list-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $space-4;
    flex-wrap: wrap;
  }

  &__list-title {
    display: flex;
    align-items: center;
    gap: $space-2;
    font-size: $text-base;
    font-weight: $fw-semibold;
    color: $text;

    svg { color: $primary-light; }
  }
}

.mini-stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: $space-4;
  background: $bg-surface;
  border: 1px solid $border;
  border-radius: $radius;

  &__value {
    font-family: $font-display;
    font-size: $text-xl;
    font-weight: $fw-bold;
    color: $text;
    font-variant-numeric: tabular-nums;
  }

  &__label {
    font-size: $text-xs;
    color: $text-muted;
  }

  &__bar {
    height: 5px;
    margin-top: $space-2;
    background: rgba(255, 255, 255, 0.06);
    border-radius: $radius-full;
    overflow: hidden;
  }

  &__fill {
    height: 100%;
    background: $primary;
    border-radius: $radius-full;
    transition: $transition;

    &--full { background: $success; }
  }
}

.copy-btn {
  display: inline-flex;
  align-items: center;
  gap: $space-1;
  padding: $space-2 $space-3;
  background: $primary-subtle;
  border: 1px solid $border-hover;
  border-radius: $radius-sm;
  font-family: inherit;
  font-size: $text-xs;
  font-weight: $fw-medium;
  color: $primary-light;
  cursor: pointer;
  transition: $transition-fast;

  &:hover { background: rgba(30, 144, 255, 0.16); }
}

// ── Tabla ──────────────────────────────────────────────────────────────────
.table {
  width: 100%;
  border-collapse: collapse;
  font-size: $text-sm;

  th {
    text-align: left;
    padding: $space-2 $space-3;
    font-size: $text-xs;
    font-weight: $fw-semibold;
    color: $text-muted;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 1px solid $border;
  }

  td {
    padding: $space-3;
    border-bottom: 1px solid $border;
    color: $text;
  }

  tr:last-child td { border-bottom: none; }

  .num { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }

  &__email {
    font-family: $font-mono;
    font-size: $text-xs;
    color: $text-muted;
  }

  &__date {
    font-size: $text-xs;
    color: $text-muted;
    white-space: nowrap;
  }
}

.tag {
  display: inline-block;
  margin-left: $space-2;
  padding: 1px $space-2;
  border-radius: $radius-full;
  font-size: 10px;
  font-weight: $fw-semibold;
  text-transform: uppercase;
  letter-spacing: 0.04em;

  &--ok     { background: $success-bg; color: $success; margin-left: 0; }
  &--warn   { background: $warning-bg; color: $warning; margin-left: 0; }
  &--danger { background: $danger-bg;  color: $danger; }
  &--muted  { background: rgba(255,255,255,0.06); color: $text-subtle; }
}

.col-accion { width: 40px; text-align: right; }

.delete-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: none;
  border: 1px solid $border;
  border-radius: $radius-sm;
  color: $text-subtle;
  cursor: pointer;
  transition: $transition-fast;

  &:hover:not(:disabled) {
    border-color: rgba(255, 107, 107, 0.4);
    color: $danger;
    background: $danger-bg;
  }

  &:disabled { opacity: 0.5; cursor: wait; }
}

.confirm-text {
  font-size: $text-sm;
  color: $text-muted;
  line-height: 1.7;

  strong { color: $text; }
}

.confirm-note {
  margin-top: $space-3;
  font-size: $text-xs;
  color: $text-subtle;
  line-height: 1.6;
}
</style>
