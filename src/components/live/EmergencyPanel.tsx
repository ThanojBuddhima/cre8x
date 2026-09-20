import { Check, TriangleAlert } from 'lucide-react'
import { AiBadge } from '@/components/ui/ai-badge'
import { corridors, vehicles } from '@/data/vehicles'
import { modeColor, modeShortLabel } from '@/lib/modeColors'
import { useSynqStore } from '@/store/useSynqStore'

/**
 * The city-scale view of a disruption. The traveller's own reroute is handled
 * by AlertBanner; this answers the larger question of what the network did for
 * everyone else, which is what makes SYNQ read as infrastructure.
 */
export function EmergencyPanel() {
  const scenario = useSynqStore((s) => s.scenario)
  const theme = useSynqStore((s) => s.theme)

  if (scenario !== 'emergency') return null

  // Mock figures: the prototype has no fleet backend.
  const passengers = 2431
  const affected = vehicles.length * 14

  const actions = [
    `Rerouted ${passengers.toLocaleString()} passengers`,
    'Opened an emergency mobility corridor',
    'Gave hospital traffic priority on every layer',
  ]

  return (
    <section
      className="neu-raised rounded-2xl p-5"
      role="status"
      aria-live="polite"
      aria-label="City emergency response"
    >
      <div className="flex flex-wrap items-center gap-2">
        <p className="inline-flex items-center gap-1.5 text-sm font-medium text-warning-ink">
          <TriangleAlert size={15} aria-hidden />
          City emergency
        </p>
        <AiBadge label="Network response" />
      </div>

      <p className="mt-2 text-sm text-ink">
        Flooding in Sector 04. {affected} vehicles affected.
      </p>

      <ul className="mt-3 grid gap-1.5">
        {actions.map((action) => (
          <li key={action} className="flex items-start gap-2 text-sm text-muted">
            <Check
              size={15}
              aria-hidden
              className="mt-0.5 shrink-0 text-accent-ink"
            />
            {action}
          </li>
        ))}
      </ul>

      <dl className="mt-4 grid gap-2">
        {corridors.map((corridor) => (
          <div
            key={corridor.id}
            className="neu-sunken-sm flex items-center justify-between gap-3 rounded-lg px-3 py-2"
          >
            <dt className="min-w-0 flex-1 truncate text-sm text-ink">
              {corridor.name}
            </dt>
            <dd className="shrink-0 text-xs text-muted">
              {corridor.congestion} load · {corridor.energy}
            </dd>
          </div>
        ))}
      </dl>

      <ul className="mt-3 flex flex-wrap gap-2">
        {vehicles.map((vehicle) => (
          <li
            key={vehicle.id}
            className="neu-sunken-sm rounded-full px-2.5 py-1 text-xs font-bold"
            style={{ color: modeColor(vehicle.mode, theme) }}
          >
            {modeShortLabel(vehicle.mode)} · {vehicle.name} · {vehicle.status}
          </li>
        ))}
      </ul>
    </section>
  )
}
