# Estrategia de Negocio — DigiNode

> ⚠️ **MODELO COMERCIAL VIGENTE (2026-08-14) — anula los precios y ofertas de las tablas de abajo:** producto único **"Clínica Digital"** = página web + 3 empleados IA (Nora recepcionista, Alex auxiliar técnico, Valeria creadora de contenido) por **150€/mes**, sin setup ni permanencia, con opción a compra al completar 12 cuotas (el cliente es dueño de su dominio y datos desde el día 1). Nicho: psicólogos, coaches y terapeutas. Modelo "portable", no SaaS: cada cliente se despliega desde 4 repos plantilla de GitHub y las mejoras se propagan desde la plantilla mientras esté suscrito.

> **Documento de instrucciones para un modelo de IA** que actuará como asesor de negocio/marketing. Contiene: (1) el modelo actual tal como está implementado en el código, (2) validación y crítica, (3) el enfoque recomendado, y (4) tareas ejecutables con criterio de "hecho". Objetivo declarado del fundador: **generar ingresos rápidamente** vía contenido y publicidad.

## 1. El modelo actual (contexto — no necesitas explorar los repos)

**Producto:** "empleados IA" — agentes (Claude/GPT) que atienden WhatsApp e Instagram, gestionan agenda, crean contenido y analizan el negocio del cliente. Cuatro personajes:

| Empleado | Rol |
|---|---|
| **Alex** | Asistente ejecutivo (prioridades, documentos, recordatorios) |
| **Nora** | Recepcionista / atención al cliente 24/7 |
| **Valeria** | Creadora de contenido |
| **Marcos** | Analista del negocio |

**Ofertas y precios vigentes (implementados en Stripe + landings):**

| Oferta | Precio | Landing |
|---|---|---|
| Empleado individual | 150€/mes + 600€ setup (o 3×200€) | `BolsaEmpleoView` |
| Plan Individual / Estudio / Clínica (backend) | 180 / 300 / 500 €/mes + setup 200-550€ | `BolsaEmpleoView` |
| "Operación Solo" (Despacho Digital: web + panel + 2 empleados) | 300€/mes 6 meses promo → 200€/mes | `OperacionSoloView` |
| Cursos | pago único variable | `CourseDetailView` |

**Funnel actual:** landing → botón checkout Stripe directo o agendar demo por Cal.com → onboarding 7 días → cliente con instancia propia (diginode-office). Promesas clave del copy: "activos en 7 días", "24/7", "sin permanencia".

**Decisión estratégica previa (2026-05-18):** el nicho ancla son **solopreneurs** (profesionales que operan solos: consultores, terapeutas, abogados independientes, clínicas unipersonales). Existe un framework de narrativa PNL ya definido.

## 2. Validación: qué está bien (no tocar)

1. **Modelo de ingresos correcto:** suscripción recurrente + setup fee. El setup financia el coste de onboarding y filtra curiosos; la recurrencia construye MRR. Es el modelo estándar de las agencias de IA que funcionan.
2. **"Sin permanencia" como gancho** reduce la fricción de un compromiso de 150-300€/mes. Bien.
3. **Producto productizado:** instancia por cliente + panel propio = márgenes de software, no de agencia por horas. Escalable.
4. **El producto es auto-demostrable:** un empleado IA que responde WhatsApp se puede enseñar en 30 segundos de video. Esta es la mayor ventaja de marketing y está infrautilizada.
5. **Pricing sano:** 150-300€/mes está por debajo del coste de la alternativa humana (un recepcionista a media jornada) y por encima del umbral de "juguete". El ancla "ahorras +1.100€" ya existe en el copy.

## 3. Crítica honesta: qué está frenando los ingresos

### C1 — Dispersión de oferta (el problema #1)
Hay al menos 4 ofertas con naming distinto (Bolsa de Empleo, plan Clínica, plan Despacho, Operación Solo) y 3 landings de venta que se solapan, con estructuras de precio diferentes (150 vs 180 vs 300 vs 500). Para un visitante frío esto es ruido; para el fundador es 3× trabajo de contenido y ads. **Con tráfico pequeño, cada oferta extra divide la probabilidad de venta, no la suma.** Además el nicho declarado es solopreneurs pero dos de las ofertas hablan a clínicas y despachos (equipos), contradiciendo el posicionamiento.

### C2 — Setup de 600€ como barrera frontal
Para un solopreneur, 600€ + 150€/mes en el primer contacto con una marca desconocida es un salto de fe. No hay escalón intermedio entre "leer la landing" y "pagar 750€".

