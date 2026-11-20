/* Science Gates booth showcase: the attract-loop "film" and the Learn more slide layouts.
   Each scene builds its DOM into api.root and adds animation to api.tl (a paused GSAP timeline).
   Anything tagged data-product / data-brand / data-fam / data-ind / data-region opens the matching view. */
window.Scenes = (function () {
  "use strict";
  const C = window.CATALOG, A = window.SG;
  const NS = "http://www.w3.org/2000/svg";
  const P = id => C.products[id];
  const B = id => C.brands.find(b => b.id === id);

  /* ---------- Image helpers ---------- */
  function src(name) {
    if (!name) return "";
    if (/^[pt]-/.test(name)) return "assets/prod/" + name + ".webp";
    if (/^s-/.test(name)) return "assets/sheets/" + name + ".webp";
    if (/\.(png|svg|jpg|webp)$/.test(name)) return "assets/img/" + name;
    return "assets/img/" + name + ".webp";
  }
  const pimg = id => { const p = P(id); return p && p.img.length ? p.img[0] : null; };
  const brandName = id => { const b = B(id); return b ? b.name : ""; };

  /* ---------- DOM helpers ---------- */
  function el(tag, cls, parent, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    if (parent) parent.appendChild(e);
    return e;
  }
  function pos(e, x, y, w, h) {
    e.style.left = x + "px"; e.style.top = y + "px";
    if (w != null) e.style.width = w + "px";
    if (h != null) e.style.height = h + "px";
    return e;
  }
  function s(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }
  /* Text with \n line breaks -> word spans for staggered entrances */
  function words(text) {
    return String(text).split("\n").map(line => line.split(" ").map(w => '<span class="w">' + esc(w) + "</span>").join(" ")).join("<br>");
  }
  const rnd = (a, b) => a + Math.random() * (b - a);
  const fmt = (n, d) => n.toFixed(d);
  const num = n => Number(n).toLocaleString("en-US");

  /* Small line icons (24 × 24, stroke) */
  const ICONS = {
    food: '<path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M16 3c-2 0-3 3-3 6s1 4 3 4v8"/>',
    flask: '<path d="M9 3h6M10 3v6L4.5 19a1.5 1.5 0 0 0 1.3 2h12.4a1.5 1.5 0 0 0 1.3-2L14 9V3"/><path d="M7 15h10"/>',
    air: '<path d="M3 8h11a3 3 0 1 0-3-3M3 12h16a3 3 0 1 1-3 3M3 16h8"/>',
    pill: '<rect x="3" y="8.5" width="18" height="7" rx="3.5" transform="rotate(-45 12 12)"/><path d="m9.5 9.5 5 5"/>',
    leaf: '<path d="M5 19c0-8 5-14 15-15-1 10-7 15-15 15z"/><path d="M5 19 13 11"/>',
    atom: '<circle cx="12" cy="12" r="1.6"/><ellipse cx="12" cy="12" rx="9" ry="3.6"/><ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(120 12 12)"/>',
    drop: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
    chain: '<rect x="2.5" y="9" width="10" height="6" rx="3"/><rect x="11.5" y="9" width="10" height="6" rx="3"/>',
    dna: '<path d="M7 3c0 6 10 6 10 12s-10 6-10 6M17 3c0 6-10 6-10 12M8 7h8M8 17h8M9.5 12h5"/>',
    tool: '<path d="M14.5 6.5a4 4 0 0 0 5 5L12 19a2.1 2.1 0 0 1-3-3l7.5-7.5a4 4 0 0 0-2-2z"/>',
    bench: '<path d="M3 9h18M5 9v11M19 9v11M5 14h14M8 9V5h8v4"/>',
    sales: '<path d="M4 20V10M10 20V4M16 20v-7M21 20H3"/>',
    service: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/>',
    warehouse: '<path d="M3 10 12 4l9 6v10H3z"/><path d="M7 20v-6h10v6M7 17h10"/>',
    demo: '<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M8 20h8M12 16v4M10 8l4 2-4 2z"/>',
    training: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>',
    whatsapp: '<path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.3-1.8-1-.9.8c-1-.5-1.8-1.3-2.3-2.3l.8-.9-1-1.8z" fill="currentColor" stroke="none"/>',
    phone: '<path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="m3.5 6 8.5 7 8.5-7"/>',
    pin: '<path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>'
  };
  function icon(name, cls) { return '<svg class="' + (cls || "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[name] || "") + "</svg>"; }

  /* QR code as an inline SVG string (qrcode-generator, vendored) */
  function qrSvg(text, dark) {
    try {
      const q = window.qrcode(0, "M"); q.addData(text); q.make();
      const n = q.getModuleCount(), m = 2;
      let d = "";
      for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) d += "M" + (c + m) + " " + (r + m) + "h1v1h-1z";
      return '<svg viewBox="0 0 ' + (n + 2 * m) + " " + (n + 2 * m) + '" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="#fff"/><path d="' + d + '" fill="' + (dark || "#111") + '"/></svg>';
    } catch (e) { return ""; }
  }
  const waLink = text => "https://wa.me/" + A.company.whatsapp + "?text=" + encodeURIComponent(text);

  /* Company headline numbers */
  const facts = [
    { big: A.company.founded, small: "Founded in Subang Jaya, Selangor" },
    { big: String(C.stats.brands), small: "principal brands from the USA, Europe and Asia" },
    { big: String(C.stats.products), small: "products in our catalogue" },
    { big: "50+", small: "years of leadership experience" }
  ];

  /* ---------- Scene API ---------- */
  function makeApi(root, tl) {
    const api = { root, tl, loops: [] };

    api.art = function () { return s("svg", { class: "art", viewBox: "0 0 1920 1080" }, root); };
    api.text = function (tag, cls, x, y, w, html) { return pos(el(tag, cls, root, html), x, y, w); };
    api.title = function (text, x, y, w, cls) { return api.text("h1", cls || "h1", x, y, w, words(text)); };

    api.rise = function (target, at, o) {
      const t = typeof target === "string" ? root.querySelectorAll(target) : target;
      const els = t instanceof Element && t.querySelectorAll(".w").length ? t.querySelectorAll(".w") : t;
      tl.from(els, Object.assign({ y: 46, opacity: 0, duration: 0.85, ease: "power3.out", stagger: 0.055 }, o || {}), at);
    };
    api.fade = function (target, at, o) {
      tl.from(target, Object.assign({ opacity: 0, y: 24, duration: 0.8, ease: "power2.out" }, o || {}), at);
    };

    /* A picture: product photo (white background), photo or banner */
    api.spot = function (name, x, y, w, h, o) {
      o = o || {};
      const d = pos(el("div", "spot " + (o.cls || ""), root), x, y, w, h);
      if (o.product) d.dataset.product = o.product;
      if (o.brand) d.dataset.brand = o.brand;
      const im = el("img", "", d); im.src = src(name); im.alt = o.alt || "";
      if (o.badge) { const b = el("span", "badge new", d, esc(o.badge)); b.style.cssText = "position:absolute;top:10px;left:10px"; }
      return d;
    };
    api.prod = function (id, x, y, w, h, o) {
      const p = P(id); if (!p) return pos(el("div", "", root), x, y, w, h);
      return api.spot(pimg(id), x, y, w, h, Object.assign({ product: id, alt: p.name }, o || {}));
    };
    api.cap = function (x, y, w, name, line, product, eyebrow) {
      const c = api.text("div", "cap", x, y, w, (eyebrow ? "<em>" + esc(eyebrow) + "</em>" : "") + "<b>" + esc(name) + "</b>" + (line ? "<span>" + esc(line) + "</span>" : ""));
      if (product) c.dataset.product = product;
      return c;
    };
    api.chips = function (x, y, w, list) {
      return api.text("div", "chips", x, y, w, list.map(c => typeof c === "string" ? '<span class="chip">' + esc(c) + "</span>"
        : '<button class="chip" ' + c[1] + '="' + esc(c[2]) + '">' + esc(c[0]) + "</button>").join(""));
    };
    api.button = function (label, x, y, attr, val, cls) {
      const b = pos(el("button", "btn " + (cls || "primary"), root, esc(label)), x, y);
      b.setAttribute(attr, val);
      return b;
    };

    /* The home-page hero banner, full width under the header, with tappable products.
       spots: [{ p, x, y, w, h, dot: [x, y] }] in banner pixels (1600 × 700). */
    api.banner = function (n, spots, at) {
      const K = 1.2, Y0 = 136;
      const wrap = pos(el("div", "", root), 0, Y0, 1920, 840);
      wrap.style.overflow = "hidden";
      const inner = el("div", "", wrap);
      inner.style.cssText = "position:absolute;inset:0;transform-origin:62% 50%";
      const im = el("img", "", inner); im.src = src("banner" + n); im.alt = "";
      im.style.cssText = "position:absolute;left:0;top:0;width:1920px;height:840px";
      const veil = el("div", "", wrap);
      veil.style.cssText = "position:absolute;inset:0;pointer-events:none;background:linear-gradient(90deg,rgba(255,255,255,.94) 0%,rgba(255,255,255,.82) 30%,rgba(255,255,255,0) 50%),linear-gradient(180deg,rgba(255,255,255,0) 80%,#fff 100%)";
      const svg = s("svg", { viewBox: "0 0 1920 840", style: "position:absolute;inset:0;width:1920px;height:840px;overflow:visible;pointer-events:none" }, inner);
      const rings = [];
      (spots || []).forEach(sp => {
        const hs = pos(el("button", "", inner), sp.x * K, sp.y * K, sp.w * K, sp.h * K);
        hs.style.cssText += ";position:absolute;background:none;border:0;padding:0;cursor:pointer";
        hs.dataset.product = sp.p; hs.setAttribute("aria-label", (P(sp.p) || {}).name || "");
        if (sp.dot) {
          const r = s("circle", { cx: sp.dot[0] * K, cy: sp.dot[1] * K, r: 8, fill: "none", stroke: "#ED2926", "stroke-width": 3, opacity: 0 }, svg);
          rings.push(r);
        }
      });
      tl.from(im, { opacity: 0, duration: 1.2, ease: "power1.out" }, at || 0);
      api.loop(gsap.fromTo(inner, { scale: 1 }, { scale: 1.045, duration: 16, ease: "sine.inOut", yoyo: true, repeat: -1 }), at || 0);
      return { wrap, inner, svg, rings, K, Y0 };
    };
    /* Pulse one ring after another */
    api.pulseRings = function (rings, start, gap) {
      rings.forEach((r, i) => {
        api.loop(gsap.fromTo(r, { attr: { r: 8 }, opacity: 0.95 }, { attr: { r: 34 }, opacity: 0, duration: 1.6, ease: "power1.out", repeat: -1, repeatDelay: gap * rings.length - 1.6 > 0 ? gap * rings.length - 1.6 : 0.4 }), start + i * gap);
      });
    };

    /* Animate an SVG path drawing on */
    api.draw = function (path, at, dur, ease) {
      const L = path.getTotalLength();
      path.style.strokeDasharray = L + " " + L;
      path.style.strokeDashoffset = L;
      tl.to(path, { strokeDashoffset: 0, duration: dur || 1.2, ease: ease || "power1.inOut" }, at);
    };

    /* Register an endless ambient tween; it starts at `at` on the scene timeline */
    api.loop = function (tw, at) {
      tw.pause();
      const l = { tw, at: at || 0, started: false };
      api.loops.push(l);
      tl.call(() => { l.started = true; tw.play(); }, null, at || 0);
      return l;
    };
    api.every = function (sec, fn, at) {
      fn();
      return api.loop(gsap.to({}, { duration: sec, repeat: -1, onRepeat: fn }), at);
    };
    api.frame = function (fn, at) {
      let last = 0;
      const st = { t: 0 };
      return api.loop(gsap.to(st, { t: 1, duration: 1, repeat: -1, ease: "none", onUpdate() {
        const now = performance.now();
        const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
        last = now; fn(dt);
      } }), at);
    };
    /* Count a number up on the timeline */
    api.count = function (elm, to, at, dur, dec, suffix) {
      const o = { v: 0 };
      elm.textContent = fmt(0, dec || 0) + (suffix || "");
      tl.to(o, { v: to, duration: dur || 1.6, ease: "power2.out", onUpdate: () => { elm.textContent = (dec ? fmt(o.v, dec) : num(Math.round(o.v))) + (suffix || ""); } }, at);
    };

    /* Dots travelling along a path */
    api.flow = function (path, at, o) {
      o = Object.assign({ n: 10, r: 5, color: "#ED2926", dur: 3, halo: true }, o || {});
      const svg = path.ownerSVGElement, L = path.getTotalLength();
      const g = s("g", { opacity: 0 }, svg);
      const dots = [];
      for (let i = 0; i < o.n; i++) {
        const halo = o.halo ? s("circle", { r: o.r * 2.6, fill: o.color, opacity: 0.18 }, g) : null;
        const core = s("circle", { r: o.r, fill: o.color }, g);
        dots.push([halo, core]);
      }
      const st = { t: 0 };
      function upd() {
        for (let i = 0; i < o.n; i++) {
          const u = (st.t + i / o.n) % 1;
          const p = path.getPointAtLength(L * u);
          const a = Math.min(1, u / 0.05, (1 - u) / 0.05);
          for (const c of dots[i]) if (c) { c.setAttribute("cx", p.x); c.setAttribute("cy", p.y); }
          dots[i][1].setAttribute("opacity", a);
          if (dots[i][0]) dots[i][0].setAttribute("opacity", 0.18 * a);
        }
      }
      upd();
      api.loop(gsap.to(st, { t: 1, duration: o.dur, ease: "none", repeat: -1, onUpdate: upd }), at);
      tl.to(g, { opacity: 1, duration: 0.6 }, at);
      return g;
    };

    /* A live scrolling trace. gen() returns 0..1 for each new sample. */
    api.trace = function (svg, x, y, w, h, at, o) {
      o = Object.assign({ n: 90, dt: 0.12, color: "#ED2926", width: 3, fill: true, gen: () => 0.2 }, o || {});
      const g = s("g", {}, svg);
      s("line", { x1: x, y1: y + h, x2: x + w, y2: y + h, stroke: "#D9D9D9", "stroke-width": 1.5 }, g);
      const area = o.fill ? s("path", { fill: o.color, opacity: 0.1 }, g) : null;
      const line = s("polyline", { fill: "none", stroke: o.color, "stroke-width": o.width, "stroke-linejoin": "round", "stroke-linecap": "round" }, g);
      const vals = Array.from({ length: o.n }, () => o.gen(true));
      function draw() {
        const pts = vals.map((v, i) => (x + w * i / (o.n - 1)).toFixed(1) + "," + (y + h - h * Math.max(0, Math.min(1, v))).toFixed(1));
        line.setAttribute("points", pts.join(" "));
        if (area) area.setAttribute("d", "M" + x + " " + (y + h) + " L" + pts.join(" L") + " L" + (x + w) + " " + (y + h) + "Z");
      }
      draw();
      api.every(o.dt, () => { vals.shift(); vals.push(o.gen()); draw(); }, at);
      return { g, line, vals };
    };

    /* Highlight a list of elements one after another with the class "hl" */
    api.sweep = function (els, start, gap, cls) {
      els.forEach((t, i) => tl.call(() => els.forEach(x => x.classList.toggle(cls || "hl", x === t)), null, start + i * gap));
    };
    return api;
  }

  /* Four logo dots, growing grey to red (the "Partners in science · · · ●" motif) */
  function logoDots(svg, x, y, sc) {
    const g = s("g", { transform: "translate(" + x + " " + y + ") scale(" + (sc || 1) + ")" }, svg);
    const spec = [[0, 4, "#BDBDBD"], [26, 6, "#E58C8A"], [58, 8.5, "#ED4F4C"], [98, 13, "#ED2926"]];
    return spec.map(([dx, r, c]) => s("circle", { cx: dx, cy: 0, r, fill: c }, g));
  }

  /* Malaysia map with regions, HQ and links. Used by the network scene, Learn more and Explore. */
  function malaysiaMap(parent, w, opts) {
    opts = opts || {};
    const M = window.MALAYSIA;
    const h = Math.round(w * M.h / M.w);
    const wrap = el("div", "mymap", parent);
    wrap.style.width = w + "px"; wrap.style.height = h + "px";
    const svg = s("svg", { viewBox: "0 0 " + M.w + " " + M.h }, wrap);
    const land = s("g", {}, svg);
    const paths = M.states.map(st => {
      const p = s("path", { d: st.d, class: "st" }, land);
      p.dataset.region = st.r; p.dataset.state = st.n;
      return p;
    });
    // region label anchors (in map pixels) and HQ links
    const anchors = { north: [62, 132, "Northern"], central: [112, 300, "Central"], south: [235, 380, "Southern"], east: [212, 150, "Eastern"], borneo: [880, 215, "East Malaysia"] };
    const links = s("g", {}, svg), labels = s("g", {}, svg), nodes = s("g", {}, svg);
    const hx = M.hq[0], hy = M.hq[1];
    const reg = {};
    Object.keys(anchors).forEach(k => {
      const [ax, ay, name] = anchors[k];
      let d;
      if (k === "central") d = null;
      else { const mx = (hx + ax) / 2, my = Math.min(hy, ay) - (k === "borneo" ? 150 : 40); d = "M" + hx + " " + hy + " Q" + mx + " " + my + " " + ax + " " + ay; }
      const link = d ? s("path", { class: "lnk", d }, links) : null;
      const node = k === "central" ? null : s("circle", { class: "node", cx: ax, cy: ay, r: 7 }, nodes);
      const lx = k === "borneo" ? ax : k === "north" ? ax - 14 : ax + 14;
      const anchor = k === "north" ? "end" : k === "borneo" ? "middle" : "start";
      const ly = k === "borneo" ? ay - 22 : k === "central" ? hy + 46 : ay + 6;
      const t = s("text", { class: "rl", x: k === "central" ? hx - 18 : lx, y: ly, "text-anchor": k === "central" ? "end" : anchor }, labels);
      t.textContent = name;
      reg[k] = { link, node, label: t, paths: paths.filter(p => p.dataset.region === k) };
    });
    const pulse = s("circle", { class: "pulse", cx: hx, cy: hy, r: 8 }, nodes);
    const hq = s("circle", { class: "hq", cx: hx, cy: hy, r: 9 }, nodes);
    const hqL = s("text", { class: "rl sm", x: hx - 18, y: hy + 6, "text-anchor": "end" }, labels); hqL.textContent = "HQ Subang Jaya";
    if (opts.interactive !== false) paths.forEach(p => { p.style.cursor = "pointer"; });
    return { wrap, svg, paths, reg, pulse, hq, hqL, h, scale: w / M.w };
  }

  /* =====================================================================
     Scenes
     ===================================================================== */
  const list = [];

  /* 1. Opening: Partners in science */
  list.push({ id: "intro", family: null, dur: 17, build(a) {
    const svg = a.art();
    const picks = ["4612134", "4615292", "4752186", "4612139", "4735041", "4766462", "4735355", "4759498", "4751674", "4741594", "4782405", "5278358"];
    // a loose constellation of products, joined by thin "bond" lines like a molecule
    const nodes = [[1180, 272, 220], [1470, 250, 200], [1730, 318, 186], [1060, 530, 196], [1330, 490, 236], [1620, 556, 206],
      [1150, 770, 176], [1440, 756, 186], [1720, 780, 176]];
    const bonds = [[0, 1], [1, 2], [0, 3], [0, 4], [1, 4], [4, 5], [2, 5], [3, 6], [4, 7], [5, 8], [6, 7], [7, 8], [3, 4]];
    const bondEls = bonds.map(([i, j]) => s("line", { x1: nodes[i][0], y1: nodes[i][1], x2: nodes[j][0], y2: nodes[j][1], stroke: "#E2E6EA", "stroke-width": 2 }, svg));
    const spots = [];
    picks.slice(0, 9).forEach((id, i) => {
      const [x, y, sz] = nodes[i];
      const ring = s("circle", { cx: x, cy: y, r: sz / 2 + 6, fill: "#FFFFFF", stroke: "#ECECEC", "stroke-width": 2 }, svg);
      spots.push([ring, a.prod(id, x - sz * 0.36, y - sz * 0.36, sz * 0.72, sz * 0.72)]);
    });
    const kick = a.text("div", "kick", 96, 196, 760, "Trailblazing innovation");
    const h = a.title("Partners\nin science.", 96, 240, 820, "display");
    const lede = a.text("p", "lede", 96, 470, 760, "Laboratory equipment and scientific instruments from leading manufacturers in the USA, Europe and Asia, supplied and supported across Malaysia since 2004.");
    const tags = facts.map((f, i) => a.text("div", "tag", 96 + i * 210, 680, 196, "<b>" + esc(f.big) + "</b><span>" + esc(f.small) + "</span>"));
    tags.forEach(t => { t.querySelector("b").style.fontSize = "44px"; t.querySelector("span").style.fontSize = "16px"; });
    const dots = logoDots(svg, 590, 300, 1);
    a.fade(kick, 0.2, { y: -10 });
    a.rise(h, 0.4, { stagger: 0.12 });
    a.tl.from(dots, { attr: { r: 0 }, duration: 0.5, stagger: 0.18, ease: "back.out(2)" }, 1.2);
    a.fade(lede, 1.4);
    bondEls.forEach((b, i) => a.draw(b, 1.0 + i * 0.08, 0.7));
    spots.forEach(([r, sp], i) => {
      a.tl.from(r, { attr: { r: 0 }, duration: 0.6, ease: "back.out(1.6)" }, 1.3 + i * 0.16);
      a.tl.from(sp, { opacity: 0, scale: 0.6, duration: 0.7, ease: "back.out(1.6)" }, 1.4 + i * 0.16);
    });
    tags.forEach((t, i) => a.fade(t, 2.6 + i * 0.3, { y: 18 }));
    // gentle drift of the constellation
    spots.forEach(([r, sp], i) => a.loop(gsap.to(sp, { y: (i % 2 ? -1 : 1) * 8, duration: 3 + (i % 3), ease: "sine.inOut", yoyo: true, repeat: -1 }), 3.2));
    a.count(tags[1].querySelector("b"), C.stats.brands, 2.9, 1.4);
    a.count(tags[2].querySelector("b"), C.stats.products, 3.2, 1.6);
  } });

  /* 2. Lab water: RephiLe (home banner 1) */
  list.push({ id: "water", family: "water", dur: 16, build(a) {
    const bn = a.banner(1, [
      { p: "4612134", x: 1105, y: 120, w: 200, h: 410, dot: [1122, 260] },
      { p: "4612131", x: 905, y: 255, w: 130, h: 160, dot: [958, 278] },
      { p: "4612133", x: 845, y: 385, w: 110, h: 160, dot: [881, 514] },
      { p: "4612132", x: 1035, y: 405, w: 105, h: 140, dot: [1097, 525] }], 0);
    const kick = a.text("div", "kick", 96, 210, 700, "RephiLe");
    const h = a.title("Lab Water\nPurification\nSystems", 96, 254, 760, "display");
    h.style.fontSize = "80px";
    const lede = a.text("p", "lede", 96, 560, 640, "Continuous electro-deionization and advanced purification, with purity monitored after every purification step.");
    const types = [["Type I", "Ultrapure", "492150"], ["Type II", "Pure", "492151"], ["Type III", "RO water", "492152"]];
    const tiles = types.map((t, i) => {
      const n = Object.values(C.products).filter(p => p.cats.includes(t[2])).length;
      const b = pos(el("button", "tile", a.root, "<b>" + t[0] + "</b><span>" + t[1] + "<br>" + n + " systems</span>"), 96 + i * 236, 712, 220, 112);
      b.dataset.fam = "water";
      return b;
    });
    const ro = a.text("div", "readout", 1560, 500, 330, '<div class="hl"><span>Ultrapure</span><b class="rv">0.0 MΩ·cm</b></div><div><span>TOC</span><b>&lt; 2 ppb</b></div><div><span>EDI water</span><b>10–16 MΩ·cm</b></div>');
    ro.dataset.product = "4612131";
    const roc = a.text("div", "small", 1560, 702, 330, "Genie G at 25 °C, from tap water");
    roc.style.fontSize = "15px";
    a.fade(kick, 0.3, { y: -10 }); a.rise(h, 0.5, { stagger: 0.1 }); a.fade(lede, 1.4);
    a.fade([ro, roc], 2.4);
    const rv = ro.querySelector(".rv"), o = { v: 0 };
    a.tl.to(o, { v: 18.2, duration: 2.4, ease: "power2.out", onUpdate: () => { rv.textContent = fmt(o.v, 1) + " MΩ·cm"; } }, 2.6);
    a.tl.from(tiles, { opacity: 0, y: 26, duration: 0.6, stagger: 0.15 }, 2.0);
    a.sweep(tiles, 3.2, 1.6);
    a.pulseRings(bn.rings, 2.6, 0.9);
  } });

  /* 3. Filtration: Advantec (home banner 2) */
  list.push({ id: "filtration", family: "filtration", dur: 15, build(a) {
    const bn = a.banner(2, [
      { p: "4709749", x: 735, y: 160, w: 290, h: 190, dot: [980, 222] },
      { p: "4709832", x: 1050, y: 185, w: 260, h: 175, dot: [1269, 334] },
      { p: "4725720", x: 720, y: 395, w: 280, h: 135, dot: [882, 417] },
      { p: "4725790", x: 1030, y: 380, w: 310, h: 165, dot: [1243, 537] }], 0);
    const kick = a.text("div", "kick", 96, 210, 700, "Advantec · since 1916");
    const h = a.title("Filter Papers\nand Membranes", 96, 254, 760, "display");
    h.style.fontSize = "80px";
    const lede = a.text("p", "lede", 96, 470, 640, "Japan's first manufacturer of laboratory filter paper, and the only one in Japan making every type of filtration media, from laboratory to industrial use.");
    const media = [["Qualitative", "4709749"], ["Quantitative", "4709832"], ["Glass fiber", "4725737"], ["Quartz fiber", "4725753"], ["MCE membranes", "4725790"], ["Thimbles", "4725720"]];
    const chips = a.chips(96, 684, 700, media.map(m => [m[0], "data-product", m[1]]));
    const more = a.text("div", "small", 96, 812, 680, "Also: RephiQuik syringe filters and Wanox cell culture, centrifuge and PCR plastics.");
    a.fade(kick, 0.3, { y: -10 }); a.rise(h, 0.5, { stagger: 0.1 }); a.fade(lede, 1.3);
    a.rise(chips.children, 2.0, { y: 16, stagger: 0.1 });
    a.fade(more, 3.0);
    a.pulseRings(bn.rings, 2.4, 0.9);
  } });

  /* 4. Elemental: CKIC calorimeters (home banner 3) */
  list.push({ id: "elemental", family: "elemental", dur: 16, build(a) {
    const bn = a.banner(3, [
      { p: "4612127", x: 770, y: 285, w: 265, h: 220, dot: [932, 298] },
      { p: "4615294", x: 960, y: 205, w: 230, h: 210, dot: [1052, 222] },
      { p: "4615292", x: 1130, y: 290, w: 220, h: 220, dot: [1317, 304] }], 0);
    const kick = a.text("div", "kick", 96, 210, 700, "CKIC");
    const h = a.title("Automatic\nCalorimeters", 96, 254, 760, "display");
    h.style.fontSize = "80px";
    const lede = a.text("p", "lede", 96, 470, 620, "Calorific value of coal, coke, oil, biomass and foodstuffs, plus sulfur, carbon, nitrogen, halogen and mercury analysers.");
    // 8-minute analysis ring and a calorific value readout
    const svg = a.art();
    const cx = 220, cy = 770, R = 74;
    s("circle", { cx, cy, r: R, fill: "#FFFFFF", stroke: "#EEEEEE", "stroke-width": 12 }, svg);
    const arc = s("circle", { cx, cy, r: R, fill: "none", stroke: "#ED2926", "stroke-width": 12, "stroke-linecap": "round", transform: "rotate(-90 " + cx + " " + cy + ")" }, svg);
    const C0 = 2 * Math.PI * R;
    arc.style.strokeDasharray = C0; arc.style.strokeDashoffset = C0;
    const t1 = a.text("div", "", cx - 70, cy - 34, 140, '<b style="display:block;text-align:center;font-size:44px;font-weight:700;line-height:1">8</b><span style="display:block;text-align:center;font-size:16px;color:var(--muted)">minutes</span>');
    const ro = a.text("div", "readout", 330, 700, 360, '<div><span>Analysis</span><b class="st">Running</b></div><div class="hl"><span>Calorific value</span><b class="cv">0.00 MJ/kg</b></div>');
    ro.dataset.product = "4615292";
    const note = a.text("div", "small", 330, 852, 380, "5E-C5808: 8 minutes per sample. Values shown are illustrative.");
    note.style.fontSize = "15px";
    a.fade(kick, 0.3, { y: -10 }); a.rise(h, 0.5, { stagger: 0.1 }); a.fade(lede, 1.3);
    a.fade([t1, ro], 2.0);
    a.tl.from(svg, { opacity: 0, duration: 0.6 }, 2.0);
    a.tl.to(arc, { strokeDashoffset: 0, duration: 7, ease: "none" }, 2.4);
    const cv = ro.querySelector(".cv"), stt = ro.querySelector(".st");
    a.tl.call(() => { stt.textContent = "Running"; cv.textContent = "…"; }, null, 2.4);
    const o = { v: 0 };
    a.tl.to(o, { v: 27.46, duration: 1.2, ease: "power2.out", onUpdate: () => { cv.textContent = fmt(o.v, 2) + " MJ/kg"; } }, 9.4);
    a.tl.call(() => { stt.textContent = "Complete"; }, null, 9.4);
    a.fade(note, 3.0);
    a.pulseRings(bn.rings, 2.6, 1.0);
  } });

  /* 5. Climate: Pol-Eko (home banner 4) */
  list.push({ id: "climate", family: "climate", dur: 15, build(a) {
    const bn = a.banner(4, [
      { p: "4752186", x: 810, y: 190, w: 90, h: 340, dot: [988, 207] },
      { p: "4752186", x: 1110, y: 230, w: 105, h: 300, dot: [1168, 242] },
      { p: "4752144", x: 895, y: 340, w: 215, h: 260, dot: [1007, 353] },
      { p: "4752186", x: 1230, y: 290, w: 85, h: 240, dot: [1305, 302] }], 0);
    const kick = a.text("div", "kick", 96, 210, 700, "Pol-Eko · Perfect Environment");
    const h = a.title("Climatic\nChambers", 96, 254, 760, "display");
    h.style.fontSize = "80px";
    const lede = a.text("p", "lede", 96, 470, 620, "Climatic chambers, incubators, drying ovens, refrigerators and ultra-low freezers from a Polish manufacturer with more than 30 years' experience.");
    const ro = a.text("div", "readout", 96, 680, 420, '<div class="hl"><span>Temperature</span><b class="t">25.0 °C</b></div><div class="hl"><span>Humidity</span><b class="rh">60 %RH</b></div><div><span>Programme</span><b class="pg">Step 1 of 4</b></div>');
    ro.dataset.product = "4752186";
    const note = a.text("div", "small", 96, 880, 420, "Set points shown are illustrative.");
    note.style.fontSize = "15px";
    const svg = a.art();
    const tr = a.trace(svg, 560, 700, 300, 130, 2.2, { n: 60, dt: 0.15, fill: false, gen: () => 0.55 + rnd(-0.05, 0.05) });
    const trl = a.text("div", "small", 560, 840, 300, "Chamber temperature, live");
    trl.style.fontSize = "15px";
    a.fade(kick, 0.3, { y: -10 }); a.rise(h, 0.5, { stagger: 0.1 }); a.fade(lede, 1.3);
    a.fade(ro, 2.0); a.fade([note, trl], 2.4);
    a.tl.from(tr.g, { opacity: 0, duration: 0.6 }, 2.2);
    let step = 0;
    const sets = [[25, 60], [30, 65], [40, 75], [5, 0]];
    a.every(2.8, () => {
      const [t, rh] = sets[step % 4];
      ro.querySelector(".t").textContent = fmt(t + rnd(-0.1, 0.1), 1) + " °C";
      ro.querySelector(".rh").textContent = rh ? rh + " %RH" : "off";
      ro.querySelector(".pg").textContent = "Step " + ((step % 4) + 1) + " of 4";
      step++;
    }, 3.2);
    a.pulseRings(bn.rings, 2.6, 0.9);
  } });

  /* 6. Specac presses (home banner 5) */
  list.push({ id: "specac", family: "prep", dur: 15, build(a) {
    const bn = a.banner(5, [
      { p: "4612140", x: 835, y: 185, w: 165, h: 300, dot: [848, 265] },
      { p: "4612139", x: 1000, y: 195, w: 240, h: 150, dot: [1078, 220] },
      { p: "4612143", x: 1020, y: 345, w: 110, h: 220, dot: [1043, 488] },
      { p: "4612141", x: 1135, y: 290, w: 145, h: 255, dot: [1261, 474] }], 0);
    const kick = a.text("div", "kick", 96, 210, 700, "Specac · since 1971");
    const h = a.title("Laboratory\nPellet Press", 96, 254, 760, "display");
    h.style.fontSize = "80px";
    const lede = a.text("p", "lede", 96, 470, 620, "Hydraulic presses and pellet dies for FTIR and XRF sample preparation, from mini presses to the automatic Autotouch.");
    // powder to pellet: press, then the pellet
    // a small hydraulic press: frame, ram, die with powder, and the finished pellet
    const svg = a.art();
    const g = s("g", { transform: "translate(104 668)" }, svg);
    s("rect", { x: 0, y: 176, width: 170, height: 22, rx: 6, fill: "#2F5D9A" }, g);
    s("rect", { x: 14, y: 0, width: 14, height: 180, rx: 4, fill: "#B8C2CA" }, g);
    s("rect", { x: 142, y: 0, width: 14, height: 180, rx: 4, fill: "#B8C2CA" }, g);
    s("rect", { x: 4, y: 0, width: 162, height: 24, rx: 6, fill: "#2F5D9A" }, g);
    const ram = s("g", {}, g);
    s("rect", { x: 72, y: 24, width: 26, height: 40, fill: "#8D99A3" }, ram);
    s("rect", { x: 62, y: 62, width: 46, height: 14, rx: 3, fill: "#5D6B78" }, ram);
    s("rect", { x: 56, y: 118, width: 58, height: 58, rx: 5, fill: "#E3E8EC", stroke: "#B8C2CA", "stroke-width": 2 }, g);
    const powder = s("rect", { x: 66, y: 134, width: 38, height: 30, fill: "#D8CFC2" }, g);
    const pellet = s("ellipse", { cx: 85, cy: 156, rx: 20, ry: 5, fill: "#BFB3A2", opacity: 0 }, g);
    const steps = ["Grind", "Load the die", "Press", "Analyse by FTIR or XRF"].map((t, i) => a.text("div", "", 320, 690 + i * 46, 380, '<span style="display:inline-grid;place-items:center;width:30px;height:30px;border-radius:50%;background:var(--wash);font-size:15px;font-weight:700;margin-right:12px">' + (i + 1) + '</span><span style="font-size:21px;font-weight:500">' + esc(t) + "</span>"));
    a.fade(kick, 0.3, { y: -10 }); a.rise(h, 0.5, { stagger: 0.1 }); a.fade(lede, 1.3);
    a.tl.from(g, { opacity: 0, duration: 0.6 }, 2.0);
    a.tl.from(steps, { opacity: 0, x: -16, duration: 0.5, stagger: 0.25 }, 2.1);
    const mark = i => a.tl.to(steps, { opacity: (j) => (j === i ? 1 : 0.4), duration: 0.3 }, 3.2 + i * 1.5);
    [0, 1, 2, 3].forEach(mark);
    a.tl.to(ram, { y: 58, duration: 0.9, ease: "power2.in" }, 6.2);
    a.tl.to(powder, { attr: { height: 12, y: 150 }, duration: 0.9, ease: "power2.in" }, 6.2);
    a.tl.to(ram, { y: 0, duration: 0.8, ease: "power2.out" }, 7.4);
    a.tl.to(powder, { opacity: 0, duration: 0.3 }, 7.5);
    a.tl.to(pellet, { opacity: 1, duration: 0.4 }, 7.5);
    a.pulseRings(bn.rings, 2.6, 0.9);
  } });

  /* 7. Sample preparation: from rock to result, and the prep lab */
  list.push({ id: "prep", family: "prep", dur: 16, build(a) {
    const h = a.title("Sample preparation,\nfrom rock to result.", 96, 176, 1200);
    const lede = a.text("p", "lede", 96, 340, 1100, "Crush, divide and pulverise geological samples with Rocklabs, then homogenise, sieve, evaporate and dry.");
    const flow = [["4741594", "Crush", "Rocklabs BOYD Elite"], ["4742286", "Divide", "Rocklabs Benchtop RSD"], ["4728292", "Pulverise", "Rocklabs Bench Top Ring Mill"], ["4742288", "Verify", "Rocklabs Certified Reference Materials"]];
    const svg = a.art();
    const X0 = 96, W = 330, G = 70;
    const sp = flow.map((f, i) => a.prod(f[0], X0 + i * (W + G) + 30, 440, W - 60, 230));
    const caps = flow.map((f, i) => { const c = a.cap(X0 + i * (W + G), 690, W, f[1], f[2], f[0]); c.style.textAlign = "center"; c.querySelector("b").style.fontSize = "26px"; return c; });
    const arrows = flow.slice(0, 3).map((f, i) => {
      const x = X0 + (i + 1) * (W + G) - G + 6;
      return s("path", { d: "M" + x + " 555 h" + (G - 14) + " m-12 -10 l12 10 l-12 10", stroke: "#ED2926", "stroke-width": 3.5, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }, svg);
    });
    // particle size shrinking along the flow
    const sizes = [20, 11, 5, 2.5];
    const grains = sizes.map((r, i) => {
      const g = s("g", {}, svg);
      const sp2 = Math.max(16, r * 2.3);
      for (let k = 0; k < 5; k++) s("circle", { cx: X0 + i * (W + G) + W / 2 + (k - 2) * sp2, cy: 790 + (k % 2) * 6, r, fill: "#B9A88F", opacity: 0.8 }, g);
      return g;
    });
    const others = [["4732105", "POLYTRON homogenisers", "Kinematica"], ["4732060", "Sieve shakers and test sieves", "Glenammer"], ["5278358", "Rotary evaporators", "Wiggens"], ["4816885", "Laboratory spray dryers", "Lab Plant"], ["4731685", "Ultrasonic baths", "Bandelin"], ["4733654", "Peristaltic pumps", "Shenchen"]];
    a.rise(h, 0.2); a.fade(lede, 0.9);
    a.tl.from(sp, { opacity: 0, y: 40, duration: 0.8, stagger: 0.5, ease: "power3.out" }, 1.4);
    a.fade(caps, 1.7, { stagger: 0.5 });
    arrows.forEach((ar, i) => a.draw(ar, 2.0 + i * 0.5, 0.4));
    a.tl.from(grains, { opacity: 0, scale: 0.4, transformOrigin: "50% 50%", duration: 0.5, stagger: 0.5 }, 1.9);
    // second beat: the wider prep lab
    const lab = others.map((o, i) => {
      const x = 96 + i * 292;
      const d = a.prod(o[0], x + 20, 440, 250, 230);
      const c = a.cap(x, 690, 290, o[2], o[1], o[0]); c.style.textAlign = "center";
      return [d, c];
    });
    const flat = lab.flat();
    gsap.set(flat, { opacity: 0 });
    a.tl.to([].concat(sp, caps, grains), { opacity: 0, duration: 0.6 }, 8.6);
    a.tl.to(arrows, { opacity: 0, duration: 0.6 }, 8.6);
    a.tl.fromTo(flat, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.12 }, 9.2);
    const lede2 = a.text("p", "lede", 96, 340, 1100, "Homogenisers, sieves, rotary evaporators, spray dryers, ultrasonic baths and pumps.");
    gsap.set(lede2, { opacity: 0 });
    a.tl.to(lede, { opacity: 0, duration: 0.4 }, 8.6);
    a.tl.to(lede2, { opacity: 1, duration: 0.6 }, 9.0);
  } });

  /* 8. Heat: the temperature ladder */
  list.push({ id: "heat", family: "heat", dur: 16, build(a) {
    const h = a.title("Heat, from a water\nbath to 1,850 °C.", 96, 176, 760);
    const lede = a.text("p", "lede", 96, 340, 700, "Chamber, tube, vacuum and CVD furnaces from Elite, LAC and KeJia, and Clifton water baths from Nickel-Electro.");
    const svg = a.art();
    // thermometer column
    const X = 900, Y0 = 860, Y1 = 190, Tmax = 1900;
    const ty = t => Y0 - (Y0 - Y1) * t / Tmax;
    s("rect", { x: X - 14, y: Y1 - 10, width: 28, height: Y0 - Y1 + 20, rx: 14, fill: "#F1F1F1", stroke: "#E2E2E2", "stroke-width": 2 }, svg);
    const fill = s("rect", { x: X - 8, y: Y0, width: 16, height: 0, rx: 8, fill: "url(#g-heat)" }, svg);
    s("circle", { cx: X, cy: Y0 + 22, r: 26, fill: "#ED2926" }, svg);
    [0, 500, 1000, 1500].forEach(t => {
      s("line", { x1: X + 20, y1: ty(t), x2: X + 34, y2: ty(t), stroke: "#C8C8C8", "stroke-width": 2 }, svg);
      const lb = s("text", { x: X - 26, y: ty(t) + 6, "text-anchor": "end", fill: "#9A9A9A", "font-size": 17, "font-family": "Poppins" }, svg); lb.textContent = num(t) + " °C";
    });
    const rungs = [
      [100, "4758693", "Clifton boiling baths", "Nickel-Electro · to boiling"],
      [1100, "4730899", "Economy chamber furnaces", "Elite · 1,100 °C max"],
      [1340, "4766371", "Laboratory furnace LH", "LAC · up to 1,340 °C"],
      [1600, "6298641", "CVD furnace systems", "KeJia · 1,200 to 1,600 °C"],
      [1800, "4751647", "High temperature chamber furnaces", "Elite · 1,400 to 1,800 °C"],
      [1850, "4751674", "Single zone tube furnaces", "Elite · 1,200 to 1,850 °C"]
    ];
    // place labels alternating right side, spaced
    const items = rungs.map((r, i) => {
      const y = ty(r[0]);
      const ly = [790, 640, 530, 420, 300, 190][i];
      const line = s("path", { d: "M" + (X + 16) + " " + y + " L" + (X + 60) + " " + y + " L" + (X + 90) + " " + (ly + 50), stroke: "#ED2926", "stroke-width": 1.5, opacity: 0.55, fill: "none", "stroke-dasharray": "3 5" }, svg);
      const dot = s("circle", { cx: X + 16, cy: y, r: 6, fill: "#ED2926" }, svg);
      const pic = a.prod(r[1], X + 100, ly, 150, 100);
      const cap = a.cap(X + 270, ly + 14, 520, r[2], r[3], r[1]);
      cap.querySelector("b").style.fontSize = "23px";
      return { t: r[0], line, dot, pic, cap };
    });
    const readout = a.text("div", "", 96, 600, 600, '<b class="tv" style="display:block;font-size:110px;font-weight:700;line-height:1;color:var(--red);letter-spacing:-.02em">20 °C</b><span class="small">Maximum temperatures from the product range</span>');
    a.rise(h, 0.2); a.fade(lede, 0.9);
    a.fade(readout, 1.4);
    const st = { t: 20 };
    a.tl.to(st, { t: 1850, duration: 8, ease: "power1.inOut", onUpdate: () => {
      fill.setAttribute("y", ty(st.t)); fill.setAttribute("height", Y0 - ty(st.t));
      readout.querySelector(".tv").textContent = num(Math.round(st.t / 10) * 10) + " °C";
    } }, 1.6);
    // when the power1.inOut fill reaches each rung
    const when = v => (v < 0.5 ? Math.sqrt(v / 2) : 1 - Math.sqrt((1 - v) / 2));
    items.forEach(it => {
      const at = 1.6 + 8 * when(Math.max(0, Math.min(1, (it.t - 20) / 1830)));
      a.tl.from(it.dot, { attr: { r: 0 }, duration: 0.3 }, at);
      a.draw(it.line, at, 0.4);
      a.tl.from([it.pic, it.cap], { opacity: 0, x: 24, duration: 0.5, stagger: 0.1 }, at + 0.2);
    });
  } });

  /* 9. Food, pharma and QC */
  list.push({ id: "qc", family: "analysis", dur: 16, build(a) {
    const h = a.title("Quality you can measure.", 96, 176, 1720);
    const lede = a.text("p", "lede", 96, 270, 1500, "Refractive index and Brix, nitrogen and protein, tablet dissolution, smell and taste: the tests behind food, beverage and pharmaceutical quality.");
    const cols = [
      ["4735355", "Bellingham + Stanley", "Refractometers", "Brix", v => fmt(12.4 + Math.sin(v) * 0.05, 2) + " °Bx"],
      ["4738479", "behr Labor-Technik", "Kjeldahl distillation", "Protein", v => fmt(21.8 + Math.sin(v * 1.3) * 0.08, 1) + " %"],
      ["4754937", "Labindia", "Tablet dissolution", "Released", v => Math.min(100, Math.round(v * 9)) + " %"],
      ["4731365", "Alpha MOS", "HERACLES electronic nose", "Match", v => Math.min(98, Math.round(60 + v * 4)) + " %"]
    ];
    const W = 400, G = 42, X0 = 96;
    const cards = cols.map((c, i) => {
      const x = X0 + i * (W + G);
      const box = pos(el("div", "", a.root), x, 380, W, 470);
      box.style.cssText += ";border:1px solid var(--line);border-radius:10px;background:#fff";
      box.dataset.product = c[0];
      const ph = a.prod(c[0], x + 40, 400, W - 80, 230);
      const cap = a.cap(x + 28, 650, W - 56, c[2], "", c[0], c[1]);
      const ro = a.text("div", "", x + 28, 750, W - 56, '<div style="display:flex;justify-content:space-between;align-items:baseline;border-top:1px solid var(--hair);padding-top:14px"><span class="small">' + esc(c[3]) + '</span><b class="v" style="font-size:34px;font-weight:700;color:var(--red);font-variant-numeric:tabular-nums">–</b></div>');
      ro.dataset.product = c[0];
      return { box, ph, cap, ro, f: c[4] };
    });
    const note = a.text("div", "small", 96, 868, 1700, "Readings are illustrative.");
    note.style.fontSize = "15px";
    a.rise(h, 0.2); a.fade(lede, 0.8);
    cards.forEach((c, i) => {
      a.tl.from(c.box, { opacity: 0, y: 40, duration: 0.7, ease: "power3.out" }, 1.2 + i * 0.25);
      a.tl.from([c.ph, c.cap, c.ro], { opacity: 0, y: 20, duration: 0.6, stagger: 0.1 }, 1.4 + i * 0.25);
    });
    a.fade(note, 2.6);
    let t = 0;
    a.every(0.25, () => { t += 0.25; cards.forEach(c => { c.ro.querySelector(".v").textContent = c.f(t); }); }, 2.8);
    cards.forEach((c, i) => a.tl.to(c.box, { borderColor: "#ED2926", boxShadow: "0 14px 34px rgba(0,0,0,.10)", duration: 0.4, yoyo: true, repeat: 1, repeatDelay: 1.4 }, 4 + i * 2.2));
  } });

  /* 10. Measurement and optics */
  list.push({ id: "measure", family: "analysis", dur: 15, build(a) {
    const h = a.title("See closer.\nMeasure precisely.", 96, 176, 700);
    const lede = a.text("p", "lede", 96, 340, 640, "Optika microscopes, PERSEE UV-Vis spectrophotometers, Ohaus balances and Zehntner gloss meters, plus thermometers, hydrometers and water quality meters.");
    const T = [
      { id: "4759498", x: 820, y: 170, k: "Optika", n: "B-820 upright microscopes" },
      { id: "4996697", x: 1330, y: 170, k: "PERSEE", n: "T600 / T700 UV-Vis" },
      { id: "4753032", x: 820, y: 530, k: "Ohaus", n: "Explorer balances" },
      { id: "4756795", x: 1330, y: 530, k: "Zehntner", n: "ZGM 1130 glossmeter" }
    ];
    const tiles = T.map(t => {
      const box = pos(el("div", "", a.root), t.x, t.y, 480, 340);
      box.style.cssText += ";border:1px solid var(--line);border-radius:10px;background:#fff";
      box.dataset.product = t.id;
      const ph = a.prod(t.id, t.x + 20, t.y + 20, 220, 300);
      const cap = a.cap(t.x + 256, t.y + 30, 210, t.n, "", t.id, t.k);
      cap.querySelector("b").style.fontSize = "21px";
      return { box, ph, cap, t };
    });
    // live readouts in each tile
    const spec = a.trace(a.art(), 1590, 380, 200, 100, 2.4, { n: 50, dt: 0.1, width: 2.5, gen: (() => { let k = 0; return () => { k++; const x = (k % 50) / 50; return 0.08 + 0.8 * Math.exp(-Math.pow((x - 0.45) / 0.09, 2)) + 0.3 * Math.exp(-Math.pow((x - 0.75) / 0.06, 2)); }; })() });
    const bal = a.text("div", "", 1076, 760, 220, '<span class="small" style="font-size:15px">Weight</span><b class="w8" style="display:block;font-size:30px;font-weight:700;font-variant-numeric:tabular-nums">0.0000 g</b>');
    const gls = a.text("div", "", 1586, 760, 220, '<span class="small" style="font-size:15px">Gloss</span><b class="gu" style="display:block;font-size:30px;font-weight:700;color:var(--red);font-variant-numeric:tabular-nums">0.0 GU</b>');
    const scope = a.text("div", "", 1076, 400, 220, '<span class="small" style="font-size:15px">X-OEF</span><b style="display:block;font-size:20px;font-weight:600">Optika EasyFocus System</b>');
    a.rise(h, 0.2); a.fade(lede, 0.9);
    tiles.forEach((t, i) => {
      a.tl.from(t.box, { opacity: 0, scale: 0.96, duration: 0.6 }, 1.1 + i * 0.2);
      a.tl.from([t.ph, t.cap], { opacity: 0, y: 16, duration: 0.5, stagger: 0.1 }, 1.3 + i * 0.2);
    });
    a.tl.from(spec.g, { opacity: 0, duration: 0.5 }, 2.4);
    a.fade([scope, bal, gls], 2.4, { stagger: 0.15 });
    const w8 = bal.querySelector(".w8"), gu = gls.querySelector(".gu");
    const ow = { v: 0 }, og = { v: 0 };
    a.tl.to(ow, { v: 12.3456, duration: 2.2, ease: "power3.out", onUpdate: () => { w8.textContent = fmt(ow.v, 4) + " g"; } }, 3.0);
    a.tl.to(og, { v: 92.6, duration: 1.8, ease: "power2.out", onUpdate: () => { gu.textContent = fmt(og.v, 1) + " GU"; } }, 3.4);
    const note = a.text("div", "small", 96, 868, 700, "Readings are illustrative.");
    note.style.fontSize = "15px";
    a.fade(note, 3.0);
  } });

  /* 11. Stack emissions: Apex isokinetic source sampling */
  list.push({ id: "stack", family: "air", dur: 17, build(a) {
    const svg = a.art();
    // stack (chimney) with flue gas rising, a probe through the port, and the sampling train on the platform
    const SX = 1500, SW = 220, top = 150, bot = 900;
    s("rect", { x: SX, y: top, width: SW, height: bot - top, fill: "#EEF2F5", stroke: "#C9D3DA", "stroke-width": 3 }, svg);
    s("rect", { x: SX - 10, y: top - 16, width: SW + 20, height: 22, rx: 4, fill: "#C9D3DA" }, svg);
    a.flow(s("path", { d: "M" + (SX + 50) + " " + bot + " V" + (top - 10), fill: "none" }, svg), 1.2, { n: 9, r: 4, color: "#9AA9B5", dur: 2.6, halo: false });
    a.flow(s("path", { d: "M" + (SX + 110) + " " + bot + " V" + (top - 10), fill: "none" }, svg), 1.2, { n: 9, r: 5, color: "#B3BFC8", dur: 2.2, halo: false });
    a.flow(s("path", { d: "M" + (SX + 170) + " " + bot + " V" + (top - 10), fill: "none" }, svg), 1.2, { n: 9, r: 4, color: "#9AA9B5", dur: 2.9, halo: false });
    // platform and probe
    const PY = 560;
    s("line", { x1: 1100, y1: PY + 70, x2: SX, y2: PY + 70, stroke: "#C9D3DA", "stroke-width": 6 }, svg);
    const probe = s("rect", { x: 1290, y: PY - 6, width: 330, height: 12, rx: 6, fill: "#7F8E9E" }, svg);
    const nozzle = s("path", { d: "M1620 " + (PY - 6) + " h24 v-22 h8 v34 h-32z", fill: "#5D6B78" }, svg);
    const box = s("rect", { x: 1190, y: PY - 40, width: 100, height: 80, rx: 6, fill: "#2F5D9A" }, svg);
    const boxL = s("text", { x: 1240, y: PY + 6, "text-anchor": "middle", fill: "#fff", "font-size": 15, "font-family": "Poppins", "font-weight": 600 }, svg); boxL.textContent = "Filter";
    const imp = s("g", {}, svg);
    for (let i = 0; i < 4; i++) s("rect", { x: 1110 + i * 18, y: PY - 30, width: 12, height: 70, rx: 5, fill: "#DCEAF4", stroke: "#9DB7CC", "stroke-width": 2 }, imp);
    const umb = s("path", { d: "M1110 " + (PY + 40) + " C1050 " + (PY + 140) + " 1010 " + (PY + 220) + " 1000 " + (PY + 300), stroke: "#ED2926", "stroke-width": 4, fill: "none", "stroke-dasharray": "2 10", "stroke-linecap": "round" }, svg);
    const con = a.prod("4735041", 860, 760, 260, 160);
    const sample = s("path", { d: "M1650 " + PY + " H1290 M1190 " + PY + " H1150", fill: "none" }, svg);
    const kick = a.text("div", "kick", 96, 196, 760, "Apex Instruments");
    const h = a.title("Isokinetic source\nsampling.", 96, 240, 760);
    const lede = a.text("p", "lede", 96, 410, 720, "Rugged systems that extract a representative flue gas sample to determine particulate and toxic emissions, in accordance with US EPA Reference Methods and Malaysian Standard MS 1596:2003.");
    const comp = a.text("div", "", 96, 640, 720, '<span class="badge new" style="font-size:16px">Fully complies</span><span style="font-size:21px;font-weight:600;margin-left:14px">Environmental Quality (Clean Air) Regulation 2014</span>');
    const chips = a.chips(96, 720, 740, [["MS 1596:2003", "data-product", "4735041"], ["EPA Method 5", "data-product", "4735041"], ["Method 17", "data-product", "4735115"], ["Method 23", "data-product", "4735151"], ["Method 26A", "data-product", "4735179"], ["Method 29", "data-product", "4735212"], ["Method 201A", "data-product", "4735242"]]);
    const lbl = [["Pitot and nozzle", 1600, PY - 50], ["Heated filter", 1240, PY - 56], ["Impingers", 1137, PY + 64], ["Control console", 990, 740]].map(([t, x, y]) => {
      const e = s("text", { x, y, "text-anchor": "middle", fill: "#333", "font-size": 17, "font-family": "Poppins", "font-weight": 600 }, svg); e.textContent = t; return e;
    });
    a.fade(kick, 0.2, { y: -10 }); a.rise(h, 0.3); a.fade(lede, 1.0);
    a.fade(comp, 1.8); a.rise(chips.children, 2.3, { y: 14, stagger: 0.08 });
    a.tl.from([probe, nozzle], { x: 120, opacity: 0, duration: 1, ease: "power3.out" }, 1.4);
    a.tl.from([box, boxL], { opacity: 0, y: -20, duration: 0.6 }, 2.0);
    a.tl.from(imp.children, { opacity: 0, y: -20, duration: 0.4, stagger: 0.1 }, 2.3);
    a.draw(umb, 2.8, 0.8);
    a.fade(con, 3.2);
    a.tl.from(lbl, { opacity: 0, duration: 0.5, stagger: 0.2 }, 3.4);
    a.flow(sample, 4.2, { n: 8, r: 4, color: "#ED2926", dur: 2.4 });
    // probe traverses across the stack
    a.loop(gsap.to([probe, nozzle], { x: -110, duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: -1 }), 5.0);
  } });

  /* 12. Air quality: Apex AIR, AMS samplers, Shinagawa gas meters */
  list.push({ id: "airq", family: "air", dur: 15, build(a) {
    const h = a.title("Know the air\nyou breathe.", 96, 176, 760);
    const lede = a.text("p", "lede", 96, 340, 720, "Near-reference Apex AIR monitors for cities, industries and researchers, AMS high-volume samplers for PM10, TSP and PUF, and Shinagawa gas meters.");
    const main = a.prod("6337437", 900, 160, 460, 480);
    const ro = a.text("div", "readout", 1420, 190, 400, '<div class="hl"><span>PM2.5</span><b class="a">– µg/m³</b></div><div class="hl"><span>PM10</span><b class="b">– µg/m³</b></div><div><span>NO₂</span><b class="c">– ppb</b></div><div><span>O₃</span><b class="d">– ppb</b></div>');
    ro.dataset.product = "6337437";
    const svg = a.art();
    const tr = a.trace(svg, 1420, 470, 400, 150, 2.4, { n: 70, dt: 0.14, gen: (() => { let v = 0.35; return () => (v = Math.max(0.1, Math.min(0.9, v + rnd(-0.06, 0.06)))); })() });
    const trl = a.text("div", "small", 1420, 630, 400, "PM2.5 trend · readings are illustrative");
    trl.style.fontSize = "15px";
    const row = [["4754004", "AMS Analitica", "PM10 sampler"], ["4753962", "AMS Analitica", "PUF sampler"], ["4751559", "Shinagawa", "Dry gas meter"], ["4750445", "Shinagawa", "Wet gas meter"]];
    const items = row.map((r, i) => {
      const x = 900 + i * 232;
      return [a.prod(r[0], x + 20, 670, 180, 120), a.cap(x, 800, 220, r[2], "", r[0], r[1])];
    });
    items.forEach(it => { it[1].querySelector("b").style.fontSize = "21px"; });
    const capm = a.cap(96, 520, 700, "Apex AIR series", "Accurately measure multiple pollutants with the most versatile air quality station.", "6337437", "Apex Instruments");
    a.rise(h, 0.2); a.fade(lede, 0.9); a.fade(capm, 1.6);
    a.tl.from(main, { opacity: 0, y: 40, duration: 1, ease: "power3.out" }, 0.6);
    a.fade(ro, 1.6);
    a.tl.from(tr.g, { opacity: 0, duration: 0.6 }, 2.4); a.fade(trl, 2.4);
    a.tl.from(items.flat(), { opacity: 0, y: 20, duration: 0.5, stagger: 0.1 }, 2.6);
    a.every(1.0, () => {
      ro.querySelector(".a").textContent = Math.round(rnd(14, 19)) + " µg/m³";
      ro.querySelector(".b").textContent = Math.round(rnd(26, 33)) + " µg/m³";
      ro.querySelector(".c").textContent = Math.round(rnd(11, 15)) + " ppb";
      ro.querySelector(".d").textContent = Math.round(rnd(24, 30)) + " ppb";
    }, 2.0);
  } });

  /* 13. Lab safety: ductless fume hoods, desiccators, autoclaves, safety cabinets */
  list.push({ id: "safety", family: "safety", dur: 16, build(a) {
    const h = a.title("Protect the user,\nthe process and\nthe environment.", 96, 176, 800);
    const lede = a.text("p", "lede", 96, 420, 760, "Air Science ductless fume hoods isolate and trap chemical vapours in filters, so no ductwork to the outside is needed. Add SICCO desiccators and glove boxes, Rodwell autoclaves and Biobase safety cabinets.");
    lede.style.fontSize = "24px";
    const main = a.prod("4766462", 920, 220, 560, 520);
    const svg = a.art();
    // clean air leaving the top of the ductless hood, back into the room
    const outA = s("path", { d: "M1200 250 C 1210 200 1250 175 1320 172", stroke: "none", fill: "none" }, svg);
    a.flow(outA, 2.6, { n: 6, r: 5, color: "#0E8C45", dur: 1.8 });
    const tagOut = a.text("div", "", 1330, 156, 330, '<b style="color:var(--green);font-size:19px;white-space:nowrap">Filtered air returns to the room</b>');
    const tagF = a.text("div", "", 920, 760, 560, '<span class="chip" style="font-size:17px">No ductwork · carbon and HEPA/ULPA filtration</span>');
    tagF.style.textAlign = "center";
    const row = [["4782405", "SICCO", "Auto-Star desiccator"], ["4733311", "Rodwell", "Sapphire autoclave"], ["4756672", "Biobase", "Biological safety cabinet"]];
    const items = row.map((r, i) => {
      const x = 96 + i * 260;
      return [a.prod(r[0], x + 10, 640, 220, 160), a.cap(x, 812, 245, r[2], "", r[0], r[1])];
    });
    items.forEach(it => { it[1].querySelector("b").style.fontSize = "21px"; });
    const side = [["4766638", "Purair RX", "Balance enclosure, USP 800 / 795"], ["4766591", "Purair PCR", "Laminar flow PCR cabinet"], ["4766639", "Purair NANO", "Nanoparticle containment"]];
    const sitems = side.map((r, i) => {
      const y = 250 + i * 210;
      return [a.prod(r[0], 1560, y, 150, 150), a.cap(1720, y + 30, 180, r[1], r[2], r[0], "Air Science")];
    });
    a.rise(h, 0.2); a.fade(lede, 1.0);
    a.tl.from(main, { opacity: 0, y: 40, duration: 1, ease: "power3.out" }, 0.6);
    a.fade([tagOut, tagF], 2.4);
    a.tl.from(sitems.flat(), { opacity: 0, x: 30, duration: 0.5, stagger: 0.1 }, 2.0);
    a.tl.from(items.flat(), { opacity: 0, y: 20, duration: 0.5, stagger: 0.1 }, 3.0);
  } });

  /* 14. Sampling: Bürkle */
  list.push({ id: "sampling", family: "sampling", dur: 15, build(a) {
    const n = C.brands.find(b => b.id === "buerkle").n;
    const h = a.title("The right sample,\nevery time.", 96, 176, 760);
    const lede = a.text("p", "lede", 96, 340, 700, "Bürkle samplers for powders, granules, liquids, pastes and soil, plus drum and container pumps for acids, alkalis and solvents.");
    const big = a.text("div", "bigstat", 96, 560, 600, "<b>0</b><span>Bürkle samplers and pumps in our catalogue</span>");
    a.count(big.querySelector("b"), n, 1.6, 1.6);
    // a sack of granules with layers, and a sampler that dives in and returns with a core
    const svg = a.art();
    const SX = 840, SY = 470, SW = 340, SH = 390;
    s("path", { d: "M" + SX + " " + (SY + 30) + " Q" + (SX + SW / 2) + " " + (SY - 10) + " " + (SX + SW) + " " + (SY + 30) + " L" + (SX + SW - 20) + " " + (SY + SH) + " L" + (SX + 20) + " " + (SY + SH) + " Z", fill: "#F3EEE6", stroke: "#D8CDBB", "stroke-width": 3 }, svg);
    const layers = ["#E8DCC6", "#DCCBAE", "#CDB894", "#BFA67E"].map((c, i) => s("rect", { x: SX + 26, y: SY + 50 + i * 82, width: SW - 52, height: 82, fill: c, opacity: 0.85 }, svg));
    const rod = s("g", {}, svg);
    s("rect", { x: SX + SW / 2 - 9, y: SY - 280, width: 18, height: 300, rx: 6, fill: "#B8C2CA", stroke: "#8D99A3", "stroke-width": 2 }, rod);
    s("rect", { x: SX + SW / 2 - 40, y: SY - 296, width: 80, height: 22, rx: 8, fill: "#ED2926" }, rod);
    const core = s("g", { opacity: 0 }, svg);
    ["#E8DCC6", "#DCCBAE", "#CDB894", "#BFA67E"].forEach((c, i) => s("rect", { x: SX + SW + 50, y: SY + 40 + i * 64, width: 26, height: 64, fill: c }, core));
    const coreL = a.text("div", "small", SX + SW + 10, SY + 310, 120, "Every layer, in order");
    coreL.style.textAlign = "center";
    const picks = ["4789671", "4784710", "4783588", "4784490", "4783313", "4784376"];
    const thumbs = picks.map((id, i) => a.prod(id, 1430 + (i % 2) * 220, 170 + Math.floor(i / 2) * 240, 200, 210, { cls: "card-frame" }));
    a.rise(h, 0.2); a.fade(lede, 0.9); a.fade(big, 1.4);
    a.tl.from(layers, { opacity: 0, duration: 0.6, stagger: 0.1 }, 1.0);
    a.tl.from(rod, { y: -200, opacity: 0, duration: 0.8 }, 1.6);
    a.tl.to(rod, { y: 340, duration: 1.4, ease: "power2.in" }, 2.6);
    a.tl.to(rod, { y: 0, duration: 1.2, ease: "power2.out" }, 4.4);
    a.tl.to(core, { opacity: 1, duration: 0.5 }, 5.4);
    a.tl.from(core.children, { x: -260, duration: 0.8, stagger: 0.08, ease: "power3.out" }, 5.4);
    a.fade(coreL, 6.0);
    a.tl.from(thumbs, { opacity: 0, scale: 0.9, duration: 0.5, stagger: 0.12, ease: "back.out(1.4)" }, 2.0);
  } });

  /* 15. Principals: the brand wall */
  list.push({ id: "brands", family: "brands", dur: 16, build(a) {
    const h = a.title("37 principals.\nOne partner.", 96, 176, 640);
    h.innerHTML = words(C.stats.brands + " principals.\nOne partner.");
    const lede = a.text("p", "lede", 96, 340, 600, "Long-standing relationships with leading scientific equipment and instrument manufacturers from the USA, Europe and Asia.");
    const regions = { USA: 0, Europe: 0, Asia: 0, Oceania: 0 };
    const EU = ["Germany", "France", "Italy", "United Kingdom", "Switzerland", "Poland", "Czech Republic"];
    C.brands.forEach(b => { if (b.country === "USA") regions.USA++; else if (EU.includes(b.country)) regions.Europe++; else if (["China", "Japan", "India", "Singapore"].includes(b.country)) regions.Asia++; else if (b.country === "New Zealand") regions.Oceania++; });
    const chips = a.chips(96, 560, 620, [["USA", regions.USA], ["Europe", regions.Europe], ["Asia", regions.Asia], ["New Zealand", regions.Oceania]].filter(r => r[1]).map(r => r[0] + " · " + r[1]));
    const btn = a.button("All principals", 96, 680, "data-tab", "brands");
    const cols = 5, W = 214, H = 74, G = 12, X0 = 780, Y0 = 160;
    const tiles = C.brands.map((b, i) => {
      const t = pos(el("button", "btile", a.root, "<b>" + esc(b.name.replace(" (B+S)", "")) + "</b><span>" + esc(b.country || "") + "</span>"), X0 + (i % cols) * (W + G), Y0 + Math.floor(i / cols) * (H + G), W, H);
      t.dataset.brand = b.id;
      t.querySelector("b").style.fontSize = b.name.length > 18 ? "17px" : "19px";
      t.querySelector("span").style.fontSize = "13px";
      return t;
    });
    a.rise(h, 0.2); a.fade(lede, 0.9); a.rise(chips.children, 1.6, { y: 14, stagger: 0.1 }); a.fade(btn, 2.2);
    a.tl.from(tiles, { opacity: 0, y: 20, scale: 0.94, duration: 0.45, stagger: { each: 0.035, from: "start" }, ease: "power2.out" }, 0.8);
    const order = tiles.slice().sort(() => Math.random() - 0.5).slice(0, 10);
    a.sweep(order, 3.4, 1.1);
  } });

  /* 16. Industries (the dark band from the About page) */
  list.push({ id: "industries", family: "about", dur: 15, build(a) {
    const band = pos(el("div", "darkband", a.root), 0, 136, 1920, 776);
    const kick = a.text("div", "kick", 96, 190, 900, "Industries we serve");
    kick.style.color = "#7CE0A6";
    const h = a.title("We are scientific solutions provider\nfor the following industries:", 96, 236, 1400);
    h.style.color = "#FFFFFF"; h.style.fontSize = "52px";
    const lede = a.text("p", "lede", 96, 400, 1500, "Clienteles from all fields of the scientific and medical industry: hospitals, clinics, food and beverage, pharmaceuticals, material research, universities, QA/QC laboratories, petrochemicals, polymers and environmental monitoring.");
    lede.style.color = "rgba(255,255,255,.78)"; lede.style.fontSize = "22px";
    const cols = 6, W = 270, H = 150, G = 18;
    const tiles = A.industries.map((ind, i) => {
      const t = pos(el("button", "indtile ondark", a.root, icon(ind.icon, "ico") + "<b>" + esc(ind.name) + "</b>"), 96 + (i % cols) * (W + G), 530 + Math.floor(i / cols) * (H + G), W, H);
      t.dataset.ind = ind.id;
      return t;
    });
    a.tl.from(band, { opacity: 0, duration: 0.8 }, 0);
    a.fade(kick, 0.3, { y: -10 }); a.rise(h, 0.4, { stagger: 0.04 }); a.fade(lede, 1.2);
    a.tl.from(tiles, { opacity: 0, y: 24, duration: 0.5, stagger: 0.07 }, 1.6);
    a.sweep(tiles, 3.2, 0.95);
  } });

  /* 17. Service network: Malaysia map and the Subang Jaya facility */
  list.push({ id: "network", family: "about", dur: 17, build(a) {
    const m = malaysiaMap(a.root, 1110, {});
    pos(m.wrap, 770, 200);
    const kick = a.text("div", "kick", 96, 196, 640, "Sales and service network");
    const h = a.title("Serving labs across\nall of Malaysia.", 96, 240, 680);
    h.style.fontSize = "56px";
    const lede = a.text("p", "lede", 96, 400, 660, "A centralized facility in Subang Jaya, Selangor, and a sales network covering the Northern, Eastern, Central and Southern regions of Peninsular Malaysia, and East Malaysia.");
    const fac = A.company.facility.map((f, i) => {
      const d = a.text("div", "", 96 + i * 345, 780, 320, '<div style="display:flex;gap:16px;align-items:center">' + icon(f[0]).replace("<svg ", '<svg style="width:46px;height:46px;color:var(--red);flex:none" ') + '<div><b style="display:block;font-size:22px;font-weight:600">' + esc(f[1]) + '</b><span class="small" style="font-size:16px">Subang Jaya HQ</span></div></div>');
      return d;
    });
    a.fade(kick, 0.2, { y: -10 }); a.rise(h, 0.3); a.fade(lede, 1.0);
    a.tl.from(m.wrap, { opacity: 0, duration: 0.8 }, 0.4);
    a.tl.from(m.hq, { attr: { r: 0 }, duration: 0.5, ease: "back.out(2)" }, 1.2);
    a.fade(m.hqL, 1.4, { y: 0 });
    a.loop(gsap.fromTo(m.pulse, { attr: { r: 8 }, opacity: 1 }, { attr: { r: 40 }, opacity: 0, duration: 1.8, repeat: -1, ease: "power1.out" }), 1.2);
    const order = ["central", "north", "south", "east", "borneo"];
    order.forEach((k, i) => {
      const r = m.reg[k], t = 1.8 + i * 1.0;
      a.tl.call(() => r.paths.forEach(p => p.classList.add("cov")), null, t);
      if (r.link) a.draw(r.link, t - 0.3, 0.6);
      if (r.node) a.tl.from(r.node, { attr: { r: 0 }, duration: 0.3 }, t);
      a.tl.from(r.label, { opacity: 0, duration: 0.4 }, t);
    });
    a.tl.from(fac, { opacity: 0, y: 24, duration: 0.5, stagger: 0.18 }, 6.6);
  } });

  /* 18. Vision, mission and values */
  list.push({ id: "values", family: "about", dur: 15, build(a) {
    const kick = a.text("div", "kick", 96, 196, 760, "About us");
    const h = a.title("SCIENCEGATES SDN BHD", 96, 236, 1400);
    h.style.color = "var(--red)"; h.style.fontSize = "64px";
    const ph = a.spot("about", 1284, 176, 540, 360, { cls: "photo" });
    const lede = a.text("p", "lede", 96, 340, 1110, A.company.leadership);
    const grey = pos(el("div", "greyband", a.root), 96, 560, 1728, 300);
    grey.style.borderRadius = "10px";
    const vm = a.text("div", "", 140, 600, 1640, '<div style="display:grid;grid-template-columns:1fr 1fr;gap:60px">' +
      '<div><h3 style="margin:0 0 10px;font-size:30px;color:var(--red)">Vision:</h3><p class="body" style="font-size:21px">' + esc(A.company.vision) + "</p></div>" +
      '<div><h3 style="margin:0 0 10px;font-size:30px;color:var(--red)">Mission:</h3><p class="body" style="font-size:21px">' + esc(A.company.mission[0]) + "</p></div></div>");
    const vals = a.text("div", "", 140, 790, 1640, '<div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap"><b style="font-size:22px;color:var(--red);margin-right:8px">Core values:</b>' + A.company.values.map(v => '<span class="chip" style="background:#fff">' + esc(v[0]) + "</span>").join("") + "</div>");
    a.fade(kick, 0.2, { y: -10 }); a.rise(h, 0.3, { stagger: 0.1 }); a.fade(lede, 1.0);
    a.tl.from(ph, { opacity: 0, x: 50, duration: 1, ease: "power3.out" }, 0.5);
    a.tl.from(grey, { opacity: 0, y: 30, duration: 0.7 }, 1.6);
    a.fade(vm, 2.0);
    const chs = vals.querySelectorAll(".chip");
    a.tl.from(vals.querySelector("b"), { opacity: 0, duration: 0.4 }, 3.0);
    a.tl.from(chs, { opacity: 0, y: 14, duration: 0.4, stagger: 0.15 }, 3.2);
    chs.forEach((c, i) => a.tl.to(c, { backgroundColor: "#ED2926", color: "#FFFFFF", duration: 0.3, yoyo: true, repeat: 1, repeatDelay: 0.6 }, 5.0 + i * 1.0));
  } });

  /* 19. Close: contact details and QR codes */
  list.push({ id: "outro", family: null, dur: 16, build(a) {
    const h = a.title("Let's find the right\ninstrument for your lab.", 96, 176, 1200, "display");
    h.style.fontSize = "76px";
    const lede = a.text("p", "lede", 96, 380, 1100, "Talk to us here at the booth, or reach the Science Gates team any time.");
    const rows = [["phone", A.company.phone, "Office"], ["whatsapp", A.company.mobile, "WhatsApp"], ["mail", A.company.email, "Enquiries"], ["globe", A.company.web, "390 products, 37 brands"]];
    const rEls = rows.map((r, i) => a.text("div", "", 96, 480 + i * 82, 1100, '<div style="display:flex;align-items:center;gap:20px">' + icon(r[0]).replace("<svg ", '<svg style="width:40px;height:40px;color:' + (r[0] === "whatsapp" ? "#25D366" : "var(--red)") + ';flex:none" ') +
      '<b style="font-size:38px;font-weight:700">' + esc(r[1]) + '</b><span class="small" style="font-size:19px">' + esc(r[2]) + "</span></div>"));
    const addr = a.text("div", "small", 96, 830, 1100, A.company.address.join(" ") + " · Monday to Friday, 8:30 AM to 5:30 PM");
    addr.style.fontSize = "18px";
    const band = pos(el("div", "redband", a.root), 1300, 136, 620, 776);
    const bh = a.text("div", "", 1340, 200, 540, '<b style="display:block;font-size:34px;font-weight:700;color:#fff;text-align:center;line-height:1.2">Scan to connect</b><span style="display:block;margin-top:8px;font-size:19px;color:rgba(255,255,255,.88);text-align:center">with your phone camera</span>');
    const q1 = pos(el("div", "qr", a.root, qrSvg(A.company.url)), 1346, 330, 250, 250);
    const q2 = pos(el("div", "qr", a.root, qrSvg(waLink("Hello, I visited your booth and would like to know more."))), 1624, 330, 250, 250);
    [q1, q2].forEach(q => { q.style.padding = "16px"; });
    const q1c = a.text("div", "", 1336, 596, 270, '<b style="display:block;font-size:22px;color:#fff;text-align:center">sciencegates.com</b><span style="display:block;margin-top:4px;font-size:16px;color:rgba(255,255,255,.88);text-align:center">390 products, 37 brands</span>');
    const q2c = a.text("div", "", 1614, 596, 270, '<b style="display:block;font-size:22px;color:#fff;text-align:center">WhatsApp us</b><span style="display:block;margin-top:4px;font-size:16px;color:rgba(255,255,255,.88);text-align:center">' + esc(A.company.mobile) + "</span>");
    const bfoot = a.text("div", "", 1340, 730, 540, '<span style="display:block;font-size:19px;color:#fff;text-align:center;line-height:1.5">' + esc(A.company.name) + "<br>" + esc(A.company.reg) + "</span>");
    const svg = a.art();
    const dots = logoDots(svg, 1080, 220, 1.1);
    a.rise(h, 0.3); a.fade(lede, 1.2);
    a.rise(rEls, 1.8, { stagger: 0.22, y: 24 });
    a.fade(addr, 2.8);
    a.tl.from(band, { opacity: 0, x: 80, duration: 1, ease: "power3.out" }, 1.6);
    a.fade(bh, 2.0);
    a.tl.from([q1, q2], { opacity: 0, scale: 0.9, duration: 0.8, ease: "back.out(1.4)", stagger: 0.3 }, 2.2); a.fade([q1c, q2c], 2.8); a.fade(bfoot, 3.2);
    a.tl.from(dots, { attr: { r: 0 }, duration: 0.5, stagger: 0.18, ease: "back.out(2)" }, 3.4);
  } });

  /* Scenes that open a different Learn more than their own id */
  const deepFor = { values: "network" };

  /* =====================================================================
     Learn more: slide layouts for the deep-dive loops (content in data.js, "deep").
     Each layout builds one slide into api.root and returns its length in seconds.
     The deep-dive panel has its own header, so slides use the band between DY0 and DY1.
     ===================================================================== */
  const DY0 = 132, DY1 = 1036;
  const sizes = Object.assign({}, C.sizes || {});

  function loadSizes(names, timeout) {
    const todo = names.filter(n => n && !sizes[n]);
    if (!todo.length) return Promise.resolve();
    return new Promise(res => {
      let left = todo.length;
      const one = () => { if (--left <= 0) res(); };
      todo.forEach(n => {
        const im = new Image();
        im.onload = () => { sizes[n] = [im.naturalWidth, im.naturalHeight]; one(); };
        im.onerror = one;
        im.src = src(n);
      });
      setTimeout(res, timeout || 2000);
    });
  }
  function resolveImg(name) { return name && name.startsWith("p:") ? pimg(name.slice(2)) : name; }
  function deepImages(def) {
    const out = [];
    def.slides.forEach(sl => {
      const p = sl.p && P(sl.p);
      if (sl.img) out.push(resolveImg(sl.img)); else if (p && p.img[0]) out.push(p.img[0]);
      if (sl.ids) sl.ids.forEach(id => { const q = P(id); if (q && q.thumb) out.push(q.thumb); });
    });
    return out.filter(Boolean);
  }

  const prodOf = sl => (sl.p && P(sl.p)) || null;
  function specTable(rows) {
    return '<table class="dspecs">' + rows.map(r => "<tr><th>" + esc(r[0]) + "</th><td>" + esc(r[1]) + "</td></tr>").join("") + "</table>";
  }
  function headHtml(sl, p, defTitle) {
    const kicker = sl.kicker != null ? sl.kicker : p ? brandName(p.brand) : "";
    const title = sl.title || defTitle || (p ? p.tagline || p.name : "");
    return (kicker ? '<div class="dkick"' + (p ? ' data-brand="' + p.brand + '"' : "") + ">" + esc(kicker) + "</div>" : "") +
      (title ? '<h2 class="dh">' + words(title) + "</h2>" : "") +
      (sl.lede ? '<p class="dlede">' + esc(sl.lede) + "</p>" : "");
  }
  function column(a, x, w, html) {
    const c = a.text("div", "dcol", x, DY0, w, html);
    c.style.height = (DY1 - DY0) + "px";
    return c;
  }
  function reveal(a, c, at, step) {
    let t = at;
    step = step || 0.5;
    Array.from(c.children).forEach(ch => {
      if (ch.classList.contains("dh")) {
        a.rise(ch, t);
        t += 0.3 + ch.querySelectorAll(".w").length * 0.045;
      } else if (ch.matches("ul, ol") && !ch.classList.contains("steps")) {
        const items = Array.from(ch.children).filter(n => n.tagName === "LI");
        a.tl.from(items, { opacity: 0, x: -20, duration: 0.5, ease: "power2.out", stagger: step }, t);
        t += items.length * step + 0.1;
      } else if (ch.matches("table")) {
        const rows = ch.querySelectorAll("tr");
        a.tl.from(rows, { opacity: 0, duration: 0.45, ease: "power1.out", stagger: 0.2 }, t);
        t += rows.length * 0.2 + 0.1;
      } else if (ch.classList.contains("seq")) {
        a.tl.from(ch.children, { opacity: 0, y: 18, duration: 0.45, ease: "power2.out", stagger: 0.1 }, t);
        t += ch.children.length * 0.1 + 0.25;
      } else {
        a.fade(ch, t, { y: 16 });
        t += 0.3;
      }
    });
    return t;
  }
  function drift(a, target, at) {
    a.loop(gsap.fromTo(target, { scale: 1 }, { scale: 1.025, duration: 7, ease: "sine.inOut", yoyo: true, repeat: -1 }), at);
  }
  function picture(a, name, p, x, y, w, h, at) {
    if (!name) {
      const t = pos(el("div", "dtypo", a.root, "<b>" + esc(p ? p.name : "") + "</b>"), x, y + 60, w, h - 120);
      if (p) t.dataset.product = p.id;
      a.tl.from(t, { opacity: 0, scale: 0.97, duration: 0.9, ease: "power2.out" }, at);
      return t;
    }
    const sp = a.spot(name, x, y, w, h, { product: p ? p.id : null });
    a.tl.from(sp, { x: -70, opacity: 0, duration: 1.1, ease: "power3.out" }, at);
    drift(a, sp.querySelector("img"), at + 1.1);
    return sp;
  }
  function centreBlock(els) {
    const b = Math.max(...els.map(e => parseFloat(e.style.top) + e.offsetHeight));
    const shift = Math.max(0, Math.floor(((DY1 - 10) - b) / 2));
    if (shift) els.forEach(e => { e.style.top = (parseFloat(e.style.top) + shift) + "px"; });
  }
  function cardHtml(p) {
    return '<div class="im">' + (p.thumb ? '<img src="' + src(p.thumb) + '" alt="">' : "") + '</div><div class="tx"><b>' + esc(p.name) + "</b><span>" + esc(brandName(p.brand)) + "</span></div>";
  }

  const layouts = {};

  layouts.features = function (a, sl) {
    const p = prodOf(sl);
    const img = sl.img !== undefined ? resolveImg(sl.img) : p && p.img[0];
    let feats = sl.features || (p ? p.features || [] : []);
    feats = feats.slice(0, sl.n || 7);
    picture(a, img, p, 96, 176, 760, 780, 0.2);
    const c = column(a, 940, 884, headHtml(sl, p) +
      (p && !sl.title ? '<p class="dlede" data-product="' + p.id + '" style="font-weight:600;color:var(--text)">' + esc(p.name) + "</p>" : "") +
      (feats.length ? '<ul class="ticks">' + feats.map(f => "<li>" + esc(f) + "</li>").join("") + "</ul>" : (p && p.summary ? '<p class="dbody">' + esc(p.summary) + "</p>" : "")));
    return reveal(a, c, 0.4, 0.5) + 6;
  };

  layouts.specs = function (a, sl) {
    const p = prodOf(sl);
    const rows = sl.rows || (p && p.specs) || [];
    picture(a, resolveImg(sl.img) || (p && p.img[0]), p, 96, 176, 760, 780, 0.2);
    const c = column(a, 940, 884, headHtml(sl, p, "Specifications") + (p && p.summary ? '<p class="dlede" style="font-size:20px">' + esc(p.summary) + "</p>" : "") + specTable(rows.slice(0, 12)));
    return reveal(a, c, 0.4) + 7;
  };

  /* A grid of product cards that cascade in, then a highlight walks across them */
  layouts.products = function (a, sl) {
    const items = sl.ids.map(P).filter(Boolean);
    const head = a.text("div", "dtop", 96, DY0 + 14, 1728, headHtml(sl, null));
    const t = reveal(a, head, 0.2);
    const n = items.length, cols = n <= 4 ? n : n <= 8 ? 4 : n <= 10 ? 5 : 6, rows = Math.ceil(n / cols), G = 20;
    const top = DY0 + 14 + head.offsetHeight + 30;
    const W = Math.min(330, (1728 - G * (cols - 1)) / cols);
    const H = Math.min(rows > 1 ? 330 : 440, (DY1 - 20 - top - G * (rows - 1)) / rows);
    const x0 = 96 + (1728 - (cols * W + (cols - 1) * G)) / 2;
    const cards = items.map((p, i) => {
      const b = pos(el("button", "card", a.root, cardHtml(p)), x0 + (i % cols) * (W + G), top + Math.floor(i / cols) * (H + G), W, H);
      b.dataset.product = p.id;
      b.querySelector(".im").style.height = Math.round(H - 92) + "px";
      return b;
    });
    centreBlock([head].concat(cards));
    a.tl.from(cards, { opacity: 0, y: 30, duration: 0.5, stagger: 0.07, ease: "power2.out" }, t);
    const t2 = t + n * 0.07 + 0.6;
    cards.forEach((c, i) => a.tl.to(c, { borderColor: "#ED2926", boxShadow: "0 12px 28px rgba(0,0,0,.10)", y: -4, duration: 0.3, yoyo: true, repeat: 1, repeatDelay: 0.5 }, t2 + i * 0.75));
    return t2 + n * 0.75 + 2;
  };

  /* A principal: its introduction and a mosaic of its products */
  layouts.brand = function (a, sl) {
    const b = B(sl.b); if (!b) return 4;
    const blocks = b.intro.filter(x => x.p).slice(0, 2).map(x => x.p);
    const lists = (b.intro.find(x => x.ul) || {}).ul || [];
    const c = column(a, 96, 820, headHtml(sl, null) +
      '<p class="dlede" style="font-size:21px">' + esc(blocks[0] || b.line || "") + "</p>" +
      (lists.length ? '<ul class="ticks">' + lists.slice(0, 5).map(l => "<li>" + esc(l) + "</li>").join("") + "</ul>" : (blocks[1] ? '<p class="dbody" style="font-size:19px">' + esc(blocks[1]) + "</p>" : "")) +
      '<div class="chips"><button class="chip" data-brand="' + b.id + '">' + esc(b.n + " " + b.name + " products") + "</button></div>");
    c.querySelectorAll(".ticks li").forEach(li => { li.style.fontSize = "20px"; li.style.marginBottom = "8px"; });
    const t = reveal(a, c, 0.2, 0.3);
    const ps = C.order.map(P).filter(p => p.brand === b.id && p.thumb).slice(0, 9);
    const cols = 3, W = 270, H = 230, G = 16;
    const rows = Math.ceil(ps.length / cols);
    const y0 = DY0 + (DY1 - DY0 - (rows * H + (rows - 1) * G)) / 2;
    const tiles = ps.map((p, i) => {
      const d = pos(el("button", "card", a.root, '<div class="im" style="height:' + (H - 2) + 'px"><img src="' + src(p.thumb) + '" alt=""></div>'), 1000 + (i % cols) * (W + G), y0 + Math.floor(i / cols) * (H + G), W, H);
      d.dataset.product = p.id; d.title = p.name;
      return d;
    });
    a.tl.from(tiles, { opacity: 0, scale: 0.92, duration: 0.5, stagger: 0.08, ease: "back.out(1.3)" }, 0.5);
    return Math.max(t, 0.5 + tiles.length * 0.08) + 8;
  };

  /* The brand wall */
  layouts.brands = function (a, sl) {
    const c = column(a, 96, 560, headHtml(sl, null));
    const t = reveal(a, c, 0.2);
    const cols = 5, W = 230, H = 112, G = 14, n = C.brands.length, rows = Math.ceil(n / cols);
    const Hh = Math.min(H, (DY1 - DY0 - 40 - (rows - 1) * G) / rows);
    const y0 = DY0 + (DY1 - DY0 - (rows * Hh + (rows - 1) * G)) / 2;
    const tiles = C.brands.map((b, i) => {
      const d = pos(el("button", "btile", a.root, "<b>" + esc(b.name.replace(" (B+S)", "")) + "</b><span>" + esc(b.country) + " · " + b.n + " products</span>"), 700 + (i % cols) * (W + G), y0 + Math.floor(i / cols) * (Hh + G), W, Hh);
      d.dataset.brand = b.id;
      d.querySelector("b").style.fontSize = b.name.length > 18 ? "17px" : "19px";
      d.querySelector("span").style.fontSize = "13px";
      return d;
    });
    a.tl.from(tiles, { opacity: 0, y: 16, duration: 0.4, stagger: 0.03 }, 0.4);
    const pick = tiles.slice().sort(() => Math.random() - 0.5).slice(0, 12);
    a.sweep(pick, Math.max(t, 1.8), 0.9);
    return Math.max(t, 1.8) + pick.length * 0.9 + 2;
  };

  layouts.industries = function (a, sl) {
    const c = column(a, 96, 600, headHtml(sl, null) + '<p class="dbody" style="font-size:19px">' + esc(A.company.clients) + "</p>");
    const t = reveal(a, c, 0.2);
    const cols = 3, W = 350, H = 160, G = 18, rows = Math.ceil(A.industries.length / cols);
    const y0 = DY0 + (DY1 - DY0 - (rows * H + (rows - 1) * G)) / 2;
    const tiles = A.industries.map((ind, i) => {
      const d = pos(el("button", "indtile", a.root, icon(ind.icon, "ico") + "<b>" + esc(ind.name) + "</b><span>" + ind.brands.length + " brands to ask about</span>"), 760 + (i % cols) * (W + G), y0 + Math.floor(i / cols) * (H + G), W, H);
      d.dataset.ind = ind.id;
      return d;
    });
    a.tl.from(tiles, { opacity: 0, y: 20, duration: 0.45, stagger: 0.06 }, 0.4);
    a.sweep(tiles, Math.max(t, 1.6), 0.9);
    return Math.max(t, 1.6) + tiles.length * 0.9 + 2;
  };

  /* One product sheet (from the product page), panning slowly from top to bottom */
  layouts.sheet = function (a, sl) {
    const p = prodOf(sl);
    const name = sl.sheet || (p && p.sheets[0]);
    const c = column(a, 96, 600, headHtml(sl, p) + (p ? '<p class="dlede" data-product="' + p.id + '">' + esc(p.name) + "</p>" : "") + '<p class="small">Tap the sheet to zoom in.</p>');
    const t = reveal(a, c, 0.2);
    if (!name) return t + 4;
    const sz = sizes[name] || [1600, 1200];
    const W = 1060, H = DY1 - DY0 - 40, ih = W * sz[1] / sz[0];
    const box = pos(el("div", "dsheet", a.root), 770, DY0 + 20, W, Math.min(H, ih));
    box.dataset.sheet = p.id + ":0";
    const im = el("img", "", box); im.src = src(name); im.alt = "";
    a.tl.from(box, { opacity: 0, y: 30, duration: 0.8 }, 0.3);
    if (ih > H) a.tl.to(im, { y: -(ih - H), duration: Math.min(14, (ih - H) / 60), ease: "sine.inOut" }, 2.0);
    return Math.max(t, 2 + Math.min(14, Math.max(0, ih - H) / 60)) + 4;
  };

  layouts.steps = function (a, sl) {
    const p = prodOf(sl);
    const steps = sl.steps, n = steps.length;
    picture(a, resolveImg(sl.img) || (p && p.img[0]), p || (sl.img && sl.img.startsWith("p:") ? P(sl.img.slice(2)) : null), 96, 176, 760, 780, 0.2);
    const c = column(a, 940, 884, headHtml(sl, p) +
      '<ol class="steps">' + steps.map((st, i) => "<li><i>" + (i + 1) + "</i><span><b>" + esc(st[0]) + "</b>" + esc(st[1]) + "</span></li>").join("") +
      '<div class="rail"><span></span></div></ol>');
    const t = reveal(a, c, 0.4, 0.25);
    const lis = c.querySelectorAll(".steps li"), bar = c.querySelector(".steps .rail span"), railEl = c.querySelector(".steps .rail");
    const offs = Array.from(lis).map(li => li.offsetTop);
    railEl.style.height = (offs[n - 1] - offs[0]) + "px";
    lis.forEach((li, i) => {
      a.tl.call(() => li.classList.add("on"), null, t + 0.4 + i * 2);
      if (i) a.tl.to(bar, { height: offs[i] - offs[0], duration: 0.6, ease: "power2.inOut" }, t - 0.2 + i * 2);
    });
    return t + n * 2 + 4;
  };

  layouts.facts = function (a, sl) {
    const py = Math.round((DY0 + DY1 - 540) / 2);
    const ph = a.spot(resolveImg(sl.img) || "about", 1000, py, 824, 540, { cls: "photo" });
    const c = column(a, 96, 820, headHtml(sl, null) + '<p class="dlede" style="font-size:20px">' + esc(A.company.about[0]) + "</p>" +
      '<div class="dfacts seq">' + facts.map(f => "<div><b>" + esc(f.big) + "</b><span>" + esc(f.small) + "</span></div>").join("") + "</div>");
    a.tl.from(ph, { opacity: 0, x: 60, duration: 1.1, ease: "power3.out" }, 0.3);
    drift(a, ph.querySelector("img"), 1.4);
    return reveal(a, c, 0.3) + 8;
  };

  layouts.cards = function (a, sl) {
    const items = sl.items === "facility" ? A.company.facility.map(f => [f[1], f[2], null, f[0]]) : sl.items;
    const head = a.text("div", "dtop", 96, DY0 + 14, 1728, headHtml(sl, null));
    const t = reveal(a, head, 0.2);
    const cols = sl.cols || 3, G = 22, n = items.length, rows = Math.ceil(n / cols);
    const top = DY0 + 14 + head.offsetHeight + 34;
    const W = (1728 - G * (cols - 1)) / cols;
    const H = Math.min(300, (DY1 - 20 - top - G * (rows - 1)) / rows);
    const cards = items.map((it, i) => {
      const d = pos(el("div", "dcard", a.root, "<div>" + (it[3] ? icon(it[3]).replace("<svg ", '<svg style="width:52px;height:52px;color:var(--red);margin:0 0 16px" ') : "<i></i>") + "<b>" + esc(it[0]) + "</b><span>" + esc(it[1]) + "</span></div>"),
        96 + (i % cols) * (W + G), top + Math.floor(i / cols) * (H + G), W, H);
      return d;
    });
    centreBlock([head].concat(cards));
    a.tl.from(cards, { opacity: 0, y: 30, duration: 0.6, ease: "power2.out", stagger: 0.18 }, t);
    return t + n * 0.18 + Math.max(8, n * 1.3);
  };

  layouts.map = function (a, sl) {
    const c = column(a, 96, 600, headHtml(sl, null) + '<div class="seq" style="display:flex;flex-direction:column;gap:12px">' +
      A.company.regions.map(r => '<div style="border-left:4px solid var(--green);padding-left:16px"><b style="font-size:22px">' + esc(r.name) + '</b><span class="small" style="display:block;font-size:16px">' + esc(r.sub) + "</span></div>").join("") + "</div>");
    const t = reveal(a, c, 0.2);
    const m = malaysiaMap(a.root, 1120, {});
    pos(m.wrap, 740, DY0 + (DY1 - DY0 - m.h) / 2);
    a.tl.from(m.wrap, { opacity: 0, duration: 0.9 }, 0.3);
    ["central", "north", "south", "east", "borneo"].forEach((k, i) => {
      const r = m.reg[k], tt = 1 + i * 0.7;
      a.tl.call(() => r.paths.forEach(p => p.classList.add("cov")), null, tt);
      if (r.link) a.draw(r.link, tt - 0.2, 0.5);
    });
    a.loop(gsap.fromTo(m.pulse, { attr: { r: 8 }, opacity: 1 }, { attr: { r: 40 }, opacity: 0, duration: 1.8, repeat: -1, ease: "power1.out" }), 1);
    return Math.max(t, 4.5) + 8;
  };

  layouts.values = function (a, sl) {
    const head = a.text("div", "dtop", 96, DY0 + 14, 1728, headHtml(sl, null));
    const t = reveal(a, head, 0.2);
    const top = DY0 + 14 + head.offsetHeight + 24;
    const box = a.text("div", "", 96, top, 1728,
      '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:40px;background:var(--wash);border-radius:10px;padding:34px 40px">' +
      '<div><h3 style="margin:0 0 10px;font-size:26px;color:var(--red)">Leadership Team:</h3><p class="body" style="font-size:18px">' + esc(A.company.leadership) + "</p></div>" +
      '<div><h3 style="margin:0 0 10px;font-size:26px;color:var(--red)">Vision:</h3><p class="body" style="font-size:18px">' + esc(A.company.vision) + "</p></div>" +
      '<div><h3 style="margin:0 0 10px;font-size:26px;color:var(--red)">Mission:</h3>' + A.company.mission.map(m => '<p class="body" style="font-size:18px;margin-bottom:10px">' + esc(m) + "</p>").join("") + "</div></div>" +
      '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:12px;margin-top:22px">' + A.company.values.map(v => '<div class="vv" style="background:var(--wash);border-radius:10px;padding:18px 16px"><b style="display:block;font-size:19px;color:var(--text)">' + esc(v[0]) + '</b><span style="display:block;font-size:14px;line-height:1.45;color:var(--body);margin-top:6px">' + esc(v[1]) + "</span></div>").join("") + "</div>");
    centreBlock([head, box]);
    const vv = box.querySelectorAll(".vv");
    a.tl.from(box.firstChild, { opacity: 0, y: 24, duration: 0.6 }, t);
    a.tl.from(vv, { opacity: 0, y: 20, duration: 0.45, stagger: 0.15 }, t + 0.6);
    vv.forEach((v, i) => a.tl.to(v, { backgroundColor: "#FDECEC", duration: 0.3, yoyo: true, repeat: 1, repeatDelay: 1 }, t + 2 + i * 1.4));
    return t + 2 + vv.length * 1.4 + 2;
  };

  layouts.contact = function (a, sl) {
    const c = column(a, 96, 900, headHtml(sl, null) +
      '<div class="seq" style="display:flex;flex-direction:column;gap:18px">' +
      [["phone", A.company.phone, "Office"], ["whatsapp", A.company.mobile, "WhatsApp"], ["mail", A.company.email, "Email"], ["pin", A.company.address.join(" "), "Headquarters"], ["clock", "Monday to Friday, 8:30 AM to 5:30 PM", "Closed on weekends and public holidays"]]
        .map(r => '<div style="display:flex;gap:18px;align-items:center">' + icon(r[0]).replace("<svg ", '<svg style="width:38px;height:38px;color:' + (r[0] === "whatsapp" ? "#25D366" : "var(--red)") + ';flex:none" ') + '<div><b style="display:block;font-size:' + (r[1].length > 40 ? 20 : 28) + 'px;font-weight:700">' + esc(r[1]) + '</b><span class="small" style="font-size:16px">' + esc(r[2]) + "</span></div></div>").join("") + "</div>");
    const t = reveal(a, c, 0.2);
    const q = pos(el("div", "qr", a.root, qrSvg(A.company.url)), 1180, DY0 + 150, 400, 400);
    const qc = a.text("div", "", 1130, DY0 + 570, 500, '<b style="display:block;text-align:center;font-size:24px">Scan for sciencegates.com</b>');
    a.tl.from(q, { opacity: 0, scale: 0.9, duration: 0.7, ease: "back.out(1.4)" }, 0.6);
    a.fade(qc, 0.9);
    return t + 9;
  };

  /* Brochures (PDF first pages) attached to the given products */
  layouts.docs = function (a, sl) {
    const list = [];
    sl.ids.forEach(id => { const p = P(id); ((p && p.docs) || []).forEach(d => { if (!list.some(x => x.file === d.file)) list.push(d); }); });
    list.splice(8);
    const c = column(a, 96, 620, headHtml(sl, null) + '<p class="dlede">Tap a brochure to open it.</p>');
    const t = reveal(a, c, 0.2);
    const n = list.length, cols = Math.min(4, n), rows = Math.ceil(n / cols), W = 236, G = 22, H = 318;
    const y0 = DY0 + (DY1 - DY0 - (rows * H + (rows - 1) * G)) / 2;
    const cards = list.map((d, i) => {
      const b = pos(el("button", "ddoc", a.root, '<div class="th" style="background-image:url(\'' + encodeURI(d.thumb) + '\')"></div><b>' + esc(d.title) + "</b><span>Brochure · PDF</span>"), 800 + (i % cols) * (W + G), y0 + Math.floor(i / cols) * (H + G), W, H);
      b.dataset.doc = d.file; b.dataset.title = d.title;
      return b;
    });
    a.tl.from(cards, { opacity: 0, y: 30, duration: 0.5, stagger: 0.1, ease: "power2.out" }, 0.5);
    return Math.max(t, 0.5 + n * 0.1) + 8;
  };

  function buildDeep(a, sl) {
    const f = layouts[sl.type];
    if (!f) throw new Error("Unknown slide layout: " + sl.type);
    return f(a, sl);
  }

  /* Images the scenes use, for preloading */
  const images = ["banner1", "banner2", "banner3", "banner4", "banner5", "about"];

  return { list, makeApi, src, esc, words, images, buildDeep, deepImages, loadSizes, sizes, malaysiaMap, qrSvg, waLink, icon, deepFor, pimg, facts };
})();
