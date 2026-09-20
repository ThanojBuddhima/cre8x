import { Canvas } from '@react-three/fiber'
import { CorridorTwin } from '@/scenes/CorridorTwin/city' // mode-colored routes + slate city
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
  const theme = useSynqStore((s) => s.theme)
  const frozen = calmMode
  const dark = theme !== 'light'
  const sky = dark ? '#2A2E35' : '#E0E5EC'

  return (
    <div className="absolute inset-0 h-full w-full">
      <Canvas
        dpr={quality === 'HIGH' ? [1, 1.5] : 1}
        gl={{
          antialias: quality === 'HIGH',
          powerPreference: 'high-performance',
          alpha: false,
        }}
        camera={{ position: [32, 24, -22], fov: 42, near: 0.1, far: 240 }}
        frameloop={frozen ? 'demand' : 'always'}
      >
        <color attach="background" args={[sky]} />
        <fog attach="fog" args={[sky, dark ? 70 : 50, dark ? 150 : 150]} />
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
