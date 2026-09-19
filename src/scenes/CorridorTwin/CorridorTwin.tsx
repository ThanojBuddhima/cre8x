import { OrbitControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useLayoutEffect, useMemo, useRef } from 'react'
import {
  Color,
  DoubleSide,
  InstancedMesh,
  Object3D,
  type Group,
  type Mesh,
} from 'three'
import { useSynqStore } from '@/store/useSynqStore'
import type { Journey, TransportMode } from '@/types'

const HUB_Z: Record<string, number> = {
  fort: 0,
  bambalapitiya: 36,
  ratmalana: 72,
  kdu: 98,
}

interface CorridorTwinProps {
  variant: 'ambient' | 'live' | 'intro'
  journey?: Journey
  progress: number
  frozen: boolean
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function modeOffset(mode: TransportMode) {
  if (mode === 'rail') return { x: 0, y: 6.4 }
  if (mode === 'air') return { x: -5, y: 18 }
  if (mode === 'pod') return { x: -8, y: 0.55 }
  return { x: 2.4, y: 0.6 }
}

function userPosition(journey: Journey | undefined, progress: number) {
  if (!journey) return { x: 2, y: 0.8, z: 8 }
  const total = journey.legs.reduce((sum, leg) => sum + leg.durationMin, 0)
  let remain = progress * total
  for (const leg of journey.legs) {
    const t = Math.min(1, remain / leg.durationMin)
    if (remain <= leg.durationMin) {
      const offset = modeOffset(leg.mode)
      return {
        x: offset.x,
        y: offset.y,
        z: lerp(HUB_Z[leg.fromId] ?? 0, HUB_Z[leg.toId] ?? 98, t),
      }
    }
    remain -= leg.durationMin
  }
  return { x: 4, y: 0.8, z: 98 }
}

export function CorridorTwin({
  variant,
  journey,
  progress,
  frozen,
}: CorridorTwinProps) {
  const quality = useSynqStore((s) => s.quality)
  const layers = useSynqStore((s) => s.layers)
  const scenario = useSynqStore((s) => s.scenario)
  const introProgress = useSynqStore((s) => s.introProgress)
  const setInspector = useSynqStore((s) => s.setInspector)
  const buildingCount = quality === 'HIGH' ? 42 : quality === 'MEDIUM' ? 22 : 10
  const user = userPosition(journey, progress)

  return (
    <>
      <hemisphereLight args={['#c5dce8', '#1c1812', 0.95]} />
      <directionalLight position={[-20, 28, 10]} intensity={1.35} color="#e7eef3" />
      <ambientLight intensity={0.32} />

      <CameraRig
        variant={variant}
        introProgress={introProgress}
        target={user}
        frozen={frozen}
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 48]}>
        <planeGeometry args={[90, 140]} />
        <meshStandardMaterial color="#0b1218" />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-24, -0.2, 48]}>
        <planeGeometry args={[28, 140]} />
        <meshStandardMaterial color="#0a1824" />
      </mesh>

      {layers.ground ? (
        <>
          <Road />
          <Pods frozen={frozen} count={quality === 'LOW' ? 2 : 5} />
        </>
      ) : null}

      {layers.rail ? (
        <>
          <RailLine />
          <Train frozen={frozen} />
        </>
      ) : null}

      {layers.air ? (
        <>
          <AirCorridors />
          <AirTraffic frozen={frozen} count={quality === 'LOW' ? 1 : 3} />
        </>
      ) : null}

      {layers.risk && scenario !== 'normal' ? <RiskOverlay /> : null}

      <Buildings count={buildingCount} />
      <Hubs
        onSelect={(title, lines) =>
          setInspector({ kind: 'corridor', title, lines })
        }
      />
      <UserMarker position={user} />

      <mesh
        position={[-8, 0.4, 18]}
        onClick={(event) => {
          event.stopPropagation()
          setInspector({
            kind: 'corridor',
            title: 'Coastal Road 04',
            lines: [
              scenario === 'normal'
                ? 'Normal operation'
                : 'Flood risk — rerouting',
              `Congestion: ${scenario === 'normal' ? 'Low' : 'Closed'}`,
              'Energy efficiency: 88%',
            ],
          })
        }}
      >
        <boxGeometry args={[3.2, 0.2, 12]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </>
  )
}

