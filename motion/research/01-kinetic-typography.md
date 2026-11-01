# 01 · Kinetic Typography — what "good" looks like (with Thai specifics)

> Part of the motion research pack ([index](README.md)). Researched Nov 2026.
> **[tested]** = reproduced in this repo's render pipeline (headless Chrome 153, Kanit from `motion/kit/fonts`). **[unsourced]** = practitioner convention / our judgement. Others are sourced (links inline).

## TL;DR — rules we adopt

1. **A small, named motion vocabulary**, reused (5–7 behaviours). Variety comes from rhythm and hierarchy, not new effects.
2. **One focal element per beat.** Navy = default headline · **gold = the ONE key word** · red = CTA/urgency only.
3. **Reveal in voice-over order, never ahead of the voice.** Motion should mean something (grow for "โต", sink for "รากเน่า").
4. **Nothing moves while it must be read.** Enter → settle → hold → exit.
5. **Hold after it settles ≥ max(1.5 s, Thai code points ÷ 13)**; key claim & CTA ≥ 2× that. (kit lint enforces)
6. **Chunk Thai by phrase (`|` or spaces), not by machine word-splitting**; never split per code point.
7. **Masks get ≥ 0.3em clip margin and start ≥ 150%** below, or tone marks get clipped / peek in.
8. **White outline = `-webkit-text-stroke` ≤ 0.16em + `paint-order: stroke fill`** — never a centred stroke on Thai.
9. **Text lives in the safe box** (9:16: x 120–960, y 270–1250) at **≥ 40–43 px**.
10. **Burn every claim into the picture** (works muted), but still ship sound (VO/music/SFX).

---

## 1. Principles

