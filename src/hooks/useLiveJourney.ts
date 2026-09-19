import { getJourney, journeys } from '@/data/journeys'
import { currentLeg } from '@/lib/journeyProgress'
import { modeColor, modeShortLabel } from '@/lib/modeColors'
import { useSynqStore } from '@/store/useSynqStore'
import type { Journey, TransportMode } from '@/types'

export function resolveLiveJourney(
  selectedId: string | null,
  results: Journey[],
  acceptedReroute: boolean,
  pathId?: string,
): Journey {
  const journeyId = selectedId ?? pathId ?? 'j1'
  const journey =
    results.find((item) => item.id === journeyId) ??
    getJourney(journeyId) ??
    journeys[0]!
  if (acceptedReroute && journey.usesCoastalRoad) {
    return getJourney('j2') ?? journey
  }
  return journey
}

export function useLiveJourney() {
  const selectedId = useSynqStore((s) => s.selectedJourneyId)
  const results = useSynqStore((s) => s.results)
  const acceptedReroute = useSynqStore((s) => s.acceptedReroute)
  const liveProgress = useSynqStore((s) => s.liveProgress)
  const arrived = useSynqStore((s) => s.arrived)
  const disruptionShown = useSynqStore((s) => s.disruptionShown)

  const journey = resolveLiveJourney(selectedId, results, acceptedReroute)
  const progress = arrived ? 1 : liveProgress
  const now = currentLeg(journey, progress)
  const mode: TransportMode = now.mode
  const color = modeColor(mode, 'dark')

  return {
    journey,
    progress,
    arrived,
    disruptionShown,
    now,
    mode,
    color,
    label: modeShortLabel(mode),
  }
}
