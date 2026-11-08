# Llamadas de operación que hace la web

El prefijo es `VITE_API_URL` (por defecto `http://localhost:3000/api`).
En la API esas rutas cuelgan de `/api/auth` y `/api/agency`.

Los ejemplos solo se usan si `VITE_OPS_USE_MOCK=true`. Sin definir, o con
cualquier otro valor, el panel llama a la API y muestra el error si algo falla.
No inventa datos.

Las respuestas siguen `{ success, data?, total?, message? }`. Los ids de Mongo
llegan como `_id`; el cliente los normaliza a `id`.

Contrato resumido en `src/api/ops/contracts.js`. El detalle de permisos está
en el README de `diginode-api`.

## Acceso

### POST /auth/login

Domingo (`role: admin`) recibe `token` y `user`.

Un cliente no recibe token:

```json
{ "success": true, "requires_otp": true, "challenge_id": "…" }
```

El código tiene 6 dígitos, llega por correo y caduca a los 10 minutos.
La API no manda una pista del correo: la pantalla usa el que se acaba de escribir.

### POST /auth/otp/verify

`{ "challenge_id", "code" }` → `{ success, token, user }` con `user.role = "client"`.
El JWT lleva `user_id`, `role` y `token_version`.

### POST /auth/otp/resend

`{ "challenge_id" }` → `{ success, requires_otp, challenge_id }`.
El identificador nuevo sustituye al anterior. El código viejo deja de valer.

## Pipeline (solo lectura)

### GET /agency/leads

`pipeline_status`: `nuevo`, `analizado`, `pieza_lista`, `pendiente_de_aprobacion`,
`contactado`, `respondio`, `reunion_visita`, `ganado`, `perdido`.

`next_action` es un texto. La fecha va en `next_action_at`.
La lista no incluye `activity`. Se pide `limit=100` y se siguen las páginas.

### GET /agency/leads/:id

La ficha trae `activity[]` con `type` (`mensaje_enviado`, `pieza_enviada`,
`respuesta`, `nota`, `siguiente_accion`), `summary` y `at`.

## Clientes, piezas y aprobaciones

### GET /agency/clients

Ficha real: `company`, `name`, `plan`, `service_package`, `brand`, `kpis[]`
(`name`, `value`, `unit`, `period`), `strategy_links`, `created_at`.
El cliente autenticado solo recibe la suya.

### GET /agency/pieces

`title`, `type`, `drive_url`, `status`, `version`, `versions[]`.

### GET /agency/approvals

`status`: `pendiente_domingo`, `pendiente_cliente`, `aprobado`, `devuelto`.
`round`, `mode` (`dos_fases` o `solo_domingo`), `piece_id`, `audit[]`.
El título y el enlace se leen de la pieza.

### POST /agency/approvals/:id/domingo

`{ "decision": "aprobar" | "rechazar", "comment": "…" }`.
El rechazo sin comentario responde 400. Aprobar en `dos_fases` pasa a
`pendiente_cliente`. Rechazar deja la pieza en `devuelto`.

### POST /agency/approvals/:id/client

El mismo cuerpo, solo si está `pendiente_cliente` y la pieza es de esa cuenta.
Un rechazo vuelve a `devuelto`. Domingo la ve otra vez cuando el bot la reenvía.

## Bóveda

La lista y el alta no incluyen `secret`. Ver la clave es otra llamada y queda auditada.

### GET /agency/clients/:id/credentials

`id`, `client_id`, `provider`, `label`, `created_at`, `updated_at`.

`provider`: `meta_business`, `google_business`, `web`, `analytics`, `otro`.

### POST /agency/clients/:id/credentials

`{ "provider", "label", "secret" }`. `secret` es un texto o un objeto.
No hay PATCH: para cambiarla se borra y se crea otra.

### DELETE /agency/credentials/:id

### POST /agency/credentials/:id/decrypt

Solo Domingo. Responde `{ id, provider, label, secret }`.

## Informes, reuniones y facturas

### GET /agency/reports

`period` (`YYYY-MM`), `title`, `drive_url`, `status` (`borrador` o `enviado`).

### GET /agency/meetings

El cliente solo lee. `title`, `starts_at`, `location`, `notes`,
`status` (`programada`, `hecha`, `cancelada`). No hay alta desde el portal.

### GET /agency/invoices

`concept`, `amount_eur`, `currency` (`EUR`), `status`
(`borrador`, `pendiente`, `pagada`, `anulada`, `revision`), `payment_url`, `paid_at`.

### POST /agency/invoices/:id/checkout

Solo Domingo o un bot. Devuelve `{ url, session_id, invoice_id }` y guarda `url`
en `payment_url`. El portal abre esa URL si es `https://checkout.stripe.com/…`.
El cliente no llama a esta ruta.

## Cuentas de demostración

- Domingo: `domingo@midiginode.com` / `Madrid-2026`
- Cliente: `lucia@aireyoga.test` / `Aire-2026`, código `482913`

No son cuentas reales. Solo existen con `VITE_OPS_USE_MOCK=true`.
