# Admin Portal — Phase 1 (Content Foundation) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let the shop's team self-edit products (with photos + details), articles, and homepage banners in a Sanity dashboard, with edits appearing live within seconds — replacing the Google-Sheet CSV and hardcoded content.

**Architecture:** A standalone Sanity Studio (hosted dashboard) holds the content. The existing Next.js site (`web/`) reads it via the `next-sanity` HTTP client using GROQ queries. A one-time script imports the ~567 products from the current Sheet and the 3 existing articles into Sanity. A webhook route triggers Next.js on-demand revalidation so published edits refresh only the affected pages. Price/stock never enter Sanity.

**Tech Stack:** Sanity v3 (Studio + Content Lake), `next-sanity`, `@sanity/image-url`, GROQ, Next.js 16 App Router (existing), Vitest (new, for pure-logic tests only), TypeScript.

**Reference reading before coding:**
- `web/AGENTS.md` — this Next.js is customized; read `web/node_modules/next/dist/docs/` for any App-Router API you touch.
- Current data path: `web/src/lib/products.ts`, `web/src/lib/sheet.ts`, `web/src/lib/products.server.ts`.
- Current content: `web/src/content/articles.ts`, `web/src/components/HeroCarousel.tsx`.
- Spec: `docs/superpowers/specs/2026-07-25-admin-portal-design.md`.

---

## Prerequisite — Task 0: PM provisioning (BLOCKS integration steps)

Sanity project creation requires a login the agent cannot perform. Do this with the PM (or have them do it and paste values). **Code-only tasks (1–4, 6, 8) can be written and unit-tested before this lands; integration verification (Tasks 5, 7, 9, 10) requires these values.**

- [ ] **Step 1: PM creates a free Sanity project**

PM runs (in an empty `studio/` sibling folder to `web/`, i.e. repo root `studio/`):
```bash
npm create sanity@latest -- --template clean --create-project "Chaiyapreuk Agrotech" --dataset production
```
Choose: TypeScript = yes, output path = `studio`. This logs in via browser and creates the project.

- [ ] **Step 2: Capture the credentials into a shared note**

From the Sanity project (manage.sanity.io → API):
- `SANITY_PROJECT_ID` (e.g. `abc12xyz`)
- `SANITY_DATASET` = `production`
- A **read** token (Viewer) → `SANITY_API_READ_TOKEN`
- A **write** token (Editor) → `SANITY_API_WRITE_TOKEN` (import script only; never commit)
- Invent a random `SANITY_REVALIDATE_SECRET` (any long random string)

- [ ] **Step 3: Add CORS origins** (manage.sanity.io → API → CORS origins)

Add `https://chaiyapreuk-agrotech.com` and `http://localhost:3000` (allow credentials).

- [ ] **Step 4: Add env vars to `web/.env.local` (dev) and Vercel (prod)**

```
NEXT_PUBLIC_SANITY_PROJECT_ID=<projectId>
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-10-01
SANITY_API_READ_TOKEN=<read token>
SANITY_REVALIDATE_SECRET=<random secret>
```
(The **write** token goes only in the shell when running the import script, not in `.env.local`.)

---

## File Structure

**New — Studio (repo root `studio/`, deployed via Sanity CLI, NOT Vercel):**
- `studio/schemaTypes/product.ts` — product document schema
- `studio/schemaTypes/banner.ts` — banner document schema
- `studio/schemaTypes/article.ts` — article document schema
- `studio/schemaTypes/index.ts` — schema registry

**New — site reads (`web/`):**
- `web/src/sanity/client.ts` — read client
- `web/src/sanity/image.ts` — image URL builder
- `web/src/sanity/queries.ts` — GROQ query strings
- `web/src/sanity/map.ts` — pure mappers: Sanity doc → app types (TESTED)
- `web/src/sanity/map.test.ts` — unit tests for mappers
- `web/src/app/api/revalidate/route.ts` — Sanity webhook → on-demand revalidation
- `web/vitest.config.ts` — minimal Vitest config

**New — import scripts (`web/scripts/`, run once, local only):**
- `web/scripts/import-products.ts` — Sheet CSV → Sanity products
- `web/scripts/import-articles.ts` — `articles.ts` → Sanity articles

