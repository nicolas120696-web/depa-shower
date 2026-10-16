/**
 * ─────────────────────────────────────────────────────────────
 *  CONFIGURACIÓN DE LA INVITACIÓN
 *  Este es el único archivo que necesitas editar para personalizarla.
 * ─────────────────────────────────────────────────────────────
 */

export interface EventConfig {
  /** Nombre del evento tal como se muestra en la portada. */
  title: string
  /**
   * Nombres de los anfitriones. Déjalo vacío ([]) para no mostrarlos.
   * Ejemplo: ['Ana', 'Luis']  →  "Ana & Luis"
   */
  hosts: string[]
  /** Fecha del evento en formato AAAA-MM-DD (hora de Perú). */
  date: string
  /**
   * Hora de inicio en formato 24 h "HH:mm" (hora de Perú), p. ej. '16:00'.
   * Déjala en null mientras no esté definida: se mostrará "Hora por confirmar",
   * la cuenta regresiva apuntará al inicio del día y el calendario creará
   * un evento de día completo.
   */
  time: string | null
  /** Duración estimada en horas (solo se usa en el calendario cuando hay hora). */
  durationHours: number
  /** Zona horaria IANA del evento. Perú no aplica horario de verano. */
  timeZone: string
  /** Desfase UTC fijo de la zona horaria anterior. */
  utcOffset: string
  location: {
    /** Enlace del lugar en Google Maps. */
    mapsUrl: string
    /** Ruta en Google Maps (navegación hacia el mismo punto). */
    mapsRouteUrl: string
    /** Ruta en Waze (navegación hacia el mismo punto). */
    wazeUrl: string
    /** Nombre o dirección visible (opcional). null = no se muestra. */
    address: string | null
  }
  /** Metadatos para buscadores y vista previa (WhatsApp, redes sociales). */
  seo: {
    title: string
    description: string
    /**
     * URL pública definitiva, terminada en "/".
     * Normalmente NO hace falta tocarla: se calcula sola en GitHub Pages y Vercel
     * (ver README). Rellénala solo si usas un dominio propio.
     */
    siteUrl: string | null
  }
}

export const eventConfig: EventConfig = {
  title: 'Depa Shower',
  hosts: [],
  date: '2026-12-15',
  time: null,
  durationHours: 4,
  timeZone: 'America/Lima',
  utcOffset: '-05:00',
  location: {
    mapsUrl: 'https://maps.app.goo.gl/4jz81D6eYPxT318d7',
    // Coordenadas del mismo pin (Besco Inmobiliaria). Cámbialas si mueves el punto.
    mapsRouteUrl: 'https://www.google.com/maps/dir/?api=1&destination=-11.9963701,-77.0583505',
    wazeUrl: 'https://waze.com/ul?ll=-11.9963701,-77.0583505&navigate=yes',
    address: null,
  },
  seo: {
    title: 'Depa Shower · 15 de diciembre de 2026',
    description:
      'Un nuevo hogar, una nueva historia por celebrar. Abre la invitación y acompáñanos este 15 de diciembre.',
    siteUrl: null,
  },
}
