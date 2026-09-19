import { useState } from 'react'
import { Chip } from '@/components/ui/chip'
import { Sheet } from '@/components/ui/sheet'
import { useSynqStore } from '@/store/useSynqStore'

export function ProfileSheet() {
  const [open, setOpen] = useState(false)
  const profile = useSynqStore((s) => s.profile)
  const setProfile = useSynqStore((s) => s.setProfile)
  const active =
    profile.wheelchair || profile.fewerStairs || profile.withChild

  return (
    <>
      <button
        type="button"
        className="h-11 text-left text-sm text-muted underline-offset-4 hover:text-paper hover:underline"
        onClick={() => setOpen(true)}
      >
        {active ? 'Mobility needs are on' : 'Add mobility needs'}
      </button>
      <Sheet open={open} onOpenChange={setOpen} title="How should we move you?">
        <p className="mb-4 text-sm text-muted">
          SYNQ will choose a calmer route if you need it. You can change this
          any time.
        </p>
        <div className="flex flex-wrap gap-2">
          <Chip
            selected={profile.wheelchair}
            onClick={() =>
              setProfile({ wheelchair: !profile.wheelchair })
            }
          >
            Wheelchair
          </Chip>
          <Chip
            selected={profile.fewerStairs}
            onClick={() =>
              setProfile({ fewerStairs: !profile.fewerStairs })
            }
          >
            Fewer stairs
          </Chip>
          <Chip
            selected={profile.withChild}
            onClick={() => setProfile({ withChild: !profile.withChild })}
          >
            Travelling with a child
          </Chip>
        </div>
      </Sheet>
    </>
  )
}
