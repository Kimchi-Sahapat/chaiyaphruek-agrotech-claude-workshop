# Brand motion CI — design.md translated into motion

Source of truth for static CI: `design.md` (+ tokens in `design-system/`). This file adds the **time** dimension. Items marked **[proposal]** are our motion adaptations of static rules — confirm with the brand owner before treating them as final.

## 1. Personality → two energy modes

Brand personality: warm, energetic, generous, trustworthy — "a celebration the farmer is invited to". Trust must never be sacrificed for energy, so energy is a *mode*, chosen by content type (idea from IBM Carbon's productive/expressive split).

| | **advise** (default) | **celebrate** |
|---|---|---|
| CI content types | Expert/Knowledge ("หมอทุเรียน"), Product/Brands, Testimonial, explainers | Promotion/Giveaway, Event/Festival, CTA moments, end cards |
| Text easing | `info` = Carbon productive entrance `cubic-bezier(0,0,0.38,0.9)` | `enter` = M3 emphasized-decelerate `cubic-bezier(0.05,0.7,0.1,1)` |
| Overshoot (`pop`) | shapes only (number circles, CTA) | shapes, badges, ribbons, stickers — **never text** |
| Stagger | 0.10 s (3 f) | 0.07 s (2 f) |
| Background | calm green glow (`.cyp-bg-calm`), real photo + dark-green panel | sunburst rays (`.cyp-sunburst` + slow `spin`), sparkles |
| Pace | new visual event every 2–4 s; long holds | every 1–2 s in the hook |
| SFX | soft: tick, ding (gold word), pop on circles | pop, swish/whoosh on cuts, ding on the prize/price |

Set on the stage: `<main id="stage" data-mode="advise|celebrate">`. Override per call with `{ ease }`.

## 2. Motion tokens

| Token | Value | Use |
|---|---|---|
| `enter` | `cubic-bezier(0.05,0.7,0.1,1)` | arrivals (celebrate text, shapes) |
| `info` | `cubic-bezier(0,0,0.38,0.9)` | calm text arrivals (advise) |
| `exit` | `cubic-bezier(0.3,0,0.8,0.15)` | leaving — ~25% faster than the entrance |
| `move` | `cubic-bezier(0.2,0,0,1)` | on-screen moves, wipes, panels |
| `pop` | `cubic-bezier(0.34,1.56,0.64,1)` | overshoot — shapes only |
| `loop` | `cubic-bezier(0.37,0,0.63,1)` | float, pulse, sway |
| `linear` | — | sunburst drift only (≤ 6°/s; kit default 4°/s) |
| durations | 0.1 / 0.2 / 0.4 / 0.7 / 1.0 s (3/6/12/21/30 f @30fps) | snap / quick / base / slow / hero |

CSS mirrors: `--cyp-ease-*` in `design-system/tokens.css`.

## 3. Signature moves (kit presets)

| Move | Preset | Spec | Use |
|---|---|---|---|
| Sunburst bloom + drift | `in('fade')` + `loop('spin')` | light-green rays on green, opacity ≤ .55, 90 s/rev | celebrate scenes, end card |
| Gold-word highlight | `in('highlight')` on `.cyp-highlight` | gold bar sweeps behind ONE navy word, 0.45 s, `ding` | the key benefit / answer |
| Number pop | `in('pop', {sfx:'pop'})` on `.cyp-num` | red circle, white number, 0.32 s overshoot; text follows calmly | steps, activity lists |
| Badge stamp | `in('stamp')` | −8°→0°, 1.2→1, 0.25 s | "สุดพิเศษ!!", dates, prices (celebrate) |
| Ribbon unfurl | `in('unfurl')` on `.cyp-ribbon` | red notched ribbon opens from centre, white text | dates, event names |
| Punch | `in('punch')` | 1.6→1 scale, 0.38 s | one hero word per scene |
| Mask rise | `in('mask-rise', {split:'chunk'})` | phrase rises through a Thai-safe mask | calm headlines, heritage |
| Product float | `in('rise')` then `loop('float')` on a child | idle ±16 px, ±1.5°, `.cyp-float` shadow | product / prize hero |
| Counter | `count()` | ease-out 0.6–1.2 s, tabular figures | 50+ ปี, 2515, prices |
| Ground motif | `.cyp-ground` + `in('wipe-up')` | logo's land/mound idea as bottom hills | anchors 9:16 bottoms (decor zone) |

## 4. Layout in time

**9:16 (1080×1920) — FB Reels / TikTok master**
- Text-safe box **x 120–960, y 270–1250** (`.cyp-safe-916` adds 10 px air). Bottom 670 px and top 270 px are covered by platform UI/captions/ad CTA → decoration and imagery only.
- **Header strip [proposal]:** white pill (logo + split brand name) top-centre at y ≈ 284, enters within the first second, leaves before the end card. (Static CI: header strip always present + logo top-left/top-centre.)
- **End card (≥ 3 s, 5 s recommended) [proposal]:** sunburst, big logo, split brand name, tagline "นึกถึงปุ๋ยยา นึกถึงเครือชัยพฤกษ์", **ONE CTA** (red pill, e.g. "ทักไลน์ @cyp-agro"), one helper line, NAP panel (phones `039-443-372 | 092-656-2944`, location/hours). Replaces the static footer, which would sit under the platform UI on 9:16.
- Poster frame **t = 1.0 s** (LINE auto-thumbnail) must already read as the hook.

**4:5 (1080×1350) FB feed · 1:1 (1080×1080 / 1040×1040) LINE** — keep the static post anatomy: header strip top, hero 60–70%, **persistent footer strip** (`.cyp-footer`, forest green) with phones + FB + LINE; 54–60 px edge margin.

## 5. Colour & type in motion
- Every frame is green-dominant; transitions dip to **lime/cream**, never black or white flashes. Full-frame red is forbidden (saturated-red flash risk).
- The brand name keeps its split colours on **every** frame of its animation (never tween through a single colour).
- At most one gold element visible at a time (lint warns at 2+).
- Kanit, two weights per piece (lint warns at 3+): e.g. 800 hero + 700 everything else (bold reads best for older viewers on phones) or 800 + 400.
- White outline on big navy/red text: `.cyp-stroke` (0.12em, `paint-order: stroke fill`).
- **[proposal]** Multi-line Thai headlines: line-height 1.25–1.3 (CI says 1.1–1.2; Kanit's stacked marks collide below ~1.25 — research/01 §4c). Single lines keep 1.15–1.2.

## 6. Logo in motion
Uniform scale + opacity reveal only (`zoom`/`fade`) — never stretch, rotate, recolour, or animate its parts **[proposal: no logo "build" animation without approval]**. Clear space = mark height. The repo's `assets/brand/logo.js` holds a **placeholder** drawing; set `CYP_LOGO_SRC` to the official file before publishing.

## 7. Mascot, photos, decor
- Mascot (green wide-brim hat): events/festivals/friendly announcements only — never expert/serious/negative content. No asset yet.
- Photos: real farmers, real Chanthaburi orchards, warm light, green uniforms; no stock, no foreign crops, no text over faces.
- Sparkles/stars: celebrate mode only, 2–3 at a time, `twinkle` loop.

## 8. Sound identity
Short, soft, synthesized (licence-free): `pop` (circles, badges, CTA), `ding` (gold word, logo), `tick` (counters), `swish`/`whoosh` (cuts), `thud` (heavy stamp, sparingly). Transient lands on the motion's landing frame (kit does this with `{sfx}`), never > 1 frame early. Under narration: no music bed or only very low; mix −14 LUFS.
