import { MessageCircle } from 'lucide-react'
import { whatsappShareUrl } from '../lib/share'
import { Reveal } from './ui/Reveal'
import { Rule } from './ui/Rule'

export function Share() {
  return (
    <section className="section share" id="compartir" aria-labelledby="share-title">
      <Reveal className="share__card">
        <Rule />
        <h2 id="share-title" className="section-title">
          Comparte la <em>invitación</em>
        </h2>
        <p className="lead">Envíala por WhatsApp a quien quieras que nos acompañe.</p>
        <a
          className="btn"
          href={whatsappShareUrl()}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle aria-hidden="true" />
          Enviar por WhatsApp
          <span className="sr-only">(abre WhatsApp)</span>
        </a>
      </Reveal>
    </section>
  )
}
