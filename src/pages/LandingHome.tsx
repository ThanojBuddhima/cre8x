import { useState } from 'react'
import { CityStatusChip } from '@/components/city/CityStatusChip'
import { IntentCard } from '@/components/journey/IntentCard'
import { JourneyList } from '@/components/journey/JourneyList'
import { QualityGate } from '@/components/3d/QualityGate'
import { CinematicIntro } from '@/scenes/IntroChoreography/CinematicIntro'
import { useSynqStore } from '@/store/useSynqStore'

export function LandingHome() {
  const introComplete = useSynqStore((s) => s.introComplete)
  const [planned, setPlanned] = useState(false)

  if (!introComplete) return <CinematicIntro />

  return (
    <main id="main" className="relative min-h-dvh">
      <div className="h-[35vh] md:absolute md:inset-0 md:h-auto">
        <QualityGate variant="ambient" />
      </div>
      <div className="relative z-10 flex min-h-[65vh] flex-col gap-4 px-4 pb-10 pt-16 md:min-h-dvh md:flex-row md:items-end md:justify-between md:px-8 md:pb-10 md:pt-24">
        <div className="flex w-full max-w-md flex-col gap-4">
          <IntentCard onPlanned={() => setPlanned(true)} />
          {planned ? <JourneyList /> : null}
        </div>
        <div className="md:self-start">
          <CityStatusChip />
        </div>
      </div>
    </main>
  )
}
