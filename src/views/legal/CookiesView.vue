<template>
  <div class="legal-page">
    <div class="container">
      <div class="legal-page__header">
        <RouterLink to="/" class="legal-page__back">
          <ArrowLeft :size="16" />
          Volver al inicio
        </RouterLink>
        <h1 class="legal-page__title">Política de Cookies</h1>
        <p class="legal-page__updated">Última actualización: 19 de agosto de 2026</p>
      </div>

      <div class="legal-page__body">

        <section class="legal-section">
          <h2>1. Este sitio web no utiliza cookies</h2>
          <p>Diginode <strong>no instala cookies</strong> en el navegador de quienes visitan esta web, ni propias ni de terceros. Tampoco se emplean tecnologías de almacenamiento persistente equivalentes (<em>local storage</em>, <em>session storage</em>, huellas digitales del dispositivo o <em>fingerprinting</em>) con fines de seguimiento.</p>
          <p>Por este motivo, y conforme al artículo 22.2 de la Ley 34/2002 (LSSI-CE) y a las directrices de la Agencia Española de Protección de Datos, <strong>no se solicita consentimiento previo mediante un aviso de cookies</strong>: no existe tratamiento que lo requiera.</p>
        </section>

        <section class="legal-section">
          <h2>2. Medición de visitas</h2>
          <p>Para conocer cuántas personas visitan la web, qué páginas resultan de interés y durante cuánto tiempo se consultan, se utiliza un sistema de medición <strong>propio, agregado y anónimo</strong>, alojado en la infraestructura de Diginode. No interviene ningún proveedor externo de analítica ni de publicidad.</p>

          <h3>Qué se registra</h3>
          <ul>
            <li>La página visitada dentro de este sitio, sin parámetros de dirección.</li>
            <li>El tiempo que la página permanece visible en pantalla.</li>
            <li>El canal de procedencia, únicamente categorizado (acceso directo, Instagram, Google, etc.). No se conserva la dirección de origen completa.</li>
            <li>El tipo de dispositivo, únicamente categorizado (móvil, tableta u ordenador).</li>
            <li>Si se ha pulsado el botón de compra y si esta se ha completado, a efectos estadísticos.</li>
          </ul>

          <h3>Qué NO se registra</h3>
          <ul>
            <li><strong>No se almacena la dirección IP</strong>, ni completa ni truncada.</li>
            <li>No se registra ningún dato que identifique a una persona: nombre, correo electrónico, teléfono ni identificador estable.</li>
            <li>No se elabora ningún perfil, ni se sigue la navegación a través de otros sitios web.</li>
            <li>No se ceden datos a terceros ni se transfieren fuera del Espacio Económico Europeo.</li>
          </ul>
        </section>

        <section class="legal-section">
          <h2>3. Cómo se garantiza el anonimato</h2>
          <p>Para evitar contabilizar varias veces a la misma persona dentro de un mismo día, el sistema genera un código irreversible (función resumen SHA-256) a partir de la dirección IP y del navegador, combinados con un valor secreto <strong>que se renueva cada día</strong>.</p>
          <p>Este código no permite recuperar la información de la que procede ni relacionar las visitas de un mismo dispositivo entre días distintos: cada jornada genera un código diferente. La dirección IP interviene únicamente en ese cálculo instantáneo y <strong>en ningún momento se guarda</strong>.</p>
          <p>Los registros se eliminan automáticamente <strong>a los 90 días</strong> de su creación.</p>
        </section>

        <section class="legal-section">
          <h2>4. Cómo evitar la medición</h2>
          <p>Aunque esta medición es anónima y no requiere consentimiento, se respeta la voluntad expresada por el usuario: si el navegador envía la señal <em>Do Not Track</em> o <em>Global Privacy Control</em>, <strong>no se registra ninguna visita</strong>. Ambas opciones pueden activarse desde la configuración de privacidad del propio navegador.</p>
        </section>

        <section class="legal-section">
          <h2>5. Cambios en esta política</h2>
          <p>Si en el futuro se incorporasen cookies o herramientas de terceros —por ejemplo, con fines publicitarios—, esta política se actualizará y se solicitará el <strong>consentimiento previo, informado y revocable</strong> del usuario mediante un aviso que permita aceptar o rechazar cada finalidad antes de que se instale nada en su dispositivo.</p>
          <p>Para cualquier consulta sobre esta política puede escribirse a la dirección de contacto indicada en la <RouterLink to="/legal/privacidad">política de privacidad</RouterLink>.</p>
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

  h3 {
    font-size: $text-base;
    font-weight: $fw-semibold;
    color: $text;
    margin-top: $space-2;
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
