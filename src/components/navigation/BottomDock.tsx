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

  return (
    <nav
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-3"
      style={{ paddingBottom: 'calc(10px + env(safe-area-inset-bottom))' }}
      aria-label="Main screens"
    >
      {/* The dock is the raised plane; the active tab is sunken into it.
          Same pressed language as Chip, and it replaces the last neon glow
          left over from the glassmorphism pass. */}
      <div className="neu-raised pointer-events-auto flex w-full max-w-sm gap-1 rounded-full p-1.5 md:w-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const active = isTabActive(tab.id)
          return (
            <NavLink
              key={tab.id}
              to={tab.to}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex min-h-11 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-full px-4 py-1.5 text-[11px] font-bold tracking-[0.08em]',
                'transition-[box-shadow,color] duration-[var(--dur-ui)] ease-[var(--ease-out)] md:min-w-[5.5rem]',
                active
                  ? 'shadow-[var(--neu-in-1)] text-accent-ink'
                  : 'text-muted hoverable:text-ink',
              )}
            >
              <Icon size={16} strokeWidth={2.2} aria-hidden />
              {tab.label}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