**Modified (`web/`):**
- `web/package.json` — deps + `test` + import scripts
- `web/src/lib/products.ts` — add `photos` to `Product`; honor explicit tags
- `web/src/lib/products.server.ts` — read from Sanity (Sheet fallback removed)
- `web/src/components/CatalogueBrowser.tsx` — show product photo when present
- `web/src/app/articles/page.tsx` + `web/src/app/articles/[slug]/page.tsx` — read from Sanity
- `web/src/content/articles.ts` — becomes import source only (kept until import verified)
- `web/src/components/HeroCarousel.tsx` — accept `slides` prop
- `web/src/app/page.tsx` — fetch banners from Sanity, pass to HeroCarousel

---

## Task 1: Studio schemas (product, banner, article)

**Files:**
- Create: `studio/schemaTypes/product.ts`, `banner.ts`, `article.ts`, `index.ts`

No unit tests (declarative schema). Verified by Studio loading in Task 5.

- [ ] **Step 1: Write `studio/schemaTypes/product.ts`**

```ts
import { defineType, defineField } from "sanity";

export const CATEGORIES = [
  "ปุ๋ย",
  "ยากันรา",
  "ยาฆ่าแมลง",
  "ยาฆ่าหญ้า",
  "อาหารเสริม-ฮอร์โมน",
  "อุปกรณ์",
  "อื่นๆ",
];

export default defineType({
  name: "product",
  title: "สินค้า",
  type: "document",
  fields: [
    defineField({ name: "code", title: "รหัสสินค้า", type: "string", validation: (r) => r.required() }),
    defineField({ name: "name", title: "ชื่อสินค้า", type: "string", validation: (r) => r.required() }),
    defineField({ name: "photos", title: "รูปสินค้า", type: "array", of: [{ type: "image", options: { hotspot: true } }] }),
    defineField({ name: "description", title: "รายละเอียด", type: "text", rows: 4 }),
    defineField({ name: "unit", title: "หน่วย (รหัส เช่น 01)", type: "string" }),
    defineField({ name: "category", title: "หมวดหมู่", type: "string", options: { list: CATEGORIES } }),
    defineField({ name: "brand", title: "แบรนด์", type: "string" }),
    defineField({ name: "bestSeller", title: "ป้าย ‘ขายดี’", type: "boolean", initialValue: false }),
    defineField({
      name: "campaignTags", title: "แท็กแคมเปญ", type: "array",
      of: [{ type: "string" }],
      options: { list: [{ title: "แฟมิลี", value: "family" }, { title: "โซตัส", value: "sotus" }, { title: "Flash Sale", value: "flash" }] },
    }),
    defineField({ name: "visible", title: "แสดงบนเว็บ", type: "boolean", initialValue: true }),
  ],
  preview: { select: { title: "name", subtitle: "code", media: "photos.0" } },
});
```

- [ ] **Step 2: Write `studio/schemaTypes/banner.ts`**

```ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "banner",
  title: "แบนเนอร์ / โปรโมชัน",
  type: "document",
  fields: [
    defineField({ name: "image", title: "อาร์ตเวิร์กแบนเนอร์", type: "image", options: { hotspot: true } }),
    defineField({ name: "title", title: "หัวข้อ", type: "string", validation: (r) => r.required() }),
    defineField({ name: "subtitle", title: "คำโปรย", type: "string" }),
    defineField({ name: "link", title: "ปุ่มลิงก์ไปยัง (เช่น /catalogue, /catalogue?tag=flash, /profile)", type: "string", initialValue: "/catalogue" }),
    defineField({ name: "startDate", title: "เริ่มแสดง", type: "datetime" }),
    defineField({ name: "endDate", title: "หยุดแสดง", type: "datetime" }),
    defineField({ name: "order", title: "ลำดับ", type: "number", initialValue: 0 }),
    defineField({ name: "active", title: "เปิดใช้งาน", type: "boolean", initialValue: true }),
  ],
  orderings: [{ name: "order", title: "ลำดับ", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "subtitle", media: "image" } },
});
```

- [ ] **Step 3: Write `studio/schemaTypes/article.ts`**

```ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "article",
  title: "บทความ",
  type: "document",
  fields: [
    defineField({ name: "title", title: "หัวข้อ", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug (URL)", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "coverImage", title: "รูปปก", type: "image", options: { hotspot: true } }),
    defineField({ name: "topic", title: "หัวข้อหมวด", type: "string" }),
    defineField({ name: "summary", title: "สรุปคำตอบสั้น (GEO)", type: "text", rows: 3 }),
    defineField({ name: "body", title: "เนื้อหา", type: "array", of: [{ type: "block" }] }),
    defineField({
      name: "faq", title: "คำถามที่พบบ่อย", type: "array",
      of: [{ type: "object", fields: [{ name: "question", type: "string", title: "คำถาม" }, { name: "answer", type: "text", title: "คำตอบ" }] }],
    }),
    defineField({ name: "seoTitle", title: "SEO Title", type: "string" }),
    defineField({ name: "seoDescription", title: "SEO Description", type: "text", rows: 2 }),
  ],
  preview: { select: { title: "title", subtitle: "topic", media: "coverImage" } },
});
```

- [ ] **Step 4: Write `studio/schemaTypes/index.ts`**

```ts
import product from "./product";
import banner from "./banner";
import article from "./article";

export const schemaTypes = [product, banner, article];
```

- [ ] **Step 5: Wire schemas into `studio/sanity.config.ts`** (created by the scaffold in Task 0)

Ensure the config imports the registry:
```ts
import { schemaTypes } from "./schemaTypes";
// ...
schema: { types: schemaTypes },
```

- [ ] **Step 6: Commit**

```bash
cd studio && git add schemaTypes sanity.config.ts && git commit -m "feat(studio): product, banner, article schemas"
```

---

## Task 2: Vitest + site Sanity read layer (client, image, queries)

**Files:**
- Create: `web/vitest.config.ts`, `web/src/sanity/client.ts`, `web/src/sanity/image.ts`, `web/src/sanity/queries.ts`
- Modify: `web/package.json`

- [ ] **Step 1: Install deps**

```bash
cd web && npm install next-sanity @sanity/image-url && npm install -D vitest
```

- [ ] **Step 2: Add scripts to `web/package.json`**

Add to `"scripts"`:
```json
"test": "vitest run",
"import:products": "node --env-file=.env.local --experimental-strip-types scripts/import-products.ts",
"import:articles": "node --env-file=.env.local --experimental-strip-types scripts/import-articles.ts"
```

- [ ] **Step 3: Write `web/vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
export default defineConfig({ test: { environment: "node", include: ["src/**/*.test.ts"] } });
```

- [ ] **Step 4: Write `web/src/sanity/client.ts`**

```ts
import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01",
  useCdn: true, // published content; revalidation handles freshness
});
```

- [ ] **Step 5: Write `web/src/sanity/image.ts`**

```ts
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "./client";

const builder = imageUrlBuilder(client);
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
```

- [ ] **Step 6: Write `web/src/sanity/queries.ts`**

```ts
// Only safe fields — never price/stock (those never exist in Sanity anyway).
export const PRODUCTS_QUERY = `*[_type == "product" && visible == true]{
  code, name, description, unit, category, brand, bestSeller, campaignTags,
  "photo": photos[0].asset->url
} | order(name asc)`;

export const ARTICLES_QUERY = `*[_type == "article"]{
  title, "slug": slug.current, topic, summary, seoTitle, seoDescription,
  "cover": coverImage.asset->url
} | order(_createdAt desc)`;

export const ARTICLE_QUERY = `*[_type == "article" && slug.current == $slug][0]{
  title, "slug": slug.current, topic, summary, body, faq, seoTitle, seoDescription,
  "cover": coverImage.asset->url,
  "related": *[_type=="article" && slug.current != $slug][0..2]{ title, "slug": slug.current, summary }
}`;

export const BANNERS_QUERY = `*[_type == "banner" && active == true]{
  title, subtitle, link, order, startDate, endDate,
  "image": image.asset->url
} | order(order asc)`;
```

- [ ] **Step 7: Verify build compiles**

Run: `cd web && npx tsc --noEmit`
Expected: PASS (no type errors).

- [ ] **Step 8: Commit**

```bash
cd web && git add package.json vitest.config.ts src/sanity/ && git commit -m "feat(web): sanity read client, image builder, queries + vitest"
```

---

## Task 3: Pure mappers (TDD) — Sanity doc → app types + banner scheduling

**Files:**
- Create: `web/src/sanity/map.ts`, `web/src/sanity/map.test.ts`

This is the one place with real branching logic, so it gets real tests.

