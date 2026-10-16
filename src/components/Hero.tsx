import { m, useReducedMotion } from 'motion/react'
import { forwardRef } from 'react'
import { eventConfig } from '../config/event'
import { dateParts } from '../lib/date'
import { ArchLines } from './illustrations/ArchLines'
import { Rule } from './ui/Rule'

interface HeroProps {
  /** true cuando la portada ya se abrió: dispara la animación de entrada. */
  active: boolean
}

const ease = [0.22, 1, 0.36, 1] as const

export const Hero = forwardRef<HTMLHeadingElement, HeroProps>(function Hero({ active }, titleRef) {
  const reduce = useReducedMotion()
  const [first, ...rest] = eventConfig.title.split(' ')
  const base = 0.75

  const item = (i: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 26 },
    animate: active ? (reduce ? { opacity: 1 } : { opacity: 1, y: 0 }) : undefined,
    transition: { duration: 1.2, delay: base + i * 0.16, ease },
  })

  return (
    <header className="hero" id="inicio">
      <div className="hero__glow" aria-hidden="true" />

      <div className="hero__inner">
        <div className="hero__arch">
          {active && <ArchLines delay={base - 0.2} />}
        </div>

        {eventConfig.hosts.length > 0 && (
          <m.p className="eyebrow" {...item(0)}>
            {eventConfig.hosts.join(' & ')}
          </m.p>
        )}

        <m.p className="serif-italic hero__quote" {...item(1)}>
          “Un nuevo hogar, una nueva historia por celebrar.”
        </m.p>

        <m.h1 ref={titleRef} tabIndex={-1} className="display hero__title" {...item(2)}>
          <span>{first}</span>
          {rest.length > 0 && <span>{rest.join(' ')}</span>}
        </m.h1>

        <m.div {...item(3)} style={{ display: 'grid', justifyItems: 'center', gap: '0.9rem' }}>
          <p className="hero__date">
            <span className="hero__date-label">{dateParts.monthName}</span>
            <span className="hero__date-day">{dateParts.day}</span>
            <span className="hero__date-label">{dateParts.year}</span>
          </p>
          <p className="hero__weekday">{dateParts.weekday}</p>
        </m.div>

        <m.div {...item(4)}>
          <Rule />
        </m.div>

        <m.p className="serif-italic hero__closing" {...item(5)}>
          “Nos encantará compartir este momento contigo.”
        </m.p>
      </div>
    </header>
  )
})
