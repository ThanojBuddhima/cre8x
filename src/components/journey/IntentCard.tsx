import { useState } from 'react'
import { ProfileSheet } from '@/components/accessibility/ProfileSheet'
import { Button } from '@/components/ui/button'
import { Chip } from '@/components/ui/chip'
import { Input } from '@/components/ui/input'
import { places } from '@/data/places'
import { cn } from '@/lib/cn'
import { planJourneys } from '@/services/mobilityIntelligence'
import { useSynqStore } from '@/store/useSynqStore'
import type { Preference } from '@/types'

const preferences: { id: Preference; label: string; hint: string }[] = [
  {
    id: 'fastest',
    label: 'Fastest',
    hint: 'Fastest = more air, higher energy.',
  },
  {
    id: 'calm',
    label: 'Calm',
    hint: 'Calm = fewer transfers, no flying unless needed.',
  },
  {
    id: 'accessible',
    label: 'Accessible',
    hint: 'Accessible = 0 stairs and level boarding.',
  },
  {
    id: 'energy',
    label: 'Low energy',
    hint: 'Low energy = rail first, less air.',
  },
]

interface IntentCardProps {
  onPlanned: () => void
  compact?: boolean
  onExpand?: () => void
}

export function IntentCard({ onPlanned, compact = false, onExpand }: IntentCardProps) {
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
  const hint =
    preferences.find((item) => item.id === intent.preference)?.hint ?? ''

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

  const summary = `${origin?.shortName ?? 'From'} to ${destination?.shortName ?? 'where?'} · ${
    intent.timeMode === 'arrive' ? 'arrive' : 'leave'
  } ${intent.arriveBy}`

  return (
    <div className="pointer-events-auto w-full">
      <h1
        className={cn(
          'font-serif leading-tight text-paper',
          compact ? 'text-xl' : 'text-2xl md:text-4xl',
        )}
      >
        Where do you need to go?
      </h1>
      <p className="mt-1 text-sm text-muted">{summary}</p>

      {compact ? (
        <div className="mt-4 grid gap-1">
          <Button
            size="lg"
            className="w-full"
            disabled={busy || !intent.destinationId}
            onClick={() => void plan()}
          >
            {busy ? 'Finding a way…' : 'Plan my journey'}
          </Button>
          <button
            type="button"
            className="h-11 text-left text-sm text-accent"
            onClick={onExpand}
          >
            Change places or time
          </button>
        </div>
      ) : (
      <div className="mt-4 grid gap-3">
        <label className="grid gap-1 text-sm font-medium text-paper">
          From
          <select
            className="h-11 rounded-md border border-hairline bg-surface px-3 text-base text-paper"
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

        <label className="grid gap-1 text-sm font-medium text-paper">
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
                'h-11 flex-1 rounded-full text-sm',
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
                'h-11 flex-1 rounded-full text-sm',
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

        <p className="text-sm font-medium text-paper">What matters</p>
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
        <p className="text-sm text-muted">{hint}</p>
        <ProfileSheet />

        <Button
          size="lg"
          className="w-full"
          disabled={busy || !intent.destinationId}
          onClick={() => void plan()}
        >
          {busy ? 'Finding a way…' : 'Plan my journey'}
        </Button>
      </div>
      )}
    </div>
  )
}
