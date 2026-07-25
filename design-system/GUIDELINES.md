# ชัยพฤกษ์ อโกรเทค — Design System Guidelines (condensed)

Machine- and human-usable summary of the CI. **Full narrative reference:** [../design.md](../design.md).
**Tokens source of truth:** [tokens.json](tokens.json) → mirrored into [tokens.css](tokens.css) and [tailwind.preset.js](tailwind.preset.js).

Brand personality: **warm, energetic, generous, trustworthy** — a community hub, a celebration the farmer is invited to. Never corporate/cold.

---

## Non-negotiable rules

1. **Green is always dominant.** Every piece has `--cyp-green (#4DB748)` as the primary background. **Never dark/black backgrounds.**
2. **Brand-name text splits into two colors** (standalone text only):
   - **ชัยพฤกษ์** = Navy `#1B3A8C` · **อโกรเทค** = Red `#E8323C`
   - Exception: inside the circular **logo mark**, both words are navy.
3. **Navy** = headlines on green. **Red** = action/urgency/CTA. **Gold** = the single most important word only. **White** = body text on green + stroke/outline on large navy/red text.
4. **Typography = Kanit** (fallback Noto Sans Thai). Max 2 weights per piece, same family. Never serif/script.
5. **Rounded corners on every badge/label** — never sharp.
6. **Every post carries the header strip (logo) and footer with NAP.**
7. Avoid competitor colors: **no pure blue, no purple.**

## Footer — required on every social post

- Phone: `039-443-372 | 092-656-2944`
- Facebook icon + page name · LINE icon + `@cyp-agro`
- Footer background: Forest Green `#1E7B34` (`--cyp-footer-bg`).

> NAP must match the master table in `.claude/CLAUDE.md` exactly (Local SEO). Store: **ชัยพฤกษ์ อโกรเทค สาขาขลุง**, 15/3–15/4 ถนนเทศบาลสาย ต.ขลุง อ.ขลุง จ.จันทบุรี 22110.

---

## Token quick reference

| Purpose | Token (CSS) | Tailwind | Hex |
|---|---|---|---|
| Dominant background | `--cyp-green` | `bg-brand-green` | `#4DB748` |
| Headlines / "ชัยพฤกษ์" | `--cyp-navy` | `text-brand-navy` | `#1B3A8C` |
| CTA / urgency / "อโกรเทค" | `--cyp-red` | `text-brand-red` / `bg-cta` | `#E8323C` |
| Hero highlight word | `--cyp-gold` | `text-highlight` | `#FFD700` |
| Text on green | `--cyp-white` | `text-brand-white` | `#FFFFFF` |
| Footer / borders | `--cyp-green-dark` | `bg-footer-bg` | `#1E7B34` |
| Ray/sunburst pattern | `--cyp-green-light` | `bg-green-light` | `#7DC75A` |
| Panels / logo badge | `--cyp-cream` | `bg-cream` | `#FFFDE0` |

Font: `var(--cyp-font)` / `font-brand`. Weights: 400 / 500 / 700 / 800. Radii: `--cyp-radius-{sm,md,lg,pill}`. Float shadow: `--cyp-shadow-float`.

---

## Type scales

- **UI (web/app):** `--cyp-text-{xs…hero}` (rem). Body 400, headings 700–800, line-height 1.15 headline / 1.4 body.
- **Poster (1080px social artwork):** hero 90–130px (800, white/gold) · subhead 50–70px (700, white) · support 30–45px (400/500, white) · footer 22–28px (400, white). Text must read at 200×200 thumbnail — if not, bump weight/size.

## Export canvases

FB Feed `1080×1080` (primary) · FB Story `1080×1920` · LINE broadcast `1040×1040` · Banner/cover `1640×856` · Print `300 DPI`.

---

## Content-type visual treatment

| Type | Background | Hero | Accent |
|---|---|---|---|
| Promotion / Giveaway | Bright green + sunburst | Prize image (floating, `--cyp-shadow-float`) | White + Gold word, red urgency badge, stars |
| Expert / Knowledge | Green + real photo | Real expert, warm, in-field ("หมอทุเรียน") | Semi-transparent dark-green text panel |
| Event / Festival | Green + rays | Mascot (green hat), big date | Red ribbon banner, numbered red circles |
| Product / Brands | Clean white/light | Logo grid | "จากกว่า 25 บริษัทชั้นนำ" curation framing |
| Testimonial / Real people | Let photo breathe | Candid farmer, green uniform | Minimal overlay, story lives in caption |

## Signature decorative elements

Sunburst/radial rays (light green on green) · red ribbon banners (white text) · numbered red circles · stars/sparkles (promos) · floating product images at slight angle · white pill badge (logo + name) · green→light-green banner gradient (`--cyp-gradient-banner`).

## Photography — do / don't

Do: real farmers & fields, warm natural light, genuine smiles, visible green uniforms, Eastern-Thailand durian scenery.
Don't: generic stock farming, cold studio light, stiff posed groups, unbranded hero clothing, non-local/foreign crops, text over faces.

## Logo

Circular badge — red ring, white inside, curved navy "ชัยพฤกษ์ อโกรเทค" text (all navy in mark), 3 green trees, 5 navy water waves, gold ground mound. Top-left/top-center on posts. Never stretch, recolor, or rotate. Clear space = mark height. On dark backgrounds only: all-white outline version.