function CameraRig({
  variant,
  introProgress,
  target,
  frozen,
}: {
  variant: CorridorTwinProps['variant']
  introProgress: number
  target: { x: number; y: number; z: number }
  frozen: boolean
}) {
  useFrame(({ camera }) => {
    if (frozen) return
    if (variant === 'intro') {
      const p = introProgress
      const street = 1 - Math.abs(p - 0.3) * 2
      const height = lerp(28, 8, Math.max(0, Math.min(1, street)))
      const air = Math.max(0, (p - 0.55) * 2.4)
      camera.position.set(
        lerp(38, 18, p) + air * 4,
        lerp(height, 26, Math.min(1, air)),
        lerp(-28, 40, p),
      )
      camera.lookAt(0, lerp(2, 10, air), lerp(10, 70, p))
    }
  })

  if (variant === 'intro') return null

  return (
    <OrbitControls
      enablePan={false}
      minDistance={18}
      maxDistance={80}
      maxPolarAngle={Math.PI / 2.15}
      minPolarAngle={Math.PI / 5}
      autoRotate={variant === 'ambient'}
      autoRotateSpeed={0.35}
      enableDamping
      target={
        variant === 'live'
          ? [target.x, target.y, target.z]
          : [0, 4, 40]
      }
    />
  )
}

function Road() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-8, 0.03, 48]}>
      <planeGeometry args={[5.2, 108]} />
      <meshStandardMaterial color="#141c24" />
    </mesh>
  )
}

function RailLine() {
  return (
    <mesh position={[0, 6, 46]}>
      <boxGeometry args={[0.35, 0.12, 100]} />
      <meshStandardMaterial
        color="#3ee0c4"
        emissive="#3ee0c4"
        emissiveIntensity={0.25}
      />
    </mesh>
  )
}

function AirCorridors() {
  return (
    <group>
      <mesh position={[-5, 18, 44]}>
        <boxGeometry args={[0.12, 0.12, 78]} />
        <meshBasicMaterial color="#3ee0c4" transparent opacity={0.35} />
      </mesh>
      <mesh position={[-9, 20, 40]}>
        <boxGeometry args={[0.08, 0.08, 64]} />
        <meshBasicMaterial color="#8ad7ee" transparent opacity={0.22} />
      </mesh>
    </group>
  )
}

function RiskOverlay() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-8, 0.12, 18]}>
      <planeGeometry args={[6, 22]} />
      <meshStandardMaterial
        color="#e8b86d"
        transparent
        opacity={0.32}
        side={DoubleSide}
      />
    </mesh>
  )
}

function Buildings({ count }: { count: number }) {
  const mesh = useRef<InstancedMesh>(null)
  const dummy = useMemo(() => new Object3D(), [])

  useLayoutEffect(() => {
    if (!mesh.current) return
    for (let i = 0; i < count; i += 1) {
      const height = 2.2 + (i % 7) * 1.15
      dummy.position.set(
        7 + (i % 4) * 3.4,
        height / 2,
        (i * 2.7) % 104,
      )
      dummy.scale.set(1.8, height, 1.8)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    }
    mesh.current.instanceMatrix.needsUpdate = true
  }, [count, dummy])

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <boxGeometry />
      <meshStandardMaterial color="#1b2733" roughness={0.86} metalness={0.08} />
    </instancedMesh>
  )
}

function Hubs({
  onSelect,
}: {
  onSelect: (title: string, lines: string[]) => void
}) {
  const items = [
    { name: 'Colombo Fort Hub', z: 0 },
    { name: 'Bambalapitiya Interchange', z: 36 },
    { name: 'Ratmalana Vertiport', z: 72 },
    { name: 'KDU Campus', z: 98 },
  ]

  return (
    <group>
      {items.map((hub) => (
        <mesh
          key={hub.name}
          position={[2.2, 1.4, hub.z]}
          onClick={(event) => {
            event.stopPropagation()
            onSelect(hub.name, ['Active hub', 'Transfers: level and stair', 'Status: Open'])
          }}
        >
          <cylinderGeometry args={[1.1, 1.3, 2.8, 8]} />
          <meshStandardMaterial color="#243240" />
        </mesh>
      ))}
    </group>
  )
}

