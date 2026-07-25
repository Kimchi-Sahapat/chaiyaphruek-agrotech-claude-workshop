# Admin Portal — Design Spec

- **Date:** 2026-07-25
- **Status:** Approved design → ready for implementation planning
- **Owner:** ชัยพฤกษ์ อโกรเทค (PM: Kim / คุณปิ่น content)
- **Applies to:** the web app (`web/`, Next.js on Vercel, live at chaiyapreuk-agrotech.com)

## 1. Problem & goal

Today, all site content is changed by a developer (Claude) editing code: products come
from a published Google Sheet CSV; articles, promo banner, and loyalty data are
hardcoded in TypeScript; images are hand-trimmed and committed to `web/public`.

**Goal:** let the shop's own team self-manage content (products incl. photos & details,
promotion banners, articles) and manage a customer loyalty-points program — without a
developer, and without hand-preparing images.

**Success looks like:** a non-technical staff member can add a product with a photo and
description, publish, and see it live on the catalogue within ~1 minute — and likewise
for a banner and an article. Later, staff can add/deduct a customer's points and the
customer sees the new balance after logging in.

## 2. Non-goals

- Not replacing the POS. **Price and stock stay in the POS** (internal) and never appear on the web.
- Not building web checkout/payments. Orders still go to the shop via LINE (unchanged).
- Not migrating price/stock onto the website.
- Not a public artwork gallery. "Artworks" = the image files uploaded onto banners/products.

## 3. Key decisions (all confirmed with PM)

| # | Decision | Choice |
|---|---|---|
| D1 | Content editing tool | **Sanity** (hosted headless CMS / Studio) |
| D2 | Product source of truth (web fields) | **Sanity is master** for web fields; POS keeps price & stock |
| D3 | Initial product data | **One-time import of ~567 products** from the current Sheet |
| D4 | Images | Upload one original → **Sanity CDN auto-resizes/optimizes** (WebP) |
| D5 | Go-live | **On-demand revalidation**: publish → only that page refreshes in seconds |
| D6 | Customer/points home | **Supabase** (DB + auth) — there is **no existing CRM** to extend |
| D7 | Points staff UX | A **small custom staff screen** (search customer → add/deduct → history) |
| D8 | Customer identity to view points | **LINE Login** (fallback considered: phone lookup — rejected for privacy) |
| D9 | Sequencing | **Phase 1 content first**, then campaign/shop info, then points |

> Note on the "CRM — Flask, สร้างแล้ว" line in project notes: PM confirms there is **no
> CRM in real use**. Treat as non-existent unless a prototype surfaces; reconcile the
> project doc separately.

## 4. Architecture — two surfaces

```
   ① CONTENT ADMIN                       ② CUSTOMER ADMIN
   Sanity Studio (hosted)                Supabase + staff screen (Phase 3)
   • products (+ photos, details)        • customer profiles
   • banners / promotions                • points ledger (add / deduct)
   • articles                            • tags + notes
   • campaign setup + shop info          • LINE Login for customers
        │ GROQ (read)                         │ API (read by phone / line id)
        ▼                                     ▼
        └──────────  chaiyapreuk-agrotech.com (Next.js/Vercel)  ──────────┘
```

Each surface is independent and communicates with the site through a well-defined read
interface (Sanity GROQ for content; a small API for points). Neither depends on the
other's internals.

## 5. Content model (Sanity document types)

Field labels shown in Thai as they'll appear to editors.

### 5.1 `product` — สินค้า
- `code` (string, required, unique) — รหัสสินค้า
- `name` (string, required) — ชื่อสินค้า
- `photos` (array of image, hotspot enabled) — รูปสินค้า
- `description` (portable text / plain text) — รายละเอียด
- `unit` (string) — หน่วย
- `category` (string from controlled list) — หมวดหมู่
- `brand` (string) — แบรนด์
- `bestSeller` (boolean) — ป้าย "ขายดี"
- `campaignTags` (array: `family` | `sotus` | `flash`) — แท็กแคมเปญ
- `visible` (boolean, default true) — แสดง/ซ่อนบนเว็บ
- **No price, no stock** (POS-only).

### 5.2 `banner` — แบนเนอร์ / โปรโมชัน (hero carousel slides)
- `image` (image, required) — อาร์ตเวิร์กแบนเนอร์
- `title` (string) — หัวข้อ
- `subtitle` (string) — คำโปรย
- `link` (string: catalogue / `catalogue?tag=` / profile / article slug / URL) — ปุ่มลิงก์
- `startDate`, `endDate` (datetime) — ช่วงเวลาแสดง (auto on/off)
- `order` (number) — ลำดับ
- `active` (boolean) — เปิด/ปิด

### 5.3 `article` — บทความ
- `title`, `slug`
- `coverImage` (image)
- `topic` (string)
- `summary` (text) — คำตอบสั้น (GEO answer-ready)
- `body` (portable text)
- `faq` (array of `{ question, answer }`) — GEO
- `related` (array of references to `article`)
- `seoTitle`, `seoDescription`

