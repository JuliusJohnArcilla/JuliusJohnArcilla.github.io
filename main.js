(() => {
  const D = window.PORTFOLIO;
  const root = document.documentElement;
  const body = document.body;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const el = (tag, attrs = {}, children = []) => {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "text") node.textContent = v;
      else node.setAttribute(k, v);
    }
    for (const c of [].concat(children)) if (c != null) node.append(c);
    return node;
  };

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const pad = (n) => String(n).padStart(2, "0");
  const external = (url) => (/^https?:/.test(url) ? { target: "_blank", rel: "noopener" } : {});

  // Shared pointer state and a single animation loop.
  const mouse = { x: -9999, y: -9999, moved: false };
  addEventListener("pointermove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.moved = true;
  }, { passive: true });
  const tasks = new Set();
  const loop = (t) => {
    tasks.forEach((fn) => fn(t));
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  /* ---------- Render content ---------- */

  const initials = D.name.split(/\s+/).map((w) => w[0]).join("").slice(0, 3).toUpperCase();
  const bound = { ...D, initials };
  document.title = `${D.name} — ${D.role}`;
  $$("[data-bind]").forEach((n) => (n.textContent = bound[n.dataset.bind] ?? ""));
  $$('[data-bind-href="mailto"]').forEach((n) => (n.href = `mailto:${D.email}`));
  $$("[data-show]").forEach((n) => (n.hidden = !D[n.dataset.show]));
  $$("[data-year]").forEach((n) => (n.textContent = new Date().getFullYear()));

  // Projects: list rows + matching slides in the floating preview
  $("#project-count").textContent = `${pad(D.projects.length)} projects`;
  $("#projects").append(
    ...D.projects.map((p, i) =>
      el("li", { class: "reveal", style: `--d:${i * 80}ms` },
        el("a", { class: "row", href: p.url || "#", ...external(p.url || ""), "data-index": i, "data-cursor": "View" }, [
          el("span", { class: "row__num mono", text: pad(i + 1) }),
          el("span", {}, [el("span", { class: "row__title", text: p.title }), el("span", { class: "row__summary", text: p.summary })]),
          el("span", { class: "row__tags mono", text: p.tags.join(" / ") }),
          el("span", { class: "row__year mono", text: p.year }),
          el("span", { class: "row__arrow", text: "↗" }),
        ])
      )
    )
  );
  $(".preview__strip").append(
    ...D.projects.map((p, i) =>
      el("div", { class: "slide" },
        p.image
          ? el("img", { src: p.image, alt: "" })
          : el("div", { class: "art", style: `--h:${p.hue ?? 20}` }, [
              el("div", { class: "art__meta mono" }, [el("span", { text: pad(i + 1) }), el("span", { text: p.year })]),
              el("div", { class: "art__body" }, [
                el("p", { class: "art__title", text: p.title }),
                el("p", { class: "art__summary", text: p.summary }),
              ]),
            ])
      )
    )
  );

  // About
  const statement = $("#statement");
  D.statement.split(/\s+/).forEach((w, i) => {
    if (i) statement.append(" ");
    statement.append(el("span", { class: "w", text: w }));
  });
  $("#about-text").append(...D.about.map((t) => el("p", { text: t })));
  $("#skills").append(
    ...Object.entries(D.skills).map(([group, items]) =>
      el("div", {}, [el("h3", { text: group }), el("ul", {}, items.map((s) => el("li", { text: s })))])
    )
  );

  // Experience
  $("#timeline").append(
    ...D.experience.map((e, i) =>
      el("li", { class: "job reveal", style: `--d:${i * 80}ms` }, [
        el("span", { class: "job__period mono", text: e.period }),
        el("p", { class: "job__title", text: e.title }),
        el("p", { class: "job__org", text: e.org }),
        el("p", { class: "job__note", text: e.note }),
      ])
    )
  );

  // Contact
  const socials = D.links.map((l) => el("li", {}, el("a", { href: l.url, ...external(l.url), "data-scramble": "", text: l.label })));
  if (D.resumeUrl) socials.push(el("li", {}, el("a", { href: D.resumeUrl, ...external(D.resumeUrl), "data-scramble": "", text: "Résumé" })));
  $("#socials").append(...socials);
  const copyBtn = $("#copy-email");
  copyBtn.textContent = D.email;

  /* ---------- Text effects ---------- */

  // Split into words > chars, keeping the original text for screen readers.
  $$("[data-split]").forEach((node) => {
    const text = node.textContent.trim();
    node.textContent = "";
    node.setAttribute("aria-label", text);
    let i = 0;
    text.split(/\s+/).forEach((word, wi) => {
      if (wi) node.append(" ");
      const w = el("span", { class: "word", "aria-hidden": "true" });
      for (const ch of word) w.append(el("span", { class: "char", style: `--i:${i++}`, text: ch }));
      node.append(w);
    });
  });

  // Headings rise word by word from a mask.
  $$("[data-lines]").forEach((node) => {
    const words = node.textContent.trim().split(/\s+/);
    node.textContent = "";
    words.forEach((w, i) => {
      if (i) node.append(" ");
      node.append(el("span", { class: "mask" }, el("span", { style: `--i:${i}`, text: w })));
    });
  });

  const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=/<>";
  function scramble(node, final = node.dataset.label ?? node.textContent) {
    if (reduceMotion) return void (node.textContent = final);
    cancelAnimationFrame(node._scramble);
    let frame = 0;
    const tick = () => {
      let out = "";
      for (let i = 0; i < final.length; i++) {
        const ch = final[i];
        out += ch === " " || frame >= i * 1.5 + 6 ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      node.textContent = out;
      if (out !== final) node._scramble = requestAnimationFrame(tick);
      frame++;
    };
    tick();
  }

  /* ---------- Theme ---------- */

  const toggle = $(".theme-toggle");
  const currentTheme = () => root.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  const setToggleLabel = () => (toggle.dataset.label = toggle.textContent = currentTheme() === "dark" ? "◐ Dark" : "◑ Light");
  setToggleLabel();
  toggle.addEventListener("click", () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch {}
    setToggleLabel();
    scramble(toggle);
    dispatchEvent(new Event("themechange"));
  });
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    setToggleLabel();
    dispatchEvent(new Event("themechange"));
  });

  $$("[data-scramble]").forEach((n) => {
    n.dataset.label ??= n.textContent;
    n.addEventListener("pointerenter", () => scramble(n));
  });

  copyBtn.dataset.label = D.email;
  copyBtn.addEventListener("click", async () => {
    let msg = "Copied to clipboard";
    try { await navigator.clipboard.writeText(D.email); } catch { msg = "Copy failed"; }
    scramble(copyBtn, msg);
    clearTimeout(copyBtn._t);
    copyBtn._t = setTimeout(() => scramble(copyBtn, D.email), 1800);
  });

  /* ---------- Clock ---------- */

  let fmt;
  try {
    fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: D.timezone });
  } catch {
    fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
  }
  const clocks = $$("[data-clock]");
  const tickClock = () => clocks.forEach((c) => (c.textContent = fmt.format(new Date())));
  tickClock();
  setInterval(tickClock, 1000);

  /* ---------- Hero dot field (canvas) ---------- */

  (function field() {
    const canvas = $(".hero__field");
    const ctx = canvas.getContext("2d");
    const GAP = 28, RADIUS = 170;
    let w = 0, h = 0, dots = [], ink = "#000", accent = "#00f", visible = true;

    const readColors = () => {
      const cs = getComputedStyle(root);
      ink = cs.getPropertyValue("--ink").trim();
      accent = cs.getPropertyValue("--accent").trim();
    };
    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = [];
      for (let y = GAP / 2; y < h; y += GAP) for (let x = GAP / 2; x < w; x += GAP) dots.push({ ox: x, oy: y, x, y });
    };
    const draw = (t = 0) => {
      if (!visible) return;
      const r = canvas.getBoundingClientRect();
      const mx = mouse.x - r.left, my = mouse.y - r.top;
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        const dx = d.ox - mx, dy = d.oy - my;
        const dist = Math.hypot(dx, dy) || 1;
        const f = Math.max(0, 1 - dist / RADIUS);
        const push = f * f * 40;
        const wave = reduceMotion ? 0 : Math.sin(t * 0.0011 + d.ox * 0.011 + d.oy * 0.007) * 2.2;
        d.x = lerp(d.x, d.ox + (dx / dist) * push, 0.14);
        d.y = lerp(d.y, d.oy + (dy / dist) * push + wave, 0.14);
        const s = 1.3 + f * 2.6;
        ctx.globalAlpha = 0.15 + f * 0.75;
        ctx.fillStyle = f > 0.3 ? accent : ink;
        ctx.fillRect(d.x - s / 2, d.y - s / 2, s, s);
      }
      ctx.globalAlpha = 1;
    };

    readColors();
    resize();
    addEventListener("resize", () => { resize(); draw(); });
    addEventListener("themechange", () => { readColors(); draw(); });
    new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(canvas);
    if (reduceMotion) draw();
    else tasks.add(draw);
  })();

  /* ---------- Custom cursor ---------- */

  if (finePointer) {
    body.classList.add("has-cursor");
    const cursor = $(".cursor"), dot = $(".cursor__dot"), ring = $(".cursor__ring"), label = $(".cursor__label");
    const pos = { x: 0, y: 0, ready: false };
    tasks.add(() => {
      if (!mouse.moved) return;
      if (!pos.ready) Object.assign(pos, { x: mouse.x, y: mouse.y, ready: true });
      pos.x = lerp(pos.x, mouse.x, 0.18);
      pos.y = lerp(pos.y, mouse.y, 0.18);
      dot.style.transform = `translate(${mouse.x}px, ${mouse.y}px)`;
      ring.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
    });
    document.addEventListener("pointerover", (e) => {
      const labelled = e.target.closest("[data-cursor]");
      const link = e.target.closest("a, button");
      cursor.classList.toggle("is-label", !!labelled);
      cursor.classList.toggle("is-hover", !labelled && !!link);
      if (labelled) label.textContent = labelled.dataset.cursor;
    });
    document.addEventListener("pointerdown", () => cursor.classList.add("is-down"));
    document.addEventListener("pointerup", () => cursor.classList.remove("is-down"));
    root.addEventListener("mouseleave", () => cursor.classList.add("is-hidden"));
    root.addEventListener("mouseenter", () => cursor.classList.remove("is-hidden"));
  }

  /* ---------- Magnetic elements ---------- */

  if (finePointer && !reduceMotion) {
    $$("[data-magnetic]").forEach((n) => {
      n.addEventListener("pointermove", (e) => {
        const r = n.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.35;
        const y = (e.clientY - r.top - r.height / 2) * 0.35;
        n.style.transform = `translate(${x}px, ${y}px)`;
      });
      n.addEventListener("pointerleave", () => (n.style.transform = ""));
    });
  }

  /* ---------- Variable-weight text that swells near the cursor ---------- */

  if (finePointer && !reduceMotion) {
    const chars = $$("[data-weight] .char").map((n) => ({ n, w: 300, rect: null }));
    const BASE = 300, MAX = 800, RADIUS = 320;
    tasks.add(() => {
      if (!mouse.moved || !body.classList.contains("is-loaded")) return;
      for (const c of chars) c.rect = c.n.getBoundingClientRect();
      for (const c of chars) {
        const r = c.rect;
        if (r.bottom < 0 || r.top > innerHeight) continue;
        const d = Math.hypot(mouse.x - (r.left + r.width / 2), mouse.y - (r.top + r.height / 2));
        const target = BASE + (MAX - BASE) * Math.max(0, 1 - d / RADIUS) ** 2;
        const next = lerp(c.w, target, 0.12);
        if (Math.abs(next - c.w) > 0.3) c.n.style.fontWeight = Math.round(next);
        c.w = next;
      }
    });
  }

  /* ---------- Floating project preview ---------- */

  if (finePointer) {
    const box = $(".preview"), strip = $(".preview__strip"), list = $("#projects");
    const s = { x: 0, y: 0, rot: 0, scale: 0, target: 0 };
    list.addEventListener("pointerover", (e) => {
      const row = e.target.closest(".row");
      if (!row) return;
      if (s.scale < 0.05) Object.assign(s, { x: mouse.x, y: mouse.y });
      s.target = 1;
      strip.style.transform = `translateY(${-row.dataset.index * 100}%)`;
    });
    list.addEventListener("pointerleave", () => (s.target = 0));
    addEventListener("scroll", () => {
      if (s.target && !list.matches(":hover")) s.target = 0;
    }, { passive: true });
    tasks.add(() => {
      if (s.target === 0 && s.scale < 0.01) return void (box.style.opacity = 0);
      const prevX = s.x;
      s.x = lerp(s.x, mouse.x, 0.12);
      s.y = lerp(s.y, mouse.y, 0.12);
      s.rot = lerp(s.rot, clamp((s.x - prevX) * 0.5, -10, 10), 0.1);
      s.scale = lerp(s.scale, s.target, 0.14);
      box.style.opacity = 1;
      box.style.transform = `translate(${s.x}px, ${s.y}px) translate(-50%, -50%) rotate(${s.rot}deg) scale(${s.scale})`;
    });
  }

  /* ---------- Marquee driven by scroll velocity ---------- */

  (function marquee() {
    const track = $(".marquee__track");
    const items = Object.values(D.skills).flat();
    const make = (t) => el("span", { class: "marquee__item" }, [t, el("i", { text: "✳" })]);
    const group = el("div", { class: "marquee__group" }, items.map(make));
    track.append(group);
    const fill = () => {
      while (group.offsetWidth < innerWidth * 1.2 && group.children.length < 200) items.forEach((t) => group.append(make(t)));
      track.querySelectorAll(".marquee__group + .marquee__group").forEach((g) => g.remove());
      track.append(group.cloneNode(true));
    };
    fill();
    if (reduceMotion) return;
    let x = 0, dir = -1, lastY = scrollY, width = group.offsetWidth;
    const measure = () => { fill(); width = group.offsetWidth; };
    addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    tasks.add(() => {
      const v = scrollY - lastY;
      lastY = scrollY;
      if (v) dir = v > 0 ? -1 : 1;
      x += dir * (0.7 + Math.min(Math.abs(v) * 0.35, 22));
      if (x <= -width) x += width;
      if (x > 0) x -= width;
      track.style.transform = `translate3d(${x}px, 0, 0)`;
    });
  })();

  /* ---------- Scroll-linked: progress, nav, statement ---------- */

  const progress = $(".progress"), nav = $(".nav");
  const words = $$(".w", statement);
  tasks.add(() => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    nav.classList.toggle("is-scrolled", scrollY > 20);

    const r = statement.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;
    const p = clamp((innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.25), 0, 1);
    const lit = Math.ceil(p * words.length);
    words.forEach((w, i) => w.classList.toggle("is-lit", i < lit));
  });

  // Active nav link
  const navLinks = $$(".nav__links a");
  const sectionObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${entry.target.id}`));
    }
  }, { rootMargin: "-45% 0px -50% 0px" });
  navLinks.forEach((a) => {
    const section = $(a.getAttribute("href"));
    if (section) sectionObserver.observe(section);
  });

  // Reveal on scroll; section labels scramble in.
  const revealObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const t = entry.target;
      t.classList.add("is-visible", "is-in");
      if (t.matches(".sec-head")) scramble($(".mono", t));
      revealObserver.unobserve(t);
    }
  }, { threshold: 0.15 });
  $$(".reveal, .sec-head, .contact [data-split]").forEach((n) => revealObserver.observe(n));

  /* ---------- Intro: counter, curtain, hero letters ---------- */

  const hero = $(".hero__name");
  const finishIntro = () => {
    body.classList.remove("is-loading");
    body.classList.add("is-loaded");
    hero.classList.add("is-in");
    setTimeout(() => $(".loader")?.remove(), 1300);
  };
  if (reduceMotion) {
    finishIntro();
  } else {
    body.classList.add("is-loading");
    const count = $(".loader__count");
    const start = performance.now(), DURATION = 1400;
    const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
    const step = (t) => {
      const p = clamp((t - start) / DURATION, 0, 1);
      count.textContent = String(Math.round((1 - (1 - p) ** 3) * 100)).padStart(3, "0");
      if (p < 1) requestAnimationFrame(step);
      else fonts.then(() => setTimeout(finishIntro, 150));
    };
    requestAnimationFrame(step);
  }
})();
