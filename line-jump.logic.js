/* TikTok などのアプリ内ブラウザから LINE の友だち追加へ進むための案内ページ（line-jump.html）の判定ロジック。
 * なぜ要るか：TikTok の中のブラウザでは LINE が開けず「ブラウザで開いてください」で止まる（2026-11-03 実機で確認）。
 *   外のブラウザ（Safari / Chrome）へ移ってから、エルメの流入元リンクを開く。流入元の数え方は今までどおり。
 * 守り：行き先は下の3つだけ（どこへでも飛ばせるページにしない）。 */
(function (root) {
  "use strict";
  var TARGETS = Object.freeze({
    yuumi: Object.freeze({ key: "yuumi", label: "yuumi", url: "https://s.lmes.jp/landing-qr/1661241635-J064yePx?uLand=QBKaYp" }), // 久留米「yuumiTikTok流入」
    maho: Object.freeze({ key: "maho", label: "maho", url: "https://s.lmes.jp/landing-qr/1661241635-J064yePx?uLand=C48RrY" }),   // 久留米「まほちゃん流入tiktok」
    utan: Object.freeze({ key: "utan", label: "遠山うたの", url: "https://s.lmes.jp/landing-qr/2003826188-OLkM8mrk?uLand=iLzZzT" }), // 薬院「遠山TikTok URL」
  });

  function resolveTarget(search) {
    var m = /^\??(?:.*&)?to=([A-Za-z]+)(?:&|$)/.exec(String(search || ""));
    if (!m) return null;
    var k = m[1].toLowerCase();
    return Object.prototype.hasOwnProperty.call(TARGETS, k) ? TARGETS[k] : null;
  }

  function detect(ua) {
    var s = String(ua || "");
    var os = /iPhone|iPad|iPod/.test(s) ? "ios" : /Android/.test(s) ? "android" : "other";
    var app = /BytedanceWebview|musical_ly|trill_|TikTok/i.test(s) ? "tiktok"
      : /Instagram/.test(s) ? "instagram"
      : /FBAN|FBAV|FB_IAB/.test(s) ? "facebook"
      : /com\.google\.ios\.youtube|YouTube/.test(s) ? "youtube"
      : /\bLine\//.test(s) ? "line"
      : "";
    return { os: os, app: app, inApp: app !== "" };
  }

  function isAllowed(url) {
    for (var k in TARGETS) if (Object.prototype.hasOwnProperty.call(TARGETS, k) && TARGETS[k].url === url) return true;
    return false;
  }

  function plan(ua, target) {
    if (!isAllowed(target)) return null;
    var d = detect(ua);
    if (!d.inApp) return { mode: "direct", href: target };
    if (d.os === "android") {
      var rest = target.replace(/^https:\/\//, "");
      return {
        mode: "android_intent",
        href: "intent://" + rest + "#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=" + encodeURIComponent(target) + ";end",
        fallback: target,
      };
    }
    if (d.os === "ios") return { mode: "ios_safari", href: "x-safari-" + target, fallback: target };
    return { mode: "direct", href: target };
  }

  root.LineJump = { TARGETS: TARGETS, resolveTarget: resolveTarget, detect: detect, plan: plan };
})(typeof globalThis !== "undefined" ? globalThis : this);
