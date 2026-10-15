# Depa Shower 2026 — Invitación web

Invitación digital para celebrar nuestro nuevo hogar el **15 de diciembre de 2026**.
Experiencia web elegante, animada y pensada para compartirse por WhatsApp.

![Vista previa](public/og-image.jpg)

## Qué incluye

- **Portada interactiva**: una puerta de dos hojas que se abre al pulsar «Abrir invitación».
- **Invitación editorial** con arco arquitectónico animado y fecha destacada.
- **Cuenta regresiva** calculada en la zona horaria de Perú (`America/Lima`).
- **Detalles** del evento: fecha, hora (o «Por confirmar») y botón **Ver ubicación** (Google Maps).
- **Agregar al calendario**: Google Calendar o archivo `.ics` (Apple Calendar, Outlook…).
- **Sección «Nuestro nuevo hogar»** con ilustración SVG propia.
- **Compartir por WhatsApp** con un enlace generado automáticamente.
- **Vista previa para WhatsApp/redes** (Open Graph + Twitter/X) con imagen 1200×630 propia.
- Accesible (teclado, lectores de pantalla, contraste AA) y respeta **movimiento reducido**.
- Sin backend, sin bases de datos, sin imágenes externas: todo es SVG, CSS y recursos locales.

## Tecnologías

| Herramienta | Uso |
| --- | --- |
| React 19 + TypeScript | Interfaz y tipado |
| Vite | Desarrollo y compilación |
| Motion (`motion/react`) | Animaciones (carga diferida con `LazyMotion`) |
| Lucide | Iconografía |
| Google Fonts | Cormorant Garamond + DM Sans |

No se usa Tailwind: el diseño es muy específico y unos pocos estilos propios con variables CSS
(`src/styles/global.css`) resultan más ligeros y fáciles de mantener.

## Estructura

```
├── .github/workflows/deploy.yml   # Publicación automática en GitHub Pages
├── public/                        # Favicon, icono iOS e imagen de vista previa
├── scripts/
│   ├── generate-images.mjs        # Regenera og-image.jpg e iconos (npm run images)
│   └── templates/                 # Plantillas HTML de esas imágenes
├── src/
│   ├── config/event.ts            # ⭐ ÚNICO ARCHIVO A EDITAR (fecha, hora, nombres…)
│   ├── components/                # Intro, Hero, Countdown, Details, HomeSection, Share, Footer
│   │   ├── illustrations/         # SVG animados (arco, interior)
│   │   └── ui/                    # Reveal, Rule
│   ├── hooks/useCountdown.ts
│   ├── lib/                       # Fechas (zona horaria), calendario (.ics) y WhatsApp
│   ├── styles/global.css
│   ├── App.tsx
│   └── main.tsx
├── index.html                     # Metadatos SEO / Open Graph
└── vite.config.ts                 # Inyecta la URL pública en los metadatos
```

## Requisitos

