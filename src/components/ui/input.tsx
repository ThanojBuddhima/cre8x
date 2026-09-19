import type { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-11 w-full rounded-md border border-hairline bg-surface px-3 text-base text-paper placeholder:text-dim',
        className,
      )}
      {...props}
    />
  )
}
