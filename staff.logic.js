/* スタッフ画面（staff.html）の判定ロジック。ネット・DB・画面に触らない部分だけをここに置く。
 * なぜ分けるか：npm test（tests/staff_logic.test.mjs）で同じ判定を直接確かめるため。
 * 設計：docs/design-staff-screen-2026-11-27.md。時刻はすべて日本時間（JST・+09:00）で扱う。 */
(function (root) {
  "use strict";

  var JST_MS = 9 * 60 * 60 * 1000;
  var WD = ["日", "月", "火", "水", "木", "金", "土"];

  function pad(n) { return (n < 10 ? "0" : "") + n; }

  // Date → 日本時間の { y, m, d, hh, mm, wd }
  function jst(date) {
    var t = new Date(new Date(date).getTime() + JST_MS);
    return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate(), hh: t.getUTCHours(), mm: t.getUTCMinutes(), wd: t.getUTCDay() };
  }

  function ymd(date) { var p = jst(date); return p.y + "-" + pad(p.m) + "-" + pad(p.d); }

  // 'YYYY-MM-DD' に n 日足す（日本時間の暦で）
  function addDays(day, n) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(day || ""));
    if (!m) return null;
    var d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3] + n));
    return d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1) + "-" + pad(d.getUTCDate());
  }

  // その日の 0:00〜翌日 0:00（日本時間）を ISO 文字列で
  function dayRange(day) {
    var next = addDays(day, 1);
    if (!next) return null;
    return { from: day + "T00:00:00+09:00", to: next + "T00:00:00+09:00" };
  }

  function hhmm(iso) {
    if (!iso) return "";
    var t = new Date(iso);
    if (isNaN(t.getTime())) return "";
    var p = jst(t);
    return pad(p.hh) + ":" + pad(p.mm);
  }

  // 「11/27(金)」
  function dayLabel(day) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(day || ""));
    if (!m) return "";
    var wd = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])).getUTCDay();
    return (+m[2]) + "/" + (+m[3]) + "(" + WD[wd] + ")";
  }

  function isOpen(r) { return !!r && r.status !== "cancelled" && !r.outcome; }

  // 今日の予約を「次（またはいま）・押し忘れ・このあと・終わった」に分ける（設計書 §2）
  function classifyDay(rows, now) {
    var nowMs = new Date(now).getTime();
    var list = (rows || []).filter(function (r) { return r && r.status !== "cancelled"; })
      .slice().sort(function (a, b) { return String(a.start_at).localeCompare(String(b.start_at)) || String(a.id).localeCompare(String(b.id)); });
    var current = null, overdue = [], upcoming = [], done = [];
    list.forEach(function (r) {
      var s = new Date(r.start_at).getTime(), e = new Date(r.end_at || r.start_at).getTime();
      if (!isOpen(r)) { done.push(r); return; }
      if (s <= nowMs && nowMs < e) { if (!current) current = r; else overdue.push(r); return; }
      if (s <= nowMs) { overdue.push(r); return; }
      upcoming.push(r);
    });
    var focus = current || upcoming[0] || null;
    var later = current ? upcoming : upcoming.slice(1);
    return { focus: focus, focusIsNow: !!current, overdue: overdue, later: later, done: done };
  }

  // 作られてから24時間以内で、この端末でまだ開いていない予約
  function isNew(r, now, seen) {
    if (!r || !r.created_at || !r.id) return false;
    if (seen && seen[r.id]) return false;
    var age = new Date(now).getTime() - new Date(r.created_at).getTime();
    return age >= 0 && age < 24 * 60 * 60 * 1000;
  }

  // 予約の状態を言葉に（色の種類と一緒に）
  function statusOf(r) {
    if (!r) return { key: "none", label: "" };
    if (r.outcome === "visited") return { key: "ok", label: "来店済み" };
    if (r.outcome === "no_show") return { key: "warn", label: "無断キャンセル" };
    if (r.status === "questionnaire_done") return { key: "ok", label: "問診 済み" };
    if (!r.line_uid && r.source && r.source !== "line") return { key: "sub", label: "電話予約（問診は来店時）", short: "電話予約" };
    if (r.status === "pending_questionnaire" || r.status === "questionnaire_reminded") return { key: "wait", label: "問診 まだ" };
    return { key: "sub", label: "予約済み" };
  }

  // 「〇〇 様」。名前にすでに「様」が付いていれば重ねない。空なら「（名前なし）」
  function honor(name) {
    var n = String(name == null ? "" : name).trim();
    if (!n) return "（名前なし）";
    return /様$/.test(n) ? n : n + " 様";
  }

  function treatmentLabel(t) { return t === "retouch" ? "リタッチ" : (t === "new" ? "新規" : ""); }

  // 要対応かどうか（管理画面の humanNeedsAttention と同じ）
  function needsAttention(s) { return !(s == null || s === "" || s === "done" || s === "対応完了" || s === "返信済み"); }

  // 会話の一覧から「返事が要る・対応中」だけ（返事が要るを先に）
  function pickAttention(rows) {
    var list = (rows || []).filter(function (c) { return c && (c.status === "needs_reply" || c.status === "in_progress"); });
    return list.filter(function (c) { return c.status === "needs_reply"; }).concat(list.filter(function (c) { return c.status === "in_progress"; }));
  }

  // 返事を送ってよいか（管理画面の chatCanSend と同じ条件）
  function canSend(d) {
    return !!d && d.send_enabled === true && d.workflow_enabled === true && d.can_send !== false && !d.blocked && !d.line_uid_missing;
  }

  // 送れない理由を、スタッフに分かる言葉で
  function cannotSendReason(d) {
    if (!d) return "会話を読み込めませんでした。";
    if (d.blocked) return "このお客様はLINEをブロックしているため、送れません。";
    if (d.line_uid_missing) return "LINEとつながっていないお客様です。電話で連絡してください。";
    if (d.send_enabled !== true || d.workflow_enabled !== true) return "この店のLINEの返事は、ここからは送れません。エルメなど、いつもの場所で返事をしてください。";
    if (d.can_send === false) return "いまは送れない状態です。少し待ってから開き直してください。";
    return "";
  }

  // 完了にできるか（管理画面の chatCanComplete と同じ）
  function canComplete(d) { return !!d && d.workflow_enabled === true && d.ai_resume_enabled === true && d.status === "in_progress"; }

  // 休みを押したときにスタッフができること（管理画面の calendarTimeOffAction のスタッフ側）
  function timeOffAction(item, myArtistIds) {
    if (!item) return "none";
    if ((myArtistIds || []).indexOf(item.artist_id) === -1) return "not_own";
    if (item.delete_requested) return "requested";
    if (item.status === "pending") return "withdraw";
    return "request_delete";
  }

  function timeOffStateLabel(item) {
    if (!item) return "";
    if (item.delete_requested) return "削除を申請中";
    if (item.status === "pending") return "承認待ち";
    return "確定";
  }

  // 休みの申請の入力 → add_time_off の引数。おかしければ { error }
  function buildTimeOff(input) {
    var i = input || {};
    if (!i.artist) return { error: "担当のアーティストが決まっていません。管理者に連絡してください。" };
    var start = i.date, end = i.endDate || i.date;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(start || "")) || !/^\d{4}-\d{2}-\d{2}$/.test(String(end || ""))) return { error: "日付を選んでください。" };
    if (end < start) return { error: "終わりの日が、始まりの日より前になっています。" };
    var label = String(i.label || "").trim();
    if (label.length > 50) return { error: "メモは50文字までです。" };
    if (i.allDay) {
      var last = addDays(end, 1);
      var days = Math.round((Date.parse(last) - Date.parse(start)) / 86400000);
      if (days > 31) return { error: "一度に申請できるのは31日までです。" };
      return { payload: { p_artist: i.artist, p_start: start + "T00:00:00+09:00", p_end: last + "T00:00:00+09:00", p_all_day: true, p_label: label || null } };
    }
    if (start !== end) return { error: "時間を決めて休むときは、1日ずつ申請してください。" };
    var st = String(i.startTime || ""), et = String(i.endTime || "");
    if (!/^\d{2}:\d{2}$/.test(st) || !/^\d{2}:\d{2}$/.test(et)) return { error: "始まりと終わりの時刻を選んでください。" };
    if (et <= st) return { error: "終わりの時刻が、始まりの時刻より前になっています。" };
    return { payload: { p_artist: i.artist, p_start: start + "T" + st + ":00+09:00", p_end: start + "T" + et + ":00+09:00", p_all_day: false, p_label: label || null } };
  }

  // 施術メモの選択肢（DB の制約と同じ。20261013130000_treatment_note_v2.sql）
  var NOTE_OPTIONS = Object.freeze({
    technique: ["毛並み", "パウダー", "ミックス"],
    shape: ["平行", "アーチ", "平行アーチ", "自眉に沿って"],
    asymmetry: ["あり", "整えた", "なし"],
    density: ["薄め", "ふつう", "濃いめ"]
  });

  // 施術メモの入力 → save_treatment_note の引数。おかしければ { error }
  function buildNote(resvId, input) {
    var i = input || {};
    function pick(k) { var v = String(i[k] || ""); return v && NOTE_OPTIONS[k].indexOf(v) !== -1 ? v : null; }
    var body = String(i.body || "").trim(), color = String(i.color || "").trim(), next = String(i.next || "").trim();
    if (!resvId) return { error: "予約が選ばれていません。" };
    if (body.length > 2000) return { error: "メモは2000文字までです。" };
    if (color.length > 100) return { error: "色は100文字までです。" };
    if (next.length > 500) return { error: "次回やることは500文字までです。" };
    if (!body && !color && !next && !pick("technique") && !pick("shape") && !pick("asymmetry") && !pick("density")) return { error: "何か1つ入力してください。" };
    return { payload: { p_resv: resvId, p_body: body, p_color: color || null, p_shape: pick("shape"), p_asym: pick("asymmetry"), p_density: pick("density"), p_technique: pick("technique"), p_next: next || null } };
  }


  // ───────── 予約カレンダー・シフト・売上（2026-11-27 スタッフ画面 v2） ─────────

  // メニューの種類（色分け用）：リップ／リタッチ／眉（その他は眉と同じ色）
  function menuKind(menuName, treatmentType) {
    var n = String(menuName || "");
    if (/リップ|唇/.test(n)) return "lip";
    if (treatmentType === "retouch" || /リタッチ/.test(n)) return "retouch";
    return "brow";
  }

  // 一覧や札に出す短いメニュー名（長い正式名は詳細で見せる）
  function menuTag(menuName, treatmentType) {
    var k = menuKind(menuName, treatmentType);
    if (k === "lip") return "リップ";
    if (k === "retouch") return "リタッチ";
    return treatmentType === "new" ? "眉・新規" : "眉";
  }

  // 'YYYY-MM' の月を n か月ずらす
  function addMonths(ym, n) {
    var m = /^(\d{4})-(\d{2})$/.exec(String(ym || ""));
    if (!m) return null;
    var d = new Date(Date.UTC(+m[1], +m[2] - 1 + n, 1));
    return d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1);
  }
  function monthLabel(ym) { var m = /^(\d{4})-(\d{2})$/.exec(String(ym || "")); return m ? m[1] + "年 " + (+m[2]) + "月" : ""; }
  function monthShort(ym) { var m = /^(\d{4})-(\d{2})$/.exec(String(ym || "")); return m ? (+m[2]) + "月" : ""; }

  // 月のカレンダーのマス（日曜はじまり）。前の空きマスは null
  function monthCells(ym) {
    var m = /^(\d{4})-(\d{2})$/.exec(String(ym || ""));
    if (!m) return [];
    var y = +m[1], mo = +m[2];
    var first = new Date(Date.UTC(y, mo - 1, 1)).getUTCDay();
    var last = new Date(Date.UTC(y, mo, 0)).getUTCDate();
    var out = [];
    for (var i = 0; i < first; i++) out.push(null);
    for (var d = 1; d <= last; d++) out.push({ day: d, date: ym + "-" + pad(d), wd: (first + d - 1) % 7 });
    return out;
  }
  function monthRange(ym) { var f = ym + "-01"; return { from: f + "T00:00:00+09:00", to: addMonths(ym, 1) + "-01T00:00:00+09:00" }; }

  // その日のシフト（管理画面・予約と同じ決まり）：
  //   シフトの行が1件も無い人＝制限なし（unset）。個別日（date）があればそれだけ、無ければ曜日（weekly）。どちらも無ければ休み。
  function shiftForDay(rows, date) {
    var list = rows || [];
    if (!list.length) return { kind: "unset" };
    var wd = new Date(date + "T00:00:00Z").getUTCDay();
    var day = list.filter(function (r) { return r.kind === "date" && r.shift_date === date; });
    if (!day.length) day = list.filter(function (r) { return r.kind === "weekly" && +r.day_of_week === wd; });
    var work = day.filter(function (r) { return !r.is_off && r.start_time && r.end_time; });
    if (!work.length) return { kind: "off" };
    work.sort(function (a, b) { return String(a.start_time).localeCompare(String(b.start_time)); });
    return { kind: "work", start: String(work[0].start_time).slice(0, 5), end: String(work[work.length - 1].end_time).slice(0, 5) };
  }

  // シフト提出の入力（日ごと）→ submit_shift の days。出勤の日だけ時刻を入れる。おかしければ { error }
  function buildShiftDays(ym, entries) {
    var out = [], seen = {};
    var list = entries || [];
    if (!list.length) return { error: "日にちが1つもありません。" };
    for (var i = 0; i < list.length; i++) {
      var e = list[i] || {};
      if (String(e.date || "").slice(0, 7) !== ym) return { error: "その月の日にちだけ入れられます。" };
      if (seen[e.date]) return { error: "同じ日が2回入っています。" };
      seen[e.date] = 1;
      if (e.off) { out.push({ date: e.date, is_off: true }); continue; }
      if (!/^\d{2}:\d{2}$/.test(String(e.start || "")) || !/^\d{2}:\d{2}$/.test(String(e.end || ""))) return { error: dayLabel(e.date) + " の時刻を入れてください。" };
      if (e.end <= e.start) return { error: dayLabel(e.date) + " の終わりが始まりより前です。" };
      out.push({ date: e.date, is_off: false, start_time: e.start, end_time: e.end });
    }
    return { days: out };
  }

  function submissionLabel(s) {
    if (!s) return "";
    return { pending: "確定待ち", approved: "確定", rejected: "見送り", withdrawn: "取り下げ" }[s.status] || "";
  }

  // 金額の表示
  function yen(n) { var v = Math.round(Number(n) || 0); return "¥" + String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ","); }

  // 売上の報告（save_checkout の引数）。管理画面と同じ選択肢・決まり
  var PAY_METHODS = ["現金", "カード", "QR決済", "振込", "先払い済み", "その他"];
  var DIFF_REASONS = ["指名料", "クーポン", "部位の追加", "割引", "その他"];
  function buildCheckout(resv, input) {
    var r = resv || {}, i = input || {};
    var amount = Number(String(i.amount == null ? "" : i.amount).replace(/[,¥\s]/g, ""));
    if (!r.id) return { error: "お客様が選ばれていません。" };
    if (!isFinite(amount) || amount < 0 || Math.floor(amount) !== amount) return { error: "金額を数字で入れてください。" };
    if (amount > 10000000) return { error: "金額が大きすぎます。" };
    if (PAY_METHODS.indexOf(i.method) === -1) return { error: "支払い方法を選んでください。" };
    var differs = r.price != null && Number(r.price) !== amount;
    if (differs && DIFF_REASONS.indexOf(i.reason) === -1) return { error: "予約の金額と違うので、理由を選んでください。" };
    var paid = /^\d{4}-\d{2}-\d{2}$/.test(String(i.paidOn || "")) ? i.paidOn : ymd(r.start_at);
    return { payload: { p_resv: r.id, p_amount: amount, p_reason: differs ? i.reason : null, p_note: String(i.note || "").trim() || null, p_method: i.method, p_paid_on: paid, p_self: false } };
  }

  // サーバーから返ったエラーの言葉 → スタッフに分かる文（[含まれる言葉, 文] の順に照合）
  var ERROR_TEXTS = [
    ["daily_limit_missing", "この店のLINEの1日に送れる数が、まだ決まっていません。管理者に頼んでください。"],
    ["daily_send_limit_reached", "今日この画面から送れる数の上限に達しました。LINE公式アカウントのアプリから返事をしてください。"],
    ["chat_send_disabled", "この店のLINEの返事は、ここからは送れません。エルメなど、いつもの場所で返事をしてください。"],
    ["channel_not_resolved", "どのLINEから送るかが決まっていません。管理者に頼んでください。"],
    ["friend_blocked", "このお客様はLINEをブロックしているため、送れません。"],
    ["line_uid_missing", "LINEとつながっていないお客様です。電話で連絡してください。"],
    ["attempt_in_progress", "同じ返事を送っているところです。少し待って開き直してください。"],
    ["unresolved_delivery", "送れたか分からない返事が残っています。管理画面で確かめてから開き直してください。"],
    ["conversation_not_open", "この会話の状態が変わりました。開き直してください。"],
    ["chat_inbox_disabled", "この店では、LINE の会話をこの画面で見る設定がまだ入っていません。管理者に頼んでください。"],
    ["forbidden_not_own_artist", "自分の担当の分だけ出せます。"],
    ["invalid_month", "提出できるのは今月から12か月先までです。"],
    ["invalid_days", "シフトの中身に正しくない日があります。"],
    ["not_pending", "すでに確定か取り下げになっています。開き直してください。"],
    ["checkout_staff_already_saved", "この会計はもう報告済みです。直すときは管理者に頼んでください。"],
    ["checkout_not_visited", "来店済みになっていないお客様です。先に来店済みにしてください。"],
    ["checkout_settled", "この月は締めが終わっています。管理者に頼んでください。"],
    ["checkout_disabled", "この店はまだ売上の報告を使っていません。"],
    ["checkout_reason_required", "予約の金額と違うので、理由を選んでください。"],
    ["checkout_paid_before_start", "支払い日が、売上の報告を始めた日より前です。"],
    ["time_off_not_own_artist", "自分の担当の休みだけ申請できます。"],
    ["forbidden_store", "この店の操作をする権限がありません。"],
    ["forbidden", "この操作をする権限がありません。"],
    ["invalid_range", "期間が正しくありません（31日まで）。"],
    ["invalid_label", "メモは50文字までです。"],
    ["bad_outcome", "記録の種類が正しくありません。"],
    ["invalid_" + "token", "ログインの期限が切れました。もう一度ログインしてください。"],
    ["bad_origin", "この住所の画面からは会話を開けません。公開された画面から開いてください。"],
    ["version_conflict", "ほかの人が先に操作しました。開き直してから、もう一度お試しください。"],
    ["inbound_conflict", "お客様から新しいメッセージが届きました。読んでから、もう一度お試しください。"],
    ["unresolved_delivery", "送信の結果がまだ分からないメッセージがあります。少し待ってからお試しください。"],
    ["medical_confirmation_required", "医療に関わる言葉が入っています。内容を確かめてから送ってください。"],
    ["line_not_linked", "LINEとつながっていないお客様です。"],
    ["conversation_not_found", "会話が見つかりませんでした。"]
  ];
  function errorText(code) {
    var c = String(code || "");
    for (var i = 0; i < ERROR_TEXTS.length; i++) { if (c.indexOf(ERROR_TEXTS[i][0]) !== -1) return ERROR_TEXTS[i][1]; }
    return "うまくいきませんでした。通信を確かめて、もう一度お試しください。";
  }


  // ===== 色を選ぶ（2026-11-27 松村さん）=====
  // はっきりした色（原色）を選ぶと、帯・ボタン・すりガラス・文字の色を落ち着いた色味の一式に整える。
  // 白い文字・地の上の文字は、読みやすさ 4.5:1 以上になるまで自動で濃くする。
  // 「返事が必要」の赤・「売上の入れ忘れ」の金・メニューの色は意味のある色なので、ここでは変えない。
  var THEMES = [
    { key: "mauve", label: "標準", h: 297, v: 1 }, { key: "red", label: "赤", h: 355, v: 1.7 }, { key: "orange", label: "オレンジ", h: 22, v: 1.5 },
    { key: "yellow", label: "黄", h: 45, v: 1.5 }, { key: "green", label: "緑", h: 140, v: 1.3 }, { key: "aqua", label: "水色", h: 192, v: 1.5 },
    { key: "blue", label: "青", h: 222, v: 1.5 }, { key: "purple", label: "紫", h: 265, v: 1.3 }, { key: "pink", label: "ピンク", h: 330, v: 1.6 }
  ];
  function hslHex(h, s, l) {
    s /= 100; l /= 100;
    var a = s * Math.min(l, 1 - l);
    function f(n) { var k = (n + h / 30) % 12; return l - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1))); }
    return "#" + [f(0), f(8), f(4)].map(function (x) { return ("0" + Math.round(x * 255).toString(16)).slice(-2); }).join("");
  }
  function luminance(hex) {
    var v = [1, 3, 5].map(function (i) { var x = parseInt(String(hex).substr(i, 2), 16) / 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); });
    return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
  }
  function contrast(a, b) { var x = luminance(a), y = luminance(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
  function fitDark(h, s, l, bg, need) { var c = hslHex(h, s, l); while (contrast(c, bg) < need && l > 4) { l -= 1; c = hslHex(h, s, l); } return c; }
  // 保存された値を安全な範囲に直す（壊れていたら標準）
  function normalizeTheme(t) {
    var h = t && typeof t.h === "number" ? t.h : NaN, v = t && typeof t.v === "number" ? t.v : NaN;
    if (!isFinite(h) || !isFinite(v)) return { h: THEMES[0].h, v: THEMES[0].v };
    return { h: ((Math.round(h) % 360) + 360) % 360, v: Math.min(2, Math.max(0.5, Math.round(v * 100) / 100)) };
  }
  // 色相 h（0〜359）と鮮やかさ v（0.5〜2）から、画面の色の一式を作る。返すのは CSS の変数名→色
  function buildTheme(t) {
    t = normalizeTheme(t);
    var h = t.h, v = t.v;
    function S(x) { return Math.min(85, x * v); }
    var ground = hslHex(h, S(30), 96.5);
    return {
      "band1": hslHex(h, S(24), 19), "band2": fitDark(h, S(18), 37, "#ffffff", 5.5), "band3": hslHex(h, S(14), 58), "band-sub": hslHex(h, S(30), 91),
      "ground": ground, "ground2": hslHex(h, S(24), 92.5),
      "vio": fitDark(h, S(18), 42, "#ffffff", 4.6), "vio-deep": hslHex(h, S(24), 31), "vio-soft": hslHex(h, S(32), 93.5), "vio-glow": hslHex(h, S(42), 90),
      "ink": hslHex(h, S(18), 15), "ink2": hslHex(h, S(14), 26), "sub": fitDark(h, S(8), 42, ground, 4.6), "faint": hslHex(h, S(8), 71), "well": hslHex(h, S(24), 95), "well2": hslHex(h, S(18), 89),
      "btn1": fitDark(h, S(18), 50, "#ffffff", 4.5), "btn2": hslHex(h, S(22), 33),
      "pill1": fitDark(h, S(20), 46, "#ffffff", 4.5), "pill2": fitDark(h, S(16), 52, "#ffffff", 4.5), "today1": hslHex(h, S(18), 56)
    };
  }

  root.StaffLogic = {
    jst: jst, ymd: ymd, addDays: addDays, dayRange: dayRange, hhmm: hhmm, dayLabel: dayLabel,
    classifyDay: classifyDay, isNew: isNew, statusOf: statusOf, treatmentLabel: treatmentLabel, honor: honor,
    needsAttention: needsAttention, pickAttention: pickAttention, canSend: canSend, cannotSendReason: cannotSendReason, canComplete: canComplete,
    timeOffAction: timeOffAction, timeOffStateLabel: timeOffStateLabel, buildTimeOff: buildTimeOff,
    NOTE_OPTIONS: NOTE_OPTIONS, buildNote: buildNote, errorText: errorText,
    menuKind: menuKind, menuTag: menuTag, addMonths: addMonths, monthLabel: monthLabel, monthShort: monthShort, monthCells: monthCells, monthRange: monthRange,
    shiftForDay: shiftForDay, buildShiftDays: buildShiftDays, submissionLabel: submissionLabel, yen: yen,
    PAY_METHODS: PAY_METHODS, DIFF_REASONS: DIFF_REASONS, buildCheckout: buildCheckout,
    THEMES: THEMES, hslHex: hslHex, contrast: contrast, normalizeTheme: normalizeTheme, buildTheme: buildTheme
  };
})(typeof globalThis !== "undefined" ? globalThis : this);
