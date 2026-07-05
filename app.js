/* ============================================================
   دولاب — محرّك البريف الموحّد (اختيار خدمة + تفرّع + توزيع تبويبات)
   ============================================================ */
(function () {
  "use strict";

  const stage       = document.getElementById("stage");
  const navbar      = document.getElementById("navbar");
  const backBtn     = document.getElementById("backBtn");
  const nextBtn     = document.getElementById("nextBtn");
  const skipBtn     = document.getElementById("skipBtn");
  const nextLabel   = document.getElementById("nextLabel");
  const progressBar = document.getElementById("progressBar");
  const counter     = document.getElementById("counter");

  const ARLET = ["أ","ب","ج","د","ه","و","ز","ح","ط","ي","ك","ل"];

  let index = 0;
  const answers = loadAnswers();
  let selectedServices = (answers.services && answers.services.value) || [];
  let QUESTIONS = buildFlow(selectedServices);
  let lastPayloads = null;

  /* ---------- بناء تدفّق الأسئلة حسب الخدمات المختارة ---------- */
  function buildFlow(sel) {
    const flow = [WELCOME, SERVICE_SELECT];
    flow.push({ type: "statement", kicker: "نبدأ", title: "نتعرّف عليك", subtitle: "معلومات سريعة تنطبق على كل الخدمات." });
    COMMON.forEach(q => flow.push(q));
    SERVICES.filter(s => sel.includes(s.key)).forEach(s => {
      flow.push({ type: "statement", kicker: s.intro.kicker, title: s.intro.title, subtitle: s.intro.subtitle });
      s.questions.forEach(q => flow.push(q));
    });
    flow.push({ type: "statement", title: "تفاصيل أخيرة", subtitle: "خطوتين وخلصنا ✦" });
    SHARED_END.forEach(q => flow.push(q));
    flow.push(END);
    return flow;
  }

  function realQuestions() { return QUESTIONS.filter(q => q.id && q.type !== "service"); }

  function realIndexOf(i) {
    let c = 0;
    for (let k = 0; k <= i && k < QUESTIONS.length; k++) {
      if (QUESTIONS[k].id && QUESTIONS[k].type !== "service") c++;
    }
    return c;
  }

  /* ---------- حفظ تلقائي ---------- */
  function loadAnswers() {
    try { return JSON.parse(localStorage.getItem("doolab_brief_v2")) || {}; }
    catch (e) { return {}; }
  }
  function saveAnswers() {
    try {
      const c = JSON.parse(JSON.stringify(answers, (k, v) => k === "files" ? undefined : v));
      localStorage.setItem("doolab_brief_v2", JSON.stringify(c));
    } catch (e) {}
  }

  /* ---------- أدوات ---------- */
  function el(html) { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; }
  function num2(n) { return String(n).padStart(2, "0"); }
  function currentQ() { return QUESTIONS[index]; }
  function cleanLabel(t) { return t.replace(/<[^>]+>/g, "").replace(/[؟?]/g, "").trim(); }

  /* ---------- الرسم ---------- */
  function render() {
    const q = currentQ();
    const old = stage.querySelector(".card");
    const draw = () => {
      stage.innerHTML = "";
      const card = buildCard(q);
      stage.appendChild(card);
      updateChrome(q);
      const f = card.querySelector(".field");
      if (f) setTimeout(() => f.focus(), 60);
    };
    if (old) { old.classList.add("is-leaving"); setTimeout(draw, 200); }
    else draw();
  }

  function updateChrome(q) {
    const isReal = q.id && q.type !== "service";
    navbar.hidden = (q.type === "welcome" || q.type === "end");
    backBtn.style.visibility = index > 0 && q.type !== "end" ? "visible" : "hidden";
    skipBtn.hidden = !(q.id && q.optional);
    nextLabel.textContent = "متابعة";
    nextBtn.hidden = (q.type === "welcome" || q.type === "end");

    const total = realQuestions().length;
    const done = realIndexOf(index);
    progressBar.style.width = Math.min(Math.round((done / total) * 100), 100) + "%";
    counter.textContent = isReal ? `${num2(done)} / ${num2(total)}` : "";
  }

  /* ---------- البطاقات ---------- */
  function buildCard(q) {
    if (q.type === "welcome")   return buildWelcome(q);
    if (q.type === "statement") return buildStatement(q);
    if (q.type === "end")       return buildEnd(q);
    return buildQuestion(q);
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
    const isService = q.type === "service";
    const numHtml = isService ? "" : `<span class="q-meta__num">${num2(realIndexOf(index))}</span>
        <svg viewBox="0 0 24 24"><path d="M14 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const card = el(`<div class="card">
      <div class="q-meta">
        ${numHtml}
        ${q.section ? `<span class="q-meta__sec">${q.section}</span>` : ""}
      </div>
      <h2 class="q-title">${q.title}${q.required ? '<span class="req">✶</span>' : ""}</h2>
      ${q.subtitle ? `<p class="q-sub">${q.subtitle}</p>` : ""}
      <div class="q-body"></div>
    </div>`);
    card.querySelector(".q-body").appendChild(buildInput(q));
    return card;
  }

  /* ---------- المدخلات ---------- */
  function buildInput(q) {
    switch (q.type) {
      case "service": return buildService(q);
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

  function buildService(q) {
    const wrap = el(`<div class="options"></div>`);
    const sel = new Set(selectedServices);
    SERVICES.forEach(s => {
      const o = el(`<button type="button" class="option option--service ${sel.has(s.key) ? "is-selected" : ""}">
        <span class="option__key">${s.icon || "◆"}</span>
        <span class="svc"><span class="svc__label">${s.label}</span><span class="svc__desc">${s.desc}</span></span>
        <span class="option__check">${checkMini()}</span>
      </button>`);
      o.addEventListener("click", () => {
        if (sel.has(s.key)) sel.delete(s.key); else sel.add(s.key);
        o.classList.toggle("is-selected");
        selectedServices = SERVICES.map(x => x.key).filter(k => sel.has(k)); // ترتيب ثابت
        answers.services = { value: selectedServices };
        QUESTIONS = buildFlow(selectedServices);
        saveAnswers();
      });
      wrap.appendChild(o);
    });
    wrap.appendChild(el(`<p class="options__hint">تقدر تختار أكثر من خدمة · اضغط «متابعة»</p>`));
    return wrap;
  }

  function buildText(q, tag) {
    const type = q.type === "email" ? "email" : q.type === "tel" ? "tel" : "text";
    const val = (answers[q.id] && answers[q.id].value) || "";
    const node = tag === "textarea"
      ? el(`<textarea class="field" rows="1" placeholder="${q.placeholder || ""}">${val}</textarea>`)
      : el(`<input class="field" type="${type}" placeholder="${q.placeholder || ""}" value="${String(val).replace(/"/g,'&quot;')}" />`);
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
    const wrap = el(`<div class="options"></div>`);
    const sel = new Set((answers[q.id] && answers[q.id].value) || []);
    q.options.forEach((opt, i) => {
      const o = el(`<button type="button" class="option ${sel.has(opt) ? "is-selected" : ""}">
        <span class="option__key">${ARLET[i] || i + 1}</span>
        <span class="option__label">${opt}</span>
        <span class="option__check">${checkMini()}</span>
      </button>`);
      o.addEventListener("click", () => {
        if (multi) {
          if (sel.has(opt)) sel.delete(opt);
          else { if (q.maxChoices && sel.size >= q.maxChoices) { flashLimit(wrap); return; } sel.add(opt); }
          o.classList.toggle("is-selected");
          answers[q.id] = { value: [...sel] }; saveAnswers();
        } else {
          wrap.querySelectorAll(".option").forEach(n => n.classList.remove("is-selected"));
          o.classList.add("is-selected");
          answers[q.id] = { value: [opt] }; saveAnswers();
          setTimeout(goNext, 240);
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
    const h = wrap.querySelector(".options__hint");
    if (h) { h.classList.add("shake"); setTimeout(() => h.classList.remove("shake"), 400); }
  }

  function buildScale(q) {
    const wrap = el(`<div class="scale"><div class="scale__row"></div>
      <div class="scale__labels"><span>${q.rightLabel}</span><span>${q.leftLabel}</span></div></div>`);
    const row = wrap.querySelector(".scale__row");
    const cur = answers[q.id] && answers[q.id].value;
    for (let n = q.min; n <= q.max; n++) {
      const d = el(`<button type="button" class="scale__dot ${cur == n ? "is-selected" : ""}">${n}</button>`);
      d.addEventListener("click", () => {
        row.querySelectorAll(".scale__dot").forEach(x => x.classList.remove("is-selected"));
        d.classList.add("is-selected");
        answers[q.id] = { value: n }; saveAnswers();
        setTimeout(goNext, 240);
      });
      row.appendChild(d);
    }
    return wrap;
  }

  function buildDate(q) {
    const val = (answers[q.id] && answers[q.id].value) || "";
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
    const dz = wrap.querySelector(".dropzone");
    const input = wrap.querySelector('input[type="file"]');
    const thumbs = wrap.querySelector(".thumbs");
    const note = wrap.querySelector("textarea");
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
    if (q.type === "service") return selectedServices.length > 0;
    if (!q.id || q.optional || !q.required) return true;
    const a = answers[q.id];
    if (q.type === "multi" || q.type === "single") return a && a.value && a.value.length;
    if (q.type === "scale") return a && a.value != null;
    if (q.type === "email") return a && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.value);
    return a && a.value && String(a.value).trim().length;
  }

  function shakeCard() {
    const c = stage.querySelector(".card");
    if (c) { c.classList.add("shake"); setTimeout(() => c.classList.remove("shake"), 420); }
  }

  /* ---------- التنقّل ---------- */
  function goNext() {
    const q = currentQ();
    if (!validate(q)) { shakeCard(); return; }
    if (index >= QUESTIONS.length - 1) return;
    if (QUESTIONS[index + 1].type === "end") { submit(); return; }
    index++;
    render();
  }
  function goBack() { if (index > 0) { index--; render(); } }
  function skip() { goNext(); }

  backBtn.addEventListener("click", goBack);
  nextBtn.addEventListener("click", goNext);
  skipBtn.addEventListener("click", skip);

  document.addEventListener("keydown", (e) => {
    const q = currentQ();
    if (e.key === "Enter") {
      const tag = document.activeElement && document.activeElement.tagName;
      if (tag === "TEXTAREA" && q.type === "long" && !(e.ctrlKey || e.metaKey)) return;
      if (q.type !== "end") { e.preventDefault(); goNext(); }
    }
  });

  /* ---------- الإرسال (POST لكل خدمة على تبويبها) ---------- */
  function shortId() {
    const t = Date.now().toString(36).toUpperCase();
    return "DL-" + t.slice(-6);
  }

  function buildServicePayload(service, submissionId) {
    const qs = COMMON.concat(service.questions).concat(SHARED_END);
    const ordered = [{ id: "submission_id", label: "معرّف الطلب", value: submissionId },
                     { id: "service_name",  label: "الخدمة",       value: service.label }];
    const files = [];
    qs.forEach(q => {
      const a = answers[q.id];
      let value = "";
      if (a) {
        if (q.type === "upload") {
          value = a.note || "";
          (a.files || []).forEach(f => files.push({ field: q.id, label: cleanLabel(q.title), name: f.name, type: f.type, dataUrl: f.dataUrl }));
        } else if (Array.isArray(a.value)) value = a.value.join("، ");
        else if (a.value != null) value = a.value;
      }
      ordered.push({ id: q.id, label: cleanLabel(q.title), value: String(value) });
    });
    return { form: service.form, formTitle: service.label, submittedAt: new Date().toISOString(), submissionId, ordered, files };
  }

  async function submit() {
    stage.innerHTML = "";
    navbar.hidden = true;
    progressBar.style.width = "100%";
    stage.appendChild(el(`<div class="card"><div class="hero sending">
      <div class="spinner"></div>
      <p class="hero__sub">نرسل طلبك إلى فريق دولاب…</p>
    </div></div>`));

    const submissionId = shortId();
    const chosen = SERVICES.filter(s => selectedServices.includes(s.key));
    const payloads = chosen.map(s => buildServicePayload(s, submissionId));
    lastPayloads = payloads;

    try {
      if (!CONFIG.endpoint) throw new Error("NO_ENDPOINT");
      for (const p of payloads) {
        const res = await fetch(CONFIG.endpoint, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(p)
        });
        const out = await res.json().catch(() => ({}));
        if (!res.ok || out.status === "error") throw new Error(out.message || "SERVER");
      }
      finishSuccess();
    } catch (err) {
      finishError(err);
    }
  }

  function finishSuccess() {
    localStorage.removeItem("doolab_brief_v2");
    index = QUESTIONS.length - 1;
    render();
  }

  function finishError(err) {
    const noEp = String(err.message) === "NO_ENDPOINT";
    stage.innerHTML = "";
    const card = el(`<div class="card"><div class="hero">
      <h1 class="hero__title">${noEp ? "وضع المعاينة" : "تعذّر الإرسال"}</h1>
      <p class="hero__sub">${noEp
        ? "لم يتم ربط Google Sheet بعد. إجاباتك سليمة — اربط الرابط في config.js ثم جرّب مرة ثانية."
        : "صار خطأ بسيط أثناء الإرسال. تقدر تعيد المحاولة أو تنزّل نسخة من إجاباتك."}</p>
      <div class="error-box">${noEp ? "للمطوّر: عبّئ ENDPOINT_URL في config.js" : (err.message || "خطأ غير معروف")}</div>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
        <button class="cta" id="retryBtn">إعادة المحاولة</button>
        <button class="cta" id="dlBtn" style="background:transparent;color:var(--cream);box-shadow:none;border:1.5px solid var(--line)">تنزيل نسخة</button>
      </div>
    </div></div>`);
    stage.appendChild(card);
    card.querySelector("#retryBtn").addEventListener("click", submit);
    card.querySelector("#dlBtn").addEventListener("click", downloadJSON);
  }

  function downloadJSON() {
    const light = (lastPayloads || []).map(p => ({ ...p, files: (p.files || []).map(f => ({ field: f.field, name: f.name, type: f.type })) }));
    const blob = new Blob([JSON.stringify(light, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "doolab-brief.json";
    a.click();
  }

  function restart() {
    localStorage.removeItem("doolab_brief_v2");
    for (const k in answers) delete answers[k];
    selectedServices = [];
    QUESTIONS = buildFlow([]);
    index = 0;
    render();
  }

  /* ---------- أيقونات ---------- */
  function checkMini() { return `<svg viewBox="0 0 24 24" width="18" height="18"><path d="M5 13l4 4L19 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`; }
  function uploadSVG() { return `<svg viewBox="0 0 24 24" fill="none"><path d="M12 16V4m0 0L7 9m5-5l5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`; }
  function checkSVG() {
    return `<svg viewBox="0 0 96 96" fill="none"><circle cx="48" cy="48" r="44" stroke="#4ab5a5" stroke-width="4"/>
      <path d="M30 49l12 12 24-26" stroke="#4ab5a5" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"
        stroke-dasharray="80" stroke-dashoffset="80"><animate attributeName="stroke-dashoffset" from="80" to="0" dur="0.6s" begin="0.15s" fill="freeze"/></path></svg>`;
  }

  render();
})();
