import { AnimatePresence, LazyMotion, MotionConfig, domAnimation } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { Countdown } from './components/Countdown'
import { Details } from './components/Details'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { HomeSection } from './components/HomeSection'
import { Intro } from './components/Intro'
import { Share } from './components/Share'

export default function App() {
  const [opened, setOpened] = useState(false)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const root = document.documentElement
    root.style.overflow = opened ? '' : 'hidden'
    if (opened) {
      window.scrollTo(0, 0)
      titleRef.current?.focus({ preventScroll: true })
    }
  }, [opened])

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <AnimatePresence>{!opened && <Intro key="intro" onOpen={() => setOpened(true)} />}</AnimatePresence>

        <div inert={!opened}>
          <Hero ref={titleRef} active={opened} />
          <main>
            <Countdown />
            <Details />
            <HomeSection />
            <Share />
          </main>
          <Footer />
        </div>
      </MotionConfig>
    </LazyMotion>
  )
}
