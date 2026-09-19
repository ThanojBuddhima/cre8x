import type { AccessibilityProfile, DemoScenario, Journey, Preference } from '@/types'
import { journeys } from '@/data/journeys'

export interface PlanInput {
  originId: string
  destinationId: string
  arriveBy: string
  preference: Preference
  accessibility: AccessibilityProfile
  scenario: DemoScenario
  calmMode: boolean
}

function energyScore(level: Journey['energy']) {
  if (level === 'Low') return 3
  if (level === 'Medium') return 2
  return 1
}

function weatherPenalty(journey: Journey, scenario: DemoScenario) {
  if (scenario === 'normal') return 0
  if (journey.usesCoastalRoad) return 40
  if (journey.weatherRisk === 'High') return 24
  if (journey.weatherRisk === 'Medium') return 10
  return 0
}

function scoreJourney(journey: Journey, input: PlanInput) {
  let score = 50
  const accessNeed =
    input.preference === 'accessible' ||
    input.accessibility.wheelchair ||
    input.accessibility.fewerStairs

  if (input.preference === 'fastest') score += 40 - journey.durationMin
  if (input.preference === 'energy') score += energyScore(journey.energy) * 8
  if (input.preference === 'calm') score += 12 - journey.transfers * 4

  if (accessNeed) {
    score += journey.stairs === 0 ? 30 : -journey.stairs * 4
    score += journey.accessibleTransfers * 6
  } else if (input.preference === 'calm' && journey.id === 'j1') {
    score += 18
  }

  if (input.accessibility.withChild) score += journey.transfers <= 1 ? 8 : -4

  score -= weatherPenalty(journey, input.scenario)
  if (input.scenario === 'emergency' && journey.id === 'j2') score += 12
  return score
}

function withScenarioCopy(journey: Journey, input: PlanInput): Journey {
  if (input.scenario === 'normal') return { ...journey }

  if (journey.id === 'j1') {
    return {
      ...journey,
      weatherRisk: 'High',
      confidence: 'Medium',
      reasons: [
        'Coastal Road 04 is at flood risk this morning.',
        'I can still get you there, but another route is safer.',
        'You would arrive at 08:21 if the road stays open.',
      ],
    }
  }

  if (journey.id === 'j2') {
    return {
      ...journey,
      weatherRisk: 'Low',
      reasons: [
        'I avoided a flood-risk area.',
        '0 stairs and one level transfer.',
        'You still arrive before 08:30.',
      ],
    }
  }

  return {
    ...journey,
    weatherRisk: 'High',
    confidence: 'Low',
    reasons: [
      'Air may hold in heavy rain.',
      'Faster if the corridor stays open.',
      'I would not choose this in a storm unless you ask.',
    ],
  }
}

export function planJourneys(input: PlanInput): Journey[] {
  const pool = journeys.map((journey) => withScenarioCopy(journey, input))

  const ranked = [...pool].sort(
    (a, b) => scoreJourney(b, input) - scoreJourney(a, input),
  )

  const limited = input.calmMode ? ranked.slice(0, 2) : ranked.slice(0, 3)

  return limited.map((journey, index) => ({
    ...journey,
    recommended: index === 0,
    name: index === 0 ? 'Recommended' : journey.tag,
  }))
}

export function describePlan(input: PlanInput, journey: Journey) {
  if (input.scenario === 'rain' || input.scenario === 'emergency') {
    return `You’ll arrive at ${journey.arriveAt}. I avoided a flood-risk area.`
  }
  if (
    input.preference === 'accessible' ||
    input.accessibility.wheelchair ||
    input.accessibility.fewerStairs
  ) {
    return `You’ll arrive at ${journey.arriveAt}. ${journey.stairs} stairs · ${journey.accessibleTransfers} accessible transfer.`
  }
  return `You’ll arrive at ${journey.arriveAt}.`
}
