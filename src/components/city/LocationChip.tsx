import { getPlace } from '@/data/places'
import { currentLeg, nextLeg } from '@/lib/journeyProgress'
import { modeColor, modeShortLabel } from '@/lib/modeColors'
import { useSynqStore } from '@/store/useSynqStore'
import type { Journey } from '@/types'

export function LocationChip({
  journey,
  progress = 0,
}: {
  journey?: Journey
  progress?: number
}) {
  const originId = useSynqStore((s) => s.intent.originId)
  const theme = useSynqStore((s) => s.theme)
  const here = journey
    ? getPlace(currentLeg(journey, progress).fromId)
    : getPlace(originId)
  const upcoming = journey ? nextLeg(journey, progress) : undefined
  const now = journey ? currentLeg(journey, progress) : undefined
  const color = now ? modeColor(now.mode, theme) : undefined

  const line =
    journey && now
      ? upcoming
        ? `You are here: ${here.shortName} · ${modeShortLabel(now.mode)}`
        : `You are here: ${here.shortName} · last walk`
      : `You are here: ${here.shortName}`

  return (
    <div className="pointer-events-auto glass-interactive max-w-[min(100%,16rem)] rounded-full px-4 py-3 text-sm text-ink md:max-w-[20rem] flex items-center gap-3">
      {color && (
        <span className="relative flex size-2.5 shrink-0 items-center justify-center">
          <span
            className="absolute inset-0 rounded-full animate-ping opacity-75"
            style={{ background: color }}
          />
          <span
            className="relative inline-flex size-1.5 rounded-full"
            style={{ background: color }}
          />
        </span>
      )}
      <p className="truncate font-medium leading-tight" style={{ color: color ?? 'inherit' }}>
        {line}
      </p>
    </div>
  )
}
