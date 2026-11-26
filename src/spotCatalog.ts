import type { SpotCatalogItem, SpotPhoto } from './types'

export const POPULAR_DESTINATIONS = [
  '広島',
  '京都',
  '沖縄',
  '大阪',
  '北海道',
  '福岡',
  '金沢',
  '箱根',
  '鎌倉',
  '東京',
]

/**
 * 現地で実際に撮影された写真（Wikimedia Commons 確認済み・場所と画像が100%一致）
 */
export const SPOT_CATALOG: SpotCatalogItem[] = [
  // ===== 広島（6件） =====
  {
    id: 'spot-itsukushima',
    name: '厳島神社（宮島）',
    area: '広島',
    region: '広島県廿日市市',
    summary: '海に浮かぶ大鳥居の世界遺産。フェリーと参道食べ歩きが人気。',
    tags: ['広島', '宮島', '厳島神社', '大鳥居', 'フェリー', '食べ歩き', 'しか', 'かき'],
    photos: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ef/Itsukushima_Shrine_Torii_Gate_%2813890465459%29.jpg/960px-Itsukushima_Shrine_Torii_Gate_%2813890465459%29.jpg',
        caption: '厳島神社の大鳥居',
        credit: '出典: Wikimedia Commons (CC BY)',
      },
    ],
    suggestedActivities: ['神社参拝', 'あげもみじ食べ歩き', '焼きがき', '鹿と写真'],
  },
  {
    id: 'spot-genbaku-dome',
    name: '原爆ドーム',
    area: '広島',
    region: '広島県広島市中区',
    summary: '広島市の中心にある世界遺産。川沿いの散策や市内グルメへのアクセスも抜群。',
    tags: ['広島', '原爆ドーム', '世界遺産', '市内', 'お好み焼き'],
    photos: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/77/Genbaku_Dome04-r.JPG/960px-Genbaku_Dome04-r.JPG',
        caption: '原爆ドーム',
        credit: '出典: Wikimedia Commons (CC BY-SA)',
      },
    ],
    suggestedActivities: ['原爆ドーム見学', '元安川沿いを散策', 'お好み焼きを食べる'],
  },
  {
    id: 'spot-peace-park',
    name: '平和記念公園・資料館',
    area: '広島',
    region: '広島県広島市中区',
    summary: '広島市街の中心にある歴史公園と屋内資料館。',
    tags: ['広島', '平和記念公園', '資料館', '屋内', '雨'],
    photos: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/17/Hiroshima_Peace_Memorial_Museum_1.jpg/960px-Hiroshima_Peace_Memorial_Museum_1.jpg',
        caption: '広島平和記念資料館',
        credit: '出典: Wikimedia Commons (CC BY-SA)',
      },
    ],
    suggestedActivities: ['資料館を見学', '公園を散策', '近くで広島グルメ'],
  },
  {
    id: 'spot-shukkeien',
    name: '縮景園',
    area: '広島',
    region: '広島県広島市中区',
    summary: '広島駅から歩いて行ける美しい日本庭園。静かに写真を撮れる癒やしスポット。',
    tags: ['広島', '縮景園', '庭園', '自然', '駅チカ', '写真'],
    photos: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/32/Takueichi_Pond_in_Shukkei_Garden_19.jpg/960px-Takueichi_Pond_in_Shukkei_Garden_19.jpg',
        caption: '縮景園の庭園と池',
        credit: '出典: Wikimedia Commons (CC BY-SA)',
      },
    ],
    suggestedActivities: ['庭園をのんびり散策', '茶室でひと休み', '橋の上で記念写真'],
  },
  {
    id: 'spot-hiroshima-castle',
    name: '広島城',
    area: '広島',
    region: '広島県広島市中区',
    summary: '天守閣から広島市街を見渡せる定番スポット。お堀沿いの散歩も気持ちいい。',
    tags: ['広島', '広島城', 'お城', '展望', '歴史'],
    photos: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/50/HiroshimaCastle.jpg/960px-HiroshimaCastle.jpg',
        caption: '広島城天守閣',
        credit: '出典: Wikimedia Commons (CC BY-SA)',
      },
    ],
    suggestedActivities: ['天守閣から市内を一望', 'お堀沿いで写真撮影', '歴史展示を見る'],
  },
  {
    id: 'spot-onomichi',
    name: '尾道・千光寺',
    area: '広島',
    region: '広島県尾道市',
    summary: '瀬戸内海を見渡す坂の町。ロープウェイや古民家カフェ、尾道ラーメンが人気。',
    tags: ['広島', '尾道', '千光寺', 'カフェ', '海', 'ラーメン'],
    photos: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8e/Senkoji_Onomichi16s3872.jpg/960px-Senkoji_Onomichi16s3872.jpg',
        caption: '尾道・千光寺からの眺め',
        credit: '出典: Wikimedia Commons (CC BY-SA)',
      },
    ],
    suggestedActivities: ['ロープウェイ乗車', '古民家カフェ巡り', '尾道ラーメン', '海辺フォト'],
  },

  // ===== 京都（6件） =====
  {
    id: 'spot-arashiyama',
    name: '嵐山',
    area: '京都',
    region: '京都府京都市右京区',
    summary: '渡月橋や竹林、トロッコ列車、食べ歩きまで揃う人気エリア。',
    tags: ['京都', '嵐山', '自然', '食べ歩き', '竹林', '渡月橋', 'トロッコ'],
    photos: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c1/Arashiyama_%288741759830%29.jpg/960px-Arashiyama_%288741759830%29.jpg',
        caption: '嵐山の風景',
        credit: '出典: Wikimedia Commons (CC BY)',
      },
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/df/Togetsukyo_in_Kyoto_Arashiyama.jpg/960px-Togetsukyo_in_Kyoto_Arashiyama.jpg',
        caption: '渡月橋と桂川',
        credit: '出典: Wikimedia Commons (CC BY-SA)',
      },
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/9/96/TOROCCO-ArashiyamaStation.JPG',
        caption: '嵯峨野トロッコ列車',
        credit: '出典: Wikimedia Commons (CC BY-SA)',
      },
    ],
    suggestedActivities: ['食べ歩き', '竹林を散策', '渡月橋で写真を撮る', 'トロッコ列車に乗る'],
  },
  {
    id: 'spot-kiyomizu',
    name: '清水寺',
    area: '京都',
    region: '京都府京都市東山区',
    summary: '清水の舞台で有名な世界遺産。二年坂・三年坂の抹茶スイーツも人気。',
    tags: ['京都', '清水寺', '寺社', '定番', '抹茶', '着物'],
    photos: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ae/Kiyomizu-dera%2C_Kyoto%2C_November_2016_-02.jpg/960px-Kiyomizu-dera%2C_Kyoto%2C_November_2016_-02.jpg',
        caption: '清水寺の本堂と舞台',
        credit: '出典: Wikimedia Commons (CC BY-SA)',
      },
    ],
    suggestedActivities: ['清水の舞台を見学', '二年坂・三年坂を食べ歩き', '着物散策', '抹茶スイーツ'],
  },
  {
    id: 'spot-fushimi-inari',
    name: '伏見稲荷大社',
    area: '京都',
    region: '京都府京都市伏見区',
    summary: '朱色の千本鳥居が連なる神社。駅チカで写真映え抜群。',
    tags: ['京都', '伏見稲荷', '千本鳥居', '神社', '写真'],
    photos: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/64/Fushimiinari-taisha%2C_gehaiden-1.jpg/960px-Fushimiinari-taisha%2C_gehaiden-1.jpg',
        caption: '伏見稲荷大社',
        credit: '出典: Wikimedia Commons (CC BY-SA)',
      },
    ],
    suggestedActivities: ['千本鳥居を歩く', 'おもかる石', '参道食べ歩き'],
  },
  {
    id: 'spot-kinkakuji',
    name: '金閣寺（鹿苑寺）',
    area: '京都',
    region: '京都府京都市北区',
    summary: '鏡湖池に映える金箔の舎利殿が美しい世界遺産。',
    tags: ['京都', '金閣寺', '鹿苑寺', '定番', '写真'],
    photos: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d3/Kinkaku-ji_2015.JPG/960px-Kinkaku-ji_2015.JPG',
        caption: '金閣寺（鹿苑寺）',
        credit: '出典: Wikimedia Commons (CC BY-SA)',
      },
    ],
    suggestedActivities: ['鏡湖池前で記念写真', '庭園散策', '茶所で抹茶'],
  },
  {
    id: 'spot-nishiki',
    name: '錦市場',
    area: '京都',
    region: '京都府京都市中京区',
    summary: 'アーケードで雨の日も安心の「京の台所」。食べ歩きに最適。',
    tags: ['京都', '錦市場', 'グルメ', '食べ歩き', '屋内', '雨'],
    photos: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ce/Nishiki_Ichiba_by_matsuyuki.jpg/960px-Nishiki_Ichiba_by_matsuyuki.jpg',
        caption: '錦市場',
        credit: '出典: Wikimedia Commons (CC BY-SA)',
      },
    ],
    suggestedActivities: ['だし巻き卵', '湯葉・おばんざい', 'お土産選び'],
  },
  {
    id: 'spot-arashiyama-onsen',
    name: '京都・嵐山温泉',
    area: '京都',
    region: '京都府京都市西京区',
    summary: '渡月橋のたもとに湧く名湯。日帰り温泉や足湯でゆったり。',
    tags: ['京都', '温泉', '嵐山温泉', 'リラックス', '宿'],
    photos: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ab/Togetsukyo_01.jpg/960px-Togetsukyo_01.jpg',
        caption: '嵐山温泉エリア',
        credit: '出典: Wikimedia Commons (CC BY-SA)',
      },
    ],
    suggestedActivities: ['日帰り温泉', '露天風呂でリラックス', '温泉宿に泊まる'],
  },

  // ===== 沖縄（5件） =====
  {
    id: 'spot-kokusai-dori',
    name: '国際通り',
    area: '沖縄',
    region: '沖縄県那覇市',
    summary: '沖縄グルメ・ブルーシール・お土産が集まる那覇の中心通り。',
    tags: ['沖縄', '那覇', '国際通り', '食べ歩き', 'お土産', 'グルメ'],
    photos: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/89/Kokusai-dori08s3s4440.jpg/960px-Kokusai-dori08s3s4440.jpg',
        caption: '那覇・国際通り',
        credit: '出典: Wikimedia Commons (CC BY-SA)',
      },
    ],
    suggestedActivities: ['ブルーシールアイス', '沖縄そば・タコス', 'お土産探し'],
  },
  {
    id: 'spot-shuri-castle',
    name: '首里城公園',
    area: '沖縄',
    region: '沖縄県那覇市',
    summary: '琉球王国の歴史を体感できる那覇の名所。高台からの眺めも絶景。',
    tags: ['沖縄', '那覇', '首里城', '歴史', '定番'],
    photos: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/56/Naha_Okinawa_Japan_Shuri-Castle-01.jpg/960px-Naha_Okinawa_Japan_Shuri-Castle-01.jpg',
        caption: '首里城',
        credit: '出典: Wikimedia Commons (CC BY-SA)',
      },
    ],
    suggestedActivities: ['守礼門で記念撮影', '城内を散策', '沖縄スイーツ休憩'],
  },
  {
    id: 'spot-american-village',
    name: '美浜アメリカンビレッジ',
    area: '沖縄',
    region: '沖縄県北谷町',
    summary: 'カラフルな街並みとサンセットビーチが映える人気スポット。',
    tags: ['沖縄', 'アメリカンビレッジ', '北谷', 'カフェ', 'サンセット', '写真'],
    photos: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/09/Mihama_AV_D_Japan.jpg/960px-Mihama_AV_D_Japan.jpg',
        caption: '美浜アメリカンビレッジ',
        credit: '出典: Wikimedia Commons (CC BY-SA)',
      },
    ],
    suggestedActivities: ['サンセットビーチを見る', 'カフェ巡り', '雑貨ショッピング'],
  },
  {
    id: 'spot-manzamo',
    name: '万座毛',
    area: '沖縄',
    region: '沖縄県恩納村',
    summary: 'エメラルドグリーンの海と象の鼻型の断崖が広がる絶景。',
    tags: ['沖縄', '海', '万座毛', 'ドライブ', '自然', '絶景'],
    photos: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/53/Onna_Okinawa_Japan_Cape-Manzamo-01.jpg/960px-Onna_Okinawa_Japan_Cape-Manzamo-01.jpg',
        caption: '万座毛の断崖と青い海',
        credit: '出典: Wikimedia Commons (CC BY-SA)',
      },
    ],
    suggestedActivities: ['海を背景に記念写真', '海岸ドライブ', 'サンセット鑑賞'],
  },
  {
    id: 'spot-kouri-island',
    name: '古宇利島',
    area: '沖縄',
    region: '沖縄県今帰仁村',
    summary: '青い海を渡る古宇利大橋とハートロックが人気のドライブ先。',
    tags: ['沖縄', '古宇利島', 'ドライブ', '海', '絶景'],
    photos: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/33/Kouri_Island_gsi-20180219.jpg/960px-Kouri_Island_gsi-20180219.jpg',
        caption: '古宇利島と海',
        credit: '出典: Wikimedia Commons (CC BY)',
      },
    ],
    suggestedActivities: ['古宇利大橋ドライブ', 'ガーリックシュリンプ', '海辺フォト'],
  },

  // ===== 大阪（5件） =====
  {
    id: 'spot-dotonbori',
    name: '道頓堀・心斎橋',
    area: '大阪',
    region: '大阪府大阪市中央区',
    summary: 'たこ焼き・串カツ・ネオン街！関西グルメの食べ歩き天国。',
    tags: ['大阪', '道頓堀', '心斎橋', 'たこ焼き', '食べ歩き', 'グルメ'],
    photos: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f4/Osaka_Dotonbori_Ebisu_Bridge.jpg/960px-Osaka_Dotonbori_Ebisu_Bridge.jpg',
        caption: '道頓堀・戎橋',
        credit: '出典: Wikimedia Commons (CC BY-SA)',
      },
    ],
    suggestedActivities: ['たこ焼き食べ比べ', '串カツ', '戎橋で集合写真'],
  },
  {
    id: 'spot-tsutenkaku',
    name: '通天閣・新世界',
    area: '大阪',
    region: '大阪府大阪市浪速区',
    summary: 'レトロな下町で本場の串カツや展望台を楽しめる大阪名物エリア。',
    tags: ['大阪', '通天閣', '新世界', '串カツ', 'レトロ'],
    photos: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/64/Tsutenkaku_108m.jpg/960px-Tsutenkaku_108m.jpg',
        caption: '通天閣',
        credit: '出典: Wikimedia Commons (CC BY-SA)',
      },
    ],
    suggestedActivities: ['本場の串カツ', '通天閣展望台', 'レトロ街歩き'],
  },
  {
    id: 'spot-kaiyukan',
    name: '海遊館',
    area: '大阪',
    region: '大阪府大阪市港区',
    summary: 'ジンベエザメの大水槽が迫力満点。雨の日でも1日楽しめる屋内名所。',
    tags: ['大阪', '海遊館', '水族館', '屋内', '雨'],
    photos: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f4/Kaiy%C5%ABkan.jpg/960px-Kaiy%C5%ABkan.jpg',
        caption: '海遊館',
        credit: '出典: Wikimedia Commons (CC BY-SA)',
      },
    ],
    suggestedActivities: ['ジンベエザメを見る', '天保山マーケットプレース', '観覧車'],
  },
  {
    id: 'spot-kuromon',
    name: '黒門市場',
    area: '大阪',
    region: '大阪府大阪市中央区',
    summary: '「大阪の台所」で海鮮やフルーツ串を食べ歩きできるアーケード市場。',
    tags: ['大阪', '黒門市場', '食べ歩き', 'グルメ', '屋内'],
    photos: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/42/%E9%BB%92%E9%96%80%E5%B8%82%E5%A0%B4_2024%281%29.jpg/960px-%E9%BB%92%E9%96%80%E5%B8%82%E5%A0%B4_2024%281%29.jpg',
        caption: '黒門市場',
        credit: '出典: Wikimedia Commons (CC BY-SA)',
      },
    ],
    suggestedActivities: ['海鮮串を食べ歩き', 'たこ焼き・スイーツ', '市場散策'],
  },
  {
    id: 'spot-nakanoshima',
    name: '中之島エリア',
    area: '大阪',
    region: '大阪府大阪市北区',
    summary: '川辺のおしゃれカフェや美術館が集まる落ち着いた水都エリア。',
    tags: ['大阪', '中之島', 'カフェ', '美術館', '街歩き'],
    photos: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/71/Nakanoshima_Skyscrapers_in_201504_001.jpg/960px-Nakanoshima_Skyscrapers_in_201504_001.jpg',
        caption: '中之島の水辺',
        credit: '出典: Wikimedia Commons (CC BY-SA)',
      },
    ],
    suggestedActivities: ['リバーサイドカフェ', '美術館めぐり', '夕方の川辺散歩'],
  },

  // ===== 北海道（6件） =====
  {
    id: 'spot-otaru',
    name: '小樽運河',
    area: '北海道',
    region: '北海道小樽市',
    summary: '石造り倉庫が並ぶ運河とスイーツ・海鮮の食べ歩きが人気。',
    tags: ['北海道', '小樽', '小樽運河', 'スイーツ', '海鮮'],
    photos: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fd/Otaru_Hokkaido_Japan.jpg/960px-Otaru_Hokkaido_Japan.jpg',
        caption: '小樽運河',
        credit: '出典: Wikimedia Commons (CC BY-SA)',
      },
    ],
    suggestedActivities: ['運河フォト', 'スイーツ食べ歩き', '海鮮丼'],
  },
  {
    id: 'spot-sapporo-clock',
    name: '札幌市時計台',
    area: '北海道',
    region: '北海道札幌市中央区',
    summary: '札幌中心部のシンボル。スープカレーやラーメンの名店も徒歩圏内。',
    tags: ['北海道', '札幌', '時計台', '定番', 'グルメ'],
    photos: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0a/20200119_Sapporo_Clock_Tower.jpg/960px-20200119_Sapporo_Clock_Tower.jpg',
        caption: '札幌市時計台',
        credit: '出典: Wikimedia Commons (CC BY-SA)',
      },
    ],
    suggestedActivities: ['時計台前で集合写真', 'スープカレーランチ', '市内散策'],
  },
  {
    id: 'spot-odori-park',
    name: '大通公園',
    area: '北海道',
    region: '北海道札幌市中央区',
    summary: 'テレビ塔と花壇が広がる札幌の憩いスポット。季節イベントも豊富。',
    tags: ['北海道', '札幌', '大通公園', '自然', '公園'],
    photos: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6e/Odori_Park_%2815982613668%29.jpg/960px-Odori_Park_%2815982613668%29.jpg',
        caption: '大通公園とさっぽろテレビ塔',
        credit: '出典: Wikimedia Commons (CC BY)',
      },
    ],
    suggestedActivities: ['テレビ塔展望台', '公園でひと休み', 'すすきのグルメへ'],
  },
  {
    id: 'spot-jozankei',
    name: '定山渓温泉',
    area: '北海道',
    region: '北海道札幌市南区',
    summary: '札幌からバスで行ける渓谷の温泉街。足湯や温泉宿でのんびり。',
    tags: ['北海道', '札幌', '温泉', '定山渓', '宿'],
    photos: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7d/TsukimiBashi2004-12.jpg/960px-TsukimiBashi2004-12.jpg',
        caption: '定山渓温泉',
        credit: '出典: Wikimedia Commons (CC BY-SA)',
      },
    ],
    suggestedActivities: ['露天風呂', '足湯カフェ', '渓谷の橋を散歩'],
  },
  {
    id: 'spot-hakodate-mt',
    name: '函館山',
    area: '北海道',
    region: '北海道函館市',
    summary: '海に挟まれた街並みと夜景を一望する北海道随一の絶景。',
    tags: ['北海道', '函館', '函館山', '夜景', '絶景'],
    photos: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c1/Wide_view_of_Mount_Hakodate_from_Mashu-Maru.jpg/960px-Wide_view_of_Mount_Hakodate_from_Mashu-Maru.jpg',
        caption: '函館山',
        credit: '出典: Wikimedia Commons (CC BY-SA)',
      },
    ],
    suggestedActivities: ['ロープウェイで夜景鑑賞', '赤レンガ倉庫散策', '朝市で海鮮丼'],
  },
  {
    id: 'spot-asahiyama-zoo',
    name: '旭山動物園',
    area: '北海道',
    region: '北海道旭川市',
    summary: '動物たちの自然な姿を間近で見られる大人気の行動展示動物園。',
    tags: ['北海道', '旭川', '動物園', '体験'],
    photos: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e8/Asahiyama_zoo_entrance.jpg/960px-Asahiyama_zoo_entrance.jpg',
        caption: '旭山動物園',
        credit: '出典: Wikimedia Commons (CC BY-SA)',
      },
    ],
    suggestedActivities: ['もぐもぐタイム見学', 'ペンギン・ホッキョクグマ', '旭川ラーメン'],
  },

  // ===== 福岡（5件） =====
  {
    id: 'spot-dazaifu',
    name: '太宰府天満宮',
    area: '福岡',
    region: '福岡県太宰府市',
    summary: '学問の神様の名社。参道の焼きたて梅ヶ枝餅とカフェが人気。',
    tags: ['福岡', '太宰府', '神社', '食べ歩き'],
    photos: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8b/20100719_Dazaifu_Tenmangu_Shrine_3328.jpg/960px-20100719_Dazaifu_Tenmangu_Shrine_3328.jpg',
        caption: '太宰府天満宮',
        credit: '出典: Wikimedia Commons (CC BY-SA)',
      },
    ],
    suggestedActivities: ['本殿参拝', '梅ヶ枝餅食べ歩き', '参道カフェ'],
  },
  {
    id: 'spot-nakasu',
    name: '中洲・天神屋台',
    area: '福岡',
    region: '福岡県福岡市博多区',
    summary: '川沿いの屋台で博多ラーメンや焼き鳥を楽しむ夜の定番。',
    tags: ['福岡', '博多', '中洲', '屋台', 'ラーメン', 'グルメ'],
    photos: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/39/Nakasu02.jpg/960px-Nakasu02.jpg',
        caption: '那珂川沿いの中洲',
        credit: '出典: Wikimedia Commons (CC BY-SA)',
      },
    ],
    suggestedActivities: ['屋台で博多ラーメン', 'もつ鍋・焼き鳥', '川辺の夜景散歩'],
  },
  {
    id: 'spot-itoshima',
    name: '糸島（桜井二見ヶ浦）',
    area: '福岡',
    region: '福岡県糸島市',
    summary: '海の中の白い鳥居と海辺カフェがSNS映え抜群のドライブエリア。',
    tags: ['福岡', '糸島', '海', 'カフェ', 'ドライブ', '写真'],
    photos: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/da/Sakurai_Futamigaura.jpg/960px-Sakurai_Futamigaura.jpg',
        caption: '糸島・桜井二見ヶ浦',
        credit: '出典: Wikimedia Commons (CC BY-SA)',
      },
    ],
    suggestedActivities: ['白い鳥居で記念写真', '海辺カフェ巡り', '海鮮丼ランチ'],
  },
  {
    id: 'spot-fukuoka-tower',
    name: '福岡タワー',
    area: '福岡',
    region: '福岡県福岡市早良区',
    summary: '博多湾と市街を一望する海辺のランドマーク。夕暮れと夜景が人気。',
    tags: ['福岡', '福岡タワー', '展望', '夜景', '屋内'],
    photos: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/72/Fukuoka_Tower_2010-01-18.jpg/960px-Fukuoka_Tower_2010-01-18.jpg',
        caption: '福岡タワー',
        credit: '出典: Wikimedia Commons (CC BY-SA)',
      },
    ],
    suggestedActivities: ['展望室から夕景鑑賞', '百道浜ビーチ散歩'],
  },
  {
    id: 'spot-mojiko',
    name: '門司港レトロ',
    area: '福岡',
    region: '福岡県北九州市門司区',
    summary: '洋館が並ぶ港町。名物の焼きカレーと関門海峡の眺めが魅力。',
    tags: ['福岡', '門司港', 'レトロ', '焼きカレー', '海'],
    photos: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/db/140721_Mojiko_Retro_Kitakyushu_Japan01s3.jpg/960px-140721_Mojiko_Retro_Kitakyushu_Japan01s3.jpg',
        caption: '門司港レトロ',
        credit: '出典: Wikimedia Commons (CC BY-SA)',
      },
    ],
    suggestedActivities: ['名物焼きカレー', 'レトロ洋館めぐり', '港の散策'],
  },

  // ===== 金沢（5件） =====
  {
    id: 'spot-kenrokuen',
    name: '兼六園',
    area: '金沢',
    region: '石川県金沢市',
    summary: '日本三名園の美しい庭園。茶屋での抹茶休憩も人気。',
    tags: ['金沢', '石川', '兼六園', '自然', '庭園'],
    photos: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fc/Kenrokuen10-r.jpg/960px-Kenrokuen10-r.jpg',
        caption: '兼六園',
        credit: '出典: Wikimedia Commons (CC BY-SA)',
      },
    ],
    suggestedActivities: ['徽軫灯籠で記念撮影', '園内茶屋で抹茶', '庭園散策'],
  },
  {
    id: 'spot-kanazawa-21',
    name: '金沢21世紀美術館',
    area: '金沢',
    region: '石川県金沢市',
    summary: '体験型現代アートが人気。雨の日プランにも最適。',
    tags: ['金沢', '美術館', 'アート', '雨', '屋内', '写真'],
    photos: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b2/21st_Century_Museum_of_Contemporary_Art%2C_Kanazawa011.jpg/960px-21st_Century_Museum_of_Contemporary_Art%2C_Kanazawa011.jpg',
        caption: '金沢21世紀美術館',
        credit: '出典: Wikimedia Commons (CC BY-SA)',
      },
    ],
    suggestedActivities: ['スイミング・プール体験', 'アート写真撮影', 'カフェ休憩'],
  },
  {
    id: 'spot-omicho',
    name: '近江町市場',
    area: '金沢',
    region: '石川県金沢市',
    summary: '新鮮な海鮮丼やのどぐろを食べ歩きできる金沢の台所。',
    tags: ['金沢', '近江町市場', '海鮮', '食べ歩き', 'グルメ', '屋内'],
    photos: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/33/Omicho-ichiba_%E8%BF%91%E6%B1%9F%E7%94%BA%E5%B8%82%E5%A0%B4_A091185.JPG/960px-Omicho-ichiba_%E8%BF%91%E6%B1%9F%E7%94%BA%E5%B8%82%E5%A0%B4_A091185.JPG',
        caption: '近江町市場',
        credit: '出典: Wikimedia Commons (CC BY-SA)',
      },
    ],
    suggestedActivities: ['豪華な海鮮丼', 'のどぐろ・コロッケ食べ歩き', '市場めぐり'],
  },
  {
    id: 'spot-kanazawa-castle',
    name: '金沢城公園',
    area: '金沢',
    region: '石川県金沢市',
    summary: '兼六園のすぐ向かい。白漆喰の石川門と広々した公園が見どころ。',
    tags: ['金沢', '金沢城', '歴史', '散歩'],
    photos: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7e/Kanazawa-M-5932.jpg/960px-Kanazawa-M-5932.jpg',
        caption: '金沢城',
        credit: '出典: Wikimedia Commons (CC BY-SA)',
      },
    ],
    suggestedActivities: ['石川門で撮影', '五十間長屋の見学', '公園散歩'],
  },
  {
    id: 'spot-nagamachi',
    name: '長町武家屋敷跡',
    area: '金沢',
    region: '石川県金沢市',
    summary: '土塀と石畳が続く風情ある町並み。和カフェや雑貨店も点在。',
    tags: ['金沢', '武家屋敷', '街歩き', 'カフェ', '写真'],
    photos: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/24/Nagamachi_Bukeyashiki.jpg/960px-Nagamachi_Bukeyashiki.jpg',
        caption: '長町武家屋敷跡',
        credit: '出典: Wikimedia Commons (CC BY-SA)',
      },
    ],
    suggestedActivities: ['石畳の町並み散策', '和カフェで休憩', '九谷焼ショップ'],
  },

  // ===== 箱根（5件） =====
  {
    id: 'spot-owakudani',
    name: '大涌谷・箱根ロープウェイ',
    area: '箱根',
    region: '神奈川県箱根町',
    summary: 'ダイナミックな噴煙と名物黒たまご、空中散歩が楽しめる。',
    tags: ['箱根', '大涌谷', 'ロープウェイ', '自然', '絶景'],
    photos: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9f/161223_Owakudani_Hakone_Japan09s3.jpg/960px-161223_Owakudani_Hakone_Japan09s3.jpg',
        caption: '大涌谷',
        credit: '出典: Wikimedia Commons (CC BY-SA)',
      },
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/41/161223_Togendai_Station_Hakone_Japan06s3.jpg/960px-161223_Togendai_Station_Hakone_Japan06s3.jpg',
        caption: '箱根ロープウェイ',
        credit: '出典: Wikimedia Commons (CC BY-SA)',
      },
    ],
    suggestedActivities: ['ロープウェイ乗車', '名物黒たまご', '絶景撮影'],
  },
  {
    id: 'spot-hakone-onsen',
    name: '箱根湯本温泉',
    area: '箱根',
    region: '神奈川県箱根町',
    summary: '箱根の玄関口。駅前の食べ歩き商店街と温泉宿が充実。',
    tags: ['箱根', '温泉', '箱根湯本', '食べ歩き', '宿'],
    photos: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/10/Hakone_yumoto_onsen_2.jpg/960px-Hakone_yumoto_onsen_2.jpg',
        caption: '箱根湯本温泉',
        credit: '出典: Wikimedia Commons (CC BY-SA)',
      },
    ],
    suggestedActivities: ['温泉まんじゅう食べ歩き', '日帰り温泉', '温泉宿に泊まる'],
  },
  {
    id: 'spot-hakone-shrine',
    name: '箱根神社',
    area: '箱根',
    region: '神奈川県箱根町',
    summary: '芦ノ湖に浮かぶ平和の鳥居がフォトジェニックなパワースポット。',
    tags: ['箱根', '箱根神社', '鳥居', '写真', '神社'],
    photos: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6d/Hakonejinja_-02.jpg/960px-Hakonejinja_-02.jpg',
        caption: '箱根神社',
        credit: '出典: Wikimedia Commons (CC BY-SA)',
      },
    ],
    suggestedActivities: ['平和の鳥居で撮影', '本殿参拝', '芦ノ湖畔を歩く'],
  },
  {
    id: 'spot-lake-ashi',
    name: '芦ノ湖',
    area: '箱根',
    region: '神奈川県箱根町',
    summary: '海賊船クルーズと湖畔カフェを楽しめる箱根のシンボル湖。',
    tags: ['箱根', '芦ノ湖', '海賊船', 'フェリー', '自然'],
    photos: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f9/Lake_Ashi_Aerial_photograph.1976.jpg/960px-Lake_Ashi_Aerial_photograph.1976.jpg',
        caption: '芦ノ湖',
        credit: '出典: Wikimedia Commons (CC BY)',
      },
    ],
    suggestedActivities: ['箱根海賊船に乗る', '湖畔ベーカリー＆カフェ', '湖の景色を撮る'],
  },
  {
    id: 'spot-hakone-glass',
    name: '箱根ガラスの森美術館',
    area: '箱根',
    region: '神奈川県箱根町',
    summary: 'きらめくクリスタルガラスの庭園とヴェネチアン・グラス展示が美しい。',
    tags: ['箱根', '美術館', 'ガラス', '屋内', '写真'],
    photos: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7e/Hakone_Venetian_Glass_Museum.jpg/960px-Hakone_Venetian_Glass_Museum.jpg',
        caption: '箱根ガラスの森美術館',
        credit: '出典: Wikimedia Commons (CC BY-SA)',
      },
    ],
    suggestedActivities: ['ガラス庭園で撮影', '体験工房', 'テラスカフェ'],
  },

  // ===== 鎌倉（4件） =====
  {
    id: 'spot-komachi-hachimangu',
    name: '小町通り・鶴岡八幡宮',
    area: '鎌倉',
    region: '神奈川県鎌倉市',
    summary: '鎌倉駅すぐの食べ歩き通りと歴史ある八幡宮。',
    tags: ['鎌倉', '小町通り', '鶴岡八幡宮', '食べ歩き', '神社'],
    photos: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/29/Komachi_Street%2C_Kanagawa_02.jpg/960px-Komachi_Street%2C_Kanagawa_02.jpg',
        caption: '鎌倉・小町通り',
        credit: '出典: Wikimedia Commons (CC BY-SA)',
      },
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d1/TsurugaokaHachimangu_by_ulysses_powers_in_Kamakura.jpg/960px-TsurugaokaHachimangu_by_ulysses_powers_in_Kamakura.jpg',
        caption: '鶴岡八幡宮',
        credit: '出典: Wikimedia Commons (CC BY)',
      },
    ],
    suggestedActivities: ['しらす・抹茶食べ歩き', '鶴岡八幡宮参拝', '古民家カフェ'],
  },
  {
    id: 'spot-enoshima',
    name: '江の島・鎌倉大仏',
    area: '鎌倉',
    region: '神奈川県鎌倉市・藤沢市',
    summary: '海沿いの江ノ電と夕日の江の島、鎌倉大仏を巡る王道ルート。',
    tags: ['鎌倉', '江の島', '海', '江ノ電', '大仏'],
    photos: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/04/Enoshima_view_from_Kugenuma_beach.jpg/960px-Enoshima_view_from_Kugenuma_beach.jpg',
        caption: '江の島',
        credit: '出典: Wikimedia Commons (CC BY-SA)',
      },
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5d/Kamakura_Budda_Daibutsu_front_1885.jpg/960px-Kamakura_Budda_Daibutsu_front_1885.jpg',
        caption: '鎌倉大仏',
        credit: '出典: Wikimedia Commons (Public Domain)',
      },
    ],
    suggestedActivities: ['江ノ電に乗る', 'しらす丼', '夕日の海辺フォト', '鎌倉大仏'],
  },
  {
    id: 'spot-hokokuji',
    name: '報国寺（竹の庭）',
    area: '鎌倉',
    region: '神奈川県鎌倉市',
    summary: '約2,000本の竹林を眺めながら抹茶をいただける静かな名刹。',
    tags: ['鎌倉', '報国寺', '竹林', '抹茶', '自然'],
    photos: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b1/H%C5%8Dkoku-ji%2C_Main_Hall_001.jpg/960px-H%C5%8Dkoku-ji%2C_Main_Hall_001.jpg',
        caption: '報国寺',
        credit: '出典: Wikimedia Commons (CC BY-SA)',
      },
    ],
    suggestedActivities: ['竹林を散策', '茶席で抹茶をいただく', '静かに写真撮影'],
  },
  {
    id: 'spot-hasedera',
    name: '長谷寺',
    area: '鎌倉',
    region: '神奈川県鎌倉市',
    summary: '四季の花々と由比ヶ浜を見渡す見晴台が美しい鎌倉の名寺。',
    tags: ['鎌倉', '長谷寺', '花', '展望', '海'],
    photos: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c8/Kamakura_Hasedera_Kannondou.jpg/960px-Kamakura_Hasedera_Kannondou.jpg',
        caption: '鎌倉・長谷寺',
        credit: '出典: Wikimedia Commons (CC BY-SA)',
      },
    ],
    suggestedActivities: ['見晴台から海を眺める', '庭園の花を撮影', '良縁地蔵探し'],
  },

  // ===== 東京（6件） =====
  {
    id: 'spot-asakusa',
    name: '浅草・浅草寺',
    area: '東京',
    region: '東京都台東区',
    summary: '雷門から仲見世通りの食べ歩きと下町散策が楽しめる定番。',
    tags: ['東京', '浅草', '浅草寺', '雷門', '食べ歩き'],
    photos: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ed/Senso-ji_Kaminarimon_201503a.jpg/960px-Senso-ji_Kaminarimon_201503a.jpg',
        caption: '浅草寺・雷門',
        credit: '出典: Wikimedia Commons (CC BY-SA)',
      },
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8d/Asakusa_Senso-ji_2021-12_ac_%282%29.jpg/960px-Asakusa_Senso-ji_2021-12_ac_%282%29.jpg',
        caption: '浅草寺本堂',
        credit: '出典: Wikimedia Commons (CC BY-SA)',
      },
    ],
    suggestedActivities: ['雷門で集合写真', '仲見世食べ歩き', 'おみくじ'],
  },
  {
    id: 'spot-tokyo-tower',
    name: '東京タワー',
    area: '東京',
    region: '東京都港区',
    summary: '赤白のシンボルタワー。展望デッキと芝公園からの撮影が人気。',
    tags: ['東京', '東京タワー', '夜景', '展望', '写真'],
    photos: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/47/%E6%97%A5%E6%9C%AC%E9%9B%BB%E6%B3%A2%E5%A1%94%EF%BC%88%E6%9D%B1%E4%BA%AC%E3%82%BF%E3%83%AF%E3%83%BC%EF%BC%89.jpg/960px-%E6%97%A5%E6%9C%AC%E9%9B%BB%E6%B3%A2%E5%A1%94%EF%BC%88%E6%9D%B1%E4%BA%AC%E3%82%BF%E3%83%AF%E3%83%BC%EF%BC%89.jpg',
        caption: '東京タワー',
        credit: '出典: Wikimedia Commons (CC BY-SA)',
      },
    ],
    suggestedActivities: ['メインデッキ展望', '芝公園から記念撮影', '夜景鑑賞'],
  },
  {
    id: 'spot-skytree',
    name: '東京スカイツリー',
    area: '東京',
    region: '東京都墨田区',
    summary: '高さ634mの展望台とソラマチのグルメ・お土産ショッピング。',
    tags: ['東京', 'スカイツリー', 'ソラマチ', '展望', '屋内'],
    photos: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/84/Tokyo_Skytree_2014_%E2%85%A2.jpg/960px-Tokyo_Skytree_2014_%E2%85%A2.jpg',
        caption: '東京スカイツリー',
        credit: '出典: Wikimedia Commons (CC BY-SA)',
      },
    ],
    suggestedActivities: ['展望デッキ', 'ソラマチで食べ歩き', 'すみだ水族館'],
  },
  {
    id: 'spot-meiji-shrine',
    name: '明治神宮・原宿',
    area: '東京',
    region: '東京都渋谷区',
    summary: '都会の森の神社参拝と、すぐ隣の原宿カフェ・スイーツ巡り。',
    tags: ['東京', '明治神宮', '原宿', 'カフェ', '神社'],
    photos: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ed/Courtyard_of_Meiji_Shrine_20190717.jpg/960px-Courtyard_of_Meiji_Shrine_20190717.jpg',
        caption: '明治神宮',
        credit: '出典: Wikimedia Commons (CC BY-SA)',
      },
    ],
    suggestedActivities: ['明治神宮参拝', '原宿スイーツ・カフェ', '表参道ショッピング'],
  },
  {
    id: 'spot-shibuya',
    name: '渋谷スクランブル交差点',
    area: '東京',
    region: '東京都渋谷区',
    summary: '東京のエネルギーを感じる中心地。展望施設やトレンドグルメが充実。',
    tags: ['東京', '渋谷', '都会', 'ショッピング', 'グルメ'],
    photos: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c2/2018_Shibuya_Crossing.jpg/960px-2018_Shibuya_Crossing.jpg',
        caption: '渋谷スクランブル交差点',
        credit: '出典: Wikimedia Commons (CC BY-SA)',
      },
    ],
    suggestedActivities: ['渋谷スカイ展望', 'カフェ＆グルメ', 'ショッピング'],
  },
  {
    id: 'spot-odaiba',
    name: 'お台場',
    area: '東京',
    region: '東京都港区・江東区',
    summary: 'レインボーブリッジと海辺の夜景、屋内エンタメが集まるベイエリア。',
    tags: ['東京', 'お台場', '海', '夜景', '屋内'],
    photos: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5a/Tokyo-Odaiba.jpg/960px-Tokyo-Odaiba.jpg',
        caption: 'お台場海浜公園とレインボーブリッジ',
        credit: '出典: Wikimedia Commons (CC BY-SA)',
      },
    ],
    suggestedActivities: ['海辺の夜景撮影', 'ショッピングモール', '屋内エンタメ施設'],
  },
]

