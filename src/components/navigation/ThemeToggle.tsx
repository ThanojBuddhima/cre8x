import { Moon, Sun } from 'lucide-react'
import { useSynqStore } from '@/store/useSynqStore'

export function ThemeToggle() {
  const theme = useSynqStore((s) => s.theme)
  const setTheme = useSynqStore((s) => s.setTheme)
  const next = theme === 'light' ? 'dark' : 'light'

  return null
}
