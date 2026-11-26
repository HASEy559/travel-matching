import { SPOT_CATALOG } from '../spotCatalog'
import type {
  AiConflictMediationResponse,
  AiScheduleDay,
  AiScheduleItem,
  AiTravelPlanResponse,
  AiZeroSuggestionItem,
  AiZeroSuggestionsResponse,
  ConsensusSpot,
  TravelState,
} from '../types'
import { VALUE_CARD_MAP } from '../valueCards'

/**
 * Googleマップ検索URLをアプリ側で安全に組み立てる（AIにはURLを直接生成させない）
 */
export function buildGoogleMapsUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query.trim())}`
}

/** グループの価値観サマリー文字列を組み立てる */
function summarizeGroupContext(state: TravelState) {
  const cardCounts = new Map<string, { text: string; count: number }>()
  state.members.forEach((m) => {
    const customMap = new Map(m.profile.customCards.map((c) => [c.id, c.text]))
    const aiMap = new Map(m.profile.aiSuggestedCards.map((c) => [c.id, c.text]))
    m.profile.selectedCardIds.forEach((id) => {
      const text = VALUE_CARD_MAP.get(id)?.card.text ?? customMap.get(id) ?? aiMap.get(id)
      if (!text) return
      const cur = cardCounts.get(text)
      cardCounts.set(text, { text, count: (cur?.count ?? 0) + 1 })
    })
  })

  const topValues = Array.from(cardCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)
    .map((v) => `${v.text}（${v.count}人）`)

  const allStep2Spots = Array.from(
    new Set(state.members.flatMap((m) => m.destinations.map((d) => d.name))),
  )

  const hasSlowMorning = state.members.some((m) => m.profile.selectedCardIds.includes('c10'))
  const hasEarlyMorning = state.members.some((m) => m.profile.selectedCardIds.includes('c09'))
  const hasLowWalk = state.members.some((m) => m.profile.selectedCardIds.includes('c34'))
  const hasGourmet = state.members.some(
    (m) =>
      m.profile.selectedCardIds.includes('c02') || m.profile.selectedCardIds.includes('c30'),
  )
  const hasOnsen = state.members.some((m) => m.profile.selectedCardIds.includes('c04'))
  const hasRainIndoor = state.members.some((m) => m.profile.selectedCardIds.includes('c45'))

  return {
    topValues,
    allStep2Spots,
    hasSlowMorning,
    hasEarlyMorning,
    hasLowWalk,
    hasGourmet,
    hasOnsen,
    hasRainIndoor,
  }
}

/**
 * サーバープロキシ（/api/ai-json）経由で Gemini Structured Outputs (JSON Mode) を呼ぶ。
 * APIキー未設定（503）や失敗時は null を返し、構造化フォールバックを使う。
 */
async function callGeminiJson<T>(prompt: string): Promise<T | null> {
  try {
    const res = await fetch('/api/ai-json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    })
    if (!res.ok) return null
    const data = (await res.json()) as T
    return data
  } catch {
    return null
  }
}

/* =========================================================================
   1. ゼロからの候補地提案（チェックリスト形式・目的地と厳密一致）
   ========================================================================= */

export async function generateZeroSuggestions(
  state: TravelState,
): Promise<{ data: AiZeroSuggestionsResponse; usedLiveAi: boolean }> {
  const dest = state.destination.trim() || '日本国内の人気エリア'
  const ctx = summarizeGroupContext(state)

  const prompt = `あなたは大学生グループ旅行のAIファシリテーターです。
以下のグループ集計結果をもとに、おすすめスポットを8〜10件提案してください。
GoogleマップのURLは直接書かず、google_maps_query（スポット名＋エリア名）を出力してください。

【目的地】${dest}
【参加人数】${state.members.length}人
【よく選ばれた価値観】${ctx.topValues.join(' / ') || '指定なし'}
【すでに話題に出ている場所】${ctx.allStep2Spots.join(' / ') || 'なし'}

