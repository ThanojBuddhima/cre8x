import { useLiveJourney } from '@/hooks/useLiveJourney'

export function ModeTag() {
  const { mode, color, label, arrived } = useLiveJourney()

  return (
    <span
      className="neu-sunken-sm pointer-events-none inline-flex h-8 items-center rounded-full px-2.5 text-[11px] font-bold tracking-[0.08em]"
      style={{ color, borderColor: color }}
      data-mode={mode}
    >
      {arrived ? `Arrived · ${label}` : label}
    </span>
  )
}
