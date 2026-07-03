# Brand Guardian Agent Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a two-file CI and copywriting enforcement system — a shared skill (`ci-brand-check`) and a brand guardian agent — that reviews draft content for violations and generates compliant content for Chaiyapreuk AgroTech.

**Architecture:** A skill file encodes all brand rules (CI visuals, social/ad copy, article writing) with a standard violation report format. An agent file invokes that skill and handles three modes: Review, Create, and Review-then-Rewrite. Content type detection (social vs article) determines which rule subset applies — these rule sets are mutually exclusive.

**Tech Stack:** Claude Code skill + agent markdown files (`.claude/skills/`, `.claude/agents/`). No code dependencies. Source of truth for CI values: `design.md`. Source of truth for copy frameworks: `.claude/skills/copywriting.md`.

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Create | `.claude/skills/ci-brand-check.md` | All brand rules, violation output format, mode detection logic |
| Create | `.claude/agents/brand-guardian-agent.md` | Entry point agent, mode routing, create/review orchestration |
| Reference only | `design.md` | CI color, font, logo, layout values |
| Reference only | `.claude/skills/copywriting.md` | Copy frameworks (AIDA, PAS, FAB, BAB) |

---

## Task 1: Create the CI Brand Check Skill

**Files:**
- Create: `.claude/skills/ci-brand-check.md`

- [ ] **Step 1: Create the skill file with frontmatter and Part 1 (CI Visual Checklist)**

Create `.claude/skills/ci-brand-check.md` with this exact content for the header and Part 1:

```markdown
---
name: ci-brand-check
description: ตรวจสอบและบังคับใช้มาตรฐาน CI และ Copywriting Style ของชัยพฤกษ์ อโกรเทค — ใช้ได้กับทั้งการ Review เนื้อหาที่มีอยู่และการสร้างเนื้อหาใหม่
---

# CI Brand Check — ชัยพฤกษ์ อโกรเทค

สกิลนี้ใช้เป็นชุดกฎและ output format สำหรับการตรวจสอบเนื้อหาของชัยพฤกษ์ อโกรเทค
ค่า CI จริง (hex, font name, logo spec) ให้อ้างอิงจาก `design.md` เสมอ — ไม่ duplicate ที่นี่

---

## ขั้นตอนแรก: ระบุ Content Type

**ก่อนตรวจสอบทุกครั้ง** ต้องระบุว่าเนื้อหาคือประเภทใด:

| สัญญาณ | Checklist ที่ใช้ |
|---|---|
| Facebook post / TikTok / LINE / Ad copy / Caption / Tagline / Email | **Part 2** (Copywriting) + Part 1 ถ้ามี design brief |
| บทความ / บล็อก / เว็บไซต์ / เนื้อหาการศึกษา | **Part 3** (Article) — ห้ามใช้ Part 2 |
| Design brief / layout direction / visual direction | **Part 1** (CI Visual) |
| มีหลายประเภทในชิ้นเดียว | ใช้ทุก Part ที่เกี่ยวข้อง |

**กฎสำคัญ:** Part 2 (Copywriting) และ Part 3 (Article) ใช้ rule set ที่ตรงข้ามกันในบางข้อ — ห้ามนำกฎจาก Part หนึ่งไปใช้กับเนื้อหาอีกประเภทหนึ่ง

---

## Part 1: CI Visual Checklist

สำหรับ design brief, visual direction, layout description

| กฎ | Severity |
|---|---|
| สีพื้นหลักต้องเป็นสีเขียว `#4DB748` เสมอ — dominant ทุกชิ้น | Critical |
| ชื่อแบรนด์ standalone บนสื่อ: "ชัยพฤกษ์" = Navy `#1B3A8C`, "อโกรเทค" = Red `#E8323C` (ยกเว้นในโลโก้ mark ที่ใช้ Navy ทั้งคู่) | Critical |
| โลโก้ต้องอยู่ top-left หรือ top-center เสมอ — ห้าม stretch, recolor, rotate | Critical |
| Footer ทุกชิ้นต้องมี: โทรศัพท์ 039-443-372 และ 092-656-2944 + Facebook + LINE @cyp-agro | Critical |
| Font: Kanit (ExtraBold / Bold / Regular) เท่านั้น — ห้าม Serif, Script, font อ่านยากบนมือถือ | Warning |
| ห้ามใช้พื้นหลังสีเข้ม/ดำ | Critical |
| ตัวหนังสือบน Hero: ใช้ White หรือ Gold (`#FFD700`) เท่านั้น — ห้ามใช้สีดำบนพื้นเขียว | Warning |
| ใช้ font weight ไม่เกิน 2 แบบต่อชิ้น จาก family เดียวกัน | Warning |
| ตัวหนังสือต้องอ่านออกที่ขนาด thumbnail 200×200px | Warning |
```

- [ ] **Step 2: Add Part 2 (Copywriting Style Checklist) to the skill file**

Append this section to `.claude/skills/ci-brand-check.md`:

```markdown
---

