<template>
  <div class="legal-page">
    <div class="container">
      <div class="legal-page__header">
        <RouterLink to="/" class="legal-page__back">
          <ArrowLeft :size="16" />
          Volver al inicio
        </RouterLink>
        <h1 class="legal-page__title">Términos y Condiciones</h1>
        <p class="legal-page__updated">Última actualización: 8 de marzo de 2026</p>
      </div>

      <div class="legal-page__body">

        <section class="legal-section">
          <h2>1. Objeto y aceptación</h2>
          <p>Los presentes Términos y Condiciones (en adelante, "los Términos") regulan el acceso y uso de los servicios de automatización mediante inteligencia artificial prestados por <strong>Diginode</strong> (en adelante, "la Empresa") a sus clientes (en adelante, "el Cliente").</p>
          <p>La contratación de cualquiera de los servicios ofrecidos implica la aceptación plena y sin reservas de los presentes Términos. Si el Cliente no está de acuerdo con alguna de las condiciones aquí establecidas, deberá abstenerse de contratar los servicios.</p>
        </section>

        <section class="legal-section">
          <h2>2. Descripción del servicio</h2>
          <p>Diginode ofrece un servicio de "empleados de inteligencia artificial" que incluye, sin carácter exhaustivo:</p>
          <ul>
            <li><strong>La Recepcionista:</strong> agente de IA para la atención y cualificación de clientes potenciales en canales de mensajería (WhatsApp Business, Instagram, LinkedIn).</li>
            <li><strong>El Gestor:</strong> agente de IA para la automatización de cobros, altas, bajas y comunicaciones de gestión.</li>
            <li><strong>El Ingeniero:</strong> agente de IA para el análisis de reuniones y la resolución de tickets de soporte técnico.</li>
            <li><strong>El Content Manager:</strong> agente de IA para la planificación y redacción de contenido en redes sociales.</li>
            <li><strong>El Diseñador:</strong> agente de IA para la generación de imágenes y recursos visuales.</li>
          </ul>
          <p>Los servicios pueden contratarse de manera individual o en paquetes según las tarifas vigentes publicadas en el sitio web.</p>
        </section>

        <section class="legal-section">
          <h2>3. Proceso de contratación</h2>
          <p>La contratación se formaliza mediante los siguientes pasos:</p>
          <ol>
            <li>El Cliente solicita una demostración gratuita a través del sistema de reservas disponible en el sitio web.</li>
            <li>Tras la demostración, si el Cliente desea proceder, Diginode emite un enlace de pago a través de la plataforma Stripe.</li>
            <li>El pago del <em>setup</em> (configuración inicial) activa el proceso de implementación del servicio.</li>
            <li>Una vez configurado el sistema (plazo estimado de 48 horas hábiles), se inicia la primera facturación mensual.</li>
          </ol>
        </section>

        <section class="legal-section">
          <h2>4. Precios y facturación</h2>
          <p>Los precios actuales de los servicios son:</p>
          <div class="legal-table-wrapper">
            <table class="legal-table">
              <thead>
                <tr>
                  <th>Servicio</th>
                  <th>Setup (único)</th>
                  <th>Mensual</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>La Recepcionista</td><td>450 €</td><td>249 €</td></tr>
                <tr><td>El Gestor</td><td>450 €</td><td>199 €</td></tr>
                <tr><td>El Ingeniero</td><td>450 €</td><td>249 €</td></tr>
                <tr><td>El Content Manager</td><td>450 €</td><td>199 €</td></tr>
                <tr><td>El Diseñador</td><td>450 €</td><td>249 €</td></tr>
                <tr><td>Paquete El Motor de Ventas</td><td>500 €</td><td>380 €</td></tr>
                <tr><td>Paquete El Dpto. de Marketing</td><td>500 €</td><td>380 €</td></tr>
                <tr><td>Paquete La Empresa Autónoma</td><td>1.200 €</td><td>760 €</td></tr>
              </tbody>
            </table>
          </div>
          <p>Todos los precios están expresados en euros e incluyen el IVA aplicable según la legislación española vigente. Diginode se reserva el derecho de modificar sus tarifas con un preaviso de 30 días naturales al Cliente.</p>
          <p>El <em>setup</em> puede fraccionarse en hasta tres (3) mensualidades, según acuerdo previo entre las partes. Las cuotas mensuales se cobran de forma automática a través de Stripe.</p>
        </section>

        <section class="legal-section">
          <h2>5. Duración y cancelación</h2>
          <p>El servicio no tiene permanencia mínima. El Cliente puede cancelar su suscripción mensual en cualquier momento con un preaviso mínimo de <strong>30 días naturales</strong> enviado por escrito a la dirección de correo electrónico de Diginode.</p>
          <p>La cancelación tendrá efecto al término del período mensual en curso. El pago del <em>setup</em> no es reembolsable, dado que retribuye el trabajo de configuración ya realizado.</p>
          <p>Diginode se reserva el derecho de suspender o cancelar el servicio de forma inmediata en caso de impago o uso fraudulento o contrario a la ley.</p>
        </section>

        <section class="legal-section">
          <h2>6. Obligaciones del cliente</h2>
          <p>El Cliente se compromete a:</p>
          <ul>
            <li>Proporcionar información veraz y actualizada durante el proceso de contratación y configuración.</li>
            <li>Mantener vigente su método de pago registrado en Stripe.</li>
            <li>Usar los servicios de conformidad con la legislación aplicable y la ética empresarial.</li>
            <li>No intentar manipular, revertir, copiar o reproducir los sistemas de IA que conforman los servicios.</li>
            <li>Mantener confidenciales las credenciales de acceso al panel de control.</li>
          </ul>
        </section>

        <section class="legal-section">
          <h2>7. Limitación de responsabilidad</h2>
          <p>Diginode no se hace responsable de los daños o perjuicios que pudieran derivarse de:</p>
          <ul>
            <li>Decisiones de negocio tomadas con base en los análisis o outputs generados por los agentes de IA.</li>
            <li>Interrupciones del servicio motivadas por fallos de terceros (proveedores de IA, plataformas de mensajería, servicios cloud, etc.).</li>
            <li>El uso indebido del servicio por parte del Cliente o de terceros con acceso a las credenciales del Cliente.</li>
          </ul>
          <p>En ningún caso la responsabilidad total de Diginode frente al Cliente por cualquier concepto superará el importe de las cuotas mensuales abonadas en los últimos tres (3) meses.</p>
        </section>

        <section class="legal-section">
          <h2>8. Propiedad intelectual</h2>
          <p>Los sistemas, flujos, prompts, código y metodología desarrollados por Diginode son propiedad exclusiva de la Empresa y están protegidos por la legislación de propiedad intelectual. El Cliente no adquiere ningún derecho de propiedad sobre dichos elementos.</p>
          <p>El contenido generado por los agentes de IA (textos, imágenes, análisis) es propiedad del Cliente y puede ser utilizado libremente en el marco de su actividad empresarial.</p>
        </section>

        <section class="legal-section">
          <h2>9. Legislación y fuero</h2>
          <p>Los presentes Términos se rigen por la legislación española. Para la resolución de cualquier controversia derivada de su interpretación o cumplimiento, las partes se someten a los Juzgados y Tribunales competentes conforme a la legislación vigente.</p>
          <p class="legal-note">⚠️ Nota: Este documento es un borrador informativo generado para tu revisión. Se recomienda su validación por un profesional del derecho antes de publicarlo como documento jurídicamente vinculante.</p>
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
    margin: 0 auto 0;
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

  p {
    font-size: $text-sm;
    color: $text-muted;
    line-height: 1.8;
  }

  ul, ol {
    list-style: disc;
    padding-left: $space-6;
    display: flex;
    flex-direction: column;
    gap: $space-2;

    li {
      font-size: $text-sm;
      color: $text-muted;
      line-height: 1.7;
    }
  }

  ol { list-style: decimal; }
}

.legal-table-wrapper {
  overflow-x: auto;
}

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
    white-space: nowrap;
  }

  td {
    padding: $space-3 $space-4;
    border: 1px solid $border;
    color: $text;
  }

  tr:hover td {
    background: $primary-subtle;
  }
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
