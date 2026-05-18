<template>
  <div class="packages-page">

    <!-- ── LIST ──────────────────────────────────── -->
    <template v-if="!editing">
      <div class="page-header">
        <div>
          <h1 class="page-title">Paquetes</h1>
          <p class="page-subtitle">Gestiona los paquetes de suscripción y sus precios de Stripe</p>
        </div>
        <AppButton @click="openCreate">
          <Plus :size="16" />
          Nuevo paquete
        </AppButton>
      </div>

      <!-- Skeleton -->
      <div v-if="loading" class="pkg-list">
        <div v-for="i in 3" :key="i" class="pkg-row pkg-row--skeleton" />
      </div>

      <!-- Empty -->
      <div v-else-if="packages.length === 0" class="pkg-empty">
        <Package :size="40" />
        <p>Aún no hay paquetes. ¡Crea el primero!</p>
        <AppButton variant="secondary" @click="openCreate">
          <Plus :size="16" />
          Nuevo paquete
        </AppButton>
      </div>

      <!-- Table -->
      <div v-else class="pkg-list">
        <div v-for="pkg in packages" :key="pkg._id" class="pkg-row">
          <div class="pkg-row__main">
            <span class="pkg-row__name">{{ pkg.name }}</span>
            <code class="pkg-row__slug">{{ pkg.slug }}</code>
          </div>

          <div class="pkg-row__prices">
            <span class="pkg-row__price">{{ pkg.price_monthly }}€/mes</span>
            <span v-if="pkg.price_monthly_renewal" class="pkg-row__renewal">
              → {{ pkg.price_monthly_renewal }}€ tras {{ pkg.minimum_months }}m
            </span>
          </div>

          <div class="pkg-row__stripe">
            <span v-if="pkg.stripe_price_id" class="pkg-row__price-id">
              <Check :size="13" /> {{ pkg.stripe_price_id }}
            </span>
            <span v-else class="pkg-row__price-id pkg-row__price-id--missing">
              <AlertCircle :size="13" /> Sin Price ID
            </span>
          </div>

          <div class="pkg-row__right">
            <AppBadge :variant="pkg.active ? 'success' : 'warning'">
              {{ pkg.active ? 'Activo' : 'Inactivo' }}
            </AppBadge>
            <AppButton variant="ghost" size="sm" @click="openEdit(pkg)">
              <Pencil :size="14" />
              Editar
            </AppButton>
            <AppButton variant="danger" size="sm" :loading="deletingId === pkg._id" @click="confirmDelete(pkg)">
              <Trash2 :size="14" />
            </AppButton>
          </div>
        </div>
      </div>
    </template>

    <!-- ── FORM ───────────────────────────────────── -->
    <template v-else>
      <div class="page-header">
        <div>
          <h1 class="page-title">{{ editingPkg ? 'Editar paquete' : 'Nuevo paquete' }}</h1>
        </div>
        <div style="display:flex;gap:12px">
          <AppButton variant="secondary" @click="cancelEdit">Cancelar</AppButton>
          <AppButton :loading="saving" @click="savePkg">
            <Save :size="16" />
            Guardar
          </AppButton>
        </div>
      </div>

      <div class="form-layout">

        <!-- Left col -->
        <div class="form-main">
          <div class="field">
            <label class="field__label">Nombre del paquete <span class="field__req">*</span></label>
            <input
              v-model="form.name"
              type="text"
              class="field__input"
              placeholder="Despacho Digital"
              @input="autoSlug"
            />
          </div>

          <div class="field">
            <label class="field__label">Slug (URL)</label>
            <input
              v-model="form.slug"
              type="text"
              class="field__input field__input--mono"
              placeholder="despacho-digital"
            />
            <p class="field__hint">Auto-generado desde el nombre. Solo minúsculas y guiones.</p>
          </div>

          <div class="field">
            <label class="field__label">Descripción</label>
            <textarea
              v-model="form.description"
              class="field__input field__input--textarea"
              rows="3"
              placeholder="Breve descripción visible en la landing"
            />
          </div>

          <div class="field">
            <label class="field__label">Características incluidas</label>
            <textarea
              v-model="form.featuresRaw"
              class="field__input field__input--textarea"
              rows="6"
              placeholder="Una característica por línea:&#10;Web profesional personalizada&#10;2 empleados IA activos 24/7&#10;Soporte continuo"
            />
            <p class="field__hint">Una línea = una característica. Se muestra en la landing y en el checkout.</p>
          </div>
        </div>

        <!-- Right col -->
        <div class="form-sidebar">

          <div class="sidebar-card">
            <h3 class="sidebar-card__title">Estado</h3>
            <div class="field">
              <label class="field__label">Visibilidad</label>
              <select v-model="form.active" class="field__input">
                <option :value="true">Activo — visible y comprable</option>
                <option :value="false">Inactivo — oculto</option>
              </select>
            </div>
            <p v-if="form.active && !form.stripe_price_id" class="field__warn">
              <AlertCircle :size="13" />
              El paquete no funcionará sin un Stripe Price ID.
            </p>
          </div>

          <div class="sidebar-card">
            <h3 class="sidebar-card__title">Precios</h3>

            <div class="field">
              <label class="field__label">Precio mensual (€) <span class="field__req">*</span></label>
              <input
                v-model.number="form.price_monthly"
                type="number" min="0" step="1"
                class="field__input"
                placeholder="300"
              />
            </div>

            <div class="field">
              <label class="field__label">Precio tras el mínimo (€)</label>
              <input
                v-model.number="form.price_monthly_renewal"
                type="number" min="0" step="1"
                class="field__input"
                placeholder="200"
              />
              <p class="field__hint">Dejar vacío si no cambia.</p>
            </div>

            <div class="field">
              <label class="field__label">Meses mínimos de compromiso</label>
              <input
                v-model.number="form.minimum_months"
                type="number" min="1" step="1"
                class="field__input"
                placeholder="6"
              />
            </div>
          </div>

          <div class="sidebar-card">
            <h3 class="sidebar-card__title">Stripe</h3>
            <div class="field">
              <label class="field__label">Price ID inicial</label>
              <input
                v-model="form.stripe_price_id"
                type="text"
                class="field__input field__input--mono"
                placeholder="price_1ABC..."
              />
              <p class="field__hint">Cópialo desde Stripe → Products → tu producto → precio recurrente.</p>
            </div>
            <div class="field">
              <label class="field__label">Price ID renovación</label>
              <input
                v-model="form.stripe_price_id_renewal"
                type="text"
                class="field__input field__input--mono"
                placeholder="price_1XYZ... (opcional)"
              />
              <p class="field__hint">El precio que se aplica tras el periodo mínimo.</p>
            </div>
          </div>

        </div>
      </div>
    </template>

    <!-- ── DELETE MODAL ───────────────────────────── -->
    <AppModal v-model="showDeleteModal" title="Eliminar paquete" size="sm">
      <p class="delete-msg">
        ¿Seguro que quieres eliminar <strong>{{ deletingPkg?.name }}</strong>?
        Los clientes existentes no se verán afectados, pero el checkout dejará de funcionar.
      </p>
      <template #footer>
        <AppButton variant="secondary" @click="showDeleteModal = false">Cancelar</AppButton>
        <AppButton variant="danger" :loading="deletingId !== null" @click="deletePkg">Eliminar</AppButton>
      </template>
    </AppModal>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  Plus, Package, Pencil, Trash2, Save,
  Check, AlertCircle,
} from 'lucide-vue-next'
import { useApi } from '@/composables/useApi'
import { useToastStore } from '@/stores/toast'
import AppButton from '@/components/ui/AppButton.vue'
import AppBadge  from '@/components/ui/AppBadge.vue'
import AppModal  from '@/components/ui/AppModal.vue'

