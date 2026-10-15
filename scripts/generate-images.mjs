/**
 * Genera las imágenes de /public a partir de las plantillas HTML de scripts/templates:
 *   - og-image.jpg         (1200×630, vista previa de WhatsApp y redes; JPEG ligero)
 *   - apple-touch-icon.png (180×180)
 *   - favicon-32.png       (32×32)
 *
 * Controla Chrome/Edge en modo headless mediante el protocolo DevTools,
 * sin dependencias adicionales (requiere Node 22+ por el WebSocket nativo).
 *
 * Uso:  npm run images
 * Si el navegador no se detecta, define CHROME_PATH con la ruta del ejecutable.
 */
import { spawn } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { setTimeout as sleep } from 'node:timers/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const templates = join(root, 'scripts', 'templates')
const out = join(root, 'public')

const jobs = [
  { template: 'og-image.html', file: 'og-image.jpg', width: 1200, height: 630, format: 'jpeg' },
  { template: 'icon.html#180', file: 'apple-touch-icon.png', width: 180, height: 180, format: 'png' },
  { template: 'icon.html#32', file: 'favicon-32.png', width: 32, height: 32, format: 'png' },
]

const candidates = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean)

const browserPath = candidates.find((p) => existsSync(p))
if (!browserPath) {
  console.error('No se encontró Chrome/Edge. Define CHROME_PATH con la ruta del navegador.')
  process.exit(1)
}

function templateUrl(template) {
  const [file, hash] = template.split('#')
  const url = pathToFileURL(join(templates, file))
  if (hash) url.hash = hash
  return url.href
}

async function waitForFile(path, timeoutMs = 15000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    if (existsSync(path)) {
      const content = readFileSync(path, 'utf8').trim()
      if (content.includes('\n')) return content
    }
    await sleep(100)
  }
  throw new Error('Chrome no expuso el puerto de depuración a tiempo.')
}

/** Cliente CDP mínimo sobre WebSocket. */
function connect(wsUrl) {
  return new Promise((resolveConn, reject) => {
    const ws = new WebSocket(wsUrl)
    const pending = new Map()
    const listeners = new Map()
    let nextId = 1

    ws.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data)
      if (msg.id && pending.has(msg.id)) {
        const { ok, fail } = pending.get(msg.id)
        pending.delete(msg.id)
        msg.error ? fail(new Error(msg.error.message)) : ok(msg.result)
      } else if (msg.method && listeners.has(msg.method)) {
        listeners.get(msg.method)(msg.params)
        listeners.delete(msg.method)
      }
    })
    ws.addEventListener('error', () => reject(new Error('No se pudo conectar con Chrome.')))
    ws.addEventListener('open', () =>
      resolveConn({
        send: (method, params = {}, sessionId) =>
          new Promise((ok, fail) => {
            const id = nextId++
            pending.set(id, { ok, fail })
            ws.send(JSON.stringify({ id, method, params, sessionId }))
          }),
        once: (method) => new Promise((ok) => listeners.set(method, ok)),
        close: () => ws.close(),
      }),
    )
  })
}

const profile = mkdtempSync(join(tmpdir(), 'depa-shower-'))
const chrome = spawn(
  browserPath,
  ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'],
  { stdio: 'ignore' },
)

try {
  const [port, path] = (await waitForFile(join(profile, 'DevToolsActivePort'))).split('\n')
  const cdp = await connect(`ws://127.0.0.1:${port}${path}`)

  for (const job of jobs) {
    const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' })
    const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true })
    const send = (method, params) => cdp.send(method, params, sessionId)

    await send('Page.enable')
    await send('Emulation.setDeviceMetricsOverride', {
      width: job.width,
      height: job.height,
      deviceScaleFactor: 1,
      mobile: false,
    })
    const loaded = cdp.once('Page.loadEventFired')
    await send('Page.navigate', { url: templateUrl(job.template) })
    await loaded
    await send('Runtime.evaluate', { expression: 'document.fonts.ready.then(() => true)', awaitPromise: true })
    await sleep(300)

    const { data } = await send('Page.captureScreenshot', {
      format: job.format,
      ...(job.format === 'jpeg' ? { quality: 88 } : {}),
      clip: { x: 0, y: 0, width: job.width, height: job.height, scale: 1 },
    })
    const target = join(out, job.file)
    writeFileSync(target, Buffer.from(data, 'base64'))
    await cdp.send('Target.closeTarget', { targetId })
    console.log(`✓ public/${job.file}  ${job.width}×${job.height}  ${Math.round(statSync(target).size / 1024)} KB`)
  }
  cdp.close()
} finally {
  chrome.kill()
  await sleep(300)
  rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 })
}
