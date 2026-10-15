import { eventConfig } from '../config/event'

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/

function validTime(time: string | null): string | null {
  if (time && TIME_RE.test(time)) return time
  if (time) console.warn(`[config] Hora inválida "${time}". Usa el formato "HH:mm".`)
  return null
}

if (!DATE_RE.test(eventConfig.date)) {
  throw new Error(`[config] Fecha inválida "${eventConfig.date}". Usa el formato "AAAA-MM-DD".`)
}

export const eventTime = validTime(eventConfig.time)
export const hasTime = eventTime !== null

/** Instante exacto de inicio (o inicio del día si no hay hora), en la zona del evento. */
export const eventStart = new Date(`${eventConfig.date}T${eventTime ?? '00:00'}:00${eventConfig.utcOffset}`)

/** Fin del evento: inicio + duración, o fin del día si no hay hora. */
export const eventEnd = hasTime
  ? new Date(eventStart.getTime() + eventConfig.durationHours * 3_600_000)
  : new Date(eventStart.getTime() + 24 * 3_600_000)

const tz = eventConfig.timeZone

function format(options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat('es-PE', { timeZone: tz, ...options }).format(eventStart)
}

const [year, month, day] = eventConfig.date.split('-')

export const dateParts = {
  day,
  month,
  year,
  weekday: format({ weekday: 'long' }).toLocaleLowerCase('es'),
  monthName: format({ month: 'long' }).toLocaleLowerCase('es'),
}

/** "15 de diciembre de 2026" */
export const longDate = format({ day: 'numeric', month: 'long', year: 'numeric' })

/** "martes, 15 de diciembre de 2026" */
export const fullDate = format({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

/** "4:00 p. m." o null */
export const timeLabel = hasTime ? format({ hour: 'numeric', minute: '2-digit', hour12: true }) : null
