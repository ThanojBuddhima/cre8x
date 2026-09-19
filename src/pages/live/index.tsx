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
  const calmMode = useSynqStore((s) => s.calmMode)
  const setCalmMode = useSynqStore((s) => s.setCalmMode)

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
            <button
              type="button"
              role="switch"
              aria-checked={calmMode}
              onClick={() => setCalmMode(!calmMode)}
              className="pointer-events-auto glass flex w-full max-w-[280px] items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm text-paper cursor-pointer text-left"
            >
              <span>Calm mode · larger type, no 3D</span>
              <div
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out ${
                  calmMode ? 'bg-accent' : 'bg-muted/30'
                }`}
              >
                <span
                  className={`inline-block size-4 transform rounded-full bg-paper transition duration-200 ease-in-out ${
                    calmMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </div>
            </button>
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
