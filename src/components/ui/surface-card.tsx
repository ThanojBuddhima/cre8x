import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

/* A raised card on the canvas. Whatever goes inside it must be flat or
   sunken - this is plane +1, and the budget stops one level below. */
export function SurfaceCard({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'neu-raised rounded-3xl p-8 transition-all duration-[var(--dur-ui)] ease-[var(--ease-out)]',
        className,
      )}
      {...props}
    />
  )
}
