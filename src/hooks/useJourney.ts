import { journeys } from '@/data/journeys'
import { useSynqStore } from '@/store/useSynqStore'
import type { Journey } from '@/types'

export function useSelectedJourney(): Journey | undefined {
  const id = useSynqStore((s) => s.selectedJourneyId)
  const results = useSynqStore((s) => s.results)
  return results.find((j) => j.id === id) ?? journeys.find((j) => j.id === id)
}

export function usePrefersReducedMotion() {
  const calmMode = useSynqStore((s) => s.calmMode)
  const quality = useSynqStore((s) => s.quality)
  return calmMode || quality === 'FALLBACK'
}
