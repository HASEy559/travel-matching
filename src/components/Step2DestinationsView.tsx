import { useMemo, useState } from 'react'
import { buildGoogleMapsUrl, generateZeroSuggestions } from '../services/aiFacilitator'
import {
  findCatalogSpotById,
  findExactSpotPhoto,
  getRecommendedSpots,
  searchSpots,
} from '../spotCatalog'
import type {
  AiZeroSuggestionItem,
  AiZeroSuggestionsResponse,
  DestinationCandidate,
  Member,
  SpotCatalogItem,
  TravelState,
} from '../types'
import { MemberAvatar } from './MemberAvatar'

interface Step2DestinationsViewProps {
  state: TravelState
  activeMember: Member
  isFromSharedLink: boolean
  onChangeActiveMember: (memberId: string) => void
  onSaveDestination: (
    memberId: string,
    payload: {
      candidateId?: string
      spotId?: string
      name: string
      area: string
      photos: DestinationCandidate['photos']
      activities: string[]
    },
  ) => void
  onSelectOneMustGoStar: (memberId: string, candidateId: string) => void
  onDeleteDestination: (memberId: string, candidateId: string) => void
  onSaveZeroSuggestions: (data: AiZeroSuggestionsResponse) => void
}

interface DetailDraft {
  candidateId?: string
  spotId?: string
  name: string
  area: string
  photos: DestinationCandidate['photos']
  suggestedActivities: string[]
  selectedActivities: string[]
}

