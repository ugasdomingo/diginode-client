<template>
  <div class="legal-page">
    <div class="container">
      <div class="legal-page__header">
        <RouterLink to="/" class="legal-page__back">
          <ArrowLeft :size="16" />
          Volver al inicio
        </RouterLink>
        <h1 class="legal-page__title">Política de Privacidad</h1>
        <p class="legal-page__updated">Última actualización: 24 de octubre de 2026 · Versión de revisión 2026-10</p>
      </div>

      <div class="legal-page__body">

        <section class="legal-section">
          <h2>1. Responsable del tratamiento</h2>
          <p>El responsable del tratamiento de los datos personales recogidos a través de este sitio web y de los servicios de Diginode es:</p>
          <div class="legal-databox">
            <p><strong>Denominación:</strong> Diginode [completar con razón social completa]</p>
            <p><strong>NIF/CIF:</strong> [completar]</p>
            <p><strong>Domicilio:</strong> [completar con dirección postal]</p>
            <p><strong>Correo electrónico:</strong> info@midiginode.com</p>
          </div>
        </section>

        <section class="legal-section">
          <h2>2. Datos personales que recogemos</h2><p>El formulario de revisión recoge nombre, empresa, email, necesidad y, opcionalmente, web, escala y presupuesto orientativo. Se utiliza para responder a la solicitud y preparar una conversación, sin crear una cuenta ni iniciar un cobro. No implica suscripción publicitaria.</p><p>La demo pública de Nora utiliza IA y conserva la conversación en el CRM. No introduzcas datos de pacientes ni información sensible. El navegador mantiene los mensajes solo en memoria durante la navegación; puede guardar un identificador aleatorio para aplicar los límites de la demo. Un correo de resumen se envía solo tras revisar y confirmar el destinatario y el contenido.</p>
          <p>En función de la interacción del usuario con nuestros servicios, podemos tratar las siguientes categorías de datos:</p>
          <ul>
            <li><strong>Datos de identificación:</strong> nombre, apellidos, correo electrónico, número de teléfono.</li>
            <li><strong>Datos de contacto comercial:</strong> empresa, sector de actividad, país.</li>
            <li><strong>Datos de conversación:</strong> mensajes intercambiados a través de los canales atendidos por La Recepcionista (web de demostración, WhatsApp e Instagram).</li>
            <li><strong>Datos de facturación:</strong> gestionados directamente por Stripe; Diginode no almacena datos de tarjeta de crédito.</li>
            <li><strong>Datos de uso:</strong> accesos al panel de control, tickets de soporte, interacciones con los agentes IA.</li>
          </ul>
        </section>

        <section class="legal-section">
          <h2>3. Finalidades y base legal del tratamiento</h2>
          <div class="legal-table-wrapper">
            <table class="legal-table">
              <thead>
                <tr>
                  <th>Finalidad</th>
                  <th>Base legal</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Prestación del servicio contratado</td>
                  <td>Ejecución de contrato (art. 6.1.b RGPD)</td>
                </tr>
                <tr>
                  <td>Gestión de facturación y cobros</td>
                  <td>Ejecución de contrato + obligación legal</td>
                </tr>
                <tr>
                  <td>Atención al cliente y soporte</td>
                  <td>Interés legítimo (art. 6.1.f RGPD)</td>
                </tr>
                <tr>
                  <td>Envío de comunicaciones comerciales</td>
                  <td>Consentimiento (art. 6.1.a RGPD)</td>
                </tr>
                <tr>
                  <td>Atender solicitudes comerciales y enviar el resumen expresamente confirmado</td>
                  <td>Gestión de la solicitud del interesado. La base aplicable y los plazos deben validarse antes de publicar.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="legal-section">
          <h2>4. Destinatarios de los datos</h2>
          <p>Los datos personales podrán ser comunicados a los siguientes terceros, en calidad de encargados del tratamiento:</p>
          <ul>
            <li><strong>Stripe, Inc.:</strong> gestión de pagos y suscripciones.</li>
            <li><strong>MongoDB:</strong> almacenamiento de solicitudes, conversaciones y gestión del servicio. Región y condiciones del alojamiento pendientes de confirmar antes de publicar.</li>
            <li><strong>Google Cloud (Google LLC):</strong> servicios de inteligencia artificial (Gemini API).</li>
            <li><strong>Make.com (Celonis SE):</strong> automatización de flujos de trabajo.</li>
            <li><strong>Anthropic:</strong> respuestas de Nora en la demo pública.</li><li><strong>Resend:</strong> envío del resumen confirmado y comunicaciones transaccionales.</li><li><strong>Cal.com:</strong> reservas de reuniones cuando el enlace esté configurado.</li>
          </ul>
          <p>Antes de publicar, el responsable debe validar los encargos de tratamiento, regiones, transferencias y conservación de los proveedores efectivamente configurados. No se afirma ausencia de retención ni uso de datos por terceros sin comprobar sus condiciones.</p>
        </section>

        <section class="legal-section">
          <h2>5. Conservación de los datos</h2>
          <p>Los datos se conservarán mientras dure la relación contractual y, una vez extinguida, durante los plazos establecidos por la legislación aplicable:</p>
          <ul>
            <li>Datos de facturación: durante los plazos legales aplicables que debe validar el responsable.</li>
            <li>Solicitudes, conversaciones y soporte: mientras se gestiona la relación y durante el plazo que el responsable debe fijar antes de publicar. No hay un borrado automático general de conversaciones configurado en esta entrega.</li><li>Acciones pendientes de correo: caducan a los 10 minutos; las confirmaciones enviadas se conservan un día para evitar duplicados. Registros de medición, cuando se active: borrado automático a los 90 días.</li>
            <li>Datos de marketing (con consentimiento): hasta la retirada del consentimiento.</li>
          </ul>
        </section>

        <section class="legal-section">
          <h2>6. Derechos de los interesados</h2>
          <p>El usuario puede ejercer los siguientes derechos ante el responsable del tratamiento:</p>
          <ul>
            <li><strong>Acceso:</strong> conocer qué datos personales se tratan.</li>
            <li><strong>Rectificación:</strong> corregir datos inexactos o incompletos.</li>
            <li><strong>Supresión:</strong> solicitar la eliminación de los datos ("derecho al olvido").</li>
            <li><strong>Limitación:</strong> solicitar la suspensión del tratamiento en determinadas circunstancias.</li>
            <li><strong>Portabilidad:</strong> recibir los datos en formato estructurado y de uso común.</li>
            <li><strong>Oposición:</strong> oponerse al tratamiento basado en interés legítimo o para fines de marketing.</li>
          </ul>
          <p>Para ejercer cualquiera de estos derechos, el usuario puede dirigirse por correo electrónico a la dirección indicada en el apartado 1, aportando únicamente la información necesaria para verificar su identidad.</p>
          <p>Sin perjuicio de lo anterior, el usuario tiene derecho a presentar una reclamación ante la <strong>Agencia Española de Protección de Datos (AEPD)</strong> en <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">www.aepd.es</a>.</p>
        </section>

        <section class="legal-section">
          <h2>7. Seguridad</h2>
          <p>Diginode aplica medidas técnicas y organizativas apropiadas para garantizar un nivel de seguridad adecuado al riesgo, incluyendo el cifrado en tránsito (TLS/HTTPS), el control de acceso por roles y la autenticación mediante JWT.</p>
        </section>

        <section class="legal-section">
          <h2>8. Cookies y medición de visitas</h2>
          <p>La publicidad está desactivada. Se usa almacenamiento funcional para el acceso al panel y para el identificador de la demo, cuando se utilizan esas funciones.</p>
          <p>Para conocer cuántas personas visitan la web y qué contenidos resultan de interés, Diginode dispone de un sistema de medición propio, desactivado por defecto en esta entrega hasta validar su configuración y condiciones de uso. Sus identificadores diarios son seudónimos, no una garantía de anonimato absoluto. Puedes consultar el detalle en la <RouterLink to="/legal/cookies">política de cookies</RouterLink>.</p>
          <p class="legal-note">⚠️ Nota: Este documento es un borrador informativo generado para tu revisión. Se recomienda su validación por un profesional del derecho (Delegado de Protección de Datos o abogado especialista en privacidad) antes de su publicación.</p>
        </section>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ArrowLeft } from 'lucide-vue-next'
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.legal-page {
  padding: $space-12 0 $space-16;

  &__header {
    max-width: 760px;
    margin: 0 auto;
    padding: 0 $space-6;
    margin-bottom: $space-10;
    display: flex;
    flex-direction: column;
    gap: $space-4;
  }

  &__back {
    display: inline-flex;
    align-items: center;
    gap: $space-2;
    color: $text-muted;
    font-size: $text-sm;
    text-decoration: none;
    transition: $transition-fast;
    width: fit-content;

    &:hover { color: $primary-light; }
  }

  &__title {
    font-size: $text-3xl;
    font-weight: $fw-bold;
    letter-spacing: -0.02em;
  }

  &__updated {
    font-size: $text-sm;
    color: $text-subtle;
    font-family: $font-mono;
  }

  &__body {
    max-width: 760px;
    margin: 0 auto;
    padding: 0 $space-6;
    display: flex;
    flex-direction: column;
    gap: $space-10;
  }
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.legal-section {
  display: flex;
  flex-direction: column;
  gap: $space-4;

  h2 {
    font-size: $text-xl;
    font-weight: $fw-semibold;
    color: $text;
    padding-bottom: $space-2;
    border-bottom: 1px solid $border;
  }

  p { font-size: $text-sm; color: $text-muted; line-height: 1.8; }

  a { color: $primary-light; }

  ul, ol {
    list-style: disc;
    padding-left: $space-6;
    display: flex;
    flex-direction: column;
    gap: $space-2;

    li { font-size: $text-sm; color: $text-muted; line-height: 1.7; }
  }
}

.legal-databox {
  background: $bg-surface;
  border: 1px solid $border;
  border-radius: $radius;
  padding: $space-5;
  display: flex;
  flex-direction: column;
  gap: $space-2;

  p { margin: 0; }
}

.legal-table-wrapper { overflow-x: auto; }

.legal-table {
  width: 100%;
  border-collapse: collapse;
  font-size: $text-sm;

  th {
    padding: $space-3 $space-4;
    text-align: left;
    background: $bg-surface;
    color: $text-muted;
    font-weight: $fw-semibold;
    border: 1px solid $border;
  }

  td {
    padding: $space-3 $space-4;
    border: 1px solid $border;
    color: $text;
  }

  tr:hover td { background: $primary-subtle; }
}

.legal-note {
  background: $warning-bg;
  border: 1px solid rgba(245,158,11,0.2);
  border-radius: $radius;
  padding: $space-4;
  font-size: $text-sm;
  color: $text-muted;
  line-height: 1.6;
}
</style>
