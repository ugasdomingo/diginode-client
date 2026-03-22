<template>
  <div class="course-page">
    <div class="container">

      <RouterLink to="/#cursos" class="back-link">
        <ArrowLeft :size="16" />
        Ver todos los cursos
      </RouterLink>

      <!-- Skeleton -->
      <div v-if="loading" class="course-skeleton">
        <div class="skeleton-title" />
        <div class="skeleton-meta" />
        <div class="skeleton-thumb" />
        <div class="skeleton-body" />
      </div>

      <!-- Not found -->
      <div v-else-if="!course" class="course-notfound">
        <h2>Curso no encontrado</h2>
        <RouterLink to="/#cursos" class="back-link">← Ver todos los cursos</RouterLink>
      </div>

      <!-- Course content -->
      <article v-else class="course-article">
        <header class="course-article__header">
          <div class="course-article__badges">
            <span class="badge badge--active" v-if="course.active">Disponible</span>
            <span class="badge badge--waitlist" v-else>Lista de espera</span>
            <span v-if="course.start_date" class="badge badge--date">
              <Calendar :size="12" />
              {{ formatDate(course.start_date) }}
            </span>
          </div>

          <h1 class="course-article__title">{{ course.title }}</h1>

          <p v-if="course.description" class="course-article__excerpt">
            {{ course.description }}
          </p>

          <div class="course-article__price-row">
            <span class="course-article__price">{{ course.price }}€</span>
            <a
              v-if="course.active"
              :href="calLink"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-primary"
            >
              <CalendarCheck :size="16" />
              Reservar mi plaza
            </a>
            <button v-else class="btn-waitlist" @click="showWaitlist = true">
              <Bell :size="16" />
              Apuntarme a la lista de espera
            </button>
          </div>
        </header>

        <div v-if="course.thumbnail_url" class="course-article__thumb">
          <img :src="course.thumbnail_url" :alt="course.title" />
        </div>

        <div v-if="course.content" class="course-article__content prose" v-html="course.content" />

        <!-- Bottom CTA -->
        <div class="course-article__cta-bottom">
          <a
            v-if="course.active"
            :href="calLink"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-primary btn-primary--lg"
          >
            <CalendarCheck :size="18" />
            Reservar mi plaza — {{ course.price }}€
          </a>
          <button v-else class="btn-waitlist btn-waitlist--lg" @click="showWaitlist = true">
            <Bell :size="18" />
            Apuntarme a la lista de espera
          </button>
        </div>

        <footer class="course-article__footer">
          <RouterLink to="/#cursos" class="back-link">
            <ArrowLeft :size="16" />
            Ver todos los cursos
          </RouterLink>
        </footer>
      </article>

    </div>

    <!-- Waitlist modal -->
    <Transition name="modal">
      <div v-if="showWaitlist" class="modal-backdrop" @click.self="showWaitlist = false">
        <div class="modal">
          <button class="modal__close" @click="showWaitlist = false" aria-label="Cerrar">
            <X :size="18" />
          </button>
          <h3 class="modal__title">Lista de espera</h3>
          <p class="modal__desc">
            Te avisamos cuando el curso esté disponible. Sin compromiso.
          </p>

          <div v-if="waitlistSent" class="modal__success">
            <CheckCircle :size="32" />
            <p>¡Apuntado! Te avisamos en cuanto abramos plazas.</p>
          </div>

          <form v-else class="modal__form" @submit.prevent="submitWaitlist">
            <div class="field">
              <label class="field__label">Nombre</label>
              <input v-model="wForm.name" type="text" class="field__input" placeholder="Tu nombre" required />
            </div>
            <div class="field">
              <label class="field__label">Email</label>
              <input v-model="wForm.email" type="email" class="field__input" placeholder="tu@email.com" required />
            </div>
            <div class="field">
              <label class="field__label">Teléfono</label>
              <input v-model="wForm.phone" type="tel" class="field__input" placeholder="+34 600 000 000" />
            </div>
            <button type="submit" class="btn-primary" :disabled="wLoading">
              <span v-if="wLoading">Enviando...</span>
              <span v-else>Apuntarme</span>
            </button>
            <p v-if="wError" class="modal__error">{{ wError }}</p>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, Calendar, CalendarCheck, Bell, X, CheckCircle } from 'lucide-vue-next'

const route  = useRoute()
const course  = ref(null)
const loading = ref(true)

const calLink = import.meta.env.VITE_CAL_BOOKING_LINK

const showWaitlist = ref(false)
const waitlistSent = ref(false)
const wLoading = ref(false)
const wError   = ref('')
const wForm    = ref({ name: '', email: '', phone: '' })

function formatDate(d) {
  return new Date(d).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
}

