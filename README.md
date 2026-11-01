# diginode-client
Repositorio para la nueva versión de DigiEmpresas

## Diginode operada por una persona

Plan: [PLAN_IMPLEMENTACION_UNIPERSONAL.md](PLAN_IMPLEMENTACION_UNIPERSONAL.md).

Laboratorio local: [PRUEBA_DIGINODE.md](PRUEBA_DIGINODE.md). Arranca con `npm run lab` y usa la API local del repositorio hermano, también con `npm run lab`. La prueba no conecta proveedores externos.

## Panel, portal y cookies

Hay un área privada para Domingo y un portal para el cliente. Los contratos con la API están en [docs/api-operacion.md](docs/api-operacion.md). Esos endpoints aún no están en `main` de `diginode-api`: con `VITE_OPS_USE_MOCK` distinto de `false` el panel enseña datos de demostración y lo dice en pantalla. No son clientes reales.

- Domingo entra en `/login` con `domingo@midiginode.com` / `Madrid-2026` y ve el pipeline, la cartera, las aprobaciones y la bóveda.
- Un cliente entra con `lucia@aireyoga.test` / `Aire-2026` y el código `482913`. Ahí aprueba piezas, abre los informes, pide reunión y paga por Stripe.
- La clave de un acceso se envía a la bóveda y no se guarda en el navegador.
- La medición, la publicidad y los calendarios incrustados no se cargan hasta que la persona acepta. Rechazar es tan directo como aceptar. Se cambia desde «Configurar cookies» en el pie.

Para hablar con la API de verdad: `VITE_OPS_USE_MOCK=false`. Las pruebas de consentimiento y de acceso: `npm test`.
