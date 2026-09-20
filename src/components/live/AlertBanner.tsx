import { AiBadge } from '@/components/ui/ai-badge'
import { Button } from '@/components/ui/button'
import { useSynqStore } from '@/store/useSynqStore'

export function AlertBanner({
  onAccept,
  onOther,
}: {
  onAccept: () => void
  onOther: () => void
}) {
  const scenario = useSynqStore((s) => s.scenario)

  const title =
    scenario === 'emergency'
      ? 'Hospital corridors have priority.'
      : 'Heavy rain on Coastal Road 04.'
  const body =
    scenario === 'emergency'
      ? 'I kept you on a clear path. You still arrive on time.'
      : 'I moved you off a flood-risk road. You still arrive by 08:27.'

  return (
    <div
      className="pointer-events-auto glass-card w-full rounded-3xl p-6 border border-warning/30 shadow-[var(--glow-warning)] bg-[rgba(245,158,11,0.05)]"
      role="status"
      aria-live="assertive"
    >
      <AiBadge label="Rebooked for you" />
      <p className="mt-4 text-base font-bold text-warning-ink tracking-wide">{title}</p>
      <p className="mt-1 text-sm text-ink/80">{body}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button size="sm" onClick={onAccept}>
          Continue this way
        </Button>
        <Button size="sm" variant="secondary" onClick={onOther}>
          See the other option
        </Button>
      </div>
    </div>
  )
}
