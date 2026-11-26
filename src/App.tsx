import { useEffect, useMemo, useRef, useState } from 'react'
import { ProfileView } from './components/ProfileView'
import { Step1SetupView } from './components/Step1SetupView'
import { Step2DestinationsView } from './components/Step2DestinationsView'
import { Step5ConsensusView } from './components/Step5ConsensusView'
import { Step6PlanView } from './components/Step6PlanView'
import { SummaryView } from './components/SummaryView'
import { MEMBER_BADGES, MEMBER_COLORS } from './initialData'
import { generateTravelPlan } from './services/aiFacilitator'
import { findExactSpotPhoto } from './spotCatalog'
import {
  buildShareUrl,
  generateId,
  resetTravelState,
  resolveInitialSession,
  saveTravelState,
} from './storage'
import type {
  AiConflictMediationResponse,
  AiZeroSuggestionsResponse,
  ConsensusSpot,
  DestinationCandidate,
  Member,
  StepId,
  TravelState,
} from './types'
import { ALL_VALUE_CARDS, generateRelatedSuggestions } from './valueCards'

const STEPS: { id: StepId; shortTitle: string }[] = [
  { id: 1, shortTitle: '設定' },
  { id: 2, shortTitle: '行き先' },
  { id: 3, shortTitle: '希望' },
  { id: 4, shortTitle: 'まとめ' },
  { id: 5, shortTitle: '合意' },
  { id: 6, shortTitle: '計画案' },
]

