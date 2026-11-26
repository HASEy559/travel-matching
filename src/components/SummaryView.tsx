import { findExactSpotPhoto } from '../spotCatalog'
import type { Member, SpotPhoto } from '../types'
import {
  CARE_CARD_IDS,
  CATEGORY_MAP,
  CONFLICT_PAIRS,
  VALUE_CARD_MAP,
  VALUE_CATEGORIES,
} from '../valueCards'
import { MemberAvatar } from './MemberAvatar'

interface SummaryViewProps {
  destination: string
  members: Member[]
  onEditSetup: () => void
}

interface AggregatedDestination {
  key: string
  name: string
  area: string
  photos: SpotPhoto[]
  selectors: Member[]
  activities: { label: string; voters: Member[] }[]
}

export function SummaryView({ destination, members, onEditSetup }: SummaryViewProps) {
  // 過半数の必要票数：floor(参加者数 / 2) + 1
  const requiredMajority = Math.floor(members.length / 2) + 1

  // 1. 観光地候補（全件・写真付き）
  const destinationMap = new Map<
    string,
    {
      key: string
      name: string
      area: string
      photos: SpotPhoto[]
      selectors: Map<string, Member>
      activityMap: Map<string, Map<string, Member>>
    }
  >()

  members.forEach((member) => {
    member.destinations.forEach((dest) => {
      const key = dest.spotId ? `spot:${dest.spotId}` : `name:${dest.name.trim()}`
      let entry = destinationMap.get(key)
      if (!entry) {
        entry = {
          key,
          name: dest.name.trim(),
          area: dest.area,
          photos: dest.photos,
          selectors: new Map(),
          activityMap: new Map(),
        }
        destinationMap.set(key, entry)
      }
      if (entry.photos.length === 0 && dest.photos.length > 0) {
        entry.photos = dest.photos
      }
      entry.selectors.set(member.id, member)
      dest.activities.forEach((act) => {
        const trimmedAct = act.trim()
        if (!trimmedAct) return
        let voters = entry.activityMap.get(trimmedAct)
        if (!voters) {
          voters = new Map()
          entry.activityMap.set(trimmedAct, voters)
        }
        voters.set(member.id, member)
      })
    })
  })

  const allCandidates: AggregatedDestination[] = Array.from(destinationMap.values())
    .map((entry) => ({
      key: entry.key,
      name: entry.name,
      area: entry.area,
      photos: entry.photos,
      selectors: Array.from(entry.selectors.values()),
      activities: Array.from(entry.activityMap.entries())
        .map(([label, votersMap]) => ({
          label,
          voters: Array.from(votersMap.values()),
        }))
        .sort((a, b) => b.voters.length - a.voters.length),
    }))
    .sort((a, b) => b.selectors.length - a.selectors.length)

  // 2. みんなの希望カードまとめ（過半数以上が選択しているもののみ）
  const valueAggregateMap = new Map<
    string,
    {
      key: string
      text: string
      categoryId: string
      voters: Map<string, Member>
    }
  >()

  members.forEach((member) => {
    const customMap = new Map(member.profile.customCards.map((c) => [c.id, c]))
    const aiMap = new Map(member.profile.aiSuggestedCards.map((c) => [c.id, c]))

    member.profile.selectedCardIds.forEach((cardId) => {
      const base = VALUE_CARD_MAP.get(cardId)
      const custom = customMap.get(cardId)
      const ai = aiMap.get(cardId)

      const text = base?.card.text ?? custom?.text ?? ai?.text
      const categoryId = base?.category.id ?? custom?.categoryId ?? ai?.categoryId
      if (!text || !categoryId) return

      const aggKey = `${categoryId}::${text.trim()}`
      let entry = valueAggregateMap.get(aggKey)
      if (!entry) {
        entry = {
          key: aggKey,
          text: text.trim(),
          categoryId,
          voters: new Map(),
        }
        valueAggregateMap.set(aggKey, entry)
      }
      entry.voters.set(member.id, member)
    })
  })

  const majorityValueCards =
    members.length > 0
      ? Array.from(valueAggregateMap.values())
          .map((entry) => ({
            ...entry,
            category: CATEGORY_MAP.get(entry.categoryId) ?? VALUE_CATEGORIES[0],
            voters: Array.from(entry.voters.values()),
          }))
          .filter((item) => item.voters.length >= requiredMajority)
          .sort((a, b) => b.voters.length - a.voters.length)
      : []

  // 3. 意見が分かれたポイント
  const activeConflicts = CONFLICT_PAIRS.map((pair) => {
    const itemA = VALUE_CARD_MAP.get(pair.a)
    const itemB = VALUE_CARD_MAP.get(pair.b)
    const votersA = members.filter((m) => m.profile.selectedCardIds.includes(pair.a))
    const votersB = members.filter((m) => m.profile.selectedCardIds.includes(pair.b))
    return {
      topic: pair.topic,
      cardA: itemA?.card,
      cardB: itemB?.card,
      votersA,
      votersB,
    }
  }).filter((c) => c.votersA.length > 0 && c.votersB.length > 0 && c.cardA && c.cardB)

  // 4. 大事にしたい配慮カード
  const activeCareCards = CARE_CARD_IDS.map((cardId) => {
    const entry = VALUE_CARD_MAP.get(cardId)
    const voters = members.filter((m) => m.profile.selectedCardIds.includes(cardId))
    return entry ? { ...entry, voters } : null
  }).filter(
    (item): item is NonNullable<typeof item> => Boolean(item && item.voters.length > 0),
  )

  return (
    <div className="screen-stack">
      {/* サマリーヘッダー */}
      <section className="coordinator-banner coordinator-banner--compact">
        <div className="coordinator-banner__header">
          <span className="coordinator-badge">STEP 4｜まとめ</span>
          <span className="coordinator-dest">
            📍 {destination.trim() ? `${destination}` : '未設定'}（{members.length}人）
          </span>
        </div>
        <h2 className="coordinator-banner__title">みんなのまとめ</h2>
      </section>

      {/* (1) みんなの希望カードまとめ（過半数以上のみ表示） */}
      <section className="card">
        <div className="section-heading section-heading--compact">
          <h3 className="summary-section-title">🔖 みんなの希望まとめ（過半数）</h3>
          <span className="count-pill">{requiredMajority}人〜</span>
        </div>

        {majorityValueCards.length === 0 ? (
          <div className="empty-box">
            過半数（{requiredMajority}人以上）が選んだ希望カードはまだありません
          </div>
        ) : (
          <ul className="value-summary-list">
            {majorityValueCards.map(({ key, text, category, voters }) => {
              const isAll = voters.length === members.length && members.length > 1
              return (
                <li
                  key={key}
                  className={`value-summary-item ${isAll ? 'value-summary-item--all' : ''}`}
                  style={{ borderLeftColor: category.color }}
                >
                  <div className="value-summary-item__text">
                    {text}
                    {isAll && <span className="unanimous-badge">全員一致</span>}
                  </div>
                  <div className="avatar-group">
                    {voters.map((m) => (
                      <MemberAvatar key={m.id} member={m} size="sm" />
                    ))}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {/* (2) みんなの観光地候補（写真メイン・全件表示） */}
      <section className="card">
        <div className="section-heading section-heading--compact">
          <h3 className="summary-section-title">📍 選んだ行き先候補</h3>
          <span className="count-pill">{allCandidates.length}件</span>
        </div>

        {allCandidates.length === 0 ? (
          <div className="empty-box">まだ行き先候補がありません</div>
        ) : (
          <div className="uniform-photo-grid">
            {allCandidates.map((item) => {
              const cover = item.photos[0] ?? findExactSpotPhoto(item.name, item.area)
              return (
                <article key={item.key} className="summary-photo-card">
                  <div className="uniform-photo-box">
                    {cover ? (
                      <img
                        src={cover.url}
                        alt={item.name}
                        className="spot-photo-card__img"
                        loading="lazy"
                      />
                    ) : (
                      <div className="spot-photo-fallback">
                        <span>📍</span>
                        <strong>{item.name}</strong>
                      </div>
                    )}
                    <span className="spot-photo-card__area">{item.area}</span>
                    <div className="summary-photo-card__avatars">
                      {item.selectors.map((m) => (
                        <MemberAvatar key={m.id} member={m} size="sm" />
                      ))}
                    </div>
                  </div>
                  <div className="summary-photo-card__body">
                    <strong className="summary-dest-card__name">{item.name}</strong>
                    {item.activities.length > 0 && (
                      <div className="candidate-activities">
                        {item.activities.map((act) => (
                          <span key={act.label} className="candidate-activity-chip">
                            {act.label}
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

      {/* (3) すり合わせポイント */}
      {activeConflicts.length > 0 && (
        <section className="card card--compact conflict-card">
          <div className="section-heading section-heading--compact">
            <h3 className="summary-section-title">⚠️ 意見が分かれた点</h3>
            <span className="conflict-pill">{activeConflicts.length}件</span>
          </div>
          <div className="conflict-list">
            {activeConflicts.map((c) => (
              <div key={c.topic} className="conflict-item">
                <div className="conflict-item__topic">{c.topic}</div>
                <div className="conflict-item__vs">
                  <div className="conflict-side">
                    <div className="conflict-side__text">{c.cardA?.text}</div>
                    <div className="avatar-group">
                      {c.votersA.map((m) => (
                        <MemberAvatar key={m.id} member={m} size="sm" />
                      ))}
                    </div>
                  </div>
                  <span className="conflict-vs-badge">VS</span>
                  <div className="conflict-side">
                    <div className="conflict-side__text">{c.cardB?.text}</div>
                    <div className="avatar-group">
                      {c.votersB.map((m) => (
                        <MemberAvatar key={m.id} member={m} size="sm" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* (4) 配慮カード */}
      {activeCareCards.length > 0 && (
        <section className="card card--compact care-card">
          <div className="section-heading section-heading--compact">
            <h3 className="summary-section-title">💚 気をつけたい配慮</h3>
            <span className="care-pill">{activeCareCards.length}件</span>
          </div>
          <ul className="care-list">
            {activeCareCards.map(({ card, category, voters }) => (
              <li key={card.id} className="care-item">
                <span
                  className="care-item__dot"
                  style={{ backgroundColor: category.color }}
                  aria-hidden="true"
                />
                <span className="care-item__text">{card.text}</span>
                <div className="avatar-group">
                  {voters.map((m) => (
                    <MemberAvatar key={m.id} member={m} size="sm" />
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="summary-footer-link">
        <button type="button" className="btn-soft btn-sm" onClick={onEditSetup}>
          ⚙️ 目的地・メンバーを見直す
        </button>
      </div>
    </div>
  )
}
