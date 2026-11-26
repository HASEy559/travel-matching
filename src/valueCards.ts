export const MAX_CARDS_PER_CATEGORY = 15

export interface ValueCard {
  id: string
  categoryId: string
  text: string
  /** しおりカード背景のイラスト種別 */
  motif: string
  /** カード固有のやさしい背景グラデーション */
  bgGradient: string
}

export interface ValueCategory {
  id: string
  number: number
  name: string
  kana: string
  emoji: string
  color: string
  softBg: string
  tapeColor: string
  cards: ValueCard[]
}

export const VALUE_CATEGORIES: ValueCategory[] = [
  {
    id: 'sightseeing',
    number: 1,
    name: '観光・体験',
    kana: 'かんこう・たいけん',
    emoji: '🗺️',
    color: '#1E6F5C',
    softBg: '#E3F3EE',
    tapeColor: 'rgba(116, 184, 158, 0.72)',
    cards: [
      { id: 'c01', categoryId: 'sightseeing', text: '定番の観光スポットに行きたい', motif: 'torii', bgGradient: 'linear-gradient(160deg, #E8F1E7 0%, #F7EFE0 100%)' },
      { id: 'c02', categoryId: 'sightseeing', text: 'ご当地グルメを楽しみたい', motif: 'gourmet', bgGradient: 'linear-gradient(160deg, #FBF0DC 0%, #F6DFC6 100%)' },
      { id: 'c03', categoryId: 'sightseeing', text: '自然の景色を見に行きたい', motif: 'mountain', bgGradient: 'linear-gradient(160deg, #DCEFE3 0%, #F1F4E2 100%)' },
      { id: 'c04', categoryId: 'sightseeing', text: '温泉でのんびりしたい', motif: 'onsen', bgGradient: 'linear-gradient(160deg, #F3EAE2 0%, #E7DDD3 100%)' },
    ],
  },
  {
    id: 'budget',
    number: 2,
    name: '予算',
    kana: 'よさん',
    emoji: '💰',
    color: '#B57B1E',
    softBg: '#FBF1DB',
    tapeColor: 'rgba(222, 178, 94, 0.72)',
    cards: [
      { id: 'c05', categoryId: 'budget', text: '旅費の上限を先に決めたい', motif: 'wallet', bgGradient: 'linear-gradient(160deg, #F5EFE0 0%, #E7EBD8 100%)' },
      { id: 'c06', categoryId: 'budget', text: '宿にお金をかけたい', motif: 'hotel', bgGradient: 'linear-gradient(160deg, #F2E9DE 0%, #E6D8C7 100%)' },
      { id: 'c07', categoryId: 'budget', text: '食事にお金をかけたい', motif: 'gourmet', bgGradient: 'linear-gradient(160deg, #FAECD8 0%, #F2D8BC 100%)' },
      { id: 'c08', categoryId: 'budget', text: '移動費はできるだけ抑えたい', motif: 'ticket', bgGradient: 'linear-gradient(160deg, #E9EFE4 0%, #F6F0DF 100%)' },
    ],
  },
  {
    id: 'pace',
    number: 3,
    name: 'ペース・自由時間',
    kana: 'ぺーす・じゆうじかん',
    emoji: '⏰',
    color: '#C85A32',
    softBg: '#FBEAE2',
    tapeColor: 'rgba(226, 146, 114, 0.72)',
    cards: [
      { id: 'c09', categoryId: 'pace', text: '朝早くから動きたい', motif: 'sunrise', bgGradient: 'linear-gradient(160deg, #FDF1D6 0%, #F7DBC0 100%)' },
      { id: 'c10', categoryId: 'pace', text: '朝はゆっくり出発したい', motif: 'coffee', bgGradient: 'linear-gradient(160deg, #F4ECE1 0%, #E8DAC7 100%)' },
      { id: 'c11', categoryId: 'pace', text: 'せっかくなら、たくさん回りたい', motif: 'compass', bgGradient: 'linear-gradient(160deg, #E4EFE9 0%, #F3EAD7 100%)' },
      { id: 'c12', categoryId: 'pace', text: '行き先を絞って、ゆっくり過ごしたい', motif: 'leaf', bgGradient: 'linear-gradient(160deg, #E7F0E4 0%, #F5EFE1 100%)' },
      { id: 'c13', categoryId: 'pace', text: 'できるだけみんなで行動したい', motif: 'group', bgGradient: 'linear-gradient(160deg, #F7ECD9 0%, #E9EEDB 100%)' },
      { id: 'c14', categoryId: 'pace', text: '旅の途中に一人の時間がほしい', motif: 'book', bgGradient: 'linear-gradient(160deg, #EAE8F0 0%, #F5EEE2 100%)' },
      { id: 'c15', categoryId: 'pace', text: '行きたい場所が違ったら、別行動でもいい', motif: 'route', bgGradient: 'linear-gradient(160deg, #E6EFF0 0%, #F4ECDC 100%)' },
      { id: 'c16', categoryId: 'pace', text: '疲れたら、途中で宿に戻って休みたい', motif: 'moon', bgGradient: 'linear-gradient(160deg, #E9E8F2 0%, #EFE5D8 100%)' },
    ],
  },
  {
    id: 'transport',
    number: 4,
    name: '移動・乗り物',
    kana: 'いどう・のりもの',
    emoji: '🚃',
    color: '#24638C',
    softBg: '#E3EFF7',
    tapeColor: 'rgba(118, 168, 202, 0.72)',
    cards: [
      { id: 'c51', categoryId: 'transport', text: '電車で移動したい', motif: 'train', bgGradient: 'linear-gradient(160deg, #DCEBF3 0%, #EFEAD8 100%)' },
      { id: 'c52', categoryId: 'transport', text: '新幹線に乗りたい', motif: 'shinkansen', bgGradient: 'linear-gradient(160deg, #D9E8F5 0%, #ECEEF2 100%)' },
      { id: 'c53', categoryId: 'transport', text: 'レンタカーで回りたい', motif: 'car', bgGradient: 'linear-gradient(160deg, #E5EFE6 0%, #F4EAD6 100%)' },
      { id: 'c54', categoryId: 'transport', text: '路線バスを使いたい', motif: 'bus', bgGradient: 'linear-gradient(160deg, #E7EEF0 0%, #F5EBD8 100%)' },
      { id: 'c55', categoryId: 'transport', text: '飛行機で行きたい', motif: 'plane', bgGradient: 'linear-gradient(160deg, #DCECF8 0%, #F0F4F8 100%)' },
      { id: 'c56', categoryId: 'transport', text: 'フェリーに乗りたい', motif: 'ferry', bgGradient: 'linear-gradient(160deg, #D7ECEF 0%, #ECF1E5 100%)' },
      { id: 'c17', categoryId: 'transport', text: '移動は電車がいい', motif: 'train', bgGradient: 'linear-gradient(160deg, #E1ECF2 0%, #F2ECDC 100%)' },
      { id: 'c18', categoryId: 'transport', text: '車で自由に回りたい', motif: 'car', bgGradient: 'linear-gradient(160deg, #E4EFE4 0%, #F3E9D8 100%)' },
      { id: 'c19', categoryId: 'transport', text: '長距離はバスで安く移動したい', motif: 'bus', bgGradient: 'linear-gradient(160deg, #EBECE0 0%, #F5ECD9 100%)' },
      { id: 'c20', categoryId: 'transport', text: '運転はできる人で交代したい', motif: 'car', bgGradient: 'linear-gradient(160deg, #E8EEF2 0%, #EFE7D8 100%)' },
      { id: 'c21', categoryId: 'transport', text: '今回は運転を担当しないで参加したい', motif: 'ticket', bgGradient: 'linear-gradient(160deg, #EFEAE2 0%, #E5EBF0 100%)' },
      { id: 'c22', categoryId: 'transport', text: '車代の分け方は先に決めたい', motif: 'wallet', bgGradient: 'linear-gradient(160deg, #F0EDE0 0%, #E2ECE6 100%)' },
    ],
  },
  {
    id: 'stay',
    number: 5,
    name: '宿・部屋',
    kana: 'やど・へや',
    emoji: '🏨',
    color: '#724B8A',
    softBg: '#F1E8F7',
    tapeColor: 'rgba(176, 140, 198, 0.72)',
    cards: [
      { id: 'c23', categoryId: 'stay', text: '宿は立地を優先したい', motif: 'compass', bgGradient: 'linear-gradient(160deg, #EFE8F3 0%, #F5EDE0 100%)' },
      { id: 'c24', categoryId: 'stay', text: '宿は安さを優先したい', motif: 'wallet', bgGradient: 'linear-gradient(160deg, #F2EDE3 0%, #E8E6EE 100%)' },
      { id: 'c25', categoryId: 'stay', text: '設備が充実したホテルに泊まりたい', motif: 'hotel', bgGradient: 'linear-gradient(160deg, #ECE5F2 0%, #F4E9DC 100%)' },
      { id: 'c26', categoryId: 'stay', text: '夜はみんなで同じ部屋で過ごしたい', motif: 'group', bgGradient: 'linear-gradient(160deg, #F5E8E2 0%, #EFE8F2 100%)' },
      { id: 'c27', categoryId: 'stay', text: '寝る部屋は一人ずつがいい', motif: 'moon', bgGradient: 'linear-gradient(160deg, #E8E5F0 0%, #F2EDE4 100%)' },
    ],
  },
  {
    id: 'food',
    number: 6,
    name: '食事・お酒',
    kana: 'しょくじ・おさけ',
    emoji: '🍽️',
    color: '#C44536',
    softBg: '#FCEAE7',
    tapeColor: 'rgba(230, 134, 122, 0.72)',
    cards: [
      { id: 'c28', categoryId: 'food', text: '食事は和食がいい', motif: 'washoku', bgGradient: 'linear-gradient(160deg, #F8EEE0 0%, #EFE2CE 100%)' },
      { id: 'c29', categoryId: 'food', text: '食事は洋食がいい', motif: 'gourmet', bgGradient: 'linear-gradient(160deg, #FAECD9 0%, #F4DAC4 100%)' },
      { id: 'c30', categoryId: 'food', text: '食べ歩きを楽しみたい', motif: 'skewer', bgGradient: 'linear-gradient(160deg, #FBEEDB 0%, #F5DEC8 100%)' },
      { id: 'c31', categoryId: 'food', text: '夜はお酒を飲みに行きたい', motif: 'drink', bgGradient: 'linear-gradient(160deg, #F4E6DF 0%, #EAD6CD 100%)' },
      { id: 'c32', categoryId: 'food', text: 'お酒代は飲む人だけで分けたい', motif: 'wallet', bgGradient: 'linear-gradient(160deg, #F5ECE2 0%, #EAE2D6 100%)' },
      { id: 'c33', categoryId: 'food', text: '苦手な食材やアレルギーを確認してから店を決めたい', motif: 'care', bgGradient: 'linear-gradient(160deg, #EDF3E8 0%, #F7EDE0 100%)' },
    ],
  },
  {
    id: 'health',
    number: 7,
    name: '体力・配慮',
    kana: 'たいりょく・はいりょ',
    emoji: '💚',
    color: '#2A8577',
    softBg: '#E1F5F1',
    tapeColor: 'rgba(116, 194, 180, 0.72)',
    cards: [
      { id: 'c34', categoryId: 'health', text: '長い距離はなるべく歩きたくない', motif: 'care', bgGradient: 'linear-gradient(160deg, #E4F2EE 0%, #F3EFE0 100%)' },
      { id: 'c35', categoryId: 'health', text: 'こまめにトイレ休憩を取りたい', motif: 'coffee', bgGradient: 'linear-gradient(160deg, #E8F2EC 0%, #F5EFE2 100%)' },
      { id: 'c36', categoryId: 'health', text: '乗り物酔いしにくい席を選びたい', motif: 'train', bgGradient: 'linear-gradient(160deg, #E2EFF2 0%, #F2EFE2 100%)' },
    ],
  },
  {
    id: 'photo',
    number: 8,
    name: '写真・SNS',
    kana: 'しゃしん・えすえぬえす',
    emoji: '📸',
    color: '#B84A77',
    softBg: '#FCE8F1',
    tapeColor: 'rgba(222, 138, 174, 0.72)',
    cards: [
      { id: 'c37', categoryId: 'photo', text: 'みんなで記念写真を撮りたい', motif: 'camera', bgGradient: 'linear-gradient(160deg, #F8E8EE 0%, #F5EDE2 100%)' },
      { id: 'c38', categoryId: 'photo', text: '景色を撮る時間をゆっくり取りたい', motif: 'mountain', bgGradient: 'linear-gradient(160deg, #F2E9F0 0%, #E6EFE8 100%)' },
      { id: 'c39', categoryId: 'photo', text: '自分が写った写真は、SNSに載せる前に聞いてほしい', motif: 'care', bgGradient: 'linear-gradient(160deg, #F7EAEB 0%, #F2ECE0 100%)' },
    ],
  },
  {
    id: 'booking',
    number: 9,
    name: '予約・精算',
    kana: 'よやく・せいさん',
    emoji: '📋',
    color: '#465896',
    softBg: '#E7ECFA',
    tapeColor: 'rgba(136, 152, 206, 0.72)',
    cards: [
      { id: 'c40', categoryId: 'booking', text: '予約や店探しは手分けしたい', motif: 'book', bgGradient: 'linear-gradient(160deg, #E8ECF6 0%, #F4EFE4 100%)' },
      { id: 'c41', categoryId: 'booking', text: '宿や交通は、予約前に全員で確認したい', motif: 'group', bgGradient: 'linear-gradient(160deg, #EAEFF5 0%, #EFF1E5 100%)' },
      { id: 'c42', categoryId: 'booking', text: '立て替えてもらった分は旅行中に精算したい', motif: 'wallet', bgGradient: 'linear-gradient(160deg, #ECEFF4 0%, #F5EDE0 100%)' },
      { id: 'c43', categoryId: 'booking', text: 'キャンセル料の分け方は先に決めたい', motif: 'ticket', bgGradient: 'linear-gradient(160deg, #ECECF4 0%, #F2EAE4 100%)' },
    ],
  },
  {
    id: 'rain',
    number: 10,
    name: '雨・予定変更',
    kana: 'あめ・よていへんこう',
    emoji: '☔',
    color: '#2B7A9E',
    softBg: '#E2F3FA',
    tapeColor: 'rgba(122, 186, 212, 0.72)',
    cards: [
      { id: 'c44', categoryId: 'rain', text: '小雨くらいなら外を回りたい', motif: 'rain', bgGradient: 'linear-gradient(160deg, #E2EFF2 0%, #EFF2E6 100%)' },
      { id: 'c45', categoryId: 'rain', text: '雨が降ったら屋内のプランに切り替えたい', motif: 'coffee', bgGradient: 'linear-gradient(160deg, #E5EEF2 0%, #F3ECE0 100%)' },
      { id: 'c46', categoryId: 'rain', text: '一番楽しみな予定が雨で無理なら、延期したい', motif: 'rain', bgGradient: 'linear-gradient(160deg, #E2ECF2 0%, #EFEAE2 100%)' },
      { id: 'c47', categoryId: 'rain', text: '混んでいたら、待たずに次の候補に行きたい', motif: 'route', bgGradient: 'linear-gradient(160deg, #E5F0EE 0%, #F5EEDF 100%)' },
      { id: 'c48', categoryId: 'rain', text: '疲れた人がいたら、予定を減らして休憩したい', motif: 'care', bgGradient: 'linear-gradient(160deg, #E7F2EC 0%, #F5EFE2 100%)' },
      { id: 'c49', categoryId: 'rain', text: '意見が割れたら、多数決で決めたい', motif: 'group', bgGradient: 'linear-gradient(160deg, #E7EEF2 0%, #F2EBDF 100%)' },
      { id: 'c50', categoryId: 'rain', text: '意見が割れたら、一人ずつ順番に希望を通したい', motif: 'compass', bgGradient: 'linear-gradient(160deg, #E8F0ED 0%, #F5ECE0 100%)' },
    ],
  },
]

