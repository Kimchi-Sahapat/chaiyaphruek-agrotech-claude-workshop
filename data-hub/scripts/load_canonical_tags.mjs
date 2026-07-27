// Loads the team's OFFICIAL tag vocabulary (Tag Dictionary tab, with Tag Codes)
// into the Data Hub as the canonical tag registry, and REJECTS the AI-invented
// PENDING_REVIEW tags + assignments that didn't match the standard.
// Source of truth: workbook "MASTER — สินค้าทั้งหมด (LIVE)" > "Tag Dictionary".
// Idempotent. Env: PGPASSWORD, CANON (path to canonical_tag_dictionary.json).
import { readFileSync } from "node:fs";
import pg from "pg";

const { dict } = JSON.parse(readFileSync(process.env.CANON, "utf8"));
const DICTV = "OFFICIAL-2026-07-11";

// canonical Thai category -> {code, order}. Prefixed c_ to sit alongside legacy cats.
const CAT = {
  "แบรนด์ / Supplier":     { code: "c_supplier",          order: 1 },
  "ประเภทสินค้า":          { code: "c_product_type",      order: 2 },
  "ปัญหาที่แก้":           { code: "c_problem",           order: 3 },
  "ประโยชน์ต่อพืช":        { code: "c_benefit",           order: 4 },
  "ระยะการใช้":            { code: "c_stage",             order: 5 },
  "สูตรปุ๋ย":              { code: "c_fertilizer_formula", order: 6 },
  "ธาตุ/ส่วนประกอบเด่น":   { code: "c_nutrient",          order: 7 },
  "ฮอร์โมน/PGR":           { code: "c_pgr",               order: 8 },
  "ตระกูลสารเคมี":         { code: "c_chem_family",       order: 9 },
  "IRAC / FRAC / HRAC":    { code: "c_moa_group",         order: 10 },
  "ลักษณะการออกฤทธิ์":     { code: "c_moa",               order: 11 },
  "หน้าที่สารช่วย":        { code: "c_adjuvant",          order: 12 },
  "วิธีใช้":               { code: "c_application",       order: 13 },
  "รูปแบบผลิตภัณฑ์":       { code: "c_formulation",       order: 14 },
  "แท็กเชิงพาณิชย์":       { code: "c_commercial",        order: 15 },
  "สถานะการแท็ก":          { code: "c_tag_status",        order: 16 },
};

const c = new pg.Client({ host: "aws-0-ap-southeast-1.pooler.supabase.com", port: 5432, user: "postgres.ztvfhaouojddksxsslmy", password: process.env.PGPASSWORD, database: "postgres", ssl: { rejectUnauthorized: false } });
await c.connect();
try {
  await c.query("begin");

  // 1) reject AI-invented pollution (keep for audit)
  const rd = await c.query("update tag_definition set status='REJECTED', updated_at=now() where status='PENDING_REVIEW'");
  const ra = await c.query("update product_tag_assignment set review_status='REJECTED', updated_at=now() where assertion_type='INFERRED' and review_status='PENDING_REVIEW'");
  console.log(`rejected: ${rd.rowCount} AI tag values, ${ra.rowCount} AI assignments`);

  // 2) load canonical categories
  const catId = {};
  for (const [th, m] of Object.entries(CAT)) {
    const r = await c.query(
      `insert into tag_category (category_code, category_name_th, applies_to, value_type, allow_multiple, display_order, status)
       values ($1,$2,'PRODUCT','MULTI',true,$3,'ACTIVE')
       on conflict (category_code) do update set category_name_th=excluded.category_name_th, display_order=excluded.display_order, updated_at=now()
       returning tag_category_id`, [m.code, th, m.order]);
    catId[th] = r.rows[0].tag_category_id;
  }
  console.log("canonical categories:", Object.keys(catId).length);

  // clear any prior canonical load (Tag Codes repeat per-category, so we re-key)
  await c.query("delete from tag_definition where dictionary_version=$1", [DICTV]);

  // 3) load canonical tag definitions. Their Tag Code is only unique WITHIN a
  // category, so the global key is category-code + standard name; keep their
  // Tag Code in description for lineage.
  let n = 0, skipped = 0;
  for (const d of dict) {
    if (!d.name || !CAT[d.cat]) { skipped++; continue; }
    const m = CAT[d.cat];
    const tagCode = `${m.code}:${d.name}`;
    await c.query(
      `insert into tag_definition (tag_category_id, tag_code, label_th, description, status, dictionary_version)
       values ($1,$2,$3,$4,'ACTIVE',$5)
       on conflict (tag_code) do update set tag_category_id=excluded.tag_category_id, label_th=excluded.label_th, description=excluded.description, status='ACTIVE', dictionary_version=excluded.dictionary_version, updated_at=now()`,
      [catId[d.cat], tagCode, d.name, d.code || null, DICTV]);
    n++;
  }
  console.log(`canonical tag definitions loaded: ${n} (skipped ${skipped})`);

  await c.query("commit");
  const v = await c.query("select count(*)::int n from tag_definition where dictionary_version=$1", [DICTV]);
  console.log("VERIFY canonical defs in DB:", v.rows[0].n);
} catch (e) {
  await c.query("rollback").catch(() => {});
  console.error("FAIL:", e.message); process.exitCode = 1;
} finally { await c.end(); }
