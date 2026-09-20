import { useState } from 'react'
import { CityStatusChip } from '@/components/city/CityStatusChip'
import { ModeRow } from '@/components/city/ModeRow'
import { IntentCard } from '@/components/journey/IntentCard'
import { JourneyList } from '@/components/journey/JourneyList'
import { QuickJourneyCard } from '@/components/journey/QuickJourneyCard'
import { getPlace } from '@/data/places'
import { useSynqStore } from '@/store/useSynqStore'

export function LandingHome() {
  const intent = useSynqStore((s) => s.intent)
  const [planned, setPlanned] = useState(false)

  return (
    <main
      id="main"
      className="relative min-h-dvh overflow-y-auto overflow-x-hidden bg-ink pt-[calc(6.25rem+env(safe-area-inset-top))] pb-[calc(var(--dock-h)+32px)]"
    >
      <div className="mx-auto w-full max-w-lg px-4 md:px-6">
        <QuickJourneyCard />
        
        {planned ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="glass rounded-2xl p-5 mb-6">
              <p className="text-sm font-medium text-muted">Your options</p>
              <h1 className="mt-1 font-serif text-2xl text-paper">
                {getPlace(intent.originId).shortName} to{' '}
                {getPlace(intent.destinationId).shortName}
              </h1>
              <button
                type="button"
                className="mt-2 text-sm font-medium text-accent transition-colors hover:text-paper"
                onClick={() => setPlanned(false)}
              >
                Edit trip
              </button>
            </div>
            <JourneyList />
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <IntentCard
              compact={false}
              onExpand={() => {}}
              onPlanned={() => setPlanned(true)}
            />
            <CityStatusChip />
            <ModeRow />
          </div>
        )}
      </div>
    </main>
  )
}