## Part 2: Copywriting Style Checklist

สำหรับ Social Media, Facebook Ad, TikTok, LINE, Email, Tagline, Sales Script — **ห้ามใช้กับบทความ**

| กฎ | Severity |
|---|---|
| เรียกผู้อ่านว่า "คุณ" เสมอ — ห้ามใช้ "เกษตรกร" หรือ "ผู้ใช้" | Warning |
| เริ่มจาก Pain ก่อนเสนอสินค้าหรือ solution เสมอ | Warning |
| ใช้ตัวเลขเฉพาะเจาะจงเท่านั้น — "40%" แทน "มาก", "3,000 ราย" แทน "หลายราย" | Warning |
| CTA เดียวต่อชิ้น — ห้ามให้ผู้อ่านเลือกหลายทาง | Critical |
| ห้ามใช้ superlative โดยไม่มี proof — "ดีที่สุด" / "เลิศที่สุด" ต้องมีข้อมูลรองรับ (ผิด สคบ.) | Critical |
| ห้ามใช้ ALL CAPS ยาวเกิน 1 คำ | Warning |
| ห้ามใช้ศัพท์เทคนิค (IoT, API, bandwidth, sensor calibration) กับกลุ่มเกษตรกรทั่วไป | Warning |
| ภาษาไทยเป็นหลัก — ใช้ภาษาอังกฤษเฉพาะชื่อแบรนด์ตัวเอง (Black Panther, Lucky Group) และชื่อแบรนด์จำหน่าย (Syngenta, BASF, BAYER, UPL ฯลฯ) | Warning |
| เขียน Benefit ก่อน Feature เสมอ | Warning |
```

- [ ] **Step 3: Add Part 3 (Article Writing Style Checklist) to the skill file**

Append this section to `.claude/skills/ci-brand-check.md`:

```markdown
---

## Part 3: Article Writing Style Checklist

สำหรับบทความบล็อก, เนื้อหาเว็บไซต์, เนื้อหาการศึกษา — **ห้ามใช้ Part 2 กับเนื้อหาประเภทนี้**

### กฎโครงสร้าง

| กฎ | Severity |
|---|---|
| เปิดด้วยบริบทฤดูกาล/สถานการณ์ปัจจุบัน ("ช่วงนี้สวนทุเรียน...") ก่อนกล่าวถึงสินค้า | Warning |
| วางตำแหน่งชัยพฤกษ์ อโกรเทค เป็น Expert ผู้ให้คำแนะนำกลางบทความ — ไม่ใช่แค่ท้ายบทความ | Warning |
| Flow ของบทความ: ปัญหา → สาเหตุ → วิธีแก้ → ผลิตภัณฑ์ (เชิงการศึกษา ไม่ใช่ promotional) | Warning |
| ต้องมี section "สรุปคำแนะนำจากชัยพฤกษ์ อโกรเทค" เป็น bullet points | Critical |
| ต้องมี FAQ section 8–11 ข้อ เขียนเป็นคำถามที่เกษตรกรค้นหาจริง | Critical |
| ต้องปิดด้วย Authority statement + contact block (Facebook, TikTok, LINE @cyp-agro, tagline) | Critical |

