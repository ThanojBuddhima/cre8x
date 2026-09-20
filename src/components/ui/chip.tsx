import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean
}

/* Selected is sunken, unselected is raised - the same press language the
   buttons use, so "on" reads as "pushed in" rather than as a colour swap.
   neu-pressed pins hover so a selected chip cannot lift back out. */
export function Chip({ selected, className, ...props }: ChipProps) {
  return (
    <button
      type="button"
      className={cn(
        'h-11 rounded-lg border-none px-5 text-sm font-bold',
        selected
          ? 'neu-pressed text-accent-ink'
          : 'neu-pressable-sm text-ink hoverable:text-accent-ink',
        className,
      )}
      aria-pressed={selected}
      {...props}
    />
  )
}
