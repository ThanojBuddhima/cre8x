import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
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
      <div className="pointer-events-auto max-h-[calc(100dvh-6rem)] w-[min(100%,26rem)] overflow-y-auto rounded-xl p-5 pb-6 glass">
        {children}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'pointer-events-auto flex flex-col rounded-t-xl border-t border-hairline glass',
        expanded ? 'h-[min(82dvh,640px)]' : 'h-auto max-h-[min(46dvh,380px)]',
      )}
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <button
        type="button"
        className="flex h-8 shrink-0 items-center justify-center"
        onClick={() => onExpandedChange(!expanded)}
        aria-expanded={expanded}
        aria-label={expanded ? 'Show less' : 'Show more trip options'}
      >
        <span className="block h-1 w-10 rounded-full bg-dim/50" />
      </button>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-3">
        {children}
      </div>
    </div>
  )
}
