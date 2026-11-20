/* Science Gates booth showcase: player, chapter line, product pages, explore, drawer, sheet viewer, idle return. */
(function () {
  "use strict";
  const A = window.SG, C = window.CATALOG, SC = window.Scenes;
  const $ = (q, r) => (r || document).querySelector(q);
  const $$ = (q, r) => Array.from((r || document).querySelectorAll(q));
  const esc = SC.esc;
  const stage = $("#stage");

  const IDLE_OVERLAY = 90;   // seconds before an open panel returns to the showcase
  const IDLE_LONG = 240;     // product sheets and documents get longer
  const IDLE_PAUSED = 120;   // a paused showcase resumes after this
  const COUNTDOWN = 10;

  const ICON = {
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18 9 12l6-6"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4v16l13-8z"/></svg>',
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.8 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3s.8-2.2 1-2.5c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5l.9 2.1c.1.1.1.3 0 .5l-.3.5-.4.5c-.1.1-.3.3-.1.6.2.3.7 1.2 1.6 2 1.1 1 2 1.3 2.3 1.4.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l2 1c.3.1.5.2.5.3.1.2.1.7-.1 1.4z"/></svg>'
  };
  const DEEP = A.deep || {};
  const P = id => C.products[id];
  const brandById = id => C.brands.find(b => b.id === id);
  const famById = id => A.families.find(f => f.id === id);
  const indById = id => A.industries.find(x => x.id === id);
  const catName = cid => (C.cats[cid] || {}).name || "";

  /* ---------- Stage scaling ---------- */
  function fit() {
    const s = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    stage.style.transform = "translate(-50%, -50%) scale(" + s + ")";
  }
  window.addEventListener("resize", fit);
  fit();

  /* ---------- Background: faint molecules drifting ---------- */
  const MOL = (function () {
    const cv = $("#mol"), ctx = cv.getContext("2d");
    const N = 34;
    const P0 = Array.from({ length: N }, () => ({ x: Math.random() * 1920, y: 140 + Math.random() * 800, vx: (Math.random() - 0.5) * 10, vy: (Math.random() - 0.5) * 8, r: 2 + Math.random() * 3 }));
    let last = 0, running = true;
    function frame(t) {
      requestAnimationFrame(frame);
      if (!running || document.hidden) { last = t; return; }
      const dt = last ? Math.min(0.05, (t - last) / 1000) : 0.016; last = t;
      ctx.clearRect(0, 0, 1920, 1080);
      for (const p of P0) {
        p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.x < -20) p.x = 1940; if (p.x > 1940) p.x = -20;
        if (p.y < 120) p.vy = Math.abs(p.vy); if (p.y > 960) p.vy = -Math.abs(p.vy);
      }
      ctx.lineWidth = 1.2;
      for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
        const a = P0[i], b = P0[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 190) { ctx.strokeStyle = "rgba(150,170,190," + (0.16 * (1 - d / 190)).toFixed(3) + ")"; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
      }
      for (const p of P0) { ctx.fillStyle = "rgba(150,170,190,.22)"; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill(); }
    }
    requestAnimationFrame(frame);
    return { set(on) { running = on; } };
  })();

  /* ---------- Header ---------- */
  $("#tb-phone").textContent = A.company.phone;
  $("#tb-email").textContent = A.company.email;
  $("#tb-web").textContent = A.company.web;
  if (A.event.name) {
    $("#ev-name").textContent = A.event.name + (A.event.booth ? ", " + A.event.booth : "");
    $("#ev-sub").textContent = [A.event.place, A.event.dates].filter(Boolean).join(", ");
  } else {
    $("#ev-name").textContent = A.company.tagline; $("#ev-name").className = "tagline";
    $("#ev-sub").textContent = "Laboratory & scientific instruments, Malaysia";
  }

  /* ---------- Rail: chapters on a line of dots ---------- */
  const fams = A.families;
  const X0 = 110, X1 = 1590, Y = 50;
  const nodeX = fams.map((f, i) => 170 + i * ((1540 - 170) / (fams.length - 1)));
  (function buildRail() {
    const g = $("#rail .nodes"), NS = "http://www.w3.org/2000/svg", labels = $("#rail .labels");
    $("#rail .base").setAttribute("x2", X1);
    fams.forEach((f, i) => {
      const c = document.createElementNS(NS, "circle");
      c.setAttribute("cx", nodeX[i]); c.setAttribute("cy", Y); c.setAttribute("r", 6);
      c.setAttribute("fill", "#FFFFFF"); c.setAttribute("stroke", "#BDBDBD"); c.setAttribute("stroke-width", 3);
      c.dataset.fam = f.id; g.appendChild(c);
      const b = document.createElement("button");
      b.className = "node"; b.style.left = nodeX[i] + "px"; b.textContent = f.name; b.dataset.railFam = f.id;
      b.setAttribute("aria-label", f.title);
      labels.appendChild(b);
    });
  })();

  // Map each scene to an x-range on the rail
  const sceneRange = (function () {
    const out = [], famScenes = {};
    SC.list.forEach((sc, i) => { if (sc.family) (famScenes[sc.family] = famScenes[sc.family] || []).push(i); });
    SC.list.forEach((sc, i) => {
      if (!sc.family) { out[i] = i === 0 ? [X0, nodeX[0] - 10] : [nodeX[nodeX.length - 1], X1]; return; }
      const k = fams.findIndex(f => f.id === sc.family);
      const a = nodeX[k], b = k + 1 < nodeX.length ? nodeX[k + 1] : X1;
      const list = famScenes[sc.family], j = list.indexOf(i), n = list.length;
      out[i] = [a + (b - a) * j / n, a + (b - a) * (j + 1) / n];
    });
    return out;
  })();

  function setRailFamily(fam) {
    let k = fams.findIndex(f => f.id === fam);
    if (!fam && P_.i > 0) k = fams.length;          // the closing scene: every chapter done
    $$("#rail .nodes circle").forEach((c, i) => {
      const on = c.dataset.fam === fam, past = k >= 0 && i < k;
      c.setAttribute("fill", on ? "#ED2926" : past ? "#ED2926" : "#FFFFFF");
      c.setAttribute("stroke", on || past ? "#ED2926" : "#BDBDBD");
      c.setAttribute("r", on ? 9 : 6);
    });
    $$("#rail .node").forEach(b => b.classList.toggle("on", b.dataset.railFam === fam));
  }

  /* ---------- Player ---------- */
  const P_ = { i: -1, cur: null, playing: true };

  function destroy(sc) {
    sc.tl.kill();
    sc.api.loops.forEach(l => l.tw.kill());
    sc.root.remove();
  }

  function playScene(i) {
    const N = SC.list.length;
    i = ((i % N) + N) % N;
    const def = SC.list[i];
    const old = P_.cur;
    const root = document.createElement("div");
    root.className = "scene";
    root.dataset.scene = def.id;
    root.style.opacity = 0;
    $("#scenes").appendChild(root);
    const tl = gsap.timeline({ paused: true });
    const api = SC.makeApi(root, tl);
    try { def.build(api); } catch (e) { console.error("Scene " + def.id + " failed", e); }
    const dur = Math.max(def.dur, tl.duration());
    tl.set({}, {}, dur);
    tl.eventCallback("onComplete", () => { if (P_.cur && P_.cur.tl === tl) playScene(i + 1); });
    P_.cur = { i, def, root, tl, api, dur };
    P_.i = i;
    if (old) {
      old.tl.pause();
      old.api.loops.forEach(l => l.tw.pause());
      gsap.to(old.root, { opacity: 0, duration: 0.6, ease: "power2.in", onComplete: () => destroy(old) });
    }
    gsap.to(root, { opacity: 1, duration: 0.9, delay: old ? 0.25 : 0, ease: "power2.out" });
    setRailFamily(def.family);
    moveGlow(i);
    setLearnButton(def.id);
    if (P_.playing && !anyOpen()) tl.play(0);
    else { tl.seek(dur * 0.62, true); tl.pause(); }
  }

  function pauseScene() {
    if (!P_.cur) return;
    P_.cur.tl.pause();
    P_.cur.api.loops.forEach(l => l.tw.pause());
  }
  function resumeScene() {
    if (!P_.cur || !P_.playing || anyOpen()) return;
    const t = P_.cur.tl.time();
    P_.cur.api.loops.forEach(l => { if (l.started || l.at <= t) { l.started = true; l.tw.play(); } });
    P_.cur.tl.play();
  }
  function setPlaying(on) {
    P_.playing = on;
    $("#c-play .i-pause").style.display = on ? "" : "none";
    $("#c-play .i-play").style.display = on ? "none" : "";
    $("#c-play").setAttribute("aria-label", on ? "Pause" : "Play");
    if (on) resumeScene(); else pauseScene();
  }
  function next(d) { playScene(P_.i + d); if (!P_.playing && P_.cur) P_.cur.api.loops.forEach(l => l.tw.pause()); }

  function playFamily(fam) {
    const i = SC.list.findIndex(s => s.family === fam);
    if (i < 0) return;
    closeAll(true);
    setPlaying(true);
    playScene(i);
  }

  function moveGlow(i) {
    const g = $("#bg .glow");
    const x = [500, 900, 300, 700][i % 4], y = [-300, -200, -100, -250][i % 4];
    g.style.left = x + "px"; g.style.top = y + "px";
  }

  const learnBtn = $("#learn-btn");
  const deepIdFor = id => (SC.deepFor[id] || id);
  function setLearnButton(id) {
    const d = DEEP[deepIdFor(id)];
    learnBtn.classList.toggle("off", !d);
    learnBtn.tabIndex = d ? 0 : -1;
    learnBtn.setAttribute("aria-label", d ? "Learn more: " + d.title : "Learn more");
    learnBtn.classList.remove("nudge");
    if (d) { void learnBtn.offsetWidth; learnBtn.classList.add("nudge"); }
  }

  // Rail slug follows playback; the deep-dive progress bar follows its slide
  gsap.ticker.add(() => {
    if (O.deep && DP.cur && DP.bars[DP.cur.i]) DP.bars[DP.cur.i].style.width = Math.min(100, DP.cur.tl.time() / DP.cur.dur * 100) + "%";
    if (!P_.cur) return;
    const r = sceneRange[P_.cur.i];
    const x = r[0] + (r[1] - r[0]) * Math.min(1, P_.cur.tl.time() / P_.cur.dur);
    $("#rail .slug").setAttribute("cx", x);
    $("#rail .slug-halo").setAttribute("cx", x);
    $("#rail .fill").setAttribute("x2", x);
  });

  /* ---------- Overlay state ---------- */
  const O = { explore: false, history: [], drawer: null, pdf: null, sheet: null, deep: null };
  function anyOpen() { return O.explore || O.history.length > 0 || !!O.drawer || !!O.pdf || !!O.sheet || !!O.deep; }
  function deepOnly() { return !!O.deep && !O.explore && !O.history.length && !O.drawer && !O.pdf && !O.sheet; }
  function afterClose() {
    if (!anyOpen()) { MOL.set(true); resumeScene(); }
    else if (deepOnly()) resumeDeep();
  }
  function beforeOpen() { pauseScene(); pauseDeep(); MOL.set(false); document.body.classList.remove("cursor-hidden", "show-controls"); }

  function closeAll(silent) {
    killDetailAnim();
    O.history = []; O.explore = false;
    $("#detail").hidden = true; $("#detail").innerHTML = "";
    $("#explore").hidden = true; $("#explore").innerHTML = "";
    closeDrawer(true); closePdf(true); closeSheet(true); closeDeep(true);
    hideToast();
    if (!silent) afterClose();
  }

  /* ---------- Shared renderers ---------- */
  function card(p) {
    if (!p) return "";
    const b = brandById(p.brand);
    return '<button class="card" data-product="' + p.id + '"><div class="im">' + (p.thumb ? '<img src="' + SC.src(p.thumb) + '" alt="" loading="lazy">' : "") +
      (p.videos ? '<span class="vid">' + ICON.play + "</span>" : "") + '</div><div class="tx"><b>' + esc(p.name) + "</b><span>" + esc(p.cats.map(catName).filter(n => n !== (b && b.name)).join(", ") || (b ? b.name : "")) + "</span><i>View Details</i></div></button>";
  }
  function brandTile(b) {
    return '<button class="btile" data-brand="' + b.id + '" style="min-height:104px"><em>' + b.n + "</em><b>" + esc(b.name) + "</b><span>" + esc([b.country, b.line].filter(Boolean).join(" · ")) + "</span></button>";
  }
  function indTile(ind) {
    return '<button class="indtile" data-ind="' + ind.id + '" style="min-height:170px">' + SC.icon(ind.icon, "ico") + "<b>" + esc(ind.name) + "</b><span>" + ind.brands.length + " brands to ask about</span></button>";
  }
  function videoCard(p, vid) {
    return '<button class="vcard" data-video="' + vid + '"><div class="ph"><img src="assets/img/yt/' + vid + '.webp" alt="" loading="lazy" onerror="this.style.display=\'none\'"><i>' + ICON.play + '</i></div><div class="tx"><b>' + esc((C.videos && C.videos[vid] && C.videos[vid].title) || p.name) + "</b><span>" + esc(brandById(p.brand).name + " · YouTube, needs internet") + "</span></div></button>";
  }
  function docCard(d) {
    return '<button class="doc" data-doc="' + esc(d.file) + '" data-title="' + esc(d.title) + '"><div class="th"' + (d.thumb ? ' style="background-image:url(\'' + encodeURI(d.thumb) + '\')"' : "") + ">" + (d.thumb ? "" : ICON.doc) + "</div><div><b>" + esc(d.title) + "</b><span>Brochure · PDF</span></div></button>";
  }
  const chip = (label, attr, val) => '<button class="chip" ' + attr + '="' + esc(val) + '">' + esc(label) + "</button>";

  /* ---------- Product detail ---------- */
  let D = { cycle: null, idx: 0, p: null, auto: true };
  function killDetailAnim() { if (D.cycle) D.cycle.kill(); D.cycle = null; }

  function openProduct(id, push) {
    const p = P(id);
    if (!p) return;
    beforeOpen();
    if (push !== false && O.history[O.history.length - 1] !== id) O.history.push(id);
    closeDrawer(true);
    renderDetail(p);
  }

  function renderDetail(p) {
    killDetailAnim();
    const fam = famById(p.family), b = brandById(p.brand);
    const el = $("#detail");
    el.hidden = false;
    const canBack = O.history.length > 1 || O.explore || !!O.deep;
    const related = p.cats.length ? C.order.map(P).filter(q => q.id !== p.id && q.cats.some(c => p.cats.includes(c))).slice(0, 6) : [];
    const same = related.length < 4 ? C.order.map(P).filter(q => q.id !== p.id && q.brand === p.brand && !related.includes(q)).slice(0, 6 - related.length) : [];
    const desc = p.summary || p.desc || "";
    const enquiry = "Hello, I am interested in " + p.name + ". (" + p.url + ")";
    el.innerHTML =
      '<div class="ov-head">' +
        (canBack ? '<button class="btn" data-act="back">' + ICON.back + "Back</button>" : "") +
        '<span class="spacer"></span>' +
        '<button class="btn" data-act="explore">' + ICON.grid + "All products</button>" +
        '<button class="btn primary" data-act="close-all">' + ICON.play + "Back to showcase</button>" +
      "</div>" +
      '<div class="hero"></div>' +
      '<div class="gallery"></div>' +
      '<div class="info">' +
        '<div class="fam">' + esc(fam ? fam.title : "") + "</div>" +
        '<div class="brand" data-brand="' + p.brand + '">' + esc(b.name) + "</div>" +
        "<h1" + (p.name.length > 70 ? ' style="font-size:36px"' : p.name.length > 42 ? ' style="font-size:42px"' : "") + ">" + esc(p.name) + "</h1>" +
        '<p class="cats">' + esc(p.cats.map(catName).filter(n => n !== b.name).join(", ")) + "</p>" +
        (p.tagline ? '<p class="tagline">' + esc(p.tagline) + "</p>" : "") +
        (p.blocks ? '<div class="blocks">' + blocksHtml(p.blocks) + "</div>" :
          (desc ? '<p class="summary">' + esc(desc) + "</p>" : "") +
          (p.features && p.features.length ? '<h2>Features</h2><ul class="ticks">' + p.features.map(f => "<li>" + esc(f) + "</li>").join("") + "</ul>" : "") +
          (p.specs && p.specs.length ? '<h2>Specifications</h2><table class="specs">' + p.specs.map(r => "<tr><th>" + esc(r[0]) + "</th><td>" + esc(r[1]) + "</td></tr>").join("") + "</table>" : "")) +
        (p.sheets.length ? '<h2>Product sheet' + (p.sheets.length > 1 ? "s" : "") + '</h2><div class="sheets">' + p.sheets.map((s, i) => '<button class="sheet" data-sheet="' + p.id + ":" + i + '"><img src="' + SC.src(s) + '" alt="" loading="lazy"><span>Tap to read' + (p.sheets.length > 1 ? " · " + (i + 1) + " of " + p.sheets.length : "") + "</span></button>").join("") + "</div>" : "") +
        (p.docs && p.docs.length ? '<h2>Documents</h2><div class="doclist">' + p.docs.map(docCard).join("") + "</div>" : "") +
        (p.videos ? '<h2>Videos</h2><div class="vlist">' + p.videos.map(v => videoCard(p, v)).join("") + "</div>" : "") +
        (!p.blocks && !p.sheets.length && !desc && !(p.features && p.features.length) ? '<p class="small" style="margin-top:26px">Ask our team for the full specification and brochure, here at the booth or on WhatsApp.</p>' : "") +
        '<div class="enq"><div class="qrbox">' + SC.qrSvg(SC.waLink(enquiry)) + '</div><div><b>' + ICON.wa + 'Scan to WhatsApp us</b><span>About the ' + esc(p.name) + ". Or ask our team here at the booth.</span><span style=\"color:var(--muted);font-size:15px\">" + esc(A.company.mobile + " · " + A.company.email) + "</span></div></div>" +
        (related.concat(same).length ? '<h2>Related products</h2><div class="rel">' + related.concat(same).map(card).join("") + "</div>" : "") +
        '<div class="chips" style="margin-top:22px">' + chip("All " + b.n + " " + b.name + " products", "data-brand", b.id) + "</div>" +
      "</div>";
    $(".info", el).scrollTop = 0;
    const gal = $(".gallery", el);
    if (p.img.length > 1) gal.innerHTML = p.img.map((n, i) => '<button data-gal="' + i + '" aria-label="Image ' + (i + 1) + '"><img src="' + SC.src(n) + '" alt=""></button>').join("");
    D.p = p; D.auto = true;
    showImage(0);
    gsap.from($$(".info > *", el), { y: 18, opacity: 0, duration: 0.5, stagger: 0.03, ease: "power2.out" });
  }

  /* The product description from sciencegates.com, as headings, paragraphs, lists and specification tables */
  function blocksHtml(blocks) {
    return blocks.map(b => {
      if (b.h) return "<h3>" + esc(b.h) + "</h3>";
      if (b.p) return "<p>" + esc(b.p) + "</p>";
      if (b.ul) return '<ul class="ticks">' + b.ul.map(li => "<li>" + esc(li) + "</li>").join("") + "</ul>";
      if (b.table) return '<table class="specs">' + b.table.map(r => {
        const cells = r.filter(c => c !== "");
        if (cells.length === 1) return '<tr class="sec"><td colspan="2">' + esc(cells[0]) + "</td></tr>";
        return "<tr><th>" + esc(cells[0]) + "</th><td>" + esc(cells.slice(1).join(" · ")) + "</td></tr>";
      }).join("") + "</table>";
      return "";
    }).join("");
  }

  function showImage(idx) {
    const p = D.p, el = $("#detail"), hero = $(".hero", el);
    if (!p) return;
    killDetailAnim();
    D.idx = idx;
    $$(".gallery [data-gal]", el).forEach(b => b.classList.toggle("on", +b.dataset.gal === idx));
    $$("img.main, .typo", hero).forEach(n => n.remove());
    const name = p.img[idx];
    if (!name) {
      const t = document.createElement("div"); t.className = "typo"; t.innerHTML = "<b>" + esc(p.name) + "</b>";
      hero.appendChild(t); gsap.from(t, { opacity: 0, scale: 0.97, duration: 0.6 });
      return;
    }
    const img = new Image();
    img.className = "main";
    img.alt = p.name;
    img.onload = () => {
      const box = { x: 60, y: 30, w: 940, h: 640 };
      const sc = Math.min(box.w / img.naturalWidth, box.h / img.naturalHeight, 1.6);
      const w = img.naturalWidth * sc, h = img.naturalHeight * sc;
      Object.assign(img.style, { left: (box.x + (box.w - w) / 2) + "px", top: (box.y + (box.h - h) / 2) + "px", width: w + "px", height: h + "px" });
      hero.appendChild(img);
      gsap.fromTo(img, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" });
      if (p.img.length > 1 && D.auto) D.cycle = gsap.delayedCall(5, () => showImage((D.idx + 1) % p.img.length));
    };
    img.src = SC.src(name);
  }

  function back() {
    if (O.drawer) { closeDrawer(); return; }
    if (O.history.length > 1) { O.history.pop(); renderDetail(P(O.history[O.history.length - 1])); return; }
    if (O.history.length === 1) {
      O.history = []; killDetailAnim();
      $("#detail").hidden = true; $("#detail").innerHTML = "";
      afterClose(); return;
    }
    if (O.explore) closeExplore();
  }

  /* ---------- Learn more: a self-running deep dive into the chapter on screen ---------- */
  const DP = { def: null, i: -1, cur: null, bars: [], live: new Set(), passes: 0, warnAt: 0, paused: false, token: 0 };

  function openLearn() { if (P_.cur && !anyOpen() && DEEP[deepIdFor(P_.cur.def.id)]) openDeep(deepIdFor(P_.cur.def.id)); }

  function openDeep(id, start) {
    const def = DEEP[id];
    if (!def || !def.slides || !def.slides.length) return;
    beforeOpen();
    closeDeep(true);
    O.deep = id;
    Object.assign(DP, { def, i: -1, cur: null, passes: 0, warnAt: 0, paused: false });
    const token = ++DP.token;
    const el = $("#deep");
    el.innerHTML =
      '<div class="ov-head">' +
        '<div class="dtitle"><span>Learn more</span><b>' + esc(def.title) + "</b></div>" +
        '<span class="spacer"></span>' +
        '<span class="dpaused" hidden>Paused</span>' +
        '<div class="dprog">' + def.slides.map((s, i) => '<button data-deep-go="' + i + '" aria-label="Slide ' + (i + 1) + " of " + def.slides.length + '"><i><b></b></i></button>').join("") + "</div>" +
        '<button class="btn primary" data-act="deep-return">' + ICON.play + "Return to slideshow</button>" +
      "</div>" +
      '<div class="dslides"></div>';
    DP.bars = $$(".dprog i b", el);
    el.hidden = false;
    gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: "power2.out" });
    $('[data-act="deep-return"]', el).focus({ preventScroll: true });
    SC.loadSizes(SC.deepImages(def), 1500).then(() => {
      if (DP.token === token && O.deep === id && !DP.cur) playDeep(start || 0);
    });
  }

  function playDeep(i) {
    const N = DP.def.slides.length;
    i = ((i % N) + N) % N;
    const sl = DP.def.slides[i];
    const old = DP.cur;
    const root = document.createElement("div");
    root.className = "scene dslide";
    root.style.opacity = 0;
    $("#deep .dslides").appendChild(root);
    const tl = gsap.timeline({ paused: true });
    const api = SC.makeApi(root, tl);
    let len = 10;
    try { len = SC.buildDeep(api, sl) || len; } catch (e) { console.error("Learn more slide " + (i + 1) + " (" + sl.type + ") failed", e); }
    const dur = Math.max(sl.dur || len, tl.duration() + 0.5);
    tl.set({}, {}, dur);
    tl.eventCallback("onComplete", () => { if (DP.cur && DP.cur.tl === tl) stepDeep(1, true); });
    const cur = { i, root, tl, api, dur };
    DP.cur = cur; DP.i = i;
    DP.live.add(cur);
    DP.bars.forEach((b, j) => { b.style.width = j < i ? "100%" : "0%"; });
    if (old) {
      old.tl.pause();
      old.api.loops.forEach(l => l.tw.pause());
      gsap.to(old.root, { opacity: 0, duration: 0.5, ease: "power2.in", onComplete: () => destroyDeepSlide(old) });
    }
    gsap.to(root, { opacity: 1, duration: 0.7, delay: old ? 0.2 : 0, ease: "power2.out" });
    if (deepOnly() && !DP.paused) tl.play(0);
    else { tl.seek(dur * 0.62, true); tl.pause(); }
  }

  function destroyDeepSlide(sc) {
    if (sc.dead) return;
    sc.dead = true;
    gsap.killTweensOf(sc.root);
    sc.tl.kill();
    sc.api.loops.forEach(l => l.tw.kill());
    sc.root.remove();
    DP.live.delete(sc);
  }
  function stepDeep(d, auto) {
    if (!O.deep) return;
    const N = DP.def.slides.length;
    if (auto && DP.i + d >= N) {
      DP.passes++;
      if (DP.passes >= 2 && !DP.warnAt) DP.warnAt = Date.now();
    }
    playDeep(DP.i + d);
  }
  function pauseDeep() {
    if (!DP.cur) return;
    DP.cur.tl.pause();
    DP.cur.api.loops.forEach(l => l.tw.pause());
  }
  function resumeDeep() {
    if (!DP.cur || DP.paused || !deepOnly()) return;
    const t = DP.cur.tl.time();
    DP.cur.api.loops.forEach(l => { if (l.started || l.at <= t) { l.started = true; l.tw.play(); } });
    DP.cur.tl.play();
  }
  function toggleDeepPause() {
    DP.paused = !DP.paused;
    const tag = $("#deep .dpaused");
    if (tag) tag.hidden = !DP.paused;
    if (DP.paused) pauseDeep(); else resumeDeep();
  }
  function closeDeep(silent) {
    if (!O.deep && !DP.live.size) return;
    const wasWarning = !!DP.warnAt;
    O.deep = null;
    DP.token++;
    DP.live.forEach(destroyDeepSlide);
    Object.assign(DP, { def: null, i: -1, cur: null, bars: [], passes: 0, warnAt: 0, paused: false });
    const el = $("#deep");
    gsap.killTweensOf(el);
    el.hidden = true; el.innerHTML = ""; el.style.opacity = "";
    if (wasWarning) { counting = false; hideToast(); }
    if (!silent) afterClose();
  }
  function returnFromDeep() {
    closeDeep();
    if (!anyOpen()) setPlaying(true);
  }

  /* ---------- Explore ---------- */
  const TABS = [["products", "Products"], ["brands", "Principals"], ["industries", "Industries"], ["docs", "Brochures"], ["videos", "Videos"], ["company", "About us"], ["contact", "Contact"]];
  let exploreTab = "products";
  const XS = { q: "", fam: "All" };

  function openExplore(tab, anchor) {
    beforeOpen();
    killDetailAnim();
    O.history = []; $("#detail").hidden = true; $("#detail").innerHTML = "";
    closeDrawer(true);
    O.explore = true;
    exploreTab = tab || exploreTab || "products";
    const el = $("#explore");
    el.hidden = false;
    el.innerHTML =
      '<div class="ov-head"><h1 class="title">Explore</h1><div class="tabs" role="tablist">' +
      TABS.map(([k, t]) => '<button role="tab" data-tab="' + k + '" class="' + (k === exploreTab ? "on" : "") + '" aria-selected="' + (k === exploreTab) + '">' + t + "</button>").join("") +
      '</div><span class="spacer"></span><button class="btn primary" data-act="close-all">' + ICON.play + "Back to showcase</button></div>" +
      '<div class="body"></div>';
    const body = $(".body", el);
    if (exploreTab === "products") {
      if (anchor && famById(anchor)) XS.fam = anchor;
      body.innerHTML = '<div class="searchrow"><input class="search" id="p-q" type="search" placeholder="Search ' + C.stats.products + ' products, e.g. calorimeter, Ohaus, desiccator" aria-label="Search products"><span class="count" id="p-count"></span></div><div class="chips filter" id="p-fams" style="margin:-10px 0 30px"></div><div class="p-out"></div>';
      $("#p-q").value = XS.q; renderProducts();
    }
    if (exploreTab === "brands") body.innerHTML = renderBrands();
    if (exploreTab === "industries") body.innerHTML = renderIndustries();
    if (exploreTab === "company") renderCompany(body);
    if (exploreTab === "videos") body.innerHTML = renderVideos();
    if (exploreTab === "docs") body.innerHTML = renderDocs();
    if (exploreTab === "contact") body.innerHTML = renderContact();
    body.scrollTop = 0;
    gsap.from(body, { opacity: 0, y: 16, duration: 0.4, ease: "power2.out" });
  }
  function closeExplore() {
    O.explore = false;
    $("#explore").hidden = true; $("#explore").innerHTML = "";
    afterClose();
  }

  /* Products: search box, area filter, then areas → brands → cards */
  function matches(p, words) {
    if (!words.length) return true;
    const b = brandById(p.brand);
    if (!p._hay) p._hay = (p.name + " " + b.name + " " + p.cats.map(catName).join(" ") + " " + (p.tags || []).join(" ") + " " + (famById(p.family) || {}).title + " " + (p.desc || "") + " " + (p.summary || "") + " " + (p.blocks ? JSON.stringify(p.blocks) : "")).toLowerCase();
    const hay = p._hay;
    return words.every(w => hay.includes(w));
  }
  function renderProducts() {
    const out = $("#explore .p-out"); if (!out) return;
    const words = XS.q.toLowerCase().split(/\s+/).filter(Boolean);
    const all = C.order.map(P).filter(p => matches(p, words));
    const famsWith = fams.filter(f => C.order.some(id => P(id).family === f.id));
    $("#p-fams").innerHTML = ['<button class="chip' + (XS.fam === "All" ? " on" : "") + '" data-pfam="All">All areas</button>'].concat(famsWith.map(f => {
      const n = all.filter(p => p.family === f.id).length;
      return '<button class="chip' + (XS.fam === f.id ? " on" : "") + '" data-pfam="' + f.id + '"' + (n ? "" : ' disabled style="opacity:.4"') + ">" + esc(f.name) + " · " + n + "</button>";
    })).join("");
    const shown = all.filter(p => XS.fam === "All" || p.family === XS.fam);
    $("#p-count").textContent = words.length || XS.fam !== "All" ? shown.length + " of " + C.stats.products + " products" : C.stats.products + " products from " + C.stats.brands + " principals";
    if (!shown.length) { out.innerHTML = '<p class="empty">No products match "' + esc(XS.q) + '". Try a brand such as Ohaus, or a word such as furnace, refractometer or sampler.</p>'; return; }
    out.innerHTML = famsWith.filter(f => XS.fam === "All" || XS.fam === f.id).map(f => {
      const ps = shown.filter(p => p.family === f.id);
      if (!ps.length) return "";
      const hasScene = SC.list.some(s => s.family === f.id);
      const byBrand = [];
      ps.forEach(p => { let g = byBrand.find(x => x.b === p.brand); if (!g) byBrand.push(g = { b: p.brand, ps: [] }); g.ps.push(p); });
      return '<section class="fam" id="fam-' + f.id + '"><header><h2>' + esc(f.title) + "<small>" + ps.length + "</small></h2><p>" + esc(f.blurb) + "</p>" +
        (hasScene && !words.length ? '<button class="btn" data-family-play="' + f.id + '">' + ICON.play + "Play this chapter</button>" : "") + "</header>" +
        byBrand.map(g => { const b = brandById(g.b); return '<h3 class="sub" data-brand="' + b.id + '">' + esc(b.name) + "<span>" + esc((b.country ? b.country + " · " : "") + g.ps.length + " product" + (g.ps.length > 1 ? "s" : "")) + '</span></h3><div class="grid">' + g.ps.map(card).join("") + "</div>"; }).join("") +
        "</section>";
    }).join("");
  }
  function renderBrands() {
    return '<section class="fam"><header><h2>Our principals<small>' + C.stats.brands + '</small></h2><p>We are proud to have established long-standing relationships with many leading scientific equipment and instrument manufacturers from USA, Europe, and Asia throughout the years. Tap a principal for its products.</p><button class="btn" data-family-play="brands">' + ICON.play + "Play this chapter</button></header>" +
      fams.filter(f => C.brands.some(b => b.family === f.id)).map(f => '<h3 class="sub">' + esc(f.title) + '</h3><div class="grid5">' + C.brands.filter(b => b.family === f.id).map(brandTile).join("") + "</div>").join("") + "</section>";
  }
  function renderIndustries() {
    return '<section class="fam"><header><h2>Industries we serve</h2><p>' + esc(A.company.clients) + ' Tap an industry for the principals to start with.</p><button class="btn" data-family-play="about">' + ICON.play + 'Play this chapter</button></header><div class="grid4">' +
      A.industries.map(indTile).join("") + "</div></section>";
  }
  function renderCompany(body) {
    const co = A.company;
    body.innerHTML =
      '<div class="aboutgrid"><img src="assets/img/about.webp" alt=""><div><div class="kick" style="margin:0 0 12px">About us</div><h2>' + esc(co.name) + "</h2>" + co.about.map(p => "<p>" + esc(p) + "</p>").join("") + "</div></div>" +
      '<section class="fam"><header><h2>Our facility in Subang Jaya</h2></header><div class="facil" style="grid-template-columns:repeat(5,1fr)">' +
        co.facility.map(f => "<div>" + SC.icon(f[0]) + "<b>" + esc(f[1]) + "</b><span>" + esc(f[2]) + "</span></div>").join("") + "</div></section>" +
      '<section class="fam"><header><h2>Sales network</h2><p>Covering Northern, Eastern, Central and Southern regions of Peninsular Malaysia, which includes East Malaysia as well.</p></header>' +
        '<div style="display:grid;grid-template-columns:1.4fr 1fr;gap:40px;align-items:center"><div class="mapbox"></div><div style="display:flex;flex-direction:column;gap:16px">' +
        co.regions.map(r => '<div style="border-left:4px solid var(--green);padding-left:18px"><b style="font-size:24px">' + esc(r.name) + '</b><span class="small" style="display:block">' + esc(r.sub) + "</span></div>").join("") + "</div></div></section>" +
      '<div class="vmgrid"><div><h3>Leadership Team:</h3><p>' + esc(co.leadership) + '</p></div><div><h3>Vision:</h3><p>' + esc(co.vision) + '</p></div><div><h3>Mission:</h3>' + co.mission.map(m => "<p>" + esc(m) + "</p>").join("") + "</div></div>" +
      '<div class="values"><h3>Core Values:</h3><dl>' + co.values.map(v => "<div><dt>" + esc(v[0]) + ":</dt><dd>" + esc(v[1]) + "</dd></div>").join("") + "</dl></div>";
    const m = SC.malaysiaMap($(".mapbox", body), 1000, {});
    m.paths.forEach(p => p.classList.add("cov"));
  }
  function renderDocs() {
    const groups = [];
    C.order.map(P).forEach(p => (p.docs || []).forEach(d => {
      let g = groups.find(x => x.b === p.brand); if (!g) groups.push(g = { b: p.brand, docs: [] });
      if (!g.docs.some(x => x.file === d.file)) g.docs.push(Object.assign({ pid: p.id }, d));
    }));
    return '<p style="font-size:20px;color:var(--body);margin:0 0 30px">Brochures attached to product pages on sciencegates.com. They open here, full screen.</p>' +
      groups.map(g => '<section class="fam"><header><h2>' + esc(brandById(g.b).name) + "<small>" + g.docs.length + '</small></h2></header><div class="doclist" style="grid-template-columns:repeat(4,1fr)">' + g.docs.map(docCard).join("") + "</div></section>").join("");
  }
  function renderVideos() {
    const list = [];
    C.order.map(P).forEach(p => (p.videos || []).forEach(v => { if (!list.some(x => x[1] === v)) list.push([p, v]); }));
    return '<p class="intro" style="font-size:20px;color:var(--body);margin:0 0 30px">Product videos from sciencegates.com. They play on YouTube in a new browser window when the booth has internet; close it with Ctrl+W to come back.</p>' +
      '<section class="fam"><header><h2>Product videos<small>' + list.length + '</small></h2></header><div class="grid4">' + list.map(([p, v]) => videoCard(p, v)).join("") + "</div></section>";
  }
  function renderContact() {
    const co = A.company;
    return '<div class="contactgrid"><div class="cbox"><h3>Company</h3><p><b>' + esc(co.name) + '</b><br><span style="font-size:17px;color:var(--muted)">' + esc(co.reg) + "</span></p>" +
      "<h3>Address</h3><p>" + co.address.map(esc).join("<br>") + "</p>" +
      "<h3>Operating hours</h3><p>" + co.hours.map(h => esc(h[0]) + ": " + esc(h[1])).join("<br>") + "</p></div>" +
      '<div class="cbox"><h3>Contact no.</h3><p><b>' + esc(co.phone) + "</b></p><h3>WhatsApp</h3><p><b>" + esc(co.mobile) + "</b></p><h3>Email</h3><p>" + esc(co.email) + "</p><h3>Website</h3><p>" + esc(co.web) + "</p><h3>Facebook</h3><p>" + esc(co.facebook) + "</p></div>" +
      '<div><div class="qr" style="width:360px;height:360px">' + SC.qrSvg(co.url) + '</div><p style="text-align:center;font-size:19px;font-weight:600;margin:14px 0 30px">sciencegates.com</p>' +
      '<div class="qr" style="width:360px;height:360px">' + SC.qrSvg(SC.waLink("Hello, I visited your booth and would like to know more.")) + '</div><p style="text-align:center;font-size:19px;font-weight:600;margin:14px 0 0">WhatsApp us</p></div></div>';
  }

  /* ---------- Drawer: principal or industry ---------- */
  function introHtml(blocks) {
    return blocks.map(x => x.h ? '<p class="h">' + esc(x.h) + "</p>" : x.p ? "<p>" + esc(x.p) + "</p>" : x.ul ? "<ul>" + x.ul.map(l => "<li>" + esc(l) + "</li>").join("") + "</ul>" : "").join("");
  }
  function openDrawer(kind, id) {
    beforeOpen();
    O.drawer = kind + ":" + id;
    const el = $("#drawer");
    let html = '<button class="btn close" data-act="close-drawer">' + ICON.close + "Close</button>";
    if (kind === "brand") {
      const b = brandById(id); if (!b) return;
      const ps = C.order.map(P).filter(p => p.brand === b.id);
      const fam = famById(b.family);
      html += '<div class="kick">Principal' + (fam ? " · " + esc(fam.title) : "") + "</div><h2>" + esc(b.name) + '</h2><p class="meta">' + esc([b.country, b.line, ps.length + " products"].filter(Boolean).join(" · ")) + "</p>" +
        (b.intro.length ? '<div class="intro">' + introHtml(b.intro.slice(0, 14)) + "</div>" : "") +
        "<h3>Products</h3>" +
        b.subs.filter(cid => ps.some(p => p.cats.includes(cid))).map(cid => '<p style="font-size:18px;font-weight:700;color:var(--red);margin:22px 0 10px;text-transform:uppercase">' + esc(catName(cid)) + '</p><div class="grid3">' + ps.filter(p => p.cats.includes(cid)).map(card).join("") + "</div>").join("") +
        (ps.some(p => !p.cats.some(c => b.subs.includes(c))) ? '<div class="grid3" style="margin-top:14px">' + ps.filter(p => !p.cats.some(c => b.subs.includes(c))).map(card).join("") + "</div>" : "");
    } else {
      const ind = indById(id); if (!ind) return;
      html += '<div class="kick">Industry</div><h2>' + esc(ind.name) + '</h2><p class="meta">Principals to ask about for ' + esc(ind.name.toLowerCase()) + ". Tap one for its products.</p>" +
        '<div class="grid3">' + ind.brands.map(brandById).filter(Boolean).map(brandTile).join("") + "</div>" +
        "<h3>A few products</h3><div class=\"grid3\">" + ind.brands.map(bid => C.order.map(P).find(p => p.brand === bid && p.thumb)).filter(Boolean).slice(0, 6).map(card).join("") + "</div>";
    }
    el.innerHTML = html;
    el.hidden = false; el.scrollTop = 0;
    gsap.fromTo(el, { x: 80, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: "power3.out" });
  }
  function closeDrawer(silent) {
    if (!O.drawer && $("#drawer").hidden) return;
    O.drawer = null;
    $("#drawer").hidden = true; $("#drawer").innerHTML = "";
    if (!silent) afterClose();
  }

  /* ---------- Product sheet viewer (tap to zoom, drag to pan) ---------- */
  const SV = { p: null, i: 0, z: 1, x: 0, y: 0 };
  const svBody = $("#sv-body"), svImg = $("#sv-img");
  function openSheet(pid, i) {
    const p = P(pid); if (!p || !p.sheets[i]) return;
    beforeOpen();
    SV.p = p; SV.i = i;
    O.sheet = pid;
    $("#sv").hidden = false;
    $("#sv-hint").style.opacity = 1;
    setTimeout(() => { $("#sv-hint").style.opacity = 0; }, 4000);
    showSheet();
    $("#sv-close").focus();
  }
  function showSheet() {
    const p = SV.p, n = p.sheets.length;
    $("#sv-title").textContent = brandById(p.brand).name + " · " + p.name;
    $("#sv-count").textContent = n > 1 ? (SV.i + 1) + " of " + n : "";
    $("#sv-prev").disabled = $("#sv-next").disabled = n < 2;
    setZoom(1, 0, 0, false);
    svImg.src = SC.src(p.sheets[SV.i]);
    svImg.alt = p.name + " product sheet";
  }
  function stepSheet(d) { const n = SV.p ? SV.p.sheets.length : 0; if (n < 2) return; SV.i = (SV.i + d + n) % n; showSheet(); }
  function closeSheet(silent) {
    if (!O.sheet && $("#sv").hidden) return;
    O.sheet = null;
    $("#sv").hidden = true;
    if (!silent) afterClose();
  }
  function clampPan() {
    const W = svBody.clientWidth, H = svBody.clientHeight;
    SV.x = Math.min(0, Math.max(W * (1 - SV.z), SV.x));
    SV.y = Math.min(0, Math.max(H * (1 - SV.z), SV.y));
  }
  function setZoom(z, x, y, anim) {
    SV.z = z; SV.x = x; SV.y = y; clampPan();
    svImg.classList.toggle("anim", !!anim);
    svImg.style.transform = "translate(" + SV.x + "px," + SV.y + "px) scale(" + SV.z + ")";
    svBody.classList.toggle("zoomed", SV.z > 1);
  }
  let drag = null;
  svBody.addEventListener("pointerdown", e => { drag = { x0: e.clientX, y0: e.clientY, x: SV.x, y: SV.y, moved: false }; svBody.setPointerCapture(e.pointerId); });
  svBody.addEventListener("pointermove", e => {
    if (!drag) return;
    const dx = e.clientX - drag.x0, dy = e.clientY - drag.y0;
    if (Math.abs(dx) + Math.abs(dy) > 6) drag.moved = true;
    if (drag.moved && SV.z > 1) { svBody.classList.add("dragging"); setZoom(SV.z, drag.x + dx, drag.y + dy, false); }
  });
  svBody.addEventListener("pointerup", e => {
    svBody.classList.remove("dragging");
    if (drag && !drag.moved) {
      const r = svBody.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top;
      if (SV.z > 1) setZoom(1, 0, 0, true);
      else { const Z = 2.4; setZoom(Z, px * (1 - Z), py * (1 - Z), true); }
    }
    drag = null;
  });
  svBody.addEventListener("wheel", e => {
    e.preventDefault();
    const r = svBody.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top;
    const Z = Math.min(5, Math.max(1, SV.z * (e.deltaY < 0 ? 1.25 : 0.8)));
    setZoom(Z, px - (px - SV.x) * (Z / SV.z), py - (py - SV.y) * (Z / SV.z), false);
  }, { passive: false });
  $("#sv-prev").addEventListener("click", () => stepSheet(-1));
  $("#sv-next").addEventListener("click", () => stepSheet(1));
  $("#sv-close").addEventListener("click", () => closeSheet());

  /* ---------- Documents and videos ---------- */
  function openDoc(file, title) {
    beforeOpen();
    O.pdf = file;
    $("#pdf-title").textContent = title || "Document";
    $("#pdf-frame").src = encodeURI(file) + "#view=FitH";
    $("#pdf").hidden = false;
    $("#pdf-close").focus();
  }
  function closePdf(silent) {
    if (!O.pdf && $("#pdf").hidden) return;
    O.pdf = null;
    $("#pdf").hidden = true;
    $("#pdf-frame").src = "about:blank";
    if (!silent) afterClose();
  }
  $("#pdf-close").addEventListener("click", () => closePdf());
  function openVideo(id) {
    if (navigator.onLine === false) { toast("This video is on YouTube and needs an internet connection.", 6); return; }
    window.open("https://www.youtube.com/watch?v=" + id, "_blank", "noopener");
    toast("Opened on YouTube in a new window. Close it with Ctrl+W to come back.", 6);
  }

  /* ---------- Toast + idle ---------- */
  let toastTimer = null;
  function toast(msg, sec) {
    const t = $("#toast"); t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer);
    if (sec) toastTimer = setTimeout(hideToast, sec * 1000);
  }
  function hideToast() { $("#toast").hidden = true; clearTimeout(toastTimer); }

  let lastInput = Date.now(), counting = false;
  function activity() {
    lastInput = Date.now();
    if (counting) { counting = false; hideToast(); }
    DP.passes = 0; DP.warnAt = 0;
  }
  setInterval(() => {
    const idle = (Date.now() - lastInput) / 1000;
    if (deepOnly() && !DP.paused) {
      if (DP.warnAt) {
        const left = COUNTDOWN - (Date.now() - DP.warnAt) / 1000;
        if (left <= 0) { counting = false; closeAll(); setPlaying(true); }
        else { counting = true; toast("Going back to the showcase in " + Math.ceil(left) + " s. Touch anywhere to stay."); }
      }
    } else if (anyOpen()) {
      const limit = O.pdf || O.sheet ? IDLE_LONG : IDLE_OVERLAY;
      if (idle >= limit + COUNTDOWN) { counting = false; closeAll(); setPlaying(true); }
      else if (idle >= limit) {
        counting = true;
        toast("Going back to the showcase in " + Math.ceil(limit + COUNTDOWN - idle) + " s. Touch anywhere to stay.");
      }
    } else if (!P_.playing && idle >= IDLE_PAUSED) {
      setPlaying(true);
    }
  }, 500);

  let hideTimer = null;
  function pointerSeen() {
    document.body.classList.remove("cursor-hidden");
    document.body.classList.toggle("show-controls", !anyOpen());
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      document.body.classList.remove("show-controls");
      if (!anyOpen()) document.body.classList.add("cursor-hidden");
    }, 3500);
  }
  ["pointerdown", "keydown", "wheel", "touchstart"].forEach(ev => window.addEventListener(ev, activity, { passive: true }));
  window.addEventListener("pointermove", () => { activity(); pointerSeen(); }, { passive: true });

  /* ---------- Clicks ---------- */
  stage.addEventListener("click", e => {
    const t = e.target.closest("[data-act],[data-product],[data-brand],[data-ind],[data-fam],[data-sheet],[data-doc],[data-video],[data-family-play],[data-rail-fam],[data-tab],[data-gal],[data-deep-go],[data-pfam],[data-region]");
    if (!t || t.disabled) return;
    const ds = t.dataset;
    if (ds.act) {
      const a = ds.act;
      if (a === "close-all") { closeAll(); setPlaying(true); }
      else if (a === "back") back();
      else if (a === "explore") { XS.fam = D.p ? D.p.family : "All"; XS.q = ""; openExplore("products"); }
      else if (a === "close-drawer") closeDrawer();
      else if (a === "deep-return") returnFromDeep();
      return;
    }
    if (ds.deepGo != null) { if (O.deep) playDeep(+ds.deepGo); return; }
    if (ds.gal != null) { D.auto = false; showImage(+ds.gal); return; }
    if (ds.tab) { openExplore(ds.tab); return; }
    if (ds.pfam) { XS.fam = ds.pfam; renderProducts(); $("#explore .body").scrollTop = 0; return; }
    if (ds.familyPlay) { playFamily(ds.familyPlay); return; }
    if (ds.railFam) { const f = famById(ds.railFam); if (f.open.tab === "products") { XS.fam = f.id; XS.q = ""; } openExplore(f.open.tab); return; }
    if (ds.fam) { XS.fam = ds.fam; XS.q = ""; openExplore("products"); return; }
    if (ds.sheet) { const [pid, i] = ds.sheet.split(":"); openSheet(pid, +i || 0); return; }
    if (ds.doc) { openDoc(ds.doc, ds.title); return; }
    if (ds.video) { openVideo(ds.video); return; }
    if (ds.brand) { openDrawer("brand", ds.brand); return; }
    if (ds.ind) { openDrawer("ind", ds.ind); return; }
    if (ds.region) { openExplore("company"); return; }
    if (ds.product) { openProduct(ds.product); return; }
  });
  stage.addEventListener("input", e => {
    if (e.target.id === "p-q") { XS.q = e.target.value; renderProducts(); }
  });
  $("#explore-btn").addEventListener("click", e => { e.stopPropagation(); openExplore("products"); });
  learnBtn.addEventListener("click", e => { e.stopPropagation(); openLearn(); });
  $("#c-prev").addEventListener("click", () => next(-1));
  $("#c-next").addEventListener("click", () => next(1));
  $("#c-play").addEventListener("click", () => setPlaying(!P_.playing));
  $("#c-fs").addEventListener("click", toggleFs);
  function toggleFs() {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen().catch(() => {});
  }

  /* ---------- Keyboard ---------- */
  window.addEventListener("keydown", e => {
    if (e.target.matches && e.target.matches("input, textarea")) {
      if (e.key === "Escape") e.target.blur();
      return;
    }
    const k = e.key;
    if (k === "Escape") {
      if (O.sheet) closeSheet();
      else if (O.pdf) closePdf();
      else if (O.drawer) closeDrawer();
      else if (O.history.length) back();
      else if (O.explore) closeExplore();
      else if (O.deep) returnFromDeep();
      return;
    }
    if (O.sheet) { if (k === "ArrowRight") stepSheet(1); else if (k === "ArrowLeft") stepSheet(-1); return; }
    if (O.pdf) return;
    const key = k.toLowerCase();
    if (key === "f") { toggleFs(); return; }
    const tabKeys = { e: "products", b: "brands", i: "industries", d: "docs", a: "company", v: "videos", c: "contact" };
    if (tabKeys[key]) { openExplore(tabKeys[key]); return; }
    if (key === "s") { XS.fam = "All"; openExplore("products"); setTimeout(() => { const q = $("#p-q"); if (q) q.focus(); }, 50); e.preventDefault(); return; }
    if (deepOnly()) {
      if (k === " ") { e.preventDefault(); toggleDeepPause(); }
      else if (k === "ArrowRight") stepDeep(1);
      else if (k === "ArrowLeft") stepDeep(-1);
      return;
    }
    if (anyOpen()) return;
    if (k === " ") { e.preventDefault(); setPlaying(!P_.playing); }
    else if (key === "l") openLearn();
    else if (k === "ArrowRight") next(1);
    else if (k === "ArrowLeft") next(-1);
    else if (/^[0-9]$/.test(k)) { const f = fams[(+k + 9) % 10]; if (f) playFamily(f.id); }
  });

  /* ---------- Start ---------- */
  function preload() {
    const names = new Set(SC.images);
    SC.list.forEach(() => {});
    Object.values(DEEP).forEach(def => SC.deepImages(def).forEach(n => names.add(n)));
    names.forEach(n => { const i = new Image(); i.src = SC.src(n); });
  }
  preload();
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => {
    const q = new URLSearchParams(location.search);
    const byId = SC.list.findIndex(s => s.id === q.get("scene"));
    const start = parseInt(q.get("scene") || "0", 10);
    playScene(byId >= 0 ? byId : (isNaN(start) ? 0 : start));
    if (q.get("deep") && DEEP[q.get("deep")]) openDeep(q.get("deep"), Math.max(0, (parseInt(q.get("slide"), 10) || 1) - 1));
    if (q.get("explore")) openExplore(q.get("explore"));
    if (q.get("product")) openProduct(q.get("product"));
    if (q.get("brand")) openDrawer("brand", q.get("brand"));
    if (q.get("industry")) openDrawer("ind", q.get("industry"));
    if (q.get("sheet")) { const [pid, i] = q.get("sheet").split(":"); openSheet(pid, +i || 0); }
    if (q.get("pause")) setPlaying(false);
  });

  // Hooks for testing from the console
  window.Show = { playScene, setPlaying, openProduct, openExplore, openDrawer, openDeep, closeDeep, closeAll, openSheet, state: P_, overlays: O, deep: DP };
})();
