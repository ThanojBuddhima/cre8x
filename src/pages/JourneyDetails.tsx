import { Link, useNavigate, useParams } from 'react-router-dom'
import { JourneyTimeline } from '@/components/journey/JourneyTimeline'
import { WhyPanel } from '@/components/journey/WhyPanel'
import { QualityGate } from '@/components/3d/QualityGate'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'
import { getJourney, journeys } from '@/data/journeys'
import { useSynqStore } from '@/store/useSynqStore'

export function JourneyDetails() {
  const { id = 'j1' } = useParams()
  const navigate = useNavigate()
  const results = useSynqStore((s) => s.results)
  const selectJourney = useSynqStore((s) => s.selectJourney)
  const resetLive = useSynqStore((s) => s.resetLive)
  const journey =
    results.find((item) => item.id === id) ?? getJourney(id) ?? journeys[0]!
  const alternatives = (results.length ? results : journeys).filter(
    (item) => item.id !== journey.id,
  )

  return (
    <main id="main" className="relative min-h-dvh">
      <div className="h-40 md:absolute md:inset-0 md:h-auto">
        <QualityGate variant="ambient" journey={journey} />
      </div>
      <div className="relative z-10 mx-auto grid max-w-6xl gap-4 px-4 pt-20 pb-10 md:grid-cols-[1.1fr_0.9fr] md:items-end md:px-8">
        <GlassCard>
          <p className="text-xs tracking-[0.18em] text-dim">JOURNEY</p>
          <h1 className="mt-2 font-serif text-4xl">
            You’ll arrive at {journey.arriveAt}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {journey.name} · {journey.durationMin} min · confidence{' '}
            {journey.confidence}
          </p>
          <div className="mt-6">
            <JourneyTimeline journey={journey} />
          </div>
          <Button
            size="lg"
            className="mt-2 w-full"
            onClick={() => {
              selectJourney(journey.id)
              resetLive()
              navigate(`/live/${journey.id}`)
            }}
          >
            Start journey
          </Button>
        </GlassCard>
        <div className="grid gap-4">
          <GlassCard>
            <WhyPanel journey={journey} />
          </GlassCard>
          <GlassCard>
            <h2 className="text-xs tracking-[0.16em] text-dim">ALTERNATIVES</h2>
            <div className="mt-3 grid gap-2">
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
          </GlassCard>
        </div>
      </div>
    </main>
  )
}
