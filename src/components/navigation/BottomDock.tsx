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
      <div className="pointer-events-auto glass flex w-full max-w-sm gap-1 rounded-full p-1 md:w-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const active = isTabActive(tab.id)
          return (
            <NavLink
              key={tab.id}
              to={tab.to}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex min-h-11 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-full px-4 py-1.5 text-[11px] font-medium tracking-[0.08em] md:min-w-[5.5rem]',
                active
                  ? 'bg-accent text-on-accent shadow-[0_0_22px_color-mix(in_srgb,var(--glow)_55%,transparent)]'
                  : 'text-dim hover:text-paper',
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