- [ ] **Step 1: Write the failing test `web/src/sanity/map.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { sanityToRawProduct, isBannerLive, type SanityProduct, type SanityBanner } from "./map";

const baseProduct: SanityProduct = {
  code: "001001", name: "ปุ๋ยเทส", description: "ราก", unit: "01",
  category: "ปุ๋ย", brand: "ลัคกี้", bestSeller: true, campaignTags: ["family"], photo: "https://cdn/x.jpg",
};

describe("sanityToRawProduct", () => {
  it("maps sanity fields onto RawProduct shape (group=category, desc=description, best=bestSeller)", () => {
    const r = sanityToRawProduct(baseProduct);
    expect(r).toMatchObject({ code: "001001", name: "ปุ๋ยเทส", group: "ปุ๋ย", desc: "ราก", best: true, brand: "ลัคกี้", unit: "01" });
  });
  it("passes explicit campaignTags through as tags", () => {
    expect(sanityToRawProduct(baseProduct).tags).toEqual(["family"]);
  });
  it("carries the photo url", () => {
    expect(sanityToRawProduct(baseProduct).photo).toBe("https://cdn/x.jpg");
  });
  it("tolerates missing optional fields", () => {
    const r = sanityToRawProduct({ code: "002", name: "x" } as SanityProduct);
    expect(r.tags).toEqual([]);
    expect(r.best).toBe(false);
  });
});

describe("isBannerLive", () => {
  const now = new Date("2026-07-25T00:00:00Z");
  const b = (o: Partial<SanityBanner>): SanityBanner => ({ title: "t", link: "/catalogue", ...o });
  it("is live when no dates set", () => { expect(isBannerLive(b({}), now)).toBe(true); });
  it("is not live before startDate", () => { expect(isBannerLive(b({ startDate: "2026-08-01T00:00:00Z" }), now)).toBe(false); });
  it("is not live after endDate", () => { expect(isBannerLive(b({ endDate: "2026-07-01T00:00:00Z" }), now)).toBe(false); });
  it("is live inside the window", () => { expect(isBannerLive(b({ startDate: "2026-07-01T00:00:00Z", endDate: "2026-08-01T00:00:00Z" }), now)).toBe(true); });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd web && npx vitest run src/sanity/map.test.ts`
