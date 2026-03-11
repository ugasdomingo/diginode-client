<template>
  <div class="post-page">
    <div class="container">

      <RouterLink to="/blog" class="back-link">
        <ArrowLeft :size="16" />
        Volver al blog
      </RouterLink>

      <div v-if="loading" class="post-skeleton">
        <div class="skeleton-title" />
        <div class="skeleton-meta" />
        <div class="skeleton-thumb" />
        <div class="skeleton-body" />
      </div>

      <div v-else-if="!post" class="post-notfound">
        <h2>Artículo no encontrado</h2>
        <RouterLink to="/blog" class="back-link">← Ver todos los artículos</RouterLink>
      </div>

      <article v-else class="post-article">
        <header class="post-article__header">
          <h1 class="post-article__title">{{ post.title }}</h1>
          <p class="post-article__meta">
            Publicado el {{ formatDate(post.published_at) }}
          </p>
        </header>

        <div v-if="post.thumbnail_url" class="post-article__thumb">
          <img :src="post.thumbnail_url" :alt="post.title" />
        </div>

        <div class="post-article__content prose" v-html="post.content" />

        <footer class="post-article__footer">
          <RouterLink to="/blog" class="back-link">
            <ArrowLeft :size="16" />
            Ver todos los artículos
          </RouterLink>
        </footer>
      </article>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'

const route   = useRoute()
const post    = ref(null)
const loading = ref(true)

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
}

onMounted(async () => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/blog/${route.params.slug}`
    ).then(r => r.json())
    post.value = res.data ?? null
  } catch {
    post.value = null
  } finally {
    loading.value = false
  }
})
</script>

<style lang="scss" scoped>
.post-page {
  min-height: 100vh;
  padding: $space-10 0 $space-16;
}

.container {
  max-width: 740px;
  margin: 0 auto;
  padding: 0 $space-6;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: $space-2;
  font-size: $text-sm;
  font-weight: $fw-medium;
  color: $text-muted;
  text-decoration: none;
  margin-bottom: $space-8;
  transition: $transition-fast;

  &:hover { color: $primary-light; }
}

// Article
.post-article {
  &__header {
    margin-bottom: $space-8;
  }

  &__title {
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    font-weight: $fw-bold;
    letter-spacing: -0.02em;
    line-height: 1.25;
    margin-bottom: $space-3;
  }

  &__meta {
    font-size: $text-sm;
    color: $text-subtle;
    font-family: $font-mono;
  }

  &__thumb {
    border-radius: $radius-xl;
    overflow: hidden;
    margin-bottom: $space-8;
    max-height: 420px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__footer {
    margin-top: $space-12;
    padding-top: $space-6;
    border-top: 1px solid $border;
  }
}

// Prose — styles for TinyMCE HTML content
.prose {
  font-size: $text-base;
  line-height: 1.8;
  color: $text-muted;

  :deep(h1), :deep(h2), :deep(h3), :deep(h4) {
    color: $text;
    font-weight: $fw-semibold;
    line-height: 1.3;
    margin-top: 1.75em;
    margin-bottom: 0.5em;
  }

  :deep(h2) { font-size: $text-2xl; }
  :deep(h3) { font-size: $text-xl; }
  :deep(h4) { font-size: $text-lg; }

  :deep(p) { margin-bottom: 1.25em; }

  :deep(a) {
    color: $primary-light;
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  :deep(strong) { color: $text; font-weight: $fw-semibold; }

  :deep(ul), :deep(ol) {
    padding-left: 1.5em;
    margin-bottom: 1.25em;
  }

  :deep(li) { margin-bottom: 0.4em; }

  :deep(blockquote) {
    border-left: 3px solid $primary;
    padding-left: $space-4;
    margin: 1.5em 0;
    color: $text-subtle;
    font-style: italic;
  }

  :deep(code) {
    background: $bg-surface;
    padding: 0.1em 0.4em;
    border-radius: 4px;
    font-family: $font-mono;
    font-size: 0.9em;
  }

  :deep(pre) {
    background: $bg-surface;
    border: 1px solid $border;
    border-radius: $radius;
    padding: $space-4;
    overflow-x: auto;
    margin-bottom: 1.25em;

    code {
      background: none;
      padding: 0;
    }
  }

  :deep(img) {
    max-width: 100%;
    border-radius: $radius;
    margin: 1.5em 0;
  }

  :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1.25em;
    font-size: $text-sm;
  }

  :deep(th), :deep(td) {
    padding: $space-2 $space-3;
    border: 1px solid $border;
    text-align: left;
  }

  :deep(th) {
    background: $bg-surface;
    font-weight: $fw-semibold;
    color: $text;
  }
}

// Skeleton
.post-skeleton {
  display: flex;
  flex-direction: column;
  gap: $space-4;

  .skeleton-title {
    height: 48px;
    border-radius: $radius;
    width: 80%;
  }

  .skeleton-meta {
    height: 18px;
    border-radius: $radius;
    width: 30%;
  }

  .skeleton-thumb {
    height: 300px;
    border-radius: $radius-xl;
  }

  .skeleton-body {
    height: 320px;
    border-radius: $radius;
  }

  [class^="skeleton-"] {
    background: linear-gradient(90deg, $bg-card 25%, $bg-card-2 50%, $bg-card 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
}

.post-notfound {
  text-align: center;
  padding: $space-16;
  color: $text-muted;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-4;
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
