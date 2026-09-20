import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronDown } from 'lucide-react'
import { QualityGate } from '@/components/3d/map/QualityGate'
import { useSynqStore } from '@/store/useSynqStore'

const acts = [
  {
    id: 'ground',
    label: 'GROUND',
    line: 'Driverless buses and pods move along managed smart roads.',
  },
  {
    id: 'rail',
    label: 'RAIL',
    line: 'Autonomous trains carry the long corridors between hubs.',
  },
  {
    id: 'air',
    label: 'AIR',
    line: 'Short shuttles cross the city when time or flood risk demands it.',
  },
  {
    id: 'network',
    label: 'ONE NETWORK',
    line: 'You do not choose a mode. You say where you need to be.',
  },
]

/**
 * A four-act descent through the city's transport layers, driven by scroll.
 *
 * The canvas is held still with CSS `sticky` rather than ScrollTrigger's pin:
 * pinning rewrites the document flow and is the part that misbehaves on
 * phones, and this round is judged on mobile. ScrollTrigger is used only to
 * map scroll position onto the camera.
 */
export function CityIntro() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const introComplete = useSynqStore((s) => s.introComplete)
  const introProgress = useSynqStore((s) => s.introProgress)
  const setIntroProgress = useSynqStore((s) => s.setIntroProgress)
  const setIntroComplete = useSynqStore((s) => s.setIntroComplete)
  // Calm mode is set for reduced-motion users too, so it covers both cases.
  const calmMode = useSynqStore((s) => s.calmMode)

  // Decided once, at mount: flipping this mid-scroll would unmount the
  // section under the reader and make the page jump.
  const [skip] = useState(() => introComplete || calmMode)

  useEffect(() => {
    if (skip || !sectionRef.current) return

    gsap.registerPlugin(ScrollTrigger)
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
      onUpdate: (self) => {
        setIntroProgress(self.progress)
        // Scrolling all the way through counts as seeing it; coming back to
        // Home later goes straight to the planner.
        if (self.progress > 0.99) setIntroComplete(true)
      },
    })

    return () => trigger.kill()
  }, [skip, setIntroProgress, setIntroComplete])

  if (skip) return null

  const activeIndex = Math.min(
    acts.length - 1,
    Math.floor(introProgress * acts.length),
  )

  function enterApp() {
    setIntroComplete(true)
    setIntroProgress(1)
    document.getElementById('main')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div ref={sectionRef} className="relative h-[400vh]">
      <div className="sticky top-0 h-dvh overflow-hidden">
        <div className="absolute inset-0">
          <QualityGate variant="intro" />
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-transparent to-ink" />

        <div
          className="absolute inset-x-0 px-5"
          style={{ top: 'calc(7rem + env(safe-area-inset-top))' }}
        >
          <p className="text-xs font-medium tracking-[0.3em] text-accent">
            2100
          </p>
          <h1 className="mt-2 font-serif text-4xl leading-tight text-paper md:text-6xl">
            Your city is moving.
          </h1>
        </div>

        {/* Acts are stacked and cross-faded so nothing reflows as you scroll. */}
        <div className="absolute inset-x-0 bottom-[calc(var(--dock-h)+5rem)] px-5">
          <div className="relative h-28">
            {acts.map((act, index) => (
              <div
                key={act.id}
                className="absolute inset-0 transition-opacity duration-500 ease-[var(--ease-out)]"
                style={{ opacity: index === activeIndex ? 1 : 0 }}
              >
                <p className="text-sm font-medium tracking-[0.24em] text-accent">
                  {act.label}
                </p>
                <p className="mt-2 max-w-md text-lg leading-snug text-paper">
                  {act.line}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <div
              className="h-1 flex-1 overflow-hidden rounded-full bg-surface"
              role="img"
              aria-label={'Intro ' + Math.round(introProgress * 100) + '% through'}
            >
              <span
                className="block h-full rounded-full bg-accent"
                style={{ width: Math.round(introProgress * 100) + '%' }}
              />
            </div>
            <button
              type="button"
              onClick={enterApp}
              className="glass flex h-11 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-medium text-paper"
            >
              Skip to planner
              <ChevronDown size={16} aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
