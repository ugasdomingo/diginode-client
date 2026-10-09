# Diginode: producto y empresa de una persona

Propuesta de trabajo del 9 de octubre de 2026, basada en las respuestas del fundador y en una revisión de código. No cambia precios publicados, suscripciones ni servicios desplegados. Los precios y límites siguientes son hipótesis comerciales para validar con un piloto.

## 1. Producto único

**Diginode — tu consulta operativa, con un asistente y sus departamentos.** Una web con la marca del profesional, panel privado y asistente capaz de ejecutar tareas de recepción, agenda, administración, marketing y supervisión. El profesional presta el servicio, aprueba contenidos y excepciones; Diginode opera la infraestructura.

Una identidad de asistente visible; herramientas y permisos distintos por departamento. Los nombres Nora, Alex y Valeria pueden mantenerse internamente, pero no son productos separados. El resultado vendible es un sistema funcionando y medible, no un chat que recomienda qué hacer.

La cuenta de Diginode usa el mismo núcleo que las consultas. Cambia su configuración: catálogo de servicios, lenguaje, preguntas frecuentes, canales, agenda y reglas de escalado. La automatización que despliega nuevas consultas es una función interna de Diginode, no una herramienta accesible a clientes.

Primera versión para profesionales individuales que atienden en español. LATAM es un conjunto de mercados: validar primero el país de la psicóloga y España. Cobrar en una moneda explícita; los importes en otras monedas requieren configuración de cobro y validación antes de publicarse.

## 2. Departamentos y resultado esperado

| Departamento | Ejecución del sistema | Responsabilidad humana |
| --- | --- | --- |
| Recepción y comercial | Responder información aprobada, registrar interesados, recoger datos mínimos, ofrecer reserva o asesoría, dar seguimiento autorizado | Resolver excepciones y cerrar ventas que necesitan conversación |
| Agenda y operaciones | Consultar disponibilidad real, reservar, cambiar y cancelar citas, enviar confirmaciones y recordatorios | Definir horarios y políticas, atender las citas |
| Administración y cobros | Enlaces de pago, sincronización de estados, avisos de impago, documentos comerciales y resumen de ingresos | Aprobar reembolsos y verificar reglas de facturación según país |
| Marketing | Plan semanal, textos, diseños sobre plantillas, guiones y adaptación de material propio; publicar piezas aprobadas mediante integración | Aportar experiencia, grabar material cuando haga falta, aprobar afirmaciones |
| Calidad, soporte y dirección | Detectar fallos, registrar incidencias, ejecutar recuperaciones acotadas, medir costes y entregar un resumen semanal | Resolver incidentes complejos y decidir prioridades |

Recepción es administrativa. No diagnostica, no prescribe y no sustituye atención clínica. Los casos clínicos, historia clínica y asistencia a decisiones terapéuticas quedan fuera de la primera oferta; la plantilla actual los contempla, pero ampliar a ese terreno añade complejidad que no ayuda a validar recepción y operación.

## 3. Precios propuestos

Todos los niveles comparten web de plantilla, panel, agenda, administración básica, marketing limitado y supervisión. La escalera cambia capacidad y canales, no promete una clínica incompleta en el nivel de entrada.

| Nivel | Mensualidad propuesta | Activación | Capacidad inicial propuesta |
| --- | --- | --- | --- |
| Esencial | 79 EUR | 99 EUR | Web y correo; 300 respuestas IA/mes; 4 piezas de contenido/mes |
| Consulta | 149 EUR | 149 EUR | Lo anterior y WhatsApp cuando la cuenta esté habilitada; 1.000 respuestas IA/mes; 12 piezas/mes |
| Crecimiento | 249 EUR | 249 EUR | Lo anterior e Instagram cuando el acceso esté aprobado; 2.500 respuestas IA/mes; 20 piezas/mes y un resumen mensual ampliado |

Una respuesta IA es una respuesta emitida por el asistente al usuario; no equivale a un mensaje facturable de Meta. Una pieza es un texto con un diseño de plantilla o un guion; adaptar la misma pieza a otra red no crea una nueva pieza. Producción audiovisual completa, campañas pagadas, desarrollos a medida e integraciones nuevas se presupuestan aparte.

El plan incluye alojamiento compartido y consumo IA dentro de su capacidad y presupuesto técnico. El dominio se paga a nombre del cliente. Los mensajes de pago de WhatsApp y servicios externos específicos se pagan desde la cuenta del cliente o mediante una bolsa explícita con límite. Nunca facturar extras sin una regla aceptada.

Al alcanzar límites: avisar antes, ofrecer ampliación explícita o derivar a atención humana; no hacer cargos automáticos ni dejar consultas sin una respuesta de continuidad. Medir tokens, costes, longitud del contexto y llamadas a herramientas además del número de respuestas.

Cuota de activación para financiar la configuración. Para el primer piloto: eximirla, probar 30 días y dejar por escrito el precio posterior. El piloto no implica testimonios favorables; documentar resultados reales con autorización.