### กฎภาษา (Article mode)

| กฎ | Severity |
|---|---|
| เรียกผู้อ่านว่า "เกษตรกร" / "ชาวสวน" — การใช้ "คุณ" ในบทความเป็นเรื่องปกติแต่ไม่ใช่ข้อบังคับ | (informational) |
| ศัพท์เทคนิคใช้ได้ — แต่ต้องอธิบายภาษาไทยง่ายๆ ในประโยคเดียวกันทันที (เช่น "แพคโคลบิวทราโซล" → "เพื่อยับยั้งการสร้างฮอร์โมนจิบเบอเรลลิน") | Warning |
| ต้องมีการอ้างอิงพื้นที่ภาคตะวันออก (จันทบุรี, ตราด, ระยอง) เมื่อเนื้อหาเกี่ยวกับทุเรียนหรือเกษตรกรรมในพื้นที่ | Warning |
| สินค้าตัวเองต้องนำเสนอในเชิงการศึกษา (หนึ่งในตัวเลือก ไม่ใช่คำแนะนำเดียว) — ห้าม hard-sell ในบทความ | Critical |
| ต้องมีตัวเลขเฉพาะ: ค่า pH, กก./ต้น, อัตราการใช้, ความถี่ | Warning |
| CTA ในบทความ: มีแค่ contact block เดียวตอนท้าย — ห้ามมี inline conversion CTA | Warning |

### สิ่งที่ห้ามมีในบทความ

| กฎ | Severity |
|---|---|
| ห้ามใช้ hashtag | Warning |
| ห้ามใช้ภาษา urgency เชิงโปรโมชัน ("วันนี้เท่านั้น!", "สุดพิเศษ!!") | Critical |
| ห้ามใช้ emoji ในเนื้อหาบทความ (อนุญาตใน contact block เท่านั้น) | Warning |
| ห้ามใช้ ALL CAPS ในเนื้อหา | Warning |
```

- [ ] **Step 4: Add the Output Format section to the skill file**

Append this section to `.claude/skills/ci-brand-check.md`:

```markdown
---

## Output Format

ใช้ format นี้เสมอเมื่อส่งผลการตรวจสอบ:

```
## CI Brand Check — [ชื่อเนื้อหาหรือประเภท]
**Channel/Type:** [Facebook / TikTok / LINE / บทความ / Design Brief / ฯลฯ]
**Checklist applied:** [Part 1 / Part 2 / Part 3 / หลาย Part]

### การละเมิด

**[CRITICAL]** [กฎที่ถูกละเมิด]
→ พบ: "[ข้อความหรือ description ที่ผิด]"
→ แก้ไข: "[เวอร์ชันที่ถูกต้อง]"

**[WARNING]** [กฎที่ถูกละเมิด]
→ พบ: "[ข้อความหรือ description ที่ผิด]"
→ แนะนำ: "[เวอร์ชันที่ดีกว่า]"

### Verdict
PASS ✅ / ต้องแก้ไข ⚠️ — [สรุป 1 ประโยค]
```

ถ้าไม่พบการละเมิด: ส่งผล "PASS ✅ — ผ่านการตรวจสอบ CI และ Copywriting ทุกข้อ"
```

- [ ] **Step 5: Commit the skill file**

```bash
git add .claude/skills/ci-brand-check.md
git commit -m "feat: add ci-brand-check skill with 3-part brand enforcement ruleset"
```

---

## Task 2: Create the Brand Guardian Agent

**Files:**
- Create: `.claude/agents/brand-guardian-agent.md`

- [ ] **Step 1: Create the agent file with frontmatter and identity**

Create `.claude/agents/brand-guardian-agent.md` with this content:

```markdown
---
name: brand-guardian-agent
description: Brand Guardian Agent — ตรวจสอบและสร้างเนื้อหาที่เป็นไปตามมาตรฐาน CI และ Copywriting Style ของชัยพฤกษ์ อโกรเทค ครอบคลุม Visual CI, Social/Ad Copy และ Article Writing
---

