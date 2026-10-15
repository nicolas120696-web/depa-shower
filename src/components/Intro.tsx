import { m, useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { eventConfig } from '../config/event'
import { dateParts } from '../lib/date'
import { ArchLines } from './illustrations/ArchLines'

interface IntroProps {
  onOpen: () => void
}

const ease = [0.22, 1, 0.36, 1] as const
const doorEase = [0.7, 0, 0.2, 1] as const

/**
 * Portada: una puerta de dos hojas. Al abrir la invitación, el contenido se
 * desvanece y las hojas giran hacia fuera revelando la invitación.
 * La animación de salida la gestiona <AnimatePresence> en App.
 */
export function Intro({ onOpen }: IntroProps) {
  const reduce = useReducedMotion()
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const t = window.setTimeout(() => buttonRef.current?.focus({ preventScroll: true }), reduce ? 0 : 1600)
    return () => window.clearTimeout(t)
  }, [reduce])

  const [first, ...rest] = eventConfig.title.split(' ')

  const fadeUp = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 18, filter: 'blur(6px)' },
    animate: reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' },
    transition: { duration: 1.1, delay, ease },
  })

  const door = (side: 'left' | 'right') => ({
    exit: reduce
      ? { opacity: 0, transition: { duration: 0.4 } }
      : {
          rotateY: side === 'left' ? 96 : -96,
          x: side === 'left' ? '-6%' : '6%',
          transition: { duration: 1.5, delay: 0.35, ease: doorEase },
        },
  })

  return (
    <m.div
      className="intro"
      role="dialog"
      aria-modal="true"
      aria-labelledby="intro-title"
      exit={{ opacity: 0, transition: { duration: 0.5, delay: reduce ? 0 : 1.35 } }}
    >
      <m.div className="intro__door intro__door--left" {...door('left')}>
        <span className="intro__panel" />
        <span className="intro__handle" />
      </m.div>
      <m.div className="intro__door intro__door--right" {...door('right')}>
        <span className="intro__panel" />
        <span className="intro__handle" />
      </m.div>

      <m.div
        className="intro__content"
        exit={{ opacity: 0, y: reduce ? 0 : -14, transition: { duration: 0.45, ease } }}
      >
        <m.p className="eyebrow" {...fadeUp(0.2)}>
          Tienes una invitación
        </m.p>

        <ArchLines className="intro__arch" compact delay={0.3} />

        <m.h1 id="intro-title" className="display intro__title" {...fadeUp(0.55)}>
          <span>{first}</span>
          {rest.length > 0 && <span>{rest.join(' ')}</span>}
        </m.h1>

        <m.p className="serif-italic intro__subtitle" {...fadeUp(0.85)}>
          Celebremos juntos un nuevo comienzo
        </m.p>

        <m.p className="intro__date" {...fadeUp(1.05)}>
          <span className="sr-only">{`${dateParts.day} de ${dateParts.monthName} de ${dateParts.year}`}</span>
          <span aria-hidden="true">{`${dateParts.day} · ${dateParts.month} · ${dateParts.year}`}</span>
        </m.p>

        <m.div {...fadeUp(1.3)}>
          <button ref={buttonRef} type="button" className="btn" onClick={onOpen}>
            Abrir invitación
          </button>
        </m.div>
      </m.div>
    </m.div>
  )
}
