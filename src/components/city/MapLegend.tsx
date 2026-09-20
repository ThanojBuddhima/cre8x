import { MODE_LEGEND, modeColor } from '@/lib/modeColors'
import { useSynqStore } from '@/store/useSynqStore'

export function MapLegend() {
  const theme = useSynqStore((s) => s.theme)

  return (
    <div className="pointer-events-none text-[11px] leading-snug text-muted md:text-xs">
      <div className="flex flex-wrap gap-x-2.5 gap-y-1">
        {MODE_LEGEND.map((item) => (
          <span key={item.mode} className="inline-flex items-center gap-1">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ background: modeColor(item.mode, theme) }}
            />
            {item.label}
          </span>
        ))}
      </div>
      <p className="mt-1 text-[11px] text-muted">Colour shows how you travel</p>
    </div>
  )
}
