-- 0006_product_enrichment.sql
-- Holds AI/web-sourced product descriptions in a REVIEW state before a human
-- promotes them to Sanity (the live web source). Never shown on the website.
begin;

alter table product add column if not exists enrichment_status text default 'NONE';  -- NONE | PENDING_REVIEW | APPROVED | REJECTED
alter table product add column if not exists enrichment_source text;                 -- source URL(s)
alter table product add column if not exists enrichment_model  text;
alter table product add column if not exists enriched_at timestamptz;

commit;
