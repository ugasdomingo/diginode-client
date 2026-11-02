import snapshot from './services.snapshot.json'
const clinic = snapshot.services.find((service) => service.id === 'digital_clinic')
export const SITE = 'https://midiginode.com'
export const PAGE_SEO = {
  '/': {
    title: 'Diginode — Tu departamento de marketing para microempresas y pymes',
    description:
      '¿Tu marketing no se nota en tus ingresos? Unimos redes, anuncios, web, tu local y el boca a boca en un solo plan para traerte clientes. Descansa, nosotros nos encargamos de todo.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Diginode',
      url: SITE,
      logo: `${SITE}/logo.png`,
      slogan: 'Descansa, nosotros nos encargamos de todo.',
      description: 'Departamento de marketing externo para microempresas y pymes, creación de webs y Clínica Digital.',
    },
  },
  '/webs-y-aplicaciones': {
    title: 'Creación de páginas web para vender desde 1.900 € | Diginode',
    description:
      'Diseñamos y construimos a medida la web que tu negocio necesita para vender. Sin plantillas y tuya desde el primer día. Desde 1.900 € + IVA.',
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
    description: `Tu web profesional y tres asistentes con IA que atienden, agendan y publican por ti. ${clinic.setup} € de instalación y ${clinic.monthly} €/mes, sin permanencia. Prueba a Nora.`,
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
