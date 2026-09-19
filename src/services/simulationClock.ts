export interface SimulationHandle {
  stop: () => void
}

export function startSimulationClock(
  onTick: (progress: number) => void,
  durationMs = 36000,
): SimulationHandle {
  let frame = 0
  let stopped = false
  const start = performance.now()

  const loop = (now: number) => {
    if (stopped) return
    const elapsed = Math.max(0, now - start)
    const progress = Math.min(1, elapsed / durationMs)
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
