# คู่มือเชื่อม Google Drive MCP เข้า Claude (Official Google remote server)

ใช้ **Google-hosted remote MCP server** → รองรับ **อ่าน + สร้าง/เขียนไฟล์** และ **ไม่ต้องติดตั้ง Node.js**
Server URL: `https://drivemcp.googleapis.com/mcp/v1`

> วิธีนี้เพิ่มผ่าน **Settings → Connectors** ของ Claude (claude.ai / Claude Desktop)
> — ไม่ใช้ไฟล์ `.mcp.json`

---

## ขั้นที่ 1 — Google Cloud Project + เปิด API

1. เข้า https://console.cloud.google.com → สร้าง **New Project** (เช่น `chaiyapruek-drive-mcp`)
2. **APIs & Services → Library** เปิดใช้ 2 ตัว:
   - **Google Drive API** → Enable
   - **Google Drive MCP API** → Enable

---

## ขั้นที่ 2 — OAuth Consent + Credential (แบบ Web application)

1. **APIs & Services → OAuth consent screen**
   - User Type: **External** → Create
   - App name / support email / developer email: ใส่อีเมลตัวเอง
   - **Test users → Add users → ใส่อีเมล Google ของตัวเอง** ⚠️ สำคัญ
2. **Credentials → Create Credentials → OAuth client ID**
   - Application type: **Web application** ⚠️ (ไม่ใช่ Desktop)
   - **Authorized redirect URIs → Add URI:**
     ```
     https://claude.ai/api/mcp/auth_callback
     ```
   - Create → ได้ **Client ID** + **Client Secret**

---

## ขั้นที่ 3 — เพิ่ม Custom Connector ใน Claude

1. Claude → **Settings → Connectors** (หรือ Admin settings → Connectors) → **Add custom connector**
2. กรอก:
   - **Server name:** `Google Drive`
   - **Remote MCP server URL:** `https://drivemcp.googleapis.com/mcp/v1`
   - **Advanced settings:** วาง **OAuth client ID** + **OAuth client secret**
3. **Add**

---

## ขั้นที่ 4 — Authenticate

1. กด connect/authenticate ที่ connector → Browser เด้ง → ล็อกอิน Google → อนุญาต
2. เสร็จ! ทดสอบให้ลิสต์ไฟล์ในโฟลเดอร์ที่แชร์มา

---

## ⚠️ ข้อควรรู้เรื่อง "ใช้ที่ไหนได้บ้าง"

- Connector นี้ผูกกับ **บัญชี claude.ai** ของพี่ → ใช้ได้ใน **claude.ai (เว็บ) และ Claude Desktop** ทันที
- **Claude Code (VSCode extension ที่คุยอยู่ตอนนี้)** อาจเห็น connector นี้ด้วยถ้า sync บัญชีเดียวกัน — **ต้องทดสอบ** ยังไม่ 100%

---

## แผน B — ถ้าต้องการให้ทำงานใน Claude Code (VSCode) โดยตรงแน่ๆ

ใช้ **local MCP server** (`@piotr-agier/google-drive-mcp`) ผ่าน `.mcp.json`
→ ต้อง **ติดตั้ง Node.js ก่อน** แล้วผมตั้ง config + ใส่ Client ID/Secret เป็น env ให้
→ แบบนี้รันในเครื่อง คุมได้เต็มที่ใน session Claude Code นี้
