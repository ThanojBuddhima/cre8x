import { Link, Outlet } from 'react-router-dom'
import { BottomDock } from '@/components/navigation/BottomDock'
import { DemoMenu } from '@/components/navigation/DemoMenu'
import { ModeTag } from '@/components/navigation/ModeTag'
import { ThemeToggle } from '@/components/navigation/ThemeToggle'
import { useLiveJourney } from '@/hooks/useLiveJourney'

export function AppShell() {
  const { progress, color } = useLiveJourney()

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-[var(--neu-surface)] text-ink">
      {/* Journey progress. A sunken rail so the fill reads as sitting in a
          groove rather than floating on the page edge. */}
      <div className="neu-sunken-sm fixed inset-x-0 top-0 z-50 h-1.5">
        <div
          className="h-full rounded-r-full transition-all duration-500 ease-out"
          style={{ width: `${Math.round(progress * 100)}%`, backgroundColor: color }}
        />
      </div>

      <a href="#main" className="skip-link">
        Skip to journey planner
      </a>

      {/* Pages reserve --header-h at the top rather than guessing an offset. */}
      <header
        className="pointer-events-none absolute inset-x-0 top-0 z-30 px-3 md:px-5"
        style={{ paddingTop: 'calc(10px + env(safe-area-inset-top))' }}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <Link
              to="/"
              className="tap pointer-events-auto flex items-center gap-2 rounded-full pr-2"
            >
              <span className="neu-raised-sm grid size-9 shrink-0 place-items-center rounded-full font-display text-xs font-extrabold tracking-tight text-accent-ink">
                SY
              </span>
              <span className="text-sm font-bold tracking-[0.18em] text-ink">
                SYNQ
              </span>
            </Link>
            <span className="max-[399px]:hidden">
              <ModeTag />
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <DemoMenu />
          </div>
        </div>
      </header>

      <Outlet />
      <BottomDock />
    </div>
  )
}
