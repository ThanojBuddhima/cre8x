import { Accessibility, Baby, Footprints, Type } from 'lucide-react'
import { Chip } from '@/components/ui/chip'
import { useSynqStore } from '@/store/useSynqStore'

/**
 * Travel needs sit inline in the planning flow, not behind a settings toggle:
 * the brief penalises accessibility that is bolted on rather than built in.
 * Each choice changes how journeys are ranked, and the line underneath says how.
 */
export function TravelNeeds() {
  const profile = useSynqStore((s) => s.profile)
  const setProfile = useSynqStore((s) => s.setProfile)
  const calmMode = useSynqStore((s) => s.calmMode)
  const setCalmMode = useSynqStore((s) => s.setCalmMode)

  const notes: string[] = []
  if (profile.wheelchair) notes.push('only routes with level boarding')
  else if (profile.fewerStairs) notes.push('routes with the fewest stairs')
  if (profile.withChild) notes.push('fewer changes along the way')
  if (calmMode) notes.push('larger text and a simpler map')

  return (
    <fieldset className="mt-6 border-0 p-0">
      <legend className="text-base font-medium text-ink">
        How you travel
      </legend>
      <p className="mt-1 text-sm text-muted">
        Tap anything that applies. You can change it later.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Chip
          selected={profile.wheelchair}
          onClick={() => setProfile({ wheelchair: !profile.wheelchair })}
          className="gap-2 inline-flex items-center"
        >
          <Accessibility size={16} aria-hidden />I use a wheelchair
        </Chip>
        <Chip
          selected={profile.fewerStairs}
          onClick={() => setProfile({ fewerStairs: !profile.fewerStairs })}
          className="gap-2 inline-flex items-center"
        >
          <Footprints size={16} aria-hidden />
          Fewer stairs
        </Chip>
        <Chip
          selected={profile.withChild}
          onClick={() => setProfile({ withChild: !profile.withChild })}
          className="gap-2 inline-flex items-center"
        >
          <Baby size={16} aria-hidden />
          With a child
        </Chip>
        <Chip
          selected={calmMode}
          onClick={() => setCalmMode(!calmMode)}
          className="gap-2 inline-flex items-center"
        >
          <Type size={16} aria-hidden />
          Larger text
        </Chip>
      </div>
      <p className="mt-2 min-h-[1.25rem] text-sm text-accent-ink" aria-live="polite">
        {notes.length ? `SYNQ will show ${notes.join(',')}.` : ''}
      </p>
    </fieldset>
  )
}