Expected: FAIL ("map" has no export `sanityToRawProduct").

- [ ] **Step 3: Write `web/src/sanity/map.ts`**

```ts
import type { RawProduct } from "@/lib/products";

export type SanityProduct = {
  code: string; name: string; description?: string; unit?: string;
  category?: string; brand?: string; bestSeller?: boolean;
  campaignTags?: string[]; photo?: string;
};

export type SanityBanner = {
  title: string; subtitle?: string; link: string;
  image?: string; order?: number; startDate?: string; endDate?: string;
};

// RawProduct gains optional photo + tags (see Task 4 type change).
export function sanityToRawProduct(p: SanityProduct): RawProduct & { photo?: string; tags?: string[] } {
  return {
    code: p.code,
    name: p.name,
    unit: p.unit,
    group: p.category,
    brand: p.brand,
    desc: p.description,
    best: !!p.bestSeller,
    tags: p.campaignTags ?? [],
    photo: p.photo,
  };
}

export function isBannerLive(b: SanityBanner, now: Date = new Date()): boolean {
  if (b.startDate && now < new Date(b.startDate)) return false;
  if (b.endDate && now > new Date(b.endDate)) return false;
  return true;
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `cd web && npx vitest run src/sanity/map.test.ts`
Expected: PASS (8 tests).

- [ ] **Step 5: Commit**

```bash
cd web && git add src/sanity/map.ts src/sanity/map.test.ts && git commit -m "feat(web): tested Sanity->app mappers + banner scheduling"
```

---

## Task 4: Extend `Product` with photos + explicit tags

**Files:**
- Modify: `web/src/lib/products.ts`

- [ ] **Step 1: Add `photo` to `RawProduct` and `Product`, and honor explicit tags in `decorate`**

In `web/src/lib/products.ts`, add `photo?: string;` and `tags?: string[];` to `RawProduct`; add `photo: string;` to `Product`. Then update `decorate` so it uses explicit `tags` when present, else falls back to keyword `tagsFor`:

```ts
// inside decorate(), replace the returned object's tag line and add photo:
return {
  code: p.code,
  name: p.name,
  unit,
  unitFull: unit ? units[unit] ?? unit : "",
  catName,
  group,
  brand: p.brand?.trim() ?? "",
  desc: p.desc?.trim() ?? "",
  best: !!p.best,
  photo: (p as RawProduct & { photo?: string }).photo ?? "",
  tags: (p as RawProduct & { tags?: string[] }).tags?.length
    ? (p as RawProduct & { tags?: string[] }).tags!
    : tagsFor(p),
};
```

- [ ] **Step 2: Verify types compile**

Run: `cd web && npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Verify existing behavior unchanged**

Run: `cd web && npx vitest run` (mappers still pass) and `npm run build`
Expected: build PASS; STARTER products still decorate (photo defaults to "").

- [ ] **Step 4: Commit**

```bash
cd web && git add src/lib/products.ts && git commit -m "feat(web): Product carries photo + explicit campaign tags"
```

---

## Task 5: Point the site's product loader at Sanity  *(needs Task 0)*

**Files:**
- Modify: `web/src/lib/products.server.ts`

- [ ] **Step 1: Replace the Sheet source with Sanity**

```ts
import "server-only";
import { cache } from "react";
import { decorate, STARTER, type Product } from "./products";
import { client } from "@/sanity/client";
import { PRODUCTS_QUERY } from "@/sanity/queries";
import { sanityToRawProduct, type SanityProduct } from "@/sanity/map";

// Reads published products from Sanity. Falls back to bundled STARTER only if
// the Sanity project isn't configured yet (keeps dev working pre-provisioning).
export const loadProducts = cache(async (): Promise<Product[]> => {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return STARTER;
  const docs = await client.fetch<SanityProduct[]>(PRODUCTS_QUERY);
  if (!docs?.length) return STARTER;
  return decorate(docs.map(sanityToRawProduct));
});
```

- [ ] **Step 2: Remove the now-unused Sheet path**

Delete `web/src/lib/sheet.ts` **only if** nothing else imports it:
```bash
cd web && grep -rl "lib/sheet" src/ || echo "safe to delete"
rm src/lib/sheet.ts
```
(If `products.server.ts` was the only importer, this is safe. Leave `PRODUCTS_SHEET_CSV_URL` docs alone.)

- [ ] **Step 3: Verify build + a live read**

Run: `cd web && npm run build`
Expected: PASS.
Then with `.env.local` set and at least one product created in Studio, run `npm run dev` and open `/catalogue`.
Expected: the Studio product appears.

- [ ] **Step 4: Commit**

```bash
cd web && git add -A && git commit -m "feat(web): products load from Sanity (Sheet source retired)"
```

---

## Task 6: Product import script (Sheet CSV → Sanity)  *(needs Task 0 write token)*

**Files:**
- Create: `web/scripts/import-products.ts`

- [ ] **Step 1: Write `web/scripts/import-products.ts`**

Reuses the existing quote-aware CSV logic conceptually; maps only safe columns; idempotent by `code` via deterministic `_id`.

```ts
import { createClient } from "@sanity/client";

const SHEET_CSV_URL = process.env.PRODUCTS_SHEET_CSV_URL!; // the published pub?...&output=csv URL
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-10-01",
  token: process.env.SANITY_API_WRITE_TOKEN!,
  useCdn: false,
});

