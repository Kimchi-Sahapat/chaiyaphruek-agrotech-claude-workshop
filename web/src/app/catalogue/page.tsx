import type { Metadata } from "next";
import { getAllProducts, getGroups } from "@/lib/products";
import CatalogueBrowser from "@/components/CatalogueBrowser";
import CartBar from "@/components/CartBar";

export const metadata: Metadata = {
  title: "สินค้า — ปุ๋ย ยา เคมีเกษตร",
  description:
    "เลือกปุ๋ย ยา เคมีเกษตรสำหรับสวนทุเรียนและผลไม้ จัดเป็นรายการแล้วส่งสั่งซื้อทางไลน์ ไม่แสดงราคา สอบถามราคาในแชทได้",
};

// Server component: product data is rendered into the HTML (SEO-friendly);
// the browser island handles search/filter/cart interactivity.
export default function CataloguePage() {
  const products = getAllProducts();
  const groups = getGroups();
  return (
    <>
      <CatalogueBrowser products={products} groups={groups} />
      <CartBar />
    </>
  );
}
