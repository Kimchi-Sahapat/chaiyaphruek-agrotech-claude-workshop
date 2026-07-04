# ชัยพฤกษ์ อโกรเทค Web-App — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single Thai-language, mobile-first site that turns product browsing into a one-tap LINE@ order and turns existing articles into an SEO/GEO knowledge hub, extending the existing Excel-fed catalogue.

**Architecture:** One domain, server-rendered pages for crawlability. A stateless "shopping list" held in the browser (no login) that compiles into a pre-filled LINE message via LINE's OA deep-link URL scheme, with a phone-call fallback. Articles are simple content files rendered to SEO/GEO-structured pages that link to related products.

**Tech Stack:** Phase 0 spike is plain static HTML/JS (no dependencies). The full-site stack is **to be confirmed against the catalogue repo** (Open Item B); recommended default if a fresh SSR/SSG base is needed: **Astro** (content-first, minimal JS for slow rural data, excellent SEO) or **Next.js** if the catalogue is already React.

**Spec:** `docs/superpowers/specs/2026-07-04-chaiyapreuk-webapp-design.md`

---

## Prerequisites (needed before the code-heavy phases)

These unblock Phases 1+. Phase 0 does **not** depend on them and can start immediately.

| ID | What | Who | Why it blocks |
|----|------|-----|---------------|
| B | **Catalogue repo access + its tech stack** | PM → Claude | Can't write exact file paths / extend code we can't see. Determines "extend" vs. "lightweight SSR rebuild of the product view." |
| C | **Article inventory + current format** | PM → Claude | Number of articles + format (FB posts / Google Docs / Word) scopes the migration and the content-file schema. |
| E | **Excel product columns** | PM → Claude | Confirm columns (name, category, image URL, unit, id) that drive catalogue + shopping list. |
| A | **Domain name** (see Task 2) | PM, Claude guides | Everything ships under one domain for SEO. |

---

## Phase 0 — Prove the core + lay foundations

Goal of this phase: **de-risk the money-maker and set up prerequisites** before any big build.

### Task 1: LINE tap-to-send spike (validate the core mechanic)

Prove that a web button can open LINE with a pre-filled order addressed to `@cyp-agro`, that it
works **from inside the LINE in-app browser AND from Chrome on a real phone**, that the message
**arrives in your LINE@ inbox**, and find the **practical text-length limit** for an order.

**Files:**
- Create: `spikes/line-deeplink/index.html`

- [ ] **Step 1: Create the spike page**

```html
<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ทดสอบส่งออเดอร์เข้าไลน์ — ชัยพฤกษ์ อโกรเทค</title>
<style>
  body { font-family: sans-serif; background:#4DB748; color:#fff; margin:0; padding:24px; }
  h1 { font-size:20px; }
  .list { background:#fff; color:#1B3A8C; border-radius:12px; padding:16px; margin:16px 0; }
  .btn { display:block; text-align:center; text-decoration:none; font-size:22px;
         font-weight:bold; padding:18px; border-radius:14px; margin:12px 0; }
  .line { background:#06C755; color:#fff; }
  .call { background:#E8323C; color:#fff; }
  small { opacity:.85; display:block; margin-top:24px; }
</style>
</head>
<body>
  <h1>ทดสอบ: ส่งรายการสั่งซื้อเข้าไลน์</h1>

  <div class="list" id="summary"></div>

  <a class="btn line" id="lineBtn" href="#">ส่งรายการทางไลน์</a>
  <a class="btn call" href="tel:039443372">โทรสั่ง 039-443-372</a>

  <small id="debug"></small>

<script>
  // Fake order — later this is built from the shopping list.
  var order = [
    { name: "ปุ๋ยเคมี สูตร 15-15-15", qty: 2 },
    { name: "ยากำจัดเพลี้ย ABC", qty: 1 },
    { name: "ธาตุอาหารเสริม บำรุงราก", qty: 3 }
  ];

  // Sample nickname + phone — in the real app these come from the two
  // confirm-screen fields (Spec §5). Included here to test the real message
  // format and its length against LINE's limit.
  var nickname = "พี่สมชาย";
  var phone = "0812345678";

  var lines = order.map(function (o, i) {
    return (i + 1) + ") " + o.name + " x " + o.qty;
  });
  var message =
    "🛒 รายการสั่งซื้อจากเว็บ ชัยพฤกษ์ อโกรเทค\n" +
    "👤 " + nickname + " · 📞 " + phone + "\n" +
    lines.join("\n") +
    "\n— รบกวนยืนยันราคาและของพร้อมส่งด้วยครับ/ค่ะ";

  document.getElementById("summary").innerText = message;

  // LINE OA deep link. NOTE: verify the exact scheme + OA id against the live account.
  var OA_ID = "@cyp-agro";
  var url = "https://line.me/R/oaMessage/" + OA_ID + "/?" + encodeURIComponent(message);
  document.getElementById("lineBtn").setAttribute("href", url);

  document.getElementById("debug").innerText =
    "message length: " + message.length + " chars";
</script>
</body>
</html>
```

