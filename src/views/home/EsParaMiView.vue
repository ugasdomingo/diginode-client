<template>
  <div class="epm">
    <!-- Hero -->
    <section class="epm__hero">
      <h1 class="epm__title">
        Este servicio es para ti<br />
        <span class="epm__title-gradient">si te reconoces aquí</span>
      </h1>
      <p class="epm__subtitle">
        Léelos despacio. Si asientes con la cabeza en más de uno,
        sigue leyendo hasta el final.
      </p>
    </section>

    <!-- Pains -->
    <section class="epm__pains">
      <article v-for="(pain, i) in pains" :key="i" class="pain">
        <span class="pain__number">{{ String(i + 1).padStart(2, '0') }}</span>
        <div class="pain__body">
          <h2 class="pain__heading">{{ pain.title }}</h2>
          <p class="pain__text">{{ pain.text }}</p>
        </div>
      </article>
    </section>

    <!-- Agitación → empatía -->
    <section class="epm__truth">
      <p>
        Nadie te preparó para esto. Te formaste años para acompañar a personas,
        no para ser tu propia recepcionista, tu community manager, tu técnico
        informático y tu departamento de facturación. Y cada hora que dedicas a
        esas tareas es una hora que no estás con un paciente… ni contigo.
      </p>
    </section>

    <!-- Solución -->
    <section class="epm__solution">
      <h2 class="epm__solution-title">Yo no puedo pasar consulta por ti.<br />Pero sí quitarte todo lo demás.</h2>
      <p class="epm__solution-intro">
        La Clínica Digital es tu consulta funcionando sola en internet: una web
        profesional que transmite la confianza que tu trabajo merece, y 3
        empleados IA que hacen el trabajo que hoy te roba las tardes.
      </p>

      <div class="epm__solution-grid">
        <div class="sol-card">
          <MessageCircle :size="22" />
          <h3>Pacientes que llegan solos</h3>
          <p>
            Nora responde al momento a cada persona que te escribe, resuelve sus
            dudas y les agenda cita en tu calendario. Ningún interesado se queda
            sin respuesta ni se va con otro profesional por esperar.
          </p>
        </div>
        <div class="sol-card">
          <PenLine :size="22" />
          <h3>Visibilidad sin "venderte"</h3>
          <p>
            Valeria crea contenido profesional para tu blog y tus redes de forma
            constante. Tu consulta gana presencia y autoridad sin que tú tengas
            que grabarte bailando ni sentir que pierdes prestigio.
          </p>
        </div>
        <div class="sol-card">
          <Wrench :size="22" />
          <h3>Cero carga administrativa</h3>
          <p>
            Agenda, confirmaciones, reprogramaciones, correos y web funcionando:
            Alex y Nora se encargan. Tú abres tu calendario y solo ves consultas
            listas para atender.
          </p>
        </div>
      </div>

      <p class="epm__solution-close">
        ¿El resultado? Más pacientes, ingresos más predecibles y tus tardes de
        vuelta. No cura el síndrome del impostor ni el peso emocional de tu
        trabajo — eso se trabaja como tú bien sabes — pero te devuelve el tiempo
        y la energía para hacerlo.
      </p>
    </section>

    <!-- CTA -->
    <section class="epm__cta-block">
      <div class="epm__price">
        <span class="epm__price-amount">{{ price }}€<small>/mes</small></span>
        <span class="epm__price-note">Sin permanencia · Tuya al completar 12 cuotas · Tu dominio y tus datos son tuyos desde el día 1</span>
      </div>
      <button type="button" class="epm__cta" :disabled="buying" @click="buyClinica">
        <ShoppingBag :size="18" />
        {{ buying ? 'Abriendo pago…' : 'Comprar Clínica Digital' }}
      </button>
      <p class="epm__cta-note">
        ¿Aún con dudas? <RouterLink to="/">Prueba la demo de Nora</RouterLink> o
        <RouterLink to="/faq">revisa las preguntas frecuentes</RouterLink>.
      </p>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { MessageCircle, PenLine, Wrench, ShoppingBag } from 'lucide-vue-next'
import { useCheckout } from '@/composables/useCheckout'
import { usePlans } from '@/data/plans'
import { useSeo } from '@/composables/useSeo'

const { buying, buyClinica } = useCheckout()
const { load, flagship } = usePlans()
const price = computed(() => flagship().monthly)

onMounted(load)

