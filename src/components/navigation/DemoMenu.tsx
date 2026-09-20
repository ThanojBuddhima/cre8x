import { CloudRain, HeartPulse, RotateCcw, Sparkles, Sun } from 'lucide-react'
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
  const resetLive = useSynqStore((s) => s.resetLive)

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
                onClick={() => {
                  setScenario(item.id)
                  resetLive()
                  setOpen(false)
                }}
                className={`pointer-events-auto flex h-12 items-center gap-3 rounded-md border px-3 text-left text-sm ${
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
        <button
          type="button"
          onClick={() => {
            resetLive()
            setOpen(false)
          }}
          className="pointer-events-auto mt-2 flex h-12 w-full items-center gap-3 rounded-md border border-hairline px-3 text-left text-sm text-paper"
        >
          <RotateCcw size={16} aria-hidden />
          Replay journey from the start
        </button>
      </Sheet>
    </>
  )
}
