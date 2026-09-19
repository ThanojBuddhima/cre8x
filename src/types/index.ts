export type TransportMode = 'walk' | 'pod' | 'rail' | 'air'
export type Preference = 'fastest' | 'calm' | 'accessible' | 'energy'
export type DemoScenario = 'normal' | 'rain' | 'emergency'
export type QualityLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'FALLBACK'
export type Confidence = 'High' | 'Medium' | 'Low'
export type EnergyLevel = 'Low' | 'Medium' | 'High'
export type WeatherRisk = 'Low' | 'Medium' | 'High'
export type LayerId = 'ground' | 'rail' | 'air' | 'risk'
export type TimeMode = 'arrive' | 'leave'

export interface Place {
  id: string
  name: string
  shortName: string
  kind: 'hub' | 'interchange' | 'vertiport' | 'campus'
  hint: string
}

export interface AccessibilityProfile {
  wheelchair: boolean
  fewerStairs: boolean
  withChild: boolean
}

export interface JourneyLeg {
  id: string
  mode: TransportMode
  vehicleName: string
  fromId: string
  toId: string
  departure: string
  arrival: string
  durationMin: number
  accessibilityNote: string
  stairs: number
  usesCoastalRoad?: boolean
}

export interface Journey {
  id: string
  name: string
  tag: string
  arriveAt: string
  departAt: string
  durationMin: number
  confidence: Confidence
  energy: EnergyLevel
  weatherRisk: WeatherRisk
  transfers: number
  stairs: number
  accessibleTransfers: number
  recommended: boolean
  reasons: string[]
  legs: JourneyLeg[]
  usesCoastalRoad: boolean
}

export interface Intent {
  originId: string
  destinationId: string
  arriveBy: string
  timeMode: TimeMode
  preference: Preference
}

export interface VehicleInfo {
  id: string
  name: string
  mode: TransportMode
  status: string
  destination: string
  eta: string
  capacity: number
}

export interface CorridorInfo {
  id: string
  name: string
  status: string
  congestion: string
  energy: string
}

export interface CityStatus {
  weatherLabel: string
  weatherDetail: string
  networkHealth: string
  alert: string | null
}

export interface InspectorTarget {
  kind: 'vehicle' | 'corridor'
  title: string
  lines: string[]
}
