import type { Place } from '@/types'

export const places: Place[] = [
  {
    id: 'fort',
    name: 'Colombo Fort Hub',
    shortName: 'Fort',
    kind: 'hub',
    hint: 'Your usual start',
    lat: 6.9344,
    lng: 79.8428,
  },
  {
    id: 'bambalapitiya',
    name: 'Bambalapitiya Interchange',
    shortName: 'Bambalapitiya',
    kind: 'interchange',
    hint: 'Rail and air meet here',
    lat: 6.889,
    lng: 79.8564,
  },
  {
    id: 'ratmalana',
    name: 'Ratmalana Vertiport',
    shortName: 'Ratmalana',
    kind: 'vertiport',
    hint: 'Last hop to campus',
    lat: 6.8214,
    lng: 79.8861,
  },
  {
    id: 'kdu',
    name: 'KDU Campus',
    shortName: 'KDU',
    kind: 'campus',
    hint: 'Arrive before class',
    lat: 6.8176,
    lng: 79.8863,
  },
  {
    id: 'home',
    name: 'Home · Nugegoda',
    shortName: 'Home',
    kind: 'interchange',
    hint: 'Your saved home address',
    lat: 6.8649,
    lng: 79.8997,
  },
  {
    id: 'airport',
    name: 'Katunayake Airport',
    shortName: 'Airport',
    kind: 'vertiport',
    hint: 'Air and rail interchange',
    lat: 7.1808,
    lng: 79.8841,
  },
]

export function getPlace(id: string): Place {
  return places.find((place) => place.id === id) ?? places[0]!
}
