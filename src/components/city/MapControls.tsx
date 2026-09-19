import { LocateFixed, Minus, Navigation, Plus } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useSynqStore } from '@/store/useSynqStore'

export function MapControls({
  live = false,
  className,
}: {
  live?: boolean
  className?: string
}) {
  const issueMapCommand = useSynqStore((s) => s.issueMapCommand)
  const followUser = useSynqStore((s) => s.followUser)
  const setFollowUser = useSynqStore((s) => s.setFollowUser)

  const btn =
    'grid size-11 place-items-center rounded-full glass text-paper'

  return (
    <div
      className={cn(
        'pointer-events-auto z-20 flex flex-col gap-2',
        className ??
          'absolute right-3 bottom-[calc(var(--sheet-h,28dvh)+12px+env(safe-area-inset-bottom))] md:right-6 md:bottom-8',
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
          className={`${btn} ${followUser ? 'text-accent' : ''}`}
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
