import { useSynqStore } from '@/store/useSynqStore'
import type { LayerId } from '@/types'

const labels: { id: LayerId; label: string }[] = [
  { id: 'ground', label: 'Ground' },
  { id: 'rail', label: 'Rail' },
  { id: 'air', label: 'Air' },
  { id: 'risk', label: 'Risk' },
]

export function LayerToggles() {
  const layers = useSynqStore((s) => s.layers)
  const toggleLayer = useSynqStore((s) => s.toggleLayer)

  return (
    <div
      className="pointer-events-auto glass flex flex-wrap gap-1 rounded-full p-1"
      role="group"
      aria-label="Transportation layers"
    >
      {labels.map((layer) => (
        <button
          key={layer.id}
          type="button"
          onClick={() => toggleLayer(layer.id)}
          className={`h-10 rounded-full px-3 text-xs ${
            layers[layer.id]
              ? 'bg-accent-dim text-accent'
              : 'text-dim hover:text-paper'
          }`}
          aria-pressed={layers[layer.id]}
        >
          {layer.label}
        </button>
      ))}
    </div>
  )
}
