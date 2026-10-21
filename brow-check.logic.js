// 似合う眉チェック：判定ロジック（画面・通信なし）。設計：docs/design-brow-check-site-2026-10-16.md
// テスト：tests/brow_check_logic.test.mjs。個人情報は扱わない（答えはページ内で判定するだけ・どこにも送らない）。
// ★割り当て・文言は仮（yuumi 確認前）。眉マップ画像（analysis-output/眉マップ）と同じ割り当てにしている。
(function (root) {
  "use strict";

  const QUESTIONS = [
    { id: "face", text: "顔の輪郭は？", hint: "いちばん近いものを選んでください", options: [
      { value: "round", label: "丸顔", hint: "頬がふっくら・縦横が近い" },
      { value: "oval", label: "卵型", hint: "あごに向かってなめらか" },
      { value: "long", label: "面長", hint: "縦に長め" },
      { value: "base", label: "ベース型", hint: "えらが張り気味" } ] },
    { id: "mood", text: "なりたい印象は？", hint: "メイクした時の理想に近いもの", options: [
      { value: "soft", label: "やわらか", hint: "丸みのある眉・甘く優しい" }, { value: "natural", label: "ナチュラル", hint: "まっすぐ寄り・素肌っぽく自然" }, { value: "sharp", label: "きりっと", hint: "すっきり眉・凛とした大人" } ] },
    { id: "texture", text: "自眉の毛は？", hint: "触った感じや見た目で", options: [
      { value: "fine", label: "細い・やわらかい" }, { value: "coarse", label: "太い・かため" } ] },
    { id: "remain", text: "自眉の残り方は？", hint: "何も描いていない状態で", options: [
      { value: "none", label: "ほとんどない" }, { value: "sparse", label: "全体がまばら" },
      { value: "partial_end", label: "眉頭か眉尻がない" }, { value: "patch", label: "一部だけ残る" } ] },
  ];

  // 仁義さん作成の6デザイン。画像・カード・結果・シェアはこのidを共通で使う。
  const SHAPE_TYPES = [
    { id: "heiko", name: "平行眉", impression: "やさしく親しみやすい印象",
      nickname: "親しみやすいナチュラル眉",
      suits: ["やさしく親しみやすい雰囲気を好む方", "横のラインを生かした穏やかな眉を楽しみたい方"],
      point: "眉頭から眉尻まで水平に近い流れを保ち、眉尻を細く整えて自然な抜け感をつくります。",
      spec: { curve: 1, length: 4, thickness: 3 }, mood: 1, peakAngle: 3,
      aliases: ["#平行眉", "#ナチュラル眉"],
      measure: { head: { x: 128, y: 186 }, peak: { x: 724, y: 55 }, tail: { x: 1119, y: 194 } },
      path: "M5 24 Q58 17 104 20 Q112 22 116 28 Q106 25 98 25 Q56 24 7 30 Z" },
    { id: "straight", name: "ストレート眉", impression: "すっきり知的な印象",
      nickname: "すっきり知的な直線眉",
      suits: ["すっきりした眉ラインを好む方", "知的で端正な雰囲気を取り入れたい方"],
      point: "眉頭から眉尻へすっきりした直線をつなぎ、細い眉尻で端正にまとめます。",
      spec: { curve: 1, length: 4, thickness: 3 }, mood: 4, peakAngle: 4,
      aliases: ["#ストレート眉", "#直線眉"],
      measure: { head: { x: 95, y: 191 }, peak: { x: 708, y: 52 }, tail: { x: 1114, y: 174 } },
      path: "M5 29 L104 16 Q112 17 116 21 Q105 23 96 24 L7 34 Z" },
    { id: "arch", name: "アーチ眉", impression: "上品で女性らしい印象",
      nickname: "上品な曲線を描くアーチ眉",
      suits: ["丸みのある眉ラインを好む方", "上品でやわらかな雰囲気を取り入れたい方"],
      point: "丸みのある眉山から眉尻へなめらかにカーブさせ、上品なやわらかさを添えます。",
      spec: { curve: 5, length: 4, thickness: 3 }, mood: 2, peakAngle: 13,
      aliases: ["#アーチ眉", "#曲線眉"],
      measure: { head: { x: 114, y: 194 }, peak: { x: 616, y: 25 }, tail: { x: 1118, y: 215 } },
      path: "M5 32 Q52 4 84 13 Q105 19 116 31 Q101 24 84 22 Q50 18 7 36 Z" },
    { id: "heiko_arch", name: "平行アーチ眉", impression: "自然で今っぽい印象",
      nickname: "自然になじむ今っぽ眉",
      suits: ["平行眉の自然さと丸みを両方取り入れたい方", "ほどよく整った今っぽい雰囲気を好む方"],
      point: "眉頭側は平行に、眉山から眉尻へゆるやかなカーブをつなぎます。",
      spec: { curve: 3, length: 4, thickness: 3 }, mood: 2, peakAngle: 8,
      aliases: ["#平行アーチ眉", "#セミアーチ眉"],
      measure: { head: { x: 113, y: 182 }, peak: { x: 747, y: 43 }, tail: { x: 1132, y: 210 } },
      path: "M5 28 Q53 14 88 17 Q106 20 116 30 Q103 25 88 24 Q52 22 7 33 Z" },
    { id: "agari", name: "上がり眉", impression: "凛として華やかな印象",
      nickname: "凛と華やぐ上がり眉",
      suits: ["きりっとした眉ラインを好む方", "凛とした華やかさを取り入れたい方"],
      point: "眉尻へ向かうラインを少し上向きに整え、きつく見えないよう角度はゆるやかに仕上げます。",
      spec: { curve: 3, length: 3, thickness: 3 }, mood: 5, peakAngle: 12,
      aliases: ["#上がり眉", "#シャープ眉"],
      measure: { head: { x: 62, y: 256 }, peak: { x: 861, y: 60 }, tail: { x: 1137, y: 106 } },
      path: "M8 34 Q58 18 108 8 Q114 8 117 12 Q108 16 98 17 Q56 25 10 39 Z" },
    { id: "sagari", name: "下がり眉", impression: "やわらかく優しげな印象",
      nickname: "ふんわり優しげな下がり眉",
      suits: ["やわらかく優しげな雰囲気を好む方", "丸みを残した穏やかな眉を取り入れたい方"],
      point: "眉山から眉尻をゆるやかに下げ、丸みを残してやわらかな雰囲気に整えます。",
      spec: { curve: 3, length: 3, thickness: 3 }, mood: 1, peakAngle: 6,
      aliases: ["#下がり眉", "#たれ眉"],
      measure: { head: { x: 105, y: 144 }, peak: { x: 353, y: 56 }, tail: { x: 1155, y: 266 } },
      path: "M7 19 Q38 9 68 17 Q96 25 114 37 Q103 31 88 29 Q53 20 9 25 Z" },
  ];

  // 輪郭 × 印象 → 形。第32回の案（yuumi さん確認前）。
  const SHAPE_TABLE = {
    round: { soft: "heiko_arch", natural: "arch", sharp: "agari" },
    oval: { soft: "sagari", natural: "heiko_arch", sharp: "straight" },
    long: { soft: "heiko", natural: "heiko", sharp: "straight" },
    base: { soft: "arch", natural: "heiko_arch", sharp: "agari" },
  };

  function facesForShape(shapeId) {
    if (!SHAPE_TYPES.some((shape) => shape.id === shapeId)) return [];
    return QUESTIONS[0].options
      .filter((face) => Object.values(SHAPE_TABLE[face.value]).includes(shapeId))
      .map((face) => ({ id: face.value, label: face.label, image: "face-" + face.value }));
  }

  const COLOR_GROUPS = {
    soft: { group: "soft", title: "明るめ〜中間のブラウン",
      colors: [ { name: "ライトブラウン", hex: "#b08a6e" }, { name: "ミディアムブラウン", hex: "#8a6a55" }, { name: "ダークブラウン", hex: "#5e4a3f" } ],
      prep: "ブリーチなしでOK", note: "色を自由に選びやすいタイプです" },
    hard: { group: "hard", title: "濃いめの色",
      colors: [ { name: "ダークブラウン", hex: "#5e4a3f" }, { name: "ブラウンブラック", hex: "#2f2a28" } ],
      prep: "ブリーチをおすすめ", note: "自眉となじませるのがポイントです" },
  };

  const own = (obj, key) => typeof key === "string" && Object.prototype.hasOwnProperty.call(obj, key);

  function decideShape(face, mood) {
    if (!own(SHAPE_TABLE, face)) return null;
    const row = SHAPE_TABLE[face];
    return own(row, mood) ? row[mood] : null;
  }

  const REMAIN_VALUES = ["none", "sparse", "partial_end", "patch"];
  function decideColor(texture, remain) {
    if (texture !== "fine" && texture !== "coarse") return null;
    if (!REMAIN_VALUES.includes(remain)) return null;
    // 自眉がほとんどない場合は、毛質に関係なく色を自由に選べる側
    if (texture === "fine" || remain === "none") return COLOR_GROUPS.soft;
    return COLOR_GROUPS.hard;
  }

  function shapeById(id) {
    return SHAPE_TYPES.find((t) => t.id === id) || null;
  }

  // LINE 公式の追加リンク・エルメの流入元リンク（s.lmes.jp/landing-qr＝QRコードアクション）だけを許す（それ以外は出さない）
  const ALLOWED_LINE = /^https:\/\/(lin\.ee|line\.me|liff\.line\.me|page\.line\.me|step\.lme\.jp|s\.lmes\.jp)\/[A-Za-z0-9._~\-\/?=&%]*$/;
  function lineUrlFor(config, artist, shapeId) {
    if (!config || !own(config, artist)) return null;
    const urls = config[artist] && config[artist].lineUrls;
    if (!urls || !own(urls, shapeId)) return null;
    const url = urls[shapeId];
    return typeof url === "string" && ALLOWED_LINE.test(url) ? url : null;
  }

  const DEFAULT_ARTIST = "yuumi";
  function resolveArtist(config, search) {
    let a = "";
    const m = /[?&]a=([A-Za-z0-9_-]{1,20})/.exec(typeof search === "string" ? search : "");
    if (m) a = m[1].toLowerCase();
    return config && own(config, a) ? a : DEFAULT_ARTIST;
  }

  // ストーリー画像の文字は上下250pxの操作領域を避ける。DOMやcanvasに依存しないためテストできる。
  function createShareLayout(igHandle) {
    const rawHandle = typeof igHandle === "string" ? igHandle.trim().replace(/^@/, "") : "";
    const handle = /^[A-Za-z0-9._]{1,30}$/.test(rawHandle) ? rawHandle : "";
    const profileLine = handle ? "@" + handle + " のプロフィールから" : "";
    const mentionLine = "";
    const textRows = [
      { key: "overline", y: 294, fontSize: 26 },
      { key: "title", y: 354, fontSize: 44 },
      { key: "prefix", y: 430, fontSize: 30 },
      { key: "nickname", y: 520, fontSize: 72 },
      { key: "type", y: 596, fontSize: 34 },
      { key: "impression", y: 650, fontSize: 30 },
      { key: "colorHeading", y: 1138, fontSize: 28 },
      { key: "colorTitle", y: 1194, fontSize: 36 },
      { key: "cta", y: 1532, fontSize: 46 },
    ];
    if (profileLine) textRows.push({ key: "profile", y: 1596, fontSize: 36 });
    textRows.push({ key: "brand", y: 1654, fontSize: 24 });
    return {
      width: 1080,
      height: 1920,
      safeTop: 250,
      safeBottom: 1670,
      profileLine,
      mentionLine,
      colorTitleY: 1194,
      swatchY: 1230,
      swatchSize: 136,
      swatchGap: 132,   // 一番長い色名（9文字×28px）でも隣と重ならない間隔
      swatchLabelY: 1404,
      swatchLabelSize: 28,
      textRows,
    };
  }

  root.BrowCheck = Object.freeze({ QUESTIONS, SHAPE_TYPES, COLOR_GROUPS, decideShape, decideColor, shapeById, facesForShape, lineUrlFor, resolveArtist, createShareLayout });
})(globalThis);
