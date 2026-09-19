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
      className="pointer-events-auto glass w-full rounded-lg border-warning/40 p-4"
      role="status"
      aria-live="assertive"
    >
      <p className="text-sm font-medium text-warning">{title}</p>
      <p className="mt-1 text-sm text-paper">{body}</p>
      <div className="mt-3 flex flex-wrap gap-2">
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
