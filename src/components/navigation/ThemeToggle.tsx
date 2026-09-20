import { Moon, Sun } from 'lucide-react'
import { useSynqStore } from '@/store/useSynqStore'

export function ThemeToggle() {
  const theme = useSynqStore((s) => s.theme)
  const setTheme = useSynqStore((s) => s.setTheme)
  const next = theme === 'light' ? 'dark' : 'light'

  return (
    <button
      type="button"
      className="neu-pressable-sm pointer-events-auto grid size-11 place-items-center rounded-full text-muted hoverable:text-accent-ink"
      onClick={() => setTheme(next)}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  )
}