必ず以下のJSON形式のみで出力してください:
{
  "group_trend_comment": "グループ傾向への短いコメント",
  "suggestions": [
    {
      "spot_name": "スポット正式名称",
      "area": "都道府県・市区町村",
      "category": "観光 | グルメ | 景色 | 体験",
      "reason": "おすすめ理由",
      "google_maps_query": "Googleマップ検索用文字列"
    }
  ]
}`

  const live = await callGeminiJson<AiZeroSuggestionsResponse>(prompt)
  if (live && Array.isArray(live.suggestions) && live.suggestions.length > 0) {
    return { data: live, usedLiveAi: true }
  }

  // ローカル構造化JSONフォールバック（仕様スキーマと100%同一）
  await new Promise((r) => window.setTimeout(r, 450))

  const matchedCatalog = SPOT_CATALOG.filter(
    (s) =>
      s.area.includes(dest) ||
      dest.includes(s.area) ||
      s.region.includes(dest) ||
      s.tags.some((t) => t.includes(dest) || dest.includes(t)),
  )

  let suggestions: AiZeroSuggestionItem[] = []
  if (matchedCatalog.length > 0) {
    suggestions = matchedCatalog.slice(0, 6).map((s) => ({
      spot_name: s.name,
      area: s.region,
      category: s.tags.includes('グルメ') || s.tags.includes('食べ歩き')
        ? 'グルメ'
        : s.tags.includes('自然') || s.tags.includes('絶景') || s.tags.includes('夜景')
          ? '景色'
          : s.tags.includes('温泉') || s.tags.includes('体験')
            ? '体験'
            : '観光',
      reason: s.summary,
      google_maps_query: `${s.name} ${s.region}`,
    }))
  } else {
    const areaLabel = state.destination.trim() || '旅行先'
    suggestions = [
      { spot_name: `${areaLabel}の定番名所`, area: areaLabel, category: '観光', reason: `${areaLabel}で外せない王道スポット`, google_maps_query: `${areaLabel} 定番 観光` },
      { spot_name: `${areaLabel} 食べ歩き商店街`, area: areaLabel, category: 'グルメ', reason: `${areaLabel}のご当地グルメを満喫`, google_maps_query: `${areaLabel} 食べ歩き グルメ` },
      { spot_name: `${areaLabel} 絶景スポット`, area: areaLabel, category: '景色', reason: `${areaLabel}の景色と記念写真に最適`, google_maps_query: `${areaLabel} 絶景 展望` },
      { spot_name: `${areaLabel} 温泉・リラックス`, area: areaLabel, category: '体験', reason: `${areaLabel}でゆったり疲れを癒やす`, google_maps_query: `${areaLabel} 温泉` },
      { spot_name: `${areaLabel} 屋内ミュージアム`, area: areaLabel, category: '体験', reason: '雨の日でも楽しめる屋内候補', google_maps_query: `${areaLabel} 美術館 博物館` },
    ]
  }

  const trendParts: string[] = []
  if (ctx.hasGourmet) trendParts.push('ご当地グルメ・食べ歩き重視')
  if (ctx.hasOnsen) trendParts.push('温泉でのんびり派あり')
  if (ctx.hasLowWalk) trendParts.push('歩きすぎない配慮が必要')
  if (ctx.hasSlowMorning) trendParts.push('朝はゆっくり出発派あり')
  if (ctx.hasRainIndoor) trendParts.push('雨天時の屋内候補も重要')

  const group_trend_comment =
    trendParts.length > 0
      ? `「${dest}」は ${trendParts.slice(0, 3).join('・')} の傾向です。おすすめの${suggestions.length}件から選んでね！`
      : `「${dest}」の定番・グルメ・景色からバランスよく${suggestions.length}件をピックアップしました。`

  return {
    data: {
      group_trend_comment,
      suggestions,
    },
    usedLiveAi: false,
  }
}

/* =========================================================================
   2. 意見対立時のAI調整・代替案提案（3段構成）
   ========================================================================= */

export async function generateConflictMediation(
  state: TravelState,
  spotA: ConsensusSpot,
  spotB: ConsensusSpot,
): Promise<{ data: AiConflictMediationResponse; usedLiveAi: boolean }> {
  const dest = state.destination.trim() || spotA.areaQuery || '旅行先'
  const ctx = summarizeGroupContext(state)

  const formatRatings = (spot: ConsensusSpot) =>
    state.members
      .map((m) => `${m.name}:${spot.ratings[m.id] ?? '未'}`)
      .join(', ')

  const prompt = `あなたは大学生グループ旅行のAIファシリテーターです。
