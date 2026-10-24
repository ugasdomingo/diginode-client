import snapshot from './services.snapshot.json'
const clinic = snapshot.services.find((service) => service.id === 'digital_clinic')
export const SITE = 'https://midiginode.com'
export const PAGE_SEO = {
  '/': {
    title: 'Diginode — Gestión de marca y marketing para microempresas y pymes',
    description:
      'Dirigimos y ejecutamos tu comunicación, web y campañas. Tú decides el rumbo y el presupuesto. Revisamos tu negocio para acordar una propuesta.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Diginode',
      url: SITE,
      logo: `${SITE}/logo.png`,
      description: 'Gestión de marca y marketing, webs y aplicaciones y Clínica Digital.',
    },
  },
  '/webs-y-aplicaciones': {
    title: 'Webs y aplicaciones para tu negocio | Diginode',
    description:
      'Web comercial, catálogo con presupuestos y herramientas internas. Proyectos independientes con alcance, validación, propiedad y mantenimiento acordados.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Webs y aplicaciones',
      serviceType: 'Desarrollo web y aplicaciones',
      provider: { '@type': 'Organization', name: 'Diginode' },
      url: `${SITE}/webs-y-aplicaciones`,
    },
  },
  '/clinica-digital': {
    title: 'Clínica Digital para psicólogos, coaches y terapeutas | Diginode',
    description: `Web profesional y tres empleados IA para tu consulta. ${clinic.monthly} €/mes, sin permanencia. Prueba a Nora y consulta las condiciones de Clínica Digital.`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'Clínica Digital',
      description: 'Web profesional y tres empleados IA para psicólogos, coaches y terapeutas.',
      brand: { '@type': 'Brand', name: 'Diginode' },
      offers: {
        '@type': 'Offer',
        price: clinic.monthly,
        priceCurrency: clinic.currency,
        url: `${SITE}/clinica-digital`,
        availability: 'https://schema.org/InStock',
      },
    },
  },
}