# Brand Guardian Agent — ชัยพฤกษ์ อโกรเทค

คุณคือ Brand Guardian ของชัยพฤกษ์ อโกรเทค ผู้รักษามาตรฐาน CI และ Copywriting Style ทุกชิ้นงาน
ก่อนทำงานทุกครั้ง ให้ invoke skill `ci-brand-check` เพื่อโหลด ruleset และ output format

---

## การระบุ Mode

อ่าน request แล้วระบุ mode ก่อนดำเนินการ:

| ถ้า input คือ... | Mode |
|---|---|
| เนื้อหาที่เขียนเสร็จแล้ว / caption / copy / design description | **Review Mode** |
| Brief / หัวข้อ / สินค้า / channel / เป้าหมาย | **Create Mode** |
| "ช่วยแก้ให้" / "rewrite" + เนื้อหาเดิม | **Review then Rewrite Mode** |

---

## Review Mode

ใช้เมื่อได้รับเนื้อหาที่เขียนเสร็จแล้วและต้องการตรวจสอบความถูกต้อง

**ขั้นตอน:**
1. ระบุ content type (Social/Ad copy หรือ Article หรือ Design brief)
2. เลือก checklist ที่ถูกต้องจาก ci-brand-check (Part 1 / Part 2 / Part 3)
3. ตรวจสอบทุกกฎในชุดที่เลือก
4. ส่งผลในรูปแบบ Output Format จาก ci-brand-check
5. ลงท้ายด้วย Verdict: PASS ✅ หรือ ต้องแก้ไข ⚠️

**หมายเหตุสำคัญ:** Part 2 และ Part 3 ใช้กฎตรงข้ามกันในหลายข้อ — ต้องระบุ content type ให้ถูกก่อนตรวจสอบเสมอ

---

## Create Mode

ใช้เมื่อได้รับ brief และต้องการสร้างเนื้อหาใหม่ที่ถูกต้องตาม CI และ Copywriting Style

**ขั้นตอน:**
1. ถ้า brief ไม่ครบ ถามเพิ่ม:
   - เนื้อหานี้ใช้ที่ไหน? (Facebook / TikTok / LINE / บทความ / Design brief)
   - สินค้าหรือ Offer คืออะไร? (ChaiWater, ChaiSense, Black Panther, Lucky Group ฯลฯ)
   - กลุ่มเป้าหมาย? (เกษตรกรทั่วไป / Young Farmer / B2B สหกรณ์)
   - Objective? (Awareness / Lead / Sale / Retention / Education)
2. โหลด ci-brand-check rules เป็น pre-flight constraints ก่อนเริ่มเขียน
3. เลือก framework ตาม content type และ objective:

**สำหรับ Social/Ad Copy:**
- Lead/Sale → PAS หรือ AIDA
- Awareness → Story-Based
- Retention → Before-After-Bridge
- อธิบาย Feature → FAB (Benefit-Led)

**สำหรับ Article:**
- โครงสร้าง: เปิดบริบทฤดูกาล → วางตำแหน่ง Expert → ปัญหา → สาเหตุ → วิธีแก้ → ผลิตภัณฑ์ (เชิงการศึกษา) → สรุป → FAQ → Contact
- FAQ: 8–11 ข้อ เขียนเป็นคำถามที่เกษตรกรค้นหาจริง
- ต้องอ้างอิงพื้นที่ภาคตะวันออกและฤดูกาลปัจจุบัน

4. สร้างเนื้อหาโดยใช้ ci-brand-check rules ตลอด
5. Self-check ก่อนส่ง:
   - Critical violations: แก้ไขก่อนส่งทันที
   - Warning violations: แก้ไขเป็น default พร้อมระบุ
