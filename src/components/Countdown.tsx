import { useCountdown } from '../hooks/useCountdown'
import { eventStart, hasTime } from '../lib/date'
import { Reveal } from './ui/Reveal'

const pad = (n: number) => String(n).padStart(2, '0')

export function Countdown() {
  const { days, hours, minutes, seconds, done } = useCountdown(eventStart)

  const units = [
    { value: days, label: days === 1 ? 'Día' : 'Días' },
    { value: hours, label: hours === 1 ? 'Hora' : 'Horas' },
    { value: minutes, label: 'Min' },
    { value: seconds, label: 'Seg' },
  ]

  const summary = `Faltan ${days} ${days === 1 ? 'día' : 'días'}, ${hours} ${hours === 1 ? 'hora' : 'horas'} y ${minutes} minutos`

  return (
    <section className="section countdown" id="cuenta-regresiva" aria-labelledby="countdown-title">
      <div className="container">
        <Reveal className="countdown__head">
          <p className="eyebrow">Cuenta regresiva</p>
          <h2 id="countdown-title" className="section-title">
            {done ? (
              <>
                ¡Llegó el <em>gran día!</em>
              </>
            ) : (
              <>
                Cada día más <em>cerca</em>
              </>
            )}
          </h2>
        </Reveal>

        {done ? (
          <Reveal>
            <p className="countdown__done">Gracias por celebrar con nosotros.</p>
          </Reveal>
        ) : (
          <Reveal delay={0.15}>
            <div className="countdown__grid" role="timer" aria-label={summary}>
              {units.map((u) => (
                <div className="countdown__cell" key={u.label} aria-hidden="true">
                  <span className="countdown__value">{pad(u.value)}</span>
                  <span className="countdown__label">{u.label}</span>
                </div>
              ))}
            </div>
            {!hasTime && (
              <p className="lead" style={{ margin: '1.5rem auto 0', fontSize: '0.9rem' }}>
                Hasta el inicio del día del evento (hora de Perú).
              </p>
            )}
          </Reveal>
        )}
      </div>
    </section>
  )
}
