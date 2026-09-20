import type { ReactNode } from 'react'
import { useMediaQuery } from '@/lib/useMediaQuery'

interface BottomSheetProps {
  children: ReactNode
  expanded: boolean
  onExpandedChange: (expanded: boolean) => void
}

export function BottomSheet({
  children,
  expanded,
  onExpandedChange,
}: BottomSheetProps) {
  const desktop = useMediaQuery('(min-width: 768px)')

  if (desktop) {
    return (
      <div className="pointer-events-auto max-h-[calc(100dvh-6rem-var(--dock-h))] w-[min(100%,26rem)] overflow-y-auto rounded-2xl p-5">
        {children}
      </div>
    )
  }

  return (
    <div className="pointer-events-auto flex max-h-[70dvh] flex-col rounded-t-3xl">
      <button
        type="button"
        className="sub-touch flex h-9 shrink-0 items-center justify-center"
        onClick={() => onExpandedChange(!expanded)}
        aria-expanded={expanded}
        aria-label={expanded ? 'Show less' : 'Show more trip options'}
      >
        <span className="block h-1.5 w-10 rounded-full bg-[rgba(255,255,255,0.2)] shadow-[var(--glow-accent)]" />
      </button>
      <div className="min-h-0 overflow-y-auto overscroll-contain px-4 pb-[calc(0.75rem+var(--dock-h))]">
        {children}
      </div>
    </div>
  )
}
