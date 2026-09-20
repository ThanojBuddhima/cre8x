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

/**
 * CARTO basemaps. The key is read from VITE_CARTO_KEY rather than committed:
 * this repo is public. It still ships in the client bundle, because a raster
 * basemap is fetched by the browser and no client-side key can be hidden --
 * restrict it by domain in the CARTO dashboard instead of relying on secrecy.
 * Without a key these endpoints still serve tiles anonymously, so the map
 * degrades rather than breaking.
 */
const CARTO_KEY = (
  import.meta.env as unknown as Record<string, string | undefined>
).VITE_CARTO_KEY

function tileUrl(style: string) {
  const base =
    'https://basemaps.cartocdn.com/rastertiles/' + style + '/{z}/{x}/{y}.png'
  return CARTO_KEY ? base + '?api_key=' + CARTO_KEY : base
}

const TILES = {
  dark: tileUrl('dark_all'),
  light: tileUrl('voyager'),
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

/**
 * Leaflet caches its container size, so a map sized off a 100dvh parent goes
 * stale the moment the mobile URL bar collapses or the device rotates - the
 * tile grid greys out until something else forces a redraw.
 */
function InvalidateOnResize() {
  const map = useMap()

  useEffect(() => {
    const refresh = () => map.invalidateSize({ animate: false })
    const observer = new ResizeObserver(refresh)
    observer.observe(map.getContainer())
    window.addEventListener('orientationchange', refresh)
    return () => {
      observer.disconnect()
      window.removeEventListener('orientationchange', refresh)
    }
  }, [map])

  return null
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

/** Resolves a design token to a concrete colour, which SVG attributes need. */
function readToken(name: string, fallback: string) {
  if (typeof window === 'undefined') return fallback
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim()
  return value || fallback
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
  const surface = readToken('--neu-base', theme === 'light' ? '#E0E5EC' : '#2A2E35')
  const hairline = readToken('--neu-light', '#ffffff')

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
        <InvalidateOnResize />
        <TileLayer
          key={theme}
          url={theme === 'light' ? TILES.light : TILES.dark}
          attribution={ATTRIBUTION}
          maxZoom={20}
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
            color: hairline,
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
