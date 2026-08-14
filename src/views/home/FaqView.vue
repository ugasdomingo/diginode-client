<template>
  <div class="faq">
    <div class="faq__header">
      <h1 class="faq__title">Preguntas frecuentes</h1>
      <p class="faq__subtitle">
        Todo lo que necesitas saber antes de poner en marcha tu Clínica Digital.
      </p>
    </div>

    <div class="faq__list">
      <details v-for="(item, i) in faqs" :key="i" class="faq__item">
        <summary class="faq__question">
          {{ item.q }}
          <ChevronDown :size="18" class="faq__chevron" />
        </summary>
        <p class="faq__answer">{{ item.a }}</p>
      </details>
    </div>

    <div class="faq__cta-block">
      <p>¿Sin dudas y con ganas de empezar?</p>
      <button type="button" class="faq__cta" :disabled="buying" @click="buyClinica">
        <ShoppingBag :size="18" />
        {{ buying ? 'Abriendo pago…' : 'Comprar Clínica Digital — 150€/mes' }}
      </button>
      <p class="faq__cta-note">
        ¿Prefieres probarla primero? <RouterLink to="/">Habla con Nora en la demo</RouterLink>.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ChevronDown, ShoppingBag } from 'lucide-vue-next'
import { useCheckout } from '@/composables/useCheckout'
import { useSeo } from '@/composables/useSeo'

const { buying, buyClinica } = useCheckout()

const faqs = [
  {
    q: '¿Qué incluye exactamente la Clínica Digital?',
    a: 'Una página web profesional con tu marca y tu dominio, más 3 empleados IA trabajando en ella: Nora (recepcionista, atiende y agenda a tus pacientes), Alex (auxiliar técnico, vigila que todo funcione) y Valeria (creadora de contenido para tu blog y redes). Incluye también tu panel de cliente con facturas, soporte y acceso directo a mí.',
  },
  {
    q: '¿Cuánto cuesta? ¿Hay costes ocultos?',
    a: 'Una única cuota de 150€ al mes. Sin coste de instalación, sin permanencia y sin sorpresas: el precio que ves es el precio que pagas. Lo único que va aparte es tu dominio (unos 10-15€ al año), porque es tuyo y va a tu nombre.',
  },
  {
    q: '¿Quiénes son los 3 empleados IA y qué hacen por mí?',
    a: 'Nora es tu recepcionista: responde mensajes de pacientes y personas interesadas, resuelve dudas frecuentes, envía correos y gestiona tu agenda de citas. Alex es tu auxiliar técnico: mantiene la web y los sistemas funcionando y me avisa si algo necesita atención. Valeria es tu creadora de contenido: prepara publicaciones para tu blog y tus redes de forma constante para que tu consulta sea visible sin que tú pierdas tiempo en ello.',
  },
  {
    q: '¿Necesito conocimientos técnicos?',
    a: 'Ninguno. Es un servicio llave en mano: yo monto la web, configuro los empleados IA con la información de tu consulta y te lo entrego funcionando. Tú solo respondes un formulario de bienvenida sobre tu práctica y revisas que todo esté a tu gusto.',
  },
  {
    q: '¿En cuánto tiempo está lista mi clínica digital?',
    a: 'En unos 7 días desde que completas el formulario de bienvenida, tu web y tus empleados IA están funcionando. Durante ese proceso te acompaño personalmente y validamos juntos los textos, la agenda y las respuestas de Nora.',
  },
  {
    q: '¿Puedo cancelar cuando quiera?',
    a: 'Sí. No hay permanencia: puedes cancelar tu suscripción en cualquier momento desde tu panel o escribiéndome, y no se te vuelve a cobrar. La cancelación no tiene penalización de ningún tipo.',
  },
  {
    q: '¿Qué significa "alquiler con opción a compra"?',
    a: 'Mientras pagas tu cuota mensual, la web y los empleados IA funcionan para ti en régimen de alquiler: tú eres dueño de tu dominio y de los datos de tus pacientes desde el día 1, y yo mantengo la tecnología. Al completar la cuota número 12, el traspaso se concreta: la web y los agentes pasan a ser tuyos.',
  },
  {
    q: '¿Qué pasa cuando completo las 12 cuotas?',
    a: 'La web y los 3 empleados IA son tuyos. Puedes seguir conmigo pagando la misma cuota (y seguir recibiendo mejoras, mantenimiento y soporte), o llevarte todo tal cual está y gestionarlo por tu cuenta o con tu propio técnico. Tú decides, sin presión.',
  },
  {
    q: '¿Y si cancelo antes de completar los 12 meses?',
    a: 'El servicio se desactiva al final del periodo pagado. Te llevas siempre lo que es tuyo: tu dominio y todos los datos de tus pacientes, exportados y en tu poder. La web y los empleados IA quedan en pausa; si vuelves más adelante, retomamos donde lo dejamos.',
  },
  {
    q: '¿De quién son el dominio y los datos de mis pacientes?',
    a: 'Tuyos, desde el primer día y en todos los escenarios. El dominio se registra a tu nombre y los datos de tus pacientes te pertenecen: si algún día te vas, te los llevas contigo. Yo nunca los uso para nada que no sea el funcionamiento de tu clínica digital.',
  },
  {
    q: '¿Recibo mejoras y actualizaciones?',
    a: 'Sí. Mientras tu suscripción esté activa, cada mejora o corrección que desarrollo se despliega automáticamente en tu clínica digital, sin coste extra. Si tras la compra decides llevarte el producto y desconectarte, conservas todo tal cual está en ese momento, pero dejas de recibir las mejoras futuras.',
  },
  {
    q: '¿Se integra con mi consultorio físico?',
    a: 'Sí, está pensada exactamente para eso. Nora agenda las citas en tu calendario real (el mismo que usas en consulta), responde por los canales donde ya te escriben tus pacientes y tú sigues pasando consulta presencial u online como siempre, pero sin perder horas al teléfono ni al WhatsApp.',
  },
  {
    q: '¿Cómo funciona el soporte si algo falla o tengo dudas?',
    a: 'Desde tu panel de cliente puedes abrir un ticket de soporte (que mi auxiliar técnico analiza al momento), descargar tus facturas y agendar una reunión conmigo cuando la necesites. Hablas siempre con una persona: yo.',
  },
]

