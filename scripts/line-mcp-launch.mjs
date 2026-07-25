#!/usr/bin/env node
/**
 * Launcher for @line/line-bot-mcp-server.
 *
 * ทำไมต้องมีตัวนี้: Channel 2008825608 มีระบบ GiveawayGrow ใช้งานอยู่
 * การกด "Reissue" long-lived channel access token ใน Console จะ *ทำให้ token เดิมใช้ไม่ได้*
 * (LINE จำกัด long-lived ได้ channel ละ 1 ตัวเท่านั้น) → ระบบเดิมพัง
 *
 * ตัวนี้จึงขอ "stateless channel access token" (อายุ 15 นาที, ออกได้ไม่จำกัด,
 * ไม่กระทบ token ตัวอื่นเลย) จาก Channel ID + Channel Secret ตอน launch
 * แล้วส่งต่อให้ MCP server ทาง env — ไม่มี secret ถูกเขียนลงไฟล์
 *
 * env ที่ใช้ (ตั้งไว้ที่ระดับ Windows User):
 *   LINE_CHANNEL_ID          - เช่น 2008825608
 *   LINE_CHANNEL_SECRET      - จาก OA Manager > Settings > Messaging API
 *   LINE_DESTINATION_USER_ID - (ไม่บังคับ) ปลายทาง default ของ push
 *   LINE_CHANNEL_ACCESS_TOKEN- (ไม่บังคับ) ถ้าตั้งไว้ จะใช้ตัวนี้ตรง ๆ ข้ามการขอ stateless
 */

import { spawn } from "node:child_process";

const {
  LINE_CHANNEL_ID,
  LINE_CHANNEL_SECRET,
  LINE_CHANNEL_ACCESS_TOKEN,
  LINE_DESTINATION_USER_ID,
} = process.env;

class Bail extends Error {}

// ไม่ใช้ process.exit() เพราะยัง fetch ค้างอยู่ → libuv assert บน Windows
function die(msg) {
  console.error(`[line-mcp-launch] ${msg}`);
  process.exitCode = 1;
  throw new Bail(msg);
}

async function resolveToken() {
  if (LINE_CHANNEL_ACCESS_TOKEN) {
    console.error("[line-mcp-launch] using LINE_CHANNEL_ACCESS_TOKEN from env");
    return LINE_CHANNEL_ACCESS_TOKEN;
  }
  if (!LINE_CHANNEL_ID || !LINE_CHANNEL_SECRET) {
    die(
      "ต้องตั้ง LINE_CHANNEL_ID + LINE_CHANNEL_SECRET (หรือ LINE_CHANNEL_ACCESS_TOKEN) ก่อน — ดู SETUP-line-mcp.md",
    );
  }

  const res = await fetch("https://api.line.me/oauth2/v3/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: LINE_CHANNEL_ID,
      client_secret: LINE_CHANNEL_SECRET,
    }),
  });

  const body = await res.text();
  if (!res.ok) {
    die(`ขอ stateless token ไม่สำเร็จ (HTTP ${res.status}): ${body}`);
  }
  const { access_token, expires_in } = JSON.parse(body);
  if (!access_token) die(`ไม่พบ access_token ใน response: ${body}`);

  console.error(
    `[line-mcp-launch] ได้ stateless token แล้ว (อายุ ${expires_in}s) — ไม่กระทบ token ของ GiveawayGrow`,
  );
  return access_token;
}

let token;
try {
  token = await resolveToken();
} catch (err) {
  if (!(err instanceof Bail)) {
    console.error(`[line-mcp-launch] ${err.message}`);
    process.exitCode = 1;
  }
  process.exitCode = 1;
}

if (token) startServer(token);

function startServer(token) {
// Node 24 บล็อกการ spawn .cmd ตรง ๆ (EINVAL) → บน Windows ต้องผ่าน shell
// args เป็น literal คงที่ ไม่มี input จากภายนอก จึงไม่มีความเสี่ยง injection
const child = spawn("npx", ["-y", "@line/line-bot-mcp-server"], {
  stdio: "inherit",
  shell: process.platform === "win32",
  env: {
    ...process.env,
    NPM_CONFIG_IGNORE_SCRIPTS: "true", // ข้ามการดาวน์โหลด Chromium ของ puppeteer
    CHANNEL_ACCESS_TOKEN: token,
    ...(LINE_DESTINATION_USER_ID
      ? { DESTINATION_USER_ID: LINE_DESTINATION_USER_ID }
      : {}),
  },
});

child.on("exit", (code, signal) => {
  process.exitCode = signal ? 1 : (code ?? 0);
});
}
