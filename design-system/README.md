# ชัยพฤกษ์ อโกรเทค — Design System

Portable, self-contained design system for all Chaiyapreuk Agrotech products (website, catalogue, CRM, social artwork). One source of truth, consumable by any web stack **and** by design tools.

## Files

| File | What it is | Use it when |
|---|---|---|
| [`tokens.json`](tokens.json) | **Source of truth.** W3C Design Tokens (colors, type, spacing, radii, shadows, canvases). Tool-agnostic. | Import into Figma / Style Dictionary / any token pipeline. Edit here first. |
| [`tokens.css`](tokens.css) | CSS custom properties (`--cyp-*`) + a few helper classes. | Any HTML/CSS/React/Vue/Svelte app. `@import` at root. |
| [`tailwind.preset.js`](tailwind.preset.js) | Tailwind theme preset (`bg-brand-green`, `text-cta`, …). | Apps on Tailwind. |
| [`fonts.css`](fonts.css) | Kanit + Noto Sans Thai loader (Google Fonts). | Every app. `@import` before `tokens.css`. |
| [`GUIDELINES.md`](GUIDELINES.md) | Condensed do/don't rules + token quick-reference. | Hand to a designer, an agent, or paste into a prompt. |
| [`../design.md`](../design.md) | Full CI narrative (logo anatomy, layout, decorative elements). | Deep reference. |

## Wire it up (plain web)

```html
<link rel="stylesheet" href="/design-system/fonts.css">
<link rel="stylesheet" href="/design-system/tokens.css">
```
```css
.card   { background: var(--cyp-surface); border-radius: var(--cyp-radius-md); }
.button { /* or just use .cyp-cta */ background: var(--cyp-cta); color: var(--cyp-cta-text); }
h1      { color: var(--cyp-headline); font-weight: var(--cyp-fw-extrabold); }
```

## Wire it up (Tailwind)

```js
// tailwind.config.js
module.exports = {
  presets: [require('./design-system/tailwind.preset.js')],
  content: ['./src/**/*.{html,js,ts,jsx,tsx,vue,svelte}'],
};
```
```html
<button class="bg-cta text-brand-white font-brand rounded-pill px-6 py-3">สั่งซื้อ</button>
```

## The one rule that trips people up

Standalone brand-name text is **always two colors** — `ชัยพฤกษ์` navy, `อโกรเทค` red. In the circular logo mark, both are navy. See `.cyp-brand` helper in `tokens.css`.

## Editing

Change a value in **`tokens.json` first**, then mirror it into `tokens.css` and `tailwind.preset.js`. Keep NAP and brand rules in sync with `.claude/CLAUDE.md`.