### C3 — Cero prueba social
No hay testimonios, casos, números de clientes ni demos públicas en las landings. En un mercado donde "agencia de IA" suena a humo, la prueba es el factor decisivo. Sin ella, las ads pagan CPCs por tráfico que no convierte.

### C4 — Funnel binario: o compras o desapareces
El único camino es checkout o demo por Cal.com. No se captura email/WhatsApp del 97% que no compra hoy. Cada euro de publicidad sin captura intermedia se quema una sola vez.

### C5 — No hay demostración viva del producto
El producto ES una conversación de WhatsApp, y la web no permite tenerla. Es como vender un coche sin prueba de conducción teniendo el coche aparcado en la puerta.

## 4. Enfoque recomendado: una oferta, una demo, un funnel

**Principio rector: durante los próximos 90 días, todo el contenido y la publicidad empujan UNA sola oferta hacia UN solo nicho.**

- **Oferta insignia:** "Operación Solo" (300€/mes promo → 200€/mes) renombrada/centrada en el beneficio: *tu negocio atendido 24/7 sin contratar a nadie*. Es la que encaja con el nicho solopreneur ya decidido y la de pricing más digerible. Las demás ofertas no se borran: se quitan del menú principal y quedan como upsell/downsell en la conversación de ventas.
- **Demo viva como CTA principal:** un número de WhatsApp donde el visitante habla con "Nora" en modo demo. El CTA pasa de "agenda una reunión" (fricción alta) a "escríbele a Nora ahora" (fricción cero). Nora demuestra el producto Y captura el lead (nombre + negocio) en la misma conversación. *La infraestructura ya existe: es el mismo pipeline WhatsApp→API→Claude del producto.*
- **Escalón de entrada:** garantía en lugar de descuento — "si en 14 días no te ha ahorrado tiempo, te devolvemos el mes". Mantiene el precio (no educa al mercado en regateo) y mata la objeción del salto de fe (C2).

## 5. Tareas ejecutables

> Formato: cada tarea tiene **Qué**, **Cómo** y **Hecho cuando**. Las que tocan código indican el archivo. Ejecutar en orden.

### T1 — Unificar el mensaje de la web (semana 1)

- **Qué:** convertir la home en una sola página de venta de la oferta insignia para solopreneurs.
- **Cómo:** el copy vive en `src/views/home/HomeView.vue` (hero líneas ~23-25, precios ~201-245) y `src/views/home/OperacionSoloView.vue`. Reescribir el hero con la fórmula problema-mecanismo-prueba: *"Sales de consulta y tienes 14 WhatsApps sin responder. Nora los contestó todos. [Habla con Nora ahora]"*. Quitar del menú público la Bolsa de Empleo y los planes Clínica/Despacho (mantener las rutas vivas para tráfico directo y ventas asistidas).
- **Hecho cuando:** un desconocido que lee solo el hero puede decir en una frase qué vendes, a quién y cuánto cuesta.

### T2 — Montar la demo pública de Nora (semana 1-2)

- **Qué:** número de WhatsApp de demo conectado al pipeline existente con un prompt de "Nora comercial": responde como lo haría para un negocio de ejemplo, y a los 3-4 intercambios pivota a capturar nombre/negocio y ofrecer activarla en su negocio.
- **Cómo:** reutilizar `recepcionista_service` del API con un client demo dedicado. Botón flotante de WhatsApp en todas las páginas públicas del client. Límite de mensajes por contacto (ya recomendado en la auditoría técnica, P1-3) para controlar coste.
- **Hecho cuando:** cualquier visitante puede mantener una conversación real con Nora desde la web sin registrarse, y cada conversación queda registrada como lead.

### T3 — Prueba social mínima viable (semana 1-2, en paralelo)

- **Qué:** 3 casos reales aunque sean pequeños.
- **Cómo:** si ya hay clientes, documentar: captura de conversación real (anonimizada) + 1 métrica ("87 mensajes respondidos el primer mes, 12 citas agendadas"). Si no hay clientes suficientes: ofrecer el servicio a 2-3 negocios cercanos a precio reducido a cambio de caso documentado y testimonio en video de 30s. Publicar en la landing y fijar en redes.
- **Hecho cuando:** la landing tiene ≥3 pruebas verificables con nombre/negocio real.

### T4 — Contenido orgánico: el formato es "demostración" (continuo, desde semana 2)