- **Small reusable vocabulary.** Lee, Forlizzi & Hudson's *Kinetic Typography Engine* (UIST 2002) builds "a wide range of different expressions" from "a relatively small set of components" ([dblp](https://dblp.uni-trier.de/rec/conf/uist/LeeFH02.html), DOI 10.1145/571985.571997).
- **Motion carries emotion reliably → semantic motion works.** Lee, Jun, Forlizzi & Hudson (DIS 2006): 66 participants rated designers' kinetic examples of 4 emotions consistently ([researchr](https://researchr.org/publication/LeeJFH06)); a Korean replication matched intended emotions ([KoreaScience](https://koreascience.kr/article/JAKO201409864556113.do)); KAIST (2016) varied motion type, speed and dynamics to convey emotion ([KAIST](https://koasas.kaist.ac.kr/handle/10203/219419)).
- **Reveal in the order of the spoken logic.** Lee & Park (2023): moving text helps learning through sequential presentation that tracks the content's logic — not through movement itself — and can hurt comprehension when misused ([DOAJ](https://doaj.org/article/48693bb428c149d9b169427295eed650)).
- **Easing affects comprehension.** Dolić et al. (2024) found the interpolation method significantly affected how well kinetic text conveyed information ([GRID 2024](https://www.grid.uns.ac.rs/symposium/download/2024/89.pdf)) — so easing is not decoration.
- **One focal element per beat**, separated by size, weight and colour ([School of Motion](https://schoolofmotion.com/blog/tiny-typography-decisions-motion-graphics)).
- **Taxonomy:** *motion typography* (rigid text that moves — what we do) vs *fluid typography* (letterforms morph) ([Wikipedia](https://en.wikipedia.org/wiki/Kinetic_typography)).
- **Defaults [unsourced]:** entrances 0.3–0.6 s ease-out, exits 0.2–0.4 s ease-in; stagger 40–100 ms per chunk; one transition grammar per video; outgoing phrase overlaps the next by ≤ 150 ms; at most one slow camera push (scale 1.00→1.04) per shot; no whip pans while text is read; ≤ 1 overshoot "punch" per scene.

## 2. Technique catalogue

| Technique | Use when | Thai note | Kit preset |
|---|---|---|---|
| Phrase/word pop or rise | default for VO-synced statements | unit = phrase chunk, not character | `rise`, `pop` (shapes), `punch` |
| Line mask reveal | calm headlines, heritage/trust beats | clip margin ≥ 0.3em, start ≥ 150% | `mask-rise` / `mask-up` |
| Scale punch / zoom-through | ONE keyword per scene; transitions | gold keyword | `punch`, `zoom` |
| Typewriter | "ask us on LINE" chat framing | per **grapheme**, never per code point | `M.type()` |
| Slide + stagger | lists (ทุเรียน · มังคุด · เงาะ), steps | 3–5 items per card | `slide-l/r` |
| Word swap | rotating examples in a fixed frame | keep frame static; ≥ 1 s per swap | `in`/`out` pairs |
| Highlight / underline sweep | emphasis on text already read | no reflow | `highlight`, `underline` |
| Number counter | 50+ ปี, 2515, prices | tabular figures; ease-out 0.6–1.2 s | `M.count()` |
| 3D flip | before/after | whole words only | custom `anim()` |
| Text on path | decoration only | avoid for Thai reading text | — |
| Text-as-mask over video | 1–2 huge brand words | not for information | custom |

## 3. Reading time

| Standard | Number | Source |
|---|---|---|
| Netflix Thai — line length | **35 chars/line** excluding tone marks & above/below vowels; 1 line preferred; 2 max | [Netflix Thai guide](https://partnerhelp.netflixstudios.com/hc/en-us/articles/220448308-Thai-Timed-Text-Style-Guide) |
| Netflix Thai — reading speed | **adults ≤ 17 cps, children ≤ 13 cps** | same |
| Netflix all languages | min event 5/6 s; max 7 s (third-party summaries) | [Timing](https://backlothelp.netflix.com/hc/en-us/articles/360051554394-Timed-Text-Style-Guide-Subtitle-Timing-Guidelines) |
| Comparison | Korean 12 cps; Simplified Chinese 9 cps | [KO](https://backlothelp.netflix.com/hc/en-us/articles/216001127) |
| Ofcom/BBC | 160–180 wpm; > 200 wpm hard to follow | [BBC R&D](https://www.bbc.co.uk/rd/blog/2015-09-how-fast-should-subtitles-be) |
| On-screen text | hold ≥ time to read it **twice** | [UC Davis](https://marketingtoolbox.ucdavis.edu/departments/video/best-practices/accessibility/text-on-screen) |

**Our rule (kit `lint`):** hold after settling ≥ `max(1.5 s, code points ÷ 13)`; `[data-key]` (key claim, CTA) ≥ 2×; no reading card > 7 s. We use the *children's* rate and count *all* code points (marks included) because our viewers are often older, on phones, reading **moving** text. Worked example: นึกถึงปุ๋ยยา นึกถึงเครือชัยพฤกษ์ = 32 code points → 2.5 s.

**Size [tested]:** Kanit Bold averages ≈ 0.554em per base character → characters per line ≈ **1516 ÷ font-px** on the 840 px safe width (96 px → 15 chars, 128 px → 11, 160 px → 9). Fitting Netflix's 35 chars needs ≈ 43 px → **don't set reading text below ~40–43 px** on a 1080-wide frame.

## 4. Thai script in motion [tested]

### a. Word segmentation — don't trust it on our vocabulary
`Intl.Segmenter('th', {granularity:'word'})` is dictionary-based (ICU). Native words segment well (ทุเรียน|มังคุด|เงาะ…), but **13 of 43 domain phrases failed**:
- **ตาดอก → ตาด|อก** (every time) · ราสีชมพู → ราสี|ชมพู
- transliterations shredded: **อโกรเทค → อ|โก|ร|เทค**, ไฟทอปธอร่า → ไฟ|ทอปธ|อร่า, ไตรโคเดอร์มา → ไตร|โค|เด|อร์|มา, อะบาเมกติน → อะ|บา|เม|ก|ติน
- NPK formulas: 15-15-15 → 15|-|15|-|15
- engines differ by version (ICU4X uses an LSTM model for Thai) → pin Chromium.

**Fix used in the kit:** default `split:'chunk'` = break only on spaces and `|` that *you* write; `split:'word'` protects a **glossary** (brand names, crops, ตาดอก, ไฟทอปธอร่า, NPK pattern…) before segmenting the rest. Extend with `CYP.GLOSSARY.push(...)`.

### b. Grapheme clusters
`granularity:'grapheme'` keeps marks with their base (น้ำ, ที่, ญู, กำ = one cluster); leading vowels are separate clusters (เ|ก่|ง, ไ|ม้). **Splitting per code point (`split('')`, `[...s]`) into inline-blocks breaks mark placement in Chrome** — tone marks collide with upper vowels (ที่), nikhahit (น้ำ), ascenders (ปุ๋ย). Grapheme splitting is safe for opacity / y-offset (typewriter); **don't rotate or scale single graphemes** (the leading vowel flies away from its consonant) — use the phrase as the unit.

### c. Clipping & line-height (em units, measured)

| Font (weight) | Font box ascent / descent | Max ink above / below baseline |
|---|---|---|
| Kanit 800 | 1.10 / 0.39 | **1.056** (ป้ั) / **0.375** (ฎุ) |
| Kanit 700 | 1.10 / 0.40 | **1.094** (น้ำ) / **0.38** (ฏู) |
| Kanit 400 | 1.10 / 0.40 | 1.022 / 0.36 |
| Noto Sans Thai 700 | 1.06 / 0.45 | 1.044 / 0.451 |
| Noto Sans Thai Looped 700 | 1.25 / 0.35 | 1.16 / 0.49 |
| Latin "Ag" in Kanit | — | 0.65 / 0.22 |

- `overflow:hidden` masks at line-height 1.0–1.2 **clip Kanit tone marks and the tail of ฏู**; three fixes work: line-height ≥ 1.5 inside the mask · padding ≈ 0.25–0.3em with matching negative margin (**kit default, cross-browser**) · `overflow-clip-margin: .3em` (Chrome/Firefox only).
- Start mask reveals at **≥ 150%** (kit default) — at 118% the stacked marks peek into the mask on frame 1.
- Unmasked multi-line Thai: worst-case ink span 1.47em → **line-height 1.5 guarantees no collisions; 1.25–1.35 is fine with a visual check.** ⚠️ CI says 1.1–1.2 for headlines — fine for *one* line; for 2+ line Thai headlines we propose 1.25–1.3 (to confirm with the brand owner).

### d. Line breaking
`word-break: normal` breaks on (imperfect) dictionary boundaries; **`break-all` / `line-break: anywhere` break inside words** (ถา|มได้, ทุเรี|ยน) — never use them. Write line breaks explicitly per phrase (`<span class="cyp-line">` or `<br>`), keep glossary terms `nowrap` (the kit's `.c` chunks are `nowrap`).

### e. White outline
Centred `-webkit-text-stroke` on Thai **erases tone marks and fills counters**. `paint-order: stroke fill` fixes it on HTML text (Chrome 153). Keep stroke ≤ 0.16em (kit: 0.12em).

### f. Looped vs loopless legibility
- Typotheque × Chulalongkorn (Héctor Mangas et al., 180+ readers, 3 experiments): looped read more easily at distance; small advantage in continuous reading; **older readers decoded looped better**, younger did better with loopless ([Typotheque](https://www.typotheque.com/research/effects-of-loops-in-thai)). Conflicting ATypI abstract: loops did not affect performance, but all ages *perceive* looped as more legible ([ATypI](https://atypi.org/presentation/the-contemporary-effects-of-thai-loops-a-perceptual-study/)).
- **Implication:** Kanit (loopless, CI font) is excellent for big display words. For **small or long text** (dosage, address, steps) set it **larger and bolder** — and if the brand owner agrees, consider a looped face for long body text. Noto Sans Thai (CI fallback) is also loopless.

### g. If you ever use GSAP SplitText (we don't need it)
SplitText ships publicly from GSAP 3.13. Words split on `wordDelimiter` only (Thai becomes one "word" per phrase); `prepareText` can insert U+200B from a glossary-aware segmenter; chars use `Intl.Segmenter` graphemes (Thai-safe); **its `mask` option clips Thai marks unless you add `overflow-clip-margin: .3em`**. Verified from source (3.13 / 3.15).

## 5. Sound-off viewing & captions

- 2016 Facebook feed: up to 85% of views silent — publisher-reported, not Facebook-wide ([Digiday](https://digiday.com/media/silent-world-facebook-video/)).
- Verizon/Publicis 2019 (US, self-reported): 69% watch muted in public; 80% more likely to finish with captions ([3Play](https://www.3playmedia.com/blog/verizon-media-and-publicis-media-find-viewers-want-captions/)).
- **Reels/TikTok lean sound-on:** ≈ 80% of Reels viewed with sound on (EssenceMediacom × Meta, [Campaign](https://www.campaignlive.co.uk/article/delivering-impact-rise-reels/1875392)); Reels ads with music + VO score +15 pts positive response.
- Instagram auto-captions include Thai (2022); TikTok Thai auto-captions unverified.
- **Practice:** sound-on design that survives sound-off: burnt-in kinetic text carries every claim; VO adds warmth. Don't stack platform auto-captions over kinetic text.

## 6. Common mistakes

Too much text per card · text still moving while being read · everything moving at once · thin/decorative fonts · motion that contradicts meaning · typos · text under platform UI · **Thai-specific:** per-code-point splitting, masks clipping marks, `break-all`, trusting the segmenter on loanwords, centred white stroke, Latin-tight line-height in masks · linear easing on reading text · a different motion language per scene · text < ~43 px.

## 7. Exemplars (links not opened in-session — verify before sharing)
Saul Bass *North by Northwest* & *Psycho* ([Art of the Title](https://www.artofthetitle.com/title/psycho/)) — grid-driven, semantic type · Kyle Cooper *Se7en* — texture = meaning · Imaginary Forces *Stranger Things* — restraint, one slow idea · Spotify Wrapped stories — vertical, one huge number/word per card. **No Thai-language exemplar verified yet** — collect 5 local references (Thai TikTok/Reels) as a follow-up.

## Not verified
Netflix Thai figures from search snippets (whether marks count toward cps unknown); BBC/Clearcast per-word rules partly secondary; Typotheque vs ATypI conflict; safe-zone pixels are third-party measurements; Reels sound-on quoted 75–90%; all easing/duration/stagger numbers are practitioner defaults.
