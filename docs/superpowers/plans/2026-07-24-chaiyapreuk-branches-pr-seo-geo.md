# Chaiyapreuk Branches PR, SEO & GEO Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Thai-first, map-led public website for เครือชัยพฤกษ์เกษตร จันทบุรี that makes its nine owned branches easy to find, trust, and contact while creating durable PR, local SEO, and GEO assets.

**Architecture:** Create a dedicated Next.js application in `branches-site/`, separate from the Khlung commerce app. A validated Google Sheet CSV is the public-location source; server-rendered routes create the group, branch, and newsroom pages. A client-only MapLibre map enhances the server-rendered branch directory, so branch discovery still works without JavaScript or WebGL.

**Tech Stack:** Next.js 16.2.11, React 19.2.4, TypeScript, Tailwind CSS 4, MapLibre GL JS, Zod, Vitest, React Testing Library, Playwright, Google Search Console, Google Business Profile, and a compliant production map-style provider.

## Global Constraints

- Build only the nine owned branches listed in the approved design; do not publish dealer, partner, or certification content.
- The site is Thai-first, mobile-first, and server-renders meaningful text for crawlers.
- Keep the existing `web/` Khlung ordering app separate. Link to it only where the content is explicitly relevant.
- Each branch page must have distinct, verified local content; never ship duplicate copy with the name swapped.
- Public facts must come from the controlled Branch Directory sheet and must match each branch’s Google Business Profile.
- Never invent addresses, services, crop expertise, qualifications, business hours, social URLs, or claims.
- Do not emit a public branch page when its required location facts are missing or invalid.
- Use real branch/team/location photography, optimized in `public/images/branches/`; no generic agricultural stock imagery in a branch hero.
- All primary contact controls must have visible text and a minimum 44 × 44 CSS-pixel hit target.
- The interactive map is progressive enhancement. The `/branches` directory and all branch information must remain usable with JavaScript disabled, WebGL unsupported, a map-style failure, or slow data.
- Use one canonical production domain configured by `NEXT_PUBLIC_SITE_URL`; all absolute metadata, canonical URLs, structured data, sitemap entries, and Google Business Profile website links use it.
- Only collect aggregate interaction events. Do not send names, phone numbers, precise user locations, or search terms to analytics.

---

## Planned File Structure

All paths below are relative to the new dedicated repository `branches-site/`.

```text
branches-site/
├── .env.example
├── package.json
├── next.config.ts
├── playwright.config.ts
├── vitest.config.ts
├── src/
│   ├── app/
│   │   ├── about/page.tsx
│   │   ├── branches/page.tsx
│   │   ├── branches/[slug]/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── stories/page.tsx
│   │   ├── stories/[slug]/page.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── robots.ts
│   │   ├── sitemap.ts
│   │   └── globals.css
│   ├── components/
│   │   ├── analytics/TrackedLink.tsx
│   │   ├── branches/BranchCard.tsx
│   │   ├── branches/BranchDirectory.tsx
│   │   ├── branches/BranchMap.client.tsx
│   │   ├── branches/BranchMapSection.tsx
│   │   ├── branches/BranchStructuredData.tsx
│   │   ├── content/FaqList.tsx
│   │   ├── content/StoryCard.tsx
│   │   ├── layout/Footer.tsx
│   │   ├── layout/Header.tsx
│   │   └── layout/SkipLink.tsx
│   ├── content/
│   │   ├── group.ts
│   │   └── stories.ts
│   ├── lib/
│   │   ├── analytics.ts
│   │   ├── branches.ts
│   │   ├── branch-directory.server.ts
│   │   ├── config.ts
│   │   ├── metadata.ts
│   │   ├── schema.ts
│   │   └── urls.ts
│   └── types/branch.ts
├── tests/
│   ├── fixtures/branch-directory.csv
│   ├── integration/branch-page.test.tsx
│   ├── unit/branch-directory.test.ts
│   ├── unit/metadata.test.ts
│   ├── unit/schema.test.ts
│   └── e2e/branch-discovery.spec.ts
├── public/images/
│   ├── group/
│   └── branches/
└── docs/
    ├── branch-directory-collection.md
    ├── google-business-profile-checklist.md
    └── newsroom-calendar.md
```

## Shared Interfaces

