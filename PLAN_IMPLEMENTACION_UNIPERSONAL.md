# Plan de implementación — Diginode operada por una persona

Fecha: 2026-10-09. Estado: planificación y ramas preparadas; implementación funcional pendiente.

## 1. Objetivo y alcance aprobado

Convertir Diginode en el primer negocio que utiliza el sistema que vende: un asistente visible con departamentos de recepción/comercial, agenda/operaciones, administración/cobros, marketing y calidad/soporte. El mismo núcleo debe incorporar después a una psicóloga piloto mediante configuración.

Restricciones: inversión inicial máxima de 100 EUR/mes, 18 horas semanales del fundador, objetivo personal de 1.300 EUR/mes, mercado inicial hispanohablante en España y un país de LATAM por confirmar. Las automatizaciones trabajan en servicios desplegados; su ejecución no depende de este chat.

La definición comercial, alcance y límites se encuentran en [DIGINODE_PRODUCTO_Y_OPERACION.md](DIGINODE_PRODUCTO_Y_OPERACION.md). Este plan sustituye la secuencia antigua de `PLAN_DE_ACCION.md` para esta evolución. La producción mantiene su comportamiento actual hasta una promoción verificada.

## 2. Ramas, puntos de partida y conservación del trabajo

Rama local creada y activa en los tres repositorios: **`codex/diginode-empresa-unipersonal`**.

| Repositorio | Base de la rama | Función |
| --- | --- | --- |
| diginode-client | 8266fff75e3845d4259a6e3c01e648d1beb1b892 | Web comercial, administración de Diginode y portal comercial |
| diginode-api | aebd569859352545398c8ff12e31e907acde8564 | Catálogo, captación, suscripciones y relación comercial |
| diginode-online-clinic-terapist | f351f27d393105a1151e568b1eecf45d6fa28b27 | Candidato a núcleo operativo compartido de consultas |

La plantilla de clínica ya tiene cambios ajenos a esta tarea: `.gitignore` y `README.md` modificados y la estructura de aplicación sin registrar. No incluirlos automáticamente en un commit, descartarlos ni sobrescribirlos. Antes de modificar esa plantilla, inventariar el trabajo y ejecutar sus comprobaciones. Los fundamentos Supabase existen como archivos, pero sus migraciones no tienen validación demostrada en una base de datos.

Un commit por tarea, usando `[U<fase>-T<tarea>] descripción`. El registro de este documento y los commits identifican lo terminado. No hacer push antes de revisar las integraciones de despliegue: una rama nueva puede activar previews con variables heredadas.

## 3. Decisiones técnicas para la primera versión

- Mantener Vue/Express para la parte comercial publicada. Completar un solo núcleo operativo configurable; evaluar primero la plantilla Next.js/Supabase y su coste real. No reconstruir en otro framework ni mantener una copia de aplicación por cliente.
- Separar catálogo/suscripción de Diginode de los pagos de sesiones que recibe cada profesional. Cada transacción conserva propietario, cuenta de cobro, moneda y estado.
- Una identidad del asistente en la interfaz; módulos y herramientas con permisos diferentes por departamento. Las configuraciones y consultas siempre se vinculan al negocio autorizado.
- El propietario de Diginode administra su cuenta operativa igual que un cliente. El alta de otras consultas y la gestión de infraestructura quedan en administración restringida.
- Las capacidades compartidas viven en el núcleo. Canales externos se conectan mediante adaptadores. WhatsApp e Instagram no bloquean las pruebas de recepción web y correo.
- Trabajos programados persistentes, con idempotencia, reintentos, control de concurrencia y registro de fallos. Los temporizadores en memoria actuales no son la solución final para trabajos que deben sobrevivir a reinicios.
- Pasarela clínica solo administrativa en esta versión. Diagnósticos, historia clínica y apoyo a decisiones terapéuticas quedan fuera. Respuestas sensibles se derivan a una persona; los textos de emergencia se configuran por país y nunca confirman avisos que no se han enviado.
- Antes de habilitar visitantes anónimos: resolver su identidad y acceso acotado por conversación. No publicar el widget usando una clave privilegiada que ignore el aislamiento.

## 4. Entorno de pruebas

Antes de publicar una preview conectada a servicios:

