<template>
  <div class="courses-page">

    <!-- List view -->
    <template v-if="!editing">
      <div class="page-header">
        <div>
          <h1 class="page-title">Cursos</h1>
          <p class="page-subtitle">Gestiona los cursos publicados y en preventa</p>
        </div>
        <AppButton @click="openCreate">
          <Plus :size="16" />
          Nuevo curso
        </AppButton>
      </div>

      <div v-if="loading" class="courses-list">
        <div v-for="i in 4" :key="i" class="course-row course-row--skeleton" />
      </div>

      <div v-else-if="courses.length === 0" class="courses-empty">
        <GraduationCap :size="40" />
        <p>Aún no hay cursos. ¡Crea el primero!</p>
        <AppButton variant="secondary" @click="openCreate">
          <Plus :size="16" />
          Nuevo curso
        </AppButton>
      </div>

      <div v-else class="courses-list">
        <div v-for="c in courses" :key="c._id" class="course-row">
          <div class="course-row__thumb">
            <img v-if="c.thumbnail_url" :src="c.thumbnail_url" :alt="c.title" />
            <ImageIcon v-else :size="20" />
          </div>

          <div class="course-row__info">
            <span class="course-row__title">{{ c.title }}</span>
            <span class="course-row__meta">
              {{ c.price != null ? c.price + ' €' : 'Sin precio' }}
              <span v-if="c.start_date"> · {{ formatDate(c.start_date) }}</span>
            </span>
          </div>

          <div class="course-row__right">
            <AppBadge :variant="{ active: 'success', inactive: 'warning', draft: 'neutral' }[c.status] ?? 'neutral'">
              {{ { active: 'Activo', inactive: 'Preventa', draft: 'Borrador' }[c.status] ?? 'Borrador' }}
            </AppBadge>

            <AppButton variant="ghost" size="sm" @click="openEdit(c)">
              <Pencil :size="14" />
              Editar
            </AppButton>

            <AppButton variant="danger" size="sm" :loading="deletingId === c._id" @click="confirmDelete(c)">
              <Trash2 :size="14" />
            </AppButton>
          </div>
        </div>
      </div>

      <div v-if="totalPages > 1" class="pagination">
        <AppButton variant="secondary" size="sm" :disabled="page === 1" @click="page--; fetchCourses()">
          <ChevronLeft :size="16" />
        </AppButton>
        <span class="pagination__info">{{ page }} / {{ totalPages }}</span>
        <AppButton variant="secondary" size="sm" :disabled="page === totalPages" @click="page++; fetchCourses()">
          <ChevronRight :size="16" />
        </AppButton>
      </div>
    </template>

    <!-- Editor view -->
    <template v-else>
      <div class="page-header">
        <div>
          <h1 class="page-title">{{ editingCourse ? 'Editar curso' : 'Nuevo curso' }}</h1>
        </div>
        <div style="display:flex;gap:12px">
          <AppButton variant="secondary" @click="cancelEdit">Cancelar</AppButton>
          <AppButton :loading="saving" @click="saveCourse">
            <Save :size="16" />
            Guardar
          </AppButton>
        </div>
      </div>

      <div class="editor-layout">
        <div class="editor-main">
          <div class="field">
            <label class="field__label">Título</label>
            <input
              v-model="form.title"
              type="text"
              class="field__input"
              placeholder="Título del curso"
            />
          </div>

          <div class="field">
            <label class="field__label">Descripción corta</label>
            <textarea
              v-model="form.description"
              class="field__input field__input--textarea"
              rows="3"
              placeholder="Breve descripción visible en la home y listados"
            />
          </div>

          <div class="field">
            <label class="field__label">
              ¿Es para mí?
              <span class="field__required">Obligatorio</span>
            </label>
            <textarea
              v-model="form.is_for_me"
              class="field__input field__input--textarea"
              rows="5"
              placeholder="Describe a quién va dirigido este curso. El alumno lee esto antes de decidir si compra. Sé concreto: situaciones, perfiles, objetivos."
            />
          </div>

          <div class="field">
            <label class="field__label">Contenido</label>
            <Editor
              :api-key="tinymceKey"
              v-model="form.content"
              :init="editorConfig"
            />
          </div>
        </div>

        <div class="editor-sidebar">
          <div class="sidebar-card">
            <h3 class="sidebar-card__title">Publicación</h3>

            <div class="field">
              <label class="field__label">Estado</label>
              <select v-model="form.status" class="field__input">
                <option value="draft">Borrador (solo admin)</option>
                <option value="inactive">Preventa / Waitlist</option>
                <option value="active">Activo (público)</option>
              </select>
            </div>
          </div>

          <div class="sidebar-card">
            <h3 class="sidebar-card__title">Detalles del curso</h3>

            <div class="field">
              <label class="field__label">Precio (€)</label>
              <input
                v-model.number="form.price"
                type="number"
                min="0"
                step="0.01"
                class="field__input"
                placeholder="297"
              />
            </div>

            <div class="field">
              <label class="field__label">Fecha de inicio</label>
              <input
                v-model="form.start_date"
                type="date"
                class="field__input"
              />
            </div>

            <div class="field">
              <label class="field__label">Plazas máximas</label>
              <input
                v-model.number="form.max_spots"
                type="number"
                min="1"
                class="field__input"
                placeholder="Vacío = ilimitadas"
              />
            </div>

            <div class="field">
              <label class="field__label">Plazas ocupadas</label>
              <input
                v-model.number="form.spots_taken"
                type="number"
                min="0"
                class="field__input"
                placeholder="0"
              />
            </div>

            <div class="field">
              <label class="field__label">URL de la imagen destacada</label>
              <input
                v-model="form.thumbnail_url"
                type="url"
                class="field__input"
                placeholder="https://..."
              />
              <div v-if="form.thumbnail_url" class="thumbnail-preview">
                <img :src="form.thumbnail_url" alt="Preview" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Delete confirm modal -->
    <AppModal v-model="showDeleteModal" title="Eliminar curso" size="sm">
      <p class="delete-msg">
        ¿Seguro que quieres eliminar <strong>{{ deletingCourse?.title }}</strong>? Esta acción no se puede deshacer.
      </p>
      <template #footer>
        <AppButton variant="secondary" @click="showDeleteModal = false">Cancelar</AppButton>
        <AppButton variant="danger" :loading="deletingId !== null" @click="deleteCourse">Eliminar</AppButton>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Editor from '@tinymce/tinymce-vue'
