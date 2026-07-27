-- 0004_sku_tag_constraints.sql
-- Idempotency keys for the Express SKU load + product tag assignments.
-- Express product code is the immutable join key across POS / web / tags.
begin;

-- one SKU row per Express product code
create unique index if not exists uq_sku_express_code
  on sku (express_product_code)
  where express_product_code is not null;

-- a tag can be assigned to a given SKU only once
create unique index if not exists uq_pta_sku_tag
  on product_tag_assignment (sku_id, tag_id)
  where sku_id is not null;

commit;
