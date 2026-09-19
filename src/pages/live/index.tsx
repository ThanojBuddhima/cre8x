import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Inspector } from '@/components/city/Inspector'
import { LayerToggles } from '@/components/city/LayerToggles'
import { LocationChip } from '@/components/city/LocationChip'
import { MapControls } from '@/components/city/MapControls'
import { QualityGate } from '@/components/3d/map/QualityGate'
import { MapSplitLayout } from '@/components/navigation/MapSplitLayout'
import { useLiveJourney } from '@/hooks/useLiveJourney'
import { useSynqStore } from '@/store/useSynqStore'

export function LiveTracking() {
  const { id = 'j1' } = useParams()
  const selectJourney = useSynqStore((s) => s.selectJourney)
  const { journey, progress, arrived } = useLiveJourney()

  useEffect(() => {
    if (!useSynqStore.getState().selectedJourneyId) {
      selectJourney(id)
    }
  }, [id, selectJourney])

  return (
    <MapSplitLayout
      map={
        <QualityGate variant="live" journey={journey} progress={progress} />
      }
      overlay={
        <>
          <p className="sr-only" aria-live="polite">
            {arrived
              ? 'You have arrived at KDU.'
              : `You are here. ${Math.round((1 - progress) * journey.durationMin)} minutes remaining.`}
          </p>
          <div
            className="absolute inset-x-3 flex flex-col items-start gap-2 md:left-8 md:right-8"
            style={{ top: 'calc(6.25rem + env(safe-area-inset-top))' }}
          >
            <LocationChip journey={journey} progress={progress} />
            <LayerToggles />
            <Inspector />
          </div>
          <div
            className="pointer-events-none absolute right-3 md:right-6"
            style={{ bottom: 'calc(var(--dock-h) + 12px)' }}
          >
            <MapControls live className="relative" />
          </div>
        </>
      }
    />
  )
}
