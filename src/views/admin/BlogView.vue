<template>
  <div class="blog-page">

    <!-- List view -->
    <template v-if="!editing">
      <div class="page-header">
        <div>
          <h1 class="page-title">Blog</h1>
          <p class="page-subtitle">Crea y gestiona los artículos del blog público</p>
        </div>
        <AppButton @click="openCreate">
          <Plus :size="16" />
          Nuevo post
        </AppButton>
      </div>

      <div v-if="loading" class="posts-list">
        <div v-for="i in 4" :key="i" class="post-row post-row--skeleton" />
      </div>

      <div v-else-if="posts.length === 0" class="posts-empty">
        <FileText :size="40" />
        <p>Aún no hay posts. ¡Crea el primero!</p>
        <AppButton variant="secondary" @click="openCreate">
          <Plus :size="16" />
          Nuevo post
        </AppButton>
      </div>

      <div v-else class="posts-list">
        <div v-for="p in posts" :key="p._id" class="post-row">
          <div class="post-row__thumb">
            <img v-if="p.thumbnail_url" :src="p.thumbnail_url" :alt="p.title" />
            <ImageIcon v-else :size="20" />
          </div>

          <div class="post-row__info">
            <span class="post-row__title">{{ p.title }}</span>
            <span class="post-row__date">
              {{ p.status === 'published' && p.published_at
                ? formatDate(p.published_at)
                : formatDate(p.created_at) }}
            </span>
          </div>

          <div class="post-row__right">
            <AppBadge :variant="p.status === 'published' ? 'success' : 'warning'">
              {{ p.status === 'published' ? 'Publicado' : 'Borrador' }}
            </AppBadge>

            <AppButton variant="ghost" size="sm" @click="openEdit(p)">
              <Pencil :size="14" />
              Editar
            </AppButton>

            <AppButton variant="danger" size="sm" :loading="deletingId === p._id" @click="confirmDelete(p)">
              <Trash2 :size="14" />
            </AppButton>
          </div>
        </div>
      </div>

      <div v-if="totalPages > 1" class="pagination">
        <AppButton variant="secondary" size="sm" :disabled="page === 1" @click="page--; fetchPosts()">
          <ChevronLeft :size="16" />
        </AppButton>
        <span class="pagination__info">{{ page }} / {{ totalPages }}</span>
        <AppButton variant="secondary" size="sm" :disabled="page === totalPages" @click="page++; fetchPosts()">
          <ChevronRight :size="16" />
        </AppButton>
      </div>
    </template>

    <!-- Editor view -->
    <template v-else>
      <div class="page-header">
        <div>
          <h1 class="page-title">{{ editingPost ? 'Editar post' : 'Nuevo post' }}</h1>
        </div>
        <div style="display:flex;gap:12px">
          <AppButton variant="secondary" @click="cancelEdit">Cancelar</AppButton>
          <AppButton :loading="saving" @click="savePost">
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
              placeholder="Título del artículo"
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
                <option value="draft">Borrador</option>
                <option value="published">Publicado</option>
              </select>
            </div>
          </div>

          <div class="sidebar-card">
            <h3 class="sidebar-card__title">Metadatos</h3>

            <div class="field">
              <label class="field__label">Extracto</label>
              <textarea
                v-model="form.excerpt"
                class="field__input field__input--textarea"
                rows="3"
                placeholder="Breve descripción visible en listados"
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
    <AppModal v-model="showDeleteModal" title="Eliminar post" size="sm">
      <p class="delete-msg">
        ¿Seguro que quieres eliminar <strong>{{ deletingPost?.title }}</strong>? Esta acción no se puede deshacer.
      </p>
      <template #footer>
        <AppButton variant="secondary" @click="showDeleteModal = false">Cancelar</AppButton>
        <AppButton variant="danger" :loading="deletingId !== null" @click="deletePost">Eliminar</AppButton>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Editor from '@tinymce/tinymce-vue'
import {
  Plus, FileText, ImageIcon, Pencil, Trash2,
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

const posts       = ref([])
const loading     = ref(true)
const saving      = ref(false)
const page        = ref(1)
const total       = ref(0)
const limit       = 15
const editing     = ref(false)
const editingPost = ref(null)

const showDeleteModal = ref(false)
const deletingPost    = ref(null)
const deletingId      = ref(null)

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit)))

const defaultForm = () => ({ title: '', content: '', excerpt: '', thumbnail_url: '', status: 'draft' })
const form = ref(defaultForm())

function formatDate(d) {
  return new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

async function fetchPosts() {
  loading.value = true
  try {
    const params = new URLSearchParams({ page: page.value, limit })
    const res = await api.get(`/admin/blog?${params}`)
    posts.value = res.data ?? []
    total.value = res.total ?? 0
  } catch {
    toast.error('Error cargando posts')
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editingPost.value = null
  form.value = defaultForm()
  editing.value = true
}

function openEdit(post) {
  editingPost.value = post
  form.value = {
    title:         post.title,
    content:       post.content ?? '',
    excerpt:       post.excerpt ?? '',
    thumbnail_url: post.thumbnail_url ?? '',
    status:        post.status,
  }
  editing.value = true
}

function cancelEdit() {
  editing.value = false
  editingPost.value = null
}

async function savePost() {
  if (!form.value.title.trim()) {
    toast.warning('El título es obligatorio')
    return
  }
  saving.value = true
  try {
    if (editingPost.value) {
      const res = await api.patch(`/admin/blog/${editingPost.value._id}`, form.value)
      const idx = posts.value.findIndex(p => p._id === editingPost.value._id)
      if (idx !== -1) posts.value[idx] = res.data
    } else {
      const res = await api.post('/admin/blog', form.value)
      posts.value.unshift(res.data)
    }
    toast.success('Post guardado')
    editing.value = false
    editingPost.value = null
  } catch (err) {
    toast.error(err.message ?? 'Error guardando post')
  } finally {
    saving.value = false
  }
}

function confirmDelete(post) {
  deletingPost.value = post
  showDeleteModal.value = true
}

async function deletePost() {
  if (!deletingPost.value) return
  deletingId.value = deletingPost.value._id
  try {
    await api.del(`/admin/blog/${deletingPost.value._id}`)
    posts.value = posts.value.filter(p => p._id !== deletingPost.value._id)
    toast.success('Post eliminado')
    showDeleteModal.value = false
    deletingPost.value = null
  } catch (err) {
    toast.error(err.message ?? 'Error eliminando post')
  } finally {
    deletingId.value = null
  }
}

onMounted(fetchPosts)
</script>

<style lang="scss" scoped>
.blog-page {
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

// Posts list
.posts-list {
  display: flex;
  flex-direction: column;
  gap: $space-2;
}

.post-row {
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

  &__date {
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

.posts-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-4;
  padding: $space-12;
  color: $text-subtle;
  font-size: $text-sm;
}

// Editor layout
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

// Field
.field {
  display: flex;
  flex-direction: column;
  gap: $space-2;

  &__label {
    font-size: $text-sm;
    font-weight: $fw-medium;
    color: $text-muted;
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

// Delete modal
.delete-msg {
  font-size: $text-sm;
  color: $text-muted;
  line-height: 1.6;

  strong { color: $text; }
}

// Pagination
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
