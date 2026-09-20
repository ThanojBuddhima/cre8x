import type { JourneyLeg, ThemeMode, TransportMode } from '@/types'

const dark: Record<TransportMode, string> = {
  walk: '#ff8a1a',
  bus: '#fbbf24',
  pod: '#4f8cff',
  rail: '#2ee6a6',
  air: '#c77dff',
}

const light: Record<TransportMode, string> = {
  walk: '#e85d04',
  bus: '#a16207',
  pod: '#1d4ed8',
  rail: '#0f8f7a',
  air: '#7c3aed',
}

export const MODE_LEGEND: { mode: TransportMode; label: string; hint: string }[] = [
  { mode: 'bus', label: 'Auto-bus', hint: 'Driverless buses on city streets' },
  { mode: 'rail', label: 'Auto-rail', hint: 'Driverless trains between hubs' },
  { mode: 'air', label: 'Air', hint: 'Short shuttles above the corridor' },
  { mode: 'pod', label: 'Smart road', hint: 'Shared pods on managed roads' },
  { mode: 'walk', label: 'Walk', hint: 'Short links at each hub' },
]

export function brandColor(theme: ThemeMode) {
  return theme === 'light' ? '#e85d04' : '#ff8a1a'
}

export type GlowId = 'brand' | TransportMode

export function modeColor(mode: TransportMode, theme: ThemeMode) {
  return (theme === 'light' ? light : dark)[mode]
}

export function glowColor(glow: GlowId, theme: ThemeMode) {
  return glow === 'brand' ? brandColor(theme) : modeColor(glow, theme)
}

export function transferColor(theme: ThemeMode) {
  return theme === 'light' ? '#1b2430' : '#f4f7fa'
}

export function modeShortLabel(mode: TransportMode) {
  if (mode === 'bus') return 'Auto-bus'
  if (mode === 'pod') return 'Smart road'
  if (mode === 'rail') return 'Auto-rail'
  if (mode === 'air') return 'Air'
  return 'Walk'
}

export function hopLabel(next: JourneyLeg) {
  if (next.mode === 'walk') return next.vehicleName
  return `Change to ${modeShortLabel(next.mode)}`
}

export function transferPrompt(next: JourneyLeg, placeName: string) {
  if (next.mode === 'walk') return next.vehicleName
  return `Change to ${modeShortLabel(next.mode)} at ${placeName}`
}

export function trackingSentence(
  now: JourneyLeg,
  upcoming?: JourneyLeg,
  nextPlaceName?: string,
) {
  let here = 'You are walking.'
  if (now.mode === 'bus') here = 'You are on a driverless bus.'
  if (now.mode === 'pod') here = 'You are on a smart-road pod.'
  if (now.mode === 'rail') here = 'You are on a driverless train.'
  if (now.mode === 'air') here = 'You are on an air shuttle.'
  if (now.mode === 'walk') here = `You are walking (${now.vehicleName}).`
  if (!upcoming) return `${here} This is the last part of the trip.`
  if (upcoming.mode === 'walk') {
    return `${here} Next: ${upcoming.vehicleName}.`
  }
  const at = nextPlaceName ? ` at ${nextPlaceName}` : ''
  return `${here} Next you change to ${modeShortLabel(upcoming.mode).toLowerCase()}${at}.`
}
