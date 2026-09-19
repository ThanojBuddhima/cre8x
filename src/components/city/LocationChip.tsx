import { getPlace } from '@/data/places'
import { currentLeg, nextLeg } from '@/components/live/LiveHud'
import { useSynqStore } from '@/store/useSynqStore'
import type { Journey } from '@/types'

function shortMode(mode: string) {
  if (mode === 'pod') return 'Pod'
  if (mode === 'rail') return 'Rail'
  if (mode === 'air') return 'Air'
  return 'Walk'
}

export function LocationChip({
  journey,
  progress = 0,
}: {
  journey?: Journey
  progress?: number
}) {
  const originId = useSynqStore((s) => s.intent.originId)
  const here = journey
    ? getPlace(currentLeg(journey, progress).fromId)
    : getPlace(originId)
  const upcoming = journey ? nextLeg(journey, progress) : undefined
  const now = journey ? currentLeg(journey, progress) : undefined

  const line = journey && now
    ? upcoming
      ? `You are here: ${here.shortName} · ${shortMode(now.mode)}`
      : `You are here: ${here.shortName} · last walk`
    : `You are here: ${here.shortName}`

  return (
    <div className="pointer-events-auto glass max-w-[min(100%,16rem)] rounded-full px-3 py-2 text-sm text-paper md:max-w-[20rem]">
      <p className="truncate font-medium leading-tight">{line}</p>
    </div>
  )
}
