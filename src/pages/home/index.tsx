import { useState } from 'react'
import { CityStatusChip } from '@/components/city/CityStatusChip'
import { LocationChip } from '@/components/city/LocationChip'
import { MapControls } from '@/components/city/MapControls'
import { IntentCard } from '@/components/journey/IntentCard'
import { JourneyList } from '@/components/journey/JourneyList'
import { QualityGate } from '@/components/3d/map/QualityGate'
import { BottomSheet } from '@/components/navigation/BottomSheet'
import { MapSplitLayout } from '@/components/navigation/MapSplitLayout'
import { getPlace } from '@/data/places'
import { useMediaQuery } from '@/lib/useMediaQuery'
import { useSynqStore } from '@/store/useSynqStore'

export function LandingHome() {
  const intent = useSynqStore((s) => s.intent)
  const desktop = useMediaQuery('(min-width: 768px)')
  const [planned, setPlanned] = useState(false)
  const [expanded, setExpanded] = useState(desktop)
  const sheetExpanded = expanded || planned || desktop

  return (
    <MapSplitLayout
      map={<QualityGate variant="ambient" />}
      overlay={
        <>
          <div
            className="absolute inset-x-3 flex items-start justify-between gap-2 md:left-8 md:right-8"
            style={{ top: 'calc(6.25rem + env(safe-area-inset-top))' }}
          >
            <div className="min-w-0">
              <LocationChip />
            </div>
            <CityStatusChip />
          </div>
          <div
            className="pointer-events-none absolute right-3 md:right-6"
            style={{ bottom: 'calc(var(--dock-h) + 12px)' }}
          >
            <MapControls className="relative" />
          </div>
        </>
      }
      sheet={
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
      }
    />
  )
}