```ts
// src/types/branch.ts
export type Branch = {
  id: string;
  slug: string;
  publicName: string;
  brandName: string;
  foundedYearBE: number;
  address: string;
  district: string;
  province: "จันทบุรี";
  postalCode: string;
  latitude: number;
  longitude: number;
  googleMapsUrl: string;
  phone: string;
  openingHours: string[];
  facebookUrl?: string;
  websiteUrl?: string;
  primaryImage: string;
  imageAlt: string;
  localSummary: string;
  services: string[];
  cropFocus: string[];
  faqs: Array<{ question: string; answer: string }>;
  lastReviewed: string;
};

export type BranchSummary = Pick<
  Branch,
  | "id"
  | "slug"
  | "publicName"
  | "district"
  | "latitude"
  | "longitude"
  | "phone"
  | "openingHours"
  | "googleMapsUrl"
  | "facebookUrl"
  | "websiteUrl"
>;
```

```ts
// src/lib/branch-directory.server.ts
export async function getPublishedBranches(): Promise<Branch[]>;
export async function getBranchBySlug(slug: string): Promise<Branch | null>;
```

```ts
// src/lib/analytics.ts
export type BranchEventName =
  | "branch_map_pin_opened"
  | "branch_page_opened"
  | "branch_maps_opened"
  | "branch_phone_tapped"
  | "branch_social_opened";

export function trackBranchEvent(
  event: BranchEventName,
  branchId: string,
  destination?: "maps" | "phone" | "facebook" | "website"
): void;
```

### Task 1: Create the isolated, SEO-first site foundation

**Files:**
- Create: `branches-site/package.json`
- Create: `branches-site/next.config.ts`
- Create: `branches-site/.env.example`
- Create: `branches-site/vitest.config.ts`
- Create: `branches-site/playwright.config.ts`
- Create: `branches-site/src/lib/config.ts`
- Create: `branches-site/src/app/layout.tsx`
- Create: `branches-site/src/app/globals.css`
- Create: `branches-site/tests/unit/config.test.ts`

**Interfaces:**
- Produces: `siteConfig` containing `siteUrl`, `siteName`, `defaultTitle`, and `defaultDescription`.
- Consumes: only environment variables declared in `.env.example`.

- [ ] **Step 1: Create the separate application and install the declared libraries**

Run from `branches-site/`:

```bash
npx create-next-app@16.2.11 . --ts --tailwind --eslint --app --src-dir --use-npm
npm install maplibre-gl zod @vercel/analytics @next/third-parties
npm install --save-dev vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom playwright
npx playwright install --with-deps chromium
```

- [ ] **Step 2: Declare every runtime input in `.env.example`**

```dotenv
NEXT_PUBLIC_SITE_URL=https://www.example.com
BRANCH_DIRECTORY_CSV_URL=https://docs.google.com/spreadsheets/d/e/EXAMPLE/pub?output=csv
NEXT_PUBLIC_MAP_STYLE_URL=https://maps.example.com/style.json
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Do not put a real production URL, API secret, or unpublished Google Sheet in the example file.

- [ ] **Step 3: Write the failing site-config test**

```ts
import { describe, expect, it } from "vitest";
import { createSiteConfig } from "@/lib/config";

