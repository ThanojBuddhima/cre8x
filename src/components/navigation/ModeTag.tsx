import { useLiveJourney } from '@/hooks/useLiveJourney'

export function ModeTag() {
  const { mode, color, label, arrived } = useLiveJourney()

  return (
    <span
      className="pointer-events-none inline-flex h-7 items-center rounded-sm px-3 text-[10px] font-bold tracking-[0.2em] uppercase border-l-2 bg-[rgba(0,0,0,0.4)] backdrop-blur-[4px]"
      style={{ color, borderColor: color }}
      data-mode={mode}
    >
      {arrived ? `Arrived · ${label}` : label}
    </span>
  )
}
