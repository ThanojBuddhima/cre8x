import { Link } from 'react-router-dom'
import { getPlace } from '@/data/places'
import { useLiveJourney } from '@/hooks/useLiveJourney'
import { MapPinned } from 'lucide-react'
import { useSynqStore } from '@/store/useSynqStore'
import { modeShortLabel } from '@/lib/modeColors'
import type { TransportMode } from '@/types'

export function QuickJourneyCard() {
  const selectedId = useSynqStore((s) => s.selectedJourneyId)
  const results = useSynqStore((s) => s.results)
  const { journey, progress, arrived, now, color } = useLiveJourney()
  
  if (!selectedId || results.length === 0) return null
  
  const from = getPlace(journey.legs[0].fromId)
  const to = getPlace(journey.legs[journey.legs.length - 1].toId)
  
  return (
    <div className="neu-raised overflow-hidden rounded-2xl p-5 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted">Current Journey</p>
          <h2 className="mt-1 font-display text-xl text-ink">
            {from.shortName} to {to.shortName}
          </h2>
        </div>
        <Link 
          to={`/live/${selectedId}`}
          className="neu-pressed-sm flex h-11 items-center gap-2 rounded-full px-4 text-sm font-bold text-accent-ink transition-shadow duration-[var(--dur-ui)] ease-[var(--ease-out)]"
        >
          <MapPinned size={16} />
          <span className="hidden sm:inline">Track</span>
        </Link>
      </div>
      
      <div className="mt-4 flex items-center gap-3 rounded-lg neu-sunken-sm p-3">
         <div 
           className="size-3 shrink-0 rounded-full animate-pulse" 
           style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
         />
         <div className="flex-1 min-w-0">
           {arrived ? (
             <p className="truncate text-sm font-medium text-ink">Arrived at {to.shortName}</p>
           ) : (
             <p className="truncate text-sm text-ink">
               <span className="font-bold" style={{ color }}>{modeShortLabel(now.mode as TransportMode)}</span>
               {' · '}
               {Math.round((1 - progress) * journey.durationMin)} min left
             </p>
           )}
         </div>
      </div>
    </div>
  )
}
