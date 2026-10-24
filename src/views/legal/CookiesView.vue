<template>
  <div class="legal-page">
    <div class="container">
      <div class="legal-page__header">
        <RouterLink to="/" class="legal-page__back">
          <ArrowLeft :size="16" />
          Volver al inicio
        </RouterLink>
        <h1 class="legal-page__title">Política de Cookies</h1>
        <p class="legal-page__updated">Última actualización: 24 de octubre de 2026 · Versión de revisión</p>
      </div>

      <div class="legal-page__body">

        <section class="legal-section"><h2>1. Publicidad desactivada</h2><p>Esta entrega no carga el Pixel de Meta, aunque exista un identificador antiguo configurado. Cualquier activación publicitaria futura requiere información y consentimiento previo, informado y revocable.</p></section>
        <section class="legal-section"><h2>2. Almacenamiento funcional</h2><p>Al escribir a Nora se puede guardar un identificador aleatorio en localStorage (dn_demo_contact) para mantener la identidad de demo y sus límites. Los mensajes visibles se mantienen en memoria, sin persistirlos en el navegador. El servidor conserva la conversación en el CRM.</p><p>El acceso al panel utiliza almacenamiento funcional para la sesión autenticada. Borrar los datos del sitio elimina esos elementos del navegador.</p></section>
        <section class="legal-section"><h2>3. Medición propia</h2><p>La medición está desactivada por defecto. Antes de activarla debe revisarse la configuración del entorno y si cumple las condiciones aplicables para la medición de audiencia. La ausencia de cookies no elimina automáticamente las obligaciones de privacidad.</p><p>Cuando está habilitada, registra la ruta sin parámetros, duración visible, canal y dispositivo categorizados y eventos de navegación. No incluye emails, mensajes ni identificadores del CRM. La IP y el navegador intervienen en un hash diario; la IP no se almacena en el registro de medición. Los registros se borran a los 90 días. El hash es un seudónimo diario, no anonimato absoluto.</p><p>Se respetan las señales Do Not Track y Global Privacy Control. La navegación del panel no se registra en este sistema.</p><p>Consulta las <a href="https://www.aepd.es/guias/guia-cookies-analiticas-externas.pdf" target="_blank" rel="noopener noreferrer">condiciones de medición de audiencia de la AEPD</a>.</p></section>
        <section class="legal-section"><h2>4. Información pendiente antes de publicar</h2><p>El responsable debe completar su identidad, revisar proveedores, conservación y condiciones del despliegue. Esta versión es una preparación local pendiente de esa validación. Consulta la <RouterLink to="/legal/privacidad">información de privacidad</RouterLink> para solicitar atención.</p></section>

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
