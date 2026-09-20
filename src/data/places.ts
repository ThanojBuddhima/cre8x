import type { Place } from '@/types'

export const places: Place[] = [
  {
    id: 'fort',
    name: 'Colombo Fort Hub',
    shortName: 'Fort',
    kind: 'hub',
    hint: 'Your usual start',
  },
  {
    id: 'bambalapitiya',
    name: 'Bambalapitiya Interchange',
    shortName: 'Bambalapitiya',
    kind: 'interchange',
    hint: 'Rail and air meet here',
  },
  {
    id: 'ratmalana',
    name: 'Ratmalana Vertiport',
    shortName: 'Ratmalana',
    kind: 'vertiport',
    hint: 'Last hop to campus',
  },
  {
    id: 'kdu',
    name: 'KDU Campus',
    shortName: 'KDU',
    kind: 'campus',
    hint: 'Arrive before class',
  },
  {
    id: 'home',
    name: 'Home · Nugegoda',
    shortName: 'Home',
    kind: 'interchange',
    hint: 'Your saved home address',
  },
  {
    id: 'airport',
    name: 'Katunayake Airport',
    shortName: 'Airport',
    kind: 'vertiport',
    hint: 'Air and rail interchange',
  },
]

export function getPlace(id: string): Place {
  return places.find((place) => place.id === id) ?? places[0]!
}
