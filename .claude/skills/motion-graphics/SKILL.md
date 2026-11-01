---
name: motion-graphics
description: Plan, script, storyboard, build and render on-brand motion video for ชัยพฤกษ์ อโกรเทค (Chaiyapreuk Agrotech) — kinetic typography, motion graphics (promo / product / event / heritage) and explainer animations for Facebook Reels, TikTok, FB feed and LINE OA, rendered to MP4 with the repo's motion kit. Use this skill whenever the user asks for anything that moves - a reel, clip, video, animation, animated post, explainer, kinetic text, motion graphic, intro/outro, end card, storyboard or video script - or Thai requests like ทำคลิป, ทำวิดีโอ, คลิปสั้น, รีลส์, ติ๊กต็อก, โมชั่นกราฟิก, แอนิเมชัน, ตัวหนังสือวิ่ง, คลิปอธิบาย, even if they only ask for the script or storyboard (the skill also produces briefs for CapCut / After Effects). Also use it to review or fix an existing motion piece against the CI.
---

# Motion Graphics — ชัยพฤกษ์ อโกรเทค

Turn a marketing idea into a short, on-brand, **legible-in-Thai** video: brief → script → storyboard → HTML composition → MP4 (+ poster + contact sheet), checked against the CI, Thai typography rules, platform safe zones and Thai ad law.

The "why" behind every rule (with sources) lives in `motion/research/` — read the relevant file when a rule seems odd or a case isn't covered. The repo kit does the heavy lifting: `motion/kit/` (animation runtime + brand components + automatic lint) and `motion/render/render.mjs` (frame-accurate MP4).

## Non-negotiables (and why)

1. **Facts only from real sources.** Product names, active ingredients, rates, timings, prices → label / catalogue / `.claude/CLAUDE.md` only. Missing → `[[PLACEHOLDER: …]]` and tell the user. Wrong agronomic info hurts farmers and the 50-year trust that is the brand's whole edge.
2. **Thai ad law & safety.** No "ปลอดภัย/ไม่มีพิษ/ไม่มีสารตกค้าง", no unprovable superlatives or guarantees, PPE in every chemical-handling visual, never show banned (type-4) substances, pesticide pieces end with the label warning. Full checklist: `motion/research/04-compliance-audio-voice.md` → *Guardrail checklist*. Retailers' own posts are covered by the Hazardous Substance Act ad rules and DOA actively takes down online sellers.
3. **CI in motion** (`design.md` is the source of truth — read it): green dominant on every frame (never dark/black, never dip to black or flash white) · Kanit only, max 2 weights per piece · brand name split **ชัยพฤกษ์ navy + อโกรเทค red** (both navy only inside the logo mark) · gold on ONE key word · red = CTA/urgency · rounded shapes · logo top-centre early, never stretched/rotated/recoloured · NAP on the end card exactly as in CLAUDE.md.
4. **Legible Thai.** Text inside the safe box, ≥ 40 px, held ≥ max(1.5 s, code points ÷ 13) after it settles (key claim & CTA 2×), nothing moving while it must be read, phrases chunked by hand with `|`. Older farmers on phones are the audience.
5. **One message, one CTA per video.** Hook (problem/product + message) in the first 3 s.
6. **Licensed or self-made audio only.** Never popular songs. The renderer's synthesized SFX are licence-free.

## Workflow

### 1. Brief — get these (propose defaults instead of interrogating)
| Field | Default if unstated |
|---|---|
| Objective + KPI (awareness / engagement / LINE adds / store visits) | engagement + LINE adds; say KPI targets are placeholders until confirmed |
| Channel(s) → canvas | FB Reels + TikTok → **1080×1920 master**; add 1080×1350 (FB feed) / 1080×1080 (LINE) cut-downs on request |
| Format | pick with the table in step 2 |
| The one message (one Thai sentence) + audience situation | ask — this is the one thing you can't default |
| Fact sources | CLAUDE.md, catalogue, label photos — list them |
| Assets | official logo (placeholder until supplied), real photos/footage, product pack shots |
| Voice-over | none (kinetic type carries meaning); recommend VO for explainers |
| Length | KT 15–25 s · MG 10–20 s · explainer 45–90 s |

