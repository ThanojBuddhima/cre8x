import { Clock } from 'lucide-react'
import { getPlace } from '@/data/places'
import { currentLeg, nextLeg } from '@/lib/journeyProgress'
import { modeColor, modeShortLabel, trackingSentence, transferPrompt } from '@/lib/modeColors'
import { useSynqStore } from '@/store/useSynqStore'
import type { Journey } from '@/types'

export { currentLeg, currentLegIndex, nextLeg } from '@/lib/journeyProgress'

export function LiveHud({
  journey,
  progress,
}: {
  journey: Journey
  progress: number
}) {
  const waiting = useSynqStore((s) => s.waitingState)
  const theme = useSynqStore((s) => s.theme)
  const now = currentLeg(journey, progress)
  const upcoming = nextLeg(journey, progress)
  const from = getPlace(now.fromId)
  const remaining = Math.max(1, Math.round((1 - progress) * journey.durationMin))
  const nowColor = modeColor(now.mode, theme)
  const nextColor = upcoming ? modeColor(upcoming.mode, theme) : nowColor
  const nextPlace = upcoming ? getPlace(upcoming.fromId) : null
  const plain = trackingSentence(now, upcoming, nextPlace?.shortName)

  return (
    <div className="pointer-events-auto neu-raised w-full rounded-2xl p-5 md:max-w-sm">
      <p className="text-xs font-medium tracking-[0.12em] text-muted">YOU ARE HERE</p>
      <p className="mt-1 text-lg font-medium">
        {from.shortName} · {modeShortLabel(now.mode)}
      </p>
      <p className="mt-2 text-sm leading-snug text-ink">{plain}</p>
      <p className="mt-2 text-sm text-muted">
        {now.vehicleName} · {remaining} min remaining
      </p>
      <p className="mt-3 h-1 overflow-hidden rounded-full neu-sunken-sm">
        <span
          className="block h-full"
          style={{
            width: `${Math.round(progress * 100)}%`,
            background: nowColor,
          }}
        />
      </p>
      {waiting?.isWaiting ? (
        <p
          className="mt-3 flex items-center gap-2 rounded-lg neu-sunken-sm px-3 py-2 text-sm text-ink"
          aria-live="polite"
        >
          <Clock size={14} aria-hidden />
          {waiting.label} is almost here — arriving in {waiting.countdown} min
        </p>
      ) : null}
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
