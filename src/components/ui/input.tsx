import type { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean
}

/* Inputs are wells - sunken at rest, deeper on focus. The old focus:ring-2
   doubled the global :focus-visible outline at the same offset, and fired on
   mouse clicks where the outline did not. The outline is the focus indicator;
   the deepening inset is just reinforcement. */
export function Input({ className, invalid, ...props }: InputProps) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={cn(
        'h-12 w-full rounded-lg border-none px-4 text-base text-ink placeholder:text-muted',
        'neu-sunken transition-all duration-[var(--dur-ui)] ease-[var(--ease-out)]',
        'focus:border-[var(--color-accent)] focus:bg-[rgba(0,240,255,0.05)] focus:shadow-[var(--glow-accent)]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        invalid && 'neu-scope-danger text-danger-ink placeholder:text-danger-ink/60 focus:border-danger focus:shadow-[var(--glow-danger)]',
        className,
      )}
      {...props}
    />
  )
}