import {
  Plus, GraduationCap, ImageIcon, Pencil, Trash2,
  Save, ChevronLeft, ChevronRight,
} from 'lucide-vue-next'
import { useApi } from '@/composables/useApi'
import { useToastStore } from '@/stores/toast'
import AppButton from '@/components/ui/AppButton.vue'
import AppBadge  from '@/components/ui/AppBadge.vue'
import AppModal  from '@/components/ui/AppModal.vue'

const api   = useApi()
const toast = useToastStore()

const tinymceKey = import.meta.env.VITE_TINYMCE_API_KEY ?? ''

const editorConfig = {
  height: 480,
  menubar: false,
  skin: 'oxide-dark',
  content_css: 'dark',
  plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
            'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'table', 'wordcount'],
  toolbar:
    'undo redo | formatselect | bold italic underline | ' +
    'alignleft aligncenter alignright | ' +
    'bullist numlist | link image | code fullscreen',
}

const courses       = ref([])
const loading       = ref(true)
const saving        = ref(false)
const page          = ref(1)
const total         = ref(0)
const limit         = 15
const editing       = ref(false)
const editingCourse = ref(null)

const showDeleteModal = ref(false)
const deletingCourse  = ref(null)
const deletingId      = ref(null)

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit)))

const defaultForm = () => ({
  title: '',
  content: '',
  description: '',
  is_for_me: '',
  thumbnail_url: '',
  price: null,
  start_date: '',
  status: 'draft',
  max_spots: null,
  spots_taken: 0,
})
const form = ref(defaultForm())

