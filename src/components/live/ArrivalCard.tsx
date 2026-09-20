import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'
import { useSynqStore } from '@/store/useSynqStore'

export function ArrivalCard() {
  const resetLive = useSynqStore((s) => s.resetLive)
  const navigate = useNavigate()

  return (
    <GlassCard className="pointer-events-auto w-full text-center md:max-w-sm">
      <p className="text-xs tracking-[0.2em] text-dim">ARRIVED</p>
      <h2 className="mt-2 font-serif text-3xl">You’re at KDU.</h2>
      <p className="mt-2 text-sm text-muted">
        The network will wait nearby if you need a return journey.
      </p>
      <Button
        className="mt-5 w-full"
        onClick={() => {
          resetLive()
          navigate('/')
        }}
      >
        Plan another journey
      </Button>
    </GlassCard>
  )
}
