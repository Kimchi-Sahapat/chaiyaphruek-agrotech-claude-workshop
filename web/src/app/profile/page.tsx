import type { Metadata } from "next";
import Link from "next/link";
import { SHOP } from "@/lib/shop";
import {
  CAMPAIGN_NAME,
  CAMPAIGN_PERIOD,
  FAMILY_MEMBERS,
  SUMMARY,
  ACTIVITIES,
  FLASH_SALES,
  PRIVILEGES,
  baht,
  summaryPct,
  activityProgress,
} from "@/content/loyalty";

export const metadata: Metadata = {
  title: "โปรไฟล์ / สะสมยอด",
  description:
    "โปรไฟล์สมาชิกชัยพฤกษ์ อโกรเทค — แคมเปญสะสมปั๊บ รับเลย สะสมยอดรับของรางวัลและส่วนลด",
};

function ProgressBar({ pct }: { pct: number }) {
  return (
    <div
      className="bar"
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="bar-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}

function BuyBtn({ tag, label }: { tag: string; label: string }) {
  return (
    <Link className="buy-btn" href={`/catalogue?tag=${tag}`}>
      🛒 {label}
    </Link>
  );
}

export default function ProfilePage() {
  return (
    <section className="scr">
      <h1 className="t">👤 โปรไฟล์ / สะสมยอด</h1>

      <div className="mock-note">
        ตัวอย่างหน้าจอ (ยอดเป็นข้อมูลสมมติ) — ระบบสมาชิกจริงเชื่อมกับ CRM กำลังพัฒนา
      </div>

      {/* Top — campaign summary (Family + Sotus combined) */}
      <div className="camp">
        <div className="camp-head">
          <span className="camp-badge">แคมเปญ</span>
          <h2>{CAMPAIGN_NAME}</h2>
        </div>
        <p className="camp-sub">
          สะสมยอดรวม อโกรเทค แฟมิลี + โซตัส ({CAMPAIGN_PERIOD})
        </p>

        <div className="total">
          <span className="total-num">฿{baht(SUMMARY.total)}</span>
          <span className="total-lbl">ยอดสะสมทั้งหมด</span>
        </div>
        <div className="next-line">
          อีก <b>฿{baht(SUMMARY.remaining)}</b> รับ <b>{SUMMARY.nextReward}</b>
        </div>
        <ProgressBar pct={summaryPct()} />

        <BuyBtn tag={SUMMARY.buyTag} label="ซื้อสินค้าที่ร่วมรายการ" />

        <div className="members">
          {FAMILY_MEMBERS.map((m) => (
            <span key={m} className="mchip">
              {m}
            </span>
          ))}
        </div>
      </div>

      {/* Activities */}
      {ACTIVITIES.map((a) => {
        const p = activityProgress(a);
        return (
          <div className="camp" key={a.key}>
            <div className="camp-head">
              <span className={"camp-badge" + (a.key === "sotus" ? " alt" : "")}>
                กิจกรรม
              </span>
              <h2>{a.name}</h2>
            </div>
            <p className="camp-sub">
              {a.note} · ทุกยอดซื้อครบ ฿{baht(a.step)} รับส่วนลด ฿{baht(a.per)}
            </p>

            <div className="total">
              <span className="total-num">฿{baht(a.total)}</span>
              <span className="total-lbl">
                ยอดสะสม · ได้ส่วนลดแล้ว ฿{baht(p.earned)}
              </span>
            </div>
            <div className="next-line">
              ซื้อเพิ่มอีก <b>฿{baht(p.remaining)}</b> รับส่วนลดเพิ่ม{" "}
              <b>฿{baht(a.per)}</b>
            </div>
            <ProgressBar pct={p.pct} />

            <BuyBtn tag={a.tag} label="ซื้อสินค้าที่ร่วมรายการ" />
          </div>
        );
      })}

      {/* Flash Sale — the signature moment */}
      <div className="flash-title">
        <span className="bolt">⚡</span> FLASH SALE
        <span className="flash-sub">ดีลลดแรง เฉพาะสมาชิก</span>
      </div>
      <div className="flash-grid">
        {FLASH_SALES.map((f) => (
          <div className="flash" key={f.product}>
            <div className="flash-burst">
              <span className="fb-off">ลด</span>
              <span className="fb-pct">{f.off}</span>
            </div>
            <div className="flash-info">
              <div className="fs-name">{f.product}</div>
              <div className="fs-cond">{f.condition}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Other privileges */}
      <div className="camp-sec plain">✨ สิทธิพิเศษสมาชิก</div>
      {PRIVILEGES.map((pv) => (
        <div className="card priv" key={pv.title}>
          <div className="priv-ic">{pv.icon}</div>
          <div>
            <h3>{pv.title}</h3>
            <p>{pv.detail}</p>
          </div>
        </div>
      ))}

      <a className="bigbtn b-line" href={SHOP.lineAddUrl}>
        💬 เช็คยอด / สมัครสมาชิก ทางไลน์
      </a>
    </section>
  );
}