export const ALL_VALUE_CARDS: ValueCard[] = VALUE_CATEGORIES.flatMap((cat) => cat.cards)

export const VALUE_CARD_MAP: Map<string, { card: ValueCard; category: ValueCategory }> = new Map(
  VALUE_CATEGORIES.flatMap((category) =>
    category.cards.map((card) => [card.id, { card, category }] as const),
  ),
)

export const CATEGORY_MAP: Map<string, ValueCategory> = new Map(
  VALUE_CATEGORIES.map((category) => [category.id, category]),
)

/**
 * カード選択時にAIが自動生成する関連カードの候補マップ
 * 既存カード・表示済み候補と重複しないものを返す
 */
const AI_RELATED_RULES: Record<string, { categoryId: string; text: string }[]> = {
  c51: [
    { categoryId: 'transport', text: '景色のいいローカル線に乗りたい' },
    { categoryId: 'food', text: '駅弁を食べたい' },
    { categoryId: 'sightseeing', text: '駅から歩いて回れる場所がいい' },
  ],
  c17: [
    { categoryId: 'transport', text: '景色のいいローカル線に乗りたい' },
    { categoryId: 'food', text: '駅弁を食べたい' },
    { categoryId: 'sightseeing', text: '駅から歩いて回れる場所がいい' },
  ],
  c52: [
    { categoryId: 'food', text: '新幹線の車内で駅弁やスイーツを食べたい' },
    { categoryId: 'transport', text: '指定席を並びで予約したい' },
    { categoryId: 'stay', text: '新幹線駅の近くに荷物を預けたい' },
  ],
  c53: [
    { categoryId: 'transport', text: '道の駅やサービスエリアに寄り道したい' },
    { categoryId: 'sightseeing', text: '海沿いや山の絶景ドライブをしたい' },
    { categoryId: 'stay', text: '駐車場付きの宿を選びたい' },
  ],
  c18: [
    { categoryId: 'transport', text: '道の駅やサービスエリアに寄り道したい' },
    { categoryId: 'sightseeing', text: '海沿いや山の絶景ドライブをしたい' },
  ],
  c54: [
    { categoryId: 'budget', text: '乗り放題フリーパスを活用したい' },
    { categoryId: 'pace', text: 'バスの時刻に合わせて余裕を持って動きたい' },
  ],
  c55: [
    { categoryId: 'sightseeing', text: '空港のご当地グルメやお土産も見たい' },
    { categoryId: 'pace', text: '空港には出発の1時間半前に着いておきたい' },
  ],
  c56: [
    { categoryId: 'photo', text: 'フェリーのデッキから海の写真を撮りたい' },
    { categoryId: 'sightseeing', text: '離島や港町をのんびり散策したい' },
  ],
  c01: [
    { categoryId: 'photo', text: '名所の定番フォトスポットで集合写真を撮りたい' },
    { categoryId: 'pace', text: '混雑を避けて朝イチで人気スポットに行きたい' },
  ],
  c02: [
    { categoryId: 'booking', text: '人気のご当地店は事前に予約しておきたい' },
    { categoryId: 'food', text: '地元ならではのスイーツやカフェも巡りたい' },
  ],
  c03: [
    { categoryId: 'sightseeing', text: '展望台やロープウェイから絶景を見たい' },
    { categoryId: 'pace', text: '夕暮れの海や山をゆっくり眺める時間を作りたい' },
  ],
  c04: [
    { categoryId: 'stay', text: '露天風呂や貸切風呂がある宿にしたい' },
    { categoryId: 'sightseeing', text: '温泉街を浴衣で散策したい' },
  ],
  c05: [
    { categoryId: 'booking', text: '共通のお財布や精算アプリで割り勘を管理したい' },
    { categoryId: 'budget', text: 'お土産代は別枠で自由に決めたい' },
  ],
  c09: [
    { categoryId: 'food', text: '朝市やモーニングから1日を始めたい' },
    { categoryId: 'pace', text: '前日の夜は早めに寝て体力をつけたい' },
  ],
  c10: [
    { categoryId: 'stay', text: 'レイトチェックアウトや朝食ゆっくりめの宿がいい' },
    { categoryId: 'food', text: 'ブランチでおしゃれなカフェに行きたい' },
  ],
  c14: [
    { categoryId: 'pace', text: '夕方1〜2時間だけ自由行動タイムを入れたい' },
    { categoryId: 'stay', text: '宿のラウンジやカフェで気ままに過ごす時間がほしい' },
  ],
  c30: [
    { categoryId: 'food', text: '少しずつシェアして色々な種類を味わいたい' },
    { categoryId: 'sightseeing', text: '商店街や市場をぶらぶら歩きたい' },
  ],
  c31: [
    { categoryId: 'food', text: '地元の居酒屋やクラフトビールを楽しみたい' },
    { categoryId: 'stay', text: '飲み屋街から歩いて帰れる宿がいい' },
  ],
  c34: [
    { categoryId: 'transport', text: '坂道や遠距離はタクシーを割り勘で使いたい' },
    { categoryId: 'pace', text: '2時間に1回はカフェで座って休みたい' },
  ],
  c37: [
    { categoryId: 'photo', text: '旅行後に共有アルバムで写真をまとめて交換したい' },
    { categoryId: 'photo', text: 'チェキや写ルンですを持っていきたい' },
  ],
  c45: [
    { categoryId: 'sightseeing', text: '美術館や水族館など屋内スポットを予備候補に入れたい' },
    { categoryId: 'food', text: '雨の日はおしゃれなカフェでゆっくり語りたい' },
  ],
}