function formatDate(d) {
  return new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

async function fetchCourses() {
  loading.value = true
  try {
    const params = new URLSearchParams({ page: page.value, limit })
    const res = await api.get(`/admin/courses?${params}`)
    courses.value = res.data ?? []
    total.value = res.total ?? 0
  } catch {
    toast.error('Error cargando cursos')
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editingCourse.value = null
  form.value = defaultForm()
  editing.value = true
}

function openEdit(course) {
  editingCourse.value = course
  form.value = {
    title:         course.title,
    content:       course.content ?? '',
    description:   course.description ?? '',
    is_for_me:     course.is_for_me ?? '',
    thumbnail_url: course.thumbnail_url ?? '',
    price:         course.price ?? null,
    start_date:    course.start_date ? course.start_date.slice(0, 10) : '',
    status:        course.status ?? 'draft',
    max_spots:     course.max_spots ?? null,
    spots_taken:   course.spots_taken ?? 0,
  }
  editing.value = true
}

function cancelEdit() {
  editing.value = false
  editingCourse.value = null
}

async function saveCourse() {
  if (!form.value.title.trim()) {
    toast.warning('El título es obligatorio')
    return
  }
  if (!form.value.is_for_me.trim()) {
    toast.warning('El texto "¿Es para mí?" es obligatorio')
    return
  }
  saving.value = true
  try {
    const payload = {
      ...form.value,
      start_date: form.value.start_date || null,
    }
    if (editingCourse.value) {
      const res = await api.patch(`/admin/courses/${editingCourse.value._id}`, payload)
      const idx = courses.value.findIndex(c => c._id === editingCourse.value._id)
      if (idx !== -1) courses.value[idx] = res.data
    } else {
      const res = await api.post('/admin/courses', payload)
      courses.value.unshift(res.data)
    }
    toast.success('Curso guardado')
    editing.value = false
    editingCourse.value = null
  } catch (err) {
    toast.error(err.message ?? 'Error guardando curso')
  } finally {
    saving.value = false
  }
}

function confirmDelete(course) {
  deletingCourse.value = course
  showDeleteModal.value = true
}

async function deleteCourse() {
  if (!deletingCourse.value) return
  deletingId.value = deletingCourse.value._id
  try {
    await api.del(`/admin/courses/${deletingCourse.value._id}`)
    courses.value = courses.value.filter(c => c._id !== deletingCourse.value._id)
    toast.success('Curso eliminado')
    showDeleteModal.value = false
    deletingCourse.value = null
  } catch (err) {
    toast.error(err.message ?? 'Error eliminando curso')
  } finally {
    deletingId.value = null
  }
}

onMounted(fetchCourses)
</script>

<style lang="scss" scoped>
.courses-page {
  display: flex;
  flex-direction: column;
  gap: $space-6;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: $space-4;
  flex-wrap: wrap;
}

.page-title {
  font-size: $text-3xl;
  font-weight: $fw-bold;
  letter-spacing: -0.02em;
}

.page-subtitle {
  color: $text-muted;
  font-size: $text-sm;
  margin-top: $space-1;
}

.courses-list {
  display: flex;
  flex-direction: column;
  gap: $space-2;
}

.course-row {
  display: flex;
  align-items: center;
  gap: $space-4;
  padding: $space-3 $space-4;
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius-lg;
  transition: $transition;
  flex-wrap: wrap;

  &:hover { border-color: $border-hover; }

  &--skeleton {
    height: 66px;
    background: linear-gradient(90deg, $bg-card 25%, $bg-card-2 50%, $bg-card 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  &__thumb {
    width: 56px;
    height: 40px;
    border-radius: $radius;
    overflow: hidden;
    background: $bg-surface;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $text-subtle;
    flex-shrink: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__title {
    font-size: $text-sm;
    font-weight: $fw-semibold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__meta {
    font-size: $text-xs;
    color: $text-subtle;
    font-family: $font-mono;
  }

  &__right {
    display: flex;
    align-items: center;
    gap: $space-2;
    flex-shrink: 0;
  }
}

.courses-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-4;
  padding: $space-12;
  color: $text-subtle;
  font-size: $text-sm;
}

.editor-layout {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: $space-5;
  align-items: flex-start;

  @media (max-width: $bp-lg) {
    grid-template-columns: 1fr;
  }
}

.editor-main {
  display: flex;
  flex-direction: column;
  gap: $space-4;
}

.editor-sidebar {
  display: flex;
  flex-direction: column;
  gap: $space-4;
}

.sidebar-card {
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius-lg;
  padding: $space-4;
  display: flex;
  flex-direction: column;
  gap: $space-4;

  &__title {
    font-size: $text-sm;
    font-weight: $fw-semibold;
    color: $text-muted;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
}

.field {
  display: flex;
  flex-direction: column;
  gap: $space-2;

  &__label {
    font-size: $text-sm;
    font-weight: $fw-medium;
    color: $text-muted;
    display: flex;
    align-items: center;
    gap: $space-2;
  }

  &__required {
    font-size: $text-xs;
    font-weight: $fw-semibold;
    color: $primary-light;
    background: $primary-subtle;
    padding: 1px 6px;
    border-radius: $radius-full;
    border: 1px solid rgba(156, 255, 203,0.25);
  }

  &__input {
    width: 100%;
    height: 40px;
    padding: 0 $space-3;
    background: $bg-input;
    border: 1px solid $border;
    border-radius: $radius;
    color: $text;
    font-size: $text-sm;
    font-family: $font-sans;
    outline: none;
    transition: $transition;

    &::placeholder { color: $text-subtle; }

    &:focus {
      border-color: $primary;
      box-shadow: 0 0 0 3px $primary-glow;
    }

    &--textarea {
      height: auto;
      padding: $space-3;
      resize: vertical;
      line-height: 1.5;
    }

    option { background: $bg-card-2; }
  }
}

.thumbnail-preview {
  margin-top: $space-2;
  border-radius: $radius;
  overflow: hidden;
  height: 100px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.delete-msg {
  font-size: $text-sm;
  color: $text-muted;
  line-height: 1.6;

  strong { color: $text; }
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $space-3;

  &__info {
    font-size: $text-sm;
    color: $text-muted;
  }
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
