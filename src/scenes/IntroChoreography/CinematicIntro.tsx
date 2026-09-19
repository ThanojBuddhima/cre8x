import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { QualityGate } from '@/components/3d/QualityGate'
import { Button } from '@/components/ui/button'
import { useSynqStore } from '@/store/useSynqStore'

const beats = [
  {
    at: 0,
    kicker: 'YEAR 2100',
    title: 'The city doesn’t wait for you.',
    body: 'It moves with you.',
  },
  {
    at: 0.22,
    kicker: 'GROUND',
    title: 'Shared pods replaced the private car.',
    body: 'You no longer drive. You ask to arrive.',
  },
  {
    at: 0.44,
    kicker: 'RAIL',
    title: 'The spine of the coast is autonomous rail.',
    body: 'It stays above the flood line on a wet morning.',
  },
  {
    at: 0.66,
    kicker: 'AIR',
    title: 'Air is rare, and used when it matters.',
    body: 'Energy is a decision, not a default.',
  },
  {
    at: 0.86,
    kicker: 'ONE NETWORK',
    title: 'Where do you need to go?',
    body: 'SYNQ coordinates the rest.',
  },
]

export function CinematicIntro() {
  const root = useRef<HTMLDivElement>(null)
  const setIntroProgress = useSynqStore((s) => s.setIntroProgress)
  const setIntroComplete = useSynqStore((s) => s.setIntroComplete)
  const progress = useSynqStore((s) => s.introProgress)
  const active =
    [...beats].reverse().find((beat) => progress >= beat.at) ?? beats[0]

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const element = root.current
    if (!element) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: element,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        onUpdate: (self) => setIntroProgress(self.progress),
      })
    }, element)

    return () => ctx.revert()
  }, [setIntroProgress])

  return (
    <div ref={root} className="relative h-[460vh] bg-ink">
      <div className="sticky top-0 h-dvh overflow-hidden">
        <QualityGate variant="intro" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/40" />
        <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-24 pt-20 md:px-12">
          <p className="text-xs tracking-[0.28em] text-accent">{active.kicker}</p>
          <h1 className="mt-3 max-w-xl font-serif text-4xl leading-tight md:text-6xl">
            {active.title}
          </h1>
          <p className="mt-3 max-w-md text-base text-muted md:text-lg">
            {active.body}
          </p>
          {progress > 0.84 ? (
            <Button className="mt-8 w-fit" onClick={() => setIntroComplete(true)}>
              Begin
            </Button>
          ) : null}
        </div>
        <button
          type="button"
          className="glass absolute top-4 right-4 z-20 h-11 rounded-full px-4 text-sm"
          onClick={() => setIntroComplete(true)}
        >
          Skip intro
        </button>
      </div>
    </div>
  )
}
