import { useState } from 'react'
import {
  Accessibility,
  ArrowUpDown,
  BatteryCharging,
  ChevronDown,
  ShieldCheck,
  Wind,
  Zap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { TravelNeeds } from '@/components/accessibility/TravelNeeds'
import { PlacePicker } from '@/components/journey/PlacePicker'
import { QuickDestinations } from '@/components/journey/QuickDestinations'
import { Button } from '@/components/ui/button'
import { Chip } from '@/components/ui/chip'
import { Input } from '@/components/ui/input'
import { getPlace } from '@/data/places'
import { cn } from '@/lib/cn'
import { planJourneys } from '@/services/mobilityIntelligence'
import { useSynqStore } from '@/store/useSynqStore'
import type { Preference } from '@/types'

const preferences: {
  id: Preference
  label: string
  hint: string
  icon: LucideIcon
}[] = [
  {
    id: 'fastest',
    label: 'Fastest',
    hint: 'Uses air travel when it saves time. Higher energy use.',
    icon: Zap,
  },
  {
    id: 'calm',
    label: 'Calm',
    hint: 'Fewer changes along the way. No flying unless it is needed.',
    icon: Wind,
  },
  {
    id: 'accessible',
    label: 'Step-free',
    hint: 'No stairs, and level boarding at every change.',
    icon: Accessibility,
  },
  {
    id: 'energy',
    label: 'Low energy',
    hint: 'Bus and rail first. Air only when nothing else works.',
    icon: BatteryCharging,
  },
  {
    id: 'resilient',
    label: 'Resilient',
    hint: 'Stays clear of flood-risk roads, even if it takes a little longer.',
    icon: ShieldCheck,
  },
]

interface IntentCardProps {
  onPlanned: () => void
  compact?: boolean
  onExpand?: () => void
}

export function IntentCard({ onPlanned, compact = false }: IntentCardProps) {
  const intent = useSynqStore((s) => s.intent)
  const setIntent = useSynqStore((s) => s.setIntent)
  const profile = useSynqStore((s) => s.profile)
  const scenario = useSynqStore((s) => s.scenario)
  const calmMode = useSynqStore((s) => s.calmMode)
  const setResults = useSynqStore((s) => s.setResults)
  const resetLive = useSynqStore((s) => s.resetLive)
  const [picking, setPicking] = useState<'origin' | 'destination' | null>(null)
  const [busy, setBusy] = useState(false)

  const origin = getPlace(intent.originId)
  const destination = intent.destinationId
    ? getPlace(intent.destinationId)
    : null
  const hint =
    preferences.find((item) => item.id === intent.preference)?.hint ?? ''

  async function plan(overrideDestinationId?: string) {
    const destinationId = overrideDestinationId ?? intent.destinationId
    if (!destinationId) return
    setBusy(true)
    // A new plan is a new trip: clear any finished or in-flight run first,
    // otherwise the previous journey's `arrived` state freezes this one.
    resetLive()
    await new Promise((resolve) => setTimeout(resolve, calmMode ? 200 : 900))
    setResults(
      planJourneys({
        originId: intent.originId,
        destinationId,
        arriveBy: intent.arriveBy,
        preference: intent.preference,
        accessibility: profile,
        scenario,
        calmMode,
      }),
    )
    setBusy(false)
    onPlanned()
  }

  function swap() {
    if (!intent.destinationId) return
    setIntent({
      originId: intent.destinationId,
      destinationId: intent.originId,
    })
  }

  return (
    <div className="pointer-events-auto w-full">
      <h1
        className={cn(
          'font-serif leading-tight text-paper',
          compact ? 'text-2xl' : 'text-3xl md:text-4xl',
        )}
      >
        Where do you need to go?
      </h1>
      <p className="mt-2 text-base text-muted">
        Tell SYNQ the place and the time. It works out the rest.
      </p>

      <QuickDestinations
        selectedId={intent.destinationId}
        disabled={busy}
        onPick={(id) => {
          setIntent({ destinationId: id })
          void plan(id)
        }}
        onOther={() => setPicking('destination')}
      />

      <div className="glass mt-5 flex items-stretch gap-1 rounded-xl p-2">
        <div className="min-w-0 flex-1">
          <TripRow
            label="From"
            value={origin.name}
            onClick={() => setPicking('origin')}
          />
          <div className="ml-3 h-px bg-hairline" />
          <TripRow
            label="To"
            value={destination ? destination.name : 'Choose a place'}
            muted={!destination}
            onClick={() => setPicking('destination')}
          />
        </div>
        <button
          type="button"
          onClick={swap}
          aria-label="Swap start and destination"
          className="my-auto grid size-11 shrink-0 place-items-center rounded-full border border-hairline bg-surface-2 text-muted transition-colors hover:border-accent/40 hover:text-accent"
        >
          <ArrowUpDown size={16} aria-hidden />
        </button>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <div
          className="flex rounded-full border border-hairline p-1"
          role="group"
          aria-label="Time mode"
        >
          {(['arrive', 'leave'] as const).map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={intent.timeMode === value}
              className={cn(
                'h-11 flex-1 rounded-full text-sm font-medium transition-colors',
                intent.timeMode === value
                  ? 'bg-accent-dim text-accent'
                  : 'text-muted hover:text-paper',
              )}
              onClick={() => setIntent({ timeMode: value })}
            >
              {value === 'arrive' ? 'Arrive by' : 'Leave at'}
            </button>
          ))}
        </div>
        <Input
          type="time"
          value={intent.arriveBy}
          onChange={(event) => setIntent({ arriveBy: event.target.value })}
          aria-label={
            intent.timeMode === 'arrive' ? 'Arrive by time' : 'Leave at time'
          }
        />
      </div>

      <fieldset className="mt-6 border-0 p-0">
        <legend className="text-base font-medium text-paper">
          What matters most
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {preferences.map((item) => {
            const Icon = item.icon
            return (
              <Chip
                key={item.id}
                selected={intent.preference === item.id}
                onClick={() => setIntent({ preference: item.id })}
                className="inline-flex items-center gap-2"
              >
                <Icon size={16} aria-hidden />
                {item.label}
              </Chip>
            )
          })}
        </div>
        <p className="mt-2 text-sm text-muted" aria-live="polite">
          {hint}
        </p>
      </fieldset>

      <TravelNeeds />

      <Button
        size="lg"
        className="mt-6 h-14 w-full text-base"
        disabled={busy || !intent.destinationId}
        onClick={() => void plan()}
      >
        {busy ? 'Working out your options…' : 'Plan my journey'}
      </Button>
      <p className="mt-2 text-center text-sm text-muted">
        {destination
          ? `${origin.shortName} to ${destination.shortName}`
          : 'Choose where you are going first'}
      </p>

      <PlacePicker
        open={picking === 'origin'}
        onOpenChange={(open) => setPicking(open ? 'origin' : null)}
        title="Where are you starting?"
        selectedId={intent.originId}
        excludeId={intent.destinationId}
        onSelect={(id) => setIntent({ originId: id })}
      />
      <PlacePicker
        open={picking === 'destination'}
        onOpenChange={(open) => setPicking(open ? 'destination' : null)}
        title="Where do you need to go?"
        selectedId={intent.destinationId}
        excludeId={intent.originId}
        onSelect={(id) => setIntent({ destinationId: id })}
      />
    </div>
  )
}

function TripRow({
  label,
  value,
  muted,
  onClick,
}: {
  label: string
  value: string
  muted?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors hover:bg-surface"
    >
      <span className="w-12 shrink-0 text-sm font-medium text-dim">
        {label}
      </span>
      <span
        className={cn(
          'min-w-0 flex-1 truncate text-base font-medium',
          muted ? 'text-dim' : 'text-paper',
        )}
      >
        {value}
      </span>
      <ChevronDown size={18} className="shrink-0 text-muted" aria-hidden />
    </button>
  )
}
