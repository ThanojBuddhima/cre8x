import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-[transform,background,opacity] duration-[var(--dur-micro)] ease-[var(--ease-out)] disabled:pointer-events-none disabled:opacity-40',
  {
    variants: {
      variant: {
        primary:
          'bg-accent text-ink hover:brightness-110 active:scale-[0.98]',
        secondary:
          'glass text-paper hover:bg-surface-2',
        ghost:
          'bg-transparent text-muted hover:text-paper hover:bg-surface',
        warning:
          'bg-warning text-ink hover:brightness-110',
      },
      size: {
        md: 'h-11',
        lg: 'h-12 px-5 text-base',
        sm: 'h-10 px-3 text-sm',
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
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}
