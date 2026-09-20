import { modeColor } from '@/lib/modeColors'
import { useSynqStore } from '@/store/useSynqStore'
import type { LayerId } from '@/types'

const labels: { id: LayerId; label: string }[] = [
  { id: 'ground', label: 'Road' },
  { id: 'rail', label: 'Rail' },
  { id: 'air', label: 'Air' },
  { id: 'risk', label: 'Risk' },
]

export function LayerToggles() {
  const layers = useSynqStore((s) => s.layers)
  const toggleLayer = useSynqStore((s) => s.toggleLayer)
  const theme = useSynqStore((s) => s.theme)

  function layerColor(id: LayerId) {
    if (id === 'ground') return modeColor('pod', theme)
    if (id === 'rail') return modeColor('rail', theme)
    if (id === 'air') return modeColor('air', theme)
    return theme === 'light' ? '#b7791f' : '#e8b86d'
  }

  return (
    <div
      className="pointer-events-auto neu-raised flex max-w-full flex-wrap gap-1 rounded-full p-1"
      role="group"
      aria-label="Transportation layers"
    >
      {labels.map((layer) => {
        const color = layerColor(layer.id)
        const on = layers[layer.id]
        return (
          <button
            key={layer.id}
            type="button"
            onClick={() => toggleLayer(layer.id)}
            className={`h-11 rounded-full px-3 text-xs font-bold transition-[box-shadow,color] duration-[var(--dur-ui)] ease-[var(--ease-out)] ${
              on ? 'shadow-[var(--neu-in-1)]' : 'text-muted hoverable:text-ink'
            }`}
            style={on ? { color } : undefined}
            aria-pressed={on}
          >
            {layer.label}
          </button>
        )
      })}
    </div>
  )
}