const CATEGORY_FALLBACK_RELATED: Record<string, { categoryId: string; text: string }[]> = {
  sightseeing: [
    { categoryId: 'sightseeing', text: 'その土地ならではの体験ワークショップに参加したい' },
    { categoryId: 'photo', text: '思い出に残るお土産をゆっくり選びたい' },
  ],
  budget: [
    { categoryId: 'budget', text: '学割や早割プランを積極的に使いたい' },
    { categoryId: 'booking', text: '大きな出費の前に一度チャットで確認したい' },
  ],
  pace: [
    { categoryId: 'pace', text: '予定を詰め込みすぎず余白の時間を残したい' },
    { categoryId: 'pace', text: '夜の過ごし方はその日の体力で柔軟に決めたい' },
  ],
  transport: [
    { categoryId: 'transport', text: '大きい荷物はコインロッカーに預けて身軽に動きたい' },
    { categoryId: 'pace', text: '乗り換え時間は余裕を持って組みたい' },
  ],
  stay: [
    { categoryId: 'stay', text: '大浴場やサウナ付きの宿だとうれしい' },
    { categoryId: 'stay', text: '朝食がおいしい宿を選びたい' },
  ],
  food: [
    { categoryId: 'food', text: '行列店はピーク時間をずらして入りたい' },
    { categoryId: 'food', text: '昼は軽めにして夜ごはんを豪華にしたい' },
  ],
  health: [
    { categoryId: 'pace', text: '歩きやすい靴で行けるルートを基本にしたい' },
    { categoryId: 'health', text: '無理せず体調優先で予定を調整し合いたい' },
  ],
  photo: [
    { categoryId: 'photo', text: '撮った写真は旅行後にみんなで共有したい' },
    { categoryId: 'photo', text: '景色のいいカフェで写真を撮りたい' },
  ],
  booking: [
    { categoryId: 'booking', text: '予約完了のスクショをグループに共有しておきたい' },
    { categoryId: 'booking', text: '集合時間と持ち物リストを前日に確認したい' },
  ],
  rain: [
    { categoryId: 'rain', text: '雨天用のサブプランを1〜2個だけ決めておきたい' },
    { categoryId: 'rain', text: '天気予報を見て前日に予定の順番を入れ替えたい' },
  ],
}

