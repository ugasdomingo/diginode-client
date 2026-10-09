# Prueba local de Diginode

Esta versión permite probar el recorrido de los departamentos en este equipo. No es todavía una instalación para atender pacientes reales. Las cuentas son Diginode y Consulta de prueba; sus datos se mantienen separados.

Diginode conserva el ejemplo utilizado durante la verificación. Para empezar el alta desde cero, selecciona Consulta de prueba; puedes cambiarle la marca en Configuración.

## Arranque

En una terminal dentro de `diginode-api`:

```powershell
npm run lab
```

En otra terminal dentro de `diginode-client`:

```powershell
npm run lab
```

Abrir **http://127.0.0.1:5174/lab.html**. Si ambos servidores siguen abiertos desde la sesión de desarrollo, basta visitar el enlace. Para detenerlos, usar Ctrl+C en cada terminal. Una sesión de laboratorio caduca tras una hora; recargar abre otra sesión local.

El arranque normal de producción continúa usando sus comandos habituales. El laboratorio tiene una entrada independiente, ignora los `.env` de producción y escucha únicamente en la interfaz local. Nunca se importa desde la API publicada.

## Recorrido de cinco minutos

1. Elegir Diginode. En Recepción, registrar una persona con correo ficticio, por ejemplo `persona@ejemplo.test`. El seguimiento comienza desmarcado; activarlo solo para probar esa secuencia.
2. Preguntar por precios. Debe aparecer el catálogo 79/149/249 EUR y las instalaciones 99/149/249 EUR. Probar una pregunta de diagnóstico: debe quedar para revisión humana, sin afirmar que se ha enviado un aviso.
3. En Agenda, reservar un hueco. Cambiarlo seleccionando otro horario y luego, si se desea, cancelarlo. Las reservas confirmadas se guardan, y una cancelación detiene sus recordatorios pendientes.
4. En Administración, simular la contratación de un plan, completar los tres controles de incorporación y activar la cuenta de prueba. El primer pago simulado separa mensualidad e instalación. No existe cargo de Stripe.
5. En Marketing, escribir una idea de al menos veinte caracteres. Se generan tres borradores con plantillas. Editar y guardar uno, aprobar su versión actual y programar su entrega de prueba para diez segundos después. También se puede descargar un diseño SVG.
6. Volver a Dirección y calidad. La confirmación de cita y la pieza programada aparecen en Entregas simuladas. El servidor procesa trabajos cada cinco segundos. Los recordatorios y seguimientos conservan sus fechas futuras; el botón de procesamiento no adelanta el reloj.
7. Cambiar a Consulta de prueba: no deben verse los contactos, reservas ni contenido de Diginode. Volver o recargar comprueba que los datos del primer negocio siguen guardados.
8. Probar pausa/reanudación y exportación del negocio. En Configuración se puede ajustar nombre, asistente, tono, zona horaria y conocimiento aprobado.

## Qué funciona y qué está simulado

| Funciona localmente | Requiere conexión y validación posteriores |
| --- | --- |
| Configuración y datos separados por negocio | Autenticación y aislamiento de la base de producción |
| Registro, conversación por reglas, pausa y derivación | Respuestas/generación con un proveedor IA real |
| Reservas, cambios, cancelaciones y control de conflictos | Calendario externo y sus webhooks |
| Estados de contratación e incorporación simulada | Checkout y webhook Stripe test de los planes nuevos |
| Borradores, revisión, versiones, diseño SVG y programación | Transcripción, generación IA y publicación en redes |
| Trabajos persistentes, reintentos, entregas simuladas y exportación | Correo, WhatsApp, Instagram, copias y recuperación de producción |

Los límites se prueban con conteos de respuestas y piezas. El coste externo del laboratorio es cero porque no llama a proveedores; todavía no es una estimación de coste real por cliente. Los horarios son huecos internos de prueba, no disponibilidad de un calendario conectado.

La persistencia utiliza `diginode-api/.local-lab/state.json`, excluido de Git. Es un adaptador de desarrollo de un solo escritor, con transacciones serializadas y guardado atómico. No sustituye las políticas RLS, la autenticación, el cifrado y los procedimientos necesarios para una base operativa real. Usar solo datos ficticios.

## Comprobaciones y continuidad

```powershell
# En diginode-api
npm test
npm run lint

# En diginode-client
npm run lab:build
npm run build
npm run lint
```

Consultar `PLAN_IMPLEMENTACION_UNIPERSONAL.md`, especialmente el registro de esta ejecución. Antes de activar proveedores faltan una base de pruebas autorizada, calendario, Stripe test y destinos de correo/redes de prueba. El país y los materiales de la psicóloga siguen pendientes. No copiar claves en el chat.
