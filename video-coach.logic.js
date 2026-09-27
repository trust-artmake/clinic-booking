// 自動生成: scripts/video-coach/build-browser.mjs。直接編集しない。
(()=>{
/** フェーズA。入出力データだけを扱い、通信・DB・認証・現在時刻に依存しない。 */

const DEFAULTS = Object.freeze({
  strictness: 'loose'              ,
  retentionDaysOriginals: 7, retentionDaysAnalysis: 90, retentionDaysPlans: 365,
  monthlyCapWarnJpy: 3000, monthlyCapStopJpy: 6000, operationReserveJpy: 100,
  maxClipBytes: 300 * 1024 * 1024, maxSessionBytes: 1024 * 1024 * 1024,
  signedReadSeconds: 300, signedUploadSeconds: 7200, requestTimeoutMs: 110000, staleLockSeconds: 600,
  maxOutputTokens: 8192, usdJpy: 150, inputUsdPerMillion: 1, outputUsdPerMillion: 2.5,
  videoMimeTypes: ['video/mp4', 'video/quicktime', 'video/webm'],

  targetSeconds: { min: 20, max: 30 }, speed: { min: 0.5, max: 2, normal: 1 },
  caption: { maxLines: 2, minChars: 10, maxChars: 16, secondsPerChar: 0.15, padding: 0.5 },
  speechTolerance: 0.3, trimStep: 0.5, contextSeconds: 1, alternativeCount: 3,
  // AI の時刻読みのズレ（秒）。これ以内は実測の長さに丸め、超えたら捏造の疑いとして failed。
  analysisOverrunSeconds: 1,
  maxClips: 12, maxClipSeconds: 600, maxWorries: 3, codeDigits: 6,
  textCardSeconds: 3, stillSeconds: 1.5, displayDecimals: 2, epsilon: 1e-7,
  zoom: { maxPerPlan: 1, from: 100, to: 115, closeOnlyThreshold: 150 },
  retakeShotSeconds: 5, consecutiveShotLimit: 3, referenceFps: 30,
  budgets: { opening: 3, consult: 5, explain: 4, finish: 2, conditions: 3, cta: 3 },
  shotBudgets: { design_hands: 1.5, procedure_wide: 2, brow_close: 1.5 },
});
const CAPTION_LIMITS = DEFAULTS.caption;
const FORBIDDEN_PHRASES = ['必ず定着', '絶対消えない', '美肌加工', '肌を加工', '眉の色を加工', '治る', '痛くない', 'ダウンタイムなし']         ;
const CAUTION_PHRASES = ['人生が変わ', '垢抜け', '別人', '必ず', '絶対', '気に入り', '嬉しい', 'うれしい', '満足']         ;


























const ROLE_LABELS                       = { opening: '冒頭', consult: '相談の様子', explain: 'デザイン・施術の説明', finish: '仕上がり', conditions: '条件の説明', cta: '予約の案内' };
const TEMPLATE_LABELS                           = { consult_flow: '相談の流れ型', case_intro: '症例紹介型', explain: '説明型' };
const WORRIES = [
  ['asymmetry', '左右差が気になる', '形・バランス', '眉の左右差が気になる？'],
  ['tail', '眉尻が薄い・描きにくい', '形・バランス', '眉尻が描きにくい？'],
  ['suitable', '似合う形がわからない', '形・バランス', '似合う眉がわからない？'],
  ['droopy', '困り眉・下がり眉に見える', '形・バランス', '下がり眉が気になる？'],
  ['morning_time', '毎朝の眉メイクに時間がかかる', '時間・手間', '朝の眉メイクに時間がかかる？'],
  ['sweat', '汗や皮脂で消える・崩れる', '時間・手間', '汗で眉が崩れる？'],
  ['color', '眉だけ浮く・色が合わない', '色・印象', '眉だけ浮いて見える？'],
  ['impression', 'やさしい・垢抜けた印象にしたい', '色・印象', '眉のどこを変えたい？'],
  ['previous', '以前のアートメイクを直したい', '過去の施術・不安', '以前の眉を相談したい？'],
  ['anxiety', '痛み・ダウンタイム・定着が心配', '過去の施術・不安', '施術後の過ごし方が心配？'],
  ['male', '男性の眉（整え方・自然さ）', '男性', '自然な眉の整え方は？'],
  ['other', 'その他（ひとこと・任意）', 'その他', '眉の悩みを相談しませんか？'],
]         ;
const ROLE_SHOTS                           = {
  opening: ['face_front', 'brow_close', 'staff_intro', 'design_hands'],
  consult: ['consult_mid'], explain: ['design_hands', 'staff_intro', 'procedure_wide', 'tool_prop', 'brow_close'],
  finish: ['face_front', 'brow_close'], conditions: ['staff_intro', 'tool_prop'], cta: ['store_cta', 'staff_intro'],
};
const OUTPUT_BANNED = /効果|確率|[\d０-９.．]*[%％]で伸びる|適合済み/g;
const PRICE = /(?:[¥￥]\s*[\d０-９])|(?:[\d０-９][\d０-９,，.．\s]*(?:万|千|百)?\s*円)|(?:[\d０-９]+\s*万(?:円)?)|(?:料金|価格|税込|税別)[^\d０-９]*[\d０-９]/;
const finite = (n         )              => typeof n === 'number' && Number.isFinite(n);
const overlap = (a                                , b                                ) => a.start < b.end - DEFAULTS.epsilon && b.start < a.end - DEFAULTS.epsilon;
const same = (a        , b        ) => Math.abs(a - b) <= DEFAULTS.epsilon;
const seconds = (n        ) => n.toFixed(DEFAULTS.displayDecimals);
function clean(text        )         { return text.replace(OUTPUT_BANNED, '未検証'); }
function dangerous(text        )          {
  const t=text.normalize('NFKC').replace(/\s/g,'');
  return FORBIDDEN_PHRASES.some(x=>t.includes(x)) || /(?:絶対|必ず|一生|永久|100%).*(?:消えない|落ちない|定着|失敗しない)|(?:消えない|落ちない|定着|失敗しない).*(?:絶対|必ず|一生|永久|100%)|(?:肌|眉の色).*(?:補正|加工)|他院より|他のクリニックより|どこよりも|より(?:も)?(?:上手|優れ|優秀|高品質)/.test(t);
}
function outputBanned(text       )         { OUTPUT_BANNED.lastIndex=0; return OUTPUT_BANNED.test(text); }
function validQuote(text       ,speech       )         {
  if(!text || endsWithContinuation(text))return false;
  const at=speech.text.indexOf(text);
  if(at<0)return false;
  const end=at+text.length;
  return (at===0||/[。！？!?\n]/.test(speech.text[at-1])) && (end===speech.text.length||/[。！？!?\n]/.test(speech.text[end])||/[。！？!?\n]$/.test(text));
}

/** JSON失敗と正常0件を区別する。未知の分類値も入口で拒否する。 */
function parseAnalyses(json        )                 {
  const value = JSON.parse(json);
  const items = Array.isArray(value) ? value : value?.analyses;
  if (!Array.isArray(items)) throw new Error('解析JSONの配列がありません');
  for (const c of items) {
    if (!c || typeof c.clip_id !== 'string' || !finite(c.duration) || !Array.isArray(c.segments) || !c.clip_flags || !Array.isArray(c.worry_candidates)) throw new Error('解析JSONの構造が不正です');
    if(new Set(c.segments.map((s        )=>s.id)).size!==c.segments.length)throw new Error('区間idが重複しています');
    for (const s of c.segments) if (typeof s.id!=='string'||!s.id.trim()||!finite(s.start) || !finite(s.end) || !Object.values(ROLE_SHOTS).flat().concat('other').includes(s.shot_type) || !['customer_face','customer_partial','staff_only','none'].includes(s.who_visible) || !s.camera || !Array.isArray(s.speech) || s.speech.some((p        ) => !finite(p.start) || !finite(p.end) || p.start >= p.end || typeof p.text !== 'string' || !['staff','customer','unknown'].includes(p.speaker))) throw new Error('解析区間の構造が不正です');
  }
  return items;
}
function endsWithContinuation(text        )          {
  return /(?:とは限りません|とは限らない|じゃなくて|ではなくて|けれども|ではなく|じゃなく|だけでなく|けれど|けど|ので|から|ても|たら|場合も|ですが|ものの|ただし|しかし|場合は)[、。，,.！!？?\s]*$/.test(text);
}
function snapToSpeech                                          (segment   , speech          , tolerance = DEFAULTS.speechTolerance)           {
  if (!finite(segment.start) || !finite(segment.end) || segment.start >= segment.end) return null;
  const sorted = speech.filter(s => finite(s.start) && finite(s.end) && s.start < s.end).sort((a,b) => a.start - b.start);
  let { start, end } = segment;
  // 途中なら許容差を超えても全文を残す。近傍への吸着は外側だけに拡張する。
  for (const s of sorted) {
    if (s.start < start && start < s.end || s.start <= start && start - s.start <= tolerance) start = Math.min(start, s.start);
    if (s.start < end && end < s.end || s.end >= end && s.end - end <= tolerance) end = Math.max(end, s.end);
  }
  for (let limit = 0; limit <= sorted.length; limit++) {
    const within = sorted.filter(s => s.start < end && s.end > start);
    const last = within.at(-1);
    if (!last || !endsWithContinuation(last.text)) return { ...segment, start, end };
    const next = sorted.find(s => s.start >= last.end && s.end > end);
    if (!next) return null;
    end = next.end;
  }
  return null;
}

function candidates(analyses                , inputs                )              {
  const superseded = new Set(analyses.filter(c => c.status !== 'failed').flatMap(c => c.segments.filter(s => s.retake_of).map(s => s.retake_of .includes(':') ? s.retake_of  : `${c.clip_id}:${s.retake_of}`)));
  return analyses.flatMap(c => c.status === 'failed' || !finite(c.duration) || c.duration <= 0 || c.clip_flags.multiple_customers_suspected ? [] : c.segments.flatMap((s, i) => {
    const id = s.id;
    if (superseded.has(`${c.clip_id}:${id}`) || s.start < 0 || s.end > c.duration || s.end <= s.start || !finite(s.start) || !finite(s.end) || s.shot_type === 'other') return [];
    if (inputs?.visibility === 'customer_face_ng' && s.who_visible === 'customer_face') return [];
    if (inputs?.visibility === 'no_customer' && ['customer_face', 'customer_partial'].includes(s.who_visible)) return [];
    return [{ clip_id: c.clip_id, start: s.start, end: s.end, segment_id: id, shot_type: s.shot_type, who_visible: s.who_visible, segment: s, clip: c, why: s.retake_of ? '言い直しを避けて後半を使いました' : 'この役割に合う構図の候補です' }];
  }));
}
function eligible(role      , c           )          {
  return ROLE_SHOTS[role].includes(c.shot_type) && (role !== 'finish' || !c.segment.camera.dark && !c.segment.camera.blurry && c.segment.camera.stable);
}
function eligibleAnalyses(analyses                , inputs               )                 {
  const ids = new Set(candidates(analyses, inputs).map(c => `${c.clip_id}:${c.segment_id}`));
  return analyses.map(c => ({ ...c, segments: c.segments.filter((s,i) => ids.has(`${c.clip_id}:${s.id}`)) }));
}
function pickTemplate(analyses                , inputs               )           {
  const list = candidates(analyses, inputs);
  if (inputs.visibility === 'no_customer' || !list.some(c => ['customer_face','customer_partial'].includes(c.who_visible))) return 'explain';
  if (list.some(c => c.shot_type === 'consult_mid' || c.segment.speech.some(s => s.speaker === 'staff'))) return 'consult_flow';
  if (inputs.visibility === 'customer_face_ok' && list.some(c => c.shot_type === 'face_front') && list.some(c => c.shot_type === 'brow_close')) return 'case_intro';
  return 'consult_flow';
}
function pickAlternatives(role      , analyses                , used          , n = DEFAULTS.alternativeCount)                {
  return candidates(analyses).filter(c => eligible(role,c) && !used.some(u => u.clip_id === c.clip_id && overlap(u,c))).slice(0,n).map(({ segment: _s, clip: _c, ...c }) => c);
}
function linkReference(role      , shotType          , families          , index                )                        {
  const sameRole = index.entries.filter(e => e.role === role);
  const ref = sameRole.find(e => e.shot_type === shotType) ?? sameRole.find(e => e.families.some(f => families.includes(f)));
  if (!ref) return null;
  return { ...ref, hypotheses: [...ref.hypotheses], difference: '撮影条件・症例・尺が異なります。構成と編集の参考として確認してください。', baseline_note: ref.baseline ? '直近3か月の投稿ではありません' : '' };
}

function computeTimeline                 (items     )                                                                                           {
  let cursor = 0;
  const timed = items.map(item => {
    if (!finite(item.speed) || item.speed < DEFAULTS.speed.min || item.speed > DEFAULTS.speed.max) throw new Error('速度の範囲が不正です');
    const length = item.still ? item.still.hold : item.source ? (item.source.end - item.source.start) / item.speed : NaN;
    if (!finite(length) || length <= 0) throw new Error('場面の長さが不正です');
    const output = { start: cursor, end: cursor + length }; cursor += length;
    return { ...item, output };
  });
  return { items: timed, total_out_seconds: cursor };
}
function bank(role      , inputs               )         {
  if (role === 'opening') return WORRIES.find(w => w[0] === inputs.worries.find(w => w.primary)?.key)?.[3] ?? '眉の悩みを相談しませんか？';
  if (role === 'consult') return '希望を一緒に確認';
  if (role === 'explain') return '形を相談します';
  if (role === 'finish') return '眉を確認';
  if (role === 'conditions') return '状態により異なります';
  const region = inputs.region_label && !dangerous(inputs.region_label) ? inputs.region_label : '地域';
  return `${region}｜相談はプロフィールへ`;
}
function fitCaption(text        , duration        , d = DEFAULTS)           {
  const capacity = Math.max(0, Math.floor((duration - d.caption.padding + d.epsilon) / d.caption.secondsPerChar));
  const chars = Array.from(text);
  if (!capacity) return [];
  if (chars.length > Math.min(capacity, d.caption.maxChars * d.caption.maxLines)) return [];
  if(chars.length<=d.caption.maxChars)return [text];
  const breaks=[...text.matchAll(/[、。！？]|(?:では|には|から|まで|より|ので|を|は|が|に|で|と|へ|も)/g)].map(m=>m.index+m[0].length).filter(n=>Array.from(text.slice(0,n)).length<=d.caption.maxChars&&Array.from(text.slice(n)).length<=d.caption.maxChars);
  const cut=breaks.at(-1);
  return cut?[text.slice(0,cut),text.slice(cut)]:[];
}
function durationNote(plan      )         {
  const d = plan.defaults ?? DEFAULTS;
  return plan.total_out_seconds < d.targetSeconds.min || plan.total_out_seconds > d.targetSeconds.max ? `約${seconds(plan.total_out_seconds)}秒です。目安の${d.targetSeconds.min}〜${d.targetSeconds.max}秒の範囲外です。発話を優先して残しました。「別の候補」で短い説明を選ぶか、必要な素材を撮り足してください。` : '';
}
function newItem(role      , source               , c                  , inputs               , index                , d                 )           {
  const note = c?.segment.camera.dark || c?.segment.camera.blurry || c && !c.segment.camera.stable ? '暗い・ブレ・ピントの懸念があるため補助映像としてのみ候補。' : '';
  const spoken = c?.segment.speech.find(s => source && overlap(s,source) && fitCaption(s.text,(source.end-source.start)/d.speed.normal,d).length);
  return { slot: 0, role, source, shot_type: c?.shot_type ?? 'other', who_visible: c?.who_visible ?? 'none', output: {start:0,end:0}, speed:d.speed.normal,
    still: source ? null : {kind:'text_card',hold:d.textCardSeconds},
    caption:{lines:[spoken?.text ?? bank(role,inputs)],position: c && ['customer_face','customer_partial'].includes(c.who_visible) ? 'top' : 'lower_center',show_from:0,show_to:0,source:spoken?'speech':'bank'},
    edit:{cut:source?'通常の切替':'文字カード',zoom:null,note:`${note}${c?.clip.clip_flags.silent ? '声が無いので字幕で説明。' : ''}${c?.segment.retake_of ? '言い直しを避けて後半を使いました。' : ''}字幕は眉・顔を避ける。`,audio:'keep'},
    why:{observation:c?clean(c.segment.notes):'この役割の素材がないため文字カードの案です',booking_aim:'相談内容と次の行動が伝わるようにする（仮説）',reach_aim:'自分に関係する話だと早く分かるようにする（仮説）'},
    reference: c ? linkReference(role,c.shot_type,inputs.worries.some(w=>w.key==='asymmetry')?['R01','R04']:['R03'],index) : null,
    alternatives:[],warnings:[],needs_check:role==='finish'?['撮影時点は未確認。施術前後や定着後とは断定しません。']:role==='cta'?['実際のプロフィールの相談先を公開前に確認してください。']:[],confidence:{observation:'medium',fit:'low'}};
}

function buildPlan(analyses                , inputs               , referenceIndex                , defaults = DEFAULTS)       {
  const auto = pickTemplate(analyses,inputs);
  const template = inputs.template && (auto !== 'explain' || inputs.template === 'explain') ? inputs.template : auto;
  const plan       = {id:'local-plan',version:1,template,total_out_seconds:0,duration_note:'',items:[],gaps:[],checks:{ok:false,fixes:[],needsCheck:[],warnings:[],errors:[]},defaults};
  const list = candidates(analyses,inputs);
  for (const c of analyses) {
    if (c.status === 'failed') plan.gaps.push({clip_id:c.clip_id,reason:'読めなかった素材です。形式を確認して撮り直し、または変換を試してください。'});
    if (c.duration <= 0) plan.gaps.push({clip_id:c.clip_id,reason:'素材の長さが0秒のため使えません。'});
    if (c.clip_flags.multiple_customers_suspected) plan.gaps.push({clip_id:c.clip_id,reason:'別のお客様が映っていそうです。1回に1症例として素材を分けてください。'});
    if(c.segments.some(s => ['face_front','brow_close'].includes(s.shot_type) && (s.camera.dark || s.camera.blurry || !s.camera.stable))) plan.gaps.push({clip_id:c.clip_id,role:'finish',reason:'暗い・ブレ・ピントに懸念がある区間は仕上がりに使いません。'});
    if(c.segments.some(s=>s.shot_type==='other')) plan.gaps.push({clip_id:c.clip_id,reason:'場面の種類を判別できない区間は使いません。'});
  }
  if (!list.length) { plan.checks.errors.push('読み取れませんでした。使える素材と映り方の設定を確認してください。'); return plan; }
  const requests                                  = template==='explain' ? [{role:'opening',shots:['staff_intro','design_hands']},{role:'explain',shots:['staff_intro']},{role:'explain',shots:['design_hands','tool_prop']},{role:'conditions'},{role:'cta'}] : template==='case_intro' ? [{role:'opening',shots:['face_front']},{role:'explain'},{role:'finish',shots:['face_front']},{role:'finish',shots:['brow_close']},{role:'conditions'},{role:'cta'}] : [{role:'opening'},{role:'consult'},{role:'explain',shots:['design_hands']},{role:'explain',shots:['staff_intro','procedure_wide','tool_prop']},{role:'finish',shots:['face_front']},{role:'finish',shots:['brow_close']},{role:'cta'}];
  const used           = [];
  let zooms = 0;
  for (const request of requests) {
    const role = request.role;
    const pool = list.filter(c=>eligible(role,c) && (!request.shots || request.shots.includes(c.shot_type))).sort((a,b)=>{
      const worry = inputs.worries.find(w=>w.primary)?.key;
      return Number(b.clip.worry_candidates.some(w=>w.key===worry))-Number(a.clip.worry_candidates.some(w=>w.key===worry)) || ROLE_SHOTS[role].indexOf(a.shot_type)-ROLE_SHOTS[role].indexOf(b.shot_type);
    });
    let chosen                   = null;
    let source                = null;
    for(const c of pool) {
      const recent=plan.items.slice(-(defaults.consecutiveShotLimit-1));
      if(recent.length===defaults.consecutiveShotLimit-1&&recent.every(i=>i.shot_type===c.shot_type))continue;
      // 同じ素材の未使用区間から、発話のまとまりを保って選ぶ。
      const occupied = used.filter(u=>u.clip_id===c.clip_id).sort((a,b)=>a.start-b.start);
      const spans=[{start:c.start,end:c.end}];
      for(const u of occupied){for(let n=spans.length-1;n>=0;n--){const s=spans[n];if(!overlap(s,u))continue;spans.splice(n,1,...[{start:s.start,end:Math.min(s.end,u.start)},{start:Math.max(s.start,u.end),end:s.end}].filter(x=>x.end-x.start>defaults.epsilon));}}
      for(const span of spans) {
        const shotBudget = role==='explain' ? defaults.shotBudgets[c.shot_type                                     ] : undefined;
        const proposed={start:span.start,end:Math.min(span.end,span.start+(shotBudget??defaults.budgets[role]))};
        const speech=c.clip.segments.flatMap(s=>s.speech);
        const cut=snapToSpeech(proposed,speech,defaults.speechTolerance);
        if(!cut || cut.start<c.start || cut.end>c.end || used.some(u=>u.clip_id===c.clip_id&&overlap(u,cut)))continue;
        source={clip_id:c.clip_id,segment_id:c.segment_id,...cut};chosen=c;break;
      }
      if(chosen)break;
    }
    if(!source && role!=='cta' && role!=='conditions') {plan.gaps.push({role,reason:`${ROLE_LABELS[role]}に使える未使用の区間が足りません。`,handled_by:role==='consult'?'説明とまとめる':'撮り足し'});continue;}
    if(!source)plan.gaps.push({role,handled_by:'text_card',reason:`${ROLE_LABELS[role]}の素材がありません。文字カードで補う案を入れました。`,next_time:role==='cta'?`⑧ 案内・店内を${defaults.retakeShotSeconds}秒撮ると使えます。`:'説明を短く撮り足してください。'});
    const item=newItem(role,source,chosen,inputs,referenceIndex,defaults);
    if(chosen?.shot_type==='design_hands'&&role==='explain'&&zooms<defaults.zoom.maxPerPlan){item.edit.zoom={from:defaults.zoom.from,to:defaults.zoom.to};item.edit.note+='拡大は試験値。手元が切れないか確認。';zooms++;}
    if(source)used.push(source);
    plan.items.push(item);
  }
  if (!plan.items.some(i=>i.source)) {plan.items=[];plan.checks.errors.push('読み取れませんでした。構成に使える区間がありません。');return plan;}
  const timeline=computeTimeline(plan.items);plan.items=timeline.items;plan.total_out_seconds=timeline.total_out_seconds;
  for(const [i,item] of plan.items.entries()){item.slot=i+1;item.caption.show_from=item.output.start;item.caption.show_to=item.output.end;item.alternatives=pickAlternatives(item.role,eligibleAnalyses(analyses,inputs),used,defaults.alternativeCount);}
  plan.duration_note=durationNote(plan);
  plan.checks=verifyPlan(plan,analyses,inputs,referenceIndex,referenceIndex.hypotheses_ids);
  return plan;
}

/** 修正可能な内容は plan に反映する。内部矛盾は errors を返し、呼出側は案を表示しない。 */
function verifyPlan(plan      , analyses                , inputs               , index                , hypothesesIds          )         {
  const result        ={ok:false,fixes:[],needsCheck:[],warnings:[],errors:[]};
  const d=plan.defaults??DEFAULTS;
  const seen         =[];
  const kept           =[];
  let changed=false;
  const expected=()=>computeTimeline(plan.items);
  try{const t=expected();if(!same(t.total_out_seconds,plan.total_out_seconds)||t.items.some((i,n)=>!same(i.output.start,plan.items[n].output.start)||!same(i.output.end,plan.items[n].output.end)))result.errors.push('完成側の時間と累計が一致しません。');}catch{result.errors.push('速度・区間・静止時間の計算が不正です。');}
  for(const item of plan.items){
    let clip                       ;
    let segment                  ;
    if(item.source){
      const s=item.source;clip=analyses.find(c=>c.clip_id===s.clip_id);
      if(!clip||!finite(s.start)||!finite(s.end)||s.start<0||s.start>=s.end||s.end>clip.duration){result.errors.push(`場面${item.slot}の元区間が素材範囲外です。`);kept.push(item);continue;}
      segment=clip.segments.find(x=>(!s.segment_id||x.id===s.segment_id)&&x.start<=s.start+d.epsilon&&x.end>=s.end-d.epsilon);
      if(segment)s.segment_id=segment.id;
      if(!segment){result.errors.push(`場面${item.slot}の解析区間がありません。`);kept.push(item);continue;}
      if(clip.status==='failed'){result.fixes.push('読めなかった素材を案から外しました。');plan.gaps.push({clip_id:clip.clip_id,reason:'読めなかった素材です。'});changed=true;continue;}
      if(clip.clip_flags.multiple_customers_suspected || inputs.visibility==='customer_face_ng'&&segment.who_visible==='customer_face'||inputs.visibility==='no_customer'&&['customer_face','customer_partial'].includes(segment.who_visible)) {result.fixes.push('映り方の指定に合わない区間を外しました。');plan.gaps.push({clip_id:clip.clip_id,reason:'顔を出さない案では素材が足りません。映り方を確認してください。'});changed=true;continue;}
      if(item.role==='finish'&&(segment.camera.dark||segment.camera.blurry||!segment.camera.stable)){result.fixes.push('暗い・ブレ・ピントの懸念がある仕上がり区間を外しました。');changed=true;continue;}
      const speech=clip.segments.flatMap(s=>s.speech);
      const snapped=snapToSpeech(s,speech,d.speechTolerance);
      if(!snapped||snapped.start<segment.start||snapped.end>segment.end){result.fixes.push('発話の意味を保てない区間を外しました。');changed=true;continue;}
      if(!same(s.start,snapped.start)||!same(s.end,snapped.end)){item.source=snapped;changed=true;result.fixes.push('発話の切れ目まで区間を延ばしました。');}
      if(seen.some(u=>u.clip_id===s.clip_id&&overlap(u,item.source )))result.errors.push('同じ元素材の区間が重複しています。');seen.push(item.source );
      item.shot_type=segment.shot_type;item.who_visible=segment.who_visible;
      if(!speech.length&&!clip.clip_flags.silent)item.needs_check.push('発話の読み取りがありません。音声を再生して確認してください。');
    }
    if(item.still){const s=item.still;if(s.kind!=='text_card'){
      const c=analyses.find(c=>c.clip_id===s.clip_id);
      const frame=c?.segments.find(x=>finite(s.at)&&x.start<=s.at&&s.at<x.end);
      if(!c||!finite(s.at)||s.at<0||s.at>=c.duration||c.status==='failed'||!frame){result.errors.push('静止画の元フレームが不正です。');}
      else if(c.clip_flags.multiple_customers_suspected||inputs.visibility==='customer_face_ng'&&frame.who_visible==='customer_face'||inputs.visibility==='no_customer'&&['customer_face','customer_partial'].includes(frame.who_visible)||item.role==='finish'&&(frame.camera.dark||frame.camera.blurry||!frame.camera.stable)){
        result.fixes.push('静止フレームも映り方と撮影状態を確認し、使えない場面を外しました。');changed=true;continue;
      }else{item.who_visible=frame.who_visible;item.shot_type=frame.shot_type;}
    }}
    const r=item.reference;
    if(r){const canonical=index.entries.find(e=>e.id===r.id);if(!canonical||canonical.source_sha256!==r.source_sha256||canonical.code!==r.code||!same(canonical.start,r.start)||!same(canonical.end,r.end)||canonical.role!==item.role||r.hypotheses.some(h=>!hypothesesIds.includes(h))||canonical.hypotheses.some(h=>!hypothesesIds.includes(h))){item.reference=null;result.fixes.push('参考の一致を確認できないため、参考なしにしました。');}else{item.reference={...canonical,difference:r.difference??'撮影条件・症例・尺が異なります。',baseline_note:canonical.baseline?'直近3か月の投稿ではありません':''};}}
    kept.push(item);
  }
  plan.items=kept;
  if(changed){try{const t=computeTimeline(kept);plan.items=t.items;plan.total_out_seconds=t.total_out_seconds;}catch{result.errors.push('修正後の時間を計算できません。');}}
  let zooms=0;
  for(const [i,item] of plan.items.entries()){
    item.slot=i+1;
    const length=item.output.end-item.output.start;
    let text=item.caption.lines.join('');
    item.warnings=[];
    delete item.caption.ad_alternative;
    delete item.caption.concrete_alternative;
    const clip=analyses.find(c=>c.clip_id===item.source?.clip_id);
    const speeches=clip?.segments.flatMap(s=>s.speech).filter(s=>item.source&&overlap(s,item.source))??[];
    if(item.caption.source==='speech'&&!speeches.some(s=>validQuote(text,s))){text=bank(item.role,inputs);item.caption.source='bank';result.fixes.push('元の発話にない引用字幕を定型に差し替えました。');}

    if(dangerous(text)||outputBanned(text)||item.caption.source==='new'&&/[「」『』]/.test(text)){text=bank(item.role,inputs);item.caption.source='bank';result.fixes.push('A層の字幕を定型に差し替えました。');}
    let lines=fitCaption(text,length,d);
    if(!lines.length&&text){lines=fitCaption(bank(item.role,inputs),length,d);if(!lines.length){const short                    ={opening:'眉のお悩みは？',consult:'希望を確認',explain:'形を相談',finish:'眉を確認',conditions:'個人差があります',cta:'相談はプロフィールへ'};lines=fitCaption(short[item.role],length,d);}result.fixes.push('読める長さに合わせて字幕を短縮しました。');}
    const captionText=lines.join('');
    const reasons         =[];
    if(speeches.some(s=>s.speaker!=='staff'))reasons.push('お客様の感想・反応、または話者不明の声');
    if(CAUTION_PHRASES.some(word=>captionText.includes(word)))reasons.push('体験談・強い言葉');
    if(PRICE.test(captionText.normalize('NFKC')))reasons.push('料金の数字');
    if(/施術前後|ビフォーアフター|before.*after/i.test(captionText)||
      plan.items.some(x=>analyses.find(c=>c.clip_id===x.source?.clip_id)?.segments.some(s=>x.source&&overlap(s,x.source)&&s.timing==='before'))&&
      clip?.segments.some(s=>item.source&&overlap(s,item.source)&&s.timing==='after'))reasons.push('施術前後の比較');
    if(reasons.length){
      item.warnings.push('広告に流用する時は見直す（'+reasons.join('・')+'）。');
      if(inputs.for_ads)item.warnings.push('広告に使う前に文言を確認してください。');
      if(d.strictness!=='loose')item.warnings.push('確認する内容：'+reasons.join('・')+'。');
      if(d.strictness==='strict')item.warnings.push('掲載の同意・撮影条件・表記の事実を再確認してください。');
      if(inputs.for_ads&&d.strictness!=='loose')item.caption.ad_alternative=bank(item.role,inputs);
      if(d.strictness==='strict'){lines=fitCaption(bank(item.role,inputs),length,d);item.caption.source='bank';result.fixes.push('確認対象の字幕を定型に差し替えました。');}
    }
    if(captionText.includes('垢抜け'))item.caption.concrete_alternative='眉の形・色を相談';
    result.warnings.push(...item.warnings.map(w=>`場面${item.slot}：${w}`));
    item.caption.lines=lines;item.caption.show_from=item.output.start;item.caption.show_to=item.output.end;
    if(['customer_face','customer_partial'].includes(item.who_visible))item.caption.position='top';
    if(item.edit.zoom){
      const z=item.edit.zoom;
      if(!finite(z.from)||!finite(z.to)||z.from<=0||z.to<=0||zooms>=d.zoom.maxPerPlan||z.to>=d.zoom.closeOnlyThreshold&&(item.shot_type!=='brow_close'||length>d.shotBudgets.brow_close)){
        item.edit.zoom=null;result.fixes.push('拡大の回数・対象・長さを確認し、固定に戻しました。');
      }else zooms++;
    }
    if(i>=d.consecutiveShotLimit-1&&plan.items.slice(i-d.consecutiveShotLimit+1,i+1).every(x=>x.shot_type===item.shot_type))item.needs_check.push('同じ構図が3場面続きます。別の構図を挟むか順番を調整してください。');
    item.needs_check=[...new Set(item.needs_check)];result.needsCheck.push(...item.needs_check);
  }
  for(const c of analyses.filter(c=>c.status==='failed'))if(!plan.gaps.some(g=>g.clip_id===c.clip_id&&g.reason?.includes('読めなかった')))plan.gaps.push({clip_id:c.clip_id,reason:'読めなかった素材です。'});
  if(!plan.items.length)result.errors.push('使える場面がないため案を表示できません。');
  plan.duration_note=durationNote(plan);
  // 自由記述を含む表示文字列も検査。参照URL/IDなどの識別子は書き換えず、異常なら表示不可。
  const walk=(value        ,key='')        =>{if(key==='caption')return value;if(typeof value==='string'){if(!/^(?:id|clip_id|video|poster|source_sha256|code)$/.test(key))return clean(value);OUTPUT_BANNED.lastIndex=0;if(OUTPUT_BANNED.test(value))result.errors.push('識別子に使用できない文字列があります。');return value;}if(Array.isArray(value))return value.map(v=>walk(v,key));if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,walk(v,k)]));return value;};
  const cleaned=walk({items:plan.items,gaps:plan.gaps,duration_note:plan.duration_note})                                             ;
  // 場面オブジェクトの参照を保つ（呼出側で選択中の場面も同時に更新する）。
  plan.items.forEach((item,i)=>Object.assign(item,cleaned.items[i]));plan.gaps=cleaned.gaps;plan.duration_note=cleaned.duration_note;
  result.needsCheck=[...new Set(result.needsCheck.map(clean))];result.fixes=[...new Set(result.fixes.map(clean))];result.errors=[...new Set(result.errors.map(clean))];result.ok=result.errors.length===0;
  plan.checks=result;
  return result;
}

