import type { Metadata } from "next";
import Link from "next/link";
import { SHOP } from "@/lib/shop";

export const metadata: Metadata = {
  title: "โปรไฟล์ / สะสมแต้ม",
  description:
    "โปรไฟล์สมาชิกชัยพฤกษ์ อโกรเทค — แต้มสะสม ยอดสะสม และของรางวัล (กำลังพัฒนา)",
};

export default function ProfilePage() {
  return (
    <section className="scr">
      <h1 className="t">👤 โปรไฟล์ / สะสมแต้ม</h1>

      <div className="card">
        <div className="pf-stats">
          <div className="pf-stat">
            <div className="pf-num">—</div>
            <div className="pf-lbl">แต้มสะสม</div>
          </div>
          <div className="pf-stat">
            <div className="pf-num">—</div>
            <div className="pf-lbl">ยอดสะสม</div>
          </div>
        </div>
        <p className="pf-soon">🎁 ระบบสมาชิกกำลังพัฒนา — เร็วๆ นี้</p>
      </div>

      <div className="card prose">
        <p>
          เร็วๆ นี้ ลูกค้าประจำจะ<b>สะสมแต้มจากยอดซื้อ</b> แล้วนำไปแลก
          <b>ส่วนลดและของแถม</b>ได้ โดยเข้าดูโปรไฟล์ผ่านไลน์ได้เลย ไม่ต้องจำรหัสผ่าน
        </p>
        <p>
          ระหว่างนี้ ถ้าต้องการ<b>เช็คยอด/ประวัติการสั่งซื้อ</b> ทักแชทไลน์ร้านได้เลยครับ
          ทีมงานช่วยดูให้
        </p>
      </div>

      <a className="bigbtn b-line" href={SHOP.lineAddUrl}>
        💬 เช็คยอด / คุยกับแอดมิน ทางไลน์
      </a>
      <Link className="bigbtn b-green" href="/catalogue">
        🛒 เลือกสินค้า / สั่งของ
      </Link>
    </section>
  );
}
