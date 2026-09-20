import { Component, type ReactNode } from 'react'
import { FallbackSchematic } from '@/components/3d/FallbackSchematic'
import { LeafletMap } from '@/components/city/LeafletMap'
import { useSynqStore } from '@/store/useSynqStore'
import type { Journey } from '@/types'

/**
 * Tiles come from the network, so a judge on a bad connection could otherwise
 * be shown an empty grey box. Any failure drops to the schematic instead.
 */
class MapGuard extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

export function LiveMapGate({
  journey,
  progress = 0,
}: {
  journey: Journey
  progress?: number
}) {
  const calmMode = useSynqStore((s) => s.calmMode)
  const quality = useSynqStore((s) => s.quality)
  const schematic = <FallbackSchematic journey={journey} progress={progress} />

  // Calm mode is an explicit request for the simpler, text-first map.
  if (calmMode || quality === 'FALLBACK') return schematic

  return (
    <MapGuard fallback={schematic}>
      <LeafletMap journey={journey} progress={progress} />
    </MapGuard>
  )
}