onMounted(async () => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/courses/${route.params.slug}`
    ).then(r => r.json())
    course.value = res.data ?? null
  } catch {
    course.value = null
  } finally {
    loading.value = false
  }
})

async function submitWaitlist() {
  wError.value = ''
  if (!wForm.value.name || !wForm.value.email) {
    wError.value = 'Nombre y email son obligatorios'
    return
  }
  wLoading.value = true
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/courses/${route.params.slug}/waitlist`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wForm.value),
      }
    ).then(r => r.json())

    if (!res.success) {
      wError.value = res.message === 'Already on waitlist'
        ? 'Ya estás en la lista de espera con este email.'
        : (res.message ?? 'Error al apuntarte')
      return
    }
    waitlistSent.value = true
  } catch {
    wError.value = 'Error de conexión. Inténtalo de nuevo.'
  } finally {
    wLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
.course-page {
  min-height: 100vh;
  padding: $space-10 0 $space-16;
}

.container {
  max-width: 780px;
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

// Badges
.badge {
  display: inline-flex;
  align-items: center;
  gap: $space-1;
  padding: 3px 10px;
  border-radius: $radius-full;
  font-size: $text-xs;
  font-weight: $fw-semibold;

  &--active   { background: rgba(52,211,153,0.12); color: #34d399; border: 1px solid rgba(52,211,153,0.25); }
  &--waitlist { background: rgba(245,158,11,0.12); color: #f59e0b; border: 1px solid rgba(245,158,11,0.25); }
  &--date     { background: $bg-card; color: $text-muted; border: 1px solid $border; }
}

// Article
.course-article {
  &__header {
    margin-bottom: $space-8;
  }

  &__badges {
    display: flex;
    align-items: center;
    gap: $space-2;
    margin-bottom: $space-4;
  }

  &__title {
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    font-weight: $fw-bold;
    letter-spacing: -0.02em;
    line-height: 1.25;
    margin-bottom: $space-4;
  }

  &__excerpt {
    font-size: $text-lg;
    color: $text-muted;
    line-height: 1.6;
    margin-bottom: $space-6;
  }

  &__price-row {
    display: flex;
    align-items: center;
    gap: $space-4;
    flex-wrap: wrap;
  }

  &__price {
    font-size: $text-3xl;
    font-weight: $fw-bold;
    color: $text;
    font-variant-numeric: tabular-nums;
  }

  &__thumb {
    border-radius: $radius-xl;
    overflow: hidden;
    margin-bottom: $space-8;
    max-height: 460px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__cta-bottom {
    margin-top: $space-10;
    padding: $space-8;
    background: $bg-card;
    border: 1px solid $border;
    border-radius: $radius-xl;
    display: flex;
    justify-content: center;
  }

  &__footer {
    margin-top: $space-10;
    padding-top: $space-6;
    border-top: 1px solid $border;
  }
}

// CTAs
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: $space-2;
  padding: $space-3 $space-6;
  background: $primary;
  color: #fff;
  font-weight: $fw-semibold;
  font-size: $text-sm;
  border-radius: $radius;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: $transition-fast;

  &:hover { background: $primary-light; }

  &--lg {
    padding: $space-4 $space-8;
    font-size: $text-base;
    border-radius: $radius-lg;
  }
}

.btn-waitlist {
  display: inline-flex;
  align-items: center;
  gap: $space-2;
  padding: $space-3 $space-6;
  background: rgba(245,158,11,0.1);
  color: #f59e0b;
  font-weight: $fw-semibold;
  font-size: $text-sm;
  border-radius: $radius;
  border: 1px solid rgba(245,158,11,0.3);
  cursor: pointer;
  transition: $transition-fast;

  &:hover { background: rgba(245,158,11,0.18); }

  &--lg {
    padding: $space-4 $space-8;
    font-size: $text-base;
    border-radius: $radius-lg;
  }
}

// Prose (reutiliza mismos estilos que BlogPostView)
.prose {
  font-size: $text-base;
  line-height: 1.8;
  color: $text-muted;
  margin-bottom: $space-8;

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
  :deep(p)  { margin-bottom: 1.25em; }

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

  :deep(img) {
    max-width: 100%;
    border-radius: $radius;
    margin: 1.5em 0;
  }
}

// Skeleton
.course-skeleton {
  display: flex;
  flex-direction: column;
  gap: $space-4;

  .skeleton-title  { height: 48px; border-radius: $radius; width: 80%; }
  .skeleton-meta   { height: 18px; border-radius: $radius; width: 40%; }
  .skeleton-thumb  { height: 340px; border-radius: $radius-xl; }
  .skeleton-body   { height: 320px; border-radius: $radius; }

  [class^="skeleton-"] {
    background: linear-gradient(90deg, $bg-card 25%, $bg-card-2 50%, $bg-card 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
}

.course-notfound {
  text-align: center;
  padding: $space-16;
  color: $text-muted;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-4;
}

// Modal
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(8, 8, 26, 0.75);
  backdrop-filter: blur(4px);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $space-4;
}

.modal {
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius-xl;
  padding: $space-8;
  width: 100%;
  max-width: 420px;
  position: relative;

  &__close {
    position: absolute;
    top: $space-4;
    right: $space-4;
    background: none;
    border: none;
    color: $text-muted;
    cursor: pointer;
    padding: $space-1;
    border-radius: $radius;
    transition: $transition-fast;

    &:hover { color: $text; }
  }

  &__title {
    font-size: $text-xl;
    font-weight: $fw-bold;
    margin-bottom: $space-2;
  }

  &__desc {
    font-size: $text-sm;
    color: $text-muted;
    margin-bottom: $space-6;
    line-height: 1.5;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: $space-4;
  }

  &__success {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $space-3;
    padding: $space-6 0;
    color: #34d399;
    text-align: center;
    font-size: $text-sm;
    font-weight: $fw-medium;
  }

  &__error {
    font-size: $text-xs;
    color: $danger;
    margin-top: $space-1;
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
    &:focus { border-color: $primary; box-shadow: 0 0 0 3px $primary-glow; }
  }
}

.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
