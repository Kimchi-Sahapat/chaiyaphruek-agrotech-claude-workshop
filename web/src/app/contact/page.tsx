import type { Metadata } from "next";
import { SHOP } from "@/lib/shop";

export const metadata: Metadata = {
  title: "เกี่ยวกับเรา · ติดต่อร้าน",
  description:
    "ชัยพฤกษ์ อโกรเทค สาขาขลุง จันทบุรี ร้านปุ๋ยยาที่อยู่กับชาวสวนมากว่า 50 ปี ที่อยู่ เบอร์โทร เวลาเปิด และไลน์ร้าน",
};

export default function ContactPage() {
  return (
    <section className="scr">
      <h1 className="t">เกี่ยวกับเรา · ติดต่อร้าน</h1>

      <div className="card prose">
        <p>
          <b>{SHOP.name} {SHOP.branch}</b> คือ Flagship ของเครือชัยพฤกษ์เกษตรจันทบุรี
          ร้านปุ๋ย ยา และเคมีเกษตรที่อยู่เคียงข้างชาวสวนจันทบุรีตั้งแต่ปี <b>2515</b> — กว่า 50 ปี
        </p>
        <p>
          จุดต่างของเราคือ <b>เจ้าของมีสวนจริง</b> คำแนะนำจึงมาจากประสบการณ์ในสวน ไม่ใช่แค่ข้อมูลบนฉลาก
          ไม่รู้ชื่อสินค้าก็ถามได้ แค่บอกว่าปลูกอะไร ต้นระยะไหน เจอปัญหาแบบใด
        </p>
      </div>

      <div className="card">
        <h3>📍 ที่ตั้ง</h3>
        <p>{SHOP.address}</p>
        <p>
          <a href={SHOP.maps} target="_blank" rel="noopener noreferrer" style={{ color: "var(--navy)", fontWeight: 700 }}>
            เปิดแผนที่ Google Maps →
          </a>
        </p>
        <h3 style={{ marginTop: 14 }}>🕔 เวลาทำการ</h3>
        <p>{SHOP.hours}</p>
      </div>

      <a className="bigbtn b-call" href={`tel:${SHOP.tel}`}>
        📞 โทรหาร้าน {SHOP.telDisplay}
      </a>
      <a className="bigbtn b-line" href={SHOP.lineAddUrl}>
        💬 แชทไลน์ {SHOP.lineId}
      </a>
    </section>
  );
}
