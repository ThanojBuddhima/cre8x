import { useEffect, useRef, useState } from 'react'
import { FileText, House, MapPinned } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { useSynqStore } from '@/store/useSynqStore'

export function BottomDock() {
  const selectedId = useSynqStore((s) => s.selectedJourneyId) ?? 'j1'
  const location = useLocation()

  const tabs = [
    { id: 'home', to: '/', label: 'Home', icon: House },
    {
      id: 'journey',
      to: `/journey/${selectedId}`,
      label: 'Journey',
      icon: FileText,
    },
    {
      id: 'map',
      to: `/live/${selectedId}`,
      label: 'Map',
      icon: MapPinned,
    },
  ] as const

  function isTabActive(id: string) {
    if (id === 'home') return location.pathname === '/'
    if (id === 'journey') return location.pathname.startsWith('/journey')
    return location.pathname.startsWith('/live')
  }

  const [isScrolling, setIsScrolling] = useState(false)
  const scrollTimeout = useRef<number | null>(null)

  useEffect(() => {
    function handleScroll() {
      setIsScrolling(true)
      if (scrollTimeout.current !== null) {
        window.clearTimeout(scrollTimeout.current)
      }
      scrollTimeout.current = window.setTimeout(() => {
        setIsScrolling(false)
      }, 300)
    }

    window.addEventListener('scroll', handleScroll, { capture: true, passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll, { capture: true })
      if (scrollTimeout.current !== null) {
        window.clearTimeout(scrollTimeout.current)
      }
    }
  }, [])

  return (
    <nav
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-3"
      style={{ paddingBottom: 'calc(10px + env(safe-area-inset-bottom))' }}
      aria-label="Main screens"
    >
      <div className={cn(
        "glass-card pointer-events-auto flex gap-1 rounded-[32px] p-2 backdrop-blur-[40px] bg-[rgba(10,14,23,0.6)] border-t border-[rgba(0,240,255,0.2)] shadow-[0_-10px_40px_-10px_rgba(0,240,255,0.1)] transition-all duration-300 ease-[var(--ease-spring)]",
        isScrolling ? "w-[60%] md:w-auto" : "w-full max-w-sm md:w-auto"
      )}>
        {tabs.map((tab) => {
          const Icon = tab.icon
          const active = isTabActive(tab.id)
          return (
            <NavLink
              key={tab.id}
              to={tab.to}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-full px-4 text-[10px] font-bold tracking-[0.1em] uppercase',
                'transition-all duration-[var(--dur-ui)] ease-[var(--ease-out)]',
                isScrolling ? 'min-h-[2.5rem] py-1 md:min-w-0' : 'min-h-12 py-2 md:min-w-[6rem]',
                active
                  ? 'text-accent-ink bg-[rgba(0,240,255,0.05)]'
                  : 'text-muted hoverable:text-ink hoverable:bg-[rgba(255,255,255,0.02)]',
              )}
            >
              <div className="relative flex items-center justify-center">
                <Icon size={18} strokeWidth={2.5} aria-hidden className="relative z-10" />
                {active && (
                  <div className="absolute inset-0 bg-accent blur-[8px] opacity-40 z-0" />
                )}
              </div>
              <span className={cn(
                "transition-all duration-300 ease-[var(--ease-spring)] overflow-hidden",
                isScrolling ? "h-0 opacity-0 m-0" : "h-[14px] opacity-100"
              )}>
                {tab.label}
              </span>
              {active && !isScrolling && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent rounded-full shadow-[var(--glow-accent)]" />
              )}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
