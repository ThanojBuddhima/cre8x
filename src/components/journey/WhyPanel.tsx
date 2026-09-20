import { AiBadge } from '@/components/ui/ai-badge'
import type { Journey } from '@/types'

export function WhyPanel({ journey }: { journey: Journey }) {
  return (
    <section>
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-xs tracking-[0.16em] text-dim">WHY THIS JOURNEY</h2>
        <AiBadge />
      </div>
      <ul className="mt-3 space-y-2 text-sm text-muted">
        {journey.reasons.slice(0, 3).map((reason) => (
          <li key={reason} className="flex gap-2">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
            {reason}
          </li>
        ))}
      </ul>
      <dl className="mt-5 grid grid-cols-3 gap-2 text-center text-sm">
        <div className="rounded-md border border-hairline p-3">
          <dt className="text-xs text-dim">Energy</dt>
          <dd className="mt-1 text-paper">{journey.energy}</dd>
        </div>
        <div className="rounded-md border border-hairline p-3">
          <dt className="text-xs text-dim">Weather</dt>
          <dd className="mt-1 text-paper">{journey.weatherRisk}</dd>
        </div>
        <div className="rounded-md border border-hairline p-3">
          <dt className="text-xs text-dim">Transfers</dt>
          <dd className="mt-1 text-paper">{journey.transfers}</dd>
        </div>
      </dl>
      <div className="mt-5">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-sm text-muted">Confidence in this arrival</p>
          <p className="text-sm font-medium text-paper">
            {journey.confidencePct}%
            <span className="ml-1.5 text-xs text-dim">
              {journey.confidence.toLowerCase()}
            </span>
          </p>
        </div>
        <div
          className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface"
          role="img"
          aria-label={
            'Confidence ' +
            journey.confidencePct +
            ' percent, ' +
            journey.confidence.toLowerCase()
          }
        >
          <span
            className="block h-full rounded-full transition-[width] duration-[var(--dur-ui)]"
            style={{
              width: journey.confidencePct + '%',
              background:
                journey.confidencePct >= 85
                  ? 'var(--color-accent)'
                  : journey.confidencePct >= 65
                    ? 'var(--color-warning)'
                    : 'var(--color-danger)',
            }}
          />
        </div>
        <p className="mt-2 text-sm text-muted">
          {journey.stairs === 0
            ? '0 stairs on this route, with level boarding at every change.'
            : journey.stairs + ' stairs on this route.'}
        </p>
      </div>
    </section>
  )
}
