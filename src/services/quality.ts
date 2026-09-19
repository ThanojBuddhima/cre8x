import type { QualityLevel } from '@/types'

export function detectQuality(): QualityLevel {
  if (typeof window === 'undefined') return 'MEDIUM'

  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
    if (!gl) return 'FALLBACK'
  } catch {
    return 'FALLBACK'
  }

  const connection = (
    navigator as Navigator & {
      connection?: { saveData?: boolean }
    }
  ).connection
  const mobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
  const cores = navigator.hardwareConcurrency ?? 4
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (connection?.saveData) return 'LOW'
  if (reduced) return 'LOW'
  if (mobile && cores <= 4) return 'LOW'
  if (mobile) return 'MEDIUM'
  if (cores <= 4) return 'MEDIUM'
  return 'HIGH'
}

export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
