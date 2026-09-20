import { Link, Outlet } from 'react-router-dom'
import { BottomDock } from '@/components/navigation/BottomDock'
import { DemoMenu } from '@/components/navigation/DemoMenu'
import { ModeTag } from '@/components/navigation/ModeTag'
import { ThemeToggle } from '@/components/navigation/ThemeToggle'
import { useLiveJourney } from '@/hooks/useLiveJourney'

export function AppShell() {
  const { progress, color } = useLiveJourney()

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-[var(--bg-color)] text-ink">
      {/* Journey progress. A glowing rail. */}
      <div className="fixed right-2 md:right-4 top-1/2 -translate-y-1/2 z-50 h-[30vh] min-h-[200px] w-1.5 bg-[rgba(255,255,255,0.05)] rounded-full">
        <div
          className="w-full rounded-full transition-all duration-500 ease-out shadow-[var(--glow-accent)] absolute bottom-0"
          style={{ height: `${Math.round(progress * 100)}%`, backgroundColor: color }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-4 bg-white blur-[2px] rounded-full" />
        </div>
      </div>

      <a href="#main" className="skip-link">
        Skip to journey planner
      </a>

      {/* Pages reserve --header-h at the top rather than guessing an offset. */}
      <header
        className="pointer-events-none fixed inset-x-0 top-0 z-30 px-3 md:px-5 bg-gradient-to-b from-[var(--bg-color)] to-transparent"
        style={{ paddingTop: 'calc(10px + env(safe-area-inset-top))', paddingBottom: '30px' }}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <Link
              to="/"
              className="tap pointer-events-auto flex items-center gap-3 rounded-full pr-3 pl-1"
            >
              <span className="neu-raised-sm grid size-10 shrink-0 place-items-center rounded-full font-display text-[14px] font-extrabold tracking-tighter text-accent-ink border border-accent shadow-[var(--glow-accent)]">
                SY
              </span>
              <span className="text-sm font-bold tracking-[0.2em] text-ink">
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
