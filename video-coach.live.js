"use strict";
window.startVideoCoachLive = async function () {
  const L = window.VIDEO_COACH,
    C = window.VIDEO_COACH_CONTRACT,
    A = window.VIDEO_COACH_AUTH;
  const $ = (id) => document.getElementById(id),
    app = $("app"),
    primary = $("primary");
  const esc = (v) =>
    String(v ?? "").replace(
      /[&<>"']/g,
      (c) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[c]),
    );
  let sessionPromise = null;
  let client,
    call,
    member,
    email = "",
    auth = "email",
    screen = 0,
    session = null,
    clips = [],
    files = [],
    plan = null,
    analyses = [],
    media = [],
    timer,
    busy = false,
    wantPlan = false;
  let inputs = {
    worries: [],
    visibility: "customer_face_ok",
    for_ads: false,
    selected_at: new Date().toISOString(),
  };
  let playerIndex = 0, playerSide = "source", playerEpoch = 0, playerEnd = null, playerStart = null;
  const dialog = $("player-dialog"), video = $("player");
  document.querySelector(".demo-banner").textContent = "動画づくりの相談室";
  document.title = "動画づくりの相談室";
  function message(text) {
    $("notice").textContent = text;
    $("notice").style.display = "block";
  }
  function fail(e) {
    message(C.errorMessage(e));
    if ([401, 403].includes(e.status)) {
      clearTimeout(timer);
      screen = 0;
      auth = "email";
      session = null;
      plan = null;
      media = [];
      clips = [];
      files = [];
      render();
    }
  }
  function button(label, disabled = false) {
    primary.textContent = label;
    primary.disabled = disabled;
    $("step-label").textContent = screen
      ? "STEP " + screen
      : "登録済みメールでログイン";
  }
  const request = (action, extra = {}) =>
    call(action, { session_id: session?.id, ...extra });
  function render() {
    if (screen === 0) {
      if (auth === "email") {
        app.innerHTML =
          '<h1>動画づくりに、迷わない時間を。</h1><label for="email">メールアドレスを入れてください</label><input id="email" type="email" autocomplete="email"><p>登録済みのメールアドレスへコードを送ります。</p>';
        button("入る");
      } else if (auth === "code") {
        app.innerHTML =
          '<h1>メールに届いたコードを入れてください</h1><input id="code" inputmode="numeric" pattern="[0-9]{6,10}" maxlength="10" autocomplete="one-time-code">';
        button("入る");
      } else {
        app.innerHTML =
          '<h1>今日の素材から、1本の案をつくります。</h1><p>素材と案は、同じ店舗の担当者と管理者だけが見られます。元の動画・サムネ・文字起こしは7日で消えます。</p><a href="?mock=full">使い方を見る（見本）</a><button data-action="draft">前回の下書き</button><div id="drafts"></div>' +
          (member?.role === "owner"
            ? '<button data-action="release_remote_lock">処理ロックを手動解除</button>'
            : "");
        button("素材を入れる ＋");
      }
    } else if (screen === 1) {
      app.innerHTML =
        '<h1>今日撮った動画を、まとめて選んでください。</h1><p>掲載同意のあるお客様の素材だけ入れてください。</p><input id="files" type="file" accept="video/mp4,video/quicktime,video/webm" multiple><p>今は12本・1本10分まで（試作の目安）。画面を閉じた後は同じ動画を選び直すと送信を再開できます。</p><div id="uploads"></div>';
      uploadRows();
      button("次へ：今日のお客様", !files.length && !clips.length);
    } else if (screen === 2) {
      app.innerHTML =
        '<h1>今日のお客様の悩みは？</h1><p>最初の1つを主役に、3つまで選べます。</p><div class="chips">' +
        L.WORRIES.map((w) =>
          '<button class="chip" data-action="worry" data-key="' + esc(w[0]) +
          '" aria-pressed="' + inputs.worries.some((x) => x.key === w[0]) +
          '">' + esc(w[1]) + "</button>"
        ).join("") +
        '</div><label for="other">補足（氏名などは入れないでください）</label><textarea id="other">' +
        esc(inputs.other || "") +
        "</textarea><fieldset><legend>映っている人の顔は？</legend>" +
        [["customer_face_ok", "映っている人の顔を出してよい（モデルのスタッフを含む・掲載同意あり）"], [
          "customer_face_ng",
          "顔は出さない",
        ], ["no_customer", "人は映っていない（部屋・道具だけ）"]].map(([v, t]) =>
          '<label class="radio-row"><input type="radio" name="visibility" value="' +
          v + '" ' + (inputs.visibility === v ? "checked" : "") + ">" + t +
          "</label>"
        ).join("") + '</fieldset><label><input type="checkbox" id="for-ads" ' +
        (inputs.for_ads ? "checked" : "") +
        '>この動画は広告にも使う</label><p id="progress" role="status"></p><div id="clip-errors"></div><button data-action="materials">素材の送信を再開</button>' +
        (member?.role === "owner"
          ? '<button data-action="reset_session_error">案の作成をやり直す</button>'
          : "");
      progress();
      button(
        wantPlan ? "解析中…" : "おすすめの構成を見る",
        wantPlan || !inputs.worries.length,
      );
    } else if (screen === 3) {
      app.innerHTML = "<h1>おすすめの構成</h1><p>約" +
        esc(L.seconds(plan.total_out_seconds)) + "秒・" + plan.items.length +
        "場面</p>" + skeletonHtml() + plan.items.map((item, n) =>
          '<article class="scene"><h2>場面' + (n + 1) + " " +
          esc(item.skeleton ? L.SLOT_LABELS[item.skeleton] : L.ROLE_LABELS[item.role]) + "</h2>" +
          (item.narration ? '<p class="beat">流れ：' + esc(L.BEAT_LABELS[item.narration.beat]) + "</p>" : "") + "<p>テロップ：" +
          item.caption.lines.map(esc).join("<br>") + "</p>" + narrationHtml(item, n) + "<p>完成 " +
          esc(L.seconds(item.output.start)) + "–" +
          esc(L.seconds(item.output.end)) +
          '秒</p><button data-action="play" data-index="' + n + '" ' +
          (!item.source ? "disabled" : "") +
          '>▶この場面</button><button data-action="reference" data-index="' +
          n + '" ' + (!item.reference ? "disabled" : "") +
          ">参考を見る</button><details><summary>詳しく</summary><p>" +
          esc(item.why.observation) + "</p><p>" +
          esc(item.warnings.join(" ／ ")) + "</p><p>" + esc(item.edit.note) +
          '</p><button data-action="alternatives" data-index="' + n +
          '">別の候補</button><div id="alternatives-' + n +
          '"></div><button data-action="up" data-index="' + n +
          '">上へ ↑</button><button data-action="down" data-index="' + n +
          '">下へ ↓</button>' + (item.source
            ? ["start", "end"].flatMap((edge) =>
              [-1, 1].map((sign) =>
                '<button data-action="trim" data-index="' + n +
                '" data-edge="' + edge + '" data-sign="' + sign + '">' +
                (edge === "start" ? "開始" : "終了") + " " +
                (sign < 0 ? "−" : "+") + "0.5秒</button>"
              )
            ).join("")
            : "") +
          "</details></article>"
        ).join("");
      button("この案で編集する");
    } else {
      app.innerHTML =
        '<h1>CapCut で、この順番に並べてください。</h1><pre class="memo">' +
        esc(L.formatCapcutMemo(plan, analyses)) +
        '</pre><label for="feedback-note">感想（氏名などは入れないでください）</label><textarea id="feedback-note" maxlength="500"></textarea>' +
        [["use", "そのまま使う"], ["adjust", "少し直して使う"], [
          "reject",
          "使わない",
        ]].map(([v, t]) =>
          '<button data-action="feedback" data-verdict="' + v + '">' + t +
          "</button>"
        ).join("");
      button("メモを保存して終わる");
    }
  }
  function uploadRows() {
    if (!$("uploads")) return;
    $("uploads").innerHTML = files.map((f, i) =>
      "<p>素材" + (i + 1) + "：" +
      esc(f.error || (f.done ? "読み取り待ち" : "送信中 " + f.percent + "%")) +
      (f.error
        ? '<button data-action="resume" data-index="' + i + '">再開</button>'
        : "") +
      "</p>"
    ).join("");
  }
  function progress() {
    if (!$("progress")) return;
    const total = Math.max(files.length, clips.length),
      sent = files.length
        ? files.filter((f) => f.done).length
        : clips.filter((c) => c.status !== "uploaded").length,
      read =
        clips.filter((c) => ["analyzed", "cleanup"].includes(c.status)).length;
    $("progress").textContent = "送信 " + sent + "/" + total + "・場面と音声 " +
      read + "/" + total + "・案を作成 待ち";
    $("clip-errors").innerHTML = clips.filter((c) => c.error).map((c) =>
      "<p>" + esc(
        c.status === "failed" ? "読めませんでした（" + c.error + "）" : c.error,
      ) + (c.status === "failed"
        ? '<button data-action="retry_clip" data-id="' + esc(c.id) +
          '">もう一度読み取る</button>'
        : "") +
      "</p>"
    ).join("");
  }
  // 遠山型の骨組み（10枠）のそろい具合と、足りない枠の撮影リスト。各項目で遠山さんの例を再生できる。
  function skeletonHtml() {
    const missing = plan.gaps.map((g, i) => ({ g, i })).filter(({ g }) => g.skeleton);
    if (!plan.items.some((i) => i.skeleton)) return "";
    const filled = L.SKELETON.length - missing.length;
    return '<section class="skeleton"><h2>遠山型の骨組み ' + filled + "/" + L.SKELETON.length +
      " がそろっています</h2>" +
      (missing.length
        ? "<p>足りない場面を撮ると、遠山さんの型に近づきます。</p><ul>" + missing.map(({ g, i }) =>
          "<li>" + esc(L.SLOT_LABELS[g.skeleton]) + "：" + esc(g.next_time || "") +
          (g.example ? ' <button data-action="example" data-index="' + i + '">遠山さんの例を見る</button>' : "") +
          "</li>"
        ).join("") + "</ul>"
        : "<p>すべての場面がそろっています。</p>") + "</section>";
  }
  function narrationHtml(item, n) {
    const nar = item.narration;
    if (!nar) return "";
    const text = nar.source === "speech"
      ? "素材の声をそのまま使う" + (nar.text ? "（声を使わない場合：" + esc(nar.text) + "）" : "")
      : nar.text ? esc(nar.text) : "入れない（間をとる）";
    return '<p class="narration">読む原稿：' + text + "</p>" +
      (nar.ref
        ? '<p class="narration-source">遠山さん ' + esc(nar.ref.code) + " " +
          esc(L.seconds(nar.ref.start)) + "〜" + esc(L.seconds(nar.ref.end)) +
          '秒の言い回し <button data-action="phrase" data-index="' + n +
          '">言い回しの元を見る</button></p>'
        : "");
  }
  async function ensureSession() {
    if (session) return session;
    sessionPromise ??= request("create_session", {
      inputs: { ...inputs, selected_at: new Date().toISOString() },
    }).then((r) => session = r.session).finally(() => sessionPromise = null);
    return sessionPromise;
  }
  async function fileInfo(file) {
    const url = URL.createObjectURL(file), v = document.createElement("video");
    try {
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(
          () => reject(Error("動画の情報を読み取れませんでした")),
          15000,
        );
        v.onloadedmetadata = () => {
          clearTimeout(timeout);
          resolve();
        };
        v.onerror = () => {
          clearTimeout(timeout);
          reject(
            Error("この形式は読めませんでした。MP4に変換してお試しください。"),
          );
        };
        v.src = url;
      });
      if (
        file.size > 314572800 || v.duration > 600 ||
        !Number.isFinite(v.duration)
      ) throw Error("素材の容量または長さが上限を超えています");
      const digest = await crypto.subtle.digest(
        "SHA-256",
        await file.arrayBuffer(),
      );
      return {
        sha256: Array.from(
          new Uint8Array(digest),
          (x) => x.toString(16).padStart(2, "0"),
        ).join(""),
        duration: v.duration,
        width: v.videoWidth,
        height: v.videoHeight,
        size_bytes: file.size,
        mime_type: file.type,
      };
    } finally {
      v.removeAttribute("src");
      v.load();
      URL.revokeObjectURL(url);
    }
  }
  async function upload(f) {
    if (f.running) return;
    f.running = true;
    f.error = "";
    uploadRows();
    try {
      await ensureSession();
      f.info ??= await fileInfo(f.file);
      const signed = await request("sign_upload", { clip: f.info });
      f.clip_id = signed.clip_id;
      if (!signed.signed) {
        if (signed.status === "failed") {
          throw Error(
            "前回の読み取り失敗を「もう一度読み取る」で再開してください",
          );
        }
        f.done = true;
        return;
      }
      const s = signed.signed,
        key = "video-coach-tus:" + member.id + ":" + session.id + ":" +
          f.info.sha256;
      const headers = { "Tus-Resumable": "1.0.0", "x-signature": s.token };
      let url = localStorage.getItem(key), offset = 0;
      const validUploadURL = (value) => {
        try {
          const u = new URL(value), endpoint = new URL(s.resumable_url);
          return u.protocol === "https:" && u.origin === endpoint.origin &&
            u.pathname.startsWith(endpoint.pathname + "/");
        } catch {
          return false;
        }
      };
      if (url && !validUploadURL(url)) {
        localStorage.removeItem(key);
        url = null;
      }
      if (url) {
        const r = await fetch(url, {
          method: "HEAD",
          signal: AbortSignal.timeout(120000),
          headers,
        });
        if (r.ok) offset = Number(r.headers.get("Upload-Offset"));
        else if ([404, 410].includes(r.status)) url = null;
        else throw Error("送信が止まりました。再開を押してください。");
      }
      if (!url) {
        const metadata = {
          bucketName: s.bucket,
          objectName: s.object_name,
          contentType: f.info.mime_type,
          cacheControl: "3600",
        };
        const r = await fetch(s.resumable_url, {
          method: "POST",
          signal: AbortSignal.timeout(120000),
          headers: {
            ...headers,
            "Upload-Length": String(f.file.size),
            "Upload-Metadata": Object.entries(metadata).map(([k, v]) =>
              k + " " + btoa(v)
            ).join(","),
          },
        });
        if (!r.ok) throw Error("送信が止まりました。再開を押してください。");
        url = r.headers.get("Location");
        if (!url || !validUploadURL(url)) {
          throw Error("送信先を取得できませんでした");
        }
        localStorage.setItem(key, url);
      }
      if (!Number.isSafeInteger(offset) || offset < 0 || offset > f.file.size) {
        throw Error("送信位置を確認できませんでした");
      }
      while (offset < f.file.size) {
        const chunk = f.file.slice(offset, offset + 6 * 1024 * 1024);
        const r = await fetch(url, {
          method: "PATCH",
          signal: AbortSignal.timeout(120000),
          headers: {
            ...headers,
            "Upload-Offset": String(offset),
            "Content-Type": "application/offset+octet-stream",
          },
          body: chunk,
        });
        if (!r.ok) {
          throw Error(
            "送信が止まりました。電波の良い場所で「再開」を押してください。",
          );
        }
        const next = Number(r.headers.get("Upload-Offset"));
        if (next !== offset + chunk.size) {
          throw Error("送信位置を確認できませんでした");
        }
        offset = next;
        f.percent = Math.round(offset / f.file.size * 100);
        uploadRows();
      }
      f.done = true;
      localStorage.removeItem(key);
    } catch (e) {
      // 通信の切断などは英語（Failed to fetch）のまま出さず、日本語の案内にする。
      f.error = C.errorMessage(e);
      fail(e);
    } finally {
      f.running = false;
      uploadRows();
      if (screen === 1) button("次へ：今日のお客様", !files.length);
    }
  }
  function schedule(ms = 3500) {
    clearTimeout(timer);
    if (screen === 2) timer = setTimeout(tick, ms);
  }
  async function tick() {
    if (screen !== 2 || busy) return;
    busy = true;
    let delay = 3500;
    try {
      const r = await request("advance");
      if (r.message) message(r.message);
      if (r.retry_after) {
        delay = Math.max(3500, Date.parse(r.retry_after) - Date.now());
      }
      const snapshot = await request("get_session");
      clips = snapshot.clips;
      session = snapshot.session;
      progress();
      if (
        wantPlan && files.every((f) => f.done) && clips.length &&
        clips.every((c) => ["analyzed", "cleanup"].includes(c.status))
      ) {
        const result = await request("compose");
        if (result.retry_after) {
          message(result.message);
          delay = Math.max(3500, Date.parse(result.retry_after) - Date.now());
        } else {
          await loadPlan();
          screen = 3;
          render();
        }
      }
      if (clips.some((c) => c.status === "failed")) {
        wantPlan = false;
        button("おすすめの構成を見る", !inputs.worries.length);
      }
    } catch (e) {
      if (e.status === 409 && /処理中/.test(e.message)) {
        // 別の処理が進行中なだけ（一時的）。案づくりの予約は取り消さず、少し待って続ける。
        return;
      }
      fail(e);
      wantPlan = false;
      if (screen === 2) button("おすすめの構成を見る", !inputs.worries.length);
      delay = e.retry_after
        ? Math.max(15000, Date.parse(e.retry_after) - Date.now())
        : 15000;
    } finally {
      busy = false;
      schedule(delay);
    }
  }
  function adjustPlan(next) {
    const timeline = L.computeTimeline(next.items);
    next.items = timeline.items;
    next.total_out_seconds = timeline.total_out_seconds;
    next.checks = L.verifyPlan(
      next,
      analyses,
      inputs,
      window.VIDEO_COACH_DATA.index,
      window.VIDEO_COACH_DATA.index.hypotheses_ids,
    );
    if (!next.checks.ok) throw Error(next.checks.errors.join(" ／ "));
    plan = next;
    render();
    message("端末内の編集メモを更新しました。");
  }
  async function loadPlan(refreshMediaOnly = false) {
    const r = await request("get_plan");
    if (!refreshMediaOnly) plan = r.plan;
    analyses = r.analyses;
    media = r.media;
  }
  primary.addEventListener("click", async () => {
    primary.disabled = true;
    try {
      if (screen === 0) {
        if (auth === "email") {
          email = $("email").value.trim();
          if (!$("email").checkValidity() || !email) {
            throw Error("メールアドレスを確認してください");
          }
          await A.sendCode(client, email);
          auth = "code";
        } else if (auth === "code") {
          const token = $("code").value.replace(/\s/g, "");
          // Supabase のコード桁数はプロジェクト設定で 6〜10 桁（本番は 8 桁）。
          if (!/^\d{6,10}$/.test(token)) {
            throw Error("メールに届いた数字のコードを入力してください");
          }
          member = await A.verifyCode(client, email, token);
          auth = "ready";
        } else {
          session = null;
          files = [];
          clips = [];
          plan = null;
          wantPlan = false;
          screen = 1;
        }
        render();
      } else if (screen === 1) {
        await ensureSession();
        screen = 2;
        render();
        schedule();
      } else if (screen === 2) {
        inputs.selected_at = new Date().toISOString();
        // 素材の読み取り中は「処理中」(409) で断られることがある。少し待ってやり直す（案づくりの予約を落とさない）。
        for (let attempt = 0; ; attempt++) {
          try {
            await request("update_inputs", { inputs });
            break;
          } catch (e) {
            if (!(e.status === 409 && /処理中/.test(e.message)) || attempt >= 8) throw e;
            await new Promise((r) => setTimeout(r, 2000));
          }
        }
        wantPlan = true;
        render();
        schedule(1);
      } else if (screen === 3) {
        screen = 4;
        render();
      } else {
        const url = URL.createObjectURL(
          new Blob([L.formatCapcutMemo(plan, analyses)], {
            type: "text/plain;charset=utf-8",
          }),
        );
        const a = document.createElement("a");
        a.href = url;
        a.download = "動画づくり_編集メモ.txt";
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 5000);
        message("メモを保存しました。端末のダウンロード先を確認してください。");
      }
    } catch (e) {
      fail(e);
    } finally {
      primary.disabled = screen === 2 && wantPlan;
    }
  });
  app.addEventListener("change", async (e) => {
    if (e.target.id === "files") {
      const chosen = [...e.target.files];
      if (
        files.length + chosen.length > 12 ||
        files.reduce((n, f) => n + f.file.size, 0) +
              chosen.reduce((n, f) => n + f.size, 0) >
          L.DEFAULTS.maxSessionBytes
      ) {
        message("素材の本数または合計容量を超えています");
        return;
      }
      const batch = chosen.map((file) => ({ file, percent: 0, done: false }));
      files.push(...batch);
      if (screen === 1) button("次へ：今日のお客様");
      for (const f of batch) await upload(f);
      if (screen === 1) button("次へ：今日のお客様", !files.length);
    }
    if (e.target.id === "other") inputs.other = e.target.value;
    if (e.target.name === "visibility") inputs.visibility = e.target.value;
    if (e.target.id === "for-ads") inputs.for_ads = e.target.checked;
  });
  app.addEventListener("click", async (e) => {
    const b = e.target.closest("button[data-action]");
    if (!b) return;
    const action = b.dataset.action;
    b.disabled = true;
    try {
      if (action === "worry") {
        if (wantPlan) return;
        const i = inputs.worries.findIndex((w) => w.key === b.dataset.key);
        if (i >= 0) inputs.worries.splice(i, 1);
        else if (inputs.worries.length < 3) {
          inputs.worries.push({ key: b.dataset.key });
        }
        inputs.worries.forEach((w, i) => w.primary = i === 0);
        render();
      } else if (action === "materials") {
        clearTimeout(timer);
        screen = 1;
        render();
      } else if (action === "resume") {
        await upload(files[Number(b.dataset.index)]);
      } else if (action === "draft") {
        const r = await request("list_sessions");
        $("drafts").innerHTML = r.sessions.map((s) =>
          "<p>" + esc(new Date(s.created_at).toLocaleString()) +
          '<button data-action="open" data-id="' + esc(s.id) +
          '">続きを開く</button><button data-action="delete" data-id="' +
          esc(s.id) + '">この回を削除</button></p>'
        ).join("") || "下書きはありません";
      } else if (action === "open") {
        const r = await call("get_session", { session_id: b.dataset.id });
        session = r.session;
        clips = r.clips;
        inputs = session.inputs;
        files = [];
        wantPlan = false;
        if (session.plan_current_id) {
          await loadPlan();
          screen = 3;
        } else screen = 2;
        render();
        schedule();
        if (clips.some((c) => c.status === "uploaded")) {
          message("送信途中の素材は素材画面で同じ動画を選び直してください");
        }
      } else if (action === "delete") {
        if (
          confirm("この回の動画・文字起こし・案を削除しますか？") &&
          confirm("削除すると戻せません。実行しますか？")
        ) {
          await call("delete_session", {
            session_id: b.dataset.id,
            confirm: true,
          });
          message(
            "手元の素材と案を削除しました。外部の後始末は再試行を含めて続きます。",
          );
          render();
        }
      } else if (action === "retry_clip") {
        await request(action, { clip_id: b.dataset.id });
        schedule(1);
      } else if (action === "reset_session_error") {
        await request(action);
        wantPlan = true;
        schedule(1);
      } else if (action === "release_remote_lock") {
        if (confirm("実行中の処理がないことを確認して解除しますか？")) {
          await request(action);
          message("処理ロックを解除しました");
        }
      } else if (action === "feedback") {
        await request(action, {
          plan_id: plan.id,
          verdict: b.dataset.verdict,
          note: $("feedback-note").value,
        });
        message("感想を保存しました。ありがとうございます。");
      } else if (action === "up" || action === "down") {
        const n = Number(b.dataset.index), to = n + (action === "up" ? -1 : 1);
        if (to >= 0 && to < plan.items.length) {
          const next = structuredClone(plan);
          [next.items[n], next.items[to]] = [next.items[to], next.items[n]];
          adjustPlan(next);
        }
      } else if (action === "trim") {
        const next = structuredClone(plan);
        next.items[Number(b.dataset.index)].source[b.dataset.edge] +=
          Number(b.dataset.sign) * 0.5;
        adjustPlan(next);
      } else if (action === "alternatives") {
        const n = Number(b.dataset.index), item = plan.items[n];
        const used = plan.items.filter((_, i) => i !== n).flatMap((i) =>
          i.source ? [i.source] : []
        );
        item.alternatives = L.pickAlternatives(
          item.role,
          L.eligibleAnalyses(analyses, inputs),
          used,
        ).filter((c) =>
          !item.source || c.clip_id !== item.source.clip_id ||
          c.segment_id !== item.source.segment_id
        );
        $("alternatives-" + n).innerHTML = item.alternatives.map((c, a) =>
          '<button data-action="adopt" data-index="' + n +
          '" data-candidate="' + a + '">' + esc(c.clip_id) + " " +
          esc(c.start) + "–" + esc(c.end) + "秒</button>"
        ).join("") || "同じ役割の別候補はありません";
      } else if (action === "adopt") {
        const n = Number(b.dataset.index),
          next = structuredClone(plan),
          item = next.items[n],
          c = item.alternatives[Number(b.dataset.candidate)];
        if (!c) throw Error("候補を選び直してください");
        item.source = {
          clip_id: c.clip_id,
          segment_id: c.segment_id,
          start: c.start,
          end: c.end,
        };
        item.still = null;
        item.shot_type = c.shot_type;
        item.who_visible = c.who_visible;
        item.reference = L.linkReference(
          item.role,
          c.shot_type,
          [],
          window.VIDEO_COACH_DATA.index,
        );
        item.edit.zoom = null;
        item.edit.note = c.why;
        adjustPlan(next);
      } else if (action === "play" || action === "reference" || action === "phrase" || action === "example") {
        playerIndex = Number(b.dataset.index);
        playerSide = action === "play" ? "source" : action;
        if (!dialog.open) dialog.showModal();
        await play();
      }
    } catch (e) {
      fail(e);
    } finally {
      b.disabled = false;
    }
  });
  async function play() {
    const epoch = ++playerEpoch;
    video.pause();
    playerEnd = null;
    const example = playerSide === "example" ? plan.gaps[playerIndex] : null,
      item = example ? null : plan.items[playerIndex],
      phrase = playerSide === "phrase" && !!item?.narration?.ref,
      reference = playerSide === "reference" || phrase || !!example;
    $("player-title").textContent = example
      ? "撮影の例：" + L.SLOT_LABELS[example.skeleton]
      : "場面" + (playerIndex + 1);
    $("player-status").textContent = "区間を準備しています…";
    $("source-tab").disabled = !item?.source;
    $("reference-tab").disabled = !item?.reference;
    try {
      let url, range;
      if (example) {
        // 足りない枠の撮り方を、遠山さんの該当場面で見せる。
        const r = await request("sign_reference", { code: example.example.code });
        url = C.signedURL(r.signed);
        // カットの切れ目ちょうどから始めると前の場面が一瞬映るので、0.2秒後から流す。
        range = {
          start: Math.min(example.example.start + 0.2, example.example.end - 0.1),
          end: example.example.end,
        };
      } else if (phrase) {
        // 遠山さんの動画で、この言い回しが出ている秒数を再生する。
        const r = await request("sign_reference", {
          code: item.narration.ref.code,
        });
        url = C.signedURL(r.signed);
        // 言い回しは1秒前後と短いので、前後に contextSeconds（1秒）ずつ足して流れが分かるようにする。
        const pad = L.DEFAULTS.contextSeconds;
        range = {
          start: Math.max(0, item.narration.ref.start - pad),
          end: item.narration.ref.end + pad,
        };
      } else if (reference) {
        const r = await request("sign_reference", {
          reference_id: item.reference.id,
        });
        url = C.signedURL(r.signed);
        range = item.reference;
      } else {
        await loadPlan(true);
        const m = media.find((m) => m.clip_id === item.source.clip_id);
        if (!m) throw Error("素材の保持期限が過ぎています");
        url = C.signedURL(m.signed);
        range = item.source;
      }
      if (epoch !== playerEpoch || !dialog.open) return;
      // iPhone の Safari は再生を始めるまで動画を読み込まない（読み込み完了を待つと止まったままになる）。
      // 読み込みを待たずに再生を始め、始まってから区間の先頭へ移る。#t= は対応ブラウザでの開始位置の指定。
      playerStart = range.start;
      playerEnd = range.end;
      video.src = url + "#t=" + range.start + "," + range.end;
      video.onloadedmetadata = () => seekToStart();
      video.onerror = () => {
        if (epoch === playerEpoch) {
          $("player-status").textContent =
            "閲覧URLを取り直すには「もう一度再生」を押してください";
        }
      };
      $("player-meta").textContent = example
        ? "遠山さん " + example.example.code + " " + L.seconds(range.start) + "–" + L.seconds(range.end) + "秒"
        : phrase
        ? L.seconds(item.narration.ref.start) + "–" + L.seconds(item.narration.ref.end) + "秒（前後1秒ずつ足して再生）"
        : range.start + "–" + range.end + "秒";
      $("player-point").textContent = example
        ? "撮り方の例：" + example.example.desc + "（" + (example.next_time || "") + "）"
        : phrase
        ? "遠山さんの言い回し：" + item.narration.text
        : reference
        ? "参考にする点：" + item.reference.point
        : "採用する元区間";
      $("player-difference").textContent = example
        ? "同じ構図で撮って素材に加えると、骨組みがそろいます"
        : phrase
        ? "テロップと話す言葉をそろえる型です。自分の言葉に言い換えても大丈夫です"
        : reference
        ? "今回との違い：" + item.reference.difference
        : "公開前に映像と字幕を確認してください";
      video.load();
      try {
        await video.play();
        seekToStart();
        $("player-status").textContent = "区間の終わりで停止します";
      } catch (_e) {
        // 自動で始められない端末では、動画の ▶ を押してもらう（押すと区間の先頭から流れる）。
        if (epoch === playerEpoch) {
          $("player-status").textContent = "動画の ▶ を押すと再生します";
        }
      }
    } catch (e) {
      $("player-status").textContent = C.errorMessage(e);
    }
  }
  $("source-tab").onclick = () => {
    playerSide = "source";
    play();
  };
  $("reference-tab").onclick = () => {
    playerSide = "reference";
    play();
  };
  $("replay").onclick = play;
  $("context-toggle").style.display = "none";
  function close() {
    playerEpoch++;
    video.pause();
    video.removeAttribute("src");
    video.load();
    playerEnd = null;
    playerStart = null;
    dialog.close();
  }
  $("close-player").onclick = close;
  dialog.addEventListener("cancel", (e) => {
    e.preventDefault();
    close();
  });
  function seekToStart() {
    if (playerStart === null) return;
    if (
      video.currentTime < playerStart - 0.3 ||
      (playerEnd !== null && video.currentTime >= playerEnd)
    ) video.currentTime = playerStart;
  }
  video.addEventListener("play", seekToStart);
  video.addEventListener("timeupdate", () => {
    if (playerEnd !== null && video.currentTime >= playerEnd) {
      video.pause();
      video.currentTime = playerEnd;
    }
  });
  render();
  button("接続を準備しています", true);
  try {
    // 公開ページ内の定数だけを読む。ページのスクリプトは実行しない。
    //   公開先（GitHub Pages）では管理画面は admin-new.html の名前で置かれる（改名して公開される）。
    //   ローカル・模擬では admin.html。先に公開名を試し、無ければ元の名前に戻る。
    let response = null;
    for (const name of ["admin-new.html", "admin.html"]) {
      try {
        const r = await fetch(name, { cache: "no-cache", signal: AbortSignal.timeout(15000) });
        if (r.ok) { response = r; break; }
      } catch (_e) { /* 次の候補へ */ }
    }
    if (!response) throw Error("接続設定を取得できませんでした");
    const text = await response.text();
    const base = text.match(/var SB_URL\s*=\s*"([^"]+)"/)?.[1],
      key = text.match(/var SB_KEY\s*=\s*"([^"]+)"/)?.[1];
    if (!base || !key) throw Error("接続設定を確認してください");
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.57.4/dist/umd/supabase.js";
      const timeout = setTimeout(
        () => reject(Error("ログインの準備が止まりました。再読込してください")),
        20000,
      );
      script.onload = () => {
        clearTimeout(timeout);
        resolve();
      };
      script.onerror = () => {
        clearTimeout(timeout);
        reject(Error("ログインの準備に失敗しました。再読込してください"));
      };
      document.head.append(script);
    });
    client = window.supabase.createClient(base, key);
    call = C.createTransport({ mock: false, client, base, key });
    const { data, error } = await client.auth.getSession();
    if (error) throw error;
    if (data.session) {
      const r = await client.from("coach_members").select(
        "id,store_id,role,is_active",
      ).eq("auth_user_id", data.session.user.id).eq("is_active", true)
        .maybeSingle();
      if (r.error || !r.data) {
        throw Object.assign(Error("利用登録を確認してください"), {
          status: 403,
        });
      }
      member = r.data;
      auth = "ready";
    }
    render();
  } catch (e) {
    fail(e);
    button("再読込して接続を確認してください", true);
  }
};
