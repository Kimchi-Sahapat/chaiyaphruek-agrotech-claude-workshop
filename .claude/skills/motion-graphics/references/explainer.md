# Explainer playbook

Why: `motion/research/03-explainer-animation.md` (Mayer's principles, Digital Green / Access Agriculture / SAWBO evidence). Starter: `motion/templates/explainer-916/`.

## Spine (mirrors how the shop sells: crop → stage → symptom first)
```
1 HOOK      อาการที่ชาวสวนเห็นจริง (real photo) + question            0–3 s
2 WHY       what causes it — the mechanism, simply                     (pre-train key names first)
3 WHAT      ≤ 5 steps, numbered 1/3, 2/3…, one step per beat
4 WHEN      growth stage / month (farmers' own stage words)
5 PROOF     a real orchard (photo/footage), dated
6 RECAP     static card repeating the must-dos (lint: key ×2 hold)
7 CTA       "ส่งรูปมาถามทางไลน์ @cyp-agro" + end card (NAP)
   + pesticide topics: warning line "อ่านฉลากก่อนใช้ทุกครั้ง · ใช้ตามอัตราที่ฉลากระบุ · สวมอุปกรณ์ป้องกันขณะผสมและฉีดพ่น"
```
Length: 45–90 s for Reels/TikTok (one practice); 2–6 min for YouTube/website (a series of short segments is better than one long video).

## Script template
| # | VO (Thai, conversational) | On-screen keywords (≤ 35 chars/line, ≤ 2 lines) | Visual | Source of fact |
|---|---|---|---|---|
| 1 | "พี่ ๆ เคยเจอ [[อาการ — คัดจากแหล่งข้อมูล]] แบบนี้ไหมครับ? เกิดจากอะไร มาดูกัน" | [[อาการ]] แบบนี้… เกิดจากอะไร? | real photo of the symptom, ring highlight | [[PLACEHOLDER: ภาพจริง + แหล่งข้อมูล DOA/ฉลาก]] |

(Example rows stay as placeholders on purpose — never invent symptoms, causes or advice; fill them from the cited source.)
VO pace ≈ 3.5–4.2 syllables/s with pauses between steps — time a real read-aloud and write the cue sheet (start time of each phrase). Budget Thai scripts in **seconds/syllables, not words**.

## Mayer → practice
- **Coherence:** no music bed or decorative icons under the explanation; delete what doesn't teach.
- **Signaling:** arrow / ring / zoom on ONE thing at a time; "1/3" counters; gold for the one key word.
- **Redundancy vs sound-off:** VO carries the explanation; on-screen = keywords only (not a transcript) — burnt in so it works muted.
- **Spatial contiguity:** put the label *on* the root, not in a legend.
- **Temporal contiguity:** animation cue = VO timestamp of that phrase (cue sheet → `at` times).
- **Segmenting & pre-training:** chapter cards; teach names (ไฟทอปธอร่า, ระยะใบเพสลาด) before using them.
- **Personalization & voice:** "พี่ ๆ ชาวสวน", a real staff/farmer voice beats TTS (pre-test any TTS).

## Visual style: photo-real hybrid (default)
- Base layer: **real Chanthaburi photos/footage** (`.cyp-photo` + `.cyp-photo-scrim`), product packs, hands doing the work.
- Overlay: flat diagram elements — arrows, rings, labels, root-zone cut-away, stage timeline — in **white or gold** (green lines vanish on foliage); panels `.cyp-panel-dark` (semi-transparent forest green) or cream.
- Schematic drawings only for the invisible (inside the root, spores, water movement). No clip-art farmers, no stock people.
- Missing photos → `.cyp-placeholder` boxes describing the needed shot; list them for the content team.

## Visualising processes & data
- Animate only what changes; one change at a time; end on a static summary.
- Steps: same framing, numbered, hands doing it, recap card.
- Life cycle: ring with "you are here" marker tied to month/rain.
- Before/after: same framing and light, dates labelled.
- Charts: ≤ 4 bars, start at zero, direct labels, no 3D, no area-scaled icons.
- Never red-vs-green alone for healthy/diseased — add icons/labels.

## Accuracy gate (before building)
Every claim, rate, timing, stage order and pest/disease fact → label, DOA, or a named source. If not sourced: placeholder + tell the user. Rates appear as on-screen text copied from the label (never only in VO). Pair animation with real demonstration footage when the practice is new to farmers (SAWBO trial: live demos beat animation for new practices).

## Pre-test (content team)
Show the draft to 3–5 farmers on a mid-range phone: can they retell the steps? Can they read every caption? Fix and re-render.