- **Qué:** 3-4 piezas/semana en el canal donde esté el nicho (Instagram Reels + TikTok; LinkedIn si el subnicho es B2B). **Regla: el 80% del contenido es enseñar a Nora/Alex trabajando en pantalla, no hablar de IA.**
- **Cómo — 5 guiones plantilla a rotar:**
  1. *Pantalla partida:* cliente escribe a las 23:47 → Nora responde y agenda la cita. Texto: "Esto pasó mientras dormía".
  2. *Antes/después:* "Así era mi bandeja de WhatsApp / así es ahora".
  3. *Reto en vivo:* "Le pedí a un amigo que intentara confundir a mi recepcionista IA. Esto pasó."
  4. *Objeción directa:* "¿Y si el cliente se da cuenta de que es una IA?" → mostrar la conversación.
  5. *Números:* "Lo que cuesta un recepcionista: 1.100€/mes. Lo que cuesta Nora: 150€." 
  CTA fijo en todas: "Habla tú mismo con Nora — link en bio" (→ T2). Si existe la skill de marketing disponible, úsala para generar la grilla mensual completa.
- **Hecho cuando:** hay un calendario de 30 días publicándose y cada pieza apunta a la demo de WhatsApp.

### T5 — Publicidad de respuesta directa (desde semana 3, NO antes de T1-T3)

- **Qué:** Meta Ads (Instagram/Facebook) con presupuesto de prueba 15-20€/día.
- **Cómo:**
  - **Campaña 1 — tráfico a demo:** objetivo mensajes de WhatsApp (Click-to-WhatsApp Ads → Nora). Es el formato más barato por conversación iniciada y la conversación ES la demo. Creativos: los 2 reels orgánicos con mejor retención (no crear ads desde cero).
  - **Campaña 2 — retargeting:** públicos de visitantes web + quienes interactuaron, con los casos de T3 y oferta de garantía 14 días.
  - **Segmentación inicial:** España, 28-55, intereses por subnicho (elegir UNO para empezar: el subnicho con el caso de T3 más fuerte — p. ej. clínicas estéticas unipersonales o terapeutas).
  - Instalar Meta Pixel en el client (`index.html`) + eventos de conversión (clic en WhatsApp, checkout iniciado).
- **Hecho cuando:** 2 semanas de datos con ≥50 conversaciones iniciadas y un coste por conversación conocido. **Regla de decisión:** si el coste por demo iniciada < 8€ y ≥1 venta por cada 25 demos, escalar presupuesto ×2; si no, cambiar creativo antes que cambiar segmentación.

### T6 — Instrumentar el funnel (semana 2-3)

- **Qué:** medir visitas → conversaciones demo → demos "calientes" (dejaron nombre/negocio) → ventas.
- **Cómo:** los leads de Nora-demo ya caen en el modelo `Lead` del API; añadir `source` (orgánico/ad/campaña). Dashboard simple en el admin existente (`src/views/admin/LeadsView.vue`) con los 4 números semanales.
- **Hecho cuando:** el fundador puede responder cada lunes: cuántas demos hubo, de dónde vinieron y cuántas se convirtieron.

### T7 — Seguimiento de leads no convertidos (semana 3-4)

- **Qué:** secuencia de 4 mensajes (WhatsApp/email vía Resend, ya integrado) para quien habló con Nora pero no compró: D+1 resumen de lo que Nora haría en su negocio → D+3 caso de éxito → D+7 objeciones frecuentes → D+14 garantía + escasez honesta ("activamos 4 negocios al mes por capacidad de onboarding").
- **Hecho cuando:** ningún lead con nombre+negocio queda sin al menos 4 toques en 14 días.

## 6. Lo que NO hacer (anti-tareas)

1. **No lanzar más ofertas ni más landings** hasta que la insignia tenga ≥10 clientes de pago.
2. **No hacer contenido de "qué es la IA"** ni tutoriales genéricos de ChatGPT: atrae curiosos, no compradores.
3. **No bajar el precio.** La palanca es la garantía y la prueba, no el descuento. El descuento promo ya existe (300→200 invertido como precio de lanzamiento).
4. **No invertir en ads antes de tener T2 (demo) y T3 (prueba):** es pagar por enviar tráfico a una landing que no convierte.
5. **No prometer "sin IA detectable":** la transparencia ("tu recepcionista es IA y por eso responde en 10 segundos a las 3 AM") es defensa legal y ángulo de venta.

## 7. Métricas norte (revisar semanalmente)

| Métrica | Objetivo a 90 días |
|---|---|
| Conversaciones demo iniciadas/semana | ≥40 |
| % demo → lead con nombre+negocio | ≥40% |
| Coste por demo iniciada (ads) | <8€ |
| Nuevos clientes de pago/mes | 4-6 |
| MRR | ≥1.500€ (≈6-7 clientes de la oferta insignia) |

Con 6 clientes de la insignia el MRR cubre infraestructura + ads y valida el funnel; a partir de ahí, escalar es subir presupuesto de ads y abrir el segundo subnicho — no inventar producto nuevo.