it("removes a trailing slash from the canonical site URL", () => {
  expect(
    createSiteConfig({ NEXT_PUBLIC_SITE_URL: "https://group.example.com/" }).siteUrl
  ).toBe("https://group.example.com");
});
```

- [ ] **Step 4: Run the test and confirm the missing module fails**

Run: `npm run test -- tests/unit/config.test.ts`  
Expected: FAIL because `@/lib/config` does not exist.

- [ ] **Step 5: Implement `createSiteConfig` and the root layout**

`createSiteConfig` must reject a non-HTTPS production URL, strip one or more trailing slashes, and supply the approved group identity copy. The root layout must set `lang="th"`, load a Thai-capable font, use `metadataBase: new URL(siteConfig.siteUrl)`, and render a skip link, `Header`, `main`, and `Footer` placeholders only after those components exist in Task 3.

- [ ] **Step 6: Add test scripts and run the foundation checks**

Add these scripts to `package.json`:

```json
{
  "test": "vitest run",
  "test:watch": "vitest",
  "test:e2e": "playwright test",
  "lint": "eslint .",
  "build": "next build"
}
```

Run: `npm run test -- tests/unit/config.test.ts && npm run lint && npm run build`  
Expected: all commands exit `0`.

- [ ] **Step 7: Commit the foundation**

```bash
git add package.json package-lock.json next.config.ts .env.example vitest.config.ts playwright.config.ts src/app src/lib/config.ts tests/unit/config.test.ts
git commit -m "chore: scaffold branches discovery site"
```

### Task 2: Establish the nine-branch source of truth and validation pipeline

**Files:**
- Create: `branches-site/src/types/branch.ts`
- Create: `branches-site/src/lib/schema.ts`
- Create: `branches-site/src/lib/branch-directory.server.ts`
- Create: `branches-site/tests/fixtures/branch-directory.csv`
- Create: `branches-site/tests/unit/schema.test.ts`
- Create: `branches-site/tests/unit/branch-directory.test.ts`
- Create: `branches-site/docs/branch-directory-collection.md`

**Interfaces:**
- Produces: `getPublishedBranches()` and `getBranchBySlug()` from the Shared Interfaces section.
- Consumes: a CSV whose header names and values comply with `branchDirectorySchema`.

- [ ] **Step 1: Create the Branch Directory sheet with these exact headers**

```text
id,slug,publicName,brandName,foundedYearBE,address,district,province,postalCode,latitude,longitude,googleMapsUrl,phone,openingHours,facebookUrl,websiteUrl,primaryImage,imageAlt,localSummary,services,cropFocus,faqs,lastReviewed,publish
```

Add exactly nine rows—one for each approved owned branch. Set `publish` to `FALSE` until the row owner signs off on every required public fact. Use `services`, `cropFocus`, and `openingHours` as pipe-delimited values; store `faqs` as a JSON array of `{ "question": "...", "answer": "..." }` objects.

- [ ] **Step 2: Record the nine data-collection assignments**

In `docs/branch-directory-collection.md`, create one checklist row for each branch with columns `branch`, `record owner`, `public-name approval`, `location proof`, `phone/hours approval`, `Maps URL checked`, `social URL checked`, `photo consent`, `local copy approval`, and `last reviewed`. Do not replace unknown facts with estimates.

- [ ] **Step 3: Write the failing validation tests**

```ts
it("rejects a publishable branch without a Maps URL", () => {
  const result = branchDirectorySchema.safeParse({ ...validRow, googleMapsUrl: "" });
  expect(result.success).toBe(false);
});

