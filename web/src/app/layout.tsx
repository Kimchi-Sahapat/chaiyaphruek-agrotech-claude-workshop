import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import { ProductsProvider } from "@/components/ProductsContext";
import PromoBanner from "@/components/PromoBanner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SHOP } from "@/lib/shop";
import { loadProducts } from "@/lib/products.server";

export const metadata: Metadata = {
  title: {
    default: `${SHOP.name} ${SHOP.branch} — ร้านปุ๋ยยา เคมีเกษตร ขลุง จันทบุรี`,
    template: `%s · ${SHOP.name}`,
  },
  description:
    "แหล่งรวมปุ๋ย ยา เคมีเกษตร ดูแลสวนทุเรียนและผลไม้ อ.ขลุง จ.จันทบุรี เลือกสินค้าแล้วส่งรายการสั่งซื้อทางไลน์ ปรึกษาฟรีกับร้านที่อยู่กับชาวสวนมากว่า 50 ปี",
  openGraph: {
    title: `${SHOP.name} ${SHOP.branch}`,
    description:
      "เลือกปุ๋ย ยา เคมีเกษตร แล้วส่งรายการสั่งซื้อทางไลน์ · ปรึกษาการดูแลสวนได้จริง",
    locale: "th_TH",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const products = await loadProducts();
  return (
    <html lang="th">
      <body>
        <CartProvider>
          <ProductsProvider products={products}>
            <div className="app">
              <Header />
              <PromoBanner />
              <main>{children}</main>
              <Footer />
            </div>
          </ProductsProvider>
        </CartProvider>
      </body>
    </html>
  );
}
