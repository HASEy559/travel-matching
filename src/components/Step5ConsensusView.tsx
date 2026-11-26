import { useMemo, useState } from 'react'
import { buildGoogleMapsUrl, generateConflictMediation } from '../services/aiFacilitator'
import { findExactSpotPhoto } from '../spotCatalog'
import type {
  AiConflictMediationResponse,
  ConsensusSpot,
  Member,
  TravelState,
} from '../types'
import { MemberAvatar } from './MemberAvatar'

interface Step5ConsensusViewProps {
  state: TravelState
  activeMember: Member
  daysCount: number
  isGeneratingPlan: boolean
  onChangeDaysCount: (days: number) => void
  onChangeActiveMember: (memberId: string) => void
  onAddAlternativeSpot: (spot: {
    spotName: string
    photoUrl?: string
    photoCredit?: string
    areaQuery: string
    reason?: string
    addedByMemberId?: string
  }) => void
  onDeleteConsensusSpot: (spotId: string) => void
  onRateConsensusSpot: (spotId: string, memberId: string, rating: number) => void
  onToggleMustGo: (memberId: string, spotId: string) => void
  onSaveConflictResult: (data: AiConflictMediationResponse) => void
  onProposePlanAndOpenTab: () => void
  onGoToDestinations: () => void
}

const VOTE_OPTIONS = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
]

function calcSpread(spot: ConsensusSpot): number {
  const vals = Object.values(spot.ratings).filter((v) => typeof v === 'number')
  if (vals.length < 2) return 0
  return Math.max(...vals) - Math.min(...vals)
}

