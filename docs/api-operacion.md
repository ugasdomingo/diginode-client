# API de operación que espera el panel

El frontend llama a estos endpoints solo cuando `VITE_OPS_USE_MOCK=false`.
En `main` de `diginode-api` todavía no están. Hasta entonces el panel usa
`src/api/ops/mock.js` y lo dice en pantalla.

El prefijo es el de siempre: `VITE_API_URL` (por defecto `http://localhost:3000/api`).
Las respuestas siguen el estilo actual: `{ success, data?, message?, token? }`.
Los nombres van en snake_case. El admin lleva `Authorization: Bearer`.

Contratos en JSDoc: `src/api/ops/contracts.js`.

## Acceso

### POST /auth/login

Igual que ahora para Domingo (`role: admin`): devuelve `token` y `user`.

Para un cliente, no devuelve token:

```json
{
  "success": true,
  "mfa_required": true,
  "challenge_id": "ch_123",
  "expires_at": "2026-11-01T18:10:00.000Z",
  "destination_hint": "l***@aireyoga.test"
}
```

El código es de 6 dígitos y llega por correo.

### POST /auth/mfa/verify

`{ "challenge_id": "ch_123", "code": "482913" }` → `{ success, token, user }` con `user.role = "client"`.

### POST /auth/mfa/resend

`{ "challenge_id": "ch_123" }` → `{ success }`.

## Leads (solo lectura)

### GET /admin/ops/leads

Lista del pipeline. Cada lead tiene `status` (`nuevo`, `mensaje_enviado`, `con_respuesta`, `llamada_visita`, `pieza_enviada`, `cliente`, `perdido`), `next_action` (`type`: `call` o `visit`) y `timeline`.

### GET /admin/ops/leads/:id

La ficha. `timeline[]` usa `type`: `message_sent`, `piece_sent`, `reply`, `next_action`.

## Clientes (solo lectura)

### GET /admin/ops/clients

### GET /admin/ops/clients/:id

Incluye `kpis`: `pieces_this_month`, `approved`, `pending`, `avg_approval_days`, `open_invoices_cents`, `next_meeting_at`, `messages_sent`, `replies`.

## Aprobaciones en dos pasos

El bot deja la pieza en `stage: "domingo"`. Si Domingo aprueba, pasa a `stage: "client"`. Si el cliente la rechaza con comentario, vuelve a `stage: "domingo"` con `needs_reapproval: true` y no se publica hasta una nueva aprobación.

### GET /admin/ops/approvals

Pendientes de Domingo. `?client_id=` devuelve las de esa cuenta.

### POST /admin/ops/approvals/:id/approve

### POST /admin/ops/approvals/:id/reject

Cuerpo opcional: `{ "comment": "..." }`. No llega al cliente.

## Bóveda

La respuesta nunca incluye `secret`, `password`, `api_key` ni `value`. El cliente también los borra si un backend los devolviera por error.

### GET /admin/ops/vault

Metadatos: `id`, `client_id`, `label`, `kind`, `username`, `url`, `notes`, `has_secret`, `updated_at`.

`kind`: `instagram`, `facebook`, `google_business`, `dominio`, `hosting`, `email`, `bot_api_key`, `otro`.

### POST /admin/ops/vault

```json
{
  "client_id": "cli_aire",
  "label": "Instagram de Aire",
  "kind": "instagram",
  "username": "@estudio.aire",
  "secret": "solo-en-el-cuerpo-de-esta-peticion",
  "url": "https://instagram.com/estudio.aire",
  "notes": ""
}
```

### PATCH /admin/ops/vault/:id

Igual, con `secret` opcional. Si viene vacío, la clave guardada no cambia.

## Portal del cliente

### GET /portal/ops/deliverables

Piezas de la cuenta del token.

### POST /portal/ops/deliverables/:id/approve

### POST /portal/ops/deliverables/:id/reject

`{ "comment": "..." }` obligatorio. La pieza vuelve a Domingo.

### GET /portal/ops/reports

`google_doc_url` es un enlace https al documento.

### GET /portal/ops/meetings

### POST /portal/ops/meetings

`{ "preferred_at": "2026-11-20T09:00:00.000Z", "channel": "visita", "note": "" }`

`channel`: `llamada`, `visita` o `videollamada`.

### GET /portal/ops/invoices

Importes en céntimos. `status`: `open`, `paid`, `void`, `draft`.

### POST /portal/ops/invoices/:id/checkout

`{ "success": true, "data": { "checkout_url": "https://checkout.stripe.com/c/pay/cs_..." } }`

El navegador solo navega si la URL es de `checkout.stripe.com`.

## Cuentas de la demostración

No son cuentas reales. Sirven con `VITE_OPS_USE_MOCK` distinto de `false`.

- Domingo: `domingo@midiginode.com` / `Madrid-2026`
- Cliente (Lucía, Estudio Aire): `lucia@aireyoga.test` / `Aire-2026`, código `482913`
