import { ArrowUpRight, CalendarDays, CalendarPlus, Clock, Download, MapPin } from 'lucide-react'
import type { ReactNode } from 'react'
import { eventConfig } from '../config/event'
import { downloadIcs, googleCalendarUrl } from '../lib/calendar'
import { fullDate, hasTime, timeLabel } from '../lib/date'
import { Reveal } from './ui/Reveal'

interface DetailProps {
  index: string
  icon: ReactNode
  label: string
  value: string
  note?: string
  action?: ReactNode
  delay?: number
}

function Detail({ index, icon, label, value, note, action, delay }: DetailProps) {
  return (
    <Reveal as="li" className="detail" delay={delay}>
      <span className="detail__index" aria-hidden="true">
        {index}
      </span>
      <p className="eyebrow detail__label">
        {icon}
        {label}
      </p>
      <p className="detail__value">{value}</p>
      {note && <p className="detail__note">{note}</p>}
      {action && <div className="detail__action">{action}</div>}
    </Reveal>
  )
}

export function Details() {
  return (
    <section className="section details" id="detalles" aria-labelledby="details-title">
      <div className="container details__grid">
        <Reveal className="details__intro">
          <p className="eyebrow">La celebración</p>
          <h2 id="details-title" className="section-title">
            Los <em>detalles</em>
          </h2>
          <p className="lead">
            Preparamos nuestro nuevo hogar para recibirte. Aquí tienes todo lo necesario para acompañarnos.
          </p>
        </Reveal>

        <div>
          <ul className="details__list">
            <Detail
              index="01"
              icon={<CalendarDays aria-hidden="true" />}
              label="Fecha"
              value={fullDate}
            />
            <Detail
              index="02"
              icon={<Clock aria-hidden="true" />}
              label="Hora"
              value={timeLabel ?? 'Por confirmar'}
              note={hasTime ? 'Hora de Perú' : 'Te avisaremos muy pronto.'}
              delay={0.1}
            />
            <Detail
              index="03"
              icon={<MapPin aria-hidden="true" />}
              label="Lugar"
              value={eventConfig.location.address ?? 'Nuestro nuevo hogar'}
              delay={0.2}
              action={
                <a
                  className="btn"
                  href={eventConfig.location.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver ubicación
                  <ArrowUpRight aria-hidden="true" />
                  <span className="sr-only">(abre Google Maps en una pestaña nueva)</span>
                </a>
              }
            />
          </ul>

          <Reveal className="calendar-card" delay={0.1}>
            <p className="eyebrow">Guarda la fecha</p>
            <p className="calendar-card__title">Agrégalo a tu calendario</p>
            {!hasTime && (
              <p className="detail__note">Se guardará como evento de todo el día hasta confirmar la hora.</p>
            )}
            <div className="btn-row">
              <a className="btn btn--ghost" href={googleCalendarUrl()} target="_blank" rel="noopener noreferrer">
                <CalendarPlus aria-hidden="true" />
                Google
                <span className="sr-only">Calendar (abre en una pestaña nueva)</span>
              </a>
              <button type="button" className="btn btn--ghost" onClick={downloadIcs}>
                <Download aria-hidden="true" />
                Apple / Outlook
                <span className="sr-only">(descargar archivo .ics)</span>
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
