import { create } from 'zustand'
import type {
  AccessibilityProfile,
  DemoScenario,
  InspectorTarget,
  Intent,
  Journey,
  LayerId,
  QualityLevel,
} from '@/types'
import { detectQuality, prefersReducedMotion } from '@/services/quality'

export interface SynqState {
  intent: Intent
  profile: AccessibilityProfile
  results: Journey[]
  selectedJourneyId: string | null
  liveProgress: number
  disruptionShown: boolean
  acceptedReroute: boolean
  scenario: DemoScenario
  layers: Record<LayerId, boolean>
  quality: QualityLevel
  calmMode: boolean
  introComplete: boolean
  introProgress: number
  inspector: InspectorTarget | null
  arrived: boolean
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
  setIntroComplete: (value: boolean) => void
  setIntroProgress: (value: number) => void
  setInspector: (value: InspectorTarget | null) => void
  setArrived: (value: boolean) => void
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
  selectedJourneyId: null,
  liveProgress: 0,
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
  introComplete: reduced,
  introProgress: 0,
  inspector: null,
  arrived: false,
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
  setIntroComplete: (introComplete) => set({ introComplete }),
  setIntroProgress: (introProgress) => set({ introProgress }),
  setInspector: (inspector) => set({ inspector }),
  setArrived: (arrived) => set({ arrived }),
  resetLive: () =>
    set({
      liveProgress: 0,
      disruptionShown: false,
      acceptedReroute: false,
      arrived: false,
      inspector: null,
    }),
  replayIntro: () =>
    set({
      introComplete: false,
      introProgress: 0,
      results: [],
    }),
}))
