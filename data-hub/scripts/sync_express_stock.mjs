// Stage-2 Express sync: mirror stock + price into the Data Hub (one-way, POS-owned).
// Reads a CSV/TSV export from Express and upserts onto sku by express_product_code.
// Columns are matched by header keyword (Thai or English), order-independent:
//   code      : "product code" | "รหัส" | "รหัสสินค้า" | "sku"
//   stock     : "stock" | "คงเหลือ" | "สต็อก" | "จำนวนคงเหลือ" | "on hand"
//   retail    : "retail" | "ราคาปลีก" | "ราคาขายปลีก"
//   wholesale : "wholesale" | "ราคาส่ง"
//   price     : "price" | "ราคาขาย" | "ราคา"   (fallback -> retail if no retail column)
// Env: PGPASSWORD, EXPORT_FILE (path to .csv/.tsv). Idempotent; safe to re-run nightly.
import { readFileSync } from "node:fs";
import pg from "pg";

const REF = "ztvfhaouojddksxsslmy";
const FILE = process.env.EXPORT_FILE;
if (!FILE) { console.error("set EXPORT_FILE"); process.exit(1); }

// ---- parse ----
let raw = readFileSync(FILE, "utf8").replace(/^﻿/, "");
const delim = raw.includes("\t") && !raw.split(/\r?\n/)[0].includes(",") ? "\t" : ",";
function splitLine(line) {
  const out = []; let cur = "", q = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') { if (q && line[i + 1] === '"') { cur += '"'; i++; } else q = !q; }
    else if (ch === delim && !q) { out.push(cur); cur = ""; }
    else cur += ch;
  }
  out.push(cur); return out.map((s) => s.trim());
}
const lines = raw.split(/\r?\n/).filter((l) => l.trim());
const header = splitLine(lines[0]).map((h) => h.toLowerCase());
const find = (keys) => header.findIndex((h) => keys.some((k) => h.includes(k)));
const iCode  = find(["product code", "รหัสสินค้า", "รหัส", "sku", "code"]);
const iStock = find(["on hand", "คงเหลือ", "สต็อก", "stock"]);
const iRetail= find(["ราคาขายปลีก", "ราคาปลีก", "retail"]);
const iWhole = find(["ราคาส่ง", "wholesale"]);
const iPrice = find(["ราคาขาย", "price", "ราคา"]);
if (iCode < 0) { console.error("no code column found in header:", header); process.exit(1); }

const num = (v) => {
  if (v == null) return null;
  const n = Number(String(v).replace(/[, ]/g, ""));
  return Number.isFinite(n) ? n : null;
};
const codeRe = /^\d{3}-\d{4}-\d{2}-\d$/;
const rows = [];
for (let i = 1; i < lines.length; i++) {
  const c = splitLine(lines[i]);
  const code = (c[iCode] || "").trim();
  if (!codeRe.test(code)) continue;
  rows.push({
    code,
    stock: iStock >= 0 ? num(c[iStock]) : null,
    retail: iRetail >= 0 ? num(c[iRetail]) : iPrice >= 0 ? num(c[iPrice]) : null,
    wholesale: iWhole >= 0 ? num(c[iWhole]) : null,
  });
}
console.log(`parsed ${rows.length} rows (delim=${delim === "\t" ? "TAB" : "COMMA"}) | cols: code=${iCode} stock=${iStock} retail=${iRetail} whole=${iWhole} price=${iPrice}`);

// ---- upsert ----
const regions = ["ap-southeast-1","ap-southeast-2","us-east-1","us-east-2","us-west-1","eu-central-1","eu-west-1","ap-northeast-1"];
async function connect() {
  for (const r of regions) {
    const host = `aws-0-${r}.pooler.supabase.com`;
    try {
      const cl = new pg.Client({ host, port: 5432, user: `postgres.${REF}`, password: process.env.PGPASSWORD, database: "postgres", ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 8000 });
      await cl.connect(); console.log("Connected via", host); return cl;
    } catch (e) { console.log(`  ${r}: ${e.code || e.message}`); }
  }
  throw new Error("no pooler region reachable");
}
const client = await connect();
try {
  await client.query("begin");
  let matched = 0, unmatched = 0;
  for (const r of rows) {
    const res = await client.query(
      `update sku set
         stock_on_hand   = coalesce($2, stock_on_hand),
         retail_price    = coalesce($3, retail_price),
         wholesale_price = coalesce($4, wholesale_price),
         express_synced_at = now(), updated_at = now()
       where express_product_code = $1`,
      [r.code, r.stock, r.retail, r.wholesale]
    );
    if (res.rowCount) matched++; else unmatched++;
  }
  await client.query("commit");
  console.log(`synced -> matched ${matched}, unmatched ${unmatched}`);
  const chk = await client.query(
    "select count(*)::int priced from sku where retail_price is not null"
  );
  console.log("SKUs with a price:", chk.rows[0].priced, "/ 1016");
} catch (e) {
  await client.query("rollback").catch(() => {});
  console.error("SYNC FAIL:", e.message);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
