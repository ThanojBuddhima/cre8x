import { X } from 'lucide-react'
import { useSynqStore } from '@/store/useSynqStore'

export function Inspector() {
  const inspector = useSynqStore((s) => s.inspector)
  const setInspector = useSynqStore((s) => s.setInspector)

  if (!inspector) return null

  return (
    <div className="pointer-events-auto glass max-w-xs rounded-lg p-4">
      <div className="mb-2 flex items-start justify-between gap-3">
        <p className="text-sm font-medium">{inspector.title}</p>
        <button
          type="button"
          className="grid size-10 place-items-center text-muted"
          onClick={() => setInspector(null)}
          aria-label="Close details"
        >
          <X size={16} />
        </button>
      </div>
      <ul className="space-y-1 text-sm text-muted">
        {inspector.lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </div>
  )
}