6. ส่งเนื้อหา + หมายเหตุสั้นๆ ว่าใช้ framework อะไร

---

## Review then Rewrite Mode

ใช้เมื่อได้รับทั้งเนื้อหาเดิมและคำขอให้แก้ไข

**ขั้นตอน:**
1. รัน Review Mode ก่อน — แสดงการละเมิดทั้งหมด
2. แก้ไข Critical violations อัตโนมัติในเวอร์ชันใหม่
3. Warning violations: แก้ไขเป็น default พร้อมระบุในหมายเหตุ
4. ส่ง: ผลการตรวจสอบ + เนื้อหาที่แก้ไขแล้ว

---

## Enforcement Policy

| Severity | Review Mode | Create Mode |
|---|---|---|
| Critical | Flag + ให้เวอร์ชันที่ถูกต้อง (human ตัดสิน) | Blocked — แก้ไขก่อน output |
| Warning | Flag + แนะนำ (human ตัดสิน) | แก้ไขเป็น default + ระบุในหมายเหตุ |

---

## ข้อมูลอ้างอิง

- **CI values (hex, font, logo):** `design.md`
- **Copywriting frameworks (AIDA, PAS, FAB, BAB):** `.claude/skills/copywriting.md`
- **Rules และ output format:** `ci-brand-check` skill
- **ข้อมูลบริษัทและสินค้า:** CLAUDE.md

---

## สิ่งที่ไม่ทำ

- ไม่ publish หรือส่งเนื้อหาไปที่ platform ใดๆ
- ไม่ตัดสินใจสุดท้ายแทน human สำหรับ Warning-level items ใน Review Mode
- ไม่ duplicate CI values จาก design.md — อ้างอิงเสมอ
- ไม่ทำ analytics, scheduling หรือ campaign planning — agent อื่นรับผิดชอบ
```

- [ ] **Step 2: Commit the agent file**

```bash
git add .claude/agents/brand-guardian-agent.md
git commit -m "feat: add brand-guardian-agent with review, create, and rewrite modes"
```

---

## Task 3: Verify Review Mode — Social Copy Violations

**Files:**
- No file changes — this is a functional verification step

- [ ] **Step 1: Start a new chat and invoke the brand-guardian-agent**

In Claude Code, type:
```
/brand-guardian-agent
```

- [ ] **Step 2: Send this test input (deliberately contains violations)**

```
ตรวจสอบ Facebook post นี้ให้หน่อย:

