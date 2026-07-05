# ชัยพฤกษ์ อโกรเทค — Web-App Design Spec

**Date:** 2026-07-04
**Owner (PM):** คุณ (Chaiyapreuk Agrotech, Khlung flagship)
**Status:** Design approved — pending written-spec review before planning

---

## 1. Overview

A single Thai-language website for **ชัยพฤกษ์ อโกรเทค** (Khlung flagship branch) that lets a
low-tech farmer **read helpful content, browse products, build a shopping list, and send it to the
shop's LINE@ in one tap** — while every page feeds Google Search and AI search engines
(GEO/AEO).

The site is an **extension of the existing Excel-fed Online Catalogue**, not a from-scratch rebuild.
Everything lives on **one domain** so SEO authority compounds in one place.

### Goals
1. **Ordering (primary):** turn product browsing into a LINE@ order with the least possible friction.
2. **Content / learning:** convert the existing library of Facebook + written articles into an
   organized, searchable knowledge hub.
3. **LINE@ funnel:** make LINE@ the main channel for consultation and follow-up.
4. **SEO / GEO:** get pages ranked by Google and cited by ChatGPT / Perplexity / Google AI Overview.

### Non-goals (for now)
- Online payment / checkout with money.
- Public retail pricing.
- Sub-dealer wholesale portal (later phase).
- Replacing the existing CRM (separate system).

---

## 2. Users & context

- **Primary user:** a farmer, 30–60, **low tech skill**, on a **mobile phone**, possibly on slow
  rural data, using **LINE daily**.
- **Primary entry point:** the Catalogue link is **normally opened from inside the LINE@ chat** —
  so most visitors are *already* a LINE friend and *already inside the LINE in-app browser* when
  they browse.
- **Secondary entry point:** Google / AI search → article or product page (these visitors are *not*
  yet LINE friends; the order flow converts them).

**Design consequence:** the experience must feel seamless whether the user arrives **from LINE** or
**from Google**. The order flow must work in the LINE in-app browser and in a normal mobile browser.

---

## 3. Locked decisions (with rationale)

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | **Build fresh** as one unified site on one domain (the prior Excel-fed catalogue was never delivered, so there is no repo to extend) | No legacy code to carry; pick a clean SEO-friendly stack; one SEO authority. |
| 2 | **Order routing = tap-to-send in LINE + Call button** | LINE can't silently send "as" a user; a pre-filled message the farmer taps to send is the only zero-friction path, and it lands as a real chat in LINE@. |
| 3 | **Shopping list, no public prices** | Protects wholesale/retail price differences; keeps the advisory model; staff confirm price on LINE. |
| 4 | **Content = topic-organized article library, articles link to products** | Reading turns into an order; doubles as the SEO/GEO surface. |
| 5 | **No login; the only personal data is ชื่อเล่น + เบอร์โทร, asked only at the closing step; login optional** | Lowest friction for low-tech farmers; phone captured at close is the identity/join key for CRM + loyalty. |
| 6 | **Articles managed as simple files** (not an admin panel) | Nothing fragile to maintain; content person writes a file (or a Google Doc we convert). |
| 7 | **V1 includes the FULL article library** | SEO needs volume; content migration is the long pole of V1. |
| 8 | **Loyalty (points/ยอดสะสม/profile/games) is V2, powered by the CRM, identity via LINE login** | CRM is the source of truth for real sales; don't build a second spend database. V1 only captures the data. |

---

## 4. Sitemap (what the farmer sees)

- **หน้าแรก (Home)** — warm, minimal, big buttons: `ดูสินค้า / สั่งของ`, `อ่านความรู้`,
  `โทรหาเรา`, `แชทไลน์`.
- **สินค้า (Catalogue)** — three ways in for several-hundred SKUs: **ขายดี (best-sellers,** auto-ranked
  from CRM sales), **browse by category** (derived from the product-code prefix), and a **search box**.
  Each product has `เพิ่มลงรายการ` (add to list). **No prices.**
- **รายการของฉัน (My List)** — the built shopping list → confirm → **ส่งรายการทางไลน์** or **โทรสั่ง**.
- **ความรู้ (Learning)** — full article library, grouped by topic; each article links to related products.
- **เกี่ยวกับเรา (About)** — the 50-year story (copy already exists in `briefs/company-history.md`); trust + SEO.
- **ติดต่อ (Contact)** — phone, LINE, Khlung store map, hours (Mon–Sat 07:00–17:00).

Persistent across all pages: header logo/strip and footer with `039-443-372 | 092-656-2944`,
Facebook, and LINE `@cyp-agro` (per `design.md` layout rules).

---

## 5. Core order flow (the money-maker)