export default function App() {
  const initialSession = useMemo(() => resolveInitialSession(), [])
  const [state, setState] = useState<TravelState>(() => initialSession.state)
  const [currentStep, setCurrentStep] = useState<StepId>(() => initialSession.initialStep)
  const [isFromSharedLink, setIsFromSharedLink] = useState<boolean>(
    () => initialSession.isFromSharedLink,
  )
  const [activeMemberId, setActiveMemberId] = useState<string>(
    () => initialSession.state.members[0]?.id ?? '',
  )
  const [isGeneratingAi, setIsGeneratingAi] = useState(false)
  const [daysCount, setDaysCount] = useState<number>(2)
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false)
  const aiTimerRef = useRef<number | null>(null)

  useEffect(() => {
    saveTravelState(state)
  }, [state])

  useEffect(() => {
    return () => {
      if (aiTimerRef.current !== null) {
        window.clearTimeout(aiTimerRef.current)
      }
    }
  }, [])

  const shareUrl = useMemo(() => buildShareUrl(state), [state])
  const activeMember: Member | undefined =
    state.members.find((m) => m.id === activeMemberId) ?? state.members[0]

  const goToStep = (next: StepId) => {
    // 5画面目に移動した時点で、Step 2 の行き先が未同期なら自動で候補リストへ揃える
    if (next === 5) {
      setState((prev) => {
        const existingByName = new Map(prev.consensusSpots.map((s) => [s.spotName.trim(), s]))
        const added: ConsensusSpot[] = []
        const nextMustGo = { ...prev.mustGoByMember }

        prev.members.forEach((m) => {
          m.destinations.forEach((d) => {
            const name = d.name.trim()
            if (!name) return
            let spot = existingByName.get(name)
            if (!spot) {
              const photo = d.photos[0] ?? findExactSpotPhoto(name, d.area || prev.destination)
              spot = {
                id: generateId('cspot'),
                spotName: name,
                photoUrl: photo?.url,
                photoCredit: photo?.credit,
                areaQuery: `${name} ${d.area || prev.destination}`.trim(),
                reason: d.activities.length > 0 ? d.activities.join('・') : undefined,
                addedByMemberId: m.id,
                ratings: {},
              }
              existingByName.set(name, spot)
              added.push(spot)
            }
            if (d.starred && !nextMustGo[m.id]) {
              nextMustGo[m.id] = spot.id
            }
          })
        })

        if (added.length === 0 && Object.keys(nextMustGo).length === Object.keys(prev.mustGoByMember).length) {
          return prev
        }
        return {
          ...prev,
          consensusSpots: [...prev.consensusSpots, ...added],
          mustGoByMember: nextMustGo,
        }
      })
    }

    setCurrentStep(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const updateMember = (memberId: string, updater: (member: Member) => Member) => {
    setState((prev) => ({
      ...prev,
      members: prev.members.map((m) => (m.id === memberId ? updater(m) : m)),
    }))
  }

  const handleChangeDestination = (destination: string) => {
    setState((prev) => ({
      ...prev,
      destination,
      // 目的地が変わったら旧目的地のAI提案キャッシュをクリアして他県が混ざらないようにする
      aiZeroSuggestions: prev.destination !== destination ? null : prev.aiZeroSuggestions,
    }))
  }

  const handleAddMember = (name: string) => {
    const newId = generateId('member')
    setState((prev) => {
      const nextIndex = prev.members.length
      const usedBadges = new Set(prev.members.map((m) => m.badge))
      const badge =
        MEMBER_BADGES.find((b) => !usedBadges.has(b)) ??
        name.trim().slice(0, 1).toUpperCase()
      const color = MEMBER_COLORS[nextIndex % MEMBER_COLORS.length]
      const newMember: Member = {
        id: newId,
        name,
        badge,
        color,
        destinations: [],
        profile: {
          selectedCardIds: [],
          customCards: [],
          aiSuggestedCards: [],
        },
      }
      return {
        ...prev,
        members: [...prev.members, newMember],
      }
    })
    if (!activeMemberId) {
      setActiveMemberId(newId)
    }
  }

  const handleRenameMember = (memberId: string, name: string) => {
    updateMember(memberId, (member) => ({
      ...member,
      name,
    }))
  }

  const handleRemoveMember = (memberId: string) => {
    setState((prev) => {
      const nextMembers = prev.members.filter((m) => m.id !== memberId)
      if (activeMemberId === memberId) {
        setActiveMemberId(nextMembers[0]?.id ?? '')
      }
      const nextMustGo = { ...prev.mustGoByMember }
      delete nextMustGo[memberId]
      const nextConsensus = prev.consensusSpots.map((sp) => {
        const nextRatings = { ...sp.ratings }
        delete nextRatings[memberId]
        return { ...sp, ratings: nextRatings }
      })
      return {
        ...prev,
        members: nextMembers,
        mustGoByMember: nextMustGo,
        consensusSpots: nextConsensus,
      }
    })
  }

  // Step 2：行き先候補の保存 → 同時に Step 5 の投票候補リストへも自動同期
  const handleSaveDestination = (
    memberId: string,
    payload: {
      candidateId?: string
      spotId?: string
      name: string
      area: string
      photos: DestinationCandidate['photos']
      activities: string[]
    },
  ) => {
    setState((prev) => {
      const nextMembers = prev.members.map((member) => {
        if (member.id !== memberId) return member
        if (payload.candidateId) {
          return {
            ...member,
            destinations: member.destinations.map((d) =>
              d.id === payload.candidateId
                ? {
                    ...d,
                    name: payload.name,
                    area: payload.area,
                    photos: payload.photos,
                    activities: payload.activities,
                  }
                : d,
            ),
          }
        }
        const newCandidate: DestinationCandidate = {
          id: generateId('dest'),
          spotId: payload.spotId,
          name: payload.name,
          area: payload.area,
          photos: payload.photos,
          activities: payload.activities,
          starred: false,
        }
        return {
          ...member,
          destinations: [...member.destinations, newCandidate],
        }
      })

      // Step 5 の投票候補リストにも自動で追加（重複防止）
      const trimmedName = payload.name.trim()
      const alreadyInConsensus = prev.consensusSpots.some(
        (s) => s.spotName.trim() === trimmedName,
      )
      const exactPhoto =
        payload.photos[0] ?? findExactSpotPhoto(trimmedName, payload.area || prev.destination)

      const nextConsensusSpots = alreadyInConsensus
        ? prev.consensusSpots
        : [
            ...prev.consensusSpots,
            {
              id: generateId('cspot'),
              spotName: trimmedName,
              photoUrl: exactPhoto?.url,
              photoCredit: exactPhoto?.credit,
              areaQuery: `${trimmedName} ${payload.area || prev.destination}`.trim(),
              reason: payload.activities.length > 0 ? payload.activities.join('・') : undefined,
              addedByMemberId: memberId,
              ratings: {},
            },
          ]

      return {
        ...prev,
        members: nextMembers,
        consensusSpots: nextConsensusSpots,
      }
    })
  }

  // Step 2：1人1つだけ「★ 絶対行きたい」を選択 → Step 5 の mustGoByMember にも自動同期
  const handleSelectOneMustGoStar = (memberId: string, candidateId: string) => {
    setState((prev) => {
      let newlyStarredName: string | null = null
      const nextMembers = prev.members.map((member) => {
        if (member.id !== memberId) return member
        const target = member.destinations.find((d) => d.id === candidateId)
        const willStar = target ? !target.starred : false
        if (willStar && target) {
          newlyStarredName = target.name.trim()
        }
        return {
          ...member,
          destinations: member.destinations.map((d) => ({
            ...d,
            starred: d.id === candidateId ? willStar : false,
          })),
        }
      })

      const nextMustGo = { ...prev.mustGoByMember }
      if (newlyStarredName) {
        const matchedConsensus = prev.consensusSpots.find(
          (s) => s.spotName.trim() === newlyStarredName,
        )
        if (matchedConsensus) {
          nextMustGo[memberId] = matchedConsensus.id
        }
      } else {
        delete nextMustGo[memberId]
      }

      return {
        ...prev,
        members: nextMembers,
        mustGoByMember: nextMustGo,
      }
    })
  }

  const handleDeleteDestination = (memberId: string, candidateId: string) => {
    setState((prev) => {
      const targetMember = prev.members.find((m) => m.id === memberId)
      const deletedDest = targetMember?.destinations.find((d) => d.id === candidateId)
      const nextMembers = prev.members.map((member) =>
        member.id === memberId
          ? {
              ...member,
              destinations: member.destinations.filter((d) => d.id !== candidateId),
            }
          : member,
      )

      // 他の誰も選んでいなければ Step 5 からも削除
      let nextConsensus = prev.consensusSpots
      const nextMustGo = { ...prev.mustGoByMember }
      if (deletedDest) {
        const deletedName = deletedDest.name.trim()
        const stillSelectedBySomeone = nextMembers.some((m) =>
          m.destinations.some((d) => d.name.trim() === deletedName),
        )
        if (!stillSelectedBySomeone) {
          const removedSpot = prev.consensusSpots.find((s) => s.spotName.trim() === deletedName)
          nextConsensus = prev.consensusSpots.filter((s) => s.spotName.trim() !== deletedName)
          if (removedSpot) {
            Object.entries(nextMustGo).forEach(([mId, sId]) => {
              if (sId === removedSpot.id) delete nextMustGo[mId]
            })
          }
        } else if (deletedDest.starred) {
          delete nextMustGo[memberId]
        }
      }

      return {
        ...prev,
        members: nextMembers,
        consensusSpots: nextConsensus,
        mustGoByMember: nextMustGo,
      }
    })
  }

  // Step 3：希望カード選択（上限なし）＋非同期AI関連カード生成
  const handleToggleValueCard = (
    memberId: string,
    cardId: string,
    meta?: { categoryId: string; text: string },
  ) => {
    const targetMember = state.members.find((m) => m.id === memberId)
    if (!targetMember) return

    const exists = targetMember.profile.selectedCardIds.includes(cardId)

    updateMember(memberId, (member) => {
      const currentlySelected = member.profile.selectedCardIds.includes(cardId)
      const nextIds = currentlySelected
        ? member.profile.selectedCardIds.filter((id) => id !== cardId)
        : [...member.profile.selectedCardIds, cardId]
      return {
        ...member,
        profile: {
          ...member.profile,
          selectedCardIds: nextIds,
        },
      }
    })

    if (!exists && meta) {
      setIsGeneratingAi(true)
      if (aiTimerRef.current !== null) {
        window.clearTimeout(aiTimerRef.current)
      }
      aiTimerRef.current = window.setTimeout(() => {
        setState((prev) => ({
          ...prev,
          members: prev.members.map((member) => {
            if (member.id !== memberId) return member
            const existingTexts = [
              ...ALL_VALUE_CARDS.map((c) => c.text),
              ...member.profile.customCards.map((c) => c.text),
              ...member.profile.aiSuggestedCards.map((c) => c.text),
            ]
            const freshSuggestions = generateRelatedSuggestions(
              cardId,
              meta.categoryId,
              existingTexts,
            )
            if (freshSuggestions.length === 0) return member

            const newAiCards = freshSuggestions.map((s) => ({
              id: generateId('ai-card'),
              categoryId: s.categoryId,
              text: s.text,
              sourceCardText: meta.text,
            }))

            return {
              ...member,
              profile: {
                ...member.profile,
                aiSuggestedCards: [...newAiCards, ...member.profile.aiSuggestedCards],
              },
            }
          }),
        }))
        setIsGeneratingAi(false)
        aiTimerRef.current = null
      }, 360)
    }
  }

  // 自分で追加したカードは自動で「選択された状態」にする
  const handleAddCustomCard = (memberId: string, categoryId: string, text: string) => {
    const newCardId = generateId('custom-card')
    updateMember(memberId, (member) => ({
      ...member,
      profile: {
        ...member.profile,
        customCards: [
          ...member.profile.customCards,
          {
            id: newCardId,
            categoryId,
            text,
          },
        ],
        selectedCardIds: [...member.profile.selectedCardIds, newCardId],
      },
    }))
  }

  const handleEditCustomCard = (memberId: string, cardId: string, nextText: string) => {
    updateMember(memberId, (member) => ({
      ...member,
      profile: {
        ...member.profile,
        customCards: member.profile.customCards.map((c) =>
          c.id === cardId ? { ...c, text: nextText } : c,
        ),
      },
    }))
  }

  // Step 5：代替案の追加・削除・投票・絶対行きたい
  const handleAddAlternativeSpot = (sp: {
    spotName: string
    photoUrl?: string
    photoCredit?: string
    areaQuery: string
    reason?: string
    addedByMemberId?: string
  }) => {
    setState((prev) => {
      const trimmed = sp.spotName.trim()
      if (!trimmed || prev.consensusSpots.some((s) => s.spotName.trim() === trimmed)) {
        return prev
      }
      const photo = sp.photoUrl
        ? { url: sp.photoUrl, credit: sp.photoCredit ?? '' }
        : findExactSpotPhoto(trimmed, sp.areaQuery || prev.destination)
      return {
        ...prev,
        consensusSpots: [
          ...prev.consensusSpots,
          {
            id: generateId('cspot'),
            spotName: trimmed,
            photoUrl: photo?.url,
            photoCredit: photo?.credit,
            areaQuery: sp.areaQuery.trim() || prev.destination.trim() || trimmed,
            reason: sp.reason,
            addedByMemberId: sp.addedByMemberId,
            ratings: {},
          },
        ],
      }
    })
  }

  const handleDeleteConsensusSpot = (spotId: string) => {
    setState((prev) => {
      const nextMustGo: Record<string, string> = {}
      Object.entries(prev.mustGoByMember).forEach(([memberId, sId]) => {
        if (sId !== spotId) nextMustGo[memberId] = sId
      })
      return {
        ...prev,
        consensusSpots: prev.consensusSpots.filter((s) => s.id !== spotId),
        mustGoByMember: nextMustGo,
      }
    })
  }

  const handleRateConsensusSpot = (spotId: string, memberId: string, rating: number) => {
    setState((prev) => ({
      ...prev,
      consensusSpots: prev.consensusSpots.map((sp) =>
        sp.id === spotId
          ? { ...sp, ratings: { ...sp.ratings, [memberId]: rating } }
          : sp,
      ),
    }))
  }

  const handleToggleMustGo = (memberId: string, spotId: string) => {
    setState((prev) => {
      const nextMustGo = { ...prev.mustGoByMember }
      const willSelect = nextMustGo[memberId] !== spotId
      if (willSelect) {
        nextMustGo[memberId] = spotId
      } else {
        delete nextMustGo[memberId]
      }
      const targetSpot = prev.consensusSpots.find((s) => s.id === spotId)
      const nextMembers = prev.members.map((m) => {
        if (m.id !== memberId) return m
        return {
          ...m,
          destinations: m.destinations.map((d) => ({
            ...d,
            starred: willSelect && targetSpot ? d.name.trim() === targetSpot.spotName.trim() : false,
          })),
        }
      })
      return {
        ...prev,
        members: nextMembers,
        mustGoByMember: nextMustGo,
      }
    })
  }

  const handleSaveZeroSuggestions = (data: AiZeroSuggestionsResponse) => {
    setState((prev) => ({ ...prev, aiZeroSuggestions: data }))
  }

  const handleSaveConflictResult = (data: AiConflictMediationResponse) => {
    setState((prev) => ({ ...prev, aiConflictResult: data }))
  }

  const handleGeneratePlan = async (openTabAfter = false) => {
    if (state.consensusSpots.length === 0) return
    setIsGeneratingPlan(true)
    try {
      const { data } = await generateTravelPlan(state, daysCount)
      setState((prev) => ({ ...prev, aiTravelPlan: data }))
      if (openTabAfter) {
        goToStep(6)
      }
    } finally {
      setIsGeneratingPlan(false)
    }
  }

  const handleResetDemo = () => {
    if (!window.confirm('入力した内容をすべて消去して、空欄の状態に戻しますか？')) return
    const fresh = resetTravelState()
    setState(fresh)
    setActiveMemberId('')
    setIsFromSharedLink(false)
    window.history.replaceState({}, '', window.location.pathname)
    goToStep(1)
  }

  const handleOpenMemberPreview = () => {
    window.history.replaceState({}, '', shareUrl)
    setIsFromSharedLink(true)
    goToStep(2)
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__inner">
          <div className="app-brand" onClick={() => goToStep(1)}>
            <span className="app-brand__icon" aria-hidden="true">
              ✈️
            </span>
            <div>
              <h1 className="app-brand__title">トラベルマッチング</h1>
              <p className="app-brand__sub">友達と一緒に作る旅のしおり</p>
            </div>
          </div>

          <div className="app-header__right">
            <span className="dest-chip">📍 {state.destination || '未設定'}</span>
            <button
              type="button"
              className="btn-reset"
              onClick={handleResetDemo}
              title="すべて消去して空欄に戻す"
            >
              リセット
            </button>
          </div>
        </div>

        <nav className="stepper" aria-label="入力ステップ">
          <ol className="stepper__list stepper__list--6">
            {STEPS.map((step) => {
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id
              return (
                <li key={step.id} className="stepper__item">
                  <button
                    type="button"
                    className={`stepper__btn ${isActive ? 'stepper__btn--active' : ''} ${
                      isCompleted ? 'stepper__btn--done' : ''
                    }`}
                    onClick={() => goToStep(step.id)}
                    aria-current={isActive ? 'step' : undefined}
                  >
                    <span className="stepper__num">{isCompleted ? '✓' : step.id}</span>
                    <span className="stepper__title">{step.shortTitle}</span>
                  </button>
                </li>
              )
            })}
          </ol>
        </nav>
      </header>

      <main className={`app-main ${currentStep === 3 ? 'app-main--wide' : ''}`}>
        {currentStep === 1 && (
          <Step1SetupView
            destination={state.destination}
            members={state.members}
            shareUrl={shareUrl}
            onChangeDestination={handleChangeDestination}
            onAddMember={handleAddMember}
            onRenameMember={handleRenameMember}
            onRemoveMember={handleRemoveMember}
            onGoNext={() => goToStep(2)}
            onOpenMemberPreview={handleOpenMemberPreview}
          />
        )}

        {currentStep === 2 &&
          (activeMember ? (
            <Step2DestinationsView
              state={state}
              activeMember={activeMember}
              isFromSharedLink={isFromSharedLink}
              onChangeActiveMember={setActiveMemberId}
              onSaveDestination={handleSaveDestination}
              onSelectOneMustGoStar={handleSelectOneMustGoStar}
              onDeleteDestination={handleDeleteDestination}
              onSaveZeroSuggestions={handleSaveZeroSuggestions}
            />
          ) : (
            <section className="card empty-step-card">
              <h2 className="section-title">まずメンバーを登録してください</h2>
              <button type="button" className="btn-primary" onClick={() => goToStep(1)}>
                ← Step 1 へ
              </button>
            </section>
          ))}

        {currentStep === 3 &&
          (activeMember ? (
            <ProfileView
              members={state.members}
              activeMember={activeMember}
              isGeneratingAi={isGeneratingAi}
              onChangeActiveMember={setActiveMemberId}
              onToggleValueCard={handleToggleValueCard}
              onAddCustomCard={handleAddCustomCard}
              onEditCustomCard={handleEditCustomCard}
            />
          ) : (
            <section className="card empty-step-card">
              <h2 className="section-title">まずメンバーを登録してください</h2>
              <button type="button" className="btn-primary" onClick={() => goToStep(1)}>
                ← Step 1 へ
              </button>
            </section>
          ))}

        {currentStep === 4 && (
          <SummaryView
            destination={state.destination}
            members={state.members}
            onEditSetup={() => goToStep(1)}
          />
        )}

        {currentStep === 5 &&
          (activeMember ? (
            <Step5ConsensusView
              state={state}
              activeMember={activeMember}
              daysCount={daysCount}
              isGeneratingPlan={isGeneratingPlan}
              onChangeDaysCount={setDaysCount}
              onChangeActiveMember={setActiveMemberId}
              onAddAlternativeSpot={handleAddAlternativeSpot}
              onDeleteConsensusSpot={handleDeleteConsensusSpot}
              onRateConsensusSpot={handleRateConsensusSpot}
              onToggleMustGo={handleToggleMustGo}
              onSaveConflictResult={handleSaveConflictResult}
              onProposePlanAndOpenTab={() => handleGeneratePlan(true)}
              onGoToDestinations={() => goToStep(2)}
            />
          ) : (
            <section className="card empty-step-card">
              <h2 className="section-title">まずメンバーを登録してください</h2>
              <button type="button" className="btn-primary" onClick={() => goToStep(1)}>
                ← Step 1 へ
              </button>
            </section>
          ))}

        {currentStep === 6 && (
          <Step6PlanView
            state={state}
            daysCount={daysCount}
            isGeneratingPlan={isGeneratingPlan}
            onChangeDaysCount={setDaysCount}
            onGeneratePlan={() => handleGeneratePlan(false)}
            onBackToVote={() => goToStep(5)}
          />
        )}
      </main>

      <footer className="step-footer">
        <div className="step-footer__inner">
          {currentStep === 1 && (
            <button
              type="button"
              className="step-next-btn step-next-btn--full"
              onClick={() => goToStep(2)}
            >
              <span>次へ：行き先を探す</span>
              <span aria-hidden="true">→</span>
            </button>
          )}

          {currentStep === 2 && (
            <>
              <button type="button" className="step-back-btn" onClick={() => goToStep(1)}>
                ← 戻る
              </button>
              <button type="button" className="step-next-btn" onClick={() => goToStep(3)}>
                <span>次へ：希望を選ぶ</span>
                <span aria-hidden="true">→</span>
              </button>
            </>
          )}

          {currentStep === 3 && (
            <>
              <button type="button" className="step-back-btn" onClick={() => goToStep(2)}>
                ← 戻る
              </button>
              <button type="button" className="step-next-btn" onClick={() => goToStep(4)}>
                <span>次へ：まとめを見る</span>
                <span aria-hidden="true">→</span>
              </button>
            </>
          )}

          {currentStep === 4 && (
            <>
              <button type="button" className="step-back-btn" onClick={() => goToStep(3)}>
                ← 戻る
              </button>
              <button type="button" className="step-next-btn" onClick={() => goToStep(5)}>
                <span>次へ：合意・投票へ</span>
                <span aria-hidden="true">→</span>
              </button>
            </>
          )}

          {currentStep === 5 && (
            <>
              <button type="button" className="step-back-btn" onClick={() => goToStep(4)}>
                ← まとめ
              </button>
              <button
                type="button"
                className="step-next-btn step-next-btn--finish"
                disabled={isGeneratingPlan || state.consensusSpots.length === 0}
                onClick={() => handleGeneratePlan(true)}
              >
                <span>{isGeneratingPlan ? '作成中...' : '✨ 計画を提案する'}</span>
                <span aria-hidden="true">→</span>
              </button>
            </>
          )}

          {currentStep === 6 && (
            <button
              type="button"
              className="step-back-btn step-back-btn--full"
              onClick={() => goToStep(5)}
            >
              ← 合意・投票（Step 5）に戻る
            </button>
          )}
        </div>
      </footer>
    </div>
  )
}
