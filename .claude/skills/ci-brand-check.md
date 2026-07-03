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
| Facebook post / TikTok / LINE / Ad copy / Caption / Tagline / Email โปรโมชัน | **Part 2** (Copywriting) + Part 1 ถ้ามี design brief |
| Newsletter บทความ / Email เนื้อหาการศึกษา | **Part 3** (Article) |
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
| เรียกผู้อ่านว่า "เกษตรกร" / "ชาวสวน" เป็นหลัก — นี่คือ article ไม่ใช่ ad copy ไม่ต้องใช้ "คุณ" เสมอ | (informational — ห้าม flag ว่าเป็น violation) |
| ศัพท์เทคนิคใช้ได้ — แต่ต้องอธิบายภาษาไทยง่ายๆ ในประโยคเดียวกันทันที เช่น "แพคโคลบิวทราโซล เพื่อยับยั้งการสร้างฮอร์โมนจิบเบอเรลลิน" | Warning |
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

**หมายเหตุ:** กฎที่ระบุว่า "(informational — ห้าม flag ว่าเป็น violation)" ไม่ต้องรายงานในผลลัพธ์เลย — ข้ามได้ทันที ไม่ต้องใช้ token พิเศษ
