import { Link, Outlet, useLocation } from 'react-router-dom'
import { DemoMenu } from '@/components/navigation/DemoMenu'
import { useSynqStore } from '@/store/useSynqStore'

export function AppShell() {
  const location = useLocation()
  const introComplete = useSynqStore((s) => s.introComplete)
  const showChrome = introComplete || location.pathname !== '/'

  return (
    <div className="relative min-h-dvh bg-ink text-paper">
      <a href="#main" className="skip-link">
        Skip to journey planner
      </a>
      {showChrome ? (
        <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between p-4 md:p-5">
          <Link
            to="/"
            className="pointer-events-auto flex h-11 items-center gap-2 rounded-full px-1"
          >
            <span className="grid size-8 place-items-center rounded-full border border-accent/40 bg-accent-dim text-xs font-semibold text-accent">
              S
            </span>
            <span className="text-sm tracking-[0.18em] text-paper">SYNQ</span>
          </Link>
          <DemoMenu />
        </header>
      ) : null}
      <Outlet />
    </div>
  )
}
