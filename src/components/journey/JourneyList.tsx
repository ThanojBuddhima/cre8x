import { useNavigate } from 'react-router-dom'
import { GlassCard } from '@/components/ui/glass-card'
import { cn } from '@/lib/cn'
import { useSynqStore } from '@/store/useSynqStore'
import type { Journey } from '@/types'

export function JourneyList() {
  const results = useSynqStore((s) => s.results)
  const selectJourney = useSynqStore((s) => s.selectJourney)
  const navigate = useNavigate()

  if (!results.length) return null

  return (
    <div className="pointer-events-auto grid w-full max-w-md gap-3">
      {results.map((journey) => (
        <JourneyCard
          key={journey.id}
          journey={journey}
          onSelect={() => {
            selectJourney(journey.id)
            navigate(`/journey/${journey.id}`)
          }}
        />
      ))}
    </div>
  )
}

function JourneyCard({
  journey,
  onSelect,
}: {
  journey: Journey
  onSelect: () => void
}) {
  return (
    <button type="button" onClick={onSelect} className="text-left">
      <GlassCard
        className={cn(
          'transition-colors duration-[var(--dur-ui)] hover:bg-surface-2',
          journey.recommended && 'ring-1 ring-accent/50',
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs tracking-[0.16em] text-dim">
              {journey.recommended ? 'RECOMMENDED' : journey.tag.toUpperCase()}
            </p>
            <p className="mt-1 text-2xl font-medium">
              {journey.arriveAt}
              <span className="ml-2 text-sm font-normal text-muted">
                arrival
              </span>
            </p>
          </div>
          <p className="text-sm text-muted">{journey.durationMin} min</p>
        </div>
        <p className="mt-3 text-sm text-muted">{journey.reasons[0]}</p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-dim">
          <span>{journey.energy} energy</span>
          <span aria-hidden>·</span>
          <span>{journey.weatherRisk} weather risk</span>
          <span aria-hidden>·</span>
          <span>
            {journey.stairs} stairs · {journey.accessibleTransfers} accessible
            transfer
          </span>
        </div>
      </GlassCard>
    </button>
  )
}
