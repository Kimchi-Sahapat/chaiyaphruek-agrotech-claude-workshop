import type { Metadata } from "next";
import { groupsOf } from "@/lib/products";
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
export default async function CataloguePage() {
  const products = await loadProducts();
  const groups = groupsOf(products);
  return (
    <>
      <CatalogueBrowser products={products} groups={groups} />
      <CartBar />
    </>
  );
}
