import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
const SITE = 'https://midiginode.com'
const headings = {
  '/': 'Tu empresa necesita marketing.',
  '/clinica-digital': 'Tu clínica digital',
  '/webs-y-aplicaciones': 'Una web que ayuda a vender.',
}
const titles = []
for (const [route, heading] of Object.entries(headings)) {
  const file = new URL(
    route === '/' ? '../dist/index.html' : `../dist${route}/index.html`,
    import.meta.url
  )
  const html = await fs.readFile(file, 'utf8')
  const title = html.match(/<title>(.*?)<\/title>/)?.[1]
  assert(title?.length > 20, `Missing title: ${route}`)
  titles.push(title)
  assert(html.includes(heading), `Missing initial landing copy: ${route}`)
  assert(html.includes(`<link rel="canonical" href="${SITE}${route}"`), `Wrong canonical: ${route}`)
  assert(
    html.includes(`<meta property="og:url" content="${SITE}${route}"`),
    `Wrong Open Graph URL: ${route}`
  )
  assert(html.includes('id="contacto"'), `No initial contact section: ${route}`)
  assert(html.includes('name="company"'), `No initial form: ${route}`)
  assert(!html.includes('[CAL_BOOKING_LINK]'), `Placeholder link: ${route}`)
  assert(html.includes('id="route-jsonld"'), `Missing structured data: ${route}`)
  const css = [...html.matchAll(/rel="stylesheet"[^>]*href="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((href) => href.startsWith('/assets/'))
  assert(css.length >= 2, `Missing route CSS: ${route}`)
  for (const href of css) await fs.access(new URL('../dist' + href, import.meta.url))
  const styles = (
    await Promise.all(
      css.map((href) => fs.readFile(new URL('../dist' + href, import.meta.url), 'utf8'))
    )
  ).join('\n')
  for (const scope of new Set(html.match(/data-v-[a-f0-9]+/g)))
    assert(styles.includes(scope), `Initial HTML has an unstyled Vue scope: ${route} ${scope}`)
  console.log(`Initial HTML verified: ${route}`)
}
assert.equal(new Set(titles).size, 3, 'Each commercial page needs its own title')
const source = await fs.readFile(new URL('../src/lib/pixel.js', import.meta.url), 'utf8')
assert(!source.includes('fbevents.js'), 'Advertising script must remain disabled')
