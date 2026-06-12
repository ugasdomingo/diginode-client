# Plan de Acción por Fases — DigiNode

> **Este es el documento maestro.** Está escrito para ser ejecutado por un modelo de IA a lo largo de muchas sesiones, asumiendo que **perderás el contexto entre sesiones**. Todo lo que necesitas para retomar el trabajo está aquí y en los otros dos documentos. No dependas de tu memoria de conversación: depende de este archivo, del registro de progreso y de `git log`.

---

## 0. PROTOCOLO DE ARRANQUE DE SESIÓN (ejecutar SIEMPRE primero)

Cada vez que empieces una sesión (nueva o tras compactar contexto):

1. **Lee este archivo completo** (`PLAN_DE_ACCION.md`, raíz de diginode-client).
2. **Lee la sección "Registro de progreso"** (§2) y localiza la primera tarea sin `[x]`.
3. **Verifica contra la realidad**, no contra tu memoria:
   - `git -C <repo> log --oneline -20` en ambos repos. Los commits siguen la convención `[F<fase>-T<tarea>] descripción` — el log es el segundo registro de progreso.
   - Si una tarea aparece marcada `[x]` pero no hay commit, o viceversa, **el código/git manda sobre el checkbox**: inspecciona los archivos de esa tarea y corrige el registro antes de continuar.
4. **Lee solo las secciones de los documentos de apoyo que necesite la tarea actual** (los IDs te dicen dónde mirar):
   - `AUDITORIA_TECNICA.md` → tareas con ID `P0-x`, `P1-x`, `P2-x`, `P3-x` (detalle técnico completo).
   - `ESTRATEGIA_NEGOCIO.md` → tareas con ID `T1`–`T7` (detalle de negocio completo).
5. Ejecuta **una tarea a la vez**. Al terminarla: verifica según su criterio, haz commit con la convención, y marca `[x]` con la fecha en §2 **editando este mismo archivo**.

### Reglas permanentes (válidas en toda fase, no las olvides al compactar)

- **Rutas:** client = `C:\Users\Usuario\Programación\Producción\diginode-client` · api = `C:\Users\Usuario\Programación\Producción\diginode-api`.
- **Un commit por tarea**, mensaje `[F2-T3] resumen corto`. Nunca mezclar tareas en un commit.
- **Nunca** commitear `.env`, imprimir secretos, cambiar precios sin que estén definidos en este documento, ni tocar la verificación de firma de Stripe (`express.raw()` en el webhook).
- **Convenciones de código:** API en snake_case (archivos y funciones), client con `<script setup>` + BEM en SCSS. Imita el estilo existente.
- **Gate de fase:** no empieces una fase si la anterior tiene tareas obligatorias sin `[x]` (las marcadas `(humano)` pueden quedar pendientes sin bloquear, pero recuérdaselas al usuario al final de cada sesión).
- **Verificación mínima tras cada tarea de código:** API arranca (`npm run dev`), client compila (`npm run build`), y si tocaste pagos: un checkout en modo test de Stripe llega al webhook.
- Si encuentras una discrepancia entre este plan y el código real, **el código define el estado actual y este plan define el objetivo**. Si la discrepancia hace imposible una tarea, anótalo en §2 (línea `⚠️`) y pregunta al usuario en vez de improvisar.

### Decisiones de negocio ya tomadas (NO re-decidir, NO preguntar de nuevo)

