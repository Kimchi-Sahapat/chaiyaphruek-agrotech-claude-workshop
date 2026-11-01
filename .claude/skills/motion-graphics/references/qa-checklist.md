# QA checklist — before anything leaves the building

Run after `render.mjs` passes lint. Report like `ci-brand-check`: **[CRITICAL]** / **[WARNING]** → found → fix.

## Facts & compliance (CRITICAL)
- [ ] Every product name / active ingredient / formula / rate / timing / price traced to label, catalogue or CLAUDE.md — list sources; open placeholders called out to the user
- [ ] No ปลอดภัย / ไม่มีพิษ / ไม่มีสารตกค้าง / ปลอดสาร, no guarantees (หายขาด, 100%), no unprovable superlatives (ดีที่สุด, อันดับ 1, ถูกที่สุด)
- [ ] No type-4 / banned / unregistered products; glyphosate only per label
- [ ] Chemical-handling visuals: full PPE; no children/food/water/animals nearby; label warnings not cropped
- [ ] Pesticide topics end with "อ่านฉลากก่อนใช้ทุกครั้ง · ใช้ตามอัตราที่ฉลากระบุ · สวมอุปกรณ์ป้องกันขณะผสมและฉีดพ่น"
- [ ] Promotions: period, products, conditions on screen; no lucky draw without permit; never "ซื้อเยอะ ฉีดบ่อย"
- [ ] Lucky Group vs Black Panther never compared
- [ ] Music/voice licensed or self-made; licence log updated; AI voice disclosed in caption

## CI (CRITICAL unless noted)
- [ ] Green dominant on every frame; no black/dark frames, no white or red flash frames
- [ ] Brand name split navy/red wherever it appears as text (logo mark exempt)
- [ ] Logo: official file (or flagged placeholder), uniform scale only, top-centre header early, big on end card
- [ ] End card ≥ 3 s with ONE CTA + NAP exactly as CLAUDE.md (9:16) · persistent footer on 1:1 / 4:5
- [ ] Kanit only, ≤ 2 weights (WARNING) · gold on one word at a time (WARNING) · red only for CTA/urgency (WARNING)
- [ ] Rounded badges/panels; mascot only in friendly/event content

## Legibility (WARNING → fix by default)
- [ ] All text inside the safe box at ≥ 40 px; readable on a 6" phone at arm's length
- [ ] Hold ≥ max(1.5 s, code points ÷ 13); key claim + CTA 2×; nothing moves in the reading window
- [ ] No clipped tone marks / vowels (check masks on the contact sheet at mid-animation frames)
- [ ] No orphaned 1–2 character line; breaks only at `|`/spaces
- [ ] Poster frame (t = 1 s) reads as the hook
- [ ] Works muted (all claims on screen) and with sound (SFX on landing frames, no music under explanation)

## Motion quality (WARNING)
- [ ] One lead element per beat, payoff lands last; consistent vocabulary (≤ 5 presets) and ≤ 2 transition types
- [ ] No linear easing except sunburst drift; exits faster than entrances; no bounce on text
- [ ] ≤ 2 zoom-throughs/whips; sunburst slow and low-contrast; renderer flash screen "ok"

## Delivery
- [ ] `motion/out/<slug>.mp4` 1080×1920, 30 fps, H.264 + AAC, ≤ 200 MB (LINE) · `-poster.jpg` for LINE preview
- [ ] Cut-downs if needed (4:5 feed, 1:1 LINE) — re-lint each
- [ ] Caption (Thai, brand voice, one CTA, hashtags per channel, "เสียงบรรยายโดย AI" if TTS) + posting time + KPI to watch
- [ ] Video folder has `brief.md` + `storyboard.md` (facts + sources) for the record