function formatCapcutMemo(plan      , clips                )         {
  if(!plan.checks.ok)return '案を表示できません。素材と区間を確認してください。';
  const lines=['CapCut で、この順番に並べてください。',...(clips.length&&clips.every(c=>c.model==='mock-no-api')?['ローカル模擬版。素材のAI読み取りは行っていません。']:[]),`約${seconds(plan.total_out_seconds)}秒｜${TEMPLATE_LABELS[plan.template]}`,
    '1. 素材を順に読み込む：'+plan.items.map(i=>i.source?clips.find(c=>c.clip_id===i.source?.clip_id)?.original_name??i.source.clip_id:'文字カード').join(' → '),
    `2. 各クリップの残す区間（前後を${(plan.defaults??DEFAULTS).trimStep}秒多めに残して、あとで詰める）`];
  for(const i of plan.items){
    const s=i.source;
    lines.push(`\n場面${String(i.slot).padStart(2,'0')} ${ROLE_LABELS[i.role]}`,
      s?`元の秒数：${clips.find(c=>c.clip_id===s.clip_id)?.original_name??s.clip_id} ${seconds(s.start)}〜${seconds(s.end)}秒（丸め前 ${s.start}〜${s.end}）`:`元の秒数：${i.still?.kind==='text_card'?'文字カード・元素材なし':`静止フレーム ${i.still?.clip_id} ${i.still?.at}秒`}（丸め前 hold=${i.still?.hold}）`,
      `配置の目安：${seconds(i.output.start)}〜${seconds(i.output.end)}秒（丸め前 ${i.output.start}〜${i.output.end}）`,
      `速度：${i.speed}倍${i.still?`／表示 ${i.still.hold}秒`:''}`,
      `3. 字幕案：${i.caption.lines.join(' ／ ')||'なし（この短い場面に文字を詰めない）'}｜${i.caption.lines.length}行｜${i.caption.position==='top'?'上':i.caption.position==='center'?'中央':'中央下'}｜完成側 ${seconds(i.caption.show_from)}〜${seconds(i.caption.show_to)}秒（丸め前 ${i.caption.show_from}〜${i.caption.show_to}）`,
      `4. ズーム：${i.edit.zoom?`${i.edit.zoom.from}→${i.edit.zoom.to}%（試験値）`:'固定'}。${i.edit.note}`,
      `音声：${i.edit.audio==='mute'?'元音声をミュート。':'実際に再生して確認'}`,
      i.reference?`参考：${i.reference.code} ${seconds(i.reference.start)}〜${seconds(i.reference.end)}秒。参考にする点：${i.reference.point}／今回との違い：${i.reference.difference}／予約増加は未検証。${i.reference.baseline_note??''}`:'参考なし・新しい仮説',
      ...(i.caption.ad_alternative?['広告用の別文言案：'+i.caption.ad_alternative]:[]),
      ...(i.caption.concrete_alternative?['具体化の案：'+i.caption.concrete_alternative]:[]),
      ...i.warnings.map(s=>'確認の印：'+s),
      ...i.needs_check.map(s=>'要確認：'+s));
  }
  lines.push('\n5. 最後：黒い余白を残さない。書き出し前に最後のフレームまで確認。',plan.duration_note,...plan.gaps.map(g=>`補足：${g.reason??''}${g.next_time??''}`),'秒数・倍率・文字数は試験値です。予約増加・未知素材での判断精度は未検証です。');
  return clean(lines.join('\n'));
}



