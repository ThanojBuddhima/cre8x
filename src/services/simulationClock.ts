export interface SimulationHandle {
  stop: () => void
}

export function startSimulationClock(
  onTick: (progress: number) => void,
  durationMs = 36000,
  fromProgress = 0,
): SimulationHandle {
  let frame = 0
  let stopped = false
  const start = performance.now()
  const remaining = Math.max(16, durationMs * (1 - fromProgress))

  const loop = (now: number) => {
    if (stopped) return
    const elapsed = Math.max(0, now - start)
    const local = Math.min(1, elapsed / remaining)
    const progress = Math.min(1, fromProgress + local * (1 - fromProgress))
    onTick(progress)
    if (progress < 1) {
      frame = requestAnimationFrame(loop)
    }
  }

  frame = requestAnimationFrame(loop)
  return {
    stop: () => {
      stopped = true
      cancelAnimationFrame(frame)
    },
  }
}