1. Web comercial preview → API staging → datos de prueba. Núcleo de consultas staging → base/almacenamiento de prueba separados.
2. Stripe en modo test; claves, firmas y destinos webhook diferentes de producción. Mantener validación de firma y cuerpo raw.
3. Correo, WhatsApp y publicaciones hacia cuentas de prueba o destinatarios permitidos. Seguimientos desactivados por defecto hasta verificar los destinatarios.
4. Sin datos reales de pacientes en pruebas de integración o carga. Fixtures: Diginode y una consulta ficticia con identificadores distintos.
5. Variables configuradas en los proveedores; solo `.env.example` versionado. No copiar secretos de producción ni mostrarlos en logs.
6. Datos de producción no se migran en esta fase. Ensayar migraciones aditivas, copia y recuperación antes de cualquier promoción.
7. Alertas y topes de gasto para infraestructura e IA. Si el entorno completo supera 100 EUR/mes, reducir servicios y probar localmente antes de contratar más.

Crear una rama no demuestra aislamiento de servicios externos. U0 debe confirmar estas condiciones antes de usar cuentas conectadas.

## 5. Fases ejecutables

### U0 — Baseline y aislamiento

- [x] U0-T1 — Crear ramas desde el estado actual y documentar cambios locales existentes. 2026-10-09.
- [x] U0-T2 — Guardar definición del producto, plan y referencias desde documentos anteriores. 2026-10-09.
- [ ] U0-T3 — Verificar `npm run build` y `npm run lint` en client; `npm test` y `npm run lint` en API; `pnpm check` en plantilla. Registrar fallos previos por separado. Inspeccionar scripts y conexiones antes de ejecutar para evitar efectos externos.
- [ ] U0-T4 — Confirmar proyecto/base de pruebas y configuración de previews, correo, canales y Stripe. Inventariar nombres y disponibilidad de variables sin revelar valores.
- [ ] U0-T5 — Validar migraciones de la plantilla, permisos y aislamiento con dos negocios en un entorno desechable. Resolver acceso del widget anónimo.

**Salida:** baseline documentada, entorno aislado y núcleo operativo elegido con coste previsto. No basar el estado en checkboxes históricos.

### U1 — Identidad, configuración y catálogo

- [ ] U1-T1 — Contrato de configuración por negocio: marca, país, zona horaria, servicios, tarifas, agenda, tono, conocimiento aprobado, límites y reglas de derivación.
- [ ] U1-T2 — Crear cuenta operativa Diginode y consulta ficticia mediante seed repetible y no destructivo. Configuración editable desde panel.
- [ ] U1-T3 — Catálogo versionado con los tres niveles propuestos: Esencial 79/99 EUR, Consulta 149/149 EUR, Crecimiento 249/249 EUR (mensual/instalación). Respuestas 300/1.000/2.500 y contenido 4/12/20 al mes. Probar en staging; un cambio de catálogo no cambia suscripciones existentes.
- [ ] U1-T4 — Contrato API compartido para planes, capacidades y precios; eliminar divergencias entre checkout, fallback, textos, correos y datos estructurados. Cantidades monetarias en céntimos; moneda explícita.
- [ ] U1-T5 — Fuente de conocimiento versionada y trazas de acciones. El asistente no inventa precios, disponibilidad ni acciones realizadas.

**Salida:** Diginode y la consulta reciben su configuración correcta; los permisos impiden acceso cruzado. Web y checkout muestran el mismo catálogo de prueba.

### U2 — Recepción y asesoría comercial de Diginode

- [ ] U2-T1 — Adaptar demo actual al asistente unificado, con límites por contacto, por cuenta y de coste/contexto. Permitir toma de control humana y pausa.
- [ ] U2-T2 — Flujo interesado → datos mínimos → servicio adecuado → asesoría gratuita o checkout. Registrar origen y estados sin convertir una conversación en venta antes del pago.
- [ ] U2-T3 — Disponibilidad real, reserva, cambio y cancelación en el calendario del fundador; confirmaciones e idempotencia. Si la integración falla, ofrecer contacto humano sin simular reserva.
- [ ] U2-T4 — Panel de conversaciones y excepciones; aclarar qué respuestas son demo y cuáles ejecutan acciones reales en staging.

**Salida:** un visitante de prueba mantiene conversación, queda registrado y reserva una asesoría real de prueba sin duplicarla.

### U3 — Cobro e incorporación repetible