1. Farmer browses **สินค้า**, taps `เพิ่มลงรายการ` on items; picks quantity with simple **+ / −** buttons.
2. Opens **รายการของฉัน**, reviews/adjusts the list (the list persists in the browser; no login needed).
3. At the confirm step, enters just **two fields — ชื่อเล่น (nickname) + เบอร์โทร (phone)**. This is
   the *only* info asked, and *only* at the close (per Decision 5). The phone is the customer's
   identity key: it lets staff match the order to the CRM and becomes the join key for loyalty (V2).
4. Taps one big green **`ส่งรายการทางไลน์`** button → **their LINE opens with the full order
   (including ชื่อเล่น + เบอร์โทร) already typed out**, addressed to `@cyp-agro` → they hit **send**.
5. The order lands in the shop's LINE@ inbox as a **normal chat from the farmer**. Staff confirm
   price, stock, and give advice in that chat, and log the sale in the CRM. If the farmer wasn't
   already a friend, they now are — **funnel done.**
6. Directly beneath the LINE button, a red **`โทรสั่ง 039-443-372`** button for anyone who prefers to call.

**No login. Just two fields at the very end. No prices to argue with.** V1 needs **no new backend** —
the nickname + phone ride along inside the LINE message, and customer data accrues in the existing
**CRM** through the staff's normal order-logging workflow.

**Optional login (nice-to-have, never required):** lets a returning farmer keep their list across
devices and pre-fill their name/phone; likely LINE Login / LIFF so it's one tap, no typing. This is
the same LINE identity used by the V2 loyalty profile (see §14). Deferred detail.

### Order message format (sent to LINE@)
A plain, readable Thai summary, e.g.:
```
🛒 รายการสั่งซื้อจากเว็บ ชัยพฤกษ์ อโกรเทค
👤 [ชื่อเล่น] · 📞 [เบอร์โทร]
1) [ชื่อสินค้า] x 2
2) [ชื่อสินค้า] x 1
— รบกวนยืนยันราคาและของพร้อมส่งด้วยครับ/ค่ะ
```
(Exact wording finalized in build; must stay within LINE's pre-filled-text length limits — long lists
may be summarized or chunked.)

---

## 6. Content + SEO / GEO

- Existing articles become the **ความรู้** library, grouped by simple topics: **ทุเรียน, โรค-แมลง,
  บำรุงดิน, ตามฤดูกาล** (adjust to real content).
- Per project `CLAUDE.md`, **every article includes an Answer-Ready summary paragraph + FAQ section**
  so AI search engines can quote it. Add appropriate **schema markup** (Article/FAQ).
- Each article links to the products it mentions: **`สินค้าที่เกี่ยวข้อง`** → add straight to the
  shopping list. Reading becomes ordering.
- This is what drives the `AI Citation Rate` and `Google AI Overview` KPIs.

---

## 7. UX principles (non-negotiable, for a low-tech farmer)

- **Mobile-first**; works in the **LINE in-app browser** and normal mobile browsers.
- **Huge tap targets**, minimal steps, one primary action per screen.
- **Plain Thai**, no tech jargon; polite, friendly, close to the farmer (brand voice).
- **Brand visuals from `design.md`**: green dominant; brand name navy `#1B3A8C` / red `#E8323C`;
  Kanit font; logo + footer contact on every page.
- **Phone and LINE always one tap away.**
- Works on **cheap Android + slow data** (light pages, server-rendered).
- Rule of thumb: **if a step needs explaining, it's too complex.**

---

## 8. Maintenance

- **Products:** keep pulling from **Excel**, exactly as the current catalogue does. Team edits a
  spreadsheet; the site reflects it. No workflow change. Known columns: `No`, `Product code`,
  `Product Name`, `Unit`. **Unit codes are abbreviated** (กส, ขว, กล, ซง, ถอ, กง, กป, มด, ...) and
  are decoded to full Thai words for display (legend to confirm with PM). Category is derived from
  the **product-code prefix** (first 3 digits — see §9).
- **Best-sellers & sales data:** the CRM's per-SKU sales figures are used **only privately** to rank
  ขายดี. Sales ฿ figures are **never shown on the public site.**
- **Price tiers are internal-only (SECURITY).** The POS holds multiple price columns —
  `ราคา 1` ปลีก (retail), `ราคา 3` ส่ง/ซาปั๊ว (wholesale), `ราคา 4` ต้นทุน+ขนส่ง (cost+freight),
  `ราคา 5` ทุนสุทธิ (net cost) [`ราคา 2` unspecified]. Columns 4–5 are **margins** — a leak would
  expose the cost structure. **Requirement:** the public feed ships **only `Code / Name / Unit`
  (+ optional availability)**; every price column and ฿ figure is **stripped at the source/build
  step**, never sent to the browser and never in page HTML/JSON.
