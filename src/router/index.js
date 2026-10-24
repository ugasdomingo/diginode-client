import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router'
import { PAGE_SEO } from '@/data/pageSeo'
import { applySeo } from '@/composables/useSeo'
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
        meta: {
          ...PAGE_SEO['/'],
        },
      },
      {
        path: 'clinica-digital', name: 'clinica', component: () => import('@/views/clinica/ClinicaDigitalView.vue'), meta: PAGE_SEO['/clinica-digital'],
      },
      {
        path: 'webs-y-aplicaciones', name: 'web-apps', component: () => import('@/views/services/WebAppsView.vue'), meta: PAGE_SEO['/webs-y-aplicaciones'],
      },
      {
        path: 'es-para-mi',
        name: 'es-para-mi',
        component: () => import('@/views/home/EsParaMiView.vue'),
      },
      {
        path: 'faq',
        name: 'faq',
        component: () => import('@/views/home/FaqView.vue'),
      },
      {
        path: 'legal/terminos',
        name: 'legal.terminos',
        component: () => import('@/views/legal/TerminosView.vue'),
        meta: { title: 'Términos y condiciones | DigiNode' },
      },
      {
        path: 'legal/privacidad',
        name: 'legal.privacidad',
        component: () => import('@/views/legal/PrivacidadView.vue'),
        meta: { title: 'Política de privacidad | DigiNode' },
      },
      {
        path: 'legal/cookies',
        name: 'legal.cookies',
        component: () => import('@/views/legal/CookiesView.vue'),
        meta: {
          title: 'Política de cookies | DigiNode',
          description: 'Información sobre almacenamiento funcional, medición propia y publicidad desactivada.',
        },
      },
      {
        path: 'legal/aviso-legal',
        name: 'legal.aviso',
        component: () => import('@/views/legal/AvisoLegalView.vue'),
        meta: { title: 'Aviso legal | DigiNode' },
      },
      {
        path: 'blog',
        name: 'blog.list',
        component: () => import('@/views/blog/BlogListView.vue'),
        meta: {
          title: 'Blog de marca, marketing y negocio digital | Diginode',
          description: 'Recursos sobre marca, marketing, webs y atención comercial. Conservamos nuestras guías específicas para consultas.',
        },
      },
      {
        path: 'blog/:slug',
        name: 'blog.post',
        component: () => import('@/views/blog/BlogPostView.vue'),
      },
      // Rutas antiguas → home (mantienen vivos los enlaces indexados/compartidos)
      { path: 'demo', redirect: '/clinica-digital#demo-nora' },
      { path: 'plan', redirect: '/clinica-digital' },
      { path: 'operacion-solo', redirect: '/' },
      { path: 'despacho-digital', redirect: '/' },
      { path: 'bolsa-de-empleo', redirect: '/' },
      { path: 'cursos/:slug', redirect: '/' },
    ],
  },

  // ── Formaciones ─────────────────────────────
  // Landing autónoma: deliberadamente fuera de PublicLayout y fuera del menú.
  // Es una página de campaña con un solo objetivo, sin enlaces de fuga.
  {
    path: '/formacion/ia-para-terapeutas',
    name: 'formacion.taller-ia',
    component: () => import('@/views/formacion/TallerIaView.vue'),
    meta: {
      public: true,
      title: 'IA para Terapeutas — Taller online en directo | DigiNode',
      description: 'Taller online para psicólogos, coaches y terapeutas: automatiza tu gestión y tu marketing con empleados IA. 3 de octubre, plazas limitadas, 100€.',
    },
  },
  {
    path: '/formacion/:slug/gracias',
    name: 'formacion.gracias',
    component: () => import('@/views/formacion/GraciasView.vue'),
    meta: {
      public: true,
      title: 'Pago confirmado | DigiNode',
    },
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
        path: 'analytics',
        name: 'admin.analytics',
        component: () => import('@/views/admin/AnalyticsView.vue'),
      },
      {
        path: 'trainings',
        name: 'admin.trainings',
        component: () => import('@/views/admin/TrainingsView.vue'),
      },
      {
        path: 'leads',
        name: 'admin.leads',
        component: () => import('@/views/admin/LeadsView.vue'),
      },
      {
        path: 'funnel',
        name: 'admin.funnel',
        component: () => import('@/views/admin/FunnelView.vue'),
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
        path: 'clients',
        name: 'admin.clients',
        component: () => import('@/views/admin/ClientsView.vue'),
      },
      {
        path: 'offices',
        name: 'admin.offices',
        component: () => import('@/views/admin/OfficesHealthView.vue'),
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
        component: () => import('@/views/portal/OnboardingView.vue'),
      },
    ],
  },

  // ── 404 ────────────────────────────────────
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

export function createDiginodeRouter(memory = false) {
const router = createRouter({
  history: memory ? createMemoryHistory() : createWebHistory(),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  if (to.path === '/' && to.query.compra) return { path: '/clinica-digital', query: to.query, replace: true }
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

router.afterEach(to => {
  if (typeof document === 'undefined') return
  const path = to.path.replace(/\/+$/, '') || '/'
  applySeo({ ...PAGE_SEO['/'], ...to.meta, path, jsonLd: PAGE_SEO[path]?.jsonLd ?? null, noindex: !to.meta.public })
})
return router
}
export default createDiginodeRouter(typeof window === 'undefined')
