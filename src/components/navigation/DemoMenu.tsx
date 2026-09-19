import { CloudRain, HeartPulse, Sparkles, Sun } from 'lucide-react'
import { useState } from 'react'
import { Sheet } from '@/components/ui/sheet'
import { useSynqStore } from '@/store/useSynqStore'
import type { DemoScenario } from '@/types'

const scenarios: { id: DemoScenario; label: string; icon: typeof Sun }[] = [
  { id: 'normal', label: 'Clear morning', icon: Sun },
  { id: 'rain', label: 'Heavy rain', icon: CloudRain },
  { id: 'emergency', label: 'Emergency', icon: HeartPulse },
]

export function DemoMenu() {
  const [open, setOpen] = useState(false)
  const scenario = useSynqStore((s) => s.scenario)
  const setScenario = useSynqStore((s) => s.setScenario)
  const calmMode = useSynqStore((s) => s.calmMode)
  const setCalmMode = useSynqStore((s) => s.setCalmMode)

  return (
    <>
      <button
        type="button"
        className="pointer-events-auto glass flex h-11 items-center gap-2 rounded-full px-4 text-sm text-muted"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
      >
        <Sparkles size={16} />
        Demo
      </button>
      <Sheet open={open} onOpenChange={setOpen} title="Demo controls">
        <p className="mb-4 text-sm text-muted">
          Judges can run the story without waiting for live data.
        </p>
        <div className="grid gap-2">
          {scenarios.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setScenario(item.id)}
                className={`flex h-12 items-center gap-3 rounded-md border px-3 text-left text-sm ${
                  scenario === item.id
                    ? 'border-accent bg-accent-dim text-accent'
                    : 'border-hairline text-paper'
                }`}
              >
                <Icon size={16} />
                {item.label}
              </button>
            )
          })}
        </div>
        <label className="mt-5 flex min-h-11 items-center justify-between gap-3 text-sm">
          <span>Calm mode · larger type, no 3D</span>
          <input
            type="checkbox"
            checked={calmMode}
            onChange={(event) => setCalmMode(event.target.checked)}
            className="size-5 accent-accent"
          />
        </label>
      </Sheet>
    </>
  )
}
