import snapshot from './services.snapshot.json'
const clinic = snapshot.services.find((service) => service.id === 'digital_clinic')
export const SITE = 'https://midiginode.com'
export const PAGE_SEO = {
  '/': {
    title: 'Diginode — Tu departamento de marketing para microempresas y pymes',
    description:
      'Descansa, nosotros nos encargamos de todo: marca, web, publicidad, redes y mensajes, con un plan a medida. Hasta un 78 % menos que contratar a un responsable.',
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
      'Webs comerciales, catálogos y aplicaciones a medida, sin obligación de contratar marketing. Alcance, validación, propiedad y mantenimiento por escrito.',
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
