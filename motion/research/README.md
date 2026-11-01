# Motion research pack — ชัยพฤกษ์ อโกรเทค

What "good" looks like for **kinetic typography**, **motion graphics** and **explainer animation** — distilled into rules the `motion-graphics` skill and the motion kit enforce.

| # | File | Answers |
|---|---|---|
| 01 | [Kinetic typography](01-kinetic-typography.md) | principles, technique catalogue, reading-time numbers, **Thai script in motion** (segmentation, tone-mark clipping, stroke, looped vs loopless) |
| 02 | [Motion graphics](02-motion-graphics.md) | animation principles, design-system motion tokens (Material 3, Carbon, Fluent, Polaris) → **our tokens**, platform specs & safe zones, hooks, audio, flash/vestibular safety, transitions |
| 03 | [Explainer animation](03-explainer-animation.md) | structure & scripting, Mayer's 12 principles, **evidence from farmer video programmes** (Digital Green, Access Agriculture, SAWBO), Thai agri landscape, style choice |
| 04 | [Compliance, music & voice](04-compliance-audio-voice.md) | Thai ad law for agrochemicals/fertilizers/consumer protection, banned substances, music licensing, Thai TTS — **guardrail checklist** |
| 05 | [Tooling decision](05-tooling-decision.md) | Remotion vs HyperFrames vs GSAP vs own kit; what we verified |

## The 12 rules that matter most

1. **One message per video**; hook (problem/product + message) in the first 3 s.
2. **Green dominant from frame 1**, small logo pill early, big logo + ONE CTA + NAP on the end card.
3. **Text only inside the safe box** (9:16: x 120–960, y 270–1250), **≥ 40–43 px**.
4. **Hold text ≥ max(1.5 s, Thai code points ÷ 13)** after it settles; key claim & CTA 2×.
5. **Nothing moves while it must be read.** Enter (ease-out) → settle → hold → exit (faster, ease-in).
6. **Gold = one key word per scene. Red = CTA/urgency only. Navy = headlines.**
7. **Two energy modes:** *advise* (calm, no bounce on text) for knowledge/product; *celebrate* (pops, sunburst, sparkles) for promos/events.
8. **Thai:** chunk by phrase with `|`; never split per code point; masks need ≥ 0.3em margin and ≥ 150% start; outline with `paint-order: stroke fill`.
9. **Explainers:** symptom → why → ≤ 5 steps → when → proof → CTA; real local photos + flat overlays; VO carries the explanation; keyword captions.
10. **Sound-on design that survives sound-off**; −14 LUFS; SFX on the landing frame; licensed or self-made audio only.
11. **Safety:** ≤ 3 flashes/s, no full-frame red flashes, no dips to black/white, few zooms/whips.
12. **Compliance:** product facts only from the label/catalogue; no safety/superlative/guarantee claims; PPE in every chemical scene; pesticide end-card warning.

## Method & confidence
Four parallel research passes (Nov 2026) plus hands-on tests in this repo's renderer. The session proxy blocked several primary sites (vendor docs, Meta/TikTok help, Thai Royal Gazette) and the shared web-search budget ran out, so some figures come from search-engine extracts of official pages; each file lists what is **not verified**. Numbers marked as our own judgement are starting points — measure real performance (retention at 3 s, completion rate, LINE adds) and tune.
