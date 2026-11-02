<template>
  <div class="legal-page">
    <div class="container">
      <div class="legal-page__header">
        <RouterLink to="/" class="legal-page__back">
          <ArrowLeft :size="16" />
          Volver al inicio
        </RouterLink>
        <h1 class="legal-page__title">Cookies y medición</h1>
        <p class="legal-page__updated">Última actualización: 1 de noviembre de 2026 · Borrador para revisión</p>
        <button type="button" class="legal-choice" @click="openConsent">Cambiar mi elección</button>
      </div>

      <div class="legal-page__body">

        <section class="legal-section">
          <h2>1. Qué ocurre antes de elegir</h2>
          <p>Hasta que aceptas, rechazas o configuras, no se carga la medición que usa la cookie de visitas, ni publicidad, ni contenido incrustado de terceros. Rechazar está al mismo nivel que aceptar. Si rechazas, la web, el formulario y el panel siguen funcionando.</p>
          <p>Hay una medición anónima, explicada en el nivel A, que no usa cookies ni el almacenamiento del navegador y no espera a esta elección. Las fuentes se sirven desde este mismo sitio. No hay una petición a Google Fonts.</p>
        </section>
        <section class="legal-section">
          <h2>2. Almacenamiento necesario</h2>
          <p>La elección se guarda en el almacenamiento local del navegador (dn_consent). Sirve solo para no volver a preguntar y puedes cambiarla desde «Configurar cookies» en el pie de página o con «Cambiar mi elección» en esta página.</p>
          <p>Al escribir a Nora se puede guardar un identificador aleatorio (dn_demo_contact) para la demo. Los mensajes visibles no se guardan en el navegador. El acceso al panel guarda la sesión (dn_token). Son datos funcionales de la función que estás usando, no de medición.</p>
        </section>
        <section class="legal-section">
          <h2>3. Tres niveles de medición</h2>
          <h3>A. Estadística agregada, sin consentimiento</h3>
          <p>Aunque rechaces las cookies, el sitio puede enviar una medición agregada de cada visita, por separado. No usa cookies, almacenamiento local ni almacenamiento de sesión. No crea un identificador de sesión ni de visitante. El recorrido de la pestaña abierta puede quedar en la memoria del navegador mientras sigues en ella, y se pierde al cerrarla o recargarla: esa memoria no se envía en esta medición ni enlaza una visita con otra.</p>
          <p>De cada petición solo salen datos que se pueden sumar: la ruta de la página, sin parámetros; el dominio del sitio del que vienes, no la dirección completa; los parámetros de campaña utm_source, utm_medium y utm_campaign, si el enlace los trae; el tipo de dispositivo (móvil, tableta o escritorio); el idioma principal del navegador y, si usas una vía de contacto, el tipo (llamada, WhatsApp o envío del formulario) y el lugar de la página (cabecera, botón flotante, sección de contacto, pie o Nora).</p>
          <p>El navegador no envía tu dirección IP dentro de ese mensaje ni la guarda. El servidor, al recibir la conexión, puede verla por cómo funciona internet: la usa solo para deducir un país o una ciudad aproximados y no la guarda. No hay huella del dispositivo.</p>
          <p>La base legal es el interés legítimo de Diginode (artículo 6.1.f del RGPD) en saber, de forma agregada, qué páginas se consultan y qué vías de contacto se usan. No hace falta el consentimiento porque esta medición no almacena ni lee información en tu terminal (artículo 22.2 de la LSSI). Si tu navegador envía Do Not Track o Global Privacy Control, esta medición tampoco se envía. Puedes oponerte escribiendo a ugasdomingo@gmail.com.</p>
          <h3>B. Recorrido de esta visita, asociado a una solicitud</h3>
          <p>El formulario de contacto tiene una casilla aparte, sin marcar: «Acepto que Diginode asocie mi visita a mi solicitud». Solo si la marcas, el recorrido que está en la memoria de esa pestaña se envía junto con la solicitud. Incluye las páginas por las que has pasado, los clics de contacto y el origen de la entrada (dominio de procedencia y parámetros de campaña). También se envía la versión de ese texto y la fecha en que lo aceptas.</p>
          <p>Si no la marcas, no se envía nada de ese recorrido. No es una cookie y no sobrevive al cerrar o recargar la pestaña. La base legal es tu consentimiento (artículo 6.1.a del RGPD), distinto del de las cookies. Puedes retirar ese consentimiento y pedir la supresión escribiendo a ugasdomingo@gmail.com.</p>
          <h3>C. Cookie dn_vid, para enlazar visitas de otros días</h3>
          <p>Si aceptas la categoría de medición, el sitio guarda una cookie propia llamada dn_vid. Contiene solo un identificador aleatorio, no una huella del dispositivo. Sirve para relacionar las páginas y los eventos de medición de días distintos. Dura como máximo 13 meses, con SameSite=Lax y Secure, y solo en este sitio.</p>
          <p>No se crea antes de aceptar. Si retiras la medición desde «Configurar cookies» o «Cambiar mi elección», la cookie se borra en ese momento. La medición con esta cookie solo se envía si, además, el entorno tiene la medición habilitada. No incluye correos, mensajes ni el panel. Se respetan Do Not Track y Global Privacy Control. Los registros de esa medición, cuando se activan, se borran a los 90 días, como indica la información de privacidad. El detalle del hash diario debe revisarse antes de dar el texto por definitivo.</p>
          <p>Si marcas la casilla del formulario y, además, habías aceptado esta cookie, la solicitud puede incluir ese identificador para vincular visitas anteriores. Si no habías aceptado la medición, la solicitud no lo lleva.</p>
        </section>
        <section class="legal-section">
          <h2>4. Qué se guarda en el navegador</h2>
          <div class="legal-table-wrapper">
            <table class="legal-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Tipo</th>
                  <th>Duración</th>
                  <th>Finalidad</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>dn_vid</td>
                  <td>Cookie propia</td>
                  <td>13 meses como máximo</td>
                  <td>Identificador aleatorio para enlazar visitas de distintos días. Solo si aceptas la medición.</td>
                </tr>
                <tr>
                  <td>dn_consent</td>
                  <td>Almacenamiento local</td>
                  <td>Hasta que lo borras o cambias la elección</td>
                  <td>Recordar si aceptaste, rechazaste o configuraste las cookies.</td>
                </tr>
                <tr>
                  <td>dn_token</td>
                  <td>Almacenamiento local</td>
                  <td>La sesión del panel</td>
                  <td>Mantener el acceso al panel. No es medición.</td>
                </tr>
                <tr>
                  <td>dn_demo_contact</td>
                  <td>Almacenamiento local</td>
                  <td>Hasta que lo borras</td>
                  <td>Aplicar los límites de la demo de Nora. No es medición.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <section class="legal-section">
          <h2>5. Publicidad e incrustados</h2>
          <p>La publicidad (píxel de Meta) está apagada en el código de esta versión, aunque exista un identificador antiguo. Si se reactivara, exigiría el permiso de publicidad.</p>
          <p>Un calendario u otro contenido incrustado pide permiso solo para ese servicio, en la pantalla donde aparece. Si dices que no, la alternativa (formulario o enlace) sigue disponible.</p>
        </section>
        <section class="legal-section">
          <h2>6. Acceso, copia y supresión</h2>
          <p>Puedes pedir acceso a los datos de medición asociados a tu solicitud o a la cookie dn_vid, una copia exportable y su supresión escribiendo a ugasdomingo@gmail.com. Indica en qué consiste la petición. Para la cookie, además, retirarla desde «Configurar cookies» la borra del navegador en ese momento. El recorrido de la visita no se conserva si no enviaste el formulario con la casilla marcada. El detalle de los derechos está en la <RouterLink to="/legal/privacidad">información de privacidad</RouterLink>.</p>
        </section>
        <section class="legal-section">
          <h2>7. Responsable</h2>
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
