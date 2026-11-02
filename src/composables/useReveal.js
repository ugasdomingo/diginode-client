// Fade-in on scroll. Content stays visible without JavaScript or IntersectionObserver;
// the hidden start state is only added once the observer can reveal it.
let observer
function getObserver() {
  if (observer || typeof window === 'undefined' || !('IntersectionObserver' in window)) return observer
  observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('reveal--in')
        observer.unobserve(entry.target)
      }),
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  )
  return observer
}

export const vReveal = {
  mounted(el) {
    const io = getObserver()
    if (!io) return
    el.classList.add('reveal')
    io.observe(el)
  },
  unmounted(el) {
    observer?.unobserve(el)
  },
}
