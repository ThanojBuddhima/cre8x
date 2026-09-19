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
  const calmMode = useSynqStore((s) => s.calmMode)
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
    document.documentElement.classList.add('dark')
    window.localStorage.setItem('synq-theme', 'dark')
  }, [])

  useEffect(() => {
    const value = params.get('scenario')
    if (value === 'rain' || value === 'normal' || value === 'emergency') {
      setScenario(value as DemoScenario)
    }
  }, [params, setScenario])

  return children
}
