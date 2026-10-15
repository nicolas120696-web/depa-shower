import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { eventConfig } from './src/config/event.ts'

/**
 * Resuelve la URL pública absoluta (necesaria para og:image y og:url).
 * Prioridad: config → VITE_SITE_URL (GitHub Actions / .env) → Vercel → localhost.
 */
function resolveSiteUrl(env: Record<string, string>): string {
  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL
  const raw =
    eventConfig.seo.siteUrl ||
    env.VITE_SITE_URL ||
    (vercelHost ? `https://${vercelHost}` : '') ||
    'http://localhost:4173/'
  return raw.endsWith('/') ? raw : `${raw}/`
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function htmlMetadata(siteUrl: string): Plugin {
  const tokens: Record<string, string> = {
    '%SITE_URL%': siteUrl,
    '%SEO_TITLE%': escapeHtml(eventConfig.seo.title),
    '%SEO_DESCRIPTION%': escapeHtml(eventConfig.seo.description),
  }
  return {
    name: 'depa-html-metadata',
    transformIndexHtml(html) {
      return Object.entries(tokens).reduce((out, [token, value]) => out.split(token).join(value), html)
    },
  }
}

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = resolveSiteUrl(env)

  if (command === 'build' && siteUrl.startsWith('http://localhost')) {
    console.warn(
      '\n⚠  No se definió la URL pública. La vista previa de WhatsApp necesita una URL absoluta.\n' +
        '   Define VITE_SITE_URL o seo.siteUrl en src/config/event.ts (ver README).\n',
    )
  }

  return {
    // Rutas relativas: funciona igual en GitHub Pages (subcarpeta) y en Vercel (raíz).
    base: './',
    plugins: [react(), htmlMetadata(siteUrl)],
  }
})
