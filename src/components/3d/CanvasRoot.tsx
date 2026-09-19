import { Canvas } from '@react-three/fiber'
import { CorridorTwin } from '@/scenes/CorridorTwin/CorridorTwin'
import { useSynqStore } from '@/store/useSynqStore'
import type { Journey } from '@/types'

interface CanvasRootProps {
  variant: 'ambient' | 'live' | 'intro'
  journey?: Journey
  progress?: number
}

export default function CanvasRoot({
  variant,
  journey,
  progress = 0,
}: CanvasRootProps) {
  const quality = useSynqStore((s) => s.quality)
  const calmMode = useSynqStore((s) => s.calmMode)
  const frozen = calmMode

  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Canvas
        dpr={quality === 'HIGH' ? [1, 1.5] : 1}
        gl={{
          antialias: quality === 'HIGH',
          powerPreference: 'high-performance',
          alpha: true,
        }}
        camera={{ position: [32, 24, -22], fov: 42, near: 0.1, far: 240 }}
        frameloop={frozen ? 'demand' : 'always'}
      >
        <color attach="background" args={['#070b10']} />
        <fog attach="fog" args={['#070b10', 40, 140]} />
        <CorridorTwin
          variant={variant}
          journey={journey}
          progress={progress}
          frozen={frozen}
        />
      </Canvas>
    </div>
  )
}
