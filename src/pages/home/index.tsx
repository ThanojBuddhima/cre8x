import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronDown, ArrowRight } from 'lucide-react'
import { IntentCard } from '@/components/journey/IntentCard'
import { JourneyList } from '@/components/journey/JourneyList'
import { getPlace } from '@/data/places'
import { useSynqStore } from '@/store/useSynqStore'
import { QualityGate } from '@/components/3d/map/QualityGate'
import { CityStatusChip } from '@/components/city/CityStatusChip'

const narrativeSections = [
  {
    title: 'One connected network',
    desc: 'Ground, rail, and air mobility working together in perfect harmony. Tell SYNQ where you need to go, and the city coordinates the rest.',
    image: '/images/hero_city.jpg',
  },
  {
    title: 'Ground mobility',
    desc: 'Driverless buses and smart-road pods move efficiently through the city, optimizing routes dynamically based on real-time traffic.',
    image: '/images/smart_pod.jpg',
  },
  {
    title: 'Elevated rail',
    desc: 'Autonomous high-speed trains carry passengers rapidly across long corridors, linking major transportation hubs seamlessly.',
    image: '/images/autonomous_rail.jpg',
  },
  {
    title: 'Urban air mobility',
    desc: 'Electric air shuttles bypass ground congestion when time is critical or flood risks block conventional roads.',
    image: '/images/air_shuttle.jpg',
  },
  {
    title: 'Intelligent routing',
    desc: 'The network automatically adjusts to weather conditions, congestion, and your accessibility requirements to find the best path.',
    image: '/images/hero_city.jpg',
  },
]

export function LandingHome() {
  const intent = useSynqStore((s) => s.intent)
  const setIntroProgress = useSynqStore((s) => s.setIntroProgress)
  const calmMode = useSynqStore((s) => s.calmMode)
  const [planned, setPlanned] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (calmMode || !scrollRef.current) return
    gsap.registerPlugin(ScrollTrigger)

    // Gated to lg: the 3D camera this drives sits inside a `hidden lg:block`
    // aside, so on phones every scroll frame was writing to the store to move
    // a camera nobody can see. matchMedia also re-runs on resize, which
    // ScrollTrigger needs anyway when its scroller changes size.
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px)', () => {
      const trigger = ScrollTrigger.create({
        trigger: scrollRef.current,
        scroller: scrollRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        onUpdate: (self) => {
          setIntroProgress(self.progress)
        },
      })
      return () => trigger.kill()
    })

    return () => mm.revert()
  }, [calmMode, setIntroProgress])

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-[var(--neu-surface)]">
      {/* Left scrolling column. Reserves the dock height so the closing CTA
          is not sitting underneath the fixed nav. */}
      <main
        ref={scrollRef}
        className="custom-scrollbar h-full w-full overflow-y-auto scroll-smooth pb-[var(--dock-h)] lg:w-[55%] lg:pb-0"
        id="main"
      >
        <section
          className="relative flex min-h-[100dvh] flex-col justify-center px-6 pb-32 md:px-12 xl:px-20"
          style={{ paddingTop: 'calc(var(--header-h) + 2.5rem)' }}
        >
          <div className="mx-auto w-full max-w-xl lg:mx-0">
            <p className="mb-5 text-[11px] font-bold uppercase tracking-widest text-muted">
              Transportation 2100
            </p>
            <h1 className="mb-6 text-balance font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl md:text-6xl lg:text-7xl">
              Your next journey, reimagined.
            </h1>
            <p className="mb-10 max-w-md text-lg font-medium text-muted">
              One intelligent network connecting every destination across
              ground, rail, air, and beyond.
            </p>

            {/* Deliberately flat. This is the primary content region, already
                the canvas colour - giving it a shadow spent a depth level and
                pushed everything nested inside it past the two-plane budget. */}
            <div className="relative z-10">
              {planned ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="mb-8 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted">
                        Your route options
                      </p>
                      <h2 className="mt-2 truncate font-display text-2xl font-bold tracking-tight text-ink">
                        {getPlace(intent.originId).shortName} to{' '}
                        {getPlace(intent.destinationId).shortName}
                      </h2>
                    </div>
                    <button
                      type="button"
                      className="neu-pressable-sm h-11 shrink-0 rounded-lg px-4 text-sm font-bold text-accent-ink"
                      onClick={() => setPlanned(false)}
                    >
                      Edit
                    </button>
                  </div>
                  <div className="neu-sunken rounded-2xl p-4">
                    <JourneyList />
                  </div>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <IntentCard compact onPlanned={() => setPlanned(true)} />
                </div>
              )}
            </div>

            <div className="mt-12 flex items-center justify-center gap-3 text-muted lg:justify-start">
              <span className="text-xs font-bold uppercase tracking-widest">
                Explore Network
              </span>
              <div className="neu-raised-sm grid size-8 place-items-center rounded-full motion-safe:animate-bounce">
                <ChevronDown size={14} className="text-accent-ink" />
              </div>
            </div>

            {/* Was absolutely positioned at the same offset as the page logo
                and collided with it on narrow screens. It is a panel, not a
                chip, so it belongs in the flow. */}
            <div className="mt-12 lg:max-w-sm">
              <CityStatusChip />
            </div>
          </div>
        </section>

        {narrativeSections.map((section, idx) => (
          <section
            key={section.title}
            className="relative flex min-h-[70dvh] flex-col justify-center px-6 py-24 md:px-12 md:py-32 xl:px-20"
          >
            <div className="mx-auto w-full max-w-xl lg:mx-0">
              <div className="mb-6 inline-flex items-center gap-3">
                <div className="neu-sunken-sm grid size-8 place-items-center rounded-full text-sm font-bold text-accent-ink">
                  0{idx + 1}
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-muted">
                  {section.title}
                </span>
              </div>
              <h2 className="mb-6 text-balance font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl md:text-5xl">
                {section.title}
              </h2>
              <p className="mb-10 text-lg font-medium leading-relaxed text-muted">
                {section.desc}
              </p>

              {/* neu-well-media, not a plain inset: an inset shadow paints
                  behind its own content, so a well holding an opaque image
                  showed nothing but the 8px of padding around it. */}
              <div className="neu-well-media w-full overflow-hidden rounded-2xl p-2 lg:hidden">
                <img
                  src={section.image}
                  alt={section.title}
                  loading="lazy"
                  className="aspect-video w-full rounded-xl object-cover"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              </div>
            </div>
          </section>
        ))}

        <section className="flex min-h-[50dvh] flex-col items-center justify-center px-6 py-24 text-center md:px-12 md:py-32 xl:px-20">
          <h2 className="mb-10 text-balance font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Ready to travel?
          </h2>
          <button
            onClick={() => {
              document
                .getElementById('main')
                ?.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="neu-pressable neu-scope-accent inline-flex h-14 items-center gap-3 rounded-xl px-8 font-bold text-accent-ink"
          >
            Plan my journey <ArrowRight size={18} />
          </button>
        </section>
      </main>

      {/* Right column: a single sunken well holding the scene. */}
      <aside className="relative hidden h-full w-[45%] p-8 lg:block">
        <div className="neu-well-media relative h-full w-full overflow-hidden rounded-3xl">
          <div className="absolute inset-0 z-0 p-2">
            <img
              src="/images/hero_city.jpg"
              className="h-full w-full rounded-2xl object-cover opacity-90"
              alt="Future City"
            />
          </div>
          <div className="absolute inset-0 z-[1] p-2">
            <div className="h-full w-full overflow-hidden rounded-2xl">
              <QualityGate variant="intro" />
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}
