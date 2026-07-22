import type { Metadata } from "next";
import { groupsOf, TAG_LABELS } from "@/lib/products";
import { loadProducts } from "@/lib/products.server";
import CatalogueBrowser from "@/components/CatalogueBrowser";
import CartBar from "@/components/CartBar";

export const metadata: Metadata = {
  title: "สินค้า — ปุ๋ย ยา เคมีเกษตร",
  description:
    "เลือกปุ๋ย ยา เคมีเกษตรสำหรับสวนทุเรียนและผลไม้ จัดเป็นรายการแล้วส่งสั่งซื้อทางไลน์ ไม่แสดงราคา สอบถามราคาในแชทได้",
};

// Server component: product data is rendered into the HTML (SEO-friendly);
// the browser island handles search/filter/cart interactivity.
export default async function CataloguePage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;
  const all = await loadProducts();

  const products =
    tag && TAG_LABELS[tag]
      ? all.filter((p) => p.tags.includes(tag))
      : all;
  const groups = groupsOf(products);
  const campaign = tag && TAG_LABELS[tag] ? TAG_LABELS[tag] : undefined;

  return (
    <>
      <CatalogueBrowser products={products} groups={groups} campaign={campaign} />
      <CartBar />
    </>
  );
}
