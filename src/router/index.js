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
      {
        path: 'blog',
        name: 'blog.list',
        component: () => import('@/views/blog/BlogListView.vue'),
      },
      {
        path: 'blog/:slug',
        name: 'blog.post',
        component: () => import('@/views/blog/BlogPostView.vue'),
      },
      {
        path: 'cursos/:slug',
        name: 'course.detail',
        component: () => import('@/views/courses/CourseDetailView.vue'),
      },
      {
        path: 'bolsa-de-empleo',
        name: 'bolsa',
        component: () => import('@/views/home/BolsaEmpleoView.vue'),
      },
      {
        path: 'operacion-solo',
        name: 'operacion-solo',
        component: () => import('@/views/home/OperacionSoloView.vue'),
      },
      {
        path: 'despacho-digital',
        redirect: '/operacion-solo',
      },
    ],
  },

  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { public: true },
  },

  {
    path: '/cambiar-contrasena',
    name: 'change-password',
    component: () => import('@/views/auth/ChangePasswordView.vue'),
    meta: { requiresAuth: true },
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
      {
        path: 'blog',
        name: 'admin.blog',
        component: () => import('@/views/admin/BlogView.vue'),
      },
      {
        path: 'courses',
        name: 'admin.courses',
        component: () => import('@/views/admin/CoursesView.vue'),
      },
      {
        path: 'packages',
        name: 'admin.packages',
        component: () => import('@/views/admin/PackagesView.vue'),
      },
      {
        path: 'clients',
        name: 'admin.clients',
        component: () => import('@/views/admin/ClientsView.vue'),
      },
      {
        path: 'knowledge',
        name: 'admin.knowledge',
        component: () => import('@/views/admin/KnowledgeView.vue'),
      },
      {
        path: 'conversaciones',
        name: 'admin.conversaciones',
        component: () => import('@/views/admin/ConversacionesView.vue'),
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
      {
        path: 'onboarding',
        name: 'portal.onboarding',
        redirect: '/portal/dashboard',
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

  // Force password change before accessing any protected route (except the change-password page itself)
  if (auth.mustChangePassword && to.name !== 'change-password') {
    return { name: 'change-password' }
  }

  if (to.meta.role === 'admin' && !auth.isAdmin) {
    return auth.isClient ? { path: '/portal' } : { name: 'login' }
  }

  if (to.meta.role === 'client' && !auth.isClient) {
    return auth.isAdmin ? { path: '/admin' } : { name: 'login' }
  }

  return true
})

export default router