function parseCsv(text: string): string[][] {
  const rows: string[][] = []; let row: string[] = []; let cell = ""; let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; } else if (c === '"') q = false; else cell += c; }
    else if (c === '"') q = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n") { row.push(cell); rows.push(row); row = []; cell = ""; }
    else if (c !== "\r") cell += c;
  }
  if (cell.length || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

const norm = (s: string) => s.trim().toLowerCase();
function findCol(headers: string[], keys: string[], exclude: string[] = []) {
  for (const key of keys) {
    const i = headers.findIndex((h) => norm(h).includes(key) && !exclude.some((e) => norm(h).includes(e)));
    if (i >= 0) return i;
  }
  return -1;
}

async function main() {
  const csv = await (await fetch(SHEET_CSV_URL)).text();
  const rows = parseCsv(csv).filter((r) => r.some((c) => c.trim()));
  const headerRow = rows.findIndex((r) => r.some((c) => /รหัส|code|sku/i.test(c)) && r.some((c) => /ชื่อ|name/i.test(c)));
  const headers = rows[headerRow];
  const iCode = findCol(headers, ["รหัส", "code", "sku"]);
  const iName = findCol(headers, ["ชื่อสินค้า", "ชื่อการค้า", "name"], ["แบรนด์", "ยี่ห้อ", "brand"]);
  const iUnit = findCol(headers, ["หน่วย", "unit"]);
  const iGroup = findCol(headers, ["หมวด", "group", "category", "ประเภท"]);
  const iBrand = findCol(headers, ["แบรนด์", "ยี่ห้อ", "brand"]);
  const iDesc = findCol(headers, ["รายละเอียด", "desc"]);

  const seen = new Set<string>();
  const tx = client.transaction();
  let n = 0;
  for (const r of rows.slice(headerRow + 1)) {
    const code = (r[iCode] ?? "").trim();
    const name = (iName >= 0 ? r[iName] : "").trim();
    if (!code || !name || seen.has(code)) continue;
    seen.add(code);
    tx.createOrReplace({
      _id: `product-${code}`,
      _type: "product",
      code, name,
      unit: iUnit >= 0 ? r[iUnit]?.trim() : undefined,
      category: iGroup >= 0 ? r[iGroup]?.trim() : undefined,
      brand: iBrand >= 0 ? r[iBrand]?.trim() : undefined,
      description: iDesc >= 0 ? r[iDesc]?.trim() : undefined,
      visible: true, bestSeller: false,
    });
    n++;
  }
  await tx.commit();
  console.log(`Imported ${n} products.`);
}
main().catch((e) => { console.error(e); process.exit(1); });
```

- [ ] **Step 2: Dry-run against the current Sheet**

Run: `cd web && SANITY_API_WRITE_TOKEN=<write> PRODUCTS_SHEET_CSV_URL=<csv url> npm run import:products`
Expected: `Imported <~567> products.` and no errors.

- [ ] **Step 3: Verify in Studio + on the site**

Open Studio → สินค้า shows the imported list. Open the site `/catalogue`.
Expected: products render, photos empty (added later by staff), **no prices anywhere**.

- [ ] **Step 4: Commit the script** (never the token)

```bash
cd web && git add scripts/import-products.ts && git commit -m "chore(web): one-time Sheet->Sanity product import script"
```

---

## Task 7: Show product photos in the catalogue

**Files:**
- Modify: `web/src/components/CatalogueBrowser.tsx`

- [ ] **Step 1: Render the photo when present, else keep the colored letter tile**

In the product card, replace the `.thumb` block:
```tsx
{p.photo ? (
  // eslint-disable-next-line @next/next/no-img-element
  <img className="thumb ph" src={p.photo} alt={p.name} loading="lazy" width={56} height={56} />
) : (
  <div className="thumb" style={{ background: color }} aria-hidden>
    {p.group.charAt(0)}
  </div>
)}
```

- [ ] **Step 2: Add CSS for the photo thumb**

Append to `web/src/app/globals.css`:
```css
.thumb.ph { object-fit: cover; padding: 0; background: #fff; }
```

- [ ] **Step 3: Verify build + a product with a photo**

Run: `cd web && npm run build` (PASS). In Studio add a photo to one product, publish, reload `/catalogue`.
Expected: that product shows its photo; others show the letter tile.

- [ ] **Step 4: Commit**

```bash
cd web && git add src/components/CatalogueBrowser.tsx src/app/globals.css && git commit -m "feat(web): product photo thumbnails in catalogue"
```

---

## Task 8: Articles from Sanity

**Files:**
- Create: `web/scripts/import-articles.ts`
- Modify: `web/src/app/articles/page.tsx`, `web/src/app/articles/[slug]/page.tsx`

- [ ] **Step 1: Write `web/scripts/import-articles.ts`**

```ts
import { createClient } from "@sanity/client";
import { ARTICLES } from "../src/content/articles";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-10-01", token: process.env.SANITY_API_WRITE_TOKEN!, useCdn: false,
});