function authorize(member                    , resource                    )          {
  return !!member?.is_active && (member.role === 'owner' || member.role === 'staff' && member.store_id === resource.store_id);
}
function requireUuid(value         )         {
  if(typeof value !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) throw new Error('識別子が不正です');
  return value.toLowerCase();
}
function advanceState(status           , event        , locked         )            {
  if(locked) throw new Error('この回は処理中です');
  if(event === 'error') return 'failed';
  const next                            = {'uploaded:begin':'transferring','transferring:uploaded':'waiting','waiting:PROCESSING':'waiting','waiting:ACTIVE':'analyzing','analyzing:valid':'analyzed','analyzed:deleted':'cleanup'};
  const result=next[`${status}:${event}`];if(!result)throw new Error('工程の順序が不正です');return result;
}
function budgetStatus(cost        , warn       =DEFAULTS.monthlyCapWarnJpy, stop       =DEFAULTS.monthlyCapStopJpy) {
  if(![cost,warn,stop].every(finite)||cost<0||warn<0||stop<=warn)throw new Error('費用設定が不正です');
  return cost>=stop ? {level:'stop',message:'今月の解析枠を使い切りました'} : cost>=warn ? {level:'warn',message:'今月の解析費用が注意の目安に達しました'} : {level:'ok',message:''};
}
function retentionUntil(now        , days       =DEFAULTS.retentionDaysOriginals)         {
  if(!Number.isInteger(days)||days<=0||!Number.isFinite(Date.parse(now)))throw new Error('保持期間が不正です');
  return new Date(Date.parse(now)+days*86400000).toISOString();
}
function uploadPath(member             , session                             , clipId       )         {
  if(!authorize(member,session))throw new Error('この店舗にはアクセスできません');
  return [session.store_id,session.id,clipId].map(requireUuid).join('/');
}
function validateSessionInputs(value         , now        , draft = false)                {
  const v=value                 ;
  if(!v||!Array.isArray(v.worries)||(!draft&&v.worries.length<1)||v.worries.length>DEFAULTS.maxWorries||v.worries.filter(w=>w?.primary===true).length!==(draft&&v.worries.length===0?0:1)||v.worries.some(w=>!w||!WORRIES.some(k=>k[0]===w.key)||typeof w.primary!=='boolean')||new Set(v.worries.map(w=>w.key)).size!==v.worries.length||!['customer_face_ok','customer_face_ng','no_customer'].includes(v.visibility)||v.for_ads!==undefined&&typeof v.for_ads!=='boolean')throw new Error('悩みと映り方を確認してください');
  return {worries:v.worries.map(w=>({key:w.key,primary:w.primary})),visibility:v.visibility,for_ads:v.for_ads??false,selected_at:new Date(now).toISOString()};
}

