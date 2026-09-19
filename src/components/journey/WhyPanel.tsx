import type { Journey } from '@/types'

export function WhyPanel({ journey }: { journey: Journey }) {
  return (
    <section>
      <h2 className="text-xs tracking-[0.16em] text-dim">WHY THIS JOURNEY</h2>
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
      <p className="mt-3 text-sm text-muted">
        Confidence: {journey.confidence}
        {journey.stairs === 0
          ? ' · 0 stairs · 1 level transfer'
          : ` · ${journey.stairs} stairs`}
      </p>
    </section>
  )
}