- [Node.js](https://nodejs.org/) **22.12 o superior** (incluye npm).
- [Git](https://git-scm.com/) y una cuenta de [GitHub](https://github.com/).

## Uso local

```bash
npm install        # instalar dependencias (solo la primera vez)
npm run dev        # servidor de desarrollo → http://localhost:5173
npm run build      # compilación de producción en dist/
npm run preview    # probar la compilación → http://localhost:4173
```

> **Nota (Windows con antivirus o proxy que inspecciona HTTPS):** si `npm install` falla con
> `UNABLE_TO_VERIFY_LEAF_SIGNATURE`, ejecuta antes `$env:NODE_OPTIONS="--use-system-ca"` (PowerShell).

---

## ✏️ Personalizar la invitación

Edita **`src/config/event.ts`**:

```ts
hosts: ['Ana', 'Luis'],   // nombres de los anfitriones ([] = no se muestran)
date: '2026-12-15',       // AAAA-MM-DD
time: '16:00',            // hora de Perú en formato 24 h; null = "Por confirmar"
durationHours: 4,         // duración usada en el calendario
location: {
  mapsUrl: 'https://maps.app.goo.gl/4jz81D6eYPxT318d7',
  address: null,          // p. ej. 'Av. Ejemplo 123, Miraflores' (opcional)
},
```

Al definir `time`:

- se muestra la hora en la sección de detalles,
- la cuenta regresiva apunta a esa hora exacta (en lugar del inicio del día),
- el calendario crea un evento con hora de inicio y fin (en lugar de «todo el día»).

En el mismo archivo puedes cambiar el **mensaje de WhatsApp** (`shareMessage`) y el
**título y la descripción** de la vista previa (`seo`).

### Imagen de vista previa

La imagen `public/og-image.jpg` muestra el título y la fecha. Si cambias la fecha o quieres otro
texto, edita `scripts/templates/og-image.html` y ejecuta:

```bash
npm run images     # requiere Google Chrome o Microsoft Edge instalado
```

---

## 🚀 Publicar en GitHub Pages (recomendado, gratis)

### 1. Crear el repositorio en GitHub

1. Entra en <https://github.com/new>.
2. Nombre sugerido: `depa-shower` (puede ser público; GitHub Pages gratuito requiere repositorio público).
3. **No** marques «Add a README» ni `.gitignore` (el proyecto ya los incluye).
4. Pulsa **Create repository**.

### 2. Subir el código

En una terminal dentro de la carpeta del proyecto (sustituye `TU-USUARIO`):

```bash
git init                     # si la carpeta aún no es un repositorio
git add .
git commit -m "Invitación Depa Shower"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/depa-shower.git
git push -u origin main
```

### 3. Activar GitHub Pages

1. En el repositorio: **Settings → Pages**.
2. En **Build and deployment → Source**, elige **GitHub Actions**.
3. Ve a la pestaña **Actions**: el flujo «Publicar en GitHub Pages» se ejecutará
   (si se lanzó antes de activar Pages y falló, pulsa **Re-run all jobs**).
4. Al terminar (≈1 min), la invitación estará en:

   **`https://TU-USUARIO.github.io/depa-shower/`**

La URL pública se inyecta automáticamente en `og:url` y `og:image` durante la compilación,
así que **no tienes que editar nada** para que funcione la vista previa de WhatsApp.

### Actualizar la invitación después de publicarla

```bash
# 1. Edita src/config/event.ts (p. ej. la hora o los nombres)
# 2. Compruébalo en local (opcional): npm run dev
git add .
git commit -m "Actualizar hora del evento"
git push
```

Cada `git push` a `main` vuelve a publicar la web automáticamente en 1–2 minutos.

---

## Alternativa: Vercel (también gratis)

1. Sube el código a GitHub (pasos 1 y 2 anteriores).
2. Entra en <https://vercel.com/new> e importa el repositorio.
3. Vercel detecta Vite automáticamente (compilación `npm run build`, salida `dist`). Pulsa **Deploy**.
4. Tu invitación quedará en `https://<proyecto>.vercel.app`.

La URL de producción de Vercel también se detecta sola (`VERCEL_PROJECT_PRODUCTION_URL`).
Cada `git push` vuelve a desplegar.

## Dominio propio

Si usas un dominio propio (p. ej. `https://nuestrodepa.com`), escribe la URL en
`seo.siteUrl` de `src/config/event.ts` (terminada en `/`) y vuelve a publicar.

---

## Vista previa en WhatsApp

- La imagen (`og-image.jpg`, 1200×630, 43 KB) y los metadatos deben estar en una URL **HTTPS pública**:
  esto ocurre automáticamente al publicar en GitHub Pages o Vercel. En `localhost` no se puede probar.
- Para comprobarla, pega la URL en el [Sharing Debugger de Facebook](https://developers.facebook.com/tools/debug/)
  (WhatsApp usa el mismo protocolo Open Graph) y pulsa «Scrape Again» si cambiaste algo.
- **Caché:** WhatsApp guarda la vista previa de cada enlace durante un tiempo. Si la actualizas y
  sigue apareciendo la anterior, prueba enviando la URL con un parámetro nuevo, por ejemplo
  `https://TU-USUARIO.github.io/depa-shower/?v=2`.

## Comprobaciones realizadas

- `npm run build` (TypeScript estricto + Vite) sin errores ni avisos.
- Prueba automatizada en Chrome (móvil 390×844 y escritorio 1440×900): sin errores de consola ni
  recursos fallidos, portada → invitación, foco accesible, sin desplazamiento horizontal,
  áreas táctiles ≥ 44 px, fuentes cargadas, enlace de Maps exacto.
- Revisión visual en 320, 390 y 1440 px de ancho y con «movimiento reducido» activado.
- Cuenta regresiva verificada contra el 15/12/2026 00:00 (UTC−5) y archivo `.ics` conforme a RFC 5545.
