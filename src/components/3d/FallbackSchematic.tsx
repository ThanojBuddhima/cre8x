import { useEffect, useRef } from 'react'
import { getPlace } from '@/data/places'
import { currentLeg, currentLegIndex } from '@/lib/journeyProgress'
import { hopLabel, modeColor, transferColor } from '@/lib/modeColors'
import { useSynqStore } from '@/store/useSynqStore'
import type { Journey, TransportMode } from '@/types'

const hubs = [
  { id: 'fort', x: 36, y: 168, label: 'Fort' },
  { id: 'bambalapitiya', x: 118, y: 118, label: 'Bambalapitiya' },
  { id: 'ratmalana', x: 198, y: 72, label: 'Ratmalana' },
  { id: 'kdu', x: 276, y: 32, label: 'KDU' },
]

function pointFor(id: string, mode: string) {
  const hub = hubs.find((item) => item.id === id) ?? hubs[0]!
  if (mode === 'rail') return { x: hub.x, y: hub.y - 10 }
  if (mode === 'air') return { x: hub.x, y: hub.y - 28 }
  if (mode === 'pod') return { x: hub.x, y: hub.y + 12 }
  return { x: hub.x, y: hub.y }
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export function FallbackSchematic({
  journey,
  progress = 0,
}: {
  journey?: Journey
  progress?: number
}) {
  const scenario = useSynqStore((s) => s.scenario)
  const layers = useSynqStore((s) => s.layers)
  const theme = useSynqStore((s) => s.theme)
  const mapCommand = useSynqStore((s) => s.mapCommand)
  const zoom = useSynqStore((s) => s.schematicZoom)
  const offset = useSynqStore((s) => s.schematicOffset)
  const setSchematicZoom = useSynqStore((s) => s.setSchematicZoom)
  const setSchematicOffset = useSynqStore((s) => s.setSchematicOffset)
  const drag = useRef<{ x: number; y: number } | null>(null)
  const light = theme === 'light'
  const leg = journey ? currentLeg(journey, progress) : undefined
  const from = leg ? pointFor(leg.fromId, leg.mode) : hubs[0]!
  const to = leg ? pointFor(leg.toId, leg.mode) : hubs[hubs.length - 1]!
  const total = journey?.legs.reduce((s, l) => s + l.durationMin, 0) ?? 1
  const local = journey
    ? ((progress * total) % (leg?.durationMin || 1)) / (leg?.durationMin || 1)
    : 0
  const user = {
    x: lerp(from.x, to.x, Math.min(1, local)),
    y: lerp(from.y, to.y, Math.min(1, local)),
  }
  const youColor = leg ? modeColor(leg.mode, theme) : modeColor('walk', theme)
  const hopInk = transferColor(theme)
  const currentIndex = journey ? currentLegIndex(journey, progress) : 0

  useEffect(() => {
    if (!mapCommand) return
    if (mapCommand.type === 'zoom-in') {
      setSchematicZoom(Math.min(2.4, zoom * 1.25))
    }
    if (mapCommand.type === 'zoom-out') {
      setSchematicZoom(Math.max(0.7, zoom / 1.25))
    }
    if (mapCommand.type === 'recenter') {
      setSchematicZoom(1)
      setSchematicOffset({ x: 0, y: 0 })
    }
  }, [mapCommand, setSchematicOffset, setSchematicZoom, zoom])

  return (
    <div
      className="absolute inset-0 touch-none"
      style={{
        background: light
          ? 'linear-gradient(#e8eef2, #d7e3ea)'
          : 'linear-gradient(#0b1219, #16202a)',
      }}
      onPointerDown={(event) => {
        drag.current = { x: event.clientX, y: event.clientY }
        event.currentTarget.setPointerCapture(event.pointerId)
      }}
      onPointerMove={(event) => {
        if (!drag.current) return
        setSchematicOffset({
          x: offset.x + (event.clientX - drag.current.x),
          y: offset.y + (event.clientY - drag.current.y),
        })
        drag.current = { x: event.clientX, y: event.clientY }
      }}
      onPointerUp={() => {
        drag.current = null
      }}
      onWheel={(event) => {
        event.preventDefault()
        const next = event.deltaY < 0 ? zoom * 1.08 : zoom / 1.08
        setSchematicZoom(Math.min(2.4, Math.max(0.7, next)))
      }}
    >
      <svg
        viewBox="0 0 320 200"
        className="h-full w-full"
        role="img"
        aria-label={
          journey
            ? `You are on the route from ${getPlace(journey.legs[0].fromId).name} to KDU`
            : 'Colombo to KDU map. You are at Fort.'
        }
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
          transformOrigin: 'center',
        }}
      >
        <path
          d="M10 20 C 40 80, 30 140, 18 198"
          fill="none"
          stroke={light ? '#b9d0dc' : '#173044'}
          strokeWidth="28"
        />
        {layers.ground ? (
          <path
            d="M40 176 L 270 40"
            fill="none"
            stroke={
              scenario === 'rain' ? '#c4a15a' : modeColor('pod', theme)
            }
            strokeOpacity={0.45}
            strokeWidth="8"
            strokeLinecap="round"
          />
        ) : null}
        {layers.rail ? (
          <path
            d="M48 158 L 250 48"
            fill="none"
            stroke={modeColor('rail', theme)}
            strokeOpacity={journey ? 0.35 : 0.7}
            strokeWidth="2"
          />
        ) : null}
        {layers.air ? (
          <path
            d="M70 120 L 230 28"
            fill="none"
            stroke={modeColor('air', theme)}
            strokeOpacity="0.45"
            strokeWidth="1.5"
            strokeDasharray="6 8"
          />
        ) : null}
        {journey
          ? journey.legs.map((item) => {
              const a = pointFor(item.fromId, item.mode)
              const b = pointFor(item.toId, item.mode)
              if (a.x === b.x && a.y === b.y) return null
              return (
                <path
                  key={item.id}
                  d={`M${a.x} ${a.y} L ${b.x} ${b.y}`}
                  fill="none"
                  stroke={modeColor(item.mode as TransportMode, theme)}
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={item.mode === 'air' ? '7 6' : undefined}
                />
              )
            })
          : null}
        {journey
          ? journey.legs.map((item, i) => {
              const next = journey.legs[i + 1]
              if (!next || next.mode === item.mode) return null
              const a = pointFor(item.toId, item.mode)
              const b = pointFor(next.fromId, next.mode)
              const later = currentIndex < i
              const upcoming = currentIndex === i
              return (
                <g key={`${item.id}-hop`} opacity={later ? 0.4 : 1}>
                  <path
                    d={`M${a.x} ${a.y} L ${b.x} ${b.y}`}
                    fill="none"
                    stroke={hopInk}
                    strokeWidth={upcoming ? 3 : 2}
                    strokeLinecap="round"
                  />
                  <circle cx={b.x} cy={b.y} r={upcoming ? 5 : 3.5} fill={hopInk} />
                  <text
                    x={(a.x + b.x) / 2 + 6}
                    y={(a.y + b.y) / 2 - 6}
                    fill={hopInk}
                    fontSize="8"
                    fontWeight="600"
                    fontFamily="inherit"
                  >
                    {hopLabel(next)}
                  </text>
                </g>
              )
            })
          : null}
        {layers.risk && scenario !== 'normal' ? (
          <path
            d="M70 160 L 140 118"
            fill="none"
            stroke="#e8b86d"
            strokeWidth="10"
            strokeOpacity="0.45"
            strokeLinecap="round"
          />
        ) : null}
        {hubs.map((hub) => (
          <g key={hub.id}>
            <circle
              cx={hub.x}
              cy={hub.y}
              r="4"
              fill={light ? '#1b2430' : '#f4f7fa'}
            />
            <text
              x={hub.x + 8}
              y={hub.y + 4}
              fill={light ? '#1b2430' : '#d5dde6'}
              fontSize="9"
              fontWeight="600"
              fontFamily="inherit"
            >
              {hub.label}
            </text>
          </g>
        ))}
        <circle cx={user.x} cy={user.y} r="7" fill={youColor} />
        <text
          x={user.x + 10}
          y={user.y - 8}
          fill={youColor}
          fontSize="9"
          fontWeight="700"
          fontFamily="inherit"
        >
          You are here
        </text>
      </svg>
    </div>
  )
}
