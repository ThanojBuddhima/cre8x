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
    <div className="flex h-[100dvh] w-full overflow-hidden bg-[var(--neu-surface)]">
      <main
        className="custom-scrollbar relative h-full w-full overflow-y-auto scroll-smooth pb-[var(--dock-h)] lg:w-[45%] xl:w-[40%]"
        id="main"
      >
        <div
          className="mx-auto max-w-2xl px-6 pb-12 md:px-10"
          style={{ paddingTop: 'calc(var(--header-h) + 1.5rem)' }}
        >
          <button
            onClick={() => navigate('/')}
            className="mb-8 flex items-center gap-2 text-sm font-bold text-muted transition-colors hoverable:text-ink"
          >
            <ChevronLeft size={16} /> Back to Planner
          </button>

          <p className="text-xs font-bold tracking-[0.2em] text-accent-ink">
            JOURNEY DETAILS
          </p>
          <h1 className="mt-3 text-balance font-display text-3xl font-extrabold leading-tight tracking-tight text-ink md:text-4xl">
            Arriving at {live.arriveAt}
          </h1>

          {live.lateBy > 0 ? (
            <p
              className="neu-sunken-sm neu-scope-warning mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-bold text-warning-ink"
              aria-live="polite"
            >
              <TriangleAlert size={18} aria-hidden />
              {live.lateBy} min delay. Originally {journey.arriveAt}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-base">
            <span className="font-bold text-ink">
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

          <div className="neu-sunken mt-12 rounded-2xl p-6 md:p-8">
            <h2 className="mb-6 text-xs font-bold uppercase tracking-[0.16em] text-muted">
              Timeline
            </h2>
            <JourneyTimeline journey={journey} />
          </div>

          <div className="mt-12 grid gap-12">
            <WhyPanel journey={journey} />

            {alternatives.length ? (
              <div className="neu-raised rounded-2xl p-6 md:p-8">
                <h2 className="mb-6 text-sm font-bold uppercase tracking-wider text-ink">
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

          <div className="mt-12 lg:hidden">
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

      <aside className="relative hidden h-full w-[55%] p-8 lg:block xl:w-[60%]">
        <div className="pointer-events-none absolute inset-x-14 top-14 z-20 flex items-start justify-between gap-4">
          <div className="neu-raised pointer-events-auto flex items-center gap-3 rounded-full px-6 py-3">
            <div className="size-2.5 rounded-full bg-accent motion-safe:animate-pulse" />
            <span className="text-sm font-bold tracking-widest text-ink">
              LIVE NETWORK MAP
            </span>
          </div>

          <div className="pointer-events-auto">
            <Button
              variant="secondary"
              onClick={() => {
                selectJourney(journey.id)
                navigate(`/live/${journey.id}`)
              }}
            >
              Expand Live View
            </Button>
          </div>
        </div>

        <div className="neu-well-media relative h-full w-full cursor-move overflow-hidden rounded-3xl">
          <QualityGate
            variant="live"
            journey={journey}
            progress={liveProgress}
          />
        </div>
      </aside>
    </div>
  )
}
