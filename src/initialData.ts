import type { TravelState } from './types'

export const MEMBER_COLORS = [
  '#C24B3A', // A: えんじ
  '#246482', // B: あい色
  '#2D6E4F', // C: ふかみどり
  '#714F7A', // D: ぶどう
  '#B87A24', // E: からし
  '#A54B66', // F: あかね
  '#2E736A', // G: せいじ
  '#4A5A82', // H: こんじょう
]

export const MEMBER_BADGES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']

export function createInitialState(): TravelState {
  return {
    destination: '',
    members: [],
    consensusSpots: [],
    mustGoByMember: {},
    aiZeroSuggestions: null,
    aiConflictResult: null,
    aiTravelPlan: null,
  }
}
