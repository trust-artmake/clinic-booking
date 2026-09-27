'use strict';
(() => {
  if(!new URLSearchParams(location.search).has('mock')){window.startVideoCoachLive();return;}
  const L=window.VIDEO_COACH,D=window.VIDEO_COACH_DATA;
  const params=new URLSearchParams(location.search);
  const mode=params.get('mock')||'full';
  const fixture=structuredClone(D.fixtures[mode]||D.fixtures.full), analyses=L.parseAnalyses(JSON.stringify(fixture.analyses));
  const app=document.getElementById('app'),primary=document.getElementById('primary');
  const $=id=>document.getElementById(id);
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fmt=L.seconds;
  // ローカル模擬版の画面確認用。本物のログイン状態や権限は作らない。
  const previewHome=location.protocol==='file:'&&Object.hasOwn(D.fixtures,params.get('mock'))&&params.get('preview')==='home';
  let screen=0,auth=previewHome?'ready':'email',selected=false,inputs={for_ads:false,...fixture.inputs,worries:[]},plan=null;
  const liveClient=window.VIDEO_COACH_AUTH_CLIENT;
  let loginEmail='';
  let notifyTimer;
  const storageKey='video-coach-phase-a:'+mode;
  function notify(message){$('notice').textContent=message;$('notice').style.display='block';clearTimeout(notifyTimer);notifyTimer=setTimeout(()=>$('notice').style.display='none',5000);}
  function saveDraft(){try{sessionStorage.setItem(storageKey,JSON.stringify({selected,inputs,plan}));}catch{notify('下書きを保存できませんでした。この画面のメモを保存してください。');}}
  function head(step,title){return `${step?'<button class="back" data-action="back">‹ 戻る</button>':''}<ol class="steps" aria-label="進み具合">${['素材を入れる','今日のお客様','おすすめの構成','CapCutで編集'].map((t,i)=>`<li class="${i+1===step?'active':''}">${esc(t)}</li>`).join('')}</ol><p class="eyebrow">${step?'STEP '+String(step).padStart(2,'0'):'YOUR VIDEO NOTE'}</p><h1>${esc(title)}</h1>`;}
  function setPrimary(label,detail,disabled=false){primary.textContent=label;primary.disabled=disabled;$('step-label').textContent=detail;}
  function move(next){closePlayer();screen=next;render();window.scrollTo(0,0);app.focus({preventScroll:true});}
  function render(){
    if(screen===0){
      if(auth==='email'){
        app.innerHTML='<p class="eyebrow">WELCOME / LOCAL PREVIEW</p><h1>動画づくりに、<br>迷わない時間を。</h1><p class="muted">今日の素材と、お客様の悩みから。<br>地域の方へ伝わる1本を、一緒に組み立てます。</p><div class="intro-art" aria-hidden="true"><span>a little direction.</span></div><label class="form-label" for="email">メールアドレスを入れてください</label><input id="email" type="email" autocomplete="off" placeholder="demo@example.invalid"><div class="login-note">操作確認用の入口です。メールは送信しません。架空のアドレスでお試しください。</div>';
        if(liveClient)app.querySelector('.login-note').textContent='登録済みのメールアドレスへコードを送ります。';
        setPrimary('入る',liveClient?'ログイン 1 / 2':'模擬ログイン 1 / 2');
      }else if(auth==='code'){
        app.innerHTML='<button class="back" data-action="email">‹ 戻る</button><p class="eyebrow">LOCAL PREVIEW</p><h1>メールに届いた6桁のコードを入れてください</h1><div class="login-note">模擬ログインです。メールは送信されていません。任意の6桁（例：123456）で進めます。</div><label class="form-label" for="code">6桁のコード</label><input id="code" class="code" type="text" inputmode="numeric" maxlength="6" autocomplete="off" placeholder="123456">';
        if(liveClient)app.querySelector('.login-note').textContent='メールに届いたコードでログインしてください。';
        $('code').maxLength=L.DEFAULTS.codeDigits;setPrimary('入る','模擬ログイン 2 / 2');
      }else{
        app.innerHTML='<p class="eyebrow">A NOTE FOR YOUR NEXT VIDEO</p><h1>今日の素材から、<br>1本の案をつくります。</h1><div class="intro-art" aria-hidden="true"><span>from a scene, to a story.</span></div><p class="identity">'+esc(fixture.member.display_name)+'｜'+esc(fixture.member.store_label)+'</p><p>まずは、地域のお客様の予約へ。<br>悩みをひとつ選ぶと、使う場面と順番の案が出ます。</p><div class="note-panel">素材と案は、同じ店舗の担当者と仁義さんだけが見られます。元の動画・サムネ・文字起こしは7日で消えます。</div><div class="note-panel">匿名の模擬データで操作を試せます。実際の素材送信・AI解析・7日後の自動削除は未接続です。下書きはこのタブ内だけに保存します。</div><div class="links"><a href="'+esc(D.guide)+'">使い方を見る（見本）</a><button class="link-button" data-action="draft">前回の下書き</button></div>';
        setPrimary('素材を入れる ＋','地域のお客様の予約を、最初の目的に');
      }
    }else if(screen===1){
      app.innerHTML=head(1,'今日撮った動画を、まとめて選んでください。')+'<p class="muted">使う場面や秒数は、あとでAIが探します。</p><p class="muted">掲載同意のあるお客様の素材だけ入れてください。</p><div class="note-panel">この版では、ボタンを押すと匿名の模擬素材を選びます。表示する読み取り結果は固定のテストデータです。</div>'+(selected?'<ul class="clip-list">'+analyses.map((c,i)=>'<li><span class="clip-icon">'+esc(String(i+1).padStart(2,'0'))+'</span><div class="clip-info"><strong>'+esc(c.original_name)+'</strong><small>'+esc(fmt(c.duration))+'秒 · 模擬素材</small>'+(c.status==='failed'?'<small>'+esc(c.error)+'</small>':'')+'</div><span class="status-pill '+(c.status==='failed'?'failed':'')+'">'+(c.status==='failed'?'読めませんでした':'読めました')+'</span></li>').join('')+'</ul>':'<div class="upload-card"><span class="upload-symbol">＋</span><p>短い動画も、迷っている素材も。</p><span class="muted">模擬素材 '+esc(analyses.length)+'本を一緒に選択します</span></div>')+'<p class="muted">今は '+esc(L.DEFAULTS.maxClips)+'本・1本'+esc(L.DEFAULTS.maxClipSeconds/60)+'分まで（試作の目安）</p><details><summary>実際の送信画面について</summary><p>通信・送信再開・形式変換はフェーズBで確認します。この画面では素材を送信しません。</p></details>';
      setPrimary(selected?'次へ：今日のお客様':'写真アプリから選ぶ',selected?`模擬素材 ${analyses.length}本を選択済み`:'ローカルの模擬素材で試します');
    }else if(screen===2){
      const groups=[...new Set(L.WORRIES.map(w=>w[2]))];
      app.innerHTML=head(2,'今日のお客様の悩みは？')+'<p class="muted">1つ選ぶ。あれば2つまで追加できます。<br>最初に押した悩みを、今回の主役にします。</p>'+groups.map(group=>'<section class="worry-group"><span class="group-label">'+esc(group)+'</span><div class="chips">'+L.WORRIES.filter(w=>w[2]===group).map(w=>{const chosen=inputs.worries.find(x=>x.key===w[0]);return '<button type="button" class="chip" data-action="worry" data-key="'+esc(w[0])+'" aria-pressed="'+Boolean(chosen)+'">'+esc(w[1])+(chosen?'<small>'+ (chosen.primary?'主役の悩み':'追加の悩み')+'</small>':'')+(analyses.some(c=>c.worry_candidates.some(x=>x.key===w[0]))?'<small>音声で聞こえました（模擬）</small>':'')+'</button>';}).join('')+'</div></section>').join('')+(inputs.worries.some(w=>w.key==='other')?'<label class="form-label" for="other">ひとこと・任意（氏名などは入れないでください）</label><textarea id="other" rows="2">'+esc(inputs.other||'')+'</textarea>':'')+'<p class="selection-note">選択中 '+esc(inputs.worries.length)+' / '+esc(L.DEFAULTS.maxWorries)+'。選んだ項目をもう一度押すと外せます。</p><fieldset><legend>お客様の映り方は？</legend>'+[['customer_face_ok','お客様の顔を出してよい（掲載の同意あり）'],['customer_face_ng','顔は出さない（眉・手元・後ろ姿まで）'],['no_customer','お客様は映っていない（スタッフの実演・説明）']].map(([value,label])=>'<label class="radio-row"><input type="radio" name="visibility" value="'+esc(value)+'" '+(inputs.visibility===value?'checked':'')+'><span>'+esc(label)+'</span></label>').join('')+'<p class="muted">掲載同意のある素材だけを使用してください。「顔は出さない」は見せ方の指定です。</p></fieldset><label class="ads-toggle"><input id="for-ads" type="checkbox" role="switch" '+(inputs.for_ads?'checked':'')+'><span>この動画は広告にも使う<small>任意・広告に使う時の確認を追加します</small></span></label>';
      setPrimary('おすすめの構成を見る','主役の悩みを1つ選んで進みます',!inputs.worries.length);
    }else if(screen===3){renderPlan();}else if(screen===4){renderMemo();}
  }
  function itemMarkup(i,n){
    const name=i.source?analyses.find(c=>c.clip_id===i.source.clip_id)?.original_name:'文字カード';
    return '<article class="scene" data-source-key="'+esc(i.source?i.source.clip_id+':'+i.source.segment_id+':'+i.source.start+':'+i.source.end:'card:'+i.role)+'" data-scene="'+n+'"><div class="scene-head"><span class="scene-number">'+esc(String(n+1).padStart(2,'0'))+'</span><div><strong>'+esc(L.ROLE_LABELS[i.role])+'</strong><small>完成 '+esc(fmt(i.output.start))+'–'+esc(fmt(i.output.end))+'秒</small></div></div><div class="scene-body"><p class="source-line">'+esc(name)+(i.source?' · '+esc(fmt(i.source.start))+'–'+esc(fmt(i.source.end))+'秒':' · '+esc(fmt(i.still.hold))+'秒')+'</p><p class="caption-preview">'+(i.caption.lines.length?i.caption.lines.map(esc).join('<br>'):'<span class="muted">この短い場面に文字を詰めない</span>')+'</p>'+(i.caption.ad_alternative?'<p class="ad-alternative">広告用の別文言案：'+esc(i.caption.ad_alternative)+'</p>':'')+(i.caption.concrete_alternative?'<p class="muted">具体化の案：'+esc(i.caption.concrete_alternative)+'</p>':'')+'<p class="edit-line">編集：'+esc(i.edit.zoom?i.edit.zoom.from+'→'+i.edit.zoom.to+'%の拡大（試験値）':'固定')+'。字幕は'+esc(i.caption.position==='top'?'上側':'中央より下')+'</p>'+(i.warnings.length?'<span class="warning-mark" aria-label="確認事項あり">● 確認の印</span>':'')+'<div class="scene-actions"><button data-action="play" data-index="'+n+'">▶この場面</button><button data-action="reference" data-index="'+n+'" '+(!i.reference?'disabled':'')+'>参考を見る</button><button data-action="alternatives" data-index="'+n+'">別の候補</button><button data-action="details" data-index="'+n+'" aria-expanded="false">詳しく</button></div>'+(!i.reference?'<small class="muted">参考なし・新しい仮説</small>':'')+'</div><div id="alternatives-'+n+'" class="alternatives"></div><div id="details-'+n+'" class="scene-more"><dl><dt>確認の理由</dt><dd>'+esc(i.warnings.join(' ／ ')||'追加の警告はありません。')+'</dd><dt>観測事実（模擬入力）</dt><dd>'+esc(i.why.observation)+'</dd><dt>予約への狙い（仮説）</dt><dd>'+esc(i.why.booking_aim)+'</dd><dt>拡散への狙い（仮説）</dt><dd>'+esc(i.why.reach_aim)+'</dd><dt>参照仮説ID</dt><dd>'+esc(i.reference?.hypotheses.join('・')||'なし')+'</dd><dt>未確認事項</dt><dd>'+esc(i.needs_check.join(' ／ ')||'実際の映像との照合・予約増加は未確認です。')+'</dd></dl><p>'+esc(i.edit.note)+'</p>'+(i.source?'<p>元の秒数を少し直す（発話の切れ目を優先）</p><div class="adjust">'+[['start',-1,'開始 −'],['start',1,'開始 ＋'],['end',-1,'終了 −'],['end',1,'終了 ＋']].map(([edge,sign,label])=>'<button data-action="trim" data-index="'+n+'" data-edge="'+edge+'" data-sign="'+sign+'">'+esc(label+L.DEFAULTS.trimStep+'秒')+'</button>').join('')+'</div>':'')+'<p>順番を入れ替える</p><div class="adjust"><button data-action="reorder" data-index="'+n+'" data-sign="-1" '+(n===0?'disabled':'')+'>上へ ↑</button><button data-action="reorder" data-index="'+n+'" data-sign="1" '+(n===plan.items.length-1?'disabled':'')+'>下へ ↓</button></div></div></article>';
  }
  function renderPlan(){
    if(!plan?.checks.ok){app.innerHTML=head(3,'読み取れませんでした')+'<div class="warning">'+esc(plan?.checks.errors.join(' ／ ')||'素材を確認してください。')+'</div>';setPrimary('素材を選び直す','使える区間を確認してください');return;}
    const worry=L.WORRIES.find(w=>w[0]===inputs.worries.find(w=>w.primary)?.key)?.[1]||'選択した悩み';
    app.innerHTML=head(3,'おすすめの構成')+'<div class="summary-card"><div class="summary-numbers">約'+esc(fmt(plan.total_out_seconds))+'<small>秒・'+esc(plan.items.length)+'場面</small></div><div class="type-control"><span>'+esc(L.TEMPLATE_LABELS[plan.template])+'</span><button class="link-button" data-action="show-types">変える</button></div><div id="type-chooser" class="type-chooser">'+[['consult_flow','相談からデザイン・眉の確認へ'],['case_intro','症例の説明と撮影条件を先に'],['explain','スタッフの説明と手元を中心に']].map(([t,d])=>'<button data-action="template" data-template="'+esc(t)+'">'+esc(L.TEMPLATE_LABELS[t])+'<small>'+esc(d)+'</small></button>').join('')+'</div><p class="muted">今日の悩み：'+esc(worry)+'</p></div>'+(plan.duration_note?'<div class="note-panel">'+esc(plan.duration_note)+'</div>':'')+plan.items.map(itemMarkup).join('')+plan.gaps.map(g=>'<div class="gap">'+esc((g.clip_id?g.clip_id+'：':'')+(g.reason||'')+(g.next_time||''))+'</div>').join('')+'<details><summary>この案の根拠と限界</summary><p>模擬入力から、決まった手順で構成しています。秒数・文字数・倍率は試験値です。素材のAI判断と実際の予約増加は未検証です。</p><p>'+esc(plan.checks.fixes.join(' ／ '))+'</p></details><button class="link-button" data-action="restart">やり直す（悩みから）</button>';
    setPrimary('この案で編集する','字幕案と使う区間を、CapCutのメモに');
  }
  function renderMemo(){
    app.innerHTML=head(4,'CapCut で、この順番に並べてください。')+'<p class="muted">元素材から残す秒数と、完成動画に置く位置を分けて記載しています。</p><button data-action="copy">このメモをコピー</button><pre id="memo" class="memo">'+esc(L.formatCapcutMemo(plan,analyses))+'</pre><details><summary>参考にした遠山さんの場面（一覧）</summary><div class="reference-list">'+plan.items.map((i,n)=>i.reference?'<p>場面'+esc(n+1)+' · '+esc(i.reference.code)+' '+esc(fmt(i.reference.start))+'–'+esc(fmt(i.reference.end))+'秒<br><button data-action="reference" data-index="'+n+'">参考を見る</button></p>':'').join('')+'</div></details><details><summary>この案の根拠と限界</summary><p>参考は編集・構成の観察例です。予約増加は未検証です。参考動画の字幕や発話は引用していません。実素材のAI読み取り・店舗別権限・外部保存は次のフェーズです。</p></details><section id="feedback" class="feedback"><p class="finished">メモの保存を開始しました。端末のダウンロード先をご確認ください。</p><h2>この案、使えそう？</h2>'+['そのまま使う','少し直して使う','使わない'].map(x=>'<button data-action="feedback" data-verdict="'+esc(x)+'">'+esc(x)+'</button>').join('')+'<label class="form-label" for="feedback-note">理由は任意のひとこと</label><textarea id="feedback-note" rows="2" placeholder="このタブの中だけに保存します"></textarea><p id="feedback-result" role="status"></p></section>';
    setPrimary('メモを保存して終わる','テキストファイルとして端末に保存します');
  }
  function validate(next){
    try{const t=L.computeTimeline(next.items);next.items=t.items;next.total_out_seconds=t.total_out_seconds;L.verifyPlan(next,analyses,inputs,D.index,D.index.hypotheses_ids);if(!next.checks.ok){notify(next.checks.errors.join(' ／ '));return false;}plan=next;saveDraft();render();return true;}catch(error){notify('区間を変更できませんでした。素材の範囲と速度を確認してください。');return false;}
  }
  primary.addEventListener('click',async()=>{
    if(liveClient&&screen===0){
      primary.disabled=true;
      try{
        if(auth==='email'){loginEmail=$('email').value.trim();if(!$('email').checkValidity()||!loginEmail)throw Error('メールアドレスを確認してください。');await window.VIDEO_COACH_AUTH.sendCode(liveClient,loginEmail);auth='code';render();}
        else if(auth==='code'){await window.VIDEO_COACH_AUTH.verifyCode(liveClient,loginEmail,$('code').value);auth='ready';render();}
        else notify('ログインを確認しました。素材の送信画面は準備中です。');
      }catch(e){notify(e.message);}finally{primary.disabled=false;}
      return;
    }
    if(screen===0){if(auth==='email'){if(!$('email').value||!$('email').checkValidity()){notify('架空のメールアドレスを入力してください。');$('email').focus();return;}auth='code';render();}else if(auth==='code'){if(!new RegExp('^\\d{'+L.DEFAULTS.codeDigits+'}$').test($('code').value)){notify('6桁の数字を入力してください。');return;}auth='ready';render();}else move(1);
    }else if(screen===1){if(!selected){selected=true;saveDraft();render();}else move(2);
    }else if(screen===2){if(!inputs.worries.length)return;inputs.selected_at=new Date().toISOString();plan=L.buildPlan(analyses,inputs,D.index,L.DEFAULTS);saveDraft();move(3);
    }else if(screen===3){if(!plan?.checks.ok)move(1);else move(4);
    }else if(screen===4){const blob=new Blob([L.formatCapcutMemo(plan,analyses)],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='動画づくり_編集メモ.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),5000);$('feedback').style.display='block';$('feedback').scrollIntoView({behavior:'instant',block:'center'});saveDraft();}
  });
  app.addEventListener('change',event=>{if(event.target.id==='for-ads'){inputs.for_ads=event.target.checked;saveDraft();}if(event.target.name==='visibility'){inputs.visibility=event.target.value;saveDraft();}if(event.target.id==='other'){inputs.other=event.target.value;saveDraft();}if(event.target.id==='feedback-note'){try{sessionStorage.setItem(storageKey+':feedback-note',event.target.value);}catch{notify('感想を保存できませんでした。');}}});
  app.addEventListener('click',event=>{
    const b=event.target.closest('button[data-action]');if(!b)return;
    const action=b.dataset.action;
    const card=b.closest('[data-source-key]');
    const n=card&&plan?plan.items.findIndex(i=>(i.source?i.source.clip_id+':'+i.source.segment_id+':'+i.source.start+':'+i.source.end:'card:'+i.role)===card.dataset.sourceKey):Number(b.dataset.index),item=plan?.items[n];
    if(action==='email'){auth='email';render();}
    else if(action==='back')move(Math.max(0,screen-1));
    else if(action==='draft'){try{const draft=JSON.parse(sessionStorage.getItem(storageKey)||'null');if(!draft){notify('このタブに下書きはありません。');return;}const nextInputs=draft.inputs;if(!Array.isArray(nextInputs?.worries)||!['customer_face_ok','customer_face_ng','no_customer'].includes(nextInputs.visibility))throw new Error('invalid');inputs=nextInputs;selected=Boolean(draft.selected);plan=draft.plan;if(plan)L.verifyPlan(plan,analyses,inputs,D.index,D.index.hypotheses_ids);move(plan?.checks.ok?3:selected?2:1);}catch{notify('下書きを読み込めませんでした。素材から始めてください。');}}
    else if(action==='worry'){const key=b.dataset.key;const pos=inputs.worries.findIndex(w=>w.key===key);if(pos>=0)inputs.worries.splice(pos,1);else if(inputs.worries.length<L.DEFAULTS.maxWorries)inputs.worries.push({key,primary:false});else{notify('悩みは3つまでです。選んだ項目を外して変更できます。');return;}inputs.worries.forEach((w,i)=>w.primary=i===0);saveDraft();const top=window.scrollY;render();window.scrollTo(0,top);app.querySelector('[data-key="'+CSS.escape(key)+'"]')?.focus({preventScroll:true});}
    else if(action==='restart')move(2);
    else if(action==='show-types')$('type-chooser').style.display=$('type-chooser').style.display==='block'?'none':'block';
    else if(action==='template'){inputs.template=b.dataset.template;plan=L.buildPlan(analyses,inputs,D.index,L.DEFAULTS);saveDraft();render();if(plan.template!==inputs.template)notify('お客様の区間がないため、説明型で作りました。');}
    else if(action==='details'){const el=$('details-'+n);const open=el.style.display!=='block';el.style.display=open?'block':'none';b.setAttribute('aria-expanded',String(open));}
    else if(action==='alternatives'){
      const el=$('alternatives-'+n),used=plan.items.filter((_,i)=>i!==n).flatMap(i=>i.source?[i.source]:[]);
      const alternatives=L.pickAlternatives(item.role,L.eligibleAnalyses(analyses,inputs),used).filter(c=>!item.source||c.clip_id!==item.source.clip_id||c.segment_id!==item.source.segment_id);
      item.alternatives=alternatives;
      el.innerHTML='<p>この場面だけ差し替えます。</p>'+(alternatives.length?alternatives.map((c,a)=>'<button class="alternative" data-action="adopt-alternative" data-index="'+n+'" data-alternative="'+a+'">'+esc(c.clip_id)+' · '+esc(fmt(c.start))+'–'+esc(fmt(c.end))+'秒<br>'+esc(c.why)+'</button>').join(''):'<p>同じ役割で使える別の候補はありません。撮り足すか、この場面を残してください。</p>');el.style.display='block';
    }else if(action==='adopt-alternative'){
      const c=item.alternatives[Number(b.dataset.alternative)];if(!c)return;
      const next=structuredClone(plan),t=next.items[n],clip=analyses.find(a=>a.clip_id===c.clip_id),segment=clip.segments.find(s=>s.id===c.segment_id);
      t.source={clip_id:c.clip_id,segment_id:c.segment_id,start:c.start,end:c.end};t.still=null;t.shot_type=c.shot_type;t.who_visible=c.who_visible;t.why.observation=segment?.notes||'模擬区間';t.reference=L.linkReference(t.role,c.shot_type,[],D.index);t.edit.zoom=null;t.edit.audio='keep';t.edit.note=c.why;t.needs_check=[];
      validate(next);
    }else if(action==='trim'){
      const next=structuredClone(plan);next.items[n].source[b.dataset.edge]+=Number(b.dataset.sign)*L.DEFAULTS.trimStep;
      if(validate(next))notify('発話の切れ目を確認して秒数を更新しました。');
    }else if(action==='reorder'){
      const to=n+Number(b.dataset.sign);if(to<0||to>=plan.items.length)return;const next=structuredClone(plan);[next.items[n],next.items[to]]=[next.items[to],next.items[n]];validate(next);
    }else if(action==='play'||action==='reference')openPlayer(n,action==='reference'?'reference':'source',b);
    else if(action==='copy'){
      // clipboard API は file:// で許可されない場合があるため、選択コピーを併用する。
      const text=L.formatCapcutMemo(plan,analyses);const ta=document.createElement('textarea');ta.value=text;ta.setAttribute('readonly','');document.body.append(ta);ta.select();let copied=false;try{copied=document.execCommand('copy');}catch{}ta.remove();if(copied)notify('メモをコピーしました。');else{const range=document.createRange();range.selectNodeContents($('memo'));const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);notify('メモを選択しました。端末のコピー操作を使ってください。');}
    }else if(action==='feedback'){try{sessionStorage.setItem(storageKey+':feedback',b.dataset.verdict);$('feedback-result').textContent='このタブ内に感想を保存しました。ありがとうございます。';}catch{notify('保存できませんでした。');}}
  });
  // ひとつの再生器。切替時に前の非同期読込みと再生を取り消す。
  const dialog=$('player-dialog'),video=$('player');
  let playerIndex=0,side='source',context=false,epoch=0,cancelWait=null,range=null,returnFocus=null,frameId=null;
  function stop(){epoch++;cancelWait?.();cancelWait=null;range=null;video.pause();if(frameId!==null&&video.cancelVideoFrameCallback)video.cancelVideoFrameCallback(frameId);frameId=null;}
  function closePlayer(){stop();video.removeAttribute('src');video.load();if(dialog.open)dialog.close();returnFocus?.focus?.({preventScroll:true});}
  function waitMetadata(token){if(video.readyState>=1)return Promise.resolve();return new Promise((resolve,reject)=>{let timer;const done=err=>{clearTimeout(timer);video.removeEventListener('loadedmetadata',ready);video.removeEventListener('error',failed);if(cancelWait===cancel)cancelWait=null;err?reject(err):resolve();};const ready=()=>done(),failed=()=>done(new Error('動画を読み込めませんでした。ローカルの素材パスを確認してください。')),cancel=()=>done(new DOMException('切替','AbortError'));timer=setTimeout(()=>done(new Error('動画の準備に時間がかかっています。再生を押し直してください。')),10000);cancelWait=cancel;video.addEventListener('loadedmetadata',ready,{once:true});video.addEventListener('error',failed,{once:true});if(token!==epoch)cancel();});}
  function watchFrame(){if(!range)return;if(video.currentTime>=range.end){video.pause();video.currentTime=range.end;return;}if(video.requestVideoFrameCallback)frameId=video.requestVideoFrameCallback(watchFrame);}
  async function showPlayer(){
    stop();const token=epoch,item=plan.items[playerIndex],ref=item.reference;
    $('source-tab').setAttribute('aria-pressed',String(side==='source'));$('reference-tab').setAttribute('aria-pressed',String(side==='reference'));$('reference-tab').disabled=!ref;
    $('context-toggle').textContent=context?'前後1秒も含めて確認中':'前後1秒も見る';$('context-toggle').setAttribute('aria-pressed',String(context));
    $('player-title').textContent='場面'+(playerIndex+1)+' · '+L.ROLE_LABELS[item.role];
    const data=side==='reference'?ref:item.source?{...item.source,video:D.mediaBase+'/'+item.source.clip_id+'.mp4'}:null;
    if(!data){video.style.display='none';$('player-meta').textContent='文字カード：'+item.caption.lines.join(' ／ ');$('player-point').textContent='配置 '+fmt(item.output.start)+'–'+fmt(item.output.end)+'秒';$('player-difference').textContent='元素材のない文字カード案です。';$('player-status').textContent='CapCutでテキストを置く案です。';return;}
    video.style.display='block';video.poster=side==='reference'?ref.poster:'';
    $('player-meta').textContent=(side==='reference'?'参考：'+ref.code:'使う素材（匿名の模擬映像）：'+item.source.clip_id)+' '+fmt(data.start)+'–'+fmt(data.end)+'秒';
    $('player-point').textContent=side==='reference'?'参考にする点：'+ref.point:'採用する元区間と完成位置は別です。完成 '+fmt(item.output.start)+'–'+fmt(item.output.end)+'秒';
    $('player-difference').textContent=side==='reference'?'今回との違い：'+ref.difference+' 予約増加は未検証。'+(ref.baseline_note||''):'図形だけの模擬映像です。実際の施術映像の判断精度を示すものではありません。';
    $('player-status').textContent='区間を準備しています…';
    try{
      const url=new URL(data.video,location.href);if(url.protocol!==location.protocol)throw new Error('ローカルの動画だけを再生します。');
      if(video.src!==url.href){video.src=url.href;video.load();}
      await waitMetadata(token);if(token!==epoch||!dialog.open)return;
      const start=context?Math.max(0,data.start-L.DEFAULTS.contextSeconds):data.start,end=context?Math.min(video.duration,data.end+L.DEFAULTS.contextSeconds):data.end;
      if(!Number.isFinite(video.duration)||start<0||end<=start||end>video.duration+L.DEFAULTS.epsilon)throw new Error('動画と区間が一致しません。');
      range={start,end};video.currentTime=start;
      $('player-status').textContent=context?'前後を確認中です。採用区間は変わりません。':'区間の終わりで停止します。編集時に切れ目を再確認してください。';
      await video.play();if(token!==epoch)return;
    }catch(error){if(token===epoch&&dialog.open&&error.name!=='AbortError')$('player-status').textContent=error.name==='NotAllowedError'?'動画の再生ボタンを押してください。':error.message;}
  }
  function openPlayer(n,which,trigger){playerIndex=n;side=which;context=false;returnFocus=trigger;if(!dialog.open)dialog.showModal();showPlayer();}
  $('source-tab').addEventListener('click',()=>{side='source';context=false;showPlayer();});
  $('reference-tab').addEventListener('click',()=>{if(plan.items[playerIndex].reference){side='reference';context=false;showPlayer();}});
  $('context-toggle').addEventListener('click',()=>{context=!context;showPlayer();});$('replay').addEventListener('click',showPlayer);
  $('close-player').addEventListener('click',closePlayer);dialog.addEventListener('cancel',event=>{event.preventDefault();closePlayer();});
  video.addEventListener('timeupdate',()=>{if(range&&video.currentTime>=range.end){video.pause();if(video.currentTime>range.end)video.currentTime=range.end;}});
  video.addEventListener('play',()=>{if(range){if(video.currentTime<range.start||video.currentTime>=range.end)video.currentTime=range.start;if(frameId!==null&&video.cancelVideoFrameCallback)video.cancelVideoFrameCallback(frameId);watchFrame();}});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();});
  render();
})();
