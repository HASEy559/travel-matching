import { createInitialState, MEMBER_BADGES, MEMBER_COLORS } from './initialData'
import type { Member, StepId, TravelState } from './types'

const STORAGE_KEY = 'travel-matching-state-v3'

function sanitizeMembers(members: Member[]): Member[] {
  return members.map((m) => {
    const rawProfile = m.profile as
      | {
          selectedCardIds?: unknown
          customCards?: unknown
          aiSuggestedCards?: unknown
        }
      | undefined

    return {
      ...m,
      destinations: Array.isArray(m.destinations) ? m.destinations : [],
      profile: {
        selectedCardIds: Array.isArray(rawProfile?.selectedCardIds)
          ? rawProfile.selectedCardIds.filter((id): id is string => typeof id === 'string')
          : [],
        customCards: Array.isArray(rawProfile?.customCards) ? rawProfile.customCards : [],
        aiSuggestedCards: Array.isArray(rawProfile?.aiSuggestedCards)
          ? rawProfile.aiSuggestedCards
          : [],
      },
    }
  })
}

export function loadTravelState(): TravelState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return createInitialState()
    }
    const parsed = JSON.parse(raw) as Partial<TravelState>
    if (typeof parsed.destination === 'string' && Array.isArray(parsed.members)) {
      return {
        destination: parsed.destination,
        members: sanitizeMembers(parsed.members),
        consensusSpots: Array.isArray(parsed.consensusSpots) ? parsed.consensusSpots : [],
        mustGoByMember:
          parsed.mustGoByMember && typeof parsed.mustGoByMember === 'object'
            ? parsed.mustGoByMember
            : {},
        aiZeroSuggestions: parsed.aiZeroSuggestions ?? null,
        aiConflictResult: parsed.aiConflictResult ?? null,
        aiTravelPlan: parsed.aiTravelPlan ?? null,
      }
    }
    return createInitialState()
  } catch {
    return createInitialState()
  }
}

export function saveTravelState(state: TravelState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ストレージ容量超過やプライベートモードでは無視
  }
}

export function resetTravelState(): TravelState {
  const initial = createInitialState()
  saveTravelState(initial)
  return initial
}

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

export function buildShareUrl(state: TravelState): string {
  const url = new URL(window.location.href)
  url.search = ''
  url.hash = ''
  url.searchParams.set('step', '2')
  if (state.destination.trim()) {
    url.searchParams.set('dest', state.destination.trim())
  }
  if (state.members.length > 0) {
    url.searchParams.set('members', state.members.map((m) => m.name).join(','))
  }
  return url.toString()
}

export interface SharedInviteInit {
  state: TravelState
  initialStep: StepId
  isFromSharedLink: boolean
}

export function resolveInitialSession(): SharedInviteInit {
  const saved = loadTravelState()
  const params = new URLSearchParams(window.location.search)
  const destParam = params.get('dest')?.trim()
  const membersParam = params.get('members')?.trim()
  const stepParam = Number(params.get('step'))

  if (!destParam && !membersParam) {
    const validStep: StepId =
      stepParam === 2 || stepParam === 3 || stepParam === 4 || stepParam === 5 || stepParam === 6
        ? stepParam
        : 1
    return {
      state: saved,
      initialStep: validStep,
      isFromSharedLink: false,
    }
  }

  const nextDestination = destParam || saved.destination
  const memberNames = membersParam
    ? membersParam
        .split(',')
        .map((n) => n.trim())
        .filter(Boolean)
    : []

  const isSameGroup =
    saved.destination === nextDestination &&
    memberNames.length > 0 &&
    saved.members.length === memberNames.length &&
    saved.members.every((m, idx) => m.name === memberNames[idx])

  let nextState: TravelState
  if (isSameGroup) {
    nextState = saved
  } else if (memberNames.length > 0) {
    const existingByName = new Map(saved.members.map((m) => [m.name, m]))
    const nextMembers: Member[] = memberNames.map((name, idx) => {
      const reused = existingByName.get(name)
      if (reused && saved.destination === nextDestination) {
        return reused
      }
      return {
        id: `member-shared-${idx}-${name}`,
        name,
        badge: MEMBER_BADGES[idx] ?? name.slice(0, 1).toUpperCase(),
        color: MEMBER_COLORS[idx % MEMBER_COLORS.length],
        destinations: [],
        profile: {
          selectedCardIds: [],
          customCards: [],
          aiSuggestedCards: [],
        },
      }
    })
    nextState = {
      destination: nextDestination,
      members: nextMembers,
      consensusSpots: saved.destination === nextDestination ? saved.consensusSpots : [],
      mustGoByMember: saved.destination === nextDestination ? saved.mustGoByMember : {},
      aiZeroSuggestions: saved.destination === nextDestination ? saved.aiZeroSuggestions : null,
      aiConflictResult: saved.destination === nextDestination ? saved.aiConflictResult : null,
      aiTravelPlan: saved.destination === nextDestination ? saved.aiTravelPlan : null,
    }
  } else {
    nextState = {
      ...saved,
      destination: nextDestination,
    }
  }

  const nextStep: StepId =
    stepParam === 1 ||
    stepParam === 2 ||
    stepParam === 3 ||
    stepParam === 4 ||
    stepParam === 5 ||
    stepParam === 6
      ? stepParam
      : 2

  return {
    state: nextState,
    initialStep: nextStep,
    isFromSharedLink: true,
  }
}
