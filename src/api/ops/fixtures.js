/** Datos de demostración. No hay secretos reales: la bóveda los guarda aparte. */

export const DEMO_MFA_CODE = '482913'
export const DEMO_CLIENT_ID = '64b0000000000000000000a1'

export const DEMO_ACCOUNTS = [
  {
    email: 'domingo@midiginode.com',
    password: 'Madrid-2026',
    role: 'admin',
    client_id: null,
  },
  {
    email: 'lucia@aireyoga.test',
    password: 'Aire-2026',
    role: 'client',
    client_id: DEMO_CLIENT_ID,
  },
]

const AIRE = DEMO_CLIENT_ID
const LAMA = '64b0000000000000000000a2'

function row(id, fields) {
  return {
    id,
    _id: id,
    created_at: '2026-10-01T09:00:00.000Z',
    updated_at: '2026-10-30T09:00:00.000Z',
    ...fields,
  }
}

export function createFixtures() {
  const leads = [
    row('64b0000000000000000000b1', {
      name: 'Nuria Gil',
      company: 'Peluquería Nuria',
      business: 'Peluquería Nuria',
      email: 'nuria@peluquerianuria.test',
      phone: '+34 611 203 441',
      country: 'España',
      origin_detail: 'Carabanchel',
      pipeline_status: 'nuevo',
      service_interest: 'brand_management',
      goal: 'Quiere que las clientas reserven por Instagram sin contestar ella a cada mensaje.',
      next_action: 'Llamar el lunes 2 de noviembre, 10:30',
      next_action_at: '2026-11-02T09:30:00.000Z',
      updated_at: '2026-10-31T16:10:00.000Z',
      activity: [
        {
          id: '64b000000000000000000101',
          _id: '64b000000000000000000101',
          type: 'siguiente_accion',
          summary: 'Dejó el teléfono en el formulario. Todavía no la hemos llamado.',
          at: '2026-10-31T16:10:00.000Z',
          actor: 'domingo@midiginode.com',
        },
      ],
    }),
    row('64b0000000000000000000b2', {
      name: 'Héctor Lama',
      company: 'Reformas Lama',
      business: 'Reformas Lama',
      email: 'hector@reformaslama.test',
      phone: '+34 622 118 903',
      country: 'España',
      origin_detail: 'Vallecas',
      pipeline_status: 'contactado',
      service_interest: 'web_project',
      goal: 'Pedir obras con fotos de antes y después.',
      next_action: 'Si no contesta, llamar el miércoles 4',
      next_action_at: '2026-11-04T10:00:00.000Z',
      updated_at: '2026-10-29T11:20:00.000Z',
      activity: [
        {
          id: '64b000000000000000000102',
          _id: '64b000000000000000000102',
          type: 'mensaje_enviado',
          summary: 'WhatsApp con dos ejemplos de reformas en Madrid.',
          at: '2026-10-29T11:20:00.000Z',
          actor: 'domingo@midiginode.com',
        },
      ],
    }),
    row('64b0000000000000000000b3', {
      name: 'Javier Soto',
      company: 'Taller Sol',
      business: 'Taller Sol',
      email: 'javier@tallersol.test',
      phone: '+34 610 552 778',
      country: 'España',
      origin_detail: 'Usera',
      pipeline_status: 'respondio',
      service_interest: 'digital_clinic',
      goal: 'Recordatorios de ITV. Ahora se le olvidan en una libreta.',
      next_action: 'Pasarse el viernes 6, a las 9:00, antes de abrir',
      next_action_at: '2026-11-06T08:00:00.000Z',
      updated_at: '2026-10-30T18:40:00.000Z',
      activity: [
        {
          id: '64b000000000000000000103',
          _id: '64b000000000000000000103',
          type: 'mensaje_enviado',
          summary: 'Propuesta corta: recordatorios por WhatsApp.',
          at: '2026-10-28T09:05:00.000Z',
          actor: 'domingo@midiginode.com',
        },
        {
          id: '64b000000000000000000104',
          _id: '64b000000000000000000104',
          type: 'respuesta',
          summary: 'Quiere verlo en el taller el viernes a primera hora.',
          at: '2026-10-30T18:40:00.000Z',
          actor: 'javier@tallersol.test',
        },
      ],
    }),
    row('64b0000000000000000000b4', {
      name: 'Belén García',
      company: 'Floristería Belén',
      business: 'Floristería Belén',
      email: 'belen@floristeriabelen.test',
      phone: '+34 655 441 220',
      country: 'España',
      origin_detail: 'Lavapiés',
      pipeline_status: 'reunion_visita',
      service_interest: 'brand_management',
      goal: 'Encargos del mismo día y un Instagram que no parezca de banco de fotos.',
      next_action: 'Visita el jueves 5 de noviembre, 17:00',
      next_action_at: '2026-11-05T16:00:00.000Z',
      activity: [
        {
          id: '64b000000000000000000105',
          _id: '64b000000000000000000105',
          type: 'pieza_enviada',
          summary: 'Boceto de historia: ramo de temporada y el precio escrito a mano.',
          at: '2026-10-30T08:30:00.000Z',
          actor: 'contenido',
        },
      ],
    }),
    row('64b0000000000000000000b5', {
      name: 'Ana Ruiz',
      company: 'Estudio Ana',
      business: 'Estudio Ana',
      pipeline_status: 'analizado',
      country: 'España',
      service_interest: 'undecided',
      goal: 'Todavía no ha elegido entre la web y la gestión mensual.',
      next_action: 'Mandarle las dos opciones por escrito',
      activity: [],
    }),
    row('64b0000000000000000000b6', {
      name: 'Pedro Gil',
      company: 'Panadería Gil',
      business: 'Panadería Gil',
      pipeline_status: 'pieza_lista',
      country: 'España',
      goal: 'Una pieza de muestra del pan del sábado, lista para que Domingo la mire.',
      next_action: 'Revisar la pieza antes de enviarla',
      activity: [],
    }),
    row('64b0000000000000000000b7', {
      name: 'Marta León',
      company: 'Clínica León',
      business: 'Clínica León',
      pipeline_status: 'pendiente_de_aprobacion',
      country: 'España',
      goal: 'La muestra ya está en la cola de aprobación.',
      activity: [],
    }),
    row('64b0000000000000000000b8', {
      name: 'Lucía Aire',
      company: 'Estudio Aire',
      business: 'Estudio Aire',
      pipeline_status: 'ganado',
      country: 'España',
      goal: 'Ya es clienta. El trabajo sigue en el portal.',
      activity: [],
    }),
    row('64b0000000000000000000b9', {
      name: 'Óscar Vega',
      company: 'Fontanería Vega',
      business: 'Fontanería Vega',
      pipeline_status: 'perdido',
      country: 'España',
      goal: 'Dijo que este año no.',
      activity: [
        {
          id: '64b000000000000000000106',
          _id: '64b000000000000000000106',
          type: 'nota',
          summary: 'No sigue por ahora. No insistir este trimestre.',
          at: '2026-10-20T12:00:00.000Z',
          actor: 'domingo@midiginode.com',
        },
      ],
    }),
  ]

  const clients = [
    row(AIRE, {
      name: 'Lucía Aire',
      company: 'Estudio Aire',
      email: 'lucia@aireyoga.test',
      country: 'España',
      plan: 'individual',
      status: 'active',
      service_package: 'Gestión de marca',
      brand: { name: 'Estudio Aire', city: 'Madrid', sector: 'Yoga' },
      kpis: [
        { name: 'Clases reservadas', value: '38', unit: 'reservas', period: '2026-10' },
      ],
      strategy_links: [
        { label: 'Guía de voz', url: 'https://docs.google.com/document/d/aire-voz' },
      ],
      created_at: '2026-06-02T09:00:00.000Z',
    }),
    row(LAMA, {
      name: 'Héctor Lama',
      company: 'Reformas Lama',
      email: 'hector@reformaslama.test',
      country: 'España',
      plan: 'estudio',
      status: 'active',
      service_package: 'Web y contenidos',
      brand: { city: 'Vallecas' },
      kpis: [],
      strategy_links: [],
      created_at: '2026-09-12T09:00:00.000Z',
    }),
  ]

  const pieces = [
    row('64b0000000000000000000c1', {
      client_id: AIRE,
      type: 'reel',
      title: 'Reel de la clase del jueves',
      drive_url: 'https://drive.google.com/file/d/aire-reel/view',
      status: 'en_revision',
      version: 1,
      author_bot: 'contenido',
      versions: [{ version: 1, drive_url: 'https://drive.google.com/file/d/aire-reel/view', note: 'Clase en la sala grande, sin música de fondo.', created_by: 'contenido' }],
      updated_at: '2026-11-03T17:00:00.000Z',
    }),
    row('64b0000000000000000000c2', {
      client_id: LAMA,
      type: 'post',
      title: 'Antes y después, calle del Pico',
      drive_url: 'https://drive.google.com/file/d/lama-post/view',
      status: 'borrador',
      version: 2,
      author_bot: 'contenido',
      versions: [
        { version: 2, drive_url: 'https://drive.google.com/file/d/lama-post/view', note: 'El cliente pidió menos texto.', created_by: 'contenido' },
      ],
      updated_at: '2026-11-04T09:00:00.000Z',
    }),
    row('64b0000000000000000000c3', {
      client_id: AIRE,
      type: 'story',
      title: 'Historia de los horarios',
      drive_url: 'https://docs.google.com/document/d/aire-horarios',
      status: 'aprobado',
      version: 1,
      versions: [{ version: 1, note: 'Horario de noviembre.', created_by: 'contenido' }],
    }),
  ]

  const approvals = [
    row('64b0000000000000000000d1', {
      piece_id: '64b0000000000000000000c1',
      client_id: AIRE,
      mode: 'dos_fases',
      status: 'pendiente_cliente',
      round: 1,
      author_bot: 'contenido',
      audit: [{ at: '2026-10-28T17:00:00.000Z', actor_type: 'admin', action: 'aprobada_domingo', actor_label: 'domingo@midiginode.com' }],
    }),
    row('64b0000000000000000000d2', {
      piece_id: '64b0000000000000000000c2',
      client_id: LAMA,
      mode: 'dos_fases',
      status: 'pendiente_domingo',
      round: 2,
      author_bot: 'contenido',
      audit: [
        { at: '2026-10-27T11:00:00.000Z', actor_type: 'client', action: 'rechazada_cliente', comment: 'Demasiado texto. Que se vea la obra.', actor_label: 'hector@reformaslama.test' },
        { at: '2026-10-29T09:00:00.000Z', actor_type: 'bot', action: 'reenviada', actor_label: 'contenido' },
      ],
    }),
    row('64b0000000000000000000d3', {
      piece_id: '64b0000000000000000000c3',
      client_id: AIRE,
      mode: 'dos_fases',
      status: 'aprobado',
      round: 1,
      audit: [{ at: '2026-10-20T10:00:00.000Z', actor_type: 'client', action: 'aprobada_cliente' }],
    }),
  ]

  const reports = [
    row('64b0000000000000000000e1', {
      client_id: AIRE,
      period: '2026-10',
      title: 'Octubre en Estudio Aire',
      drive_url: 'https://docs.google.com/document/d/aire-octubre',
      status: 'enviado',
    }),
    row('64b0000000000000000000e2', {
      client_id: AIRE,
      period: '2026-11',
      title: 'Noviembre, todavía en borrador',
      drive_url: 'https://docs.google.com/document/d/aire-noviembre',
      status: 'borrador',
    }),
  ]

  const meetings = [
    row('64b0000000000000000000f1', {
      client_id: AIRE,
      title: 'Revisión de noviembre',
      starts_at: '2026-11-12T10:00:00.000Z',
      ends_at: '2026-11-12T10:30:00.000Z',
      location: 'Videollamada',
      notes: 'Mirar el reel del jueves y las reservas.',
      status: 'programada',
    }),
    row('64b0000000000000000000f2', {
      client_id: AIRE,
      title: 'Puesta en marcha',
      starts_at: '2026-09-04T09:00:00.000Z',
      location: 'Estudio, calle de Argumosa',
      status: 'hecha',
      notes: '',
    }),
  ]

  const invoices = [
    row('64b0000000000000000000aa', {
      client_id: AIRE,
      concept: 'Gestión de marca, octubre',
      amount_eur: 640,
      currency: 'EUR',
      status: 'pendiente',
      payment_url: 'https://checkout.stripe.com/c/pay/cs_test_aire_octubre',
      stripe_session_id: 'cs_test_aire_octubre',
    }),
    row('64b0000000000000000000ab', {
      client_id: LAMA,
      concept: 'Primera pieza de muestra',
      amount_eur: 180,
      currency: 'EUR',
      status: 'pendiente',
      payment_url: '',
    }),
    row('64b0000000000000000000ac', {
      client_id: AIRE,
      concept: 'Gestión de marca, septiembre',
      amount_eur: 640,
      currency: 'EUR',
      status: 'pagada',
      paid_at: '2026-09-28T12:00:00.000Z',
    }),
  ]

  const credentialId = '64b0000000000000000000c0'
  const credentials = [
    row(credentialId, {
      client_id: AIRE,
      provider: 'meta_business',
      label: 'Instagram de Estudio Aire',
    }),
  ]

  return {
    challenges: {},
    leads,
    clients,
    pieces,
    approvals,
    reports,
    meetings,
    invoices,
    credentials,
    secrets: { [credentialId]: 'clave-de-demostracion' },
  }
}