function Pods({ frozen, count }: { frozen: boolean; count: number }) {
  const group = useRef<Group>(null)
  const setInspector = useSynqStore((s) => s.setInspector)

  useFrame((_, delta) => {
    if (frozen || !group.current) return
    group.current.children.forEach((child, index) => {
      child.position.z = ((child.position.z + delta * (6 + index)) % 100)
    })
  })

  return (
    <group ref={group}>
      {Array.from({ length: count }).map((_, index) => (
        <mesh
          key={index}
          position={[-8, 0.55, index * 18]}
          onClick={(event) => {
            event.stopPropagation()
            setInspector({
              kind: 'vehicle',
              title: `Pod A-${12 + index}`,
              lines: [
                'Autonomous',
                'Status: Active',
                'Destination: KDU corridor',
                `Capacity: ${40 + index * 6}%`,
              ],
            })
          }}
        >
          <boxGeometry args={[1.2, 0.55, 2.1]} />
          <meshStandardMaterial color="#4a5b66" />
        </mesh>
      ))}
    </group>
  )
}

function Train({ frozen }: { frozen: boolean }) {
  const ref = useRef<Mesh>(null)
  const setInspector = useSynqStore((s) => s.setInspector)
  useFrame((_, delta) => {
    if (frozen || !ref.current) return
    ref.current.position.z = (ref.current.position.z + delta * 10) % 100
  })
  return (
    <mesh
      ref={ref}
      position={[0, 6.55, 8]}
      onClick={(event) => {
        event.stopPropagation()
        setInspector({
          kind: 'vehicle',
          title: 'Rail 07',
          lines: [
            'Autonomous',
            'Status: Active',
            'Destination: Ratmalana',
            'ETA: 08:16',
            'Capacity: 64%',
          ],
        })
      }}
    >
      <boxGeometry args={[1.1, 0.8, 7]} />
      <meshStandardMaterial
        color="#2f4a4a"
        emissive={new Color('#3ee0c4')}
        emissiveIntensity={0.12}
      />
    </mesh>
  )
}

function AirTraffic({ frozen, count }: { frozen: boolean; count: number }) {
  const group = useRef<Group>(null)
  const setInspector = useSynqStore((s) => s.setInspector)
  useFrame((_, delta) => {
    if (frozen || !group.current) return
    group.current.children.forEach((child, index) => {
      child.position.z = (child.position.z + delta * (8 + index * 2)) % 90
    })
  })
  return (
    <group ref={group}>
      {Array.from({ length: count }).map((_, index) => (
        <mesh
          key={index}
          position={[-5 - index, 18 + index * 0.6, index * 22]}
          onClick={(event) => {
            event.stopPropagation()
            setInspector({
              kind: 'vehicle',
              title: `Air Shuttle C${index + 1}`,
              lines: [
                'Autonomous',
                'Status: Active',
                'Destination: KDU',
                `Capacity: ${60 + index * 5}%`,
              ],
            })
          }}
        >
          <boxGeometry args={[1.6, 0.28, 2.4]} />
          <meshStandardMaterial color="#c9d6de" metalness={0.4} roughness={0.3} />
        </mesh>
      ))}
    </group>
  )
}

function UserMarker({
  position,
}: {
  position: { x: number; y: number; z: number }
}) {
  return (
    <group position={[position.x, position.y, position.z]}>
      <mesh>
        <sphereGeometry args={[0.55, 16, 16]} />
        <meshStandardMaterial
          color="#3ee0c4"
          emissive="#3ee0c4"
          emissiveIntensity={0.4}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, 0]}>
        <ringGeometry args={[0.7, 0.9, 24]} />
        <meshBasicMaterial color="#3ee0c4" transparent opacity={0.5} />
      </mesh>
    </group>
  )
}
