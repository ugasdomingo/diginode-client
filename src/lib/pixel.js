// Meta Pixel (F4-2). No-op unless VITE_META_PIXEL_ID is set, so dev/test never
// load the tracker. Standard events: PageView, Contact (demo started),
// InitiateCheckout (checkout click), Purchase (success page).
const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID

export function initPixel() {
  if (!PIXEL_ID || typeof window === 'undefined' || window.fbq) return

  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
    }
    if (!f._fbq) f._fbq = n
    n.push = n
    n.loaded = !0
    n.version = '2.0'
    n.queue = []
    t = b.createElement(e)
    t.async = !0
    t.src = v
    s = b.getElementsByTagName(e)[0]
    s.parentNode.insertBefore(t, s)
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')
  /* eslint-enable */

  window.fbq('init', PIXEL_ID)
  window.fbq('track', 'PageView')
}

// Fire a standard Meta event. Safe to call even when the pixel is disabled.
export function track(event, params = {}) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', event, params)
  }
}