it("returns exactly nine approved branch records", async () => {
  mockDirectoryCsv(nineValidRows);
  await expect(getPublishedBranches()).resolves.toHaveLength(9);
});
```

- [ ] **Step 4: Run tests to confirm they fail before the loader exists**

Run: `npm run test -- tests/unit/schema.test.ts tests/unit/branch-directory.test.ts`  
Expected: FAIL because the schema and loader do not exist.

- [ ] **Step 5: Implement the strict CSV parser and schema**

Create `branchDirectorySchema` with Zod. Require non-empty `id`, `slug`, `publicName`, `brandName`, `address`, `district`, `province`, `postalCode`, `googleMapsUrl`, `phone`, `openingHours`, `primaryImage`, `imageAlt`, `localSummary`, and `lastReviewed`; require province exactly `จันทบุรี`; require valid HTTPS Maps/social/website URLs; require latitude between `-90` and `90` and longitude between `-180` and `180`; require at least one FAQ; and require a date-only ISO `lastReviewed` value.

`getPublishedBranches()` must fetch `BRANCH_DIRECTORY_CSV_URL` with `next: { revalidate: 3600 }`, parse rows, retain only `publish === TRUE`, validate every retained row, sort by `publicName`, and throw an error if the published count is not exactly nine. `getBranchBySlug()` must return the matching validated row or `null`.

- [ ] **Step 6: Add explicit degraded-data behavior**

If the CSV HTTP response is not successful, the header row is absent, a published row fails validation, or the published count is not nine, log a server-side error with no personal data and render the site’s static `BranchDirectoryUnavailable` message plus the group contact route. Do not render guessed pins or partial location data as authoritative.

- [ ] **Step 7: Run data tests and commit**

Run: `npm run test -- tests/unit/schema.test.ts tests/unit/branch-directory.test.ts`  
Expected: PASS for valid nine-row input; FAIL assertions for invalid URL, invalid coordinate, missing required field, and any count other than nine.

```bash
git add src/types/branch.ts src/lib/schema.ts src/lib/branch-directory.server.ts tests/fixtures tests/unit docs/branch-directory-collection.md
git commit -m "feat: add validated branch directory pipeline"
```

### Task 3: Build the shared group shell and branch-card directory

**Files:**
- Create: `branches-site/src/content/group.ts`
- Create: `branches-site/src/components/layout/Header.tsx`
- Create: `branches-site/src/components/layout/Footer.tsx`
- Create: `branches-site/src/components/layout/SkipLink.tsx`
- Create: `branches-site/src/components/branches/BranchCard.tsx`
- Create: `branches-site/src/components/branches/BranchDirectory.tsx`
- Create: `branches-site/src/app/branches/page.tsx`
- Create: `branches-site/tests/integration/branch-page.test.tsx`
- Modify: `branches-site/src/app/layout.tsx`
- Modify: `branches-site/src/app/globals.css`

**Interfaces:**
- Consumes: `BranchSummary[]` returned from the validated loader.
- Produces: `BranchCard({ branch, source })` with Maps, phone, optional Facebook/website, and branch-detail actions.

- [ ] **Step 1: Write the failing directory-rendering test**

```tsx
it("renders every branch as a crawlable link and exposes a Maps action", () => {
  render(<BranchDirectory branches={twoBranches} source="directory" />);
  expect(screen.getByRole("link", { name: /ชัยพฤกษ์ อโกรเทค ขลุง/i })).toHaveAttribute(
    "href",
    "/branches/chaiyapreuk-agrotech-khlung"
  );
  expect(screen.getAllByRole("link", { name: /เปิด Google Maps/i })).toHaveLength(2);
});
```

- [ ] **Step 2: Run the directory test and confirm it fails**

Run: `npm run test -- tests/integration/branch-page.test.tsx`  
Expected: FAIL because `BranchDirectory` does not exist.

- [ ] **Step 3: Implement the shared identity and accessible navigation**

Put only verified group history, mission, and contact facts in `src/content/group.ts`. The header links to Home, Branches, About, Stories, and Contact. The footer repeats a concise group description and links to the full branch directory; it does not display a single branch’s NAP as if it applied to the network.

- [ ] **Step 4: Implement `BranchCard` and `BranchDirectory`**

For each branch card, render the public name, district, current published hours text, a normal anchor to `/branches/${slug}`, a `tel:` anchor, `target="_blank" rel="noreferrer"` external Maps/social links, and no absent optional social control. Use `TrackedLink` only after Task 7 defines it; until then render ordinary anchors. Keep the list in server-rendered HTML.

- [ ] **Step 5: Apply the approved visual language without copying the commerce shell**

Use the existing brand guide’s green, navy, red, gold, and Kanit/Noto Sans Thai hierarchy. The group site uses a wider reading layout than the mobile commerce app, plain Thai labels, visible focus rings, responsive images, and reduced-motion support. Give cards, buttons, and all map fallback links 44px minimum targets.

- [ ] **Step 6: Run unit/integration/build checks and commit**

Run: `npm run test -- tests/integration/branch-page.test.tsx && npm run lint && npm run build`  
Expected: PASS and the `/branches` page is generated without a browser-only dependency.

```bash
git add src/content/group.ts src/components/layout src/components/branches/BranchCard.tsx src/components/branches/BranchDirectory.tsx src/app/branches/page.tsx src/app/layout.tsx src/app/globals.css tests/integration/branch-page.test.tsx
git commit -m "feat: add group shell and branch directory"
```

### Task 4: Add the map-first Chanthaburi discovery experience

**Files:**
- Create: `branches-site/src/components/branches/BranchMap.client.tsx`
- Create: `branches-site/src/components/branches/BranchMapSection.tsx`
- Create: `branches-site/tests/e2e/branch-discovery.spec.ts`
- Modify: `branches-site/src/app/page.tsx`
- Modify: `branches-site/src/app/globals.css`
- Modify: `branches-site/package.json`

**Interfaces:**
- Consumes: `BranchSummary[]` with verified `latitude`, `longitude`, and destination URLs.
- Produces: a map enhancement that communicates selection through an adjacent React branch card, not raw popup HTML.

- [ ] **Step 1: Write the failing browser test for the non-map discovery path**

```ts
test("a visitor can open a branch detail and Maps from the homepage directory", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /ชัยพฤกษ์ อโกรเทค ขลุง/i }).click();
  await expect(page).toHaveURL(/\/branches\/chaiyapreuk-agrotech-khlung$/);
  await expect(page.getByRole("link", { name: /เปิด Google Maps/i })).toHaveAttribute(
    "href",
    /google\./
  );
});
```

- [ ] **Step 2: Run the browser test before map implementation**

Run: `npm run test:e2e -- tests/e2e/branch-discovery.spec.ts`  
Expected: FAIL because the home route and branch route are incomplete.

- [ ] **Step 3: Implement `BranchMapSection` as progressive enhancement**

Server-render a heading, a short map explanation, and `BranchDirectory`. Dynamically import `BranchMap.client.tsx` with `ssr: false` above the directory. If the import, map initialization, or WebGL check fails, leave the directory visible and show the concise message `แผนที่กำลังใช้งานไม่ได้ กรุณาเลือกสาขาจากรายชื่อด้านล่าง`.

- [ ] **Step 4: Implement the MapLibre client map**

Load `maplibre-gl/dist/maplibre-gl.css` from the installed package. Initialize only after `NEXT_PUBLIC_MAP_STYLE_URL` is present. Fit the camera to the nine verified coordinate pairs with padding; set Chanthaburi bounds to prevent the initial view drifting away. Render one green, keyboard-focusable marker button per branch. A marker click or keyboard activation updates React state and reveals the same safe `BranchCard` action set beside/below the canvas. Do not inject CSV text through `setHTML`.

- [ ] **Step 5: Add map-specific resilience checks**

Test `maplibregl.supported()` before initialization. Show no map canvas when it returns false. Use the approved map-style provider’s key/URL only through `NEXT_PUBLIC_MAP_STYLE_URL`; do not use MapLibre demo tiles in production. Preserve required attribution. Set `aria-label` on every marker as `ดูข้อมูล ${branch.publicName}`.

- [ ] **Step 6: Make the map the homepage hero**

Build `/` with the group promise, 50+ year proof, `BranchMapSection`, and a short route to the About and Stories pages. Do not add product browsing, prices, cart, or order flows.

- [ ] **Step 7: Run browser and production checks, then commit**

Run: `npm run test:e2e -- tests/e2e/branch-discovery.spec.ts && npm run lint && npm run build`  
Expected: the test passes with JavaScript enabled; the HTML response still contains the nine branch names and branch URLs before hydration.

```bash
git add package.json package-lock.json src/components/branches/BranchMap.client.tsx src/components/branches/BranchMapSection.tsx src/app/page.tsx src/app/globals.css tests/e2e/branch-discovery.spec.ts
git commit -m "feat: add map-first branch discovery"
```

### Task 5: Create unique branch pages, metadata, and local structured data

**Files:**
- Create: `branches-site/src/lib/urls.ts`
- Create: `branches-site/src/lib/metadata.ts`
- Create: `branches-site/src/components/branches/BranchStructuredData.tsx`
- Create: `branches-site/src/components/content/FaqList.tsx`
- Create: `branches-site/src/app/branches/[slug]/page.tsx`
- Create: `branches-site/tests/unit/metadata.test.ts`
- Modify: `branches-site/tests/integration/branch-page.test.tsx`

**Interfaces:**
- Consumes: `getBranchBySlug(slug)` and a validated `Branch`.
- Produces: static branch routes, page metadata, `LocalBusiness` JSON-LD, and visible FAQs.

- [ ] **Step 1: Write failing metadata and page tests**

```ts
it("builds a canonical URL from a branch slug", () => {
  expect(branchCanonicalUrl("chaiyapreuk-agrotech-khlung")).toBe(
    "https://group.example.com/branches/chaiyapreuk-agrotech-khlung"
  );
});

