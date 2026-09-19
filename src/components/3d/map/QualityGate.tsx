import { Component, type ReactNode, Suspense, lazy } from 'react'
import { FallbackSchematic } from '@/components/3d/FallbackSchematic'
import { useSynqStore } from '@/store/useSynqStore'
import type { Journey } from '@/types'

const CanvasRoot = lazy(() => import('@/components/3d/CanvasRoot/canvas'))

interface QualityGateProps {
  variant: 'ambient' | 'live' | 'intro'
  journey?: Journey
  progress?: number
}

class WebGLGuard extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    if (this.state.failed) return this.props.fallback
    return this.props.children
  }
}

export function QualityGate({ variant, journey, progress = 0 }: QualityGateProps) {
  const quality = useSynqStore((s) => s.quality)
  const calmMode = useSynqStore((s) => s.calmMode)
  const fallback = <FallbackSchematic journey={journey} progress={progress} />

  const isSimple = calmMode || quality === 'FALLBACK'

  return (
    <div className="relative h-full w-full">
      <div 
        className={`absolute inset-0 transition-opacity duration-500 ${isSimple ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <WebGLGuard fallback={fallback}>
          <Suspense fallback={fallback}>
            <CanvasRoot variant={variant} journey={journey} progress={progress} />
          </Suspense>
        </WebGLGuard>
      </div>
      <div 
        className={`absolute inset-0 transition-opacity duration-500 ${isSimple ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <FallbackSchematic journey={journey} progress={progress} />
      </div>
    </div>
  )
}
