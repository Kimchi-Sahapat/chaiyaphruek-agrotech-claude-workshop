# Motion kit API (motion/kit/cyp-motion.js + cyp-motion.css)

One self-contained HTML file per video. No dependencies. Open it in a browser to preview (Space play/pause, ←/→ frame step, Shift+←/→ 1 s, G safe-zone guides, **Check** button = lint). Render with `motion/render/render.mjs`.

## Skeleton
```html
<!doctype html><html lang="th"><head><meta charset="utf-8">
<link rel="stylesheet" href="../../kit/cyp-motion.css">
<style>/* piece-specific layout */</style></head><body>
<main id="stage" class="cyp-stage cyp-bg-calm" data-width="1080" data-height="1920"
      data-fps="30" data-duration="18" data-mode="advise">   <!-- advise | celebrate -->
  <section id="s1"><div class="cyp-safe-916"> … </div></section>
</main>
<script src="../../assets/brand/logo.js"></script>
<script src="../../kit/cyp-motion.js"></script>
<script>
  const M = CYP.motion();
  const s1 = M.scene('#s1', 0, 4);          // visible [0,4); s1.* times are scene-relative
  s1.in('#title', 'rise', 0.2, { split: 'chunk' }).out('#title', 'sink', 3.6);
  M.done();                                  // always last
</script></body></html>
```
Paths assume `motion/videos/<slug>/index.html`; starter folders in `motion/templates/<name>/` sit at the same depth, so copying a folder keeps every path valid.

## Timeline API (chainable; times in seconds)
| Call | What |
|---|---|
| `CYP.motion({mode, readCps})` | create; reads `#stage` `data-width/height/fps/duration/mode` |
| `M.scene(sel, start, end)` | scene visible in `[start,end)`; returns the same API with scene-relative times |
| `.in(sel, preset, at, {split, stagger, dur, ease, mask, sfx, gain})` | entrance. `split`: `'chunk'`/`true` (spaces + `\|`) · `'word'` (ICU + glossary) · `'grapheme'` · `'children'`. Inline child elements stay one chunk each. `sfx` lands on the motion's landing frame. |
| `.out(sel, preset, at, {stagger, dur, ease})` | exit; reuses the chunks made by `in` |
| `.loop(sel, preset, at, {dur, stagger})` | ambient loop from `at` (transform-only loops add on top of entrances → loop a *child* of anything that also enters/exits) |
| `.anim(sel, keyframes, at, {dur, ease, fill, pseudo})` | custom WAAPI keyframes |
| `.count(sel, at, {from, to, dur, ease, decimals, grouping, prefix, suffix, format})` | number roll-up (`grouping:false` for years like 2515) |
| `.type(sel, at, {cps})` | grapheme-safe typewriter |
| `.tick(fn(localT, globalT))` | custom per-frame function (must be pure) |
| `.sfx(name, at, gain)` | sound cue: `pop` `tick` `ding` `swish` `whoosh` `thud` |
| `M.cut(t, 'panel'|'green'|'burst')` | brand transition centred on `t` (adds a swish/whoosh cue) |
| `M.music(src, {at, volume})` | licensed bed / VO file (preview + render mix, mastered to −14 LUFS) |
| `M.done()` | finalize (fills `.cyp-logo` slots, waits for fonts/images, starts preview) |

Presets — in: `fade rise drop slide-l slide-r mask-rise mask-drop pop stamp punch zoom wipe wipe-up unfurl iris draw highlight underline` · out: `fade sink lift mask-up mask-down pop wipe` · loop: `float sway pulse twinkle spin`.
Easings: `enter info exit move pop loop linear` or `[x1,y1,x2,y2]`. `CYP.GLOSSARY.push('คำ')` protects terms in `split:'word'`.

## CSS building blocks
Stage/layout: `.cyp-stage` `.cyp-bg-calm` `.cyp-safe-916` `.cyp-fill` `.cyp-center` · Type: `.cyp-hero` `.cyp-display` `.cyp-sub` `.cyp-body` `.cyp-small` `.cyp-line` · Colour: `.cyp-navy` `.cyp-red` `.cyp-gold` `.cyp-white` `.cyp-cream` · `.cyp-stroke` (white outline) · `.cyp-brandname` (`<span class="cyp-brandname"><span>ชัยพฤกษ์</span> <span>อโกรเทค</span></span>`) · Components: `.cyp-logo` (empty div, kit fills it) `.cyp-pill` `.cyp-ribbon` `.cyp-num` `.cyp-panel` `.cyp-panel-dark` `.cyp-highlight` `.cyp-underline` `.cyp-cta` `.cyp-sparkle` `.cyp-float` `.cyp-sunburst` `.cyp-ground` `.cyp-footer` (square formats) `.cyp-photo` `.cyp-photo-scrim` `.cyp-placeholder`.

Attributes: `data-key` (key claim/CTA → 2× hold) · `data-lint-hold="skip"` (reference info like NAP on the final card) · `data-lint-small` (allow < 40 px) · `data-lint-ignore` · `data-logo` (exempt from brand-name colour rule).

## Render CLI
```bash
node motion/render/render.mjs <comp.html> --lint            # checks only (exit 1 on errors)
node motion/render/render.mjs <comp.html> --sheet 12        # lint + contact sheet PNG (look at it!)
node motion/render/render.mjs <comp.html> --stills 1,4.5    # specific frames
node motion/render/render.mjs <comp.html>                   # lint + MP4 + poster (t=1 s) + flash screen
  --out x.mp4 · --from/--to · --scale 0.5 (draft) · --audio bed.mp3 · --no-sfx · --crf 18 · --force
```
Output: `motion/out/<slug>.mp4` (H.264 yuv420p 30 fps, AAC 48 kHz, faststart), `-poster.jpg`, `-sheet.png`.

## Lint messages → fix
| Message | Fix |
|---|---|
| text in unsafe zone | move inside `.cyp-safe-916` / reduce size / shorten the line |
| hold < reading time | start earlier, exit later, lengthen the scene, or cut words |
| font weights used: 3 | pick 2 (e.g. 800 + 700) |
| N gold highlights visible | keep gold for ONE word per scene |
| brand name in ONE colour / อโกรเทค should be red | use `.cyp-brandname` markup |
| text < 40px | enlarge, or `data-lint-small` for legal fine print only |
| font is not Kanit | a fallback leaked — check font-family / missing weight |
| animations end after data-duration | lengthen `data-duration` or retime |
| page error … | JS error in the composition — fix before anything else |