Write it to `motion/videos/<yyyy-mm-dd>-<slug>/brief.md` (template: `assets/brief-template.md`).

### 2. Choose format + energy mode
| If the content is… | Format | Mode |
|---|---|---|
| A punchy message, tip, slogan, quote, USP, "did you know" | **Kinetic typography** → `references/kinetic-typography.md` | advise (calm) · celebrate for hype lines |
| Promotion, giveaway, event, new arrival, product spotlight, numbers/heritage | **Motion graphic** → `references/motion-graphic.md` | celebrate (promo/event) · advise (product/heritage) |
| How/why something works, symptoms → cause → steps, how to order | **Explainer** → `references/explainer.md` | advise |

Modes map to CI content types: Promotion/Event = **celebrate** (pop on shapes, sunburst, sparkles, quicker stagger); Expert/Knowledge, Product, Testimonial = **advise** (Carbon-style productive easing, no bounce on text, slower stagger). See `references/brand-motion-ci.md`.

### 3. Script (Thai, brand voice)
- Voice: เป็นกันเอง จริงใจ ภาษาชาวสวน ไม่ขายแรง. Address the viewer as "คุณ"/"พี่ ๆ ชาวสวน" per the copy rules in `.claude/skills/ci-brand-check.md` Part 2.
- Budget time per line: on-screen text ≥ max(1.5 s, code points ÷ 13); VO ≈ 3.5–4.2 syllables/s for older farmers.
- On-screen text = keywords, ≤ 2 lines, ≤ ~15 chars per line at hero size (chars/line ≈ 1516 ÷ font-px).
- Run the compliance checklist on the script **before** building. Mark every fact with its source.

### 4. Storyboard
A scene table — time · visual · on-screen text (with `|` chunk breaks) · motion preset · SFX · VO. Use `assets/storyboard-template.md`. For a CapCut/AE/Canva brief, stop here and deliver the storyboard + motion spec (presets → durations/easings from `references/brand-motion-ci.md`).

### 5. Build the composition
- Copy a starter folder into `motion/videos/<yyyy-mm-dd>-<slug>/` (same depth → paths keep working): kinetic typography → `motion/videos/2026-11-ask-first/` (finished reference piece) · promo/motion graphic → `motion/templates/promo-916/` · explainer → `motion/templates/explainer-916/`. Replace every `[[…]]` (lint lists the ones left).
- Use kit classes/components and presets — API in `references/kit-api.md`. Don't hand-roll keyframes for things the kit has (masks, splits, counters, SFX landing are Thai-safe and timed for you).
- Everything visible must be a function of time (no `Date.now`, `Math.random`, timers, network).

### 6. Check, look, fix (loop until clean)
```bash
node motion/render/render.mjs motion/videos/<slug>/index.html --sheet 12
```
- Fix **every lint error**; fix or consciously justify each warning (safe zone, hold time, weights, gold count, brand-name colours, font size).
- **Open the contact sheet PNG and look at it** (Read tool): clipping, overlaps, hierarchy, green dominance, the poster frame at 1 s, end card. Lint can't see taste.

### 7. Render + QA + deliver
```bash
node motion/render/render.mjs motion/videos/<slug>/index.html            # → motion/out/<slug>.mp4 + -poster.jpg
```
Run `references/qa-checklist.md`. Deliver: MP4 + poster path, a caption (Thai, brand voice, hashtags per channel), channel/format, KPI to watch, anything placeholder or needing approval (official logo, facts, music licence). Send the MP4 to the user with SendUserFile when available.

## Output to the user (every time)
1. What you made (format, mode, length, channel) + file paths.
2. Facts used → their sources; placeholders still open.
3. Lint/QA result (errors fixed, warnings accepted and why).
4. Suggested caption + posting time + KPI to track.

## When reviewing an existing piece
Check against `references/qa-checklist.md`, report like `ci-brand-check` (CRITICAL / WARNING → found → fix), then offer to fix and re-render.
