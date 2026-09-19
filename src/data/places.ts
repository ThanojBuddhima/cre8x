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
]

export function getPlace(id: string): Place {
  return places.find((place) => place.id === id) ?? places[0]!
}
