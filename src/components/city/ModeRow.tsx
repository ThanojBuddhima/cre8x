import { MODE_LEGEND, modeColor } from '@/lib/modeColors'
import { useSynqStore } from '@/store/useSynqStore'

/**
 * The five modes SYNQ plans across, stated once on the home screen so a
 * first-time user knows the whole network is in scope before they search.
 */
export function ModeRow() {
  const theme = useSynqStore((s) => s.theme)

  return (
    <section className="mt-8" aria-labelledby="network-modes">
      <h2
        id="network-modes"
        className="text-xs font-medium tracking-[0.16em] text-muted"
      >
        ONE APP, FIVE WAYS TO MOVE
      </h2>
      <ul className="mt-3 grid gap-2">
        {MODE_LEGEND.map((item) => {
          const color = modeColor(item.mode, theme)
          return (
            <li
              key={item.mode}
              className="flex items-center gap-3 rounded-lg neu-sunken-sm px-3 py-2.5"
            >
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ background: color }}
                aria-hidden
              />
              <span className="w-24 shrink-0 text-sm font-medium text-ink">
                {item.label}
              </span>
              <span className="min-w-0 flex-1 text-sm text-muted">
                {item.hint}
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
