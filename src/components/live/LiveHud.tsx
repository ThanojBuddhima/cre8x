import { getPlace } from '@/data/places'
import { currentLeg, nextLeg } from '@/lib/journeyProgress'
import { modeColor, modeShortLabel, trackingSentence, transferPrompt } from '@/lib/modeColors'
import type { Journey } from '@/types'

export { currentLeg, currentLegIndex, nextLeg } from '@/lib/journeyProgress'

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
  const nowColor = modeColor(now.mode, 'dark')
  const nextColor = upcoming ? modeColor(upcoming.mode, 'dark') : nowColor
  const nextPlace = upcoming ? getPlace(upcoming.fromId) : null
  const plain = trackingSentence(now, upcoming, nextPlace?.shortName)

  return (
    <div className="pointer-events-auto glass w-full rounded-lg p-4 md:max-w-sm">
      <p className="text-xs font-medium tracking-[0.12em] text-dim">YOU ARE HERE</p>
      <p className="mt-1 text-lg font-medium">
        {from.shortName} · {modeShortLabel(now.mode)}
      </p>
      <p className="mt-2 text-sm leading-snug text-paper">{plain}</p>
      <p className="mt-2 text-sm text-muted">
        {now.vehicleName} · {remaining} min remaining
      </p>
      <p className="mt-3 h-1 overflow-hidden rounded-full bg-surface">
        <span
          className="block h-full"
          style={{
            width: `${Math.round(progress * 100)}%`,
            background: nowColor,
          }}
        />
      </p>
      {upcoming && nextPlace ? (
        <p className="mt-3 text-sm font-medium" style={{ color: nextColor }}>
          {transferPrompt(upcoming, nextPlace.shortName)}
        </p>
      ) : (
        <p className="mt-3 text-sm" style={{ color: nowColor }}>
          Last walk to campus. You do not need to read the map.
        </p>
      )}
    </div>
  )
}
