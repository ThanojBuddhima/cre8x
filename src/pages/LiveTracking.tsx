import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Inspector } from '@/components/city/Inspector'
import { LayerToggles } from '@/components/city/LayerToggles'
import { LocationChip } from '@/components/city/LocationChip'
import { MapControls } from '@/components/city/MapControls'
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
    <main
      id="main"
      className="relative min-h-dvh overflow-hidden"
      style={{ ['--sheet-h' as string]: disruptionShown && !arrived ? '36dvh' : '28dvh' }}
    >
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
          : `You are here. ${Math.round((1 - progress) * liveJourney.durationMin)} minutes remaining.`}
      </p>
      <div className="pointer-events-none absolute inset-0 z-10">
        <div
          className="absolute inset-x-3 flex flex-col items-start gap-2 md:left-8 md:right-8"
          style={{ top: 'calc(3.75rem + env(safe-area-inset-top))' }}
        >
          <LocationChip journey={liveJourney} progress={progress} />
          <LayerToggles />
          <Inspector />
        </div>
        <div
          className="pointer-events-auto absolute inset-x-0 bottom-0 grid gap-3 px-3 md:left-8 md:right-auto md:max-w-md md:px-0"
          style={{ paddingBottom: 'calc(12px + env(safe-area-inset-bottom))' }}
        >
          <div className="pointer-events-none absolute right-3 bottom-full mb-3 md:fixed md:right-6 md:bottom-8 md:mb-0">
            <MapControls live className="relative" />
          </div>
          {arrived ? (
            <ArrivalCard />
          ) : (
            <LiveHud journey={liveJourney} progress={progress} />
          )}
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