- [ ] U3-T1 — Checkout de suscripción e instalación con importes/moneda contrastados; webhooks firmados, repetibles y resistentes a eventos desordenados. Permisos por estado de suscripción.
- [ ] U3-T2 — Formulario de incorporación, validación de materiales y conexiones, estados de avance y lista de pruebas antes de activar.
- [ ] U3-T3 — Aprovisionamiento por configuración, reintentos y compensación si falla. La cuenta comercial no se presenta como servicio activo mientras el núcleo siga sin configurar.
- [ ] U3-T4 — Portal: suscripción, cancelación, facturas de Diginode, soporte, consumo y exportación. Cancelar al final del periodo pagado según la política acordada.
- [ ] U3-T5 — Cobros de sesiones opcionales y separados; conexión autorizada a cuenta del profesional solo tras confirmar proveedor disponible en su país. Verificar venta de Diginode aunque esa conexión esté pendiente.

**Salida:** checkout test → evento → cuenta → incorporación → activación; repetir eventos no duplica cobros ni recursos. Reversión y cancelación probadas.

### U4 — Operación de la consulta y canales

- [ ] U4-T1 — Recepción de consulta con catálogo, conocimiento y agenda propios. Reservar/cambiar/cancelar con concurrencia, zona horaria y reglas de cancelación.
- [ ] U4-T2 — Confirmaciones, recordatorios y seguimientos autorizados mediante trabajos persistentes. Evitar mensajes después de baja, reserva cancelada o conversión comercial.
- [ ] U4-T3 — Bandeja de intervención, escalado, incidencias y alertas con estado real de entrega. Nunca afirmar que se avisó al profesional antes de registrar envío.
- [ ] U4-T4 — Integrar WhatsApp con número/cuenta de prueba; verificar permisos, autenticidad del webhook, deduplicación y costes. Revisar compatibilidad con el WhatsApp Business existente antes de conectarlo.
- [ ] U4-T5 — Instagram detrás de capacidad habilitada; activar solo cuando la cuenta tenga permisos suficientes. Ofrecer web/correo mientras tanto.

**Salida:** una consulta ficticia completa recepción → reserva → recordatorio → intervención humana y maneja reinicios/fallos sin perder ni duplicar tareas.

### U5 — Marketing casi automático

- [ ] U5-T1 — Entrada de audio, vídeo o notas; voz de marca, calendario y fuentes aprobadas. Generación de textos, diseños de plantilla y guiones dentro del nivel contratado.
- [ ] U5-T2 — Cola aprobar/editar/rechazar por lote, con versiones y límites. Nuevas ofertas o afirmaciones sensibles requieren revisión.
- [ ] U5-T3 — Adaptador de publicación, empezando por Buffer o integración equivalente validada. Registrar ID externo, éxito, error y reintentos; no marcar como publicado un simple borrador.
- [ ] U5-T4 — Programación y resultados para Diginode; incorporar cuentas del profesional mediante su autorización, sin compartir sus credenciales con otro negocio.

**Salida:** material propio → tres piezas → aprobación → publicación en cuenta de prueba. Un fallo y un reinicio no producen publicaciones duplicadas.

### U6 — Dirección, soporte y presupuesto

- [ ] U6-T1 — Panel diario de acciones pendientes y resumen semanal: interesados, reservas, ventas, ingreso recurrente, cancelaciones, coste y tiempo humano.
- [ ] U6-T2 — Medición de tokens y llamadas, cuotas mensuales, presupuestos monetarios y alertas. Contabilizar reintentos y llamadas a herramientas; una respuesta IA no equivale a un cargo de Meta.
- [ ] U6-T3 — Soporte: clasificación, soluciones acotadas y derivación. Automatizar solo reparaciones predefinidas, con registro, verificación y reversión; un diagnóstico generado no es reparación.
- [ ] U6-T4 — Copias, ensayo de restauración, exportación por cliente y procedimiento de incidencias.
- [ ] U6-T5 — Alta de un segundo negocio mediante formulario/configuración, midiendo tiempo y coste. Objetivo inicial: menos de dos horas de trabajo humano por alta estándar con materiales completos, a validar.

**Salida:** coste verificable y controlado; fallos visibles; recuperación demostrada; alta repetible y resumen útil para decisiones.

### U7 — Piloto y promoción a main

- [ ] U7-T1 — Prueba integral en staging de los flujos de U1–U6, aislamiento, conflictos de agenda, límites y fallos de integraciones.
- [ ] U7-T2 — Aceptación del fundador usando Diginode: demo, asesoría, cobro test, contenido y resumen semanal.
- [ ] U7-T3 — Preparar cuenta de la psicóloga, revisar información y precio posterior, validar con datos sintéticos y activar piloto mediante publicación controlada.
- [ ] U7-T4 — Medir treinta días de piloto: incidencias, intervenciones, coste, reservas y horas recuperadas. Documentar resultados autorizados.
- [ ] U7-T5 — Revisar catálogo y margen; actualizar únicamente lo que justifiquen los datos y probar de nuevo los flujos afectados.
- [ ] U7-T6 — Preparar PR por repositorio con revisión, evidencia, orden de despliegue y rollback. Incorporar solo cambios propios; no absorber silenciosamente el trabajo previo de la plantilla.
- [ ] U7-T7 — Promoción a producción/main mediante aprobación final del resultado probado. El piloto, si usa datos reales, requiere antes el mismo control de publicación para su despliegue acotado.

