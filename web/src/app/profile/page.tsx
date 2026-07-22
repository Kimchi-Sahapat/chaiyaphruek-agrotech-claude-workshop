import type { Metadata } from "next";
import Link from "next/link";
import { SHOP } from "@/lib/shop";
import {
  FAMILY_MEMBERS,
  FAMILY_TIERS,
  CAMPAIGN_PERIOD,
  SAMPLE_FAMILY_TOTAL,
  SAMPLE_SOTUS_TOTAL,
  SOTUS_STEP,
  PRIVILEGES,
  baht,
  nextTier,
} from "@/content/loyalty";

export const metadata: Metadata = {
  title: "โปรไฟล์ / สะสมยอด",
  description:
    "โปรไฟล์สมาชิกชัยพฤกษ์ อโกรเทค แฟมิลี — สะสมยอดรับของรางวัลและสิทธิพิเศษ",
};

function ProgressBar({ pct }: { pct: number }) {
  return (
    <div className="bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div className="bar-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function ProfilePage() {
  const fam = nextTier(SAMPLE_FAMILY_TOTAL, FAMILY_TIERS);
  const sotusReached = Math.floor(SAMPLE_SOTUS_TOTAL / SOTUS_STEP);
  const sotusPct = Math.round(((SAMPLE_SOTUS_TOTAL % SOTUS_STEP) / SOTUS_STEP) * 100);

  return (
    <section className="scr">
      <h1 className="t">👤 โปรไฟล์ / สะสมยอด</h1>

      <div className="mock-note">
        ตัวอย่างหน้าจอ (ยอดเป็นข้อมูลสมมติ) — ระบบสมาชิกจริงเชื่อมกับ CRM กำลังพัฒนา
      </div>

      {/* Campaign 1 — Agrotech Family */}
      <div className="camp">
        <div className="camp-head">
          <span className="camp-badge">แฟมิลี</span>
          <h2>ชัยพฤกษ์ อโกรเทค แฟมิลี</h2>
        </div>
        <p className="camp-sub">
          สะสมยอดรวมกันได้จาก 10 บริษัทในเครือ ({CAMPAIGN_PERIOD})
        </p>

        <div className="total">
          <span className="total-num">฿{baht(SAMPLE_FAMILY_TOTAL)}</span>
          <span className="total-lbl">ยอดสะสมของคุณ</span>
        </div>

        <div className="next-line">
          {fam.next ? (
            <>
              อีก <b>฿{baht(fam.next.amount - SAMPLE_FAMILY_TOTAL)}</b> รับ{" "}
              <b>{fam.next.reward}</b>
            </>
          ) : (
            <>ครบทุกระดับแล้ว 🎉</>
          )}
        </div>
        <ProgressBar pct={fam.pct} />

        <div className="camp-sec">🎁 กิจกรรมที่ 2 · สะสมปั๊บ รับเลย (ไม่ต้องลุ้น)</div>
        <ul className="tiers">
          {FAMILY_TIERS.map((t) => {
            const reached = SAMPLE_FAMILY_TOTAL >= t.amount;
            return (
              <li key={t.amount} className={reached ? "reached" : ""}>
                <span className="tick">{reached ? "✅" : "⬜"}</span>
                <span className="tamt">฿{baht(t.amount)}</span>
                <span className="trew">{t.reward}</span>
              </li>
            );
          })}
        </ul>

        <div className="camp-sec">💸 กิจกรรมที่ 1 · สะสมยอด รับส่วนลด</div>
        <div className="mini">
          ทุกยอดสะสมครบ <b>฿100,000</b> รับ <b>คูปองส่วนลด 6,000 บาท</b>{" "}
          (ใช้ซื้อสินค้า หรือส่วนลดทัวร์ต่างประเทศ) และได้ <b>1 สิทธิ์</b>{" "}
          ลุ้นเพิ่มมูลค่าคูปองจาก 6,000 เป็น <b>40,000 บาท</b> ในงานแฟมิลีปาร์ตี้
        </div>

        <div className="members">
          {FAMILY_MEMBERS.map((m) => (
            <span key={m} className="mchip">
              {m}
            </span>
          ))}
        </div>
      </div>

      {/* Campaign 2 — Sotus Club */}
      <div className="camp">
        <div className="camp-head">
          <span className="camp-badge alt">โซตัสคลับ</span>
          <h2>โซตัสคลับ</h2>
        </div>
        <p className="camp-sub">สะสมยอดเฉพาะสินค้าโซตัส · ทุก ฿1,000,000 = 1 สิทธิ์ลุ้น</p>

        <div className="total">
          <span className="total-num">฿{baht(SAMPLE_SOTUS_TOTAL)}</span>
          <span className="total-lbl">ยอดสะสมโซตัส · ได้แล้ว {sotusReached} สิทธิ์</span>
        </div>
        <div className="next-line">
          อีก <b>฿{baht(SOTUS_STEP - (SAMPLE_SOTUS_TOTAL % SOTUS_STEP))}</b> รับอีก 1 สิทธิ์ลุ้น{" "}
          <b>Toyota Hilux Champ</b>
        </div>
        <ProgressBar pct={sotusPct} />
      </div>

      {/* Privileges */}
      <div className="camp-sec plain">✨ สิทธิพิเศษสมาชิก</div>
      {PRIVILEGES.map((p) => (
        <div className="card priv" key={p.title}>
          <div className="priv-ic">{p.icon}</div>
          <div>
            <h3>{p.title}</h3>
            <p>{p.detail}</p>
          </div>
        </div>
      ))}

      <a className="bigbtn b-line" href={SHOP.lineAddUrl}>
        💬 เช็คยอด / สมัครสมาชิก ทางไลน์
      </a>
      <Link className="bigbtn b-green" href="/catalogue">
        🛒 เลือกสินค้า / สั่งของ
      </Link>
    </section>
  );
}