useSeo({
  title: 'Preguntas frecuentes — Clínica Digital para psicólogos, coaches y terapeutas | DigiNode',
  description: 'Resuelve tus dudas sobre la Clínica Digital: precio de 150€/mes, cancelación sin permanencia, alquiler con opción a compra a 12 meses y propiedad de tu dominio y datos.',
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  },
})
</script>

<style lang="scss" scoped>
.faq {
  max-width: 760px;
  margin: 0 auto;
  padding: $space-12 $space-4 $space-16;

  &__header {
    text-align: center;
    margin-bottom: $space-10;
  }

  &__title {
    font-family: $font-display;
    font-size: $text-4xl;
    font-weight: $fw-bold;
    color: $text;
    margin-bottom: $space-3;
  }

  &__subtitle {
    color: $text-muted;
    font-size: $text-lg;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: $space-3;
  }

  &__item {
    background: $bg-card;
    border: 1px solid $border;
    border-radius: $radius;
    overflow: hidden;
    transition: $transition-fast;

    &:hover {
      border-color: $border-hover;
    }

    &[open] {
      border-color: $primary;

      .faq__chevron {
        transform: rotate(180deg);
      }
    }
  }

  &__question {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $space-4;
    padding: $space-4 $space-5;
    color: $text;
    font-weight: $fw-semibold;
    font-size: $text-base;
    cursor: pointer;
    list-style: none;

    &::-webkit-details-marker { display: none; }
  }

  &__chevron {
    flex-shrink: 0;
    color: $text-muted;
    transition: transform 0.2s ease;
  }

  &__answer {
    padding: 0 $space-5 $space-5;
    color: $text-muted;
    font-size: $text-sm;
    line-height: 1.7;
  }

  &__cta-block {
    margin-top: $space-12;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $space-4;

    p { color: $text-muted; }
  }

  &__cta {
    display: inline-flex;
    align-items: center;
    gap: $space-2;
    height: 52px;
    padding: 0 $space-6;
    background: linear-gradient(135deg, $primary 0%, $primary-dark 100%);
    color: $text-inverse;
    font-family: inherit;
    font-size: $text-base;
    font-weight: $fw-semibold;
    border: 0;
    border-radius: $radius;
    cursor: pointer;
    transition: $transition;
    box-shadow: 0 4px 20px rgba($primary, 0.3);

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba($primary, 0.4);
    }

    &:disabled { opacity: 0.6; cursor: wait; }
  }

  &__cta-note {
    font-size: $text-sm;

    a { color: $primary-light; font-weight: $fw-semibold; }
  }
}
</style>
