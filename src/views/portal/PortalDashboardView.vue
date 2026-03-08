<template>
  <div class="portal-dashboard">
    <div class="page-header">
      <div>
        <h1 class="page-title">Bienvenido</h1>
        <p class="page-subtitle">Panel de control de tus empleados IA</p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="services-grid">
      <div v-for="i in 3" :key="i" class="service-card service-card--skeleton" />
    </div>

    <template v-else>
      <!-- Services -->
      <section>
        <h2 class="section-title">Tus servicios activos</h2>

        <div v-if="services.length === 0" class="section-empty">
          <Zap :size="32" />
          <p>Sin servicios activos aún</p>
        </div>

        <div v-else class="services-grid">
          <div v-for="svc in services" :key="svc.id" class="service-card">
            <div class="service-card__icon" :style="{ background: svc.bg }">
              <component :is="svc.icon" :size="22" :style="{ color: svc.color }" />
            </div>
            <div class="service-card__body">
              <h3 class="service-card__name">{{ svc.name }}</h3>
              <p class="service-card__desc">{{ svc.description }}</p>
            </div>
            <AppBadge variant="success">Activo</AppBadge>
          </div>
        </div>
      </section>

      <!-- Plan info -->
      <AppCard class="plan-card" v-if="clientData">
        <div class="plan-card__header">
          <div>
            <h3 class="plan-card__title">Tu plan</h3>
            <p class="plan-card__plan">{{ planLabel(clientData.plan) }}</p>
          </div>
          <AppBadge :variant="statusVariant(clientData.status)">
            {{ statusLabel(clientData.status) }}
          </AppBadge>
        </div>

        <div class="plan-card__actions">
          <RouterLink to="/portal/invoices">
            <AppButton variant="secondary" size="sm">
              <FileText :size="14" />
              Ver facturas
            </AppButton>
          </RouterLink>
          <RouterLink to="/portal/support">
            <AppButton variant="secondary" size="sm">
              <LifeBuoy :size="14" />
              Soporte
            </AppButton>
          </RouterLink>
        </div>
      </AppCard>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Zap, MessageSquare, LayoutGrid, Wrench, FileText, LifeBuoy } from 'lucide-vue-next'
import { useApi } from '@/composables/useApi'
import { useToastStore } from '@/stores/toast'
import AppCard   from '@/components/ui/AppCard.vue'
import AppBadge  from '@/components/ui/AppBadge.vue'
import AppButton from '@/components/ui/AppButton.vue'

const api   = useApi()
const toast = useToastStore()

const loading    = ref(true)
const clientData = ref(null)

const serviceMap = {
  recepcionista:   { name: 'La Recepcionista', description: 'Cualifica leads en WhatsApp, Instagram y LinkedIn 24/7', icon: MessageSquare, color: '#818cf8', bg: 'rgba(129,140,248,0.1)' },
  content_manager: { name: 'El Content Manager', description: 'Genera tu grilla de contenido semanal con IA', icon: LayoutGrid, color: '#34d399', bg: 'rgba(52,211,153,0.1)' },
  ingeniero:       { name: 'El Ingeniero', description: 'Resuelve tickets de soporte técnico automáticamente', icon: Wrench, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
}

const services = computed(() => {
  if (!clientData.value?.services) return []
  return clientData.value.services
    .filter(s => serviceMap[s])
    .map(s => ({ id: s, ...serviceMap[s] }))
})

function planLabel(p) {
  return { latam: 'Plan LATAM — $149/mes', spain: 'Plan España — €249/mes' }[p] ?? p
}

function statusLabel(s) {
  return { pending: 'Pendiente', active: 'Activo', suspended: 'Suspendido', cancelled: 'Cancelado' }[s] ?? s
}

function statusVariant(s) {
  return { active: 'success', pending: 'warning', suspended: 'danger', cancelled: 'danger' }[s] ?? 'default'
}

onMounted(async () => {
  try {
    clientData.value = await api.get('/portal/services')
  } catch {
    toast.error('No se pudo cargar la información')
  } finally {
    loading.value = false
  }
})
</script>

<style lang="scss" scoped>
.portal-dashboard {
  display: flex;
  flex-direction: column;
  gap: $space-8;
}

.page-header {
  display: flex;
  flex-direction: column;
  gap: $space-1;
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

.section-title {
  font-size: $text-lg;
  font-weight: $fw-semibold;
  color: $text;
  margin-bottom: $space-4;
}

.section-empty {
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

// Services grid
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: $space-4;
}

.service-card {
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius-lg;
  padding: $space-5;
  display: flex;
  align-items: flex-start;
  gap: $space-4;
  transition: $transition;

  &:hover {
    border-color: $border-hover;
    box-shadow: $shadow-glow;
  }

  &--skeleton {
    height: 96px;
    background: linear-gradient(90deg, $bg-card 25%, $bg-card-2 50%, $bg-card 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  &__icon {
    width: 44px;
    height: 44px;
    border-radius: $radius;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__body {
    flex: 1;
  }

  &__name {
    font-size: $text-base;
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

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

// Plan card
.plan-card {
  display: flex;
  flex-direction: column;
  gap: $space-4;

  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: $space-4;
  }

  &__title {
    font-size: $text-sm;
    font-weight: $fw-medium;
    color: $text-muted;
    margin-bottom: $space-1;
  }

  &__plan {
    font-size: $text-lg;
    font-weight: $fw-semibold;
    color: $text;
  }

  &__actions {
    display: flex;
    gap: $space-3;
    flex-wrap: wrap;

    a {
      text-decoration: none;
    }
  }
}
</style>
