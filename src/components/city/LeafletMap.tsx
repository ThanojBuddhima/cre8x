import { useEffect, useMemo } from 'react'
import {
  CircleMarker,
  MapContainer,
  Polyline,
  TileLayer,
  Tooltip,
  useMap,
} from 'react-leaflet'
import type { LatLngExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { getPlace } from '@/data/places'
import { currentLegIndex } from '@/lib/journeyProgress'
import { brandColor, modeColor } from '@/lib/modeColors'
import { useSynqStore } from '@/store/useSynqStore'
import type { Journey } from '@/types'

const TILES = {
  dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
}
const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'

/** Where the traveller is right now, interpolated inside the current leg. */
function positionAt(journey: Journey, progress: number): [number, number] {
  const index = currentLegIndex(journey, progress)
  const leg = journey.legs[index]
  if (!leg) return [6.9344, 79.8428]

  const total = journey.legs.reduce((sum, item) => sum + item.durationMin, 0)
  let elapsed = progress * total
  for (let i = 0; i < index; i += 1) {
    elapsed -= journey.legs[i]!.durationMin
  }
  const t = leg.durationMin
    ? Math.min(1, Math.max(0, elapsed / leg.durationMin))
    : 0

  const from = getPlace(leg.fromId)
  const to = getPlace(leg.toId)
  return [
    from.lat + (to.lat - from.lat) * t,
    from.lng + (to.lng - from.lng) * t,
  ]
}

/** Bridges the existing MapControls store commands to the Leaflet instance. */
function MapCommands({ follow }: { follow: [number, number] }) {
  const map = useMap()
  const command = useSynqStore((s) => s.mapCommand)
  const followUser = useSynqStore((s) => s.followUser)

  useEffect(() => {
    if (!command) return
    if (command.type === 'zoom-in') map.zoomIn()
    else if (command.type === 'zoom-out') map.zoomOut()
    else map.setView(follow, map.getZoom(), { animate: true })
  }, [command, map, follow])

  useEffect(() => {
    if (!followUser) return
    const centre = map.getCenter()
    const drift = map.distance(centre, follow)
    if (drift > 400) map.panTo(follow, { animate: true })
  }, [followUser, follow, map])

  return null
}

export function LeafletMap({
  journey,
  progress = 0,
}: {
  journey: Journey
  progress?: number
}) {
  const theme = useSynqStore((s) => s.theme)
  const layers = useSynqStore((s) => s.layers)

  const accent = brandColor(theme)
  const surface = theme === 'light' ? '#f4f6f8' : '#070b10'

  const you = useMemo(
    () => positionAt(journey, progress),
    [journey, progress],
  )

  const stops = useMemo(() => {
    const ids = journey.legs.flatMap((leg) => [leg.fromId, leg.toId])
    return [...new Set(ids)].map(getPlace)
  }, [journey])

  /** Layer toggles map onto the modes they carry. */
  function legVisible(mode: Journey['legs'][number]['mode']) {
    if (mode === 'rail') return layers.rail
    if (mode === 'air') return layers.air
    if (mode === 'walk') return true
    return layers.ground
  }

  return (
    <div className="h-full w-full">
      <MapContainer
        center={you as LatLngExpression}
        zoom={12}
        scrollWheelZoom={false}
        zoomControl={false}
        attributionControl
        className="h-full w-full"
        style={{ background: 'var(--map-sky)' }}
      >
        <TileLayer
          key={theme}
          url={theme === 'light' ? TILES.light : TILES.dark}
          attribution={ATTRIBUTION}
          maxZoom={19}
        />

        {journey.legs.map((leg) => {
          if (!legVisible(leg.mode)) return null
          const from = getPlace(leg.fromId)
          const to = getPlace(leg.toId)
          if (from.id === to.id) return null
          const color = modeColor(leg.mode, theme)
          return (
            <Polyline
              key={leg.id}
              positions={[
                [from.lat, from.lng],
                [to.lat, to.lng],
              ]}
              pathOptions={{
                color,
                weight: leg.mode === 'walk' ? 3 : 5,
                opacity: 0.9,
                // Air hops are not on the ground, so they are drawn dashed.
                dashArray: leg.mode === 'air' ? '8 8' : undefined,
                lineCap: 'round',
              }}
            />
          )
        })}

        {stops.map((stop) => (
          <CircleMarker
            key={stop.id}
            center={[stop.lat, stop.lng]}
            radius={6}
            pathOptions={{
              color: accent,
              fillColor: surface,
              fillOpacity: 1,
              weight: 2,
            }}
          >
            <Tooltip direction="top" offset={[0, -8]}>
              {stop.name}
            </Tooltip>
          </CircleMarker>
        ))}

        {/* The traveller: a halo plus a solid dot, so it reads at any zoom. */}
        <CircleMarker
          center={you}
          radius={14}
          pathOptions={{
            color: 'transparent',
            fillColor: accent,
            fillOpacity: 0.25,
          }}
        />
        <CircleMarker
          center={you}
          radius={7}
          pathOptions={{
            color: '#ffffff',
            weight: 2,
            fillColor: accent,
            fillOpacity: 1,
          }}
        >
          <Tooltip direction="top" offset={[0, -10]} permanent>
            You are here
          </Tooltip>
        </CircleMarker>

        <MapCommands follow={you} />
      </MapContainer>
    </div>
  )
}
