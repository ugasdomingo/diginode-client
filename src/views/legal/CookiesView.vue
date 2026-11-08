<template>
  <div class="legal-page">
    <div class="container">
      <div class="legal-page__header">
        <RouterLink to="/" class="legal-page__back">
          <ArrowLeft :size="16" />
          Volver al inicio
        </RouterLink>
        <h1 class="legal-page__title">Política de Cookies</h1>
        <p class="legal-page__updated">Última actualización: 1 de noviembre de 2026 · Borrador para revisión</p>
        <button type="button" class="legal-choice" @click="openConsent">Cambiar mi elección</button>
      </div>

      <div class="legal-page__body">

        <section class="legal-section">
          <h2>1. Qué ocurre antes de elegir</h2>
          <p>Hasta que aceptas, rechazas o configuras, no se carga medición, publicidad ni contenido incrustado de terceros. Rechazar está al mismo nivel que aceptar. Si rechazas, la web, el formulario y el panel siguen funcionando.</p>
          <p>Las fuentes se sirven desde este mismo sitio. No hay una petición a Google Fonts antes de tu elección.</p>
        </section>
        <section class="legal-section">
          <h2>2. Almacenamiento necesario</h2>
          <p>La elección se guarda en el almacenamiento local del navegador (dn_consent). Sirve solo para no volver a preguntar y puedes cambiarla desde «Configurar cookies» en el pie de página.</p>
          <p>Al escribir a Nora se puede guardar un identificador aleatorio (dn_demo_contact) para la demo. Los mensajes visibles no se guardan en el navegador. El acceso al panel guarda la sesión (dn_token). Son datos funcionales de la función que estás usando.</p>
        </section>
        <section class="legal-section">
          <h2>3. Medición, publicidad e incrustados</h2>
          <p>La medición propia solo se envía si la activas y, además, el entorno tiene la medición habilitada. No incluye correos, mensajes ni el panel. Se respetan Do Not Track y Global Privacy Control. El detalle de plazos y del hash diario debe revisarse antes de darla por definitiva.</p>
          <p>La publicidad (píxel de Meta) está apagada en el código de esta versión, aunque exista un identificador antiguo. Si se reactivara, exigiría el permiso de publicidad.</p>
          <p>Un calendario u otro contenido incrustado pide permiso solo para ese servicio, en la pantalla donde aparece. Si dices que no, la alternativa (formulario o enlace) sigue disponible.</p>
        </section>
        <section class="legal-section">
          <h2>4. Responsable</h2>
          <p>Domingo Ugas (Diginode), NIE Z0646506G, Calle de Siena 9, 28027 Madrid. Correo: ugasdomingo@gmail.com. Teléfono: +34 604 822 385. Más detalles en la <RouterLink to="/legal/privacidad">información de privacidad</RouterLink> y en el <RouterLink to="/legal/aviso-legal">aviso legal</RouterLink>.</p>
          <p class="legal-note">Este texto es un borrador para revisión. Conviene que lo valide un profesional del derecho antes de tratarlo como política definitiva.</p>
        </section>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ArrowLeft } from 'lucide-vue-next'
import { useConsentStore } from '@/stores/consent'

const consent = useConsentStore()
function openConsent() {
  consent.openPanel()
}
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

  .legal-choice {
    width: fit-content;
    background: transparent;
    color: $text;
    border: 1px solid $border-hover;
    border-radius: $radius;
    padding: $space-2 $space-4;
    cursor: pointer;
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