it("renders branch facts and visible FAQ content", async () => {
  render(await BranchPage({ params: Promise.resolve({ slug: branch.slug }) }));
  expect(screen.getByRole("heading", { name: branch.publicName })).toBeVisible();
  expect(screen.getByText(branch.faqs[0].question)).toBeVisible();
});
```

- [ ] **Step 2: Run the tests before implementation**

Run: `npm run test -- tests/unit/metadata.test.ts tests/integration/branch-page.test.tsx`  
Expected: FAIL because URL helpers and branch route do not exist.

- [ ] **Step 3: Implement static routes and safe not-found behavior**

Use `generateStaticParams()` from the nine validated branch records. Resolve each route through `getBranchBySlug`; call `notFound()` for unknown slugs. Create per-page metadata with a branch-specific Thai title, factual description derived from `localSummary`, canonical URL, Open Graph image, and no unverified superlatives.

- [ ] **Step 4: Render the unique local page contract**

Render the local summary, address, hours, call and Maps actions, optional social actions, services, crop focus, real primary image with the approved alt text, FAQs, related group story links, and the record’s visible `ข้อมูลตรวจสอบล่าสุด` date. Do not render an empty service/crop section.

- [ ] **Step 5: Implement structured data that matches the rendered page**

`BranchStructuredData` must serialize a `LocalBusiness` object containing the public name, URL, image, telephone, PostalAddress, GeoCoordinates, opening-hours text, `parentOrganization`, and `sameAs` only for approved social URLs. Add a `FAQPage` JSON-LD object only when the rendered branch has at least one visible FAQ. Escape JSON with a JSON serializer and replace `<` with `\\u003c` before embedding it in the script element.

- [ ] **Step 6: Run branch-page tests, inspect generated HTML, and commit**

Run: `npm run test -- tests/unit/metadata.test.ts tests/integration/branch-page.test.tsx && npm run build`  
Expected: PASS; inspect one built branch page and confirm its title, canonical link, LocalBusiness JSON-LD, address, phone, and visible FAQ agree exactly.

```bash
git add src/lib/urls.ts src/lib/metadata.ts src/components/branches/BranchStructuredData.tsx src/components/content/FaqList.tsx src/app/branches/[slug]/page.tsx tests/unit/metadata.test.ts tests/integration/branch-page.test.tsx
git commit -m "feat: publish local branch pages and schema"
```

### Task 6: Publish the group story, contact route, and newsroom foundation

**Files:**
- Create: `branches-site/src/content/stories.ts`
- Create: `branches-site/src/components/content/StoryCard.tsx`
- Create: `branches-site/src/app/about/page.tsx`
- Create: `branches-site/src/app/contact/page.tsx`
- Create: `branches-site/src/app/stories/page.tsx`
- Create: `branches-site/src/app/stories/[slug]/page.tsx`
- Create: `branches-site/docs/newsroom-calendar.md`
- Modify: `branches-site/src/content/group.ts`
- Modify: `branches-site/tests/integration/branch-page.test.tsx`

**Interfaces:**
- Produces: typed `STORIES`, `getStoryBySlug(slug)`, group history pages, and PR articles with `NewsArticle` JSON-LD.
- Consumes: verified history and approved facts from the existing group-history brief and branch record owners.

- [ ] **Step 1: Write the failing newsroom route test**

```tsx
it("links a dated story to its related branch", async () => {
  render(await StoriesPage());
  expect(screen.getByRole("link", { name: /อ่านเรื่องเต็ม/i })).toBeVisible();
  expect(screen.getByRole("link", { name: /ดูสาขาที่เกี่ยวข้อง/i })).toHaveAttribute(
    "href",
    expect.stringMatching(/^\/branches\//)
  );
});
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `npm run test -- tests/integration/branch-page.test.tsx`  
Expected: FAIL because the newsroom route and typed story collection do not exist.

- [ ] **Step 3: Implement the approved group narrative**

Use the verified 2515 founding story and the approved branch-network milestones from `briefs/company-history.md`. Identify claims as group history, name the source/reviewer where approved, and exclude unverified biographies, qualifications, and growth claims.

- [ ] **Step 4: Implement typed stories and pages**

Each story record requires `slug`, `title`, `description`, `publishedAt`, `updatedAt`, `authorName`, `body`, `heroImage`, `heroImageAlt`, and `relatedBranchSlugs`. Reject duplicate story slugs and invalid related branch slugs at build time. Render the date, byline, visible related-branch links, canonical metadata, and `NewsArticle` JSON-LD.

- [ ] **Step 5: Create the newsroom calendar**

In `docs/newsroom-calendar.md`, record one approved recurring format for each month: a branch milestone/community story, a seasonal regional agriculture explainer with named review, and a factual group/brand update when one has occurred. Require source links or owner approval before publication; do not create calendar entries that promise a specific event or claim without evidence.

- [ ] **Step 6: Build the contact route**

`/contact` must direct a visitor to choose a branch from the same directory component. It may show a group-level contact route only after that number/email has a confirmed owner. Do not route every enquiry to Khlung by default.

- [ ] **Step 7: Run tests and commit**

Run: `npm run test -- tests/integration/branch-page.test.tsx && npm run lint && npm run build`  
Expected: PASS; each story has a valid related-branch link and an article route.

```bash
git add src/content src/components/content src/app/about src/app/contact src/app/stories docs/newsroom-calendar.md tests/integration/branch-page.test.tsx
git commit -m "feat: add group story and newsroom"
```

### Task 7: Implement technical SEO, sitemap, robots, and privacy-safe event measurement

**Files:**
- Create: `branches-site/src/lib/analytics.ts`
- Create: `branches-site/src/components/analytics/TrackedLink.tsx`
- Create: `branches-site/src/app/robots.ts`
- Create: `branches-site/src/app/sitemap.ts`
- Modify: `branches-site/src/app/layout.tsx`
- Modify: `branches-site/src/components/branches/BranchCard.tsx`
- Modify: `branches-site/src/components/branches/BranchMap.client.tsx`
- Modify: `branches-site/tests/unit/metadata.test.ts`
- Modify: `branches-site/tests/e2e/branch-discovery.spec.ts`

**Interfaces:**
- Consumes: `BranchEventName`, branch IDs, `siteConfig`, published branches, and typed stories.
- Produces: sitemap URLs, robots rules, GA4 events only when a measurement ID exists, and Vercel Web Analytics page measurement.

- [ ] **Step 1: Write failing sitemap and event tests**

```ts
it("includes all nine branch URLs in the sitemap", async () => {
  const entries = await sitemap();
  expect(entries.filter((entry) => entry.url.includes("/branches/"))).toHaveLength(9);
});

it("does not emit a tracking event without a measurement ID", () => {
  expect(trackBranchEvent("branch_maps_opened", "khlung")).toBeUndefined();
});
```

- [ ] **Step 2: Run tests before implementation**

Run: `npm run test -- tests/unit/metadata.test.ts`  
Expected: FAIL because the sitemap and analytics wrappers do not exist.

- [ ] **Step 3: Implement `robots.ts` and `sitemap.ts`**

Allow crawling of public pages, disallow `/api/` if later added, and publish the absolute sitemap URL. Include Home, About, Contact, Branches, all nine branch pages, Stories, and published story pages. Use each data record’s `lastReviewed` for branch `lastModified` and each story’s `updatedAt` for story `lastModified`.

- [ ] **Step 4: Implement minimal analytics**

Load `GoogleAnalytics` only when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is non-empty. Add Vercel `Analytics` globally. `trackBranchEvent` may send only the event name, `branch_id`, and optional destination; it must return silently when analytics is unavailable. Wrap Maps, phone, Facebook/website, map-marker selection, and branch-detail actions using `TrackedLink` or an explicit click handler.

- [ ] **Step 5: Add checks for crawlability and outbound actions**

Extend the browser test to visit `/robots.txt` and `/sitemap.xml`, confirm the page source has one branch link before client interaction, and assert Maps links use the approved Google Maps URL. Do not test a live third-party Maps page.

- [ ] **Step 6: Run complete automated checks and commit**

Run: `npm run test && npm run test:e2e && npm run lint && npm run build`  
Expected: all commands exit `0`; sitemap contains nine branch entries; analytics tests confirm no personal data payload.

```bash
git add src/lib/analytics.ts src/components/analytics src/app/robots.ts src/app/sitemap.ts src/app/layout.tsx src/components/branches tests/unit/metadata.test.ts tests/e2e/branch-discovery.spec.ts
git commit -m "feat: add crawl controls and branch analytics"
```

### Task 8: Complete launch evidence, Google Business Profile alignment, and PR readiness

**Files:**
- Create: `branches-site/docs/google-business-profile-checklist.md`
- Create: `branches-site/docs/launch-evidence.md`
- Modify: `branches-site/docs/branch-directory-collection.md`
- Modify: `branches-site/README.md`

**Interfaces:**
- Consumes: deployed production domain, nine approved Branch Directory rows, the nine Google Business Profiles, and completed automated test output.
- Produces: a signed-off launch record and repeatable monthly accuracy process.

- [ ] **Step 1: Create a nine-row Business Profile checklist**

For each owned branch, require: profile claimed or access requested; real-world public name matches website; exact address and pin checked; phone/hours checked; primary category reviewed; real photos present; branch-specific canonical website URL set; duplicate profile search completed; review-response owner named; and `last checked` date recorded.

- [ ] **Step 2: Create launch evidence with explicit pass/fail checks**

Record these evidence rows: `nine pins visible`, `nine directory cards visible without JavaScript`, `nine branch pages return 200`, `nine Maps links checked`, `nine phone links checked`, `nine social/website links checked when provided`, `structured data validated`, `sitemap submitted`, `Search Console ownership verified`, `mobile viewport checked`, `desktop viewport checked`, `Lighthouse mobile performance/accessibility/SEO results saved`, and `no dealer/partner copy found`.

- [ ] **Step 3: Populate the approved Sheet, publish it, and run pre-release validation**

Set all nine final branch rows to `publish=TRUE` only after each required checklist cell is complete. Set the sheet’s CSV publication URL in `BRANCH_DIRECTORY_CSV_URL`. Run:

```bash
npm run test
npm run test:e2e
npm run lint
npm run build
```

Expected: all checks pass and build logs confirm exactly nine published records.

- [ ] **Step 4: Deploy to a staging domain and execute manual acceptance**

On an Android-class mobile device and a desktop browser, open every map pin and all non-map branch cards; verify the selected card belongs to the tapped branch; use each call, Maps, Facebook/website, and branch-detail action; test no-JavaScript directory access; and document results in `docs/launch-evidence.md`. Correct the Branch Directory sheet for factual failures and redeploy.

- [ ] **Step 5: Validate structured data and search discovery**

Use Google’s Rich Results Test on Home, one branch page, and one newsroom page. Use Search Console URL Inspection after production deploy to confirm each is crawlable and request indexing; submit `/sitemap.xml`. Record the date and result in launch evidence. Do not claim that schema guarantees a rich result or an AI citation.

- [ ] **Step 6: Publish the first evidence-backed newsroom items**

Publish a verified group-history story and a verified branch/community or seasonal story. Confirm each has a named author/reviewer, date, supporting approved image, linked branch page, metadata, and `NewsArticle` markup before release.

- [ ] **Step 7: Establish the monthly operating rhythm and commit documentation**

On the first business week of every month, review all nine Sheet rows and Google Business Profiles; correct changed facts; review broken outbound links; check Search Console coverage/query changes; record map/Maps/call/social event totals; and publish only evidence-backed newsroom material.

```bash
git add docs/branch-directory-collection.md docs/google-business-profile-checklist.md docs/launch-evidence.md README.md
git commit -m "docs: add branches site launch operations"
```

## Plan Self-Review

### Spec coverage

| Approved-design requirement | Implementing task(s) |
| --- | --- |
| One group authority site for nine owned branches | 1, 2, 3, 5 |
| Map-first Chanthaburi discovery | 4 |
| Crawlable accessible branch directory | 3, 4, 7 |
| Unique branch pages | 2, 5 |
| PR/newsroom and 50+ year group story | 6, 8 |
| Local SEO and GEO-ready factual answers | 5, 6, 7 |
| LocalBusiness/Organization/FAQ/NewsArticle markup | 5, 6, 7 |
| Google Business Profile alignment | 8 |
| Single controlled data source and monthly review | 2, 8 |
| Maps/social/contact actions and measurement | 3, 4, 7 |
| No dealers or partners in V1 | Global Constraints, 2, 4, 8 |
| Validation, error handling, and launch acceptance | 2, 4, 7, 8 |

### Placeholder scan

The plan contains no deferred implementation placeholders. The nine branch facts remain an external business-data dependency, with exact collection fields, validation gates, owners, and launch blockers defined in Task 2 and Task 8 rather than fabricated values.

### Type consistency

`Branch`, `BranchSummary`, `getPublishedBranches`, `getBranchBySlug`, `BranchEventName`, and `trackBranchEvent` are defined once in Shared Interfaces and used consistently by all dependent tasks.
