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
    <div className="pointer-events-auto glass-card w-full rounded-3xl p-6 md:max-w-sm border-t-2" style={{ borderTopColor: nowColor }}>
      <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted">YOU ARE HERE</p>
      <p className="mt-1 text-xl font-bold tracking-tight">
        {from.shortName} <span className="text-muted font-normal mx-1">·</span> <span style={{ color: nowColor }}>{modeShortLabel(now.mode)}</span>
      </p>
      <p className="mt-3 text-sm leading-snug text-ink/90 font-medium">{plain}</p>
      <p className="mt-2 text-xs font-bold uppercase tracking-wider text-muted">
        {now.vehicleName} · {remaining} min remaining
      </p>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full glass-well relative">
        <div className="absolute inset-0 bg-white/5" />
        <span
          className="block h-full relative"
          style={{
            width: `${Math.round(progress * 100)}%`,
            background: nowColor,
            boxShadow: `0 0 10px ${nowColor}`,
          }}
        >
          <span className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-1.5 bg-white blur-[2px] rounded-full" />
        </span>
      </div>
      {waiting?.isWaiting ? (
        <p
          className="mt-4 flex items-center gap-2 rounded-xl glass-well border border-[rgba(255,255,255,0.05)] px-4 py-3 text-sm font-bold text-ink"
          aria-live="polite"
        >
          <Clock size={16} aria-hidden className="text-accent" />
          <span><span className="text-accent-ink font-mono bg-[rgba(0,240,255,0.1)] px-1.5 py-0.5 rounded">{waiting.countdown} min</span> until {waiting.label}</span>
        </p>
      ) : null}
      {upcoming && nextPlace ? (
        <p className="mt-5 text-sm font-bold tracking-wide" style={{ color: nextColor }}>
          {transferPrompt(upcoming, nextPlace.shortName)}
        </p>
      ) : (
        <p className="mt-5 text-sm font-bold tracking-wide" style={{ color: nowColor }}>
          Last walk to campus. You do not need to read the map.
        </p>
      )}
    </div>
  )
}