Sustituir la compra automática tras doce cuotas por un servicio mensual mantenido. Dominio, materiales propios y datos exportables pertenecen al cliente; el código compartido sigue siendo el producto de Diginode. Instalación independiente o compra del código sería una oferta separada, evaluada posteriormente. No modificar contratos existentes sin revisar compromisos.

Estos precios no prueban poder adquisitivo ni disposición a pagar. Validarlos con entrevistas y primeras ventas. No usar como argumento un ahorro salarial fijo de 2.200 EUR: comparar tareas, horas recuperadas y reservas verificables.

## 4. Estado encontrado en repositorios

- `diginode-client`: oferta de 150 EUR, tres asistentes, opción a compra tras doce cuotas, panel comercial y portal de cliente. El precio de respaldo es 150 EUR; algunas vistas y datos estructurados también lo fijan directamente.
- `diginode-api`: Stripe, leads, incorporación, seguimiento por correo, demo con herramientas y límite por contacto, generación de borradores, análisis de soporte y supervisión de instancias. La ruta comercial de WhatsApp envía mensajes a Make; no es por sí sola un receptor autónomo listo para cada consulta.
- El generador de contenido produce borradores y prompts de imagen. El analizador de incidencias escribe un análisis y una solución; no demuestra reparación automática. Un modelo de campaña con fecha no demuestra publicación programada.
- El checkout registra una clínica solicitada y avisa a operaciones. No demuestra que despliegue y configure por sí solo la instancia del cliente.
- `diginode-online-clinic-terapist`: estructura Next.js/Supabase, autenticación y cimientos de aislamiento. Recepción y marketing muestran componentes de página pendiente; el ejecutor de agentes lanza `NotImplementedError`. No es una clínica lista para entregar.

La revisión es de código seleccionado, no una auditoría completa ni una prueba de los servicios publicados. No se han usado credenciales ni datos de pacientes.

## 5. Arquitectura y trabajo técnico

Mantener la web comercial y API actuales mientras se completa un único núcleo operativo de consultas. Reutilizar los cimientos útiles de la plantilla; evitar un proyecto artesanal y una cadena de repos duplicados por cliente.

Diseño objetivo: una instalación compartida con configuraciones y datos aislados por negocio. Alta mediante formulario, creación de cuenta, configuración de plantilla, conexión de canales, pruebas y activación. Las nuevas funciones se despliegan una vez; cada cuenta conserva su marca y ajustes.

Antes de habilitar clientes: probar aislamiento con al menos dos negocios, permisos de herramientas, límites de consumo, exportación y recuperación de copia. Un mismo asistente visible no implica un único prompt con acceso a todos los datos.

Prioridad de construcción:

1. Configuración de negocio, identidad y conocimiento aprobado; cuenta Diginode y cuenta de piloto.
2. Recepción web, captura y derivación; agenda real con manejo de conflictos.
3. Stripe y estados de incorporación; reservas y pagos como flujos separados cuando corresponda.
4. Cola duradera de recordatorios y seguimiento, con reintentos, deduplicación y bajas.
5. Contenido con plantillas, aprobación, cola de publicación y registro de resultado.
6. WhatsApp e Instagram por adaptadores y cuentas habilitadas; activación no depende de aprobar ambos a la vez.
7. Panel de costes, soporte, alertas y resumen semanal.
8. Alta repetible de nuevos negocios, exportación y actualización común.

## 6. Contenido casi automático

El fundador entrega una grabación semanal de 20-30 minutos o notas de demostraciones reales. El sistema transcribe, selecciona ideas, prepara tres piezas semanales, adapta formatos, diseña con plantillas y coloca todo en una cola. Aprobación por lote y publicación en horarios configurados.

Las piezas aprobadas y las categorías de contenido autorizadas pueden publicarse sin confirmar cada envío. Nuevas afirmaciones, ofertas, resultados de clientes o contenido delicado pasan por revisión. Grabar presencia humana sigue siendo útil para vender confianza; la automatización se concentra en edición, adaptación y distribución.

Diginode comienza con Instagram y LinkedIn; Facebook puede reutilizar material. Mantener YouTube como biblioteca de demostraciones cuando haya vídeos útiles. TikTok entra después de comprobar que el proceso de contenido se sostiene. Esto es una elección de foco, no una afirmación sobre cuál canal convierte mejor.

Buffer puede servir como publicador inicial para Diginode: su plan gratuito anuncia tres canales y diez publicaciones pendientes por canal, además de acceso API. Verificar los formatos e integración antes de prometer publicación de vídeos. Para clientes, conectar sus propias cuentas; un plan gratuito de Diginode no cubre canales ilimitados.

## 7. Presupuesto y objetivo de ingresos

Presupuesto inicial de 100 EUR/mes: techo de 60 EUR para alojamiento, base de datos, correo y dominios; 20 EUR de IA para demostraciones/piloto; 20 EUR de reserva. Son asignaciones, no facturas verificadas. Revisar gasto actual y planes antes de contratar herramientas nuevas. Cero anuncios pagados durante el piloto; iniciar captación con contactos y demostraciones.

