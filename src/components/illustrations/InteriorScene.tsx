import { m, useReducedMotion } from 'motion/react'

const INK = '#40352D'
const GOLD = '#C6A66B'

/** Interior contemporáneo minimalista: ventana en arco, sofá, lámpara y planta. */
export function InteriorScene() {
  const reduce = useReducedMotion()

  const sway = reduce
    ? {}
    : {
        animate: { rotate: [0, 1.6, 0, -1.2, 0] },
        transition: { duration: 9, repeat: Infinity, ease: 'easeInOut' as const },
      }

  const glow = reduce
    ? {}
    : {
        animate: { opacity: [0.55, 0.9, 0.55] },
        transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' as const },
      }

  return (
    <svg viewBox="0 0 480 400" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <defs>
        <radialGradient id="lamp-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#F3DFB4" stopOpacity="0.95" />
          <stop offset="1" stopColor="#F3DFB4" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="window-light" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFCF7" />
          <stop offset="1" stopColor="#F1E6D5" />
        </linearGradient>
      </defs>

      {/* Ventana en arco */}
      <path d="M160 300V140a70 70 0 0 1 140 0v160Z" fill="url(#window-light)" stroke={INK} strokeWidth="1.2" />
      <path d="M172 300V143a58 58 0 0 1 116 0v157" stroke={INK} strokeOpacity="0.35" strokeWidth="1" />
      <path d="M230 85v215M172 196h116" stroke={INK} strokeOpacity="0.35" strokeWidth="1" />
      <circle cx="258" cy="158" r="17" fill={GOLD} fillOpacity="0.35" />

      {/* Cuadro */}
      <rect x="352" y="118" width="58" height="74" fill="#FFFCF7" stroke={INK} strokeWidth="1.1" />
      <path d="M362 176c10-18 18-26 28-26s10 10 12 26" stroke={GOLD} strokeWidth="1.1" />
      <circle cx="371" cy="140" r="5" stroke={GOLD} strokeWidth="1.1" />

      {/* Lámpara de pie */}
      <m.circle cx="78" cy="150" r="58" fill="url(#lamp-glow)" {...glow} />
      <path d="M78 338V158" stroke={INK} strokeWidth="1.2" />
      <path d="M56 158h44l-8-34H64Z" fill="#FFFCF7" stroke={INK} strokeWidth="1.2" />
      <path d="M62 340h32" stroke={INK} strokeWidth="1.6" />

      {/* Sofá */}
      <path
        d="M118 262c0-12 8-20 20-20h184c12 0 20 8 20 20v20H118Z"
        fill="#EADBC4"
        stroke={INK}
        strokeWidth="1.2"
      />
      <path d="M104 282c0-9 6-14 14-14s14 5 14 14v38h-28Z" fill="#E2CFB2" stroke={INK} strokeWidth="1.2" />
      <path d="M328 282c0-9 6-14 14-14s14 5 14 14v38h-28Z" fill="#E2CFB2" stroke={INK} strokeWidth="1.2" />
      <path d="M132 282h196v38H132Z" fill="#EFE3D0" stroke={INK} strokeWidth="1.2" />
      <path d="M230 282v38" stroke={INK} strokeOpacity="0.35" strokeWidth="1" />
      <path d="M160 248c10-4 26-4 34 2" stroke={INK} strokeOpacity="0.4" strokeWidth="1" />
      <rect x="252" y="250" width="40" height="30" rx="8" fill="#FFFCF7" stroke={INK} strokeWidth="1.1" />
      <path d="M116 320l-4 18M344 320l4 18" stroke={INK} strokeWidth="1.2" />

      {/* Mesa de centro */}
      <ellipse cx="230" cy="356" rx="54" ry="8" fill="#FFFCF7" stroke={INK} strokeWidth="1.1" />
      <path d="M200 362v12M260 362v12" stroke={INK} strokeWidth="1.1" />
      <path d="M222 348c0-10 4-16 8-16s8 6 8 16Z" fill={GOLD} fillOpacity="0.4" stroke={INK} strokeWidth="1" />

      {/* Planta */}
      <m.g style={{ originX: '404px', originY: '292px' }} {...sway}>
        <path d="M404 292c-2-30-14-52-34-66 18 4 32 22 34 44" fill="#D8C3A5" stroke={INK} strokeWidth="1.1" />
        <path d="M404 292c4-34 18-58 40-70-8 20-20 42-36 58" fill="#E5D6BF" stroke={INK} strokeWidth="1.1" />
        <path d="M404 292c-10-18-26-28-46-30 14 10 28 20 40 34" fill="#E5D6BF" stroke={INK} strokeWidth="1.1" />
        <path d="M404 292c2-24-2-46-12-64" stroke={INK} strokeOpacity="0.5" strokeWidth="1" />
      </m.g>
      <path d="M384 292h40l-6 46h-28Z" fill="#FFFCF7" stroke={INK} strokeWidth="1.2" />

      {/* Suelo */}
      <path d="M20 340h440" stroke={INK} strokeWidth="1.2" />
      <path d="M40 386h400" stroke={INK} strokeOpacity="0.25" strokeWidth="1" />
    </svg>
  )
}
