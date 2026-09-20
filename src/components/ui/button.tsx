import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

/* Depth is the whole affordance here - there are no fills to lean on - so
   every variant that is meant to look pressable gets neu-pressable, which
   owns the rest state, the hover tier-up, the press inset and the timing.
   Emphasis comes from a tinted surface plus an ink colour, never a flat fill.

   All sizes stay at or above the 44px touch floor; they differ in padding
   and type only. Making `sm` shorter just collided with the global minimum. */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold select-none disabled:pointer-events-none transition-all duration-[var(--dur-ui)] ease-[var(--ease-out)]',
  {
    variants: {
      variant: {
        primary: 'bg-[var(--color-accent)] text-black border border-[var(--color-accent-light)] shadow-[0_0_15px_rgba(0,240,255,0.4)] hoverable:shadow-[0_0_25px_rgba(0,240,255,0.7)] hoverable:bg-[var(--color-accent-light)] hoverable:-translate-y-0.5 active:translate-y-px active:shadow-[0_0_10px_rgba(0,240,255,0.4)]',
        secondary: 'bg-[rgba(255,255,255,0.05)] text-white border border-[rgba(255,255,255,0.2)] backdrop-blur-md shadow-sm hoverable:bg-[rgba(255,255,255,0.1)] hoverable:border-[rgba(255,255,255,0.4)] hoverable:-translate-y-0.5 active:translate-y-px',
        warning: 'bg-[var(--color-warning)] text-black border border-[var(--color-warning)] shadow-[0_0_15px_rgba(245,158,11,0.4)] hoverable:-translate-y-0.5 active:translate-y-px',
        danger: 'bg-[var(--color-danger)] text-white border border-[var(--color-danger)] shadow-[0_0_15px_rgba(239,68,68,0.4)] hoverable:-translate-y-0.5 active:translate-y-px',
        ghost:
          'bg-transparent text-muted border border-transparent hoverable:bg-white/5 hoverable:border-white/10 hoverable:text-ink active:bg-black/20 active:text-accent-ink disabled:opacity-45',
      },
      size: {
        sm: 'h-11 px-3 text-xs',
        md: 'h-11 px-5 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'size-11 px-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button'

  if (asChild) {
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </Comp>
    )
  }

  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" aria-hidden />}
      {children}
    </Comp>
  )
}
