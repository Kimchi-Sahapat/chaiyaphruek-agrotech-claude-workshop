# Kinetic typography playbook

Why: `motion/research/01-kinetic-typography.md`. Reference build: `motion/videos/2026-11-ask-first/index.html`.

## Shape of a good piece (15–25 s, 9:16)
```
0.0–0.3  frame 1 already green + header pill dropping in
0.2–1.0  HOOK: the viewer's pain / question in their words      (poster frame at 1.0 s must read)
0.6–1.4  ANSWER: one hero word punches in → gold highlight       ← key claim [data-key] (2× hold)
…        BODY: 2–3 beats, one idea each (list / number / reason)
…        PROOF: a fact from CLAUDE.md (50+ ปี, เจ้าของมีสวนจริง…), counter if numeric
last 5 s END CARD: logo · split name · tagline · ONE CTA [data-key] · NAP
```
One idea per card. A card = 1–2 lines, ≤ ~15 Thai chars per line at hero size.

## From script line to animated card
1. Write the line in natural Thai. Cut every word that isn't needed on screen (VO can carry the rest).
2. Mark phrase breaks with `|` → these are the animation chunks and the only places a line may break:
   `ไม่รู้ชื่อ|สินค้า|ใช่ไหม?` · `แล้วค่อย|แนะนำ`. Keep brand/crop/product names whole.
3. Pick the hierarchy: one hero chunk (800, 150–200 px, navy + white stroke or gold), supporting chunks (700, 80–96 px, white).
4. Pick ONE entrance per card from the vocabulary below; exits are quicker and quieter.
5. Budget time: settle + hold ≥ max(1.5 s, code points ÷ 13); `[data-key]` cards 2×. The kit lint computes this.

## Vocabulary (keep it small — 4–5 per piece)
| Beat | Preset | Notes |
|---|---|---|
| Statement | `rise` with `split:'chunk'` | default; stagger is automatic per mode |
| Calm headline / heritage | `mask-rise` → `mask-up` | Thai-safe mask built in |
| The one key word | `punch` + `highlight` (gold bar) | once per scene, `sfx:'pop'` / `'ding'` |
| List | `slide-l` per item + `pop` on `.cyp-num` | 3 items max per card |
| Number | `count()` in a cream panel | red tabular numerals |
| Chat/LINE framing | `type()` | grapheme-safe typewriter, `cps` 12–16 |
| Swap | `out(…,'mask-up')` then `in(…,'mask-rise')` same box | ≥ 1 s per state |

## Semantic motion (use sparingly, it's what makes it memorable)
โต/เพิ่ม → rise or scale up · รากเน่า/ร่วง → sink/drop · ถาม → typewriter · ครบ/พร้อม → pop · เร็ว → quick slide. Never contradict meaning (no bouncy "รากเน่า").

## Thai rules (all enforced or helped by the kit)
- Chunk by phrase with `|` (default `split:'chunk'`). `split:'word'` uses ICU + a glossary and can still be wrong — check it.
- Never split per code point; `split:'grapheme'` only for typewriter/opacity; never rotate/scale single graphemes.
- Masks: use `.cyp-mask` / `mask-*` presets (0.3em padding, 150% start) — don't write `overflow:hidden` on text yourself.
- White outline only via `.cyp-stroke`.
- Write line breaks explicitly (`<span class="cyp-line">`, `<br>`); never `word-break: break-all`.
- Multi-line Thai headline line-height 1.25–1.3 (proposal), single line 1.15–1.2.

## Common failures to look for on the contact sheet
Text still moving in the reading window · two gold words on screen · hook not readable at 1.0 s · text touching the safe-box edge · tone marks clipped in masks · lonely 1–2 character chunk wrapping to its own line · weights > 2 · end card too short or with two CTAs.