async function main() {
  const tx = client.transaction();
  for (const a of ARTICLES) {
    tx.createOrReplace({
      _id: `article-${a.slug}`,
      _type: "article",
      title: a.title, slug: { _type: "slug", current: a.slug },
      topic: a.topic, summary: a.summary, seoDescription: a.description,
      body: [{ _type: "block", children: [{ _type: "span", text: a.bodyMd }] }],
      faq: (a.faq ?? []).map((f: { q: string; a: string }) => ({ _type: "object", question: f.q, answer: f.a })),
    });
  }
  await tx.commit();
  console.log(`Imported ${ARTICLES.length} articles.`);
}
main().catch((e) => { console.error(e); process.exit(1); });
```
(Note: this flattens existing Markdown into one block; PM can re-format richly in Studio afterward. Verify the exact field names in `web/src/content/articles.ts` before running and adjust `a.summary`/`a.faq` accessors to match.)

- [ ] **Step 2: Run the import**

Run: `cd web && SANITY_API_WRITE_TOKEN=<write> npm run import:articles`
Expected: `Imported 3 articles.`

- [ ] **Step 3: Switch the article list page to Sanity**

In `web/src/app/articles/page.tsx`, replace the `articles.ts` import with a Sanity fetch:
```tsx
import { client } from "@/sanity/client";
import { ARTICLES_QUERY } from "@/sanity/queries";
// inside the component (server):
const articles = await client.fetch<{ title: string; slug: string; topic?: string; summary?: string; cover?: string }[]>(ARTICLES_QUERY);
```
Map the existing list markup to these fields (title, slug, summary, cover). Keep the current layout/classes.

- [ ] **Step 4: Switch the article detail page to Sanity**

In `web/src/app/articles/[slug]/page.tsx`, fetch with `ARTICLE_QUERY` and `{ slug }`, render `summary`, `body` (via `@portabletext/react` — install it: `npm i @portabletext/react`), and `faq`. Preserve the existing FAQ JSON-LD. Replace `generateStaticParams` to pull slugs from Sanity:
```tsx
export async function generateStaticParams() {
  const slugs = await client.fetch<string[]>(`*[_type=="article"].slug.current`);
  return slugs.map((slug) => ({ slug }));
}
```

- [ ] **Step 5: Verify**

Run: `cd web && npm run build` (PASS). Open `/articles` and one `/articles/<slug>`.
Expected: the 3 imported articles render, FAQ + JSON-LD intact.

- [ ] **Step 6: Retire the hardcoded source**

Once verified, `web/src/content/articles.ts` is only referenced by the import script. Leave it in place (harmless) or delete after confirming no runtime import remains:
```bash
cd web && grep -rl "content/articles" src/app src/components || echo "no runtime refs"
```

- [ ] **Step 7: Commit**

```bash
cd web && git add -A && git commit -m "feat(web): articles served from Sanity"
```

---

## Task 9: Banners from Sanity (hero carousel)

**Files:**
- Modify: `web/src/components/HeroCarousel.tsx`, `web/src/app/page.tsx`

- [ ] **Step 1: Make `HeroCarousel` accept slides as a prop**

In `web/src/components/HeroCarousel.tsx`, change the component signature to take `slides` and remove the hardcoded `SLIDES` (keep the `Slide` type). If `slides` is empty, render nothing:
```tsx
export default function HeroCarousel({ slides }: { slides: Slide[] }) {
  const n = slides.length;
  if (n === 0) return null;
  // ...rest unchanged, replace every `SLIDES` with `slides`
}
```

- [ ] **Step 2: Fetch banners in `web/src/app/page.tsx` and map to slides**

```tsx
import { client } from "@/sanity/client";
import { BANNERS_QUERY } from "@/sanity/queries";
import { isBannerLive, type SanityBanner } from "@/sanity/map";

// inside Home() (already async):
const banners = await client.fetch<SanityBanner[]>(BANNERS_QUERY);
const slides = banners
  .filter((b) => isBannerLive(b))
  .map((b) => ({ kind: "banner", icon: "gift", label: b.subtitle ?? "", title: b.title, sub: b.subtitle ?? "", href: b.link, image: b.image }));
