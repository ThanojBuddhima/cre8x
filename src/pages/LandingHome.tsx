import { useState } from 'react'
import { CityStatusChip } from '@/components/city/CityStatusChip'
import { LocationChip } from '@/components/city/LocationChip'
import { MapControls } from '@/components/city/MapControls'
import { MapLegend } from '@/components/city/MapLegend'
import { IntentCard } from '@/components/journey/IntentCard'
import { JourneyList } from '@/components/journey/JourneyList'
import { QualityGate } from '@/components/3d/QualityGate'
import { BottomSheet } from '@/components/navigation/BottomSheet'
import { CinematicIntro } from '@/scenes/IntroChoreography/CinematicIntro'
import { getPlace } from '@/data/places'
import { useMediaQuery } from '@/lib/useMediaQuery'
import { useSynqStore } from '@/store/useSynqStore'

export function LandingHome() {
  const introComplete = useSynqStore((s) => s.introComplete)
  const intent = useSynqStore((s) => s.intent)
  const desktop = useMediaQuery('(min-width: 768px)')
  const [planned, setPlanned] = useState(false)
  const [expanded, setExpanded] = useState(desktop)
  const sheetExpanded = expanded || planned || desktop

  if (!introComplete) return <CinematicIntro />

  return (
    <main
      id="main"
      className="relative min-h-dvh overflow-hidden"
    >
      <div className="absolute inset-0">
        <QualityGate variant="ambient" />
      </div>
      <div className="pointer-events-none absolute inset-0 z-10">
        <div
          className="absolute inset-x-3 flex items-start justify-between gap-2 md:left-8 md:right-8"
          style={{ top: 'calc(3.75rem + env(safe-area-inset-top))' }}
        >
          <div className="min-w-0">
            <LocationChip />
            <div className="mt-2">
              <MapLegend />
            </div>
          </div>
          <CityStatusChip />
        </div>
        <div className="absolute bottom-0 left-0 right-0 md:bottom-8 md:left-8 md:right-auto">
          <div
            className={`pointer-events-none absolute right-3 bottom-full mb-3 md:fixed md:right-6 md:bottom-8 md:mb-0 ${
              sheetExpanded ? 'max-md:hidden' : ''
            }`}
          >
            <MapControls className="relative" />
          </div>
          <BottomSheet expanded={sheetExpanded} onExpandedChange={setExpanded}>
            {planned ? (
              <>
                <p className="text-sm font-medium text-muted">Your options</p>
                <h1 className="mt-1 font-serif text-2xl text-paper">
                  {getPlace(intent.originId).shortName} to{' '}
                  {getPlace(intent.destinationId).shortName}
                </h1>
                <button
                  type="button"
                  className="mt-1 h-11 text-left text-sm text-accent"
                  onClick={() => {
                    setPlanned(false)
                    setExpanded(true)
                  }}
                >
                  Edit trip
                </button>
                <div className="mt-4">
                  <JourneyList />
                </div>
              </>
            ) : (
              <IntentCard
                compact={!sheetExpanded}
                onExpand={() => setExpanded(true)}
                onPlanned={() => {
                  setPlanned(true)
                  setExpanded(true)
                }}
              />
            )}
          </BottomSheet>
        </div>
      </div>
    </main>
  )
}