**Salida:** prueba integral aceptada, piloto medido, coste conocido y versión reproducible. Distinguir claramente staging, piloto controlado y lanzamiento general.

## 6. Matriz mínima de pruebas

| Área | Verificación necesaria |
| --- | --- |
| Aislamiento | Dos cuentas: API, consultas, búsquedas, archivos, jobs y exportaciones; acceso cruzado rechazado |
| Recepción | Información aprobada, límites, pausa humana, derivación, manipulación de instrucciones y fallo IA |
| Agenda | Doble reserva, cambio/cancelación, cambio horario, reintento y proveedor no disponible |
| Stripe | Importe y moneda; firma inválida; evento repetido/desordenado; impago; cancelación; instalación separada |
| Trabajos | Reinicio, concurrencia, reintentos, deduplicación, baja y fallo definitivo |
| Contenido | Solo publicar versión aprobada; cuenta correcta; cuota; fallo externo; publicación no duplicada |
| Coste | Tokens y llamadas contados; aviso/límite; nunca cargos extras no aceptados |
| Recuperación | Copia restaurada, exportación solo de su cuenta y rollback de versión |

Ejecutar pruebas donde hay riesgo real y comprobación visual del recorrido completo. No duplicar tests que solo reproduzcan detalles de implementación. Una compilación correcta no demuestra pagos ni reservas funcionando.

## 7. Accesos y decisiones pendientes

| Dato o conexión | Bloquea | Trabajo posible sin ello |
| --- | --- | --- |
| País, zona horaria y materiales de la psicóloga | Activación del piloto real | Cuenta ficticia, formularios y pruebas |
| Disponibilidad/calendario del fundador | Reservas reales de asesoría | Adaptador y calendario de prueba |
| Configuración Vercel/Railway y previsión de costes actuales | Previews conectadas y publicación | Implementación y validación local |
| Supabase/BD de pruebas disponible | Validación del núcleo y aislamiento | Revisión de esquema y validación local desechable |
| Proveedor IA existente y presupuesto | Pruebas IA reales | Flujos deterministas y dobles de prueba |
| Stripe test y webhook de staging | Checkout integral | Contratos, validación y pruebas de eventos sintéticos |
| Correo de marca y proveedor | Entrega real de correos | Vista previa y capturador de correo de pruebas |
| Meta, número y permisos | Canales WhatsApp/Instagram | Recepción web/correo y adaptadores simulados |
| Publicador/cuentas sociales | Publicación real | Generación, diseños, aprobación y cola |

Conectar credenciales por mecanismos autorizados o variables de entorno; no pedir claves en el chat. No contratar servicios nuevos para resolver una dependencia sin comprobar presupuesto y autorización de gasto.

## 8. Orden de despliegue y reversión

Migraciones aditivas y núcleo compatible primero; API comercial después; frontend al final. Desplegar capacidades nuevas desactivadas hasta verificar sus dependencias. Las tres ramas pueden tener PR independientes, pero una fase no se considera lista si falta su dependencia en otro repositorio.

No cancelar ni sustituir automáticamente suscripciones antiguas. Versionar catálogo y capacidades; conservar el modelo contratado de clientes existentes. El cambio de texto sobre propiedad requiere verificar compromisos previos antes de aplicarlo a esos clientes.

Rollback: pausar nuevas tareas/publicaciones, desactivar capacidades nuevas y restaurar versiones compatibles. No borrar transacciones ni ejecutar migraciones destructivas para retroceder. Los identificadores de eventos externos se conservan para que el rollback no repita cobros, correos o publicaciones.

## 9. Cómo retomar el trabajo

Leer este plan y el documento de producto; comprobar rama y `git status` en cada repositorio. Elegir la primera tarea pendiente con dependencias cumplidas. Implementar una unidad verificable, ejecutar su prueba, registrar evidencia y hacer commit solo de los archivos propios de esa tarea.

Siguiente tarea técnica: **U0-T3**, comprobaciones iniciales e inventario de la plantilla. Este encargo prepara el plan y las ramas; no declara implementadas las funciones ni configurado el entorno staging.
