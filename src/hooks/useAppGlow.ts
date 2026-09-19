import { useEffect } from 'react'
import { useLiveJourney } from '@/hooks/useLiveJourney'

export function useAppGlow() {
  const { mode, color } = useLiveJourney()

  useEffect(() => {
    const html = document.documentElement
    html.dataset.glow = mode
    html.style.setProperty('--glow', color)
    const meta = document.querySelector('meta[name="theme-color"]')
    meta?.setAttribute('content', color)
  }, [color, mode])
}
