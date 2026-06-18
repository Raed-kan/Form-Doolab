/* ============================================================
   دولاب — محرّك الاستبيان (نمط Typeform)
   ============================================================ */
(function () {
  "use strict";

  const stage      = document.getElementById("stage");
  const navbar     = document.getElementById("navbar");
  const backBtn    = document.getElementById("backBtn");
  const nextBtn    = document.getElementById("nextBtn");
  const skipBtn    = document.getElementById("skipBtn");
  const nextLabel  = document.getElementById("nextLabel");
  const progressBar= document.getElementById("progressBar");
  const counter    = document.getElementById("counter");

  const ARLET = ["أ","ب","ج","د","ه","و","ز","ح","ط","ي","ك","ل"];

  let index = 0;
  const answers = loadAnswers();

  // الأسئلة الفعلية (التي لها id) لحساب التقدّم
  const realQs = QUESTIONS.filter(q => q.id);

  /* ---------- حفظ تلقائي ---------- */
  function loadAnswers() {
    try { return JSON.parse(localStorage.getItem(CONFIG.autosaveKey)) || {}; }
    catch (e) { return {}; }
  }
  function saveAnswers() {
    try { localStorage.setItem(CONFIG.autosaveKey, JSON.stringify(stripFiles(answers))); }
    catch (e) {}
  }
  // لا نخزّن الصور (base64) في localStorage حتى لا نتجاوز الحد
  function stripFiles(obj) {
    const c = JSON.parse(JSON.stringify(obj, (k, v) => k === "files" ? undefined : v));
    return c;
  }

  /* ---------- أدوات ---------- */
  function el(html) { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; }
  function num2(n) { return String(n).padStart(2, "0"); }

  function currentQ() { return QUESTIONS[index]; }

  function realIndexOf(i) {
    let c = 0;
    for (let k = 0; k <= i && k < QUESTIONS.length; k++) if (QUESTIONS[k].id) c++;
    return c;
  }

  /* ---------- الرسم ---------- */
  function render(direction) {
    const q = currentQ();
    const old = stage.querySelector(".card");
    const draw = () => {
      stage.innerHTML = "";
      const card = buildCard(q);
      stage.appendChild(card);
      updateChrome(q);
      focusFirst(card);
    };
    if (old) { old.classList.add("is-leaving"); setTimeout(draw, 200); }
    else draw();
  }

  function updateChrome(q) {
    const isReal = !!q.id;
    navbar.hidden = (q.type === "welcome" || q.type === "end");
    backBtn.style.visibility = index > 0 && q.type !== "end" ? "visible" : "hidden";

    // التخطّي يظهر فقط للأسئلة الاختيارية
    skipBtn.hidden = !(isReal && q.optional);

    nextLabel.textContent = "متابعة";
    nextBtn.hidden = (q.type === "welcome" || q.type === "end" || q.type === "statement");
    if (q.type === "statement") { nextBtn.hidden = false; nextLabel.textContent = "متابعة"; }

    // التقدّم
    const ri = isReal ? realIndexOf(index) : realIndexOf(index);
    const pct = Math.round((realIndexOf(index) / realQs.length) * 100);
    progressBar.style.width = Math.min(pct, 100) + "%";
    counter.textContent = isReal ? `${num2(realIndexOf(index))} / ${num2(realQs.length)}` : "";
  }

  function focusFirst(card) {
    const f = card.querySelector(".field");
    if (f) setTimeout(() => f.focus(), 60);
  }

  /* ---------- بناء البطاقات ---------- */
  function buildCard(q) {
    switch (q.type) {
      case "welcome":   return buildWelcome(q);
      case "statement": return buildStatement(q);
      case "end":       return buildEnd(q);
      default:          return buildQuestion(q);
    }
  }

  function buildWelcome(q) {
    const card = el(`<div class="card"><div class="hero">
      <img src="assets/logo-mark.png" class="hero__mark" alt="دولاب" />
      <h1 class="hero__title">${q.title}</h1>
      <p class="hero__sub">${q.subtitle}</p>
      <p class="hero__note">${q.note || ""}</p>
      <div><button class="cta" id="startBtn">${q.button || "نبدأ"} <span class="cta__kbd">↵</span></button></div>
    </div></div>`);
    card.querySelector("#startBtn").addEventListener("click", goNext);
    return card;
  }

  function buildStatement(q) {
    return el(`<div class="card"><div class="statement">
      ${q.kicker ? `<span class="statement__kicker">${q.kicker}</span>` : ""}
      <h2 class="statement__title">${q.title}</h2>
      ${q.subtitle ? `<p class="statement__sub">${q.subtitle}</p>` : ""}
    </div></div>`);
  }

  function buildEnd(q) {
    const card = el(`<div class="card"><div class="hero">
      <div class="check-ring">${checkSVG()}</div>
      <h1 class="hero__title">${q.title}</h1>
      <p class="hero__sub">${q.subtitle}</p>
      <div><button class="cta" id="restartBtn">${q.button || "من جديد"}</button></div>
    </div></div>`);
    card.querySelector("#restartBtn").addEventListener("click", restart);
    return card;
  }

  function buildQuestion(q) {
    const ri = realIndexOf(index);
    const card = el(`<div class="card">
      <div class="q-meta">
        <span class="q-meta__num">${num2(ri)}</span>
        <svg viewBox="0 0 24 24"><path d="M14 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        ${q.section ? `<span class="q-meta__sec">${q.section}</span>` : ""}
      </div>
      <h2 class="q-title">${q.title}${q.required ? '<span class="req">✶</span>' : ""}</h2>
      ${q.subtitle ? `<p class="q-sub">${q.subtitle}</p>` : ""}
      <div class="q-body"></div>
    </div>`);
    const body = card.querySelector(".q-body");
    body.appendChild(buildInput(q));
    return card;
  }

  /* ---------- مدخلات حسب النوع ---------- */
  function buildInput(q) {
    switch (q.type) {
      case "short":
      case "email":
      case "tel":   return buildText(q, "input");
      case "long":  return buildText(q, "textarea");
      case "single":
      case "multi": return buildChoices(q);
      case "scale": return buildScale(q);
      case "date":  return buildDate(q);
      case "upload":return buildUpload(q);
      default:      return el(`<div></div>`);
    }
  }

  function buildText(q, tag) {
    const type = q.type === "email" ? "email" : q.type === "tel" ? "tel" : "text";
    const val  = answers[q.id]?.value || "";
    const node = tag === "textarea"
      ? el(`<textarea class="field" rows="1" placeholder="${q.placeholder || ""}">${val}</textarea>`)
      : el(`<input class="field" type="${type}" placeholder="${q.placeholder || ""}" value="${val.replace(/"/g,'&quot;')}" />`);
    if (tag === "textarea") {
      const grow = () => { node.style.height = "auto"; node.style.height = node.scrollHeight + "px"; };
      node.addEventListener("input", grow); setTimeout(grow, 0);
    }
    node.addEventListener("input", () => { answers[q.id] = { value: node.value.trim() }; saveAnswers(); });
    node.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && (q.type !== "long" || (e.ctrlKey || e.metaKey))) { e.preventDefault(); goNext(); }
    });
    return node;
  }

  function buildChoices(q) {
    const multi = q.type === "multi";
    const wrap = el(`<div class="options" role="${multi ? "group" : "radiogroup"}"></div>`);
    const sel = new Set(answers[q.id]?.value || []);
    q.options.forEach((opt, i) => {
      const isSel = sel.has(opt);
      const o = el(`<button type="button" class="option ${isSel ? "is-selected" : ""}">
        <span class="option__key">${ARLET[i] || i + 1}</span>
        <span class="option__label">${opt}</span>
        <span class="option__check">${checkMini()}</span>
      </button>`);
      o.addEventListener("click", () => {
        if (multi) {
          if (sel.has(opt)) sel.delete(opt);
          else {
            if (q.maxChoices && sel.size >= q.maxChoices) { flashLimit(wrap); return; }
            sel.add(opt);
          }
          o.classList.toggle("is-selected");
          answers[q.id] = { value: [...sel] }; saveAnswers();
        } else {
          wrap.querySelectorAll(".option").forEach(n => n.classList.remove("is-selected"));
          o.classList.add("is-selected");
          answers[q.id] = { value: [opt] }; saveAnswers();
          setTimeout(goNext, 260);
        }
      });
      wrap.appendChild(o);
    });
    if (multi) {
      const hint = q.maxChoices ? `يمكنك اختيار حتى ${q.maxChoices}` : "يمكنك اختيار أكثر من إجابة";
      wrap.appendChild(el(`<p class="options__hint">${hint} · اضغط «متابعة» عند الانتهاء</p>`));
    }
    return wrap;
  }

  function flashLimit(wrap) {
    const hint = wrap.querySelector(".options__hint");
    if (hint) { hint.classList.add("shake"); setTimeout(() => hint.classList.remove("shake"), 400); }
  }

  function buildScale(q) {
    const wrap = el(`<div class="scale"><div class="scale__row"></div>
      <div class="scale__labels"><span>${q.rightLabel}</span><span>${q.leftLabel}</span></div></div>`);
    const row = wrap.querySelector(".scale__row");
    const cur = answers[q.id]?.value;
    for (let n = q.min; n <= q.max; n++) {
      const d = el(`<button type="button" class="scale__dot ${cur == n ? "is-selected" : ""}">${n}</button>`);
      d.addEventListener("click", () => {
        row.querySelectorAll(".scale__dot").forEach(x => x.classList.remove("is-selected"));
        d.classList.add("is-selected");
        answers[q.id] = { value: n }; saveAnswers();
        setTimeout(goNext, 260);
      });
      row.appendChild(d);
    }
    return wrap;
  }

  function buildDate(q) {
    const val = answers[q.id]?.value || "";
    const node = el(`<input class="field" type="date" value="${val}" />`);
    node.addEventListener("input", () => { answers[q.id] = { value: node.value }; saveAnswers(); });
    return node;
  }

  function buildUpload(q) {
    if (!answers[q.id]) answers[q.id] = { note: "", files: [] };
    if (!answers[q.id].files) answers[q.id].files = [];
    const state = answers[q.id];

    const wrap = el(`<div class="upload">
      <label class="dropzone">
        ${uploadSVG()}
        <div class="dropzone__title">اسحب وأفلت الملفات هنا أو اضغط للاختيار</div>
        <div class="dropzone__hint">صور أو ملفات · حتى ${CONFIG.maxFiles} ملفات · ${CONFIG.maxFileMB}MB للملف</div>
        <input type="file" multiple ${q.allowImage ? 'accept="image/*,.pdf,.ai,.eps,.svg"' : ""} hidden />
      </label>
      <div class="thumbs"></div>
      <textarea class="field" rows="1" placeholder="${q.notePlaceholder || "ملاحظة (اختياري)"}">${state.note || ""}</textarea>
    </div>`);

    const dz    = wrap.querySelector(".dropzone");
    const input = wrap.querySelector('input[type="file"]');
    const thumbs= wrap.querySelector(".thumbs");
    const note  = wrap.querySelector("textarea");

    note.addEventListener("input", () => { state.note = note.value.trim(); saveAnswers(); });

    function renderThumbs() {
      thumbs.innerHTML = "";
      state.files.forEach((f, i) => {
        const inner = f.dataUrl && f.type.startsWith("image/")
          ? `<img src="${f.dataUrl}" alt="${f.name}" />`
          : `<div class="thumb__file">${f.name}</div>`;
        const t = el(`<div class="thumb">${inner}<button class="thumb__x" type="button" aria-label="حذف">×</button></div>`);
        t.querySelector(".thumb__x").addEventListener("click", () => { state.files.splice(i, 1); renderThumbs(); });
        thumbs.appendChild(t);
      });
    }
    renderThumbs();

    function addFiles(list) {
      [...list].forEach(file => {
        if (state.files.length >= CONFIG.maxFiles) return;
        if (file.size > CONFIG.maxFileMB * 1024 * 1024) { alert(`الملف «${file.name}» أكبر من ${CONFIG.maxFileMB}MB`); return; }
        const reader = new FileReader();
        reader.onload = () => { state.files.push({ name: file.name, type: file.type, dataUrl: reader.result }); renderThumbs(); };
        reader.readAsDataURL(file);
      });
    }
    input.addEventListener("change", () => addFiles(input.files));
    ["dragover","dragenter"].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.add("is-over"); }));
    ["dragleave","drop"].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.remove("is-over"); }));
    dz.addEventListener("drop", e => addFiles(e.dataTransfer.files));

    return wrap;
  }

  /* ---------- التحقّق ---------- */
  function validate(q) {
    if (!q.id || q.optional) return true;
    const a = answers[q.id];
    if (!q.required) return true;
    if (q.type === "multi" || q.type === "single") return a && a.value && a.value.length;
    if (q.type === "scale") return a && a.value != null;
    if (q.type === "email") return a && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.value);
    return a && a.value && String(a.value).trim().length;
  }

  function shakeCard() {
    const card = stage.querySelector(".card");
    if (card) { card.classList.add("shake"); setTimeout(() => card.classList.remove("shake"), 420); }
  }

  /* ---------- التنقّل ---------- */
  function goNext() {
    const q = currentQ();
    if (q.id && !validate(q)) { shakeCard(); return; }
    if (index >= QUESTIONS.length - 1) return;

    // آخر سؤال قبل شاشة النهاية → إرسال
    const next = QUESTIONS[index + 1];
    if (next.type === "end") { submit(); return; }

    index++;
    render("next");
  }

  function goBack() {
    if (index === 0) return;
    index--;
    render("back");
  }

  function skip() {
    const q = currentQ();
    if (q.optional && q.id) { /* نترك الإجابة كما هي (فارغة) */ }
    goNext();
  }

  backBtn.addEventListener("click", goBack);
  nextBtn.addEventListener("click", goNext);
  skipBtn.addEventListener("click", skip);

  document.addEventListener("keydown", (e) => {
    const q = currentQ();
    if (e.key === "Enter") {
      const tag = document.activeElement?.tagName;
      if (tag === "TEXTAREA" && q.type === "long" && !(e.ctrlKey || e.metaKey)) return;
      if (q.type === "welcome") { e.preventDefault(); goNext(); }
      else if (q.type !== "end") { e.preventDefault(); goNext(); }
    }
    if (e.key === "Tab") return;
  });

  /* ---------- الإرسال ---------- */
  async function submit() {
    // شاشة الإرسال
    stage.innerHTML = "";
    navbar.hidden = true;
    progressBar.style.width = "100%";
    const sendingCard = el(`<div class="card"><div class="hero sending">
      <div class="spinner"></div>
      <p class="hero__sub">نرسل بريفك إلى فريق دولاب…</p>
    </div></div>`);
    stage.appendChild(sendingCard);

    const payload = buildPayload();

    try {
      if (!CONFIG.endpoint) throw new Error("NO_ENDPOINT");
      const res = await fetch(CONFIG.endpoint, {
        method: "POST",
        // text/plain يتجنّب طلب preflight (CORS) مع Apps Script
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || out.status === "error") throw new Error(out.message || "SERVER");
      finishSuccess();
    } catch (err) {
      finishError(err, payload);
    }
  }

  function buildPayload() {
    const ordered = [];   // [{label, value}] بترتيب الأسئلة → أعمدة الشيت
    const files = [];
    realQs.forEach(q => {
      const a = answers[q.id];
      let value = "";
      if (a) {
        if (q.type === "upload") {
          value = a.note || "";
          (a.files || []).forEach(f => files.push({ field: q.id, label: cleanLabel(q.title), name: f.name, type: f.type, dataUrl: f.dataUrl }));
        } else if (Array.isArray(a.value)) {
          value = a.value.join("، ");
        } else if (a.value != null) {
          value = a.value;
        }
      }
      ordered.push({ id: q.id, label: cleanLabel(q.title), value: String(value) });
    });
    return {
      form: FORM_ID,
      formTitle: FORM_TITLE,
      submittedAt: new Date().toISOString(),
      ordered,
      files
    };
  }

  function cleanLabel(t) { return t.replace(/<[^>]+>/g, "").replace(/[؟?]/g, "").trim(); }

  function finishSuccess() {
    localStorage.removeItem(CONFIG.autosaveKey);
    index = QUESTIONS.length - 1; // شاشة النهاية
    render("next");
  }

  function finishError(err, payload) {
    const isNoEndpoint = String(err.message) === "NO_ENDPOINT";
    stage.innerHTML = "";
    const card = el(`<div class="card"><div class="hero">
      <h1 class="hero__title">${isNoEndpoint ? "وضع المعاينة" : "تعذّر الإرسال"}</h1>
      <p class="hero__sub">${isNoEndpoint
        ? "لم يتم ربط Google Sheet بعد. إجاباتك سليمة — اربط الرابط في config.js ثم جرّب مرة ثانية."
        : "صار خطأ بسيط أثناء الإرسال. تقدر تعيد المحاولة، أو تنزّل نسخة من إجاباتك."}</p>
      <div class="error-box">${isNoEndpoint ? "للمطوّر: عبّئ ENDPOINT_URL في config.js" : (err.message || "خطأ غير معروف")}</div>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
        <button class="cta" id="retryBtn">إعادة المحاولة</button>
        <button class="cta" id="dlBtn" style="background:transparent;color:var(--cream);box-shadow:none;border:1.5px solid var(--line)">تنزيل نسخة</button>
      </div>
    </div></div>`);
    stage.appendChild(card);
    card.querySelector("#retryBtn").addEventListener("click", submit);
    card.querySelector("#dlBtn").addEventListener("click", () => downloadJSON(payload));
  }

  function downloadJSON(payload) {
    const light = JSON.parse(JSON.stringify(payload));
    light.files = (light.files || []).map(f => ({ field: f.field, name: f.name, type: f.type }));
    const blob = new Blob([JSON.stringify(light, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `doolab-brief-${FORM_ID}.json`;
    a.click();
  }

  function restart() {
    localStorage.removeItem(CONFIG.autosaveKey);
    for (const k in answers) delete answers[k];
    index = 0;
    render("next");
  }

  /* ---------- أيقونات ---------- */
  function checkMini() { return `<svg viewBox="0 0 24 24" width="18" height="18"><path d="M5 13l4 4L19 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`; }
  function uploadSVG() { return `<svg viewBox="0 0 24 24" fill="none"><path d="M12 16V4m0 0L7 9m5-5l5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`; }
  function checkSVG() {
    return `<svg viewBox="0 0 96 96" fill="none"><circle cx="48" cy="48" r="44" stroke="#4ab5a5" stroke-width="4"/>
      <path d="M30 49l12 12 24-26" stroke="#4ab5a5" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"
        stroke-dasharray="80" stroke-dashoffset="80"><animate attributeName="stroke-dashoffset" from="80" to="0" dur="0.6s" begin="0.15s" fill="freeze"/></path></svg>`;
  }

  /* ---------- إقلاع ---------- */
  render("next");
})();
