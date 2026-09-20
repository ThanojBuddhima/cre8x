import type { CityStatus, DemoScenario } from '@/types'

export const cityByScenario: Record<DemoScenario, CityStatus> = {
  normal: {
    weatherLabel: 'Clear morning',
    weatherDetail: 'Light haze. Network is calm.',
    networkHealth: 'Stable',
    alert: null,
    metrics: [
      { id: 'road', label: 'Road load', value: 23 },
      { id: 'rail', label: 'Rail load', value: 12 },
      { id: 'air', label: 'Air corridor load', value: 18 },
      { id: 'energy', label: 'Energy reserve', value: 91, higherIsBetter: true },
      { id: 'flood', label: 'Flood risk', value: 8 },
    ],
  },
  rain: {
    weatherLabel: 'Heavy rain',
    weatherDetail: 'Coastal Road 04 is at flood risk.',
    networkHealth: 'Rerouting',
    alert: 'I’ve avoided a flood-risk area.',
    metrics: [
      { id: 'road', label: 'Road load', value: 78 },
      { id: 'rail', label: 'Rail load', value: 34 },
      { id: 'air', label: 'Air corridor load', value: 72 },
      { id: 'energy', label: 'Energy reserve', value: 84, higherIsBetter: true },
      { id: 'flood', label: 'Flood risk', value: 71 },
    ],
  },
  emergency: {
    weatherLabel: 'Storm warning',
    weatherDetail: 'Hospital corridors have priority.',
    networkHealth: 'Priority mode',
    alert: 'Emergency corridors are open. Your trip still runs.',
    metrics: [
      { id: 'road', label: 'Road load', value: 66 },
      { id: 'rail', label: 'Rail load', value: 22 },
      { id: 'air', label: 'Air corridor load', value: 54 },
      { id: 'energy', label: 'Energy reserve', value: 77, higherIsBetter: true },
      { id: 'flood', label: 'Flood risk', value: 58 },
    ],
  },
}
