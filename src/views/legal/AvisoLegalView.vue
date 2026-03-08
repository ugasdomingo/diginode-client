<template>
  <div class="legal-page">
    <div class="container">
      <div class="legal-page__header">
        <RouterLink to="/" class="legal-page__back">
          <ArrowLeft :size="16" />
          Volver al inicio
        </RouterLink>
        <h1 class="legal-page__title">Aviso Legal</h1>
        <p class="legal-page__updated">Última actualización: 8 de marzo de 2026</p>
      </div>

      <div class="legal-page__body">

        <section class="legal-section">
          <h2>1. Datos identificativos del titular</h2>
          <p>En cumplimiento de lo establecido en el artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa al usuario de los siguientes datos identificativos del titular de este sitio web:</p>
          <div class="legal-databox">
            <p><strong>Denominación social:</strong> Diginode [completar con razón social completa]</p>
            <p><strong>NIF/CIF:</strong> [completar]</p>
            <p><strong>Domicilio social:</strong> [completar con dirección postal completa]</p>
            <p><strong>Correo electrónico de contacto:</strong> [completar]</p>
            <p><strong>Datos de inscripción en el Registro Mercantil:</strong> [completar cuando proceda]</p>
          </div>
        </section>

        <section class="legal-section">
          <h2>2. Objeto del sitio web</h2>
          <p>El presente sitio web tiene por objeto dar a conocer los servicios de automatización empresarial mediante agentes de inteligencia artificial ofrecidos por Diginode, así como facilitar el acceso al panel de control de los clientes contratantes.</p>
        </section>

        <section class="legal-section">
          <h2>3. Condiciones de uso</h2>
          <p>El acceso y uso de este sitio web implica la aceptación de las presentes condiciones. El usuario se compromete a hacer un uso lícito del sitio web, de conformidad con la legislación vigente, el orden público y las buenas costumbres.</p>
          <p>Quedan expresamente prohibidas las siguientes conductas:</p>
          <ul>
            <li>El uso del sitio web con fines fraudulentos, ilícitos o contrarios a las presentes condiciones.</li>
            <li>La reproducción, distribución o comunicación pública de los contenidos del sitio sin autorización expresa del titular.</li>
            <li>La introducción de virus, código malicioso u otros programas que puedan causar daños en los sistemas de Diginode o de terceros.</li>
            <li>El acceso no autorizado a los sistemas de información o bases de datos de Diginode.</li>
          </ul>
        </section>

        <section class="legal-section">
          <h2>4. Propiedad intelectual e industrial</h2>
          <p>Todos los contenidos del sitio web —incluyendo, sin carácter exhaustivo, textos, fotografías, gráficos, imágenes, iconos, tecnología, software, links y demás contenidos audiovisuales o sonoros, así como su diseño gráfico y códigos fuente— son propiedad intelectual de Diginode o de terceros que han autorizado su uso, y están protegidos por los derechos de propiedad intelectual e industrial reconocidos por la legislación española y la normativa comunitaria e internacional aplicable.</p>
          <p>Queda prohibida la reproducción total o parcial de los contenidos sin la autorización expresa y por escrito de Diginode, salvo que dicho uso sea estrictamente privado y no comercial.</p>
        </section>

        <section class="legal-section">
          <h2>5. Limitación de responsabilidad</h2>
          <p>Diginode no garantiza la disponibilidad y continuidad ininterrumpida del sitio web ni de los servicios ofrecidos a través del mismo. Tampoco se responsabiliza de los daños o perjuicios causados por:</p>
          <ul>
            <li>Interrupciones en el funcionamiento del sitio web por causas ajenas a Diginode (fallos en la red, ataques informáticos, mantenimientos de proveedores, etc.).</li>
            <li>La presencia de virus u otros elementos nocivos en los contenidos que puedan producir alteraciones en los sistemas informáticos del usuario.</li>
            <li>El uso ilícito, negligente, fraudulento o contrario al presente Aviso Legal por parte del usuario.</li>
          </ul>
        </section>

        <section class="legal-section">
          <h2>6. Política de enlaces</h2>
          <p>El sitio web puede contener enlaces a páginas web de terceros. Diginode no tiene control sobre el contenido de dichas páginas y no asume responsabilidad alguna por la información publicada en ellas. La inclusión de un enlace no implica relación, recomendación o supervisión por parte de Diginode.</p>
        </section>

        <section class="legal-section">
          <h2>7. Protección de datos</h2>
          <p>El tratamiento de datos personales realizado a través de este sitio web se rige por la <RouterLink to="/legal/privacidad">Política de Privacidad</RouterLink> de Diginode, de conformidad con el Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018, de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD).</p>
        </section>

        <section class="legal-section">
          <h2>8. Legislación aplicable y jurisdicción</h2>
          <p>Las presentes condiciones se rigen e interpretan de acuerdo con la legislación española. Para la resolución de cualquier controversia derivada del acceso o uso de este sitio web, las partes se someten expresamente a los Juzgados y Tribunales competentes según lo previsto en la legislación vigente.</p>
          <p class="legal-note">⚠️ Nota: Este documento es un borrador informativo generado para tu revisión. Se recomienda su validación por un profesional del derecho antes de su publicación definitiva como aviso legal vinculante.</p>
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

  a { color: $primary-light; text-decoration: none; &:hover { text-decoration: underline; } }

  ul {
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