const api   = useApi()
const toast = useToastStore()

// ── State ─────────────────────────────────────────
const packages    = ref([])
const loading     = ref(true)
const saving      = ref(false)
const editing     = ref(false)
const editingPkg  = ref(null)

const showDeleteModal = ref(false)
const deletingPkg     = ref(null)
const deletingId      = ref(null)

// ── Form ──────────────────────────────────────────
const defaultForm = () => ({
  name:                  '',
  slug:                  '',
  description:           '',
  price_monthly:         null,
  price_monthly_renewal: null,
  minimum_months:        6,
  stripe_price_id:       '',
  stripe_price_id_renewal: '',
  featuresRaw:           '',
  active:                false,
})
const form = ref(defaultForm())

// Auto-generate slug from name while typing (only when creating)
function autoSlug() {
  if (editingPkg.value) return
  form.value.slug = form.value.name
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// ── Data ──────────────────────────────────────────
async function fetchPackages() {
  loading.value = true
  try {
    const res = await api.get('/admin/packages')
    packages.value = res.data ?? []
  } catch {
    toast.error('Error cargando paquetes')
  } finally {
    loading.value = false
  }
}

// ── CRUD ──────────────────────────────────────────
function openCreate() {
  editingPkg.value = null
  form.value = defaultForm()
  editing.value = true
}

function openEdit(pkg) {
  editingPkg.value = pkg
  form.value = {
    name:                    pkg.name,
    slug:                    pkg.slug,
    description:             pkg.description ?? '',
    price_monthly:           pkg.price_monthly,
    price_monthly_renewal:   pkg.price_monthly_renewal ?? null,
    minimum_months:          pkg.minimum_months ?? 6,
    stripe_price_id:         pkg.stripe_price_id ?? '',
    stripe_price_id_renewal: pkg.stripe_price_id_renewal ?? '',
    featuresRaw:             (pkg.features ?? []).join('\n'),
    active:                  pkg.active,
  }
  editing.value = true
}

function cancelEdit() {
  editing.value = false
  editingPkg.value = null
}

async function savePkg() {
  if (!form.value.name.trim()) {
    toast.warning('El nombre es obligatorio')
    return
  }
  if (form.value.price_monthly == null) {
    toast.warning('El precio mensual es obligatorio')
    return
  }

  saving.value = true
  try {
    const payload = {
      name:                    form.value.name.trim(),
      slug:                    form.value.slug.trim() || undefined,
      description:             form.value.description.trim(),
      price_monthly:           form.value.price_monthly,
      price_monthly_renewal:   form.value.price_monthly_renewal || undefined,
      minimum_months:          form.value.minimum_months,
      stripe_price_id:         form.value.stripe_price_id.trim() || undefined,
      stripe_price_id_renewal: form.value.stripe_price_id_renewal.trim() || undefined,
      features:                form.value.featuresRaw
                                 .split('\n')
                                 .map(l => l.trim())
                                 .filter(Boolean),
      active:                  form.value.active,
    }

    if (editingPkg.value) {
      await api.patch(`/admin/packages/${editingPkg.value._id}`, payload)
      toast.success('Paquete actualizado')
    } else {
      await api.post('/admin/packages', payload)
      toast.success('Paquete creado')
    }

    cancelEdit()
    fetchPackages()
  } catch (err) {
    toast.error(err?.message ?? 'Error al guardar')
  } finally {
    saving.value = false
  }
}

function confirmDelete(pkg) {
  deletingPkg.value = pkg
  showDeleteModal.value = true
}

async function deletePkg() {
  deletingId.value = deletingPkg.value._id
  try {
    await api.delete(`/admin/packages/${deletingPkg.value._id}`)
    toast.success('Paquete eliminado')
    showDeleteModal.value = false
    packages.value = packages.value.filter(p => p._id !== deletingPkg.value._id)
  } catch {
    toast.error('Error al eliminar')
  } finally {
    deletingId.value = null
    deletingPkg.value = null
  }
}

onMounted(fetchPackages)
</script>

<style lang="scss" scoped>
// ── Header ───────────────────────────────────────
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: $space-4;
  margin-bottom: $space-8;
}

