import { useEffect } from 'react'
import { TriangleAlert } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { JourneyTimeline } from '@/components/journey/JourneyTimeline'
import { WhatIfPanel } from '@/components/journey/WhatIfPanel'
import { WhyPanel } from '@/components/journey/WhyPanel'
import { AlertBanner } from '@/components/live/AlertBanner'
import { EmergencyPanel } from '@/components/live/EmergencyPanel'
import { ArrivalCard } from '@/components/live/ArrivalCard'
import { LiveHud } from '@/components/live/LiveHud'
import { Button } from '@/components/ui/button'
import { getJourney, journeys } from '@/data/journeys'
import { getPlace } from '@/data/places'
import { modeColor, modeShortLabel } from '@/lib/modeColors'
import { liveArrival, toMinutes } from '@/lib/time'
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
  const target = useSynqStore.getState().intent.arriveBy
  const beatsTarget = toMinutes(live.arriveAt) <= toMinutes(target)

  return (
    <main
      id="main"
      className="mx-auto min-h-dvh max-w-lg px-4"
      style={{
        paddingTop: 'calc(6.75rem + env(safe-area-inset-top))',
        paddingBottom: 'var(--dock-h)',
      }}
    >
      <p className="text-sm font-medium tracking-[0.14em] text-dim">JOURNEY</p>
      <h1 className="mt-2 font-serif text-3xl text-paper md:text-4xl">
        You’ll arrive at {live.arriveAt}
      </h1>
      {live.lateBy > 0 ? (
        <p
          className="mt-2 inline-flex flex-wrap items-center gap-1.5 rounded-full border border-warning/40 bg-warning/10 px-3 py-1.5 text-sm font-medium text-warning"
          aria-live="polite"
        >
          <TriangleAlert size={14} aria-hidden />
          {live.lateBy} min later than planned ({journey.arriveAt})
        </p>
      ) : null}
      <p className="mt-2 text-sm text-muted">
        {getPlace(journey.legs[0]?.fromId ?? 'fort').shortName} to{' '}
        {getPlace(journey.legs[journey.legs.length - 1]?.toId ?? 'kdu').shortName}{' '}
        · {journey.durationMin + live.lateBy} min
      </p>
      <p className="mt-1 text-sm text-muted">
        {beatsTarget
          ? `Still before your ${target} target.`
          : `This is after your ${target} target. Try another option below.`}
      </p>

      <div className="mt-4 grid gap-3">
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

      <div className="mt-5 flex flex-wrap gap-2">
        {journey.legs.map((leg) => (
          <span
            key={leg.id}
            className="rounded-full border px-3 py-2 text-xs font-medium"
            style={{
              color: modeColor(leg.mode, 'dark'),
              borderColor: modeColor(leg.mode, 'dark'),
            }}
          >
            {modeShortLabel(leg.mode)} · {leg.departure}
          </span>
        ))}
      </div>

      <Button
        size="lg"
        className="mt-6 w-full"
        onClick={() => {
          selectJourney(journey.id)
          navigate(`/live/${journey.id}`)
        }}
      >
        {liveOnThisTrip || arrived ? 'Open map' : 'Watch on map'}
      </Button>

      <div className="mt-8 grid gap-8">
        <section>
          <h2 className="text-xs tracking-[0.16em] text-dim">STOPS AND TRANSFERS</h2>
          <div className="mt-4">
            <JourneyTimeline journey={journey} />
          </div>
        </section>
        <WhyPanel journey={journey} />
        <WhatIfPanel journey={journey} />
        {alternatives.length ? (
          <div>
            <h2 className="text-sm font-medium text-paper">Other options</h2>
            <div className="mt-2 grid gap-2">
              {alternatives.map((item) => (
                <Link
                  key={item.id}
                  to={`/journey/${item.id}`}
                  onClick={() => selectJourney(item.id)}
                  className="flex min-h-11 items-center justify-between rounded-md border border-hairline px-3 text-sm"
                >
                  <span>
                    {item.tag} · {item.arriveAt}
                  </span>
                  <span className="text-dim">{item.durationMin} min</span>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </main>
  )
}
