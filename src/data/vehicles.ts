import type { CorridorInfo, VehicleInfo } from '@/types'

export const vehicles: VehicleInfo[] = [
  {
    id: 'pod-a12',
    name: 'Pod A-12',
    mode: 'pod',
    status: 'Active',
    destination: 'Bambalapitiya',
    eta: '08:04',
    capacity: 42,
  },
  {
    id: 'rail-07',
    name: 'Rail 07',
    mode: 'rail',
    status: 'Active',
    destination: 'Ratmalana',
    eta: '08:16',
    capacity: 64,
  },
  {
    id: 'air-c3',
    name: 'Air Shuttle C3',
    mode: 'air',
    status: 'Holding',
    destination: 'KDU',
    eta: '08:16',
    capacity: 71,
  },
]

export const corridors: CorridorInfo[] = [
  {
    id: 'coastal-04',
    name: 'Coastal Road 04',
    status: 'Normal operation',
    congestion: 'Low',
    energy: '88%',
  },
  {
    id: 'rail-07',
    name: 'Rail Corridor 07',
    status: 'Normal operation',
    congestion: 'Low',
    energy: '91%',
  },
  {
    id: 'air-south',
    name: 'South Air Corridor',
    status: 'Open',
    congestion: 'Low',
    energy: '74%',
  },
]