.page-title {
  font-size: $text-2xl;
  font-weight: $fw-bold;
  color: $text;
  letter-spacing: -0.02em;
}

.page-subtitle {
  font-size: $text-sm;
  color: $text-muted;
  margin-top: $space-1;
}

// ── List ─────────────────────────────────────────
.pkg-list {
  display: flex;
  flex-direction: column;
  gap: $space-2;
}

.pkg-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-4;
  padding: $space-16;
  color: $text-muted;
  text-align: center;
}

.pkg-row {
  display: flex;
  align-items: center;
  gap: $space-4;
  padding: $space-4 $space-5;
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius;
  flex-wrap: wrap;

  &--skeleton {
    height: 64px;
    animation: pulse 1.4s ease-in-out infinite;
    @keyframes pulse { 0%,100%{opacity:.5} 50%{opacity:1} }
  }

  &__main {
    flex: 1;
    min-width: 160px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__name {
    font-size: $text-sm;
    font-weight: $fw-semibold;
    color: $text;
  }

  &__slug {
    font-size: $text-xs;
    color: $text-subtle;
    font-family: monospace;
  }

  &__prices {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 120px;
  }

  &__price {
    font-size: $text-sm;
    font-weight: $fw-semibold;
    color: $text;
  }

  &__renewal {
    font-size: $text-xs;
    color: $text-muted;
  }

  &__stripe {
    min-width: 180px;
  }

  &__price-id {
    display: inline-flex;
    align-items: center;
    gap: $space-1;
    font-size: $text-xs;
    font-family: monospace;
    color: $accent;

    &--missing {
      color: $danger;
    }
  }

  &__right {
    display: flex;
    align-items: center;
    gap: $space-2;
    margin-left: auto;
  }
}

// ── Form layout ──────────────────────────────────
.form-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: $space-6;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
}

