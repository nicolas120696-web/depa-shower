import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, m, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { Countdown } from './components/Countdown'
import { Details } from './components/Details'
import { Farewell } from './components/Farewell'
import { Hero } from './components/Hero'
import { HomeSection } from './components/HomeSection'
import { Intro } from './components/Intro'

const CHAPTERS = ['invitacion', 'cuenta', 'detalles', 'hogar', 'cierre'] as const
const ease = [0.22, 1, 0.36, 1] as const

export default function App() {
  const reduce = useReducedMotion()
  const shift = reduce ? 0 : 32
  const [opened, setOpened] = useState(false)
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const last = CHAPTERS.length - 1

  const go = (delta: number) => {
    setDirection(delta)
    setIndex((current) => Math.min(last, Math.max(0, current + delta)))
  }

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [])

  const focusHeading = () => {
    if (!opened) return
    const heading = document.querySelector<HTMLElement>('.deck__panel h1, .deck__panel h2')
    if (!heading) return
    heading.tabIndex = -1
    heading.focus({ preventScroll: true })
  }

  useEffect(() => {
    if (!opened) return
    focusHeading()
    // Solo al abrir la puerta: los apartados siguientes enfocan al terminar su animación.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened])

  useEffect(() => {
    if (!opened) return
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLElement && event.target.closest('a, button')) return
      if (event.key === 'ArrowRight') go(1)
      if (event.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [opened, last])

  const chapter = [
    <Hero active={opened} />,
    <Countdown />,
    <Details />,
    <HomeSection />,
    <Farewell />,
  ][index]

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <AnimatePresence>{!opened && <Intro key="intro" onOpen={() => setOpened(true)} />}</AnimatePresence>

        <div className="deck" inert={!opened}>
          <div className="deck__viewport">
            <AnimatePresence mode="wait" custom={direction}>
              <m.div
                key={CHAPTERS[index]}
                className="deck__panel"
                custom={direction}
                variants={{
                  enter: (dir: number) => ({ opacity: 0, y: dir >= 0 ? shift : -shift }),
                  center: { opacity: 1, y: 0 },
                  exit: (dir: number) => ({ opacity: 0, y: dir >= 0 ? -shift : shift }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.65, ease }}
                onAnimationComplete={(definition) => {
                  if (definition === 'center') focusHeading()
                }}
              >
                {chapter}
              </m.div>
            </AnimatePresence>
          </div>

          <nav className="deck__nav" aria-label="Apartados de la invitación">
            <button type="button" className="deck__back" onClick={() => go(-1)} disabled={index === 0}>
              Volver
            </button>
            <ol className="deck__steps">
              {CHAPTERS.map((id, step) => (
                <li key={id}>
                  <span className={step === index ? 'deck__step deck__step--current' : 'deck__step'} />
                  <span className="sr-only">
                    {step === index
                      ? `Apartado ${step + 1} de ${CHAPTERS.length}, actual`
                      : `Apartado ${step + 1}`}
                  </span>
                </li>
              ))}
            </ol>
            <button type="button" className="btn deck__next" onClick={() => go(1)} disabled={index === last}>
              Continuar
            </button>
          </nav>
        </div>
      </MotionConfig>
    </LazyMotion>
  )
}