export function Step2DestinationsView({
  state,
  activeMember,
  isFromSharedLink,
  onChangeActiveMember,
  onSaveDestination,
  onSelectOneMustGoStar,
  onDeleteDestination,
  onSaveZeroSuggestions,
}: Step2DestinationsViewProps) {
  const { destination, members } = state
  const [searchQuery, setSearchQuery] = useState('')
  const [detailDraft, setDetailDraft] = useState<DetailDraft | null>(null)
  const [activePhotoIndex, setActivePhotoIndex] = useState(0)
  const [customActivityInput, setCustomActivityInput] = useState('')

  // AI候補提案（行き先に統合）
  const [loadingAi, setLoadingAi] = useState(false)
  const [checkedAiIndices, setCheckedAiIndices] = useState<number[]>([])

  const trimmedQuery = searchQuery.trim()
  const isSearching = trimmedQuery.length > 0

  // 目的地に厳密一致するおすすめ（他県のスポットは混ぜない）
  const displayedSpots = useMemo(() => {
    if (isSearching) {
      return searchSpots(trimmedQuery)
    }
    return getRecommendedSpots(destination)
  }, [isSearching, trimmedQuery, destination])

  const addedBySpotId = useMemo(() => {
    const map = new Map<string, DestinationCandidate>()
    activeMember.destinations.forEach((d) => {
      if (d.spotId) map.set(d.spotId, d)
    })
    return map
  }, [activeMember.destinations])

  const addedNames = useMemo(
    () => new Set(activeMember.destinations.map((d) => d.name.trim())),
    [activeMember.destinations],
  )

  const openCatalogDetail = (spot: SpotCatalogItem) => {
    const existing = addedBySpotId.get(spot.id)
    setActivePhotoIndex(0)
    setCustomActivityInput('')
    setDetailDraft({
      candidateId: existing?.id,
      spotId: spot.id,
      name: spot.name,
      area: spot.area,
      photos: spot.photos,
      suggestedActivities: spot.suggestedActivities,
      selectedActivities: existing ? [...existing.activities] : [],
    })
  }

  const openCustomDestinationDetail = (customName: string) => {
    const trimmed = customName.trim()
    if (!trimmed) return
    const existing = activeMember.destinations.find(
      (d) => !d.spotId && d.name.trim() === trimmed,
    )
    const exactPhoto = findExactSpotPhoto(trimmed, destination)
    setActivePhotoIndex(0)
    setCustomActivityInput('')
    setDetailDraft({
      candidateId: existing?.id,
      name: trimmed,
      area: destination.trim() || '自由入力',
      photos: existing?.photos.length ? existing.photos : exactPhoto ? [exactPhoto] : [],
      suggestedActivities: ['食べ歩き', '写真を撮る', '散策', 'ご当地グルメ', 'お土産'],
      selectedActivities: existing ? [...existing.activities] : [],
    })
  }

  const openExistingCandidateDetail = (candidate: DestinationCandidate) => {
    const catalog = findCatalogSpotById(candidate.spotId)
    setActivePhotoIndex(0)
    setCustomActivityInput('')
    setDetailDraft({
      candidateId: candidate.id,
      spotId: candidate.spotId,
      name: candidate.name,
      area: candidate.area,
      photos: candidate.photos.length > 0 ? candidate.photos : catalog?.photos ?? [],
      suggestedActivities: catalog?.suggestedActivities ?? [
        '食べ歩き',
        '写真を撮る',
        '散策',
        'ご当地グルメ',
      ],
      selectedActivities: [...candidate.activities],
    })
  }

  const toggleDraftActivity = (activity: string) => {
    setDetailDraft((prev) => {
      if (!prev) return null
      const exists = prev.selectedActivities.includes(activity)
      return {
        ...prev,
        selectedActivities: exists
          ? prev.selectedActivities.filter((a) => a !== activity)
          : [...prev.selectedActivities, activity],
      }
    })
  }

  const handleAddCustomActivity = () => {
    const trimmed = customActivityInput.trim()
    if (!trimmed) return
    setDetailDraft((prev) => {
      if (!prev) return null
      const nextSelected = prev.selectedActivities.includes(trimmed)
        ? prev.selectedActivities
        : [...prev.selectedActivities, trimmed]
      const nextSuggested = prev.suggestedActivities.includes(trimmed)
        ? prev.suggestedActivities
        : [...prev.suggestedActivities, trimmed]
      return {
        ...prev,
        suggestedActivities: nextSuggested,
        selectedActivities: nextSelected,
      }
    })
    setCustomActivityInput('')
  }

  const handleSaveDetail = () => {
    if (!detailDraft) return
    onSaveDestination(activeMember.id, {
      candidateId: detailDraft.candidateId,
      spotId: detailDraft.spotId,
      name: detailDraft.name,
      area: detailDraft.area,
      photos: detailDraft.photos,
      activities: detailDraft.selectedActivities,
    })
    setDetailDraft(null)
  }

  // 行き先タブ内の AI候補提案
  const handleRunAiProposals = async () => {
    setLoadingAi(true)
    try {
      const { data } = await generateZeroSuggestions(state)
      onSaveZeroSuggestions(data)
      setCheckedAiIndices([])
    } finally {
      setLoadingAi(false)
    }
  }

  const toggleAiCheck = (idx: number) => {
    setCheckedAiIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
    )
  }

  const handleAddCheckedAi = () => {
    const list = state.aiZeroSuggestions?.suggestions ?? []
    const picked: AiZeroSuggestionItem[] = checkedAiIndices
      .map((i) => list[i])
      .filter((s): s is AiZeroSuggestionItem => Boolean(s))
    picked.forEach((item) => {
      if (addedNames.has(item.spot_name.trim())) return
      const exactPhoto = findExactSpotPhoto(item.spot_name, item.area)
      onSaveDestination(activeMember.id, {
        name: item.spot_name,
        area: item.area || destination || '旅行先',
        photos: exactPhoto ? [exactPhoto] : [],
        activities: [],
      })
    })
    setCheckedAiIndices([])
  }

  const myStarred = activeMember.destinations.find((d) => d.starred)

  return (
    <div className="screen-stack">
      {isFromSharedLink && (
        <div className="welcome-banner">
          <span>🎉</span>
          <strong>「{destination || 'グループ'}」旅行へようこそ！行き先を選ぼう</strong>
        </div>
      )}

      {/* メンバー切り替え */}
      <div className="member-switcher" role="tablist" aria-label="入力するメンバーを切り替え">
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

      {/* 「行き先を探す」：Google風検索＋目的地一致AIおすすめ4〜6件（統一写真サイズ） */}
      <section className="card">
        <div className="section-heading section-heading--compact">
          <h2 className="section-title">
            {destination.trim() ? `「${destination}」の行き先を探す` : '行き先を探す'}
          </h2>
          <button
            type="button"
            className="btn-primary btn-sm"
            disabled={loadingAi}
            onClick={handleRunAiProposals}
          >
            {loadingAi ? 'AI提案中...' : '✨ AI候補提案'}
          </button>
        </div>

        <div className="google-search-bar">
          <span className="google-search-bar__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.2" />
              <path
                d="M16.5 16.5 L21 21"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <input
            type="search"
            className="google-search-bar__input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="地名・観光地名で検索"
            aria-label="地名・観光地名で検索"
          />
          {isSearching && (
            <button
              type="button"
              className="google-search-bar__clear"
              onClick={() => setSearchQuery('')}
              aria-label="検索キーワードをクリア"
            >
              ×
            </button>
          )}
        </div>

        {/* AI候補提案チェックリスト（Step 2 に統合） */}
        {state.aiZeroSuggestions && (
          <div className="ai-zero-result ai-zero-inline">
            <div className="ai-trend-box">{state.aiZeroSuggestions.group_trend_comment}</div>
            <div className="uniform-photo-grid">
              {state.aiZeroSuggestions.suggestions.map((item, idx) => {
                const isChecked = checkedAiIndices.includes(idx)
                const already = addedNames.has(item.spot_name.trim())
                const photo = findExactSpotPhoto(item.spot_name, item.area)
                return (
                  <label
                    key={`${item.spot_name}-${idx}`}
                    className={`ai-photo-check-card ${
                      isChecked ? 'ai-photo-check-card--checked' : ''
                    }`}
                  >
                    <div className="uniform-photo-box">
                      {photo ? (
                        <img src={photo.url} alt={item.spot_name} loading="lazy" />
                      ) : (
                        <div className="spot-photo-fallback">
                          <span>📍</span>
                          <strong>{item.spot_name}</strong>
                        </div>
                      )}
                      <input
                        type="checkbox"
                        checked={isChecked}
                        disabled={already}
                        onChange={() => toggleAiCheck(idx)}
                      />
                      <span className="spot-photo-card__area">{item.category}</span>
                      {already && <span className="spot-photo-card__added-badge">✓ 追加済</span>}
                    </div>
                    <div className="ai-photo-check-card__body">
                      <strong className="ai-check-item__name">{item.spot_name}</strong>
                      <a
                        href={buildGoogleMapsUrl(item.google_maps_query)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gmaps-link"
                        onClick={(e) => e.stopPropagation()}
                      >
                        📍 地図 ↗
                      </a>
                    </div>
                  </label>
                )
              })}
            </div>
            <div className="ai-checklist-actions">
              <button
                type="button"
                className="btn-primary btn-sm"
                disabled={checkedAiIndices.length === 0}
                onClick={handleAddCheckedAi}
              >
                ＋ チェックした {checkedAiIndices.length}件を行き先に追加
              </button>
            </div>
          </div>
        )}

        <div className="explore-subhead">
          <h3 className="explore-subhead__title">
            {isSearching
              ? `検索結果（${displayedSpots.length}件）`
              : destination.trim()
                ? `✨ ${destination}のおすすめ（${displayedSpots.length}件）`
                : `✨ おすすめ（${displayedSpots.length}件）`}
          </h3>
          {isSearching && (
            <button
              type="button"
              className="btn-soft btn-sm"
              onClick={() => setSearchQuery('')}
            >
              おすすめに戻る
            </button>
          )}
        </div>

        {displayedSpots.length > 0 ? (
          <div className="uniform-photo-grid">
            {displayedSpots.map((spot) => {
              const added = addedBySpotId.get(spot.id)
              const cover = spot.photos[0]
              return (
                <button
                  key={spot.id}
                  type="button"
                  className={`spot-photo-card spot-photo-card--visual ${
                    added ? 'spot-photo-card--added' : ''
                  }`}
                  onClick={() => openCatalogDetail(spot)}
                >
                  <div className="uniform-photo-box">
                    <img
                      src={cover.url}
                      alt={cover.caption}
                      loading="lazy"
                      className="spot-photo-card__img"
                    />
                    <div className="spot-photo-card__overlay">
                      <span className="spot-photo-card__overlay-name">{spot.name}</span>
                      <span className="spot-photo-card__overlay-credit">{cover.credit}</span>
                    </div>
                    <span className="spot-photo-card__area">{spot.area}</span>
                    {spot.photos.length > 1 && (
                      <span className="spot-photo-card__gallery-badge">
                        📷 {spot.photos.length}枚
                      </span>
                    )}
                    {added && <span className="spot-photo-card__added-badge">✓ 追加済</span>}
                  </div>
                </button>
              )
            })}
          </div>
        ) : (
          <div className="empty-box">
            {isSearching
              ? '一致するスポットがありません。下から自由に追加できます'
              : `「${destination}」の定番スポットは上の検索欄から自由に追加できます`}
          </div>
        )}

        {isSearching && (
          <div className="custom-spot-trigger">
            <button
              type="button"
              className="btn-primary custom-spot-trigger__btn"
              onClick={() => openCustomDestinationDetail(trimmedQuery)}
            >
              ＋「{trimmedQuery}」を行き先に追加する
            </button>
          </div>
        )}
      </section>

      {/* 選んだ行き先一覧（1つだけ絶対行きたい★を選択可能・写真サイズ統一） */}
      <section className="card">
        <div className="section-heading section-heading--compact">
          <div>
            <h2 className="section-title">{activeMember.name}の選んだ行き先</h2>
            <p className="compact-hero-sub">
              {myStarred
                ? `★ 絶対行きたい（1つだけ）：${myStarred.name}`
                : '一番行きたい1か所に「★ 絶対行きたい」を付けよう'}
            </p>
          </div>
          <span className="count-pill">{activeMember.destinations.length}件</span>
        </div>

        {activeMember.destinations.length === 0 ? (
          <div className="empty-box">上の写真をタップして行き先を追加しよう</div>
        ) : (
          <div className="uniform-photo-grid">
            {activeMember.destinations.map((item) => {
              const cover = item.photos[0] ?? findExactSpotPhoto(item.name, item.area)
              return (
                <article
                  key={item.id}
                  className={`candidate-photo-card ${
                    item.starred ? 'candidate-photo-card--mustgo' : ''
                  }`}
                >
                  <div className="uniform-photo-box">
                    {cover ? (
                      <img src={cover.url} alt={item.name} loading="lazy" />
                    ) : (
                      <div className="spot-photo-fallback">
                        <span>📍</span>
                        <strong>{item.name}</strong>
                      </div>
                    )}
                    <span className="spot-photo-card__area">{item.area}</span>
                    {item.starred && (
                      <span className="spot-photo-card__mustgo-badge">★ 絶対行きたい</span>
                    )}
                    <button
                      type="button"
                      className="candidate-photo-card__del"
                      onClick={() => onDeleteDestination(activeMember.id, item.id)}
                      aria-label={`${item.name}を削除`}
                    >
                      ×
                    </button>
                  </div>
                  <div className="candidate-photo-card__body">
                    <div className="candidate-photo-card__top">
                      <strong className="candidate-card__name">{item.name}</strong>
                      <button
                        type="button"
                        className="btn-soft btn-sm"
                        onClick={() => openExistingCandidateDetail(item)}
                      >
                        編集
                      </button>
                    </div>

                    <button
                      type="button"
                      className={`btn-mustgo btn-mustgo--block ${
                        item.starred ? 'btn-mustgo--active' : ''
                      }`}
                      onClick={() => onSelectOneMustGoStar(activeMember.id, item.id)}
                      aria-pressed={item.starred}
                    >
                      {item.starred ? '★ 絶対行きたい（選択中）' : '☆ 絶対行きたいにする（1つだけ）'}
                    </button>

                    {item.activities.length > 0 && (
                      <div className="candidate-activities">
                        {item.activities.map((act) => (
                          <span key={act} className="candidate-activity-chip">
                            {act}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      {/* 第2階層：詳細設定モーダル（写真ギャラリー＆やりたいこと） */}
      {detailDraft && (
        <div
          className="shiori-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={`${detailDraft.name}の詳細設定`}
          onClick={(e) => {
            if (e.target === e.currentTarget) setDetailDraft(null)
          }}
        >
          <div className="shiori-modal detail-modal">
            <div className="shiori-modal__header">
              <div>
                <span className="shiori-modal__tag">📍 {detailDraft.area}</span>
                <h3 className="shiori-modal__title">{detailDraft.name}</h3>
              </div>
              <button
                type="button"
                className="shiori-modal__close"
                onClick={() => setDetailDraft(null)}
              >
                × 閉じる
              </button>
            </div>

            <div className="shiori-modal__body">
              {detailDraft.photos.length > 0 && (
                <div className="detail-gallery">
                  <div className="detail-gallery__stage">
                    <img
                      src={detailDraft.photos[activePhotoIndex]?.url}
                      alt={detailDraft.photos[activePhotoIndex]?.caption}
                      className="detail-gallery__main-img"
                    />
                    <div className="detail-gallery__caption-bar">
                      <span>{detailDraft.photos[activePhotoIndex]?.caption}</span>
                      <small>{detailDraft.photos[activePhotoIndex]?.credit}</small>
                    </div>
                  </div>

                  {detailDraft.photos.length > 1 && (
                    <div className="detail-gallery__thumbs" role="tablist" aria-label="現地写真ギャラリー">
                      {detailDraft.photos.map((photo, idx) => (
                        <button
                          key={photo.url}
                          type="button"
                          role="tab"
                          aria-selected={idx === activePhotoIndex}
                          className={`detail-gallery__thumb-btn ${
                            idx === activePhotoIndex ? 'detail-gallery__thumb-btn--active' : ''
                          }`}
                          onClick={() => setActivePhotoIndex(idx)}
                        >
                          <img src={photo.url} alt={photo.caption} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="detail-activities-box">
                <div className="detail-activities-box__head">
                  <h4>ここでやりたいこと（任意）</h4>
                  <span>{detailDraft.selectedActivities.length}個</span>
                </div>

                <div className="activity-option-list">
                  {Array.from(
                    new Set([...detailDraft.suggestedActivities, ...detailDraft.selectedActivities]),
                  ).map((activity) => {
                    const isSelected = detailDraft.selectedActivities.includes(activity)
                    return (
                      <button
                        key={activity}
                        type="button"
                        aria-pressed={isSelected}
                        className={`activity-option-chip ${
                          isSelected ? 'activity-option-chip--selected' : ''
                        }`}
                        onClick={() => toggleDraftActivity(activity)}
                      >
                        <span>{isSelected ? '✓' : '＋'}</span>
                        <span>{activity}</span>
                      </button>
                    )
                  })}
                </div>

                <div className="inline-add-form">
                  <input
                    type="text"
                    className="input input--sm"
                    value={customActivityInput}
                    onChange={(e) => setCustomActivityInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddCustomActivity()
                      }
                    }}
                    placeholder="やりたいことを追加..."
                    maxLength={30}
                  />
                  <button
                    type="button"
                    className="btn-soft btn-sm"
                    onClick={handleAddCustomActivity}
                  >
                    ＋
                  </button>
                </div>
              </div>
            </div>

            <div className="detail-modal__footer">
              <button type="button" className="btn-soft" onClick={() => setDetailDraft(null)}>
                キャンセル
              </button>
              <button
                type="button"
                className="btn-primary detail-save-btn"
                onClick={handleSaveDetail}
              >
                {detailDraft.candidateId ? '保存' : '候補に追加'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