function validateClipInput(value         )            {
  const v=value             ;
  if(!v||typeof v.sha256!=='string'||!/^[a-f0-9]{64}$/.test(v.sha256)||!finite(v.duration)||v.duration<=0||v.duration>DEFAULTS.maxClipSeconds||![v.width,v.height,v.size_bytes].every(x=>Number.isSafeInteger(x)&&x>0)||v.size_bytes>DEFAULTS.maxClipBytes||!DEFAULTS.videoMimeTypes.includes(v.mime_type))throw new Error('素材の形式・長さ・容量を確認してください');
  return {sha256:v.sha256,duration:v.duration,width:v.width,height:v.height,size_bytes:v.size_bytes,mime_type:v.mime_type};
}
// AI の時刻・付帯項目の小さな揺れを直す。実測の長さ（端末で計った duration）を正とする。
// 許容差を超えるズレは直さずに残し、下の検査で failed にする。
function normalizeGeminiAnalysis(value         , clipId        , duration        )          {
  const v = value                           ;
  if (!v || typeof v !== 'object' || !finite(duration) || duration <= 0) return v;
  const tol = DEFAULTS.analysisOverrunSeconds;
  const near = (n         )              => finite(n) && n >= -tol && n <= duration + tol;
  const clamp = (n        , lo        , hi        ) => Math.min(Math.max(n, lo), hi);
  const segments = Array.isArray(v.segments) ? (v.segments                             ).map(seg => {
    if (!seg || typeof seg !== 'object' || !near(seg.start) || !near(seg.end)) return seg;
    const start = clamp(seg.start, 0, duration), end = clamp(seg.end, 0, duration);
    const speech = Array.isArray(seg.speech) ? (seg.speech                             ).flatMap(p => {
      if (!p || typeof p !== 'object' || !near(p.start) || !near(p.end)) return [p];
      const q                          = { ...p, start: clamp(p.start, start, end), end: clamp(p.end, start, end) };
      if (finite(p.confidence)) q.confidence = clamp(p.confidence, 0, 1);
      return (q.start          ) < (q.end          ) ? [q] : [];
    }) : seg.speech;
    return { ...seg, start, end, speech, retake_of: seg.retake_of ?? null };
  }).filter(seg => !seg || typeof seg !== 'object' || !finite(seg.start) || !finite(seg.end) || seg.start < seg.end) : v.segments;
  // clip_id・model・usage は呼び出し側が実値で上書きするので、AI の書いた値は使わない。
  return { ...v, clip_id: clipId, duration, segments, model: '', usage: { input_tokens: 0, output_tokens: 0 } };
}
function validateGeminiAnalysis(json        , clipId       , duration       )               {
  let step = 'json';
  try {
    const raw = JSON.parse(json); step = 'structure';
    const c=parseAnalyses(JSON.stringify([normalizeGeminiAnalysis(raw, clipId, duration)]))[0]; step = 'clip';
    if(c.clip_id!==clipId||!finite(c.duration)||c.duration<=0||c.duration>duration+DEFAULTS.speechTolerance||!finite(duration)||!c.segments.length||c.status==='failed'||typeof c.model!=='string'||!c.usage||![c.usage.input_tokens,c.usage.output_tokens].every(x=>Number.isSafeInteger(x)&&x>=0))throw 0;
    step = 'flags';
    if(![c.clip_flags.silent,c.clip_flags.multiple_customers_suspected,c.clip_flags.text_burned_in].every(x=>typeof x==='boolean')||c.worry_candidates.some(w=>!WORRIES.some(k=>k[0]===w.key)||typeof w.evidence!=='string'))throw 0;
    for(const s of c.segments){
      step = 'segment_range';
      if(s.start<0||s.end<=s.start||s.end>Math.min(c.duration,duration)||![s.camera.stable,s.camera.dark,s.camera.blurry].every(x=>typeof x==='boolean')||typeof s.notes!=='string'||!(s.retake_of===null||typeof s.retake_of==='string'))throw 0;
      step = 'speech_range';
      if(s.speech.some(p=>p.start<s.start||p.end>s.end||p.confidence!==undefined&&(!finite(p.confidence)||p.confidence<0||p.confidence>1)))throw 0;
    }
    return {...c,status:'analyzed'};
  }catch{return {clip_id:clipId,duration,status:'failed',error:`読み取り結果の形式を確認できませんでした（${step}）`,segments:[],clip_flags:{silent:false,multiple_customers_suspected:false,text_burned_in:false},worry_candidates:[],model:'',usage:{input_tokens:0,output_tokens:0}};}
}
function applyCaptions(plan      , value         )       {
  const items=(value                                                            )?.items;
  if(!Array.isArray(items)||items.length!==plan.items.length||items.some(i=>!i||!Array.isArray(i.lines)||i.lines.length>CAPTION_LIMITS.maxLines||i.lines.some(l=>typeof l!=='string'||l.length>256)||!['speech','bank','new'].includes(i.source)))throw new Error('字幕の形式を確認できませんでした');
  return {...plan,items:plan.items.map((item,n)=>({...item,caption:{...item.caption,lines:items[n].lines,source:items[n].source==='speech'?'speech':'new'}}))};
}
function estimateCost(input       ,output       )        {
  if(![input,output].every(x=>Number.isSafeInteger(x)&&x>=0))throw new Error('使用量が不正です');
  return (input*DEFAULTS.inputUsdPerMillion+output*DEFAULTS.outputUsdPerMillion)*DEFAULTS.usdJpy/1e6;
}

window.VIDEO_COACH={DEFAULTS,CAPTION_LIMITS,FORBIDDEN_PHRASES,CAUTION_PHRASES,ROLE_LABELS,TEMPLATE_LABELS,WORRIES,seconds,parseAnalyses,endsWithContinuation,snapToSpeech,eligibleAnalyses,pickTemplate,pickAlternatives,linkReference,computeTimeline,buildPlan,verifyPlan,formatCapcutMemo,authorize,requireUuid,advanceState,budgetStatus,retentionUntil,uploadPath,validateSessionInputs,validateClipInput,normalizeGeminiAnalysis,validateGeminiAnalysis,applyCaptions,estimateCost};
})();
