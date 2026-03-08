<template>
  <div class="content-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Contenido</h1>
        <p class="page-subtitle">Genera y aprueba tu grilla de contenido semanal</p>
      </div>
      <AppButton @click="showGenerateModal = true">
        <Sparkles :size="16" />
        Generar grilla
      </AppButton>
    </div>

    <!-- Status filter -->
    <div class="filters__tabs">
      <button
        v-for="tab in statusTabs"
        :key="tab.value"
        class="filters__tab"
        :class="{ 'filters__tab--active': selectedStatus === tab.value }"
        @click="selectedStatus = tab.value; page = 1; fetchContent()"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Grid -->
    <div v-if="loading" class="content-grid content-grid--loading">
      <div v-for="i in 6" :key="i" class="content-card content-card--skeleton" />
    </div>

    <div v-else-if="posts.length === 0" class="content-empty">
      <LayoutGrid :size="48" />
      <p>Sin publicaciones con este filtro</p>
      <AppButton variant="secondary" @click="showGenerateModal = true">
        <Sparkles :size="16" />
        Generar contenido
      </AppButton>
    </div>

    <div v-else class="content-grid">
      <div v-for="post in posts" :key="post._id" class="content-card">
        <!-- Image preview -->
        <div class="content-card__image">
          <img
            v-if="post.image_url"
            :src="post.image_url"
            :alt="`Imagen para ${post.theme}`"
          />
          <div v-else class="content-card__image-empty">
            <ImageIcon :size="24" />
            <span>Sin imagen</span>
          </div>

          <AppBadge
            class="content-card__platform-badge"
            :variant="platformVariant(post.platform)"
          >
            <component :is="platformIcon(post.platform)" :size="11" />
            {{ post.platform }}
          </AppBadge>
        </div>

        <!-- Body -->
        <div class="content-card__body">
          <div class="content-card__meta">
            <AppBadge :variant="statusVariant(post.status)">{{ statusLabel(post.status) }}</AppBadge>
            <span class="content-card__date">
              {{ post.scheduled_for ? formatDate(post.scheduled_for) : 'Sin fecha' }}
            </span>
          </div>

          <p class="content-card__theme">{{ post.theme }}</p>
          <p class="content-card__copy">{{ post.copy }}</p>

          <!-- Actions -->
          <div class="content-card__actions">
            <template v-if="post.status === 'draft'">
              <AppButton
                size="sm"
                variant="secondary"
                :loading="designingId === post._id"
                @click="designPost(post)"
                title="Generar imagen"
              >
                <Wand2 :size="14" />
                Imagen
              </AppButton>
              <AppButton
                size="sm"
                :loading="updatingId === post._id"
                @click="setStatus(post, 'approved')"
              >
                <Check :size="14" />
                Aprobar
              </AppButton>
              <AppButton
                size="sm"
                variant="danger"
                :loading="updatingId === post._id"
                @click="setStatus(post, 'rejected')"
              >
                <X :size="14" />
              </AppButton>
            </template>

            <template v-else-if="post.status === 'approved'">
              <AppBadge variant="success">
                <Check :size="11" />
                Aprobado
              </AppBadge>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="pagination">
      <AppButton variant="secondary" size="sm" :disabled="page === 1" @click="page--; fetchContent()">
        <ChevronLeft :size="16" />
      </AppButton>
      <span class="pagination__info">{{ page }} / {{ totalPages }}</span>
      <AppButton variant="secondary" size="sm" :disabled="page === totalPages" @click="page++; fetchContent()">
        <ChevronRight :size="16" />
      </AppButton>
    </div>

    <!-- Generate Modal -->
    <AppModal v-model="showGenerateModal" title="Generar grilla de contenido" size="sm">
      <div class="generate-form">
        <div class="field">
          <label class="field__label">Tema o campaña</label>
          <input
            v-model="generateForm.theme"
            type="text"
            class="field__input"
            placeholder="Ej: Productividad con IA en clínicas"
          />
        </div>

        <div class="field">
          <label class="field__label">Plataforma</label>
          <select v-model="generateForm.platform" class="field__input">
            <option value="instagram">Instagram</option>
            <option value="linkedin">LinkedIn</option>
            <option value="tiktok">TikTok</option>
            <option value="twitter">Twitter / X</option>
          </select>
        </div>
      </div>

      <template #footer>
        <AppButton variant="secondary" @click="showGenerateModal = false">Cancelar</AppButton>
        <AppButton :loading="generating" @click="generateGrid">
          <Sparkles :size="16" />
          Generar
        </AppButton>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  Sparkles, LayoutGrid, ImageIcon, Wand2,
  Check, X, ChevronLeft, ChevronRight,
  Instagram, Linkedin, Twitter, Monitor,
} from 'lucide-vue-next'
import { useApi } from '@/composables/useApi'
import { useToastStore } from '@/stores/toast'
import AppCard    from '@/components/ui/AppCard.vue'
import AppBadge   from '@/components/ui/AppBadge.vue'
import AppButton  from '@/components/ui/AppButton.vue'
import AppModal   from '@/components/ui/AppModal.vue'

const api   = useApi()
const toast = useToastStore()