// <HeroCarousel slides={slides} />
```
(If `slides` is empty because the PM hasn't made banners yet, the hero simply doesn't render — acceptable for launch. Optionally keep one hardcoded fallback slide; decide with PM.)

- [ ] **Step 3: Use the banner image as the slide background when present**

In `HeroCarousel.tsx`, if a slide has `image`, set it as a background layer behind the text (add `style={{ backgroundImage: url(image) }}` on `.hslide` and a dark overlay for text contrast). Keep the gradient when no image.

- [ ] **Step 4: Verify**

Run: `cd web && npm run build` (PASS). Create a banner in Studio with a start/end window; confirm it appears only inside the window.
Expected: scheduled banner shows/hides by date; tapping opens its link.

- [ ] **Step 5: Commit**

```bash
cd web && git add src/components/HeroCarousel.tsx src/app/page.tsx && git commit -m "feat(web): homepage banners from Sanity with scheduling"
```

---

## Task 10: On-demand revalidation (publish → live in seconds)

**Files:**
- Create: `web/src/app/api/revalidate/route.ts`

- [ ] **Step 1: Write the webhook route**

```ts
import { revalidateTag, revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const type = body?._type as string | undefined;
  // Broad but cheap: refresh the pages each type affects.
  if (type === "product") revalidatePath("/catalogue");
  if (type === "banner") revalidatePath("/");
  if (type === "article") { revalidatePath("/articles"); revalidatePath("/articles/[slug]", "page"); }
  revalidatePath("/"); // homepage tiles/hero
  return NextResponse.json({ ok: true, revalidated: type ?? "all" });
}
```
(If the site's product/article reads should be cache-tagged for finer control, add `{ next: { tags: ["product"] } }` to the `client.fetch` calls and switch to `revalidateTag`. Path-based is sufficient for launch.)

- [ ] **Step 2: Verify locally**

Run: `cd web && npm run build && npm run start`, then:
```bash
curl -X POST "http://localhost:3000/api/revalidate?secret=$SANITY_REVALIDATE_SECRET" -H "content-type: application/json" -d '{"_type":"product"}'
```
Expected: `{"ok":true,"revalidated":"product"}`. Wrong/no secret → 401.

- [ ] **Step 3: Register the webhook in Sanity** (manage.sanity.io → API → Webhooks)

URL: `https://chaiyapreuk-agrotech.com/api/revalidate?secret=<secret>`; trigger on create/update/delete; dataset `production`; HTTP POST; projection `{ _type }`.

- [ ] **Step 4: End-to-end check**

Edit a product name in Studio → Publish → within seconds the live `/catalogue` shows the change (no redeploy).

- [ ] **Step 5: Commit + deploy**

```bash
cd web && git add src/app/api/revalidate/route.ts && git commit -m "feat(web): Sanity webhook on-demand revalidation" && git push origin main
```

---

## Task 11: Deploy Studio + final verification

- [ ] **Step 1: Deploy the Studio for the PM**

```bash
cd studio && npx sanity deploy
```
Choose a hostname → gives `https://<name>.sanity.studio`. Share it with คุณปิ่น (login = their Sanity account).

- [ ] **Step 2: Confirm Vercel has the env vars** (Task 0 Step 4) and redeploy `web` if needed.

- [ ] **Step 3: Acceptance walkthrough (the success criteria)**

- [ ] In Studio, add a new product with a photo + description → Publish → appears on `/catalogue` within ~1 min, no developer.
- [ ] Add a banner with a date window → shows on `/` only inside the window.
- [ ] Edit an article → change is live on `/articles/<slug>`.
- [ ] Confirm **no price or stock** appears anywhere on the site or in the page source.

- [ ] **Step 4: Update the spec's pending note**

The old "add `PRODUCTS_SHEET_CSV_URL` in Vercel" task is now retired (products come from Sanity). Note it in the spec/PM checklist.

---

## Self-Review

**Spec coverage:**
- Products master in Sanity (D2) → Tasks 1,5,6. Web fields only, no price/stock → queries + import map safe columns only. ✓
- One-time 567 import (D3) → Task 6. ✓
- Image auto-handling (D4) → Sanity image URLs (Task 2/7). ✓
- Go-live revalidation (D5) → Task 10. ✓
- Banners with scheduling → Tasks 1,3,9 (`isBannerLive`). ✓
- Articles with GEO summary/FAQ/SEO → Tasks 1,8. ✓
- Campaign + shop info (§5.4/5.5) → **deferred to Phase 2** per spec §9; not in this plan. ✓ (intentional)
- Customer points → Phase 3, out of scope. ✓

**Placeholder scan:** No "TBD/handle edge cases"; each code step has real code. The two "verify field names in articles.ts / decide fallback slide with PM" notes are explicit verification instructions, not deferred implementation. ✓

**Type consistency:** `SanityProduct`/`SanityBanner` defined in Task 3 (`map.ts`), used in Tasks 5,9. `sanityToRawProduct`/`isBannerLive` names consistent across tasks. `RawProduct.photo`/`.tags` added in Task 4 before use. Query field names (`photo`, `cover`, `image`, `slug`) match mapper/consumer usage. ✓

**Scope:** Single subsystem (content foundation). Ordered so products (highest value) work end-to-end by Task 7; articles and banners are independent follow-ons. ✓
