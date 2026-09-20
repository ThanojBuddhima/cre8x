import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function modeLabel(mode: string) {
  if (mode === 'bus') return 'Autonomous bus'
  if (mode === 'pod') return 'Autonomous pod'
  if (mode === 'rail') return 'Autonomous rail'
  if (mode === 'air') return 'Air shuttle'
  return 'Walk'
}

export function parseClock(value: string) {
  const [hours, minutes] = value.split(':').map(Number)
  return hours * 60 + minutes
}

export function formatClock(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60) % 24
  const minutes = totalMinutes % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}