// Los 10 dolores del nicho (psicólogos, coaches y terapeutas), en primera
// persona. Fuente: investigación del propietario, aprobada el 2026-08-14.
const pains = [
  {
    title: 'Sientes que no puedes vivir de esto',
    text: 'Te cuesta poner tarifas justas, te incomoda cobrar por tu trabajo y tus ingresos suben y bajan sin que puedas predecirlos. Algunos meses respiras; otros, haces cuentas con miedo.',
  },
  {
    title: 'Dependes del boca a boca',
    text: 'Saliste de la formación sabiendo acompañar a personas, pero sin un sistema para atraerlas. Esperas a que alguien te recomiende y no controlas de dónde (ni cuándo) vendrá el próximo paciente.',
  },
  {
    title: 'La voz del impostor no se calla',
    text: 'Dudas de tus diagnósticos, sientes que "aún no estás preparado" a pesar de los años de estudio, y una parte de ti teme que algún día descubran que eres un fraude. (Spoiler: no lo eres.)',
  },
  {
    title: 'Terminas los días vacío',
    text: 'Escuchar, contener y procesar el dolor de decenas de personas cada semana está drenando tu propia salud mental. Es un agotamiento silencioso del que casi nadie habla.',
  },
  {
    title: 'Te formaron para ser clínico, no vendedor',
    text: 'La idea de "venderte" en redes sociales te genera rechazo, incomodidad o directamente vergüenza. Sientes que hacer marketing le resta seriedad a tu trabajo.',
  },
  {
    title: 'Temes equivocarte con un paciente',
    text: 'La responsabilidad de tener la salud mental de alguien en tus manos te genera una ansiedad real: decir algo inapropiado, errar el enfoque, empeorar las cosas.',
  },
  {
    title: 'La administración te come las tardes',
    text: 'Coordinar agendas, confirmar por WhatsApp, reprogramar cancelaciones de última hora, cobrar, organizar expedientes… horas y horas de trabajo que nadie te paga.',
  },
  {
    title: 'Tu facturación tiene techo',
    text: 'Tu modelo es tiempo por dinero: sesiones de 45-60 minutos, una detrás de otra. Tu ingreso máximo está limitado por las horas que físicamente aguantas al día.',
  },
  {
    title: 'No sabes "apagar" al terapeuta',
    text: 'Sales de consulta pero los casos se van contigo a casa. Te cuesta poner límites entre tu vida profesional y la personal, y tu familia lo nota.',
  },
  {
    title: 'Trabajas solo, en todos los sentidos',
    text: 'Sin equipo con quien rebotar ideas, supervisar casos complejos o simplemente desahogarte del día. La práctica privada puede ser un lugar muy solitario.',
  },
]

useSeo({
  title: '¿Es para mí? — Clínica Digital para psicólogos, coaches y terapeutas | DigiNode',
  description: '¿Te cuesta captar pacientes, vivir de tu consulta o soltar la carga administrativa? Descubre si la Clínica Digital de 150€/mes es para ti.',
})
</script>

<style lang="scss" scoped>
.epm {
  max-width: 860px;
  margin: 0 auto;
  padding: $space-12 $space-4 $space-16;

  // ── Hero ──────────────────────────────
  &__hero {
    text-align: center;
    margin-bottom: $space-12;
  }

  &__title {
    font-family: $font-display;
    font-size: clamp(2rem, 4.5vw, 3rem);
    font-weight: $fw-bold;
    color: $text;
    line-height: 1.15;
    margin-bottom: $space-4;
  }

  &__title-gradient {
    background: linear-gradient(135deg, $primary-light 0%, $primary 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  &__subtitle {
    color: $text-muted;
    font-size: $text-lg;
    max-width: 480px;
    margin: 0 auto;
  }

  // ── Pains ─────────────────────────────
  &__pains {
    display: flex;
    flex-direction: column;
    gap: $space-4;
    margin-bottom: $space-12;
  }

  // ── Agitación ─────────────────────────
  &__truth {
    margin-bottom: $space-12;
    padding: $space-8;
    border-left: 3px solid $primary;
    background: $primary-subtle;
    border-radius: $radius;

    p {
      color: $text;
      font-size: $text-lg;
      line-height: 1.7;
      font-style: italic;
    }
  }

  // ── Solución ──────────────────────────
  &__solution {
    margin-bottom: $space-12;
    text-align: center;
  }

  &__solution-title {
    font-family: $font-display;
    font-size: $text-3xl;
    font-weight: $fw-bold;
    color: $text;
    line-height: 1.25;
    margin-bottom: $space-4;
  }

  &__solution-intro {
    color: $text-muted;
    font-size: $text-base;
    line-height: 1.7;
    max-width: 620px;
    margin: 0 auto $space-8;
  }

  &__solution-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: $space-4;
    margin-bottom: $space-8;
    text-align: left;

    @media (max-width: $bp-md) {
      grid-template-columns: 1fr;
    }
  }

  &__solution-close {
    color: $text-muted;
    font-size: $text-base;
    line-height: 1.7;
    max-width: 620px;
    margin: 0 auto;
  }

  // ── CTA ───────────────────────────────
  &__cta-block {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $space-5;
    padding: $space-10 $space-6;
    background: $bg-card;
    border: 1px solid $border;
    border-radius: $radius-xl;
  }

  &__price {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $space-2;
  }

  &__price-amount {
    font-family: $font-display;
    font-size: $text-4xl;
    font-weight: $fw-bold;
    color: $text;

    small {
      font-size: $text-lg;
      font-weight: $fw-medium;
      color: $text-muted;
    }
  }

  &__price-note {
    font-size: $text-sm;
    color: $text-muted;
    max-width: 420px;
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
    color: $text-muted;

    a { color: $primary-light; font-weight: $fw-semibold; }
  }
}

// ── Pain card ───────────────────────────
.pain {
  display: flex;
  gap: $space-5;
  padding: $space-5 $space-6;
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius;
  transition: $transition-fast;

  &:hover {
    border-color: $primary;
    background: $primary-subtle;
  }

  &__number {
    font-family: $font-display;
    font-size: $text-2xl;
    font-weight: $fw-bold;
    color: $primary-light;
    opacity: 0.65;
    flex-shrink: 0;
    line-height: 1.3;
  }

  &__heading {
    font-size: $text-base;
    font-weight: $fw-semibold;
    color: $text;
    margin-bottom: $space-1;
  }

  &__text {
    color: $text-muted;
    font-size: $text-sm;
    line-height: 1.65;
  }
}

// ── Solution card ───────────────────────
.sol-card {
  padding: $space-6;
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius;

  svg {
    color: $primary-light;
    margin-bottom: $space-3;
  }

  h3 {
    font-size: $text-base;
    font-weight: $fw-semibold;
    color: $text;
    margin-bottom: $space-2;
  }

  p {
    color: $text-muted;
    font-size: $text-sm;
    line-height: 1.65;
  }
}
</style>
