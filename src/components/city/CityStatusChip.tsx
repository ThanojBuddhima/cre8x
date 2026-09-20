import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cityByScenario } from '@/data/scenarios'
import { cn } from '@/lib/cn'
import { useSynqStore } from '@/store/useSynqStore'
import type { CityMetric } from '@/types'

/** Load and risk read badly when high; energy reserve reads badly when low. */
function tone(metric: CityMetric) {
  const bad = metric.higherIsBetter ? metric.value < 50 : metric.value >= 60
  const watch = metric.higherIsBetter
    ? metric.value < 75
    : metric.value >= 35 && metric.value < 60
  if (bad) return { color: 'var(--color-danger)', word: 'high' }
  if (watch) return { color: 'var(--color-warning)', word: 'moderate' }
  return { color: 'var(--color-accent)', word: 'normal' }
}

export function CityStatusChip() {
  const scenario = useSynqStore((s) => s.scenario)
  const status = cityByScenario[scenario]
  const [open, setOpen] = useState(false)

  return (
    <section className="mt-8" aria-labelledby="city-pulse">
      <h2
        id="city-pulse"
        className="text-xs font-medium tracking-[0.16em] text-muted"
      >
        CITY PULSE
      </h2>

      <div className="glass-card mt-4 rounded-3xl">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="flex w-full items-center gap-4 px-5 py-4 text-left"
        >
          <span
            className="relative flex size-3 shrink-0 items-center justify-center"
            aria-hidden
          >
            <span
              className="absolute inset-0 rounded-full animate-ping opacity-75"
              style={{
                background:
                  scenario === 'normal'
                    ? 'var(--color-accent)'
                    : 'var(--color-warning)',
              }}
            />
            <span
              className="relative inline-flex size-2 rounded-full"
              style={{
                background:
                  scenario === 'normal'
                    ? 'var(--color-accent)'
                    : 'var(--color-warning)',
              }}
            />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[15px] font-bold text-ink tracking-wide">
              {status.weatherLabel}
            </span>
            <span className="block truncate text-xs font-medium text-muted mt-0.5 tracking-[0.1em] uppercase">
              Network {status.networkHealth.toLowerCase()}
            </span>
          </span>
          <ChevronDown
            size={18}
            aria-hidden
            className={cn(
              'shrink-0 text-muted transition-transform duration-[var(--dur-ui)]',
              open && 'rotate-180',
            )}
          />
        </button>

        {open ? (
          <div className="px-4 py-3">
            <p className="text-sm text-ink">{status.weatherDetail}</p>
            {status.alert ? (
              <p className="mt-1 text-sm text-warning-ink">{status.alert}</p>
            ) : null}

            <dl className="mt-4 grid gap-3">
              {status.metrics.map((metric) => {
                const t = tone(metric)
                return (
                  <div key={metric.id}>
                    <div className="flex items-baseline justify-between gap-2">
                      <dt className="text-sm text-muted">{metric.label}</dt>
                      <dd className="text-sm font-medium text-ink">
                        {metric.value}%
                        <span className="ml-1.5 text-xs text-muted">{t.word}</span>
                      </dd>
                    </div>
                    <div
                      className="mt-1.5 h-1.5 overflow-hidden rounded-full neu-sunken-sm"
                      role="img"
                      aria-label={`${metric.label} ${metric.value} percent, ${t.word}`}
                    >
                      <span
                        className="block h-full rounded-full transition-[width] duration-[var(--dur-ui)]"
                        style={{ width: `${metric.value}%`, background: t.color }}
                      />
                    </div>
                  </div>
                )
              })}
            </dl>
          </div>
        ) : null}
      </div>
    </section>
  )
}
