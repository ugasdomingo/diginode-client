import { trackAnonContact } from '@/lib/anonAnalytics'
import { trackEvent } from '@/lib/analytics'
import { rememberContact } from '@/lib/journey'

const EVENTS = {
  call: 'contact_call_click',
  whatsapp: 'contact_whatsapp_click',
  form: 'contact_form_submit',
}

/** Un clic de contacto: medición con consentimiento, estadística anónima y memoria de la visita. */
export function trackContact(kind, location, path) {
  const event = EVENTS[kind]
  if (!event) return
  trackEvent(event, { location })
  trackAnonContact(kind, location, path)
  rememberContact(kind, location, path)
}
