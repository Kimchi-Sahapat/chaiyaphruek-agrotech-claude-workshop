# คู่มือเชื่อม LINE OA (`@cyp-agro`) เข้า Claude Code ผ่าน MCP

**Channel ID:** `2008825608` · Messaging API: Enabled
⚠️ **Channel นี้มีระบบ GiveawayGrow ใช้ webhook อยู่จริง — ห้ามแตะ Webhook URL และห้าม Reissue long-lived token**

---

## 🚨 อ่านก่อน — ทำไม "ห้ามกด Issue/Reissue token ใน Console"

LINE มี channel access token 4 แบบ:

| แบบ | อายุ | จำนวนสูงสุด/channel | กระทบระบบเดิมไหม |
|---|---|---|---|
| **Long-lived** | ไม่หมดอายุ | **1 ตัวเท่านั้น** | 🔴 **กด Reissue = ตัวเดิมใช้ไม่ได้ทันที → GiveawayGrow พัง** |
| Channel access token v2.1 | 30 วัน | 30 | 🟢 ไม่กระทบ (แต่ต้องลงทะเบียน Assertion Signing Key ใน Console) |
| Short-lived | 30 วัน | 30 | 🟢 ไม่กระทบ |
| **Stateless** | **15 นาที** | **ไม่จำกัด** | 🟢 **ไม่กระทบเลย — ใช้แค่ Channel ID + Channel Secret** |

> LINE ระบุไว้ตรง ๆ: *"Reissuing a long-lived channel access token will invalidate the currently active long-lived channel access token."*

**เราจึงเลือกใช้ Stateless token** — เพราะ:
1. ใช้แค่ **Channel ID + Channel Secret** ที่พี่มีอยู่แล้ว → **ไม่ต้องเข้า Developers Console เลย** (แก้ปัญหา "Provider not found" ไปในตัว)
2. ออกได้ไม่จำกัด ไม่ revoke ตัวอื่น → **GiveawayGrow ไม่ได้รับผลกระทบ 100%**

**ข้อจำกัดที่ต้องรู้:** token อายุ 15 นาที — [scripts/line-mcp-launch.mjs](scripts/line-mcp-launch.mjs) จะขอ token ใหม่ทุกครั้งที่ MCP server start แต่ถ้าใช้งานเกิน 15 นาทีในเซสชันเดียว จะเจอ error 401 → แก้โดย **reconnect MCP** (`/mcp` → reconnect) เพื่อขอ token ใหม่

---

## ขั้นที่ 1 — เอา Channel Secret (ไม่ต้องเข้า Developers Console)

1. เข้า https://manager.line.biz → เลือก OA **ชัยพฤกษ์ อโกรเทค**
2. **Settings (ตั้งค่า) → Messaging API**
3. จะเห็น **Channel ID** (`2008825608`), **Channel secret**, และ **ชื่อ Provider** ที่ถือ channel นี้
   - 📌 จด **ชื่อ Provider** ไว้ด้วย — ใช้แก้ปัญหา "Provider not found" ในขั้นที่ 5

## ขั้นที่ 2 — ตั้ง Environment Variables

เปิด **PowerShell** รัน (แทนค่าจริง):

```powershell
[Environment]::SetEnvironmentVariable('LINE_CHANNEL_ID','2008825608','User')
[Environment]::SetEnvironmentVariable('LINE_CHANNEL_SECRET','<วาง channel secret>','User')
```

> `DESTINATION_USER_ID` ยังไม่ต้องตั้งตอนนี้ — ดูขั้นที่ 4

ตรวจสอบ (เปิด PowerShell **หน้าต่างใหม่**):

```powershell
$env:LINE_CHANNEL_ID; $env:LINE_CHANNEL_SECRET.Length
```

## ขั้นที่ 3 — Restart VSCode แล้วเช็ก connection

env var ใหม่จะถึง Claude Code ต่อเมื่อ **ปิด VSCode แล้วเปิดใหม่** (reload window ไม่พอ)
→ เปิดมาแล้ว Approve MCP server `line-bot` → พิมพ์ `/mcp` ต้องเห็นสถานะ **connected**

ทดสอบเองก่อนได้จาก PowerShell:
```powershell
node "scripts/line-mcp-launch.mjs"
```
ถ้าขึ้น `ได้ stateless token แล้ว (อายุ 900s)` = credential ถูกต้อง (กด Ctrl+C ปิดได้)

## ขั้นที่ 4 — หา `DESTINATION_USER_ID`

⚠️ วิธีมาตรฐานคือ Developers Console → **Basic settings → Your user ID** แต่พี่เข้าไม่ได้ตอนนี้

**ทางเลี่ยงที่ทำได้ทันที** — ให้ผมเรียก `get_follower_ids` แล้ว `get_profile` ไล่หา display name ของพี่
(⚠️ `get_follower_ids` ใช้ได้เฉพาะ OA ที่ verified/premium — ถ้า error ต้องกลับไปใช้ Console)

ได้ user ID (`U...`) แล้วตั้ง:
```powershell
[Environment]::SetEnvironmentVariable('LINE_DESTINATION_USER_ID','U<user id>','User')
```

## ขั้นที่ 5 — แก้ "Provider not found" (ถ้ายังอยากเข้า Console)

