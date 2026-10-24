import fs from 'node:fs/promises'
import { build } from 'vite'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
// Production SSR compilation is necessary: dev SFC scope IDs differ from production CSS.
await build({
  root,
  mode: 'production',
  build: { ssr: 'src/entry-server.js', outDir: '.prerender', manifest: false },
})
{
  const { render, PAGE_SEO, SITE } = await import(
    new URL('../.prerender/entry-server.js', import.meta.url)
  )
  const snapshot = JSON.parse(
    await fs.readFile(new URL('../src/data/services.snapshot.json', import.meta.url), 'utf8')
  )
  // No env or network access. When both repos are available, stale prices fail the build.
  try {
    const { SERVICES, PRIVACY_VERSION } = await import('../../diginode-api/src/config/services.js')
    if (
      JSON.stringify(snapshot) !==
      JSON.stringify({ privacy_version: PRIVACY_VERSION, services: SERVICES })
    )
      throw new Error(
        'Catálogo desincronizado: regenera src/data/services.snapshot.json desde la API antes de compilar.'
      )
  } catch (err) {
    if (err.code !== 'ERR_MODULE_NOT_FOUND') throw err
  }
  const template = await fs.readFile(new URL('../dist/index.html', import.meta.url), 'utf8')
  const manifest = JSON.parse(
    await fs.readFile(new URL('../dist/.vite/manifest.json', import.meta.url), 'utf8')
  )
  const routeEntries = {
    '/': 'src/views/home/HomeView.vue',
    '/clinica-digital': 'src/views/clinica/ClinicaDigitalView.vue',
    '/webs-y-aplicaciones': 'src/views/services/WebAppsView.vue',
  }
  function cssFor(entry, seen = new Set()) {
    if (seen.has(entry)) return []
    seen.add(entry)
    const chunk = manifest[entry]
    return [...(chunk?.css || []), ...(chunk?.imports || []).flatMap((key) => cssFor(key, seen))]
  }
  const escape = (value) =>
    String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;')
  for (const [route, seo] of Object.entries(PAGE_SEO)) {
    const html = await render(route)
    let page = template.replace('<div id="app"></div>', `<div id="app">${html}</div>`)
    page = page
      .replace(/<title>.*?<\/title>/, `<title>${escape(seo.title)}</title>`)
      .replace(
        /<meta name="description" content="[^"]*"\s*\/?>/,
        `<meta name="description" content="${escape(seo.description)}" />`
      )
      .replace(
        /<link rel="canonical" href="[^"]*"\s*\/?>/,
        `<link rel="canonical" href="${SITE}${route}" />`
      )
      .replace(
        /<meta property="og:title" content="[^"]*"\s*\/?>/,
        `<meta property="og:title" content="${escape(seo.title)}" />`
      )
      .replace(
        /<meta property="og:description" content="[^"]*"\s*\/?>/,
        `<meta property="og:description" content="${escape(seo.description)}" />`
      )
      .replace(
        /<meta property="og:url" content="[^"]*"\s*\/?>/,
        `<meta property="og:url" content="${SITE}${route}" />`
      )
      .replace(
        '</head>',
        `${[...new Set([...cssFor('src/components/layout/PublicLayout.vue'), ...cssFor(routeEntries[route])])].map((css) => `<link rel="stylesheet" href="/${css}" />`).join('')}<script type="application/ld+json" id="route-jsonld">${JSON.stringify(seo.jsonLd).replaceAll('<', '\\u003c')}</script></head>`
      )
    const directory =
      route === '/'
        ? new URL('../dist/', import.meta.url)
        : new URL(`../dist${route}/`, import.meta.url)
    await fs.mkdir(directory, { recursive: true })
    await fs.writeFile(new URL('index.html', directory), page)
    console.log(`Pre-render: ${route} (${html.length} caracteres, sin llamadas externas)`)
  }
}
