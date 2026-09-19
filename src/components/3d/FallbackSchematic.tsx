import { getPlace } from '@/data/places'
import { currentLeg } from '@/components/live/LiveHud'
import { useSynqStore } from '@/store/useSynqStore'
import type { Journey } from '@/types'

const hubs = [
  { id: 'fort', x: 36, y: 168, label: 'Fort' },
  { id: 'bambalapitiya', x: 118, y: 118, label: 'Bambalapitiya' },
  { id: 'ratmalana', x: 198, y: 72, label: 'Ratmalana' },
  { id: 'kdu', x: 276, y: 32, label: 'KDU' },
]

function pointFor(id: string, mode: string) {
  const hub = hubs.find((item) => item.id === id) ?? hubs[0]
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
  const leg = journey ? currentLeg(journey, progress) : undefined
  const from = leg ? pointFor(leg.fromId, leg.mode) : hubs[0]
  const to = leg ? pointFor(leg.toId, leg.mode) : hubs[hubs.length - 1]
  const total = journey?.legs.reduce((s, l) => s + l.durationMin, 0) ?? 1
  const local = journey
    ? ((progress * total) % (leg?.durationMin || 1)) / (leg?.durationMin || 1)
    : 0
  const user = {
    x: lerp(from.x, to.x, Math.min(1, local)),
    y: lerp(from.y, to.y, Math.min(1, local)),
  }

  return (
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#12202c,transparent_40%),linear-gradient(#070b10,#0a141c)]">
      <svg
        viewBox="0 0 320 200"
        className="h-full w-full"
        role="img"
        aria-label={
          journey
            ? `Route from ${getPlace(journey.legs[0].fromId).name} to KDU`
            : 'Colombo to KDU mobility corridor'
        }
      >
        <path
          d="M10 20 C 40 80, 30 140, 18 198"
          fill="none"
          stroke="#123044"
          strokeWidth="28"
        />
        {layers.ground ? (
          <path
            d="M40 176 L 270 40"
            fill="none"
            stroke={scenario === 'rain' ? '#8a6a3a' : '#2a3540'}
            strokeWidth="8"
            strokeLinecap="round"
          />
        ) : null}
        {layers.rail ? (
          <path
            d="M48 158 L 250 48"
            fill="none"
            stroke="#3ee0c4"
            strokeOpacity="0.55"
            strokeWidth="2"
          />
        ) : null}
        {layers.air ? (
          <path
            d="M70 120 L 230 28"
            fill="none"
            stroke="#3ee0c4"
            strokeOpacity="0.3"
            strokeWidth="1.5"
            strokeDasharray="6 8"
          />
        ) : null}
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
            <circle cx={hub.x} cy={hub.y} r="4" fill="#f4f7fa" />
            <text
              x={hub.x + 8}
              y={hub.y + 4}
              fill="#a8b3c0"
              fontSize="8"
              fontFamily="inherit"
            >
              {hub.label}
            </text>
          </g>
        ))}
        <circle cx={user.x} cy={user.y} r="5" fill="#3ee0c4" />
      </svg>
    </div>
  )
}
