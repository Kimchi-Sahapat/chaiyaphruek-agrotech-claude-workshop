# Motion graphic playbook (promo · product · event · heritage)

Why: `motion/research/02-motion-graphics.md`. Starter: `motion/templates/promo-916/` (celebrate mode).

## Patterns

**Promotion / giveaway (celebrate, 10–20 s)**
```
0–1 s    sunburst blooms, header pill, the offer's hero word punches in (gold)
1–3 s    prize/product floats in (real pack shot, .cyp-float), red stamp badge "สุดพิเศษ!!"
3–8 s    conditions as a short list: numbered red circles pop, ribbon with the dates unfurls
8–10 s   one proof/assurance line (e.g. "ปรึกษาฟรี ไม่รู้ชื่อสินค้าก็ถามได้")
last 5 s end card — ONE CTA
```
Rules: dates, prices, conditions shown **as text** and legible (≥ 2× hold for price/date `[data-key]`); prices/discounts must be real and complete (period, products, conditions); lucky draws need a permit and must never be tied to buying agrochemicals (research/04 E1–E3).

**Product spotlight (advise, 10–15 s)** — real pack shot floats in → name (from label) → 2–3 *label-sourced* facts as chips → "เหมาะกับระยะ…" only if the label says so → end card. No efficacy claims beyond the label; no "ดีที่สุด". For Lucky Group / Black Panther: same formula → never compare them.

**Event / festival (celebrate)** — mascot (when the asset exists) + date/time big on a red ribbon + numbered activity circles + vendor-logo grid ("จากกว่า 25 บริษัทชั้นนำ" framing) + map/location line + end card.

**Heritage / trust (advise)** — counter (2515 → ปัจจุบัน, "50+ ปี"), milestone timeline (facts only from CLAUDE.md / briefs/company-history.md), real family/shop photos, mask reveals, slow pushes.

## Choreography (each beat)
1. **Lead** element arrives first (hero word or product), others follow 2–3 frames apart, the **payoff lands last** (gold word, price, CTA).
2. Entrance ease-out → **settle** → hold → exit ease-in ~25% faster. Exits can overlap the next entrance by ≤ 150 ms.
3. Anticipation for big moves (a tiny opposite motion first) and follow-through (a child settles 2–3 frames after its parent) — use `anim()` with custom keyframes when a preset isn't enough.
4. Squash/stretch only on circles/badges, never on type or the logo.
5. One motion vocabulary per video; 1–2 transition types.

## Transitions
| Need | Use |
|---|---|
| chapter change, calm | `M.cut(t, 'panel')` — cream panel wipe |
| into end card / celebrate | `M.cut(t, 'burst')` — light-green sunburst iris |
| steps 1→2→3 | shared axis: next card `slide-r` in, previous `out('…','fade')` |
| element continuity | keep the same element on screen across scenes (match cut) |
| unrelated content | hard cut on a beat, or dip to lime |
Never: dip to black, white flash frames, full-frame red, more than 1–2 zoom-throughs/whips.

## Product imagery
- Real pack shots (PNG with transparent background) in `motion/videos/<slug>/assets/`. Keep labels legible and **never crop/blur hazard symbols or warnings**.
- Float: animate entrance on the wrapper, `loop('float')` on the inner `<img>` (loops add on top of entrances).
- Shadow: `.cyp-float` (navy-tinted, matches `--cyp-shadow-float`).

## Celebrate-mode safety
Sunburst stays slow and low-contrast; sparkles ≤ 3 at once; no strobing; total big luma jumps ≤ 3 per second (renderer flash screen reports it).
