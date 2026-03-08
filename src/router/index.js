import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { public: true },
  },

  // Admin routes
  {
    path: '/admin',
    component: () => import('@/components/layout/AppLayout.vue'),
    meta: { role: 'admin' },
    children: [
      {
        path: '',
        redirect: '/admin/dashboard',
      },
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

  // Portal routes
  {
    path: '/portal',
    component: () => import('@/components/layout/AppLayout.vue'),
    meta: { role: 'client' },
    children: [
      {
        path: '',
        redirect: '/portal/dashboard',
      },
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

  // Redirect root
  { path: '/', redirect: '/login' },

  // 404
  { path: '/:pathMatch(.*)*', redirect: '/login' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
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