- [ ] **Step 2: Serve it locally**

Run: `cd spikes/line-deeplink && python -m http.server 8000`
Expected: page reachable at `http://localhost:8000`. Open it in a desktop browser — confirm the
order summary renders and both buttons appear on brand-green.

- [ ] **Step 3: Test on a real phone from Chrome**

Put the page somewhere phone-reachable (same-Wi-Fi LAN IP, or a quick tunnel). On an Android phone
with LINE installed, open the page in Chrome and tap **ส่งรายการทางไลน์**.
Expected: LINE opens on the `@cyp-agro` chat with the order text pre-filled; tapping send delivers it
to the LINE@ inbox.
Record: does it open the right chat? Is the text intact (Thai + emoji + line breaks)?

- [ ] **Step 4: Test from inside the LINE in-app browser (primary entry point)**

Send the page URL into the `@cyp-agro` chat, open it from there (LINE in-app browser), tap the button.
Expected: same result, ideally smoother since already in LINE.
Record: any difference vs. Chrome; whether it returns to the same chat.

- [ ] **Step 5: Find the text-length limit**

Edit `order` in the HTML to ~20–30 items, reload, retest the LINE button.
Expected: identify the point where the pre-filled text gets truncated or the link fails.
Record the safe maximum. This decides whether long orders need summarizing/chunking (Spec §5).

- [ ] **Step 6: Write findings + commit**

Create `spikes/line-deeplink/FINDINGS.md` recording: working URL scheme, behavior in Chrome vs LINE
browser, whether the message arrives, and the safe character limit. Update Spec Open Item D.

```bash
git add spikes/line-deeplink/
git commit -m "spike: validate LINE tap-to-send order deep link"
```

**Decision gate:** if the mechanic works → proceed to build the real shopping list on it. If it does
**not** work acceptably on farmers' phones → stop and reconsider order routing (revisit Spec §3
option b: name+phone form → backend delivery) before building anything else.

---

### Task 2: Choose and register a domain (guided, non-code)

**Owner:** PM, with Claude guiding step-by-step.

- [ ] **Step 1: Pick a name** — shortlist 2–3, e.g. `chaiyapreuk-agrotech.com`, `cyp-agro.com`,
  `chaiyapruek.com`. Prefer short, matches the LINE id `@cyp-agro`, `.com` first choice.
- [ ] **Step 2: Check availability** at a registrar (Namecheap / Cloudflare / a Thai registrar like
  Z.com / hostatom). Claude will walk through the screens.
- [ ] **Step 3: Register** (~฿300–500/yr). Enable auto-renew and WHOIS privacy.
- [ ] **Step 4: Record** the registrar login location and domain in a safe place. No DNS changes yet —
  we point it at the site during launch.

---

### Task 3: Gather build inputs (unblocks Phases 1+)

