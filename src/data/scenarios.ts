import type { CityStatus, DemoScenario } from '@/types'

export const cityByScenario: Record<DemoScenario, CityStatus> = {
  normal: {
    weatherLabel: 'Clear morning',
    weatherDetail: 'Light haze. Network is calm.',
    networkHealth: 'Stable',
    alert: null,
  },
  rain: {
    weatherLabel: 'Heavy rain',
    weatherDetail: 'Coastal Road 04 is at flood risk.',
    networkHealth: 'Rerouting',
    alert: 'I’ve avoided a flood-risk area.',
  },
  emergency: {
    weatherLabel: 'Storm warning',
    weatherDetail: 'Hospital corridors have priority.',
    networkHealth: 'Priority mode',
    alert: 'Emergency corridors are open. Your trip still runs.',
  },
}