export function Step5ConsensusView({
  state,
  activeMember,
  daysCount,
  isGeneratingPlan,
  onChangeDaysCount,
  onChangeActiveMember,
  onAddAlternativeSpot,
  onDeleteConsensusSpot,
  onRateConsensusSpot,
  onToggleMustGo,
  onSaveConflictResult,
  onProposePlanAndOpenTab,
  onGoToDestinations,
}: Step5ConsensusViewProps) {
  const [conflictSpotAId, setConflictSpotAId] = useState<string>('')
  const [conflictSpotBId, setConflictSpotBId] = useState<string>('')
  const [loadingConflict, setLoadingConflict] = useState(false)

  const { consensusSpots, mustGoByMember, members } = state

  const mustGoMembersBySpot = useMemo(() => {
    const map = new Map<string, Member[]>()
    Object.entries(mustGoByMember).forEach(([memberId, spotId]) => {
      const m = members.find((mem) => mem.id === memberId)
      if (!m) return
      const list = map.get(spotId) ?? []
      list.push(m)
      map.set(spotId, list)
    })
    return map
  }, [mustGoByMember, members])

  const myMustGoSpotId = mustGoByMember[activeMember.id]
  const myMustGoSpot = consensusSpots.find((s) => s.id === myMustGoSpotId)

  const spotsByConflict = useMemo(() => {
    return [...consensusSpots].sort((a, b) => calcSpread(b) - calcSpread(a))
  }, [consensusSpots])

  const effectiveSpotAId = conflictSpotAId || spotsByConflict[0]?.id || ''
  const effectiveSpotBId =
    conflictSpotBId || spotsByConflict.find((s) => s.id !== effectiveSpotAId)?.id || ''

  const existingSpotNames = useMemo(
    () => new Set(consensusSpots.map((s) => s.spotName.trim())),
    [consensusSpots],
  )

  const handleRunConflictMediation = async () => {
    const spotA = consensusSpots.find((s) => s.id === effectiveSpotAId)
    const spotB = consensusSpots.find((s) => s.id === effectiveSpotBId)
    if (!spotA || !spotB || spotA.id === spotB.id) return

    setLoadingConflict(true)
    try {
      const { data } = await generateConflictMediation(state, spotA, spotB)
      onSaveConflictResult(data)
    } finally {
      setLoadingConflict(false)
    }
  }

  return (
    <div className="screen-stack">
      {/* 投票メンバー切り替え */}
      <div className="member-switcher-box">
        <div className="member-switcher" role="tablist" aria-label="投票するメンバーを切り替え">
          {members.map((m) => (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={m.id === activeMember.id}
              className={`member-pill ${m.id === activeMember.id ? 'member-pill--active' : ''}`}
              onClick={() => onChangeActiveMember(m.id)}
            >
              <MemberAvatar member={m} size="sm" />
              <span>{m.name}</span>
            </button>
          ))}
        </div>
        <span className="bound-voter-bar__lock">
          {myMustGoSpot
            ? `★ ${activeMember.name}の絶対行きたい: ${myMustGoSpot.spotName}`
            : `★ 絶対行きたい（1人1枠）：未選択`}
        </span>
      </div>

      {/* 候補リスト＆4段階投票（Step 2で選んだ行き先が最初から自動表示・写真サイズ統一） */}
      <section className="card">
        <div className="section-heading section-heading--compact">
          <h2 className="section-title section-title--sm">🗳️ 行き先へ投票</h2>
          <span className="count-pill">{consensusSpots.length}件</span>
        </div>

        {consensusSpots.length === 0 ? (
          <div className="empty-step-card">
            <div className="empty-box">まだ行き先がありません。Step 2 で行き先を選んでください</div>
            <button type="button" className="btn-primary btn-sm" onClick={onGoToDestinations}>
              ← Step 2（行き先）へ
            </button>
          </div>
        ) : (
          <div className="uniform-photo-grid">
            {consensusSpots.map((spot) => {
              const myRating = spot.ratings[activeMember.id]
              const ratingEntries = members
                .map((m) => ({ member: m, score: spot.ratings[m.id] }))
                .filter(
                  (e): e is { member: Member; score: number } => typeof e.score === 'number',
                )
              const avgScore =
                ratingEntries.length > 0
                  ? (
                      ratingEntries.reduce((sum, e) => sum + e.score, 0) / ratingEntries.length
                    ).toFixed(1)
                  : null

              const mustGoMembers = mustGoMembersBySpot.get(spot.id) ?? []
              const isMustGo = mustGoMembers.length > 0
              const isMyMustGo = myMustGoSpotId === spot.id
              const spread = calcSpread(spot)
              const exactPhoto = spot.photoUrl
                ? { url: spot.photoUrl, credit: spot.photoCredit ?? '' }
                : findExactSpotPhoto(spot.spotName, spot.areaQuery)
              const mapsQuery = spot.areaQuery.includes(spot.spotName)
                ? spot.areaQuery
                : `${spot.spotName} ${spot.areaQuery}`.trim()

              return (
                <article
                  key={spot.id}
                  className={`consensus-grid-card ${isMustGo ? 'consensus-card--mustgo' : ''}`}
                >
                  <div className="uniform-photo-box">
                    {exactPhoto ? (
                      <img src={exactPhoto.url} alt={spot.spotName} loading="lazy" />
                    ) : (
                      <div className="spot-photo-fallback">
                        <span>📍</span>
                        <strong>{spot.spotName}</strong>
                      </div>
                    )}
                    {avgScore && <span className="spot-photo-card__area">★ {avgScore}</span>}
                    {isMustGo && (
                      <span className="spot-photo-card__mustgo-badge">
                        ★ {mustGoMembers.map((m) => m.name).join('・')}
                      </span>
                    )}
                    <button
                      type="button"
                      className="candidate-photo-card__del"
                      onClick={() => onDeleteConsensusSpot(spot.id)}
                      aria-label={`${spot.spotName}を削除`}
                    >
                      ×
                    </button>
                  </div>

                  <div className="consensus-grid-card__body">
                    <div className="consensus-card__title-row">
                      <h3 className="consensus-card__name">{spot.spotName}</h3>
                      {spread >= 2 && <span className="spread-badge">意見割れ</span>}
                    </div>

                    <a
                      href={buildGoogleMapsUrl(mapsQuery)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="gmaps-link"
                    >
                      📍 Googleマップ ↗
                    </a>

                    {/* 1〜4 投票 */}
                    <div className="mini-vote-btns" role="radiogroup" aria-label="4段階評価">
                      {VOTE_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          role="radio"
                          aria-checked={myRating === opt.value}
                          className={`mini-vote-btn ${
                            myRating === opt.value ? 'mini-vote-btn--active' : ''
                          }`}
                          onClick={() =>
                            onRateConsensusSpot(spot.id, activeMember.id, opt.value)
                          }
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      className={`btn-mustgo btn-mustgo--block ${
                        isMyMustGo ? 'btn-mustgo--active' : ''
                      }`}
                      onClick={() => onToggleMustGo(activeMember.id, spot.id)}
                      aria-pressed={isMyMustGo}
                    >
                      {isMyMustGo ? '★ 絶対行きたい' : '☆ 絶対行きたい(1枠)'}
                    </button>

                    {/* みんなの投票 */}
                    <div className="member-ratings-chips">
                      {members.map((m) => {
                        const score = spot.ratings[m.id]
                        const hasStarHere = mustGoByMember[m.id] === spot.id
                        return (
                          <span
                            key={m.id}
                            className={`member-rating-chip ${
                              score ? `member-rating-chip--${score}` : ''
                            }`}
                          >
                            <MemberAvatar member={m} size="sm" />
                            <span className="member-rating-chip__symbol">
                              {score ? `${score}` : '−'}
                              {hasStarHere ? '★' : ''}
                            </span>
                          </span>
                        )
                      })}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      {/* 意見が割れたときのAI相談（写真サイズ統一） */}
      {consensusSpots.length >= 2 && (
        <section className="card card--compact conflict-card">
          <div className="section-heading section-heading--compact">
            <h2 className="section-title section-title--sm">⚖️ 意見割れをAIに相談</h2>
          </div>

          <div className="conflict-selector-grid">
            <select
              className="input input--sm"
              value={effectiveSpotAId}
              onChange={(e) => setConflictSpotAId(e.target.value)}
              aria-label="案A"
            >
              {spotsByConflict.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.spotName}
                </option>
              ))}
            </select>

            <span className="conflict-vs-badge">VS</span>

            <select
              className="input input--sm"
              value={effectiveSpotBId}
              onChange={(e) => setConflictSpotBId(e.target.value)}
              aria-label="案B"
            >
              {spotsByConflict.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.spotName}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="btn-primary btn-sm conflict-ask-btn"
            disabled={loadingConflict || effectiveSpotAId === effectiveSpotBId}
            onClick={handleRunConflictMediation}
          >
            {loadingConflict ? '相談中...' : '⚖️ 調整案・代替案を出す'}
          </button>

          {state.aiConflictResult && (
            <div className="mediation-3step">
              <div className="mediation-stage">
                <span className="mediation-stage__num">1</span>
                <div>
                  <h4 className="mediation-stage__title">両立プラン</h4>
                  <p className="mediation-stage__text">
                    {state.aiConflictResult.both_plan.summary}
                  </p>
                </div>
              </div>

              <div className="mediation-stage mediation-stage--warn">
                <span className="mediation-stage__num">2</span>
                <div>
                  <h4 className="mediation-stage__title">難しい点</h4>
                  <ul className="mediation-challenges">
                    {state.aiConflictResult.both_plan.challenges.map((ch, i) => (
                      <li key={i}>{ch}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mediation-stage mediation-stage--alt">
                <span className="mediation-stage__num">3</span>
                <div className="mediation-alt-wrap">
                  <h4 className="mediation-stage__title">中間となる代替案</h4>
                  <div className="uniform-photo-grid">
                    {state.aiConflictResult.alternatives.map((alt, i) => {
                      const alreadyAdded = existingSpotNames.has(alt.spot_name.trim())
                      const photo = findExactSpotPhoto(alt.spot_name, alt.area)
                      return (
                        <div key={`${alt.spot_name}-${i}`} className="mediation-alt-photo-card">
                          <div className="uniform-photo-box">
                            {photo ? (
                              <img src={photo.url} alt={alt.spot_name} loading="lazy" />
                            ) : (
                              <div className="spot-photo-fallback">
                                <span>📍</span>
                                <strong>{alt.spot_name}</strong>
                              </div>
                            )}
                          </div>
                          <div className="mediation-alt-photo-card__body">
                            <strong>{alt.spot_name}</strong>
                            <p className="mediation-alt-card__why">{alt.why_it_fits}</p>
                            <div className="mediation-alt-photo-card__foot">
                              <a
                                href={buildGoogleMapsUrl(alt.google_maps_query)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="gmaps-link"
                              >
                                📍地図
                              </a>
                              <button
                                type="button"
                                className={`btn-ai-add ${alreadyAdded ? 'btn-ai-add--done' : ''}`}
                                disabled={alreadyAdded}
                                onClick={() =>
                                  onAddAlternativeSpot({
                                    spotName: alt.spot_name,
                                    photoUrl: photo?.url,
                                    photoCredit: photo?.credit,
                                    areaQuery:
                                      alt.google_maps_query || `${alt.spot_name} ${alt.area}`,
                                    reason: alt.why_it_fits,
                                    addedByMemberId: activeMember.id,
                                  })
                                }
                              >
                                {alreadyAdded ? '✓ 追加済' : '＋ 追加'}
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* 下部の「計画を提案する」ボタン → 別タブ（Step 6：計画案）へ */}
      <section className="card plan-launch-card">
        <div className="plan-launch-card__top">
          <strong>🗓️ 計画をつくる</strong>
          <div className="days-selector" role="radiogroup" aria-label="旅行日数">
            {[
              { days: 1, label: '日帰り' },
              { days: 2, label: '1泊2日' },
              { days: 3, label: '2泊3日' },
            ].map((opt) => (
              <button
                key={opt.days}
                type="button"
                role="radio"
                aria-checked={daysCount === opt.days}
                className={`quick-chip ${daysCount === opt.days ? 'quick-chip--active' : ''}`}
                onClick={() => onChangeDaysCount(opt.days)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="plan-propose-cta"
          disabled={isGeneratingPlan || consensusSpots.length === 0}
          onClick={onProposePlanAndOpenTab}
        >
          {isGeneratingPlan ? '計画を作成中...' : '✨ 計画を提案する（計画案タブへ） →'}
        </button>
      </section>
    </div>
  )
}