### 5.4 `campaign` — แคมเปญสะสมยอด *(Phase 2)*
Holds the campaign **definition/mechanics** only (not per-customer totals — those come
from Supabase in Phase 3):
- `name`, `period`
- `activities` (array: `name`, `note`, `step`, `per`, `tag`)
- `flashSales` (array: `off`, `product`, `condition`)
- `privileges` (array: `icon`, `title`, `detail`)
- `familyMembers` (array: `name`, `logo` image)

### 5.5 `shopSettings` — ข้อมูลร้าน *(Phase 2, singleton)*
- `name`, `branch`, `address`, `tel`, `mobile`, `lineId`, `lineUrl`, `hours`, `maps`, `socials`
- Lets staff update NAP (phone/hours) without code. Must stay consistent for Local SEO.

## 6. Data flow, migration & go-live

- **Read:** the site queries Sanity via GROQ. `products.server.ts` is switched from the
  Sheet CSV to Sanity. Existing decorate/filter logic and the catalogue/`?cat=`/`?tag=`
  behavior are preserved — only the data source changes.
- **Migration:** a one-time script maps current Sheet rows → Sanity `product` documents,
  reading only safe columns (code/name/unit/category/brand/description/best) and
  **never** price/stock. Idempotent by `code`.
- **The Sheet becomes a one-time import source.** The pending PM task "add
  `PRODUCTS_SHEET_CSV_URL` in Vercel" becomes obsolete once Sanity is the source (it may
  still serve as an interim bridge until Phase 1 lands).
- **Go-live:** a Sanity webhook calls `POST /api/revalidate` (shared secret) → Next.js
  `revalidateTag`/`revalidatePath` for the affected content type. Published edits appear
  within seconds; no full redeploy.

## 7. Images
Editors upload one original file. Sanity's image pipeline serves per-use sizes (list
thumbnail, hero, article cover), smart-cropped via hotspot, compressed to WebP. Replaces
all manual trim/resize/commit steps. `alt` text captured per image for accessibility/SEO.

## 8. Phase 3 — customer profiles & points (Supabase)

### 8.1 Store (Supabase Postgres)
- `customers`: `id`, `phone` (unique), `nickname`, `line_user_id` (nullable, unique),
  `tags` (array), `notes`, `created_at`
- `points_ledger`: `id`, `customer_id` (fk), `delta` (int, +/−), `reason`,
  `balance_after`, `created_by` (staff), `created_at`
- Balance = running sum of `delta` (cached `balance_after` for fast reads).

### 8.2 Staff screen (small protected route in the Next.js app)
- Behind **Supabase Auth** (staff accounts only).
- Search customer by phone/nickname → view balance + ledger history → **add/deduct**
  points with a required reason. Manage tags/notes.

### 8.3 Customer view (on the public site)
- `/profile` → "เช็คแต้ม" → **LINE Login** → resolve `line_user_id` → show the customer's
  real balance + campaign progress. Campaign *mechanics* come from Sanity (`campaign`);
  the *balance* comes from Supabase.

### 8.4 Points accrual — scope note
- **Phase 3 v1 = manual only** (staff add/deduct). This ships without POS integration.
- **Automatic accrual from purchases** (spend → points/ยอดสะสม) is a **later enhancement**
  that requires feeding the POS export into Supabase. Out of scope for Phase 3 v1.

## 9. Build order

| Phase | Delivers | Notes |
|---|---|---|
| **1. Content foundation** | Self-edit products (photos + details), banners, articles; import 567; site reads from Sanity; on-demand publish | ~80% of the ask; largest phase |
| **2. Campaign + shop info** | Self-edit Flash Sale/สะสมยอด definition + NAP/hours | Small; additive Sanity types |
| **3. Customer points** | Supabase store + staff add/deduct screen + เช็คแต้ม via LINE Login | Manual accrual first; touches auth & PII |

Each phase is independently shippable and delivers standalone value.

## 10. Cost & dependencies

- **Cost:** ~฿0 new. Sanity free tier (editors, roles, draft/publish, image CDN) and
  Supabase free tier fit current scale. Vercel already in use.
- **PM provides:** a free **Sanity** account/project (Phase 1); a free **Supabase**
  project + a **LINE Login** channel (Phase 3).
- **Roles:** Sanity roles — e.g. คุณปิ่น = editor, คุณรัฐ = admin/approver (draft → publish).

## 11. Risks & considerations

- **PDPA (personal data):** customer PII lives in Supabase (shop-controlled), minimal
  fields, consent captured at LINE Login. Safer than PII in a content CMS or a spreadsheet.
- **LINE Login dependency:** LINE Login is a separate channel from the existing LINE OA;
  needs setup and linking `line_user_id` → `customers`.
- **NAP consistency:** editable shop info must keep the exact NAP used elsewhere (Local SEO).
- **No accidental price leakage:** the import and all Sanity reads must exclude price/stock
  by construction (mirrors the current server-only price-stripping rule).
- **Content preview:** use Sanity draft/publish so half-edited content never shows live.

## 12. Open items to resolve during planning
- Exact controlled list for `category` (align with the sheet's real categories; clean the
  known duplicate-typo categories during import).
- Whether `brand`/`category` become reference documents later (v1: strings).
- Staff-account provisioning method for the Phase 3 screen.