.form-main,
.form-sidebar {
  display: flex;
  flex-direction: column;
  gap: $space-4;
}

.sidebar-card {
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius;
  padding: $space-5;
  display: flex;
  flex-direction: column;
  gap: $space-4;

  &__title {
    font-size: $text-sm;
    font-weight: $fw-semibold;
    color: $text;
    padding-bottom: $space-3;
    border-bottom: 1px solid $border;
  }
}

// ── Fields ───────────────────────────────────────
.field {
  display: flex;
  flex-direction: column;
  gap: $space-2;

  &__label {
    font-size: $text-sm;
    font-weight: $fw-medium;
    color: $text-muted;
  }

  &__req { color: $danger; }

  &__input {
    background: $bg-surface;
    border: 1px solid $border;
    border-radius: $radius;
    padding: $space-2 $space-3;
    font-size: $text-sm;
    color: $text;
    transition: $transition-fast;
    width: 100%;

    &:focus {
      outline: none;
      border-color: $primary;
      box-shadow: 0 0 0 3px rgba(156, 255, 203,0.12);
    }

    &--textarea { resize: vertical; line-height: 1.6; }
    &--mono { font-family: monospace; font-size: $text-xs; }
  }

  &__hint {
    font-size: $text-xs;
    color: $text-subtle;
  }

  &__warn {
    display: flex;
    align-items: center;
    gap: $space-1;
    font-size: $text-xs;
    color: $danger;
    background: $danger-bg;
    border: 1px solid rgba(255, 138, 138,0.2);
    border-radius: $radius;
    padding: $space-2 $space-3;
  }
}

// ── Delete modal ─────────────────────────────────
.delete-msg {
  font-size: $text-sm;
  color: $text-muted;
  line-height: 1.6;
}
</style>