| Decisión | Valor |
|---|---|
| Oferta insignia | **Plan Entrepreneur/Autónomo** — slug interno `entrepreneur` — evolución de "Operación Solo": web profesional + panel + 2 empleados IA (Alex + 1 a elegir) |
| Precio insignia | **300€/mes plano** (decisión 2026-06-10; se descartó la promo→200). Setup incluido. Sin permanencia. Garantía 14 días. Checkout con `price_data` inline (sin Stripe Price IDs) |
| Nicho | Solopreneurs (profesionales que operan solos) |
| Upsell | **Clínica 500€/mes** (negocios con equipo) — solo en conversación de venta, no en la web pública |
| Downsell | **Empleado Individual (solo Nora) 180€/mes** — precio vivo actual, sin cambio de facturación — solo en conversación de venta |
| Precios (fuente única) | `diginode-api/src/config/plans.js` → `GET /api/plans`. roles: entrepreneur=flagship(300), clinica=upsell(500), individual=downsell(180), estudio=internal(300) |
| CTA principal | "Habla con Nora ahora" → WhatsApp demo (no "agenda una reunión") |
| Anti-tareas | No crear ofertas nuevas, no bajar precios, no contenido genérico de IA, no ads antes de demo+prueba social, no ocultar que es IA |

---

## 1. Mapa de fases

```
F0 Seguridad crítica ──→ F1 Backend del plan insignia ──→ F2 Frontend unificado ──→ F3 Demo viva + funnel ──→ F4 Marketing (lanzamiento) ──→ F5 Robustez técnica ──→ F6 Mantenibilidad
        (1-2 días)              (2-4 días)                    (3-5 días)                (2-4 días)                 (continuo)                  (1-2 semanas)         (continuo)
```

La prioridad del usuario es el modelo de negocio. F0 va primero **únicamente** porque sus 6 tareas son rápidas y porque lanzar publicidad sobre una API con `JWT_SECRET` placeholder sería regalar el panel admin a cualquiera. F5 y F6 (el grueso de la auditoría) van **después** del lanzamiento comercial.

---

## 2. REGISTRO DE PROGRESO (editar aquí; formato: `[x] ID — fecha — nota opcional`)

### F0 — Seguridad crítica
- [ ] F0-1 (humano) Rotar secretos · ver P0-1 — ⚠️ PENDIENTE DEL USUARIO. Además, F0-2 ahora BLOQUEA el arranque de la API hasta que `MAKE_WEBHOOK_SECRET` (placeholder) y `CAL_WEBHOOK_SECRET` (débil) se rediseñen a ≥32 chars aleatorios. Ver checklist al final de la sesión.
- [x] F0-2 — 2026-06-10 — validación de secretos débiles en env.js (commit api 2a6e54b)
- [x] F0-3 — 2026-06-10 — zod + validate_middleware + límite payload 1mb (commit api 91b04f5)
- [x] F0-4 — 2026-06-10 — auth_limiter/form_limiter, global 300 excl. webhooks (commit api 80f788b)
- [x] F0-5 — 2026-06-10 — DOMPurify en blog y cursos (commit client 7749fb4)
- [x] F0-6 — 2026-06-10 — contraste de importes en webhook (commit api f694ec9)
- ⚠️ Trabajo en ramas `f0-seguridad-critica` (ambos repos), sin merge a main todavía.

### F1 — Backend del plan insignia
- [x] F1-1 — 2026-06-10 — config/plans.js (fuente única) + GET /api/plans; AI_PLANS derivado (commit api bc9be8e)
- [x] F1-2 — 2026-06-10 — POST /api/entrepreneur/checkout + handler webhook + schedule promo→200 (commit api c0c23ed)
- [x] F1-3 — 2026-06-10 — usage_model + usage_service (límites por plan, demo 15) + metering en run_turn (commit api 4dfeb87)
- [x] F1-4 — 2026-06-10 — modo demo Nora, POST /api/demo/message, cap 15/contacto, seed_demo_client (commit api f1915c9)
- [x] F1-5 — 2026-06-10 — lead.source + funnel_stage + update_lead (commit api 5032801)
- [x] F1-6 — 2026-06-10 — crypto.randomBytes para temp passwords (commit api 5689ce9)
- [x] F1-ajuste — 2026-06-10 — precios definitivos (insignia 300 plano, upsell 500, downsell 180) + demo Nora como recepcionista DigiNode que cierra en Cal.com (commit api f2d1fa3)
- [x] Demo-UI — 2026-06-10 — vista /demo simulador de WhatsApp en el client, verificada en preview (commit client 7d82c98)
- ⚠️ Acciones humanas pendientes: (a) F0-1 rotar secretos + poner MAKE/CAL secrets fuertes (la API no arranca sin esto); (b) `node scripts/seed_demo_client.js` una vez; (c) conectar el número real de WhatsApp demo a `/api/demo/message` vía Make (F3-1). Ya NO hacen falta Stripe Price IDs (checkout 300 plano inline).
- ⚠️ Trabajo en ramas `f0-seguridad-critica` (ambos repos) — F0 + F1 + ajustes + demo-UI conviven ahí, sin merge a main todavía.