ไม่จำเป็นสำหรับ MCP แล้ว แต่ควรแก้ไว้ — ดูหัวข้อวิเคราะห์ด้านล่าง

---

## ลำดับการทดสอบ (ตามที่ตกลงกันไว้)

1. ✅ `get_message_quota` — read-only ไม่ส่งอะไรออก ปลอดภัยที่สุด → ทดสอบตัวแรก
2. ✅ `push_text_message` → ส่งหา `DESTINATION_USER_ID` ของพี่คนเดียว
3. 🚫 `broadcast_text_message` / `broadcast_flex_message` / `create_rich_menu` / `delete_rich_menu` / `set_rich_menu_default` / `cancel_rich_menu_default`
   → **ต้องขอคำยืนยันจากพี่ทุกครั้ง ไม่มีข้อยกเว้น**

---

## Environment variables — สรุป

| ตัวแปรที่พี่ตั้ง (Windows User) | ตัวที่ MCP server อ่านจริง | หมายเหตุ |
|---|---|---|
| `LINE_CHANNEL_ID` | — | launcher ใช้ขอ stateless token |
| `LINE_CHANNEL_SECRET` | — | launcher ใช้ขอ stateless token |
| — | **`CHANNEL_ACCESS_TOKEN`** | launcher เซ็ตให้อัตโนมัติ (บังคับ) |
| `LINE_DESTINATION_USER_ID` | **`DESTINATION_USER_ID`** | ไม่บังคับ — ถ้า tool ไม่ระบุ userId ถึงจะใช้ |
| `LINE_CHANNEL_ACCESS_TOKEN` | `CHANNEL_ACCESS_TOKEN` | ไม่บังคับ — ถ้าตั้งไว้จะข้ามการขอ stateless |

**ไม่มี secret ใด ๆ อยู่ใน [.mcp.json](.mcp.json) หรือไฟล์ในโปรเจกต์** — อยู่ใน Windows env var เท่านั้น

---

## เครื่องมือที่ได้ (12 tools)

| Tool | ใช้ทำอะไร | ระดับความเสี่ยง |
|---|---|---|
| `get_message_quota` | เช็กโควตาข้อความคงเหลือของเดือน | 🟢 อ่านอย่างเดียว |
| `get_profile` | ดูโปรไฟล์ user (ชื่อ รูป สถานะ) | 🟢 อ่านอย่างเดียว |
| `get_follower_ids` | ดึงรายชื่อ user ID ผู้ติดตาม | 🟢 อ่านอย่างเดียว |
| `get_rich_menu_list` | ดูรายการ rich menu | 🟢 อ่านอย่างเดียว |
| `push_text_message` | ส่งข้อความหาลูกค้ารายคน | 🟡 ส่งจริง |
| `push_flex_message` | ส่ง Flex message (การ์ดสินค้า/โปรฯ) รายคน | 🟡 ส่งจริง |
| `broadcast_text_message` | บรอดแคสต์หาผู้ติดตามทั้งหมด | 🔴 ต้องยืนยัน |
| `broadcast_flex_message` | บรอดแคสต์ Flex ทั้งหมด | 🔴 ต้องยืนยัน |
| `create_rich_menu` / `delete_rich_menu` / `set_rich_menu_default` / `cancel_rich_menu_default` | จัดการ Rich Menu | 🔴 ต้องยืนยัน — กระทบ UI ของ OA ที่ลูกค้าเห็น |

---

## ⚠️ ข้อควรระวังเพิ่มเติม

- **ห้ามแก้ Webhook URL** — GiveawayGrow ใช้อยู่ MCP server ตัวนี้ **ไม่ยุ่งกับ webhook** (มีแต่ tool ฝั่งส่งออก) จึงปลอดภัยโดยตัวมันเอง
- Rich menu ปัจจุบันอาจเป็นของ GiveawayGrow — **`delete_rich_menu` / `set_rich_menu_default` อาจทำ flow เดิมพัง** ต้องเช็ก `get_rich_menu_list` ก่อนเสมอ
- โควตาข้อความฟรีของ LINE OA จำกัดต่อเดือน + GiveawayGrow ก็กินโควตาเดียวกัน → เช็ก `get_message_quota` ก่อนส่งจำนวนมาก

---

## แหล่งอ้างอิง

- [Channel access token — LINE Developers](https://developers.line.biz/en/docs/basics/channel-access-token/)
- [line-bot-mcp-server README](https://github.com/line/line-bot-mcp-server)
- [Stateless Channel Access Token (ภาษาไทย) — LINE Developers Thailand](https://medium.com/linedevth/stateless-channel-access-token-%E0%B8%95%E0%B8%B1%E0%B8%A7%E0%B8%8A%E0%B9%88%E0%B8%A7%E0%B8%A2%E0%B8%A2%E0%B8%81%E0%B8%A3%E0%B8%B0%E0%B8%94%E0%B8%B1%E0%B8%9A%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1%E0%B8%9B%E0%B8%A5%E0%B8%AD%E0%B8%94%E0%B8%A0%E0%B8%B1%E0%B8%A2%E0%B9%83%E0%B8%99%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%83%E0%B8%8A%E0%B9%89-line-messaging-api-e489dfc210ad)
