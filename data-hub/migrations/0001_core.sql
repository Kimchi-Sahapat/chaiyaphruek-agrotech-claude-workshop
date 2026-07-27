-- Chaiyapreuk Data Hub — Migration 0001: Core
-- Master (supplier/brand/product/sku) · Identity (account/contact/external ids)
-- Tags (category/definition/assignments) · Farm · Web events · Audit
-- Safe to run in the Supabase SQL Editor. Idempotent (IF NOT EXISTS).
-- Sales/Order/Loyalty/Promotion tables come in a later migration (need Express/Tony data first).

-- ---------- helper: auto updated_at ----------
create or replace function set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- ========================= MASTER =========================
create table if not exists supplier (
  supplier_id uuid primary key default gen_random_uuid(),
  express_supplier_code text,
  supplier_name text not null,
  legal_name text,
  status text not null default 'ACTIVE',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists brand (
  brand_id uuid primary key default gen_random_uuid(),
  supplier_id uuid references supplier(supplier_id),
  brand_name text not null,
  status text not null default 'ACTIVE',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- product = PRODUCT FAMILY (one entry, many pack-size SKUs)
create table if not exists product (
  product_id uuid primary key default gen_random_uuid(),
  brand_id uuid references brand(brand_id),
  supplier_id uuid references supplier(supplier_id),
  product_name text not null,
  generic_name text,
  short_description text,
  detailed_description text,
  registration_number text,
  status text not null default 'ACTIVE',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists sku (
  sku_id uuid primary key default gen_random_uuid(),
  product_id uuid not null references product(product_id) on delete cascade,
  express_product_code text,
  barcode text,
  pack_size_value numeric,
  pack_size_unit text,
  pack_description text,
  units_per_case integer,
  status text not null default 'ACTIVE',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_sku_product on sku(product_id);
create index if not exists idx_sku_express on sku(express_product_code);

-- ========================= IDENTITY =========================
create table if not exists customer_account (
  customer_account_id uuid primary key default gen_random_uuid(),
  express_customer_code text,
  account_name text,
  account_type text,
  customer_status text default 'ACTIVE',
  credit_status text,
  primary_branch_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_ca_express on customer_account(express_customer_code);

create table if not exists contact_person (
  contact_id uuid primary key default gen_random_uuid(),
  first_name text,
  last_name text,
  display_name text,
  phone text,
  email text,
  status text not null default 'ACTIVE',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_contact_phone on contact_person(phone);

create table if not exists account_contact (
  customer_account_id uuid not null references customer_account(customer_account_id) on delete cascade,
  contact_id uuid not null references contact_person(contact_id) on delete cascade,
  relationship_type text,
  role text,
  is_primary_contact boolean default false,
  can_view_order_history boolean default true,
  can_place_order boolean default true,
  can_use_points boolean default false,
  can_view_credit_information boolean default false,
  status text not null default 'ACTIVE',
  primary key (customer_account_id, contact_id)
);

-- contact ↔ external accounts (PHONE / LINE / WEB_APP / KOSA / TONY)
create table if not exists external_identity (
  external_identity_id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references contact_person(contact_id) on delete cascade,
  identity_type text not null,
  external_id text not null,
  source_system text,
  verification_status text default 'UNVERIFIED',
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  unique (identity_type, external_id)
);
create index if not exists idx_extid_contact on external_identity(contact_id);

-- any internal entity ↔ external system code (Express/Tony reconciliation, never deleted)
create table if not exists external_identifier (
  external_identifier_id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  source_system text not null,
  external_id text not null,
  created_at timestamptz not null default now(),
  verified_at timestamptz,
  unique (source_system, entity_type, external_id)
);
create index if not exists idx_extident_entity on external_identifier(entity_type, entity_id);

-- ========================= FARM =========================
create table if not exists farm (
  farm_id uuid primary key default gen_random_uuid(),
  customer_account_id uuid references customer_account(customer_account_id) on delete set null,
  farm_name text,
  total_area_rai numeric,
  province text,
  district text,
  subdistrict text,
  latitude double precision,
  longitude double precision,
  status text not null default 'ACTIVE',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists farm_crop (
  farm_crop_id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references farm(farm_id) on delete cascade,
  crop_type text,
  crop_variety text,
  area_rai numeric,
  growth_stage text,
  season_year integer,
  planted_at date,
  expected_harvest_at date,
  status text not null default 'ACTIVE',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ========================= TAGS =========================
create table if not exists tag_category (
  tag_category_id uuid primary key default gen_random_uuid(),
  category_code text unique not null,
  category_name_th text,
  category_name_en text,
  color text,
  applies_to text,            -- PRODUCT | CUSTOMER | FARM | CONTACT
  value_type text,            -- SINGLE | MULTI
  allow_multiple boolean default true,
  status text not null default 'ACTIVE',
  display_order integer default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists tag_definition (
  tag_id uuid primary key default gen_random_uuid(),
  tag_category_id uuid not null references tag_category(tag_category_id) on delete cascade,
  tag_code text unique not null,
  label_th text,
  label_en text,
  description text,
  aliases text[],
  status text not null default 'ACTIVE',
  dictionary_version text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_tagdef_cat on tag_definition(tag_category_id);

create table if not exists product_tag_assignment (
  product_tag_assignment_id uuid primary key default gen_random_uuid(),
  product_id uuid references product(product_id) on delete cascade,
  sku_id uuid references sku(sku_id) on delete cascade,
  tag_id uuid not null references tag_definition(tag_id) on delete cascade,
  source_type text,
  source_id text,
  source_field text,
  evidence_text text,
  assertion_type text,        -- EXPLICIT | INFERRED | DERIVED | HUMAN_VERIFIED
  confidence numeric,
  review_status text default 'PENDING_REVIEW',
  generated_by text,
  model_name text,
  prompt_version text,
  dictionary_version text,
  reviewed_by text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_ptag_product on product_tag_assignment(product_id);
create index if not exists idx_ptag_tag on product_tag_assignment(tag_id);
create index if not exists idx_ptag_review on product_tag_assignment(review_status);

create table if not exists customer_tag_assignment (
  customer_tag_assignment_id uuid primary key default gen_random_uuid(),
  customer_account_id uuid references customer_account(customer_account_id) on delete cascade,
  contact_id uuid references contact_person(contact_id) on delete cascade,
  farm_id uuid references farm(farm_id) on delete cascade,
  tag_id uuid not null references tag_definition(tag_id) on delete cascade,
  value text,
  source_type text,
  source_id text,
  evidence_text text,
  confidence numeric,
  valid_from timestamptz,
  expires_at timestamptz,
  review_status text default 'PENDING_REVIEW',
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_ctag_tag on customer_tag_assignment(tag_id);

-- ========================= WEB EVENTS =========================
create table if not exists web_event (
  web_event_id uuid primary key default gen_random_uuid(),
  event_name text not null,
  anon_id text,
  contact_id uuid references contact_person(contact_id) on delete set null,
  product_id uuid,
  sku_id uuid,
  properties jsonb,
  url text,
  referrer text,
  user_agent text,
  occurred_at timestamptz not null default now()
);
create index if not exists idx_webevent_name on web_event(event_name);
create index if not exists idx_webevent_anon on web_event(anon_id);
create index if not exists idx_webevent_time on web_event(occurred_at);

-- ========================= AUDIT =========================
create table if not exists audit_log (
  audit_log_id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id text,
  action text,
  previous_value jsonb,
  new_value jsonb,
  changed_by text,
  changed_at timestamptz not null default now()
);
create index if not exists idx_audit_entity on audit_log(entity_type, entity_id);

-- ---------- updated_at triggers ----------
do $$
declare t text;
begin
  foreach t in array array['supplier','brand','product','sku','customer_account',
    'contact_person','farm','farm_crop','tag_category','tag_definition',
    'product_tag_assignment','customer_tag_assignment']
  loop
    execute format('drop trigger if exists trg_%s_updated on %I', t, t);
    execute format('create trigger trg_%s_updated before update on %I for each row execute function set_updated_at()', t, t);
  end loop;
end $$;

-- ---------- Row Level Security: lock everything (server/secret-key only for now) ----------
do $$
declare t text;
begin
  foreach t in array array['supplier','brand','product','sku','customer_account',
    'contact_person','account_contact','external_identity','external_identifier',
    'farm','farm_crop','tag_category','tag_definition','product_tag_assignment',
    'customer_tag_assignment','web_event','audit_log']
  loop
    execute format('alter table %I enable row level security', t);
  end loop;
end $$;
