import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/cn'

/**
 * Marks the places where the mobility intelligence made a decision for the
 * traveller: ranking, rebooking, and predicted arrival. Named so people can
 * tell which parts of the screen are a judgement rather than a timetable.
 */
export function AiBadge({
  label = 'SYNQ Intelligence',
  className,
}: {
  label?: string
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent-dim px-2.5 py-1 text-[11px] font-medium tracking-[0.06em] text-accent',
        className,
      )}
    >
      <Sparkles size={12} aria-hidden />
      {label}
    </span>
  )
}
