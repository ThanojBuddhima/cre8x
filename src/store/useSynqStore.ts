import { create } from 'zustand'
import type {
  AccessibilityProfile,
  DemoScenario,
  InspectorTarget,
  Intent,
  Journey,
  LayerId,
  MapCommand,
  MapCommandType,
  QualityLevel,
  ThemeMode,
} from '@/types'
import { detectQuality, prefersReducedMotion } from '@/services/quality'

function readTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'dark'
  const saved = window.localStorage.getItem('synq-theme')
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia('(prefers-color-scheme: light)').matches
    ? 'light'
    : 'dark'
}

export interface SynqState {
  intent: Intent
  profile: AccessibilityProfile
  results: Journey[]
  selectedJourneyId: string | null
  liveProgress: number
  liveEpoch: number
  disruptionShown: boolean
  acceptedReroute: boolean
  scenario: DemoScenario
  layers: Record<LayerId, boolean>
  quality: QualityLevel
  calmMode: boolean
  theme: ThemeMode
  introComplete: boolean
  introProgress: number
  inspector: InspectorTarget | null
  arrived: boolean
  followUser: boolean
  autoRotate: boolean
  mapCommand: MapCommand | null
  schematicZoom: number
  schematicOffset: { x: number; y: number }
  waitingState: { isWaiting: boolean; countdown: number; label: string } | null
  setIntent: (partial: Partial<Intent>) => void
  setProfile: (partial: Partial<AccessibilityProfile>) => void
  setResults: (results: Journey[]) => void
  selectJourney: (id: string) => void
  setLiveProgress: (value: number) => void
  setDisruptionShown: (value: boolean) => void
  setAcceptedReroute: (value: boolean) => void
  setScenario: (scenario: DemoScenario) => void
  toggleLayer: (id: LayerId) => void
  setQuality: (quality: QualityLevel) => void
  setCalmMode: (value: boolean) => void
  setTheme: (theme: ThemeMode) => void
  setIntroComplete: (value: boolean) => void
  setIntroProgress: (value: number) => void
  setInspector: (value: InspectorTarget | null) => void
  setArrived: (value: boolean) => void
  setFollowUser: (value: boolean) => void
  setAutoRotate: (value: boolean) => void
  issueMapCommand: (type: MapCommandType) => void
  setSchematicZoom: (value: number) => void
  setSchematicOffset: (value: { x: number; y: number }) => void
  setWaitingState: (value: { isWaiting: boolean; countdown: number; label: string } | null) => void
  resetLive: () => void
  replayIntro: () => void
}

const reduced = prefersReducedMotion()

export const useSynqStore = create<SynqState>((set) => ({
  intent: {
    originId: 'fort',
    destinationId: 'kdu',
    arriveBy: '08:30',
    timeMode: 'arrive',
    preference: 'calm',
  },
  profile: {
    wheelchair: false,
    fewerStairs: false,
    withChild: false,
  },
  results: [],
  selectedJourneyId: 'j1',
  liveProgress: 0,
  liveEpoch: 0,
  disruptionShown: false,
  acceptedReroute: false,
  scenario: 'normal',
  layers: {
    ground: true,
    rail: true,
    air: true,
    risk: true,
  },
  quality: detectQuality(),
  calmMode: reduced,
  theme: readTheme(),
  introComplete: true,
  introProgress: 0,
  inspector: null,
  arrived: false,
  followUser: true,
  autoRotate: true,
  mapCommand: null,
  schematicZoom: 1,
  schematicOffset: { x: 0, y: 0 },
  waitingState: null,
  setIntent: (partial) =>
    set((state) => ({ intent: { ...state.intent, ...partial } })),
  setProfile: (partial) =>
    set((state) => ({ profile: { ...state.profile, ...partial } })),
  setResults: (results) => set({ results }),
  selectJourney: (id) => set({ selectedJourneyId: id }),
  setLiveProgress: (liveProgress) => set({ liveProgress }),
  setDisruptionShown: (disruptionShown) => set({ disruptionShown }),
  setAcceptedReroute: (acceptedReroute) => set({ acceptedReroute }),
  setScenario: (scenario) => set({ scenario }),
  toggleLayer: (id) =>
    set((state) => ({ layers: { ...state.layers, [id]: !state.layers[id] } })),
  setQuality: (quality) => set({ quality }),
  setCalmMode: (calmMode) =>
    set({
      calmMode,
      quality: calmMode ? 'FALLBACK' : detectQuality(),
    }),
  setTheme: (theme) => {
    window.localStorage.setItem('synq-theme', theme)
    set({ theme })
  },
  setIntroComplete: (introComplete) => set({ introComplete }),
  setIntroProgress: (introProgress) => set({ introProgress }),
  setInspector: (inspector) => set({ inspector }),
  setArrived: (arrived) => set({ arrived }),
  setFollowUser: (followUser) => set({ followUser }),
  setAutoRotate: (autoRotate) => set({ autoRotate }),
  issueMapCommand: (type) =>
    set((state) => ({
      mapCommand: { id: (state.mapCommand?.id ?? 0) + 1, type },
      followUser: type === 'recenter' ? true : state.followUser,
    })),
  setSchematicZoom: (schematicZoom) => set({ schematicZoom }),
  setSchematicOffset: (schematicOffset) => set({ schematicOffset }),
  setWaitingState: (waitingState) => set({ waitingState }),
  resetLive: () =>
    set((state) => ({
      liveProgress: 0,
      liveEpoch: state.liveEpoch + 1,
      disruptionShown: false,
      acceptedReroute: false,
      arrived: false,
      inspector: null,
      followUser: true,
      schematicZoom: 1,
      schematicOffset: { x: 0, y: 0 },
    })),
  replayIntro: () =>
    set({
      introComplete: true,
      introProgress: 1,
      autoRotate: true,
    }),
}))