以下の2つのスポット案で意見が割れています。
1. 双方の案を両方組み込んだ具体的な計画
2. 両立させる場合の難しい点（移動距離・時間・予算など）
3. 課題をふまえた両者の中間となる代替案（2〜3件）
を提案してください。google_maps_query（スポット名＋エリア名）を出力してください。

【旅行先】${dest}
【案A】${spotA.spotName}（エリア: ${spotA.areaQuery} / 評価: ${formatRatings(spotA)}）
【案B】${spotB.spotName}（エリア: ${spotB.areaQuery} / 評価: ${formatRatings(spotB)}）
【グループの価値観傾向】${ctx.topValues.join(' / ') || '指定なし'}

必ず以下のJSON形式のみで出力してください:
{
  "both_plan": {
    "summary": "両方組み込む場合の具体的なルート・時間配分案",
    "challenges": ["課題1", "課題2"]
  },
  "alternatives": [
    {
      "spot_name": "代替スポット正式名称",
      "area": "エリア名",
      "why_it_fits": "双方の希望をどう両立しているか",
      "google_maps_query": "Googleマップ検索用文字列"
    }
  ]
}`

  const live = await callGeminiJson<AiConflictMediationResponse>(prompt)
  if (live && live.both_plan && Array.isArray(live.alternatives)) {
    return { data: live, usedLiveAi: true }
  }

  await new Promise((r) => window.setTimeout(r, 450))

  const areaA = spotA.areaQuery || dest
  const areaB = spotB.areaQuery || dest
  const isSameArea = areaA === areaB

  const challenges = [
    isSameArea
      ? '両方じっくり回ると休憩時間が減りやすい'
      : `${areaA}と${areaB}の移動時間・交通費が増えやすい`,
    ctx.hasLowWalk
      ? '徒歩移動が増えると疲れやすい'
      : 'ピーク帯は混雑や待ち時間が重なりやすい',
  ]

  // 既存カタログやエリアから中間的な代替案を2〜3件提案
  const existingNames = new Set([spotA.spotName, spotB.spotName])
  const catalogAlts = SPOT_CATALOG.filter(
    (s) =>
      !existingNames.has(s.name) &&
      (s.area.includes(dest) || dest.includes(s.area) || s.region.includes(dest)),
  )
    .slice(0, 3)
    .map((s) => ({
      spot_name: s.name,
      area: s.area,
      why_it_fits: `移動しやすく双方の希望を叶えやすい${s.area}の人気スポット`,
      google_maps_query: `${s.name} ${s.region}`,
    }))

  const alternatives =
    catalogAlts.length >= 2
      ? catalogAlts
      : [
          {
            spot_name: `${dest} 中心エリア散策＆食べ歩き`,
            area: dest,
            why_it_fits: '移動が少なく途中で別行動もしやすい',
            google_maps_query: `${dest} 中心 散策 食べ歩き`,
          },
          {
            spot_name: `${dest} 展望カフェ＆景色スポット`,
            area: dest,
            why_it_fits: '観光と休憩を同時に楽しめる中間案',
            google_maps_query: `${dest} 展望 カフェ`,
          },
        ]

  return {
    data: {
      both_plan: {
        summary: `午前に「${spotA.spotName}」、ランチ後に「${spotB.spotName}」を回る前後分割ルートなら両立できます。`,
        challenges,
      },
      alternatives,
    },
    usedLiveAi: false,
  }
}

/* =========================================================================
   3. 計画のたたき台（時系列スケジュール）生成
   ========================================================================= */

export async function generateTravelPlan(
  state: TravelState,
  daysCount: number,
): Promise<{ data: AiTravelPlanResponse; usedLiveAi: boolean }> {
  const dest = state.destination.trim() || 'グループ旅行'
  const ctx = summarizeGroupContext(state)

  // 全員の「絶対行きたい（★）」枠を抽出
  const mustGoRequestsBySpot = new Map<string, string[]>()
  Object.entries(state.mustGoByMember).forEach(([memberId, spotId]) => {
    const member = state.members.find((m) => m.id === memberId)
    if (!member) return
    const list = mustGoRequestsBySpot.get(spotId) ?? []
    list.push(member.name)
    mustGoRequestsBySpot.set(spotId, list)
  })

  const scoredSpots = state.consensusSpots.map((spot) => {
    const values = Object.values(spot.ratings).filter((v) => typeof v === 'number')
    const avg = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0
    const requesters = mustGoRequestsBySpot.get(spot.id) ?? []
    return {
      spot,
      avg,
      isMustGo: requesters.length > 0,
      requestedByText: requesters.length > 0 ? requesters.join('・') : null,
    }
  })

  const prompt = `あなたは大学生グループ旅行のAIプランナーです。
