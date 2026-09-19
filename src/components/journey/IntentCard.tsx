import { useState } from 'react'
import { ProfileSheet } from '@/components/accessibility/ProfileSheet'
import { Button } from '@/components/ui/button'
import { Chip } from '@/components/ui/chip'
import { GlassCard } from '@/components/ui/glass-card'
import { Input } from '@/components/ui/input'
import { places } from '@/data/places'
import { cn } from '@/lib/cn'
import { planJourneys } from '@/services/mobilityIntelligence'
import { useSynqStore } from '@/store/useSynqStore'
import type { Preference } from '@/types'

const preferences: { id: Preference; label: string }[] = [
  { id: 'fastest', label: 'Fastest' },
  { id: 'calm', label: 'Calm' },
  { id: 'accessible', label: 'Accessible' },
  { id: 'energy', label: 'Low energy' },
]

interface IntentCardProps {
  onPlanned: () => void
}

export function IntentCard({ onPlanned }: IntentCardProps) {
  const intent = useSynqStore((s) => s.intent)
  const setIntent = useSynqStore((s) => s.setIntent)
  const profile = useSynqStore((s) => s.profile)
  const scenario = useSynqStore((s) => s.scenario)
  const calmMode = useSynqStore((s) => s.calmMode)
  const setResults = useSynqStore((s) => s.setResults)
  const [query, setQuery] = useState('')
  const [busy, setBusy] = useState(false)

  const origin = places.find((p) => p.id === intent.originId)
  const destination = places.find((p) => p.id === intent.destinationId)
  const matches = places.filter((place) =>
    place.name.toLowerCase().includes(query.toLowerCase()),
  )

  async function plan() {
    setBusy(true)
    await new Promise((resolve) => setTimeout(resolve, calmMode ? 200 : 1100))
    const results = planJourneys({
      originId: intent.originId,
      destinationId: intent.destinationId,
      arriveBy: intent.arriveBy,
      preference: intent.preference,
      accessibility: profile,
      scenario,
      calmMode,
    })
    setResults(results)
    setBusy(false)
    onPlanned()
  }

  return (
    <GlassCard className="pointer-events-auto w-full max-w-md">
      <p className="text-xs tracking-[0.2em] text-dim">SYNQ INTELLIGENCE</p>
      <h1 className="mt-2 font-serif text-3xl leading-tight text-paper">
        Where do you need to go?
      </h1>
      <p className="mt-2 text-sm text-muted">
        Say the place and the time. The city coordinates the rest.
      </p>

      <div className="mt-5 grid gap-3">
        <label className="grid gap-1 text-xs text-dim">
          From
          <select
            className="h-11 rounded-md border border-hairline bg-surface px-3 text-sm text-paper"
            value={intent.originId}
            onChange={(event) => setIntent({ originId: event.target.value })}
          >
            {places.map((place) => (
              <option key={place.id} value={place.id}>
                {place.name}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1 text-xs text-dim">
          To
          <Input
            value={query || destination?.name || ''}
            onChange={(event) => {
              setQuery(event.target.value)
              setIntent({ destinationId: '' })
            }}
            placeholder="Search a place"
            aria-autocomplete="list"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {(query ? matches : places.filter((p) => p.id === 'kdu')).map(
            (place) => (
              <Chip
                key={place.id}
                selected={intent.destinationId === place.id}
                onClick={() => {
                  setIntent({ destinationId: place.id })
                  setQuery('')
                }}
              >
                {place.shortName}
              </Chip>
            ),
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex rounded-full border border-hairline p-1">
            <button
              type="button"
              className={cn(
                'h-9 flex-1 rounded-full text-xs',
                intent.timeMode === 'arrive'
                  ? 'bg-accent-dim text-accent'
                  : 'text-muted',
              )}
              onClick={() => setIntent({ timeMode: 'arrive' })}
            >
              Arrive by
            </button>
            <button
              type="button"
              className={cn(
                'h-9 flex-1 rounded-full text-xs',
                intent.timeMode === 'leave'
                  ? 'bg-accent-dim text-accent'
                  : 'text-muted',
              )}
              onClick={() => setIntent({ timeMode: 'leave' })}
            >
              Leave at
            </button>
          </div>
          <Input
            type="time"
            value={intent.arriveBy}
            onChange={(event) => setIntent({ arriveBy: event.target.value })}
            aria-label="Target time"
          />
        </div>

        <p className="text-xs text-dim">What matters</p>
        <div className="flex flex-wrap gap-2">
          {preferences.map((item) => (
            <Chip
              key={item.id}
              selected={intent.preference === item.id}
              onClick={() => setIntent({ preference: item.id })}
            >
              {item.label}
            </Chip>
          ))}
        </div>

        <ProfileSheet />

        <Button
          size="lg"
          className="mt-1 w-full"
          disabled={busy || !intent.destinationId}
          onClick={() => void plan()}
        >
          {busy ? 'Finding a way…' : 'Plan my journey'}
        </Button>
        {origin && destination ? (
          <p className="text-xs text-dim">
            {origin.shortName} → {destination.shortName} · {intent.timeMode}{' '}
            {intent.arriveBy}
          </p>
        ) : null}
      </div>
    </GlassCard>
  )
}
