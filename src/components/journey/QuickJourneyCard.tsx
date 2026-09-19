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
    <div className="glass overflow-hidden rounded-2xl p-5 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted">Current Journey</p>
          <h2 className="mt-1 font-serif text-xl text-paper">
            {from.shortName} to {to.shortName}
          </h2>
        </div>
        <Link 
          to={`/live/${selectedId}`}
          className="flex h-10 items-center gap-2 rounded-full bg-accent px-4 text-sm font-medium text-on-accent transition-all hover:scale-105 hover:brightness-110"
        >
          <MapPinned size={16} />
          <span className="hidden sm:inline">Track</span>
        </Link>
      </div>
      
      <div className="mt-4 flex items-center gap-3 rounded-lg bg-surface/50 p-3">
         <div 
           className="size-3 shrink-0 rounded-full animate-pulse" 
           style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
         />
         <div className="flex-1 min-w-0">
           {arrived ? (
             <p className="truncate text-sm font-medium text-paper">Arrived at {to.shortName}</p>
           ) : (
             <p className="truncate text-sm text-paper">
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
