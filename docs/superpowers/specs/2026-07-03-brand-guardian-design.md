# Brand Guardian Agent — Design Spec
**Date:** 2026-07-03
**Project:** ชัยพฤกษ์ อโกรเทค Marketing Workspace
**Status:** Approved, pending implementation

---

## Problem

The workspace has multiple content-producing agents (copywriter-agent, content-agent, social-media-agent) but no single enforcement layer. CI rules exist in `design.md` and copy rules exist in `skills/copywriting.md`, but nothing actively checks outputs for compliance. A team member or agent can produce content that violates brand color rules, uses banned superlatives, or omits the required footer — with no catch point.

---

## Solution Overview

Two files:

```
.claude/skills/ci-brand-check.md        ← Shared CI + copy ruleset, output format
.claude/agents/brand-guardian-agent.md  ← Agent that enforces rules in Review and Create modes
```

The skill is the single source of truth for all brand rules. The agent is the human-facing entry point. Other agents can invoke the skill independently as a self-check step.

---

## Architecture

### Skill: `ci-brand-check.md`

A Claude Code skill invoked by the brand-guardian-agent and optionally by other agents.

Contains:
- **Part 1: CI Visual Checklist** — rules for design briefs, post descriptions, layout direction
- **Part 2: Copywriting Style Checklist** — rules for captions, ad copy, scripts, headlines
- **Output format specification** — standardized violation report structure

Does NOT contain: the actual CI values themselves. Those remain in `design.md` as the authoritative source. The skill references `design.md` for specifics.

### Agent: `brand-guardian-agent.md`

The human entry point. Detects mode from the input and routes accordingly.

**Mode detection:**

| Input type | Mode |
|---|---|
| Draft content / caption / copy / design description | Review Mode |
| Brief / topic / product / channel / goal | Create Mode |
| "Rewrite this" + existing content | Review then Rewrite |

**Content type detection (within each mode):**

| Signal | Checklist applied |
|---|---|
| Facebook post / TikTok / LINE / ad copy / caption | Part 2 (Copywriting) + Part 1 if design described |
| Blog article / website article / educational content | Part 3 (Article) — Part 2 rules do NOT apply |
| Design brief / layout direction / post visual | Part 1 (CI Visual) |
| Multiple types present | All applicable parts |

Article mode and Social/Ad copy mode are mutually exclusive rule sets. The agent must detect which one applies before checking and must not cross-apply rules (e.g., penalizing an article for using "เกษตรกร" instead of "คุณ").

---

## Detailed Behavior

### Review Mode

1. Invoke `ci-brand-check` skill
2. Apply Part 1 (visual) if input describes a design; Part 2 (copy) if input is text; both if both present
3. Return structured violation report (see Output Format below)
4. End with Verdict: PASS or NEEDS REVISION

### Create Mode

1. If brief is incomplete, ask for: channel, product/offer, target audience, objective
2. Load `ci-brand-check` rules as pre-flight constraints before writing
3. Select copywriting framework based on objective:
   - Lead/Sale → PAS or AIDA
   - Awareness → Story-Based
   - Retention → Before-After-Bridge
   - Feature explanation → FAB (Benefit-Led)
4. Generate content with CI rules applied from the start
5. Self-check output against the skill
6. Deliver compliant content + short note on framework used

### Review then Rewrite Mode

Run Review Mode first, then apply only Critical fixes automatically. Warning-level issues are flagged with suggestions — human decides.

---

## CI Visual Checklist (Part 1)

| Rule | Severity |
|---|---|
| Green (`#4DB748`) must be the dominant background color | Critical |
| Brand name split: "ชัยพฤกษ์" = Navy `#1B3A8C`, "อโกรเทค" = Red `#E8323C` (standalone text only, not inside logo mark) | Critical |
| Logo always top-left or top-center; never stretched, recolored, or rotated | Critical |
| Footer must include both phone numbers (039-443-372, 092-656-2944) + Facebook + LINE @cyp-agro | Critical |
| Font must be Kanit (ExtraBold / Bold / Regular) — no serif, no script fonts | Warning |
| No dark or black backgrounds | Critical |
| Hero text color: White or Gold (`#FFD700`) only — never black on green | Warning |
| Max 2 font weights per piece, same family | Warning |
| Text readable at 200×200px thumbnail size | Warning |

---

## Copywriting Style Checklist (Part 2)

