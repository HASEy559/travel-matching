import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties, FormEvent } from 'react'
import type { CustomValueCard, Member } from '../types'
import {
  CATEGORY_MAP,
  MAX_CARDS_PER_CATEGORY,
  VALUE_CARD_MAP,
  VALUE_CATEGORIES,
} from '../valueCards'
import { MemberAvatar } from './MemberAvatar'

interface ProfileViewProps {
  members: Member[]
  activeMember: Member
  isGeneratingAi: boolean
  onChangeActiveMember: (memberId: string) => void
  onToggleValueCard: (
    memberId: string,
    cardId: string,
    meta?: { categoryId: string; text: string },
  ) => void
  onAddCustomCard: (memberId: string, categoryId: string, text: string) => void
  onEditCustomCard: (memberId: string, cardId: string, nextText: string) => void
}

function PencilCheckMini({ checked, color }: { checked: boolean; color: string }) {
  if (!checked) {
    return (
      <span
        className="compact-check-empty"
        style={{ borderColor: `${color}66` }}
        aria-hidden="true"
      />
    )
  }
  return (
    <span className="compact-check-picked" aria-hidden="true">
      <svg viewBox="0 0 28 28" width="22" height="22" fill="none">
        <path
          d="M15 3.5 C8 3.2, 3.2 8.4, 3.6 14.8 C4 21.4, 9.4 25, 15.6 24.5 C21.8 24, 25.4 18.8, 24.5 12.8 C23.6 7.2, 19 3.8, 13.2 4.2"
          stroke="#FFFFFF"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M8.8 14.5 L12.6 18.2 L19.6 10.2"
          stroke="#FFFFFF"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

export function ProfileView({
  members,
  activeMember,
  isGeneratingAi,
  onChangeActiveMember,
  onToggleValueCard,
  onAddCustomCard,
  onEditCustomCard,
}: ProfileViewProps) {
  const [isShioriOpen, setIsShioriOpen] = useState(false)
  const [isAiPopupOpen, setIsAiPopupOpen] = useState(false)
  const [justTappedId, setJustTappedId] = useState<string | null>(null)
  const [writingCategoryId, setWritingCategoryId] = useState<string | null>(null)
  const [writeDraft, setWriteDraft] = useState('')
  const [editingCustom, setEditingCustom] = useState<CustomValueCard | null>(null)
  const [editDraft, setEditDraft] = useState('')

  const selectedSet = useMemo(
    () => new Set(activeMember.profile.selectedCardIds),
    [activeMember.profile.selectedCardIds],
  )

  const selectedCount = activeMember.profile.selectedCardIds.length
  const customCards = activeMember.profile.customCards
  const aiSuggestedCards = activeMember.profile.aiSuggestedCards

  // AI提案が到着したら右隣ポップアップを自動で開く
  useEffect(() => {
    if (isGeneratingAi || aiSuggestedCards.length > 0) {
      setIsAiPopupOpen(true)
    }
  }, [isGeneratingAi, aiSuggestedCards.length])

  const selectedByCategory = useMemo(() => {
    return VALUE_CATEGORIES.map((category) => {
      const items: { id: string; text: string; badge?: string }[] = []

      category.cards.forEach((c) => {
        if (selectedSet.has(c.id)) items.push({ id: c.id, text: c.text })
      })
      customCards
        .filter((c) => c.categoryId === category.id && selectedSet.has(c.id))
        .forEach((c) => items.push({ id: c.id, text: c.text, badge: '手書き' }))
      aiSuggestedCards
        .filter((c) => c.categoryId === category.id && selectedSet.has(c.id))
        .forEach((c) => items.push({ id: c.id, text: c.text, badge: 'AI関連' }))

      return { category, items }
    }).filter((group) => group.items.length > 0)
  }, [selectedSet, customCards, aiSuggestedCards])

  const triggerRichTap = (cardId: string, categoryId: string, text: string) => {
    setJustTappedId(cardId)
    window.setTimeout(() => {
      setJustTappedId((cur) => (cur === cardId ? null : cur))
    }, 340)
    onToggleValueCard(activeMember.id, cardId, { categoryId, text })
  }

  const handleSaveNewCustomCard = (e: FormEvent) => {
    e.preventDefault()
    if (!writingCategoryId) return
    const trimmed = writeDraft.trim()
    if (!trimmed) return
    onAddCustomCard(activeMember.id, writingCategoryId, trimmed)
    setWriteDraft('')
    setWritingCategoryId(null)
  }

  const handleSaveEditedCustomCard = (e: FormEvent) => {
    e.preventDefault()
    if (!editingCustom) return
    const trimmed = editDraft.trim()
    if (!trimmed) return
    onEditCustomCard(activeMember.id, editingCustom.id, trimmed)
    setEditingCustom(null)
    setEditDraft('')
  }

  const scrollToCategory = (categoryId: string) => {
    const el = document.getElementById(`cat-section-${categoryId}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const getCategorySelectedCount = (categoryId: string) => {
    let count = 0
    for (const id of activeMember.profile.selectedCardIds) {
      const base = VALUE_CARD_MAP.get(id)
      if (base && base.category.id === categoryId) count += 1
      const custom = customCards.find((c) => c.id === id)
      if (custom && custom.categoryId === categoryId) count += 1
      const ai = aiSuggestedCards.find((c) => c.id === id)
      if (ai && ai.categoryId === categoryId) count += 1
    }
    return count
  }

  const hasAiContent = isGeneratingAi || aiSuggestedCards.length > 0

  return (
    <div className="step3-layout shiori-step3">
      {/* 左メイン：10カテゴリーの希望カード */}
      <div className="screen-stack step3-main-col">
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

        {/* コンパクトなヘッダー＆10色カテゴリジャンプ */}
        <section className="card shiori-hero-card shiori-hero-card--compact">
          <div className="compact-hero-head">
            <div>
              <h2 className="shiori-hero-title shiori-hero-title--sm">旅行の希望を選ぼう</h2>
              <p className="compact-hero-sub">
                自分に当てはまるカードをタップしてね。いくつ選んでもOK
              </p>
            </div>
            <span className="selection-counter-pill">
              選択中 <strong>{selectedCount}</strong>枚
            </span>
          </div>

          <div className="category-tabs" aria-label="カテゴリーへジャンプ">
            {VALUE_CATEGORIES.map((category) => {
              const countInCat = getCategorySelectedCount(category.id)
              return (
                <button
                  key={category.id}
                  type="button"
                  className="category-tab category-tab--themed"
                  style={{
                    borderColor: category.color,
                    backgroundColor: category.softBg,
                    color: category.color,
                  }}
                  onClick={() => scrollToCategory(category.id)}
                >
                  <span
                    className="category-tab__num"
                    style={{ backgroundColor: category.color, color: '#fff' }}
                  >
                    {category.number}
                  </span>
                  <span>{category.name}</span>
                  {countInCat > 0 && (
                    <span
                      className="category-tab__badge"
                      style={{ backgroundColor: category.color }}
                    >
                      {countInCat}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </section>

        {/* 全10カテゴリー（各テーマカラー・1カテゴリ最大15枚表示・リッチタップ） */}
        {VALUE_CATEGORIES.map((category) => {
          const catCustomCards = customCards.filter((c) => c.categoryId === category.id)
          const totalInCategory = category.cards.length + catCustomCards.length
          const visibleBaseCards = category.cards.slice(0, MAX_CARDS_PER_CATEGORY)
          const remainingSlotsForCustom = Math.max(
            0,
            MAX_CARDS_PER_CATEGORY - visibleBaseCards.length,
          )
          const visibleCustomCards = catCustomCards.slice(0, remainingSlotsForCustom)
          const canAddMore = totalInCategory < MAX_CARDS_PER_CATEGORY
          const countInCat = getCategorySelectedCount(category.id)

          const themeVars = {
            '--cat-color': category.color,
            '--cat-soft': category.softBg,
          } as CSSProperties

          return (
            <section
              key={category.id}
              id={`cat-section-${category.id}`}
              className="card card--compact category-scroll-section category-themed-section"
              style={themeVars}
            >
              <div
                className="station-sign-inline"
                style={{
                  borderColor: category.color,
                  backgroundColor: category.softBg,
                }}
              >
                <span
                  className="station-sign-mini__num"
                  style={{ backgroundColor: category.color, color: '#fff' }}
                >
                  {category.number}
                </span>
                <h3 className="station-sign-inline__name" style={{ color: category.color }}>
                  {category.name}
                </h3>
                <span className="station-sign-inline__count" style={{ color: category.color }}>
                  {countInCat > 0 ? `${countInCat}選択` : ''}
                </span>
              </div>

              <div className="compact-card-grid" role="group" aria-label={category.name}>
                {visibleBaseCards.map((card) => {
                  const isSelected = selectedSet.has(card.id)
                  const isPopping = justTappedId === card.id
                  return (
                    <button
                      key={card.id}
                      type="button"
                      aria-pressed={isSelected}
                      className={`compact-value-card compact-value-card--rich ${
                        isSelected ? 'compact-value-card--selected-themed' : ''
                      } ${isPopping ? 'compact-value-card--pop' : ''}`}
                      style={
                        isSelected
                          ? {
                              backgroundColor: category.color,
                              borderColor: category.color,
                              color: '#ffffff',
                            }
                          : {
                              borderColor: `${category.color}55`,
                              borderLeftColor: category.color,
                            }
                      }
                      onClick={() => triggerRichTap(card.id, category.id, card.text)}
                    >
                      <span className="compact-value-card__text">{card.text}</span>
                      <PencilCheckMini checked={isSelected} color={category.color} />
                    </button>
                  )
                })}

                {visibleCustomCards.map((customCard) => {
                  const isSelected = selectedSet.has(customCard.id)
                  const isPopping = justTappedId === customCard.id
                  return (
                    <div key={customCard.id} className="compact-custom-wrap">
                      <button
                        type="button"
                        aria-pressed={isSelected}
                        className={`compact-value-card compact-value-card--rich ${
                          isSelected ? 'compact-value-card--selected-themed' : ''
                        } ${isPopping ? 'compact-value-card--pop' : ''}`}
                        style={
                          isSelected
                            ? {
                                backgroundColor: category.color,
                                borderColor: category.color,
                                color: '#ffffff',
                              }
                            : {
                                borderColor: `${category.color}55`,
                                borderLeftColor: category.color,
                              }
                        }
                        onClick={() => triggerRichTap(customCard.id, category.id, customCard.text)}
                      >
                        <span className="compact-value-card__text">{customCard.text}</span>
                        <PencilCheckMini checked={isSelected} color={category.color} />
                      </button>
                      <button
                        type="button"
                        className={`compact-edit-btn ${isSelected ? 'compact-edit-btn--light' : ''}`}
                        onClick={() => {
                          setEditingCustom(customCard)
                          setEditDraft(customCard.text)
                        }}
                        aria-label={`「${customCard.text}」を編集`}
                      >
                        ✎
                      </button>
                    </div>
                  )
                })}

                {canAddMore && (
                  <button
                    type="button"
                    className="compact-value-card compact-value-card--blank compact-value-card--rich"
                    style={{ borderColor: `${category.color}88`, color: category.color }}
                    onClick={() => {
                      setWritingCategoryId(category.id)
                      setWriteDraft('')
                    }}
                  >
                    <span className="compact-value-card__text">＋ 自分で書く</span>
                  </button>
                )}
              </div>
            </section>
          )
        })}
      </div>

      {/* 右隣ポップアップ：AIが提案する「関連する希望」 */}
      {hasAiContent && (
        <aside className="ai-side-popup-anchor" aria-live="polite">
          {isAiPopupOpen ? (
            <div className="ai-side-popup">
              <div className="ai-side-popup__header">
                <div className="ai-side-popup__title">
                  <span>✨ 関連する希望</span>
                  {isGeneratingAi && <span className="ai-loading-pill">提案中...</span>}
                </div>
                <button
                  type="button"
                  className="ai-side-popup__close"
                  onClick={() => setIsAiPopupOpen(false)}
                  aria-label="関連する希望ポップアップを閉じる"
                >
                  ×
                </button>
              </div>
              <div className="ai-side-popup__list">
                {aiSuggestedCards.map((aiCard) => {
                  const category = CATEGORY_MAP.get(aiCard.categoryId) ?? VALUE_CATEGORIES[0]
                  const isSelected = selectedSet.has(aiCard.id)
                  const isPopping = justTappedId === aiCard.id
                  return (
                    <button
                      key={aiCard.id}
                      type="button"
                      aria-pressed={isSelected}
                      className={`compact-value-card compact-value-card--rich ai-popup-card ${
                        isSelected ? 'compact-value-card--selected-themed' : ''
                      } ${isPopping ? 'compact-value-card--pop' : ''}`}
                      style={
                        isSelected
                          ? {
                              backgroundColor: category.color,
                              borderColor: category.color,
                              color: '#ffffff',
                            }
                          : {
                              borderColor: `${category.color}77`,
                              borderLeftColor: category.color,
                            }
                      }
                      onClick={() => triggerRichTap(aiCard.id, aiCard.categoryId, aiCard.text)}
                    >
                      <span className="compact-value-card__text">{aiCard.text}</span>
                      <PencilCheckMini checked={isSelected} color={category.color} />
                    </button>
                  )
                })}
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="ai-side-popup-reopen"
              onClick={() => setIsAiPopupOpen(true)}
            >
              ✨ 関連する希望（{aiSuggestedCards.length}）
            </button>
          )}
        </aside>
      )}

      {/* 画面下部ドック */}
      <div className="shiori-dock" role="region" aria-label="選んだ希望の確認">
        <div className="shiori-dock__inner">
          <div className="shiori-dock__count">
            <span className="shiori-dock__prefix">選択中</span>
            <span className="shiori-dock__num">{selectedCount}</span>
            <span className="shiori-dock__label">枚</span>
          </div>
          <button
            type="button"
            className="shiori-dock__btn"
            onClick={() => setIsShioriOpen(true)}
          >
            📖 自分のしおりを見る
          </button>
        </div>
      </div>

      {/* 自由入力モーダル */}
      {writingCategoryId && (
        <div
          className="shiori-modal-backdrop"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setWritingCategoryId(null)
          }}
        >
          <div className="shiori-modal shiori-modal--sm">
            <div className="shiori-modal__header">
              <h3 className="shiori-modal__title">
                {CATEGORY_MAP.get(writingCategoryId)?.name ?? ''} に追加
              </h3>
              <button
                type="button"
                className="shiori-modal__close"
                onClick={() => setWritingCategoryId(null)}
              >
                ×
              </button>
            </div>
            <form className="shiori-modal__body" onSubmit={handleSaveNewCustomCard}>
              <input
                type="text"
                className="input"
                value={writeDraft}
                onChange={(e) => setWriteDraft(e.target.value)}
                placeholder="希望を入力（保存すると自動で選択されます）"
                maxLength={50}
                autoFocus
              />
              <div className="custom-modal-actions">
                <button
                  type="button"
                  className="btn-soft"
                  onClick={() => setWritingCategoryId(null)}
                >
                  キャンセル
                </button>
                <button type="submit" className="btn-primary" disabled={!writeDraft.trim()}>
                  保存して選択
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 編集モーダル */}
      {editingCustom && (
        <div
          className="shiori-modal-backdrop"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingCustom(null)
          }}
        >
          <div className="shiori-modal shiori-modal--sm">
            <div className="shiori-modal__header">
              <h3 className="shiori-modal__title">カードを編集</h3>
              <button
                type="button"
                className="shiori-modal__close"
                onClick={() => setEditingCustom(null)}
              >
                ×
              </button>
            </div>
            <form className="shiori-modal__body" onSubmit={handleSaveEditedCustomCard}>
              <input
                type="text"
                className="input"
                value={editDraft}
                onChange={(e) => setEditDraft(e.target.value)}
                maxLength={50}
                autoFocus
              />
              <div className="custom-modal-actions">
                <button
                  type="button"
                  className="btn-soft"
                  onClick={() => setEditingCustom(null)}
                >
                  キャンセル
                </button>
                <button type="submit" className="btn-primary" disabled={!editDraft.trim()}>
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 「自分のしおり」モーダル */}
      {isShioriOpen && (
        <div
          className="shiori-modal-backdrop"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsShioriOpen(false)
          }}
        >
          <div className="shiori-modal">
            <div className="shiori-modal__header">
              <h3 className="shiori-modal__title">
                📖 {activeMember.name}のしおり（{selectedCount}枚）
              </h3>
              <button
                type="button"
                className="shiori-modal__close"
                onClick={() => setIsShioriOpen(false)}
              >
                × 閉じる
              </button>
            </div>

            <div className="shiori-modal__body">
              {selectedByCategory.length === 0 ? (
                <div className="empty-box">まだ選択されていません</div>
              ) : (
                <div className="shiori-scrapbook">
                  {selectedByCategory.map(({ category, items }) => (
                    <div key={category.id} className="shiori-scrapbook-group">
                      <div
                        className="station-sign-mini"
                        style={{ borderColor: category.color, color: category.color }}
                      >
                        <span
                          className="station-sign-mini__num"
                          style={{ backgroundColor: category.color, color: '#fff' }}
                        >
                          {category.number}
                        </span>
                        <span className="station-sign-mini__name">{category.name}</span>
                        <span className="station-sign-mini__count">{items.length}枚</span>
                      </div>

                      <div className="taped-ticket-grid">
                        {items.map((item, idx) => (
                          <div
                            key={item.id}
                            className={`taped-ticket ${
                              idx % 2 === 0 ? 'taped-ticket--tilt-l' : 'taped-ticket--tilt-r'
                            }`}
                            style={{ borderColor: category.color }}
                          >
                            <span
                              className="masking-tape masking-tape--ticket"
                              style={{ backgroundColor: category.tapeColor }}
                              aria-hidden="true"
                            />
                            <div className="taped-ticket__content">
                              <span className="taped-ticket__text" style={{ color: category.color }}>
                                {item.text}
                              </span>
                              <button
                                type="button"
                                className="taped-ticket__remove"
                                onClick={() =>
                                  onToggleValueCard(activeMember.id, item.id, {
                                    categoryId: category.id,
                                    text: item.text,
                                  })
                                }
                              >
                                外す
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