const posts        = ref([])
const loading      = ref(true)
const updatingId   = ref(null)
const designingId  = ref(null)
const generating   = ref(false)
const selectedStatus = ref('')
const page         = ref(1)
const totalPages   = ref(1)
const showGenerateModal = ref(false)

const generateForm = ref({ theme: '', platform: 'instagram' })

const statusTabs = [
  { value: '', label: 'Todos' },
  { value: 'draft', label: 'Borradores' },
  { value: 'approved', label: 'Aprobados' },
  { value: 'rejected', label: 'Rechazados' },
]

function statusLabel(s) {
  const map = { draft: 'Borrador', approved: 'Aprobado', rejected: 'Rechazado', published: 'Publicado' }
  return map[s] ?? s
}

function statusVariant(s) {
  const map = { draft: 'warning', approved: 'success', rejected: 'danger', published: 'info' }
  return map[s] ?? 'default'
}

function platformIcon(p) {
  return { instagram: Instagram, linkedin: Linkedin, twitter: Twitter }[p] ?? Monitor
}

function platformVariant(p) {
  return { instagram: 'danger', linkedin: 'info', twitter: 'info' }[p] ?? 'default'
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
}

async function fetchContent() {
  loading.value = true
  try {
    const params = new URLSearchParams({ page: page.value, limit: 12 })
    if (selectedStatus.value) params.set('status', selectedStatus.value)
    const res = await api.get(`/admin/content?${params}`)
    posts.value      = res.posts ?? []
    totalPages.value = res.total_pages ?? 1
  } catch {
    toast.error('Error cargando contenido')
  } finally {
    loading.value = false
  }
}

async function setStatus(post, status) {
  updatingId.value = post._id
  try {
    await api.patch(`/admin/content/${post._id}`, { status })
    post.status = status
    toast.success(`Post ${statusLabel(status).toLowerCase()}`)
  } catch (err) {
    toast.error(err.message)
  } finally {
    updatingId.value = null
  }
}

async function designPost(post) {
  designingId.value = post._id
  try {
    const res = await api.post(`/admin/content/${post._id}/design`)
    post.image_url = res.image_url
    toast.success('Imagen generada')
  } catch (err) {
    toast.error(err.message)
  } finally {
    designingId.value = null
  }
}

async function generateGrid() {
  if (!generateForm.value.theme.trim()) {
    toast.warning('Escribe un tema')
    return
  }
  generating.value = true
  try {
    await api.post('/admin/content/generate', generateForm.value)
    toast.success('¡Grilla generada! Revisa los borradores')
    showGenerateModal.value = false
    selectedStatus.value = 'draft'
    page.value = 1
    fetchContent()
  } catch (err) {
    toast.error(err.message)
  } finally {
    generating.value = false
  }
}

onMounted(fetchContent)
</script>

<style lang="scss" scoped>
.content-page {
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

// Tabs
.filters__tabs {
  display: flex;
  gap: $space-1;
  flex-wrap: wrap;
}

.filters__tab {
  height: 34px;
  padding: 0 $space-4;
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius;
  color: $text-muted;
  font-size: $text-sm;
  font-weight: $fw-medium;
  cursor: pointer;
  transition: $transition-fast;
  white-space: nowrap;

  &:hover {
    border-color: $border-hover;
    color: $text;
  }

  &--active {
    background: $primary-subtle;
    border-color: rgba(124, 111, 255, 0.3);
    color: $primary-light;
  }
}

// Content grid
.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: $space-5;

  &--loading .content-card {
    height: 320px;
    background: linear-gradient(90deg, $bg-card 25%, $bg-card-2 50%, $bg-card 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: $radius-lg;
    border: 1px solid $border;
  }
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.content-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-4;
  padding: $space-16;
  color: $text-subtle;
  font-size: $text-sm;
}

// Content card
.content-card {
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius-lg;
  overflow: hidden;
  transition: $transition;

  &:hover {
    border-color: $border-hover;
  }

  &__image {
    position: relative;
    height: 160px;
    background: $bg-surface;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &-empty {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: $space-2;
      color: $text-subtle;
      font-size: $text-xs;
    }
  }

  &__platform-badge {
    position: absolute;
    top: $space-2;
    left: $space-2;
  }

  &__body {
    padding: $space-4;
    display: flex;
    flex-direction: column;
    gap: $space-3;
  }

  &__meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $space-2;
  }

  &__date {
    font-size: $text-xs;
    color: $text-subtle;
    font-family: $font-mono;
  }

  &__theme {
    font-size: $text-xs;
    font-weight: $fw-semibold;
    color: $primary-light;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  &__copy {
    font-size: $text-sm;
    color: $text-muted;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: $space-2;
    flex-wrap: wrap;
    margin-top: $space-1;
  }
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

// Generate form
.generate-form {
  display: flex;
  flex-direction: column;
  gap: $space-4;
}

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
    outline: none;
    transition: $transition;

    &::placeholder { color: $text-subtle; }

    &:focus {
      border-color: $primary;
      box-shadow: 0 0 0 3px $primary-glow;
    }

    option {
      background: $bg-card-2;
    }
  }
}
</style>
