import * as Dialog from '@radix-ui/react-dialog'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'

interface SheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: ReactNode
}

export function Sheet({ open, onOpenChange, title, children }: SheetProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-ink/50 backdrop-blur-[2px]" />
        <Dialog.Content
          className={cn(
            'neu-raised pointer-events-auto fixed inset-x-0 bottom-0 z-50 max-h-[88dvh] overflow-y-auto rounded-t-2xl p-5',
            'pb-[calc(1.25rem+env(safe-area-inset-bottom))]',
            'md:inset-auto md:top-1/2 md:bottom-auto md:left-1/2 md:w-[420px] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl md:pb-5',
          )}
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <Dialog.Title className="text-base font-bold text-ink">
              {title}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                className="neu-pressable-sm grid size-11 shrink-0 place-items-center rounded-full text-muted hoverable:text-ink"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