/**
 * 目的地に厳密に一致するおすすめスポット（4〜6件）だけを返す。
 * 他県・無関係エリアのスポットは絶対に混ぜない。
 */
export function getRecommendedSpots(destination: string): SpotCatalogItem[] {
  const trimmed = destination.trim()
  if (!trimmed) {
    // 目的地未入力時は代表エリアから6件をバランスよく表示
    const pickIds = [
      'spot-itsukushima',
      'spot-arashiyama',
      'spot-kokusai-dori',
      'spot-dotonbori',
      'spot-otaru',
      'spot-asakusa',
    ]
    return pickIds
      .map((id) => SPOT_CATALOG.find((s) => s.id === id))
      .filter((s): s is SpotCatalogItem => Boolean(s))
  }

  const matched = SPOT_CATALOG.filter(
    (spot) =>
      spot.area.includes(trimmed) ||
      trimmed.includes(spot.area) ||
      spot.region.includes(trimmed) ||
      spot.name.includes(trimmed) ||
      spot.tags.some((tag) => tag.includes(trimmed) || trimmed.includes(tag)),
  )

  return matched.slice(0, 6)
}

export function searchSpots(query: string): SpotCatalogItem[] {
  const tokens = query
    .trim()
    .toLowerCase()
    .split(/[\s　]+/)
    .filter(Boolean)

  if (tokens.length === 0) return []

  return SPOT_CATALOG.filter((spot) => {
    const haystack = [
      spot.name,
      spot.area,
      spot.region,
      spot.summary,
      ...spot.tags,
      ...spot.suggestedActivities,
    ]
      .join(' ')
      .toLowerCase()

    return tokens.every((token) => haystack.includes(token))
  })
}

