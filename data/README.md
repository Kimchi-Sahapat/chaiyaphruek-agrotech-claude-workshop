# Product data (starter)

Data the web catalogue reads. **This is a STARTER set** hand-extracted from the SKU PDF
(2026-07-04) to build and demo the catalogue — **not** the full master.

## Files
- **`products.starter.json`** — ~65 representative SKUs across every category, incl. own brands
  (Black Panther, Lucky) and best-sellers. Fields: `code`, `name`, `unit` (abbrev), `cat` (code
  prefix), `best` (true = best-seller). **No prices / cost / stock / ฿ figures** — those are internal.
- **`unit-codes.json`** — POS unit code → full Thai (for display). `บบ` tentative.
- **`categories.json`** — code prefix → category name + farmer-facing browse `group`. **Names inferred; confirm with PM.**

## What's deliberately NOT here (internal-only)
`ราคา 1` ปลีก · `ราคา 3` ส่ง · `ราคา 4` ต้นทุน+ขนส่ง · `ราคา 5` ทุนสุทธิ · `ยอดคงเหลือ` stock.
Columns 4–5 are margins. The public site ships only Code / Name / Unit (+ optional availability).

## Before launch
Replace `products.starter.json` with the **full Express export** (all SKUs, verified units) —
see `../briefs/pos-export-guide.md`. Keep the same field shape so no code changes are needed.

## Known gaps to confirm with PM
- Unit `บบ` (rice cooker) — likely ใบ.
- Category names in `categories.json`.
- Best-seller list is a subset ranked from CRM sales; refresh from a full sales export later.
