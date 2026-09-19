import { getPlace } from '@/data/places'
import { modeLabel } from '@/lib/cn'
import { modeColor } from '@/lib/modeColors'
import { useSynqStore } from '@/store/useSynqStore'
import type { Journey } from '@/types'

export function JourneyTimeline({ journey }: { journey: Journey }) {
  const theme = useSynqStore((s) => s.theme)

  return (
    <ol className="relative space-y-0">
      {journey.legs.map((leg, index) => {
        const from = getPlace(leg.fromId)
        const to = getPlace(leg.toId)
        const color = modeColor(leg.mode, theme)
        const next = journey.legs[index + 1]
        return (
          <li key={leg.id} className="grid grid-cols-[16px_1fr] gap-3">
            <div className="flex flex-col items-center">
              <span
                className="mt-1 size-3 rounded-full"
                style={{ background: color }}
              />
              {index < journey.legs.length - 1 ? (
                <span
                  className="w-px flex-1"
                  style={{
                    background: next
                      ? `linear-gradient(${color}, ${modeColor(next.mode, theme)})`
                      : color,
                  }}
                />
              ) : null}
            </div>
            <div className="pb-6">
              <p className="text-xs text-dim">
                {leg.departure}–{leg.arrival} · {leg.durationMin} min
              </p>
              <p className="mt-1 text-sm font-medium" style={{ color }}>
                {modeLabel(leg.mode)} · {leg.vehicleName}
              </p>
              <p className="text-sm text-muted">
                {from.shortName}
                {from.id !== to.id ? ` → ${to.shortName}` : ''}
              </p>
              <p className="mt-1 text-sm text-dim">{leg.accessibilityNote}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
