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
        meta: {
          title: 'DigiNode — Clínica Digital llave en mano para psicólogos, coaches y terapeutas',
          description: 'Página web profesional + 3 empleados IA que atienden a tus pacientes, gestionan tu agenda y crean tu contenido. 150€/mes, sin permanencia, tuya al completar 12 cuotas.',
        },
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
          title: 'Blog — Clínica digital para psicólogos, coaches y terapeutas | DigiNode',
          description: 'Guías y recursos para digitalizar tu consulta: captación de pacientes, gestión de agenda y marketing ético para profesionales de la salud mental.',
        },
      },
      {
        path: 'blog/:slug',
        name: 'blog.post',
        component: () => import('@/views/blog/BlogPostView.vue'),
      },
      // Rutas antiguas → home (mantienen vivos los enlaces indexados/compartidos)
      { path: 'demo', redirect: '/' },
      { path: 'plan', redirect: '/' },
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

// SEO por ruta (SPA sin SSR): título y meta description desde route.meta.
// Las vistas con necesidades más ricas (JSON-LD) lo refinan con useSeo(),
// que corre después (onMounted) y por tanto gana.
const DEFAULT_TITLE = 'DigiNode — Clínica Digital llave en mano para psicólogos, coaches y terapeutas'
const DEFAULT_DESCRIPTION = 'Página web profesional + 3 empleados IA por 150€/mes. Sin permanencia y tuya al completar 12 cuotas.'

router.afterEach((to) => {
  document.title = to.meta.title ?? DEFAULT_TITLE

  let tag = document.querySelector('meta[name="description"]')
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('name', 'description')
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', to.meta.description ?? DEFAULT_DESCRIPTION)
})

export default router
