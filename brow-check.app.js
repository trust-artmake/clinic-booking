(function () {
  "use strict";

  const B = window.BrowCheck;
  if (!B) return;

  const ASSET_VERSIONS = Object.freeze({
    "bg.png": "66627ac05b",
    "bg.webp": "5144bb6fce",
    "face-base.png": "be57dffebf",
    "face-base.webp": "fe20e293e4",
    "face-long.png": "a4ce6bbd81",
    "face-long.webp": "4c72910109",
    "face-oval.png": "c139aa9679",
    "face-oval.webp": "314aa6020d",
    "face-round.png": "29e3e6f134",
    "face-round.webp": "219aefec4c",
    "hero-wide.png": "89036406f4",
    "hero-wide.webp": "476461b985",
    "hero.png": "c69e899ac6",
    "hero.webp": "1dbdcafddc",
    "icon-color.png": "653b7c16f2",
    "icon-color.webp": "5503b5e757",
    "icon-prep.png": "b837ef22b1",
    "icon-prep.webp": "a6442b9db0",
    "icon-shape.png": "aae28925cb",
    "icon-shape.webp": "5dda11bff1",
    "mood-natural.png": "59557c01ef",
    "mood-natural.webp": "646df90e77",
    "mood-sharp.png": "27ffea229b",
    "mood-sharp.webp": "95aec7c75c",
    "mood-soft.png": "5142f0aa9a",
    "mood-soft.webp": "8cf936062c",
    "result-card-agari.png": "e6c5079df8",
    "result-card-agari.webp": "8ef20ae626",
    "result-card-arch.png": "f25aadb3fe",
    "result-card-arch.webp": "86dadef23a",
    "result-card-heiko.png": "021fe79580",
    "result-card-heiko.webp": "b4e9c9a15e",
    "result-card-heiko_arch.png": "e43d642172",
    "result-card-heiko_arch.webp": "ea6d0c3a3e",
    "result-card-sagari.png": "6896a5e33e",
    "result-card-sagari.webp": "957213b045",
    "result-card-straight.png": "cf9dfa145c",
    "result-card-straight.webp": "9a0f70283d",
    "remain-none.png": "d9bb4f2eb0",
    "remain-none.webp": "2bae8c63bd",
    "remain-partial_end.png": "50d26897e1",
    "remain-partial_end.webp": "6170fe1f9b",
    "remain-patch.png": "fc0095d95a",
    "remain-patch.webp": "b89d086878",
    "remain-sparse.png": "6836694eb2",
    "remain-sparse.webp": "fbf31d74f0",
    "shape-agari.png": "b16d99c3bb",
    "shape-agari.webp": "cc8da39d63",
    "shape-arch.png": "f2f7a480be",
    "shape-arch.webp": "c00fce2814",
    "shape-heiko.png": "b3eccfd096",
    "shape-heiko.webp": "b9a28be3eb",
    "shape-heiko_arch.png": "af8d1371c9",
    "shape-heiko_arch.webp": "a05b93c635",
    "shape-sagari.png": "de659e1e16",
    "shape-sagari.webp": "b314f72e07",
    "shape-straight.png": "4adcad084b",
    "shape-straight.webp": "9c9986deed",
    "swatch-brownblack.png": "dba9d27bee",
    "swatch-brownblack.webp": "9a76eff18a",
    "swatch-dark.png": "97ff3f9693",
    "swatch-dark.webp": "8f86acdf49",
    "swatch-light.png": "32196565e4",
    "swatch-light.webp": "48941c919a",
    "swatch-medium.png": "a648e58bc7",
    "swatch-medium.webp": "ee7aa2ae6e",
    "texture-coarse.png": "c6a9b03f71",
    "texture-coarse.webp": "31d55fa04f",
    "texture-fine.png": "339aab3050",
    "texture-fine.webp": "298cc8f86d",
  });

  function assetUrl(file) {
    return "brow-check-img/" + file + "?v=" + ASSET_VERSIONS[file];
  }

  const ARTISTS = {
    // 2026-10-21 エルメ（Dion久留米店）のQRコードアクション「眉診断_〇〇」。追加時に yuumi流入＋眉診断_〇〇 タグ・yuumi用ステップ開始・メニュー表示
    yuumi: { label: "yuumi", lineUrls: { heiko: "https://s.lmes.jp/landing-qr/1661241635-J064yePx?uLand=hsMwEt", straight: "https://s.lmes.jp/landing-qr/1661241635-J064yePx?uLand=5SGA1r", arch: "https://s.lmes.jp/landing-qr/1661241635-J064yePx?uLand=wnW392", heiko_arch: "https://s.lmes.jp/landing-qr/1661241635-J064yePx?uLand=FaGksn", agari: "https://s.lmes.jp/landing-qr/1661241635-J064yePx?uLand=izEDVC", sagari: "https://s.lmes.jp/landing-qr/1661241635-J064yePx?uLand=ZOh5np" } },
  };
  const screens = {
    hero: document.getElementById("heroScreen"),
    question: document.getElementById("questionScreen"),
    loading: document.getElementById("loadingScreen"),
    result: document.getElementById("resultScreen"),
  };
  const artist = B.resolveArtist(ARTISTS, window.location.search);
  const stateUrl = window.location.pathname + window.location.search;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let answers = {};
  let step = 0;
  let choiceTimer = 0;
  let loadingTimer = 0;

  const byId = (id) => document.getElementById(id);
  const startButtons = document.querySelectorAll("[data-start-check]");
  window.addEventListener("load", () => {
    byId("browFonts").media = "all";
  }, { once: true });
  byId("signature").textContent = "Trust Artmake ｜ " + ARTISTS[artist].label;

  function clearTimers() {
    window.clearTimeout(choiceTimer);
    window.clearTimeout(loadingTimer);
  }

  function showScreen(name) {
    for (const [screenName, screen] of Object.entries(screens)) {
      screen.hidden = screenName !== name;
    }
    document.body.dataset.view = name;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }

  function focusAfterPaint(element) {
    window.requestAnimationFrame(() => element.focus({ preventScroll: true }));
  }

  function setHistory(view, nextStep, mode) {
    window.history[mode]({ browCheck: true, view, step: nextStep }, "", stateUrl);
  }

  function imageName(questionId, value) {
    return questionId + "-" + value;
  }

  function makePicture(name, alt, width, height, className) {
    const picture = document.createElement("picture");
    picture.className = className;
    const source = document.createElement("source");
    source.type = "image/webp";
    source.srcset = assetUrl(name + ".webp");
    const image = document.createElement("img");
    image.src = assetUrl(name + ".png");
    image.alt = alt;
    image.width = width;
    image.height = height;
    image.loading = "lazy";
    picture.append(source, image);
    return picture;
  }

  const SPEC_ROWS = [
    ["カーブ", "curve"],
    ["長さ", "length"],
    ["太さ", "thickness"],
  ];
  const PHRASE_BREAKS = {
    "親しみやすいナチュラル眉": ["親しみやすい", "ナチュラル眉"],
    "すっきり知的な直線眉": ["すっきり知的な", "直線眉"],
    "上品な曲線を描くアーチ眉": ["上品な曲線を描く", "アーチ眉"],
    "自然になじむ今っぽ眉": ["自然になじむ", "今っぽ眉"],
    "凛と華やぐ上がり眉": ["凛と華やぐ", "上がり眉"],
    "ふんわり優しげな下がり眉": ["ふんわり優しげな", "下がり眉"],
  };

  function appendPhrases(target, text) {
    target.textContent = "";
    const parts = PHRASE_BREAKS[text] || [text];
    parts.forEach((part) => {
      const phrase = document.createElement("span");
      phrase.className = "phrase";
      phrase.textContent = part;
      target.appendChild(phrase);
    });
  }

  function renderSpecMeters(spec, target) {
    target.textContent = "";
    const values = [spec.curve, spec.length, spec.thickness];
    SPEC_ROWS.forEach(([label], index) => {
      const row = document.createElement("div");
      row.className = "spec-meter";
      row.setAttribute("aria-label", label + " 5段階中" + values[index]);
      const name = document.createElement("span");
      name.textContent = label;
      const dots = document.createElement("span");
      dots.className = "spec-dots";
      dots.setAttribute("aria-hidden", "true");
      for (let dotIndex = 1; dotIndex <= 5; dotIndex += 1) {
        const dot = document.createElement("i");
        if (dotIndex <= values[index]) dot.className = "is-filled";
        dots.appendChild(dot);
      }
      row.append(name, dots);
      target.appendChild(row);
    });
  }

  function renderMoodScale(mood, target) {
    target.textContent = "";
    const scale = document.createElement("div");
    scale.className = "mood-scale";
    scale.setAttribute("aria-label", "印象は5段階中" + mood + "。1がやわらか、5がきりっと");
    const soft = document.createElement("span");
    soft.textContent = "やわらか";
    const line = document.createElement("span");
    line.className = "mood-scale-line";
    const marker = document.createElement("i");
    marker.style.left = ((mood - 1) * 25) + "%";
    line.appendChild(marker);
    const sharp = document.createElement("span");
    sharp.textContent = "きりっと";
    scale.append(soft, line, sharp);
    target.appendChild(scale);
  }

  function renderFaceMatches(faces, target) {
    target.textContent = "";
    faces.forEach((face) => {
      const item = document.createElement("div");
      item.className = "face-match";
      item.appendChild(makePicture(face.image, "", 400, 480, "face-match-picture"));
      const label = document.createElement("span");
      label.textContent = face.label;
      item.appendChild(label);
      target.appendChild(item);
    });
  }

  function renderTypeCards() {
    const rail = byId("typeRail");
    rail.textContent = "";
    B.SHAPE_TYPES.forEach((shape, index) => {
      const card = document.createElement("article");
      card.className = "type-card";

      const number = document.createElement("span");
      number.className = "type-number";
      number.textContent = String(index + 1).padStart(2, "0");
      const nickname = document.createElement("h3");
      nickname.className = "phrase-group";
      appendPhrases(nickname, shape.nickname);
      const formalName = document.createElement("p");
      formalName.className = "type-formal-name";
      formalName.textContent = shape.name;

      const measure = document.createElement("div");
      measure.className = "type-brow-measure";
      measure.appendChild(makePicture("shape-" + shape.id, shape.name + "の目元イメージ", 1200, 710, "type-brow-picture"));
      for (const className of ["head", "peak", "tail"]) {
        const point = document.createElement("i");
        point.className = "type-measure-point is-" + className;
        point.setAttribute("aria-hidden", "true");
        const coordinates = shape.measure[className];
        point.style.left = (coordinates.x / 12) + "%";
        point.style.top = (coordinates.y / 7.1) + "%";
        measure.appendChild(point);
      }
      measure.style.setProperty("--measure-head-x", (shape.measure.head.x / 12) + "%");
      measure.style.setProperty("--measure-tail-x", (shape.measure.tail.x / 12) + "%");
      const angle = document.createElement("span");
      angle.className = "type-angle";
      angle.textContent = "眉山 " + shape.peakAngle + "°";
      // 札は写真の外（タイプ名の行の右）に置く＝眉を隠さない（2026-10-21 仁義さん）
      const nameRow = document.createElement("div");
      nameRow.className = "type-name-row";
      nameRow.append(formalName, angle);

      const meters = document.createElement("div");
      meters.className = "spec-meters";
      renderSpecMeters(shape.spec, meters);
      const mood = document.createElement("div");
      renderMoodScale(shape.mood, mood);

      const faceBlock = document.createElement("div");
      faceBlock.className = "type-face-block";
      const faceTitle = document.createElement("h4");
      faceTitle.textContent = "相性のいい顔型";
      const faceList = document.createElement("div");
      faceList.className = "face-match-list";
      renderFaceMatches(B.facesForShape(shape.id), faceList);
      faceBlock.append(faceTitle, faceList);

      const aliases = document.createElement("div");
      aliases.className = "alias-list";
      shape.aliases.forEach((alias) => {
        const tag = document.createElement("span");
        tag.textContent = alias;
        aliases.appendChild(tag);
      });

      card.append(number, nickname, nameRow, measure, meters, mood, faceBlock, aliases);
      rail.appendChild(card);
    });

    const dots = byId("typeRailDots");
    dots.textContent = "";
    B.SHAPE_TYPES.forEach((shape, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", shape.name + "を表示");
      dot.addEventListener("click", () => {
        rail.children[index].scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "nearest", inline: "start" });
      });
      dots.appendChild(dot);
    });
    updateTypeRailDots();
    rail.addEventListener("scroll", updateTypeRailDots, { passive: true });
  }

  function updateTypeRailDots() {
    const rail = byId("typeRail");
    const dots = Array.from(byId("typeRailDots").children);
    const cards = Array.from(rail.children);
    if (!cards.length) return;
    const railCenter = rail.scrollLeft + rail.clientWidth / 2;
    let active = 0;
    let nearest = Infinity;
    cards.forEach((card, index) => {
      const distance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - railCenter);
      if (distance < nearest) {
        nearest = distance;
        active = index;
      }
    });
    dots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === active);
      dot.setAttribute("aria-current", index === active ? "true" : "false");
    });
  }

  function initHeroMapping() {
    const heroModel = document.querySelector(".hero-model");
    const heroImage = byId("heroImage");
    const reveal = async () => {
      try {
        if (typeof heroImage.decode === "function") await heroImage.decode();
      } catch (_) {
        // 読み込み完了後にデコードだけ失敗した場合も、表示可能な画像なら線を重ねる。
      }
      if (heroImage.naturalWidth > 0) heroModel.classList.add("is-image-ready");
    };
    if (heroImage.complete) reveal();
    else heroImage.addEventListener("load", reveal, { once: true });
  }

  function renderProgress() {
    const track = byId("progressTrack");
    track.textContent = "";
    B.QUESTIONS.forEach((question, index) => {
      const segment = document.createElement("span");
      if (index <= step) segment.className = "is-active";
      track.appendChild(segment);
    });
  }

  function renderQuestion(shouldFocus) {
    clearTimers();
    const question = B.QUESTIONS[step];
    if (!question) return restart();
    renderProgress();
    byId("questionNumber").textContent = "Q" + (step + 1) + " / " + B.QUESTIONS.length;
    appendPhrases(byId("questionTitle"), question.text);
    byId("questionHint").textContent = question.hint;
    byId("backButton").hidden = step === 0;

    const panel = document.querySelector(".question-panel");
    panel.dataset.question = question.id;
    const grid = byId("optionGrid");
    grid.textContent = "";
    grid.dataset.count = String(question.options.length);

    question.options.forEach((option, optionIndex) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "option-card";
      button.setAttribute("aria-pressed", String(answers[question.id] === option.value));

      const dimensions = question.id === "face" ? [400, 480]
        : question.id === "texture" || question.id === "remain" ? [600, 300] : [600, 400];
      button.appendChild(makePicture(
        imageName(question.id, option.value),
        option.label + "のイメージ",
        dimensions[0],
        dimensions[1],
        "option-picture",
      ));

      const label = document.createElement("span");
      label.className = "option-label";
      label.textContent = option.label;
      button.appendChild(label);

      if (option.hint) {
        const hint = document.createElement("span");
        hint.className = "option-hint";
        // 「・」の区切りでだけ改行させる（1文字だけ次の行に落ちないように）
        option.hint.split("・").forEach((part, i) => {
          if (i) hint.append("・");
          const piece = document.createElement("span");
          piece.textContent = part;
          hint.append(piece);
        });
        button.appendChild(hint);
      }

      const choice = document.createElement("span");
      choice.className = "option-choice";
      choice.setAttribute("aria-hidden", "true");
      choice.textContent = String.fromCharCode(65 + optionIndex);
      button.appendChild(choice);

      button.addEventListener("click", () => choose(question.id, option.value, button));
      grid.appendChild(button);
    });

    showScreen("question");
    if (shouldFocus) focusAfterPaint(byId("questionTitle"));
  }

  function choose(questionId, value, selectedButton) {
    answers[questionId] = value;
    const buttons = byId("optionGrid").querySelectorAll("button");
    buttons.forEach((button) => {
      button.disabled = true;
      button.setAttribute("aria-pressed", String(button === selectedButton));
    });

    choiceTimer = window.setTimeout(() => {
      if (step < B.QUESTIONS.length - 1) {
        step += 1;
        setHistory("question", step, "pushState");
        renderQuestion(true);
      } else {
        setHistory("loading", step, "pushState");
        renderLoading();
      }
    }, reducedMotion.matches ? 20 : 250);
  }

  function hasCompleteAnswers() {
    return B.QUESTIONS.every((question) => typeof answers[question.id] === "string");
  }

  function renderLoading() {
    clearTimers();
    if (!hasCompleteAnswers()) return restart();
    showScreen("loading");
    focusAfterPaint(document.querySelector(".loading-content"));
    loadingTimer = window.setTimeout(() => {
      setHistory("result", step, "replaceState");
      renderResult(true);
    }, reducedMotion.matches ? 200 : 900);
  }

  function updateLineButton(shapeId) {
    const button = byId("lineButton");
    const label = byId("lineButtonLabel");
    const url = B.lineUrlFor(ARTISTS, artist, shapeId);
    if (url) {
      button.href = url;
      button.rel = "noopener";
      button.classList.remove("is-disabled");
      button.setAttribute("aria-disabled", "false");
      label.textContent = "LINEで診断結果を受け取る";
    } else {
      button.removeAttribute("href");
      button.removeAttribute("rel");
      button.classList.add("is-disabled");
      button.setAttribute("aria-disabled", "true");
      label.textContent = "LINE での受け取りは準備中です";
    }
  }

  function renderResult(shouldFocus) {
    clearTimers();
    const shape = B.shapeById(B.decideShape(answers.face, answers.mood));
    const color = B.decideColor(answers.texture, answers.remain);
    if (!shape || !color) return restart();
    byId("resultBrowWebp").srcset = assetUrl("result-card-" + shape.id + ".webp");
    byId("resultBrowImage").src = assetUrl("result-card-" + shape.id + ".png");
    updateLineButton(shape.id);
    showScreen("result");
    if (shouldFocus) focusAfterPaint(byId("completionTitle"));
  }

  function start() {
    clearTimers();
    answers = {};
    step = 0;
    setHistory("question", step, "pushState");
    renderQuestion(true);
  }

  function restart() {
    clearTimers();
    answers = {};
    step = 0;
    setHistory("hero", 0, "replaceState");
    showScreen("hero");
    focusAfterPaint(byId("startButton"));
  }

  renderTypeCards();
  initHeroMapping();
  startButtons.forEach((button) => button.addEventListener("click", start));
  byId("backButton").addEventListener("click", () => window.history.back());
  byId("retryButton").addEventListener("click", restart);
  byId("lineButton").addEventListener("click", (event) => {
    if (event.currentTarget.getAttribute("aria-disabled") === "true") event.preventDefault();
  });

  const stickyCta = byId("heroStickyCta");
  let heroStartVisible = true;
  let lpEndVisible = false;
  const updateStickyCta = () => {
    stickyCta.classList.toggle("is-visible", !heroStartVisible && !lpEndVisible);
  };
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === byId("startButton")) heroStartVisible = entry.isIntersecting;
        if (entry.target === byId("lpEnd")) lpEndVisible = entry.isIntersecting;
      });
      updateStickyCta();
    }, { threshold: 0.15 });
    observer.observe(byId("startButton"));
    observer.observe(byId("lpEnd"));
  } else {
    const updateStickyFallback = () => {
      const startRect = byId("startButton").getBoundingClientRect();
      const endRect = byId("lpEnd").getBoundingClientRect();
      heroStartVisible = startRect.bottom > 0 && startRect.top < window.innerHeight;
      lpEndVisible = endRect.bottom > 0 && endRect.top < window.innerHeight;
      updateStickyCta();
    };
    window.addEventListener("scroll", updateStickyFallback, { passive: true });
    window.addEventListener("resize", updateStickyFallback, { passive: true });
    updateStickyFallback();
  }

  window.addEventListener("popstate", (event) => {
    clearTimers();
    const next = event.state;
    if (!next || !next.browCheck || next.view === "hero") {
      showScreen("hero");
      return;
    }
    if (next.view === "question") {
      step = Math.max(0, Math.min(B.QUESTIONS.length - 1, Number(next.step) || 0));
      renderQuestion(true);
      return;
    }
    if (next.view === "result" && hasCompleteAnswers()) {
      renderResult(true);
      return;
    }
    if (next.view === "loading" && hasCompleteAnswers()) {
      renderLoading();
      return;
    }
    restart();
  });

  setHistory("hero", 0, "replaceState");
  showScreen("hero");
})();