- **Stock (`ยอดคงเหลือ`)** = quantity on hand in the small unit. Not shown as a raw number; used
  (if reliable) to show a simple availability state or hide sold-out items — see §16.
- **Articles:** **simple files** — the content person writes each article as a file (or a Google Doc
  we convert), and it publishes. No admin panel to maintain or break.

---

## 9. Technical considerations

- **Server-rendered pages are required** for SEO/GEO — Google and AI crawlers must read real text,
  not a blank app that fills in later.
- **One domain** for all pages (catalogue, articles, about) so SEO authority compounds.
- **Extend the existing catalogue's stack** where sensible. *The catalogue codebase is not in this
  workspace* — its stack must be confirmed when the repo is provided; if it's client-rendered-only,
  we choose the lightest SEO-friendly setup and migrate the product view.
- **LINE deep link:** use LINE's OA message URL scheme (e.g. `https://line.me/R/oaMessage/@cyp-agro/?<url-encoded text>`)
  to open the chat pre-filled. Confirm exact scheme + encoding + length limits against the live
  `@cyp-agro` account during build; provide a graceful fallback (copy-to-clipboard + open chat) if
  a device/browser doesn't honor the deep link.
- **Category from product code:** the first 3 digits of the code map to a category, giving free
  navigation without new data. Inferred map (**names to confirm with PM**):
  `001` ปุ๋ยเคมีเม็ด · `002` ปุ๋ยอินทรีย์/ปรับดิน · `003` ปุ๋ยเกล็ด/น้ำ · `004` ยาฆ่าหญ้า ·
  `005–008` ยาฆ่าแมลง/ไร · `009` ยากันรา · `010` ธาตุอาหาร/ฮอร์โมน · `011` สารคุมการเจริญเติบโต ·
  `012–013` สารเสริม/กำจัดหนู · `014–016` อุปกรณ์/เซฟตี้ · `019–020` เมล็ดพันธุ์/สินค้าทั่วไป.
- **Analytics** wired from day one (page views, order-button taps, article reads).

---

## 10. Scope

### V1 (first launch)
- Home, Catalogue, My-List + LINE/Call ordering, Contact, About.
- **Full article library** migrated, topic-organized, GEO-structured (Answer-Ready + FAQ + schema).
- Article → product linking.
- Basic analytics.

### Later (V2+)
- **Membership & Loyalty layer** (see §14): LINE-login profile page showing points/ยอดสะสม (from CRM),
  stamp-card accrual, and coupon/reward (ของแถม) redemption.
- Optional LINE login / LIFF (persistent list, name pre-fill) — same identity used by the loyalty profile.
- Sub-dealer / wholesale features.
- Richer dashboards and reporting.
- Deeper CRM integration.

---

## 11. Open items (to resolve during planning/build)

| ID | Item | Owner | Notes |
|----|------|-------|-------|
| A | **Domain registration** | Claude guides PM | PM has none; walk through choosing + registering (~฿300–500/yr) so SEO compounds on one domain. |
| B | ~~Catalogue repo access~~ → **RESOLVED: no repo exists; building fresh.** | Claude picks stack | Recommended stack: **Next.js** (SSR/SSG for SEO, handles the interactive shopping list, and scales to the V2 LINE-login loyalty app; free hosting to start). No longer a blocker. |
| C | **Article inventory + format** | PM provides | How many existing articles, current format (FB posts / docs), to scope migration. |
| D | **LINE deep-link** — scheme verified ✅ (LINE Developers docs, 2026-07-05): `https://line.me/R/oaMessage/{%40id}/?{encodeURIComponent(text)}` is current, pre-fills text (user taps Send), handles Thai/emoji/newlines, no practical length issue. **Still to confirm:** that `@cyp-agro` is the account's **real LINE ID** (OA Manager → Account info → LINE ID) — vanity/Premium format, valid only if owned. **Test phone-only** (scheme unsupported on LINE PC → desktop = false negative). | Build/PM | `@` now encoded to `%40`. |
| E | **Product data shape** | ✅ received (SKU PDF 2026-07-04) | Columns: No, Product code, Product Name, Unit. Category from code prefix. Still to confirm: **unit-code legend** (ถอ, กง, กป, บบ, กร), whether Excel has **image/stock** columns, and whether the live source is Excel or an export. |
| F | **CRM data access (V2)** | PM provides | For loyalty: how to read per-customer confirmed spend from the CRM, and the phone field used to match web customers. Only needed when V2 starts. |

---

## 12. Success metrics

Tied to `CLAUDE.md` KPIs:
- **Orders sent via the site** per week.
- **New LINE@ friends** originating from the site.
- **Article pages ranked / cited** by Google + AI search (AI Citation Rate, AI Overview keywords).
- **Store visits / calls** that mention the site.
- Standard web analytics (sessions, engagement) toward the `Website Traffic` KPI.

