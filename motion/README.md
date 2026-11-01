# Motion — วิดีโอโมชั่นกราฟิกของ ชัยพฤกษ์ อโกรเทค

Kinetic typography · motion graphics · explainer animation สำหรับ **Facebook Reels / TikTok / FB feed / LINE OA** — ตรง CI, อ่านภาษาไทยง่ายบนมือถือ, ผ่านกฎโฆษณาเคมีเกษตร และ render เป็น MP4 ได้ในเครื่อง (ไม่มีค่า license)

## ใช้งานยังไง (ง่ายสุด)
บอก Claude Code ในรีโปนี้ เช่น
> "ทำคลิป Reels 20 วิ เรื่อง 'ไม่รู้ชื่อสินค้าก็ถามได้' ช่วงสะสมอาหารทุเรียน"
> "ทำ storyboard คลิปอธิบายวิธีส่งรูปฉลากทางไลน์ ให้ทีมไปตัดใน CapCut"

Skill **`motion-graphics`** (`.claude/skills/motion-graphics/`) จะพาทำ: brief → script → storyboard → สร้างคลิป → ตรวจอัตโนมัติ → render MP4 + ภาพปก

## ทำเอง / ตรวจเอง
```bash
# ดูตัวอย่างสด: เปิดไฟล์ในเบราว์เซอร์ (Space เล่น/หยุด · ←/→ ทีละเฟรม · G เส้น safe zone · ปุ่ม Check)
open motion/videos/2026-11-ask-first/index.html

node motion/render/render.mjs motion/videos/2026-11-ask-first/index.html --sheet 12   # ตรวจ + contact sheet
node motion/render/render.mjs motion/videos/2026-11-ask-first/index.html             # MP4 + poster → motion/out/
```
ต้องมี Node 18+, ffmpeg, Playwright + Chromium (ใน Claude Code cloud มีให้แล้ว; เครื่องตัวเอง: `npm i -g playwright && npx playwright install chromium`)

## โครงสร้าง
| Path | คืออะไร |
|---|---|
| `research/` | งานวิจัย "อะไรคือดี" ของ kinetic type / motion graphics / explainer + กฎหมาย/เพลง/เสียง + เหตุผลเลือกเครื่องมือ (มีแหล่งอ้างอิง) — เริ่มที่ [research/README.md](research/README.md) |
| `kit/` | `cyp-motion.js` (timeline + preset + **lint CI/อ่านง่าย/safe zone**), `cyp-motion.css` (components แบรนด์), ฟอนต์ Kanit (OFL) |
| `render/render.mjs` | HTML → MP4 (H.264 30fps + AAC), poster 1 วิ, contact sheet, flash screen, SFX สังเคราะห์ (ไม่ติดลิขสิทธิ์) |
| `templates/` | ตั้งต้น: `promo-916/` (โปร/โมชั่นกราฟิก) · `explainer-916/` (คลิปอธิบาย) |
| `videos/` | งานจริง 1 โฟลเดอร์ต่อ 1 คลิป (`brief.md`, `storyboard.md`, `index.html`, `assets/`) — ตัวอย่างอ้างอิง: `2026-11-ask-first/` |
| `assets/brand/logo.js` | ⚠️ **โลโก้ placeholder** (วาดตามคำบรรยายใน design.md) — ใส่ไฟล์โลโก้ทางการแล้วตั้ง `CYP_LOGO_SRC` |
| `out/` | ไฟล์ render (ไม่ commit) |

## รอข้อมูล / รอตัดสินใจ
- [ ] **ไฟล์โลโก้ทางการ** (PNG พื้นใส หรือ SVG แปลงตัวอักษรเป็น outline)
- [ ] ยืนยัน proposal ด้าน motion CI: header pill บน 9:16, end card แทน footer บน 9:16, line-height 1.25–1.3 สำหรับหัวข้อไทยหลายบรรทัด, การ animate โลโก้ (ตอนนี้ใช้แค่ scale+fade)
- [ ] เลือกแหล่งเพลง/เสียงที่มีไลเซนส์ข้ามแพลตฟอร์ม + ผู้ให้บริการเสียงพากย์ไทย (ทดสอบฟังแบบ blind — research/04 §6)
- [ ] คลังภาพจริง (สวน ชาวสวน ทีมงาน pack shot) สำหรับ explainer แบบ photo-real hybrid
- [ ] ตัวเลข KPI จริง (ตอนนี้เป็น placeholder ตาม CLAUDE.md)
