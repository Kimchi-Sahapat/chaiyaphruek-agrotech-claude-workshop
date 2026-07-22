import productsData from "@/data/products.starter.json";
import unitCodes from "@/data/unit-codes.json";
import categoriesData from "@/data/categories.json";

export type RawProduct = {
  code: string;
  name: string;
  unit: string;
  cat: string;
  best?: boolean;
};

export type Product = RawProduct & {
  unitFull: string; // decoded unit for display (e.g. กส -> กระสอบ)
  catName: string; // category label (e.g. ปุ๋ยเคมี (เม็ด))
  group: string; // farmer-facing browse bucket (e.g. ปุ๋ย)
  tags: string[]; // campaign tags (family / sotus / flash)
};

// Human labels for campaign tags used on the catalogue banner.
export const TAG_LABELS: Record<string, string> = {
  family: "อโกรเทค แฟมิลี",
  sotus: "โซตัสคลับ",
  flash: "Flash Sale",
};

// Derive campaign tags from the product name/code. When the live sheet has a
// real tag column this can be replaced by reading it directly.
function tagsFor(p: RawProduct): string[] {
  const t: string[] = [];
  const n = p.name;
  if (n.includes("แบล็ค") || n.includes("ลัคกี้") || n.includes("เอรา"))
    t.push("family");
  if (n.includes("โซตัส")) {
    t.push("sotus");
    if (!t.includes("family")) t.push("family");
  }
  if (n.includes("อโทนิค") || n.includes("โรดัลโก้")) t.push("flash");
  return t;
}

const units = unitCodes as Record<string, string>;
const cats = categoriesData as Record<
  string,
  { name: string; group: string } | string
>;

function catInfo(cat: string): { name: string; group: string } {
  const c = cats[cat];
  if (c && typeof c === "object") return c;
  return { name: "อื่นๆ", group: "อื่นๆ" };
}

// Turn raw rows (from starter JSON or the live sheet) into display products.
export function decorate(raw: RawProduct[]): Product[] {
  return raw.map((p) => {
    const { name, group } = catInfo(p.cat);
    return {
      ...p,
      unitFull: units[p.unit] ?? p.unit,
      catName: name,
      group,
      tags: tagsFor(p),
    };
  });
}

// Fallback dataset (bundled). Used until the live sheet is configured.
export const STARTER: Product[] = decorate(
  productsData.products as RawProduct[]
);

export function groupsOf(products: Product[]): string[] {
  const seen: string[] = [];
  for (const p of products) if (!seen.includes(p.group)) seen.push(p.group);
  return seen;
}

export function byCodeMap(products: Product[]): Record<string, Product> {
  const m: Record<string, Product> = {};
  for (const p of products) m[p.code] = p;
  return m;
}

// Filter used by the catalogue browser. `filter` is "ขายดี", "ทั้งหมด", or a group.
export function filterProducts(
  filter: string,
  query: string,
  products: Product[]
): Product[] {
  const q = query.trim().toLowerCase();
  return products.filter((p) => {
    if (q && !p.name.toLowerCase().includes(q) && !p.code.includes(q))
      return false;
    if (filter === "ทั้งหมด") return true;
    if (filter === "ขายดี") return !!p.best;
    return p.group === filter;
  });
}