---

## 13. Risks

- **Content migration volume** — full article library in V1 is the biggest effort; needs the article
  inventory early (Open item C).
- **LINE deep-link edge cases** — device/browser variance; mitigated by fallback (Open item D).
- **Catalogue stack unknown** — could shift build effort; resolved by repo access (Open item B).
- **Low-tech UX drift** — every added feature risks complexity; hold the line on the UX principles.
- **Loyalty scope creep** — points/games are a whole subsystem; kept out of V1 deliberately. Risk is
  it pulls focus from shipping ordering. Mitigation: V1 only *captures* nickname + phone; no loyalty
  code until V2.

---

## 14. Membership & Loyalty layer (V2 — designed toward, not built in V1)

A profile page giving farmers points, accumulated spending (ยอดสะสม), and redeemable rewards —
a retention engine on top of the ordering site.

### Principles
- **CRM is the source of truth.** Points and ยอดสะสม derive from **confirmed sales in the existing
  CRM**, not from raw web orders (which are unconfirmed shopping lists). No second spend database.
- **Identity via LINE login.** Farmers open their profile with one LINE tap — no passwords, no OTP.
  They're already inside LINE, so this is near-zero friction.
- **Phone is the join key.** The เบอร์โทร captured at first order (V1) links a web/LINE identity to
  their CRM customer record. Confirmed once on first profile visit.

### What the profile page shows
- **แต้มสะสม (points)** and **ยอดสะสม (accumulated spend)** — read from the CRM.
- **สะสมแต้ม/ดวงตรา (stamp card):** each confirmed order/spend earns stamps/points toward a reward
  (the chosen game style — ties directly to ยอดสะสม).
- **โค้ดแลกส่วนลด/ของแถม (coupon & reward redemption):** points redeem for coupon codes or free items
  claimed in-store or via LINE (the second chosen game style).
- Order history and quick re-order (nice-to-have).

### Rough architecture (to be detailed in the V2 spec)
- A small backend/API that reads per-customer spend from the CRM (Open Item F) and computes
  points/tiers from a defined rule (e.g. 1 point per ฿X — rule TBD with PM in V2).
- A points/redemption ledger (the one piece of genuinely new data — tracks what's been redeemed).
- A LIFF (LINE Front-end Framework) profile page inside LINE for identity + display.

### Explicitly deferred (decide in V2 design)
- Exact points-earning rule and redemption catalog.
- Whether stamps come per-order or per-baht.
- Any animated minigame (not requested now; coupons + stamp card chosen).
- Anti-abuse rules (points only on confirmed, paid sales).

---

## 15. Unit code legend (from the POS/inventory system, 2026-07-04)

Used to decode the `Unit` column into full Thai words for display to farmers.

| Code | ย่อ | เต็ม (display) | English |
|------|-----|----------------|---------|
| กก | กก. | กิโลกรัม | kilogram |
| กง | กง. | กล่อง | box |
| กน | ก้อน | ก้อน | block/lump |
| กป | กป. | กระปุก | tub/jar |
| กร | ก.ป๋อง | กระป๋อง | can |
| กล | กล. | แกลลอน | gallon |
| กส | กส. | กระสอบ | sack |
| ขด | ขด | ขด | coil |
| ขว | ขวด | ขวด | bottle |
| คง | ครั้ง | ครั้ง | time/round |
| คน | คัน | คัน | unit (tools/vehicles) |
| คร | คร | เครื่อง | machine/appliance |
| คอ | คู่ | คู่ | pair |
| ชด | ชุด | ชุด | set |
| ชน | ชิ้น | ชิ้น | piece |
| ซง | ซอง | ซอง | sachet |
| ตว | ตัว | ตัว | piece (item) |
| ถอ | ถุง | ถุง | bag |
| ลอ | หลอด | หลอด | tube |
| ลม | เล่ม | เล่ม | volume/book |
| มด | เม็ด | เม็ด | tablet/pellet (assumed) |
| บบ | ? | ? | **TBD — likely ใบ (rice cooker)** |

**Note:** the full legend lives in the POS system; the build should ingest the complete
`code → คำเต็ม` table from there rather than hardcoding this subset. `บบ` and any other rare codes
resolved during data import.

---

## 16. Stock availability (`ยอดคงเหลือ`)

The POS holds on-hand quantity in the small unit. Exact counts are **not** shown to farmers.
Recommended handling (to confirm — depends on how real-time/reliable the POS export is):
- If stock is reliable: show a simple state — **มีของ / ใกล้หมด / หมด** — and optionally hide หมด items.
- If stock is not reliable / not exported often: **ignore it in V1**; staff confirm availability on LINE
  anyway (the advisory model already covers this).

Decision pending PM input on export reliability. Either way, raw stock numbers stay internal.
