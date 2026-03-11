<template>
  <div class="blog-list">
    <div class="blog-list__hero">
      <div class="container">
        <h1 class="blog-list__heading">Blog</h1>
        <p class="blog-list__sub">Automatización, IA y negocios — ideas que transforman cómo trabajas</p>
      </div>
    </div>

    <div class="container">
      <div v-if="loading" class="posts-grid">
        <div v-for="i in 6" :key="i" class="post-card post-card--skeleton" />
      </div>

      <div v-else-if="posts.length === 0" class="blog-empty">
        <p>Aún no hay artículos publicados. Vuelve pronto.</p>
        <RouterLink to="/" class="back-link">← Volver al inicio</RouterLink>
      </div>

      <div v-else class="posts-grid">
        <RouterLink
          v-for="p in posts"
          :key="p._id"
          :to="`/blog/${p.slug}`"
          class="post-card"
        >
          <div class="post-card__thumb">
            <img v-if="p.thumbnail_url" :src="p.thumbnail_url" :alt="p.title" />
            <div v-else class="post-card__thumb-empty">
              <FileText :size="32" />
            </div>
          </div>
          <div class="post-card__body">
            <span class="post-card__date">{{ formatDate(p.published_at) }}</span>
            <h2 class="post-card__title">{{ p.title }}</h2>
            <p v-if="p.excerpt" class="post-card__excerpt">{{ p.excerpt }}</p>
            <span class="post-card__cta">Leer artículo →</span>
          </div>
        </RouterLink>
      </div>

      <div v-if="totalPages > 1" class="pagination">
        <button class="pagination__btn" :disabled="page === 1" @click="page--; fetchPosts()">
          ← Anterior
        </button>
        <span class="pagination__info">{{ page }} / {{ totalPages }}</span>
        <button class="pagination__btn" :disabled="page === totalPages" @click="page++; fetchPosts()">
          Siguiente →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { FileText } from 'lucide-vue-next'

const posts   = ref([])
const loading = ref(true)
const page    = ref(1)
const total   = ref(0)
const limit   = 9

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit)))

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
}

async function fetchPosts() {
  loading.value = true
  try {
    const params = new URLSearchParams({ page: page.value, limit })
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/blog?${params}`
    ).then(r => r.json())
    posts.value = res.data ?? []
    total.value = res.total ?? 0
  } catch {
    // silent — show empty state
  } finally {
    loading.value = false
  }
}

onMounted(fetchPosts)
</script>

<style lang="scss" scoped>
.blog-list {
  min-height: 100vh;
  padding-bottom: $space-16;

  &__hero {
    background: $bg-surface;
    border-bottom: 1px solid $border;
    padding: $space-16 0 $space-10;
    text-align: center;
  }

  &__heading {
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: $fw-bold;
    letter-spacing: -0.03em;
    background: linear-gradient(135deg, $text 0%, $primary-light 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: $space-3;
  }

  &__sub {
    color: $text-muted;
    font-size: $text-lg;
    max-width: 520px;
    margin: 0 auto;
  }
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: $space-10 $space-6;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: $space-6;
}

.post-card {
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius-xl;
  overflow: hidden;
  text-decoration: none;
  color: $text;
  display: flex;
  flex-direction: column;
  transition: $transition;

  &:hover {
    border-color: $primary;
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(124, 111, 255, 0.12);
  }

  &--skeleton {
    height: 320px;
    background: linear-gradient(90deg, $bg-card 25%, $bg-card-2 50%, $bg-card 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  &__thumb {
    height: 180px;
    overflow: hidden;
    background: $bg-surface;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }

    &-empty {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: $text-subtle;
    }
  }

  &:hover &__thumb img {
    transform: scale(1.03);
  }

  &__body {
    padding: $space-5;
    display: flex;
    flex-direction: column;
    gap: $space-2;
    flex: 1;
  }

  &__date {
    font-size: $text-xs;
    color: $text-subtle;
    font-family: $font-mono;
  }

  &__title {
    font-size: $text-lg;
    font-weight: $fw-semibold;
    line-height: 1.4;
    color: $text;
  }

  &__excerpt {
    font-size: $text-sm;
    color: $text-muted;
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    flex: 1;
  }

  &__cta {
    font-size: $text-sm;
    font-weight: $fw-semibold;
    color: $primary-light;
    margin-top: $space-2;
  }
}

.blog-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-4;
  padding: $space-16;
  color: $text-muted;
  font-size: $text-base;
}

.back-link {
  color: $primary-light;
  text-decoration: none;
  font-size: $text-sm;
  font-weight: $fw-medium;

  &:hover { text-decoration: underline; }
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $space-5;
  margin-top: $space-10;

  &__btn {
    padding: $space-2 $space-5;
    background: $bg-card;
    border: 1px solid $border;
    border-radius: $radius;
    color: $text-muted;
    font-size: $text-sm;
    font-weight: $fw-medium;
    cursor: pointer;
    transition: $transition;

    &:hover:not(:disabled) {
      border-color: $primary;
      color: $primary-light;
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }

  &__info {
    font-size: $text-sm;
    color: $text-subtle;
  }
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
