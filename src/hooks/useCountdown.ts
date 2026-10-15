import { useEffect, useState } from 'react'

export interface Countdown {
  days: number
  hours: number
  minutes: number
  seconds: number
  /** true cuando ya se alcanzó la fecha objetivo. */
  done: boolean
}

function compute(target: number): Countdown {
  const diff = Math.max(0, target - Date.now())
  const total = Math.floor(diff / 1000)
  return {
    days: Math.floor(total / 86_400),
    hours: Math.floor((total % 86_400) / 3_600),
    minutes: Math.floor((total % 3_600) / 60),
    seconds: total % 60,
    done: diff === 0,
  }
}

export function useCountdown(target: Date): Countdown {
  const time = target.getTime()
  const [state, setState] = useState(() => compute(time))

  useEffect(() => {
    if (compute(time).done) return
    // Alineado al segundo para que el contador no "salte".
    let id: number
    const tick = () => {
      const next = compute(time)
      setState(next)
      if (!next.done) id = window.setTimeout(tick, 1000 - (Date.now() % 1000))
    }
    tick()
    return () => window.clearTimeout(id)
  }, [time])

  return state
}
