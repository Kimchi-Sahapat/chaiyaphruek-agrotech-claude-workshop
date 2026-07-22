import "server-only";
import type { RawProduct } from "./products";

// Minimal correct CSV parser (handles quotes, escaped quotes, embedded newlines).
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  const s = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inQuotes) {
      if (c === '"') {
        if (s[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

const norm = (s: string) => s.trim().toLowerCase();
function findCol(headers: string[], keys: string[]): number {
  return headers.findIndex((h) => keys.some((k) => norm(h).includes(k)));
}

const TRUE_VALUES = ["1", "true", "yes", "y", "ใช่", "ขายดี", "x", "✓"];

/**
 * Fetch products from a published Google Sheet CSV.
 * SECURITY: only Code / Name / Unit / Category / best-seller are ever read.
 * Any price/cost/stock columns in the sheet are ignored and never leave the server.
 */
export async function fetchProductsFromSheet(
  url: string
): Promise<RawProduct[]> {
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`sheet fetch ${res.status}`);
  const rows = parseCsv(await res.text());
  if (rows.length < 2) return [];

  const headers = rows[0];
  const ci = {
    code: findCol(headers, ["product code", "code", "รหัส"]),
    name: findCol(headers, [
      "product name",
      "ชื่อไทย",
      "ชื่อสินค้า",
      "ชื่อ",
      "name",
    ]),
    unit: findCol(headers, ["unit", "หน่วย"]),
    cat: findCol(headers, ["category", "หมวด", "cat"]),
    best: findCol(headers, ["best", "ขายดี", "แนะนำ"]),
  };
  if (ci.code < 0 || ci.name < 0)
    throw new Error("sheet missing Code/Name columns");

  const out: RawProduct[] = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const code = (r[ci.code] ?? "").trim();
    const name = (r[ci.name] ?? "").trim();
    if (!code || !name) continue;
    const unit = ci.unit >= 0 ? (r[ci.unit] ?? "").trim() : "";
    const cat =
      (ci.cat >= 0 ? (r[ci.cat] ?? "").trim() : "") || code.slice(0, 3);
    const best =
      ci.best >= 0 ? TRUE_VALUES.includes(norm(r[ci.best] ?? "")) : false;
    out.push({ code, name, unit, cat, best });
  }
  return out;
}
