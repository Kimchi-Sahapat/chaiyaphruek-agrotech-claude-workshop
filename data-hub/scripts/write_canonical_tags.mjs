// Ingests canonical re-tag results (retag/out_*.json) — [category_code, value]
// pairs — into product_tag_assignment, linking ONLY to canonical tag_definitions
// (dictionary_version OFFICIAL). Values not matching the vocabulary are skipped
// and reported (never created). All INFERRED / PENDING_REVIEW. Idempotent.
// Env: PGPASSWORD, RETAG_DIR
import { readFileSync, readdirSync } from "node:fs";
import pg from "pg";
const DIR = process.env.RETAG_DIR;
const MODEL = "sonnet";
const DICTV = "OFFICIAL-2026-07-11";

const files = readdirSync(DIR).filter(f => /^out_\d+\.json$/.test(f));
let recs = [];
for (const f of files) { try { const a = JSON.parse(readFileSync(`${DIR}/${f}`,"utf8")); if(Array.isArray(a)) recs.push(...a); } catch(e){ console.log("bad file",f,e.message);} }
console.log(`loaded ${recs.length} product records from ${files.length} files`);

const c = new pg.Client({ host: "aws-0-ap-southeast-1.pooler.supabase.com", port: 5432, user: "postgres.ztvfhaouojddksxsslmy", password: process.env.PGPASSWORD, database: "postgres", ssl: { rejectUnauthorized: false } });
await c.connect();
// canonical tag lookup: tag_code -> tag_id  (only OFFICIAL vocab)
const canon = Object.fromEntries((await c.query(
  "select tag_code, tag_id from tag_definition where dictionary_version=$1", [DICTV])).rows.map(r=>[r.tag_code, r.tag_id]));
console.log("canonical vocab size:", Object.keys(canon).length);

try {
  await c.query("begin");
  let ins=0, skipVocab=0, noSku=0; const misses={};
  for (const r of recs) {
    if (!r || !r.code) continue;
    const sk = await c.query("select sku_id from sku where express_product_code=$1", [r.code]);
    if (!sk.rows.length) { noSku++; continue; }
    const sku_id = sk.rows[0].sku_id;
    for (const t of r.tags || []) {
      if (!Array.isArray(t) || t.length < 2) continue;
      const tc = `${String(t[0]).trim()}:${String(t[1]).trim()}`;
      const tag_id = canon[tc];
      if (!tag_id) { skipVocab++; misses[tc]=(misses[tc]||0)+1; continue; }
      const a = await c.query(
        `insert into product_tag_assignment (sku_id, tag_id, source_type, assertion_type, review_status, generated_by, model_name, dictionary_version)
         values ($1,$2,'AI_CLASSIFY','INFERRED','PENDING_REVIEW','claude-code',$3,$4)
         on conflict (sku_id, tag_id) where sku_id is not null do nothing`,
        [sku_id, tag_id, MODEL, DICTV]);
      ins += a.rowCount;
    }
  }
  await c.query("commit");
  console.log(`assignments inserted: ${ins} | skipped(not in vocab): ${skipVocab} | no-sku: ${noSku}`);
  const missArr = Object.entries(misses).sort((a,b)=>b[1]-a[1]);
  console.log(`distinct non-vocab values agents produced: ${missArr.length}`);
  console.log("top non-vocab (should be few):", missArr.slice(0,15).map(([k,n])=>`${k}(${n})`).join(", "));
} catch(e) {
  await c.query("rollback").catch(()=>{});
  console.error("FAIL:", e.message); process.exitCode=1;
} finally { await c.end(); }
