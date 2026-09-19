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
        className="glass flex min-h-11 items-center gap-2 rounded-full px-4 text-left text-sm"
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
