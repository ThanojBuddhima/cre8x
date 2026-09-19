import { useEffect, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { detectQuality, prefersReducedMotion } from '@/services/quality'
import { useSynqStore } from '@/store/useSynqStore'
import type { DemoScenario } from '@/types'

export function Providers({ children }: { children: ReactNode }) {
  const setQuality = useSynqStore((s) => s.setQuality)
  const setCalmMode = useSynqStore((s) => s.setCalmMode)
  const setIntroComplete = useSynqStore((s) => s.setIntroComplete)
  const setScenario = useSynqStore((s) => s.setScenario)
  const calmMode = useSynqStore((s) => s.calmMode)
  const [params] = useSearchParams()

  useEffect(() => {
    const quality = detectQuality()
    setQuality(quality)
    const reduced = prefersReducedMotion()
    if (reduced) {
      setCalmMode(true)
      setIntroComplete(true)
      document.documentElement.classList.add('reduce-motion')
    }
  }, [setCalmMode, setIntroComplete, setQuality])

  useEffect(() => {
    document.documentElement.classList.toggle('calm', calmMode)
  }, [calmMode])

  useEffect(() => {
    const value = params.get('scenario')
    if (value === 'rain' || value === 'normal' || value === 'emergency') {
      setScenario(value as DemoScenario)
    }
    if (params.get('skipIntro') === '1') {
      setIntroComplete(true)
    }
  }, [params, setIntroComplete, setScenario])

  return children
}