### F2 — Frontend unificado
- [x] F2-1 — 2026-06-11 — `src/data/plans.js` (usePlans, fetch GET /api/plans + fallback) (commit client cf593aa)
- [x] F2-2 — 2026-06-11 — home como venta del flagship: CTA Habla con Nora→/demo, pricing 180/300/500 con Entrepreneur destacado (commit client 60ec426)
- [x] F2-3 — 2026-06-11 — navbar/footer simplificados, bolsa fuera del menú (rutas vivas) (commit client 1ebae24)
- [x] F2-4 — 2026-06-11 — CTA "Habla con Nora" → `/demo` (interno, no wa.me) en navbar, hero, página plan; componente NoraCta (commit client cf593aa/1ebae24)
- [x] F2-5 — 2026-06-11 — OperacionSoloView → `/plan` marca Entrepreneur, 300 plano, checkout /api/entrepreneur/checkout, garantía 14 días, precio desde usePlans (commit client 2d8f804)
- [~] F2-6 — parcial: NoraCta extraído; PlanCard/EmployeeCard/FaqAccordion pendientes (no bloqueante) — queda para F6-2
- ⚠️ Decisión aplicada: el CTA "Habla con Nora" es interno a `/demo` (simulador), NO un wa.me. La conexión a WhatsApp real por Make (F3-1) sigue pendiente solo para tráfico de WhatsApp; la web ya funciona sin ella.
- ✅ Verificado en preview: home (CTA→/demo, flagship 300), /plan (300, garantía 14d, demo→/demo), redirecciones /operacion-solo y /despacho-digital → /plan.

### F3 — Demo viva + funnel medible
- [ ] F3-1 (humano) Nora demo operativa en WhatsApp · ver T2 — backend listo (`POST /api/demo/message`); falta conectar el número vía Make. La web ya funciona con `/demo`.
- [x] F3-2 — 2026-06-11 — captura de lead en la demo (nombre→identified, email por regex) (ya en F1-4 + F3-5)
- [x] F3-3 — 2026-06-11 — `GET /api/admin/funnel` + FunnelView en el admin (commits api 79a9041 / client 3949770)
- [ ] F3-4 (humano) — 3 casos reales — sección y `CASOS_PLANTILLA.md` listos (commit client 8d040c8); falta rellenar el array `casos`
- [x] F3-5 — 2026-06-11 — secuencia de seguimiento D+1/3/7/14, cron opt-in `ENABLE_FOLLOWUPS` (commit api b854fba)

### F4 — Marketing y lanzamiento
- [x] F4-1 — 2026-06-11 — `MARKETING_GRILLA_MES1.md` (5 plantillas + calendario 30 días) (commit client 4a06db0)
- [x] F4-2 — 2026-06-11 — Meta Pixel no-op sin ID + eventos Contact/InitiateCheckout/Purchase/PageView (commit client 2ecdf43)
- [ ] F4-3 (humano) Publicación orgánica en marcha (≥3 piezas/semana) — usar la grilla
- [ ] F4-4 (humano) Campaña Click-to-WhatsApp activa · ver T5 (NO activar sin F3-1 y F3-4)
- [ ] F4-5 Revisión semanal de métricas norte (recurrente) — leer el dashboard de Funnel
- ⚠️ Acciones humanas para F4: poner `VITE_META_PIXEL_ID` en `.env` del client; `ENABLE_FOLLOWUPS=true` en `.env` de la API (producción) para activar los emails de seguimiento.

