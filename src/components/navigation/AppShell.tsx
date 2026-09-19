import { Link, Outlet } from 'react-router-dom'
import { MapLegend } from '@/components/city/MapLegend'
import { BottomDock } from '@/components/navigation/BottomDock'
import { DemoMenu } from '@/components/navigation/DemoMenu'
import { ModeTag } from '@/components/navigation/ModeTag'
import { ModeWash } from '@/components/navigation/ModeWash'

export function AppShell() {
  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-ink text-paper">
      <a href="#main" className="skip-link">
        Skip to journey planner
      </a>
      <ModeWash />
      <header
        className="pointer-events-none absolute inset-x-0 top-0 z-30 px-3 md:px-5"
        style={{ paddingTop: 'calc(10px + env(safe-area-inset-top))' }}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <Link
              to="/"
              className="pointer-events-auto flex h-11 items-center gap-2 rounded-full px-1"
            >
              <span className="grid size-8 place-items-center rounded-full border border-accent/40 bg-accent-dim text-xs font-semibold text-accent">
                S
              </span>
              <span className="text-sm tracking-[0.18em] text-paper">SYNQ</span>
            </Link>
            <ModeTag />
          </div>
          <div className="flex items-center gap-2">
            <DemoMenu />
          </div>
        </div>
        <div className="mt-1 px-1">
          <MapLegend />
        </div>
      </header>
      <Outlet />
      <BottomDock />
    </div>
  )
}
