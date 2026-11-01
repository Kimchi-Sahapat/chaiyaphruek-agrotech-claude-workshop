/* =====================================================================
   ชัยพฤกษ์ อโกรเทค — Motion Kit (cyp-motion.js) · no dependencies
   ---------------------------------------------------------------------
   Deterministic, seekable animation for one-file HTML compositions.
   • Open the .html in a browser  → live preview with scrubber + safe-zone guides
   • node motion/render/render.mjs → frame-accurate MP4 (seeks every frame)
   Everything visible must be a function of time t: no Date.now(), no unseeded
   Math.random(), no setTimeout/setInterval, no network. Use the API below.

   const M = CYP.motion({ mode: 'advise' | 'celebrate' }); // reads #stage data-*
   const s = M.scene('#s1', 0, 3.4);          // scene visible [0, 3.4) — times inside s.* are scene-relative
   s.in('#title', 'mask-rise', 0.2, { split: 'chunk', stagger: 0.12 });
   s.out('#title', 'mask-up', 2.9);           // reuses the chunks from in()
   M.loop('#rays', 'spin', 0);  M.cut(3.4, 'panel');  M.sfx('pop', 1.2);
   M.done();
   Full reference: motion/kit/README.md
   ===================================================================== */
(function () {
  'use strict';

  const RENDER = !!window.__CYP_RENDER || /[?&]render\b/.test(location.search);

  /* ---------- brand easing (mirrors design-system tokens --cyp-ease-*) ----------
     Sources: Material 3 motion tokens + IBM Carbon motion tokens (see motion/research/02). */
  const EASE = {
    enter: [0.05, 0.7, 0.1, 1],    // M3 emphasized-decelerate — confident arrival (celebrate mode)
    info: [0, 0, 0.38, 0.9],       // Carbon productive entrance — calm, no drama (advise mode text)
    exit: [0.3, 0, 0.8, 0.15],     // M3 emphasized-accelerate — leaves and gets out of the way
    move: [0.2, 0, 0, 1],          // M3 standard — moves/wipes that start and end on screen
    pop: [0.34, 1.56, 0.64, 1],    // back-out overshoot — SHAPES only (badges, circles, ribbons), never text
    loop: [0.37, 0, 0.63, 1],      // sine in-out — floats, pulses
    linear: [0, 0, 1, 1],          // constant rotation (sunburst drift) only
  };
  // Two energy modes (Carbon's productive/expressive idea):
  //   advise    = expert / knowledge / product / testimonial → info easing, no overshoot on text, slower stagger
  //   celebrate = promotion / giveaway / event / CTA → enter easing, pop on shapes, quicker stagger
  const MODES = { calm: 'advise', festive: 'celebrate' };
  const easeCss = (e) => (EASE[e] ? `cubic-bezier(${EASE[e].join(',')})` : e);

  function cubicBezier(x1, y1, x2, y2) {           // JS twin of CSS cubic-bezier()
    const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
    const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    const sx = (t) => ((ax * t + bx) * t + cx) * t;
    const sy = (t) => ((ay * t + by) * t + cy) * t;
    const dx = (t) => (3 * ax * t + 2 * bx) * t + cx;
    return (x) => {
      if (x <= 0) return 0; if (x >= 1) return 1;
      let t = x;
      for (let i = 0; i < 8; i++) { const d = sx(t) - x; if (Math.abs(d) < 1e-6) return sy(t); const s = dx(t); if (Math.abs(s) < 1e-6) break; t -= d / s; }
      let lo = 0, hi = 1; t = x;
      for (let i = 0; i < 40; i++) { const v = sx(t); if (Math.abs(v - x) < 1e-6) break; if (x > v) lo = t; else hi = t; t = (lo + hi) / 2; }
      return sy(t);
    };
  }
  const easeFn = (e) => (Array.isArray(e) ? cubicBezier(...e) : cubicBezier(...(EASE[e] || EASE.enter)));

  /* ---------- presets: keyframes + default duration (s) + easing ---------- */
  // `text: true` presets take the mode's text easing (advise → info, celebrate → enter).
  const IN = {
    fade: { kf: [{ opacity: 0 }, { opacity: 1 }], dur: 0.4, ease: 'info' },
    rise: { kf: [{ opacity: 0, transform: 'translateY(0.55em)' }, { opacity: 1, transform: 'none' }], dur: 0.6, text: true },
    drop: { kf: [{ opacity: 0, transform: 'translateY(-0.55em)' }, { opacity: 1, transform: 'none' }], dur: 0.6, text: true },
    'slide-l': { kf: [{ opacity: 0, transform: 'translateX(-1.2em)' }, { opacity: 1, transform: 'none' }], dur: 0.6, text: true },
    'slide-r': { kf: [{ opacity: 0, transform: 'translateX(1.2em)' }, { opacity: 1, transform: 'none' }], dur: 0.6, text: true },
    // ≥150%: Thai tone marks sit ~0.15em above the line box — a smaller offset lets them peek in on frame 1
    'mask-rise': { kf: [{ transform: 'translateY(150%)' }, { transform: 'none' }], dur: 0.7, text: true, mask: true },
    'mask-drop': { kf: [{ transform: 'translateY(-150%)' }, { transform: 'none' }], dur: 0.7, text: true, mask: true },
    pop: { kf: [{ opacity: 0, transform: 'scale(0.4)' }, { opacity: 1, transform: 'scale(1)' }], dur: 0.32, ease: 'pop', land: 0.55 },
    stamp: { kf: [{ opacity: 0, transform: 'scale(1.2) rotate(-8deg)' }, { opacity: 1, transform: 'scale(1) rotate(0deg)' }], dur: 0.25, ease: 'pop', land: 0.6 },
    punch: { kf: [{ opacity: 0, transform: 'scale(1.6)' }, { opacity: 1, transform: 'scale(1)' }], dur: 0.38, ease: 'enter', land: 0.7 },
    zoom: { kf: [{ opacity: 0, transform: 'scale(0.86)' }, { opacity: 1, transform: 'scale(1)' }], dur: 0.6, ease: 'enter' },
    wipe: { kf: [{ clipPath: 'inset(-20% 100% -20% 0)' }, { clipPath: 'inset(-20% 0% -20% 0)' }], dur: 0.6, ease: 'move' },
    'wipe-up': { kf: [{ clipPath: 'inset(100% -20% 0 -20%)' }, { clipPath: 'inset(0% -20% 0 -20%)' }], dur: 0.6, ease: 'move' },
    unfurl: { kf: [{ clipPath: 'inset(-20% 50% -20% 50%)' }, { clipPath: 'inset(-20% 0% -20% 0%)' }], dur: 0.55, ease: 'enter' },
    iris: { kf: [{ clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(75% at 50% 50%)' }], dur: 0.7, ease: 'enter' },
    draw: { kf: [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], dur: 0.9, ease: 'move' }, // SVG path with pathLength="1" stroke-dasharray="1"
    highlight: { kf: [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], dur: 0.45, ease: 'enter', pseudo: '::before' },
    underline: { kf: [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], dur: 0.45, ease: 'enter', pseudo: '::after' },
  };
  const OUT = {
    fade: { kf: [{ opacity: 1 }, { opacity: 0 }], dur: 0.3, ease: 'exit' },
    sink: { kf: [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(0.4em)' }], dur: 0.35, ease: 'exit' },
    lift: { kf: [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-0.4em)' }], dur: 0.35, ease: 'exit' },
    'mask-up': { kf: [{ transform: 'none' }, { transform: 'translateY(-150%)' }], dur: 0.4, ease: 'exit', mask: true },
    'mask-down': { kf: [{ transform: 'none' }, { transform: 'translateY(150%)' }], dur: 0.4, ease: 'exit', mask: true },
    pop: { kf: [{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(0.6)' }], dur: 0.3, ease: 'exit' },
    wipe: { kf: [{ clipPath: 'inset(-20% 0% -20% 0%)' }, { clipPath: 'inset(-20% 0% -20% 100%)' }], dur: 0.45, ease: 'move' },
  };
  const LOOP = {
    float: { kf: [{ transform: 'translateY(0) rotate(-1.5deg)' }, { transform: 'translateY(-16px) rotate(1.5deg)' }], dur: 1.8, ease: 'loop', alt: true },
    sway: { kf: [{ transform: 'rotate(-2.5deg)' }, { transform: 'rotate(2.5deg)' }], dur: 1.6, ease: 'loop', alt: true },
    pulse: { kf: [{ transform: 'scale(1)' }, { transform: 'scale(1.06)' }], dur: 0.7, ease: 'loop', alt: true },
    twinkle: { kf: [{ transform: 'scale(0.55) rotate(0deg)', opacity: 0.55 }, { transform: 'scale(1.1) rotate(45deg)', opacity: 1 }], dur: 0.8, ease: 'loop', alt: true },
    spin: { kf: [{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], dur: 90, ease: 'linear' },
  };

  /* ---------- Thai-safe splitting ---------- */
  // 'chunk'   : split on spaces and on "|" (the "|" is removed). Thai uses spaces between
  //             phrases, so this gives natural phrase chunks. DEFAULT — you control the breaks.
  // 'grapheme': per visible character cluster (keeps ที่ / น้ำ / ษ์ intact). Typewriter only.
  // 'word'    : Intl.Segmenter dictionary words AFTER protecting GLOSSARY terms. Raw ICU gets
  //             13/43 farm terms wrong (อโกรเทค → อ|โก|ร|เทค, ตาดอก → ตาด|อก, 15-15-15 → 15|-|15…).
  //             Still check the result; "|" in the text always wins.
  // Inline child elements (e.g. <span class="cyp-gold">3</span>) each become ONE chunk and keep
  // their styling; text between them is split by the mode. <br> is kept as a line break.
  const segment = (text, g) => [...new Intl.Segmenter('th', { granularity: g }).segment(text)].map((s) => s.segment);
  // Terms the word segmenter must never cut. Extend per piece: CYP.GLOSSARY.push('ไตรโคเดอร์มา')
  const GLOSSARY = ['ชัยพฤกษ์', 'อโกรเทค', 'ตาดอก', 'ไฟทอปธอร่า', 'ไตรโคเดอร์มา', 'รากเน่าโคนเน่า', 'แคลเซียม-โบรอน',
    'ทุเรียน', 'มังคุด', 'ลองกอง', 'ลำไย', 'เพลี้ยไฟ', 'ไรแดง', 'Lucky Group', 'Black Panther', '@cyp-agro'];
  const NPK = /\d+(?:-\d+){2,3}/;                                  // fertilizer formulas 15-15-15, 8-24-24…
  function words(text) {
    const esc = GLOSSARY.map((g) => g.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).sort((a, b) => b.length - a.length);
    const src = `(${[...esc, NPK.source].join('|')})`;
    const whole = new RegExp(`^${src}$`);
    return text.split(new RegExp(src)).filter(Boolean).flatMap((p) => (whole.test(p) ? [p] : segment(p, 'word')));
  }
  function split(el, mode) {
    if (el.__cypChunks) return el.__cypChunks;
    if (mode === 'children') return (el.__cypChunks = [...el.children]);
    const parts = (text) => (mode === 'grapheme' ? segment(text, 'grapheme')
      : mode === 'word' ? text.split(/(\s+|\|)/).filter((p) => p && p !== '|').flatMap((p) => (/^\s+$/.test(p) ? [p] : words(p)))
      : text.split(/(\s+|\|)/).filter((p) => p && p !== '|'));
    const chunks = [];
    for (const node of [...el.childNodes]) {
      if (node.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        for (const p of parts(node.nodeValue)) {
          if (/^\s+$/.test(p)) { frag.append(' '); continue; }
          const span = document.createElement('span');
          span.className = 'c'; span.textContent = p; frag.append(span); chunks.push(span);
        }
        node.replaceWith(frag);
      } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'BR') {
        const inner = node.classList.contains('cyp-mask') && node.querySelector(':scope > .c');
        if (inner) chunks.push(inner); else { node.classList.add('c'); chunks.push(node); }
      }
    }
    return (el.__cypChunks = chunks);
  }
  function masked(chunks) {
    return chunks.map((c) => {
      if (c.parentElement && c.parentElement.classList.contains('cyp-mask')) return c;
      const m = document.createElement('span'); m.className = 'cyp-mask';
      c.replaceWith(m); m.append(c); return c;
    });
  }
  const readChars = (text) => [...text.replace(/[\s|]+/g, '')].length;   // code points (conservative reading count)

  /* ---------- the timeline ---------- */
  function motion(opts = {}) {
    const stage = document.querySelector(opts.stage || '#stage') || document.querySelector('.cyp-stage');
    if (!stage) throw new Error('cyp-motion: no #stage element');
    const W = +(stage.dataset.width || 1080), H = +(stage.dataset.height || 1920);
    const FPS = +(stage.dataset.fps || 30), DUR = +(stage.dataset.duration || 10);
    const rawMode = opts.mode || stage.dataset.mode || 'advise';
    const MODE = MODES[rawMode] || rawMode;
    const CELEB = MODE === 'celebrate';
    const SAFE_PROFILE = opts.safe || stage.dataset.safe || 'ads';   // 'ads' (boostable, strict) | 'organic'
    stage.style.width = W + 'px'; stage.style.height = H + 'px';
    if (RENDER) document.body.classList.add('cyp-render');

    const anims = [], ticks = [], scenes = [], cues = [], audio = [], texts = [], videos = [];
    const entered = new WeakMap();                  // element → Set(pseudo) that already has an entrance
    let T = 0, maxEnd = 0;
    const $ = (sel, root) => (typeof sel === 'string' ? [...(root || document).querySelectorAll(sel)] : sel instanceof Element ? [sel] : [...sel]);

    function addAnim(el, kf, { at, dur, ease, fill, iterations = 1, alt = false, composite = 'replace', pseudo }) {
      const a = el.animate(kf, {
        duration: dur * 1000, delay: at * 1000, fill, easing: easeCss(ease), iterations,
        direction: alt ? 'alternate' : 'normal', composite, pseudoElement: pseudo || undefined,
      });
      a.pause(); a.currentTime = T * 1000; anims.push(a);
      if (iterations === 1) maxEnd = Math.max(maxEnd, at + dur);
      return a;
    }

    function api(offset, sceneEnd) {
      const self = {
        /** entrance. preset ∈ IN; o: {split, stagger, dur, ease, mask} */
        in(target, preset, at, o = {}) {
          const p = IN[preset]; if (!p) throw new Error(`cyp-motion: unknown in-preset "${preset}"`);
          const t0 = offset + at;
          for (const el of $(target)) {
            let items = [el];
            if (o.split) items = split(el, o.split === true ? 'chunk' : o.split);
            if (p.mask || o.mask) items = masked(items);
            const stagger = o.stagger ?? (items.length > 1 ? (CELEB ? 0.07 : 0.1) : 0);
            const dur = o.dur ?? p.dur * (CELEB ? 0.85 : 1);
            const ease = o.ease ?? (p.text ? (CELEB ? 'enter' : 'info') : p.ease);
            items.forEach((it, i) => {
              const key = p.pseudo || '';
              const seen = entered.get(it) || new Set();
              addAnim(it, p.kf, { at: t0 + i * stagger, dur, ease, fill: seen.has(key) ? 'forwards' : 'both', pseudo: p.pseudo });
              seen.add(key); entered.set(it, seen);
              // SFX transient lands on the frame the motion lands (never early — research/02 §5)
              if (o.sfx) cues.push({ name: o.sfx, at: t0 + i * stagger + dur * (p.land ?? 0.8), gain: o.gain ?? 1 });
            });
            if (!p.pseudo && el.textContent.trim()) texts.push({ el, inEnd: t0 + (items.length - 1) * stagger + dur, outAt: sceneEnd, chars: readChars(el.textContent) });
          }
          return self;
        },
        /** exit. preset ∈ OUT; reuses chunks if the element was split */
        out(target, preset, at, o = {}) {
          const p = OUT[preset]; if (!p) throw new Error(`cyp-motion: unknown out-preset "${preset}"`);
          const t0 = offset + at;
          for (const el of $(target)) {
            let items = el.__cypChunks && (o.split !== false) ? el.__cypChunks : [el];
            if (p.mask) items = masked(items);
            const stagger = o.stagger ?? (items.length > 1 ? 0.04 : 0);
            items.forEach((it, i) => addAnim(it, p.kf, { at: t0 + i * stagger, dur: o.dur ?? p.dur, ease: o.ease ?? p.ease, fill: 'forwards' }));
            const rec = texts.find((r) => r.el === el); if (rec) rec.outAt = Math.min(rec.outAt, t0);
          }
          return self;
        },
        /** ambient loop from `at` (transform-only loops add on top of entrances) */
        loop(target, preset, at = 0, o = {}) {
          const p = LOOP[preset]; if (!p) throw new Error(`cyp-motion: unknown loop-preset "${preset}"`);
          const onlyTransform = p.kf.every((k) => Object.keys(k).every((x) => x === 'transform'));
          $(target).forEach((el, i) => addAnim(el, p.kf, {
            at: offset + at + (o.stagger || 0) * i, dur: o.dur ?? p.dur, ease: o.ease ?? p.ease, fill: 'forwards',
            iterations: Infinity, alt: p.alt, composite: onlyTransform ? 'add' : 'replace',
          }));
          return self;
        },
        /** custom keyframes: M.anim('#x', [{...},{...}], at, {dur, ease}) */
        anim(target, kf, at, o = {}) {
          $(target).forEach((el) => addAnim(el, kf, { at: offset + at, dur: o.dur ?? 0.6, ease: o.ease ?? 'enter', fill: o.fill || 'both', pseudo: o.pseudo }));
          return self;
        },
        /** number roll-up: {from, to, dur, ease, decimals, grouping, prefix, suffix} */
        count(target, at, o = {}) {
          const from = o.from ?? 0, to = o.to ?? 100, dur = o.dur ?? 1.2, f = easeFn(o.ease || 'enter');
          const pre = o.prefix || '', suf = o.suffix || '', dec = o.decimals || 0;
          const fmt = o.format || ((n) => pre + n.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec, useGrouping: o.grouping !== false }) + suf);
          $(target).forEach((el) => ticks.push((t) => {
            const k = f(Math.min(1, Math.max(0, (t - offset - at) / dur)));
            el.textContent = fmt(from + (to - from) * k);
          }));
          maxEnd = Math.max(maxEnd, offset + at + dur);
          return self;
        },
        /** typewriter by grapheme cluster (Thai-safe). {cps} = clusters per second */
        type(target, at, o = {}) {
          const cps = o.cps ?? 14;
          $(target).forEach((el) => {
            const g = segment(el.textContent, 'grapheme');
            ticks.push((t) => { const n = Math.max(0, Math.min(g.length, Math.floor((t - offset - at) * cps))); el.textContent = g.slice(0, n).join(''); });
            maxEnd = Math.max(maxEnd, offset + at + g.length / cps);
          });
          return self;
        },
        /** run fn(localT, globalT) every frame — for anything custom; must be pure */
        tick(fn) { ticks.push((t) => fn(t - offset, t)); return self; },
        sfx(name, at, gain = 1) { cues.push({ name, at: offset + at, gain }); return self; },
      };
      return self;
    }

    const root = api(0, DUR);
    const M = Object.assign(root, {
      W, H, FPS, DUR, MODE, stage,
      /** scene visible [start, end); returns scene-relative api */
      scene(target, start, end) {
        const el = $(target)[0]; if (!el) throw new Error(`cyp-motion: scene ${target} not found`);
        el.classList.add('cyp-scene'); scenes.push({ el, start, end });
        return api(start, end);
      },
      /** brand transition centred on t: 'panel' (cream) | 'green' | 'burst' (festive) */
      cut(t, kind = 'panel', o = {}) {
        const half = o.dur ?? (kind === 'burst' ? 0.32 : 0.28);
        const ov = document.createElement('div');
        ov.className = `cyp-cut cyp-cut--${kind}`; ov.style.visibility = 'visible';
        if (kind === 'burst') { const r = document.createElement('div'); r.className = 'cyp-sunburst'; r.style.opacity = '.9'; ov.append(r); }
        stage.append(ov);
        const inKf = kind === 'burst' ? [{ clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(75% at 50% 50%)' }] : [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)' }];
        const outKf = kind === 'burst' ? [{ clipPath: 'circle(75% at 50% 50%)', opacity: 1 }, { clipPath: 'circle(75% at 50% 50%)', opacity: 0 }] : [{ clipPath: 'inset(0 0 0 0%)' }, { clipPath: 'inset(0 0 0 100%)' }];
        addAnim(ov, inKf, { at: t - half, dur: half, ease: 'move', fill: 'both' });
        addAnim(ov, outKf, { at: t, dur: half, ease: 'move', fill: 'forwards' });
        cues.push({ name: kind === 'burst' ? 'whoosh' : 'swish', at: t - half, gain: 0.7 });
        return M;
      },
      /** background music / voice-over for preview + render mux */
      music(src, o = {}) { audio.push({ src, at: o.at || 0, volume: o.volume ?? 1, role: o.role || 'music' }); return M; },
      seek, lint, done,
    });

    /* ---------- deterministic seek ---------- */
    function seek(t) {
      T = Math.min(Math.max(0, t), DUR);
      const ms = T * 1000;
      for (const a of anims) a.currentTime = ms;
      for (const s of scenes) s.el.style.visibility = T >= s.start && T < s.end ? '' : 'hidden';
      for (const f of ticks) f(T);
      const waits = [];
      for (const v of videos) {
        const local = Math.max(0, T - v.at) + v.trim;
        if (Math.abs(v.el.currentTime - local) > 0.5 / FPS) {
          waits.push(new Promise((r) => { v.el.addEventListener('seeked', r, { once: true }); setTimeout(r, 3000); }));
          v.el.currentTime = local;
        }
      }
      return waits.length ? Promise.all(waits) : Promise.resolve();
    }

    /* ---------- lint: CI + readability checks over sampled frames ---------- */
    // Text-safe box. 9:16 = union of Meta Reels ads (14% top / 35% bottom / 6% sides) and TikTok
    // (top 240 / bottom 660 / sides 120) → x 120–960, y 270–1250. Boosted Reels are ads, so this is the default.
    const SAFE = {
      '1080x1920': {
        hard: [{ n: 'top UI', x: 0, y: 0, w: 1080, h: 270 }, { n: 'bottom UI / caption / ad CTA', x: 0, y: 1250, w: 1080, h: 670 },
          { n: 'left edge', x: 0, y: 270, w: 120, h: 980 }, { n: 'right buttons', x: 960, y: 270, w: 120, h: 980 }],
        soft: [],
      },
      '1080x1350': { hard: [], soft: [{ n: 'edge 60px', x: 0, y: 0, w: 1080, h: 60 }, { n: 'edge 60px', x: 0, y: 1290, w: 1080, h: 60 }] },
      '1080x1080': { hard: [], soft: [{ n: 'edge 54px', x: 0, y: 0, w: 1080, h: 54 }, { n: 'edge 54px', x: 0, y: 1026, w: 1080, h: 54 }] },
      '1040x1040': { hard: [], soft: [{ n: 'edge 52px', x: 0, y: 0, w: 1040, h: 52 }, { n: 'edge 52px', x: 0, y: 988, w: 1040, h: 52 }] },
    };
    const zones = SAFE[`${W}x${H}`] || { hard: [], soft: [] };
    const GOLD = 'rgb(255, 215, 0)', NAVY = 'rgb(27, 58, 140)', RED = 'rgb(232, 50, 60)';
    // Reading time: Thai code points (marks included, spaces excluded) ÷ 13/s, min 1.5 s after the text
    // settles; [data-key] (key claim / CTA) needs 2×. Netflix Thai adult = 17 cps, kids = 13 → we use kids'
    // rate for older farmers reading moving text on phones (motion/research/01 §3).
    const READ_CPS = opts.readCps || 13, MIN_HOLD = 1.5;
    const MIN_PX = 40;                              // Kanit below ~43px gets hard to read on phones (research/01)

    function effOpacity(el) { let o = 1; for (let e = el; e && e !== stage.parentElement; e = e.parentElement) o *= +getComputedStyle(e).opacity; return o; }
    function inActiveScene(el) { for (let e = el; e && e !== stage; e = e.parentElement) if (e.style && e.style.visibility === 'hidden') return false; return true; }
    function textNodes() {
      const out = [], w = document.createTreeWalker(stage, NodeFilter.SHOW_TEXT);
      // .cyp-placeholder boxes stand in for photos/pack shots → not checked as text (reported separately)
      for (let n = w.nextNode(); n; n = w.nextNode()) if (n.nodeValue.trim() && !n.parentElement.closest('.cyp-guides,[data-lint-ignore],.cyp-placeholder')) out.push(n);
      return out;
    }
    async function lint({ step = 0.2 } = {}) {
      const errors = [], warns = [], keep = T, sr = stage.getBoundingClientRect(), sc = sr.width / W;
      const weights = new Set(), seen = new Set(), push = (arr, key, msg) => { if (!seen.has(key)) { seen.add(key); arr.push(msg); } };
      for (let t = 0; t <= DUR + 1e-6; t += step) {
        await seek(t);
        const golds = new Set();
        for (const n of textNodes()) {
          const el = n.parentElement, cs = getComputedStyle(el);
          if (!inActiveScene(el) || effOpacity(el) < 0.6) continue;
          const rg = document.createRange(); rg.selectNodeContents(n);
          const r = rg.getBoundingClientRect(); if (!r.width) continue;
          const box = { x: (r.left - sr.left) / sc, y: (r.top - sr.top) / sc, w: r.width / sc, h: r.height / sc };
          const label = `"${n.nodeValue.trim().slice(0, 24)}"`;
          if (box.x < -2 || box.y < -2 || box.x + box.w > W + 2 || box.y + box.h > H + 2) push(errors, 'off' + label, `off-canvas text ${label} at ${t.toFixed(1)}s`);
          for (const z of zones.hard) if (box.x < z.x + z.w && box.x + box.w > z.x && box.y < z.y + z.h && box.y + box.h > z.y) push(errors, z.n + label, `text in unsafe zone (${z.n}) ${label} at ${t.toFixed(1)}s`);
          for (const z of zones.soft) if (box.x < z.x + z.w && box.x + box.w > z.x && box.y < z.y + z.h && box.y + box.h > z.y) push(warns, z.n + label, `text in caution zone (${z.n}) ${label} at ${t.toFixed(1)}s`);
          if (!/^\s*"?Kanit/i.test(cs.fontFamily)) push(errors, 'font' + label, `font is not Kanit (${cs.fontFamily}) ${label}`);
          weights.add(cs.fontWeight);
          const px = parseFloat(cs.fontSize);
          if (px < MIN_PX && !el.closest('[data-lint-small]')) push(warns, 'small' + label, `text ${px}px < ${MIN_PX}px is hard to read on phones ${label}`);
          // gold = ONE key word: group chunks by their gold/highlight ancestor
          if (cs.color === GOLD || el.closest('.cyp-highlight')) golds.add(el.closest('.cyp-gold, .cyp-highlight, [data-gold]') || el);
          // brand name: ชัยพฤกษ์ navy + อโกรเทค red (logo artwork is exempt via [data-logo])
          const v = n.nodeValue, block = el.closest('p, h1, h2, h3, div, li, figure') || el;
          if (!el.closest('[data-logo]')) {
            if (v.includes('ชัยพฤกษ์') && v.includes('อโกรเทค')) push(warns, 'one' + label, `brand name in ONE colour ${label} — wrap as <span class="cyp-brandname"><span>ชัยพฤกษ์</span> <span>อโกรเทค</span></span>`);
            else if (v.includes('อโกรเทค') && cs.color !== RED) push(warns, 'agro' + label, `"อโกรเทค" should be red (got ${cs.color}) ${label}`);
            else if (v.includes('ชัยพฤกษ์') && block.textContent.includes('อโกรเทค') && cs.color !== NAVY) push(warns, 'chai' + label, `"ชัยพฤกษ์" beside อโกรเทค should be navy (got ${cs.color}) ${label}`);
          }
        }
        if (golds.size > 1) push(warns, 'gold@' + Math.round(t), `${golds.size} gold highlights visible at ${t.toFixed(1)}s — gold is for the ONE key word`);
      }
      if (weights.size > 2) warns.push(`font weights used: ${[...weights].join(', ')} — CI allows max 2 per piece`);
      // unfilled template slots: fine for drafts, must be zero before publishing (qa-checklist)
      const holes = [...new Set([...(stage.textContent.match(/\[\[[^\]]*\]\]/g) || []), ...[...stage.querySelectorAll('.cyp-placeholder')].map((e) => `[box] ${e.textContent.trim().slice(0, 40)}`)])];
      if (holes.length) warns.push(`${holes.length} unfilled placeholder(s) — do not publish: ${holes.slice(0, 6).join(' · ')}${holes.length > 6 ? ' …' : ''}`);
      if (!window.CYP_LOGO_SRC && stage.querySelector('.cyp-logo')) warns.push('logo is the PLACEHOLDER drawing — set CYP_LOGO_SRC in motion/assets/brand/logo.js to the official file before publishing');
      for (const r of texts) {
        if (r.el.closest('[data-lint-hold="skip"]')) continue;   // reference info (e.g. NAP on the final end card)
        const key = !!r.el.closest('[data-key]');
        const hold = Math.min(r.outAt, DUR) - r.inEnd, need = Math.max(MIN_HOLD, r.chars / READ_CPS) * (key ? 2 : 1);
        if (hold < need - 1e-3) warns.push(`hold ${hold.toFixed(2)}s < reading time ${need.toFixed(2)}s${key ? ' (key ×2)' : ''} for "${r.el.textContent.trim().slice(0, 30)}" (${r.chars} chars @ ${READ_CPS}/s)`);
      }
      if (maxEnd > DUR + 1e-3) warns.push(`animations end at ${maxEnd.toFixed(2)}s but data-duration is ${DUR}s`);
      await seek(keep);
      return { errors, warnings: warns, weights: [...weights], duration: DUR, size: `${W}x${H}`, fps: FPS };
    }

    /* ---------- finish: register for renderer, build preview ---------- */
    function done() {
      stage.querySelectorAll('video[data-at]').forEach((v) => { v.muted = true; v.pause(); videos.push({ el: v, at: +v.dataset.at, trim: +(v.dataset.trim || 0) }); });
      // logo slots: official file if motion/assets/brand/logo.js sets CYP_LOGO_SRC, else the placeholder SVG
      stage.querySelectorAll('.cyp-logo').forEach((el, i) => {
        if (el.children.length) return;
        el.setAttribute('data-logo', '');
        if (window.CYP_LOGO_SRC) el.innerHTML = `<img alt="ชัยพฤกษ์ อโกรเทค" src="${new URL(window.CYP_LOGO_SRC, window.CYP_LOGO_BASE).href}">`;
        else if (window.CYP_LOGO_SVG) el.innerHTML = window.CYP_LOGO_SVG.replace(/(id="|#)(inner|arc)\b/g, `$1$2-${i}`);
        else console.warn('cyp-motion: load motion/assets/brand/logo.js to fill .cyp-logo');
      });
      const ready = (async () => {
        await document.fonts.ready;
        await Promise.all([400, 500, 700, 800].map((w) => document.fonts.load(`${w} 48px Kanit`, 'กขคชัยพฤกษ์')));
        await Promise.all([...stage.querySelectorAll('img')].map((i) => (i.decode ? i.decode().catch(() => {}) : null)));
        await seek(0);
      })();
      window.__CYP = { width: W, height: H, fps: FPS, duration: DUR, mode: MODE, seek, lint, ready, cues, audio };
      if (!RENDER) ready.then(() => preview());
      return M;
    }

    /* ---------- preview player (browser only) ---------- */
    function preview() {
      const vp = document.createElement('div'); vp.className = 'cyp-viewport';
      stage.parentNode.insertBefore(vp, stage); vp.append(stage);
      const g = document.createElement('div'); g.className = 'cyp-guides';
      for (const [cls, list] of [['', zones.hard], ['soft', zones.soft]]) for (const z of list) {
        const d = document.createElement('div'); d.className = 'zone ' + cls;
        Object.assign(d.style, { left: z.x + 'px', top: z.y + 'px', width: z.w + 'px', height: z.h + 'px' });
        d.innerHTML = `<span>${z.n}</span>`; g.append(d);
      }
      stage.append(g);
      const bar = document.createElement('div'); bar.className = 'cyp-player';
      bar.innerHTML = `<button data-k="play">▶︎ Play</button><input type="range" min="0" max="${DUR}" step="${1 / FPS}" value="0"><span class="cyp-time"></span><button data-k="guides">Safe zones (G)</button><button data-k="lint">Check</button>`;
      document.body.append(bar);
      const range = bar.querySelector('input'), time = bar.querySelector('.cyp-time'), play = bar.querySelector('[data-k=play]');
      const els = audio.map((a) => Object.assign(new Audio(a.src), { volume: Math.min(1, a.volume) }));
      let playing = false, t0 = 0, from = 0;
      const fit = () => { const s = Math.min(innerWidth / W, (innerHeight - 52) / H); stage.style.transform = `scale(${s})`; vp.style.width = W * s + 'px'; vp.style.height = H * s + 'px'; };
      const show = () => { range.value = T; time.textContent = `${T.toFixed(2)}s / ${DUR}s · f${Math.round(T * FPS)}`; };
      const syncAudio = () => els.forEach((e, i) => { const lt = T - audio[i].at; if (playing && lt >= 0) { e.currentTime = lt; e.play().catch(() => {}); } else e.pause(); });
      const toggle = () => { playing = !playing; play.textContent = playing ? '❚❚ Pause' : '▶︎ Play'; if (playing) { if (T >= DUR - 1e-3) seek(0); t0 = performance.now(); from = T; } syncAudio(); };
      const frame = (now) => { if (playing) { let t = from + (now - t0) / 1000; if (t >= DUR) { t = 0; from = 0; t0 = now; syncAudio(); } seek(t); show(); } requestAnimationFrame(frame); };
      play.onclick = toggle;
      range.oninput = () => { seek(+range.value); show(); if (playing) { from = T; t0 = performance.now(); syncAudio(); } };
      bar.querySelector('[data-k=guides]').onclick = () => g.classList.toggle('on');
      bar.querySelector('[data-k=lint]').onclick = async () => { const r = await lint(); console.log('[cyp-motion lint]', r); alert(`errors: ${r.errors.length}\nwarnings: ${r.warnings.length}\n\n` + [...r.errors, ...r.warnings].slice(0, 12).join('\n')); };
      addEventListener('keydown', (e) => {
        if (e.code === 'Space') { e.preventDefault(); toggle(); }
        if (e.key === 'g' || e.key === 'G') g.classList.toggle('on');
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { seek(T + (e.key === 'ArrowRight' ? 1 : -1) * (e.shiftKey ? 1 : 1 / FPS)); show(); }
        if (e.key === 'Home') { seek(0); show(); }
      });
      addEventListener('resize', fit); fit(); show(); requestAnimationFrame(frame);
    }

    return M;
  }

  window.CYP = { motion, split, segment, words, GLOSSARY, EASE, cubicBezier, IN: Object.keys(IN), OUT: Object.keys(OUT), LOOP: Object.keys(LOOP) };
})();
