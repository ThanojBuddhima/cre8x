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
          <li key={leg.id} className="grid grid-cols-[16px_1fr] gap-3">
            <div className="flex flex-col items-center">
              <span
                className="mt-1 size-3 shrink-0 rounded-full"
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

              {leg.delayMin ? (
                <p className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-warning/40 bg-warning/10 px-2.5 py-1 text-xs font-medium text-warning">
                  <TriangleAlert size={13} aria-hidden />
                  Running {leg.delayMin} min late
                </p>
              ) : null}

              <p className="mt-1 text-sm text-dim">{leg.accessibilityNote}</p>

              {transfer ? (
                <div className="mt-3 rounded-md border border-hairline bg-surface px-3 py-2">
                  <p className="flex items-center gap-1.5 text-xs font-medium text-paper">
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