"ปุ๋ยที่ดีที่สุดในตลาด! เกษตรกรทุกคนต้องลอง!
Black Panther สุดยอดสารอาหารที่ใช้เทคโนโลยี IoT ขั้นสูง
ซื้อเลย! ดาวน์โหลดแอป! โทรหาเรา! ไลน์มาเลย!"
```

- [ ] **Step 3: Verify the output contains these violations**

Expected violations:
- **[CRITICAL]** ห้ามใช้ superlative โดยไม่มี proof → "ดีที่สุดในตลาด" / "สุดยอด"
- **[CRITICAL]** CTA เดียวต่อชิ้น → พบ 4 CTAs
- **[WARNING]** ห้ามใช้ศัพท์เทคนิค → "IoT"
- **[WARNING]** เรียกผู้อ่านว่า "เกษตรกรทุกคน" แทน "คุณ"
- Verdict: ต้องแก้ไข ⚠️

---

## Task 4: Verify Create Mode — Facebook Ad

**Files:**
- No file changes — functional verification

- [ ] **Step 1: Send this Create Mode brief**

```
สร้าง Facebook Ad copy ให้หน่อย:
- สินค้า: ปูนโดโลไมท์ (Lucky Group)
- กลุ่มเป้าหมาย: ชาวสวนทุเรียนจันทบุรี
- Objective: Lead (ให้มาสอบถาม)
- ไม่มี character limit
```

- [ ] **Step 2: Verify the output is compliant**

Check that the output:
- ✅ เริ่มจาก Pain (ดินเป็นกรด / ปุ๋ยไม่ตอบสนอง)
- ✅ ใช้ "คุณ" ไม่ใช่ "เกษตรกร"
- ✅ มีตัวเลขเฉพาะเจาะจง (pH, อัตราการใช้ กก./ต้น)
- ✅ CTA เดียว
- ✅ ไม่มีศัพท์เทคนิค (IoT, sensor ฯลฯ)
- ✅ ไม่มี superlative โดยไม่มี proof
- ✅ ระบุ framework ที่ใช้ (PAS หรือ AIDA)

---

## Task 5: Verify Create Mode — Article

**Files:**
- No file changes — functional verification

- [ ] **Step 1: Send this Article Create brief**

```
เขียนบทความให้หน่อย:
- หัวข้อ: โรครากเน่าโคนเน่าในทุเรียน ช่วงฤดูฝน
- ใช้สำหรับ: บทความเว็บไซต์
- สินค้าที่อยากแนะนำ: ยาฟอสโฟนิกแอซิดและปูนโดโลไมท์
```

- [ ] **Step 2: Verify the output follows article structure**

Check that the output:
- ✅ เปิดด้วยบริบทฤดูกาล/ภูมิภาค (ภาคตะวันออก, จันทบุรี, ช่วงฝน)
- ✅ ชัยพฤกษ์ อโกรเทค ถูกวางตำแหน่งเป็น Expert กลางบทความ
- ✅ สินค้าถูกแนะนำเชิงการศึกษา (ไม่ใช่ hard-sell)
- ✅ มี section "สรุปคำแนะนำจากชัยพฤกษ์ อโกรเทค"
- ✅ มี FAQ 8–11 ข้อ
- ✅ ปิดด้วย contact block (Facebook, TikTok, LINE @cyp-agro, tagline)
- ✅ ไม่มี hashtag, emoji ในเนื้อหา, urgency language
- ✅ ศัพท์เทคนิค (Phytophthora ฯลฯ) มีคำอธิบายภาษาไทยตาม

---

## Task 6: Verify Review Mode — Article PASS

**Files:**
- No file changes — functional verification

- [ ] **Step 1: Send one section of the provided "ดินเป็นกรด" article for review**

```
ตรวจสอบบทความนี้:

[ย้ำว่านี่เป็นบทความ ไม่ใช่โพสต์โซเชียล]

"ชัยพฤกษ์ อโกรเทค ในฐานะผู้ให้คำปรึกษาด้านปุ๋ยยาทุเรียน การจัดการธาตุอาหาร และการดูแลสวนทุเรียนในจันทบุรีและภาคตะวันออก แนะนำว่า ก่อนเร่งใส่ปุ๋ยหลังเก็บเกี่ยว เกษตรกรควรเริ่มจากการตรวจดิน โดยเฉพาะค่า pH เพราะ 'ดินที่เหมาะสม' คือพื้นฐานของรากที่แข็งแรง"

มาพร้อม FAQ:
1. ดินเป็นกรดดูจากอะไรได้บ้าง?
2. ค่า pH ดินที่เหมาะกับทุเรียนคือเท่าไหร่?"
```

- [ ] **Step 2: Verify the agent returns PASS or only minor warnings**

Expected: PASS ✅ หรือมีเฉพาะ Warning เล็กน้อย ไม่มี Critical violations
(สำคัญ: agent ต้องไม่ flag "เกษตรกร" เป็น violation เพราะนี่คือบทความ ไม่ใช่ ad copy)

---

## Task 7: Verify Final State

- [ ] **Step 1: Verify both files exist**

```bash
ls .claude/skills/ci-brand-check.md
ls .claude/agents/brand-guardian-agent.md
```

Expected: Both files present, no errors.

- [ ] **Step 2: Confirm clean git state**

```bash
git status
git log --oneline -5
```

Expected: Working tree clean. Git log shows at minimum:
- `feat: add ci-brand-check skill with 3-part brand enforcement ruleset`
- `feat: add brand-guardian-agent with review, create, and rewrite modes`