| Rule | Severity |
|---|---|
| Address reader as "คุณ" — never "เกษตรกร" or "ผู้ใช้" | Warning |
| Start from Pain before introducing product or solution | Warning |
| Use specific numbers only — "40%" not "มาก", "3,000 ราย" not "หลายราย" | Warning |
| One CTA per piece only | Critical |
| No unqualified superlatives — "ดีที่สุด", "เลิศที่สุด" require supporting proof | Critical |
| No ALL CAPS runs longer than one word | Warning |
| No tech jargon (IoT, API, bandwidth, sensor calibration) in farmer-facing copy | Warning |
| Thai-first language; English only for own-brand names (Black Panther, Lucky Group) and distributed brand names (Syngenta, BASF, BAYER, UPL, etc.) | Warning |
| Never write Feature before Benefit | Warning |

---

## Article Writing Style Checklist (Part 3)

For blog articles, educational content, and website posts — distinct from Social/Ad copy rules.

### Structure Rules

| Rule | Severity |
|---|---|
| Open with seasonal/contextual scene-setting ("ช่วงนี้...") before any product mention | Warning |
| Position Chaiyapreuk Agrotech as expert advisor mid-article, not only at the end | Warning |
| Flow: Problem → Cause → Solution → Product (educational, not promotional) | Warning |
| Must include summary bullet section "สรุปคำแนะนำจากชัยพฤกษ์ อโกรเทค" | Critical |
| Must include FAQ section, 8–11 questions, written as questions farmers actually search | Critical |
| Must close with authority statement + contact block (Facebook, TikTok, LINE, tagline) | Critical |

### Language Rules (Article mode)

| Rule | Severity |
|---|---|
| Refer to readers as "เกษตรกร" / "ชาวสวน" — NOT "คุณ" (opposite of ad copy) | Warning |
| Technical terms are permitted — but must be followed immediately by a plain-Thai explanation in the same sentence | Warning |
| Always include regional references: จันทบุรี, ตราด, ระยอง, ภาคตะวันออก where relevant | Warning |
| Sentences may be multi-clause using เพราะ / จึง / เนื่องจาก / อย่างไรก็ตาม — this is correct for articles | (positive rule — do not flag) |
| Own-brand products (Black Panther, Lucky Group) must be introduced educationally as one option among alternatives — never as the sole recommendation | Critical |
| Specific numbers required: pH values, กก./ต้น, กรัมต่อชายทรงพุ่ม, application frequency | Warning |
| Article CTA: only one contact block at the end — no inline conversion CTAs | Warning |

### What MUST NOT appear in articles (article-specific)

| Rule | Severity |
|---|---|
| No hashtags | Warning |
| No promotional urgency language ("วันนี้เท่านั้น!", "สุดพิเศษ!!") | Critical |
| No emoji in body text (allowed only in contact block if brand standard permits) | Warning |
| No ALL CAPS in body text | Warning |

---

## Output Format

```
## CI Brand Check — [content title or type]
**Channel:** [Facebook / TikTok / LINE / Print / etc.]
**Mode:** [Review / Create / Review then Rewrite]

### Violations

**[CRITICAL]** [Rule that was broken]
→ Found: "[exact offending text or description]"
→ Fix: "[corrected version]"

**[WARNING]** [Rule that was broken]
→ Found: "[exact offending text or description]"
→ Suggestion: "[improved version]"

### Verdict
PASS ✅ / NEEDS REVISION ⚠️ — [1-sentence summary]
```

If no violations: output "PASS ✅ — ผ่านการตรวจสอบ CI และ Copywriting ทุกข้อ"

---

## Enforcement Policy

| Severity | Review Mode | Create Mode |
|---|---|---|
| Critical | Flag + provide corrected version | Blocked — rewritten before output |
| Warning | Flag + suggest fix, human decides | Applied as default, noted in output |

---

## Scope Boundaries

- Does NOT auto-publish or push content to any platform
- Does NOT make final decisions on Warning-level items — human retains control
- Does NOT duplicate CI values — always defers to `design.md` for specifics
- Does NOT handle analytics, scheduling, or campaign planning — other agents own those

---

## Integration with Existing Agents

Other agents can invoke `ci-brand-check` as a self-check before delivering output. This is optional — those agents do not need to be rewritten to function. The brand-guardian-agent is the only agent *required* to use the skill.

Recommended integration pattern for other agents:
> "Before returning output, invoke the ci-brand-check skill and include the Verdict in your response."

---

## Files to Create

1. `.claude/skills/ci-brand-check.md` — the shared CI + copy enforcement skill
2. `.claude/agents/brand-guardian-agent.md` — the brand guardian agent

## Files Referenced (not modified)

- `design.md` — authoritative CI source
- `.claude/skills/copywriting.md` — copywriting framework reference
