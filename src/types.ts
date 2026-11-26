export type StepId = 1 | 2 | 3 | 4 | 5 | 6

export interface SpotPhoto {
  url: string
  caption: string
  credit: string
}

export interface SpotCatalogItem {
  id: string
  name: string
  area: string
  region: string
  summary: string
  tags: string[]
  photos: SpotPhoto[]
  suggestedActivities: string[]
}

/** メンバーが候補に追加した第1階層の行き先＋第2階層のやりたいこと */
export interface DestinationCandidate {
  id: string
  /** カタログ由来ならそのID、自由追加ならundefined */
  spotId?: string
  name: string
  area: string
  photos: SpotPhoto[]
  /** 第2階層：この場所でやりたいこと（任意・複数選択可） */
  activities: string[]
  /** メンバーが第1階層の行き先に付けた星（★） */
  starred: boolean
}

/** 自由入力カード（各カテゴリー末尾から追加・編集可能） */
export interface CustomValueCard {
  id: string
  categoryId: string
  text: string
}

/** AIが関連カードとして自動生成した希望カード */
export interface AiGeneratedCard {
  id: string
  categoryId: string
  text: string
  sourceCardText: string
}

export interface PersonalProfile {
  /** 選択中の希望カードID（既存・AI関連・自由入力すべて、枚数制限なし） */
  selectedCardIds: string[]
  /** ユーザーが各カテゴリーに追加した自由入力カード */
  customCards: CustomValueCard[]
  /** AIが提案して画面に表示された関連カード */
  aiSuggestedCards: AiGeneratedCard[]
}

export interface Member {
  id: string
  name: string
  /** 丸アイコンに表示する1文字（A, B, C...） */
  badge: string
  /** メンバーの識別カラー */
  color: string
  /** 候補に追加した行き先一覧（表示件数上限なし） */
  destinations: DestinationCandidate[]
  profile: PersonalProfile
}

/** 合意形成フェーズ：共有候補スポット＆4段階評価 */
export interface ConsensusSpot {
  id: string
  spotName: string
  url?: string
  photoUrl?: string
  photoCredit?: string
  /** エリア／Googleマップ検索用クエリ */
  areaQuery: string
  category?: '観光' | 'グルメ' | '景色' | '体験'
  reason?: string
  addedByMemberId?: string
  /** memberId -> 1 | 2 | 3 | 4 */
  ratings: Record<string, number>
}

/* ===== AI Structured Output JSON 型 ===== */

export interface AiZeroSuggestionItem {
  spot_name: string
  area: string
  category: '観光' | 'グルメ' | '景色' | '体験'
  reason: string
  google_maps_query: string
}

export interface AiZeroSuggestionsResponse {
  group_trend_comment: string
  suggestions: AiZeroSuggestionItem[]
}

export interface AiConflictAlternativeItem {
  spot_name: string
  area: string
  why_it_fits: string
  google_maps_query: string
}

export interface AiConflictMediationResponse {
  both_plan: {
    summary: string
    challenges: string[]
  }
  alternatives: AiConflictAlternativeItem[]
}

export interface AiScheduleItem {
  time: string
  spot_name: string
  is_must_go: boolean
  requested_by: string | null
  activity: string
  google_maps_query: string
}

export interface AiScheduleDay {
  day: number
  theme: string
  schedule: AiScheduleItem[]
}

export interface AiTravelPlanResponse {
  plan_title: string
  overview: string
  warnings: string[]
  days: AiScheduleDay[]
}

export interface TravelState {
  destination: string
  members: Member[]
  /** 合意形成：共有候補スポットリスト */
  consensusSpots: ConsensusSpot[]
  /** 合意形成：1人1枠の「絶対行きたい（★）」指定（memberId -> consensusSpotId） */
  mustGoByMember: Record<string, string>
  /** AI生成結果のキャッシュ（リロードしても保持） */
  aiZeroSuggestions: AiZeroSuggestionsResponse | null
  aiConflictResult: AiConflictMediationResponse | null
  aiTravelPlan: AiTravelPlanResponse | null
}
