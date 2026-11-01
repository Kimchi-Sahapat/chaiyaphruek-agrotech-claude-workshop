# 02 · Motion Graphics — principles, motion language, platform specs, safety

> Part of the motion research pack ([index](README.md)). Researched Nov 2026.
> Token values were read from each design system's official source repo (exact). Platform specs/stats come mostly from search excerpts of official pages (some hosts were blocked) — treat as current-but-verify. ⚠️ = our synthesis or unverified.

## TL;DR — rules we adopt

1. **Ease everything; linear only for constant loops.** Enter = decelerate, exit = accelerate, on-screen move = standard ease-in-out.
2. **Duration scales with size/distance:** pops 0.1–0.3 s · text & ribbons ≈ 0.4–0.7 s · hero/scene ≈ 0.7–1 s · exits ≈ 25% faster than entrances.
3. **Choreograph:** one lead element per beat, siblings 2–3 frames apart, the payoff (gold word) lands last.
4. **Two energy modes** (Carbon's productive/expressive idea): **advise** (expert/knowledge/product/testimonial — calm, no bounce on text) and **celebrate** (promo/event/CTA — pop on shapes, sunburst, sparkles).
5. **Brand shapes as transitions** (sunburst iris, ribbon/panel wipe) — 1–2 transition types per video, never a grab-bag; **never dip to black** (CI) or flash to white.
6. **Hook in 0–3 s** with the problem/product + message; CI colours from frame 1; logo lockup + single CTA at the end.
7. **30 fps constant**, 1080×1920 master, H.264 + AAC 48 kHz; audio −14 LUFS, true peak ≤ −1 dBTP.
8. **Text safe box (9:16): x 120–960, y 270–1250.**
9. **Flash safety:** ≤ 3 flashes/s; our brand red counts as *saturated red* → no full-frame red flashes, no red/lime toggling.
10. **Vestibular care:** zoom-throughs and whips ≤ 1–2 per video, ≤ 0.5 s; slow, low-contrast sunburst.

---

## 1. Core principles

The 12 principles (Thomas & Johnston, Disney) that pay off most in graphic motion ([Adobe](https://blog.adobe.com/en/publish/2016/11/08/redesigning-the-12-principles-of-animation-for-motion-design)): **timing & spacing · slow-in/slow-out (easing) · anticipation** ("a change of state to prepare for an action", usually opposite to the main action — [SOM](https://schoolofmotion.com/blog/anticipation-principle-quick-tip)) · **follow-through & overlap** ("something else follows, only slightly delayed" — [SOM](https://schoolofmotion.com/blog/follow-through-tutorial)) · arcs · staging · exaggeration · squash & stretch (badges/circles only, **never type**).

- **Easing, never linear.** Linear = constant speed + abrupt start/stop = robotic. Every system agrees: enter decelerates, exit accelerates, moves within frame use standard ease-in-out, linear only for continuous mechanical loops ([Material](https://github.com/material-components/material-components-android/blob/master/docs/theming/Motion.md), [Carbon](https://github.com/carbon-design-system/carbon/blob/main/packages/motion/tokens/motion.tokens.json), [Polaris](https://github.com/Shopify/polaris/blob/main/polaris-tokens/src/themes/base/motion.ts)).
- **Duration grows with area/traversal** (Material); Carbon's tokens climb from 70 ms toggles to 700 ms "large hero transitions".
- **Choreography = hierarchy over time.** *Offset & delay* (stagger) and *parenting* (children inherit parent motion) ([UX in Motion](https://uxmag.com/articles/creating-usability-with-motion-the-ux-in-motion-manifesto)).
- **Continuity between scenes:** carry an element across the cut. Material's patterns: *container transform* (an element becomes the next view), *shared axis* (sequential steps on one axis), *fade-through* (unrelated content).
- **Amateur tells ⚠️:** linear/default eases everywhere · uniform timing (nothing leads) · no holds · a new transition every cut · motion with no job · overshoot on everything (Polaris labels strong eases "use sparingly").

## 2. How organisations codify motion (exact token values)

**Material 3** ([tokens](https://github.com/material-components/material-web/blob/main/tokens/versions/latest/sass/_md-sys-motion.scss)): standard `0.2,0,0,1` · standard-decelerate `0,0,0,1` · standard-accelerate `0.3,0,1,1` · emphasized-decelerate `0.05,0.7,0.1,1` · emphasized-accelerate `0.3,0,0.8,0.15`. Durations: short 50–200 ms · medium 250–400 · long 450–600 · extra-long 700–1000. Springs: spatial damping 0.9 (stiffness 1400/700/300); **effects (colour/opacity) damping 1 — "a background's alpha shouldn't bounce"**.

**IBM Carbon** — personality as two modes ([tokens](https://github.com/carbon-design-system/carbon/blob/main/packages/motion/tokens/motion.tokens.json), [overview](https://carbondesignsystem.com/elements/motion/overview/)):

| | productive (subtle, task) | expressive (significant moments) |
|---|---|---|
| standard | `0.2,0,0.38,0.9` | `0.4,0.14,0.3,1` |
| entrance | `0,0,0.38,0.9` | `0,0,0.3,1` |
| exit | `0.2,0,1,0.9` | `0.4,0.14,1,1` |

Durations fast-01 70 ms · fast-02 110 · moderate-01 150 · moderate-02 240 · slow-01 400 · slow-02 700.

**Fluent 2** names curves by energy (decelerate Min/Mid/Max, accelerate Min/Mid/Max) — a model for "energy levels" ([tokens](https://github.com/microsoft/fluentui/tree/master/packages/tokens/src/global)). **Shopify Polaris** puts a usage note on every token ("great default", "use sparingly", "spinners") and ships named keyframes ([motion.ts](https://github.com/Shopify/polaris/blob/main/polaris-tokens/src/themes/base/motion.ts)).

### → Chaiyapreuk motion tokens (implemented in `design-system/tokens.*` + `motion/kit`)

| Token | Value | Derived from | Use |
|---|---|---|---|
| `ease.enter` | `cubic-bezier(0.05,0.7,0.1,1)` | M3 emphasized-decelerate | confident arrival (celebrate) |
| `ease.info` | `cubic-bezier(0,0,0.38,0.9)` | Carbon productive entrance | calm text (advise) |
| `ease.exit` | `cubic-bezier(0.3,0,0.8,0.15)` | M3 emphasized-accelerate | leaving |
| `ease.move` | `cubic-bezier(0.2,0,0,1)` | M3 standard | on-screen moves, wipes |
| `ease.pop` | `cubic-bezier(0.34,1.56,0.64,1)` | back-out ≈ GSAP back.out(1.7) | **shapes only** (circles, badges, ribbons) |
| `ease.loop` | `cubic-bezier(0.37,0,0.63,1)` | sine in-out | floats, pulses |
| `linear` | — | — | sunburst drift only |
| durations | 100 / 200 / 400 / 700 / 1000 ms = 3 / 6 / 12 / 21 / 30 frames @30fps | M3/Carbon scale | snap / quick / base / slow / hero |
| stagger | 2–3 frames (advise 0.1 s, celebrate 0.07 s) | ⚠️ practice | |

**Signature moves** (kit presets in brackets): Sunburst bloom + slow drift ≤ 6°/s [`fade`+`spin`] · Ribbon unfurl, text trails 2–3 frames [`unfurl`] · Number pop — red circle `ease.pop` ≈ 0.3 s, SFX on the landing frame, step text follows calmly [`pop`] · Gold-word stamp — key word lands last [`punch`/`stamp`/`highlight`] · Product float — rises then idles ±8–16 px on a ~2–3 s sine [`rise`+`float`] · Badge stamp −8°→0°, 1.15→1 [`stamp`].

## 3. Platform specs (master 1080×1920)

| Platform | Ratio / size | Length | File | Notes |
|---|---|---|---|---|
| FB Reels (organic) | 9:16, 1080×1920 | since 17 Jun 2025 all FB videos are Reels ([TechCrunch](https://techcrunch.com/2025/06/17/facebook-announces-that-all-videos-on-its-platform-will-soon-be-shared-as-reels)) | MP4, AAC 48 kHz ≥128 kbps | 24–60 fps ([Reels API](https://developers.secure.facebook.com/documentation/video-api/guides/reels-publishing)) |
| FB feed video | **4:5** (1080×1350; guide recommends 1440×1800) or 1:1 | 1 s–241 min | MP4/MOV H.264, AAC stereo ≥128 kbps, ≤ 4 GB | [Ads Guide](https://www.facebook.com/business/ads-guide/update/video) |
| IG Reels | 9:16 | up to 3 min (Jan 2025) | | |
| TikTok In-Feed | 9:16, ≥ 720p | up to 10 min; **21–34 s recommended** | mp4/mov ≤ 500 MB; audio required | [specs](https://ads.tiktok.com/help/article/tiktok-auction-in-feed-ads) |
| YouTube Shorts | 9:16 | up to 3 min | | ads: first 60 s in feed |
| LINE OA video message | preview image must match video ratio | no official max found | mp4 ≤ 200 MB, HTTPS | OA Manager auto-thumbnails the **1 s** frame → renderer exports `-poster.jpg` at 1 s |
| **LINE VOOM** | **ended in Thailand 28 Sep 2026** ([LINE TH help](https://help2.line.me/official_account_th/web/categoryId/20008540/3/pc?lang=th)) | | | don't produce for it |

**Safe zones (1080×1920).** Meta Reels (ads image spec): keep **14% top (269 px), 35% bottom (672 px), 6% sides (65 px)** free of text/logos ([Meta](https://www.facebook.com/business/ads-guide/update/image/instagram-reels)). TikTok publishes templates, not pixels; third-party measurements ≈ top 240, bottom 660, sides 120 ([Socialync](https://www.socialync.io/tools/safe-zones/tiktok)). **Union used by the kit: x 120–960, y 270–1250 (840×980).** Boosted Reels are ads, so we use the strict box by default. Below 1250 = decoration only (the kit's `.cyp-ground` motif lives there).

## 4. Hook & retention

- People can recall feed content after **0.25 s** of exposure (Fors Marsh for Facebook IQ); **47%** of campaign value delivered in the first 3 s (Facebook/Nielsen); of 3-s viewers, 65% reach 10 s and 45% reach 30 s. Meta's "3-second rule": key message or branding in the first 3 s.
- TikTok: **63%** of highest-CTR videos show the core message/product within 3 s ([TikTok](https://ads.tiktok.com/business/en-US/blog/9-creative-tips-to-drive-auction-ad-performance)); 40% of highest-VTR ads use text overlays; first 6 s carry 80–90% of ad-recall impact ([Creative Codes](https://ads.tiktok.com/business/en-US/creative-codes)).
- **9:16 + sound:** Meta split tests — full-screen 9:16 + audio + safe-zone placement → **2× delivery**, −34.5% cost per result vs image ads; vertical sound-on −4.8% CPA, +5.1% CTR; music or VO **+15 pts** positive response ([Meta](https://www.facebook.com/business/ads/facebook-instagram-reels-ads)).
- TikTok: custom unrecognisable music beat recognisable tracks (+34% brand recognition, +78% aided recall — [Creative Codes PDF](https://www.tiktok.com/business/library/Creative_Codes_May_2023.pdf)) → original/library music is not a compromise.
- **Brand timing:** brand recognition within 2 s → +57% "happiness", −19% attention decay (TikTok) — but don't "pack those two seconds with CTAs and logos". Google ABCD: brand/product in the first 5 s (+30% short-term sales likelihood, Kantar 11,000 ads) — but early branding also raises skips. **Our reconciliation:** CI colours + small header pill from frame 1; problem/product by 1–3 s; big logo lockup + CTA at the end.
- **Pacing ⚠️:** a new visual event every 1–2 s in the hook, then every 2–4 s; end frame rhymes with frame 1 for loops; hold the CTA ≥ 2 s (kit lint: CTA is a `[data-key]` → 2× reading time).

## 5. Audio

- **Loudness:** YouTube normalises to ≈ −14 LUFS; AES TD1008 window −14…−18 (speech ≈ −18); EBU R128 true peak ≤ −1 dBTP. Meta/TikTok publish no targets. **Target: −14 LUFS (±1), TP ≤ −1 dBTP; voice-led ≈ −16.** The renderer masters beds with `loudnorm=I=-14:TP=-1.5` and limits SFX-only mixes.
- **SFX sync:** put the transient on the frame where motion **lands** or changes direction; a whoosh builds into the cut and stops when the picture settles; don't whoosh every move. ITU-R BT.1359: audio > 45 ms early or > 125 ms late is detectable → at 30 fps **never > 1 frame early; 0–2 frames late is fine.** The kit's `in(..., {sfx})` places cues on the landing frame automatically.

## 6. Accessibility & safety

- **WCAG 2.3.1:** ≤ 3 flashes in any 1 s, or below the general/red flash thresholds ([W3C](https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html)). **ITU-R BT.1702 / Ofcom:** transitions to/from **saturated red** are potentially harmful whatever the luminance; flashing sequences > 5 s risky even when compliant; automated tests are not a safe harbour (ASA Citroën ruling).
- **Our palette ⚠️ (calculated):** brand red #E8323C qualifies as saturated red → **no full-frame red fills/flashes, no rapid red↔lime toggling; red wipes = narrow bands, ≤ 1 per second.** Lime→white→lime "flash frames" count as general flashes → no white dips on the beat. Phones at 30 cm make most of the screen fall inside the 10° field → don't rely on the area exemption.
- **Sunburst** = a regular radial stripe pattern → keep it low-contrast (kit opacity .55 light-green on green) and slow.
- **Check:** the renderer runs a coarse luma flash screen on every MP4; for anything strobe-like, run EA's open-source **IRIS** ([GitHub](https://github.com/electronicarts/IRIS)).
- **Vestibular:** risky = scaling/zooming, spinning/vortex, multi-speed parallax, large-distance moves; low risk = colour, opacity, blur ([Val Head, ALA](https://alistapart.com/article/designing-safer-web-animation-for-motion-sensitivity)).

## 7. Frame rate
**30 fps constant** — even cadence on 60 Hz phones, inside Meta's 24–60 range, half the render cost of 60. 24 fps judders on slow pans (3:2 pulldown). 60 fps only for very fast type if budget allows. 25/50 only to match footage shot under Thai 50 Hz lighting. Never mix rates.

## 8. Transitions

| Transition | Use when | Brand version | Caution |
|---|---|---|---|
| Hard cut on the beat | default | — | — |
| Match cut | a shape/position recurs | red circle → next scene's circle | plan layouts |
| Shape/mask wipe | chapter change, CTA reveal | **Sunburst iris** (`M.cut(t,'burst')`), **cream panel wipe** (`'panel'`) | full-frame red = red flash |
| Push/slide (shared axis) | steps 1→2→3 | next step enters from the right | one axis per video |
| Morph (container transform) | an element becomes the next scene | badge → info card | hero moments only |
| Zoom-through | going deeper (leaf → symptom) | through the sunburst centre | ≤ 0.5 s, 1–2 per video |
| Whip pan | energy, jump in place/time | with whoosh + blur | 1–2 per video |
| Fade-through / dip | unrelated content | **dip to lime** (never black — CI) | dip to white = flash |

## 9. References worth studying
[Carbon motion](https://carbondesignsystem.com/elements/motion/overview/) (personality ↔ content) · [Material 3 easing & duration](https://m3.material.io/styles/motion/easing-and-duration/applying-easing-and-duration) · [Fluent 2 tokens](https://github.com/microsoft/fluentui/tree/master/packages/tokens/src/global) · [Polaris motion tokens](https://github.com/Shopify/polaris/blob/main/polaris-tokens/src/themes/base/motion.ts) · [UX in Motion Manifesto](https://uxmag.com/articles/creating-usability-with-motion-the-ux-in-motion-manifesto) · [TikTok Creative Codes](https://ads.tiktok.com/business/en-US/creative-codes) · [Google ABCDs](https://business.google.com/ca-en/resources/articles/abcds-of-effective-video-ads/) · [Val Head — safer web animation](https://alistapart.com/article/designing-safer-web-animation-for-motion-sensitivity).

## Not verified
Meta *video* safe zones (14/35/6 is from the Reels *image* spec; video relies on Meta's checker); TikTok/Shorts pixel zones are third-party; FB Reels ad duration/fps limits; LINE OA max video length; Meta/TikTok loudness targets (none found); BT.1702 pattern thresholds; our stagger/exit-factor/idle-bob numbers and the saturated-red calculation are our own; consumer-brand motion guidelines and studio case studies not yet collected (search budget ran out).
