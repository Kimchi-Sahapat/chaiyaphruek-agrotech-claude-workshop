// Loads the Express SKU master (1 product : 1 sku, keyed on express_product_code)
// and the team's curated product tag assignments. Idempotent (safe to re-run).
//
// Inputs (JSON, produced from the Drive sources):
//   SKU_FILE    : [{code,name,unit}]                        <- "SKU list" sheet
//   ASSIGN_FILE : [{sku_code, tag_code}]                    <- "product tags for upload 12.7.2026"
// Env: PGPASSWORD, SKU_FILE, ASSIGN_FILE
import { readFileSync } from "node:fs";
import pg from "pg";

const REF = "ztvfhaouojddksxsslmy";
const PASSWORD = process.env.PGPASSWORD;
const DICT_VERSION = "2026-07-12";
const skus = JSON.parse(readFileSync(process.env.SKU_FILE, "utf8"));
const assigns = JSON.parse(readFileSync(process.env.ASSIGN_FILE, "utf8"));

const regions = ["ap-southeast-1","ap-southeast-2","us-east-1","us-east-2","us-west-1","eu-central-1","eu-west-1","ap-northeast-1"];
async function connect() {
  for (const r of regions) {
    const host = `aws-0-${r}.pooler.supabase.com`;
    try {
      const c = new pg.Client({ host, port: 5432, user: `postgres.${REF}`, password: PASSWORD, database: "postgres", ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 8000 });
      await c.connect(); console.log("Connected via", host); return c;
    } catch (e) { console.log(`  ${r}: ${e.code || e.message}`); }
  }
  throw new Error("no pooler region reachable");
}

const client = await connect();
try {
  await client.query("begin");

  // 1) SKUs — 1 product : 1 sku, upsert on express_product_code
  const skuIdByCode = {};
  let created = 0, updated = 0;
  for (const s of skus) {
    const existing = await client.query("select sku_id, product_id from sku where express_product_code=$1", [s.code]);
    if (existing.rows.length) {
      const { sku_id, product_id } = existing.rows[0];
      await client.query("update product set product_name=$1, updated_at=now() where product_id=$2", [s.name, product_id]);
      await client.query("update sku set pack_size_unit=$1, pack_description=$2, updated_at=now() where sku_id=$3", [s.unit, s.name, sku_id]);
      skuIdByCode[s.code] = sku_id; updated++;
    } else {
      const p = await client.query("insert into product (product_name, status) values ($1,'ACTIVE') returning product_id", [s.name]);
      const sk = await client.query(
        "insert into sku (product_id, express_product_code, pack_size_unit, pack_description, status) values ($1,$2,$3,$4,'ACTIVE') returning sku_id",
        [p.rows[0].product_id, s.code, s.unit, s.name]
      );
      skuIdByCode[s.code] = sk.rows[0].sku_id; created++;
    }
  }
  console.log(`SKUs -> created ${created}, updated ${updated}`);

  // 2) resolve tag_code -> tag_id
  const tagRows = (await client.query("select tag_id, tag_code from tag_definition")).rows;
  const tagIdByCode = Object.fromEntries(tagRows.map((r) => [r.tag_code, r.tag_id]));

  // 3) assignments (only where both sku + tag resolve)
  let asg = 0, skipNoSku = 0, skipNoTag = 0;
  const seen = new Set();
  for (const a of assigns) {
    const sku_id = skuIdByCode[a.sku_code];
    const tag_id = tagIdByCode[a.tag_code];
    if (!sku_id) { skipNoSku++; continue; }
    if (!tag_id) { skipNoTag++; continue; }
    const k = sku_id + "|" + tag_id;
    if (seen.has(k)) continue;
    seen.add(k);
    await client.query(
      `insert into product_tag_assignment (sku_id, tag_id, source_type, source_id, assertion_type, review_status, dictionary_version)
       values ($1,$2,'TAG_CSV',$3,'HUMAN_VERIFIED','APPROVED',$4)
       on conflict (sku_id, tag_id) where sku_id is not null do update set
         assertion_type=excluded.assertion_type, review_status=excluded.review_status,
         dictionary_version=excluded.dictionary_version, updated_at=now()`,
      [sku_id, tag_id, a.sku_code, DICT_VERSION]
    );
    asg++;
  }
  console.log(`tag assignments -> ${asg} applied | skipped: no-sku ${skipNoSku}, no-tag ${skipNoTag}`);

  await client.query("commit");

  const c1 = (await client.query("select count(*)::int n from product")).rows[0].n;
  const c2 = (await client.query("select count(*)::int n from sku")).rows[0].n;
  const c3 = (await client.query("select count(*)::int n from product_tag_assignment")).rows[0].n;
  console.log(`VERIFY -> product=${c1} sku=${c2} product_tag_assignment=${c3}`);
} catch (e) {
  await client.query("rollback").catch(() => {});
  console.error("LOAD FAIL:", e.message);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
