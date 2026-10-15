import { eventConfig } from '../config/event'
import { InteriorScene } from './illustrations/InteriorScene'
import { Reveal } from './ui/Reveal'

export function HomeSection() {
  return (
    <section className="section" id="hogar" aria-labelledby="home-title">
      <div className="container home__grid">
        <Reveal className="home__art">
          <InteriorScene />
        </Reveal>

        <Reveal className="home__text" delay={0.15}>
          <p className="eyebrow">Nuestro nuevo hogar</p>
          <h2 id="home-title" className="section-title">
            Un espacio que se llena de <em>historias</em>
          </h2>
          <p className="lead">
            Hay lugares que se convierten en hogar gracias a las personas que los visitan. Queremos estrenar el nuestro
            rodeados de quienes queremos, entre risas, brindis y buenos momentos.
          </p>
          <p className="lead">Gracias por ser parte de este nuevo comienzo.</p>
          {eventConfig.hosts.length > 0 && <p className="home__signature">— {eventConfig.hosts.join(' & ')}</p>}
        </Reveal>
      </div>
    </section>
  )
}
