import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { Inspector } from '@/components/city/Inspector'
import { LayerToggles } from '@/components/city/LayerToggles'
import { MapLegend } from '@/components/city/MapLegend'
import { LocationChip } from '@/components/city/LocationChip'
import { MapControls } from '@/components/city/MapControls'
import { LiveMapGate } from '@/components/city/LiveMapGate'
import { BottomSheet } from '@/components/navigation/BottomSheet'
import { cityByScenario } from '@/data/scenarios'
import { useLiveJourney } from '@/hooks/useLiveJourney'
import { useMediaQuery } from '@/lib/useMediaQuery'
import { useSynqStore } from '@/store/useSynqStore'


/** Three headline numbers, read from the scenario rather than hardcoded. */
function CityPulse({ compact = false }: { compact?: boolean }) {
  const scenario = useSynqStore((s) => s.scenario)
  const status = cityByScenario[scenario]
  const read = (id: string) => status.metrics.find((m) => m.id === id)

  const cells = [
    { label: 'Traffic', value: `${read('road')?.value ?? 0}%`, warn: true },
    { label: 'Weather', value: status.networkHealth, warn: false },
    { label: 'Energy', value: `${read('energy')?.value ?? 0}%`, warn: false },
  ]

  return (
    <dl
      className={`glass-card flex items-center rounded-2xl text-center ${
        compact ? 'gap-3 px-4 py-3' : 'gap-5 px-6 py-4'
      }`}
    >
      {cells.map((cell, i) => (
        <div key={cell.label} className="flex items-center gap-4">
          {i > 0 ? (
            <span className="h-8 w-[2px] bg-white opacity-10 rounded-full" aria-hidden />
          ) : null}
          <div>
            <dt className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted">
              {cell.label}
            </dt>
            <dd
              className={`mt-1 truncate text-[15px] font-bold tracking-wide ${
                cell.warn ? 'text-warning-ink drop-shadow-[var(--glow-warning)]' : 'text-ink'
              }`}
            >
              {cell.value}
            </dd>
          </div>
        </div>
      ))}
    </dl>
  )
}

export function LiveTracking() {
  const { id = 'j1' } = useParams()
  const navigate = useNavigate()
  const selectJourney = useSynqStore((s) => s.selectJourney)
  const { journey, progress, arrived } = useLiveJourney()
  const calmMode = useSynqStore((s) => s.calmMode)
  const setCalmMode = useSynqStore((s) => s.setCalmMode)
  const desktop = useMediaQuery('(min-width: 1024px)')
  const [sheetOpen, setSheetOpen] = useState(false)

  useEffect(() => {
    if (!useSynqStore.getState().selectedJourneyId) {
      selectJourney(id)
    }
  }, [id, selectJourney])

  const status = (
    <p className="sr-only" aria-live="polite">
      {arrived
        ? 'You have arrived.'
        : `You are here. ${Math.round((1 - progress) * journey.durationMin)} minutes remaining.`}
    </p>
  )

  const backButton = (
    <button
      onClick={() => navigate(`/journey/${id}`)}
      className="glass-interactive flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-ink hoverable:text-accent-ink"
    >
      <ChevronLeft size={16} /> <span className="truncate">Journey</span>
    </button>
  )

  /* ---------------------------------------------------------------------
     Mobile. The desktop composition is a fixed absolute overlay tuned for a
     wide viewport - a 256px switch in a 24px-inset column, a hand-tuned
     top-48 offset, a 220px-tall control stack running into the dock. None of
     that survives 360px, so below lg the map goes full bleed and the controls
     move into the sheet, which is the pattern a map app actually uses.
     --------------------------------------------------------------------- */
  if (!desktop) {
    return (
      <div className="relative h-[100dvh] w-full overflow-hidden bg-[var(--bg-color)]">
        <div className="absolute inset-0 z-0">
          <LiveMapGate journey={journey} progress={progress} />
        </div>

        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col">
          {status}

          <div
            className="pointer-events-none flex flex-col gap-3 p-4 bg-gradient-to-b from-[var(--bg-color)] to-transparent"
            style={{ paddingTop: 'calc(var(--header-h) + 0.5rem)', paddingBottom: '2rem' }}
          >
            <div className="pointer-events-auto flex items-start gap-2">
              {backButton}
              <LocationChip journey={journey} progress={progress} />
            </div>
            <div className="pointer-events-auto self-start mt-2">
              <CityPulse compact />
            </div>
          </div>

          <div className="pointer-events-none mt-auto flex flex-col items-end gap-3 px-4 pb-3">
            <div className="pointer-events-auto">
              <Inspector />
            </div>
            <MapControls live orientation="horizontal" className="relative" />
          </div>

          <div className="pointer-events-auto">
            <BottomSheet expanded={sheetOpen} onExpandedChange={setSheetOpen}>
              <div className="grid gap-4 pt-1">
                <MapLegend />
                {sheetOpen ? (
                  <>
                    <LayerToggles />

                  </>
                ) : null}
              </div>
            </BottomSheet>
          </div>
        </div>
      </div>
    )
  }

  /* --- Desktop ---------------------------------------------------------
     The map is a single sunken well; everything floating on it is raised
     exactly once. The wrapper divs that used to box each control are gone -
     they were raised boxes holding already-raised children. */
  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-[var(--bg-color)]">
      <div className="glass-viewport absolute inset-8 z-0 overflow-hidden rounded-[40px] shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-[rgba(0,240,255,0.2)]">
        <LiveMapGate journey={journey} progress={progress} />
      </div>

      <div className="pointer-events-none absolute inset-8 z-10 pb-[var(--dock-h)]">
        {status}

        <div
          className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-6 p-8"
          style={{ paddingTop: 'calc(var(--header-h) + 0.5rem)' }}
        >
          <div className="pointer-events-auto flex flex-col items-start gap-4">
            {backButton}
            <LocationChip journey={journey} progress={progress} />
          </div>

          <div className="pointer-events-auto flex flex-col items-end gap-4">
            <div className="glass-card flex items-center gap-4 rounded-full px-6 py-3 border border-[rgba(0,240,255,0.3)] shadow-[var(--glow-accent)]">
              <div className="relative flex size-3 items-center justify-center">
                <div className="absolute inset-0 bg-accent rounded-full animate-ping opacity-75" />
                <div className="relative size-2 rounded-full bg-accent" />
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-ink">
                City Pulse
              </span>
            </div>
            <CityPulse />
          </div>
        </div>

        <div className="pointer-events-auto absolute left-8 top-[calc(var(--header-h)+13rem)] flex w-64 flex-col gap-5">
          <LayerToggles />

          <Inspector />
        </div>

        <div className="absolute inset-x-8 bottom-6 flex items-end justify-between gap-6">
          <div className="glass-card pointer-events-auto max-w-[50%] rounded-2xl px-5 py-4">
            <MapLegend />
          </div>
          <MapControls live className="relative" />
        </div>
      </div>
    </div>
  )
}
