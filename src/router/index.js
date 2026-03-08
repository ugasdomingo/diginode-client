import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  // ── Public routes ──────────────────────────
  {
    path: '/',
    component: () => import('@/components/layout/PublicLayout.vue'),
    meta: { public: true },
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/home/HomeView.vue'),
      },
      {
        path: 'legal/terminos',
        name: 'legal.terminos',
        component: () => import('@/views/legal/TerminosView.vue'),
      },
      {
        path: 'legal/privacidad',
        name: 'legal.privacidad',
        component: () => import('@/views/legal/PrivacidadView.vue'),
      },
      {
        path: 'legal/aviso-legal',
        name: 'legal.aviso',
        component: () => import('@/views/legal/AvisoLegalView.vue'),
      },
    ],
  },

  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { public: true },
  },

  // ── Admin routes ────────────────────────────
  {
    path: '/admin',
    component: () => import('@/components/layout/AppLayout.vue'),
    meta: { role: 'admin' },
    children: [
      { path: '', redirect: '/admin/dashboard' },
      {
        path: 'dashboard',
        name: 'admin.dashboard',
        component: () => import('@/views/admin/DashboardView.vue'),
      },
      {
        path: 'leads',
        name: 'admin.leads',
        component: () => import('@/views/admin/LeadsView.vue'),
      },
      {
        path: 'content',
        name: 'admin.content',
        component: () => import('@/views/admin/ContentView.vue'),
      },
      {
        path: 'sales',
        name: 'admin.sales',
        component: () => import('@/views/admin/SalesView.vue'),
      },
    ],
  },

  // ── Portal routes ───────────────────────────
  {
    path: '/portal',
    component: () => import('@/components/layout/AppLayout.vue'),
    meta: { role: 'client' },
    children: [
      { path: '', redirect: '/portal/dashboard' },
      {
        path: 'dashboard',
        name: 'portal.dashboard',
        component: () => import('@/views/portal/PortalDashboardView.vue'),
      },
      {
        path: 'invoices',
        name: 'portal.invoices',
        component: () => import('@/views/portal/InvoicesView.vue'),
      },
      {
        path: 'support',
        name: 'portal.support',
        component: () => import('@/views/portal/SupportView.vue'),
      },
    ],
  },

  // ── 404 ────────────────────────────────────
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.public) return true

  if (!auth.isAuthenticated) return { name: 'login' }

  if (to.meta.role === 'admin' && !auth.isAdmin) {
    return auth.isClient ? { path: '/portal' } : { name: 'login' }
  }

  if (to.meta.role === 'client' && !auth.isClient) {
    return auth.isAdmin ? { path: '/admin' } : { name: 'login' }
  }

  return true
})

export default router
