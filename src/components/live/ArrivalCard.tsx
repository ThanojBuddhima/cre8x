import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'
import { Link } from 'react-router-dom'

export function ArrivalCard() {
  return (
    <GlassCard className="pointer-events-auto max-w-sm text-center">
      <p className="text-xs tracking-[0.2em] text-dim">ARRIVED</p>
      <h2 className="mt-2 font-serif text-3xl">You’re at KDU.</h2>
      <p className="mt-2 text-sm text-muted">
        The network will wait nearby if you need a return journey.
      </p>
      <Button asChild className="mt-5 w-full">
        <Link to="/">Plan another journey</Link>
      </Button>
    </GlassCard>
  )
}
