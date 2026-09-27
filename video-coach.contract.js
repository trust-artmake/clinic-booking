"use strict";
(function (root) {
  const uuid = (x) =>
    typeof x === "string" &&
    /^[\da-f]{8}(-[\da-f]{4}){3}-[\da-f]{12}$/i.test(x);
  function buildRequest(action, s = {}) {
    const r = { action };
    if (
      ![
        "create_session",
        "list_sessions",
        "sign_reference",
        "release_remote_lock",
      ].includes(action)
    ) {
      if (!uuid(s.session_id)) throw Error("回を選び直してください");
      r.session_id = s.session_id;
    }
    switch (action) {
      case "create_session":
      case "update_inputs":
        if (
          !s.inputs || !Array.isArray(s.inputs.worries) ||
          typeof s.inputs.visibility !== "string" ||
          typeof s.inputs.for_ads !== "boolean"
        ) throw Error("入力を確認してください");
        r.inputs = s.inputs;
        break;
      case "sign_upload":
        if (
          !s.clip ||
          !["duration", "width", "height", "size_bytes"].every((k) =>
            Number.isFinite(s.clip[k]) && s.clip[k] > 0
          ) || !/^[a-f0-9]{64}$/.test(s.clip.sha256) ||
          typeof s.clip.mime_type !== "string"
        ) throw Error("素材の情報を確認してください");
        r.clip = s.clip;
        break;
      case "retry_clip":
        if (!uuid(s.clip_id)) throw Error("素材を確認してください");
        r.clip_id = s.clip_id;
        break;
      case "sign_reference":
        if (typeof s.reference_id !== "string" || !s.reference_id) {
          throw Error("参考を確認してください");
        }
        r.reference_id = s.reference_id;
        break;
      case "feedback":
        if (
          !uuid(s.plan_id) ||
          !["use", "adjust", "reject"].includes(s.verdict) ||
          typeof (s.note ?? "") !== "string"
        ) throw Error("感想を確認してください");
        Object.assign(r, {
          plan_id: s.plan_id,
          verdict: s.verdict,
          note: s.note ?? "",
        });
        break;
      case "delete_session":
        if (s.confirm !== true) throw Error("削除の確認が必要です");
        r.confirm = true;
        break;
      case "advance":
      case "compose":
      case "get_plan":
      case "get_session":
      case "list_sessions":
      case "reset_session_error":
      case "release_remote_lock":
        break;
      default:
        throw Error("操作が不正です");
    }
    return r;
  }
  function createTransport({ mock, client, fetcher = fetch, base, key }) {
    return async (action, state) => {
      if (mock) throw Error("模擬モードでは通信しません");
      const body = buildRequest(action, state),
        { data, error } = await client.auth.getSession();
      if (error || !data.session) {
        throw Object.assign(Error("ログインしてください"), { status: 401 });
      }
      const response = await fetcher(base + "/functions/v1/video-coach", {
        method: "POST",
        signal: AbortSignal.timeout(420000),
        headers: {
          "Content-Type": "application/json",
          apikey: key,
          Authorization: "Bearer " + data.session.access_token,
        },
        body: JSON.stringify(body),
      });
      const result = await response.json().catch(() => ({
        error: "応答を読み取れませんでした。時間を置いて再開してください",
      }));
      if (!response.ok) {
        throw Object.assign(
          Error(result.error || "処理を完了できませんでした"),
          { status: response.status, retry_after: result.retry_after },
        );
      }
      return result;
    };
  }
  function signedURL(s) {
    const url = s?.url ?? s?.signedURL ?? s?.signedUrl;
    if (typeof url !== "string" || !/^https:\/\//.test(url)) {
      throw Error("閲覧URLを取得できませんでした");
    }
    return url;
  }
  function errorMessage(error) {
    if (["TypeError", "TimeoutError", "AbortError"].includes(error.name)) {
      return "通信が止まりました。電波の良い場所で再開してください。";
    }
    if ([401, 403].includes(error.status)) {
      return "利用登録・ログインを確認してください。この店舗にはアクセスできません。";
    }
    if ([402, 429].includes(error.status) || error.status >= 500) {
      return "読み取りサービスが一時停止中（管理者へ連絡）。" +
        (error.message || "");
    }
    return error.message ||
      "処理を完了できませんでした。もう一度お試しください。";
  }
  root.VIDEO_COACH_CONTRACT = {
    buildRequest,
    createTransport,
    signedURL,
    errorMessage,
  };
})(typeof window === "undefined" ? globalThis : window);
