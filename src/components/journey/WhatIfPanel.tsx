import { useMemo, useState } from 'react'
import { CloudRain, HeartPulse } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AiBadge } from '@/components/ui/ai-badge'
import { Chip } from '@/components/ui/chip'
import { liveArrival, toMinutes } from '@/lib/time'
import { planJourneys } from '@/services/mobilityIntelligence'
import { useSynqStore } from '@/store/useSynqStore'
import type { DemoScenario, Journey } from '@/types'

const conditions: { id: DemoScenario; label: string; icon: LucideIcon }[] = [
  { id: 'rain', label: 'Heavy rain', icon: CloudRain },
  { id: 'emergency', label: 'City emergency', icon: HeartPulse },
]

/**
 * Lets the traveller ask what the network would do *before* it happens.
 * The counterfactual is computed with the same planner but a different
 * scenario, and deliberately does not touch store state until Apply.
 */
export function WhatIfPanel({ journey }: { journey: Journey }) {
  const intent = useSynqStore((s) => s.intent)
  const profile = useSynqStore((s) => s.profile)
  const calmMode = useSynqStore((s) => s.calmMode)
  const setResults = useSynqStore((s) => s.setResults)
  const setScenario = useSynqStore((s) => s.setScenario)
  const selectJourney = useSynqStore((s) => s.selectJourney)
  const resetLive = useSynqStore((s) => s.resetLive)
  const [sim, setSim] = useState<DemoScenario | null>(null)

  const simulated = useMemo(() => {
    if (!sim) return null
    return (
      planJourneys({
        originId: intent.originId,
        destinationId: intent.destinationId,
        arriveBy: intent.arriveBy,
        preference: intent.preference,
        accessibility: profile,
        scenario: sim,
        calmMode,
      })[0] ?? null
    )
  }, [sim, intent, profile, calmMode])

  const now = liveArrival(journey)
  const then = simulated ? liveArrival(simulated) : null
  const deltaMin = then ? toMinutes(then.arriveAt) - toMinutes(now.arriveAt) : 0
  const changesRoute = simulated ? simulated.id !== journey.id : false

  function apply() {
    if (!sim || !simulated) return
    setScenario(sim)
    setResults(
      planJourneys({
        originId: intent.originId,
        destinationId: intent.destinationId,
        arriveBy: intent.arriveBy,
        preference: intent.preference,
        accessibility: profile,
        scenario: sim,
        calmMode,
      }),
    )
    selectJourney(simulated.id)
    resetLive()
    setSim(null)
  }

  return (
    <section aria-labelledby="what-if">
      <div className="flex flex-wrap items-center gap-2">
        <h2 id="what-if" className="text-xs tracking-[0.16em] text-dim">
          WHAT IF?
        </h2>
        <AiBadge label="Predictive" />
      </div>
      <p className="mt-3 text-sm text-muted">
        See how this trip would change before the weather does.
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {conditions.map((item) => {
          const Icon = item.icon
          return (
            <Chip
              key={item.id}
              selected={sim === item.id}
              onClick={() => setSim(sim === item.id ? null : item.id)}
              className="inline-flex items-center gap-2"
            >
              <Icon size={16} aria-hidden />
              {item.label}
            </Chip>
          )
        })}
      </div>

      {simulated && then ? (
        <div
          className="glass mt-4 rounded-xl p-4"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-baseline justify-between gap-3">
            <div>
              <p className="text-xs tracking-[0.14em] text-dim">NOW</p>
              <p className="mt-1 text-2xl font-medium text-paper">
                {now.arriveAt}
              </p>
            </div>
            <span className="text-muted" aria-hidden>
              →
            </span>
            <div className="text-right">
              <p className="text-xs tracking-[0.14em] text-dim">SIMULATED</p>
              <p className="mt-1 text-2xl font-medium text-accent">
                {then.arriveAt}
              </p>
            </div>
          </div>

          <p className="mt-3 text-sm text-paper">
            {changesRoute
              ? `I would move you to the ${simulated.tag.toLowerCase()} route.`
              : 'I would keep you on this route.'}{' '}
            {deltaMin === 0
              ? 'You would still arrive at the same time.'
              : deltaMin > 0
                ? `You would arrive ${deltaMin} min later.`
                : `You would arrive ${Math.abs(deltaMin)} min earlier.`}
          </p>
          <p className="mt-1 text-sm text-muted">
            Confidence would be {simulated.confidencePct}%.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" onClick={apply}>
              Apply this plan
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setSim(null)}>
              Keep my current plan
            </Button>
          </div>
        </div>
      ) : null}
    </section>
  )
}
