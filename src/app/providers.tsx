import { useEffect, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppGlow } from '@/hooks/useAppGlow'
import { useLiveClock } from '@/hooks/useLiveClock'
import { detectQuality, prefersReducedMotion } from '@/services/quality'
import { useSynqStore } from '@/store/useSynqStore'
import type { DemoScenario } from '@/types'

export function Providers({ children }: { children: ReactNode }) {
  const setQuality = useSynqStore((s) => s.setQuality)
  const setCalmMode = useSynqStore((s) => s.setCalmMode)
  const setScenario = useSynqStore((s) => s.setScenario)
  const setIntroComplete = useSynqStore((s) => s.setIntroComplete)
  const calmMode = useSynqStore((s) => s.calmMode)
  const theme = useSynqStore((s) => s.theme)
  const [params] = useSearchParams()
  useAppGlow()
  useLiveClock()

  useEffect(() => {
    const quality = detectQuality()
    setQuality(quality)
    const reduced = prefersReducedMotion()
    if (reduced) {
      setCalmMode(true)
      document.documentElement.classList.add('reduce-motion')
    }
  }, [setCalmMode, setQuality])

  useEffect(() => {
    document.documentElement.classList.toggle('calm', calmMode)
  }, [calmMode])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#070b10' : '#f4f6f8')
  }, [theme])

  useEffect(() => {
    if (params.get('skipIntro') === '1') setIntroComplete(true)
  }, [params, setIntroComplete])

  useEffect(() => {
    const value = params.get('scenario')
    if (value === 'rain' || value === 'normal' || value === 'emergency') {
      setScenario(value as DemoScenario)
    }
  }, [params, setScenario])

  return children
}