以下の投票結果と価値観傾向から、${daysCount}日間の時系列旅行スケジュールを作成してください。

【絶対厳守ルール】
- is_must_go が true の「絶対行きたい」スポットは、移動に無理があっても必ずすべてスケジュール内に組み込んでください。
- 移動に無理がある場合や予約が必要な場合は、warnings 配列に具体的な注意点を書いてください。
- GoogleマップのURLは直接書かず、google_maps_query（スポット名＋エリア名）のみ出力してください。

【目的地】${dest}
【日数】${daysCount}日間
【価値観傾向】${ctx.topValues.join(' / ') || '指定なし'}
【候補スポットと投票結果】
${scoredSpots
  .map(
    (s) =>
      `- ${s.spot.spotName}（エリア:${s.spot.areaQuery} / 平均:${s.avg.toFixed(1)} / 絶対行きたい:${s.isMustGo ? `はい(${s.requestedByText})` : 'いいえ'}）`,
  )
  .join('\n')}

必ず以下のJSON形式のみで出力してください:
{
  "plan_title": "プランタイトル",
  "overview": "全員の『絶対行きたい』をどう組み込んだかの全体解説",
  "warnings": ["移動や予約に関する注意点（なければ空配列）"],
  "days": [
    {
      "day": 1,
      "theme": "1日目のテーマ",
      "schedule": [
        {
          "time": "10:00",
          "spot_name": "スポット名",
          "is_must_go": true,
          "requested_by": "メンバー名またはnull",
          "activity": "過ごし方や移動の目安",
          "google_maps_query": "Googleマップ検索用文字列"
        }
      ]
    }
  ]
}`

  const live = await callGeminiJson<AiTravelPlanResponse>(prompt)
  if (live && Array.isArray(live.days) && live.days.length > 0) {
    // 念のため、全員の is_must_go が欠落していないかチェックし、欠けていれば末尾に安全補完
    const includedNames = new Set(
      live.days.flatMap((d) => d.schedule.map((item) => item.spot_name)),
    )
    const missingMustGo = scoredSpots.filter(
      (s) => s.isMustGo && !includedNames.has(s.spot.spotName),
    )
    if (missingMustGo.length > 0) {
      const lastDay = live.days[live.days.length - 1]
      missingMustGo.forEach((m) => {
        lastDay.schedule.push({
          time: '16:30',
          spot_name: m.spot.spotName,
          is_must_go: true,
          requested_by: m.requestedByText,
          activity: `${m.requestedByText}さんの絶対行きたい枠！移動時間を確認しながら立ち寄ります。`,
          google_maps_query: `${m.spot.spotName} ${m.spot.areaQuery || dest}`,
        })
      })
      live.warnings = [
        ...(live.warnings ?? []),
        '必須スポットをすべて組み込むため、最終日の行程が少しタイトになっています。移動手段を事前にご確認ください。',
      ]
    }
    return { data: live, usedLiveAi: true }
  }

  // ローカル構造化JSONフォールバック（全員の「絶対行きたい」を100%必須組込）
  await new Promise((r) => window.setTimeout(r, 500))

  const mustGoItems = scoredSpots
    .filter((s) => s.isMustGo)
    .sort((a, b) => b.avg - a.avg)

  const optionalItems = scoredSpots
    .filter((s) => !s.isMustGo)
    .sort((a, b) => b.avg - a.avg)

  // 1日あたりの目安枠：全員のmustGoは必ずすべて入れ、残りを高評価スポットで埋める
  const maxPerDay = Math.max(3, Math.ceil(mustGoItems.length / daysCount))
  const totalSlots = Math.max(mustGoItems.length, daysCount * 3)
  const selectedForPlan = [
    ...mustGoItems,
    ...optionalItems.slice(0, Math.max(0, totalSlots - mustGoItems.length)),
  ]

  const startHour = ctx.hasEarlyMorning && !ctx.hasSlowMorning ? 9 : 10
  const timeSlots =
    startHour === 9
      ? ['09:00', '11:30', '14:00', '16:30', '18:30']
      : ['10:00', '12:30', '14:45', '17:00', '19:00']

  const days: AiScheduleDay[] = []
  for (let d = 0; d < daysCount; d++) {
    days.push({
      day: d + 1,
      theme:
        d === 0
          ? `${dest}のハイライト＆みんなの推しスポット満喫デイ`
          : d === daysCount - 1
            ? `ゆったり散策＆お土産・グルメ締めくくりデイ`
            : `${dest}の自然・体験をマイペースに楽しむデイ`,
      schedule: [],
    })
  }

  // ラウンドロビンで各日にバランスよく配分（全員の is_must_go が必ず入る）
  selectedForPlan.forEach((entry, idx) => {
    const dayIndex = Math.min(daysCount - 1, Math.floor(idx / maxPerDay))
    const dayObj = days[dayIndex]
    const slotIdx = Math.min(timeSlots.length - 1, dayObj.schedule.length)
    const time = timeSlots[slotIdx]

    const item: AiScheduleItem = {
      time,
      spot_name: entry.spot.spotName,
      is_must_go: entry.isMustGo,
      requested_by: entry.requestedByText,
      activity: entry.isMustGo
        ? `${entry.requestedByText}さんの絶対行きたい枠（滞在 約1.5時間）`
        : `人気候補・写真＆散策（滞在 約1時間）`,
      google_maps_query: `${entry.spot.spotName} ${entry.spot.areaQuery || dest}`.trim(),
    }
    dayObj.schedule.push(item)
  })

  // 空の日があれば休憩・自由行動スロットを補完
  days.forEach((dayObj) => {
    if (dayObj.schedule.length === 0) {
      dayObj.schedule.push({
        time: `${String(startHour).padStart(2, '0')}:30`,
        spot_name: `${dest} 周辺カフェ・お土産散策`,
        is_must_go: false,
        requested_by: null,
        activity: 'カフェで休憩しながら、お土産選びや気になったスポットへの寄り道を楽しみます。',
        google_maps_query: `${dest} カフェ お土産`,
      })
    }
  })

  const warnings: string[] = []
  const distinctAreas = new Set(
    selectedForPlan.map((s) => s.spot.areaQuery.trim()).filter(Boolean),
  )
  if (distinctAreas.size >= 3) {
    warnings.push(
      `候補スポットのエリアが複数（${Array.from(distinctAreas).slice(0, 3).join('・')}など）にまたがっています。移動時間に30〜60分の余裕を持たせてください。`,
    )
  }
  if (mustGoItems.length > daysCount * 3) {
    warnings.push(
      `全員の「絶対行きたい」スポット（${mustGoItems.length}件）をすべて組み込んだため、1日あたりの移動がタイトになっています。滞在時間を調整するかタクシー併用をご検討ください。`,
    )
  }
  if (ctx.hasLowWalk) {
    warnings.push(
      '「長い距離はなるべく歩きたくない」メンバーがいるため、駅からのバス・タクシー利用やこまめなカフェ休憩を挟むのがおすすめです。',
    )
  }
  if (ctx.hasSlowMorning && ctx.hasEarlyMorning) {
    warnings.push(
      '「朝早くから動きたい」派と「朝はゆっくり出発したい」派の両方がいるため、折衷案として10:00出発ベースにしています。',
    )
  }

  const mustGoSummary =
    mustGoItems.length > 0
      ? `全員の「絶対行きたい」枠（${mustGoItems
          .map((m) => `${m.requestedByText}さん：${m.spot.spotName}`)
          .join('／')}）をすべて必ず組み込みました。`
      : '投票スコアの高い候補を中心に、無理のない流れで組み込みました。'

  return {
    data: {
      plan_title: `みんなの希望を叶える！${dest} ${daysCount}日間モデルプラン`,
      overview: `${mustGoSummary} グループの価値観（${ctx.topValues.slice(0, 3).join('・') || 'バランス重視'}）に合わせて時間配分しています。`,
      warnings,
      days,
    },
    usedLiveAi: false,
  }
}