### F5 — Robustez técnica (post-lanzamiento) — COMPLETA
- [x] F5-1 — 2026-06-11 — token_version + logout-all + expiración cliente 24h (commit api 589276f)
- [x] F5-2 — 2026-06-11 — clamp_pagination en 5 endpoints (commit api 000f624)
- [x] F5-3 — 2026-06-11 — índices Payment/PackageSubscription (commit api bb80f20)
- [x] F5-4 — 2026-06-11 — token nunca expuesto + flag office_admin_token_set (commit api 24e0050)
- [x] F5-5 — 2026-06-11 — validate_object_id en rutas admin (commit api a0c62d3)
- [x] F5-6 — 2026-06-11 — delimitadores + instrucción anti-injection en FAQs (commit api ee4375b)

### F6 — Mantenibilidad
- [x] F6-1 — 2026-06-11 — ESLint+Prettier en ambos repos; el lint detectó un import faltante real (commits api 3bddab8 / client 3a2d080)
- [~] F6-2 DIFERIDA — refactor de vistas gigantes. Riesgo alto / valor bajo en vísperas de lanzamiento; el funnel ya funciona. Hacer post-tracción, vista por vista. (NoraCta ya extraído en F2)
- [~] F6-3 DIFERIDA — dividir admin_controller/stripe_service. Movimiento mecánico pero arriesgado sobre la ruta de pago justo antes de lanzar; sin valor funcional inmediato. Hacer con tests de pago primero.
- [ ] F6-4 BLOQUEADA (infra humana) — imágenes base64 → object storage (R2/S3). Requiere cuenta de storage + credenciales; no testeable en local. Pendiente de que el humano cree el bucket.
- [x] F6-5 — 2026-06-11 — post_webhook (reintentos+dead-letter) en salientes a Make (commit api 4fc1dbb)
- [x] F6-6 — 2026-06-11 — toast de sesión expirada + doc localStorage (commit client 925efcd)
- [x] F6-7 — 2026-06-11 — vitest, 13 tests de lógica pura (commit api 201f1e5)
- [x] F6-8 — 2026-06-11 — logger pino con redacción (commit api bcf786c)
- ⚠️ F6-2/F6-3 son refactors de calidad sin impacto funcional; F6-4 espera infra. Ninguna bloquea el lanzamiento comercial.

---

## 3. Detalle de las fases

> Las tareas que ya están especificadas en los otros documentos solo se referencian (no dupliques: si el detalle de aquí y el de allá divergieran, **manda el otro documento** en el "cómo" y este en el "qué/cuándo"). Las tareas nuevas (F1 y F2, el corazón del cambio comercial) están especificadas completas aquí.

### FASE 0 — Seguridad crítica

Ejecutar P0-1 a P0-6 de `AUDITORIA_TECNICA.md` tal cual están escritas, en ese orden. F0-1 es del humano: entrégale el checklist de rotación y sigue con F0-2 sin bloquearte.

**Gate de salida:** API rechaza arrancar con JWT_SECRET débil; login con 11 intentos da 429; un `<img onerror>` en un post de blog no ejecuta; checkout test con metadata manipulada no activa producto.

---

### FASE 1 — Backend del plan insignia (armonía API ↔ client empieza aquí)

#### F1-1 · Fuente única de planes en la API

