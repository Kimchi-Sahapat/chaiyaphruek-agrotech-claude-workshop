import Link from "next/link";
import { SHOP } from "@/lib/shop";

export default function Home() {
  return (
    <section className="scr">
      <h1 className="hello">สวัสดีครับ 🌿</h1>
      <p className="hello2">เลือกสินค้า สั่งของ หรือปรึกษาเรื่องสวนกับเราได้เลย</p>

      <div className="tiles">
        <Link className="tile t-shop" href="/catalogue">
          <span className="ic">🛒</span>ดูสินค้า / สั่งของ
        </Link>
        <Link className="tile t-learn" href="/contact">
          <span className="ic">📖</span>อ่านความรู้
        </Link>
        <a className="tile t-call" href={`tel:${SHOP.tel}`}>
          <span className="ic">📞</span>โทรหาเรา
        </a>
        <a className="tile t-line" href={SHOP.lineAddUrl}>
          <span className="ic">💬</span>แชทไลน์ {SHOP.lineId}
        </a>
      </div>

      <Link className="trust" href="/contact">
        อยู่กับชาวสวนจันทบุรีตั้งแต่ปี <b>2515</b> · เจ้าของมีสวนจริง — แนะนำได้จากประสบการณ์ในสวน
      </Link>
    </section>
  );
}
