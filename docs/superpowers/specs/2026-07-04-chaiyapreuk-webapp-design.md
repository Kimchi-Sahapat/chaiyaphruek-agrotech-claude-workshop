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
| 1 | **Extend the existing catalogue**, one unified site, one domain | Reuse the Excel product pipeline; one SEO authority. |
| 2 | **Order routing = tap-to-send in LINE + Call button** | LINE can't silently send "as" a user; a pre-filled message the farmer taps to send is the only zero-friction path, and it lands as a real chat in LINE@. |
| 3 | **Shopping list, no public prices** | Protects wholesale/retail price differences; keeps the advisory model; staff confirm price on LINE. |
| 4 | **Content = topic-organized article library, articles link to products** | Reading turns into an order; doubles as the SEO/GEO surface. |
| 5 | **No login / no personal data until the closing step; login is optional** | Lowest friction for low-tech farmers; identity comes from LINE at send time. |
| 6 | **Articles managed as simple files** (not an admin panel) | Nothing fragile to maintain; content person writes a file (or a Google Doc we convert). |
| 7 | **V1 includes the FULL article library** | SEO needs volume; content migration is the long pole of V1. |

---

## 4. Sitemap (what the farmer sees)

- **หน้าแรก (Home)** — warm, minimal, big buttons: `ดูสินค้า / สั่งของ`, `อ่านความรู้`,
  `โทรหาเรา`, `แชทไลน์`.
- **สินค้า (Catalogue)** — products by category; each has `เพิ่มลงรายการ` (add to list). **No prices.**
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
3. Taps one big green **`ส่งรายการทางไลน์`** button → **their LINE opens with the full order already
   typed out**, addressed to `@cyp-agro` → they hit **send**.
4. The order lands in the shop's LINE@ inbox as a **normal chat from the farmer**. Staff confirm
   price, stock, and give advice in that chat. If the farmer wasn't already a friend, they now are —
   **funnel done.**
5. Directly beneath, a red **`โทรสั่ง 039-443-372`** button for anyone who prefers to call.

**No login. No form. No prices to argue with.**

**Optional login (nice-to-have, never required):** lets a returning farmer keep their list across
devices and pre-fill their name; likely LINE Login / LIFF so it's one tap, no typing. Deferred detail.

### Order message format (sent to LINE@)
A plain, readable Thai summary, e.g.:
```
🛒 รายการสั่งซื้อจากเว็บ ชัยพฤกษ์ อโกรเทค
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
  spreadsheet; the site reflects it. No workflow change.
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
- **Analytics** wired from day one (page views, order-button taps, article reads).

---

## 10. Scope

### V1 (first launch)
- Home, Catalogue, My-List + LINE/Call ordering, Contact, About.
- **Full article library** migrated, topic-organized, GEO-structured (Answer-Ready + FAQ + schema).
- Article → product linking.
- Basic analytics.

### Later (V2+)
- Optional LINE login / LIFF (persistent list, name pre-fill).
- Sub-dealer / wholesale features.
- Richer dashboards and reporting.
- Deeper CRM integration.

---

## 11. Open items (to resolve during planning/build)

| ID | Item | Owner | Notes |
|----|------|-------|-------|
| A | **Domain registration** | Claude guides PM | PM has none; walk through choosing + registering (~฿300–500/yr) so SEO compounds on one domain. |
| B | **Catalogue repo access + stack** | PM provides | Needed before implementation; determines extend vs. lightweight rebuild of the product view. |
| C | **Article inventory + format** | PM provides | How many existing articles, current format (FB posts / docs), to scope migration. |
| D | **LINE OA deep-link verification** | Build | Confirm URL scheme, encoding, and text-length limits against live `@cyp-agro`; define fallback. |
| E | **Product data shape** | PM/Build | Confirm the current Excel columns (name, category, image, unit) drive the catalogue + list. |

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
