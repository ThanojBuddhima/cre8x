import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean
}

export function Chip({ selected, className, ...props }: ChipProps) {
  return (
    <button
      type="button"
      className={cn(
        'h-11 rounded-full border px-4 text-sm transition-colors duration-[var(--dur-micro)]',
        selected
          ? 'border-accent bg-accent-dim text-accent'
          : 'border-hairline bg-surface-2 text-paper hover:border-accent/40',
        className,
      )}
      aria-pressed={selected}
      {...props}
    />
  )
}
