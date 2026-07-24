# เครือชัยพฤกษ์เกษตร จันทบุรี — Branch PR, GEO & SEO Website Design

**Date:** 2026-07-24  
**Status:** Design approved; awaiting written-spec review  
**Scope:** The nine owned branches in the Chaiyapreuk Agriculture Group only. Certified sub-dealers and partners are explicitly deferred.

## 1. Purpose

Create a Thai-first, public-facing website for **เครือชัยพฤกษ์เกษตร จันทบุรี**. It must make the group and its nine owned branches easy to discover, understand, trust, and contact.

The priorities are:

1. Local discovery — farmers can find the closest branch and open its Maps, Facebook/website, or contact route quickly.
2. Group reputation — establish the group’s 50+ year history, regional roots, and shared values as the authoritative story.
3. Enquiries — turn discovery into map opens, calls, social visits, and branch contact.

The existing Chaiyapreuk Agrotech Khlung ordering web app remains a separate conversion product. This project is the group’s PR, local-discovery, SEO, and GEO layer; it should link to the Khlung web app where relevant without duplicating its catalogue/order flow.

## 2. In-scope network

The first release represents only the following nine group locations/brands, based on the supplied group network graphic:

1. ชัยพฤกษ์เกษตรหน้าวัดเขตร์
2. ชัยพฤกษ์เกษตรเขาไร่ยา
3. พฤกษาภัณฑ์เกษตร
4. ชัยพฤกษ์ตรีรัตน์
5. ธนาทรัพย์การเกษตร
6. ชัยพฤกษ์ อโกรเทค ขลุง
7. ชัยพฤกษ์บ้านไทรเคมีเกษตร
8. ธนาทรัพย์มะขาม
9. ชัยพฤกษ์เกษตรไตรพุธ

Before publication, the group will confirm the exact public spelling, address, phone number, opening hours, Google Maps URL, Facebook/website URL, and photos for every record. The spelling above is a working transcription from the supplied graphic, not a final public source of truth.

## 3. Non-goals

- No sub-dealer, partner, or certified-dealer pins, pages, badges, or approval workflow in V1.
- No online payment, product catalogue, or duplicate shopping-list flow.
- No separate domain or standalone website per branch.
- No fabricated claims about expertise, services, qualifications, history, or coverage.

## 4. Information architecture

| Route | Role |
| --- | --- |
| `/` | Map-first group homepage: identity, 50+ year story, interactive Chanthaburi map, branch discovery. |
| `/branches` | Complete accessible branch directory for visitors and crawlers. |
| `/branches/[slug]` | One unique local page for each of the nine owned branches. |
| `/about` | Group history, timeline, values, and brand/network overview. |
| `/stories` | PR/newsroom index. |
| `/stories/[slug]` | A dated, attributable PR story, milestone, expert update, or community item. |
| `/contact` | Group contact route plus branch directory. |

All pages use the same primary domain, allowing group authority and links to compound rather than compete.

## 5. Map-first experience

The homepage map of Chanthaburi is the primary discovery surface.

- Each of the nine branches is represented by a green pin.
- Selecting a pin reveals a compact branch card: public branch name, area/address, phone, open-hours state, and actions for Google Maps, Facebook/website, and the branch page.
- The map has a plain-text branch directory below it and a dedicated `/branches` page for accessibility, low-bandwidth visitors, and search-engine discovery.
- The production map uses verified latitude/longitude rather than guessed pin positions.
- The initial visual design reserves an extensible pin category for future approved partners, but that category is not shown or populated in V1.

## 6. Branch-page contract

Every branch page is an independent local landing page and must contain material that is both accurate and unique to that branch:

- approved branch name and parent-group relationship;
- exact public address, phone, opening hours, Google Maps link, and Facebook/website link;
- local area served and actual services/crop expertise, only when verified;
- real branch/team/location photographs with useful alt text;
- a short factual summary and four to six visible FAQs (for example: location, hours, delivery/contact options, and areas of expertise);
- a clear route to call, open Maps, visit social media, or contact the branch;
- links to relevant group stories and the shared group history.

Each page uses genuinely branch-specific wording and evidence. It must not be a template with only the branch name swapped.

## 7. PR, SEO, and GEO content model

### Trust and citations

The site must make direct answers easy to extract while retaining context and proof:

- one concise answer-ready summary near the top of each branch page;
- visible, accurate FAQs that answer real local discovery questions;
- dated newsroom stories with author/reviewer attribution where relevant;
- internal links between relevant branch pages, stories, and the About page;
- real photos, named sources, dates, and supporting evidence for meaningful claims.

### Newsroom

The newsroom publishes useful, verifiable material rather than keyword-only posts:

