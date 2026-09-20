import { Check, MapPin } from 'lucide-react'
import { Sheet } from '@/components/ui/sheet'
import { places } from '@/data/places'
import { cn } from '@/lib/cn'

interface PlacePickerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  selectedId: string
  excludeId?: string
  onSelect: (id: string) => void
}

/**
 * Full-width list rows instead of a native <select>: every option is a 60px
 * target with its own plain-language hint, which a native select cannot show.
 */
export function PlacePicker({
  open,
  onOpenChange,
  title,
  selectedId,
  excludeId,
  onSelect,
}: PlacePickerProps) {
  const options = places.filter((place) => place.id !== excludeId)

  return (
    <Sheet open={open} onOpenChange={onOpenChange} title={title}>
      <ul className="grid gap-2">
        {options.map((place) => {
          const active = place.id === selectedId
          return (
            <li key={place.id}>
              <button
                type="button"
                onClick={() => {
                  onSelect(place.id)
                  onOpenChange(false)
                }}
                aria-current={active ? 'true' : undefined}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left',
                  active
                    ? 'neu-sunken-sm neu-scope-accent'
                    : 'neu-row',
                )}
              >
                <MapPin
                  size={18}
                  aria-hidden
                  className={active ? 'text-accent-ink' : 'text-muted'}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-base font-medium text-ink">
                    {place.name}
                  </span>
                  <span className="block truncate text-sm text-muted">
                    {place.hint}
                  </span>
                </span>
                {active ? (
                  <Check size={18} className="shrink-0 text-accent-ink" aria-hidden />
                ) : null}
              </button>
            </li>
          )
        })}
      </ul>
    </Sheet>
  )
}