function normalizeForDedup(text: string): string {
  return text.replace(/[\s、。・！!？?「」]/g, '').toLowerCase()
}

export function generateRelatedSuggestions(
  sourceCardId: string,
  sourceCategoryId: string,
  existingTexts: string[],
): { categoryId: string; text: string }[] {
  const existingNormalized = new Set(existingTexts.map(normalizeForDedup))
  const pool = [
    ...(AI_RELATED_RULES[sourceCardId] ?? []),
    ...(CATEGORY_FALLBACK_RELATED[sourceCategoryId] ?? []),
  ]

  const picked: { categoryId: string; text: string }[] = []
  for (const candidate of pool) {
    const norm = normalizeForDedup(candidate.text)
    if (existingNormalized.has(norm)) continue
    existingNormalized.add(norm)
    picked.push(candidate)
    if (picked.length >= 3) break
  }
  return picked
}

/** 事前にすり合わせておくとトラブルを防げる対立ペア */
export const CONFLICT_PAIRS: { a: string; b: string; topic: string }[] = [
  { a: 'c09', b: 'c10', topic: '朝の出発時間' },
  { a: 'c11', b: 'c12', topic: '観光のペース' },
  { a: 'c13', b: 'c15', topic: '別行動のルール' },
  { a: 'c26', b: 'c27', topic: '夜の部屋割り' },
  { a: 'c24', b: 'c06', topic: '宿の予算バランス' },
  { a: 'c44', b: 'c45', topic: '雨の日の過ごし方' },
]

/** 誰か1人でも選んでいたら全員で必ず共有したい配慮カード */
export const CARE_CARD_IDS: string[] = [
  'c14',
  'c21',
  'c32',
  'c33',
  'c34',
  'c35',
  'c36',
  'c39',
  'c43',
]
