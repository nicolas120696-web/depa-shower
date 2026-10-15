import { eventConfig } from '../config/event'
import { longDate } from '../lib/date'
import { Rule } from './ui/Rule'

export function Footer() {
  return (
    <footer className="footer">
      <Rule />
      <p className="footer__brand">{eventConfig.title}</p>
      <p className="footer__meta">
        {eventConfig.hosts.length > 0 && `${eventConfig.hosts.join(' & ')} · `}
        {longDate}
      </p>
    </footer>
  )
}
