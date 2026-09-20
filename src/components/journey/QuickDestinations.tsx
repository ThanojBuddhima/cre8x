import { GraduationCap, House, MoreHorizontal, Plane } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

const shortcuts: { id: string; label: string; icon: LucideIcon }[] = [
  { id: 'kdu', label: 'KDU', icon: GraduationCap },
  { id: 'home', label: 'Home', icon: House },
  { id: 'airport', label: 'Airport', icon: Plane },
]

/**
 * The shortest possible path to a plan: one tap sets the destination and runs
 * the planner. Someone who is not confident with forms never has to open the
 * From/To card or read a dropdown.
 */
export function QuickDestinations({
  selectedId,
  disabled,
  onPick,
  onOther,
}: {
  selectedId: string
  disabled?: boolean
  onPick: (id: string) => void
  onOther: () => void
}) {
  return (
    <section aria-labelledby="quick-destinations" className="mt-5">
      <h2 id="quick-destinations" className="text-base font-medium text-ink">
        Going somewhere you go often?
      </h2>
      <p className="mt-1 text-sm text-muted">
        One tap plans the whole trip.
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {shortcuts.map((item) => {
          const Icon = item.icon
          const active = selectedId === item.id
          return (
            <button
              key={item.id}
              type="button"
              disabled={disabled}
              onClick={() => onPick(item.id)}
              aria-pressed={active}
              className={cn(
                'flex min-h-[5.5rem] flex-col items-center justify-center gap-2 rounded-xl px-2 text-center disabled:opacity-40',
                active
                  ? 'neu-pressed-sm neu-scope-accent text-accent-ink'
                  : 'neu-pressable-sm text-ink',
              )}
            >
              <Icon size={24} aria-hidden />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          )
        })}
        <button
          type="button"
          disabled={disabled}
          onClick={onOther}
          className="neu-pressable-sm flex min-h-[5.5rem] flex-col items-center justify-center gap-2 rounded-xl px-2 text-center text-ink disabled:opacity-40"
        >
          <MoreHorizontal size={24} aria-hidden />
          <span className="text-sm font-medium">Somewhere else</span>
        </button>
      </div>
    </section>
  )
}