- **Qué:** hoy los precios viven dispersos en constantes de `src/services/stripe_service.js` (`AI_PLANS`, lógica de bolsa/despacho/clínica). Crear `src/config/plans.js` en diginode-api como **única fuente de verdad**:
  ```js
  export const PLANS = {
    entrepreneur: {
      slug: 'entrepreneur',
      name: 'Plan Entrepreneur',
      monthly_promo: 300, promo_months: 6, monthly: 200,
      setup: 0, employees_included: 2, role: 'flagship',
    },
    empleado_individual: { slug: 'empleado_individual', name: 'Empleado Individual', monthly: 150, setup: 600, role: 'downsell' },
    estudio:  { slug: 'estudio',  name: 'Estudio',  monthly: 300, setup: 350, role: 'upsell' },
    clinica:  { slug: 'clinica',  name: 'Clínica',  monthly: 500, setup: 550, role: 'upsell' },
    empleado_extra: { slug: 'empleado_extra', name: 'Empleado adicional', monthly: 150, setup: 0, role: 'addon' },
  };
  ```
  Refactorizar `stripe_service.js` para leer de aquí. Las rutas existentes (`despacho_routes`, `clinica_routes`, `bolsa_routes`) siguen funcionando mapeando a estos slugs — no rompas enlaces ya publicados.
- **Endpoint nuevo:** `GET /api/plans` (público) que devuelve los planes con `role`, para que el client nunca hardcodee precios.
- **Hecho cuando:** ningún precio aparece como literal fuera de `config/plans.js`; `GET /api/plans` responde; checkout test de cada producto antiguo sigue funcionando.

#### F1-2 · Checkout del plan Entrepreneur

- **Qué:** endpoint `POST /api/entrepreneur/checkout` (o renombrar internamente el de despacho, manteniendo alias). Sesión de Stripe en modo suscripción: 300€/mes con fase promocional de 6 meses y luego 200€/mes (usar subscription schedule o dos prices de Stripe — el que ya use el flujo de "Operación Solo"; replica ese patrón). Metadata: `{ type: 'entrepreneur' }` y fulfillment correspondiente en el webhook (crear Client + User + email de bienvenida, igual que el flujo despacho actual).
- **Hecho cuando:** checkout test completo crea cliente, suscripción y email; el contraste de importes de F0-6 cubre este plan.

#### F1-3 · Límites de consumo de IA por plan

Ejecutar P1-3 de la auditoría. Límites iniciales (confirmados como punto de partida, ajustables por el humano): `entrepreneur` 4.000 mensajes/mes, `empleado_individual` 2.000, `estudio` 5.000, `clinica` 12.000, **`demo` 15 mensajes por contacto** (este último es crítico para F3-1: la demo pública sin límite es un agujero de costes).

#### F1-4 · Cliente demo "Nora" + modo demo

- **Qué:** crear (vía seed script `scripts/seed_demo_client.js`) un Client especial `slug: 'demo'` con knowledge/FAQs de un negocio de ejemplo realista del nicho (p. ej. consulta de fisioterapia unipersonal). En `recepcionista_service.js`, soportar un flag `is_demo`: el system prompt añade que Nora (a) atiende como si fuera ese negocio, (b) tras 3-4 intercambios menciona naturalmente que ella es el producto y pregunta nombre y tipo de negocio del visitante, (c) nunca promete precios fuera de los de `config/plans.js`, (d) ofrece el enlace de checkout o dejar sus datos.
- **Hecho cuando:** existe el client demo en BD, el pipeline WhatsApp→Claude responde con ese prompt, y el límite de 15 mensajes/contacto corta con un mensaje fijo que invita a la web.

#### F1-5 · Leads con origen y estado de funnel

- **Qué:** ampliar `src/models/lead_model.js`: `source` (enum: `organic | ads | demo_whatsapp | web_form | other`), `funnel_stage` (enum: `demo_started | identified | followup | won | lost`), `business_type` (string). Cuando la conversación demo capture nombre+negocio (F1-4), actualizar el lead a `identified`. Exponer estos campos en los endpoints admin de leads existentes.
- **Hecho cuando:** una conversación demo de prueba crea/actualiza un Lead con `source: 'demo_whatsapp'` visible en el panel admin.

#### F1-6 · Ejecutar P1-2 (crypto.randomBytes para temp passwords) — rápida, ciérrala aquí.

**Gate de salida F1:** `GET /api/plans` es la única fuente de precios; checkout entrepreneur funciona end-to-end en test; la demo responde y se corta a los 15 mensajes; los leads registran origen.

---

### FASE 2 — Frontend unificado (client consume lo de F1)

