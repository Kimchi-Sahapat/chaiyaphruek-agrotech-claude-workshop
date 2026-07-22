import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SHOP } from "@/lib/shop";

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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <body>
        <CartProvider>
          <div className="app">
            <Header />
            <main>{children}</main>
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
