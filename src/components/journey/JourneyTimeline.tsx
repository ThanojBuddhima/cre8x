import { ArrowRightLeft, Clock, TriangleAlert } from 'lucide-react'
import { getPlace } from '@/data/places'
import { modeLabel } from '@/lib/cn'
import { modeColor } from '@/lib/modeColors'
import { transferBetween } from '@/lib/time'
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
        const transfer = transferBetween(leg, next)

        return (
          <li key={leg.id} className="grid grid-cols-[16px_1fr] gap-4">
            <div className="flex flex-col items-center">
              <span
                className="mt-1.5 size-4 shrink-0 rounded-full shadow-[0_0_12px_currentColor]"
                style={{ background: color, color }}
              />
              {index < journey.legs.length - 1 ? (
                <span
                  className="w-[2px] flex-1 my-1"
                  style={{
                    background: next
                      ? `linear-gradient(to bottom, ${color}, ${modeColor(next.mode, theme)})`
                      : color,
                  }}
                />
              ) : null}
            </div>

            <div className="pb-8">
              <p className="text-xs font-medium tracking-wide text-muted">
                {leg.departure}–{leg.arrival} · {leg.durationMin} min
              </p>
              <p className="mt-1 text-sm font-medium" style={{ color }}>
                {modeLabel(leg.mode)} · {leg.vehicleName}
              </p>
              <p className="text-sm text-muted">
                {from.shortName}
                {from.id !== to.id ? ` → ${to.shortName}` : ''}
              </p>

              {leg.delayMin ? (
                <p className="mt-2 inline-flex items-center gap-1.5 rounded-full border bg-warning/10 px-2.5 py-1 text-xs font-medium text-warning-ink">
                  <TriangleAlert size={13} aria-hidden />
                  Running {leg.delayMin} min late
                </p>
              ) : null}

              <p className="mt-1 text-sm text-muted">{leg.accessibilityNote}</p>

              {transfer ? (
                <div className="mt-3 rounded-md neu-sunken-sm px-3 py-2">
                  <p className="flex items-center gap-1.5 text-xs font-medium text-ink">
                    <ArrowRightLeft size={13} aria-hidden />
                    Change at {to.shortName}
                  </p>
                  <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
                    <span className="inline-flex items-center gap-1">
                      <Clock size={12} aria-hidden />
                      {transfer.waitMin === 0
                        ? 'No waiting'
                        : `${transfer.waitMin} min wait`}
                    </span>
                    <span aria-hidden>·</span>
                    <span>
                      {transfer.stepFree
                        ? 'Step-free, level boarding'
                        : `${next?.stairs} stairs on this change`}
                    </span>
                  </p>
                </div>
              ) : null}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
