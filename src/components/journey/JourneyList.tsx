import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { useSynqStore } from '@/store/useSynqStore'
import type { Journey } from '@/types'

export function JourneyList() {
  const results = useSynqStore((s) => s.results)
  const selectJourney = useSynqStore((s) => s.selectJourney)
  const navigate = useNavigate()

  if (!results.length) return null

  return (
    <div className="pointer-events-auto grid w-full gap-4">
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
    <button
      type="button"
      onClick={onSelect}
      aria-current={journey.recommended ? 'true' : undefined}
      className={cn(
        'w-full rounded-2xl p-5 text-left',
        // The recommended card rests one tier higher. It used to be pinned to
        // the hover shadow, which left it with no press feedback at all while
        // every sibling had one.
        journey.recommended ? 'neu-pressable-lg' : 'neu-pressable',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={cn(
            'text-xs font-bold uppercase tracking-widest',
            journey.recommended ? 'text-accent-ink' : 'text-muted'
          )}>
            {journey.recommended ? 'RECOMMENDED' : journey.tag.toUpperCase()}
          </p>
          <p className="mt-2 font-display font-bold text-3xl text-ink">
            {journey.arriveAt}
            <span className="ml-2 text-sm font-medium text-muted">
              arrival
            </span>
          </p>
        </div>
        <p className="shrink-0 text-sm font-bold text-accent-ink">
          {journey.durationMin} min
        </p>
      </div>
      <p className="mt-4 text-sm font-medium text-muted">{journey.reasons[0]}</p>
      {/* opacity-70 on already-muted text landed around 2.4:1. */}
      <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-muted">
        <span>{journey.energy} energy</span>
        <span aria-hidden>·</span>
        <span>{journey.weatherRisk} weather risk</span>
        <span aria-hidden>·</span>
        <span>
          {journey.stairs} stairs · {journey.accessibleTransfers} accessible transfer
        </span>
      </div>
    </button>
  )
}
