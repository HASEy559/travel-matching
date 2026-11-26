import { buildGoogleMapsUrl } from '../services/aiFacilitator'
import { findExactSpotPhoto } from '../spotCatalog'
import type { TravelState } from '../types'

interface Step6PlanViewProps {
  state: TravelState
  daysCount: number
  isGeneratingPlan: boolean
  onChangeDaysCount: (days: number) => void
  onGeneratePlan: () => void
  onBackToVote: () => void
}

export function Step6PlanView({
  state,
  daysCount,
  isGeneratingPlan,
  onChangeDaysCount,
  onGeneratePlan,
  onBackToVote,
}: Step6PlanViewProps) {
  const { aiTravelPlan, consensusSpots } = state

  const photoBySpotName = new Map<string, string>()
  consensusSpots.forEach((sp) => {
    if (sp.photoUrl) photoBySpotName.set(sp.spotName.trim(), sp.photoUrl)
  })
  state.members.forEach((m) => {
    m.destinations.forEach((d) => {
      if (d.photos[0]?.url) photoBySpotName.set(d.name.trim(), d.photos[0].url)
    })
  })

  return (
    <div className="screen-stack">
      {/* 日数切り替え＆再生成バー */}
      <section className="card card--compact">
        <div className="plan-launch-card__top">
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
          <button
            type="button"
            className="btn-primary btn-sm"
            disabled={isGeneratingPlan || consensusSpots.length === 0}
            onClick={onGeneratePlan}
          >
            {isGeneratingPlan ? '作成中...' : aiTravelPlan ? '🔄 作り直す' : '✨ 計画を提案する'}
          </button>
        </div>
      </section>

      {!aiTravelPlan ? (
        <section className="card empty-step-card">
          <h2 className="section-title">計画のたたき台を作成しよう</h2>
          <p className="section-subtitle">
            {consensusSpots.length === 0
              ? 'Step 5 で候補スポットを追加してから計画を提案できます。'
              : '投票結果と「★ 絶対行きたい」から写真付きのスケジュールを作成します。'}
          </p>
          {consensusSpots.length === 0 ? (
            <button type="button" className="btn-primary" onClick={onBackToVote}>
              ← 合意・投票タブへ戻る
            </button>
          ) : (
            <button
              type="button"
              className="btn-primary"
              disabled={isGeneratingPlan}
              onClick={onGeneratePlan}
            >
              {isGeneratingPlan ? '作成中...' : '✨ 計画を提案する'}
            </button>
          )}
        </section>
      ) : (
        <>
          {/* プランタイトル＆解説 */}
          <section className="plan-hero">
            <span className="coordinator-badge">STEP 6｜計画のたたき台</span>
            <h2 className="plan-hero__title">{aiTravelPlan.plan_title}</h2>
            <p className="plan-hero__overview">{aiTravelPlan.overview}</p>
          </section>

          {/* 注意点（ある場合のみ） */}
          {aiTravelPlan.warnings.length > 0 && (
            <section className="plan-warnings">
              <strong>⚠️ 注意点</strong>
              <ul>
                {aiTravelPlan.warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </section>
          )}

          {/* 日別・写真付きタイムライン */}
          <div className="plan-days">
            {aiTravelPlan.days.map((dayObj) => (
              <section key={dayObj.day} className="card plan-day-card">
                <div className="station-sign-mini">
                  <span className="station-sign-mini__num">DAY {dayObj.day}</span>
                  <span className="station-sign-mini__name">{dayObj.theme}</span>
                </div>

                <ol className="photo-timeline-list">
                  {dayObj.schedule.map((item, idx) => {
                    const matchedUrl =
                      photoBySpotName.get(item.spot_name.trim()) ??
                      findExactSpotPhoto(item.spot_name, item.google_maps_query)?.url ??
                      null
                    return (
                      <li
                        key={`${dayObj.day}-${idx}-${item.spot_name}`}
                        className={`photo-timeline-item ${
                          item.is_must_go ? 'photo-timeline-item--mustgo' : ''
                        }`}
                      >
                        <div className="photo-timeline-item__media">
                          {matchedUrl ? (
                            <img src={matchedUrl} alt={item.spot_name} loading="lazy" />
                          ) : (
                            <div className="spot-photo-fallback spot-photo-fallback--lg">
                              <span>📍</span>
                              <strong>{item.spot_name}</strong>
                            </div>
                          )}
                          <span className="photo-timeline-item__time">{item.time}</span>
                          {item.is_must_go && (
                            <span className="photo-timeline-item__mustgo">
                              ★ 絶対行きたい
                              {item.requested_by ? `（${item.requested_by}）` : ''}
                            </span>
                          )}
                        </div>
                        <div className="photo-timeline-item__body">
                          <div className="photo-timeline-item__top">
                            <strong className="timeline-item__spot">{item.spot_name}</strong>
                            <a
                              href={buildGoogleMapsUrl(item.google_maps_query)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="gmaps-link"
                            >
                              📍 Googleマップ ↗
                            </a>
                          </div>
                          <p className="timeline-item__activity">{item.activity}</p>
                        </div>
                      </li>
                    )
                  })}
                </ol>
              </section>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