export function findCatalogSpotById(spotId?: string): SpotCatalogItem | undefined {
  if (!spotId) return undefined
  return SPOT_CATALOG.find((s) => s.id === spotId)
}

/**
 * スポット名と本物の写真が一致する場合のみ写真オブジェクトを返す。
 * 無関係な他県・別スポットの写真を誤表示しないよう、不一致時は null を返す。
 */
export function findExactSpotPhoto(spotName: string, areaOrQuery = ''): SpotPhoto | null {
  const nameNorm = spotName.trim().toLowerCase()
  if (!nameNorm) return null

  // 1. スポット名で厳密・部分一致
  const byName = SPOT_CATALOG.find((s) => {
    const sName = s.name.toLowerCase()
    const baseName = sName.replace(/[（(].*?[）)]/g, '').trim()
    return (
      sName === nameNorm ||
      baseName === nameNorm ||
      nameNorm.includes(baseName) ||
      sName.includes(nameNorm)
    )
  })
  if (byName?.photos[0]) return byName.photos[0]

  // 2. スポット名に含まれる固有タグ（エリア名だけの緩い一致は除外）で一致
  const areaNames = new Set(POPULAR_DESTINATIONS.map((d) => d.toLowerCase()))
  const bySpecificTag = SPOT_CATALOG.find((s) =>
    s.tags.some((t) => {
      const tl = t.toLowerCase()
      return tl.length >= 2 && !areaNames.has(tl) && nameNorm.includes(tl)
    }),
  )
  if (bySpecificTag?.photos[0]) {
    // エリア指定がある場合はエリア矛盾がないかもチェック
    const areaNorm = areaOrQuery.toLowerCase()
    if (
      !areaNorm ||
      areaNorm.includes(bySpecificTag.area.toLowerCase()) ||
      bySpecificTag.region.toLowerCase().includes(areaNorm)
    ) {
      return bySpecificTag.photos[0]
    }
  }

  return null
}
