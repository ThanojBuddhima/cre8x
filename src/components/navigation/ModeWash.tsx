import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useLiveJourney } from '@/hooks/useLiveJourney'

export function ModeWash() {
  const { mode, color } = useLiveJourney()
  const prev = useRef(mode)
  const [wash, setWash] = useState<{ key: number; color: string } | null>(null)

  useEffect(() => {
    if (prev.current === mode) return
    prev.current = mode
    const html = document.documentElement
    if (html.classList.contains('reduce-motion') || html.classList.contains('calm')) {
      return
    }
    setWash({ key: Date.now(), color })
    const timer = window.setTimeout(() => setWash(null), 1550)
    return () => window.clearTimeout(timer)
  }, [mode, color])

  if (!wash) return null

  return (
    <div
      key={wash.key}
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
      aria-hidden
    >
      <div className="mode-wash" style={{ '--wash': wash.color } as CSSProperties}>
        <span className="mode-wash-orb mode-wash-orb-a" />
        <span className="mode-wash-orb mode-wash-orb-b" />
        <span className="mode-wash-orb mode-wash-orb-c" />
      </div>
    </div>
  )
}
