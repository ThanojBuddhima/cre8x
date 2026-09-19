import type { ReactNode } from 'react'

export function MapSplitLayout({
  map,
  overlay,
  sheet,
}: {
  map: ReactNode
  overlay?: ReactNode
  sheet?: ReactNode
}) {
  return (
    <main
      id="main"
      data-map-underlayer=""
      className="relative h-dvh overflow-hidden"
    >
      <div className="absolute inset-0 z-0 h-full w-full">{map}</div>
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col md:block">
        <div
          className={
            sheet
              ? 'relative min-h-[50dvh] flex-1 md:absolute md:inset-0 md:min-h-0'
              : 'relative min-h-0 flex-1 md:absolute md:inset-0'
          }
        >
          {overlay}
        </div>
        {sheet ? (
          <div className="pointer-events-auto relative z-20 h-auto max-h-[50dvh] shrink-0 overflow-y-auto overscroll-contain bg-transparent pb-[var(--dock-h)] md:absolute md:bottom-[calc(var(--dock-h)+8px)] md:left-8 md:max-h-[calc(100dvh-6rem-var(--dock-h))] md:w-[min(100%,26rem)] md:overflow-visible md:pb-0">
            {sheet}
          </div>
        ) : null}
      </div>
    </main>
  )
}
