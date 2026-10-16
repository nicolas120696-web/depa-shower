import { CalendarPlus, Download } from 'lucide-react'
import { eventConfig } from '../config/event'
import { downloadIcs, googleCalendarUrl } from '../lib/calendar'
import { hasTime, longDate } from '../lib/date'
import { Reveal } from './ui/Reveal'
import { Rule } from './ui/Rule'

/** Cierre de la invitación: despedida y guardar la fecha. Sin reenvío a otros. */
export function Farewell() {
  return (
    <section className="section farewell" id="cierre" aria-labelledby="farewell-title">
      <Reveal className="farewell__card">
        <Rule />
        <p className="eyebrow">Hasta pronto</p>
        <h2 id="farewell-title" tabIndex={-1} className="section-title">
          Te <em>esperamos</em>
        </h2>
        <p className="lead">
          Este momento lo reservamos para quienes queremos cerca. Guarda la fecha y nos vemos en casa.
        </p>
        <div className="btn-row" style={{ justifyContent: 'center' }}>
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
        {!hasTime && <p className="detail__note">Se guardará como evento de todo el día hasta confirmar la hora.</p>}
        <p className="footer__brand">{eventConfig.title}</p>
        <p className="footer__meta">
          {eventConfig.hosts.length > 0 && `${eventConfig.hosts.join(' & ')} · `}
          {longDate}
        </p>
      </Reveal>
    </section>
  )
}
