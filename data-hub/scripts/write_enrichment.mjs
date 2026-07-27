// Central writer for the parallel enrichment run. Reads all out_*.json produced
// by the research agents and writes to the Data Hub in REVIEW state:
//  - product.short_description / detailed_description (+ enrichment_status=PENDING_REVIEW)
//  - product_tag_assignment (assertion_type=INFERRED, review_status=PENDING_REVIEW)
//  - new dictionary values are added as tag_definition status=PENDING_REVIEW (never silently trusted)
// Idempotent. Env: PGPASSWORD, ENRICH_DIR.
import { readFileSync, readdirSync } from "node:fs";
import pg from "pg";

const DIR = process.env.ENRICH_DIR;
const MODEL = "sonnet";
const DICTV = "ai-enrich-2026-07-27";
const VALID = new Set(["brand","product_type","problem","benefit","stage","fertilizer_formula","nutrient","active_ingredient","chem_family","moa_group","moa","pgr","adjuvant_function","application_method","formulation"]);

const files = readdirSync(DIR).filter((f) => /^out_\d+\.json$/.test(f));
let recs = [];
for (const f of files) {
  try { const a = JSON.parse(readFileSync(`${DIR}/${f}`, "utf8")); if (Array.isArray(a)) recs.push(...a); }
  catch (e) { console.log("skip bad file", f, e.message); }
}
console.log(`loaded ${recs.length} records from ${files.length} out files`);

const c = new pg.Client({ host: "aws-0-ap-southeast-1.pooler.supabase.com", port: 5432, user: "postgres.ztvfhaouojddksxsslmy", password: process.env.PGPASSWORD, database: "postgres", ssl: { rejectUnauthorized: false } });
await c.connect();
const catId = Object.fromEntries((await c.query("select category_code, tag_category_id from tag_category")).rows.map((r) => [r.category_code, r.tag_category_id]));
const tagId = Object.fromEntries((await c.query("select tag_code, tag_id from tag_definition")).rows.map((r) => [r.tag_code, r.tag_id]));

try {
  await c.query("begin");
  let enriched = 0, notfound = 0, noSku = 0, tagsIns = 0, newDefs = 0, badCat = 0;
  const newDefSamples = [];
  for (const r of recs) {
    if (!r || !r.code) continue;
    const sk = await c.query("select sku_id, product_id from sku where express_product_code=$1", [r.code]);
    if (!sk.rows.length) { noSku++; continue; }
    const { sku_id, product_id } = sk.rows[0];
    const short = (r.short || "").trim();
    const detailed = (r.detailed || "").trim();
    const src = Array.isArray(r.sources) ? r.sources.filter(Boolean).join(" | ").slice(0, 500) : null;
    if (r.found && (short || detailed)) {
      await c.query(
        `update product set short_description=$1, detailed_description=$2,
           enrichment_status='PENDING_REVIEW', enrichment_source=$3, enrichment_model=$4, enriched_at=now(), updated_at=now()
         where product_id=$5`,
        [short || null, detailed || null, src, MODEL, product_id]
      );
      enriched++;
    } else notfound++;
    for (const t of r.tags || []) {
      if (!Array.isArray(t) || t.length < 2) continue;
      const cat = String(t[0]).trim();
      const val = String(t[1]).trim();
      if (!VALID.has(cat) || !val) { badCat++; continue; }
      const tc = `${cat}:${val}`;
      let id = tagId[tc];
      if (!id) {
        const ins = await c.query(
          `insert into tag_definition (tag_category_id, tag_code, label_th, status, dictionary_version)
           values ($1,$2,$3,'PENDING_REVIEW',$4) on conflict (tag_code) do nothing returning tag_id`,
          [catId[cat], tc, val, DICTV]
        );
        if (ins.rows.length) { id = ins.rows[0].tag_id; newDefs++; if (newDefSamples.length < 20) newDefSamples.push(tc); }
        else id = (await c.query("select tag_id from tag_definition where tag_code=$1", [tc])).rows[0].tag_id;
        tagId[tc] = id;
      }
      const a = await c.query(
        `insert into product_tag_assignment (sku_id, tag_id, source_type, source_id, evidence_text, assertion_type, review_status, generated_by, model_name, dictionary_version)
         values ($1,$2,'WEB',$3,'ai-web-enriched','INFERRED','PENDING_REVIEW','claude-code',$4,$5)
         on conflict (sku_id, tag_id) where sku_id is not null do nothing`,
        [sku_id, id, src, MODEL, DICTV]
      );
      tagsIns += a.rowCount;
    }
  }
  await c.query("commit");
  console.log(`\nRESULT: products enriched ${enriched}, not-found ${notfound}, no-sku ${noSku}`);
  console.log(`tags inserted ${tagsIns}, new dictionary values (PENDING_REVIEW) ${newDefs}, bad-category skipped ${badCat}`);
  console.log("new-def samples:", newDefSamples.join(", "));
} catch (e) {
  await c.query("rollback").catch(() => {});
  console.error("WRITE FAIL:", e.message); process.exitCode = 1;
} finally { await c.end(); }