- branch milestones and anniversaries;
- farmer and community activities;
- seasonal agriculture updates with clearly identified expertise/review;
- manufacturer or community announcements;
- group history and business milestones.

Each story identifies the associated branch or region and links back to the relevant branch page(s).

### Structured data

- `Organization` on the group identity/About pages.
- `LocalBusiness` on each branch page, with data that matches the visible page and the relevant Google Business Profile.
- `WebSite` and `BreadcrumbList` globally.
- `Article` or `NewsArticle` on published newsroom entries.
- `FAQPage` only where the FAQs are visibly present and accurately answer the page’s subject.

Structured data is validated before release. It supports understanding and eligibility; it does not guarantee rankings or rich-result display.

## 8. Location-data operating model

Maintain one controlled branch-directory source (initially a protected spreadsheet) containing the public facts used by the site.

Required fields:

- canonical branch ID and public name;
- brand and branch slug;
- full Thai address and service area;
- verified latitude/longitude and Google Maps URL;
- public phone, hours, Facebook/website URL;
- one primary image plus additional approved media;
- short local description, verified services/crop focus, and FAQs;
- named record owner and `last reviewed` date.

Publishing validation blocks a branch page from release when its canonical public name, address, phone, hours, Maps URL, or primary image is missing. Broken/absent optional social links must not prevent the main page, call, or Maps action from working.

Each record is reviewed monthly and immediately after a branch move, rebrand, change of hours, contact change, or business-profile change.

## 9. Google Business Profile alignment

The group should add or claim the nine location profiles, then manage access centrally without sharing passwords. Each profile must have:

- the business name used consistently on branch signage and the website;
- the exact location, hours, phone, category, and branch URL;
- real location photos and ongoing review-response ownership;
- one profile per eligible physical business/location, avoiding duplicates.

Nine locations do not meet Google’s stated ten-location threshold for bulk verification. Manage and verify individual eligible locations unless the group later reaches the threshold and satisfies Google’s other conditions.

## 10. Measurement

Primary measures:

- map pin selections;
- Google Maps opens;
- phone-link taps;
- Facebook/website outbound taps;
- branch-page visits and engaged visits;
- branded and local-intent organic search growth;
- crawl/index coverage and branch-query impressions in Search Console;
- monthly checks for whether priority local questions show accurate group/branch information in Google and major AI search products.

The team should avoid claiming an “AI ranking” target. The controllable goal is accurate, well-structured, cited, crawlable public information that answer engines can use.

## 11. Launch sequence

1. Confirm each of the nine branch records; correct the working names and collect factual location/contact data.
2. Collect approved real photos, group-history material, and verified branch-specific descriptions.
3. Build and publish the group home, map, directory, About, Contact, newsroom foundation, and nine branch pages together.
4. Claim/standardize the nine Google Business Profiles and point each to its exact branch URL.
5. Validate mobile UX, map interactions, routes, links, sitemap, canonical URLs, robots directives, and structured data; then submit the sitemap in Search Console.
6. Publish the first set of high-quality PR/newsroom stories and establish monthly accuracy and editorial review.

## 12. Launch acceptance criteria

- Exactly nine owned-branch pins are visible and each opens the correct card and destination links.
- Each pin has a matching, crawlable, indexable, unique branch URL.
- All visible names, addresses, phones, hours, and Maps links have been approved by the record owner.
- Each branch page includes unique local information, real approved imagery, and a working contact route.
- The non-map directory exposes all nine locations without JavaScript dependence.
- Structured data validates without critical errors and matches visible content.
- Sitemap is submitted and no branch page is blocked by login, `noindex`, or robots rules.
- No dealer, partner, or certification claims appear in V1.

## 13. Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Incorrect public branch facts | Use a named owner, a single directory source, approval before launch, and monthly review. |
| Duplicate or inconsistent Google listings | Claim existing listings, retain one eligible profile per location, and use exact matching business facts. |
| Thin or copy-pasted local pages | Require branch-specific evidence, descriptions, photos, and FAQs before publication. |
| Map inaccessible or slow | Provide the static directory fallback and optimize media/mobile performance. |
| Scope creep from dealer/partner network | Keep all dealer/partner data and claims out of V1; design only an extensible future category. |

## 14. Decisions confirmed

- Audience: all nine owned branches in the group.
- Priorities: local branch discovery and group reputation first; enquiry generation third.
- Homepage: map-first Chanthaburi experience.
- Branch interaction: Maps, Facebook/website, branch detail, and contact actions.
- Partner/dealer network: deferred until the group supplies an approval model and records.
- Architecture: one group authority site with nine local branch pages; not nine separate sites and not a map-only directory.
