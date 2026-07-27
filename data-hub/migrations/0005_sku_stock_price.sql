-- 0005_sku_stock_price.sql
-- Internal stock/price mirror from Express (Stage-2 sync). POS-owned, one-way.
-- These columns stay behind the secret key (sku RLS is locked) and are NEVER
-- sent to the browser — the web catalogue reads product content from Sanity.
begin;

alter table sku add column if not exists stock_on_hand   numeric;
alter table sku add column if not exists retail_price     numeric;
alter table sku add column if not exists wholesale_price  numeric;
alter table sku add column if not exists express_synced_at timestamptz;

commit;