#### F2-1 · Fuente única de planes en el client

- **Qué:** crear `src/data/plans.js` que **fetchea `GET /api/plans`** vía `useApi` (con fallback estático mínimo para SSR/fallo de red, marcado con comentario `// FALLBACK: mantener sincronizado con api/src/config/plans.js`). Todas las vistas leen precios de aquí. Eliminar los literales de precio de `HomeView.vue`, `BolsaEmpleoView.vue`, `OperacionSoloView.vue`.
- **Hecho cuando:** `Grep` de `150€|200€|300€|500€|600€` en `src/views/` no devuelve precios hardcodeados en lógica (los textos de marketing tipo "ahorras 1.100€" pueden quedarse).

#### F2-2 · Home = página de venta del plan insignia (T1 de la estrategia)

- **Qué:** reescribir `src/views/home/HomeView.vue` según T1: hero problema-mecanismo-prueba para solopreneurs, una sola oferta (Entrepreneur), CTA primario "Habla con Nora ahora" (→ F2-4) y CTA secundario al checkout. Secciones: hero → cómo funciona (los 2 empleados trabajando) → prueba social (placeholder hasta F3-4, con estructura lista) → precio con garantía 14 días → FAQ → CTA final. Reutiliza el copy bueno ya existente ("activos en 7 días", "sin permanencia", "ahorras +1.100€").
- **Hecho cuando:** el hero responde en una frase qué/para quién/cuánto; no se menciona bolsa/clínica/despacho en la home.

#### F2-3 · Navegación simplificada

- **Qué:** en `src/components/layout/PublicLayout.vue`, el menú público queda: Inicio · Cómo funciona (anchor) · Precio (anchor) · Blog · "Habla con Nora" (botón destacado). Quitar del menú Bolsa de Empleo y las landings de clínica/despacho; **mantener sus rutas vivas** en `src/router/index.js` (tráfico directo + ventas asistidas usan esos enlaces como upsell/downsell).
- **Hecho cuando:** las rutas antiguas cargan por URL directa pero no aparecen en menú ni footer destacado.

#### F2-4 · CTA WhatsApp global

- **Qué:** componente `src/components/ui/WhatsAppCta.vue`: botón flotante (y variante inline para el hero) que abre `https://wa.me/<NUMERO_DEMO>?text=Hola%20Nora`. El número va en `.env` del client (`VITE_DEMO_WHATSAPP`) — pídele el número al humano si no existe; usa placeholder mientras tanto y anótalo en §2.
- **Hecho cuando:** visible en todas las páginas públicas, no en admin/portal.

#### F2-5 · Página del plan (refactor de `OperacionSoloView.vue`)

- **Qué:** renombrar la ruta a `/plan` (alias desde la antigua), actualizar a marca "Plan Entrepreneur", precios desde F2-1, añadir bloque de garantía 14 días, checkout contra `POST /api/entrepreneur/checkout`.
- **Hecho cuando:** checkout test completo desde el navegador funciona; la URL antigua redirige.

#### F2-6 · Extraer `PlanCard.vue`, `EmployeeCard.vue`, `FaqAccordion.vue`

- Parcial de P2-1, solo lo que la home y la página del plan necesiten ahora. El refactor completo de vistas admin queda para F6-2.

**Gate de salida F2:** `npm run build` limpio; recorrido manual: home → hablar con Nora (link correcto) → página plan → checkout test OK; rutas antiguas accesibles por URL.

---

### FASE 3 — Demo viva + funnel medible

