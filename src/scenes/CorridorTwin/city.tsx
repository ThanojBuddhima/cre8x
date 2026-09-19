import { Html, Line, OrbitControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import {
  DoubleSide,
  InstancedMesh,
  Object3D,
  TOUCH,
  Vector3,
  type Group,
  type Mesh,
} from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { currentLeg, currentLegIndex } from '@/lib/journeyProgress'
import { hopLabel, modeColor, transferColor } from '@/lib/modeColors'
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

export function userPosition(journey: Journey | undefined, progress: number) {
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

function useMapPalette() {
  const theme = useSynqStore((s) => s.theme)
  if (theme === 'light') {
    return {
      ground: '#d5dde3',
      water: '#b9d0dc',
      road: '#c5ced6',
      building: '#8b9aa8',
      hub: '#6d7c8a',
      rail: modeColor('rail', 'light'),
      air: modeColor('air', 'light'),
      you: modeColor('walk', 'light'),
      hemiSky: '#f4f7fa',
      hemiGround: '#c9b8a4',
      pod: modeColor('pod', 'light'),
      hemiIntensity: 0.95,
      ambient: 0.38,
      dirIntensity: 1.35,
      fillIntensity: 0,
      buildingEmissive: 0,
      buildingRoughness: 0.86,
    }
  }
  return {
    ground: '#1a2430',
    water: '#173044',
    road: '#2c3a48',
    building: '#5c7388',
    hub: '#6a8196',
    rail: modeColor('rail', 'dark'),
    air: modeColor('air', 'dark'),
    you: modeColor('walk', 'dark'),
    hemiSky: '#9eb6c4',
    hemiGround: '#1a242c',
    pod: modeColor('pod', 'dark'),
    hemiIntensity: 0.88,
    ambient: 0.55,
    dirIntensity: 1.1,
    fillIntensity: 0.28,
    buildingEmissive: 0.12,
    buildingRoughness: 0.86,
  }
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
  const palette = useMapPalette()
  const theme = useSynqStore((s) => s.theme)
  const buildingCount = quality === 'HIGH' ? 42 : quality === 'MEDIUM' ? 22 : 10
  const user = userPosition(journey, progress)
  const youColor = journey
    ? modeColor(currentLeg(journey, progress).mode, theme)
    : palette.you

  return (
    <>
      <hemisphereLight
        args={[palette.hemiSky, palette.hemiGround, palette.hemiIntensity]}
      />
      <directionalLight
        position={[-20, 28, 10]}
        intensity={palette.dirIntensity}
        color="#e7eef3"
      />
      {palette.fillIntensity > 0 ? (
        <directionalLight
          position={[22, 16, -18]}
          intensity={palette.fillIntensity}
          color="#e7eef3"
        />
      ) : null}
      <ambientLight intensity={palette.ambient} />

      <CameraRig
        variant={variant}
        introProgress={introProgress}
        target={user}
        frozen={frozen}
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 48]}>
        <planeGeometry args={[90, 140]} />
        <meshStandardMaterial color={palette.ground} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-24, -0.2, 48]}>
        <planeGeometry args={[28, 140]} />
        <meshStandardMaterial color={palette.water} />
      </mesh>

      {layers.ground ? (
        <>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-8, 0.03, 48]}>
            <planeGeometry args={[5.2, 108]} />
            <meshStandardMaterial color={palette.road} />
          </mesh>
          <Pods frozen={frozen} count={quality === 'LOW' ? 2 : 5} color={palette.pod} />
        </>
      ) : null}

      {layers.rail ? (
        <>
          <mesh position={[0, 6, 46]}>
            <boxGeometry args={[0.35, 0.12, 100]} />
            <meshStandardMaterial
              color={palette.rail}
              emissive={palette.rail}
              emissiveIntensity={0.2}
            />
          </mesh>
          <Train frozen={frozen} color={palette.rail} />
        </>
      ) : null}

      {layers.air ? (
        <>
          <mesh position={[-5, 18, 44]}>
            <boxGeometry args={[0.12, 0.12, 78]} />
            <meshBasicMaterial color={palette.air} transparent opacity={0.45} />
          </mesh>
          <AirTraffic
            frozen={frozen}
            count={quality === 'LOW' ? 1 : 3}
            color={palette.air}
          />
        </>
      ) : null}

      {journey ? (
        <ActiveRoute
          journey={journey}
          progress={progress}
          live={variant === 'live'}
        />
      ) : null}

      {layers.risk && scenario !== 'normal' ? <RiskOverlay /> : null}

      <Buildings
        count={buildingCount}
        color={palette.building}
        emissiveIntensity={palette.buildingEmissive}
        roughness={palette.buildingRoughness}
      />
      <Hubs
        color={palette.hub}
        onSelect={(title, lines) =>
          setInspector({ kind: 'corridor', title, lines })
        }
      />
      <UserMarker position={user} color={youColor} />

      <mesh
        position={[-8, 0.4, 18]}
        onClick={(event) => {
          event.stopPropagation()
          setInspector({
            kind: 'corridor',
            title: 'Coastal Road 04',
            lines: [
              scenario === 'normal'
                ? 'Open now'
                : 'Flood risk — I am moving you',
              `Traffic: ${scenario === 'normal' ? 'Low' : 'Closed'}`,
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
  const controls = useRef<OrbitControlsImpl>(null)
  const followUser = useSynqStore((s) => s.followUser)
  const autoRotate = useSynqStore((s) => s.autoRotate)
  const setAutoRotate = useSynqStore((s) => s.setAutoRotate)
  const setFollowUser = useSynqStore((s) => s.setFollowUser)
  const mapCommand = useSynqStore((s) => s.mapCommand)
  const look = useMemo(
    () => new Vector3(target.x, target.y, target.z),
    [target.x, target.y, target.z],
  )

  useEffect(() => {
    const ctrl = controls.current
    if (!ctrl || !mapCommand) return
    if (mapCommand.type === 'zoom-in') ctrl.dollyIn(1.25)
    if (mapCommand.type === 'zoom-out') ctrl.dollyOut(1.25)
    if (mapCommand.type === 'recenter') {
      ctrl.target.set(target.x, target.y, target.z)
      ctrl.object.position.set(target.x + 18, target.y + 14, target.z - 18)
    }
    ctrl.update()
  }, [mapCommand, target.x, target.y, target.z])

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
      return
    }
    if (variant === 'live' && followUser && controls.current) {
      look.set(target.x, target.y, target.z)
      controls.current.target.lerp(look, 0.08)
    }
  })

  if (variant === 'intro') return null

  return (
    <OrbitControls
      ref={controls}
      enablePan
      enableZoom
      minDistance={12}
      maxDistance={110}
      maxPolarAngle={Math.PI / 2.08}
      minPolarAngle={Math.PI / 6}
      autoRotate={variant === 'ambient' && autoRotate}
      autoRotateSpeed={0.35}
      enableDamping
      screenSpacePanning
      touches={{ ONE: TOUCH.ROTATE, TWO: TOUCH.DOLLY_PAN }}
      target={
        variant === 'live'
          ? [target.x, target.y, target.z]
          : [0, 4, 40]
      }
      onStart={() => {
        setAutoRotate(false)
        if (variant === 'live') setFollowUser(false)
      }}
    />
  )
}

function ActiveRoute({
  journey,
  progress,
  live,
}: {
  journey: Journey
  progress: number
  live: boolean
}) {
  const theme = useSynqStore((s) => s.theme)
  const index = currentLegIndex(journey, progress)

  return (
    <group>
      {journey.legs.map((leg) => {
        const offset = modeOffset(leg.mode)
        const z0 = HUB_Z[leg.fromId] ?? 0
        const z1 = HUB_Z[leg.toId] ?? 98
        if (Math.abs(z1 - z0) < 0.2) return null
        return (
          <Line
            key={leg.id}
            points={[
              [offset.x, offset.y + 0.15, z0],
              [offset.x, offset.y + 0.15, z1],
            ]}
            color={modeColor(leg.mode, theme)}
            lineWidth={4}
            dashed={leg.mode === 'air'}
            dashSize={1.2}
            gapSize={0.8}
          />
        )
      })}
      {journey.legs.map((leg, i) => {
        const next = journey.legs[i + 1]
        if (!next || next.mode === leg.mode) return null
        const from = modeOffset(leg.mode)
        const to = modeOffset(next.mode)
        const z = HUB_Z[leg.toId] ?? 0
        let state: 'done' | 'next' | 'later' = 'done'
        if (live) {
          if (index < i) state = 'later'
          else if (index === i) state = 'next'
        }
        return (
          <TransferHop
            key={`${leg.id}-hop`}
            from={[from.x, from.y + 0.15, z]}
            to={[to.x, to.y + 0.15, z]}
            label={hopLabel(next)}
            state={state}
          />
        )
      })}
    </group>
  )
}

function TransferHop({
  from,
  to,
  label,
  state,
}: {
  from: [number, number, number]
  to: [number, number, number]
  label: string
  state: 'done' | 'next' | 'later'
}) {
  const theme = useSynqStore((s) => s.theme)
  const disc = useRef<Mesh>(null)
  const color = state === 'later' ? (theme === 'light' ? '#9aa8b3' : '#6b7785') : transferColor(theme)
  const opacity = state === 'later' ? 0.35 : state === 'done' ? 0.7 : 1

  useFrame(({ clock }) => {
    if (!disc.current) return
    if (state !== 'next') {
      disc.current.scale.setScalar(1)
      return
    }
    const pulse = 1 + Math.sin(clock.elapsedTime * 4) * 0.22
    disc.current.scale.setScalar(pulse)
  })

  const mid: [number, number, number] = [
    (from[0] + to[0]) / 2,
    (from[1] + to[1]) / 2,
    (from[2] + to[2]) / 2,
  ]

  return (
    <group>
      <Line points={[from, to]} color={color} lineWidth={2} />
      <mesh ref={disc} position={to}>
        <sphereGeometry args={[0.38, 12, 12]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={state === 'next' ? 0.45 : 0.12}
          transparent
          opacity={opacity}
        />
      </mesh>
      <Html
        center
        position={[mid[0], mid[1] + 1.4, mid[2]]}
        distanceFactor={52}
        zIndexRange={[18, 0]}
        pointerEvents="none"
      >
        <div className="map-label" style={{ opacity: state === 'later' ? 0.55 : 1 }}>
          {label}
        </div>
      </Html>
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
        opacity={0.4}
        side={DoubleSide}
      />
    </mesh>
  )
}

function Buildings({
  count,
  color,
  emissiveIntensity,
  roughness,
}: {
  count: number
  color: string
  emissiveIntensity: number
  roughness: number
}) {
  const mesh = useRef<InstancedMesh>(null)
  const dummy = useMemo(() => new Object3D(), [])

  useLayoutEffect(() => {
    if (!mesh.current) return
    for (let i = 0; i < count; i += 1) {
      const height = 2.2 + (i % 7) * 1.15
      dummy.position.set(7 + (i % 4) * 3.4, height / 2, (i * 2.7) % 104)
      dummy.scale.set(1.8, height, 1.8)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    }
    mesh.current.instanceMatrix.needsUpdate = true
  }, [count, dummy])

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <boxGeometry />
      <meshStandardMaterial
        color={color}
        roughness={roughness}
        metalness={0.08}
        emissive={color}
        emissiveIntensity={emissiveIntensity}
      />
    </instancedMesh>
  )
}

function Hubs({
  color,
  onSelect,
}: {
  color: string
  onSelect: (title: string, lines: string[]) => void
}) {
  const items = [
    { name: 'Fort', full: 'Colombo Fort Hub', z: 0 },
    { name: 'Bambalapitiya', full: 'Bambalapitiya Interchange', z: 36 },
    { name: 'Ratmalana', full: 'Ratmalana Vertiport', z: 72 },
    { name: 'KDU', full: 'KDU Campus', z: 98 },
  ]

  return (
    <group>
      {items.map((hub) => (
        <group key={hub.name} position={[2.2, 1.4, hub.z]}>
          <mesh
            onClick={(event) => {
              event.stopPropagation()
              onSelect(hub.full, ['This is a transfer hub', 'Status: Open'])
            }}
          >
            <cylinderGeometry args={[1.1, 1.3, 2.8, 8]} />
            <meshStandardMaterial color={color} roughness={0.82} metalness={0.1} />
          </mesh>
          <Html
            center
            position={[0, 2.4, 0]}
            distanceFactor={60}
            zIndexRange={[10, 0]}
            pointerEvents="none"
          >
            <div className="map-label">{hub.name}</div>
          </Html>
        </group>
      ))}
    </group>
  )
}

function Pods({
  frozen,
  count,
  color,
}: {
  frozen: boolean
  count: number
  color: string
}) {
  const group = useRef<Group>(null)
  const setInspector = useSynqStore((s) => s.setInspector)

  useFrame((_, delta) => {
    if (frozen || !group.current) return
    group.current.children.forEach((child, index) => {
      child.position.z = child.position.z + delta * (6 + index)
      if (child.position.z > 100) child.position.z = 0
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
              lines: ['Autonomous pod', 'Going toward KDU', `Seats used: ${40 + index * 6}%`],
            })
          }}
        >
          <boxGeometry args={[1.2, 0.55, 2.1]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
    </group>
  )
}

function Train({ frozen, color }: { frozen: boolean; color: string }) {
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
          lines: ['Autonomous rail', 'Next stop: Ratmalana', 'Seats used: 64%'],
        })
      }}
    >
      <boxGeometry args={[1.1, 0.8, 7]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.22}
      />
    </mesh>
  )
}

function AirTraffic({
  frozen,
  count,
  color,
}: {
  frozen: boolean
  count: number
  color: string
}) {
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
              lines: ['Air shuttle', 'Going to KDU', `Seats used: ${60 + index * 5}%`],
            })
          }}
        >
          <boxGeometry args={[1.6, 0.28, 2.4]} />
          <meshStandardMaterial
            color={color}
            metalness={0.35}
            roughness={0.28}
            emissive={color}
            emissiveIntensity={0.18}
          />
        </mesh>
      ))}
    </group>
  )
}

function UserMarker({
  position,
  color,
}: {
  position: { x: number; y: number; z: number }
  color: string
}) {
  return (
    <group position={[position.x, position.y, position.z]}>
      <mesh>
        <sphereGeometry args={[0.7, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.45, 0]}>
        <ringGeometry args={[0.85, 1.2, 24]} />
        <meshBasicMaterial color={color} transparent opacity={0.55} />
      </mesh>
      <Html
        center
        position={[0, 1.8, 0]}
        distanceFactor={48}
        zIndexRange={[20, 0]}
        pointerEvents="none"
      >
        <div className="map-label">You are here</div>
      </Html>
    </group>
  )
}
