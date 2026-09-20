import type { Journey, JourneyLeg } from '@/types'

export function toMinutes(clock: string): number {
  const [h = '0', m = '0'] = clock.split(':')
  return Number(h) * 60 + Number(m)
}

export function toClock(minutes: number): string {
  const wrapped = ((minutes % 1440) + 1440) % 1440
  const h = Math.floor(wrapped / 60)
  const m = wrapped % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function addMinutes(clock: string, delta: number): string {
  return toClock(toMinutes(clock) + delta)
}

/** Minutes of waiting between arriving on one leg and leaving on the next. */
export function gapMinutes(arrival: string, departure: string): number {
  return Math.max(0, toMinutes(departure) - toMinutes(arrival))
}

/**
 * Walks the journey carrying any running late forward, letting slack at a
 * transfer absorb it. Returns the arrival a traveller should actually expect,
 * which is the number the whole screen is built around.
 */
export function liveArrival(journey: Journey): {
  arriveAt: string
  lateBy: number
} {
  let late = 0

  journey.legs.forEach((leg, index) => {
    late += leg.delayMin ?? 0
    const next = journey.legs[index + 1]
    if (next) {
      late = Math.max(0, late - gapMinutes(leg.arrival, next.departure))
    }
  })

  return { arriveAt: addMinutes(journey.arriveAt, late), lateBy: late }
}

/** The transfer a traveller makes between two legs, or null for a walk link. */
export function transferBetween(
  leg: JourneyLeg,
  next: JourneyLeg | undefined,
): { waitMin: number; stepFree: boolean } | null {
  if (!next) return null
  if (leg.mode === 'walk' && next.mode === 'walk') return null
  return {
    waitMin: gapMinutes(leg.arrival, next.departure),
    stepFree: next.stairs === 0,
  }
}
