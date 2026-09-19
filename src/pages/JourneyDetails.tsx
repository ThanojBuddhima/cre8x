import { Link, useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { LocationChip } from '@/components/city/LocationChip'
import { MapControls } from '@/components/city/MapControls'
import { JourneyTimeline } from '@/components/journey/JourneyTimeline'
import { WhyPanel } from '@/components/journey/WhyPanel'
import { QualityGate } from '@/components/3d/QualityGate'
import { BottomSheet } from '@/components/navigation/BottomSheet'
import { Button } from '@/components/ui/button'
import { getJourney, journeys } from '@/data/journeys'
import { useMediaQuery } from '@/lib/useMediaQuery'
import { useSynqStore } from '@/store/useSynqStore'

export function JourneyDetails() {
  const { id = 'j1' } = useParams()
  const navigate = useNavigate()
  const results = useSynqStore((s) => s.results)
  const selectJourney = useSynqStore((s) => s.selectJourney)
  const resetLive = useSynqStore((s) => s.resetLive)
  const desktop = useMediaQuery('(min-width: 768px)')
  const [expanded, setExpanded] = useState(desktop)
  const journey =
    results.find((item) => item.id === id) ?? getJourney(id) ?? journeys[0]!
  const sheetExpanded = expanded || desktop

  const alternatives = (results.length ? results : journeys).filter(
    (item) => item.id !== journey.id,
  )

  return (
    <main
      id="main"
      className="relative min-h-dvh overflow-hidden"
    >
      <div className="absolute inset-0">
        <QualityGate variant="ambient" journey={journey} />
      </div>
      <div className="pointer-events-none absolute inset-0 z-10">
        <div
          className="absolute left-3 right-3 md:left-8 md:right-8"
          style={{ top: 'calc(3.75rem + env(safe-area-inset-top))' }}
        >
          <LocationChip journey={journey} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 md:bottom-8 md:left-8 md:right-auto md:w-[min(100%,26rem)]">
          <div
            className={`pointer-events-none absolute right-3 bottom-full mb-3 md:fixed md:right-6 md:bottom-8 md:mb-0 ${
              sheetExpanded ? 'max-md:hidden' : ''
            }`}
          >
            <MapControls className="relative" />
          </div>
          <BottomSheet expanded={expanded} onExpandedChange={setExpanded}>
            <p className="text-sm font-medium text-muted">Your journey</p>
            <h1 className="mt-1 font-serif text-2xl text-paper md:text-4xl">
              You’ll arrive at {journey.arriveAt}
            </h1>
            <p className="mt-1 text-sm text-muted">
              {journey.tag} · {journey.durationMin} min · {journey.confidence}{' '}
              confidence
            </p>
            <Button
              size="lg"
              className="mt-4 w-full"
              onClick={() => {
                selectJourney(journey.id)
                resetLive()
                navigate(`/live/${journey.id}`)
              }}
            >
              Start journey
            </Button>
            {sheetExpanded ? (
              <div className="mt-5 grid gap-5">
                <JourneyTimeline journey={journey} />
                <WhyPanel journey={journey} />
                <div>
                  <h2 className="text-sm font-medium text-paper">Other options</h2>
                  <div className="mt-2 grid gap-2">
                    {alternatives.map((item) => (
                      <Link
                        key={item.id}
                        to={`/journey/${item.id}`}
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
              </div>
            ) : (
              <button
                type="button"
                className="mt-3 h-11 text-left text-sm text-accent"
                onClick={() => setExpanded(true)}
              >
                See stops and why this route
              </button>
            )}
          </BottomSheet>
        </div>
      </div>
    </main>
  )
}
