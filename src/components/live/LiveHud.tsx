import { getPlace } from '@/data/places'
import { modeLabel } from '@/lib/cn'
import type { Journey, JourneyLeg } from '@/types'

export function currentLeg(journey: Journey, progress: number): JourneyLeg {
  const total = journey.legs.reduce((sum, leg) => sum + leg.durationMin, 0)
  let elapsed = progress * total
  for (const leg of journey.legs) {
    if (elapsed <= leg.durationMin) return leg
    elapsed -= leg.durationMin
  }
  return journey.legs[journey.legs.length - 1] ?? journey.legs[0]!
}

export function nextLeg(journey: Journey, progress: number) {
  const current = currentLeg(journey, progress)
  const index = journey.legs.findIndex((leg) => leg.id === current.id)
  return journey.legs[index + 1]
}

export function LiveHud({
  journey,
  progress,
}: {
  journey: Journey
  progress: number
}) {
  const now = currentLeg(journey, progress)
  const upcoming = nextLeg(journey, progress)
  const from = getPlace(now.fromId)
  const remaining = Math.max(1, Math.round((1 - progress) * journey.durationMin))

  return (
    <div className="pointer-events-auto glass max-w-sm rounded-lg p-4">
      <p className="text-xs tracking-[0.16em] text-dim">NOW</p>
      <p className="mt-1 text-lg font-medium">
        {modeLabel(now.mode)} · {now.vehicleName}
      </p>
      <p className="text-sm text-muted">
        {from.shortName} · {remaining} min remaining
      </p>
      <p className="mt-3 h-1 overflow-hidden rounded-full bg-surface">
        <span
          className="block h-full bg-accent"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </p>
      {upcoming ? (
        <p className="mt-3 text-sm text-accent">
          Next: {modeLabel(upcoming.mode)} · {upcoming.vehicleName}
        </p>
      ) : (
        <p className="mt-3 text-sm text-accent">You are on the last walk to KDU.</p>
      )}
    </div>
  )
}
