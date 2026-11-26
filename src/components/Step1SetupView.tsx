import { useState } from 'react'
import type { FormEvent } from 'react'
import { POPULAR_DESTINATIONS } from '../spotCatalog'
import type { Member } from '../types'
import { MemberAvatar } from './MemberAvatar'

interface Step1SetupViewProps {
  destination: string
  members: Member[]
  shareUrl: string
  onChangeDestination: (next: string) => void
  onAddMember: (name: string) => void
  onRenameMember: (memberId: string, name: string) => void
  onRemoveMember: (memberId: string) => void
  onGoNext: () => void
  onOpenMemberPreview: () => void
}

const CIRCLED_NUMBERS = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩']

export function Step1SetupView({
  destination,
  members,
  shareUrl,
  onChangeDestination,
  onAddMember,
  onRenameMember,
  onRemoveMember,
  onGoNext,
  onOpenMemberPreview,
}: Step1SetupViewProps) {
  const [newMemberName, setNewMemberName] = useState('')
  const [copied, setCopied] = useState(false)

  const handleAddMemberSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = newMemberName.trim()
    if (!trimmed) return
    onAddMember(trimmed)
    setNewMemberName('')
  }

  const handleCopyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2500)
    } catch {
      // クリップボードAPIが使えない場合は選択フォールバック
      const el = document.getElementById('share-url-input') as HTMLInputElement | null
      if (el) {
        el.select()
        document.execCommand('copy')
        setCopied(true)
        window.setTimeout(() => setCopied(false), 2500)
      }
    }
  }

  return (
    <div className="screen-stack">
      {/* 招待された人向けの即スキップ導線 */}
      <div className="skip-banner">
        <div className="skip-banner__text">
          <strong>すでに目的地・メンバーが入力済みの方へ</strong>
          <span>代表者以外は1画面目を飛ばして、すぐ自分の希望を入力できます。</span>
        </div>
        <button type="button" className="btn-skip" onClick={onGoNext}>
          すぐ2画面目へ →
        </button>
      </div>

      {/* 1. 旅の目的地 */}
      <section className="card">
        <div className="section-heading section-heading--compact">
          <div>
            <span className="screen-tag">STEP 1｜代表者セットアップ</span>
            <h2 className="section-title">1. 旅の目的地を入力</h2>
            <p className="section-subtitle">
              ここで決めた目的地をもとに、次の画面でAIがおすすめの行先を提案します
            </p>
          </div>
        </div>

        <div className="destination-input-wrap">
          <span className="destination-input-wrap__pin" aria-hidden="true">
            📍
          </span>
          <input
            type="text"
            className="input destination-input-lg"
            value={destination}
            onChange={(e) => onChangeDestination(e.target.value)}
            placeholder="例：広島、京都、沖縄、北海道..."
            maxLength={30}
          />
        </div>

        <div className="quick-dest-row" aria-label="人気の目的地候補">
          <span className="quick-dest-row__label">候補から選ぶ：</span>
          {POPULAR_DESTINATIONS.map((place) => (
            <button
              key={place}
              type="button"
              className={`quick-chip ${destination === place ? 'quick-chip--active' : ''}`}
              onClick={() => onChangeDestination(place)}
            >
              {place}
            </button>
          ))}
        </div>
      </section>

      {/* 2. メンバー名 */}
      <section className="card">
        <div className="section-heading section-heading--compact">
          <div>
            <h2 className="section-title">2. グループのメンバーを入力</h2>
            <p className="section-subtitle">名前はそのまま書き換えられます</p>
          </div>
          <span className="count-pill">{members.length}人</span>
        </div>

        {members.length === 0 ? (
          <div className="empty-box">
            まだメンバーが登録されていません。下の入力欄からメンバーを追加しよう！
          </div>
        ) : (
          <ul className="member-edit-list">
            {members.map((member, index) => (
              <li key={member.id} className="member-edit-row">
                <span className="member-row__num">
                  {CIRCLED_NUMBERS[index] ?? `${index + 1}.`}
                </span>
                <input
                  type="text"
                  className="input input--sm member-name-input"
                  value={member.name}
                  onChange={(e) => onRenameMember(member.id, e.target.value)}
                  aria-label={`${index + 1}人目のメンバー名`}
                  maxLength={20}
                />
                <MemberAvatar member={member} size="md" />
                <button
                  type="button"
                  className="btn-icon-danger"
                  onClick={() => onRemoveMember(member.id)}
                  title={`${member.name}を削除`}
                  aria-label={`${member.name}を削除`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}

        <form className="inline-add-form" onSubmit={handleAddMemberSubmit}>
          <input
            type="text"
            className="input"
            value={newMemberName}
            onChange={(e) => setNewMemberName(e.target.value)}
            placeholder="メンバーを追加（例：Eさん、ゆうき）"
            maxLength={20}
          />
          <button type="submit" className="btn-secondary">
            ＋ 追加
          </button>
        </form>
      </section>

      {/* 3. 共有URL */}
      <section className="card share-card">
        <div className="section-heading section-heading--compact">
          <div>
            <h2 className="section-title">3. このURLをみんなに共有しよう</h2>
            <p className="section-subtitle">
              URLを開いたメンバーは1画面目を飛ばして、自動で<strong>2画面目</strong>から入力を始められます！
            </p>
          </div>
          <span className="share-badge">LINE等で送信</span>
        </div>

        {members.length === 0 ? (
          <div className="empty-box">
            上で目的地とメンバーを1人以上入力すると、ここに共有用URLが発行されます。
          </div>
        ) : (
          <>
            <div className="share-url-box">
              <input
                id="share-url-input"
                type="text"
                readOnly
                className="input input--sm share-url-input"
                value={shareUrl}
                onFocus={(e) => e.currentTarget.select()}
              />
              <button type="button" className="btn-primary" onClick={handleCopyShareUrl}>
                {copied ? '✓ コピー済' : '📋 コピー'}
              </button>
            </div>

            <div className="share-card__actions">
              <button type="button" className="btn-soft btn-sm" onClick={onOpenMemberPreview}>
                🔗 共有URLの動きをテスト（2画面目から開く）
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  )
}

