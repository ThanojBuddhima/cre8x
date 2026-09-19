import { cityByScenario } from '@/data/scenarios'
import { useSynqStore } from '@/store/useSynqStore'
import { useState } from 'react'

export function CityStatusChip() {
  const scenario = useSynqStore((s) => s.scenario)
  const status = cityByScenario[scenario]
  const [open, setOpen] = useState(false)

  return (
    <div className="pointer-events-auto">
      <button
        type="button"
        className="glass flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-3 text-left text-xs md:px-4 md:text-sm"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <span
          className={`size-2 rounded-full ${
            scenario === 'normal' ? 'bg-accent' : 'bg-warning'
          }`}
        />
        <span className="text-paper">{status.weatherLabel}</span>
        <span className="hidden text-dim sm:inline">· {status.networkHealth}</span>
      </button>
      {open ? (
        <div className="glass mt-2 max-w-xs rounded-lg p-4 text-sm">
          <p className="text-paper">{status.weatherDetail}</p>
          {status.alert ? (
            <p className="mt-2 text-warning">{status.alert}</p>
          ) : (
            <p className="mt-2 text-muted">Network is coordinating normally.</p>
          )}
        </div>
      ) : null}
    </div>
  )
}
