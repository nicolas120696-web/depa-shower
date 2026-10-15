import { eventConfig } from '../config/event'
import { eventEnd, eventStart, hasTime } from './date'

const title = eventConfig.hosts.length
  ? `${eventConfig.title} · ${eventConfig.hosts.join(' & ')}`
  : eventConfig.title

const details = 'Celebremos juntos nuestro nuevo hogar.'
const location = eventConfig.location.address ?? eventConfig.location.mapsUrl

/** 20261215T210000Z */
function toUtcStamp(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

/** 20261215 (fecha local del evento, para eventos de día completo) */
function toDateStamp(isoDate: string, addDays = 0): string {
  const d = new Date(`${isoDate}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + addDays)
  return d.toISOString().slice(0, 10).replace(/-/g, '')
}

function escapeIcs(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1')
}

/** Pliega líneas de más de 75 bytes (RFC 5545 §3.1) sin partir caracteres multibyte. */
function foldLine(line: string): string {
  const encoder = new TextEncoder()
  const parts: string[] = []
  let current = ''
  let bytes = 0
  for (const char of line) {
    const size = encoder.encode(char).length
    const limit = parts.length === 0 ? 75 : 74
    if (bytes + size > limit) {
      parts.push(current)
      current = ''
      bytes = 0
    }
    current += char
    bytes += size
  }
  parts.push(current)
  return parts.join('\r\n ')
}

export function buildIcs(): string {
  const dates = hasTime
    ? [`DTSTART:${toUtcStamp(eventStart)}`, `DTEND:${toUtcStamp(eventEnd)}`]
    : [`DTSTART;VALUE=DATE:${toDateStamp(eventConfig.date)}`, `DTEND;VALUE=DATE:${toDateStamp(eventConfig.date, 1)}`]

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Depa Shower//Invitacion//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:depa-shower-${eventConfig.date}@invitacion`,
    `DTSTAMP:${toUtcStamp(new Date())}`,
    ...dates,
    `SUMMARY:${escapeIcs(title)}`,
    `DESCRIPTION:${escapeIcs(`${details}\nUbicación: ${eventConfig.location.mapsUrl}`)}`,
    `LOCATION:${escapeIcs(location)}`,
    `URL:${eventConfig.location.mapsUrl}`,
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    `DESCRIPTION:${escapeIcs(`Mañana: ${title}`)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .map(foldLine)
    .join('\r\n')
}

export function downloadIcs(): void {
  const blob = new Blob([buildIcs()], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'depa-shower-2026.ics'
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function googleCalendarUrl(): string {
  const dates = hasTime
    ? `${toUtcStamp(eventStart)}/${toUtcStamp(eventEnd)}`
    : `${toDateStamp(eventConfig.date)}/${toDateStamp(eventConfig.date, 1)}`

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates,
    details: `${details}\nUbicación: ${eventConfig.location.mapsUrl}`,
    location,
    ctz: eventConfig.timeZone,
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}
