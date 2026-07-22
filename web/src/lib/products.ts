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
};

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

const ALL: Product[] = (productsData.products as RawProduct[]).map((p) => {
  const { name, group } = catInfo(p.cat);
  return {
    ...p,
    unitFull: units[p.unit] ?? p.unit,
    catName: name,
    group,
  };
});

export function getAllProducts(): Product[] {
  return ALL;
}

export function getByCode(code: string): Product | undefined {
  return ALL.find((p) => p.code === code);
}

export function getGroups(): string[] {
  const seen: string[] = [];
  for (const p of ALL) if (!seen.includes(p.group)) seen.push(p.group);
  return seen;
}

export function getBestsellers(): Product[] {
  return ALL.filter((p) => p.best);
}

// Filter used by the catalogue browser. `filter` is "ขายดี", "ทั้งหมด", or a group name.
export function filterProducts(
  filter: string,
  query: string,
  products: Product[] = ALL
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
