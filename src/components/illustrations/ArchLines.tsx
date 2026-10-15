import { m, useReducedMotion } from 'motion/react'

interface ArchLinesProps {
  className?: string
  /** Retraso (s) antes de que comience el trazo. */
  delay?: number
  /** Versión compacta (portada): menos detalles. */
  compact?: boolean
}

/** Arco arquitectónico de línea fina que se dibuja progresivamente. */
export function ArchLines({ className, delay = 0, compact = false }: ArchLinesProps) {
  const reduce = useReducedMotion()

  const draw = (extraDelay: number, duration = 2.2) =>
    reduce
      ? {}
      : {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 1 },
          transition: {
            pathLength: { delay: delay + extraDelay, duration, ease: [0.33, 0.6, 0.3, 1] as const },
            opacity: { delay: delay + extraDelay, duration: 0.3 },
          },
        }

  if (compact) {
    return (
      <svg className={className} viewBox="0 0 96 120" fill="none" aria-hidden="true">
        <m.path
          d="M8 118V48a40 40 0 0 1 80 0v70"
          stroke="currentColor"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          {...draw(0, 1.8)}
        />
        <m.path
          d="M18 118V50a30 30 0 0 1 60 0v68"
          stroke="currentColor"
          strokeOpacity="0.45"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          {...draw(0.25, 1.8)}
        />
        <m.circle
          cx="48"
          cy="50"
          r="7"
          stroke="#C6A66B"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          {...draw(0.9, 1.2)}
        />
        <m.path d="M0 118h96" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" {...draw(0.1, 1.4)} />
      </svg>
    )
  }

  return (
    <svg className={className} viewBox="0 0 400 3000" preserveAspectRatio="xMidYMin slice" fill="none" aria-hidden="true">
      {/* Cada mitad parte del vértice y desciende; las columnas se prolongan fuera de vista. */}
      {[
        'M200 30A170 170 0 0 0 30 200V3000',
        'M200 30A170 170 0 0 1 370 200V3000',
      ].map((d) => (
        <m.path
          key={d}
          d={d}
          stroke="#40352D"
          strokeOpacity="0.28"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          {...draw(0, 3.2)}
        />
      ))}
      {[
        'M200 66A138 138 0 0 0 62 204V3000',
        'M200 66A138 138 0 0 1 338 204V3000',
      ].map((d) => (
        <m.path
          key={d}
          d={d}
          stroke="#C6A66B"
          strokeOpacity="0.75"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          {...draw(0.3, 3.2)}
        />
      ))}
      <m.path
        d="M200 34v-24M128 52l-10-18M272 52l10-18"
        stroke="#C6A66B"
        strokeOpacity="0.6"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
        {...draw(1.4, 1)}
      />
    </svg>
  )
}