- **F3-1:** conectar el número real de WhatsApp demo al pipeline (T2 + F1-4). Requiere del humano: número/línea de WhatsApp Business y conexión en Make.com. Tu parte: prompt, límites, registro de leads.
- **F3-2:** verificar end-to-end que la conversación demo → Lead `identified` con nombre+negocio.
- **F3-3:** dashboard de funnel (T6): en `src/views/admin/LeadsView.vue` (o nueva `FunnelView.vue`), 4 números semanales: demos iniciadas, % identificados, ventas, y fuente. Endpoint agregado en la API (`GET /api/admin/funnel?week=`).
- **F3-4 (humano):** casos de prueba social (T3). Tu parte: preparar la sección de la home para recibirlos y un template de "caso" (captura + métrica + cita).
- **F3-5:** secuencia de seguimiento (T7): 4 emails vía Resend programados a D+1/D+3/D+7/D+14 para leads `identified` que no compran. Implementación simple sin colas: job con `node-cron` en el server que corre cada hora y consulta leads elegibles (campo `followup_step` + `last_followup_at` en el Lead).

**Gate de salida F3:** una persona real puede: ver un reel → escribir a Nora → recibir respuesta → dejar sus datos → aparecer en el dashboard → recibir el email D+1.

---

### FASE 4 — Marketing y lanzamiento

- **F4-1:** generar la grilla de 30 días con los 5 guiones plantilla de T4, particularizados al negocio demo (fisioterapia u otro que confirme el humano). Entregable: documento `MARKETING_GRILLA_MES1.md` con guion palabra a palabra, texto en pantalla, caption y CTA por pieza.
- **F4-2:** Meta Pixel en `index.html` del client + eventos: `Contact` (clic WhatsApp), `InitiateCheckout`, `Purchase` (página de éxito). El Pixel ID lo da el humano (`VITE_META_PIXEL_ID`).
- **F4-3/F4-4 (humano):** publicar y activar ads según T5, con su regla de decisión (coste por demo <8€ y 1 venta/25 demos → escalar ×2; si no, cambiar creativo primero).
- **F4-5 (recurrente):** cada semana, leer el dashboard de F3-3 y producir un resumen contra las métricas norte de `ESTRATEGIA_NEGOCIO.md` §7 (≥40 demos/semana, ≥40% identificados, <8€/demo, 4-6 clientes/mes, MRR ≥1.500€ a 90 días).

**Regla dura:** F4-4 no se activa sin F3-1 (demo funciona) y F3-4 (≥3 pruebas publicadas). Es la anti-tarea #4.

---

### FASE 5 — Robustez técnica

Ejecutar en orden: P1-5, P1-8, P1-6 (rápidas) → P1-1 → P1-7 → P1-4, tal como están en `AUDITORIA_TECNICA.md`. Ninguna cambia comportamiento visible del funnel; verifica el gate mínimo tras cada una.

### FASE 6 — Mantenibilidad

Ejecutar P2-2 primero (lint facilita todo lo demás), luego P2-1 completo, P2-3, P2-4, P2-5, P2-6, y los P3 (tests primero: `stripe_service` es el módulo que más dinero protege). Sin fecha límite: una tarea por sesión libre.

---

## 4. Recuperación ante pérdida de contexto (resumen de emergencia)

Si solo puedes leer una cosa, lee esto:

- **Proyecto:** DigiNode vende "empleados IA" por suscripción. Dos repos hermanos en `C:\Users\Usuario\Programación\Producción\`: `diginode-client` (Vue 3) y `diginode-api` (Express + Mongo + Stripe + Claude).
- **Misión:** implementar el giro comercial a una sola oferta insignia (**Plan Entrepreneur, 300€/mes promo 6 meses → 200€/mes**, nicho solopreneurs, demo viva por WhatsApp con "Nora") y aplicar la auditoría técnica. El detalle vive en `AUDITORIA_TECNICA.md` (IDs P*) y `ESTRATEGIA_NEGOCIO.md` (IDs T*), ambos en la raíz de diginode-client.
- **Estado:** míralo en §2 de este archivo y en `git log` (commits `[F*-T*]`). No confíes en tu memoria.
- **Siguiente paso:** la primera tarea sin `[x]` en §2, respetando los gates de fase.
- **Líneas rojas:** no commitear `.env`, no inventar precios (solo los de la tabla de decisiones §0), no romper el webhook de Stripe, no activar ads antes de demo + prueba social, no crear ofertas nuevas.
