# Deploy คู่มือ — ขึ้นเว็บจริงด้วย Vercel

**โค้ดเว็บ (private):** https://github.com/Kimchi-Sahapat/chaiyapreuk-agrotech-web
**Host:** Vercel (ฟรีสำหรับงานแบบนี้) — ต่อกับ GitHub แล้ว deploy เองอัตโนมัติ

---

## ขั้นตอน (ครั้งเดียว ~5 นาที)

1. เปิด **https://vercel.com** → **Sign Up** → **Continue with GitHub** → กด Authorize
2. หน้า Dashboard → **Add New… → Project**
3. **Import Git Repository** → หา **`chaiyapreuk-agrotech-web`**
   - ถ้าไม่เห็น กด **Adjust GitHub App Permissions / Configure** → เลือกให้ Vercel เข้าถึง repo นี้
   - แล้วกด **Import**
4. หน้า Configure:
   - **Framework Preset:** Next.js (ตรวจให้อัตโนมัติแล้ว)
   - **Root Directory:** `./` (ปล่อยตามค่าเริ่มต้น — repo นี้คือตัวเว็บทั้งอัน)
   - **Build/Output:** ปล่อยค่าเริ่มต้น
   - **Environment Variables:** ข้ามไปก่อนได้ (ค่อยใส่ `PRODUCTS_SHEET_CSV_URL` ตอนต่อ Google Sheet)
5. กด **Deploy** → รอ ~1–2 นาที
6. ได้ลิงก์จริง เช่น **`chaiyapreuk-agrotech-web.vercel.app`** — เปิดได้จากทุกที่ ทุกเครื่อง

---

## หลัง Deploy

- **อัปเดตอัตโนมัติ:** ทุกครั้งที่มีการ push โค้ดขึ้น GitHub เว็บบน Vercel จะ deploy ใหม่ให้เอง
- **ต่อ Google Sheet (สินค้าสด):** Vercel → Project → Settings → Environment Variables →
  เพิ่ม `PRODUCTS_SHEET_CSV_URL` = ลิงก์ CSV ที่ publish (ดู `google-sheet-live-guide.md`) → Redeploy
- **โดเมนจริง:** Vercel → Settings → Domains → Add → ใส่โดเมนที่จดไว้ (เช่น chaiyapreuk-agrotech.com)
  Vercel จะบอกค่า DNS ให้ไปตั้งที่ผู้ให้บริการโดเมน (ผมช่วยตอนจดโดเมนได้)

---

## หมายเหตุ

- ลิงก์ `.vercel.app` ใช้ทดสอบ/แชร์ได้เลยวันนี้ โดเมนจริงเป็นขั้นต่อไป
- โปรไฟล์/ยอดสะสม ยังเป็นข้อมูลตัวอย่าง (ระบบสมาชิกจริงต่อ CRM = V2)
- LINE `@cyp-agro` ในปุ่มสั่งของ ยังรอยืนยัน LINE ID จริงจาก OA Manager