Vercel publica Pro a 20 USD/mes; Hobby se limita a uso personal no comercial. Railway cobra consumo: el mínimo publicado no representa el coste de toda la operación. El presupuesto debe incluir la base de datos y las copias, aunque exista una capa gratuita.

Objetivo orientativo: 20 clientes del nivel Consulta = 2.980 EUR/mes de ingreso comercial. Si cada uno cuesta como máximo 35 EUR/mes en tecnología y comisiones y los gastos comunes adicionales son 100 EUR/mes, quedan 2.180 EUR antes de obligaciones personales y otras reservas. No contar dos veces alojamiento compartido: el coste de 35 EUR debe recoger su asignación o los 100 EUR deben cubrirlo, según el presupuesto real. Tampoco es un cálculo del neto personal de 1.300 EUR.

Controlar coste total por cuenta y horas de soporte. Los costes técnicos objetivo son hipótesis a medir durante el piloto, no consumos demostrados. Los ingresos por activación financian altas y no se cuentan como ingreso mensual recurrente. Una mezcla mayor de cuentas Esencial exige más clientes.

## 8. Rutina de la empresa de una persona

Distribución inicial de las 18 horas semanales: 4 ventas/asesorías, 3 grabación y revisión de contenido, 4 altas y experiencia de clientes, 3 decisiones y revisión de métricas, 2 incidencias y 2 de margen. El objetivo es reducir altas y soporte conforme el producto madura, no asumir desde el primer día que desaparecen.

El panel diario muestra solamente acciones pendientes, fallos, leads cualificados, publicaciones listas y presupuesto. El resumen semanal muestra interesados, reservas, ventas, cancelaciones, ingreso recurrente, coste por cuenta y tiempo humano. Sin revisión semanal, automatizar tareas no garantiza que el negocio funcione.

La programación asistida en esta conversación ayuda a construir y corregir. La ejecución continua requiere servicios desplegados, tareas programadas, cuentas conectadas y monitorización; no depende de que este chat esté abierto.

## 9. Piloto y criterio de entrega

Primero Diginode con datos de demostración; después la psicóloga con su catálogo, horarios y canales. Medir 30 días y documentar un caso real sin datos identificativos de pacientes.

Se considera operativo cuando:

- Un interesado entra, recibe información correcta y deja sus datos mínimos.
- Puede reservar, cambiar y cancelar sin duplicar citas ni cobrar dos veces.
- Las confirmaciones y recordatorios llegan, con registro de envío y fallos.
- El propietario puede tomar el control y pausar respuestas automáticas.
- Los pagos y cambios de suscripción reflejan el estado real, incluso con webhooks repetidos.
- Se genera, aprueba y publica una pieza, registrando éxito o error del publicador.
- Una incidencia llega al responsable; una caída de integración ofrece una alternativa de atención.
- Se demuestra separación entre negocios, exportación y restauración de una copia.
- El panel muestra coste y uso reales; se han definido los límites y alertas.
- El segundo negocio se incorpora con configuración y no con un desarrollo distinto.

No prometer instalación en siete días antes de medir un alta completa. El plazo comercial empieza cuando el cliente entrega materiales y termina cuando sus canales y pruebas están habilitados.

## 10. Información y conexiones pendientes

Para definir el piloto: país y zona horaria de la psicóloga, catálogo y tarifas, horarios, calendario, web/dominio actual, reglas de cancelación, preguntas frecuentes y canales de atención. Para Diginode: correo de marca, disponibilidad de asesorías, identidad visual y ejemplos de su voz.

Para desplegar: acceso autorizado a los proyectos actuales de Vercel y Railway, base de datos operativa, proveedor IA existente y presupuesto, Stripe de Diginode, correo transaccional y cuentas sociales. Confirmar si existe proyecto Supabase para la plantilla antes de activarlo. Para cada profesional, conectar su calendario y sus medios de cobro; comprobar disponibilidad del proveedor en su país.

Para WhatsApp: comprobar cuenta Meta, número, permisos, webhooks y viabilidad de integración con el uso actual de Business. La IA integrada del teléfono no demuestra acceso a nuestra agenda, panel, costes ni flujos. No prometer coexistencia sin verificar la cuenta concreta.

Credenciales únicamente mediante conexión autorizada o variables de entorno; nunca solicitar claves en texto dentro del chat. Las publicaciones, campañas y operaciones externas necesitan las cuentas conectadas; no se han ejecutado en esta fase.

## Fuentes consultadas

- Vercel: https://vercel.com/pricing y https://vercel.com/docs/plans/hobby
- Railway: https://railway.com/pricing
- Buffer: https://buffer.com/pricing
- Resend: https://resend.com/pricing
- WhatsApp Business Platform: https://whatsappbusiness.com/products/platform-pricing/
- Stripe España: https://stripe.com/es/pricing

Las tarifas de proveedores varían por plan, uso, moneda y país. Las cifras comerciales de Diginode de este documento son una propuesta propia.