**Owner:** PM provides; Claude organizes.

- [ ] **Step 1:** Share the **catalogue repo** (zip or path/link) + note how it's currently run/hosted (Open Item B).
- [ ] **Step 2:** Export or list the **Excel product columns** and share a sample sheet (Open Item E).
- [ ] **Step 3:** Provide the **article inventory** — a list/folder of existing articles and their format (Open Item C).
- [ ] **Step 4:** Confirm the **article topic buckets** (Spec §6 guessed ทุเรียน / โรค-แมลง / บำรุงดิน / ตามฤดูกาล).
- [ ] **Step 5:** Provide/confirm the **order message wording** your content person prefers (from Task 1 draft).

---

## Phases 1–3 — Roadmap (detailed into bite-sized coded tasks once Phase 0 delivers the repo + stack)

> These are intentionally NOT expanded into file-level tasks yet: doing so before seeing the catalogue
> repo would produce guessed paths and code. Each becomes its own fully-specified task list (TDD, exact
> files, commits) immediately after Task 3 hands over the repo and Task 1 confirms the LINE mechanic.

**Phase 1 — Ordering core (the money-maker):**
- Product catalogue view fed by the Excel pipeline (extend existing), with `เพิ่มลงรายการ` + quantity steppers.
  Data model: `No, Product code, Product Name, Unit`; **category derived from code prefix**; **unit codes
  decoded** to full Thai; **best-sellers ranked from CRM sales privately** (sales ฿ never shipped to the
  client). Navigation = ขายดี + category browse + search.
- Browser-held shopping list (`รายการของฉัน`), no login.
- Confirm screen with **two fields — ชื่อเล่น + เบอร์โทร** (the only info asked, at the close) →
  real `ส่งรายการทางไลน์` folding those fields into the message (built on the validated Task 1
  mechanic) + `โทรสั่ง` button. Still **no backend** — data accrues in the CRM via staff logging.
- Home page with big-button navigation; global header/footer per `design.md`.
- Analytics events on catalogue view, add-to-list, and send taps.

**Phase 2 — Content / learning library (SEO/GEO):**
- Content-file schema for articles (simple files, per Spec §8).
- Article rendering with Answer-Ready summary + FAQ + Article/FAQ schema markup.
- Topic grouping + `ความรู้` index; `สินค้าที่เกี่ยวข้อง` links from article → shopping list.
- About page from `briefs/company-history.md`; Contact page (phone, LINE, Khlung map, hours).
- Migrate the full existing article library.

**Phase 3 — Launch & SEO wiring:**
- Point the registered domain at the site; SSL.
- Sitemap.xml, robots.txt, meta/OpenGraph, Google Search Console, basic analytics dashboard.
- Optional (V2): LINE Login / LIFF for persistent list + name pre-fill.

**Phase 4 — Membership & Loyalty (V2, its own spec + plan; see Spec §14):**
- LINE-login (LIFF) profile page inside LINE.
- Read per-customer confirmed spend from the **CRM** (needs Open Item F) → compute แต้ม / ยอดสะสม.
- Stamp-card accrual + coupon/reward (ของแถม) redemption, with a small redemption ledger (the only new data).
- Anti-abuse: points only on confirmed, paid sales.
- *This phase gets its own brainstorming + spec before implementation — earning rules and redemption catalog are deliberately undecided.*

---

## Self-Review notes

- **Spec coverage:** Order flow → Task 1 + Phase 1. Content/SEO → Phase 2. Domain (Open A) → Task 2.
  Inputs (Open B/C/E) → Task 3. LINE verification (Open D) → Task 1 Step 6. About/Contact → Phase 2.
- **Placeholders:** Phase 0 tasks are fully specified with real code/commands. Phases 1–3 are an
  explicitly-labeled roadmap, not executable tasks — they get expanded post-handover to avoid guessed paths.
- **Consistency:** `OA_ID`/message format in Task 1 match the Spec §5 order-message format.
