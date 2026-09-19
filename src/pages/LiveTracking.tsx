import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Inspector } from '@/components/city/Inspector'
import { LayerToggles } from '@/components/city/LayerToggles'
import { QualityGate } from '@/components/3d/QualityGate'
import { AlertBanner } from '@/components/live/AlertBanner'
import { ArrivalCard } from '@/components/live/ArrivalCard'
import { LiveHud } from '@/components/live/LiveHud'
import { getJourney, journeys } from '@/data/journeys'
import { startSimulationClock } from '@/services/simulationClock'
import { useSynqStore } from '@/store/useSynqStore'

export function LiveTracking() {
  const { id = 'j1' } = useParams()
  const navigate = useNavigate()
  const results = useSynqStore((s) => s.results)
  const selectedId = useSynqStore((s) => s.selectedJourneyId) ?? id
  const journey =
    results.find((item) => item.id === selectedId) ??
    getJourney(selectedId) ??
    getJourney(id) ??
    journeys[0]!
  const progress = useSynqStore((s) => s.liveProgress)
  const setLiveProgress = useSynqStore((s) => s.setLiveProgress)
  const disruptionShown = useSynqStore((s) => s.disruptionShown)
  const setDisruptionShown = useSynqStore((s) => s.setDisruptionShown)
  const acceptedReroute = useSynqStore((s) => s.acceptedReroute)
  const setAcceptedReroute = useSynqStore((s) => s.setAcceptedReroute)
  const setScenario = useSynqStore((s) => s.setScenario)
  const selectJourney = useSynqStore((s) => s.selectJourney)
  const arrived = useSynqStore((s) => s.arrived)
  const setArrived = useSynqStore((s) => s.setArrived)
  const resetLive = useSynqStore((s) => s.resetLive)

  useEffect(() => {
    resetLive()
    let rainTriggered = false
    const startScenario = useSynqStore.getState().scenario
    const clock = startSimulationClock((value) => {
      setLiveProgress(value)
      if (value >= 0.38 && !rainTriggered) {
        rainTriggered = true
        setDisruptionShown(true)
        if (startScenario === 'normal') setScenario('rain')
      }
      if (value >= 1) setArrived(true)
    })
    return () => clock.stop()
  }, [id, resetLive, setArrived, setDisruptionShown, setLiveProgress, setScenario])

  const liveJourney =
    acceptedReroute && journey.usesCoastalRoad
      ? (getJourney('j2') ?? journey)
      : journey

  return (
    <main id="main" className="relative min-h-dvh">
      <div className="absolute inset-0">
        <QualityGate
          variant="live"
          journey={liveJourney}
          progress={progress}
        />
      </div>
      <p className="sr-only" aria-live="polite">
        {arrived
          ? 'You have arrived at KDU.'
          : `Journey in progress. ${Math.round((1 - progress) * liveJourney.durationMin)} minutes remaining.`}
      </p>
      <div className="relative z-10 flex min-h-dvh flex-col justify-between px-4 pt-20 pb-5 md:px-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <LayerToggles />
          <Inspector />
        </div>
        <div className="grid max-w-xl gap-3">
          {arrived ? <ArrivalCard /> : <LiveHud journey={liveJourney} progress={progress} />}
          {disruptionShown && !arrived ? (
            <AlertBanner
              onAccept={() => {
                setAcceptedReroute(true)
                selectJourney('j2')
                setDisruptionShown(false)
              }}
              onOther={() => navigate('/journey/j1')}
            />
          ) : null}
        </div>
      </div>
    </main>
  )
}
