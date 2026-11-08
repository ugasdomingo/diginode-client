# diginode-client
Repositorio para la nueva versión de DigiEmpresas

## Diginode operada por una persona

Plan: [PLAN_IMPLEMENTACION_UNIPERSONAL.md](PLAN_IMPLEMENTACION_UNIPERSONAL.md).

Laboratorio local: [PRUEBA_DIGINODE.md](PRUEBA_DIGINODE.md). Arranca con `npm run lab` y usa la API local del repositorio hermano, también con `npm run lab`. La prueba no conecta proveedores externos.

## Panel, portal y cookies

Hay un área privada para Domingo y un portal para el cliente. Las llamadas siguen la API de agencia: [docs/api-operacion.md](docs/api-operacion.md). Los datos de ejemplo solo aparecen si `VITE_OPS_USE_MOCK=true`. Sin esa variable, o con cualquier otro valor, se usa la API real.

- Domingo entra en `/login` con `domingo@midiginode.com` / `Madrid-2026` y ve el pipeline, la cartera, las aprobaciones y la bóveda.
- Un cliente entra con `lucia@aireyoga.test` / `Aire-2026` y el código `482913`. Ahí aprueba piezas, abre los informes, ve las reuniones que Domingo ha confirmado y paga en Stripe si la factura ya tiene enlace.
- La clave de un acceso se envía a la bóveda y no se guarda en el navegador.
- La medición, la publicidad y los calendarios incrustados no se cargan hasta que la persona acepta. Rechazar es tan directo como aceptar. Se cambia desde «Configurar cookies» en el pie.

Las pruebas de consentimiento y de acceso: `npm test`.
