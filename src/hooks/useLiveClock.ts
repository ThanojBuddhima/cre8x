import { useEffect } from 'react'
import { startSimulationClock } from '@/services/simulationClock'
import { useSynqStore } from '@/store/useSynqStore'
import { resolveLiveJourney } from '@/hooks/useLiveJourney'
import { modeShortLabel } from '@/lib/modeColors'

export function useLiveClock() {
  const liveEpoch = useSynqStore((s) => s.liveEpoch)
  const setLiveProgress = useSynqStore((s) => s.setLiveProgress)
  const setDisruptionShown = useSynqStore((s) => s.setDisruptionShown)
  const setScenario = useSynqStore((s) => s.setScenario)
  const setArrived = useSynqStore((s) => s.setArrived)

  const setWaitingState = useSynqStore((s) => s.setWaitingState)

  useEffect(() => {
    let clock: any = null
    let countdownTimer: any = null

    const run = () => {
      const alreadyArrived = useSynqStore.getState().arrived
      if (alreadyArrived) return

      const state = useSynqStore.getState()
      const startAt = state.liveProgress
      
      if (state.waitingState?.isWaiting) return

      const journey = resolveLiveJourney(state.selectedJourneyId, state.results, state.acceptedReroute)
      const total = journey.legs.reduce((sum, leg) => sum + leg.durationMin, 0)
      const boundaries: { progress: number; nextMode: string }[] = []
      let elapsed = 0
      for (let i = 0; i < journey.legs.length - 1; i++) {
        elapsed += journey.legs[i].durationMin
        boundaries.push({
          progress: elapsed / total,
          nextMode: journey.legs[i+1]!.mode,
        })
      }

      let rainTriggered = state.disruptionShown || startAt >= 0.38
      let nextBoundaryIndex = boundaries.findIndex((b) => b.progress > startAt + 0.001)

      clock = startSimulationClock(
        (value) => {
          if (nextBoundaryIndex !== -1 && value >= boundaries[nextBoundaryIndex]!.progress) {
             const boundary = boundaries[nextBoundaryIndex]!
             clock.stop()
             setLiveProgress(boundary.progress)
             
             let countdown = 10
             setWaitingState({ isWaiting: true, countdown, label: modeShortLabel(boundary.nextMode as any) })
             
             countdownTimer = setInterval(() => {
               countdown -= 1
               if (countdown <= 0) {
                  clearInterval(countdownTimer)
                  setWaitingState(null)
                  run()
               } else {
                  setWaitingState({ isWaiting: true, countdown, label: modeShortLabel(boundary.nextMode as any) })
               }
             }, 300)
             return
          }

          setLiveProgress(value)
          if (value >= 0.38 && !rainTriggered) {
            rainTriggered = true
            setDisruptionShown(true)
            if (useSynqStore.getState().scenario === 'normal') setScenario('rain')
          }
          if (value >= 1) setArrived(true)
        },
        36000,
        startAt,
      )
    }

    run()

    return () => {
      if (clock) clock.stop()
      if (countdownTimer) clearInterval(countdownTimer)
    }
  }, [
    liveEpoch,
    setArrived,
    setDisruptionShown,
    setLiveProgress,
    setScenario,
    setWaitingState
  ])
}
