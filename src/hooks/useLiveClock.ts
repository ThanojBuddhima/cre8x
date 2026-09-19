import { useEffect } from 'react'
import { startSimulationClock } from '@/services/simulationClock'
import { useSynqStore } from '@/store/useSynqStore'

export function useLiveClock() {
  const liveEpoch = useSynqStore((s) => s.liveEpoch)
  const setLiveProgress = useSynqStore((s) => s.setLiveProgress)
  const setDisruptionShown = useSynqStore((s) => s.setDisruptionShown)
  const setScenario = useSynqStore((s) => s.setScenario)
  const setArrived = useSynqStore((s) => s.setArrived)

  useEffect(() => {
    const alreadyArrived = useSynqStore.getState().arrived
    if (alreadyArrived) return
    const startAt = useSynqStore.getState().liveProgress
    let rainTriggered =
      useSynqStore.getState().disruptionShown || startAt >= 0.38
    const startScenario = useSynqStore.getState().scenario
    const clock = startSimulationClock(
      (value) => {
        setLiveProgress(value)
        if (value >= 0.38 && !rainTriggered) {
          rainTriggered = true
          setDisruptionShown(true)
          if (startScenario === 'normal') setScenario('rain')
        }
        if (value >= 1) setArrived(true)
      },
      36000,
      startAt,
    )
    return () => clock.stop()
  }, [
    liveEpoch,
    setArrived,
    setDisruptionShown,
    setLiveProgress,
    setScenario,
  ])
}
