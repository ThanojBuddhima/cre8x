import { LocateFixed, Minus, Navigation, Plus } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useSynqStore } from '@/store/useSynqStore'

export function MapControls({
  live = false,
  className,
  orientation = 'vertical',
}: {
  live?: boolean
  className?: string
  orientation?: 'vertical' | 'horizontal'
}) {
  const issueMapCommand = useSynqStore((s) => s.issueMapCommand)
  const followUser = useSynqStore((s) => s.followUser)
  const setFollowUser = useSynqStore((s) => s.setFollowUser)

  const btn =
    'neu-pressable-sm grid size-11 place-items-center rounded-full text-muted hoverable:text-accent-ink'

  return (
    <div
      className={cn(
        'pointer-events-auto z-20 flex gap-2',
        orientation === 'horizontal' ? 'flex-row' : 'flex-col',
        className ??
          'absolute right-3 bottom-[calc(var(--dock-h)+12px)] md:right-6',
      )}
    >
      <button
        type="button"
        className={btn}
        onClick={() => issueMapCommand('zoom-in')}
        aria-label="Zoom in"
      >
        <Plus size={18} />
      </button>
      <button
        type="button"
        className={btn}
        onClick={() => issueMapCommand('zoom-out')}
        aria-label="Zoom out"
      >
        <Minus size={18} />
      </button>
      <button
        type="button"
        className={btn}
        onClick={() => issueMapCommand('recenter')}
        aria-label="Recenter on you"
      >
        <LocateFixed size={18} />
      </button>
      {live ? (
        <button
          type="button"
          className={`${btn} ${followUser ? 'text-accent-ink' : ''}`}
          onClick={() => setFollowUser(!followUser)}
          aria-pressed={followUser}
          aria-label="Follow my position"
        >
          <Navigation size={18} />
        </button>
      ) : null}
    </div>
  )
}
