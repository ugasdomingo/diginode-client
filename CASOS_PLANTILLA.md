# Casos de éxito (prueba social) — cómo rellenarlos

La página del plan (`/plan`) tiene una sección de **Casos** que solo aparece
cuando hay al menos un caso cargado. Mientras el array esté vacío, la sección
queda oculta (no hay que tocar nada para esconderla).

## Dónde se editan

Archivo: `src/views/home/OperacionSoloView.vue` → array `const casos = [ ... ]`.

Cada caso es un objeto con estos campos:

```js
{
  quote:    'Frase textual del cliente (1-2 líneas, en primera persona).',
  name:     'Nombre o inicial del cliente',          // p. ej. 'María G.'
  business: 'Tipo de negocio',                        // p. ej. 'Fisioterapeuta'
  metric:   '12 citas agendadas el primer mes',       // opcional, número concreto
}
```

## Recomendaciones (del plan de negocio, T3)

- **3 casos** es el mínimo para que la sección convenza.
- Cada caso ideal = **captura de conversación real (anonimizada) + 1 métrica concreta**
  (mensajes respondidos, citas agendadas, horas ahorradas).
- Si aún no hay clientes suficientes: ofrece el servicio a 2-3 negocios cercanos
  a precio reducido a cambio del caso documentado y un testimonio en vídeo de 30s.
- Verificables: nombre/negocio reales (con permiso) generan más confianza que
  testimonios anónimos.

## Ejemplo (descomenta y adapta en el array)

```js
const casos = [
  { quote: 'Nora contestó 87 WhatsApps el primer mes y agendó 12 citas mientras yo trabajaba.',
    name: 'María G.', business: 'Fisioterapeuta', metric: '12 citas agendadas el 1.er mes' },
  { quote: 'Dejé de responder mensajes los domingos. Alex me prepara el día y filtra lo urgente.',
    name: 'Carlos R.', business: 'Consultor independiente', metric: '6 h/semana recuperadas' },
  { quote: 'Mis clientes creen que tengo recepcionista. Es Nora, y responde en 10 segundos a las 3 AM.',
    name: 'Lucía M.', business: 'Centro de estética', metric: '0 mensajes sin responder' },
]
```

> Vídeos/testimonios visuales: súbelos a tu hosting y, si quieres mostrarlos,
> pídeme que amplíe la sección para soportar vídeo. De momento es texto + métrica.
