import { useEffect } from 'react'
import { TriangleAlert, ChevronLeft } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { JourneyTimeline } from '@/components/journey/JourneyTimeline'
import { WhatIfPanel } from '@/components/journey/WhatIfPanel'
import { WhyPanel } from '@/components/journey/WhyPanel'
import { AlertBanner } from '@/components/live/AlertBanner'
import { EmergencyPanel } from '@/components/live/EmergencyPanel'
import { ArrivalCard } from '@/components/live/ArrivalCard'
import { LiveHud } from '@/components/live/LiveHud'
import { QualityGate } from '@/components/3d/map/QualityGate'
import { Button } from '@/components/ui/button'
import { getJourney, journeys } from '@/data/journeys'
import { getPlace } from '@/data/places'
import { liveArrival } from '@/lib/time'
import { useSynqStore } from '@/store/useSynqStore'

export function JourneyDetails() {
  const { id = 'j1' } = useParams()
  const navigate = useNavigate()
  const results = useSynqStore((s) => s.results)
  const selectedId = useSynqStore((s) => s.selectedJourneyId)
  const selectJourney = useSynqStore((s) => s.selectJourney)
  const liveProgress = useSynqStore((s) => s.liveProgress)
  const arrived = useSynqStore((s) => s.arrived)
  const disruptionShown = useSynqStore((s) => s.disruptionShown)
  const acceptedReroute = useSynqStore((s) => s.acceptedReroute)
  const setAcceptedReroute = useSynqStore((s) => s.setAcceptedReroute)
  const setDisruptionShown = useSynqStore((s) => s.setDisruptionShown)

  const planned =
    results.find((item) => item.id === id) ??
    getJourney(id) ??
    results.find((item) => item.id === (selectedId ?? 'j1')) ??
    getJourney(selectedId ?? 'j1') ??
    journeys[0]!

  const journey =
    acceptedReroute && planned.usesCoastalRoad
      ? (getJourney('j2') ?? planned)
      : planned

  useEffect(() => {
    if (journey.id !== selectedId) selectJourney(journey.id)
  }, [journey.id, selectedId, selectJourney])

  const alternatives = (results.length ? results : journeys).filter(
    (item) => item.id !== journey.id,
  )
  const liveOnThisTrip = liveProgress > 0 && !arrived
  const live = liveArrival(journey)

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden">
      <main
        className="custom-scrollbar relative h-full w-full overflow-y-auto scroll-smooth pb-[var(--dock-h)]"
        id="main"
      >
        <div
          className="mx-auto max-w-2xl px-6 pb-12 md:px-10"
          style={{ paddingTop: 'calc(var(--header-h) + 1.5rem)' }}
        >
          <button
            onClick={() => navigate('/')}
            className="mb-8 flex items-center gap-2 text-sm font-bold text-muted transition-colors hoverable:text-ink hoverable:drop-shadow-[var(--glow-accent)]"
          >
            <ChevronLeft size={16} /> Back to Planner
          </button>

          <div className="inline-block relative">
            <div className="absolute inset-0 bg-[var(--color-accent)] blur-md opacity-20 rounded-full" />
            <p className="relative text-[10px] font-bold tracking-[0.2em] text-accent-ink uppercase border border-[rgba(0,240,255,0.3)] bg-[rgba(0,240,255,0.05)] px-3 py-1 rounded-full">
              Journey Details
            </p>
          </div>
          <h1 className="mt-5 text-balance font-display text-4xl font-extrabold leading-tight tracking-tight text-ink md:text-5xl">
            Arriving at <span className="text-accent-ink">{live.arriveAt}</span>
          </h1>

          {live.lateBy > 0 ? (
            <p
              className="glass-well neu-scope-warning mt-5 inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-warning-ink border border-warning/30 shadow-[var(--glow-warning)]"
              aria-live="polite"
            >
              <TriangleAlert size={18} aria-hidden />
              {live.lateBy} min delay. Originally {journey.arriveAt}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-base">
            <span className="font-bold text-ink tracking-wide">
              {getPlace(journey.legs[0]?.fromId ?? 'fort').shortName} &rarr;{' '}
              {
                getPlace(journey.legs[journey.legs.length - 1]?.toId ?? 'kdu')
                  .shortName
              }
            </span>
            <span className="text-sm text-muted">&bull;</span>
            <span className="text-sm font-medium text-muted">
              {journey.durationMin + live.lateBy} min total
            </span>
          </div>

          <div className="mt-10 grid gap-6">
            {arrived ? (
              <ArrivalCard />
            ) : (
              <LiveHud journey={journey} progress={liveProgress} />
            )}
            <EmergencyPanel />
            {disruptionShown && !arrived ? (
              <AlertBanner
                onAccept={() => {
                  setAcceptedReroute(true)
                  selectJourney('j2')
                  setDisruptionShown(false)
                }}
                onOther={() => navigate(`/journey/${planned.id}`)}
              />
            ) : null}
          </div>

          <div className="glass-well mt-12 rounded-3xl p-6 md:p-8">
            <h2 className="mb-6 text-[11px] font-bold uppercase tracking-[0.2em] text-muted">
              Timeline
            </h2>
            <JourneyTimeline journey={journey} />
          </div>

          <div className="mt-12 grid gap-12">
            <WhyPanel journey={journey} />

            {alternatives.length ? (
              <div className="glass-card rounded-3xl p-6 md:p-8">
                <h2 className="mb-6 text-[11px] font-bold uppercase tracking-[0.2em] text-ink">
                  Alternative Routes
                </h2>
                <div className="grid gap-3">
                  {alternatives.map((item) => (
                    <Link
                      key={item.id}
                      to={`/journey/${item.id}`}
                      onClick={() => selectJourney(item.id)}
                      className="neu-row flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-lg px-5 py-4 text-sm"
                    >
                      <span className="font-bold text-ink">
                        {item.tag}
                        <span className="ml-2 font-medium text-muted">
                          Arrives {item.arriveAt}
                        </span>
                      </span>
                      <span className="font-extrabold text-accent-ink">
                        {item.durationMin} min
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}

            <WhatIfPanel journey={journey} />
          </div>

          <div className="mt-12 mb-12">
            <Button
              size="lg"
              className="h-14 w-full"
              onClick={() => {
                selectJourney(journey.id)
                navigate(`/live/${journey.id}`)
              }}
            >
              {liveOnThisTrip || arrived ? 'Open Live Map' : 'Watch Journey Map'}
            </Button>
          </div>
        </div>
      </main>


    </div>
  )
}
