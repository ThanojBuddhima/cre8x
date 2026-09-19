import type { Journey, JourneyLeg } from '@/types'

export function currentLegIndex(journey: Journey, progress: number) {
  const total = journey.legs.reduce((sum, leg) => sum + leg.durationMin, 0)
  let elapsed = progress * total
  for (let i = 0; i < journey.legs.length; i += 1) {
    const leg = journey.legs[i]!
    if (elapsed <= leg.durationMin) return i
    elapsed -= leg.durationMin
  }
  return Math.max(0, journey.legs.length - 1)
}

export function currentLeg(journey: Journey, progress: number): JourneyLeg {
  return journey.legs[currentLegIndex(journey, progress)] ?? journey.legs[0]!
}

export function nextLeg(journey: Journey, progress: number) {
  const index = currentLegIndex(journey, progress)
  return journey.legs[index + 1]
}
